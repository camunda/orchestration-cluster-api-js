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
