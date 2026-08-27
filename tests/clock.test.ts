import { describe, expect, it, vi } from 'vitest';
import { createLiveClock, liveClock, MAX_TIMER_MS } from '../src/runtime/clock';

/**
 * A settable time source. `vi.useFakeTimers` cannot move time backwards, so the
 * backward-step behaviour needs a source the test controls directly.
 */
function settableSource(startMs: number): { read: () => number; set: (ms: number) => void } {
  let value = startMs;
  return {
    read: () => value,
    set: (ms) => {
      value = ms;
    },
  };
}

describe('live clock', () => {
  it('passes through forward movement', () => {
    const src = settableSource(1_000);
    const clock = createLiveClock(src.read);

    expect(clock.now()).toBe(1_000);
    src.set(31_000);
    expect(clock.now()).toBe(31_000);
  });

  it('never decreases when the source steps backwards', () => {
    const src = settableSource(3_600_000);
    const clock = createLiveClock(src.read);

    const before = clock.now();
    src.set(0);

    expect(clock.now()).toBe(before);
  });

  it('keeps advancing immediately after a backward step', () => {
    // A high-water clamp would report no progress at all until the source caught back
    // up, adding the full hour to every deadline in flight.
    const src = settableSource(3_600_000);
    const clock = createLiveClock(src.read);

    const before = clock.now();
    src.set(0);
    expect(clock.now()).toBe(before);

    src.set(5_000);
    const advanced = clock.now() - before;

    expect(advanced).toBeGreaterThan(4_500);
    expect(advanced).toBeLessThanOrEqual(5_000);
  });

  it('converges back to the source rather than staying ahead forever', () => {
    // A permanent offset keeps reported time ahead indefinitely, so any comparison
    // against a server-supplied absolute time stays wrong for the life of the process.
    const src = settableSource(600_000);
    const clock = createLiveClock(src.read);

    clock.now();
    src.set(0);
    expect(clock.now() - src.read()).toBe(600_000);

    let previous = clock.now();
    for (let i = 1; i <= 400; i++) {
      src.set(i * 30_000);
      const reported = clock.now();
      expect(reported).toBeGreaterThanOrEqual(previous);
      previous = reported;
    }

    expect(clock.now() - src.read()).toBe(0);
  });

  // The repayment is a fraction of each forward step. Taken per-call, a step smaller than
  // the divisor floors to zero, so a clock read often enough never repays anything and the
  // offset is permanent — the same failure as the naive permanent-offset approach. The
  // coarse test above cannot see this: its 30s steps are far larger than the divisor.
  it('converges under frequent small reads, not just coarse ones', () => {
    const src = settableSource(1_000);
    const clock = createLiveClock(src.read);

    clock.now();
    src.set(0);
    expect(clock.now() - src.read()).toBe(1_000);

    // 1ms per read, the granularity Date.now() actually reports under a busy loop.
    // Repaying 1000ms at 1/16 of forward progress needs 16s of it; 20s leaves headroom.
    for (let i = 1; i <= 20_000; i++) {
      src.set(i);
      clock.now();
    }

    expect(clock.now() - src.read()).toBe(0);
  });

  it('never decreases across a source that oscillates', () => {
    const src = settableSource(0);
    const clock = createLiveClock(src.read);

    let previous = clock.now();
    for (let i = 0; i < 2_000; i++) {
      src.set(i % 2 === 0 ? i * 1_000 : -i * 1_000);
      const reported = clock.now();
      expect(reported).toBeGreaterThanOrEqual(previous);
      previous = reported;
    }
  });
});

describe('live clock sleep', () => {
  it('resolves after the requested delay', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      let resolved = false;
      const pending = clock.sleep(5_000).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTimeAsync(4_999);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      await pending;
      expect(resolved).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects and clears the timer when the signal aborts', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      const controller = new AbortController();
      const pending = clock.sleep(60_000, controller.signal);

      controller.abort(new Error('cancelled'));

      await expect(pending).rejects.toThrow('cancelled');
      // Nothing left pending: an uncleared timer would still be counted here.
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects immediately if the signal is already aborted', async () => {
    const clock = createLiveClock();
    await expect(clock.sleep(1_000, AbortSignal.abort(new Error('already')))).rejects.toThrow(
      'already'
    );
  });

  // setTimeout stores its delay in a 32-bit int: anything above 2**31-1 overflows and
  // fires on the next tick, so a naive long sleep resolves immediately instead of waiting.
  it('chains timers past the 32-bit limit instead of firing immediately', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      let resolved = false;
      const overLimit = MAX_TIMER_MS + 5_000;
      const pending = clock.sleep(overLimit).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTimeAsync(MAX_TIMER_MS);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(4_999);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      await pending;
      expect(resolved).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('abandons a chained long sleep when the signal aborts mid-chain', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      const controller = new AbortController();
      const pending = clock.sleep(MAX_TIMER_MS * 2, controller.signal);

      await vi.advanceTimersByTimeAsync(MAX_TIMER_MS);
      controller.abort(new Error('cancelled'));

      await expect(pending).rejects.toThrow('cancelled');
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('live clock deadline', () => {
  it('aborts once the delay elapses', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      const { signal } = clock.deadline(1_000);

      expect(signal.aborted).toBe(false);
      await vi.advanceTimersByTimeAsync(1_000);
      expect(signal.aborted).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('releases the timer on dispose so an unused deadline does not linger', async () => {
    vi.useFakeTimers();
    try {
      const clock = createLiveClock();
      const { signal, dispose } = clock.deadline(600_000);

      dispose();
      expect(vi.getTimerCount()).toBe(0);

      await vi.advanceTimersByTimeAsync(600_000);
      expect(signal.aborted).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('default clock', () => {
  it('is a shared instance, not a factory', () => {
    // Consumers that skip injection must land on one clock, so a single absorbed backward
    // step is slewed once rather than independently per call site.
    expect(createLiveClock()).not.toBe(liveClock);
  });

  it('is non-decreasing', () => {
    expect(liveClock.now()).toBeLessThanOrEqual(liveClock.now());
  });

  /**
   * `liveClock` is constructed at module load. Defaulting the source to the bare `Date.now`
   * reference captures the real one, so the shared clock silently ignores a later fake-timer
   * install and freezes at its load-time reading — while every other caller of `Date.now()`
   * moves. Calling through keeps it in step with whatever `Date` is current.
   */
  it('follows a Date replaced after it was constructed', async () => {
    vi.useFakeTimers();
    try {
      const before = liveClock.now();
      await vi.advanceTimersByTimeAsync(1_000);

      expect(liveClock.now() - before).toBeGreaterThanOrEqual(900);
    } finally {
      vi.useRealTimers();
    }
  });
});
