import { Cause, Effect, Exit, Fiber, Option, TestClock, TestContext } from 'effect';
import { describe, expect, it } from 'vitest';
import { EventualConsistencyTimeout, eventually, withTimeout } from '../src/effect';

// Guards the clock class: `eventually` / `withTimeout` run on the Effect `Clock`,
// so `TestClock.adjust` advances their eventual/timeout deterministically in
// *virtual* time. A large budget (30s / 60s) elapses without burning real wall
// clock — the failure mode that bit the readiness-probe harness (nano-ide#408)
// cannot occur here by construction.
describe('effect combinators are bounded by virtual time (TestClock)', () => {
  it('eventually times out deterministically under TestClock — no real-clock burn', async () => {
    const realStart = Date.now();

    const program = Effect.gen(function* () {
      // Always yields a value failing the predicate -> never converges.
      const poll = eventually(Effect.succeed(0), (n) => n > 0, {
        waitUpTo: '30 seconds',
        interval: '1 second',
      });
      const fiber = yield* Effect.fork(poll);
      // Advance virtual time past the budget; the real wall clock does not move.
      yield* TestClock.adjust('30 seconds');
      return yield* Fiber.await(fiber);
    }).pipe(Effect.provide(TestContext.TestContext));

    const exit = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const failure = Cause.failureOption(exit.cause);
      expect(Option.isSome(failure)).toBe(true);
      if (Option.isSome(failure)) {
        expect(failure.value).toBeInstanceOf(EventualConsistencyTimeout);
      }
    }
    // The whole 30s budget elapsed in virtual time; real time stayed tiny.
    expect(realElapsed).toBeLessThan(5000);
  });

  it('withTimeout interrupts a long-running effect in virtual time', async () => {
    const realStart = Date.now();

    const program = Effect.gen(function* () {
      const slow = Effect.sleep('60 seconds').pipe(Effect.as('done'));
      const fiber = yield* Effect.fork(withTimeout(slow, '5 seconds'));
      yield* TestClock.adjust('5 seconds');
      return yield* Fiber.await(fiber);
    }).pipe(Effect.provide(TestContext.TestContext));

    const exit = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const failure = Cause.failureOption(exit.cause);
      expect(Option.isSome(failure)).toBe(true);
      if (Option.isSome(failure)) {
        expect(failure.value).toBeInstanceOf(EventualConsistencyTimeout);
      }
    }
    // 60s of virtual sleep never ran in real time.
    expect(realElapsed).toBeLessThan(5000);
  });
});
