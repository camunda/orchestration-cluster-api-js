import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Regression tests for the worker start gate (issue #401).
 *
 * `createJobWorker` / `createThreadedJobWorker` return the worker handle
 * synchronously while the transport behind it may still be initialising, and
 * `start()` used to schedule a poll immediately. Its only guard was
 * `if (this._pollTimer) return`, which is released for the whole duration of an
 * in-flight activation — so a `start()` issued in that window opened a *second*
 * concurrent poll loop alongside the first (autostart + an eager app-side
 * `start()` is exactly that shape).
 *
 * These tests are written against the *class* of defect rather than one worker:
 * every kind in `WORKER_KINDS` must satisfy the same `start()` contract, so a
 * new worker type that reimplements `start()` without the gate fails here.
 *
 * The invariant they assert is transport-level and does not depend on wall
 * clock: **a correctly gated worker never has two activation requests in flight
 * at the same time**, no matter how often or when `start()` is called.
 */

const REST_ADDRESS = 'http://localhost:8080';
const JOB_TYPE = 'start-gate-task';

interface WorkerHandle {
  start(): void;
  stop(): void;
  readonly stopped: boolean;
  readonly ready?: Promise<void>;
}

interface WorkerKind {
  name: string;
  create(client: any, autoStart: boolean): WorkerHandle;
  /** Resolves when this kind's transport is up; undefined when it has no async transport. */
  transportReady(worker: WorkerHandle): Promise<void> | undefined;
}

const WORKER_KINDS: WorkerKind[] = [
  {
    name: 'JobWorker',
    create: (client, autoStart) =>
      client.createJobWorker({
        jobType: JOB_TYPE,
        jobHandler: async (job: any) => job.complete(),
        maxParallelJobs: 1,
        autoStart,
      }),
    transportReady: () => undefined,
  },
  {
    name: 'ThreadedJobWorker',
    create: (client, autoStart) =>
      client.createThreadedJobWorker({
        jobType: JOB_TYPE,
        handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.js'),
        maxParallelJobs: 1,
        threadPoolSize: 1,
        autoStart,
      }),
    transportReady: (worker) => worker.ready,
  },
];

/** Tracks concurrent activation requests so a duplicated poll loop is observable. */
interface ActivationProbe {
  /** Total activation requests seen. */
  count: number;
  /** Highest number of activation requests in flight simultaneously. */
  maxInFlight: number;
  inFlight: number;
  /** Invoked while an activation is in flight; the returned promise gates the response. */
  onActivation?: (count: number) => Promise<void> | void;
}

function createProbedClient(probe: ActivationProbe) {
  return createCamundaClient({
    config: { CAMUNDA_REST_ADDRESS: REST_ADDRESS },
    log: { level: 'error' },
    fetch: (async (input: RequestInfo | URL, _init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (!url.includes('/v2/jobs/activation')) {
        return new Response(JSON.stringify({ error: `No mock for ${url}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      probe.count++;
      probe.inFlight++;
      probe.maxInFlight = Math.max(probe.maxInFlight, probe.inFlight);
      try {
        await probe.onActivation?.(probe.count);
      } finally {
        probe.inFlight--;
      }
      return new Response(JSON.stringify({ jobs: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as any,
  });
}

/**
 * Yield the macrotask queue up to `turns` times, stopping early once `until` holds.
 *
 * A wrongly-scheduled poll is queued with `setTimeout(..., 0)`, so it surfaces
 * within a couple of turns; the budget is a safety net, not a correctness
 * signal — the assertions never depend on how long a turn takes.
 */
async function drainTurns(turns: number, until: () => boolean): Promise<void> {
  for (let i = 0; i < turns && !until(); i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

async function waitFor(condition: () => boolean, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (!condition() && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  if (!condition()) throw new Error(`waitFor timed out after ${timeoutMs}ms`);
}

describe('worker start gate', () => {
  let client: any = null;

  afterEach(() => {
    client?.stopAllWorkers();
    client = null;
  });

  for (const kind of WORKER_KINDS) {
    describe(kind.name, () => {
      it('drops an explicit start() issued while an activation is in flight', async () => {
        const probe: ActivationProbe = { count: 0, inFlight: 0, maxInFlight: 0 };
        client = createProbedClient(probe);
        let worker: WorkerHandle | null = null;

        probe.onActivation = async () => {
          // Re-enter start() precisely while an activation is outstanding. This is
          // the window in which _pollTimer is null, so a timer-only guard admits a
          // second poll loop; the gate must drop the request instead.
          worker?.start();
          worker?.start();
          await drainTurns(25, () => probe.inFlight > 1);
        };

        worker = kind.create(client, true);
        await waitFor(() => probe.count >= 2, 5000);
        worker.stop();

        expect(probe.maxInFlight).toBe(1);
      });

      it('is idempotent when start() is called repeatedly in the creation tick', async () => {
        const probe: ActivationProbe = { count: 0, inFlight: 0, maxInFlight: 0 };
        client = createProbedClient(probe);

        const worker = kind.create(client, false);
        worker.start();
        worker.start();
        worker.start();

        // No poll may be issued in the tick that created the handle.
        expect(probe.count).toBe(0);

        probe.onActivation = async () => {
          worker.start();
          await drainTurns(25, () => probe.inFlight > 1);
        };

        await waitFor(() => probe.count >= 2, 5000);
        worker.stop();

        expect(probe.maxInFlight).toBe(1);
      });

      it('does not activate before the transport signals ready', async () => {
        const probe: ActivationProbe = { count: 0, inFlight: 0, maxInFlight: 0 };
        client = createProbedClient(probe);

        const worker = kind.create(client, false);
        worker.start();

        const ready = kind.transportReady(worker);
        if (ready) {
          let readyResolved = false;
          void ready.then(() => {
            readyResolved = true;
          });
          await waitFor(() => probe.count >= 1, 5000);
          expect(readyResolved).toBe(true);
        } else {
          await waitFor(() => probe.count >= 1, 5000);
        }
        worker.stop();
      });

      it('start() after stop() stays a no-op', async () => {
        const probe: ActivationProbe = { count: 0, inFlight: 0, maxInFlight: 0 };
        client = createProbedClient(probe);

        const worker = kind.create(client, false);
        worker.stop();
        worker.start();
        worker.start();

        await drainTurns(25, () => probe.count > 0);

        expect(worker.stopped).toBe(true);
        expect(probe.count).toBe(0);
      });
    });
  }
});
