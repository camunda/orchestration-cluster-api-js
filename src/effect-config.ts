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

import { Config, Effect, Layer, Redacted, Schema } from 'effect';
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
 * The `Config` for a single `SCHEMA` key, including its declared legacy aliases.
 *
 * A `secret: true` key is read as `Config.redacted`, so its value is a `Redacted` for
 * as long as it lives in the config layer — it cannot be printed or serialised by
 * accident on the way to the client.
 */
function configForKey(key: EnvVarKey): Config.Config<unknown> {
  const entry = schemaEntry(key) as SchemaEntry;

  const atName = (name: string): Config.Config<unknown> => {
    if (isSecret(key)) return Config.redacted(name);
    switch (entry.type) {
      case 'boolean':
        return Config.boolean(name);
      case 'int':
        // Unsigned: negative values are a typed config error, not deferred to the client.
        return Config.schema(UnsignedInt, name);
      case 'signedInt':
        return Config.int(name);
      case 'enum':
        return Config.literals(entry.choices ?? [], name);
      default:
        return Config.string(name);
    }
  };

  // Canonical name first, each declared alias as a fallback — matching the precedence
  // the SDK's own hydration applies (e.g. CAMUNDA_REST_ADDRESS over ZEEBE_REST_ADDRESS,
  // and CAMUNDA_SUPPORT_LOG_ENABLED over its legacy CAMUNDA_SUPPORT_LOGGER).
  return allAliases(key).reduce<Config.Config<unknown>>(
    (cfg, alias) => Config.orElse(cfg, () => atName(alias)),
    atName(key)
  );
}

/** A key is only read as required when its `requiredWhen` controller matches. */
function isRequired(key: EnvVarKey, resolved: Record<string, unknown>): boolean {
  const cond = requiredWhen(key);
  if (!cond) return false;
  return resolved[cond.key] === cond.equals;
}

/** Unwrap the `Redacted` a secret key resolves to, at the single point of use. */
function plain(value: unknown): unknown {
  return Redacted.isRedacted(value) ? Redacted.value(value) : value;
}

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
export const camundaConfig = Effect.gen(function* () {
  const resolved: Record<string, unknown> = {};

  // Pass 1: unconditional keys. A `requiredWhen` controller (today only
  // CAMUNDA_AUTH_STRATEGY) is itself unconditional, so it is always resolved here
  // before pass 2 consults it.
  const conditional: EnvVarKey[] = [];
  for (const key of allKeys()) {
    if (requiredWhen(key)) {
      conditional.push(key);
      continue;
    }
    const dflt = defaultValue(key);
    if (dflt !== undefined) {
      resolved[key] = yield* Config.withDefault(configForKey(key), dflt);
    } else {
      const opt = yield* Config.option(configForKey(key));
      if (opt._tag === 'Some') resolved[key] = opt.value;
    }
  }

  // Pass 2: keys whose requiredness depends on a value resolved above.
  for (const key of conditional) {
    if (isRequired(key, resolved)) {
      resolved[key] = yield* configForKey(key);
    } else {
      const opt = yield* Config.option(configForKey(key));
      if (opt._tag === 'Some') resolved[key] = opt.value;
    }
  }

  return resolved as EnvOverrides;
});

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
    camundaConfig.pipe(
      Effect.map((config) => {
        const unwrapped: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(config)) unwrapped[k] = plain(v);
        return createCamundaEffectClient({
          ...options,
          config: unwrapped as EnvOverrides,
          // The ConfigProvider is the single source: do not fall back to process.env.
          env: {},
        }) satisfies CamundaEffectClient;
      })
    )
  );
}
