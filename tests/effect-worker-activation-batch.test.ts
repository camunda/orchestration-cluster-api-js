import { Effect, Fiber, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { CamundaEffect, type CamundaEffectClient } from '../src/effect';
import { type EffectWorkerConfig, runWorkerLoop } from '../src/effect-worker';

// The worker must never lease more jobs per poll than it can process concurrently:
// jobs activated beyond `concurrency` would sit buffered in the stream while their
// server-side lock timeout counts down, risking lock expiry / duplicate delivery.
// This mirrors the Promise worker, which only activates up to its available headroom.
// These tests assert the *class* of defect — that the activation batch is capped to
// `concurrency` across a range of configs — not just one instance.

interface ActivateBody {
  maxJobsToActivate?: number;
}

function recordingCamunda(bodies: ActivateBody[]): Layer.Layer<CamundaEffect> {
  const client = {
    activateJobs: (body: ActivateBody) =>
      Effect.sync(() => {
        bodies.push(body);
        return { jobs: [] };
      }),
    completeJob: () => Effect.void,
    failJob: () => Effect.void,
    throwJobError: () => Effect.void,
  } as unknown as CamundaEffectClient;
  return Layer.succeed(CamundaEffect, client);
}

async function firstActivationBatch(
  config: Omit<EffectWorkerConfig<void>, 'handler'>
): Promise<number | undefined> {
  const bodies: ActivateBody[] = [];
  const program = Effect.gen(function* () {
    const fiber = yield* Effect.forkChild(
      runWorkerLoop<void>({ ...config, handler: () => Effect.void })
    );
    yield* TestClock.adjust('1 milli');
    yield* Fiber.interrupt(fiber);
    return bodies[0]?.maxJobsToActivate;
  }).pipe(Effect.provide(recordingCamunda(bodies)), Effect.provide(TestClock.layer()));
  return Effect.runPromise(program);
}

describe('Effect worker caps activation batch to handler concurrency', () => {
  it('caps maxJobsToActivate to a smaller numeric concurrency', async () => {
    expect(await firstActivationBatch({ type: 't', maxJobsToActivate: 10, concurrency: 3 })).toBe(
      3
    );
  });

  it('keeps maxJobsToActivate when it is already below concurrency', async () => {
    expect(await firstActivationBatch({ type: 't', maxJobsToActivate: 5, concurrency: 8 })).toBe(5);
  });

  it('caps the default batch to a smaller concurrency', async () => {
    // maxJobsToActivate defaults to 10; concurrency 2 must cap the lease batch to 2.
    expect(await firstActivationBatch({ type: 't', concurrency: 2 })).toBe(2);
  });

  it('does not cap when concurrency is unbounded', async () => {
    expect(
      await firstActivationBatch({ type: 't', maxJobsToActivate: 10, concurrency: 'unbounded' })
    ).toBe(10);
  });

  it('leaves the batch untouched when concurrency matches the batch (default coupling)', async () => {
    expect(await firstActivationBatch({ type: 't', maxJobsToActivate: 7 })).toBe(7);
  });
});
