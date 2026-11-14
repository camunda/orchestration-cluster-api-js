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
 * Whether a body field name denotes a credential.
 *
 * The name is normalised first (lower-cased, with `_`, `-`, `.` and whitespace removed), so
 * `client_secret`, `Client-Secret`, `clientSecret` and `CLIENT.SECRET` are one name. A name is
 * a credential when it contains a credential word (`password`, `passphrase`, `secret`,
 * `credential`, `assertion`, `apikey`, `privatekey`, `authorization`, `bearer`, `cookie`) or
 * ends in `token`. Matching is deliberately broad: masking a value that was not a credential
 * costs a little diagnostic text, while a missed credential is a leak. A bare `key` is not
 * matched, since entity keys (`processDefinitionKey`) are everywhere in the API.
 */
const SECRET_FIELD_WORDS = [
  'password',
  'passwd',
  'passphrase',
  'secret',
  'credential',
  'assertion',
  'apikey',
  'privatekey',
  'authorization',
  'bearer',
  'cookie',
];

const BODY_REDACTED = '[redacted]';

function isSecretBodyField(name: string): boolean {
  const n = name.toLowerCase().replace(/[\s_.-]/g, '');
  return /tokens?$/.test(n) || SECRET_FIELD_WORDS.some((w) => n.includes(w));
}

/**
 * How deep a structure carried inside a string value (JSON in a JSON string, a form in a form
 * value, ...) is unwrapped. Past this a parseable structure is masked whole instead of read.
 */
const MAX_EMBEDDED_DEPTH = 4;

/**
 * Decode a form name or value (`+` is a space). A malformed escape (`%FF` is not valid UTF-8)
 * throws, and the throw is deliberately not caught here: falling back to the raw text would
 * judge an encoded name (`client_%73ecret%FF`) against the credential words and miss it, and
 * would skip a structure held in a value. It propagates to the preview's error handler, so the
 * body is omitted.
 */
function decodeFormComponent(raw: string): string {
  return decodeURIComponent(raw.replace(/\+/g, ' '));
}

/**
 * A well-formed `application/x-www-form-urlencoded` body: every `&`-separated pair is
 * `name=value`, with a non-empty name, and both made only of the characters a form encoder
 * emits (letters, digits, `*-._~!'()`, `+` for a space, and `%XX` escapes). Because a value
 * must be percent-encoded, a raw `&` always starts the next pair, so for such a body the
 * pair boundaries are known rather than guessed; anything else (a raw space, quote, `=`,
 * newline, a stray `&`, ...) means the text did not come from a form encoder, and its
 * boundaries are not known. Built from alternatives that cannot match the same character, so
 * matching is linear in the length of the text.
 */
const FORM_CHAR = "(?:[A-Za-z0-9*\\-._~!'()+]|%[0-9A-Fa-f]{2})";
const WELL_FORMED_FORM = new RegExp(
  `^${FORM_CHAR}+=${FORM_CHAR}*(?:&${FORM_CHAR}+=${FORM_CHAR}*)*$`
);

/** Parse JSON, or return `undefined` if the text is not valid JSON. */
function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Redact a string that is a value inside a parsed structure. If it is itself a parseable
 * structure (a JSON object or array, or a well-formed form encoding) its credential fields
 * are masked by name; any other string is returned unchanged.
 */
function redactEmbedded(value: string, depth: number): string {
  const text = value.trim();
  if (text[0] === '{' || text[0] === '[') {
    const parsed = tryParseJson(text);
    if (parsed === null || typeof parsed !== 'object') return value;
    return depth >= MAX_EMBEDDED_DEPTH
      ? BODY_REDACTED
      : JSON.stringify(redactJsonValue(parsed, depth + 1));
  }
  if (value.includes('=') && WELL_FORMED_FORM.test(value)) {
    return depth >= MAX_EMBEDDED_DEPTH ? BODY_REDACTED : redactFormBody(value, depth + 1);
  }
  return value;
}

/**
 * Mask the credential fields of a well-formed form body (see `WELL_FORMED_FORM`). A value
 * that is itself a parseable structure is redacted by the same rules and written back encoded.
 */
function redactFormBody(body: string, depth: number): string {
  return body
    .split('&')
    .map((pair) => {
      const eq = pair.indexOf('=');
      const rawName = pair.slice(0, eq);
      if (isSecretBodyField(decodeFormComponent(rawName))) return `${rawName}=${BODY_REDACTED}`;
      const value = decodeFormComponent(pair.slice(eq + 1));
      const inner = redactEmbedded(value, depth);
      return inner === value ? pair : `${rawName}=${encodeURIComponent(inner)}`;
    })
    .join('&');
}

/** Mask the credential fields anywhere in a parsed JSON value. */
function redactJsonValue(value: unknown, depth: number): unknown {
  if (typeof value === 'string') return redactEmbedded(value, depth);
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redactJsonValue(v, depth));
  // A null prototype: `JSON.parse` can produce an own `__proto__` key, which a plain object
  // would take as a prototype assignment and silently drop.
  const out: Record<string, unknown> = Object.create(null);
  for (const [k, v] of Object.entries(value)) {
    out[k] = isSecretBodyField(k) ? BODY_REDACTED : redactJsonValue(v, depth);
  }
  return out;
}

/** The media type of a Content-Type header value, or `unknown` if it is not one. Parameters are dropped. */
function mediaTypeOf(contentType: string | null | undefined): string {
  const base = (contentType ?? '').split(';')[0].trim().toLowerCase();
  return base.length <= 100 && /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/.test(base)
    ? base
    : 'unknown';
}

/** What the preview says in place of a body whose structure cannot be trusted. */
function omittedPreview(body: string, contentType: string | null | undefined): string {
  const bytes =
    typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(body).length : body.length;
  return `[body preview omitted: ${bytes} bytes, content-type=${mediaTypeOf(contentType)}]`;
}

/**
 * Redact credential values from an HTTP body preview.
 *
 * The silly-level previews log request and response bodies, and the OAuth token request runs
 * through this same wrapped fetch — so without this the preview carried `client_secret=…` and
 * the token endpoint's `access_token`. The level is opt-in and warned about, but "a secret must
 * not appear in logs" is unconditional, so redact at the source rather than relying on the
 * warning.
 *
 * The rule is structural, with no guessing of where a credential value ends. A body that
 * parses as a JSON object or array, or is a well-formed form encoding, is logged with every
 * credential field masked whole by its name (at any depth, and inside any string value that
 * is itself such a structure). Any other body — free text, JSON cut off by truncation, raw
 * multipart text, a bare JSON scalar — is not logged: the preview carries only its byte length
 * and media type. So is a form with a percent-escape that does not decode, and a structure
 * that fails to redact for any other reason: the preview becomes a placeholder.
 *
 * Not covered, by the nature of the encoding: a credential held in a string under a
 * non-credential field name (`{"note":"my password is hunter2"}`), and a form whose
 * unencoded `&` is followed by text that happens to read as `name=value`, which is
 * indistinguishable from a second field.
 */
export function redactBodyPreview(body: string, contentType?: string | null): string {
  if (!body) return body;
  try {
    const trimmed = body.trim();
    if (trimmed[0] === '{' || trimmed[0] === '[') {
      const parsed = tryParseJson(trimmed);
      if (parsed !== null && typeof parsed === 'object') {
        return JSON.stringify(redactJsonValue(parsed, 0));
      }
    } else if (WELL_FORMED_FORM.test(body)) {
      return redactFormBody(body, 0);
    }
    return omittedPreview(body, contentType);
  } catch {
    // Never let redaction failure hand the caller the unredacted body.
    return '[body preview omitted: redaction failed]';
  }
}

/** A header's value from any of the shapes `fetch` accepts, or from a Request's headers. */
function headerValue(headers: unknown, name: string): string | undefined {
  try {
    if (!headers) return undefined;
    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name) ?? undefined;
    }
    const wanted = name.toLowerCase();
    if (Array.isArray(headers)) {
      for (const pair of headers) {
        if (Array.isArray(pair) && String(pair[0]).toLowerCase() === wanted) return String(pair[1]);
      }
      return undefined;
    }
    for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
      if (k.toLowerCase() === wanted) return String(v);
    }
  } catch {
    /* an unreadable header is an unknown media type */
  }
  return undefined;
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
          // Text that still has to go through `redactBodyPreview`. The other previews below
          // are built here from structure (FormData entries) or carry no text (a size).
          let rawText: string | undefined;
          if (typeof body === 'string') rawText = body;
          else if (body instanceof URLSearchParams) rawText = body.toString();
          else if (typeof FormData !== 'undefined' && body instanceof FormData) {
            const entries: string[] = [];
            for (const [k, v] of (body as any).entries()) {
              // A FormData is already parsed: mask each entry by its name, before joining
              // (the joined string has no escaping, so it could not be parsed back). A string
              // value that is itself a structure is masked by the same rules.
              if (isSecretBodyField(String(k))) entries.push(`${k}=${BODY_REDACTED}`);
              else {
                const value = typeof v === 'string' ? redactEmbedded(v, 0).slice(0, 200) : '[File]';
                entries.push(`${k}=${value}`);
              }
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
              rawText = JSON.stringify(body);
            } catch {
              bodyPreview = '[Unstringifiable object body]';
            }
          }
          // Redact before the size cap: truncating first would cut a structure out of
          // parseability and defeat the structural parse.
          if (rawText) {
            const contentType =
              headerValue(init?.headers, 'content-type') ??
              (typeof Request !== 'undefined' && input instanceof Request
                ? headerValue(input.headers, 'content-type')
                : undefined);
            bodyPreview = redactBodyPreview(rawText, contentType);
          }
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
              const safe = redactBodyPreview(text, ctype);
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
                const safe = redactBodyPreview(text, ctype);
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
