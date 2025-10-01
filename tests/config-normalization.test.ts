import { describe, it, expect } from 'vitest';

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