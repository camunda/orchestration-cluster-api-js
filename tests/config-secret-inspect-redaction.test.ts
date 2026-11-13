import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import { allKeys, isSecret } from '../src/runtime/configSchema';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Class-scoped guard for the hydrated configuration object (#616).
 *
 * `client.config` is public API and carries every credential the SDK was given.
 * Anything that stringifies or inspects it — `console.log(client.config)`, a JSON
 * error reporter, a crash handler, a test snapshot — must not print those values.
 *
 * The assertions are driven from `configSchema.ts` (every key with `secret: true`)
 * rather than from the three fields that were known to leak, so a credential added
 * to the config shape later is covered on the day it lands.
 */

function sentinelFor(key: string): string {
  return `SNTNL-${key}-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-ZQX7`;
}

function secretKeys(): string[] {
  return allKeys().filter((k) => isSecret(k));
}

/** Env providing a sentinel for every secret key, plus the companions each one requires. */
function envWithAllSecrets(): Record<string, string> {
  const env: Record<string, string> = {
    CAMUNDA_REST_ADDRESS: 'https://mock.local/v2',
    CAMUNDA_CLIENT_ID: 'sentinel-client-id',
    // BASIC populates `auth.basic`; the OAuth and mTLS credentials are carried on the
    // config regardless of the selected strategy, so one hydration exercises all four.
    CAMUNDA_AUTH_STRATEGY: 'BASIC',
    CAMUNDA_BASIC_AUTH_USERNAME: 'sentinel-user',
    // The inline mTLS key and its passphrase are only accepted alongside a certificate.
    CAMUNDA_MTLS_CERT: '-----BEGIN CERTIFICATE-----\nnot-a-real-cert\n-----END CERTIFICATE-----',
  };
  for (const k of secretKeys()) env[k] = sentinelFor(k);
  return env;
}

describe('hydrated config secret redaction on stringify and inspect', () => {
  it('the schema declares at least one secret key (guards against a vacuous suite)', () => {
    expect(secretKeys().length).toBeGreaterThan(0);
  });

  it('JSON.stringify of client.config contains no secret value', () => {
    const client = createCamundaClient({
      config: envWithAllSecrets() as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    const json = JSON.stringify(client.config);
    for (const key of secretKeys()) {
      expect(json, `${key} value leaked through JSON.stringify(client.config)`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  it('util.inspect of client.config contains no secret value', () => {
    const client = createCamundaClient({
      config: envWithAllSecrets() as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    const text = inspect(client.config, { depth: null, showHidden: false });
    for (const key of secretKeys()) {
      expect(text, `${key} value leaked through util.inspect(client.config)`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  // `console.log('%o', client)` enables showHidden, so a non-enumerable property is not
  // enough to keep a credential out of an inspect dump — hence both modes here.
  it.each([
    { label: 'util.inspect(client)', showHidden: false },
    {
      label: "util.inspect(client, { showHidden: true }) / console.log('%o', client)",
      showHidden: true,
    },
  ])('inspecting the client itself does not print a secret value: $label', ({ showHidden }) => {
    const client = createCamundaClient({
      config: envWithAllSecrets() as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    const text = inspect(client, { depth: null, showHidden });
    for (const key of secretKeys()) {
      expect(text, `${key} value leaked through an inspect of the client`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  // `getters: true` makes util.inspect invoke accessors, so an accessor that returns the raw
  // override map would print every credential the caller passed in.
  it('getter-enabled inspection of the client does not print a secret value', () => {
    const client = createCamundaClient({
      config: envWithAllSecrets() as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    const text = inspect(client, { depth: null, showHidden: true, getters: true });
    for (const key of secretKeys()) {
      expect(text, `${key} value leaked through a getter-enabled inspect`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  // Hydration trims some credentials (the OAuth client secret, the basic-auth password), so
  // the hydrated config holds a different string from the one the caller supplied. Redaction
  // must cover the trimmed form, not only the supplied one.
  it('redacts credentials supplied with surrounding whitespace', () => {
    const padded: Record<string, string> = envWithAllSecrets();
    for (const k of secretKeys()) padded[k] = `  ${sentinelFor(k)}\n`;
    const client = createCamundaClient({
      config: padded as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    const json = JSON.stringify(client.config);
    const text = inspect(client.config, { depth: null, showHidden: false });
    const clientText = inspect(client, { depth: null, showHidden: true, getters: true });
    for (const key of secretKeys()) {
      expect(json, `${key} leaked through JSON.stringify when padded`).not.toContain(
        sentinelFor(key)
      );
      expect(text, `${key} leaked through util.inspect(config) when padded`).not.toContain(
        sentinelFor(key)
      );
      expect(clientText, `${key} leaked through util.inspect(client) when padded`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  it('keeps the override map working for reconfiguration while off the instance', () => {
    const client: any = createCamundaClient({
      config: envWithAllSecrets() as any,
      fetch: (async () => new Response('{}', { status: 200 })) as any,
    });

    // Not an own property in any form, so no inspection mode can reach it.
    expect(Object.getOwnPropertyNames(client)).not.toContain('_overrides');
    // Still readable by SDK internals, and still merged on reconfigure.
    expect(client._overrides.CAMUNDA_CLIENT_SECRET).toBe(sentinelFor('CAMUNDA_CLIENT_SECRET'));
    client.configure({ config: { CAMUNDA_DEFAULT_TENANT_ID: 'tenant-b' } as any });
    expect(client.config.defaultTenantId).toBe('tenant-b');
    expect(client._overrides.CAMUNDA_CLIENT_SECRET).toBe(sentinelFor('CAMUNDA_CLIENT_SECRET'));
    expect(client.config.oauth.clientSecret).toBe(sentinelFor('CAMUNDA_CLIENT_SECRET'));
  });

  it('redacts secrets wherever they sit in the config, including __raw', () => {
    const { config } = hydrateConfig({ env: envWithAllSecrets() });
    const json = JSON.parse(JSON.stringify(config));

    // The nested credential fields are present but masked.
    expect(json.oauth.clientSecret).toMatch(/^\*+ZQX7$/);
    expect(json.auth.basic.password).toMatch(/^\*+ZQX7$/);
    expect(json.mtls.key).toMatch(/^\*+ZQX7$/);
    expect(json.mtls.keyPassphrase).toMatch(/^\*+ZQX7$/);

    // `__raw` is the schema-keyed map, so every secret key in it is masked too.
    for (const key of secretKeys()) {
      expect(json.__raw[key], `${key} leaked through config.__raw`).not.toContain(sentinelFor(key));
    }
  });

  it('leaves the config shape and its non-secret values intact', () => {
    const { config } = hydrateConfig({ env: envWithAllSecrets() });
    const json = JSON.parse(JSON.stringify(config));

    const definedKeys = Object.keys(config)
      .filter((k) => (config as any)[k] !== undefined)
      .sort();
    expect(Object.keys(json).sort()).toEqual(definedKeys);
    expect(json.restAddress).toBe('https://mock.local/v2');
    expect(json.oauth.clientId).toBe('sentinel-client-id');
    expect(json.auth.basic.username).toBe('sentinel-user');
    expect(json.mtls.cert).toContain('not-a-real-cert');
    expect(json.__raw.CAMUNDA_CLIENT_ID).toBe('sentinel-client-id');
    // Non-string values survive the walk unchanged.
    expect(json.httpRetry.maxAttempts).toBe(config.httpRetry.maxAttempts);
    expect(json.backpressure.enabled).toBe(config.backpressure.enabled);
  });

  it('keeps the redaction hooks non-enumerable so the config shape is unchanged', () => {
    const { config } = hydrateConfig({ env: envWithAllSecrets() });

    expect(Object.keys(config)).not.toContain('toJSON');
    expect(Object.prototype.propertyIsEnumerable.call(config, 'toJSON')).toBe(false);
    expect(
      Object.prototype.propertyIsEnumerable.call(config, Symbol.for('nodejs.util.inspect.custom'))
    ).toBe(false);
    // Direct property reads still return the real values for SDK internals.
    expect(config.oauth.clientSecret).toBe(sentinelFor('CAMUNDA_CLIENT_SECRET'));
    expect(config.mtls?.key).toBe(sentinelFor('CAMUNDA_MTLS_KEY'));
  });
});
