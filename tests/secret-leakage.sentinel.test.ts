import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient, ProcessDefinitionKey } from '../src';
import { CamundaAuthError, createAuthFacade } from '../src/runtime/auth';
import { createTestClock } from '../src/runtime/clock';
import { allKeys, isSecret } from '../src/runtime/configSchema';
import { createLogger } from '../src/runtime/logger';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Sentinel-secret regression test (#618).
 *
 * Required by the shared SDK policy: configure a recognisable sentinel for each credential
 * the SDK can hold, drive the auth success and auth failure paths, and assert the sentinel
 * never appears in logs, exceptions or telemetry.
 *
 * The sentinel table is checked against `configSchema.ts`, so adding a key with
 * `secret: true` fails this file until the new credential is given a sentinel here — which
 * is what makes this a class-scoped guard rather than a snapshot of today's four secrets.
 *
 * Scope: the sinks below are the log transport (every level up to `trace`), the telemetry
 * hooks, and the text of the error a failed auth throws. Three further sinks are covered by
 * their own regression tests alongside their fixes — the support-log preamble (#615),
 * `JSON.stringify` / `util.inspect` of the config (#616), and the `silly`-level HTTP body
 * previews (#617). Extend this file whenever a credential gains a new way to flow.
 */

const SENTINEL_KEY =
  '-----BEGIN PRIVATE KEY-----\nSNTNL-mtls-private-key-ZQX7\n-----END PRIVATE KEY-----';

/** One sentinel per schema key marked `secret: true`. */
const SENTINELS: Record<string, string> = {
  CAMUNDA_CLIENT_SECRET: 'SNTNL-oauth-client-secret-ZQX7',
  CAMUNDA_BASIC_AUTH_PASSWORD: 'SNTNL-basic-auth-password-ZQX7',
  CAMUNDA_MTLS_KEY: SENTINEL_KEY,
  CAMUNDA_MTLS_KEY_PASSPHRASE: 'SNTNL-mtls-key-passphrase-ZQX7',
};

/** The token the mock endpoint issues. A bearer token is a credential in its own right. */
const SENTINEL_ACCESS_TOKEN = 'SNTNL-issued-access-token-ZQX7';

const CERT = '-----BEGIN CERTIFICATE-----\nFAKECERT\n-----END CERTIFICATE-----';

const OAUTH_URL = 'https://login.example.com/oauth/token';
const REST_ADDRESS = 'https://mock.local';

/**
 * Every form a credential could plausibly be written in. Base64 matters because basic auth
 * encodes the password into the Authorization header.
 */
function leakForms(value: string): string[] {
  const forms = [value, encodeURIComponent(value), JSON.stringify(value).slice(1, -1)];
  try {
    forms.push(Buffer.from(value, 'utf8').toString('base64'));
    forms.push(Buffer.from(`user:${value}`, 'utf8').toString('base64'));
  } catch {
    /* ignore */
  }
  // A short fragment is not evidence of a leak; a long one is.
  return [...new Set(forms)].filter((f) => f.length >= 12);
}

/**
 * Render anything to a searchable string without dropping content.
 *
 * Two traps this has to avoid, or the assertions pass for the wrong reason:
 * cycle tracking must be scoped to one render — a set shared across events would replace
 * the *second* sighting of an ordinary object with `[Circular]` and hide anything it has
 * acquired since — and an `Error` nested inside a log argument must be expanded, because
 * `JSON.stringify` drops `message`, `stack` and `cause` from a plain Error.
 */
function renderValue(value: unknown): string {
  const seen = new WeakSet<object>();
  const expandError = (e: Error): Record<string, unknown> => ({
    __error: e.name,
    message: e.message,
    stack: e.stack,
    cause: (e as any).cause instanceof Error ? expandError((e as any).cause) : (e as any).cause,
  });
  const normalize = (v: unknown): unknown => (v instanceof Error ? expandError(v) : v);

  if (typeof value === 'string') return value;
  try {
    return (
      JSON.stringify(normalize(value), (_k, v) => {
        const normalized = normalize(v);
        if (normalized && typeof normalized === 'object') {
          if (seen.has(normalized)) return '[Circular]';
          seen.add(normalized);
        }
        return typeof normalized === 'bigint' ? String(normalized) : normalized;
      }) ?? String(value)
    );
  } catch {
    return String(value);
  }
}

/** Collects every sink and renders it as one searchable string. */
function makeSinks() {
  const chunks: string[] = [];
  const render = renderValue;

  const record = (label: string, value: unknown) => chunks.push(`${label} ${render(value)}`);

  const telemetryEvents: any[] = [];
  const hooks = {
    beforeRequest: (e: any) => record('telemetry.beforeRequest', e),
    afterResponse: (e: any) => record('telemetry.afterResponse', e),
    requestError: (e: any) => record('telemetry.requestError', e),
    authStart: (e: any) => record('telemetry.authStart', e),
    authSuccess: (e: any) => record('telemetry.authSuccess', e),
    authError: (e: any) => record('telemetry.authError', e),
    retry: (e: any) => record('telemetry.retry', e),
  };
  for (const [name, fn] of Object.entries(hooks)) {
    (hooks as any)[name] = (e: any) => {
      telemetryEvents.push(e);
      return (fn as any)(e);
    };
  }

  return {
    hooks,
    telemetryEvents,
    // The whole event, not just `args`: `logger.code()` emits a structured `data` field
    // alongside `args`, and a credential there would otherwise never be searched.
    logTransport: (e: any) => record(`log.${e?.level}.${e?.scope ?? ''}`, e),
    captureError: (e: unknown) => record('thrown', e),
    text: () => chunks.join('\n'),
  };
}

function expectNoLeak(text: string, where: string) {
  for (const [key, value] of Object.entries(SENTINELS)) {
    for (const form of leakForms(value)) {
      expect(text, `${key} leaked into ${where}`).not.toContain(form);
    }
  }
  for (const form of leakForms(SENTINEL_ACCESS_TOKEN)) {
    expect(text, `the issued access token leaked into ${where}`).not.toContain(form);
  }
}

/** Mock transport: serves the token endpoint per `tokenResponse`, then a process instance. */
function makeFetch(tokenResponse: () => Response) {
  return vi.fn(async (input: any) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.startsWith(OAUTH_URL)) return tokenResponse();
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
}

function makeClient(
  config: Record<string, string>,
  sinks: ReturnType<typeof makeSinks>,
  fetchImpl: any
) {
  return createCamundaClient({
    config: {
      CAMUNDA_REST_ADDRESS: REST_ADDRESS,
      CAMUNDA_SDK_LOG_LEVEL: 'trace',
      ...config,
    } as any,
    fetch: fetchImpl,
    // `trace` is the deepest level that is not the explicitly-unsafe `silly`.
    log: { level: 'trace', transport: sinks.logTransport },
    // `mirrorToLog` must be explicit: supplying `hooks` takes the client off the path that
    // auto-enables HTTP trace mirroring at trace level, so without this the log transport
    // would never see an HTTP line and the assertions would rest on the hooks alone.
    telemetry: { hooks: sinks.hooks as any, mirrorToLog: true },
  });
}

/**
 * The configurations the scenarios below run with — the only place a scenario's config
 * comes from. Every scenario reads `SCENARIOS.<name>` rather than a config of its own, so
 * the coverage guard is a statement about what actually runs: a sentinel that is only ever
 * searched for, never configured, would make its assertions vacuous.
 */
const SCENARIOS = {
  oauth: {
    CAMUNDA_AUTH_STRATEGY: 'OAUTH',
    CAMUNDA_OAUTH_URL: OAUTH_URL,
    CAMUNDA_CLIENT_ID: 'sentinel-client-id',
    CAMUNDA_CLIENT_SECRET: SENTINELS.CAMUNDA_CLIENT_SECRET,
    CAMUNDA_OAUTH_RETRY_MAX: '2',
    CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: '1',
  },
  basic: {
    CAMUNDA_AUTH_STRATEGY: 'BASIC',
    CAMUNDA_BASIC_AUTH_USERNAME: 'user',
    CAMUNDA_BASIC_AUTH_PASSWORD: SENTINELS.CAMUNDA_BASIC_AUTH_PASSWORD,
  },
  mtls: {
    CAMUNDA_AUTH_STRATEGY: 'NONE',
    CAMUNDA_MTLS_CERT: CERT,
    CAMUNDA_MTLS_KEY: SENTINELS.CAMUNDA_MTLS_KEY,
    CAMUNDA_MTLS_KEY_PASSPHRASE: SENTINELS.CAMUNDA_MTLS_KEY_PASSPHRASE,
  },
} satisfies Record<string, Record<string, string>>;

describe('sentinel-secret regression test', () => {
  it('covers every schema key marked secret: true', () => {
    const schemaSecrets = allKeys()
      .filter((k) => isSecret(k))
      .sort();
    expect(
      Object.keys(SENTINELS).sort(),
      'a credential was added to configSchema.ts without a sentinel here — extend SENTINELS and drive the new credential through a scenario below'
    ).toEqual(schemaSecrets);
  });

  it('actually configures every sentinel in a scenario, and the SDK really holds it', () => {
    // A sentinel that is searched for but never configured would make its assertions
    // vacuous: the SDK never holds the value, so of course it never leaks it. Require each
    // schema secret to appear, with its sentinel value, in a scenario configuration, and
    // require the SDK to have accepted it: hydrating that configuration must yield the
    // sentinel as the value of that schema key.
    const schemaSecrets = new Set(allKeys().filter((k) => isSecret(k)));
    const configured = new Set<string>();
    for (const [name, config] of Object.entries(SCENARIOS) as [string, Record<string, string>][]) {
      const { config: hydrated } = hydrateConfig({
        env: { CAMUNDA_REST_ADDRESS: REST_ADDRESS, ...config },
      });
      for (const [key, value] of Object.entries(config)) {
        if (!schemaSecrets.has(key)) continue;
        expect(value, `${name}: ${key} must be given its sentinel`).toBe(SENTINELS[key]);
        expect(
          (hydrated as any).__raw[key],
          `${name}: the SDK did not receive ${key}; the scenario would search for a value it never held`
        ).toBe(value);
        configured.add(key);
      }
    }
    expect(
      [...configured].sort(),
      'a schema secret is never configured in any scenario — give the new credential a scenario, not just a sentinel'
    ).toEqual([...schemaSecrets].sort());
  });

  it('the leak detector actually detects a leak', () => {
    // Guards against a vacuous suite: if expectNoLeak ever stopped matching, every
    // assertion below would pass for the wrong reason.
    for (const value of [...Object.values(SENTINELS), SENTINEL_ACCESS_TOKEN]) {
      expect(() => expectNoLeak(`some log line ${value} tail`, 'a fixture')).toThrow();
      // Base64 is how a basic-auth password reaches an Authorization header.
      const encoded = Buffer.from(`user:${value}`, 'utf8').toString('base64');
      expect(() => expectNoLeak(`Authorization: Basic ${encoded}`, 'a fixture')).toThrow();
      // An Error nested inside a log argument: JSON.stringify drops message and stack from
      // a plain Error, so the renderer has to expand it or this leak would go unseen.
      const sinks = makeSinks();
      sinks.logTransport({ level: 'error', scope: 'x', args: ['boom', new Error(value)] });
      expect(() => expectNoLeak(sinks.text(), 'a fixture')).toThrow();
      // A credential in the structured `data` field of a logger.code() event.
      const dataSinks = makeSinks();
      dataSinks.logTransport({
        level: 'warn',
        scope: 'x',
        args: ['msg'],
        code: 'C',
        data: { value },
      });
      expect(() => expectNoLeak(dataSinks.text(), 'a fixture')).toThrow();
    }
  });

  it('does not hide a repeated object as circular', () => {
    // A cycle set shared across events would replace the second sighting of an ordinary
    // object with [Circular] and hide whatever it had acquired since.
    const shared: any = { seen: 'first' };
    const sinks = makeSinks();
    sinks.logTransport({ level: 'info', scope: 'x', args: [shared] });
    shared.seen = SENTINELS.CAMUNDA_CLIENT_SECRET;
    sinks.logTransport({ level: 'info', scope: 'x', args: [shared] });
    expect(() => expectNoLeak(sinks.text(), 'a fixture')).toThrow();
  });

  it('auth success: no credential reaches logs or telemetry', async () => {
    const sinks = makeSinks();
    const client = makeClient(
      SCENARIOS.oauth,
      sinks,
      makeFetch(
        () =>
          new Response(
            JSON.stringify({
              access_token: SENTINEL_ACCESS_TOKEN,
              expires_in: 300,
              token_type: 'Bearer',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
      )
    );

    await client.createProcessInstance({
      processDefinitionKey: ProcessDefinitionKey.assumeExists('123'),
    });

    // The run really did exercise auth and HTTP, so the assertion is not vacuous.
    expect(sinks.telemetryEvents.some((e) => e.type === 'auth.success')).toBe(true);
    // Specifically through the *log transport*, not only through the telemetry hooks.
    expect(sinks.text(), 'the HTTP log transport was never exercised').toMatch(
      /log\.trace\.telemetry .*http\.end/
    );
    expectNoLeak(sinks.text(), 'the auth success path');
  });

  /**
   * The failure cases are driven through the auth facade rather than a client call,
   * because the client's auth interceptor does not surface a token-fetch failure to the
   * caller — the facade is where a failed exchange raises and is logged.
   */
  async function driveAuthFailure(tokenResponse: () => Response) {
    const sinks = makeSinks();
    const { config } = hydrateConfig({
      env: { CAMUNDA_REST_ADDRESS: REST_ADDRESS, ...SCENARIOS.oauth },
    });
    const auth = createAuthFacade(config, {
      fetch: makeFetch(tokenResponse) as any,
      logger: createLogger({ level: 'trace', transport: sinks.logTransport }),
      telemetryHooks: sinks.hooks as any,
      clock: createTestClock({ start: 1_700_000_000_000 }),
    });

    const err = await auth.getAuthHeaders().then(
      () => {
        throw new Error('expected the token fetch to fail');
      },
      (e) => e
    );
    sinks.captureError(err);
    return { sinks, err };
  }

  it('auth failure (HTTP 401): no credential reaches the error, logs or telemetry', async () => {
    const { sinks, err } = await driveAuthFailure(
      () =>
        new Response(JSON.stringify({ error: 'invalid_client' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
    );

    expect(err).toBeInstanceOf(CamundaAuthError);
    expect(sinks.telemetryEvents.some((e) => e.type === 'auth.error')).toBe(true);
    expectNoLeak(sinks.text(), 'the auth failure path (401)');
  });

  it('auth failure (malformed token body): no credential reaches the error, logs or telemetry', async () => {
    const { sinks, err } = await driveAuthFailure(
      () =>
        new Response('<html>not a token</html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
    );

    expect(err).toBeInstanceOf(CamundaAuthError);
    expectNoLeak(sinks.text(), 'the auth failure path (malformed token body)');
  });

  it('basic auth: the password does not reach logs or telemetry, in any encoding', async () => {
    const sinks = makeSinks();
    const client = makeClient(
      SCENARIOS.basic,
      sinks,
      makeFetch(() => new Response('{}', { status: 200 }))
    );

    await client.createProcessInstance({
      processDefinitionKey: ProcessDefinitionKey.assumeExists('123'),
    });

    expect(sinks.text()).toContain('http.end');
    expectNoLeak(sinks.text(), 'the basic auth path');
  });

  it('mTLS: the inline private key and passphrase do not reach logs or telemetry', async () => {
    const sinks = makeSinks();
    const client = makeClient(
      SCENARIOS.mtls,
      sinks,
      makeFetch(() => new Response('{}', { status: 200 }))
    );

    await client.createProcessInstance({
      processDefinitionKey: ProcessDefinitionKey.assumeExists('123'),
    });

    expect(sinks.text()).toContain('http.end');
    expectNoLeak(sinks.text(), 'the mTLS path');
  });
});
