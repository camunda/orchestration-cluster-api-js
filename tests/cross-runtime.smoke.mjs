// Cross-runtime smoke test for the built package.
//
// Verifies that the published artifact loads, constructs a client, and (when a
// broker is reachable) performs live REST I/O on Node, Deno, and Bun. The
// client is a `@hey-api/client-fetch` (Web `fetch`) client and every `node:`
// import in the runtime is dynamic + peripheral (OAuth file cache, worker-thread
// pool, support logger), so the module graph is spec-strict-runtime safe. This
// test guards that property against regressions.
//
// It is meant to run FROM A CONSUMER project that has installed the package
// (see scripts/cross-runtime-smoke.mjs), so it imports the package by its bare
// specifier — exactly how a real consumer does.
//
// Behaviour is env-driven:
//   - Always: import + construct + key-branding checks.
//   - When CAMUNDA_REST_ADDRESS (or ZEEBE_REST_ADDRESS) is set: a live
//     `getTopology()` GET, plus a `createProcessInstance` POST when
//     XR_PROCESS_ID names a deployed process. Issuing a request is what builds
//     a `Request` and therefore exercises the Request-init sanitize path on
//     spec-strict runtimes. Auth is taken from the standard CAMUNDA_*
//     environment.

import { createCamundaClient, ProcessDefinitionKey } from '@camunda8/orchestration-cluster-api';

/** Read an env var portably (Deno uses Deno.env; Node/Bun use process.env). */
const env = (key) => {
  const g = globalThis;
  if (g.Deno?.env?.get) return g.Deno.env.get(key);
  return g.process?.env?.[key];
};

const runtime = globalThis.Deno
  ? `Deno ${globalThis.Deno.version.deno}`
  : globalThis.Bun
    ? `Bun ${globalThis.Bun.version}`
    : `Node ${globalThis.process?.versions?.node ?? '?'}`;

const fail = (msg) => {
  console.error(`[cross-runtime] FAIL on ${runtime}: ${msg}`);
  const exit = globalThis.Deno?.exit ?? globalThis.process?.exit;
  exit?.(1);
  throw new Error(msg);
};

console.log(
  `[cross-runtime] runtime=${runtime} fetch=${typeof fetch} WebSocket=${typeof WebSocket}`
);

// 1. Import + shape.
if (typeof createCamundaClient !== 'function') fail('createCamundaClient is not a function');

// 2. Branded-key helper roundtrips (exercises a representative runtime util).
if (String(ProcessDefinitionKey.assumeExists('42')) !== '42') fail('key branding roundtrip failed');

// 3. Construct a client. On spec-strict runtimes (Deno, Bun) an unsanitized
//    RequestInit throws when a Request is built; constructing (and, below,
//    issuing a request) exercises that path.
const restAddress = env('CAMUNDA_REST_ADDRESS') ?? env('ZEEBE_REST_ADDRESS');
const client = createCamundaClient();
if (!client || typeof client.getTopology !== 'function') fail('client missing getTopology');
console.log('[cross-runtime] import + construct + branding OK');

// 4. Live REST I/O (only when a broker address is configured).
if (restAddress) {
  const topo = await client.getTopology();
  const gatewayVersion = topo?.gatewayVersion ?? topo?.brokers?.[0]?.version;
  if (!topo?.brokers?.length)
    fail(`getTopology returned no brokers: ${JSON.stringify(topo).slice(0, 200)}`);
  console.log(`[cross-runtime] live getTopology OK (gatewayVersion=${gatewayVersion})`);

  const processDefinitionId = env('XR_PROCESS_ID');
  if (processDefinitionId) {
    const inst = await client.createProcessInstance({ processDefinitionId });
    const key = inst?.processInstanceKey ?? inst?.key;
    if (!key) fail(`createProcessInstance returned no key: ${JSON.stringify(inst).slice(0, 200)}`);
    console.log(`[cross-runtime] live createProcessInstance OK (processInstanceKey=${key})`);
  } else {
    console.log('[cross-runtime] XR_PROCESS_ID unset — skipping create-instance');
  }
} else {
  console.log('[cross-runtime] CAMUNDA_REST_ADDRESS unset — construct-only (no live I/O)');
}

console.log(`[cross-runtime] PASS on ${runtime}`);
