/**
 * The randomness all SDK runtime jitter resolves through — HTTP retry backoff, OAuth retry
 * backoff, eventual-consistency 429 backoff, activation-retry backoff and worker startup
 * staggering.
 *
 * The randomness counterpart of `Clock`: pinning the clock makes cadence virtual,
 * injecting a {@link SeededRandom} as well makes it reproducible. See the cross-SDK contract
 * in camunda/sdk-infra#50.
 */
export interface RandomSource {
  /** A uniformly distributed value in `[0, 1)`. */
  next(): number;
}

/**
 * The live source: the platform generator. Production jitter stays random so a fleet of
 * workers does not retry or start in lockstep.
 *
 * This is the single place the SDK runtime is allowed to read ambient randomness.
 */
export const liveRandom: RandomSource = {
  // biome-ignore lint/plugin: this is the allowed module -- the one read of the platform generator
  next: () => Math.random(),
};

/** Environment variable {@link seededRandomFromEnv} reads to replay a seed. */
export const SEED_ENV_VAR = 'CAMUNDA_TEST_SEED';

/** A deterministic {@link RandomSource}; report {@link SeededRandom.seed} on failure. */
export interface SeededRandom extends RandomSource {
  readonly seed: bigint;
  /** Names the seed and how to replay it, for failure messages. */
  toString(): string;
}

const MASK_64 = (1n << 64n) - 1n;
const GAMMA = 0x9e3779b97f4a7c15n;
const UNIT = 2 ** -53;

/**
 * A deterministic source for tests: the same seed yields the same draws on every run, and in
 * every Camunda SDK.
 *
 * SplitMix64, taking the top 53 bits of each output. Specified by the cross-SDK contract rather
 * than borrowed from the platform, so a seed reproduces the same jitter in any SDK.
 */
export function createSeededRandom(seed: bigint | number): SeededRandom {
  const normalised = typeof seed === 'bigint' ? seed : BigInt(seed);
  if (normalised < 0n || normalised > MASK_64) {
    throw new RangeError(`Seed must be an unsigned 64-bit integer, got ${seed}`);
  }

  let state = normalised;
  const description = `SeededRandom(seed=${normalised}; replay with ${SEED_ENV_VAR}=${normalised})`;

  return {
    seed: normalised,
    next() {
      state = (state + GAMMA) & MASK_64;
      let z = state;
      z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK_64;
      z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK_64;
      z ^= z >> 31n;
      return Number(z >> 11n) * UNIT;
    },
    toString: () => description,
  };
}

/**
 * A {@link SeededRandom} seeded from `CAMUNDA_TEST_SEED` when it is set, otherwise from a
 * fresh random seed. Report its seed on failure, and set the variable to it to replay the run.
 *
 * Only an unset variable means "absent": any other value that is not an unsigned 64-bit
 * decimal integer throws rather than silently replacing the seed being replayed.
 */
export function seededRandomFromEnv(
  env: Record<string, string | undefined> = globalThis.process?.env ?? {}
): SeededRandom {
  const raw = env[SEED_ENV_VAR];
  if (raw === undefined) {
    return createSeededRandom(Math.floor(liveRandom.next() * 2 ** 53));
  }
  if (!/^[0-9]+$/.test(raw) || BigInt(raw) > MASK_64) {
    throw new RangeError(`${SEED_ENV_VAR}='${raw}' is not an unsigned 64-bit decimal integer.`);
  }
  return createSeededRandom(BigInt(raw));
}
