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
