import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

describe('newgen auth integration', () => {
  it('injects Basic auth header via auth facade', async () => {
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_AUTH_STRATEGY: 'BASIC',
        CAMUNDA_BASIC_AUTH_USERNAME: 'alice',
        CAMUNDA_BASIC_AUTH_PASSWORD: 'secret',
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
      },
    });
    const headers = await camunda.getAuthHeaders();
    expect(headers.Authorization).toMatch(/^Basic /);
  });
});
