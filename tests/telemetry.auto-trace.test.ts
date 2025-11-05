import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

// Auto telemetry when log level=trace and CAMUNDA_SDK_TELEMETRY_LOG unset

describe('telemetry auto trace', () => {
  it('auto-enables mirror telemetry at trace log level', async () => {
    const logEvents: any[] = [];
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
        CAMUNDA_OAUTH_GRANT_TYPE: 'client_credentials',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_SDK_LOG_LEVEL: 'trace',
        // Deliberately omit CAMUNDA_SDK_TELEMETRY_LOG to trigger auto enable
      } as any,
      log: { level: 'trace', transport: (e) => logEvents.push(e) },
    });
    // @ts-ignore invoke a simple generated GET
    if (typeof client.getTopology === 'function') {
      // @ts-ignore
      await client.getTopology();
    }
    const traceArgs = logEvents
      .filter((e) => e.level === 'trace')
      .flatMap((e) => e.args.map((a: any) => (typeof a === 'string' ? a : JSON.stringify(a))));
    // Look for any http.start line with op=GET prefix
    expect(traceArgs.some((l: string) => /op=GET .*http\.start/.test(l))).toBe(true);
  });

  it('does not auto-enable when CAMUNDA_SDK_TELEMETRY_LOG=0', async () => {
    const logEvents: any[] = [];
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
        CAMUNDA_OAUTH_GRANT_TYPE: 'client_credentials',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_SDK_LOG_LEVEL: 'trace',
        CAMUNDA_SDK_TELEMETRY_LOG: false, // explicit disable
      } as any,
      log: { level: 'trace', transport: (e) => logEvents.push(e) },
    });
    // @ts-ignore
    if (typeof client.getTopology === 'function') {
      // @ts-ignore
      await client.getTopology();
    }
    const traceArgs = logEvents
      .filter((e) => e.level === 'trace')
      .flatMap((e) => e.args.map((a: any) => (typeof a === 'string' ? a : JSON.stringify(a))));
    // Expect no auto http.start (could still have other trace lines but we look for pattern)
    expect(traceArgs.some((l: string) => /http\.start/.test(l))).toBe(false);
  });
});
