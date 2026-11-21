import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { optionalTenantIdVariantsOfBody } from '../hooks/post/300-generate-class-methods';
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
 * Class-of-defect guard: the spec walk below derives, from the bundled spec,
 * every operation with an optional body `tenantId` on any union variant and
 * asserts the generated SDK injects for it — a new tenant-scoped operation is
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

// --- Spec-derived expectations (the "generated from the spec, not a list" guard) ---

interface SpecSchema {
  $ref?: string;
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
  oneOf?: SpecSchema[];
  anyOf?: SpecSchema[];
  allOf?: SpecSchema[];
}

// The hook's walk takes `Record<string, unknown>` schemas; the fixtures below
// build that shape directly (the structured SpecSchema above is for reading
// the bundled spec, where the extra typing helps).
type RawSchema = Record<string, unknown>;

function loadSpec() {
  const spec = JSON.parse(
    readFileSync(join(root, 'external-spec', 'bundled', 'rest-api.bundle.json'), 'utf8')
  ) as {
    paths: Record<string, Record<string, { operationId?: string; requestBody?: unknown }>>;
    components: { schemas: Record<string, SpecSchema> };
  };
  const schemas = spec.components.schemas;
  const resolve = (s: SpecSchema | undefined): SpecSchema | undefined =>
    s && typeof s.$ref === 'string' ? schemas[s.$ref.split('/').pop()!] : s;

  // Per-variant tenantId state for one (possibly union) body schema.
  // 'optional' = this variant accepts an optional tenantId; 'required' = tenantId is
  // required; 'absent' = no tenantId on this variant. A union yields one state per variant.
  function variantStates(
    raw: SpecSchema | undefined,
    depth = 0
  ): Array<'optional' | 'required' | 'absent'> {
    const s = resolve(raw);
    if (!s || depth > 10) return ['absent'];
    const variants = s.oneOf ?? s.anyOf;
    if (Array.isArray(variants) && variants.length > 0) {
      return variants.flatMap((v) => variantStates(v, depth + 1));
    }
    let state: 'optional' | 'required' | 'absent' = 'absent';
    if (s.properties?.tenantId) state = 'optional';
    for (const part of s.allOf ?? []) {
      const sub = variantStates(part, depth + 1);
      if (sub.includes('required')) return ['required'];
      if (sub.includes('optional')) state = 'optional';
    }
    if ((s.required ?? []).includes('tenantId')) return ['required'];
    return [state];
  }

  /** Operations whose body has an optional `tenantId` on at least one union variant. */
  const injectable = new Set<string>();
  for (const methods of Object.values(spec.paths)) {
    for (const op of Object.values(methods)) {
      const opId = op.operationId;
      const content = (op.requestBody as { content?: Record<string, { schema?: SpecSchema }> })
        ?.content;
      if (!opId || !content) continue;
      for (const [ct, media] of Object.entries(content)) {
        if (!/json/i.test(ct)) continue;
        if (variantStates(media?.schema).includes('optional')) injectable.add(opId);
      }
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
    const { injectable } = loadSpec();
    const generated = generatedInjectingOps();
    // Sanity: the walk must find the known tenant-scoped commands.
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

  // Class-of-defect guard for the generator's variant walk: a `oneOf`/`anyOf`
  // nested inside `allOf` (a composed union) must still yield per-variant
  // matchers. These tests call the hook's real walk
  // (`optionalTenantIdVariantsOfBody` from hooks/post/300-generate-class-methods.ts)
  // against synthetic spec fixtures: the by-id/by-key union wrapped in
  // `allOf: [{ oneOf: [...] }]` must produce the same matcher as the bare union.
  // If the walk stops expanding unions through `allOf`, the composed shape
  // silently loses injection (or injects unconditionally) and this fails.
  describe('allOf-composed unions (generator variant walk)', () => {
    const BY_KEY: RawSchema = {
      type: 'object',
      required: ['processDefinitionKey'],
      properties: { processDefinitionKey: { type: 'string' } },
    };
    const BY_ID: RawSchema = {
      type: 'object',
      required: ['processDefinitionId'],
      properties: { processDefinitionId: { type: 'string' }, tenantId: { type: 'string' } },
    };

    it('a bare mixed union yields a discriminative by-id matcher', () => {
      const { variants, total } = optionalTenantIdVariantsOfBody({ oneOf: [BY_KEY, BY_ID] }, {});
      expect(total).toBe(2);
      expect(variants).toEqual([['processDefinitionId']]);
    });

    it('a union nested inside allOf yields the same discriminative by-id matcher', () => {
      const composed: RawSchema = { allOf: [{ oneOf: [BY_KEY, BY_ID] }] };
      const { variants, total } = optionalTenantIdVariantsOfBody(composed, {});
      expect(total).toBe(2);
      expect(variants).toEqual([['processDefinitionId']]);
    });

    it('enclosing allOf properties merge into every expanded variant', () => {
      const composed: RawSchema = {
        allOf: [{ oneOf: [BY_KEY, BY_ID] }],
        required: ['includeProcessInstances'],
        properties: { includeProcessInstances: { type: 'boolean' } },
      };
      const { variants, total } = optionalTenantIdVariantsOfBody(composed, {});
      expect(total).toBe(2);
      // The by-id variant's required set must include both its own discriminator
      // and the enclosing shape's required property.
      expect(variants).toEqual([['includeProcessInstances', 'processDefinitionId']]);
    });

    it('a $ref-ed union nested inside allOf resolves and expands', () => {
      const schemas: Record<string, RawSchema> = {
        SuspensionInstruction: { oneOf: [BY_KEY, BY_ID] },
      };
      const composed: RawSchema = {
        allOf: [{ $ref: '#/components/schemas/SuspensionInstruction' }],
      };
      const { variants, total } = optionalTenantIdVariantsOfBody(composed, schemas);
      expect(total).toBe(2);
      expect(variants).toEqual([['processDefinitionId']]);
    });

    // An allOf with NO union inside is a plain composition: it must stay ONE
    // shape (variantInfo merges the parts). Expanding it would cross-product
    // the parts into phantom variants and inflate the per-op total, flipping a
    // non-discriminative operation into a discriminative one.
    it('an allOf without any union stays a single shape', () => {
      const plain: RawSchema = {
        allOf: [
          { properties: { tenantId: { type: 'string' } } },
          { required: ['foo'], properties: { foo: { type: 'string' } } },
        ],
      };
      const { variants, total } = optionalTenantIdVariantsOfBody(plain, {});
      expect(total).toBe(1);
      expect(variants).toEqual([['foo']]);
    });

    // A mixed allOf (one union part + one plain part) expands the union but
    // must not multiply the plain part into extra shapes.
    it('a mixed allOf expands only the union part', () => {
      const mixed: RawSchema = {
        allOf: [
          { oneOf: [BY_KEY, BY_ID] },
          { properties: { extra: { type: 'string' } }, required: ['extra'] },
        ],
      };
      const { variants, total } = optionalTenantIdVariantsOfBody(mixed, {});
      expect(total).toBe(2);
      // The by-id branch must also require the plain part's required property.
      expect(variants).toEqual([['extra', 'processDefinitionId']]);
    });

    // Constraints sitting alongside a top-level union apply to every branch;
    // dropping them would under-specify the runtime matcher.
    it('constraints alongside a union fold into every branch', () => {
      const composed: RawSchema = {
        oneOf: [BY_KEY, BY_ID],
        required: ['top'],
        properties: { top: { type: 'string' } },
      };
      const { variants, total } = optionalTenantIdVariantsOfBody(composed, {});
      expect(total).toBe(2);
      expect(variants).toEqual([['processDefinitionId', 'top']]);
    });
  });
});
