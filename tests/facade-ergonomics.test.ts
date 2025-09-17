import { describe, it, expect, vi } from 'vitest';

import {createCamundaClient} from '../src';

// Smoke test: flattened body-only wrapper and passthrough exist, return a CancelablePromise with cancel()

describe('facade ergonomics', () => {
  it('exposes body-only overload accepting raw body', () => {
    const camunda = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:1234' },
      fetch: vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      ),
    });
    expect(typeof camunda.publishMessage).toBe('function');
    // We cannot perform real network call here; just ensure cancelable shape returned
    const p = camunda.publishMessage({
      /* raw body placeholder */
    } as any);
    expect(typeof (p as any).cancel).toBe('function');
  });
  it('exposes passthrough operation', () => {
    const camunda = createCamundaClient();
    expect(typeof camunda.getLicense).toBe('function');
  });
});
