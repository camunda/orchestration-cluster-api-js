import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Issue #647 — align with the Camunda Java client: every tenant-scoped command
 * sends the effective default tenant (configured value, else `<default>`) when
 * the caller omits one; explicit tenants win; searches never get a tenant.
 */

type Call = [string, Record<string, unknown>];
const COMMANDS: Call[] = [
  ['createProcessInstance', { processDefinitionId: 'p' }],
  ['createProcessInstance', { processDefinitionKey: '2251799813685249' }],
  ['createProcessInstance', { processDefinitionId: 'p', processDefinitionVersionTag: 'v1' }],
  ['publishMessage', { name: 'm', correlationKey: 'k' }],
  ['correlateMessage', { name: 'm', correlationKey: 'k' }],
  ['broadcastSignal', { signalName: 's' }],
  ['evaluateDecision', { decisionDefinitionId: 'd' }],
  ['evaluateDecision', { decisionDefinitionKey: '2251799813685249' }],
  ['evaluateExpression', { expression: '=1' }],
  ['evaluateConditionals', { variables: { a: 1 } }],
  ['createDeployment', { resources: [new File(['<x/>'], 'p.bpmn', { type: 'application/xml' })] }],
];

function setup(config: Record<string, string> = {}) {
  const bodies: any[] = [];
  const fetchMock = vi.fn(async (input: any, init?: any) => {
    const req = input instanceof Request ? input : new Request(input, init);
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      const fields: Record<string, unknown> = {};
      for (const [k, v] of form.entries()) if (typeof v === 'string') fields[k] = v;
      bodies.push(fields);
    } else {
      const text = await req.text();
      bodies.push(text ? JSON.parse(text) : undefined);
    }
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

describe('default tenant on tenant-scoped commands (#647)', () => {
  it.each(COMMANDS)('%s sends <default> when nothing is configured', async (op, body) => {
    const { client, bodies } = setup();
    await send(client, op, body);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('<default>');
  });

  it.each(COMMANDS)('%s sends the configured default tenant', async (op, body) => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, op, body);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('tenant-a');
  });

  it.each(COMMANDS)('%s keeps an explicit tenant', async (op, body) => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(client, op, { ...body, tenantId: 'explicit' });
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBe('explicit');
  });

  const ACTIVATE = { type: 'job', timeout: 1000, maxJobsToActivate: 1 };
  it.each([
    ['unset', {}],
    ['PROVIDED', { tenantFilter: 'PROVIDED' }],
    ['PROVIDED + empty list', { tenantFilter: 'PROVIDED', tenantIds: [] }],
  ])('activateJobs sends [<default>] when tenantFilter is %s', async (_n, extra) => {
    const { client, bodies } = setup();
    await send(client, 'activateJobs', { ...ACTIVATE, ...extra });
    expect(bodies[0]?.tenantIds).toEqual(['<default>']);
  });

  it('activateJobs sends the configured default and keeps explicit ids', async () => {
    const a = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(a.client, 'activateJobs', ACTIVATE);
    expect(a.bodies[0]?.tenantIds).toEqual(['tenant-a']);
    const b = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    await send(b.client, 'activateJobs', { ...ACTIVATE, tenantIds: ['x'] });
    expect(b.bodies[0]?.tenantIds).toEqual(['x']);
  });

  it('activateJobs leaves tenantIds alone with tenantFilter ASSIGNED', async () => {
    const { client, bodies } = setup();
    await send(client, 'activateJobs', { ...ACTIVATE, tenantFilter: 'ASSIGNED' });
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantIds).toBeUndefined();
  });

  it('searches never get a tenant', async () => {
    const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
    try {
      await client.searchProcessInstances({ filter: {} }, { consistency: { waitUpToMs: 0 } });
    } catch {}
    expect(bodies).toHaveLength(1);
    expect(bodies[0]?.tenantId).toBeUndefined();
    expect(bodies[0]?.filter?.tenantId).toBeUndefined();
  });

  // Regression for the "tenant injection mutates the caller's input" class (PR #648
  // review): envelope.body aliased the caller's object, so injecting the default
  // tenant persisted on that object. The injection must go into a shallow copy.
  // NOTE: these call the client directly (not `send`, which spreads the body and
  // would mask the aliasing) so the exact caller object reaches the operation.
  describe('injection does not mutate the caller input', () => {
    it.each(COMMANDS)('%s accepts a frozen (Object.freeze) input', async (op, body) => {
      const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      // A frozen input must not throw a TypeError before the request is sent.
      try {
        await client[op](Object.freeze({ ...body }));
      } catch {
        // response shape is irrelevant; only the request body is asserted
      }
      expect(bodies).toHaveLength(1);
      expect(bodies[0]?.tenantId).toBe('tenant-a');
    });

    it.each(COMMANDS)('%s leaves a reused input tenant-less', async (op, body) => {
      const shared: Record<string, unknown> = { ...body };
      const a = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      try {
        await a.client[op](shared);
      } catch {}
      // The caller's object must not retain the injected tenant…
      expect(shared.tenantId).toBeUndefined();
      // …so a second client with a different default sends its own tenant.
      const b = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-b' });
      try {
        await b.client[op](shared);
      } catch {}
      expect(b.bodies).toHaveLength(1);
      expect(b.bodies[0]?.tenantId).toBe('tenant-b');
    });

    it('activateJobs accepts a frozen input and does not mutate a reused one', async () => {
      const { client, bodies } = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      try {
        await client.activateJobs(Object.freeze({ ...ACTIVATE }));
      } catch {}
      expect(bodies).toHaveLength(1);
      expect(bodies[0]?.tenantIds).toEqual(['tenant-a']);

      const shared: Record<string, unknown> = { ...ACTIVATE };
      const a = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' });
      try {
        await a.client.activateJobs(shared);
      } catch {}
      expect(shared.tenantIds).toBeUndefined();
      const b = setup({ CAMUNDA_DEFAULT_TENANT_ID: 'tenant-b' });
      try {
        await b.client.activateJobs(shared);
      } catch {}
      expect(b.bodies[0]?.tenantIds).toEqual(['tenant-b']);
    });
  });
});
