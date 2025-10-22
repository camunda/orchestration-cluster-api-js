// Generic HTTP retry abstraction with default p-retry implementation.
// Allows pluggable strategy via CamundaClient.configure in future.
import type { Logger } from './logger';

export interface RetryContext {
  attempt: number; // 1-based
  maxAttempts: number;
  lastError?: any;
}

export interface RetryStrategy {
  <T>(op: () => Promise<T>, classify?: (err: any) => RetryClassification): Promise<T>;
}

export type RetryClassification =
  | { retryable: true; reason: string }
  | { retryable: false; reason: string };

export interface HttpRetryPolicy {
  maxAttempts: number; // total attempts including first
  baseDelayMs: number; // initial backoff
  maxDelayMs: number; // cap
}

export interface CreateRetryOptions {
  policy: HttpRetryPolicy;
  logger?: Logger;
  onAttempt?(info: { attempt: number; nextDelayMs: number; reason: string }): void;
  random?: () => number; // for test determinism
}

// Lightweight internal implementation (no dependency) if p-retry not desirable.
// We will still default to dynamic import of p-retry to leverage proven logic, but
// fall back to this if import fails (e.g., bundle exclusion).
async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function createRetryExecutor(opts: CreateRetryOptions): RetryStrategy {
  const rand = opts.random || Math.random;
  return async function execute<T>(
    op: () => Promise<T>,
    classify?: (err: any) => RetryClassification
  ): Promise<T> {
    const { maxAttempts, baseDelayMs, maxDelayMs } = opts.policy;
    let attempt = 0;
    let lastErr: any;
    while (attempt < maxAttempts) {
      attempt++;
      try {
        return await op();
      } catch (e: any) {
        lastErr = e;
        if (attempt >= maxAttempts) break;
        const decision = classify ? classify(e) : defaultHttpClassifier(e);
        if (!decision.retryable) break;
        // exponential backoff with full jitter
        const exp = baseDelayMs * 2 ** (attempt - 1);
        const cap = Math.min(exp, maxDelayMs);
        const delay = Math.floor(rand() * cap);
        try {
          opts.onAttempt?.({ attempt, nextDelayMs: delay, reason: decision.reason });
          opts.logger?.trace(() => [
            'http.retry.scheduled',
            { attempt: attempt + 1, max: maxAttempts, delayMs: delay, reason: decision.reason },
          ]);
        } catch {
          /* swallow logging errors */
        }
        await sleep(delay);
      }
    }
    throw lastErr;
  };
}

// Default classifier: network errors, fetch AbortError? (not retry), and HTTP 429/503.
export function defaultHttpClassifier(err: any): RetryClassification {
  // Fetch network error heuristic: TypeError with failed to fetch / network error messages
  if (err) {
    // Some generated method wrappers may pessimistically mark errors nonRetryable before
    // we have a chance to refine classification. We still want to treat broker backpressure
    // signals (RESOURCE_EXHAUSTED) as retryable even if flagged nonRetryable upstream.
    if ((err as any).nonRetryable) {
      const status = (err as any).status || (err as any).response?.status;
      const title = (err as any).title || (err as any).response?.data?.title;
      const detail = (err as any).detail || (err as any).response?.data?.detail;
      if (
        status === 500 &&
        ((typeof title === 'string' && /RESOURCE_EXHAUSTED/.test(title)) ||
          (typeof detail === 'string' && /RESOURCE_EXHAUSTED/.test(detail)))
      ) {
        return { retryable: true, reason: 'backpressure-500-title' };
      }
      return { retryable: false, reason: 'explicit-non-retryable' };
    }
    const msg = (err.message || '').toLowerCase();
    if (err.name === 'TypeError' && (msg.includes('fetch') || msg.includes('network'))) {
      return { retryable: true, reason: 'network-error' };
    }
    const status = (err as any).status || (err as any).response?.status;
    if (status === 429) return { retryable: true, reason: 'http-429' }; // always retry 429
    const title = (err as any).title || (err as any).response?.data?.title;
    const detail = (err as any).detail || (err as any).response?.data?.detail;
    if (status === 503) {
      if (title === 'RESOURCE_EXHAUSTED') return { retryable: true, reason: 'backpressure-503' };
      return { retryable: false, reason: 'http-503-non-backpressure' };
    }
    if (status === 500) {
      if (
        (typeof detail === 'string' && /RESOURCE_EXHAUSTED/.test(detail)) ||
        (typeof title === 'string' && /RESOURCE_EXHAUSTED/.test(title))
      ) {
        return { retryable: true, reason: 'backpressure-500-detail' };
      }
      return { retryable: false, reason: 'http-500' };
    }
  }
  return { retryable: false, reason: 'non-retryable' };
}

// Dynamic p-retry wrapper (attempts = policy.maxAttempts). Only used if available.
export async function executeWithPRetry<T>(
  fn: () => Promise<T>,
  policy: HttpRetryPolicy,
  classify: (err: any) => RetryClassification,
  onAttempt?: (info: { attempt: number; nextDelayMs: number; reason: string }) => void,
  logger?: Logger
): Promise<T> {
  try {
    const mod: any = await import('p-retry');
    const pRetry = mod.default || mod;
    let attempt = 0;
    // Wrap the user fn so we can classify BEFORE p-retry decides to schedule another attempt.
    const wrapped = async () => {
      try {
        return await fn();
      } catch (e) {
        const classification = classify(e);
        if (!classification.retryable) {
          // Abort immediately; p-retry will not perform further attempts.
          throw new pRetry.AbortError(e);
        }
        // Attach reason for logging in onFailedAttempt without re-classifying.
        (e as any).__retryReason = classification.reason;
        throw e;
      }
    };
    return await pRetry(wrapped, {
      retries: policy.maxAttempts - 1,
      onFailedAttempt: (err: any) => {
        attempt = err.attemptNumber; // 1-based
        const original = err.originalError || err;
        const reason = original.__retryReason || classify(original).reason;
        // Compute next delay similar to our fallback (exponential full jitter)
        const exp = policy.baseDelayMs * 2 ** (attempt - 1);
        const cap = Math.min(exp, policy.maxDelayMs);
        const nextDelay = Math.floor(Math.random() * cap);
        onAttempt?.({ attempt, nextDelayMs: nextDelay, reason });
        logger?.trace(() => [
          'http.retry.scheduled',
          {
            attempt: attempt + 1,
            max: policy.maxAttempts,
            delayMs: nextDelay,
            reason,
          },
        ]);
      },
      factor: 2,
      minTimeout: policy.baseDelayMs,
      maxTimeout: policy.maxDelayMs,
      randomize: true,
      forever: false,
      // We manage abort by throwing classification check above
    });
  } catch {
    // Fallback to internal executor if p-retry missing
    const exec = createRetryExecutor({ policy, logger, onAttempt });
    return exec(fn, classify);
  }
}

export async function executeWithHttpRetry<T>(
  fn: () => Promise<T>,
  policy: HttpRetryPolicy,
  logger?: Logger,
  classify: (err: any) => RetryClassification = defaultHttpClassifier,
  onAttempt?: (info: { attempt: number; nextDelayMs: number; reason: string }) => void
): Promise<T> {
  // Use internal executor directly for deterministic single-attempt behavior on non-retryable errors.
  const exec = createRetryExecutor({ policy, logger, onAttempt });
  return exec(fn, classify);
}
