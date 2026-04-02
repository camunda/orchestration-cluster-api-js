import { describe, expect, it } from 'vitest';
import { CamundaConfigurationError, hydrateConfig } from '../src/runtime/unifiedConfiguration';

// Negative tests asserting incomplete mTLS pairs rejected.
describe('mTLS negative configuration', () => {
  it('errors when only cert provided', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_MTLS_CERT: '---CERT---' } })).toThrow(
      CamundaConfigurationError
    );
  });
  it('errors when only key provided', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_MTLS_KEY: '---KEY---' } })).toThrow(
      CamundaConfigurationError
    );
  });
  it('errors when cert path only', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_MTLS_CERT_PATH: '/tmp/cert.pem' } })).toThrow(
      CamundaConfigurationError
    );
  });
  it('errors when key path only', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_MTLS_KEY_PATH: '/tmp/key.pem' } })).toThrow(
      CamundaConfigurationError
    );
  });
  it('errors when passphrase provided without key', () => {
    const thrower = () => hydrateConfig({ env: { CAMUNDA_MTLS_KEY_PASSPHRASE: 'secret' } });
    expect(thrower).toThrow(CamundaConfigurationError);
    expect(thrower).toThrow(/CAMUNDA_MTLS_KEY_PASSPHRASE/);
  });
});

describe('mTLS positive configuration', () => {
  it('accepts CA-only without cert or key', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_MTLS_CA: '-----BEGIN CERTIFICATE-----\nFAKECA\n-----END CERTIFICATE-----' },
    });
    expect(config.mtls?.ca).toBe('-----BEGIN CERTIFICATE-----\nFAKECA\n-----END CERTIFICATE-----');
  });
  it('accepts CA path only without cert or key', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_MTLS_CA_PATH: '/tmp/ca.pem' },
    });
    expect(config.mtls?.caPath).toBe('/tmp/ca.pem');
  });
});
