import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { tenantInjectionFromMetadata } from '../hooks/post/300-generate-class-methods';
import { createCamundaClient } from '../src';

/**
 * Issue #704 — default-tenant injection is decided per union variant, from the
 * request-body shape in the spec: an operation whose body is a `oneOf`/`anyOf`
 * union injects the effective default tenant when the variant being sent has an
 * optional top-level `tenantId`, and sends nothing when it does not.
 *
 * `suspendProcessDefinitions` / `resumeProcessDefinitions` are the drivers:
 * their `…Instruction` body is a union of a by-key variant (no `tenantId`) and
 * a by-id variant (optional `tenantId`). The by-id variant must get the
 * configured default tenant (else `<default>`); the by-key variant must not.
 * This matches the Camunda Java client, which sets the default tenant on the
 * by-id path only.
 *
 * Class-of-defect guard: the check below reads, from spec-metadata.json (the
 * bundler's `optionalTenantIdInBody` / `optionalTenantIdInBodyVariants`), every
 * operation with an optional body `tenantId` and asserts the generated SDK
 * injects for it — a new tenant-scoped operation is
 * covered without editing this file, and the test fails if one is missed.
 */

const root = join(__dirname, '..');

type Call = [string, Record<string, unknown>];

/** The by-id (optional `tenantId`) variants: injection applies. */
const BY_ID: Call[] = [
  ['suspendProcessDefinitions', { processDefinitionId: 'p' }],
  ['resumeProcessDefinitions', { processDefinitionId: 'p' }],
];

/** The by-key (no `tenantId`) variants: no tenant may be sent. */
const BY_KEY: Call[] = [
  ['suspendProcessDefinitions', { processDefinitionKey: '2251799813685249' }],
  ['resumeProcessDefinitions', { processDefinitionKey: '2251799813685249' }],
];

function setup(config: Record<string, string> = {}) {
  const bodies: any[] = [];
  const fetchMock = vi.fn(async (input: any, init?: any) => {
    const req = input instanceof Request ? input : new Request(input, init);
    const text = await req.text();
    bodies.push(text ? JSON.parse(text) : undefined);
    return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const client = createCamundaClient({
    config: { CAMUNDA_SDK_VALIDATION: 'none', CAMUNDA_SDK_LOG_LEVEL: 'silent', ...config } as any,
    fetch: fetchMock as any,
    // isolate from ambient CAMUNDA_* env vars so zero-config cases are deterministic
    env: {},
  });
  return { client: client as any, bodies };
}

async function send(client: any, op: string, body: Record<string, unknown>) {
  try {
    await client[op]({ ...body });
  } catch {
    // response shape is irrelevant; only the request body is asserted
  }
}

// --- Metadata-derived expectations (the "generated from the spec, not a list" guard) ---

interface OpMetadata {
  operationId: string;
  optionalTenantIdInBody?: boolean;
  optionalTenantIdInBodyVariants?: string[];
  optionalTenantIdsInBody?: boolean;
}

function loadMetadata() {
  const meta = JSON.parse(
    readFileSync(join(root, 'external-spec', 'bundled', 'spec-metadata.json'), 'utf8')
  ) as { operations: OpMetadata[] };
  /** Operations whose body may carry an optional `tenantId` (whole body or some variant). */
  const injectable = new Set<string>();
  for (const op of meta.operations) {
    if (op.optionalTenantIdInBody || (op.optionalTenantIdInBodyVariants ?? []).length > 0) {
      injectable.add(op.operationId);
    }
  }
  return { injectable };
}

/** Operations whose generated function injects a default singular `tenantId`. */
function generatedInjectingOps(): Set<string> {
  const src = readFileSync(join(root, 'src', 'gen', 'operations.gen.ts'), 'utf8');
  const ops = new Set<string>();
  // Per-operation functions are `export function <opId>(core: CamundaCore, …`; find
  // those whose body contains the singular-tenant injection marker.
  const fnRe = /export function (\w+)\(core: CamundaCore[\s\S]*?\n\}\n/g;
  let m: RegExpExecArray | null;
  while ((m = fnRe.exec(src))) {
    if (m[0].includes('tenantId: rt._config.defaultTenantId')) ops.add(m[1]);
  }
  return ops;
}

describe('per-variant default tenant on union bodies (#704)', () => {
  it.each(BY_ID)('%s by id sends <default> when nothing is configured', async (op, body) => {
    const { client, bodies } = setup();
    await send(client, op, body);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('<default>');
  });

  it.each(BY_ID)('%s by id sends the configured default tenant', async (op, body) => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, op, body);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('tenant-a');
  });

  it.each(BY_ID)('%s by id keeps an explicit tenant', async (op, body) => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, op, { ...body, tenantId: 'explicit' });
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('explicit');
  });

  it.each(BY_KEY)('%s by key sends no tenantId', async (op, body) => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, op, body);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).not.toHaveProperty('tenantId');
  });

  // A by-key body carrying the by-id discriminator as an explicit `undefined`
  // own property must NOT match the by-id variant: JSON serialization drops the
  // undefined field, so the wire payload is the by-key shape, whose schema
  // (`additionalProperties: false`) forbids `tenantId`. `in`/`hasOwn` alone
  // cannot see this — the matcher must require a *defined* value.
  it.each(['suspendProcessDefinitions', 'resumeProcessDefinitions'] as const)(
    '%s with an undefined by-id discriminator on a by-key body sends no tenantId',
    async (op) => {
      const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      await send(client, op, {
        processDefinitionKey: '2251799813685249',
        processDefinitionId: undefined,
      });
      expect(bodies).toHaveLength(1);
      expect(bodies[0]).not.toHaveProperty('tenantId');
    }
  );

  it.each(['suspendProcessDefinitions', 'resumeProcessDefinitions'] as const)(
    '%s with a null by-id discriminator on a by-key body sends no tenantId',
    async (op) => {
      const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      await send(client, op, {
        processDefinitionKey: '2251799813685249',
        processDefinitionId: null,
      });
      expect(bodies).toHaveLength(1);
      expect(bodies[0]).not.toHaveProperty('tenantId');
    }
  );

  it('injection does not mutate a reused by-id input', async () => {
    const shared: Record<string, unknown> = { processDefinitionId: 'p' };
    const a = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await a.client.suspendProcessDefinitions(shared);
    expect(shared.tenantId).toBeUndefined();
    const b = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-b' });
    await b.client.suspendProcessDefinitions(shared);
    expect(b.bodies[0]?.tenantId).toBe('tenant-b');
  });

  it('accepts a frozen by-id input', async () => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, 'suspendProcessDefinitions', Object.freeze({ processDefinitionId: 'p' }));
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('tenant-a');
  });

  it('injects for every spec operation with an optional body tenantId on any variant', () => {
    const { injectable } = loadMetadata();
    const generated = generatedInjectingOps();
    // Sanity: the metadata must list the known tenant-scoped commands.
    expect(injectable.size).toBeGreaterThan(0);
    expect(injectable).toContain('suspendProcessDefinitions');
    expect(injectable).toContain('resumeProcessDefinitions');
    expect(injectable).toContain('createProcessInstance');
    // Every operation the spec says can take an optional body tenantId must be
    // generated with injection — no hard-coded list to forget.
    for (const op of injectable) {
      expect(generated, `expected ${op} to inject the default tenant`).toContain(op);
    }
  });

  it('does not inject where tenantId is required (createTenant)', () => {
    const generated = generatedInjectingOps();
    expect(generated).not.toContain('createTenant');
  });

  // The generator's metadata → matcher mapping (hooks/post/300-generate-class-methods.ts).
  describe('tenantInjectionFromMetadata', () => {
    const schemas: Record<string, Record<string, unknown>> = {
      ById: {
        type: 'object',
        required: ['processDefinitionId'],
        properties: { processDefinitionId: { type: 'string' }, tenantId: { type: 'string' } },
      },
      Base: { required: ['includeInstances'] },
      Composed: {
        allOf: [{ $ref: '#/components/schemas/Base' }],
        required: ['processDefinitionId'],
      },
    };

    it('injects unconditionally when optionalTenantIdInBody is true (inline bodies too)', () => {
      expect(
        tenantInjectionFromMetadata(
          { optionalTenantIdInBody: true, optionalTenantIdInBodyVariants: [] },
          schemas
        )
      ).toEqual({
        optionalTenantIdInBody: true,
        optionalTenantIdVariants: [[]],
        optionalTenantIdsInBody: false,
      });
    });

    it('restricts injection to the listed variants otherwise', () => {
      expect(
        tenantInjectionFromMetadata(
          { optionalTenantIdInBody: false, optionalTenantIdInBodyVariants: ['ById'] },
          schemas
        ).optionalTenantIdVariants
      ).toEqual([['processDefinitionId']]);
    });

    it('merges required properties through allOf and $ref', () => {
      expect(
        tenantInjectionFromMetadata({ optionalTenantIdInBodyVariants: ['Composed'] }, schemas)
          .optionalTenantIdVariants
      ).toEqual([['includeInstances', 'processDefinitionId']]);
    });

    it('does not inject when neither flag nor variants are set', () => {
      expect(tenantInjectionFromMetadata({ optionalTenantIdsInBody: true }, schemas)).toEqual({
        optionalTenantIdInBody: false,
        optionalTenantIdVariants: [],
        optionalTenantIdsInBody: true,
      });
    });

    it('fails closed on an unknown variant schema', () => {
      expect(() =>
        tenantInjectionFromMetadata({ optionalTenantIdInBodyVariants: ['Nope'] }, schemas)
      ).toThrow(/unknown schema Nope/);
    });
  });
});
