import fs from 'node:fs';
import path from 'node:path';

// Honors path-level `servers` entries from the OpenAPI spec in the generated SDK.
//
// The spec declares a path-level `servers` entry WITHOUT the `/v2` base path for the
// cluster-admin operations under `/cluster/v2/...`:
//
//   "/cluster/v2/topology": { "servers": [{ "url": "{schema}://{host}:{port}" }], "get": … }
//
// while the top-level servers are `{schema}://{host}:{port}/v2`. The correct request is
// therefore `GET /cluster/v2/topology` — but @hey-api/openapi-ts ignores path-level `servers`
// when emitting operation functions (`url` is always the raw spec path and `baseUrl` always
// comes from the client config), so the SDK sent `GET /v2/cluster/v2/topology`
// (https://github.com/camunda/orchestration-cluster-api-js/issues/573).
//
// This post-generation hook derives the set of affected operations from the bundled spec —
// every operation whose effective `servers` (operation-level, else path-level) differs from
// the top-level `servers` — and injects a per-operation `baseUrl` override into the generated
// sdk.gen.ts functions:
//
//   url: '/cluster/v2/topology',
//   baseUrl: __rootServerUrl(client),   // ← injected
//   ...options
//
// `__rootServerUrl` resolves the configured client baseUrl (e.g. `http://host:8080/v2`) to the
// path-level server by stripping the `/v2` suffix the SDK itself appended. It is a pure string
// operation: when the user opted out of the `/v2` suffix via CAMUNDA_REST_ADDRESS_EXACT, the
// baseUrl does not end in `/v2` and is returned unchanged, so a gateway-mounted base path
// (e.g. `https://gateway.example/api`) is preserved.
//
// The override is placed BEFORE `...options`, so an explicit per-call `baseUrl` still wins.
// The affected operation set is derived from the spec at pipeline time, so a future spec change
// (new cluster-admin operations, or the path-level servers being dropped) is handled
// automatically — and caught by tests/cluster-admin-base-path.test.ts if the injection regresses.

const root = process.cwd();
const bundlePath = path.join(root, 'external-spec', 'bundled', 'rest-api.bundle.json');
const sdkGenPath = path.join(root, 'src', 'gen', 'sdk.gen.ts');

if (!fs.existsSync(bundlePath) || !fs.existsSync(sdkGenPath)) {
  console.error('[path-level-servers] bundle or sdk.gen.ts not found — nothing to patch');
  process.exit(0);
}

interface SpecServer {
  url: string;
}

const spec = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const topUrls = new Set<string>((spec.servers ?? []).map((s: SpecServer) => s.url));

// operationId -> first effective server url, for every operation whose effective servers
// (operation-level ?? path-level) differ from the top-level servers.
const affected = new Map<string, string>();
for (const item of Object.values<any>(spec.paths ?? {})) {
  if (!item || typeof item !== 'object') continue;
  const pathServers: SpecServer[] | undefined = item.servers;
  for (const op of Object.values<any>(item)) {
    if (!op || typeof op !== 'object' || typeof op.operationId !== 'string') continue;
    const effective: SpecServer[] | undefined = op.servers ?? pathServers;
    if (!effective || effective.length === 0) continue;
    const urls = new Set(effective.map((s) => s.url));
    const differs = urls.size !== topUrls.size || [...urls].some((u) => !topUrls.has(u));
    if (differs) affected.set(op.operationId, effective[0].url);
  }
}

if (affected.size === 0) {
  console.log('[path-level-servers] No operations with non-default servers — nothing to patch');
  process.exit(0);
}

// Every affected operation currently resolves to the same root server (no `/v2`). The helper
// below strips the `/v2` suffix from the configured baseUrl. If a future spec introduces an
// operation-level server with a DIFFERENT relative base, this mapping needs extending — fail
// loudly so the divergence is caught at generation time rather than at runtime.
const distinctServers = new Set(affected.values());
if (distinctServers.size !== 1) {
  console.error(
    `[path-level-servers] Expected exactly one distinct non-default server url, found ${distinctServers.size}: ${[...distinctServers].join(', ')}. ` +
      'Extend this hook to map each server url to its own baseUrl resolver.'
  );
  process.exit(1);
}
const serverUrl = [...distinctServers][0];
if (serverUrl !== '{schema}://{host}:{port}') {
  console.error(
    `[path-level-servers] Unexpected non-default server url '${serverUrl}' — expected '{schema}://{host}:{port}'. ` +
      'Re-derive the baseUrl resolver for the new template before regenerating.'
  );
  process.exit(1);
}

let source = fs.readFileSync(sdkGenPath, 'utf8');

// Idempotency: if the helper is already injected, skip (pipeline re-runs on the same tree).
const HELPER_MARKER = 'const __rootServerUrl';
if (source.includes(HELPER_MARKER)) {
  console.log('[path-level-servers] sdk.gen.ts already patched — skipping');
  process.exit(0);
}

// 1. Inject the resolver helper immediately after the sdk.gen.ts import block.
const HELPER = `
// --- Path-level servers (issue #573) ----------------------------------------
// Injected by hooks/post/175-honor-path-level-servers.ts. The cluster-admin
// operations under /cluster/v2/* declare a path-level server WITHOUT the /v2
// base path; resolve the configured client baseUrl (…/v2) back to that root
// server by stripping the /v2 suffix the SDK appended. Pure string operation:
// a baseUrl that does not end in /v2 (e.g. CAMUNDA_REST_ADDRESS_EXACT mode) is
// returned unchanged, preserving gateway-mounted base paths.
const __rootServerUrl = (c: { getConfig: () => { baseUrl?: string } }): string | undefined => {
  const baseUrl = c.getConfig().baseUrl;
  return typeof baseUrl === 'string' ? baseUrl.replace(/\\/v2\\/?$/i, '') : baseUrl;
};
`;

const importMatches = [...source.matchAll(/^import .*$/gm)];
if (importMatches.length === 0) {
  console.error('[path-level-servers] Could not locate import block in sdk.gen.ts');
  process.exit(1);
}
const lastImport = importMatches[importMatches.length - 1];
const insertAt = (lastImport.index ?? 0) + lastImport[0].length;
source = source.slice(0, insertAt) + HELPER + source.slice(insertAt);

// 2. Inject `baseUrl: __rootServerUrl(options?.client ?? client),` into each affected
//    operation, anchored on its `url: '<spec path>'` line and placed before the `...options`
//    spread so an explicit per-call baseUrl still wins. The resolver must read the SAME client
//    the request will be issued on (`options?.client ?? client`), not the module-level default
//    client — the default client has no configured baseUrl, so resolving against it would
//    produce `undefined` and a relative request URL.
let patched = 0;
const failures: string[] = [];
for (const operationId of affected.keys()) {
  // Find the exported function for this operationId, then its `url:` line.
  const fnRe = new RegExp(`export const ${operationId} = `);
  const fnMatch = fnRe.exec(source);
  if (!fnMatch) {
    failures.push(`${operationId}: exported function not found`);
    continue;
  }
  const tail = source.slice(fnMatch.index);
  // The url line within this function's request object.
  const urlRe = /^(\s*)url: '([^']+)',$/m;
  const urlMatch = urlRe.exec(tail);
  if (!urlMatch) {
    failures.push(`${operationId}: url line not found`);
    continue;
  }
  const absUrlIdx = fnMatch.index + urlMatch.index;
  const indent = urlMatch[1];
  const specPath = urlMatch[2];
  const injection = `${indent}url: '${specPath}',\n${indent}baseUrl: __rootServerUrl(options?.client ?? client),`;
  source = source.slice(0, absUrlIdx) + injection + source.slice(absUrlIdx + urlMatch[0].length);
  patched++;
}

if (failures.length > 0) {
  console.error(`[path-level-servers] Failed to patch ${failures.length} operation(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

fs.writeFileSync(sdkGenPath, source, 'utf8');
console.log(
  `[path-level-servers] Injected root-server baseUrl override into ${patched} operation(s) in sdk.gen.ts`
);
