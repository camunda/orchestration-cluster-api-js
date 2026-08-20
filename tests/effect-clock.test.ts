import { Duration, Effect, Exit, Fiber, Option } from 'effect';
import { TestClock } from 'effect/testing';
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
      const fiber = yield* Effect.forkChild(poll);
      // Advance virtual time past the budget; the real wall clock does not move.
      yield* TestClock.adjust('30 seconds');
      return yield* Fiber.await(fiber);
    }).pipe(Effect.provide(TestClock.layer()));

    const exit = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const failure = Exit.findErrorOption(exit);
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
      const fiber = yield* Effect.forkChild(withTimeout(slow, '5 seconds'));
      yield* TestClock.adjust('5 seconds');
      return yield* Fiber.await(fiber);
    }).pipe(Effect.provide(TestClock.layer()));

    const exit = await Effect.runPromise(program);
    const realElapsed = Date.now() - realStart;

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const failure = Exit.findErrorOption(exit);
      expect(Option.isSome(failure)).toBe(true);
      if (Option.isSome(failure)) {
        expect(failure.value).toBeInstanceOf(EventualConsistencyTimeout);
      }
    }
    // 60s of virtual sleep never ran in real time.
    expect(realElapsed).toBeLessThan(5000);
  });
});

// Guards the message-formatting defect class: `Duration.Input` accepts non-string
// forms (millis-numbers, `[seconds, nanos]` tuples, `Duration` values). Building
// error text with `String(input)` degrades those to `[object Object]`; the
// combinators must render them human-readably via `Duration.format` instead.
describe('timeout messages render non-string durations human-readably (not [object Object])', () => {
  const messageOf = async (
    program: Effect.Effect<Exit.Exit<unknown, EventualConsistencyTimeout>>
  ) => {
    const exit = await Effect.runPromise(program.pipe(Effect.provide(TestClock.layer())));
    expect(Exit.isFailure(exit)).toBe(true);
    const failure = Exit.isFailure(exit) ? Exit.findErrorOption(exit) : Option.none();
    expect(Option.isSome(failure)).toBe(true);
    const err = Option.getOrThrow(failure);
    expect(err).toBeInstanceOf(EventualConsistencyTimeout);
    return (err as EventualConsistencyTimeout).message;
  };

  it('withTimeout: object-form (Duration value) renders as a readable unit, not [object Object]', async () => {
    const program = Effect.gen(function* () {
      // A `Duration` value — `String(Duration.seconds(5))` is literally
      // "[object Object]", the exact degradation this guards against.
      const fiber = yield* Effect.forkChild(withTimeout(Effect.never, Duration.seconds(5)));
      yield* TestClock.adjust('5 seconds');
      return yield* Fiber.await(fiber);
    });
    const msg = await messageOf(program);
    expect(msg).toContain('5s');
    expect(msg).not.toContain('[object Object]');
  });

  it('eventually: numeric (millis) waitUpTo renders as a readable unit', async () => {
    const program = Effect.gen(function* () {
      const poll = eventually(Effect.succeed(0), (n) => n > 0, { waitUpTo: 30000, interval: 1000 });
      const fiber = yield* Effect.forkChild(poll);
      yield* TestClock.adjust('30 seconds');
      return yield* Fiber.await(fiber);
    });
    const msg = await messageOf(program);
    expect(msg).toContain('30s');
    expect(msg).not.toContain('[object Object]');
  });
});
