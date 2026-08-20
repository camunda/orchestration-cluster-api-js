import { Effect, Fiber, Layer, Schedule } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { CamundaEffect, type CamundaEffectClient } from '../src/effect';
import {
  createCamundaEffectWorker,
  type Job,
  RetryableJobError,
  runWorkerLoop,
  TerminalJobError,
} from '../src/effect-worker';

// The Effect worker's activation poll interval and in-handler retry `Schedule` run on
// the Effect `Clock`, so `TestClock.adjust` advances them in *virtual* time. These
// tests drive multi-second activation/retry sequences to completion while the real
// wall clock barely moves — the real-vs-virtual clock class flagged in nano-ide#408
// cannot bite here by construction. There is no live Camunda: a fake `CamundaEffect`
// service records the client calls the worker makes and controls what it activates.

const sampleJob = (over: Partial<Job> = {}): Job =>
  ({
    jobKey: '1',
    type: 'test-job',
    retries: 3,
    leaseToken: null,
    variables: {},
    customHeaders: {},
    processInstanceKey: '10',
    ...over,
  }) as unknown as Job;

interface FakeCalls {
  activate: number;
  complete: number;
  fail: number;
  error: number;
  lastFailRetries?: number;
  lastErrorCode?: string;
}

function fakeCamunda(
  activations: () => { jobs: Job[] },
  calls: FakeCalls
): Layer.Layer<CamundaEffect> {
  const client = {
    activateJobs: () =>
      Effect.sync(() => {
        calls.activate += 1;
        return activations();
      }),
    completeJob: () => Effect.sync(() => (calls.complete += 1)),
    failJob: (input: { retries?: number }) =>
      Effect.sync(() => {
        calls.fail += 1;
        calls.lastFailRetries = input.retries;
      }),
    throwJobError: (input: { errorCode?: string }) =>
      Effect.sync(() => {
        calls.error += 1;
        calls.lastErrorCode = input.errorCode;
      }),
  } as unknown as CamundaEffectClient;
  return Layer.succeed(CamundaEffect, client);
}

// Serve exactly one job on the first poll, then empty polls forever.
function serveOnce(job: Job = sampleJob()): () => { jobs: Job[] } {
  let served = false;
  return () => {
    if (served) return { jobs: [] };
    served = true;
    return { jobs: [job] };
  };
}

describe('Effect worker timing is bounded by virtual time (TestClock)', () => {
  it('activation poll interval elapses in virtual time — no real-clock burn', async () => {
    const calls: FakeCalls = { activate: 0, complete: 0, fail: 0, error: 0 };
    const realStart = Date.now();

    const program = Effect.gen(function* () {
      // Handler is never reached (no jobs are ever activated); we only exercise the
      // between-empty-polls delay, which must run on the Effect Clock.
      const fiber = yield* Effect.forkChild(
        runWorkerLoop({
          type: 'test-job',
          handler: () => Effect.void,
          pollInterval: '5 seconds',
          concurrency: 1,
        })
      );
      // One poll fires before any virtual time passes; advancing 25 virtual seconds
      // across the 5s interval drives several more polls.
      yield* TestClock.adjust('1 milli');
      const afterFirst = calls.activate;
      yield* TestClock.adjust('25 seconds');
      const afterAdvance = calls.activate;
      yield* Fiber.interrupt(fiber);
      return { afterFirst, afterAdvance };
    }).pipe(
      Effect.provide(fakeCamunda(() => ({ jobs: [] }), calls)),
      Effect.provide(TestClock.layer())
    );

    const { afterFirst, afterAdvance } = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    expect(afterFirst).toBe(1);
    expect(afterAdvance).toBeGreaterThanOrEqual(6);
    // 25 virtual seconds of sleeps never touched the real wall clock.
    expect(realElapsed).toBeLessThan(5000);
  });

  it('in-handler retry backoff runs on the Effect Clock, then completes', async () => {
    const calls: FakeCalls = { activate: 0, complete: 0, fail: 0, error: 0 };
    let attempts = 0;
    const realStart = Date.now();

    const program = Effect.gen(function* () {
      const fiber = yield* Effect.forkChild(
        runWorkerLoop<{ ok: boolean }>({
          type: 'test-job',
          // Fails retryably twice, then succeeds on the third attempt. The retries are
          // spaced 10 virtual seconds apart.
          handler: () =>
            Effect.suspend(() => {
              attempts += 1;
              return attempts < 3
                ? Effect.fail(new RetryableJobError({ message: `attempt ${attempts}` }))
                : Effect.succeed({ ok: true });
            }),
          handlerRetrySchedule: Schedule.spaced('10 seconds'),
          pollInterval: '1 second',
          concurrency: 1,
        })
      );
      yield* TestClock.adjust('1 milli');
      const afterFirst = attempts;
      // Advance across both 10s retry backoffs — all virtual.
      yield* TestClock.adjust('25 seconds');
      const result = { attempts, complete: calls.complete, fail: calls.fail };
      yield* Fiber.interrupt(fiber);
      return { afterFirst, ...result };
    }).pipe(Effect.provide(fakeCamunda(serveOnce(), calls)), Effect.provide(TestClock.layer()));

    const { afterFirst, attempts: total, complete, fail } = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    // Only the first attempt runs before virtual time advances; the rest wait on the
    // Effect Clock.
    expect(afterFirst).toBe(1);
    expect(total).toBe(3);
    // Retries exhausted the failures → the job was completed, never failed.
    expect(complete).toBe(1);
    expect(fail).toBe(0);
    // ~20s of virtual retry backoff never burned real time.
    expect(realElapsed).toBeLessThan(5000);
  });
});

describe('Effect worker typed job-failure channel', () => {
  it('a retryable handler failure fails the job with retries - 1', async () => {
    const calls: FakeCalls = { activate: 0, complete: 0, fail: 0, error: 0 };

    const program = Effect.gen(function* () {
      const fiber = yield* Effect.forkChild(
        runWorkerLoop<void>({
          type: 'test-job',
          handler: () => Effect.fail(new RetryableJobError({ message: 'transient' })),
          pollInterval: '1 second',
          concurrency: 1,
        })
      );
      yield* TestClock.adjust('1 milli');
      const result = { fail: calls.fail, retries: calls.lastFailRetries, error: calls.error };
      yield* Fiber.interrupt(fiber);
      return result;
    }).pipe(
      Effect.provide(fakeCamunda(serveOnce(sampleJob({ retries: 3 })), calls)),
      Effect.provide(TestClock.layer())
    );

    const { fail, retries, error } = await Effect.runPromise(program);
    expect(fail).toBe(1);
    expect(retries).toBe(2);
    expect(error).toBe(0);
  });

  it('a terminal handler failure raises an incident via throwJobError', async () => {
    const calls: FakeCalls = { activate: 0, complete: 0, fail: 0, error: 0 };

    const program = Effect.gen(function* () {
      const fiber = yield* Effect.forkChild(
        runWorkerLoop<void>({
          type: 'test-job',
          handler: () => Effect.fail(new TerminalJobError({ code: 'BOOM', message: 'fatal' })),
          pollInterval: '1 second',
          concurrency: 1,
        })
      );
      yield* TestClock.adjust('1 milli');
      const result = { error: calls.error, code: calls.lastErrorCode, fail: calls.fail };
      yield* Fiber.interrupt(fiber);
      return result;
    }).pipe(Effect.provide(fakeCamunda(serveOnce(), calls)), Effect.provide(TestClock.layer()));

    const { error, code, fail } = await Effect.runPromise(program);
    expect(error).toBe(1);
    expect(code).toBe('BOOM');
    expect(fail).toBe(0);
  });

  it('a successful handler completes the job (createCamundaEffectWorker + Scope)', async () => {
    const calls: FakeCalls = { activate: 0, complete: 0, fail: 0, error: 0 };

    const program = Effect.gen(function* () {
      const worker = yield* createCamundaEffectWorker<{ ok: boolean }>({
        type: 'test-job',
        handler: () => Effect.succeed({ ok: true }),
        pollInterval: '1 second',
        concurrency: 1,
      });
      yield* TestClock.adjust('1 milli');
      const complete = calls.complete;
      yield* worker.interrupt;
      return complete;
    }).pipe(
      Effect.scoped,
      Effect.provide(fakeCamunda(serveOnce(), calls)),
      Effect.provide(TestClock.layer())
    );

    const complete = await Effect.runPromise(program);
    expect(complete).toBe(1);
  });
});
