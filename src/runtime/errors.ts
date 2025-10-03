// Unified SDK error typing utilities.
// Goal: Allow user code to discriminate errors in catch blocks with strong typing.

// RFC 9457 / RFC 7807 style Problem Details passthrough (type, title, status, detail, instance)
export type HttpSdkError = {
  name: 'HttpSdkError';
  message: string;
  status: number; // HTTP status code
  operationId?: string;
  retries?: { attempt: number; max: number };
  cause?: unknown;
  // Problem Details fields (optional – only if provided by server)
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
};

export type ValidationSdkError = {
  name: 'ValidationSdkError';
  message: string;
  side: 'request' | 'response';
  operationId: string;
  issues?: unknown; // zod issues or extras detail
};

export type AuthSdkError = {
  name: 'AuthSdkError';
  message: string;
  status?: number;
  cause?: unknown;
};

export type NetworkSdkError = {
  name: 'NetworkSdkError';
  message: string;
  cause?: unknown;
};

export type SdkError = HttpSdkError | ValidationSdkError | AuthSdkError | NetworkSdkError;

export function isSdkError(e: unknown): e is SdkError {
  return (
    !!e &&
    typeof e === 'object' &&
    'name' in e &&
    ['HttpSdkError', 'ValidationSdkError', 'AuthSdkError', 'NetworkSdkError'].includes(
      (e as any).name
    )
  );
}

// Attempt to classify any thrown value to a stable SdkError.
export function normalizeError(err: unknown, ctx?: { opId?: string }): SdkError {
  if (isSdkError(err)) return err;
  const e: any = err || {};
  // HTTP classification (our generator throws synthetic Error with status)
  if (typeof e.status === 'number') {
    const h: HttpSdkError = {
      name: 'HttpSdkError',
      message: e.message || e.title || e.detail || `HTTP ${e.status}`,
      status: e.status,
      operationId: ctx?.opId,
    };
    for (const k of ['type', 'title', 'detail', 'instance'] as const) {
      if (e[k] !== undefined) (h as any)[k] = e[k];
    }
    if (e.nonRetryable) (h as any).nonRetryable = true;
    return h;
  }
  // Validation hints (side / operation present?)
  if (
    e?.code === 'VALIDATION_ERROR' ||
    /validation/i.test(e?.message || '') ||
    /Invalid .* request/i.test(e?.message || '')
  ) {
    return {
      name: 'ValidationSdkError',
      message: e.message || 'Validation error',
      side: e.side || 'request',
      operationId: e.operationId || ctx?.opId || 'unknown',
      issues: e.issues,
    };
  }
  // Auth
  if (/auth/i.test(e?.message || '') || e?.name === 'AuthError') {
    return {
      name: 'AuthSdkError',
      message: e.message || 'Authentication error',
      status: e.status,
      cause: e,
    };
  }
  // Network (TypeError fetch failures commonly)
  if (e?.name === 'TypeError' || /network/i.test(e?.message || '')) {
    return { name: 'NetworkSdkError', message: e.message || 'Network error', cause: e };
  }
  // Fallback treat as network generic
  return { name: 'NetworkSdkError', message: e?.message || 'Unknown error', cause: e };
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
