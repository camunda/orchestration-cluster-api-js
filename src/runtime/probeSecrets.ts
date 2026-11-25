/**
 * Keeps probe secrets out of diagnostics.
 *
 * An activated probe carries its evaluated `input` with the engine's secret values injected,
 * and `secretPointers` lists the RFC 6901 pointers (into `input`) of the injected values. The
 * name-based redaction of body previews cannot know those names: a secret can sit under any
 * field name, at any depth. So wherever a response body is logged or written to disk, every
 * activated probe in it goes through here first: an object with an `input` and either
 * `secretPointers` or the `probeKey` and `probeId` of an activated probe.
 *
 * A probe can also arrive as JSON held in a string value (an echoed payload, a problem detail),
 * which a diagnostic would otherwise print whole, so such strings are parsed and masked too.
 *
 * Fail safe: when the pointers are missing, are not a list of strings, or one is not a valid
 * pointer, the whole `input` is masked rather than guessed at.
 */

const REDACTED = '[redacted]';
const MAX_DEPTH = 100;

const hasOwn = (o: object, k: string): boolean => Object.hasOwn(o, k);

/** A deep copy of a JSON value into null-prototype objects, so an own `__proto__` key stays a key. */
function cloneJson(value: unknown, depth: number): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (depth > MAX_DEPTH) return REDACTED;
  if (Array.isArray(value)) return value.map((v) => cloneJson(v, depth + 1));
  const out: Record<string, unknown> = Object.create(null);
  for (const [k, v] of Object.entries(value)) out[k] = cloneJson(v, depth + 1);
  return out;
}

/** The reference tokens of a JSON pointer, or `undefined` when it is not a valid, non-root pointer. */
function pointerTokens(pointer: string): string[] | undefined {
  if (!pointer.startsWith('/')) return undefined;
  // RFC 6901 allows `~` only as `~0` or `~1`; anything else is malformed, not a name to mask.
  if (/~(?![01])/.test(pointer)) return undefined;
  return pointer
    .slice(1)
    .split('/')
    .map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
}

const ARRAY_INDEX = /^(0|[1-9]\d*)$/;

/** The child of `node` named by `token`, or `undefined` when there is none. */
function child(node: unknown, token: string): unknown {
  if (Array.isArray(node)) return ARRAY_INDEX.test(token) ? node[Number(token)] : undefined;
  if (node !== null && typeof node === 'object' && hasOwn(node, token)) {
    return (node as Record<string, unknown>)[token];
  }
  return undefined;
}

/** Mask the value `tokens` points at inside `root`, in place. A pointer to nothing masks nothing. */
function maskAt(root: unknown, tokens: string[]): void {
  let parent = root;
  for (let i = 0; i < tokens.length - 1; i++) {
    parent = child(parent, tokens[i]);
    if (parent === undefined) return;
  }
  const last = tokens[tokens.length - 1];
  if (Array.isArray(parent)) {
    if (ARRAY_INDEX.test(last) && Number(last) < parent.length) parent[Number(last)] = REDACTED;
  } else if (parent !== null && typeof parent === 'object' && hasOwn(parent, last)) {
    (parent as Record<string, unknown>)[last] = REDACTED;
  }
}

function maskInput(input: unknown, pointers: unknown): unknown {
  if (!Array.isArray(pointers) || pointers.some((p) => typeof p !== 'string')) return REDACTED;
  const copy = cloneJson(input, 0);
  for (const pointer of pointers as string[]) {
    const tokens = pointerTokens(pointer);
    if (!tokens) return REDACTED;
    maskAt(copy, tokens);
  }
  return copy;
}

/** A string that is a JSON object or array, with its probes masked; any other string is returned as it was. */
function redactEmbeddedProbes(text: string, depth: number): string {
  const trimmed = text.trim();
  if (trimmed[0] !== '{' && trimmed[0] !== '[') return text;
  if (depth > MAX_DEPTH) return REDACTED;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return text;
  }
  if (parsed === null || typeof parsed !== 'object') return text;
  const masked = JSON.stringify(redactProbeSecrets(parsed, depth + 1));
  // Only a string that held a probe is rewritten, so every other string keeps its exact text.
  return masked === JSON.stringify(parsed) ? text : masked;
}

/**
 * A copy of a parsed JSON value in which the secrets of every activated probe in it are masked,
 * including probes held as JSON inside a string. Everything else is left as it was.
 */
export function redactProbeSecrets(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') return redactEmbeddedProbes(value, depth);
  if (value === null || typeof value !== 'object') return value;
  if (depth > MAX_DEPTH) return REDACTED;
  if (Array.isArray(value)) return value.map((v) => redactProbeSecrets(v, depth + 1));
  const record = value as Record<string, unknown>;
  // Probe-shaped, not just pointer-bearing: metadata that is missing must mask, not bypass.
  const isProbe =
    hasOwn(record, 'input') &&
    (hasOwn(record, 'secretPointers') || (hasOwn(record, 'probeKey') && hasOwn(record, 'probeId')));
  const out: Record<string, unknown> = Object.create(null);
  for (const [k, v] of Object.entries(record)) {
    out[k] =
      isProbe && k === 'input'
        ? maskInput(v, record.secretPointers)
        : redactProbeSecrets(v, depth + 1);
  }
  return out;
}
