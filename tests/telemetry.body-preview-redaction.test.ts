import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient, ProcessDefinitionKey } from '../src';
import { redactBodyPreview, wrapFetch } from '../src/runtime/telemetry';

/**
 * silly-level HTTP body previews must not carry credentials (#617).
 *
 * The OAuth token request runs through the same wrapped fetch as every API call, so at
 * `CAMUNDA_SDK_LOG_LEVEL=silly` the request preview carried the form body containing
 * `client_secret`, and the response preview carried the token endpoint's `access_token`.
 *
 * These tests assert the redaction at the field level — the defect class — rather than only
 * for the one form key that leaked: any known credential field name is masked in a
 * form-encoded body, in a JSON body at any depth, and in a response body.
 */

const SECRET = 'SNTNL-CLIENT-SECRET-aaaaaaaaaaaaaaaaaaaa-ZQX7';
const TOKEN = 'SNTNL-ACCESS-TOKEN-aaaaaaaaaaaaaaaaaaaaa-ZQX7';
const REFRESH = 'SNTNL-REFRESH-TOKEN-aaaaaaaaaaaaaaaaaaaa-ZQX7';

describe('redactBodyPreview', () => {
  it('masks credential fields in a form-encoded body and keeps the rest readable', () => {
    const body = `grant_type=client_credentials&client_id=cid&client_secret=${encodeURIComponent(
      SECRET
    )}&audience=zeebe.camunda.io`;
    const out = redactBodyPreview(body);

    expect(out).not.toContain(SECRET);
    expect(out).not.toContain(encodeURIComponent(SECRET));
    expect(out).toContain('client_secret=[redacted]');
    expect(out).toContain('grant_type=client_credentials');
    expect(out).toContain('client_id=cid');
  });

  it('masks every known credential field name in a form-encoded body', () => {
    for (const field of [
      'client_secret',
      'client_assertion',
      'assertion',
      'password',
      'refresh_token',
    ]) {
      const out = redactBodyPreview(`a=1&${field}=${SECRET}&b=2`);
      expect(out, `${field} was not masked`).not.toContain(SECRET);
      expect(out).toContain('a=1');
      expect(out).toContain('b=2');
    }
  });

  it('masks credential fields in a JSON body at any depth', () => {
    const body = JSON.stringify({
      access_token: TOKEN,
      nested: { clientSecret: SECRET, keep: 'visible' },
      list: [{ refresh_token: REFRESH }],
    });
    const out = redactBodyPreview(body);

    expect(out).not.toContain(TOKEN);
    expect(out).not.toContain(SECRET);
    expect(out).not.toContain(REFRESH);
    expect(out).toContain('visible');
  });

  it('still masks a JSON body that has been truncated out of parseability', () => {
    const body = `{"access_token":"${TOKEN}","expires_in":300,"tru`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(TOKEN);
  });

  it('masks a JSON body truncated in the middle of the credential itself', () => {
    // No closing quote on the value: the structural parse fails and the textual sweep has
    // to cope with an unterminated string, or the credential survives.
    const body = `{"expires_in":300,"access_token":"${TOKEN.slice(0, 20)}`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(TOKEN.slice(0, 20));
  });

  it('masks a credential embedded in free-form text', () => {
    // An error page or plain-text response is neither JSON nor a form body.
    const body = `OAuth failure for request 42: client_secret=${SECRET} was rejected`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(SECRET);
    expect(out).toContain('OAuth failure for request 42');
  });

  it('masks a form credential whose value is percent-encoded', () => {
    const body = `grant_type=x&password=${encodeURIComponent(`prefix&${SECRET}`)}`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(SECRET);
    expect(out).not.toContain(encodeURIComponent(SECRET));
  });

  it('leaves a body with no credential field untouched', () => {
    const body = JSON.stringify({ processDefinitionKey: '123', variables: { a: 1 } });
    expect(redactBodyPreview(body)).toBe(body);
  });
});

describe('silly-level previews through wrapFetch', () => {
  function sillyLogger(sink: string[]) {
    const self: any = {
      level: () => 'silly',
      scope: () => self,
      silly: (fn: any) => {
        const args = typeof fn === 'function' ? fn() : [fn];
        sink.push(args.map(String).join(' '));
      },
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
    return self;
  }

  it('redacts a FormData credential whose value contains an ampersand', async () => {
    // The FormData preview joins `k=v` pairs without escaping, so a value containing `&`
    // would survive as a trailing fragment unless each entry is redacted before the join.
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });

    const form = new FormData();
    form.set('grant_type', 'client_credentials');
    form.set('password', `prefix&${SECRET}`);
    await wrapped('https://mock.local/v2/thing', { method: 'POST', body: form as any });

    const all = lines.join('\n');
    expect(all).toContain('http.body');
    expect(all).not.toContain(SECRET);
    expect(all).toContain('grant_type=client_credentials');
  });

  it('redacts the token request body and the token response body', async () => {
    const lines: string[] = [];
    const orig = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ access_token: TOKEN, expires_in: 300, token_type: 'Bearer' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
    );
    const wrapped = wrapFetch(orig as any, {
      logger: sillyLogger(lines),
      mirrorToLog: true,
    });

    await wrapped('https://login.example.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=cid&client_secret=${SECRET}`,
    });

    const all = lines.join('\n');
    expect(all).toContain('http.body');
    expect(all).toContain('http.response');
    expect(all, 'client_secret leaked into the silly request preview').not.toContain(SECRET);
    expect(all, 'access_token leaked into the silly response preview').not.toContain(TOKEN);
  });
});

describe('silly-level previews through a real client', () => {
  it('never logs the OAuth client secret or the issued access token', async () => {
    const events: any[] = [];
    const fetchMock = vi.fn(async (input: any, init?: any) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('/oauth/token')) {
        return new Response(
          JSON.stringify({ access_token: TOKEN, expires_in: 300, token_type: 'Bearer' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      void init;
      return new Response(
        JSON.stringify({
          processInstanceKey: '999',
          processDefinitionKey: '123',
          bpmnProcessId: 'demo',
          version: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://mock.local',
        CAMUNDA_SDK_LOG_LEVEL: 'silly',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL: 'https://login.example.com/oauth/token',
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: SECRET,
      } as any,
      fetch: fetchMock as any,
      log: { level: 'silly', transport: (e: any) => events.push(e) },
    });

    await client.createProcessInstance({
      processDefinitionKey: ProcessDefinitionKey.assumeExists('123'),
    });

    const text = events
      .map((e) => `${e.level} ${e.scope ?? ''} ${e.args.map((a: any) => String(a)).join(' ')}`)
      .join('\n');

    // The previews are still emitted — this is not a test that silenced the feature.
    expect(text).toContain('http.body');
    expect(text, 'CAMUNDA_CLIENT_SECRET reached a silly-level log line').not.toContain(SECRET);
    expect(text, 'the issued access token reached a silly-level log line').not.toContain(TOKEN);
  });
});
