// PROTOTYPE — Effect `Config` integration for the Camunda client.
//
// `layer(options?)` (see `effect.ts`) takes a plain options object and lets the SDK
// hydrate the rest from `process.env`. That works, but it puts configuration outside
// Effect: a missing required value throws at construction instead of surfacing in a
// typed error channel, secrets are plain strings, and a test that wants different
// configuration has to mutate `process.env`.
//
// This module sources the same configuration from Effect's `ConfigProvider` instead:
//
//   - missing/invalid values fail with Effect's config error, in the error channel;
//   - `secret: true` keys are read as `Redacted` and unwrapped exactly once, at the
//     point they are handed to the client;
//   - tests inject values with `ConfigProvider.fromEnv({ env: { ... } })` — no global
//     mutation, no cross-test leakage.
//
// Every entry is derived from `SCHEMA` (`runtime/configSchema.ts`) at runtime rather
// than restated here, so the Effect surface cannot drift from the canonical registry:
// add a key to `SCHEMA` and it is configurable through `Config` with no edit here.
//
// `effect` stays an OPTIONAL peer: this module is only reachable from the `./effect`
// subpath, and the `.` entry's runtime graph is asserted Effect-free by
// `tests/dist-usage.smoke.mjs`.

import { Config, ConfigProvider, Effect, Layer, Option, Redacted } from 'effect';
import { CamundaEffect, type CamundaEffectClient, createCamundaEffectClient } from './effect';
import type { CamundaOptions } from './gen/CamundaClient';
import {
  aliases,
  allKeys,
  defaultValue,
  type EnvOverrides,
  type EnvVarKey,
  type EnvVarValue,
  isSecret,
  requiredWhen,
  type SecretKey,
  schemaEntry,
} from './runtime/configSchema';

/** Options accepted alongside `Config`-sourced configuration. */
export type CamundaConfigLayerOptions = Omit<CamundaOptions, 'config' | 'env'>;

/**
 * The configuration {@link camundaConfig} resolves: every SCHEMA key mapped to its declared
 * value type, EXCEPT `secret: true` keys, which remain `Redacted<string>` (never a bare
 * string) so they cannot be logged or serialised by accident on the way to the client.
 */
export type CamundaConfig = Partial<{
  [K in EnvVarKey]: K extends SecretKey ? Redacted.Redacted<string> : EnvVarValue<K>;
}>;

// --- SCHEMA -> Config -----------------------------------------------------------

type SchemaEntry = {
  type: 'string' | 'boolean' | 'int' | 'signedInt' | 'enum';
  choices?: readonly string[];
  default?: unknown;
};

/**
 * Legacy env vars the SDK's own hydration (`runtime/unifiedConfiguration.ts`) promotes
 * onto a canonical key OUTSIDE the schema's `aliases` metadata. Without mirroring them
 * here the canonical key's default would mask the legacy value — setting only the legacy
 * name would be silently ignored, diverging from the Promise-side hydration.
 */
const EXTRA_ALIASES: Partial<Record<EnvVarKey, readonly string[]>> = {
  CAMUNDA_SUPPORT_LOG_ENABLED: ['CAMUNDA_SUPPORT_LOGGER'],
};

/** Every legacy fallback name for a key: schema-declared aliases plus {@link EXTRA_ALIASES}. */
function allAliases(key: EnvVarKey): readonly string[] {
  return [...aliases(key), ...(EXTRA_ALIASES[key] ?? [])];
}

/** Unsigned integers hydrateConfig accepts (`parseInteger`'s `/^[0-9]+$/`). */
const UNSIGNED_INT = /^[0-9]+$/;
/** Signed integers hydrateConfig accepts (`parseSignedInteger`'s `/^-?[0-9]+$/`). */
const SIGNED_INT = /^-?[0-9]+$/;
/** Boolean spellings hydrateConfig's `parseBoolean` accepts (case-insensitive, trimmed). */
const BOOLEAN_TRUE = new Set(['true', 'yes', '1', 'on']);
const BOOLEAN_FALSE = new Set(['false', 'no', '0', 'off']);

/** A typed `Config.ConfigError` for a present-but-malformed value, in the error channel. */
function invalidValue(message: string): Config.ConfigError {
  return new Config.ConfigError(new ConfigProvider.SourceError({ message }));
}

/**
 * Coerce an already-trimmed, non-empty raw string to `key`'s declared type, matching the
 * parsing `hydrateConfig()` performs (`runtime/unifiedConfiguration.ts`):
 *
 *   - booleans accept `true/yes/1/on` and `false/no/0/off`, case-insensitively;
 *   - `int` is unsigned (`/^[0-9]+$/`); `signedInt` may be negative (`/^-?[0-9]+$/`);
 *   - enums match case-insensitively and canonicalise to the SCHEMA-declared choice.
 *
 * A malformed value fails with a typed `Config.ConfigError` rather than being deferred to a
 * runtime throw inside the client. Secrets never reach here — they stay `Redacted`.
 */
function coerceValue(key: EnvVarKey, raw: string): Effect.Effect<unknown, Config.ConfigError> {
  const entry = schemaEntry(key) as SchemaEntry;
  switch (entry.type) {
    case 'boolean': {
      const v = raw.toLowerCase();
      if (BOOLEAN_TRUE.has(v)) return Effect.succeed(true);
      if (BOOLEAN_FALSE.has(v)) return Effect.succeed(false);
      return Effect.fail(
        invalidValue(
          `Invalid boolean value '${raw}' for ${key}. Expected one of true,false,yes,no,1,0,on,off.`
        )
      );
    }
    case 'int':
      return UNSIGNED_INT.test(raw)
        ? Effect.succeed(Number.parseInt(raw, 10))
        : Effect.fail(
            invalidValue(
              `Invalid integer '${raw}' for ${key}. Only unsigned base-10 integers allowed.`
            )
          );
    case 'signedInt':
      return SIGNED_INT.test(raw)
        ? Effect.succeed(Number.parseInt(raw, 10))
        : Effect.fail(
            invalidValue(
              `Invalid integer '${raw}' for ${key}. Only base-10 integers (optionally negative) allowed.`
            )
          );
    case 'enum': {
      const choices = entry.choices ?? [];
      const match = choices.find((c) => c.toLowerCase() === raw.toLowerCase());
      return match !== undefined
        ? Effect.succeed(match)
        : Effect.fail(
            invalidValue(
              `Invalid value '${raw}' for ${key} (expected one of ${choices.join('|')}).`
            )
          );
    }
    default:
      return Effect.succeed(raw);
  }
}

/**
 * Read the first *present* value for `key`, consulting its canonical name then each legacy
 * alias in precedence order.
 *
 * Every name is read as a raw string (a secret via `Config.redacted`, so its plain value is
 * never *returned* as a plain string — it is unwrapped only transiently to trim, then re-wrapped
 * in a `Redacted` before it leaves this function), then normalised the way `hydrateConfig()` does:
 * surrounding whitespace is trimmed and an empty/whitespace-only value is treated as *unset*
 * (skipped, so a lower-precedence alias or a SCHEMA default applies). Semantics match the
 * SDK's own hydration (`runtime/unifiedConfiguration.ts`):
 *
 *   - an alias is consulted ONLY when the higher-precedence name is *absent* — a present but
 *     malformed value fails as a typed `Config.ConfigError` (via {@link coerceValue}) rather
 *     than being silently masked by a valid alias;
 *   - booleans/enums parse case-insensitively and enums canonicalise, so `camundaConfig` is
 *     neither stricter nor looser than the Promise-side hydration.
 *
 * Resolves to `Option.none` when neither the canonical name nor any alias supplies a value.
 */
const readKey = (key: EnvVarKey): Effect.Effect<Option.Option<unknown>, Config.ConfigError> =>
  Effect.gen(function* () {
    const secret = isSecret(key);
    for (const name of [key, ...allAliases(key)]) {
      const raw: Config.Config<string | Redacted.Redacted<string>> = secret
        ? Config.redacted(name)
        : Config.string(name);
      const opt = yield* Config.option(raw);
      if (Option.isNone(opt)) continue;
      const trimmed = (
        secret ? Redacted.value(opt.value as Redacted.Redacted<string>) : String(opt.value)
      ).trim();
      // Empty/whitespace-only is treated as unset: fall through to an alias or a default.
      if (trimmed === '') continue;
      if (secret) return Option.some(Redacted.make(trimmed));
      return Option.some(yield* coerceValue(key, trimmed));
    }
    return Option.none();
  });

/** A key is only read as required when its `requiredWhen` controller matches. */
function isRequired(key: EnvVarKey, resolved: Record<string, unknown>): boolean {
  const cond = requiredWhen(key);
  if (!cond) return false;
  return resolved[cond.key] === cond.equals;
}

/**
 * The typed `Config.ConfigError` raised when a `requiredWhen` key has no usable value —
 * either genuinely unset or present-but-empty/whitespace (which {@link readKey}
 * treats as unset). Surfacing it in the error channel keeps a missing required value a
 * typed failure rather than a runtime throw later in the client.
 */
function missingRequired(key: EnvVarKey): Config.ConfigError {
  return new Config.ConfigError(
    new ConfigProvider.SourceError({ message: `Missing required value for ${key}` })
  );
}

/** Unwrap the `Redacted` a secret key resolves to, at the single point of use. */
function plain(value: unknown): unknown {
  return Redacted.isRedacted(value) ? Redacted.value(value) : value;
}

/**
 * Resolve the full Camunda configuration from the ambient `ConfigProvider`, tracking which
 * keys the provider actually *supplied* (as opposed to keys filled from a SCHEMA default).
 *
 * `effective` is the complete map used to evaluate `requiredWhen` controllers and handed
 * to callers; `present` is the subset of keys a value was actually read for. {@link
 * layerFromConfig} forwards only `present` keys as explicit client overrides so the SDK's
 * intent-sensitive inference is not misled by defaulted values (see there).
 *
 * Fails with `Config.ConfigError` when a required value is missing or malformed. Secrets
 * remain `Redacted` in `effective`.
 */
const resolveConfig = Effect.gen(function* () {
  const effective: Record<string, unknown> = {};
  const present = new Set<EnvVarKey>();

  // Pass 1: unconditional keys. A `requiredWhen` controller (today only
  // CAMUNDA_AUTH_STRATEGY) is itself unconditional, so it is always resolved here
  // before pass 2 consults it.
  const conditional: EnvVarKey[] = [];
  for (const key of allKeys()) {
    if (requiredWhen(key)) {
      conditional.push(key);
      continue;
    }
    const opt = yield* readKey(key);
    if (Option.isSome(opt)) {
      effective[key] = opt.value;
      present.add(key);
    } else {
      const dflt = defaultValue(key);
      if (dflt !== undefined) effective[key] = dflt;
    }
  }

  // Pass 2: keys whose requiredness depends on a value resolved above.
  for (const key of conditional) {
    const opt = yield* readKey(key);
    if (Option.isSome(opt)) {
      effective[key] = opt.value;
      present.add(key);
    } else if (isRequired(key, effective)) {
      // Absent (or present-but-empty) yet required: surface a typed `Config.ConfigError`
      // naming the key, rather than letting an empty value through to a runtime throw.
      return yield* Effect.fail(missingRequired(key));
    }
  }

  return { effective: effective as CamundaConfig, present };
});

/**
 * Resolve the full Camunda configuration from the ambient `ConfigProvider`.
 *
 * Fails with `Config.ConfigError` when a required value is missing or malformed.
 *
 * Secrets remain `Redacted` in the result; {@link layerFromConfig} unwraps them when
 * constructing the client. Keys with a `SCHEMA` default always resolve; keys without
 * one are omitted when unset, unless a `requiredWhen` controller makes them required —
 * in which case a missing value is a typed config failure, not a runtime throw.
 */
export const camundaConfig: Effect.Effect<CamundaConfig, Config.ConfigError> = resolveConfig.pipe(
  Effect.map(({ effective }) => effective)
);

// --- Layer ----------------------------------------------------------------------

/**
 * A `Layer` providing {@link CamundaEffect}, configured entirely from the ambient
 * `ConfigProvider` rather than from `process.env`.
 *
 * The client is constructed with `env: {}` so the provider is the *only* configuration
 * source — an unset value fails as a config error instead of being silently picked up
 * from the ambient environment.
 *
 * @example
 * ```ts
 * // Production: read from the environment (the default provider).
 * const program = main.pipe(Effect.provide(layerFromConfig()))
 *
 * // Tests: inject values, no process.env mutation.
 * const testLayer = layerFromConfig().pipe(
 *   Layer.provide(ConfigProvider.layer(ConfigProvider.fromEnv({
 *     env: { CAMUNDA_AUTH_STRATEGY: 'BASIC', CAMUNDA_BASIC_AUTH_USERNAME: 'demo',
 *            CAMUNDA_BASIC_AUTH_PASSWORD: 'demo' },
 *   })))
 * )
 * ```
 */
export function layerFromConfig(
  options?: CamundaConfigLayerOptions
): Layer.Layer<CamundaEffect, Config.ConfigError> {
  return Layer.effect(CamundaEffect)(
    resolveConfig.pipe(
      Effect.map(({ effective, present }) => {
        // Forward ONLY keys the provider actually supplied as explicit overrides. A key left
        // at its SCHEMA default is intentionally omitted so the SDK fills it itself: the
        // Promise client treats `opts.config` as *user intent* (it decides `userSetStrategy`
        // and whether to auto-infer OAUTH / telemetry from it), so passing resolved defaults
        // as overrides would misreport them as user-provided and change behaviour versus
        // env-hydration. Both sides derive defaults from the same SCHEMA, so the effective
        // configuration is identical — only the intent signal is preserved.
        const overrides: Record<string, unknown> = {};
        for (const key of present) overrides[key] = plain(effective[key]);
        return createCamundaEffectClient({
          ...options,
          config: overrides as EnvOverrides,
          // The ConfigProvider is the single source: do not fall back to process.env.
          env: {},
        }) satisfies CamundaEffectClient;
      })
    )
  );
}
