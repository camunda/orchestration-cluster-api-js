import { describe, it, expect } from 'vitest';
import { hydrateConfig, CamundaConfigurationError } from '../src/runtime/unifiedConfiguration';

describe('configuration parsing', () => {
  it('rejects invalid enum for CAMUNDA_AUTH_STRATEGY', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'invalid' } })).toThrow(CamundaConfigurationError);
  });

  it('rejects invalid integer', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '5.0' } })).toThrow(CamundaConfigurationError);
    expect(() => hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '+5' } })).toThrow(CamundaConfigurationError);
  });

  it('parses valid integer', () => {
    const cfg = hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '6000' } });
    expect(cfg.config.oauth.timeoutMs).toBe(6000);
  });
});