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

import { Config, ConfigProvider, Effect, Layer, Option, Redacted, Schema } from 'effect';
import { CamundaEffect, type CamundaEffectClient, createCamundaEffectClient } from './effect';
import type { CamundaOptions } from './gen/CamundaClient';
import {
  aliases,
  allKeys,
  defaultValue,
  type EnvOverrides,
  type EnvVarKey,
  isSecret,
  requiredWhen,
  schemaEntry,
} from './runtime/configSchema';

/** Options accepted alongside `Config`-sourced configuration. */
export type CamundaConfigLayerOptions = Omit<CamundaOptions, 'config' | 'env'>;

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

/** Unsigned integer — rejects negatives, matching `parseInteger`'s `/^[0-9]+$/` in hydration. */
const UnsignedInt = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0));

/**
 * The `Config` reading one concrete env var `name` as this `key`'s declared type.
 *
 * A `secret: true` key is read as `Config.redacted`, so its value is a `Redacted` for
 * as long as it lives in the config layer — it cannot be printed or serialised by
 * accident on the way to the client.
 */
function configForName(key: EnvVarKey, name: string): Config.Config<unknown> {
  if (isSecret(key)) return Config.redacted(name);
  switch ((schemaEntry(key) as SchemaEntry).type) {
    case 'boolean':
      return Config.boolean(name);
    case 'int':
      // Unsigned: negative values are a typed config error, not deferred to the client.
      return Config.schema(UnsignedInt, name);
    case 'signedInt':
      return Config.int(name);
    case 'enum':
      return Config.literals((schemaEntry(key) as SchemaEntry).choices ?? [], name);
    default:
      return Config.string(name);
  }
}

/**
 * Normalise a resolved value the way `hydrateConfig()` does for string/secret keys:
 * trim surrounding whitespace and treat an empty/whitespace-only value as *unset*
 * (returned as `Option.none`, so the caller falls back to an alias, a SCHEMA default,
 * or a `requiredWhen` failure). `ConfigProvider` already treats a literal empty string
 * as absent; this additionally covers whitespace-only values and trims real ones.
 * Non-string types pass through unchanged.
 */
function normalizeValue(key: EnvVarKey, value: unknown): Option.Option<unknown> {
  if (isSecret(key)) {
    const trimmed = Redacted.value(value as Redacted.Redacted<string>).trim();
    return trimmed === '' ? Option.none() : Option.some(Redacted.make(trimmed));
  }
  if ((schemaEntry(key) as SchemaEntry).type === 'string') {
    const trimmed = String(value).trim();
    return trimmed === '' ? Option.none() : Option.some(trimmed);
  }
  return Option.some(value);
}

/**
 * Read the first *present* value for `key`, consulting its canonical name then each legacy
 * alias in precedence order.
 *
 * Semantics match the SDK's own hydration (`runtime/unifiedConfiguration.ts`):
 *
 *   - an alias is consulted ONLY when the higher-precedence name is *absent* — a present
 *     but malformed value fails as a typed `Config.ConfigError` rather than being silently
 *     masked by a valid alias (`Config.option` absorbs absence but propagates parse/enum
 *     errors, unlike `Config.orElse`, which recovers from *any* error);
 *   - an empty/whitespace-only string or secret is treated as absent (see {@link normalizeValue}).
 *
 * Resolves to `Option.none` when neither the canonical name nor any alias supplies a value.
 */
const readKey = (key: EnvVarKey): Effect.Effect<Option.Option<unknown>, Config.ConfigError> =>
  Effect.gen(function* () {
    for (const name of [key, ...allAliases(key)]) {
      const opt = yield* Config.option(configForName(key, name));
      if (Option.isNone(opt)) continue;
      const normalized = normalizeValue(key, opt.value);
      if (Option.isSome(normalized)) return normalized;
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
 * either genuinely unset or present-but-empty/whitespace (which {@link normalizeValue}
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

  return { effective: effective as EnvOverrides, present };
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
export const camundaConfig = resolveConfig.pipe(Effect.map(({ effective }) => effective));

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
