/*
 * PROTOTYPE — Effect `Config` sourcing for the Camunda client.
 *
 * The property under test throughout: the ambient `ConfigProvider` is the *only*
 * configuration source. Every case injects values with
 * `ConfigProvider.fromEnv({ env })` and never touches `process.env`.
 */
import { Config, ConfigProvider, Effect, Exit, Layer, Redacted } from 'effect';
import { describe, expect, it } from 'vitest';
import { CamundaEffect } from '../src/effect';
import { camundaConfig, layerFromConfig } from '../src/effect-config';
import { allKeys, defaultValue, isSecret } from '../src/runtime/configSchema';

/** Run `effect` with only these values visible as configuration. */
function withEnv<A, E>(env: Record<string, string>, effect: Effect.Effect<A, E>) {
  return effect.pipe(Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env }))));
}

describe('camundaConfig', () => {
  it('applies SCHEMA defaults for keys the provider does not supply', async () => {
    const config = await Effect.runPromise(withEnv({}, camundaConfig));

    expect(config.CAMUNDA_AUTH_STRATEGY).toBe('NONE');
    expect(config.CAMUNDA_REST_ADDRESS).toBe(defaultValue('CAMUNDA_REST_ADDRESS'));
    expect(config.CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS).toBe(3);
  });

  it('coerces by declared type, not as strings', async () => {
    const config = await Effect.runPromise(
      withEnv(
        {
          CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: '7',
          CAMUNDA_SUPPORT_LOG_ENABLED: 'true',
          CAMUNDA_WORKER_REQUEST_TIMEOUT: '-1',
        },
        camundaConfig
      )
    );

    expect(config.CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS).toBe(7);
    expect(config.CAMUNDA_SUPPORT_LOG_ENABLED).toBe(true);
    expect(config.CAMUNDA_WORKER_REQUEST_TIMEOUT).toBe(-1);
  });

  it('honours declared legacy aliases, canonical name winning', async () => {
    const aliasOnly = await Effect.runPromise(
      withEnv({ ZEEBE_REST_ADDRESS: 'http://alias:8080' }, camundaConfig)
    );
    expect(aliasOnly.CAMUNDA_REST_ADDRESS).toBe('http://alias:8080');

    const both = await Effect.runPromise(
      withEnv(
        {
          CAMUNDA_REST_ADDRESS: 'http://canonical:8080',
          ZEEBE_REST_ADDRESS: 'http://alias:8080',
        },
        camundaConfig
      )
    );
    expect(both.CAMUNDA_REST_ADDRESS).toBe('http://canonical:8080');
  });

  it('omits optional keys the provider does not supply', async () => {
    const config = await Effect.runPromise(withEnv({}, camundaConfig));

    // No SCHEMA default and not conditionally required → absent, not undefined-valued.
    expect('CAMUNDA_OAUTH_SCOPE' in config).toBe(false);
    expect('CAMUNDA_WORKER_NAME' in config).toBe(false);
  });

  it('rejects a value outside an enum key’s declared choices', async () => {
    const exit = await Effect.runPromiseExit(
      withEnv({ CAMUNDA_AUTH_STRATEGY: 'TELEPATHY' }, camundaConfig)
    );

    expect(Exit.isFailure(exit)).toBe(true);
  });

  describe('conditional requirements', () => {
    it('fails with a ConfigError when a requiredWhen key is missing', async () => {
      const exit = await Effect.runPromiseExit(
        withEnv({ CAMUNDA_AUTH_STRATEGY: 'BASIC' }, camundaConfig)
      );

      // A typed failure in the error channel — not a throw at client construction.
      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        const cause = JSON.stringify(exit.cause, null, 0);
        expect(cause).toMatch(/CAMUNDA_BASIC_AUTH_USERNAME/);
      }
    });

    it('leaves the same key optional when the controller does not match', async () => {
      const config = await Effect.runPromise(
        withEnv({ CAMUNDA_AUTH_STRATEGY: 'NONE' }, camundaConfig)
      );

      expect('CAMUNDA_BASIC_AUTH_USERNAME' in config).toBe(false);
    });

    it('resolves when the required values are supplied', async () => {
      const config = await Effect.runPromise(
        withEnv(
          {
            CAMUNDA_AUTH_STRATEGY: 'BASIC',
            CAMUNDA_BASIC_AUTH_USERNAME: 'demo',
            CAMUNDA_BASIC_AUTH_PASSWORD: 'hunter2',
          },
          camundaConfig
        )
      );

      expect(config.CAMUNDA_AUTH_STRATEGY).toBe('BASIC');
      expect(config.CAMUNDA_BASIC_AUTH_USERNAME).toBe('demo');
    });
  });

  describe('secrets', () => {
    it('resolves every SCHEMA secret as Redacted, not as a bare string', async () => {
      const secretKeys = allKeys().filter(isSecret);
      // Sanity: SCHEMA really does declare secrets, so this cannot pass vacuously.
      expect(secretKeys.length).toBeGreaterThan(0);

      const env: Record<string, string> = { CAMUNDA_AUTH_STRATEGY: 'BASIC' };
      for (const key of secretKeys) env[key] = `value-of-${key}`;
      // Basic auth requires its username too once the strategy is BASIC.
      env.CAMUNDA_BASIC_AUTH_USERNAME = 'demo';

      const config = (await Effect.runPromise(withEnv(env, camundaConfig))) as Record<
        string,
        unknown
      >;

      for (const key of secretKeys) {
        expect(Redacted.isRedacted(config[key])).toBe(true);
      }
    });

    it('keeps a secret out of the stringified config', async () => {
      const config = await Effect.runPromise(
        withEnv(
          {
            CAMUNDA_AUTH_STRATEGY: 'BASIC',
            CAMUNDA_BASIC_AUTH_USERNAME: 'demo',
            CAMUNDA_BASIC_AUTH_PASSWORD: 'hunter2',
          },
          camundaConfig
        )
      );

      // The whole point of Redacted: an accidental log/serialise cannot leak it.
      expect(JSON.stringify(config)).not.toContain('hunter2');
      expect(String(config.CAMUNDA_BASIC_AUTH_PASSWORD)).not.toContain('hunter2');

      // ...while the value is still recoverable at the point of use.
      expect(Redacted.value(config.CAMUNDA_BASIC_AUTH_PASSWORD as Redacted.Redacted<string>)).toBe(
        'hunter2'
      );
    });
  });

  it('is derived from SCHEMA — every key is resolvable without editing this module', async () => {
    const config = (await Effect.runPromise(withEnv({}, camundaConfig))) as Record<string, unknown>;

    // Every SCHEMA key carrying a default must appear; a key added to SCHEMA is
    // configurable through Config with no edit to effect-config.ts.
    const missing = allKeys().filter((k) => defaultValue(k) !== undefined && !(k in config));
    expect(missing).toEqual([]);
  });
});

describe('layerFromConfig', () => {
  it('builds a working client from injected configuration alone', async () => {
    const layer = layerFromConfig().pipe(
      Layer.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              CAMUNDA_REST_ADDRESS: 'http://injected:8080/v2',
              CAMUNDA_AUTH_STRATEGY: 'NONE',
            },
          })
        )
      )
    );

    const address = await Effect.runPromise(
      Effect.gen(function* () {
        const camunda = yield* CamundaEffect;
        return camunda.inner.config.restAddress;
      }).pipe(Effect.provide(layer))
    );

    expect(address).toBe('http://injected:8080/v2');
  });

  it('surfaces a missing required value as a typed ConfigError, not a construction throw', async () => {
    const layer = layerFromConfig().pipe(
      Layer.provide(
        ConfigProvider.layer(ConfigProvider.fromEnv({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH' } }))
      )
    );

    const exit = await Effect.runPromiseExit(
      Effect.gen(function* () {
        yield* CamundaEffect;
      }).pipe(Effect.provide(layer))
    );

    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit)) {
      const error = Exit.findErrorOption(exit);
      expect(error._tag).toBe('Some');
      if (error._tag === 'Some') {
        expect(error.value).toBeInstanceOf(Config.ConfigError);
      }
    }
  });
});
