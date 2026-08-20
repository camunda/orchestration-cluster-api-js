import { Effect, Fiber, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { CamundaEffect, type CamundaEffectClient, HttpError } from '../src/effect';
import { type Job, runWorkerLoop } from '../src/effect-worker';

// An *unexpected handler defect* (an untyped throw / `Effect.die`, NOT a typed
// RetryableJobError / TerminalJobError) must not be silently swallowed by the worker
// loop, leaving the job unacknowledged until its server-side lock expires (risking
// duplicate delivery). The Promise worker catches handler exceptions and immediately
// `failJob`s with `retries - 1` (src/runtime/jobWorker.ts). The Effect worker must
// behave the same: translate the defect into a best-effort failJob(retries - 1) and
// keep polling.
//
// These tests assert the *class* of behaviour — that ANY handler defect shape (a
// synchronous throw or an explicit `Effect.die`) routes to failJob with the
// decremented retry count — not just one instance.

const sampleJob = (key: string, retries = 3): Job =>
  ({
    jobKey: key,
    type: 'test-job',
    retries,
    leaseToken: null,
    variables: {},
    customHeaders: {},
    processInstanceKey: '10',
  }) as unknown as Job;

// Serve one distinct job per poll for `count` polls, then empty polls forever.
function servePerPoll(count: number): () => { jobs: Job[] } {
  let served = 0;
  return () => {
    if (served >= count) return { jobs: [] };
    served += 1;
    return { jobs: [sampleJob(String(served))] };
  };
}

interface Recorded {
  activate: number;
  complete: number;
  failJobCalls: Array<{ jobKey: string; retries: number }>;
}

// Build a fake CamundaEffect that records failJob invocations and activation polls.
// When `failJobFails` is set, failJob itself raises a DomainError (to prove the defect
// path is best-effort and still does not tear down the worker).
function recordingCamunda(
  activations: () => { jobs: Job[] },
  rec: Recorded,
  failJobFails = false
): Layer.Layer<CamundaEffect> {
  const client = {
    activateJobs: () =>
      Effect.sync(() => {
        rec.activate += 1;
        return activations();
      }),
    completeJob: () =>
      Effect.sync(() => {
        rec.complete += 1;
      }),
    failJob: (req: { jobKey: string; retries: number }) =>
      failJobFails
        ? Effect.fail(new HttpError({ status: 503, message: 'failJob failed' }))
        : Effect.sync(() => {
            rec.failJobCalls.push({ jobKey: req.jobKey, retries: req.retries });
          }),
    throwJobError: () => Effect.void,
  } as unknown as CamundaEffectClient;
  return Layer.succeed(CamundaEffect, client);
}

// Drive the worker through three jobs whose handler produces `defect`, then report the
// recorded interactions. If the defect kills the worker, it dies after the first job
// and never reaches the later polls.
async function runWithDefect(
  handler: () => Effect.Effect<void, never>,
  failJobFails = false
): Promise<Recorded> {
  const rec: Recorded = { activate: 0, complete: 0, failJobCalls: [] };
  const program = Effect.gen(function* () {
    const fiber = yield* Effect.forkChild(
      runWorkerLoop<void>({
        type: 'test-job',
        concurrency: 1,
        handler,
      })
    );
    yield* TestClock.adjust('1 milli');
    yield* Fiber.interrupt(fiber);
    return rec;
  }).pipe(
    Effect.provide(recordingCamunda(servePerPoll(3), rec, failJobFails)),
    Effect.provide(TestClock.layer())
  );
  return Effect.runPromise(program);
}

describe('Effect worker translates handler defects into a best-effort failJob', () => {
  it('fails the job with retries - 1 when the handler throws synchronously', async () => {
    const rec = await runWithDefect(() =>
      Effect.sync(() => {
        throw new Error('handler boom');
      })
    );
    expect(rec.activate).toBeGreaterThanOrEqual(3); // worker survived every defect
    expect(rec.complete).toBe(0); // no job was completed
    expect(rec.failJobCalls.length).toBeGreaterThanOrEqual(3);
    for (const call of rec.failJobCalls) {
      expect(call.retries).toBe(2); // sampleJob.retries (3) - 1
    }
  });

  it('fails the job with retries - 1 when the handler uses Effect.die', async () => {
    const rec = await runWithDefect(() => Effect.die(new Error('died')));
    expect(rec.activate).toBeGreaterThanOrEqual(3);
    expect(rec.complete).toBe(0);
    expect(rec.failJobCalls.length).toBeGreaterThanOrEqual(3);
    for (const call of rec.failJobCalls) {
      expect(call.retries).toBe(2);
    }
  });

  it('keeps polling even when the best-effort failJob itself fails', async () => {
    const rec = await runWithDefect(
      () =>
        Effect.sync(() => {
          throw new Error('handler boom');
        }),
      true
    );
    expect(rec.activate).toBeGreaterThanOrEqual(3);
  });
});
