import { describe, it, expect } from 'vitest';

import { hydrateConfig, CamundaConfigurationError } from '../src/runtime/unifiedConfiguration';

describe('unified configuration hydration', () => {
  it('hydrates defaults', () => {
    const { config } = hydrateConfig({ env: {} });
    expect(config.restAddress).toBe('http://localhost:8080/v2');
    expect(config.auth.strategy).toBe('NONE');
    expect(config.defaultTenantId).toBe('<default>');
  });

  it('applies overrides precedence', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_REST_ADDRESS: 'http://env' },
      overrides: { CAMUNDA_REST_ADDRESS: 'http://override' },
    });
    expect(config.restAddress).toBe('http://override/v2');
    const { config: config2 } = hydrateConfig({ env: { CAMUNDA_DEFAULT_TENANT_ID: 'tenant-a' } });
    expect(config2.defaultTenantId).toBe('tenant-a');
  });

  it('enforces oauth conditional requirements', () => {
    try {
      hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'oauth' } });
      throw new Error('Expected error');
    } catch (e: any) {
      expect(e instanceof CamundaConfigurationError).toBe(true);
      expect(e.errors.some((d: any) => d.code === 'CONFIG_MISSING_REQUIRED')).toBe(true);
    }
  });

  it('parses validation mini-language', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_SDK_VALIDATION: 'req:strict,res:warn' } });
    expect(config.validation.req).toBe('strict');
    expect(config.validation.res).toBe('warn');
  });

  it('rejects invalid boolean', () => {
    try {
      hydrateConfig({ env: { CAMUNDA_SDK_VALIDATION_VERBOSE: 'maybe' } });
    } catch (e: any) {
      expect(e.errors.some((d: any) => d.code === 'CONFIG_INVALID_BOOLEAN')).toBe(true);
    }
  });

  it('redacts secrets', () => {
    const { redacted } = hydrateConfig({
      env: {
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_CLIENT_ID: 'abc',
        CAMUNDA_CLIENT_SECRET: 'abcdefghijklmnop',
      },
    });
    expect(redacted.CAMUNDA_CLIENT_SECRET).toMatch(/^\*+mnop$/); // ends with last4
  });

  it('supports ZEEBE_REST_ADDRESS alias when CAMUNDA_REST_ADDRESS absent', () => {
    const { config } = hydrateConfig({
      env: { ZEEBE_REST_ADDRESS: 'https://cluster.alias.example' },
    });
    expect(config.restAddress).toBe('https://cluster.alias.example/v2');
  });

  it('infers OAUTH auth strategy when CAMUNDA_OAUTH_URL provided and strategy missing', () => {
    const { config } = hydrateConfig({
      env: {
        CAMUNDA_OAUTH_URL: 'https://auth.example/oauth/token',
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
      },
    });
    expect(config.auth.strategy).toBe('OAUTH');
  });
});
