// Telemetry Phase 1: hook-based lightweight instrumentation
import type { LogLevel, Logger } from './logger';

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
}

interface BaseEvt { ts: number; correlationId?: string; requestId: string; }
export interface TelemetryHttpStartEvent extends BaseEvt { type:'http.start'; method:string; url:string; attempt:number; }
export interface TelemetryHttpEndEvent extends BaseEvt { type:'http.end'; method:string; url:string; attempt:number; status:number; durationMs:number; }
export interface TelemetryHttpErrorEvent extends BaseEvt { type:'http.error'; method:string; url:string; attempt:number; errorKind:'network'|'abort'; message:string; durationMs:number; }
export interface TelemetryAuthStartEvent { type:'auth.start'; ts:number; correlationId?:string; audience:string; endpoint:string; cache:boolean; }
export interface TelemetryAuthSuccessEvent { type:'auth.success'; ts:number; correlationId?:string; audience:string; endpoint:string; cached:boolean; durationMs:number; expiresInSec:number; scopes?:string[]; }
export interface TelemetryAuthErrorEvent { type:'auth.error'; ts:number; correlationId?:string; audience:string; endpoint:string; durationMs:number; status?:number; message:string; }
export interface TelemetryRetryEvent { type:'retry'; ts:number; correlationId?:string; attempt:number; nextDelayMs:number; reason:string; domain:'auth'; }

export type TelemetryHttpEvent = TelemetryHttpStartEvent|TelemetryHttpEndEvent|TelemetryHttpErrorEvent;
export type TelemetryAuthEvent = TelemetryAuthStartEvent|TelemetryAuthSuccessEvent|TelemetryAuthErrorEvent;
export type TelemetryRetryDomainEvent = TelemetryRetryEvent;

// Shallow URL redaction: strip query parameter values
function redactUrl(u: string): string {
  try {
    const url = new URL(u);
    if (url.searchParams && Array.from(url.searchParams.keys()).length) {
      const keys = Array.from(new Set(Array.from(url.searchParams.keys())));
      url.search = keys.length ? '?' + keys.map(k=>k).join('&') : '';
    }
    return url.toString();
  } catch { return u; }
}

let globalRequestCounter = 0;

// No-op fast path wrapper
export function wrapFetch(orig: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>, opts: TelemetryOptionsInternal | undefined) {
  if (!opts || (!opts.hooks && !opts.correlation && !opts.mirrorToLog)) return orig;
  const hooks = opts.hooks;
  const logger = opts.logger?.scope('telemetry');
  const mirror = !!opts.mirrorToLog && !!logger;
  function mirrorLog(evt: TelemetryHttpEvent) {
    if (!mirror) return;
    const data: any = { type: evt.type, method: (evt as any).method, url: (evt as any).url, attempt: (evt as any).attempt, status: (evt as any).status, durationMs: (evt as any).durationMs, requestId: evt.requestId, correlationId: evt.correlationId };
    logger!.trace(() => ['telemetry', data]);
  }
  return async function wrapped(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const attempt = (init as any)?.__camundaAttempt || 1; // future retry integration
    let method: string = 'GET';
    if (init?.method) method = init.method; else if (typeof Request !== 'undefined' && input instanceof Request && input.method) method = input.method; // fallback
    method = method.toUpperCase();
    let origUrl: string;
    if (typeof input === 'string') origUrl = input;
    else if (typeof URL !== 'undefined' && input instanceof URL) origUrl = input.toString();
    else if (typeof Request !== 'undefined' && input instanceof Request) origUrl = input.url;
    else origUrl = (input as any)?.url || (input as any)?.toString?.() || String(input);
    const redactedUrl = redactUrl(origUrl);
    const requestId = 'r' + (++globalRequestCounter).toString(36);
    const correlationId = opts.correlation ? opts.correlation() : undefined;
    const start = Date.now();
    const startEvt: TelemetryHttpStartEvent = { type:'http.start', ts: start, method, url: redactedUrl, attempt, requestId, correlationId };
    try { hooks?.beforeRequest?.(startEvt); mirrorLog(startEvt); } catch {/* swallow */}
    try {
      const res = await orig(input, init);
      const end = Date.now();
      const endEvt: TelemetryHttpEndEvent = { type:'http.end', ts: end, method, url: redactedUrl, attempt, status: res.status, durationMs: end - start, requestId, correlationId };
      try { hooks?.afterResponse?.(endEvt); mirrorLog(endEvt); } catch {/* swallow */}
      return res;
    } catch (e:any) {
      const end = Date.now();
      const errEvt: TelemetryHttpErrorEvent = { type:'http.error', ts: end, method, url: redactedUrl, attempt, errorKind: (e?.name==='AbortError'?'abort':'network'), message: e?.message||String(e), durationMs: end - start, requestId, correlationId };
      try { hooks?.requestError?.(errEvt); mirrorLog(errEvt); } catch {/* swallow */}
      throw e;
    }
  };
}

// Simple correlation provider (Phase 1) used only when user passes manual withCorrelation
type CorrelationStore = { current?: string };
const store: CorrelationStore = {};
export function setCorrelation(id: string | undefined) { store.current = id; }
export function getCorrelation() { return store.current; }

// Utility exposed to client: runs function with correlation ID
export async function withCorrelation<T>(id: string, fn: () => Promise<T>|T): Promise<T> {
  const prev = store.current;
  store.current = id;
  try { return await fn(); } finally { store.current = prev; }
}
