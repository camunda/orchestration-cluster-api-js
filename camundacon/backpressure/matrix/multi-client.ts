#!/usr/bin/env tsx
/**
 * Matrix Benchmark — Multi-Client Orchestrator
 *
 * Spawns N client instances (either as child processes or concurrent loops
 * in a shared client) and collects results.
 *
 * Two isolation modes:
 *   - independent (subprocess): each client is a separate Node.js process
 *     with its own SDK client and BackpressureManager
 *   - shared: all clients share ONE SDK client (one BackpressureManager)
 *     running as concurrent async loops in the same process
 *
 * Environment variables:
 *   SDK_MODE              — rest-disabled | rest-balanced | grpc-stream
 *   HANDLER_TYPE          — cpu | http
 *   HANDLER_LATENCY_MS    — handler simulation latency (default: 0 for cpu, 200 for http)
 *   NUM_CLIENTS           — number of client instances (default: 25)
 *   ISOLATION             — independent | shared (default: independent)
 *   TARGET_PER_CLIENT     — completions target per client (default: 20)
 *   CLIENT_CONCURRENCY    — max inflight per client (default: 10)
 *   ACTIVATE_BATCH        — maxJobsToActivate per poll (default: 32)
 *   PAYLOAD_SIZE_KB       — variable payload size (default: 10)
 *   SCENARIO_TIMEOUT_S    — hard timeout in seconds (default: 300)
 *   SPIKE_CLIENTS         — extra clients (default: 0)
 */

import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';

// ─── Config ──────────────────────────────────────────────
const SDK_MODE = process.env.SDK_MODE || 'rest-balanced';
const HANDLER_TYPE = process.env.HANDLER_TYPE || 'cpu';
const HANDLER_LATENCY_MS = parseInt(
  process.env.HANDLER_LATENCY_MS || (HANDLER_TYPE === 'http' ? '200' : '0'),
  10
);
const NUM_CLIENTS = parseInt(process.env.NUM_CLIENTS || '25', 10);
const ISOLATION = process.env.ISOLATION || 'independent';
const TARGET_PER_CLIENT = parseInt(process.env.TARGET_PER_CLIENT || '20', 10);
const CONCURRENCY = parseInt(process.env.CLIENT_CONCURRENCY || '10', 10);
const ACTIVATE_BATCH = parseInt(process.env.ACTIVATE_BATCH || '32', 10);
const PAYLOAD_SIZE_KB = parseInt(process.env.PAYLOAD_SIZE_KB || '10', 10);
const SCENARIO_TIMEOUT_S = parseInt(process.env.SCENARIO_TIMEOUT_S || '300', 10);
const PRE_CREATE_COUNT = parseInt(process.env.PRE_CREATE_COUNT || '50000', 10);

// ─── Types ───────────────────────────────────────────────
interface WorkerResult {
  clientId: string;
  sdkMode: string;
  handlerType: string;
  started: number;
  completed: number;
  errors: number;
  queueFullErrors: number;
  wallClockS: number;
  throughput: number;
  finalSeverity: string;
  finalPermitsMax: number | null;
  target: number;
  error?: string;
}

// ─── Payload ─────────────────────────────────────────────
function generatePayload(sizeKb: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const target = sizeKb * 1024;
  let out = '';
  while (out.length < target) {
    let chunk = '';
    for (let i = 0; i < 2048 && out.length + chunk.length < target; i++) {
      chunk += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    out += chunk;
  }
  return out;
}

// ─── CPU-intensive handler simulation ────────────────────
function cpuWork(durationMs: number) {
  if (durationMs <= 0) return;
  const end = Date.now() + durationMs;
  let x = 0;
  while (Date.now() < end) {
    x += Math.sin(x + 1);
  }
}

// ─── Local HTTP sim server ───────────────────────────────
let httpSimServer: http.Server | undefined;
function startHttpSimServer(latencyMs: number): Promise<number> {
  return new Promise((resolve) => {
    httpSimServer = http.createServer((_req, res) => {
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      }, latencyMs);
    });
    httpSimServer.listen(0, '127.0.0.1', () => {
      const addr = httpSimServer!.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      resolve(port);
    });
  });
}

// ─── Deploy process (once) ──────────────────────────────
async function deployProcess(): Promise<string> {
  // Always use REST SDK for deployment
  const { createCamundaClient } = await import('../../../src/index.js');
  const client = createCamundaClient({
    config: { CAMUNDA_SDK_LOG_LEVEL: 'error' } as any,
  });

  const deployment = await client.deployResourcesFromFiles([
    './tests-integration/fixtures/test-job-process.bpmn',
  ]);
  const { processDefinitionKey } = deployment.processes[0];

  // Wait 10 seconds for the deployment to propagate to all brokers in the cluster
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 10000));

  return processDefinitionKey;
}

// ─── Pre-create process instances (BALANCED, before workers start) ─
async function preCreateInstances(
  processDefKey: string
): Promise<{ created: number; errors: number; durationS: number }> {
  if (PRE_CREATE_COUNT <= 0) return { created: 0, errors: 0, durationS: 0 };

  const { createCamundaClient } = await import('../../../src/index.js');
  const CamundaKeys = await import('../../../src/gen/index.js');

  const client = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'BALANCED',
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  let created = 0;
  let errors = 0;
  const inflight: Promise<void>[] = [];
  const PRE_CREATE_CONCURRENCY = 50;
  const t0 = Date.now();

  console.log(
    `[pre-create] Creating ${PRE_CREATE_COUNT} process instances (BALANCED, concurrency=${PRE_CREATE_CONCURRENCY})...`
  );

  while (created + errors < PRE_CREATE_COUNT) {
    while (
      inflight.length < PRE_CREATE_CONCURRENCY &&
      created + errors + inflight.length < PRE_CREATE_COUNT
    ) {
      const p = client
        .createProcessInstance({
          processDefinitionKey: CamundaKeys.ProcessDefinitionKey.assumeExists(processDefKey),
          variables: payload,
        })
        .then(() => {
          created++;
        })
        .catch(() => {
          errors++;
        })
        .finally(() => {
          const idx = inflight.indexOf(p);
          if (idx >= 0) inflight.splice(idx, 1);
        });
      inflight.push(p);
    }
    await new Promise((r) => setTimeout(r, 5));
  }
  await Promise.allSettled(inflight);

  const durationS = (Date.now() - t0) / 1000;
  const rate = durationS > 0 ? created / durationS : 0;
  console.log(
    `[pre-create] Done: ${created} created, ${errors} errors in ${durationS.toFixed(1)}s (${rate.toFixed(0)}/s)`
  );

  return { created, errors, durationS };
}

// ═══════════════════════════════════════════════════════════
// INDEPENDENT mode: each client is a child process
// ═══════════════════════════════════════════════════════════
async function runIndependent(
  processDefKey: string
): Promise<{ results: WorkerResult[]; producerErrors: number; producerQueueFull: number }> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'matrix-bp-'));
  const readyDir = path.join(tmpDir, 'ready');
  const resultsDir = path.join(tmpDir, 'results');
  const goFile = path.join(tmpDir, 'GO');

  fs.mkdirSync(readyDir, { recursive: true });
  fs.mkdirSync(resultsDir, { recursive: true });

  const workerScript = path.join(import.meta.dirname, 'client-worker.ts');
  const children: childProcess.ChildProcess[] = [];

  // Spawn all child processes
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const clientId = `worker-${i}`;
    const env: Record<string, string> = {
      ...(process.env as Record<string, string>),
      CLIENT_ID: clientId,
      SDK_MODE,
      HANDLER_TYPE,
      HANDLER_LATENCY_MS: String(HANDLER_LATENCY_MS),
      TARGET_PER_CLIENT: String(TARGET_PER_CLIENT),
      CLIENT_CONCURRENCY: String(CONCURRENCY),
      ACTIVATE_BATCH: String(ACTIVATE_BATCH),
      PROCESS_DEF_KEY: processDefKey,
      READY_DIR: readyDir,
      GO_FILE: goFile,
      RESULTS_DIR: resultsDir,
      PAYLOAD_SIZE_KB: String(PAYLOAD_SIZE_KB),
      SCENARIO_TIMEOUT_S: String(SCENARIO_TIMEOUT_S),
    };

    const child = childProcess.spawn('tsx', [workerScript], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    // Drain child output — only forward fatal errors to avoid flooding parent stderr
    child.stdout?.on('data', () => {}); // drain
    child.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString().trim();
      if (msg && (msg.includes('Fatal') || msg.includes('ECONNREFUSED'))) {
        process.stderr.write(`  [${clientId}] ${msg}\n`);
      }
    });

    children.push(child);
  }

  // Wait for all workers to be ready
  const readyDeadline = Date.now() + 60_000;
  while (Date.now() < readyDeadline) {
    const readyFiles = fs.readdirSync(readyDir);
    if (readyFiles.length >= NUM_CLIENTS) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  // Signal GO
  fs.writeFileSync(goFile, '1');
  const t0 = Date.now();

  // ── Centralized producer: single client creating all process instances ──
  const { createCamundaClient } = await import('../../../src/index.js');
  const CamundaKeys = await import('../../../src/gen/index.js');

  // Producer uses the scenario's backpressure profile:
  // LEGACY for rest-disabled (no gating — baseline), BALANCED for rest-balanced (adaptive gating)
  const producerProfile = SDK_MODE === 'rest-disabled' ? 'LEGACY' : 'BALANCED';
  const producerClient = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: producerProfile,
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  const totalTarget = NUM_CLIENTS * TARGET_PER_CLIENT;
  let produced = 0;
  let producerErrors = 0;
  let producerQueueFull = 0;
  let producerDone = false;
  const producerInflight: Promise<void>[] = [];
  const producerDeadline = t0 + SCENARIO_TIMEOUT_S * 1000;
  const PRODUCER_CONCURRENCY = 50; // moderate — BALANCED handles rate limiting

  const producerLoop = (async () => {
    while (!producerDone && Date.now() < producerDeadline) {
      while (
        !producerDone &&
        produced < totalTarget &&
        producerInflight.length < PRODUCER_CONCURRENCY
      ) {
        const p = producerClient
          .createProcessInstance({
            processDefinitionKey: CamundaKeys.ProcessDefinitionKey.assumeExists(processDefKey),
            variables: payload,
          })
          .then(() => {
            produced++;
          })
          .catch((e: any) => {
            producerErrors++;
            if (e?.code === 'BACKPRESSURE_QUEUE_FULL') producerQueueFull++;
          })
          .finally(() => {
            const idx = producerInflight.indexOf(p);
            if (idx >= 0) producerInflight.splice(idx, 1);
          });
        producerInflight.push(p);
      }
      if (produced >= totalTarget) break;
      await new Promise((r) => setTimeout(r, 5));
    }
    await Promise.allSettled(producerInflight);
    producerDone = true;
  })();

  // Wait for all children to exit (or timeout)
  const exitPromises = children.map(
    (child) =>
      new Promise<void>((resolve) => {
        child.on('exit', () => resolve());
        child.on('error', () => resolve());
      })
  );

  await Promise.race([
    Promise.all(exitPromises),
    new Promise<void>((resolve) => setTimeout(resolve, (SCENARIO_TIMEOUT_S + 30) * 1000)),
  ]);

  // Stop producer if workers finished before it
  producerDone = true;
  await producerLoop.catch(() => {});

  // Kill any stragglers
  for (const child of children) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }

  const wallClock = (Date.now() - t0) / 1000;
  console.log(
    `[multi-client] Producer: ${produced} created, ${producerErrors} errors (${producerQueueFull} queue-full)`
  );

  // Collect results
  const results: WorkerResult[] = [];
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const clientId = `worker-${i}`;
    const resultFile = path.join(resultsDir, `${clientId}.json`);
    try {
      const data = JSON.parse(fs.readFileSync(resultFile, 'utf-8'));
      results.push(data);
    } catch {
      results.push({
        clientId,
        sdkMode: SDK_MODE,
        handlerType: HANDLER_TYPE,
        started: 0,
        completed: 0,
        errors: 0,
        queueFullErrors: 0,
        wallClockS: wallClock,
        throughput: 0,
        finalSeverity: 'missing',
        finalPermitsMax: null,
        target: TARGET_PER_CLIENT,
        error: 'Result file not found',
      });
    }
  }

  // Cleanup temp dir
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  return { results, producerErrors, producerQueueFull };
}

// ═══════════════════════════════════════════════════════════
// SHARED mode: all clients share one SDK client in-process
// ═══════════════════════════════════════════════════════════
async function runSharedRest(processDefKey: string): Promise<WorkerResult[]> {
  const { createCamundaClient } = await import('../../../src/index.js');
  const CamundaKeys = await import('../../../src/gen/index.js');

  // Producer uses the scenario's backpressure profile:
  // LEGACY for rest-disabled (no gating — baseline), BALANCED for rest-balanced (adaptive gating)
  const producerProfile = SDK_MODE === 'rest-disabled' ? 'LEGACY' : 'BALANCED';
  const producerClient = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: producerProfile,
    } as any,
  });

  // Worker uses the scenario's SDK_MODE profile
  const workerProfile = SDK_MODE === 'rest-disabled' ? 'LEGACY' : 'BALANCED';
  const workerClient = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: workerProfile,
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  let httpSimPort = 0;
  if (HANDLER_TYPE === 'http' && HANDLER_LATENCY_MS > 0) {
    httpSimPort = await startHttpSimServer(HANDLER_LATENCY_MS);
  }

  // Shared metrics per "virtual client"
  const metrics = Array.from({ length: NUM_CLIENTS }, (_, i) => ({
    clientId: `shared-${i}`,
    started: 0,
    completed: 0,
    errors: 0,
    queueFullErrors: 0,
  }));

  let done = false;
  const t0 = Date.now();
  const deadline = t0 + SCENARIO_TIMEOUT_S * 1000;

  // One shared job worker
  const worker = workerClient.createJobWorker({
    jobType: 'test-job',
    maxParallelJobs: ACTIVATE_BATCH,
    jobTimeoutMs: 30_000,
    pollIntervalMs: 1,
    autoStart: true,
    validateSchemas: false,
    jobHandler: async (job) => {
      // Simulate handler work
      if (HANDLER_TYPE === 'cpu' && HANDLER_LATENCY_MS > 0) {
        cpuWork(HANDLER_LATENCY_MS);
      } else if (HANDLER_TYPE === 'http' && httpSimPort > 0) {
        await fetch(`http://127.0.0.1:${httpSimPort}/work`);
      }

      // Round-robin completion assignment
      const minClient = metrics.reduce((a, b) => (a.completed < b.completed ? a : b));
      try {
        const receipt = await job.complete({ variables: { done: true } });
        minClient.completed++;
        return receipt;
      } catch {
        minClient.errors++;
        return job.fail({ errorMessage: 'handler failure' });
      }
    },
  });

  // N concurrent producer loops (one per virtual client)
  const producers = metrics.map(async (m) => {
    const myInflight: Promise<void>[] = [];
    while (!done && Date.now() < deadline) {
      while (!done && m.started < TARGET_PER_CLIENT && myInflight.length < CONCURRENCY) {
        const p = producerClient
          .createProcessInstance({
            processDefinitionKey: CamundaKeys.ProcessDefinitionKey.assumeExists(processDefKey),
            variables: payload,
          })
          .then(() => {
            m.started++;
          })
          .catch((e: any) => {
            m.errors++;
            if (e?.code === 'BACKPRESSURE_QUEUE_FULL') m.queueFullErrors++;
          })
          .finally(() => {
            const idx = myInflight.indexOf(p);
            if (idx >= 0) myInflight.splice(idx, 1);
          });
        myInflight.push(p);
      }
      await new Promise((r) => setTimeout(r, 5));
    }
    await Promise.allSettled(myInflight);
  });

  // Watcher: check all virtual clients completed
  const watcher = (async () => {
    while (!done && Date.now() < deadline) {
      const allDone = metrics.every((m) => m.completed >= TARGET_PER_CLIENT);
      if (allDone) {
        done = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  })();

  await Promise.race([
    Promise.all([...producers, watcher]),
    new Promise<void>((resolve) => setTimeout(resolve, SCENARIO_TIMEOUT_S * 1000)),
  ]);

  done = true;
  try {
    worker.stop();
  } catch {
    /* ignore */
  }

  const elapsed = (Date.now() - t0) / 1000;
  const bp = producerClient.getBackpressureState();
  if (httpSimServer) httpSimServer.close();

  return metrics.map((m) => ({
    clientId: m.clientId,
    sdkMode: SDK_MODE,
    handlerType: HANDLER_TYPE,
    started: m.started,
    completed: m.completed,
    errors: m.errors,
    queueFullErrors: m.queueFullErrors,
    wallClockS: elapsed,
    throughput: elapsed > 0 ? m.completed / elapsed : 0,
    finalSeverity: bp.severity,
    finalPermitsMax: bp.permitsMax,
    target: TARGET_PER_CLIENT,
  }));
}

async function runSharedGrpc(processDefKey: string): Promise<WorkerResult[]> {
  const { Camunda8 } = await import('@camunda8/sdk');
  const { createCamundaClient } = await import('../../../src/index.js');
  const CamundaKeys = await import('../../../src/gen/index.js');

  // gRPC client — only used for the streaming worker
  const c8 = new Camunda8({
    ZEEBE_GRPC_ADDRESS: 'localhost:26500',
    ZEEBE_REST_ADDRESS: 'http://localhost:8080',
    CAMUNDA_OAUTH_DISABLED: true,
    CAMUNDA_SECURE_CONNECTION: false,
  } as any);

  const zeebe = c8.getZeebeGrpcApiClient();

  // REST producer in BALANCED mode — same as all other scenarios
  // BALANCED producer — rate-limited, doesn't compete with workers for broker capacity
  const producerClient = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'BALANCED',
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  let httpSimPort = 0;
  if (HANDLER_TYPE === 'http' && HANDLER_LATENCY_MS > 0) {
    httpSimPort = await startHttpSimServer(HANDLER_LATENCY_MS);
  }

  const metrics = Array.from({ length: NUM_CLIENTS }, (_, i) => ({
    clientId: `shared-${i}`,
    started: 0,
    completed: 0,
    errors: 0,
    queueFullErrors: 0,
  }));

  let done = false;
  const t0 = Date.now();
  const deadline = t0 + SCENARIO_TIMEOUT_S * 1000;

  // Shared gRPC worker (streaming)
  const worker = zeebe.streamJobs({
    type: 'test-job',
    taskHandler: async (job) => {
      if (HANDLER_TYPE === 'cpu' && HANDLER_LATENCY_MS > 0) {
        cpuWork(HANDLER_LATENCY_MS);
      } else if (HANDLER_TYPE === 'http' && httpSimPort > 0) {
        await fetch(`http://127.0.0.1:${httpSimPort}/work`);
      }
      // Round-robin
      const minClient = metrics.reduce((a, b) => (a.completed < b.completed ? a : b));
      minClient.completed++;
      return job.complete({});
    },
    pollMaxJobsToActivate: ACTIVATE_BATCH,
    timeout: 30_000,
    tenantIds: ['<default>'],
    worker: 'test-worker',
  });

  // N concurrent producer loops via REST BALANCED client
  const producers = metrics.map(async (m) => {
    const myInflight: Promise<void>[] = [];
    while (!done && Date.now() < deadline) {
      while (!done && m.started < TARGET_PER_CLIENT && myInflight.length < CONCURRENCY) {
        const p = producerClient
          .createProcessInstance({
            processDefinitionKey: CamundaKeys.ProcessDefinitionKey.assumeExists(processDefKey),
            variables: payload,
          })
          .then(() => {
            m.started++;
          })
          .catch((e: any) => {
            m.errors++;
            if (e?.code === 'BACKPRESSURE_QUEUE_FULL') m.queueFullErrors++;
          })
          .finally(() => {
            const idx = myInflight.indexOf(p);
            if (idx >= 0) myInflight.splice(idx, 1);
          });
        myInflight.push(p);
      }
      await new Promise((r) => setTimeout(r, 5));
    }
    await Promise.allSettled(myInflight);
  });

  const watcher = (async () => {
    while (!done && Date.now() < deadline) {
      const allDone = metrics.every((m) => m.completed >= TARGET_PER_CLIENT);
      if (allDone) {
        done = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  })();

  await Promise.race([
    Promise.all([...producers, watcher]),
    new Promise<void>((resolve) => setTimeout(resolve, SCENARIO_TIMEOUT_S * 1000)),
  ]);

  done = true;
  try {
    await worker.close();
  } catch {
    /* ignore */
  }
  try {
    await zeebe.close();
  } catch {
    /* ignore */
  }

  const elapsed = (Date.now() - t0) / 1000;
  const bp = producerClient.getBackpressureState();
  if (httpSimServer) httpSimServer.close();

  return metrics.map((m) => ({
    clientId: m.clientId,
    sdkMode: SDK_MODE,
    handlerType: HANDLER_TYPE,
    started: m.started,
    completed: m.completed,
    errors: m.errors,
    queueFullErrors: m.queueFullErrors,
    wallClockS: elapsed,
    throughput: elapsed > 0 ? m.completed / elapsed : 0,
    finalSeverity: bp.severity,
    finalPermitsMax: bp.permitsMax,
    target: TARGET_PER_CLIENT,
  }));
}

async function runSharedGrpcPoll(processDefKey: string): Promise<WorkerResult[]> {
  const { Camunda8 } = await import('@camunda8/sdk');
  const { createCamundaClient } = await import('../../../src/index.js');
  const CamundaKeys = await import('../../../src/gen/index.js');

  // gRPC client — used for the polling worker
  const c8 = new Camunda8({
    ZEEBE_GRPC_ADDRESS: 'localhost:26500',
    ZEEBE_REST_ADDRESS: 'http://localhost:8080',
    CAMUNDA_OAUTH_DISABLED: true,
    CAMUNDA_SECURE_CONNECTION: false,
  } as any);

  const zeebe = c8.getZeebeGrpcApiClient();

  // REST producer in BALANCED mode
  const producerClient = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'BALANCED',
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  let httpSimPort = 0;
  if (HANDLER_TYPE === 'http' && HANDLER_LATENCY_MS > 0) {
    httpSimPort = await startHttpSimServer(HANDLER_LATENCY_MS);
  }

  const metrics = Array.from({ length: NUM_CLIENTS }, (_, i) => ({
    clientId: `shared-${i}`,
    started: 0,
    completed: 0,
    errors: 0,
    queueFullErrors: 0,
  }));

  let done = false;
  const t0 = Date.now();
  const deadline = t0 + SCENARIO_TIMEOUT_S * 1000;

  // Shared gRPC worker (polling — ActivateJobs RPC)
  const _worker = zeebe.createWorker({
    taskType: 'test-job',
    taskHandler: async (job) => {
      if (HANDLER_TYPE === 'cpu' && HANDLER_LATENCY_MS > 0) {
        cpuWork(HANDLER_LATENCY_MS);
      } else if (HANDLER_TYPE === 'http' && httpSimPort > 0) {
        await fetch(`http://127.0.0.1:${httpSimPort}/work`);
      }
      // Round-robin
      const minClient = metrics.reduce((a, b) => (a.completed < b.completed ? a : b));
      minClient.completed++;
      return job.complete({});
    },
    maxJobsToActivate: ACTIVATE_BATCH,
    timeout: 30_000,
    pollInterval: 100,
  });

  // N concurrent producer loops via REST BALANCED client
  const producers = metrics.map(async (m) => {
    const myInflight: Promise<void>[] = [];
    while (!done && Date.now() < deadline) {
      while (!done && m.started < TARGET_PER_CLIENT && myInflight.length < CONCURRENCY) {
        const p = producerClient
          .createProcessInstance({
            processDefinitionKey: CamundaKeys.ProcessDefinitionKey.assumeExists(processDefKey),
            variables: payload,
          })
          .then(() => {
            m.started++;
          })
          .catch((e: any) => {
            m.errors++;
            if (e?.code === 'BACKPRESSURE_QUEUE_FULL') m.queueFullErrors++;
          })
          .finally(() => {
            const idx = myInflight.indexOf(p);
            if (idx >= 0) myInflight.splice(idx, 1);
          });
        myInflight.push(p);
      }
      await new Promise((r) => setTimeout(r, 5));
    }
    await Promise.allSettled(myInflight);
  });

  const watcher = (async () => {
    while (!done && Date.now() < deadline) {
      const allDone = metrics.every((m) => m.completed >= TARGET_PER_CLIENT);
      if (allDone) {
        done = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  })();

  await Promise.race([
    Promise.all([...producers, watcher]),
    new Promise<void>((resolve) => setTimeout(resolve, SCENARIO_TIMEOUT_S * 1000)),
  ]);

  done = true;
  try {
    await zeebe.close();
  } catch {
    /* ignore */
  }

  const elapsed = (Date.now() - t0) / 1000;
  const bp = producerClient.getBackpressureState();
  if (httpSimServer) httpSimServer.close();

  return metrics.map((m) => ({
    clientId: m.clientId,
    sdkMode: SDK_MODE,
    handlerType: HANDLER_TYPE,
    started: m.started,
    completed: m.completed,
    errors: m.errors,
    queueFullErrors: m.queueFullErrors,
    wallClockS: elapsed,
    throughput: elapsed > 0 ? m.completed / elapsed : 0,
    finalSeverity: bp.severity,
    finalPermitsMax: bp.permitsMax,
    target: TARGET_PER_CLIENT,
  }));
}

// ─── Jain's fairness index ───────────────────────────────
function jainFairness(values: number[]): number {
  if (values.length <= 1) return 1;
  const sum = values.reduce((a, b) => a + b, 0);
  const sumSq = values.reduce((a, b) => a + b * b, 0);
  return sumSq > 0 ? (sum * sum) / (values.length * sumSq) : 1;
}

// ─── Print aggregates (stdout for matrix runner parsing) ─
function printAggregates(results: WorkerResult[], producerErrors = 0, producerQueueFull = 0) {
  const totalCompleted = results.reduce((s, r) => s + r.completed, 0);
  const workerErrors = results.reduce((s, r) => s + r.errors, 0);
  const workerQueueFull = results.reduce((s, r) => s + r.queueFullErrors, 0);
  const totalErrors = workerErrors + producerErrors;
  const totalQueueFull = workerQueueFull + producerQueueFull;
  const maxWall = Math.max(...results.map((r) => r.wallClockS));
  const aggThroughput = maxWall > 0 ? totalCompleted / maxWall : 0;
  const throughputs = results.map((r) => r.throughput);
  const fairness = jainFairness(throughputs);

  console.log('');
  console.log('═══ Final Summary ═══');
  console.log(`  SDK Mode:              ${SDK_MODE}`);
  console.log(`  Handler:               ${HANDLER_TYPE}`);
  console.log(`  Clients:               ${NUM_CLIENTS}`);
  console.log(`  Isolation:             ${ISOLATION}`);
  console.log(`  Total completed:       ${totalCompleted}`);
  console.log(`  Total errors:          ${totalErrors}`);
  console.log(`  Total queue-full:      ${totalQueueFull}`);
  console.log(`  Wall-clock duration:   ${maxWall.toFixed(1)}s`);
  console.log(`  Aggregate throughput:  ${aggThroughput.toFixed(1)} ops/s`);
  console.log(`  Jain's fairness index: ${fairness.toFixed(3)}`);
}

// ─── Main ────────────────────────────────────────────────
async function main() {
  console.log(
    `[multi-client] SDK=${SDK_MODE} handler=${HANDLER_TYPE} clients=${NUM_CLIENTS} isolation=${ISOLATION}`
  );
  console.log(
    `[multi-client] target=${TARGET_PER_CLIENT}/client concurrency=${CONCURRENCY} batch=${ACTIVATE_BATCH}`
  );
  console.log(`[multi-client] pre-create=${PRE_CREATE_COUNT}`);

  // Deploy process
  console.log('[multi-client] Deploying test process...');
  const processDefKey = await deployProcess();
  console.log(`[multi-client] Process deployed: ${processDefKey}`);

  // Pre-create process instances so workers have a backlog from the start
  const preCreate = await preCreateInstances(processDefKey);
  console.log(`[multi-client] Pre-creation complete: ${preCreate.created} instances ready`);

  let results: WorkerResult[];
  let producerErrors = 0;
  let producerQueueFull = 0;

  if (ISOLATION === 'independent') {
    const indie = await runIndependent(processDefKey);
    results = indie.results;
    producerErrors = indie.producerErrors;
    producerQueueFull = indie.producerQueueFull;
  } else {
    // shared mode
    if (SDK_MODE === 'grpc-stream') {
      results = await runSharedGrpc(processDefKey);
    } else if (SDK_MODE === 'grpc-poll') {
      results = await runSharedGrpcPoll(processDefKey);
    } else {
      results = await runSharedRest(processDefKey);
    }
  }

  printAggregates(results, producerErrors, producerQueueFull);

  // Flush stdout before exiting (piped stdout is async in Node.js)
  await new Promise<void>((resolve) => process.stdout.write('', resolve));
  process.exit(0);
}

main().catch((e) => {
  console.error('[multi-client] Fatal error:', e);
  process.exit(1);
});
