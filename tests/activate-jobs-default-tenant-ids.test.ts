import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Regression for #170 — `CAMUNDA_DEFAULT_TENANT_ID` was not applied to
 * `activateJobs` requests. Existing tenant-default injection only handled
 * the singular `tenantId` body field; operations with optional `tenantIds`
 * (plural array, e.g. `activateJobs`) were not covered.
 *
 * Class-of-defect: any operation whose request body has an optional
 * `tenantIds: TenantId[]` field must, when caller omits it, default to
 * `[config.defaultTenantId]` if a default tenant is configured.
 *
 * activateJobs is currently the only operation matching this shape, but the
 * structural guard scans the bundled spec so the same defect cannot recur in
 * a sibling operation without being caught.
 */

interface BundledOp {
  operationId?: string;
  requestBody?: {
    content?: Record<string, { schema?: Record<string, unknown> }>;
  };
}

interface BundledSpec {
  paths: Record<string, Record<string, BundledOp>>;
  components: { schemas: Record<string, Record<string, unknown>> };
}

function loadBundledSpec(): BundledSpec {
  const p = join(__dirname, '..', 'external-spec', 'bundled', 'rest-api.bundle.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

function resolveSchema(
  schema: Record<string, unknown> | undefined,
  schemas: Record<string, Record<string, unknown>>
): Record<string, unknown> | undefined {
  if (!schema) return undefined;
  if (typeof schema.$ref === 'string') {
    const name = (schema.$ref as string).split('/').pop()!;
    return schemas[name];
  }
  return schema;
}

function hasOptionalTenantIdsArray(schema: Record<string, unknown> | undefined): boolean {
  if (!schema || schema.type !== 'object') return false;
  const props = schema.properties as Record<string, Record<string, unknown>> | undefined;
  if (!props || !props.tenantIds) return false;
  const required = (schema.required as string[] | undefined) ?? [];
  if (required.includes('tenantIds')) return false;
  const t = props.tenantIds;
  return t.type === 'array';
}

function findOpsWithOptionalTenantIds(spec: BundledSpec): string[] {
  const result = new Set<string>();
  for (const methods of Object.values(spec.paths)) {
    for (const op of Object.values(methods)) {
      const opId = op.operationId;
      if (!opId) continue;
      const content = op.requestBody?.content;
      if (!content) continue;
      for (const [ct, mt] of Object.entries(content)) {
        if (!/json/i.test(ct)) continue;
        const resolved = resolveSchema(mt.schema, spec.components.schemas);
        if (!resolved) continue;
        const variants = (resolved.oneOf || resolved.anyOf) as
          | Record<string, unknown>[]
          | undefined;
        if (Array.isArray(variants) && variants.length > 1) {
          const all = variants
            .map((v) => resolveSchema(v, spec.components.schemas))
            .every((rs) => hasOptionalTenantIdsArray(rs));
          if (all) result.add(opId);
        } else if (hasOptionalTenantIdsArray(resolved)) {
          result.add(opId);
        }
      }
    }
  }
  return [...result].sort();
}

describe('default tenantIds (plural) injection — issue #170', () => {
  it('class-scoped: every operation with optional tenantIds[] body has injection block', () => {
    const spec = loadBundledSpec();
    const ops = findOpsWithOptionalTenantIds(spec);
    // Sanity: activateJobs must be one of them; otherwise the upstream spec changed.
    expect(ops).toContain('activateJobs');

    const clientSrc = readFileSync(join(__dirname, '..', 'src', 'gen', 'CamundaClient.ts'), 'utf8');

    const missing: string[] = [];
    for (const opId of ops) {
      // Find the implementation block for this op (the second overload, with `arg: any`).
      const implMarker = `${opId}(arg: any`;
      const start = clientSrc.indexOf(implMarker);
      expect(
        start,
        `implementation for ${opId}(arg: any, …) not found in CamundaClient.ts`
      ).toBeGreaterThan(-1);
      // Heuristic end: next "  }" at column 2 followed by newline + a method overload.
      // Use a generous slice (4 KB) and search within it.
      const slice = clientSrc.slice(start, start + 4096);
      const ok =
        /envelope\.body\.tenantIds\s*=/.test(slice) && /this\._config\.defaultTenantId/.test(slice);
      if (!ok) missing.push(opId);
    }
    expect(missing).toEqual([]);
  });

  it('activateJobs injects [defaultTenantId] when tenantIds is omitted', async () => {
    let captured: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (/\/jobs\/activation\b/.test(url)) {
        const raw =
          typeof init?.body === 'string'
            ? init.body
            : input instanceof Request
              ? await input.text()
              : '{}';
        captured = JSON.parse(raw || '{}');
      }
      return new Response(JSON.stringify({ jobs: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
        CAMUNDA_DEFAULT_TENANT_ID: 'tenant-alpha',
      },
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.activateJobs({
      type: 'demo-task',
      timeout: 30_000,
      maxJobsToActivate: 1,
    });

    expect(captured).toBeDefined();
    expect(captured?.tenantIds).toEqual(['tenant-alpha']);
  });

  it('activateJobs preserves explicit tenantIds when caller provides them', async () => {
    let captured: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (/\/jobs\/activation\b/.test(url)) {
        const raw =
          typeof init?.body === 'string'
            ? init.body
            : input instanceof Request
              ? await input.text()
              : '{}';
        captured = JSON.parse(raw || '{}');
      }
      return new Response(JSON.stringify({ jobs: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
        CAMUNDA_DEFAULT_TENANT_ID: 'tenant-alpha',
      },
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.activateJobs({
      type: 'demo-task',
      timeout: 30_000,
      maxJobsToActivate: 1,
      tenantIds: ['tenant-beta', 'tenant-gamma'],
    });

    expect(captured?.tenantIds).toEqual(['tenant-beta', 'tenant-gamma']);
  });

  it('activateJobs falls back to the runtime default tenant sentinel when no env var is set', async () => {
    // ConfigurationHydrator defaults `defaultTenantId` to the string '<default>'
    // (see src/runtime/unifiedConfiguration.ts). The injection mirrors the
    // singular `tenantId` behavior: tenantIds becomes ['<default>'] in this
    // case rather than being omitted.
    let captured: Record<string, unknown> | undefined;
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (/\/jobs\/activation\b/.test(url)) {
        const raw =
          typeof init?.body === 'string'
            ? init.body
            : input instanceof Request
              ? await input.text()
              : '{}';
        captured = JSON.parse(raw || '{}');
      }
      return new Response(JSON.stringify({ jobs: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.activateJobs({
      type: 'demo-task',
      timeout: 30_000,
      maxJobsToActivate: 1,
    });

    expect(captured).toBeDefined();
    expect(captured?.tenantIds).toEqual(['<default>']);
  });
});
