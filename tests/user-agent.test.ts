// Issue #693: every REST request and the OAuth token request must carry an
// attributable User-Agent whose first product token is
// `camunda-orchestration-sdk-js/<version>`. An application-supplied value
// (CAMUNDA_USER_AGENT) is appended, never replacing the SDK identifier.
import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { packageVersion } from '../src/runtime/version';

const SDK_UA = `camunda-orchestration-sdk-js/${packageVersion}`;

function headersOf(input: any, init?: any): Headers {
  const h = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers ?? {}).forEach((v, k) => {
    h.set(k, v);
  });
  return h;
}

function recordingFetch() {
  const calls: { url: string; headers: Headers }[] = [];
  const fn = vi.fn(async (input: any, init?: any) => {
    const url =
      typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
    calls.push({ url, headers: headersOf(input, init) });
    if (url.includes('/oauth/token')) {
      return new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ items: [], page: { totalItems: 0 } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  });
  return { fn, calls };
}

async function run(extra: Record<string, string> = {}) {
  const { fn, calls } = recordingFetch();
  const client = createCamundaClient({
    env: {},
    config: {
      CAMUNDA_REST_ADDRESS: 'https://example.com',
      CAMUNDA_AUTH_STRATEGY: 'OAUTH',
      CAMUNDA_OAUTH_URL: 'https://auth.example.com/oauth/token',
      CAMUNDA_CLIENT_ID: 'id',
      CAMUNDA_CLIENT_SECRET: 'secret',
      ...extra,
    } as any,
    fetch: fn as any,
  });
  await client.getTopology();
  const token = calls.find((c) => c.url.includes('/oauth/token'));
  const rest = calls.find((c) => !c.url.includes('/oauth/token'));
  expect(token, 'token request made').toBeDefined();
  expect(rest, 'REST request made').toBeDefined();
  return { token: token!, rest: rest! };
}

describe('User-Agent attribution (#693)', () => {
  it('sends the SDK identifier on REST and OAuth token requests', async () => {
    const { token, rest } = await run();
    expect(rest.headers.get('user-agent')).toBe(SDK_UA);
    expect(token.headers.get('user-agent')).toBe(SDK_UA);
  });

  it('appends CAMUNDA_USER_AGENT after the SDK identifier on all requests', async () => {
    const { token, rest } = await run({ CAMUNDA_USER_AGENT: 'my-app/1.2.3' });
    expect(rest.headers.get('user-agent')).toBe(`${SDK_UA} my-app/1.2.3`);
    expect(token.headers.get('user-agent')).toBe(`${SDK_UA} my-app/1.2.3`);
  });

  it('uses a real semver version, not a placeholder', () => {
    expect(packageVersion).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('applies repeated configure() calls to agent and fetch on REST and fresh OAuth requests', async () => {
    // Start with an environment-supplied agent, then change both CAMUNDA_USER_AGENT
    // and the fetch implementation through configure(): subsequent REST requests and
    // a fresh OAuth token fetch must use only the latest agent, with the SDK
    // identifier exactly once.
    const first = recordingFetch();
    const client = createCamundaClient({
      env: { CAMUNDA_USER_AGENT: 'env-app/0.1' },
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL: 'https://auth.example.com/oauth/token',
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
      } as any,
      fetch: first.fn as any,
    });
    await client.getTopology();
    expect(first.calls.find((c) => c.url.includes('/oauth/token'))?.headers.get('user-agent')).toBe(
      `${SDK_UA} env-app/0.1`
    );

    const second = recordingFetch();
    client.configure({
      config: { CAMUNDA_USER_AGENT: 'cfg-app/1.0' },
      fetch: second.fn as any,
    });
    await client.getTopology();

    const rest = second.calls.find((c) => !c.url.includes('/oauth/token'));
    expect(rest?.headers.get('user-agent')).toBe(`${SDK_UA} cfg-app/1.0`);
    // The SDK identifier appears exactly once — no duplicated wrapping.
    const restUa = rest?.headers.get('user-agent') ?? '';
    expect(restUa.split(SDK_UA).length - 1).toBe(1);
    // The replaced fetch implementation no longer receives traffic.
    expect(second.calls.length).toBeGreaterThan(0);
    const staleRest = first.calls.filter((c) => !c.url.includes('/oauth/token'));
    expect(staleRest.length).toBe(1);

    // Force a fresh OAuth token fetch: it must carry only the latest agent.
    await client.forceAuthRefresh();
    const token = second.calls.find((c) => c.url.includes('/oauth/token'));
    expect(token?.headers.get('user-agent')).toBe(`${SDK_UA} cfg-app/1.0`);
    const tokenUa = token?.headers.get('user-agent') ?? '';
    expect(tokenUa.split(SDK_UA).length - 1).toBe(1);
  });

  it('a configure() with an invalid agent fails atomically, keeping the previous config', async () => {
    const { fn, calls } = recordingFetch();
    const client = createCamundaClient({
      env: {},
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL: 'https://auth.example.com/oauth/token',
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
        CAMUNDA_USER_AGENT: 'good-app/1.0',
      } as any,
      fetch: fn as any,
    });
    // An invalid replacement agent must throw from configure() …
    const replacement = recordingFetch();
    expect(() =>
      client.configure({
        config: { CAMUNDA_USER_AGENT: 'bad\nagent' },
        fetch: replacement.fn as any,
      })
    ).toThrowError(/CAMUNDA_USER_AGENT/);
    // … and leave the client fully on its previous configuration and fetch.
    expect(client.getConfig().userAgent).toBe('good-app/1.0');
    await client.getTopology();
    expect(calls.length).toBeGreaterThan(0);
    expect(replacement.calls.length).toBe(0);
    expect(calls.find((c) => !c.url.includes('/oauth/token'))?.headers.get('user-agent')).toBe(
      `${SDK_UA} good-app/1.0`
    );
  });

  it('a rejected configure() does not retain its overrides (r4626806581)', () => {
    const { fn } = recordingFetch();
    const client = createCamundaClient({
      env: {},
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.com',
        CAMUNDA_USER_AGENT: 'good-app/1.0',
      } as any,
      fetch: fn as any,
    });
    // The invalid agent is rejected …
    expect(() =>
      client.configure({
        config: { CAMUNDA_USER_AGENT: 'bad\nagent', CAMUNDA_SDK_LOG_LEVEL: 'silly' },
      })
    ).toThrowError(/CAMUNDA_USER_AGENT/);
    // … and none of the rejected update is retained: a later unrelated configure()
    // must neither throw on the stored invalid agent nor apply the rejected settings.
    expect(() =>
      client.configure({ config: { CAMUNDA_USER_AGENT: 'good-app/2.0' } })
    ).not.toThrow();
    expect(client.getConfig().userAgent).toBe('good-app/2.0');
    expect(client.getConfig().logLevel).not.toBe('silly');
  });
});

describe('User-Agent header selection by platform (#693)', () => {
  it('omits any identifier header in browser builds (no forbidden User-Agent, no CORS preflight)', async () => {
    // The default-selection browser case lives in user-agent.browser.test.ts: mocking
    // the `#platform` seam is file-scoped in vitest, so it cannot share a file with
    // tests that rely on the Node resolution.
    const { withUserAgent, userAgentHeaders } = await import('../src/runtime/userAgent');
    const seen: (RequestInit | undefined)[] = [];
    const f = withUserAgent(
      async (_i, init) => {
        seen.push(init);
        return new Response('{}');
      },
      () => 'my-app/1',
      null
    );
    await f('https://example.com/x', { headers: { 'content-type': 'x' } });
    const h = new Headers(seen[0]?.headers);
    expect([...h.keys()]).toEqual(['content-type']);
    expect(userAgentHeaders('my-app/1', null)).toEqual({});
  });

  it('selects User-Agent on Node even when browser-like globals exist', async () => {
    const { userAgentHeaderName } = await import('../src/runtime/userAgent');
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {});
    try {
      expect(userAgentHeaderName()).toBe('User-Agent');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('browser platform module exposes no Node built-ins (drives header omission)', async () => {
    const browser = await import('../src/runtime/platform/browser');
    expect(browser.node).toBeUndefined();
  });
});
