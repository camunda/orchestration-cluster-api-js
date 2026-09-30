import { describe, expect, it } from 'vitest';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

describe('restAddress /v2 normalization', () => {
  it('appends /v2 when missing', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_REST_ADDRESS: 'http://host:8080' } });
    expect(config.restAddress).toBe('http://host:8080/v2');
  });

  it('does not double-append when already ending with /v2', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_REST_ADDRESS: 'http://host:8080/v2' } });
    expect(config.restAddress).toBe('http://host:8080/v2');
  });

  it('normalizes when trailing slash after /v2', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_REST_ADDRESS: 'http://host:8080/v2/' } });
    expect(config.restAddress).toBe('http://host:8080/v2/');
  });
});

describe('CAMUNDA_REST_ADDRESS_EXACT (opt out of /v2 suffix)', () => {
  it('does not append /v2 when exact mode is enabled via env', () => {
    const { config } = hydrateConfig({
      env: {
        CAMUNDA_REST_ADDRESS: 'https://gateway.example/api',
        CAMUNDA_REST_ADDRESS_EXACT: 'true',
      },
    });
    expect(config.restAddress).toBe('https://gateway.example/api');
  });

  it('does not append /v2 when exact mode is enabled via config object', () => {
    const { config } = hydrateConfig({
      overrides: {
        CAMUNDA_REST_ADDRESS: 'https://gateway.example/api',
        CAMUNDA_REST_ADDRESS_EXACT: true,
      },
    });
    expect(config.restAddress).toBe('https://gateway.example/api');
  });

  it('preserves a trailing slash exactly when exact mode is enabled', () => {
    const { config } = hydrateConfig({
      env: {
        CAMUNDA_REST_ADDRESS: 'https://gateway.example/api/',
        CAMUNDA_REST_ADDRESS_EXACT: 'true',
      },
    });
    expect(config.restAddress).toBe('https://gateway.example/api/');
  });

  it('leaves an existing /v2 address untouched in exact mode', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_REST_ADDRESS: 'http://host:8080/v2', CAMUNDA_REST_ADDRESS_EXACT: 'true' },
    });
    expect(config.restAddress).toBe('http://host:8080/v2');
  });

  it('still appends /v2 when exact mode is disabled (default)', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_REST_ADDRESS: 'https://gateway.example/api' },
    });
    expect(config.restAddress).toBe('https://gateway.example/api/v2');
  });

  it('still appends /v2 when exact mode is explicitly false', () => {
    const { config } = hydrateConfig({
      env: {
        CAMUNDA_REST_ADDRESS: 'https://gateway.example/api',
        CAMUNDA_REST_ADDRESS_EXACT: 'false',
      },
    });
    expect(config.restAddress).toBe('https://gateway.example/api/v2');
  });
});
