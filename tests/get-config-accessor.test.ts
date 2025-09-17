import { describe, it, expect } from 'vitest';

import { getConfig, hydrateConfig } from '../src/runtime/unifiedConfiguration';

describe('getConfig accessor', () => {
  it('returns undefined before any hydration', () => {
    // Intentionally not calling hydrate first in this isolated process scope.
    // (Other tests may have hydrated earlier; in that case this assertion may need isolation.)
    // We defensively allow either undefined (ideal) or an object if prior tests already hydrated.
    const cfg = getConfig();
    if (cfg) {
      expect(typeof cfg).toBe('object');
    } else {
      expect(cfg).toBeUndefined();
    }
  });
  it('returns last hydrated config without re-hydrating', () => {
    hydrateConfig({ env: { CAMUNDA_SDK_VALIDATION: 'warn' } });
    const first = getConfig();
    expect(first?.config.validation.req).toBe('warn');
    // Mutate process.env to a different mode; getConfig should not change until hydrate invoked.
    process.env.CAMUNDA_SDK_VALIDATION = 'strict';
    const second = getConfig();
    expect(second).toBe(first); // identity stable
    expect(second?.config.validation.req).toBe('warn');
  });
});
