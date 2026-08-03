import fs from 'node:fs';
import path from 'node:path';

// Restores fail-fast semantics for transport-layer failures in the generated
// fetch client.
//
// Up to @hey-api/openapi-ts 0.86 the generated `request()` called `fetch`
// *outside* any try/catch, so a transport failure (DNS, ECONNREFUSED,
// unreachable host, TLS, abort) always rejected the returned promise.
// `throwOnError` gated exactly one thing: what to do with an HTTP *error
// response* (`!response.ok`).
//
// 0.96+ wraps the whole request body — request construction, request
// interceptors, the `fetch` call, response interceptors, and body parsing — in
// a single try/catch whose handler honours `throwOnError`. With
// `throwOnError:false` (which every `CamundaClient` method uses, so it can run
// its own retry/backpressure classification) a connection failure stopped
// rejecting and started *returning* `{ error, response: undefined }`. That
// object has no HTTP status, so it flowed through `evaluateSdkResponse` as a
// status-less success and the operation silently resolved.
//
// See camunda/orchestration-cluster-api-js#405. `evaluateSdkResponse` now
// throws on that shape (#406), but that is a downstream backstop: the raw
// client is public surface too, and swallowing a failed request at this layer
// also disables the network-error branch of the retry classifier.
//
// This hook narrows `throwOnError` back to its pre-0.96 meaning by tagging the
// one deliberate `throw` that represents an HTTP error response. Everything
// else reaching the catch block — a failed `fetch`, an abort, a throwing
// interceptor, a body-serialization or JSON-parse failure — rejects
// unconditionally, exactly as it did on 0.86.
//
// Upstream: the client-fetch template should not let `throwOnError` gate
// non-response failures.

const root = process.cwd();
const TARGET = 'src/gen/client/client.gen.ts';
const file = path.join(root, TARGET);

if (!fs.existsSync(file)) {
  console.error(`[fix-transport-error] ${TARGET} not found — skipping`);
  process.exit(0);
}

let source = fs.readFileSync(file, 'utf8');

const FLAG = '__isHttpErrorResponse';

if (source.includes(FLAG)) {
  console.log(`[fix-transport-error] ${TARGET} already patched — skipping`);
  process.exit(0);
}

// 1. Declare the flag alongside the `request` / `response` locals that the
//    template hoists above the try block.
const DECL_ANCHOR = 'let response: Response | undefined;';
if (!source.includes(DECL_ANCHOR)) {
  console.error(
    `[fix-transport-error] ${TARGET}: could not find \`${DECL_ANCHOR}\` — ` +
      'the @hey-api/client-fetch template may have changed; review this hook.'
  );
  process.exit(1);
}
source = source.replace(
  DECL_ANCHOR,
  `${DECL_ANCHOR}\n` +
    `    // Set immediately before the one throw that represents an HTTP error\n` +
    `    // *response*; \`throwOnError\` gates that case only. Any other failure\n` +
    `    // (transport, abort, interceptor, parse) must reject unconditionally.\n` +
    `    // Injected by hooks/post/640-fix-transport-error-rejection.ts.\n` +
    `    let ${FLAG} = false;`
);

// 2. Tag the `!response.ok` throw as an HTTP error response.
const THROW_ANCHOR = 'throw jsonError ?? textError;';
if (!source.includes(THROW_ANCHOR)) {
  console.error(
    `[fix-transport-error] ${TARGET}: could not find \`${THROW_ANCHOR}\` — ` +
      'the @hey-api/client-fetch template may have changed; review this hook.'
  );
  process.exit(1);
}
source = source.replace(THROW_ANCHOR, `${FLAG} = true;\n      ${THROW_ANCHOR}`);

// 3. Widen the rethrow condition in the catch block.
const GATE_RE = /if \(throwOnError\) \{\n(\s*)throw finalError;/;
if (!GATE_RE.test(source)) {
  console.error(
    `[fix-transport-error] ${TARGET}: could not find the \`if (throwOnError)\` rethrow gate — ` +
      'the @hey-api/client-fetch template may have changed; review this hook.'
  );
  process.exit(1);
}
source = source.replace(GATE_RE, (_m, indent: string) => {
  return `if (throwOnError || !${FLAG}) {\n${indent}throw finalError;`;
});

fs.writeFileSync(file, source, 'utf8');
console.log(
  `[fix-transport-error] ${TARGET}: transport failures now reject regardless of throwOnError`
);
