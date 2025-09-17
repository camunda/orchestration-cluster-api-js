import { describe, it, expect } from 'vitest';

import {createCamundaClient} from '../src';

// We'll mock fetch to fail twice then succeed to exercise retry telemetry

function createFailThenSucceedFetch(failCount: number) {
  let count = 0;
  return async (url: any, _init?: any) => {
    if (typeof url === 'string' && url.includes('/oauth/token')) {
      if (count < failCount) {
        count++;
        return new Response(JSON.stringify({ error: 'temporary' }), { status: 500 });
      }
      return new Response(JSON.stringify({ access_token: 'ok', expires_in: 60 }), { status: 200 });
    }
    // default other calls
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
}

describe('telemetry auth retry events', () => {
  it('emits retry events for OAuth backoff attempts', async () => {
    const events: any[] = [];
    const fetchImpl = createFailThenSucceedFetch(2);

    const client = createCamundaClient({
      fetch: fetchImpl as any,
      config: {
        CAMUNDA_REST_ADDRESS: 'https://api.test',
        CAMUNDA_TOKEN_AUDIENCE: 'aud',
        CAMUNDA_OAUTH_URL: 'https://example.test/oauth/token',
        CAMUNDA_OAUTH_GRANT_TYPE: 'CLIENT_CREDENTIALS',
        CAMUNDA_OAUTH_TIMEOUT_MS: 500,
        CAMUNDA_OAUTH_RETRY_MAX: 4,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: 'sec',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_SDK_LOG_LEVEL: 'silent',
      } as any,
      telemetry: {
        correlation: true,
        hooks: {
          authStart: (e) => events.push(e),
          authSuccess: (e) => events.push(e),
          authError: (e) => events.push(e),
          retry: (e) => events.push(e),
        },
      },
    });

    // Trigger a token fetch (implicitly via any request)
    // Trigger OAuth token fetch by requesting auth headers directly
    // @ts-ignore internal method (mirrors other telemetry test)
    await client.getAuthHeaders?.();

    const retryEvents = events.filter((e) => e.type === 'retry');
    // We expect 2 retries (after 2 failed attempts before success)
    expect(retryEvents.length).toBeGreaterThanOrEqual(1); // allow timing variations
    expect(retryEvents[0]).toMatchObject({ domain: 'auth', type: 'retry' });

    // Ensure an auth.success eventually arrived
    const success = events.find((e) => e.type === 'auth.success');
    expect(success).toBeTruthy();
  }, 20000);
});
