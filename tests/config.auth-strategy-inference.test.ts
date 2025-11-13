import { describe, it, expect } from 'vitest';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

describe('auth strategy inference', () => {
  it('infers OAUTH when strategy unset and creds provided via overrides', () => {
    const h = hydrateConfig({
      overrides: {
        CAMUNDA_OAUTH_URL: 'https://auth.example',
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: 'csec',
        CAMUNDA_TOKEN_AUDIENCE: 'aud',
        CAMUNDA_REST_ADDRESS: 'https://api.example',
      },
    });
    expect(h.config.auth.strategy).toBe('OAUTH');
  });

  it('respects explicit NONE when creds provided', () => {
    const h = hydrateConfig({
      overrides: {
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_OAUTH_URL: 'https://auth.example',
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: 'csec',
        CAMUNDA_TOKEN_AUDIENCE: 'aud',
        CAMUNDA_REST_ADDRESS: 'https://api.example',
      },
    });
    expect(h.config.auth.strategy).toBe('NONE');
  });

  it('respects BASIC when creds provided (no inference)', () => {
    const h = hydrateConfig({
      overrides: {
        CAMUNDA_AUTH_STRATEGY: 'BASIC',
        CAMUNDA_BASIC_AUTH_USERNAME: 'u',
        CAMUNDA_BASIC_AUTH_PASSWORD: 'p',
        CAMUNDA_OAUTH_URL: 'https://auth.example', // should not trigger change
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: 'csec',
        CAMUNDA_TOKEN_AUDIENCE: 'aud',
        CAMUNDA_REST_ADDRESS: 'https://api.example',
      },
    });
    expect(h.config.auth.strategy).toBe('BASIC');
  });
});
