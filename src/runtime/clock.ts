/**
 * The clock all SDK runtime cadence resolves through — worker poll loops, eventual
 * consistency polling, retry backoff, backpressure decay and auth refresh.
 *
 * Pinning this pins the client's own timing, which is what makes those loops testable
 * without waiting for real time. See the cross-SDK contract in
 * camunda/orchestration-cluster-api-js#450.
 *
 * Generalises the two seams that already existed: `CollectClock` in `typedVariables.ts`
 * and the injected `now`/`sleep` on `BackpressureManager`.
 */
export interface Clock {
  /** Current wall-clock time in epoch milliseconds. */
  now(): number;

  /**
   * Resolve after `ms` have elapsed on this clock.
   *
   * Rejects with the signal's reason if `signal` aborts first, so a caller can cancel a
   * wait without leaving the timer behind.
   */
  sleep(ms: number, signal?: AbortSignal): Promise<void>;

  /**
   * A signal that aborts once `ms` have elapsed on this clock.
   *
   * `dispose()` releases the underlying timer; call it when the guarded work finishes
   * early, or a long deadline keeps a handle alive for its full duration.
   */
  deadline(ms: number): { signal: AbortSignal; dispose: () => void };
}

/**
 * Fraction of forward progress used to pay down an absorbed backward step: 1/16, so
 * reported time runs at 15/16 of the true rate until it has converged.
 */
const SLEW_DIVISOR = 16;

/**
 * Largest delay `setTimeout` can hold: it stores the delay as a signed 32-bit int, and
 * anything larger overflows and fires on the next tick. Longer waits are chained.
 */
export const MAX_TIMER_MS = 2_147_483_647;

/**
 * Schedule `onElapsed` after `ms`, chaining timers so durations beyond the 32-bit limit
 * wait for the full period instead of firing immediately.
 *
 * Returns a canceller; the live timer handle is swapped as the chain advances, so callers
 * must cancel through this rather than holding a handle.
 */
function scheduleLong(ms: number, onElapsed: () => void): () => void {
  let remaining = Math.max(0, ms);
  let timer: ReturnType<typeof setTimeout>;

  const step = (): void => {
    const slice = Math.min(remaining, MAX_TIMER_MS);
    remaining -= slice;
    timer = setTimeout(remaining > 0 ? step : onElapsed, slice);
  };

  step();
  return () => clearTimeout(timer);
}

/**
 * The live clock: the platform clock, made non-decreasing and self-correcting.
 *
 * This is the single place the SDK runtime is allowed to read ambient time or use a
 * platform timer. Everything else takes a `Clock`.
 *
 * Ruling 2a requires three properties together, and the C# pilot shipped three
 * implementations that each satisfied only two:
 *
 * - **Never decreases.** Wall clocks step backwards (NTP correction, VM resume, manual
 *   change), and a deadline measured across a backward step waits longer than asked.
 * - **Keeps advancing immediately after a step.** Clamping to a high-water mark satisfies
 *   the first property but freezes logical time for the *whole* duration of the
 *   correction, so an hour-long step adds an hour to every deadline in flight — the very
 *   damage the rule exists to prevent.
 * - **Converges back.** Absorbing the step into a permanent offset satisfies the first two
 *   but leaves reported time ahead of true time forever, so any comparison against a
 *   server-supplied absolute time is wrong for the life of the process.
 *
 * A backward step is therefore absorbed and then repaid gradually out of forward
 * progress, the way NTP slews rather than steps.
 *
 * @param source injectable purely so the slew behaviour itself is testable; production
 * callers use the default.
 */
export function createLiveClock(source: () => number = Date.now): Clock {
  let lastSource = source();
  let offsetMs = 0;
  // Forward progress not yet large enough to repay a whole millisecond. Without this,
  // reads closer together than the divisor floor to zero repayment and never converge.
  let slewCreditMs = 0;

  const now = (): number => {
    const observed = source();

    if (observed < lastSource) {
      offsetMs += lastSource - observed;
    } else if (offsetMs > 0) {
      slewCreditMs += observed - lastSource;
      const repay = Math.floor(slewCreditMs / SLEW_DIVISOR);
      if (repay > 0) {
        slewCreditMs -= repay * SLEW_DIVISOR;
        offsetMs -= Math.min(offsetMs, repay);
      }
    }

    lastSource = observed;
    return observed + offsetMs;
  };

  const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      if (signal?.aborted) {
        reject(signal.reason);
        return;
      }

      const cancel = scheduleLong(ms, () => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      });

      function onAbort(): void {
        cancel();
        reject(signal?.reason);
      }

      signal?.addEventListener('abort', onAbort, { once: true });
    });

  const deadline = (ms: number): { signal: AbortSignal; dispose: () => void } => {
    const controller = new AbortController();
    const cancel = scheduleLong(ms, () =>
      controller.abort(new DOMException(`Timed out after ${ms}ms`, 'TimeoutError'))
    );
    return { signal: controller.signal, dispose: cancel };
  };

  return { now, sleep, deadline };
}

/** The clock used when none is injected. */
export const liveClock: Clock = createLiveClock();
