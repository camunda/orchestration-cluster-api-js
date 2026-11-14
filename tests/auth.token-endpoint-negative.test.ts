import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CamundaAuthError, CamundaAuthErrorCode, createAuthFacade } from '../src/runtime/auth';
import { type Clock, createTestClock } from '../src/runtime/clock';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Negative-case baseline for the token endpoint (#621).
 *
 * The shared SDK policy requires the hand-written runtime to cover its failure paths, and
 * lists "token-endpoint errors and expiry boundaries". `tests/auth.test.ts` drives
 * transport-level failure but never a malformed success response, never an expiry
 * boundary, and never the on-disk token cache. These are those cases.
 *
 * Everything here is deterministic: the injectable `Clock` drives expiry and the retry
 * backoff, so no test waits on real time.
 */

const START = 1_700_000_000_000;

function oauthConfig(extra: Record<string, string> = {}) {
  return hydrateConfig({
    env: {
      CAMUNDA_AUTH_STRATEGY: 'OAUTH',
      CAMUNDA_CLIENT_ID: 'id',
      CAMUNDA_CLIENT_SECRET: 'shhh',
      CAMUNDA_OAUTH_RETRY_MAX: '2',
      CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: '1',
      ...extra,
    },
  }).config;
}

/** 200 responses, served in order; the last one repeats. */
function tokenResponses(bodies: any[]) {
  let i = 0;
  return vi.fn(async () => {
    const body = bodies[Math.min(i, bodies.length - 1)];
    i++;
    return {
      ok: true,
      status: 200,
      json: async () => {
        if (typeof body === 'function') return body();
        return body;
      },
    } as any;
  });
}

/**
 * A clock whose `now` the test sets directly — including backwards, which `TestClock` has
 * no API for. Waiting is delegated to a real `TestClock`, so the `Clock` contract (never
 * settling a sleep synchronously) still holds.
 */
function settableClock(start: number) {
  const inner = createTestClock({ start: 0 });
  let current = start;
  const clock: Clock = {
    now: () => current,
    sleep: (ms, signal) => inner.sleep(ms, signal),
    deadline: (ms) => inner.deadline(ms),
  };
  return { clock, setNow: (ms: number) => void (current = ms) };
}

const tempDirs: string[] = [];
function tempCacheDir() {
  const dir = mkdtempSync(join(tmpdir(), 'camunda-token-cache-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe('token endpoint: malformed success responses', () => {
  it('reports a 200 that omits access_token, with the parse failure as the cause', async () => {
    const fetch = tokenResponses([{ expires_in: 300 }]);
    const auth = createAuthFacade(oauthConfig(), {
      fetch,
      clock: createTestClock({ start: START }),
    });

    const err = await auth.getAuthHeaders().then(
      () => {
        throw new Error('expected the token fetch to fail');
      },
      (e) => e
    );

    expect(err).toBeInstanceOf(CamundaAuthError);
    // Current behaviour: a malformed body is retried like any other failure, so the
    // surfaced code is TOKEN_FETCH_FAILED and TOKEN_PARSE_FAILED rides along as the cause.
    expect(err.code).toBe(CamundaAuthErrorCode.TOKEN_FETCH_FAILED);
    expect(err.cause).toBeInstanceOf(CamundaAuthError);
    expect(err.cause.code).toBe(CamundaAuthErrorCode.TOKEN_PARSE_FAILED);
    expect(fetch).toHaveBeenCalledTimes(2); // CAMUNDA_OAUTH_RETRY_MAX
  });

  it('reports a 200 that omits expires_in, with the parse failure as the cause', async () => {
    const fetch = tokenResponses([{ access_token: 'abc' }]);
    const auth = createAuthFacade(oauthConfig(), {
      fetch,
      clock: createTestClock({ start: START }),
    });

    const err = await auth.getAuthHeaders().then(
      () => {
        throw new Error('expected the token fetch to fail');
      },
      (e) => e
    );

    expect(err.code).toBe(CamundaAuthErrorCode.TOKEN_FETCH_FAILED);
    expect(err.cause.code).toBe(CamundaAuthErrorCode.TOKEN_PARSE_FAILED);
  });

  it('reports a 200 whose body is not JSON rather than succeeding', async () => {
    const fetch = tokenResponses([
      () => {
        throw new SyntaxError('Unexpected token < in JSON at position 0');
      },
    ]);
    const auth = createAuthFacade(oauthConfig(), {
      fetch,
      clock: createTestClock({ start: START }),
    });

    const err = await auth.getAuthHeaders().then(
      () => {
        throw new Error('expected the token fetch to fail');
      },
      (e) => e
    );

    expect(err).toBeInstanceOf(CamundaAuthError);
    expect(err.code).toBe(CamundaAuthErrorCode.TOKEN_FETCH_FAILED);
    expect(err.cause).toBeInstanceOf(SyntaxError);
  });

  it('recovers when a later attempt returns a well-formed body', async () => {
    const fetch = tokenResponses([{ expires_in: 300 }, { access_token: 'good', expires_in: 300 }]);
    const auth = createAuthFacade(oauthConfig(), {
      fetch,
      clock: createTestClock({ start: START }),
    });

    const headers = await auth.getAuthHeaders();
    expect(headers.Authorization).toBe('Bearer good');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe('token endpoint: expiry boundaries', () => {
  // Skew buffer is max(30s, 5% of lifetime); the refresh lead is a further 5s.
  it.each([
    // lifetime, skew applied, so the refresh point is lifetime - skew - 5s
    { expiresInSec: 120, skewMs: 30_000, label: 'short lifetime uses the 30s floor' },
    { expiresInSec: 1200, skewMs: 60_000, label: 'long lifetime uses 5% of the lifetime' },
  ])('$label', async ({ expiresInSec, skewMs }) => {
    const clock = settableClock(START);
    const fetch = tokenResponses([{ access_token: 't', expires_in: expiresInSec }]);
    const auth = createAuthFacade(oauthConfig(), { fetch, clock: clock.clock });

    await auth.getAuthHeaders();
    expect(fetch).toHaveBeenCalledTimes(1);

    const refreshAt = START + expiresInSec * 1000 - skewMs - 5_000;

    // One millisecond inside the refresh lead: still served from cache.
    clock.setNow(refreshAt - 1);
    await auth.getAuthHeaders();
    expect(fetch, 'refreshed before reaching the refresh lead').toHaveBeenCalledTimes(1);

    // On the boundary: refreshed.
    clock.setNow(refreshAt);
    await auth.getAuthHeaders();
    expect(fetch, 'did not refresh on the refresh lead boundary').toHaveBeenCalledTimes(2);
  });

  it('invalidates the cached token when the clock jumps backwards past 30s', async () => {
    const clock = settableClock(START);
    const fetch = tokenResponses([{ access_token: 't', expires_in: 3600 }]);
    const auth = createAuthFacade(oauthConfig(), { fetch, clock: clock.clock });

    await auth.getAuthHeaders();
    expect(fetch).toHaveBeenCalledTimes(1);

    // Within the 30s tolerance: the token stands.
    clock.setNow(START - 29_000);
    await auth.getAuthHeaders();
    expect(
      fetch,
      'a sub-threshold backwards step must not invalidate the token'
    ).toHaveBeenCalledTimes(1);

    // Past it: the token is treated as untrustworthy and refetched.
    clock.setNow(START - 31_000);
    await auth.getAuthHeaders();
    expect(
      fetch,
      'a backwards clock jump past 30s must invalidate the token'
    ).toHaveBeenCalledTimes(2);
  });
});

describe('token endpoint: on-disk token cache', () => {
  it('persists, reloads without a fetch, is mode 0600, and is removed by clearCache', async () => {
    const cacheDir = tempCacheDir();
    const config = oauthConfig({ CAMUNDA_OAUTH_CACHE_DIR: cacheDir });

    const firstFetch = tokenResponses([{ access_token: 'persisted', expires_in: 3600 }]);
    const first = createAuthFacade(config, {
      fetch: firstFetch,
      clock: createTestClock({ start: START }),
    });
    await first.getAuthHeaders();
    expect(firstFetch).toHaveBeenCalledTimes(1);

    const files = readdirSync(cacheDir);
    expect(files.length, 'the token was not written to the cache directory').toBe(1);
    const file = join(cacheDir, files[0]);

    // Owner-only: the file holds a bearer token.
    expect(statSync(file).mode & 0o777).toBe(0o600);
    // tmp-then-rename leaves no partial file behind.
    expect(files[0].endsWith('.tmp')).toBe(false);

    // A second facade over the same directory serves the token without calling the endpoint.
    const secondFetch = tokenResponses([{ access_token: 'should-not-be-used', expires_in: 3600 }]);
    const second = createAuthFacade(config, {
      fetch: secondFetch,
      clock: createTestClock({ start: START }),
    });
    const headers = await second.getAuthHeaders();
    expect(headers.Authorization).toBe('Bearer persisted');
    expect(secondFetch, 'the disk cache was not used').toHaveBeenCalledTimes(0);

    second.clearCache({ disk: true, memory: true });
    expect(existsSync(file), 'clearCache left the token file on disk').toBe(false);

    // With the cache gone, the next call goes back to the endpoint.
    await second.getAuthHeaders();
    expect(secondFetch).toHaveBeenCalledTimes(1);
  });

  it('does not reuse a cached token once it has passed its effective expiry', async () => {
    const cacheDir = tempCacheDir();
    const config = oauthConfig({ CAMUNDA_OAUTH_CACHE_DIR: cacheDir });

    const firstFetch = tokenResponses([{ access_token: 'stale', expires_in: 120 }]);
    await createAuthFacade(config, {
      fetch: firstFetch,
      clock: createTestClock({ start: START }),
    }).getAuthHeaders();

    const secondFetch = tokenResponses([{ access_token: 'fresh', expires_in: 120 }]);
    const second = createAuthFacade(config, {
      fetch: secondFetch,
      // Well past the 120s lifetime, so the persisted entry must not be served.
      clock: createTestClock({ start: START + 600_000 }),
    });

    expect((await second.getAuthHeaders()).Authorization).toBe('Bearer fresh');
    expect(secondFetch).toHaveBeenCalledTimes(1);
  });
});
