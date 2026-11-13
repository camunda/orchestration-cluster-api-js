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
      url.search = keys.length ? `?${keys.map((k) => k).join('&')}` : '';
    }
    return url.toString();
  } catch {
    return u;
  }
}

/**
 * Field names whose value is a credential wherever it appears in a request or response body.
 *
 * Covers the OAuth token exchange (`client_secret` in the form-encoded request, `access_token`
 * / `id_token` / `refresh_token` in the JSON response), the private-key-JWT and
 * resource-owner grants, and the camelCase spellings the SDK's own JSON bodies would use.
 * Matching is on the whole field name and is case-insensitive.
 */
const SECRET_BODY_FIELDS = new Set(
  [
    'client_secret',
    'clientsecret',
    'client_assertion',
    'clientassertion',
    'assertion',
    'password',
    'passphrase',
    'key_passphrase',
    'keypassphrase',
    'private_key',
    'privatekey',
    'access_token',
    'accesstoken',
    'refresh_token',
    'refreshtoken',
    'id_token',
    'idtoken',
    'authorization',
  ].map((k) => k.toLowerCase())
);

const BODY_REDACTED = '[redacted]';

function isSecretBodyField(name: string): boolean {
  return SECRET_BODY_FIELDS.has(name.toLowerCase());
}

/** Mask the values of credential fields in an `application/x-www-form-urlencoded` body. */
function redactFormBody(body: string): string {
  return body
    .split('&')
    .map((pair) => {
      const eq = pair.indexOf('=');
      if (eq < 0) return pair;
      const rawName = pair.slice(0, eq);
      // A malformed escape keeps the raw name: it is not a reason to stop redacting.
      return isSecretBodyField(decodeFormName(rawName)) ? `${rawName}=${BODY_REDACTED}` : pair;
    })
    .join('&');
}

/** Mask the values of credential fields anywhere in a parsed JSON body. */
function redactJsonValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  try {
    if (Array.isArray(value)) return value.map((v) => redactJsonValue(v, seen));
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = isSecretBodyField(k) ? BODY_REDACTED : redactJsonValue(v, seen);
    }
    return out;
  } finally {
    seen.delete(value);
  }
}

/** Decode the content of a JSON string literal; fall back to the raw text if it is malformed. */
function decodeJsonKey(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`) as string;
  } catch {
    return raw;
  }
}

/** Decode a form or query-string name; fall back to the raw text if it is malformed. */
function decodeFormName(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, ' '));
  } catch {
    return raw;
  }
}

/** End of the JSON string literal whose opening quote is at `start`; tolerates truncation. */
function jsonStringEnd(text: string, start: number): number {
  let i = start + 1;
  while (i < text.length) {
    const c = text[i];
    // A backslash escapes the next character; a lone trailing backslash (a cut between
    // the two characters of an escape) consumes through the end, which is still credential.
    if (c === '\\') i += 2;
    else if (c === '"') return i + 1;
    else i++;
  }
  return text.length;
}

/**
 * Mask the value of every credential property in text that is not valid JSON.
 *
 * Property names are matched as JSON string literals and decoded before the lookup, so an
 * escaped name such as `"access\u005ftoken"` is recognised like its decoded form. Only a
 * credential's own value is consumed: for any other property the scan resumes right after
 * `"name":`, so a credential nested inside its value (`{"nested":{"access_token":"..."},"tru`)
 * is still found. A string value is masked through its closing quote, or to the end of the
 * text when it is unterminated (a body truncated mid-credential); any other value
 * (`"password":12345`) is masked up to the next delimiter.
 */
function redactJsonProperties(text: string): string {
  const re = /"((?:[^"\\]|\\[\s\S])*)"\s*:\s*/g;
  let out = '';
  let last = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    const valueStart = m.index + m[0].length;
    if (valueStart >= text.length || !isSecretBodyField(decodeJsonKey(m[1]))) continue;
    if (',}]'.includes(text[valueStart])) continue; // an empty value has nothing to mask
    let end: number;
    if (text[valueStart] === '"') {
      end = jsonStringEnd(text, valueStart);
    } else {
      end = valueStart;
      while (end < text.length && !/[,}\]\s]/.test(text[end])) end++;
    }
    out += `${text.slice(last, valueStart)}"${BODY_REDACTED}"`;
    last = end;
    re.lastIndex = end;
  }
  return out + text.slice(last);
}

/** Whether a UTF-16 code unit can be part of an assignment name: `A-Za-z0-9_%+.-`. */
function isNameCode(c: number): boolean {
  return (
    (c >= 48 && c <= 57) || // 0-9
    (c >= 65 && c <= 90) || // A-Z
    (c >= 97 && c <= 122) || // a-z
    c === 95 || // _
    c === 37 || // %
    c === 43 || // +
    c === 46 || // .
    c === 45 // -
  );
}

/**
 * Mask the value of every `name=value` credential assignment in free text.
 *
 * The value is the whole quoted string if it starts with a quote; otherwise everything up
 * to the next `&` (the pair separator of forms and query strings) or the end of the line.
 * Prose has no other reliable boundary: stopping at the first space would leave the tail of
 * `password=two words` or the token of `authorization=Bearer <token>` in the log, so where
 * the boundary cannot be known the value is masked to the end of the line rather than
 * guessed. Only a credential's own value is consumed: after any other assignment the scan
 * resumes at its `=`, so `request=42 client_secret=...` still finds the credential.
 *
 * A single left-to-right pass: each maximal run of name characters is read once, and only
 * then is the character after it compared with `=`. That makes the work linear in the
 * length of the text by construction, however long a run without an `=` is. (A pattern for
 * the name that is not anchored to the start of the run re-scans the rest of the run from
 * every position.)
 */
function redactAssignments(text: string): string {
  const n = text.length;
  let out = '';
  let last = 0;
  let i = 0;
  while (i < n) {
    if (!isNameCode(text.charCodeAt(i))) {
      i++;
      continue;
    }
    const nameStart = i;
    while (i < n && isNameCode(text.charCodeAt(i))) i++;
    if (i >= n || text.charCodeAt(i) !== 61 /* = */) continue;
    const eq = i;
    if (!isSecretBodyField(decodeFormName(text.slice(nameStart, eq)))) {
      i = eq + 1;
      continue;
    }
    const valueStart = eq + 1;
    let end: number;
    if (text[valueStart] === '"') {
      end = jsonStringEnd(text, valueStart);
    } else if (text[valueStart] === "'") {
      const close = text.indexOf("'", valueStart + 1);
      end = close < 0 ? n : close + 1;
    } else {
      end = valueStart;
      while (end < n && text[end] !== '&' && text[end] !== '\r' && text[end] !== '\n') end++;
    }
    out += `${text.slice(last, valueStart)}${BODY_REDACTED}`;
    last = end;
    i = end;
  }
  return out + text.slice(last);
}

/**
 * Textual sweep for a body that is not valid JSON, and a second pass over one that is not
 * form-encoded either: credential properties (`"name": value`) and credential assignments
 * (`name=value`), for the known credential field names only.
 */
function redactBodyText(body: string): string {
  return redactAssignments(redactJsonProperties(body));
}

/**
 * Redact credential values from an HTTP body preview.
 *
 * The silly-level previews below log request and response bodies verbatim, and the OAuth
 * token request runs through this same wrapped fetch — so without this the preview carried
 * `client_secret=…` and the token endpoint's `access_token`. The level is opt-in and warned
 * about, but "a secret must not appear in logs" is unconditional, so redact at the source
 * rather than relying on the warning.
 */
export function redactBodyPreview(body: string): string {
  if (!body) return body;
  try {
    const trimmed = body.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.stringify(redactJsonValue(JSON.parse(trimmed), new WeakSet()));
      } catch {
        // Not parseable (truncated, or not JSON after all) — fall through to the sweep.
      }
    }
    // Form redaction first (it understands percent-encoded keys), then the textual sweep
    // unconditionally: free-form text such as an error page can embed `client_secret=…`
    // outside any form pair, and the sweep is what catches that. The form pass does not
    // depend on the body being brace-free: a brace in one value says nothing about whether
    // another key is a percent-encoded credential name.
    const formFirst = trimmed.includes('=') ? redactFormBody(body) : body;
    return redactBodyText(formFirst);
  } catch {
    // Never let redaction failure hand the caller the unredacted body.
    return '[body preview omitted: redaction failed]';
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
    const requestId = `r${(++globalRequestCounter).toString(36)}`;
    const correlationId = opts.correlation ? opts.correlation() : undefined;
    // biome-ignore lint/plugin: HTTP span start: duration must report real elapsed time; paired with the same source at both ends so the span stays internally consistent
    const start = Date.now();
    // Unsafe deep diagnostics: capture body when log level 'silly'. Only handles readily serializable bodies.
    let bodyPreview: string | undefined;
    try {
      const lvl = logger?.level?.();
      if (lvl === 'silly' && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        let body: any = init?.body;
        if (body === undefined && typeof Request !== 'undefined' && input instanceof Request) {
          try {
            const cloned = (input as Request).clone();
            // A multipart Request body is raw boundary-delimited text; reading it as a
            // FormData lets the per-entry masking below see each field.
            body = /multipart\/form-data/i.test(cloned.headers.get('content-type') || '')
              ? await cloned.formData()
              : await cloned.text();
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
              // Redact per entry, before joining: the values are not escaped, so a
              // credential containing `&` would otherwise survive as a trailing fragment
              // of the joined string.
              if (isSecretBodyField(String(k))) entries.push(`${k}=${BODY_REDACTED}`);
              else entries.push(`${k}=${typeof v === 'string' ? v.slice(0, 200) : '[File]'}`);
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
              bodyPreview = JSON.stringify(body);
            } catch {
              bodyPreview = '[Unstringifiable object body]';
            }
          }
          // Redact before the size cap: truncating first would leave a partial credential
          // in the preview and defeat the structural parse.
          if (bodyPreview) bodyPreview = redactBodyPreview(bodyPreview);
          if (bodyPreview && bodyPreview.length > 4000)
            bodyPreview = `${bodyPreview.slice(0, 4000)}…`;
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
      // biome-ignore lint/plugin: HTTP span end: paired with the start read above, same source
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
              // The OAuth token endpoint answers on this path: redact before truncating.
              const safe = redactBodyPreview(text);
              respPreview = safe.slice(0, 4000);
              if (safe.length > 4000) respPreview += '…';
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
                const safe = redactBodyPreview(text);
                respPreview = safe.slice(0, 200); // shorter for unknown types
                if (safe.length > 200) respPreview += '…';
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
      // biome-ignore lint/plugin: HTTP span end on the error path: paired with the start read above, same source
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
