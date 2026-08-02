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
    // No discernible HTTP status. Since the generated client wraps the `fetch`
    // call in a try/catch (>= v10.0.0-alpha.18) and, with throwOnError:false,
    // *returns* `{ error, response: undefined }` on a transport failure instead
    // of rejecting, a status-less `raw` with an `error` and no `data` is a
    // transport/connection error (DNS, ECONNREFUSED, unreachable host, TLS).
    // It must surface as a rejection, not be unwrapped as success. See issue
    // camunda/orchestration-cluster-api-js#405.
    if (raw.error !== undefined && raw.data === undefined) {
      const e = raw.error;
      if (e instanceof Error) throw e;
      const err: any = new Error(String(e?.message ?? e ?? `transport error [${opts.opId}]`));
      err.name = 'TransportSdkError';
      err.operationId = opts.opId;
      err.cause = e;
      throw err;
    }
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
    let msg = prob.title || prob.detail || prob.message || `HTTP ${status}`;
    if (prob.title && prob.detail && prob.title !== prob.detail) {
      msg = `${prob.title} [${opts.opId}]: ${prob.detail}`;
    }
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
