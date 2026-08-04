import { describe, expect, it } from 'vitest';
import {
  computePollBackoffMs,
  DEFAULT_POLL_BACKOFF_MAX_MS,
  DEFAULT_POLL_BACKOFF_MIN_MS,
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

  it('exposes sensible defaults', () => {
    expect(DEFAULT_POLL_BACKOFF_MIN_MS).toBe(1000);
    expect(DEFAULT_POLL_BACKOFF_MAX_MS).toBe(30_000);
  });
});
