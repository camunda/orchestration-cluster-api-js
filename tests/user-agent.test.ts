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
});

describe('User-Agent header selection by platform (#693)', () => {
  it('omits any identifier header in browser builds (no forbidden User-Agent, no CORS preflight)', async () => {
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
