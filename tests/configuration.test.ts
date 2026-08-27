import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CamundaConfigurationError,
  hydrateConfig,
  hydrateConfigAsync,
} from '../src/runtime/unifiedConfiguration';

describe('configuration parsing', () => {
  it('rejects invalid enum for CAMUNDA_AUTH_STRATEGY', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'invalid' } })).toThrow(
      CamundaConfigurationError
    );
  });

  it('rejects invalid integer', () => {
    expect(() => hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '5.0' } })).toThrow(
      CamundaConfigurationError
    );
    expect(() => hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '+5' } })).toThrow(
      CamundaConfigurationError
    );
  });

  it('parses valid integer', () => {
    const cfg = hydrateConfig({ env: { CAMUNDA_OAUTH_TIMEOUT_MS: '6000' } });
    expect(cfg.config.oauth.timeoutMs).toBe(6000);
  });
});

describe('hydrateConfigAsync fetch timeout budget', () => {
  // The timeout budget is a real timer. If any outcome forgets to release it, the process
  // is held open until it fires. Asserting on the pending-timer count covers all three
  // exits at once, so the same leak cannot reappear on a path this test does not name.
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('releases the budget when the fetch resolves', async () => {
    await hydrateConfigAsync({
      fetch: async () => ({ CAMUNDA_OAUTH_TIMEOUT_MS: '6000' }),
      timeoutMs: 5000,
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('releases the budget when the fetch rejects', async () => {
    await expect(
      hydrateConfigAsync({
        fetch: async () => {
          throw new Error('network down');
        },
        timeoutMs: 5000,
      })
    ).rejects.toThrow('network down');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('releases the budget when the deadline wins', async () => {
    const pending = hydrateConfigAsync({ fetch: () => new Promise(() => {}), timeoutMs: 5000 });
    const assertion = expect(pending).rejects.toThrow(CamundaConfigurationError);
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
});
