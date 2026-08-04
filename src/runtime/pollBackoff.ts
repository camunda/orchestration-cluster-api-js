/**
 * Capped exponential backoff with equal jitter for job-worker activation retries.
 *
 * Job workers long-poll the broker for work. When an activation request fails at
 * the transport level (connection refused, connect timeout, DNS/LAN blip, a
 * broker restart, …) the worker must retry — but retrying on a flat, sub-millisecond
 * interval turns a transient outage into a tight error loop that floods logs and
 * hammers the (already unreachable) endpoint. Instead, each *consecutive* failure
 * backs off exponentially up to a cap, with jitter so a fleet of workers that all
 * lost connectivity at the same instant does not reconnect in lockstep (a
 * thundering herd). The backoff resets to zero the moment a poll succeeds.
 */

/** Default floor of the backoff window (first retry ≈ 0.5–1s). */
export const DEFAULT_POLL_BACKOFF_MIN_MS = 1000;
/** Default ceiling of the backoff window. */
export const DEFAULT_POLL_BACKOFF_MAX_MS = 30_000;

export interface PollBackoffOptions {
  /** Base delay in ms; the first retry's cap. */
  minMs: number;
  /** Maximum delay in ms; the backoff never exceeds this. */
  maxMs: number;
  /**
   * Injectable RNG for deterministic tests; defaults to `Math.random` (which
   * yields `[0, 1)`). Any returned value is clamped to `[0, 1]`, so an injected
   * `1` is accepted and maps to the inclusive upper bound of the jitter window.
   */
  rng?: () => number;
}

/**
 * Compute the delay (ms) before the next activation retry.
 *
 * Uses capped exponential growth with *equal jitter*: for a 1-based `attempt`,
 * the cap is `min(maxMs, minMs * 2^(attempt-1))` and the returned delay is a
 * uniformly random value in `[cap/2, cap]`. Equal jitter (rather than full
 * jitter from 0) guarantees a non-trivial floor so retries always slow down,
 * while still de-synchronising concurrent workers.
 *
 * @param attempt 1-based count of consecutive failures (1 = first failure).
 * @returns a non-negative integer delay in milliseconds.
 */
export function computePollBackoffMs(attempt: number, opts: PollBackoffOptions): number {
  const rng = opts.rng ?? Math.random;
  // Defensively normalise every input. This helper is fed user-provided config
  // (`pollBackoffMinMs`/`pollBackoffMaxMs`) and an injectable rng, any of which
  // could be NaN, negative, or out of range. A NaN/negative delay would be
  // coerced by setTimeout to 0, reintroducing the very tight retry loop this
  // helper exists to prevent — so we clamp to guarantee a finite, non-negative
  // integer result.
  const min = Number.isFinite(opts.minMs) ? Math.max(0, opts.minMs) : 0;
  const max = Number.isFinite(opts.maxMs) ? Math.max(min, opts.maxMs) : min;
  const safeAttempt = Number.isFinite(attempt) ? Math.max(1, Math.floor(attempt)) : 1;
  // 2^(safeAttempt-1) can overflow to Infinity for absurd attempt counts; the
  // Math.min against `max` still yields a finite cap, so no explicit guard is
  // needed — but clamp the exponent anyway to avoid pointless huge intermediates.
  const exponent = Math.min(safeAttempt - 1, 53);
  const cap = Math.min(max, min * 2 ** exponent);
  const half = cap / 2;
  // An injected rng may return NaN or a value outside [0, 1]; clamp it to
  // [0, 1] so the jitter can never push the delay negative or to NaN.
  const r = rng();
  const jitter = Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
  return Math.round(half + jitter * half);
}

/** Subset of worker config that governs activation-retry scheduling. */
export interface ActivationRetryDelayConfig {
  /** Normal poll cadence; also the fallback delay when backoff is disabled. */
  pollIntervalMs: number;
  /** Backoff floor. `<= 0` disables backoff (fall back to `pollIntervalMs`). */
  pollBackoffMinMs: number;
  /** Backoff ceiling. */
  pollBackoffMaxMs: number;
}

/**
 * Decide the delay (ms) before the next activation retry given a `attempt`-long
 * streak of consecutive failures.
 *
 * This is the single source of truth shared by {@link JobWorker} and
 * {@link ThreadedJobWorker} so their retry-scheduling behaviour cannot drift.
 * When backoff is disabled (`pollBackoffMinMs <= 0`) it falls back to the normal
 * poll interval rather than 0 — a 0ms reschedule would spin an even tighter
 * retry loop than the old behaviour, the opposite of what "disable" should mean.
 *
 * @param attempt 1-based count of consecutive failures (1 = first failure).
 * @param cfg worker retry-scheduling config.
 * @param rng optional injectable RNG forwarded to {@link computePollBackoffMs}.
 * @returns a non-negative delay in milliseconds.
 */
export function nextActivationRetryDelayMs(
  attempt: number,
  cfg: ActivationRetryDelayConfig,
  rng?: () => number
): number {
  if (cfg.pollBackoffMinMs > 0) {
    return computePollBackoffMs(attempt, {
      minMs: cfg.pollBackoffMinMs,
      maxMs: cfg.pollBackoffMaxMs,
      rng,
    });
  }
  return cfg.pollIntervalMs;
}
