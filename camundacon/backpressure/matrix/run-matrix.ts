#!/usr/bin/env tsx
/**
 * Matrix Benchmark Runner
 *
 * Runs the full multi-client backpressure exploration matrix and produces
 * a comprehensive report with analysis.
 *
 * Between each run the Camunda container is stopped and restarted to ensure
 * every configuration gets an identical clean baseline.
 *
 * Matrix dimensions
 * ─────────────────
 *   CLUSTER:      1broker (single broker), 3broker (3-broker cluster)
 *   SDK_MODE:     rest-disabled, rest-balanced, grpc-stream, grpc-poll
 *   HANDLER_TYPE: cpu (no-op handler), http (200ms simulated HTTP call)
 *   NUM_CLIENTS:  5, 10
 *   ISOLATION:    independent (child processes), shared (one client, N loops)
 *
 * Total: 2 × 4 × 2 × 2 × 2 = 64 configurations
 *
 * Usage
 * ─────
 *   # Full matrix
 *   tsx camundacon/backpressure/matrix/run-matrix.ts
 *
 *   # Subset: only 5 clients
 *   tsx camundacon/backpressure/matrix/run-matrix.ts --clients 5
 *
 *   # Subset: only rest modes
 *   tsx camundacon/backpressure/matrix/run-matrix.ts --modes rest-disabled rest-balanced
 *
 *   # Quick smoke test (2 configs, no restart)
 *   tsx camundacon/backpressure/matrix/run-matrix.ts --modes rest-balanced --handlers cpu --clients 5 --isolations shared --no-restart
 *
 *   # Preview without executing
 *   tsx camundacon/backpressure/matrix/run-matrix.ts --dry-run
 */

import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ─── Paths ───────────────────────────────────────────────
const SCRIPT_DIR = import.meta.dirname;
const REPO_ROOT = path.resolve(SCRIPT_DIR, '../../..');
const COMPOSE_1BROKER = path.join(REPO_ROOT, 'docker', 'docker-compose.cluster.yaml');
const COMPOSE_3BROKER = path.join(REPO_ROOT, 'docker', 'docker-compose.3broker.yaml');
const MULTI_CLIENT_SCRIPT = path.join(SCRIPT_DIR, 'multi-client.ts');
const RESULTS_DIR = path.join(SCRIPT_DIR, 'results');

// ─── Defaults ────────────────────────────────────────────
const DEFAULT_MODES = ['rest-disabled', 'rest-balanced', 'grpc-stream', 'grpc-poll'];
const DEFAULT_HANDLERS = ['cpu', 'http'];
const DEFAULT_CLIENTS = [5, 10];
const DEFAULT_ISOLATIONS = ['independent', 'shared'];
const DEFAULT_CLUSTERS = ['1broker', '3broker'];

const DEFAULT_TARGET_PER_CLIENT = 10_000;
const DEFAULT_CLIENT_CONCURRENCY = 32;
const DEFAULT_ACTIVATE_BATCH = 32;
const DEFAULT_SCENARIO_TIMEOUT = 300; // 5 min per run
const DEFAULT_PAYLOAD_SIZE_KB = 10;
const DEFAULT_PRE_CREATE_COUNT = 50_000;

// ANSI colour stripping
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;
function stripAnsi(text: string): string {
  return text.replace(ANSI_RE, '');
}

// ─── Result type ─────────────────────────────────────────
interface RunResult {
  cluster: string;
  sdkMode: string;
  handlerType: string;
  numClients: number;
  isolation: string;
  targetTotal: number;
  totalCompleted: number;
  totalErrors: number;
  totalQueueFull: number;
  wallClockS: number;
  throughput: number;
  jainFairness: number;
  status: 'pending' | 'ok' | 'timeout' | 'error';
  rawOutputFile: string;
  serverMetrics?: ServerMetricsDelta;
}

function resultLabel(r: RunResult): string {
  const iso = r.isolation === 'independent' ? 'ind' : 'shr';
  return `${r.cluster}-${r.numClients}c-${r.sdkMode}-${r.handlerType}-${iso}`;
}

function errorRate(r: RunResult): number {
  const total = r.totalCompleted + r.totalErrors;
  return total > 0 ? r.totalErrors / total : 0;
}

// ─── Container management ────────────────────────────────
function runCmd(
  cmd: string,
  args: string[],
  timeoutMs = 90_000
): { stdout: string; stderr: string; exitCode: number } {
  try {
    const result = childProcess.spawnSync(cmd, args, {
      timeout: timeoutMs,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.status ?? -1,
    };
  } catch {
    return { stdout: '', stderr: 'spawn failed', exitCode: -1 };
  }
}

function restartContainer(composeFile: string): boolean {
  const MAX_ATTEMPTS = 3;
  const HEALTH_TIMEOUT_MS = 180_000; // 3 minutes per attempt
  const REST_TIMEOUT_MS = 30_000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) {
      process.stdout.write(`  [container] Retry ${attempt}/${MAX_ATTEMPTS}...`);
    }

    process.stdout.write('  [container] Stopping...');
    runCmd('docker', [
      'compose',
      '-f',
      composeFile,
      'down',
      '--timeout',
      '30',
      '--volumes',
      '--remove-orphans',
    ]);
    sleepSync(5000);

    process.stdout.write(' starting...');
    runCmd('docker', ['compose', '-f', composeFile, 'up', '-d']);

    // Phase 1: Poll health endpoint (3 min timeout)
    let healthy = false;
    const healthDeadline = Date.now() + HEALTH_TIMEOUT_MS;
    while (Date.now() < healthDeadline) {
      const r = runCmd('curl', ['-sf', 'http://localhost:9600/actuator/health/status'], 5000);
      if (r.exitCode === 0) {
        healthy = true;
        break;
      }
      process.stdout.write('.');
      sleepSync(3000);
    }

    if (!healthy) {
      console.log(` TIMEOUT (health after ${HEALTH_TIMEOUT_MS / 1000}s)!`);
      continue; // retry — stop and restart brokers
    }

    // Phase 2: Verify REST API
    let restReady = false;
    const restDeadline = Date.now() + REST_TIMEOUT_MS;
    while (Date.now() < restDeadline) {
      const r = runCmd(
        'curl',
        ['-sf', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:8080/v2/topology'],
        5000
      );
      if (r.exitCode === 0) {
        restReady = true;
        break;
      }
      process.stdout.write('.');
      sleepSync(2000);
    }

    if (!restReady) {
      console.log(` TIMEOUT (REST API)!`);
      continue; // retry — stop and restart brokers
    }

    console.log(' ready!');
    sleepSync(3000); // settling time
    return true;
  }

  console.log(`  [container] FAILED after ${MAX_ATTEMPTS} attempts!`);
  return false;
}

function sleepSync(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// ─── Server-side metrics ─────────────────────────────────
// Prometheus counters we track (counters are monotonically increasing)
const PROM_COUNTERS = [
  'zeebe_received_request_count_total',
  'zeebe_dropped_request_count_total',
  'zeebe_deferred_append_count_total',
  'zeebe_broker_jobs_pushed_count_total',
  'zeebe_broker_jobs_push_fail_count_total',
  'zeebe_stream_processor_records_total',
] as const;

// Gauges we snapshot (latest value, not a delta)
const PROM_GAUGES = [
  'zeebe_backpressure_requests_limit',
  'zeebe_backpressure_inflight_requests_count',
] as const;

// Histogram metrics — we extract _count and _sum to compute average latency
const PROM_HISTOGRAMS = [
  'zeebe_job_activation_time_seconds', // time from job creation to activation
  'zeebe_job_life_time_seconds', // time from job creation to completion
  'zeebe_process_instance_execution_time_seconds', // PI end-to-end
] as const;

interface ServerMetricsSnapshot {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histCounts: Record<string, number>;
  histSums: Record<string, number>;
}

interface ServerMetricsDelta {
  receivedRequests: number;
  droppedRequests: number;
  deferredAppends: number;
  jobsPushed: number;
  jobsPushFailed: number;
  recordsProcessed: number;
  backpressureLimit: number;
  backpressureInflight: number;
  // Execution latency (averages in ms, computed from histogram _count/_sum deltas)
  jobActivationAvgMs: number | null; // avg time from job creation → activation
  jobLifetimeAvgMs: number | null; // avg time from job creation → completion
  piExecutionAvgMs: number | null; // avg process instance execution time
  jobActivationCount: number; // number of jobs activated during run
  jobCompletedCount: number; // number of jobs completed during run
  piCompletedCount: number; // number of PIs completed during run
}

function scrapeMetrics(): ServerMetricsSnapshot {
  const r = runCmd('curl', ['-sf', 'http://localhost:9600/actuator/prometheus'], 10_000);
  const snap: ServerMetricsSnapshot = { counters: {}, gauges: {}, histCounts: {}, histSums: {} };
  if (r.exitCode !== 0) return snap;

  for (const line of r.stdout.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    for (const metric of PROM_COUNTERS) {
      if (line.startsWith(metric)) {
        // Sum across all labels (partitions, types, etc.)
        const val = parseFloat(line.split(/\s+/).pop() || '0');
        snap.counters[metric] = (snap.counters[metric] || 0) + val;
      }
    }
    for (const metric of PROM_GAUGES) {
      if (line.startsWith(metric)) {
        const val = parseFloat(line.split(/\s+/).pop() || '0');
        snap.gauges[metric] = Math.max(snap.gauges[metric] || 0, val);
      }
    }
    // Histogram _count and _sum lines
    for (const hist of PROM_HISTOGRAMS) {
      const countPrefix = `${hist}_count`;
      const sumPrefix = `${hist}_sum`;
      if (line.startsWith(countPrefix)) {
        const val = parseFloat(line.split(/\s+/).pop() || '0');
        snap.histCounts[hist] = (snap.histCounts[hist] || 0) + val;
      } else if (line.startsWith(sumPrefix)) {
        const val = parseFloat(line.split(/\s+/).pop() || '0');
        snap.histSums[hist] = (snap.histSums[hist] || 0) + val;
      }
    }
  }
  return snap;
}

function computeMetricsDelta(
  before: ServerMetricsSnapshot,
  after: ServerMetricsSnapshot
): ServerMetricsDelta {
  const d = (key: string) => (after.counters[key] || 0) - (before.counters[key] || 0);
  const hCount = (h: string) => (after.histCounts[h] || 0) - (before.histCounts[h] || 0);
  const hSum = (h: string) => (after.histSums[h] || 0) - (before.histSums[h] || 0);
  const avgMs = (h: string) => {
    const cnt = hCount(h);
    return cnt > 0 ? (hSum(h) / cnt) * 1000 : null; // seconds → ms
  };

  const jobActCount = hCount('zeebe_job_activation_time_seconds');
  const jobLifeCount = hCount('zeebe_job_life_time_seconds');
  const piCount = hCount('zeebe_process_instance_execution_time_seconds');

  return {
    receivedRequests: d('zeebe_received_request_count_total'),
    droppedRequests: d('zeebe_dropped_request_count_total'),
    deferredAppends: d('zeebe_deferred_append_count_total'),
    jobsPushed: d('zeebe_broker_jobs_pushed_count_total'),
    jobsPushFailed: d('zeebe_broker_jobs_push_fail_count_total'),
    recordsProcessed: d('zeebe_stream_processor_records_total'),
    backpressureLimit: after.gauges['zeebe_backpressure_requests_limit'] || 0,
    backpressureInflight: after.gauges['zeebe_backpressure_inflight_requests_count'] || 0,
    jobActivationAvgMs: avgMs('zeebe_job_activation_time_seconds'),
    jobLifetimeAvgMs: avgMs('zeebe_job_life_time_seconds'),
    piExecutionAvgMs: avgMs('zeebe_process_instance_execution_time_seconds'),
    jobActivationCount: jobActCount,
    jobCompletedCount: jobLifeCount,
    piCompletedCount: piCount,
  };
}

// ─── Output parser ───────────────────────────────────────
function parseOutput(raw: string): Partial<RunResult> {
  const text = stripAnsi(raw);
  const result: Partial<RunResult> = {};

  for (const line of text.split('\n')) {
    const stripped = line.trim();
    if (stripped.startsWith('Total completed:')) {
      const m = stripped.match(/(\d+)/);
      if (m) result.totalCompleted = parseInt(m[1], 10);
    } else if (stripped.startsWith('Total errors:')) {
      const m = stripped.match(/(\d+)/);
      if (m) result.totalErrors = parseInt(m[1], 10);
    } else if (stripped.startsWith('Total queue-full:')) {
      const m = stripped.match(/(\d+)/);
      if (m) result.totalQueueFull = parseInt(m[1], 10);
    } else if (stripped.startsWith('Wall-clock duration:')) {
      const m = stripped.match(/([\d.]+)s/);
      if (m) result.wallClockS = parseFloat(m[1]);
    } else if (stripped.startsWith('Aggregate throughput:')) {
      const m = stripped.match(/([\d.]+)/);
      if (m) result.throughput = parseFloat(m[1]);
    } else if (stripped.startsWith("Jain's fairness")) {
      const m = stripped.match(/([\d.]+)/);
      if (m) result.jainFairness = parseFloat(m[1]);
    }
  }

  return result;
}

// ─── Run one scenario ────────────────────────────────────
async function runScenario(
  cluster: string,
  sdkMode: string,
  handlerType: string,
  numClients: number,
  isolation: string,
  targetPerClient: number,
  concurrency: number,
  preCreate: number,
  doRestart: boolean,
  scenarioTimeout: number
): Promise<RunResult> {
  const composeFile = cluster === '3broker' ? COMPOSE_3BROKER : COMPOSE_1BROKER;

  const result: RunResult = {
    cluster,
    sdkMode,
    handlerType,
    numClients,
    isolation,
    targetTotal: numClients * targetPerClient,
    totalCompleted: 0,
    totalErrors: 0,
    totalQueueFull: 0,
    wallClockS: 0,
    throughput: 0,
    jainFairness: 0,
    status: 'pending',
    rawOutputFile: '',
  };

  const label = resultLabel(result);

  console.log(`\n${'='.repeat(65)}`);
  console.log(`  [${label}]  ${numClients} clients × ${targetPerClient} target`);
  console.log(
    `  cluster=${cluster}  sdk=${sdkMode}  handler=${handlerType}  isolation=${isolation}`
  );
  console.log(`${'='.repeat(65)}`);

  // Restart container for clean baseline
  if (doRestart) {
    if (!restartContainer(composeFile)) {
      result.status = 'error';
      console.log(`  [${label}] => CONTAINER FAILED TO START`);
      return result;
    }
  }

  // Build environment
  const env: Record<string, string> = {
    ...(process.env as Record<string, string>),
    SDK_MODE: sdkMode,
    HANDLER_TYPE: handlerType,
    HANDLER_LATENCY_MS: handlerType === 'http' ? '200' : '0',
    NUM_CLIENTS: String(numClients),
    ISOLATION: isolation,
    TARGET_PER_CLIENT: String(targetPerClient),
    CLIENT_CONCURRENCY: String(concurrency),
    ACTIVATE_BATCH: String(DEFAULT_ACTIVATE_BATCH),
    PAYLOAD_SIZE_KB: String(DEFAULT_PAYLOAD_SIZE_KB),
    SCENARIO_TIMEOUT_S: String(scenarioTimeout),
    SPIKE_CLIENTS: '0',
    PRE_CREATE_COUNT: String(preCreate),
  };

  // Run multi-client orchestrator
  const outputFile = path.join(RESULTS_DIR, `${label}.txt`);
  result.rawOutputFile = outputFile;

  // Snapshot server metrics before the run
  const metricsBefore = scrapeMetrics();

  try {
    // Use async spawn with detached process group so we can kill the entire
    // process tree on timeout.  spawnSync can't do this — when it kills the
    // direct child (tsx running multi-client), the grandchild worker processes
    // become orphans that hold pipe FDs open, blocking spawnSync indefinitely.
    const proc = childProcess.spawn('tsx', [MULTI_CLIENT_SCRIPT], {
      env,
      detached: true, // new process group — enables killing entire tree
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    // Timeout budget: scenario + pre-creation estimate + deploy wait + buffer
    // Pre-creation at ~100/s (conservative) = preCreate / 100, plus 10s deploy + 60s buffer
    const preCreateBudgetS = preCreate > 0 ? Math.ceil(preCreate / 100) + 10 : 0;
    const timeoutMs = (scenarioTimeout + preCreateBudgetS + 60) * 1000;
    const { timedOut } = await new Promise<{ timedOut: boolean }>((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        // Kill the entire process group (negative PID)
        try {
          process.kill(-proc.pid!, 'SIGKILL');
        } catch {
          /* already gone */
        }
        resolve({ timedOut: true });
      }, timeoutMs);

      proc.on('exit', () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ timedOut: false });
      });
    });

    // Snapshot server metrics after the run
    const metricsAfter = scrapeMetrics();
    result.serverMetrics = computeMetricsDelta(metricsBefore, metricsAfter);

    // Save raw output
    const output = stdout + '\n' + stderr;
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, output);

    if (timedOut) {
      result.status = 'timeout';
      // Still try to parse partial output — workers may have written results
      const metrics = parseOutput(output);
      result.totalCompleted = metrics.totalCompleted ?? 0;
      result.totalErrors = metrics.totalErrors ?? 0;
      result.wallClockS = metrics.wallClockS ?? 0;
      result.throughput = metrics.throughput ?? 0;
      console.log(
        `  [${label}] => TIMEOUT (${scenarioTimeout}s), partial: ${result.throughput.toFixed(1)}/s, ${result.totalCompleted} completed`
      );
    } else {
      const metrics = parseOutput(output);
      result.totalCompleted = metrics.totalCompleted ?? 0;
      result.totalErrors = metrics.totalErrors ?? 0;
      result.totalQueueFull = metrics.totalQueueFull ?? 0;
      result.wallClockS = metrics.wallClockS ?? 0;
      result.throughput = metrics.throughput ?? 0;
      result.jainFairness = metrics.jainFairness ?? 0;
      result.status = 'ok';

      const metricsTag = result.serverMetrics
        ? `, srv: recv=${result.serverMetrics.receivedRequests}` +
          ` drop=${result.serverMetrics.droppedRequests}` +
          ` pushed=${result.serverMetrics.jobsPushed}` +
          (result.serverMetrics.jobActivationAvgMs != null
            ? ` actAvg=${result.serverMetrics.jobActivationAvgMs.toFixed(0)}ms`
            : '') +
          (result.serverMetrics.jobLifetimeAvgMs != null
            ? ` lifeAvg=${result.serverMetrics.jobLifetimeAvgMs.toFixed(0)}ms`
            : '')
        : '';
      console.log(
        `  [${label}] => ` +
          `${result.throughput.toFixed(1)}/s, ` +
          `${result.totalErrors} errors, ` +
          `${result.wallClockS.toFixed(1)}s, ` +
          `Jain=${result.jainFairness.toFixed(3)}` +
          metricsTag
      );
    }
  } catch (e: any) {
    if (e?.message?.includes('TIMEOUT') || e?.message?.includes('timeout')) {
      result.status = 'timeout';
      console.log(`  [${label}] => TIMEOUT (${scenarioTimeout}s)`);
    } else {
      result.status = 'error';
      console.log(`  [${label}] => ERROR: ${e}`);
    }
  }

  return result;
}

// ─── Report generation ───────────────────────────────────
function generateReport(
  results: RunResult[],
  targetPerClient: number,
  concurrency: number,
  preCreate: number,
  timestamp: string
): string {
  const ok = results.filter((r) => r.status === 'ok');
  const failed = results.filter((r) => r.status !== 'ok');

  const lines: string[] = [];
  const w = (s: string) => lines.push(s);

  w('# JS SDK Backpressure Matrix Report');
  w('');
  w(`Generated: ${timestamp}`);
  w('');
  w('## Parameters');
  w('');
  w(`- **Target per client**: ${targetPerClient}`);
  w(`- **Pre-created instances**: ${preCreate} (BALANCED backpressure, before workers start)`);
  w(`- **Client concurrency**: ${concurrency}`);
  w(`- **Activate batch**: ${DEFAULT_ACTIVATE_BATCH}`);
  w(`- **Payload**: ${DEFAULT_PAYLOAD_SIZE_KB} KB per instance`);
  w(`- **Container restarted** between each run`);
  w(
    `- **SDK modes**: rest-disabled (LEGACY/no BP), rest-balanced (BALANCED BP), grpc-stream (@camunda8/sdk streamJobs), grpc-poll (@camunda8/sdk createWorker)`
  );
  w(
    `- **Clusters**: 1broker (single broker, high pressure), 3broker (3-broker cluster, reduced pressure)`
  );
  w('');

  // ─── Summary table ───
  w('## Results Summary');
  w('');
  w(
    '| Cluster | Clients | SDK Mode | Handler | Isolation | Throughput | Errors | QFull | Wall-clock | Jain | Status |'
  );
  w(
    '|---------|---------|----------|---------|-----------|------------|--------|-------|------------|------|--------|'
  );

  for (const r of [...results].sort(
    (a, b) =>
      a.cluster.localeCompare(b.cluster) ||
      a.numClients - b.numClients ||
      a.isolation.localeCompare(b.isolation) ||
      a.sdkMode.localeCompare(b.sdkMode) ||
      a.handlerType.localeCompare(b.handlerType)
  )) {
    const iso = r.isolation === 'independent' ? 'ind' : 'shr';
    if (r.status === 'ok') {
      const errFlag = r.totalErrors > 0 ? ' ⚠️' : '';
      w(
        `| ${r.cluster} | ${r.numClients} | ${r.sdkMode} | ${r.handlerType} | ${iso} ` +
          `| ${r.throughput.toFixed(1)}/s | ${r.totalErrors}${errFlag} ` +
          `| ${r.totalQueueFull} | ${r.wallClockS.toFixed(1)}s ` +
          `| ${r.jainFairness.toFixed(3)} | ${r.status} |`
      );
    } else {
      w(
        `| ${r.cluster} | ${r.numClients} | ${r.sdkMode} | ${r.handlerType} | ${iso} ` +
          `| - | - | - | - | - | **${r.status}** |`
      );
    }
  }

  if (failed.length > 0) {
    w('');
    w(`**${failed.length} run(s) failed** (timeout or error).`);
  }

  // ─── Server Metrics table ───
  const withMetrics = results.filter((r) => r.status === 'ok' && r.serverMetrics);
  if (withMetrics.length > 0) {
    w('');
    w('## Server-Side Metrics (Prometheus delta per run)');
    w('');
    w(
      '| Config | Received | Dropped | Deferred | Jobs Pushed | Push Fail | BP Limit | BP Inflight | Job Act Avg | Job Life Avg | PI Exec Avg | Jobs Act | Jobs Done | PIs Done |'
    );
    w(
      '|--------|----------|---------|----------|-------------|-----------|----------|-------------|-------------|--------------|-------------|----------|-----------|----------|'
    );

    for (const r of [...withMetrics].sort(
      (a, b) =>
        a.cluster.localeCompare(b.cluster) ||
        a.numClients - b.numClients ||
        a.isolation.localeCompare(b.isolation) ||
        a.sdkMode.localeCompare(b.sdkMode) ||
        a.handlerType.localeCompare(b.handlerType)
    )) {
      const sm = r.serverMetrics!;
      const iso = r.isolation === 'independent' ? 'ind' : 'shr';
      const cfg = `${r.cluster}-${r.numClients}c-${r.sdkMode}-${r.handlerType}-${iso}`;
      const fmtMs = (v: number | null) => (v != null ? `${v.toFixed(0)}ms` : '-');
      w(
        `| ${cfg} ` +
          `| ${sm.receivedRequests} ` +
          `| ${sm.droppedRequests} ` +
          `| ${sm.deferredAppends} ` +
          `| ${sm.jobsPushed} ` +
          `| ${sm.jobsPushFailed} ` +
          `| ${sm.backpressureLimit} ` +
          `| ${sm.backpressureInflight} ` +
          `| ${fmtMs(sm.jobActivationAvgMs)} ` +
          `| ${fmtMs(sm.jobLifetimeAvgMs)} ` +
          `| ${fmtMs(sm.piExecutionAvgMs)} ` +
          `| ${sm.jobActivationCount} ` +
          `| ${sm.jobCompletedCount} ` +
          `| ${sm.piCompletedCount} |`
      );
    }
  }

  // ─── Analysis ───
  w('');
  w('## Analysis');

  // Per cluster × client count
  for (const cl of [...new Set(ok.map((r) => r.cluster))].sort()) {
    for (const nc of [...new Set(ok.map((r) => r.numClients))].sort()) {
      const subset = ok.filter((r) => r.cluster === cl && r.numClients === nc);
      if (subset.length === 0) continue;
      w('');
      w(`### ${cl} — ${nc} Clients`);
      w('');

      // Compare three SDK modes
      for (const mode of DEFAULT_MODES) {
        const modeResults = subset.filter((r) => r.sdkMode === mode);
        if (modeResults.length === 0) continue;
        const avgTp = modeResults.reduce((s, r) => s + r.throughput, 0) / modeResults.length;
        const totalErr = modeResults.reduce((s, r) => s + r.totalErrors, 0);
        w(`- **${mode}**: avg throughput ${avgTp.toFixed(1)}/s, total errors ${totalErr}`);
      }

      // Best config per handler type
      w('');
      w('**Best configuration per handler:**');
      w('');
      for (const handler of DEFAULT_HANDLERS) {
        const handlerResults = subset.filter((r) => r.handlerType === handler);
        if (handlerResults.length === 0) continue;
        const zeroErr = handlerResults.filter((r) => r.totalErrors === 0);
        if (zeroErr.length > 0) {
          const best = zeroErr.reduce((a, b) => (a.throughput > b.throughput ? a : b));
          w(
            `- **${handler}**: ${best.sdkMode} + ${best.isolation === 'independent' ? 'ind' : 'shr'} → ${best.throughput.toFixed(1)}/s, 0 errors`
          );
        } else {
          const best = handlerResults.reduce((a, b) =>
            a.totalErrors < b.totalErrors
              ? a
              : a.totalErrors === b.totalErrors && a.throughput > b.throughput
                ? a
                : b
          );
          w(
            `- **${handler}**: ${best.sdkMode} + ${best.isolation === 'independent' ? 'ind' : 'shr'} → ${best.throughput.toFixed(1)}/s, ${best.totalErrors} errors ⚠️`
          );
        }
      }
    }
  }

  // ─── SDK Mode Comparison ───
  w('');
  w('### SDK Mode Comparison');
  w('');
  for (const mode of DEFAULT_MODES) {
    const modeOk = ok.filter((r) => r.sdkMode === mode);
    if (modeOk.length === 0) continue;
    w(`**${mode}:**`);
    const zeroErr = modeOk.filter((r) => r.totalErrors === 0);
    const hasErr = modeOk.filter((r) => r.totalErrors > 0);
    w(`  - ${zeroErr.length}/${modeOk.length} configs zero errors`);
    if (hasErr.length > 0) {
      const worst = hasErr.reduce((a, b) => (a.totalErrors > b.totalErrors ? a : b));
      w(`  - Worst: ${resultLabel(worst)} with ${worst.totalErrors} errors`);
    }
    if (zeroErr.length > 0) {
      const best = zeroErr.reduce((a, b) => (a.throughput > b.throughput ? a : b));
      w(`  - Peak (error-free): ${resultLabel(best)} at ${best.throughput.toFixed(1)}/s`);
    }
    w('');
  }

  // ─── Isolation Comparison ───
  w('');
  w('### Isolation Comparison');
  w('');
  for (const iso of DEFAULT_ISOLATIONS) {
    const isoLabel =
      iso === 'independent'
        ? 'Independent (child process per client)'
        : 'Shared (one client, N loops)';
    const isoOk = ok.filter((r) => r.isolation === iso);
    if (isoOk.length === 0) continue;
    const avgTp = isoOk.reduce((s, r) => s + r.throughput, 0) / isoOk.length;
    const totalErr = isoOk.reduce((s, r) => s + r.totalErrors, 0);
    w(`**${isoLabel}:** avg throughput ${avgTp.toFixed(1)}/s, total errors ${totalErr}`);
  }
  w('');

  const indOk = ok.filter((r) => r.isolation === 'independent');
  const shrOk = ok.filter((r) => r.isolation === 'shared');
  if (indOk.length > 0 && shrOk.length > 0) {
    const indAvg = indOk.reduce((s, r) => s + r.throughput, 0) / indOk.length;
    const shrAvg = shrOk.reduce((s, r) => s + r.throughput, 0) / shrOk.length;
    const indErr = indOk.reduce((s, r) => s + r.totalErrors, 0);
    const shrErr = shrOk.reduce((s, r) => s + r.totalErrors, 0);
    const deltaPct = shrAvg > 0 ? ((indAvg - shrAvg) / shrAvg) * 100 : 0;

    w('| Metric | Independent | Shared | Delta |');
    w('|--------|-------------|--------|-------|');
    w(
      `| Avg throughput | ${indAvg.toFixed(1)}/s | ${shrAvg.toFixed(1)}/s | ${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}% |`
    );
    w(
      `| Total errors | ${indErr} | ${shrErr} | ${indErr - shrErr >= 0 ? '+' : ''}${indErr - shrErr} |`
    );
    w('');
  }

  // ─── Head-to-head: all modes comparison ───
  w('');
  w('### Mode Comparison (head-to-head)');
  w('');
  const modeNames = [...new Set(ok.map((r) => r.sdkMode))].sort();
  if (modeNames.length >= 2) {
    const modeHeaders = modeNames.map((m) => m.replace('rest-', 'R:').replace('grpc-', 'G:'));
    w(`| Config | ${modeHeaders.join(' | ')} | Best |`);
    w(`|--------${modeHeaders.map(() => '|------').join('')}|------|`);

    for (const cluster of [...new Set(ok.map((r) => r.cluster))].sort()) {
      for (const nc of [...new Set(ok.map((r) => r.numClients))].sort()) {
        for (const handler of DEFAULT_HANDLERS) {
          for (const iso of DEFAULT_ISOLATIONS) {
            const isoShort = iso === 'independent' ? 'ind' : 'shr';
            const cells: string[] = [];
            const scores: Array<{ mode: string; throughput: number; errors: number }> = [];
            for (const mode of modeNames) {
              const r = ok.find(
                (x) =>
                  x.cluster === cluster &&
                  x.numClients === nc &&
                  x.handlerType === handler &&
                  x.isolation === iso &&
                  x.sdkMode === mode
              );
              if (r) {
                cells.push(`${r.throughput.toFixed(1)}/s (${r.totalErrors}e)`);
                scores.push({ mode, throughput: r.throughput, errors: r.totalErrors });
              } else {
                cells.push('—');
              }
            }
            if (scores.length >= 2) {
              const zeroErr = scores.filter((s) => s.errors === 0);
              let best: string;
              if (zeroErr.length > 0) {
                best = zeroErr.reduce((a, b) => (a.throughput > b.throughput ? a : b)).mode;
              } else {
                best = scores.reduce((a, b) => (a.errors < b.errors ? a : b)).mode;
              }
              w(`| ${cluster}-${nc}c-${handler}-${isoShort} | ${cells.join(' | ')} | ${best} |`);
            }
          }
        }
      }
    }
    w('');
  }

  // ─── Recommendations ───
  w('');
  w('## Recommendations');
  w('');

  // Dynamic summary table for all modes present in results
  const presentModes = [...new Set(ok.map((r) => r.sdkMode))].sort();
  const modeStats = presentModes.map((mode) => {
    const rows = ok.filter((r) => r.sdkMode === mode);
    const n = rows.length || 1;
    return {
      mode,
      totalErrors: rows.reduce((s, r) => s + r.totalErrors, 0),
      avgThroughput: rows.reduce((s, r) => s + r.throughput, 0) / n,
    };
  });

  w(`| Metric | ${presentModes.join(' | ')} |`);
  w(`|--------${presentModes.map(() => '|------').join('')}|`);
  w(`| Total errors | ${modeStats.map((m) => String(m.totalErrors)).join(' | ')} |`);
  w(`| Avg throughput | ${modeStats.map((m) => `${m.avgThroughput.toFixed(1)}/s`).join(' | ')} |`);
  w('');

  const disabledStats = modeStats.find((m) => m.mode === 'rest-disabled');
  const balancedStats = modeStats.find((m) => m.mode === 'rest-balanced');
  if (disabledStats && balancedStats && disabledStats.totalErrors > balancedStats.totalErrors) {
    const reduction =
      disabledStats.totalErrors > 0
        ? (
            ((disabledStats.totalErrors - balancedStats.totalErrors) / disabledStats.totalErrors) *
            100
          ).toFixed(0)
        : '0';
    w(
      `**REST Balanced should be the SDK default.** It reduces errors by ${reduction}% vs REST Disabled across the full matrix.`
    );
  }
  w('');

  // Compare best gRPC mode vs REST Balanced
  const grpcModes = modeStats.filter((m) => m.mode.startsWith('grpc-'));
  if (balancedStats && grpcModes.length > 0) {
    const bestGrpc = grpcModes.reduce((a, b) => (a.avgThroughput > b.avgThroughput ? a : b));
    if (bestGrpc.avgThroughput > balancedStats.avgThroughput * 1.1) {
      w(
        `**${bestGrpc.mode} shows ${((bestGrpc.avgThroughput / balancedStats.avgThroughput - 1) * 100).toFixed(0)}% higher throughput** than REST Balanced, likely due to binary protocol efficiency.`
      );
    } else if (balancedStats.avgThroughput > bestGrpc.avgThroughput * 1.1) {
      w(
        `**REST Balanced outperforms ${bestGrpc.mode}** by ${((balancedStats.avgThroughput / bestGrpc.avgThroughput - 1) * 100).toFixed(0)}%, suggesting the adaptive backpressure system compensates for the REST overhead.`
      );
    } else {
      w(
        `**REST Balanced and ${bestGrpc.mode} show comparable throughput**, suggesting the adaptive backpressure system effectively bridges the protocol gap.`
      );
    }
  }

  w('');
  w('---');
  w(`*Report generated by run-matrix.ts — ${results.length} configurations tested.*`);

  return lines.join('\n');
}

// ─── CLI argument parsing ────────────────────────────────
function parseArgs(): {
  modes: string[];
  handlers: string[];
  clients: number[];
  isolations: string[];
  clusters: string[];
  target: number;
  concurrency: number;
  timeout: number;
  preCreate: number;
  noRestart: boolean;
  dryRun: boolean;
} {
  const args = process.argv.slice(2);
  const config = {
    modes: [...DEFAULT_MODES],
    handlers: [...DEFAULT_HANDLERS],
    clients: [...DEFAULT_CLIENTS],
    isolations: [...DEFAULT_ISOLATIONS],
    clusters: [...DEFAULT_CLUSTERS],
    target: DEFAULT_TARGET_PER_CLIENT,
    concurrency: DEFAULT_CLIENT_CONCURRENCY,
    timeout: DEFAULT_SCENARIO_TIMEOUT,
    preCreate: DEFAULT_PRE_CREATE_COUNT,
    noRestart: false,
    dryRun: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    switch (arg) {
      case '--modes': {
        config.modes = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          config.modes.push(args[++i]);
        }
        break;
      }
      case '--handlers': {
        config.handlers = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          config.handlers.push(args[++i]);
        }
        break;
      }
      case '--clients': {
        config.clients = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          config.clients.push(parseInt(args[++i], 10));
        }
        break;
      }
      case '--isolations': {
        config.isolations = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          config.isolations.push(args[++i]);
        }
        break;
      }
      case '--clusters': {
        config.clusters = [];
        while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          config.clusters.push(args[++i]);
        }
        break;
      }
      case '--target':
        config.target = parseInt(args[++i], 10);
        break;
      case '--concurrency':
        config.concurrency = parseInt(args[++i], 10);
        break;
      case '--timeout':
        config.timeout = parseInt(args[++i], 10);
        break;
      case '--pre-create':
        config.preCreate = parseInt(args[++i], 10);
        break;
      case '--no-restart':
        config.noRestart = true;
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
    }
    i++;
  }

  return config;
}

// ─── Main ────────────────────────────────────────────────
async function main() {
  const config = parseArgs();

  // Build matrix
  const matrix: Array<{
    cluster: string;
    sdkMode: string;
    handlerType: string;
    numClients: number;
    isolation: string;
  }> = [];
  for (const cluster of config.clusters) {
    for (const nc of config.clients.sort((a, b) => a - b)) {
      for (const isolation of config.isolations) {
        for (const sdkMode of config.modes) {
          for (const handler of config.handlers) {
            matrix.push({ cluster, sdkMode, handlerType: handler, numClients: nc, isolation });
          }
        }
      }
    }
  }

  const total = matrix.length;
  const timestamp = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');

  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║   JS SDK Backpressure Matrix Runner                             ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log(`  Configurations:  ${total}`);
  console.log(`  SDK modes:       ${config.modes.join(', ')}`);
  console.log(`  Handlers:        ${config.handlers.join(', ')}`);
  console.log(`  Client counts:   ${config.clients.join(', ')}`);
  console.log(`  Isolations:      ${config.isolations.join(', ')}`);
  console.log(`  Clusters:        ${config.clusters.join(', ')}`);
  console.log(`  Target/client:   ${config.target}`);
  console.log(`  Pre-create:      ${config.preCreate}`);
  console.log(`  Concurrency:     ${config.concurrency}`);
  console.log(`  Timeout/run:     ${config.timeout}s`);
  console.log(`  Restart:         ${config.noRestart ? 'no' : 'yes'}`);
  console.log('');

  if (config.dryRun) {
    console.log('DRY RUN — would execute:');
    for (let idx = 0; idx < matrix.length; idx++) {
      const m = matrix[idx];
      const iso = m.isolation === 'independent' ? 'ind' : 'shr';
      console.log(
        `  ${String(idx + 1).padStart(3)}. ${m.cluster}-${m.numClients}c-${m.sdkMode}-${m.handlerType}-${iso}`
      );
    }
    console.log(`\nTotal: ${total} runs`);
    return;
  }

  // Create results directory
  fs.mkdirSync(RESULTS_DIR, { recursive: true });

  // Run matrix
  const results: RunResult[] = [];
  const t0 = Date.now();

  for (let idx = 0; idx < matrix.length; idx++) {
    const m = matrix[idx];
    console.log(`\n  ── Run ${idx + 1}/${total} ──`);

    const result = await runScenario(
      m.cluster,
      m.sdkMode,
      m.handlerType,
      m.numClients,
      m.isolation,
      config.target,
      config.concurrency,
      config.preCreate,
      !config.noRestart,
      config.timeout
    );
    results.push(result);

    // Progress estimate
    const elapsed = (Date.now() - t0) / 1000;
    const okCount = results.filter((r) => r.status === 'ok').length;
    const remaining = total - (idx + 1);
    const avgPerRun = elapsed / (idx + 1);
    const eta = avgPerRun * remaining;
    console.log(
      `\n  Progress: ${idx + 1}/${total} done (${okCount} ok), elapsed ${elapsed.toFixed(0)}s, ~${eta.toFixed(0)}s remaining`
    );
  }

  const totalElapsed = (Date.now() - t0) / 1000;

  // Save raw results as JSON
  const jsonPath = path.join(RESULTS_DIR, 'results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Generate report
  const report = generateReport(
    results,
    config.target,
    config.concurrency,
    config.preCreate,
    timestamp
  );

  const reportPath = path.join(RESULTS_DIR, 'report.md');
  fs.writeFileSync(reportPath, report);

  // Print report to stdout
  console.log(`\n\n${'='.repeat(65)}`);
  console.log(report);
  console.log(`\n${'='.repeat(65)}`);
  console.log(
    `\nTotal elapsed: ${totalElapsed.toFixed(0)}s (${(totalElapsed / 60).toFixed(1)} min)`
  );
  console.log(`Results:       ${RESULTS_DIR}`);
  console.log(`Report:        ${reportPath}`);
  console.log(`Raw JSON:      ${jsonPath}`);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
