import { describe, it, expect } from 'vitest';

import {createCamundaClient} from '../src';

describe('telemetry http Request object', () => {
  it('captures URL from Request instance', async () => {
    const events: any[] = [];
    const fetchMock = async (input: RequestInfo | URL, _init?: RequestInit) => {
      if (input instanceof Request && input.url.includes('/oauth/token')) {
        return new Response(JSON.stringify({ access_token: 'tok', expires_in: 60 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (typeof input === 'string' && input.includes('/oauth/token')) {
        return new Response(JSON.stringify({ access_token: 'tok', expires_in: 60 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    const c = createCamundaClient({
      fetch: fetchMock as any,
      telemetry: {
        mirrorToLog: false,
        correlation: false,
        hooks: { beforeRequest: (e) => events.push(e), afterResponse: (e) => events.push(e) },
      },
      config: {
        CAMUNDA_REST_ADDRESS: 'https://api.test',
        CAMUNDA_TOKEN_AUDIENCE: 'api.test',
        CAMUNDA_OAUTH_URL: 'https://auth.test/oauth/token',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
        CAMUNDA_SDK_LOG_LEVEL: 'silent',
      } as any,
    });
    // Force token fetch
    await c.getAuthHeaders();
    // Make a Request instance call (pretend operation) using internal fetch
    const req = new Request('https://api.test/some/path?secret=one&foo=bar');
    // @ts-ignore access internal wrapped fetch
    await c._fetch(req, {});
    const start = events.find((e) => e.type === 'http.start' && e.url.includes('/some/path'));
    expect(start).toBeTruthy();
    expect(start.url).toBe('https://api.test/some/path?secret&foo');
  });
});
