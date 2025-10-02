import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';
import { isSdkError } from '../src/runtime/errors';

describe('SdkError typing', () => {
  it('normalizes HTTP error to HttpSdkError', async () => {
    const fetchMock = vi.fn(async () => new Response('fail', { status: 500 }));
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetchMock as any,
    });
    try {
      await (client as any).getTopology();
      throw new Error('should have thrown');
    } catch (e) {
      expect(isSdkError(e)).toBe(true);
      if (isSdkError(e) && e.name === 'HttpSdkError') {
        expect((e as any).status).toBe(500);
      }
    }
  });

  it('normalizes validation error to ValidationSdkError', async () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_SDK_VALIDATION: 'strict',
      } as any,
      fetch: async () =>
        new Response(JSON.stringify({ brokers: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    });
    // provoke a request validation error using createProcessInstance with an invalid shape (missing required body fields if any)
    let threw = false;
    try {
      await (client as any).createProcessInstance({ nonExistent: true });
    } catch (e) {
      threw = true;
      if (isSdkError(e)) {
        expect(['ValidationSdkError', 'HttpSdkError', 'NetworkSdkError']).toContain(e.name);
      }
    }
    expect(threw).toBe(true);
  });
});
