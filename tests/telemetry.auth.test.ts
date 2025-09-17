import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

// Auth telemetry test: simulate OAuth token fetch then a simple GET

describe('telemetry auth', () => {
  it('emits auth start/success events', async () => {
    const events: any[] = [];
    let tokenFetched = false;
    const fetchMock = async (input: RequestInfo | URL, _init?: RequestInit) => {
      const url = input.toString();
      if (url.includes('/oauth/token')) {
        tokenFetched = true;
        return new Response(
          JSON.stringify({
            access_token: 'abc123',
            expires_in: 60,
            token_type: 'Bearer',
            scope: 'a b',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ pong: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const client = createCamundaClient({
      fetch: fetchMock as any,
      config: {
        CAMUNDA_REST_ADDRESS: 'https://api.test',
        CAMUNDA_TOKEN_AUDIENCE: 'api.test',
        CAMUNDA_OAUTH_URL: 'https://auth.test/oauth/token',
        CAMUNDA_OAUTH_GRANT_TYPE: 'CLIENT_CREDENTIALS',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_SDK_LOG_LEVEL: 'silent',
      } as any,
      telemetry: {
        correlation: true,
        hooks: { authStart: (e) => events.push(e), authSuccess: (e) => events.push(e) },
      },
    });
    // Trigger auth by calling getAuthHeaders
    // @ts-ignore internal method
    const headers =
      (await client.getAuthHeaders?.()) || (await (client as any)._auth?.getAuthHeaders?.());
    expect(tokenFetched).toBe(true);
    expect(headers.Authorization).toContain('Bearer');
    expect(events.find((e) => e.type === 'auth.start')).toBeTruthy();
    expect(events.find((e) => e.type === 'auth.success')).toBeTruthy();
  });
});
