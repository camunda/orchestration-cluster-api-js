import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

/**
 * Validates that zod schemas load lazily and still work correctly for validation
 * after being moved from an eager top-level import to a dynamic import().
 */
describe('lazy schema loading', () => {
  it('schemas are not loaded when validation is disabled (default)', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://local' },
      fetch: vi.fn(
        async () =>
          new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      ) as any,
    });
    // _schemasPromise should be null because no validation was triggered
    expect((client as any)._schemasPromise).toBeNull();
  });

  it('schemas load on demand when validation is enabled', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_VALIDATION: 'req:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
      fetch: vi.fn(
        async () =>
          new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      ) as any,
    });
    expect((client as any)._schemasPromise).toBeNull();

    // Trigger schema loading manually
    const schemas = await (client as any)._loadSchemas();
    expect(schemas).toBeDefined();
    expect(typeof schemas.zCreateProcessInstanceData).toBe('object');
    // After first load, the promise should be cached
    expect((client as any)._schemasPromise).not.toBeNull();
    // Second call returns same cached module
    const schemas2 = await (client as any)._loadSchemas();
    expect(schemas2).toBe(schemas);
  });

  it('req:strict rejects invalid request body through a real API method', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_VALIDATION: 'req:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
      fetch: vi.fn(
        async () =>
          new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
      ) as any,
    });
    // Pass a completely wrong body — createProcessInstance expects a ProcessInstanceCreationInstruction
    await expect(client.createProcessInstance({ bogus: true } as any)).rejects.toThrow();
  });

  it('req:strict passes valid request body through a real API method', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ processDefinitionKey: '1', processInstanceKey: '2' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_VALIDATION: 'req:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
      fetch: fetchMock as any,
    });
    // Provide a valid body for createProcessInstance
    const result = await client.createProcessInstance({
      processDefinitionId: 'my-process',
    } as any);
    expect(fetchMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('res:strict rejects an invalid response through a real API method', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_VALIDATION: 'res:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
      // Return a response that doesn't match the getLicense schema
      fetch: vi.fn(
        async () =>
          new Response(JSON.stringify({ totallyWrong: 'not-a-license' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      ) as any,
    });
    await expect(client.getLicense()).rejects.toThrow();
  });

  it('res:strict passes a valid response through a real API method', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_VALIDATION: 'res:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
      fetch: vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              validLicense: true,
              licenseType: 'production',
              isCommercial: true,
              expiresAt: '2027-01-01T00:00:00Z',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      ) as any,
    });
    const result = await client.getLicense();
    expect(result).toBeDefined();
    expect(result.validLicense).toBe(true);
  });
});
