import chalk from 'chalk';

import { createCamundaClient } from '../../src';
import * as CamundaKeys from '../../src/gen';

/**
 * Multi-Client Distributed Backpressure Scenario
 *
 * Spawns N independent CamundaClient instances (each with its own BackpressureManager),
 * all targeting the same cluster. Each client runs a producer+worker loop, creating
 * process instances and completing jobs.
 *
 * The goal is to observe how distributed, uncoordinated adaptive backpressure converges:
 * - Do the clients reach a stable equilibrium?
 * - Does aggregate throughput improve vs. LEGACY (per-call retry only)?
 * - Does any client starve while others dominate?
 * - How quickly does the system recover when load drops?
 *
 * Phases:
 *   1. Ramp-up    — all clients start simultaneously at full send
 *   2. Steady     — sustained load at target concurrency
 *   3. Spike      — additional clients join mid-run (optional)
 *   4. Cool-down  — spike clients stop, observe recovery
 *
 * Environment variables:
 *   NUM_CLIENTS              — number of independent client instances (default: 3)
 *   SPIKE_CLIENTS            — extra clients added during spike phase (default: 2)
 *   TARGET_PER_CLIENT        — process instances per client to create (default: 500)
 *   CLIENT_CONCURRENCY       — max inflight createProcessInstance per client (default: 50)
 *   ACTIVATE_BATCH           — maxJobsToActivate per poll (default: 5)
 *   SPIKE_DELAY_MS           — ms after start before spike clients join (default: 15000)
 *   SPIKE_TARGET             — target for spike clients (default: 200)
 *   PROFILE                  — backpressure profile for all clients (default: BALANCED)
 *   PAYLOAD_SIZE_KB          — variable payload size in KB (default: 10)
 *   PROGRESS_INTERVAL_MS     — progress report interval (default: 1000)
 *   SCENARIO_TIMEOUT_MS      — hard timeout for entire scenario (default: 300000)
 */

// --- Config ---
const NUM_CLIENTS = parseInt(process.env.NUM_CLIENTS || '3', 10);
const SPIKE_CLIENTS = parseInt(process.env.SPIKE_CLIENTS || '2', 10);
const TARGET_PER_CLIENT = parseInt(process.env.TARGET_PER_CLIENT || '500', 10);
const CLIENT_CONCURRENCY = parseInt(process.env.CLIENT_CONCURRENCY || '50', 10);
const ACTIVATE_BATCH = parseInt(process.env.ACTIVATE_BATCH || '5', 10);
const SPIKE_DELAY_MS = parseInt(process.env.SPIKE_DELAY_MS || '15000', 10);
const SPIKE_TARGET = parseInt(process.env.SPIKE_TARGET || '200', 10);
const PROFILE = process.env.PROFILE || 'BALANCED';
const PAYLOAD_SIZE_KB = parseInt(process.env.PAYLOAD_SIZE_KB || '10', 10);
const PROGRESS_INTERVAL_MS = parseInt(process.env.PROGRESS_INTERVAL_MS || '1000', 10);
const SCENARIO_TIMEOUT_MS = parseInt(process.env.SCENARIO_TIMEOUT_MS || '300000', 10);

// --- Payload ---
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

// --- Per-client metrics ---
interface ClientMetrics {
  id: string;
  profile: string;
  started: number;
  completed: number;
  target: number;
  bpSeverity: string;
  permitsMax: number | null;
  permitsCurrent: number;
  waiters: number;
  errors: number;
  queueFullErrors: number;
  throughput: number; // completions/sec
  startTime: number;
  endTime?: number;
}

// --- Snapshot for time-series ---
interface Snapshot {
  timeMs: number;
  clients: {
    id: string;
    severity: string;
    permitsMax: number | null;
    started: number;
    completed: number;
    waiters: number;
    throughput: number;
  }[];
  aggregateThroughput: number;
}

const snapshots: Snapshot[] = [];

// --- Run a single client ---
async function runClient(
  metrics: ClientMetrics,
  processDefinitionKey: string,
  concurrency: number,
  t0: number,
  abortSignal: AbortSignal
): Promise<ClientMetrics> {
  const client = createCamundaClient({
    config: {
      CAMUNDA_SDK_LOG_LEVEL: 'error',
      CAMUNDA_SDK_BACKPRESSURE_PROFILE: PROFILE,
    } as any,
  });

  const payload = { data: generatePayload(PAYLOAD_SIZE_KB) };
  const inFlight: Promise<void>[] = [];
  let done = false;

  // Producer
  const producer = (async () => {
    while (!done && !abortSignal.aborted) {
      while (!done && metrics.started < metrics.target && inFlight.length < concurrency) {
        const p = client
          .createProcessInstance({
            processDefinitionKey:
              CamundaKeys.ProcessDefinitionKey.assumeExists(processDefinitionKey),
            variables: payload,
          })
          .then(() => {
            metrics.started++;
          })
          .catch((e: any) => {
            metrics.errors++;
            if (e?.code === 'BACKPRESSURE_QUEUE_FULL') {
              metrics.queueFullErrors++;
            }
          })
          .finally(() => {
            const idx = inFlight.indexOf(p);
            if (idx >= 0) inFlight.splice(idx, 1);
          });
        inFlight.push(p);
      }
      if (metrics.completed >= metrics.target) break;
      await new Promise((r) => setTimeout(r, 5));
    }
  })();

  // Worker using job worker API
  const worker = client.createJobWorker({
    jobType: 'test-job',
    maxParallelJobs: ACTIVATE_BATCH,
    jobTimeoutMs: 10_000,
    pollIntervalMs: 1,
    autoStart: true,
    validateSchemas: false,
    jobHandler: async (job) => {
      try {
        const receipt = await job.complete({ variables: { done: true } });
        metrics.completed++;
        return receipt;
      } catch {
        metrics.errors++;
        return job.fail({ errorMessage: 'handler failure' });
      }
    },
  });

  // Wait for completion or abort
  const watcher = (async () => {
    while (!done && !abortSignal.aborted) {
      if (metrics.completed >= metrics.target) {
        done = true;
        break;
      }
      // Update live metrics
      const bp = client.getBackpressureState();
      metrics.bpSeverity = bp.severity;
      metrics.permitsMax = bp.permitsMax;
      metrics.permitsCurrent = bp.permitsCurrent;
      metrics.waiters = bp.waiters;
      const elapsed = (Date.now() - metrics.startTime) / 1000;
      metrics.throughput = elapsed > 0 ? metrics.completed / elapsed : 0;
      await new Promise((r) => setTimeout(r, 50));
    }
  })();

  await Promise.race([
    Promise.all([producer, watcher]),
    new Promise<void>((resolve) => {
      abortSignal.addEventListener('abort', () => resolve(), { once: true });
    }),
  ]);

  done = true;
  try {
    worker.stop();
  } catch {
    /* ignore */
  }
  await Promise.allSettled(inFlight);

  metrics.endTime = Date.now();
  const elapsed = (metrics.endTime - metrics.startTime) / 1000;
  metrics.throughput = elapsed > 0 ? metrics.completed / elapsed : 0;

  // Final state
  const bp = client.getBackpressureState();
  metrics.bpSeverity = bp.severity;
  metrics.permitsMax = bp.permitsMax;

  return metrics;
}

// --- Progress reporter ---
function reportProgress(
  clients: { id: string; metrics: ClientMetrics }[],
  t0: number,
  phase: string
) {
  const now = Date.now();
  const elapsed = ((now - t0) / 1000).toFixed(1);

  const severityColors: Record<string, (s: string) => string> = {
    healthy: chalk.greenBright,
    soft: chalk.yellowBright,
    severe: chalk.redBright,
  };

  console.log(
    `\n${chalk.bold(`[${elapsed}s] Phase: ${phase}`)}  ` +
      `Clients: ${clients.length}  Profile: ${PROFILE}`
  );
  console.log(
    chalk.gray(
      '  ID          | Started | Done    | Thrpt   | Severity | Permits    | Waiters | Errors'
    )
  );
  console.log(chalk.gray('  ' + '-'.repeat(85)));

  let aggThroughput = 0;
  const snapshotClients: Snapshot['clients'] = [];

  for (const { id, metrics: m } of clients) {
    const colorFn = severityColors[m.bpSeverity] || chalk.white;
    const permits = m.permitsMax === null ? 'unlimited' : `${m.permitsCurrent}/${m.permitsMax}`;
    aggThroughput += m.throughput;

    console.log(
      `  ${id.padEnd(12)}| ` +
        `${String(m.started).padEnd(8)}| ` +
        `${String(m.completed).padEnd(8)}| ` +
        `${m.throughput.toFixed(1).padEnd(8)}| ` +
        `${colorFn(m.bpSeverity.padEnd(9))}| ` +
        `${permits.padEnd(11)}| ` +
        `${String(m.waiters).padEnd(8)}| ` +
        `${m.errors}${m.queueFullErrors > 0 ? chalk.red(` (${m.queueFullErrors} queue-full)`) : ''}`
    );

    snapshotClients.push({
      id,
      severity: m.bpSeverity,
      permitsMax: m.permitsMax,
      started: m.started,
      completed: m.completed,
      waiters: m.waiters,
      throughput: m.throughput,
    });
  }

  console.log(chalk.bold(`  Aggregate throughput: ${aggThroughput.toFixed(1)}/s`));

  snapshots.push({
    timeMs: now - t0,
    clients: snapshotClients,
    aggregateThroughput: aggThroughput,
  });
}

// --- Cleanup ---
async function cleanup() {
  const cleaner = createCamundaClient();
  console.log(chalk.gray('[multi-client] Cleaning up instances from previous runs...'));
  try {
    const active = await cleaner.searchProcessInstances(
      {
        filter: { state: 'ACTIVE', processDefinitionId: 'Process_0f7cr6y' },
        page: { limit: 2000 },
      },
      { consistency: { waitUpToMs: 0 } }
    );
    if (active.items.length > 0) {
      console.log(chalk.gray(`[multi-client] Canceling ${active.items.length} processes...`));
      for (const inst of active.items) {
        await cleaner
          .cancelProcessInstance({ processInstanceKey: inst.processInstanceKey })
          .catch(() => {});
      }
    }
  } catch {
    /* ignore */
  }
}

// --- Print summary ---
function printSummary(allMetrics: ClientMetrics[]) {
  console.log('\n' + chalk.bold('═══ Final Summary ═══'));
  console.log(`Profile: ${PROFILE}  Clients: ${allMetrics.length}`);
  console.log('');

  const table = allMetrics.map((m) => ({
    Client: m.id,
    Target: m.target,
    Started: m.started,
    Completed: m.completed,
    'Throughput (ops/s)': m.throughput.toFixed(1),
    'Duration (s)': m.endTime ? ((m.endTime - m.startTime) / 1000).toFixed(1) : 'n/a',
    'Final Severity': m.bpSeverity,
    'Final Permits': m.permitsMax === null ? 'unlimited' : m.permitsMax,
    Errors: m.errors,
    'Queue-Full': m.queueFullErrors,
  }));
  console.table(table);

  // Aggregate stats
  const totalCompleted = allMetrics.reduce((s, m) => s + m.completed, 0);
  const totalErrors = allMetrics.reduce((s, m) => s + m.errors, 0);
  const totalQueueFull = allMetrics.reduce((s, m) => s + m.queueFullErrors, 0);
  const durations = allMetrics
    .filter((m) => m.endTime)
    .map((m) => (m.endTime! - m.startTime) / 1000);
  const maxDuration = Math.max(...durations, 0);
  const aggThroughput = maxDuration > 0 ? totalCompleted / maxDuration : 0;

  console.log(chalk.bold('\nAggregates:'));
  console.log(`  Total completed:       ${totalCompleted}`);
  console.log(`  Total errors:          ${totalErrors}`);
  console.log(`  Total queue-full:      ${totalQueueFull}`);
  console.log(`  Wall-clock duration:   ${maxDuration.toFixed(1)}s`);
  console.log(`  Aggregate throughput:  ${aggThroughput.toFixed(1)} ops/s`);

  // Fairness analysis (Jain's index)
  if (allMetrics.length > 1) {
    const throughputs = allMetrics.map((m) => m.throughput);
    const sumX = throughputs.reduce((a, b) => a + b, 0);
    const sumX2 = throughputs.reduce((a, b) => a + b * b, 0);
    const n = throughputs.length;
    const jain = sumX2 > 0 ? (sumX * sumX) / (n * sumX2) : 1;
    console.log(
      `  Jain's fairness index: ${jain.toFixed(3)} ` +
        `(1.0 = perfectly fair, <0.8 = significant imbalance)`
    );
  }

  // Time-series summary
  if (snapshots.length > 0) {
    console.log(chalk.bold('\nTime-series (aggregate throughput):'));
    const step = Math.max(1, Math.floor(snapshots.length / 20)); // ~20 data points
    for (let i = 0; i < snapshots.length; i += step) {
      const s = snapshots[i];
      const bar = '█'.repeat(Math.round(s.aggregateThroughput / 5));
      const severities = s.clients.map((c) => c.severity[0]).join('');
      console.log(
        `  ${(s.timeMs / 1000).toFixed(0).padStart(4)}s | ${s.aggregateThroughput.toFixed(1).padStart(7)}/s | ${bar} [${severities}]`
      );
    }
  }
}

// --- Main ---
async function main() {
  const bootstrap = createCamundaClient();

  console.log(chalk.bold('\n╔══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold('║   Multi-Client Distributed Backpressure Scenario        ║'));
  console.log(chalk.bold('╚══════════════════════════════════════════════════════════╝'));
  console.log(`  Clients:       ${NUM_CLIENTS} base + ${SPIKE_CLIENTS} spike`);
  console.log(`  Target/client: ${TARGET_PER_CLIENT} (spike: ${SPIKE_TARGET})`);
  console.log(`  Concurrency:   ${CLIENT_CONCURRENCY} per client`);
  console.log(`  Profile:       ${PROFILE}`);
  console.log(`  Payload:       ${PAYLOAD_SIZE_KB}KB per instance`);
  console.log(`  Spike delay:   ${SPIKE_DELAY_MS}ms`);
  console.log('');

  // Deploy process
  console.log(chalk.gray('[multi-client] Deploying test process...'));
  const deployment = await bootstrap.deployResourcesFromFiles([
    './tests-integration/fixtures/test-job-process.bpmn',
  ]);
  const { processDefinitionKey } = deployment.processes[0];
  await bootstrap.getProcessDefinition(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5_000 } }
  );
  console.log(chalk.gray(`[multi-client] Process deployed: ${processDefinitionKey}`));

  const t0 = Date.now();
  const timeout = new AbortController();
  setTimeout(() => timeout.abort(), SCENARIO_TIMEOUT_MS);

  // Phase 1: Start base clients
  console.log(chalk.bold('\n─── Phase 1: Ramp-up ───'));
  const baseAbort = new AbortController();
  const baseClients: { id: string; metrics: ClientMetrics; promise: Promise<ClientMetrics> }[] = [];

  for (let i = 0; i < NUM_CLIENTS; i++) {
    const id = `client-${i + 1}`;
    const metrics: ClientMetrics = {
      id,
      profile: PROFILE,
      started: 0,
      completed: 0,
      target: TARGET_PER_CLIENT,
      bpSeverity: 'healthy',
      permitsMax: null,
      permitsCurrent: 0,
      waiters: 0,
      errors: 0,
      queueFullErrors: 0,
      throughput: 0,
      startTime: Date.now(),
    };
    const promise = runClient(
      metrics,
      processDefinitionKey,
      CLIENT_CONCURRENCY,
      t0,
      baseAbort.signal
    );
    baseClients.push({ id, metrics, promise });
  }

  // Progress reporting loop
  let progressRunning = true;
  const allActiveClients = [...baseClients];
  const spikeClients: typeof baseClients = [];

  const progressLoop = (async () => {
    while (progressRunning && !timeout.signal.aborted) {
      // Update metrics from live clients by reading their latest state
      // (The metrics objects are updated in-place by the watcher inside runClient)
      const phase =
        spikeClients.length > 0
          ? `Spike (${NUM_CLIENTS}+${spikeClients.length} clients)`
          : `Steady (${allActiveClients.length} clients)`;
      reportProgress(
        allActiveClients.map((c) => ({ id: c.id, metrics: c.metrics })),
        t0,
        phase
      );
      await new Promise((r) => setTimeout(r, PROGRESS_INTERVAL_MS));
    }
  })();

  // Phase 2: Wait for spike delay, then add spike clients
  if (SPIKE_CLIENTS > 0 && SPIKE_DELAY_MS > 0) {
    const spikeTimeout = new Promise<void>((r) => setTimeout(r, SPIKE_DELAY_MS));
    await Promise.race([spikeTimeout, Promise.all(baseClients.map((c) => c.promise))]);

    if (!baseClients.every((c) => c.metrics.completed >= c.metrics.target)) {
      console.log(chalk.bold(`\n─── Phase 2: Spike (+${SPIKE_CLIENTS} clients) ───`));
      const spikeAbort = new AbortController();

      for (let i = 0; i < SPIKE_CLIENTS; i++) {
        const id = `spike-${i + 1}`;
        const metrics: ClientMetrics = {
          id,
          profile: PROFILE,
          started: 0,
          completed: 0,
          target: SPIKE_TARGET,
          bpSeverity: 'healthy',
          permitsMax: null,
          permitsCurrent: 0,
          waiters: 0,
          errors: 0,
          queueFullErrors: 0,
          throughput: 0,
          startTime: Date.now(),
        };
        const promise = runClient(
          metrics,
          processDefinitionKey,
          CLIENT_CONCURRENCY,
          t0,
          spikeAbort.signal
        );
        const entry = { id, metrics, promise };
        spikeClients.push(entry);
        allActiveClients.push(entry);
      }

      // Wait for spike clients to finish
      await Promise.allSettled(spikeClients.map((c) => c.promise));
      console.log(chalk.bold('\n─── Phase 3: Cool-down (spike clients done) ───'));
    }
  }

  // Wait for base clients
  const baseResults = await Promise.all(baseClients.map((c) => c.promise));
  const spikeResults = await Promise.all(spikeClients.map((c) => c.promise));

  progressRunning = false;
  await progressLoop.catch(() => {});

  // Collect all results
  const allResults = [...baseResults, ...spikeResults];
  printSummary(allResults);

  process.exit(0);
}

cleanup()
  .then(main)
  .catch((e) => {
    console.error(chalk.red('[multi-client] Fatal error:'), e);
    process.exit(1);
  });
