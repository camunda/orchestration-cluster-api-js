import fs from 'node:fs';
import path from 'node:path';

// Makes the generated fetch client safe on spec-strict runtimes (Deno, Bun).
//
// The @hey-api/client-fetch runtime builds a Web `Request` by spreading its
// internal options object into the init:
//
//   const requestInit = { redirect: 'follow', ...opts, body: ... };
//   new Request(url, requestInit);
//
// `opts` carries non-standard keys (`client`, `fetch`, `baseUrl`, serializers,
// validators, `throwOnError`, `serializedBody`, `parseAs`, `url`, `path`, …).
// Browsers and Node/undici silently ignore unknown RequestInit keys, but Deno
// and Bun validate them strictly — Deno rejects `client` unless it is a
// `Deno.HttpClient`, so every request throws:
//
//   TypeError: Failed to construct 'Request': Argument 2 `client` must be a
//   Deno.HttpClient
//
// We inject a `sanitizeRequestInit()` helper that keeps only standard
// RequestInit fields, and wrap every `new Request(url, init)` site with it.
// This is a no-op on Node and the browser; it only drops keys those runtimes
// already ignore. Tracked upstream at @hey-api/openapi-ts (the client-fetch
// template should not leak internal options into the Request init).

const root = process.cwd();

// Files emitted by the @hey-api/client-fetch plugin that construct a Request.
const TARGETS = ['src/gen/client/client.gen.ts', 'src/gen/core/serverSentEvents.gen.ts'];

const HELPER_MARKER = 'sanitizeRequestInit';

const HELPER = `
// --- Spec-strict runtime compatibility (Deno, Bun) -------------------------
// The generated client spreads its internal options (non-standard keys such as
// \`client\`, \`fetch\`, \`baseUrl\`, serializers and validators) into the Request
// init. Browsers and Node/undici ignore unknown init keys, but Deno and Bun
// validate them strictly (e.g. Deno rejects \`client\` unless it is a
// \`Deno.HttpClient\`). Keep only standard RequestInit fields before constructing
// a Request. Injected by hooks/post/630-fix-request-init-runtime-compat.ts.
const __STANDARD_REQUEST_INIT_KEYS = [
  'method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect',
  'referrer', 'referrerPolicy', 'integrity', 'keepalive', 'signal', 'window',
  'duplex', 'priority',
] as const;
const sanitizeRequestInit = (init: RequestInit): RequestInit => {
  if (!init || typeof init !== 'object') return init;
  const out: Record<string, unknown> = {};
  for (const key of __STANDARD_REQUEST_INIT_KEYS) {
    const value = (init as Record<string, unknown>)[key];
    if (value !== undefined) out[key] = value;
  }
  return out as RequestInit;
};
`;

// Insert the helper after the leading import block (imports are hoisted, but we
// keep it after them for clean, lint-friendly output). Falls back to inserting
// right after the auto-generated header comment if no imports are found.
function injectHelper(source: string): string {
  const lines = source.split('\n');
  let lastImportEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\b/.test(lines[i])) {
      // Advance to the end of a (possibly multi-line) import statement.
      let j = i;
      while (j < lines.length && !/;\s*$/.test(lines[j])) j++;
      lastImportEnd = j;
      i = j;
    }
  }
  const insertAt = lastImportEnd >= 0 ? lastImportEnd + 1 : 1;
  lines.splice(insertAt, 0, HELPER);
  return lines.join('\n');
}

// Wrap `new Request(<url>, <identifier>)` → `new Request(<url>, sanitizeRequestInit(<identifier>))`.
// Only bare-identifier inits are matched, so the transform is idempotent: an
// already-wrapped `sanitizeRequestInit(init)` is not a bare identifier.
const REQUEST_RE = /new Request\(([^,]+),\s*([A-Za-z_$][\w$]*)\)/g;

let totalWrapped = 0;
let patchedFiles = 0;

for (const rel of TARGETS) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.error(`[fix-request-init] ${rel} not found — skipping`);
    continue;
  }

  let source = fs.readFileSync(file, 'utf8');

  if (source.includes(HELPER_MARKER)) {
    console.log(`[fix-request-init] ${rel} already patched — skipping`);
    continue;
  }

  let wrapped = 0;
  source = source.replace(REQUEST_RE, (_m, url: string, init: string) => {
    wrapped++;
    return `new Request(${url}, ${HELPER_MARKER}(${init}))`;
  });

  if (wrapped === 0) {
    console.error(
      `[fix-request-init] ${rel}: no \`new Request(url, init)\` sites found — ` +
        'the @hey-api/client-fetch template may have changed; review this hook.'
    );
    continue;
  }

  source = injectHelper(source);
  fs.writeFileSync(file, source, 'utf8');
  totalWrapped += wrapped;
  patchedFiles++;
  console.log(`[fix-request-init] ${rel}: sanitized ${wrapped} Request init site(s)`);
}

if (patchedFiles === 0) {
  console.log('[fix-request-init] nothing to patch');
} else {
  console.log(
    `[fix-request-init] patched ${patchedFiles} file(s), ${totalWrapped} Request site(s)`
  );
}
