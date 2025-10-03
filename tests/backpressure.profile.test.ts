import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

// Helper to capture state quickly without real network: use disabled fetch (no ops invoked)

describe('Backpressure profiles', () => {
  it('applies AGGRESSIVE profile defaults when no explicit knobs set', () => {
    const client: any = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'AGGRESSIVE',
      } as any,
      fetch: (async () =>
        new Response('{}', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })) as any,
    });
    // initialMax not engaged until first signal, but config should reflect profile values accessible via internal config
    const cfg = client.getConfig();
    expect(cfg.backpressure.initialMax).toBe(24);
    expect(Math.round(cfg.backpressure.softFactor * 100)).toBe(80);
    expect(Math.round(cfg.backpressure.severeFactor * 100)).toBe(60);
    expect(cfg.backpressure.recoveryStep).toBe(2);
    expect(cfg.backpressure.floor).toBe(2);
    expect(cfg.backpressure.severeThreshold).toBe(4);
  });

  it('explicit knob overrides profile value', () => {
    const client: any = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'AGGRESSIVE',
        CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX: 40, // override
      } as any,
      fetch: (async () =>
        new Response('{}', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })) as any,
    });
    const cfg = client.getConfig();
    expect(cfg.backpressure.initialMax).toBe(40);
  });

  // Unknown profile is validated at schema parse time; we do not test here (invalid value raises error)
});
