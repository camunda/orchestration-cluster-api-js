import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

describe('tenantId default injection (createProcessInstance)', () => {
  it('injects default tenantId when omitted', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const req = input instanceof Request ? input : new Request(input, init);
      const body = JSON.parse(await req.clone().text());
      expect(req.method).toBe('POST');
      expect(req.url).toContain('/process-instances');
      expect(body.tenantId).toBe('tenant-alpha');

      return new Response(
        JSON.stringify({
          processDefinitionId: body.processDefinitionId,
          processDefinitionVersion: 1,
          tenantId: body.tenantId,
          variables: body.variables ?? {},
          processDefinitionKey: '1',
          processInstanceKey: '2',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });

    const client = createCamundaClient({
      config: {
        CAMUNDA_DEFAULT_TENANT_ID: 'tenant-alpha',
        CAMUNDA_SDK_VALIDATION: 'none',
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
      },
      fetch: fetchMock as any,
    });

    await client.createProcessInstance({
      processDefinitionId: 'process-a',
      variables: { foo: 'bar' },
    } as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not clobber an explicit tenantId', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const req = input instanceof Request ? input : new Request(input, init);
      const body = JSON.parse(await req.clone().text());
      expect(body.tenantId).toBe('tenant-explicit');

      return new Response(
        JSON.stringify({
          processDefinitionId: body.processDefinitionId,
          processDefinitionVersion: 1,
          tenantId: body.tenantId,
          variables: body.variables ?? {},
          processDefinitionKey: '1',
          processInstanceKey: '2',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });

    const client = createCamundaClient({
      config: {
        CAMUNDA_DEFAULT_TENANT_ID: 'tenant-alpha',
        CAMUNDA_SDK_VALIDATION: 'none',
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
      },
      fetch: fetchMock as any,
    });

    await client.createProcessInstance({
      processDefinitionId: 'process-a',
      tenantId: 'tenant-explicit',
      variables: { foo: 'bar' },
    } as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
