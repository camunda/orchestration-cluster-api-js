import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, onTestFailed } from 'vitest';
import {
  createCamundaClient,
  createSeededRandom,
  createTestClock,
  liveRandom,
  SEED_ENV_VAR,
  type SeededRandom,
  seededRandomFromEnv,
} from '../src';
import { eventualPoll } from '../src/runtime/eventual';

/** Seed 42's first draws, pinned by the cross-SDK contract (camunda/sdk-infra#50). */
const SEED_42 = [
  0.7415648787718233, 0.1599103928769201, 0.27860113025513866, 0.34419071652363753,
  0.03803016854024621,
];

/** A seeded source from `CAMUNDA_TEST_SEED` (or a fresh seed) that names itself on failure. */
function reportedSeed(): SeededRandom {
  const random = seededRandomFromEnv();
  onTestFailed(() => {
    process.stderr.write(`${random}\n`);
  });
  return random;
}

describe('createSeededRandom', () => {
  it('matches the published SplitMix64 reference', () => {
    // SplitMix64 with seed 0 emits 0xE220A8397B1DCDAF first (Vigna's reference implementation).
    expect(createSeededRandom(0).next()).toBe(Number(0xe220a8397b1dcdafn >> 11n) * 2 ** -53);
  });

  it('matches the cross-SDK conformance vector', () => {
    const random = createSeededRandom(42);
    expect(SEED_42.map(() => random.next())).toEqual(SEED_42);
  });

  it('accepts a bigint seed across the full unsigned 64-bit range', () => {
    expect(createSeededRandom(42n).next()).toBe(SEED_42[0]);
    expect(createSeededRandom((1n << 64n) - 1n).seed).toBe((1n << 64n) - 1n);
  });

  it.each([-1, -1n, 1n << 64n])('rejects %s as a seed', (seed) => {
    expect(() => createSeededRandom(seed)).toThrow(RangeError);
  });

  it('replays the same sequence from the same seed', () => {
    const random = reportedSeed();
    const replay = createSeededRandom(random.seed);
    for (let i = 0; i < 1_000; i++) expect(random.next()).toBe(replay.next());
  });

  it('draws stay in [0, 1)', () => {
    const random = reportedSeed();
    for (let i = 0; i < 100_000; i++) {
      const u = random.next();
      if (!(u >= 0 && u < 1)) throw new Error(`draw ${i} = ${u} is outside [0, 1) (${random})`);
    }
  });

  it('names the seed and how to replay it', () => {
    expect(String(createSeededRandom(12345))).toBe(
      'SeededRandom(seed=12345; replay with CAMUNDA_TEST_SEED=12345)'
    );
  });
});

describe('seededRandomFromEnv', () => {
  it('replays the seed from the environment', () => {
    const random = seededRandomFromEnv({ [SEED_ENV_VAR]: '42' });
    expect(random.seed).toBe(42n);
    expect(random.next()).toBe(SEED_42[0]);
  });

  it('draws a fresh seed only when the variable is unset', () => {
    expect(typeof seededRandomFromEnv({}).seed).toBe('bigint');
  });

  it.each(['', ' ', ' 42', '42\n', '-1', '0x2A', 'abc', '18446744073709551616'])(
    'rejects %j rather than silently picking another seed',
    (raw) => {
      expect(() => seededRandomFromEnv({ [SEED_ENV_VAR]: raw })).toThrow(SEED_ENV_VAR);
    }
  );
});

describe('injected random source', () => {
  const baseConfig = {
    CAMUNDA_REST_ADDRESS: 'https://example.com',
    CAMUNDA_AUTH_STRATEGY: 'NONE',
    CAMUNDA_SDK_LOG_LEVEL: 'silent',
  } as const;

  it('defaults to the live source', () => {
    expect(createCamundaClient({ config: { ...baseConfig } as any }).random).toBe(liveRandom);
  });

  it('exposes the injected source', () => {
    const random = createSeededRandom(1);
    expect(createCamundaClient({ config: { ...baseConfig } as any, random }).random).toBe(random);
  });

  /** Full jitter over the capped backoff: seed 42 draws 0.7415... of a 10s cap. */
  it('drives HTTP retry backoff', async () => {
    const clock = createTestClock();
    let calls = 0;
    const camunda = createCamundaClient({
      config: {
        ...baseConfig,
        CAMUNDA_SDK_HTTP_RETRY_BASE_DELAY_MS: 10_000,
        CAMUNDA_SDK_HTTP_RETRY_MAX_DELAY_MS: 60_000,
      } as any,
      clock,
      random: createSeededRandom(42),
      fetch: (async () =>
        ++calls === 1
          ? new Response('{}', { status: 429, headers: { 'content-type': 'application/json' } })
          : new Response('{}', {
              status: 200,
              headers: { 'content-type': 'application/json' },
            })) as any,
    });

    await camunda.getTopology();

    expect(calls).toBe(2);
    expect(clock.sleeps).toEqual([7_415]);
  });

  /** ±10% around the doubling backoff: seed 42 adds (0.7415... - 0.5) * 20% of 10s. */
  it('drives OAuth retry backoff', async () => {
    const clock = createTestClock();
    let tokenCalls = 0;
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'https://api.test',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL: 'https://example.test/oauth/token',
        CAMUNDA_TOKEN_AUDIENCE: 'aud',
        CAMUNDA_CLIENT_ID: 'cid',
        CAMUNDA_CLIENT_SECRET: 'sec',
        CAMUNDA_OAUTH_RETRY_MAX: 3,
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: 10_000,
        CAMUNDA_SDK_LOG_LEVEL: 'silent',
      } as any,
      clock,
      random: createSeededRandom(42),
      fetch: (async () =>
        ++tokenCalls === 1
          ? new Response('{"error":"temporary"}', { status: 500 })
          : new Response('{"access_token":"ok","expires_in":3600}', { status: 200 })) as any,
    });

    await camunda.getAuthHeaders();

    expect(tokenCalls).toBe(2);
    expect(clock.sleeps).toHaveLength(1);
    expect(clock.sleeps[0]).toBeCloseTo(10_483.13, 2);
  });

  /** 429 during eventual polling scales the backoff by [0.9, 1.1): seed 42 gives 1.0483... */
  it('drives eventual-consistency 429 backoff', async () => {
    const clock = createTestClock();
    let calls = 0;
    const invoke = () => {
      const p: any =
        ++calls === 1
          ? Promise.reject(Object.assign(new Error('rate limited'), { status: 429 }))
          : Promise.resolve({ items: [1] });
      p.cancel = () => {};
      return p;
    };

    await eventualPoll('searchJobs', false, invoke, {
      waitUpToMs: 30_000,
      pollIntervalMs: 500,
      predicate: (r: any) => r.items.length > 0,
      clock,
      random: createSeededRandom(42),
    });

    expect(calls).toBe(2);
    expect(clock.sleeps).toEqual([1_048]);
  });

  /**
   * The generated client hands eventualPoll its clock and random source. A call that passed
   * only the clock would silently draw its 429 jitter from the live source.
   */
  it('reaches every generated eventualPoll call alongside the clock', () => {
    const generated = readFileSync(
      path.join(__dirname, '..', 'src', 'gen', 'operations.gen.ts'),
      'utf8'
    );
    const calls = generated.split('\n').filter((line) => line.includes('eventualPoll('));

    expect(calls.length).toBeGreaterThan(0);
    expect(calls.filter((line) => !line.includes('clock: rt._clock'))).toEqual([]);
    expect(calls.filter((line) => !line.includes('random: rt._random'))).toEqual([]);
  });

  /** Equal jitter over the first 1s cap: round(500 + 0.7415... * 500). */
  it('drives worker activation-retry backoff', async () => {
    const clock = createTestClock({ autoAdvance: false });
    const camunda = createCamundaClient({
      config: { ...baseConfig, CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 } as any,
      env: {},
      clock,
      random: createSeededRandom(42),
      fetch: (async () => {
        throw new Error('connect ECONNREFUSED');
      }) as any,
    });

    const worker = camunda.createJobWorker({
      jobType: 'activation-backoff',
      jobHandler: async () => 'JOB_ACTION_RECEIPT' as const,
      maxParallelJobs: 1,
      jobTimeoutMs: 1_000,
      pollBackoffMinMs: 1_000,
      pollBackoffMaxMs: 30_000,
    });
    try {
      await expect.poll(() => clock.sleeps.length).toBe(1);
      await clock.advance(0);
      await expect.poll(() => clock.sleeps.length).toBe(2);

      expect(clock.sleeps).toEqual([0, 871]);
    } finally {
      worker.stop();
    }
  });

  describe('worker startup jitter', () => {
    let client: any = null;
    afterEach(() => {
      client?.stopAllWorkers();
      client = null;
    });

    const kinds = [
      {
        name: 'JobWorker',
        create: (c: any, jobType: string, startupJitterMaxSeconds: number) =>
          c.createJobWorker({
            jobType,
            jobHandler: async (job: any) => job.complete(),
            maxParallelJobs: 1,
            startupJitterMaxSeconds,
            autoStart: false,
          }),
      },
      {
        name: 'ThreadedJobWorker',
        create: (c: any, jobType: string, startupJitterMaxSeconds: number) =>
          c.createThreadedJobWorker({
            jobType,
            handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.js'),
            maxParallelJobs: 1,
            threadPoolSize: 1,
            startupJitterMaxSeconds,
            autoStart: false,
          }),
      },
    ];

    /**
     * Draws follow start() order, not transport readiness. The two workers have different
     * maxima, so the pair of delays identifies which draw each one received: start order
     * gives {74156, 1599}; the reverse would give {7415, 15991}.
     */
    it.each(kinds)('$name draws in start() order', async ({ create }) => {
      const clock = createTestClock({ autoAdvance: false });
      client = createCamundaClient({
        config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080', CAMUNDA_SDK_LOG_LEVEL: 'silent' },
        clock,
        random: createSeededRandom(42),
        fetch: (async () =>
          new Response('{"jobs":[]}', {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })) as any,
      });

      const short = create(client, 'short', 10);
      const long = create(client, 'long', 100);
      long.start();
      short.start();

      await expect.poll(() => clock.sleeps.length, { timeout: 10_000 }).toBeGreaterThanOrEqual(2);
      expect([...clock.sleeps].sort((a, b) => a - b)).toEqual([1_599, 74_156]);
    });
  });
});
