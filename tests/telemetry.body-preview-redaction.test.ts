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
 *
 * The policy (see the decision record that superseded "mask to the end of the line"): a body
 * is logged only if it is a parseable structure — a JSON object or array, or a well-formed
 * form encoding — and then every credential is masked whole by its key name. Anything else
 * (free text, truncated JSON, raw multipart text, a JSON scalar) is not logged at all: only
 * its byte length and media type are. There is no boundary-guessing scan to get wrong.
 */

/** The preview that stands in for a body that is not a parseable structure. */
const OMITTED = /^\[body preview omitted: \d+ bytes, content-type=[^\]]+\]$/;

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

  it('does not log a JSON body that has been truncated out of parseability', () => {
    const body = `{"access_token":"${TOKEN}","expires_in":300,"tru`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(TOKEN);
    expect(out).toMatch(OMITTED);
  });

  it('does not log a JSON body truncated in the middle of the credential itself', () => {
    const body = `{"expires_in":300,"access_token":"${TOKEN.slice(0, 20)}`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(TOKEN.slice(0, 20));
    expect(out).toMatch(OMITTED);
  });

  it('does not log a JSON credential at any truncation point, escapes included', () => {
    // The class of defect is "the body ends somewhere inside the credential": cut a body
    // whose value carries JSON escapes at every position, including immediately after a
    // backslash. A truncated body is not parseable, so none of it is logged.
    const value = 'SNTNL-ESC\\"A\\\\B\\u00e9-TAIL-ZQX7';
    const full = `{"expires_in":300,"access_token":"${value}","scope":"x"}`;
    const start = full.indexOf('SNTNL');
    for (let cut = start + 1; cut <= start + value.length; cut++) {
      const body = full.slice(0, cut);
      const out = redactBodyPreview(body);
      expect(out, `cut at ${cut}: ${JSON.stringify(body)}`).not.toContain('SNTNL');
      expect(out, `cut at ${cut}: ${JSON.stringify(body)}`).not.toContain('ESC');
      expect(out, `cut at ${cut}: ${JSON.stringify(body)}`).toMatch(OMITTED);
    }
  });

  it('does not log free-form text, so a credential embedded in it cannot survive', () => {
    // An error page or plain-text response is neither JSON nor a form body: there is no
    // reliable boundary for a credential inside it, so none of it is logged.
    const body = `OAuth failure for request 42: client_secret=${SECRET} was rejected`;
    const out = redactBodyPreview(body, 'text/plain; charset=utf-8');
    expect(out).not.toContain(SECRET);
    expect(out).not.toContain('OAuth failure');
    expect(out).toBe(
      `[body preview omitted: ${new TextEncoder().encode(body).length} bytes, content-type=text/plain]`
    );
  });

  it('masks a form credential whose value is percent-encoded', () => {
    const body = `grant_type=x&password=${encodeURIComponent(`prefix&${SECRET}`)}`;
    const out = redactBodyPreview(body);
    expect(out).not.toContain(SECRET);
    expect(out).not.toContain(encodeURIComponent(SECRET));
  });

  it('does not log free text whose credential value contains whitespace', () => {
    // Nothing but a quote (or the end of the line) delimits such a value, so no guess at the
    // boundary is made: the text is not logged.
    const cases: Array<[string, string[]]> = [
      [`OAuth failure: authorization=Bearer ${TOKEN} rejected`, [TOKEN, 'Bearer SNTNL']],
      [`OAuth failure: password="two words ${SECRET} tail" rejected`, [SECRET, 'two words']],
      [`OAuth failure: password='two words ${SECRET} tail' rejected`, [SECRET, 'two words']],
      [`OAuth failure: password=two words ${SECRET}`, [SECRET, 'two words']],
      [`OAuth failure: password="unterminated ${SECRET}`, [SECRET, 'unterminated']],
    ];
    for (const [body, forbidden] of cases) {
      const out = redactBodyPreview(body);
      for (const f of forbidden) expect(out, `${JSON.stringify(body)} -> ${out}`).not.toContain(f);
      expect(out).toMatch(OMITTED);
    }
  });

  it('masks a JSON credential whose property name uses JSON escapes', () => {
    // `\u005f` is `_`: the parsed key is `access_token`.
    for (const key of [
      'access\\u005ftoken',
      'client\\u005Fsecret',
      '\\u0070assword',
      'pass\\u0077ord',
    ]) {
      const out = redactBodyPreview(`{"${key}":"${SECRET}","keep":"visible"}`);
      expect(out, `${key} -> ${out}`).not.toContain(SECRET);
      expect(out).toContain('"keep":"visible"');
    }
  });

  it('masks a JSON credential whose value is not a string', () => {
    const out = redactBodyPreview('{"password":123456789,"keep":1}');
    expect(out).not.toContain('123456789');
    expect(out).toContain('"keep":1');
  });

  it('masks a percent-encoded form key and keeps another percent-encoded value readable', () => {
    const out = redactBodyPreview(`client_%73ecret=${SECRET}&extra=%7B%7D`);
    expect(out).not.toContain(SECRET);
    expect(out).toContain('extra=%7B%7D');
  });

  it('masks a credential nested inside a non-secret value of complete JSON', () => {
    for (const body of [
      `{"nested":{"access_token":"${TOKEN}"},"keep":1}`,
      `{"a":{"b":{"password":"${SECRET}"}},"keep":1}`,
      `[{"client_secret":"${SECRET}"},{"x":"y"}]`,
      `{"list":[{"refresh_token":"${REFRESH}"}],"keep":1}`,
    ]) {
      const out = redactBodyPreview(body);
      for (const secret of [TOKEN, SECRET, REFRESH]) {
        expect(out, `${body} -> ${out}`).not.toContain(secret);
      }
    }
  });

  it('masks a whole container held by a credential property', () => {
    // The members of the container are not credential names, but they are credential content.
    for (const body of [
      `{"authorization":{"scheme":"Bearer","token":"${TOKEN}"},"keep":1}`,
      `{"password":["a","${SECRET}"],"keep":1}`,
      `{"client_secret":{"parts":[{"v":"${SECRET}"}],"note":"a]b}c \\"${SECRET}"},"keep":1}`,
      `{"access_token":{"value":"${TOKEN}"}}`,
      `{"refresh_token":["${REFRESH}"]}`,
    ]) {
      const out = redactBodyPreview(body);
      for (const secret of [TOKEN, SECRET, REFRESH]) {
        expect(out, `${body} -> ${out}`).not.toContain(secret);
      }
    }
    // What follows the container stays readable.
    const out = redactBodyPreview(`{"password":{"a":"${SECRET}"},"keep":"visible"}`);
    expect(out).not.toContain(SECRET);
    expect(out).toContain('"keep":"visible"');
  });

  it('does not log a text body in which a credential assignment follows another assignment', () => {
    for (const body of [
      `OAuth failure: request=42 client_secret=${SECRET} was rejected`,
      `OAuth failure: a=b=client_secret=${SECRET}`,
      `retry=3 user=alice password="${SECRET}" host=x`,
      `trace=1 authorization=Bearer ${TOKEN}`,
    ]) {
      const out = redactBodyPreview(body);
      expect(out, `${body} -> ${out}`).not.toContain(SECRET);
      expect(out, `${body} -> ${out}`).not.toContain(TOKEN);
      expect(out).toMatch(OMITTED);
    }
  });

  describe('an unencoded ampersand (or any other unencoded delimiter) in a form credential', () => {
    // A form value must be percent-encoded, so `&` always starts the next pair. A body whose
    // pairs do not all look like `name=value` in the form alphabet is therefore not a
    // well-formed form encoding, and nothing of it is logged: there is no boundary to guess.
    it('is not logged when the tail after the ampersand is not a name=value pair', () => {
      for (const body of [
        `password=prefix&${SECRET}`,
        `grant_type=client_credentials&password=prefix&${SECRET}`,
        `password=${SECRET}&`,
        `password=${SECRET}&&a=1`,
        `a=1&password=${SECRET}&tail`,
      ]) {
        const out = redactBodyPreview(body);
        expect(out, `${body} -> ${out}`).not.toContain(SECRET);
        expect(out, `${body} -> ${out}`).not.toContain('prefix');
        expect(out, `${body} -> ${out}`).not.toContain('grant_type');
        expect(out).toMatch(OMITTED);
      }
    });

    it('is not logged when the value holds a character outside the form alphabet', () => {
      // Raw `=`, double quote, space, comma, newline, brace, bracket, colon, slash, backslash, `%`
      // without two hex digits, `#`, `;` and a non-ASCII letter: each means the body was not
      // produced by a form encoder, so it is not trusted to split at `&`.
      for (const bad of [
        '=',
        '"',
        ' ',
        ',',
        '\n',
        '\r\n',
        '{',
        '}',
        '[',
        ']',
        ':',
        '/',
        '\\',
        '%',
        '%4',
        '%zz',
        '#',
        ';',
        'é',
      ]) {
        const body = `a=1&password=ab${bad}${SECRET}&b=2`;
        const out = redactBodyPreview(body);
        expect(out, `${JSON.stringify(body)} -> ${out}`).not.toContain(SECRET);
        expect(out, `${JSON.stringify(body)} -> ${out}`).not.toContain('ab');
        expect(out, JSON.stringify(body)).toMatch(OMITTED);
      }
    });

    it('is not logged when a pair has no name or no equals sign', () => {
      for (const body of [`=${SECRET}`, `a=1&=${SECRET}`, `password`, `a=1&b`]) {
        expect(redactBodyPreview(body), JSON.stringify(body)).toMatch(OMITTED);
      }
    });

    it('keeps a well-formed form readable, masking every credential pair by key', () => {
      const body = `grant_type=client_credentials&client_secret=${encodeURIComponent(
        `a&b=c ${SECRET}`
      )}&audience=zeebe.camunda.io&scope=a+b&empty=`;
      const out = redactBodyPreview(body);
      expect(out).toBe(
        'grant_type=client_credentials&client_secret=[redacted]&audience=zeebe.camunda.io&scope=a+b&empty='
      );
    });
  });

  describe('structures that are not form or JSON', () => {
    it('does not log raw multipart text', () => {
      const body = [
        '--b0undary',
        'Content-Disposition: form-data; name="client_secret"',
        '',
        SECRET,
        '--b0undary--',
        '',
      ].join('\r\n');
      const out = redactBodyPreview(body, 'multipart/form-data; boundary=b0undary');
      expect(out).not.toContain(SECRET);
      expect(out).not.toContain('b0undary');
      expect(out).toMatch(/content-type=multipart\/form-data\]$/);
    });

    it('does not log a JSON scalar, which has no key to judge it by', () => {
      for (const body of [`"${SECRET}"`, '12345', 'true', 'null']) {
        const out = redactBodyPreview(body, 'application/json');
        expect(out, body).not.toContain(SECRET);
        expect(out, body).toMatch(OMITTED);
      }
    });

    it('reports the byte length, not the character count, and a sanitised media type', () => {
      const body = 'héllo wörld é';
      const bytes = new TextEncoder().encode(body).length;
      expect(bytes).toBeGreaterThan(body.length);
      expect(redactBodyPreview(body, 'Text/Plain; charset=UTF-8')).toBe(
        `[body preview omitted: ${bytes} bytes, content-type=text/plain]`
      );
      // A parameter (a boundary, say) is never echoed; neither is a value that is no media type.
      expect(redactBodyPreview(body, 'multipart/form-data; boundary=SECRETBOUNDARY')).not.toContain(
        'SECRETBOUNDARY'
      );
      for (const ct of [undefined, null, '', 'not a media type', `x/${'y'.repeat(200)}`, SECRET]) {
        expect(redactBodyPreview(body, ct), String(ct)).toBe(
          `[body preview omitted: ${bytes} bytes, content-type=unknown]`
        );
      }
    });
  });

  describe('credential field names', () => {
    it('matches a name however it is cased or separated', () => {
      for (const key of [
        'Client-Secret',
        'client.secret',
        'CLIENT_SECRET',
        'clientSecret',
        'API_KEY',
        'apiKey',
        'x-api-key',
        'X-Api-Key',
        'sessionToken',
        'authToken',
        'bearerToken',
        'Bearer',
        'Proxy-Authorization',
        'Set-Cookie',
        'userPassword',
        'dbPasswd',
        'secretKey',
        'credentials',
        'private-key',
        'keyPassphrase',
        'clientAssertion',
        'nextPageToken',
      ]) {
        const json = redactBodyPreview(JSON.stringify({ [key]: SECRET, keep: 'visible' }));
        expect(json, `json ${key} -> ${json}`).not.toContain(SECRET);
        expect(json).toContain('visible');
        const form = redactBodyPreview(`${encodeURIComponent(key)}=${SECRET}&keep=visible`);
        expect(form, `form ${key} -> ${form}`).not.toContain(SECRET);
        expect(form).toContain('keep=visible');
      }
    });

    it('does not mask names that merely resemble a credential', () => {
      const body = JSON.stringify({
        processDefinitionKey: '123',
        token_type: 'Bearer',
        expires_in: 300,
        key: 'k',
      });
      expect(redactBodyPreview(body)).toBe(body);
    });

    it('masks a credential under a duplicated or prototype-named JSON key', () => {
      for (const body of [
        `{"password":"${SECRET}","password":"x"}`,
        `{"password":"x","password":"${SECRET}"}`,
        `{"__proto__":{"password":"${SECRET}"},"password":"${SECRET}"}`,
        `{"constructor":{"prototype":{"token":"${SECRET}"}}}`,
      ]) {
        const out = redactBodyPreview(body);
        expect(out, `${body} -> ${out}`).not.toContain(SECRET);
      }
    });
  });

  describe('a structure carried inside a string value', () => {
    it('masks credentials in JSON held by a string, at the depth it is nested', () => {
      const inner = JSON.stringify({ password: SECRET, keep: 'visible' });
      const twice = JSON.stringify({ wrapped: inner });
      const out = redactBodyPreview(JSON.stringify({ payload: inner, again: twice, ok: 1 }));
      expect(out).not.toContain(SECRET);
      expect(out).toContain('visible');
      expect(out).toContain('"ok":1');
    });

    it('masks credentials in a form held by a string, and a form-held JSON string', () => {
      const out = redactBodyPreview(
        JSON.stringify({
          body: `a=1&password=${encodeURIComponent(SECRET)}`,
          other: `payload=${encodeURIComponent(JSON.stringify({ token: SECRET }))}&b=2`,
        })
      );
      expect(out).not.toContain(SECRET);
      expect(out).not.toContain(encodeURIComponent(SECRET));
      expect(out).toContain('a=1');
      expect(out).toContain('b=2');
    });

    it('masks a structure nested beyond the depth limit rather than logging it', () => {
      let value: string = JSON.stringify({ password: SECRET });
      for (let i = 0; i < 12; i++) value = JSON.stringify({ k: value });
      expect(redactBodyPreview(value)).not.toContain(SECRET);
    });

    it('masks credentials in a form value that itself holds JSON', () => {
      const body = `payload=${encodeURIComponent(JSON.stringify({ client_secret: SECRET }))}`;
      const out = redactBodyPreview(body);
      expect(out).not.toContain(SECRET);
      expect(out).not.toContain(encodeURIComponent(SECRET));
    });
  });

  describe('exhaustive check: no fragment of a credential survives any single-delimiter mutation', () => {
    // A property-style sweep without a generator library: every template that carries a
    // credential, with every delimiter or quoting character inserted at every position inside
    // the credential value, cut at every length from the start of the value to the end of the
    // body. Whatever the result is (masked, or not logged), no character of the credential may
    // appear in it. The credential is a run of `Z`, and no other text in the corpus or in a
    // placeholder contains one, so any `Z` in the output is a fragment of the credential.
    const CRED = 'ZZZZZZZZ';
    const DELIMITERS = [
      '&',
      '=',
      '"',
      "'",
      ' ',
      '\n',
      '\r',
      '\t',
      '{',
      '}',
      '[',
      ']',
      ',',
      ':',
      ';',
      '\\',
      '%',
      '+',
      '#',
      '/',
      '\u0000',
      '\u00e9',
    ];
    const TEMPLATES: Array<[string, (v: string) => string]> = [
      ['form', (v) => `grant_type=x&client_secret=${v}`],
      ['form last', (v) => `a=1&b=2&password=${v}`],
      ['form middle', (v) => `password=${v}&audience=x`],
      ['form only', (v) => `refresh_token=${v}`],
      ['form encoded key', (v) => `client_%73ecret=${v}&a=1`],
      ['json', (v) => `{"access_token":"${v}","expires_in":300}`],
      ['json nested', (v) => `{"a":{"b":[{"password":"${v}"}]},"keep":1}`],
      ['json escaped key', (v) => `{"client\\u005fsecret":"${v}"}`],
      ['json array', (v) => `[{"refresh_token":"${v}"}]`],
      ['json non-string', (v) => `{"password":${v},"keep":1}`],
      ['text', (v) => `OAuth failure: client_secret=${v} was rejected`],
      ['text quoted', (v) => `failed password="${v}" host=x`],
      ['text bearer', (v) => `authorization=Bearer ${v}`],
      ['text json-ish', (v) => `{"access_token": "${v}", "expires`],
      [
        'multipart',
        (v) => `--b\r\nContent-Disposition: form-data; name="password"\r\n\r\n${v}\r\n--b--`,
      ],
    ];

    it('holds for every template, delimiter, position and truncation', () => {
      let checked = 0;
      for (const [label, make] of TEMPLATES) {
        for (const delimiter of ['', ...DELIMITERS]) {
          for (let at = 0; at <= CRED.length; at++) {
            const value = `${CRED.slice(0, at)}${delimiter}${CRED.slice(at)}`;
            const full = make(value);
            const valueStart = make('\u0001').indexOf('\u0001');
            for (let cut = valueStart + 1; cut <= full.length; cut++) {
              const body = full.slice(0, cut);
              const out = redactBodyPreview(body);
              checked++;
              if (out.includes('Z')) {
                expect.fail(
                  `${label}: a fragment of the credential survived for ${JSON.stringify(body)} -> ${out}`
                );
              }
            }
          }
        }
      }
      expect(checked).toBeGreaterThan(10_000);
    });
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

  it('redacts a credential in a Request whose body is multipart FormData', async () => {
    // The generated transport hands fetch a Request, not an init body, and `clone().text()`
    // of a multipart Request is raw multipart text that per-entry masking never sees.
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });

    const form = new FormData();
    form.set('grant_type', 'client_credentials');
    form.set('password', SECRET);
    const req = new Request('https://mock.local/v2/thing', { method: 'POST', body: form });
    await wrapped(req);

    const all = lines.join('\n');
    expect(all).toContain('http.body');
    expect(all).not.toContain(SECRET);
    expect(all).toContain('grant_type=client_credentials');
  });

  it('logs only the size and media type of a request body with an unencoded ampersand', async () => {
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    const body = `grant_type=password&username=u&password=prefix&${SECRET}`;

    await wrapped('https://login.example.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
      body,
    });
    // The same through a Request, whose content type lives on the Request itself.
    await wrapped(
      new Request('https://login.example.com/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body,
      })
    );

    const all = lines.join('\n');
    expect(all).not.toContain(SECRET);
    expect(all).not.toContain('prefix');
    expect(all).toContain(
      `preview=[body preview omitted: ${body.length} bytes, content-type=application/x-www-form-urlencoded]`
    );
    expect(all).toContain(
      `preview=[body preview omitted: ${body.length} bytes, content-type=text/plain]`
    );
  });

  it('reads the content type from a Headers instance and from a pair list', async () => {
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    await wrapped('https://mock.local/a', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'text/csv' }),
      body: `plain text ${SECRET}`,
    });
    await wrapped('https://mock.local/b', {
      method: 'PUT',
      headers: [['content-type', 'text/xml']],
      body: `plain text ${SECRET}`,
    });
    const all = lines.join('\n');
    expect(all).not.toContain(SECRET);
    expect(all).toContain('content-type=text/csv]');
    expect(all).toContain('content-type=text/xml]');
  });

  it('does not log a text response whose credential has no boundary, only its size and type', async () => {
    const lines: string[] = [];
    const text = `login failed: password=${SECRET} is wrong`;
    const orig = vi.fn(
      async () =>
        new Response(text, {
          status: 401,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
    );
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    await wrapped('https://mock.local/v2/thing', { method: 'GET' });
    const all = lines.join('\n');
    expect(all).toContain('http.response');
    expect(all).not.toContain(SECRET);
    expect(all).not.toContain('login failed');
    expect(all).toContain(
      `preview=[body preview omitted: ${text.length} bytes, content-type=text/plain]`
    );
  });

  it('does not log a response of unknown media type that is not a parseable structure', async () => {
    const lines: string[] = [];
    const orig = vi.fn(
      async () =>
        new Response(`token: ${SECRET}`, {
          status: 200,
          headers: { 'Content-Type': 'application/x-custom' },
        })
    );
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    await wrapped('https://mock.local/v2/thing', { method: 'GET' });
    const all = lines.join('\n');
    expect(all).not.toContain(SECRET);
    expect(all).toContain('content-type=application/x-custom]');
  });

  it('still previews the non-text bodies, which carry no text to redact', async () => {
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    await wrapped('https://mock.local/a', { method: 'POST', body: new Blob(['abc']) as any });
    await wrapped('https://mock.local/b', { method: 'POST', body: new Uint8Array(3) as any });
    await wrapped('https://mock.local/c', { method: 'POST', body: new ArrayBuffer(5) as any });
    const all = lines.join('\n');
    expect(all).toContain('preview=[Blob size=3]');
    expect(all).toContain('preview=[Uint8Array length=3]');
    expect(all).toContain('preview=[ArrayBuffer byteLength=5]');
  });

  it('masks by key a structure carried in a FormData string entry, and a JSON object body', async () => {
    const lines: string[] = [];
    const orig = vi.fn(async () => new Response('{}', { status: 200 }));
    const wrapped = wrapFetch(orig as any, { logger: sillyLogger(lines), mirrorToLog: true });
    const form = new FormData();
    form.set('meta', JSON.stringify({ password: SECRET, keep: 'visible' }));
    form.set('file', new Blob(['x']), 'x.bin');
    await wrapped('https://mock.local/a', { method: 'POST', body: form as any });
    await wrapped('https://mock.local/b', {
      method: 'POST',
      body: { client_secret: SECRET, keep: 'visible2' } as any,
    });
    const all = lines.join('\n');
    expect(all).not.toContain(SECRET);
    expect(all).toContain('visible');
    expect(all).toContain('visible2');
    expect(all).toContain('file=[File]');
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
