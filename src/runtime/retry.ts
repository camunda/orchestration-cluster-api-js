// Generic HTTP retry abstraction.
// Allows pluggable strategy via CamundaClient.configure in future.
import type { Logger } from './logger';

export interface RetryContext {
  attempt: number; // 1-based
  maxAttempts: number;
  lastError?: any;
}

export type RetryStrategy = <T>(
  op: () => Promise<T>,
  classify?: (err: any) => RetryClassification
) => Promise<T>;

export type RetryClassification =
  | { retryable: true; reason: string }
  | { retryable: false; reason: string };

export interface HttpRetryPolicy {
  maxAttempts: number; // total attempts including first
  baseDelayMs: number; // initial backoff
  maxDelayMs: number; // cap
}

/** Per-call options for individual SDK method invocations. */
export interface OperationOptions {
  /** Override retry behaviour for this call.
   *  - Pass `false` to disable retry entirely (single attempt).
   *  - Pass a partial policy to override specific fields (merged with global config).
   */
  retry?: Partial<HttpRetryPolicy> | false;
}

export interface CreateRetryOptions {
  policy: HttpRetryPolicy;
  logger?: Logger;
  onAttempt?(info: { attempt: number; nextDelayMs: number; reason: string }): void;
  random?: () => number; // for test determinism
}

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
    if (err.nonRetryable) {
      const status = err.status || err.response?.status;
      const title = err.title || err.response?.data?.title;
      const detail = err.detail || err.response?.data?.detail;
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
    const status = err.status || err.response?.status;
    if (status === 429) return { retryable: true, reason: 'http-429' }; // always retry 429
    const title = err.title || err.response?.data?.title;
    const detail = err.detail || err.response?.data?.detail;
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
