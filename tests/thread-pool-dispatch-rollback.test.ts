import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';
import { ThreadPool } from '../src/runtime/threadPool';

/**
 * `ThreadPool.dispatch` must leave no trace of a task it could not hand to a thread (#622).
 *
 * `dispatch` marks the thread busy, registers a pending task and opens a MessageChannel
 * *before* it calls `postMessage`. A `postMessage` that cannot clone the payload throws
 * (DataCloneError), and `dispatch` is `async`, so that surfaces as a rejection. If the
 * pool does not roll its own bookkeeping back, the rejection is handled by the caller but
 * the thread stays busy forever, the pending entry never goes away and the port stays open.
 *
 * Needs the compiled `dist/threadWorkerEntry.js` like the other threaded tests.
 */

function stubClient() {
  const failed: any[] = [];
  const log: any = {
    level: () => 'error',
    scope: () => log,
    silly: () => undefined,
    trace: () => undefined,
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
  };
  return {
    failed,
    client: {
      logger: () => log,
      failJob: async (req: any) => {
        failed.push(req);
        return {};
      },
      activateJobs: async () => ({ jobs: [] }),
      clock: { sleep: async () => undefined, now: () => Date.now() },
      random: { next: () => 0.5 },
    } as any,
  };
}

/** Make the single thread's `postMessage` fail the way an uncloneable payload does. */
function breakPostMessage(pool: any) {
  const pw = pool._pool[0];
  // Do not depend on the real thread's startup handshake: the test is about the busy flag.
  pw.ready = true;
  pw.worker.postMessage = () => {
    throw new DOMException('could not be cloned', 'DataCloneError');
  };
  return pw;
}

/** Record every port the pool opens so the test can see whether it was closed. */
function recordPorts(pool: any) {
  const opened: { closed: boolean }[] = [];
  const Real = pool._node.MessageChannel;
  pool._node.MessageChannel = class extends Real {
    constructor() {
      super();
      for (const port of [this.port1, this.port2]) {
        const rec = { closed: false };
        opened.push(rec);
        const close = port.close.bind(port);
        port.close = () => {
          rec.closed = true;
          close();
        };
      }
    }
  };
  return opened;
}

describe('ThreadPool.dispatch rollback when postMessage fails', () => {
  let pool: ThreadPool | undefined;

  afterEach(() => {
    pool?.terminate();
    pool = undefined;
  });

  it('frees the thread, forgets the task and closes the ports, without calling back', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = breakPostMessage(pool);
    const opened = recordPorts(pool);
    const calls: string[] = [];

    await expect(
      pool.dispatch(pw, { jobKey: '1' }, '/dev/null', {
        onComplete: () => calls.push('onComplete'),
        onError: () => calls.push('onError'),
      })
    ).rejects.toThrow(/could not be cloned/);

    expect(pw.busy, 'the thread must not stay busy').toBe(false);
    expect(pw.currentTaskId, 'the thread must not keep the failed task id').toBeUndefined();
    expect((pool as any)._pending.size, 'the pending task must be removed').toBe(0);
    expect(opened.length).toBeGreaterThan(0);
    expect(
      opened.map((p) => p.closed),
      'every port opened for the task must be closed'
    ).toEqual(opened.map(() => true));
    expect(
      calls,
      'the failure is reported by the rejection only, never also via a callback'
    ).toEqual([]);
  });

  it('lets the next job use the thread after a failed dispatch', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = breakPostMessage(pool);
    await pool
      .dispatch(pw, { jobKey: '1' }, '/dev/null', { onComplete: () => {}, onError: () => {} })
      .catch(() => undefined);

    expect(pool.busyCount).toBe(0);
    expect(pool.getIdleWorker(), 'a failed dispatch must not shrink the pool').toBe(pw);
  });

  it('fails the job once, frees the permit and frees the thread end to end', async () => {
    const { client, failed } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    breakPostMessage(pool);
    const worker: any = new ThreadedJobWorker(client, pool, {
      jobType: 'rollback-test',
      handlerModule: '/dev/null',
      maxParallelJobs: 1,
      pollIntervalMs: 10_000,
      autoStart: false,
    } as any);
    worker._activeJobs = 1;
    worker._handleJob({ jobKey: '7', retries: 3, variables: { ok: true }, customHeaders: {} });
    // Wait on the condition (permit released), not on a fixed delay.
    await vi.waitFor(() => expect(worker.activeJobs).toBe(0));

    expect(failed.length).toBe(1);
    expect(failed[0].retries).toBe(2);
    expect(worker.activeJobs, 'the permit must be released once').toBe(0);
    expect(pool.busyCount, 'the thread must be free again').toBe(0);
  });
});

describe('ThreadPool.dispatch rollback when channel setup fails', () => {
  let pool: ThreadPool | undefined;

  afterEach(() => {
    pool?.terminate();
    pool = undefined;
  });

  it('frees the thread when the MessageChannel cannot be constructed', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = (pool as any)._pool[0];
    pw.ready = true;
    (pool as any)._node.MessageChannel = class {
      constructor() {
        throw new Error('no more channels');
      }
    };

    await expect(
      pool.dispatch(pw, { jobKey: '1' }, '/dev/null', { onComplete: () => {}, onError: () => {} })
    ).rejects.toThrow(/no more channels/);

    expect(pw.busy, 'the thread must not stay busy').toBe(false);
    expect(pw.currentTaskId).toBeUndefined();
    expect((pool as any)._pending.size).toBe(0);
  });

  it('frees the thread and closes both ports when the port handler cannot be installed', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = (pool as any)._pool[0];
    pw.ready = true;
    const opened = recordPorts(pool);
    // `installClientCallHandler` subscribes with `port.on`; make that fail on the new port.
    const Recording = (pool as any)._node.MessageChannel;
    (pool as any)._node.MessageChannel = class extends Recording {
      constructor() {
        super();
        (this as any).port1.on = () => {
          throw new Error('cannot listen');
        };
      }
    };

    await expect(
      pool.dispatch(pw, { jobKey: '1' }, '/dev/null', { onComplete: () => {}, onError: () => {} })
    ).rejects.toThrow(/cannot listen/);

    expect(pw.busy, 'the thread must not stay busy').toBe(false);
    expect(pw.currentTaskId).toBeUndefined();
    expect((pool as any)._pending.size).toBe(0);
    expect(opened.length).toBe(2);
    expect(
      opened.map((p) => p.closed),
      'both ports must be closed'
    ).toEqual([true, true]);
  });
});

describe('ThreadPool readiness notification after a failed dispatch', () => {
  let pool: ThreadPool | undefined;

  afterEach(() => {
    pool?.terminate();
    pool = undefined;
  });

  it('tells the registered worker the thread is idle only once it really is', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = breakPostMessage(pool);
    const opened = recordPorts(pool);
    const seen: { busy: boolean; pending: number; closed: boolean[] }[] = [];
    pool.onThreadReady = () =>
      seen.push({
        busy: pw.busy,
        pending: (pool as any)._pending.size,
        closed: opened.map((p) => p.closed),
      });

    await pool
      .dispatch(pw, { jobKey: '1' }, '/dev/null', { onComplete: () => {}, onError: () => {} })
      .catch(() => undefined);

    expect(seen.length, 'the readiness callback must fire once after the rollback').toBe(1);
    expect(seen[0].busy).toBe(false);
    expect(seen[0].pending).toBe(0);
    expect(seen[0].closed.every(Boolean), 'ports are closed before the notification').toBe(true);
  });

  it('does not let a throwing readiness callback replace the dispatch failure', async () => {
    const { client } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = breakPostMessage(pool);
    pool.onThreadReady = () => {
      throw new Error('callback exploded');
    };

    await expect(
      pool.dispatch(pw, { jobKey: '1' }, '/dev/null', { onComplete: () => {}, onError: () => {} })
    ).rejects.toThrow(/could not be cloned/);
  });

  it('drains a second worker queue that was waiting for the shared thread', async () => {
    const { client, failed } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = (pool as any)._pool[0];
    pw.ready = true;
    const posted: any[] = [];
    pw.worker.postMessage = (msg: any) => {
      posted.push(msg);
      // Only the first job fails to clone; the next one is accepted.
      if (posted.length === 1) throw new DOMException('could not be cloned', 'DataCloneError');
    };
    const cfg = {
      handlerModule: '/dev/null',
      maxParallelJobs: 1,
      pollIntervalMs: 10_000,
      autoStart: false,
    };
    const failing: any = new ThreadedJobWorker(client, pool, {
      ...cfg,
      jobType: 'failing',
    } as any);
    // The pool holds one readiness callback; the worker constructed last owns it.
    const waiting: any = new ThreadedJobWorker(client, pool, { ...cfg, jobType: 'waiting' } as any);
    waiting._activeJobs = 1;
    waiting._jobQueue.push({ raw: { jobKey: '2', retries: 1, variables: {}, customHeaders: {} } });

    failing._activeJobs = 1;
    failing._handleJob({ jobKey: '1', retries: 3, variables: { ok: true }, customHeaders: {} });

    await vi.waitFor(() => expect(failing.activeJobs).toBe(0));
    expect(failed.map((f: any) => f.jobKey)).toEqual(['1']);
    expect(
      posted.map((m) => m.jobData.jobKey),
      'the waiting worker must be handed the thread the failed dispatch released'
    ).toEqual(['1', '2']);
    expect(waiting._jobQueue.length).toBe(0);
  });

  it('fails a long queue of unclonable jobs without recursing once per job', async () => {
    // Notifying inline would re-enter the worker's drain from inside each failed dispatch, so
    // a queue of N jobs that all fail to clone would nest N drains and exhaust the stack.
    const { client, failed } = stubClient();
    pool = new ThreadPool(client, 1);
    await pool.ready;
    const pw = (pool as any)._pool[0];
    pw.ready = true;
    pw.worker.postMessage = () => {
      throw new DOMException('could not be cloned', 'DataCloneError');
    };
    const queued = 20_000;
    const worker: any = new ThreadedJobWorker(client, pool, {
      handlerModule: '/dev/null',
      maxParallelJobs: queued + 1,
      pollIntervalMs: 10_000,
      autoStart: false,
      jobType: 'long-queue',
    } as any);
    worker._activeJobs = queued;
    for (let i = 0; i < queued; i++) {
      worker._jobQueue.push({
        raw: { jobKey: String(i), retries: 1, variables: {}, customHeaders: {} },
      });
    }

    worker._drainQueue();

    await vi.waitFor(() => expect(worker.activeJobs).toBe(0), { timeout: 30_000 });
    expect(failed.length, 'every queued job must be failed exactly once').toBe(queued);
    expect(pool.busyCount).toBe(0);
  }, 60_000);
});
