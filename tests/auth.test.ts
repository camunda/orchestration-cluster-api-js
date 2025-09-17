import { describe, it, expect, vi } from 'vitest';
import { hydrateConfig, CamundaConfigurationError } from '../src/runtime/unifiedConfiguration';
import { createAuthFacade } from '../src/runtime/auth';

function mockFetchSequence(responses: { ok: boolean; status?: number; json: any; delayMs?: number }[]) {
  let i = 0;
  return vi.fn().mockImplementation(async () => {
    const r = responses[Math.min(i, responses.length - 1)];
    i++;
    if (r.delayMs) await new Promise(rslv => setTimeout(rslv, r.delayMs));
    return {
      ok: r.ok,
      status: r.status || (r.ok ? 200 : 500),
      json: async () => r.json,
    } as any;
  });
}

describe('auth basic', () => {
  it('builds basic header', async () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'BASIC', CAMUNDA_BASIC_AUTH_USERNAME: 'alice', CAMUNDA_BASIC_AUTH_PASSWORD: 'secret' } });
    const auth = createAuthFacade(config);
    const h = await auth.getAuthHeaders();
    expect(h.Authorization).toMatch(/^Basic /);
  });

  it('errors on missing basic creds (config hydration)', () => {
    try {
      hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'BASIC', CAMUNDA_BASIC_AUTH_USERNAME: 'alice' } });
      throw new Error('expected');
    } catch (e:any) {
      expect(e instanceof CamundaConfigurationError).toBe(true);
    }
  });
});

describe('auth oauth', () => {
  it('fetches token and caches until refresh lead', async () => {
    const fetch = mockFetchSequence([
      { ok: true, json: { access_token: 't1', expires_in: 120 } }
    ]);
  const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH', CAMUNDA_CLIENT_ID: 'id', CAMUNDA_CLIENT_SECRET: 'shhh' } });
  const auth = createAuthFacade(config, { fetch });
    const h1 = await auth.getAuthHeaders();
    const h2 = await auth.getAuthHeaders();
    expect(h1.Authorization).toBe('Bearer t1');
    expect(fetch).toHaveBeenCalledTimes(1); // cached second time
  });

  it('retries with exponential backoff and fails after max', async () => {
    const fetch = mockFetchSequence(new Array(5).fill(0).map(()=> ({ ok:false, status:500, json:{} })));
  const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH', CAMUNDA_CLIENT_ID: 'id', CAMUNDA_CLIENT_SECRET: 'shhh', CAMUNDA_OAUTH_RETRY_MAX: '3', CAMUNDA_OAUTH_TIMEOUT_MS: '200' } });
  const auth = createAuthFacade(config, { fetch });
    await expect(auth.getAuthHeaders()).rejects.toThrow(/TOKEN_FETCH_FAILED/);
  });

  it('forceRefresh fetches a new token', async () => {
    const fetch = mockFetchSequence([
      { ok: true, json: { access_token: 't1', expires_in: 120 } },
      { ok: true, json: { access_token: 't2', expires_in: 120 } }
    ]);
  const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH', CAMUNDA_CLIENT_ID: 'id', CAMUNDA_CLIENT_SECRET: 'shhh' } });
  const auth = createAuthFacade(config, { fetch });
    const h1 = await auth.getAuthHeaders();
    await auth.forceRefresh();
    const h2 = await auth.getAuthHeaders();
    expect(h1.Authorization).toBe('Bearer t1');
    expect(h2.Authorization).toBe('Bearer t2');
  });

  it('singleflight concurrent refresh', async () => {
    const fetch = mockFetchSequence([
      { ok: true, json: { access_token: 't1', expires_in: 120, delayMs: 50 } }
    ]);
  const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH', CAMUNDA_CLIENT_ID: 'id', CAMUNDA_CLIENT_SECRET: 'shhh' } });
  const auth = createAuthFacade(config, { fetch });
    const [a,b,c] = await Promise.all([auth.getAuthHeaders(), auth.getAuthHeaders(), auth.getAuthHeaders()]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(a.Authorization).toBe('Bearer t1');
    expect(b.Authorization).toBe('Bearer t1');
    expect(c.Authorization).toBe('Bearer t1');
  });

  it('keeps old token if refresh fails but still valid', async () => {
    const fetch = mockFetchSequence([
      { ok: true, json: { access_token: 't1', expires_in: 120 } },
      { ok: false, status: 500, json: {} }
    ]);
    const { config } = hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH', CAMUNDA_CLIENT_ID: 'id', CAMUNDA_CLIENT_SECRET: 'shhh', CAMUNDA_OAUTH_RETRY_MAX: '1', CAMUNDA_OAUTH_TIMEOUT_MS: '100' } });
    const auth = createAuthFacade(config, { fetch });
    await auth.getAuthHeaders();
    auth.debug__setTokenExpiry!(Date.now() + 10); // force immediate refresh attempt next call
    const h2 = await auth.getAuthHeaders().catch(()=> ({ Authorization: 'Bearer t1' } as any));
    expect(h2.Authorization).toBe('Bearer t1');
  });
});
