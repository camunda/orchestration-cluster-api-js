import { describe, it, expect } from 'vitest';

import {createCamundaClient} from '../src';

// Minimal test verifying telemetry hooks fire

describe('telemetry basic', () => {
  it('emits http start/end events', async () => {
    const events: any[] = [];
    const fetchMock = async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    const client = createCamundaClient({
      fetch: fetchMock as any,
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.test',
        CAMUNDA_TOKEN_AUDIENCE: 'example',
        CAMUNDA_OAUTH_URL: 'https://auth.test',
        CAMUNDA_OAUTH_GRANT_TYPE: 'CLIENT_CREDENTIALS',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_SDK_LOG_LEVEL: 'silent',
      } as any,
      telemetry: {
        hooks: { beforeRequest: (e) => events.push(e), afterResponse: (e) => events.push(e) },
        correlation: true,
      },
    });
    // Call an endpoint that exists (choose one with GET & no params) - use operation list if available; fallback to getTopology variant if present.
    // We don't know generated operation names here; trigger a simple fetch by accessing raw client if needed.
    // Use any method: client.logger() to ensure instantiation then attempt a fetch to base URL root path through private _client fetch.
    // Instead directly invoke a known generated method name if stable: getTopology (observed in earlier integration test).
    // @ts-ignore
    if (typeof client.getTopology === 'function') {
      // @ts-ignore
      try {
        await client.getTopology();
      } catch {
        /* fetch mock returns 200 */
      }
    }
    expect(events.some((e) => e.type === 'http.start')).toBe(true);
    expect(events.some((e) => e.type === 'http.end')).toBe(true);
  });
});
