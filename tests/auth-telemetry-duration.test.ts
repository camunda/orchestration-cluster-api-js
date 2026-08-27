import { describe, expect, it, vi } from 'vitest';
import { createAuthFacade } from '../src/runtime/auth';
import type { Clock } from '../src/runtime/clock';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Telemetry durations must be measured against a wall-clock start, never derived from the
 * injected clock. That clock carries token-expiry time and may be pinned to an arbitrary
 * epoch, so subtracting it from a wall-clock reading yields a duration off by the distance
 * between the two epochs — around 1.7e12 ms when a test pins the clock to zero.
 */

/** Pinned at epoch 0: the worst case for a duration computed against wall time. */
function pinnedClock(): Clock {
  let current = 0;
  return {
    now: () => current,
    sleep: async (ms: number) => {
      current += ms;
    },
    deadline: () => ({ signal: new AbortController().signal, dispose: () => {} }),
  };
}

function tokenResponse() {
  const body = { access_token: 't1', expires_in: 120 };
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as any;
}

const oauthEnv = {
  CAMUNDA_AUTH_STRATEGY: 'OAUTH',
  CAMUNDA_CLIENT_ID: 'id',
  CAMUNDA_CLIENT_SECRET: 'shhh',
};

describe('auth telemetry durations', () => {
  it('stays plausible when the injected clock is pinned to a different epoch', async () => {
    const events: any[] = [];
    const { config } = hydrateConfig({ env: oauthEnv });

    const auth = createAuthFacade(config, {
      fetch: vi.fn().mockResolvedValue(tokenResponse()),
      clock: pinnedClock(),
      telemetryHooks: { authSuccess: (e: any) => events.push(e) } as any,
    });

    await auth.getAuthHeaders();

    expect(events).toHaveLength(1);
    const { durationMs } = events[0];
    expect(durationMs).toBeGreaterThanOrEqual(0);
    // A mixed-unit subtraction lands near the current epoch, not near zero.
    expect(durationMs).toBeLessThan(60_000);
  });
});
