import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

describe('Backpressure toggle & state access', () => {
  it('disables gating when CAMUNDA_SDK_BACKPRESSURE_ENABLED=false', async () => {
    // First two requests simulate backpressure-worthy responses; gating disabled means no queuing and state reports disabled.
    let count = 0;
    const responses: Response[] = [
      new Response(JSON.stringify({ title: 'bp' }), {
        status: 429,
        headers: { 'content-type': 'application/problem+json' },
      }),
      new Response(JSON.stringify({ title: 'bp2' }), {
        status: 503,
        headers: { 'content-type': 'application/problem+json' },
      }),
      new Response(JSON.stringify({ brokers: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ];
    const fetch = vi.fn(async () => responses[Math.min(count++, responses.length - 1)]);
    const client: any = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_SDK_BACKPRESSURE_ENABLED: false,
        CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 2,
      } as any,
      fetch: fetch as any,
    });

    // Fire several concurrent operations (would normally trigger gating)
    await Promise.all([
      client.getTopology().catch(() => {}),
      client.getTopology().catch(() => {}),
      client.getTopology().catch(() => {}),
    ]);

    const state = client.getBackpressureState();
    // Since disabled, permitsMax should remain null (never engaged) despite signals
    expect(state.permitsMax).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });

  it('getBackpressureState returns expected keys', () => {
    const client: any = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
    });
    const s = client.getBackpressureState();
    expect(s).toHaveProperty('severity');
    expect(s).toHaveProperty('consecutive');
    expect(s).toHaveProperty('permitsMax');
    expect(s).toHaveProperty('permitsCurrent');
    expect(s).toHaveProperty('waiters');
  });
});
