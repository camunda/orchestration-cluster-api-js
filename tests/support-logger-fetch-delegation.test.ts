import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import type { SupportLogger } from '../src/runtime/supportLogger';

/**
 * Regression: an injected (or late-initialised) SupportLogger must receive the telemetry
 * wrapper's http end/error events.
 *
 * `wrapFetch` captures its `supportLogger` option at construction time, but the client's
 * real `_supportLogger` is assigned *after* fetch is wrapped. Passing `_supportLogger`
 * directly would permanently capture the initial no-op, so http.end/http.error lines would
 * never reach the injected logger. The client instead hands `wrapFetch` a stable delegating
 * sink that forwards to the current `_supportLogger`, keeping those events visible.
 */
describe('support logger receives http events through the fetch telemetry wrapper', () => {
  it('forwards http.end to an injected support logger set after fetch is wrapped', async () => {
    const lines: string[] = [];
    const injected: SupportLogger = { log: (m) => lines.push(String(m)) };

    const fetchMock = async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const client = createCamundaClient({
      fetch: fetchMock as any,
      supportLogger: injected,
      // Force the telemetry wrapper to be installed so support-log emission runs.
      telemetry: { correlation: true },
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
    });

    // @ts-ignore generated method
    if (typeof client.getTopology === 'function') {
      try {
        // @ts-ignore
        await client.getTopology();
      } catch {
        /* fetch mock returns 200 */
      }
    }

    expect(lines.some((l) => l.includes('http.end'))).toBe(true);
  });
});
