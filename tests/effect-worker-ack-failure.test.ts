import { Effect, Fiber, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { CamundaEffect, type CamundaEffectClient, HttpError } from '../src/effect';
import { type Job, RetryableJobError, runWorkerLoop, TerminalJobError } from '../src/effect-worker';

// A per-job acknowledgement failure (completeJob / failJob / throwJobError raising a
// DomainError) must NOT tear down the whole worker. `CamundaEffectWorkerHandle.join`
// documents that the loop ends "only on a fatal, non-retryable activation error", and
// the Promise worker swallows per-job ack failures and keeps polling. The Effect worker
// must behave the same: a transient ack failure on one job is logged and the worker
// keeps activating and processing subsequent jobs.
//
// These tests assert the *class* of defect — that ack failure on ANY of the three
// acknowledgement paths (complete / fail / incident) does not stop the worker — not
// just one instance.

const sampleJob = (key: string): Job =>
  ({
    jobKey: key,
    type: 'test-job',
    retries: 3,
    leaseToken: null,
    variables: {},
    customHeaders: {},
    processInstanceKey: '10',
  }) as unknown as Job;

// Serve one distinct job per poll for `count` polls, then empty polls forever, so the
// worker processes jobs one at a time and must survive each ack failure to reach the next.
function servePerPoll(count: number): () => { jobs: Job[] } {
  let served = 0;
  return () => {
    if (served >= count) return { jobs: [] };
    served += 1;
    return { jobs: [sampleJob(String(served))] };
  };
}

type FailingAck = 'complete' | 'fail' | 'incident';

// Build a fake CamundaEffect whose chosen acknowledgement call always fails with a
// DomainError, and count how many activation polls the worker performs.
function ackFailingCamunda(
  failing: FailingAck,
  activations: () => { jobs: Job[] },
  counters: { activate: number }
): Layer.Layer<CamundaEffect> {
  const fail = Effect.fail(new HttpError({ status: 503, message: 'ack failed' }));
  const okOr = (which: FailingAck) => (failing === which ? fail : Effect.void);
  const client = {
    activateJobs: () =>
      Effect.sync(() => {
        counters.activate += 1;
        return activations();
      }),
    completeJob: () => okOr('complete'),
    failJob: () => okOr('fail'),
    throwJobError: () => okOr('incident'),
  } as unknown as CamundaEffectClient;
  return Layer.succeed(CamundaEffect, client);
}

// Drive the worker through three jobs whose ack always fails, then report how many
// polls it managed. If a per-job ack failure kills the worker, it dies after the first
// job and never reaches the later polls.
async function pollsSurvivingAckFailure(
  failing: FailingAck,
  handler: () => Effect.Effect<void, RetryableJobError | TerminalJobError>
): Promise<number> {
  const counters = { activate: 0 };
  const program = Effect.gen(function* () {
    const fiber = yield* Effect.forkChild(
      runWorkerLoop<void>({
        type: 'test-job',
        concurrency: 1,
        handler,
      })
    );
    // Non-empty polls proceed immediately; advance a little virtual time to let the
    // three job polls (and the trailing empty poll) run, then interrupt.
    yield* TestClock.adjust('1 milli');
    yield* Fiber.interrupt(fiber);
    return counters.activate;
  }).pipe(
    Effect.provide(ackFailingCamunda(failing, servePerPoll(3), counters)),
    Effect.provide(TestClock.layer())
  );
  return Effect.runPromise(program);
}

describe('Effect worker survives per-job acknowledgement failures', () => {
  it('keeps polling when completeJob fails', async () => {
    const polls = await pollsSurvivingAckFailure('complete', () => Effect.void);
    expect(polls).toBeGreaterThanOrEqual(3);
  });

  it('keeps polling when failJob fails', async () => {
    const polls = await pollsSurvivingAckFailure('fail', () =>
      Effect.fail(new RetryableJobError({ message: 'retry me' }))
    );
    expect(polls).toBeGreaterThanOrEqual(3);
  });

  it('keeps polling when throwJobError fails', async () => {
    const polls = await pollsSurvivingAckFailure('incident', () =>
      Effect.fail(new TerminalJobError({ code: 'BOOM', message: 'terminal' }))
    );
    expect(polls).toBeGreaterThanOrEqual(3);
  });
});
