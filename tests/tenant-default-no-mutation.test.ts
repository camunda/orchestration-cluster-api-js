import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Regression for #687: default-tenant injection wrote `tenantId` / `tenantIds`
 * onto the caller's request object. A reused request then kept the first
 * client's tenant, and a frozen request threw before it was sent.
 *
 * Class-of-defect: covers every operation the generator injects a default tenant
 * into, cross-checked against the spec metadata so a new operation is covered
 * without editing this file.
 */

const root = join(__dirname, '..');

function injectingOps(): string[] {
  const src = readFileSync(join(root, 'src', 'gen', 'operations.gen.ts'), 'utf8');
  const ops = new Set<string>();
  for (const m of src.matchAll(/'tenant\.default\.inject', \{ op: '([A-Za-z0-9]+)'/g)) {
    ops.add(m[1]);
  }
  return [...ops].sort();
}

type TenantShape = 'scalar' | 'list';

function metadataTenantShapes(): Map<string, TenantShape> {
  const meta = JSON.parse(
    readFileSync(join(root, 'external-spec', 'bundled', 'spec-metadata.json'), 'utf8')
  ) as {
    operations: {
      operationId: string;
      optionalTenantIdInBody?: boolean;
      optionalTenantIdsInBody?: boolean;
    }[];
  };
  const shapes = new Map<string, TenantShape>();
  for (const o of meta.operations) {
    if (o.optionalTenantIdsInBody) shapes.set(o.operationId, 'list');
    else if (o.optionalTenantIdInBody) shapes.set(o.operationId, 'scalar');
  }
  return shapes;
}

const tenantShapes = metadataTenantShapes();

const ops = injectingOps();

function minimalBody(opId: string): Record<string, unknown> {
  if (opId === 'createDeployment') {
    return {
      resources: [new File([Buffer.from('<bpmn/>')], 'p.bpmn', { type: 'application/xml' })],
    };
  }
  // Mixed-union bodies (issue #704): injection is per-variant, so the no-mutation
  // assertions must send the tenant-carrying by-id variant — an empty body matches
  // no variant and (correctly) gets no tenant.
  if (opId === 'suspendProcessDefinitions' || opId === 'resumeProcessDefinitions') {
    return { processDefinitionId: 'p' };
  }
  return {};
}

type Sent = { tenantId?: unknown; tenantIds?: unknown };

function clientFor(tenant: string, sent: Sent[]) {
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const req = input instanceof Request ? input : new Request(input, init);
    const type = req.headers.get('content-type') ?? '';
    if (type.includes('multipart/form-data')) {
      const form = await req.formData();
      sent.push({ tenantId: form.get('tenantId') ?? undefined });
    } else {
      const text = await req.text();
      sent.push(text ? JSON.parse(text) : {});
    }
    return new Response(JSON.stringify({ jobs: [], deployments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return createCamundaClient({
    config: {
      CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
      CAMUNDA_DEFAULT_TENANT_ID: tenant,
      CAMUNDA_SDK_LOG_LEVEL: 'silent',
    },
    fetch: fetch as unknown as typeof globalThis.fetch,
  }) as unknown as Record<string, (body: unknown) => Promise<unknown>>;
}

function tenantOf(sent: Sent): unknown {
  return sent.tenantIds !== undefined ? sent.tenantIds : sent.tenantId;
}

// The injected shape follows the spec metadata: `optionalTenantIdsInBody`
// operations (e.g. activateJobs) take a tenant list, the rest a scalar.
function expected(opId: string, tenant: string): unknown {
  return tenantShapes.get(opId) === 'list' ? [tenant] : tenant;
}

describe('default-tenant injection leaves the caller request untouched (#687)', () => {
  it('covers every operation the spec marks as taking an optional body tenant', () => {
    const fromMetadata = [...tenantShapes.keys()].sort();
    expect(fromMetadata.length).toBeGreaterThan(0);
    expect(ops).toEqual(expect.arrayContaining(fromMetadata));
    expect(ops).toContain('activateJobs');
    expect(tenantShapes.get('activateJobs')).toBe('list');
  });

  it.each(ops)('%s does not modify the caller request', async (opId) => {
    const body = minimalBody(opId);
    const keysBefore = Object.keys(body);
    const sent: Sent[] = [];

    await clientFor('tenant-a', sent)[opId](body);

    expect(tenantOf(sent[0])).toEqual(expected(opId, 'tenant-a'));
    expect(Object.keys(body)).toEqual(keysBefore);
  });

  it.each(ops)('%s sends a frozen request with the default tenant', async (opId) => {
    const body = Object.freeze(minimalBody(opId));
    const sent: Sent[] = [];

    await clientFor('tenant-a', sent)[opId](body);

    expect(tenantOf(sent[0])).toEqual(expected(opId, 'tenant-a'));
  });

  it.each(ops)('%s sends a reused request to each client default tenant', async (opId) => {
    const body = minimalBody(opId);
    const sentA: Sent[] = [];
    const sentB: Sent[] = [];

    await clientFor('tenant-a', sentA)[opId](body);
    await clientFor('tenant-b', sentB)[opId](body);

    expect(tenantOf(sentA[0])).toEqual(expected(opId, 'tenant-a'));
    expect(tenantOf(sentB[0])).toEqual(expected(opId, 'tenant-b'));
  });
});
