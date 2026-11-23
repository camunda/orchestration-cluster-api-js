import { describe, expect, it } from 'vitest';
import { allKeys, isSecret, schemaEntry } from '../src/runtime/configSchema';
import type { SupportLogger } from '../src/runtime/supportLogger';
import { writeSupportLogPreamble } from '../src/runtime/supportLogger';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Class-scoped guard for the support log preamble.
 *
 * The preamble dumps `config.__raw`, which carries every key in the configuration
 * schema. `configSchema.ts` is the single source of truth for which of those keys
 * hold a credential (`secret: true`), so the preamble must redact exactly that set.
 * A hand-maintained second list in supportLogger.ts diverged from the schema and
 * wrote the inline mTLS private key to disk in cleartext (#615).
 *
 * These tests drive every `secret: true` key in the schema rather than the one key
 * that leaked, so a newly added secret key is covered on the day it lands.
 */

// Distinctive, obviously-synthetic values. Each must be long enough that a
// "first N characters" style mask would still be caught by the substring assertion,
// and must share no leading or trailing run with the other fixtures in this file
// (a PEM's `-----END ...-----` tail in particular).
function sentinelFor(key: string): string {
  return `SNTNL-${key}-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-ZQX7`;
}

function secretKeys(): string[] {
  return allKeys().filter((k) => isSecret(k));
}

/** Env that provides a sentinel for every secret key, plus the companions each one requires. */
function envWithAllSecrets(): Record<string, string> {
  const env: Record<string, string> = {
    CAMUNDA_REST_ADDRESS: 'https://mock.local/v2',
    CAMUNDA_SUPPORT_LOG_ENABLED: 'true',
    // CAMUNDA_MTLS_KEY_PASSPHRASE and CAMUNDA_MTLS_KEY are only accepted alongside a cert.
    CAMUNDA_MTLS_CERT: '-----BEGIN CERTIFICATE-----\nnot-a-real-cert\n-----END CERTIFICATE-----',
    CAMUNDA_CLIENT_ID: 'sentinel-client-id',
  };
  for (const k of secretKeys()) env[k] = sentinelFor(k);
  return env;
}

function collectPreamble(env: Record<string, string>): string {
  const lines: string[] = [];
  const logger: SupportLogger = { log: (m) => void lines.push(String(m)) };
  const { config } = hydrateConfig({ env });
  writeSupportLogPreamble(logger, config);
  return lines.join('\n');
}

describe('support log preamble secret redaction', () => {
  it('the schema declares at least one secret key (guards against a vacuous suite)', () => {
    expect(secretKeys().length).toBeGreaterThan(0);
  });

  it('masks every schema key marked secret: true', () => {
    const env = envWithAllSecrets();
    const preamble = collectPreamble(env);

    for (const key of secretKeys()) {
      expect(preamble, `${key} must appear in the preamble at all`).toContain(key);
      expect(preamble, `${key} value leaked into the support log preamble`).not.toContain(
        sentinelFor(key)
      );
    }
  });

  it('discloses no fragment of a secret value', () => {
    const env = envWithAllSecrets();
    const preamble = collectPreamble(env);

    for (const key of secretKeys()) {
      const value = sentinelFor(key);
      // Any leading or trailing run of the real value is a disclosure, however short.
      for (const n of [4, 8, 16]) {
        expect(preamble, `${key}: first ${n} characters of the value were disclosed`).not.toContain(
          value.slice(0, n)
        );
        expect(preamble, `${key}: last ${n} characters of the value were disclosed`).not.toContain(
          value.slice(-n)
        );
      }
    }
  });

  it('leaves non-secret configuration values readable', () => {
    const env = envWithAllSecrets();
    const preamble = collectPreamble(env);

    expect(preamble).toContain('https://mock.local/v2');
    expect(preamble).toContain('sentinel-client-id');
    // A cert is public material and is not marked secret in the schema.
    expect(isSecret('CAMUNDA_MTLS_CERT')).toBe(false);
    expect(preamble).toContain('not-a-real-cert');
  });

  it('redacts a key that is secret in the schema but absent from any hand-written list', () => {
    // The specific divergence behind #615: CAMUNDA_MTLS_KEY carries secret: true in
    // configSchema.ts but was missing from supportLogger.ts's own SENSITIVE_KEYS list.
    expect(schemaEntry('CAMUNDA_MTLS_KEY').secret).toBe(true);

    const preamble = collectPreamble({
      CAMUNDA_REST_ADDRESS: 'https://mock.local/v2',
      CAMUNDA_SUPPORT_LOG_ENABLED: 'true',
      CAMUNDA_MTLS_CERT: '-----BEGIN CERTIFICATE-----\nnot-a-real-cert\n-----END CERTIFICATE-----',
      CAMUNDA_MTLS_KEY: sentinelFor('CAMUNDA_MTLS_KEY'),
    });

    expect(preamble).toContain('CAMUNDA_MTLS_KEY');
    expect(preamble).not.toContain(sentinelFor('CAMUNDA_MTLS_KEY'));
  });
});
