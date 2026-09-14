import { Effect, Layer, Schedule, Stream } from 'effect';
import { describe, expect, it } from 'vitest';
import { CamundaEffect, type CamundaEffectClient } from '../src/effect';
import { activateJobsStream } from '../src/effect-worker';

/**
 * Terminal semantics of the dependent-presence guard on the Effect activation
 * path (issue #513).
 *
 * A generated `x-present-when` guard throws a `PresentWhenUnsupportedError` when a
 * dependent field (e.g. a lease token) was requested against a server that
 * predates the feature. That error is TERMINAL — retrying the same request
 * against the same server can never satisfy the contract. The plain and threaded
 * workers already stop on it; the Effect worker must not loop on it either, even
 * when the caller supplies an `activationRetrySchedule` that would otherwise retry
 * every failure.
 *
 * The Effect client narrows the thrown guard error into the `DomainError` channel
 * while preserving the original as `cause`, so these tests fail activation with a
 * `DomainError` carrying that `cause` and assert the activation is attempted
 * exactly once (no retry) — scoped to the CLASS of terminal guard error, not one
 * literal field.
 */

function terminalPresentWhenError(): unknown {
  // Shape the effect-client narrows a thrown guard error into: a tagged domain
  // error whose `cause` is the original terminal `PresentWhenUnsupportedError`.
  const cause = Object.assign(new Error('withLease requested but server returned no token'), {
    name: 'PresentWhenUnsupportedError' as const,
    nonRetryable: true as const,
  });
  return { _tag: 'CamundaGenericError', message: cause.message, cause };
}

function failingCamunda(counter: { n: number }, error: unknown): Layer.Layer<CamundaEffect> {
  const client = {
    activateJobs: () =>
      Effect.suspend(() => {
        counter.n += 1;
        return Effect.fail(error);
      }),
    completeJob: () => Effect.void,
    failJob: () => Effect.void,
    throwJobError: () => Effect.void,
  } as unknown as CamundaEffectClient;
  return Layer.succeed(CamundaEffect, client);
}

async function runActivationOnce(error: unknown): Promise<{ attempts: number; failed: boolean }> {
  const counter = { n: 0 };
  // A retry schedule that WOULD retry many times for a transient failure; the
  // terminal guard error must nonetheless stop after the first attempt.
  const program = activateJobsStream('t', {
    maxJobsToActivate: 1,
    activationRetrySchedule: Schedule.recurs(25),
  }).pipe(Stream.runHead, Effect.provide(failingCamunda(counter, error)));
  const exit = await Effect.runPromiseExit(program);
  return { attempts: counter.n, failed: exit._tag === 'Failure' };
}

describe('Effect worker treats the present-when guard error as terminal', () => {
  it('does not retry activation on a PresentWhenUnsupportedError despite a retry schedule', async () => {
    const { attempts, failed } = await runActivationOnce(terminalPresentWhenError());
    expect(attempts).toBe(1);
    expect(failed).toBe(true);
  });

  it('recognises the terminal error when it is the top-level error (no wrapping cause)', async () => {
    const bare = Object.assign(new Error('no token'), {
      name: 'PresentWhenUnsupportedError' as const,
      nonRetryable: true as const,
    });
    const { attempts, failed } = await runActivationOnce(bare);
    expect(attempts).toBe(1);
    expect(failed).toBe(true);
  });

  it('still retries a genuinely transient activation failure (control)', async () => {
    const counter = { n: 0 };
    const transient = { _tag: 'HttpError', status: 503, message: 'unavailable' };
    // Bound the retry so the control test terminates: succeed after a few attempts
    // would require a stateful mock; instead assert the transient error IS retried
    // (attempts > 1) under the same schedule, unlike the terminal case above.
    const program = activateJobsStream('t', {
      maxJobsToActivate: 1,
      activationRetrySchedule: Schedule.recurs(3),
    }).pipe(Stream.runHead, Effect.provide(failingCamunda(counter, transient)));
    await Effect.runPromiseExit(program);
    expect(counter.n).toBeGreaterThan(1);
  });
});
