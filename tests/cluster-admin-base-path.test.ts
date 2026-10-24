/**
 * Regression guard for https://github.com/camunda/orchestration-cluster-api-js/issues/573
 *
 * The OpenAPI spec declares a path-level `servers` entry WITHOUT the `/v2` base path for the
 * cluster-admin operations under `/cluster/v2/...` (top-level servers are
 * `{schema}://{host}:{port}/v2`). The correct request for e.g. `getClusterTopology` is
 * `GET /cluster/v2/topology`, but the SDK used to send `GET /v2/cluster/v2/topology` because
 * @hey-api/openapi-ts ignores path-level `servers` and the runtime base address always carries
 * the `/v2` suffix.
 *
 * The fix lives in hooks/post/175-honor-path-level-servers.ts, which injects a per-operation
 * `baseUrl` override (derived from the path-level `servers` entry in the bundled spec) into the
 * generated sdk.gen.ts functions for every affected operation.
 *
 * This test targets the class of defect generically: EVERY operation whose spec path carries a
 * path-level `servers` entry that differs from the top-level servers must be requested against
 * that server — not just the single `getClusterTopology` instance from the issue. The affected
 * operation set is derived from the bundled spec at test time, so a future spec change that adds
 * another such operation is covered automatically.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

const BUNDLE_PATH = join(__dirname, '..', 'external-spec', 'bundled', 'rest-api.bundle.json');

interface SpecServer {
  url: string;
}

/** Derives { operationId -> effective server url } for operations whose effective servers differ from the top-level servers. */
function operationsWithNonDefaultServers(): Record<string, string> {
  const spec = JSON.parse(readFileSync(BUNDLE_PATH, 'utf8'));
  const topUrls = new Set<string>((spec.servers ?? []).map((s: SpecServer) => s.url));
  const result: Record<string, string> = {};
  for (const item of Object.values<any>(spec.paths ?? {})) {
    if (!item || typeof item !== 'object') continue;
    const pathServers: SpecServer[] | undefined = item.servers;
    for (const op of Object.values<any>(item)) {
      if (!op || typeof op !== 'object' || typeof op.operationId !== 'string') continue;
      const effective: SpecServer[] | undefined = op.servers ?? pathServers;
      if (!effective) continue;
      const urls = new Set(effective.map((s) => s.url));
      const differs = urls.size !== topUrls.size || [...urls].some((u) => !topUrls.has(u));
      if (differs) {
        // All current entries use a single server url; keep the first for the assertion.
        result[op.operationId] = effective[0].url;
      }
    }
  }
  return result;
}

const AFFECTED = operationsWithNonDefaultServers();

describe('path-level servers (issue #573)', () => {
  it('the bundled spec declares cluster-admin operations with a non-/v2 server (sanity)', () => {
    // Sanity anchor: the issue lists getClusterTopology explicitly; if the spec ever drops the
    // path-level servers entirely this test must fail loudly rather than silently pass vacuously.
    expect(Object.keys(AFFECTED).length).toBeGreaterThan(0);
    expect(AFFECTED.getClusterTopology).toBe('{schema}://{host}:{port}');
  });

  it('sends every operation with a path-level server to that server, not the /v2 base', async () => {
    const fetchSpy = vi.fn(
      async (_req: Request) =>
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://cluster:8080' },
      fetch: fetchSpy as any,
    });

    for (const [operationId, serverUrl] of Object.entries(AFFECTED)) {
      fetchSpy.mockClear();
      const method = (client as any)[operationId];
      expect(typeof method, `client.${operationId} should exist`).toBe('function');

      // Operations here take either no input or a path/body input; call with an empty object
      // when the method requires an argument. Path params serialize as 'undefined' which is
      // fine — we only assert on the origin + path prefix, not the full path.
      try {
        await method.call(client);
      } catch {
        await method.call(client, {});
      }

      expect(fetchSpy, `${operationId} should issue exactly one request`).toHaveBeenCalledTimes(1);
      const req = fetchSpy.mock.calls[0][0] as Request;
      const url = new URL(req.url);

      // The path-level server is {schema}://{host}:{port} — i.e. the origin with NO /v2 prefix.
      // So the request path must be exactly the spec path (e.g. /cluster/v2/topology), never
      // /v2/cluster/v2/topology.
      expect(
        url.pathname.startsWith('/v2/cluster/'),
        `${operationId} must not prefix the path with /v2 (got ${url.pathname}); server=${serverUrl}`
      ).toBe(false);
      expect(
        url.pathname.startsWith('/cluster/v2/'),
        `${operationId} should hit /cluster/v2/... (got ${url.pathname})`
      ).toBe(true);
    }
  });

  it('still sends ordinary /v2 operations to the /v2 base (no regression)', async () => {
    const fetchSpy = vi.fn(
      async (_req: Request) =>
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://cluster:8080' },
      fetch: fetchSpy as any,
    });

    await (client as any).getLicense();
    const req = fetchSpy.mock.calls[0][0] as Request;
    expect(new URL(req.url).pathname).toBe('/v2/license');
  });

  it('honors CAMUNDA_REST_ADDRESS_EXACT for cluster-admin operations too', async () => {
    const fetchSpy = vi.fn(
      async (_req: Request) =>
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://gateway.example/api',
        CAMUNDA_REST_ADDRESS_EXACT: true,
      },
      fetch: fetchSpy as any,
    });

    await (client as any).getClusterTopology();
    const req = fetchSpy.mock.calls[0][0] as Request;
    // Exact mode: the configured address is used as-is; the cluster-admin baseUrl override must
    // strip only the /v2 suffix the SDK itself would have added — never user-supplied path parts.
    expect(new URL(req.url).pathname).toBe('/api/cluster/v2/topology');
  });
});
