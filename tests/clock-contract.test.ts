import { createLiveClock, createTestClock } from '../src/runtime/clock';
import { describeClockContract } from './clock-contract';

// Every `Clock` implementation in the repo is checked against the same contract. Adding an
// implementation without adding it here is the gap that let three broken clocks reach review
// in #476 — see #478.

describeClockContract('createLiveClock', () => ({
  clock: createLiveClock(),
  advance: (ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
}));

describeClockContract('createTestClock (autoAdvance)', () => {
  const clock = createTestClock({ start: 1_000 });
  return { clock, advance: (ms) => clock.advance(ms) };
});

describeClockContract('createTestClock (manual)', () => {
  const clock = createTestClock({ start: 1_000, autoAdvance: false });
  return { clock, advance: (ms) => clock.advance(ms) };
});
