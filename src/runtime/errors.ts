// Unified SDK error typing utilities.
// Goal: Allow user code to discriminate errors in catch blocks with strong typing.

// RFC 9457 / RFC 7807 style Problem Details passthrough (type, title, status, detail, instance)
export interface HttpSdkError extends Error {
  status: number;
  operationId?: string;
  retries?: { attempt: number; max: number };
  cause?: unknown;
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
  // marker for type guard
  name: 'HttpSdkError';
}

export interface ValidationSdkError extends Error {
  side: 'request' | 'response';
  operationId: string;
  issues?: unknown;
  name: 'ValidationSdkError';
}

export interface AuthSdkError extends Error {
  status?: number;
  cause?: unknown;
  name: 'AuthSdkError';
}

export interface NetworkSdkError extends Error {
  cause?: unknown;
  name: 'NetworkSdkError';
}

export interface CancelSdkError extends Error {
  operationId?: string;
  name: 'CancelSdkError';
}

export type SdkError =
  | HttpSdkError
  | ValidationSdkError
  | AuthSdkError
  | NetworkSdkError
  | CancelSdkError;

export function isSdkError(e: unknown): e is SdkError {
  return (
    !!e &&
    typeof e === 'object' &&
    'name' in e &&
    [
      'HttpSdkError',
      'ValidationSdkError',
      'AuthSdkError',
      'NetworkSdkError',
      'CancelSdkError',
    ].includes((e as any).name)
  );
}

// Attempt to classify any thrown value to a stable SdkError.
export function normalizeError(err: unknown, ctx?: { opId?: string }): SdkError {
  if (isSdkError(err)) return err as SdkError;
  const e: any = err || {};
  // Explicit cancellation (AbortController / manual cancel) classification FIRST so we don't
  // downgrade into generic NetworkSdkError.
  if (
    e?.name === 'AbortError' ||
    e?.name === 'CancelError' ||
    e?.name === 'CancelSdkError' ||
    e?.code === 'ABORT_ERR' ||
    /aborted|abort|cancelled|canceled/i.test(e?.message || '')
  ) {
    const cErr = new Error('Cancelled') as CancelSdkError;
    cErr.name = 'CancelSdkError';
    cErr.operationId = ctx?.opId;
    // Preserve original stack/message detail if present
    if (e?.message && !/Cancelled/i.test(e.message)) cErr.message = e.message;
    if (e?.stack) (cErr as any).stack = e.stack;
    return cErr;
  }
  // HTTP classification
  if (typeof e.status === 'number') {
    const msg = e.message || e.title || e.detail || `HTTP ${e.status}`;
    const httpErr = new Error(msg) as any as HttpSdkError;
    httpErr.name = 'HttpSdkError';
    httpErr.status = e.status;
    httpErr.operationId = ctx?.opId;
    for (const k of ['type', 'title', 'detail', 'instance'] as const) {
      if (e[k] !== undefined) (httpErr as any)[k] = e[k];
    }
    if (e.nonRetryable) (httpErr as any).nonRetryable = true;
    // preserve original stack if present
    if (e.stack && typeof e.stack === 'string') {
      httpErr.stack = e.stack;
    }
    return httpErr;
  }
  // Validation
  if (
    e?.code === 'VALIDATION_ERROR' ||
    /validation/i.test(e?.message || '') ||
    /Invalid .* request/i.test(e?.message || '')
  ) {
    const vErr = new Error(e.message || 'Validation error') as any as ValidationSdkError;
    vErr.name = 'ValidationSdkError';
    vErr.side = e.side || 'request';
    vErr.operationId = e.operationId || ctx?.opId || 'unknown';
    vErr.issues = e.issues;
    if (e.stack) vErr.stack = e.stack;
    return vErr;
  }
  // Auth
  if (/auth/i.test(e?.message || '') || e?.name === 'AuthError') {
    const aErr = new Error(e.message || 'Authentication error') as any as AuthSdkError;
    aErr.name = 'AuthSdkError';
    aErr.status = e.status;
    aErr.cause = e;
    if (e.stack) aErr.stack = e.stack;
    return aErr;
  }
  // Network
  if (e?.name === 'TypeError' || /network/i.test(e?.message || '')) {
    const nErr = new Error(e.message || 'Network error') as any as NetworkSdkError;
    nErr.name = 'NetworkSdkError';
    nErr.cause = e;
    if (e.stack) nErr.stack = e.stack;
    return nErr;
  }
  const unk = new Error(e?.message || 'Unknown error') as any as NetworkSdkError;
  unk.name = 'NetworkSdkError';
  unk.cause = e;
  if (e.stack) unk.stack = e.stack;
  return unk;
}
export class CamundaValidationError extends Error {
  side: 'request' | 'response';
  operationId?: string;
  summary: string;
  issues: string[];
  constructor(params: {
    side: 'request' | 'response';
    operationId?: string;
    message: string;
    summary: string;
    issues: string[];
  }) {
    super(params.message);
    this.name = 'CamundaValidationError';
    this.side = params.side;
    this.operationId = params.operationId;
    this.summary = params.summary;
    this.issues = params.issues;
  }
}

export class EventualConsistencyTimeoutError extends Error {
  code = 'CAMUNDA_SDK_EVENTUAL_TIMEOUT';
  attempts: number;
  elapsedMs: number;
  lastStatus?: number;
  lastResponseSnippet?: string;
  operationId?: string;
  constructor(params: {
    attempts: number;
    elapsedMs: number;
    lastStatus?: number;
    lastResponse?: any;
    operationId?: string;
    message?: string;
  }) {
    super(
      params.message ||
        `Eventual consistency timeout after ${params.elapsedMs}ms (${params.attempts} attempts)`
    );
    this.name = 'EventualConsistencyTimeoutError';
    this.attempts = params.attempts;
    this.elapsedMs = params.elapsedMs;
    this.lastStatus = params.lastStatus;
    this.operationId = params.operationId;
    if (params.lastResponse !== undefined) {
      try {
        const s =
          typeof params.lastResponse === 'string'
            ? params.lastResponse
            : JSON.stringify(params.lastResponse);
        this.lastResponseSnippet = s.length > 8192 ? s.slice(0, 8192) + '…[truncated]' : s;
      } catch (_e) {
        // ignore serialization errors
      }
    }
  }
}
