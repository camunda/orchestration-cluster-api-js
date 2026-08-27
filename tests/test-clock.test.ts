import { describe, expect, it } from 'vitest';
import { createTestClock } from '../src/runtime/clock';

// The shared `Clock` clauses live in clock-contract.ts. These cover the behaviour that is
// specific to the test clock's virtual time, where a bad value is not a one-off wrong answer
// but a permanent corruption of every later reading.

describe('createTestClock virtual time integrity', () => {
  it('does not advance time for a sleep aborted before it settled', async () => {
    const clock = createTestClock({ start: 0 });
    const ac = new AbortController();

    const aborted = clock.sleep(10_000, ac.signal);
    ac.abort(new Error('cancelled'));
    await expect(aborted).rejects.toThrow('cancelled');

    // Let the auto-advance tick for the cancelled sleep fire.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(clock.now()).toBe(0);
    expect(clock.pending).toBe(0);
  });

  it('still advances for sleeps that were not aborted', async () => {
    const clock = createTestClock({ start: 0 });
    await clock.sleep(5_000);
    expect(clock.now()).toBe(5_000);
  });

  it.each([
    ['negative', -1],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects a %s sleep duration rather than poisoning virtual time', async (_label, ms) => {
    const clock = createTestClock({ start: 1_000 });
    await expect(clock.sleep(ms)).rejects.toThrow(RangeError);
    expect(clock.now()).toBe(1_000);
  });

  it.each([
    ['negative', -1],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects a %s advance rather than moving time backwards', async (_label, ms) => {
    const clock = createTestClock({ start: 1_000 });
    await expect(clock.advance(ms)).rejects.toThrow(RangeError);
    expect(clock.now()).toBe(1_000);
  });
});
