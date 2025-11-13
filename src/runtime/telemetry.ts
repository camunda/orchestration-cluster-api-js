// Telemetry Phase 1: hook-based lightweight instrumentation
import type { Logger } from './logger';
import type { SupportLogger } from './supportLogger';

export interface TelemetryHooks {
  beforeRequest?(e: TelemetryHttpStartEvent): void;
  afterResponse?(e: TelemetryHttpEndEvent): void;
  requestError?(e: TelemetryHttpErrorEvent): void;
  authStart?(e: TelemetryAuthStartEvent): void;
  authSuccess?(e: TelemetryAuthSuccessEvent): void;
  authError?(e: TelemetryAuthErrorEvent): void;
  retry?(e: TelemetryRetryEvent): void; // generic retry/backoff (currently OAuth)
}

export interface TelemetryOptionsInternal {
  hooks?: TelemetryHooks;
  correlation?: () => string | undefined; // provider for correlation id
  logger?: Logger; // optional, only used for trace mirroring
  mirrorToLog?: boolean; // if true, emit trace level log.code events
  supportLogger?: SupportLogger; // unconditional sink (even when main log level filters)
}

interface BaseEvt {
  ts: number;
  correlationId?: string;
  requestId: string;
}
export interface TelemetryHttpStartEvent extends BaseEvt {
  type: 'http.start';
  method: string;
  url: string;
  attempt: number;
}
export interface TelemetryHttpEndEvent extends BaseEvt {
  type: 'http.end';
  method: string;
  url: string;
  attempt: number;
  status: number;
  durationMs: number;
}
export interface TelemetryHttpErrorEvent extends BaseEvt {
  type: 'http.error';
  method: string;
  url: string;
  attempt: number;
  errorKind: 'network' | 'abort';
  message: string;
  durationMs: number;
}
export interface TelemetryAuthStartEvent {
  type: 'auth.start';
  ts: number;
  correlationId?: string;
  audience: string;
  endpoint: string;
  cache: boolean;
}
export interface TelemetryAuthSuccessEvent {
  type: 'auth.success';
  ts: number;
  correlationId?: string;
  audience: string;
  endpoint: string;
  cached: boolean;
  durationMs: number;
  expiresInSec: number;
  scopes?: string[];
}
export interface TelemetryAuthErrorEvent {
  type: 'auth.error';
  ts: number;
  correlationId?: string;
  audience: string;
  endpoint: string;
  durationMs: number;
  status?: number;
  message: string;
}
export interface TelemetryRetryEvent {
  type: 'retry';
  ts: number;
  correlationId?: string;
  attempt: number;
  nextDelayMs: number;
  reason: string;
  domain: 'auth';
}

export type TelemetryHttpEvent =
  | TelemetryHttpStartEvent
  | TelemetryHttpEndEvent
  | TelemetryHttpErrorEvent;
export type TelemetryAuthEvent =
  | TelemetryAuthStartEvent
  | TelemetryAuthSuccessEvent
  | TelemetryAuthErrorEvent;
export type TelemetryRetryDomainEvent = TelemetryRetryEvent;

// Shallow URL redaction: strip query parameter values
function redactUrl(u: string): string {
  try {
    const url = new URL(u);
    if (url.searchParams && Array.from(url.searchParams.keys()).length) {
      const keys = Array.from(new Set(Array.from(url.searchParams.keys())));
      url.search = keys.length ? '?' + keys.map((k) => k).join('&') : '';
    }
    return url.toString();
  } catch {
    return u;
  }
}

let globalRequestCounter = 0;

// No-op fast path wrapper
export function wrapFetch(
  orig: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  opts: TelemetryOptionsInternal | undefined
) {
  if (!opts || (!opts.hooks && !opts.correlation && !opts.mirrorToLog)) return orig;
  const hooks = opts.hooks;
  const logger = opts.logger?.scope('telemetry');
  const mirror = !!opts.mirrorToLog && !!logger;
  function mirrorLog(evt: TelemetryHttpEvent) {
    if (!mirror) return;
    const opName = `${evt.method} ${evt.url}`;
    if (evt.type === 'http.end') {
      logger!.trace(() => [
        `op=${opName} http.end method=${evt.method} status=${(evt as TelemetryHttpEndEvent).status} url=${evt.url} attempt=${evt.attempt} duration=${(evt as TelemetryHttpEndEvent).durationMs}ms requestId=${evt.requestId}`,
      ]);
    } else if (evt.type === 'http.error') {
      const e = evt as TelemetryHttpErrorEvent;
      logger!.trace(() => [
        `op=${opName} http.error method=${e.method} url=${e.url} attempt=${e.attempt} kind=${e.errorKind} msg=${sanitize(e.message)} duration=${e.durationMs}ms requestId=${e.requestId}`,
      ]);
    } else if (evt.type === 'http.start') {
      logger!.trace(() => [
        `op=${opName} http.start method=${evt.method} url=${evt.url} attempt=${evt.attempt} requestId=${evt.requestId}`,
      ]);
    }
  }
  function sanitize(msg: string) {
    if (!msg) return '';
    return msg.replace(/\s+/g, ' ').slice(0, 300);
  }
  return async function wrapped(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const attempt = (init as any)?.__camundaAttempt || 1; // future retry integration
    let method: string = 'GET';
    if (init?.method) method = init.method;
    else if (typeof Request !== 'undefined' && input instanceof Request && input.method)
      method = input.method; // fallback
    method = method.toUpperCase();
    let origUrl: string;
    if (typeof input === 'string') origUrl = input;
    else if (typeof URL !== 'undefined' && input instanceof URL) origUrl = input.toString();
    else if (typeof Request !== 'undefined' && input instanceof Request) origUrl = input.url;
    else origUrl = (input as any)?.url || input?.toString?.() || String(input);
    const redactedUrl = redactUrl(origUrl);
    const requestId = 'r' + (++globalRequestCounter).toString(36);
    const correlationId = opts.correlation ? opts.correlation() : undefined;
    const start = Date.now();
    // Unsafe deep diagnostics: capture body when log level 'silly'. Only handles readily serializable bodies.
    let bodyPreview: string | undefined;
    try {
      const lvl = logger?.level?.();
      if (lvl === 'silly' && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        let body: any = init?.body;
        if (body === undefined && typeof Request !== 'undefined' && input instanceof Request) {
          try {
            body = await (input as Request).clone().text();
          } catch {
            body = undefined;
          }
        }
        if (body !== undefined && body !== null) {
          if (typeof body === 'string') bodyPreview = body;
          else if (body instanceof URLSearchParams) bodyPreview = body.toString();
          else if (typeof FormData !== 'undefined' && body instanceof FormData) {
            const entries: string[] = [];
            for (const [k, v] of (body as any).entries()) {
              entries.push(`${k}=${typeof v === 'string' ? v.slice(0, 200) : '[File]'}`);
            }
            bodyPreview = entries.join('&');
          } else if (body instanceof Blob) {
            bodyPreview = `[Blob size=${(body as Blob).size}]`;
          } else if (body instanceof ArrayBuffer) {
            bodyPreview = `[ArrayBuffer byteLength=${(body as ArrayBuffer).byteLength}]`;
          } else if (body instanceof Uint8Array) {
            bodyPreview = `[Uint8Array length=${(body as Uint8Array).length}]`;
          } else if (typeof body === 'object') {
            try {
              bodyPreview = JSON.stringify(body).slice(0, 4000);
            } catch {
              bodyPreview = '[Unstringifiable object body]';
            }
          }
          if (bodyPreview && bodyPreview.length > 4000)
            bodyPreview = bodyPreview.slice(0, 4000) + '…';
        }
      }
    } catch {
      /* swallow body preview errors */
    }
    const startEvt: TelemetryHttpStartEvent = {
      type: 'http.start',
      ts: start,
      method,
      url: redactedUrl,
      attempt,
      requestId,
      correlationId,
    };
    try {
      hooks?.beforeRequest?.(startEvt);
      mirrorLog(startEvt);
      if (bodyPreview && logger?.level?.() === 'silly') {
        logger!.silly(() => [
          `op=${method} ${redactedUrl} http.body requestId=${requestId} size=${bodyPreview.length} preview=${bodyPreview}`,
        ]);
      }
    } catch {
      /* swallow */
    }
    try {
      const res = await orig(input, init);
      const end = Date.now();
      const endEvt: TelemetryHttpEndEvent = {
        type: 'http.end',
        ts: end,
        method,
        url: redactedUrl,
        attempt,
        status: res.status,
        durationMs: end - start,
        requestId,
        correlationId,
      };
      try {
        hooks?.afterResponse?.(endEvt);
        mirrorLog(endEvt);
      } catch {
        /* swallow */
      }
      // Unsafe deep diagnostics: response body preview when level=silly
      try {
        if (logger?.level?.() === 'silly') {
          let respPreview: string | undefined;
          // Clone so we do not consume original body
          const cloned = res.clone();
          const ctype = cloned.headers.get('Content-Type') || '';
          let originalSize: number;
          if (/^(application\/json|text\/)/i.test(ctype)) {
            // Attempt text read for JSON or text
            try {
              const text = await cloned.text();
              originalSize = text.length;
              respPreview = text.slice(0, 4000);
              if (text.length > 4000) respPreview += '…';
            } catch {
              respPreview = undefined;
            }
          } else if (/multipart\//i.test(ctype)) {
            respPreview = '[multipart body omitted]';
          } else if (/octet-stream|binary/i.test(ctype)) {
            respPreview = '[binary body omitted]';
          } else {
            // Fallback: attempt text anyway, may succeed
            try {
              const text = await cloned.text();
              if (text) {
                originalSize = text.length;
                respPreview = text.slice(0, 200); // shorter for unknown types
                if (text.length > 200) respPreview += '…';
              }
            } catch {
              /* ignore */
            }
          }
          if (respPreview) {
            logger!.silly(() => [
              `op=${method} ${redactedUrl} http.response requestId=${requestId} status=${res.status} size=${originalSize} preview=${respPreview}`,
            ]);
          }
        }
      } catch {
        /* swallow response preview errors */
      }
      // Unconditional SupportLogger emission (if provided)
      try {
        const opName = `${endEvt.method} ${endEvt.url}`;
        opts.supportLogger?.log(
          `op=${opName} http.end method=${endEvt.method} status=${endEvt.status} url=${endEvt.url} attempt=${endEvt.attempt} durationMs=${endEvt.durationMs} requestId=${endEvt.requestId}`
        );
      } catch {
        /* ignore */
      }
      return res;
    } catch (e: any) {
      const end = Date.now();
      const errEvt: TelemetryHttpErrorEvent = {
        type: 'http.error',
        ts: end,
        method,
        url: redactedUrl,
        attempt,
        errorKind: e?.name === 'AbortError' ? 'abort' : 'network',
        message: e?.message || String(e),
        durationMs: end - start,
        requestId,
        correlationId,
      };
      try {
        hooks?.requestError?.(errEvt);
        mirrorLog(errEvt);
      } catch {
        /* swallow */
      }
      try {
        const opName = `${errEvt.method} ${errEvt.url}`;
        opts.supportLogger?.log(
          `op=${opName} http.error method=${errEvt.method} url=${errEvt.url} attempt=${errEvt.attempt} kind=${errEvt.errorKind} msg=${sanitize(errEvt.message)} durationMs=${errEvt.durationMs} requestId=${errEvt.requestId}`
        );
      } catch {
        /* ignore */
      }
      throw e;
    }
  };
}

// Simple correlation provider (Phase 1) used only when user passes manual withCorrelation
type CorrelationStore = { current?: string };
const store: CorrelationStore = {};
export function setCorrelation(id: string | undefined) {
  store.current = id;
}
export function getCorrelation() {
  return store.current;
}

// Utility exposed to client: runs function with correlation ID
export async function withCorrelation<T>(id: string, fn: () => Promise<T> | T): Promise<T> {
  const prev = store.current;
  store.current = id;
  try {
    return await fn();
  } finally {
    store.current = prev;
  }
}
