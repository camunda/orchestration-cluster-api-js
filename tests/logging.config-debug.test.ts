import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

// Ensure debug-level redacted configuration emission works and secrets are masked

describe('config debug logging', () => {
  it('emits redacted hydrated config on construction at debug level', () => {
    const events: any[] = [];
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.test',
        CAMUNDA_TOKEN_AUDIENCE: 'example',
        CAMUNDA_OAUTH_URL: 'https://auth.test',
        CAMUNDA_OAUTH_GRANT_TYPE: 'CLIENT_CREDENTIALS',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_CLIENT_ID: 'my-client-id',
        CAMUNDA_CLIENT_SECRET: 'supersecret',
        CAMUNDA_SDK_LOG_LEVEL: 'debug',
      } as any,
      log: { level: 'debug', transport: (e) => events.push(e) },
    });
    // trigger a noop to avoid unused var linting
    expect(client).toBeTruthy();
    const hydrationEvt = events.find((e) => e.args[0] === 'config.hydrated');
    expect(hydrationEvt).toBeTruthy();
    const payload = hydrationEvt.args[1];
    expect(payload.config.CAMUNDA_CLIENT_SECRET).toMatch(/^[*]+.{4}$/); // masked except last 4
    expect(payload.config.CAMUNDA_CLIENT_SECRET.endsWith('cret')).toBe(true);
    expect(payload.config.CAMUNDA_CLIENT_SECRET).not.toContain('supersecret');
  });
  it('emits redacted config on reconfigure', () => {
    const events: any[] = [];
    const client = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://example.test',
        CAMUNDA_TOKEN_AUDIENCE: 'example',
        CAMUNDA_OAUTH_URL: 'https://auth.test',
        CAMUNDA_OAUTH_GRANT_TYPE: 'CLIENT_CREDENTIALS',
        CAMUNDA_OAUTH_TIMEOUT_MS: 1000,
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10,
        CAMUNDA_SDK_LOG_LEVEL: 'debug',
      } as any,
      log: { level: 'debug', transport: (e) => events.push(e) },
    });
    events.length = 0; // reset events to isolate reconfigure emission
    client.configure({ config: { CAMUNDA_CLIENT_SECRET: 'anothersecret' } as any });
    const evt = events.find((e) => e.args[0] === 'config.reconfigured');
    expect(evt).toBeTruthy();
    const payload = evt.args[1];
    expect(payload.config.CAMUNDA_CLIENT_SECRET).toMatch(/^[*]+.{4}$/);
  });
});
