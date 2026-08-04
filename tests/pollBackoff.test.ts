import { describe, expect, it } from 'vitest';
import {
  computePollBackoffMs,
  DEFAULT_POLL_BACKOFF_MAX_MS,
  DEFAULT_POLL_BACKOFF_MIN_MS,
  nextActivationRetryDelayMs,
} from '../src/runtime/pollBackoff';

describe('computePollBackoffMs', () => {
  const opts = (over: Partial<{ minMs: number; maxMs: number; rng: () => number }> = {}) => ({
    minMs: 1000,
    maxMs: 30_000,
    rng: () => 0,
    ...over,
  });

  it('returns the cap floor (cap/2) when rng() === 0', () => {
    // attempt 1: cap = min(30000, 1000*2^0) = 1000 → floor 500
    expect(computePollBackoffMs(1, opts())).toBe(500);
    // attempt 2: cap = 2000 → 1000
    expect(computePollBackoffMs(2, opts())).toBe(1000);
    // attempt 3: cap = 4000 → 2000
    expect(computePollBackoffMs(3, opts())).toBe(2000);
  });

  it('returns the full cap when rng() → ~1', () => {
    const rng = () => 0.999999;
    // attempt 1: cap 1000, delay ≈ 500 + 0.999999*500 ≈ 1000
    expect(computePollBackoffMs(1, opts({ rng }))).toBe(1000);
    // attempt 2: cap 2000, delay ≈ 2000
    expect(computePollBackoffMs(2, opts({ rng }))).toBe(2000);
  });

  it('grows exponentially then caps at maxMs', () => {
    // 1000,2000,4000,8000,16000, then capped at 30000 (32000 → 30000)
    expect(computePollBackoffMs(6, opts())).toBe(15_000); // cap 30000 → floor 15000
    expect(computePollBackoffMs(7, opts())).toBe(15_000); // still capped
    expect(computePollBackoffMs(50, opts())).toBe(15_000); // stays capped, no overflow
  });

  it('respects a custom min/max window', () => {
    const o = opts({ minMs: 100, maxMs: 800 });
    expect(computePollBackoffMs(1, o)).toBe(50); // cap 100
    expect(computePollBackoffMs(2, o)).toBe(100); // cap 200 → 100
    expect(computePollBackoffMs(3, o)).toBe(200); // cap 400 → 200
    expect(computePollBackoffMs(4, o)).toBe(400); // cap 800 → 400
    expect(computePollBackoffMs(5, o)).toBe(400); // capped at 800 → 400
  });

  it('keeps every delay within [cap/2, cap] for random jitter', () => {
    for (let attempt = 1; attempt <= 8; attempt++) {
      const cap = Math.min(
        DEFAULT_POLL_BACKOFF_MAX_MS,
        DEFAULT_POLL_BACKOFF_MIN_MS * 2 ** (attempt - 1)
      );
      for (let i = 0; i < 100; i++) {
        const d = computePollBackoffMs(attempt, opts({ rng: Math.random }));
        expect(d).toBeGreaterThanOrEqual(Math.floor(cap / 2));
        expect(d).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('returns 0 when minMs is 0 (backoff disabled)', () => {
    expect(computePollBackoffMs(1, opts({ minMs: 0, maxMs: 0 }))).toBe(0);
    expect(computePollBackoffMs(5, opts({ minMs: 0, maxMs: 0 }))).toBe(0);
  });

  it('clamps a sub-1 attempt to the first step', () => {
    expect(computePollBackoffMs(0, opts())).toBe(500);
    expect(computePollBackoffMs(-3, opts())).toBe(500);
  });

  it('never returns NaN/negative for degenerate inputs', () => {
    // NaN attempt → treated as the first step.
    expect(computePollBackoffMs(Number.NaN, opts())).toBe(500);
    // NaN min → treated as disabled (0), never NaN.
    expect(computePollBackoffMs(1, opts({ minMs: Number.NaN }))).toBe(0);
    // NaN max → falls back to min, still finite (default min 1000 → floor 500).
    expect(computePollBackoffMs(1, opts({ maxMs: Number.NaN }))).toBe(500);
    // An rng that returns NaN or values outside [0, 1) must be clamped so the
    // delay stays within [cap/2, cap] and never goes NaN/negative.
    for (const bad of [Number.NaN, -1, 2, Number.POSITIVE_INFINITY]) {
      const d = computePollBackoffMs(2, opts({ rng: () => bad }));
      expect(Number.isFinite(d)).toBe(true);
      expect(d).toBeGreaterThanOrEqual(1000); // cap 2000 → floor 1000
      expect(d).toBeLessThanOrEqual(2000);
    }
  });

  it('never exceeds the cap for fractional min/max windows', () => {
    // A fractional cap (e.g. 1000.5) rounded to an integer must not overshoot
    // the user-provided ceiling: round(1000.5) === 1001 would break the
    // documented "<= cap" contract, so min/max are normalised to integers.
    const o = opts({ minMs: 1000.5, maxMs: 1000.5, rng: () => 1 });
    const d = computePollBackoffMs(1, o);
    expect(Number.isInteger(d)).toBe(true);
    expect(d).toBeLessThanOrEqual(1000.5);
    expect(d).toBe(1000);
  });

  it('clamps an overflowing maxMs to a safe setTimeout ceiling', () => {
    // A maxMs beyond the 32-bit signed setTimeout limit (2^31 - 1 ms) would be
    // silently coerced to a ~1ms timeout by the runtime, reintroducing the tight
    // retry loop this helper exists to prevent. The result must stay finite and
    // within the safe timer range.
    const SAFE_MAX = 2_147_483_647;
    const o = opts({ minMs: 1000, maxMs: 1e21, rng: () => 1 });
    const d = computePollBackoffMs(50, o);
    expect(Number.isFinite(d)).toBe(true);
    expect(d).toBeLessThanOrEqual(SAFE_MAX);
    expect(d).toBeGreaterThan(0);
  });

  it('exposes sensible defaults', () => {
    expect(DEFAULT_POLL_BACKOFF_MIN_MS).toBe(1000);
    expect(DEFAULT_POLL_BACKOFF_MAX_MS).toBe(30_000);
  });
});

// The activation retry-delay decision is shared by JobWorker and
// ThreadedJobWorker via this helper, so a single unit test guards both
// implementations against drift without spawning worker threads.
describe('nextActivationRetryDelayMs', () => {
  const cfg = (
    over: Partial<{
      pollIntervalMs: number;
      pollBackoffMinMs: number;
      pollBackoffMaxMs: number;
    }> = {}
  ) => ({
    pollIntervalMs: 1,
    pollBackoffMinMs: 1000,
    pollBackoffMaxMs: 30_000,
    ...over,
  });

  it('applies capped exponential backoff while enabled', () => {
    // rng() === 0 makes each step deterministic (== cap/2).
    const rng = () => 0;
    expect(nextActivationRetryDelayMs(1, cfg(), rng)).toBe(500);
    expect(nextActivationRetryDelayMs(2, cfg(), rng)).toBe(1000);
    expect(nextActivationRetryDelayMs(3, cfg(), rng)).toBe(2000);
  });

  it('falls back to pollIntervalMs when backoff is disabled', () => {
    const disabled = cfg({ pollIntervalMs: 5, pollBackoffMinMs: 0, pollBackoffMaxMs: 0 });
    // Every attempt must reschedule at the poll interval, never a 0ms tight loop.
    expect(nextActivationRetryDelayMs(1, disabled)).toBe(5);
    expect(nextActivationRetryDelayMs(9, disabled)).toBe(5);
  });

  it('treats a negative backoff floor as disabled', () => {
    const disabled = cfg({ pollIntervalMs: 7, pollBackoffMinMs: -1 });
    expect(nextActivationRetryDelayMs(3, disabled)).toBe(7);
  });

  it('normalises the disabled-branch fallback to a non-negative integer', () => {
    // A fractional pollIntervalMs must round to an integer (contract: integer ms).
    expect(nextActivationRetryDelayMs(1, cfg({ pollIntervalMs: 4.7, pollBackoffMinMs: 0 }))).toBe(
      5
    );
    // Negative/NaN pollIntervalMs must never leak through to setTimeout as a
    // value it coerces to 0ms; they clamp/normalise to a non-negative integer.
    expect(nextActivationRetryDelayMs(1, cfg({ pollIntervalMs: -3, pollBackoffMinMs: 0 }))).toBe(0);
    const nan = nextActivationRetryDelayMs(
      1,
      cfg({ pollIntervalMs: Number.NaN, pollBackoffMinMs: 0 })
    );
    expect(Number.isInteger(nan)).toBe(true);
    expect(nan).toBeGreaterThanOrEqual(0);
  });

  it('forwards the injected rng to the backoff computation', () => {
    // rng → ~1 yields the full cap; matches computePollBackoffMs directly.
    const rng = () => 0.999999;
    expect(nextActivationRetryDelayMs(1, cfg(), rng)).toBe(
      computePollBackoffMs(1, { minMs: 1000, maxMs: 30_000, rng })
    );
  });
});
