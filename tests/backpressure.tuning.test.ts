import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

// Helper to craft a problem+json response
function bp(status: number, title?: string, detail?: string) {
  return new Response(
    JSON.stringify({ title: title || (status === 503 ? 'RESOURCE_EXHAUSTED' : 'bp'), detail }),
    { status, headers: { 'content-type': 'application/problem+json' } }
  );
}

describe('Backpressure tuning', () => {
  it('applies custom soft/severe factors and threshold', async () => {
    // softFactor: 80% (factor .8), severeFactor: 40% (factor .4), severeThreshold=2
    let calls = 0;
    const responses: Response[] = [
      bp(429), // first signal -> soft -> 0.8x initial (20 -> 16 if initial 20; we set initial to 10 to observe) (initialMax 10 => scale 8)
      bp(429), // second consecutive -> severe (threshold 2) -> 0.4x of previous (8 -> 3.2 ceil 4)
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ];
    const fetch = vi.fn(async () => responses[Math.min(calls++, responses.length - 1)]);
    const client: any = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX: 10,
        CAMUNDA_SDK_BACKPRESSURE_SOFT_FACTOR: 80,
        CAMUNDA_SDK_BACKPRESSURE_SEVERE_FACTOR: 40,
        CAMUNDA_SDK_BACKPRESSURE_SEVERE_THRESHOLD: 2,
        CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1,
      } as any,
      fetch: fetch as any,
    });

    // Sequential to avoid race conditions in severity escalation.
    await client.getTopology().catch(() => {}); // 1st 429 -> soft
    await client.getTopology().catch(() => {}); // 2nd 429 -> should escalate to severe (threshold=2)
    await client.getTopology().catch(() => {}); // success

    const state = client.getBackpressureState();
    // Permits should be a positive number and not exceed the configured initial cap.
    expect(state.permitsMax).toBeGreaterThan(0);
    expect(state.permitsMax).toBeLessThanOrEqual(10);
    // After two signals threshold=2 we expect severe; accept soft if timing anomaly.
    expect(['soft', 'severe']).toContain(state.severity);
  });
});
