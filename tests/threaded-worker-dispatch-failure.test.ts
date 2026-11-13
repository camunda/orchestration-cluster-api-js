import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';

/**
 * A job that cannot be dispatched to a thread must be failed, not dropped (#622).
 *
 * `_serializeJob` round-trips the activated job through `JSON.parse(JSON.stringify(...))`,
 * which throws `RangeError: Maximum call stack size exceeded` on a sufficiently deeply
 * nested variable payload. `_dispatchToThread` was `async` and both of its call sites
 * invoked it without `await` or `.catch()`, so the throw became an unhandled rejection:
 * the job was never dispatched, never failed back to the broker, and its concurrency
 * permit was never released.
 *
 * The assertions target the dispatch path rather than that one depth, so any serialization
 * failure — or any other throw while handing a job to a thread — is covered.
 */

/** Nested past the depth at which JSON.stringify recurses out of stack on any runtime. */
function deeplyNested(depth = 60_000): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let cursor = root;
  for (let i = 0; i < depth; i++) {
    const next: Record<string, unknown> = {};
    cursor.nested = next;
    cursor = next;
  }
  return root;
}

function captureLog() {
  const events: any[] = [];
  const record =
    (level: string) =>
    (...args: any[]) => {
      events.push({ level, args: args.map((a) => (typeof a === 'function' ? a() : a)) });
    };
  const log: any = {
    level: () => 'trace',
    scope: () => log,
    silly: record('silly'),
    trace: record('trace'),
    debug: record('debug'),
    info: record('info'),
    warn: record('warn'),
    error: record('error'),
  };
  return { events, log };
}

function stubClient(log: any) {
  const failed: any[] = [];
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

/** Pool stand-in that always has an idle thread, and records what reached `dispatch`. */
function stubPool(dispatchImpl?: () => void) {
  const dispatched: any[] = [];
  return {
    dispatched,
    pool: {
      ready: Promise.resolve(),
      size: 1,
      busyCount: 0,
      idleCount: 1,
      onThreadReady: undefined as undefined | (() => void),
      getIdleWorker: () => ({ id: 1 }),
      dispatch: (...args: any[]) => {
        dispatched.push(args);
        dispatchImpl?.();
      },
    } as any,
  };
}

function makeWorker(pool: any, client: any) {
  return new ThreadedJobWorker(client, pool, {
    jobType: 'dispatch-failure-test',
    handlerModule: '/dev/null',
    maxParallelJobs: 2,
    pollIntervalMs: 10_000,
    autoStart: false,
  } as any) as any;
}

describe('ThreadedJobWorker dispatch failure handling', () => {
  let rejections: unknown[];
  let onRejection: (reason: unknown) => void;

  beforeEach(() => {
    rejections = [];
    onRejection = (reason) => rejections.push(reason);
    process.on('unhandledRejection', onRejection);
  });

  afterEach(() => {
    process.off('unhandledRejection', onRejection);
  });

  it('JSON.stringify still throws on a deeply nested payload (the premise of this test)', () => {
    expect(() => JSON.stringify(deeplyNested())).toThrow(RangeError);
  });

  it('fails the job and releases the permit when the payload cannot be serialized', async () => {
    const { events, log } = captureLog();
    const { client, failed } = stubClient(log);
    const { pool, dispatched } = stubPool();
    const worker = makeWorker(pool, client);

    // One permit taken, as `_poll` does for an activated batch.
    worker._activeJobs = 1;

    worker._handleJob({
      jobKey: '77',
      retries: 3,
      variables: deeplyNested(),
      customHeaders: {},
    });

    await new Promise((r) => setTimeout(r, 10));

    expect(dispatched.length, 'an unserializable job must not reach a thread').toBe(0);
    expect(failed.length, 'the job must be failed through the normal failure path').toBe(1);
    expect(failed[0].jobKey).toBe('77');
    expect(failed[0].retries).toBe(2);
    expect(worker.activeJobs, 'the concurrency permit must be released').toBe(0);
    expect(rejections, 'dispatch must not raise an unhandled rejection').toEqual([]);

    // The failure is reported, and without any of the payload in it.
    const text = events
      .map((e) => `${e.level} ${e.args.map((a: any) => JSON.stringify(a)).join(' ')}`)
      .join('\n');
    expect(text).toMatch(/job\.(dispatch|serialize)\./);
    expect(text, 'variable content must not reach the log').not.toContain('nested');
    expect(
      JSON.stringify(failed[0].errorMessage),
      'variable content must not reach the failure message'
    ).not.toContain('nested');
  });

  it('fences the failure with the lease token when the job was leased', async () => {
    const { log } = captureLog();
    const { client, failed } = stubClient(log);
    const { pool } = stubPool();
    const worker = makeWorker(pool, client);
    worker._activeJobs = 1;

    worker._handleJob({
      jobKey: '78',
      retries: 1,
      jobLeaseToken: 'lease-abc',
      variables: deeplyNested(),
      customHeaders: {},
    });
    await new Promise((r) => setTimeout(r, 10));

    expect(failed.length).toBe(1);
    expect(failed[0].jobLeaseToken).toBe('lease-abc');
    expect(worker.activeJobs).toBe(0);
  });

  it('releases the permit when the pool itself throws while dispatching', async () => {
    const { log } = captureLog();
    const { client, failed } = stubClient(log);
    const { pool } = stubPool(() => {
      throw new Error('pool refused the job');
    });
    const worker = makeWorker(pool, client);
    worker._activeJobs = 1;

    worker._handleJob({ jobKey: '79', retries: 2, variables: { ok: true }, customHeaders: {} });
    await new Promise((r) => setTimeout(r, 10));

    expect(failed.length, 'any dispatch failure must fail the job').toBe(1);
    expect(worker.activeJobs, 'any dispatch failure must release the permit').toBe(0);
    expect(rejections).toEqual([]);
  });

  it('still dispatches a normal job', async () => {
    const { log } = captureLog();
    const { client, failed } = stubClient(log);
    const { pool, dispatched } = stubPool();
    const worker = makeWorker(pool, client);
    worker._activeJobs = 1;

    worker._handleJob({ jobKey: '80', retries: 2, variables: { a: 1 }, customHeaders: { h: 'x' } });
    await new Promise((r) => setTimeout(r, 10));

    expect(dispatched.length).toBe(1);
    expect(dispatched[0][1]).toMatchObject({ jobKey: '80', variables: { a: 1 } });
    expect(failed.length).toBe(0);
    expect(worker.activeJobs, 'a dispatched job keeps its permit until it completes').toBe(1);
  });
});
