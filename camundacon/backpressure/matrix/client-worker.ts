#!/usr/bin/env tsx
/**
 * Matrix Benchmark — Client Worker (subprocess)
 *
 * Standalone worker spawned as a child process by multi-client.ts.
 * Implements a barrier protocol for synchronized start:
 *   1. Initialize SDK client + deploy awareness
 *   2. Write ready sentinel to READY_DIR/<CLIENT_ID>
 *   3. Poll for GO_FILE (10ms busy-poll)
 *   4. Run workload for DURATION_S seconds
 *   5. Write JSON results to RESULTS_DIR/<CLIENT_ID>.json and exit
 *
 * Environment variables (set by orchestrator):
 *   CLIENT_ID             — unique worker identifier
 *   SDK_MODE              — rest-disabled | rest-balanced
 *   HANDLER_TYPE          — cpu | http
 *   HANDLER_LATENCY_MS    — simulated handler latency in ms (default: 0 for cpu, 200 for http)
 *   TARGET_PER_CLIENT     — number of process instances to create and complete
 *   CLIENT_CONCURRENCY    — max inflight createProcessInstance calls
 *   ACTIVATE_BATCH        — maxJobsToActivate per poll (default 32)
 *   PROCESS_DEF_KEY       — process definition key (from deployment)
 *   READY_DIR             — directory to write ready sentinel
 *   GO_FILE               — file to poll for synchronized start
 *   RESULTS_DIR           — directory to write result JSON
 *   PAYLOAD_SIZE_KB       — size of variable payload (default 10)
 *   SCENARIO_TIMEOUT_S    — hard timeout (default 300)
 */

import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

// ─── Config ──────────────────────────────────────────────
const SUPPORTED_MODES = ['rest-disabled', 'rest-balanced'];
const CLIENT_ID = process.env.CLIENT_ID || 'worker-0';
const SDK_MODE = process.env.SDK_MODE || 'rest-balanced';
if (!SUPPORTED_MODES.includes(SDK_MODE)) {
  console.error(
    `[${CLIENT_ID}] Error: unsupported SDK_MODE '${SDK_MODE}'. ` +
      `Supported modes: ${SUPPORTED_MODES.join(', ')}`
  );
  process.exit(1);
}
const HANDLER_TYPE = process.env.HANDLER_TYPE || 'cpu';
const HANDLER_LATENCY_MS = parseInt(
  process.env.HANDLER_LATENCY_MS || (HANDLER_TYPE === 'http' ? '200' : '0'),
  10
);
const TARGET = parseInt(process.env.TARGET_PER_CLIENT || '20', 10);
const ACTIVATE_BATCH = parseInt(process.env.ACTIVATE_BATCH || '32', 10);
const READY_DIR = process.env.READY_DIR || '';
const GO_FILE = process.env.GO_FILE || '';
const RESULTS_DIR = process.env.RESULTS_DIR || '';
const _PAYLOAD_SIZE_KB = parseInt(process.env.PAYLOAD_SIZE_KB || '10', 10);
const SCENARIO_TIMEOUT_S = parseInt(process.env.SCENARIO_TIMEOUT_S || '300', 10);

// ─── Local HTTP sim server (for http handler type) ───────
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

// ─── Barrier protocol ────────────────────────────────────
function writeReady() {
  if (READY_DIR) {
    fs.mkdirSync(READY_DIR, { recursive: true });
    fs.writeFileSync(path.join(READY_DIR, CLIENT_ID), '1');
  }
}

async function waitForGo(): Promise<void> {
  if (!GO_FILE) return;
  while (!fs.existsSync(GO_FILE)) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

function writeResult(result: Record<string, unknown>) {
  if (RESULTS_DIR) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
    fs.writeFileSync(path.join(RESULTS_DIR, `${CLIENT_ID}.json`), JSON.stringify(result, null, 2));
  }
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

// ─── REST SDK runner (worker-only, no producing) ─────────
async function runRestWorker(): Promise<Record<string, unknown>> {
  const { createCamundaClient } = await import('../../../src/index.js');

  const profile = SDK_MODE === 'rest-disabled' ? 'LEGACY' : 'BALANCED';
  const client = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: profile,
    } as any,
  });

  let httpSimPort = 0;
  if (HANDLER_TYPE === 'http' && HANDLER_LATENCY_MS > 0) {
    httpSimPort = await startHttpSimServer(HANDLER_LATENCY_MS);
  }

  let completed = 0;
  let errors = 0;
  let done = false;

  const t0 = Date.now();
  const deadline = t0 + SCENARIO_TIMEOUT_S * 1000;

  // Job worker only — producer runs in the orchestrator process
  const worker = client.createJobWorker({
    jobType: 'test-job',
    maxParallelJobs: ACTIVATE_BATCH,
    jobTimeoutMs: 30_000,
    pollIntervalMs: 1,
    autoStart: true,
    validateSchemas: false,
    jobHandler: async (job) => {
      if (HANDLER_TYPE === 'cpu' && HANDLER_LATENCY_MS > 0) {
        cpuWork(HANDLER_LATENCY_MS);
      } else if (HANDLER_TYPE === 'http' && httpSimPort > 0) {
        await fetch(`http://127.0.0.1:${httpSimPort}/work`);
      }
      try {
        const receipt = await job.complete({ variables: { done: true } });
        completed++;
        if (completed >= TARGET) done = true;
        return receipt;
      } catch {
        errors++;
        return job.fail({ errorMessage: 'handler failure' });
      }
    },
  });

  // Wait until target reached or timeout
  while (!done && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 50));
  }

  done = true;
  try {
    worker.stop();
  } catch {
    /* ignore */
  }

  const elapsed = (Date.now() - t0) / 1000;
  const bp = client.getBackpressureState();
  if (httpSimServer) httpSimServer.close();

  return {
    clientId: CLIENT_ID,
    sdkMode: SDK_MODE,
    handlerType: HANDLER_TYPE,
    started: 0,
    completed,
    errors,
    queueFullErrors: 0,
    wallClockS: elapsed,
    throughput: elapsed > 0 ? completed / elapsed : 0,
    finalSeverity: bp.severity,
    finalPermitsMax: bp.permitsMax,
    target: TARGET,
  };
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  // Signal ready
  writeReady();

  // Wait for synchronized start
  await waitForGo();

  // Run the REST SDK mode (worker-only — producer is in the orchestrator)
  const result = await runRestWorker();

  // Write results and exit
  writeResult(result);

  // Also print summary to stdout for the orchestrator
  console.log(JSON.stringify(result));
  process.exit(0);
}

main().catch((e) => {
  console.error(`[${CLIENT_ID}] Fatal error:`, e);
  const failResult = {
    clientId: CLIENT_ID,
    sdkMode: SDK_MODE,
    handlerType: HANDLER_TYPE,
    started: 0,
    completed: 0,
    errors: 1,
    queueFullErrors: 0,
    wallClockS: 0,
    throughput: 0,
    finalSeverity: 'error',
    finalPermitsMax: null,
    target: TARGET,
    error: String(e),
  };
  writeResult(failResult);
  console.log(JSON.stringify(failResult));
  process.exit(1);
});
