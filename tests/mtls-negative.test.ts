import { describe, it, expect } from 'vitest';

import { hydrateConfig, CamundaConfigurationError } from '../src/runtime/unifiedConfiguration';

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
});
