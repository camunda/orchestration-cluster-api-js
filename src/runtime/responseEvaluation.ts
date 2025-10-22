// Shared helper to evaluate a raw transport response (with throwOnError:false)
// and decide whether to throw a normalized error or return domain data.
// This centralizes the logic so generated client method wrappers stay terse.

interface EvalOptions {
  opId: string;
  buildBackpressureError?: (r: any) => Error | undefined;
}

export function evaluateSdkResponse(raw: any, opts: EvalOptions) {
  if (!raw || typeof raw !== 'object') return raw;
  // Support nested problem payload under raw.error without top-level status
  const status = raw.status || raw.response?.status || raw.error?.status;
  if (!status) {
    // No discernible HTTP status: unwrap data if present
    return raw.data !== undefined ? raw.data : raw;
  }
  const isCandidate = status === 429 || status === 503 || status === 500;
  if (isCandidate) {
    const err = opts.buildBackpressureError?.(raw);
    if (err) throw err;
  } else if (status >= 400) {
    // Non-candidate HTTP error: synthesize an HttpSdkError early for clearer stack
    const prob = raw.error && typeof raw.error === 'object' ? raw.error : raw;
    const msg = prob.title || prob.detail || prob.message || `HTTP ${status}`;
    const err: any = new Error(msg);
    err.name = 'HttpSdkError';
    err.status = status;
    err.operationId = opts.opId;
    for (const k of ['type', 'title', 'detail', 'instance'])
      if (prob[k] !== undefined) err[k] = prob[k];
    err.nonRetryable = true;
    throw err;
  }
  // Success (2xx / 3xx) path
  return raw.data !== undefined ? raw.data : raw;
}
