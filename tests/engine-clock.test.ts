import { describe, expect, it } from 'vitest';
import type { CamundaClient } from '../src';
import { createEngineClock, type EngineClockTarget } from '../src/runtime/clock';
import { describeClockContract } from './clock-contract';

// The target is declared structurally so `clock.ts` need not import the generated client.
// That only pays off if a real client still satisfies it, so pin that at compile time.
const _clientSatisfiesTarget: EngineClockTarget = {} as CamundaClient;
void _clientSatisfiesTarget;

/** Stands in for the engine: records pins so a test can assert on what it was told. */
function fakeEngine() {
  const pins: number[] = [];
  let resets = 0;
  const target: EngineClockTarget = {
    async pinClock(input) {
      pins.push(input.timestamp);
      return {};
    },
    async resetClock() {
      resets += 1;
      return {};
    },
  };
  return {
    target,
    pins,
    get resets() {
      return resets;
    },
  };
}

describeClockContract('createEngineClock', () => {
  const clock = createEngineClock(fakeEngine().target, { start: 1_000 });
  // `sleep` advances the engine itself, so the contract's advance hook has nothing to do.
  return { clock, advance: async () => {} };
});

describe('createEngineClock binds client cadence to engine time', () => {
  it('moves engine time forward instead of waiting out the duration', async () => {
    const engine = fakeEngine();
    const clock = createEngineClock(engine.target, { start: 1_000 });

    const startedReal = Date.now();
    await clock.sleep(60_000);

    // The point of the exercise: a minute of engine time, no real waiting.
    expect(clock.now()).toBe(61_000);
    expect(engine.pins).toEqual([61_000]);
    expect(Date.now() - startedReal).toBeLessThan(1_000);
  });

  it('drives a poll loop through engine time in real milliseconds', async () => {
    const engine = fakeEngine();
    const clock = createEngineClock(engine.target, { start: 0 });

    // The shape that burned a real 60s in CI: poll something that never becomes ready.
    const startedReal = Date.now();
    let polls = 0;
    while (clock.now() < 60_000) {
      polls += 1;
      await clock.sleep(1_000);
    }

    expect(polls).toBe(60);
    expect(clock.now()).toBe(60_000);
    expect(Date.now() - startedReal).toBeLessThan(5_000);
  });

  it('pins the engine to an absolute instant', async () => {
    const engine = fakeEngine();
    const clock = createEngineClock(engine.target, { start: 0 });

    await clock.pin(1_700_000_000_000);

    expect(clock.now()).toBe(1_700_000_000_000);
    expect(engine.pins).toEqual([1_700_000_000_000]);
  });

  it('never pins the engine backwards', async () => {
    const engine = fakeEngine();
    const clock = createEngineClock(engine.target, { start: 5_000 });

    await clock.pin(1_000);

    expect(clock.now()).toBe(5_000);
    // Already past that instant, so there is nothing to tell the engine.
    expect(engine.pins).toEqual([]);
  });

  describe('concurrent pins', () => {
    // `current` is read before the pin and written after it. Without serialisation two
    // overlapping callers compute from the same stale reading, so a late-resolving earlier
    // pin can land last and drag engine time backwards.
    it('applies overlapping sleeps in order and never moves time backwards', async () => {
      const order: number[] = [];
      const target: EngineClockTarget = {
        async pinClock(input) {
          // Longer jumps answer slower, so the naive version finishes on the earlier value.
          await new Promise((resolve) => setTimeout(resolve, input.timestamp > 2_000 ? 0 : 15));
          order.push(input.timestamp);
          return {};
        },
        async resetClock() {
          return {};
        },
      };
      const clock = createEngineClock(target, { start: 0 });

      await Promise.all([clock.sleep(5_000), clock.sleep(1_000)]);

      expect(clock.now()).toBe(5_000);
      expect(order).toEqual([...order].sort((a, b) => a - b));
    });

    it('settles overlapping sleeps on the later wake point rather than summing them', async () => {
      const engine = fakeEngine();
      const clock = createEngineClock(engine.target, { start: 0 });

      // Two 1s sleeps that overlap are 1s of elapsed time, exactly as on a real clock.
      await Promise.all([clock.sleep(1_000), clock.sleep(1_000)]);

      expect(clock.now()).toBe(1_000);
    });

    it('keeps working after a failed pin', async () => {
      let failNext = true;
      const target: EngineClockTarget = {
        async pinClock() {
          if (failNext) {
            failNext = false;
            throw new Error('engine unreachable');
          }
          return {};
        },
        async resetClock() {
          return {};
        },
      };
      const clock = createEngineClock(target, { start: 0 });

      await expect(clock.sleep(1_000)).rejects.toThrow('engine unreachable');
      await clock.sleep(1_000);

      expect(clock.now()).toBe(1_000);
    });
  });

  it('releases the engine on reset', async () => {
    const engine = fakeEngine();
    const clock = createEngineClock(engine.target, { start: 0 });

    await clock.reset();

    expect(engine.resets).toBe(1);
  });

  it('surfaces a failed pin rather than reporting time the engine never adopted', async () => {
    const clock = createEngineClock(
      {
        pinClock: () => Promise.reject(new Error('engine unreachable')),
        resetClock: async () => ({}),
      },
      { start: 1_000 }
    );

    await expect(clock.sleep(1_000)).rejects.toThrow('engine unreachable');
    expect(clock.now()).toBe(1_000);
  });
});
