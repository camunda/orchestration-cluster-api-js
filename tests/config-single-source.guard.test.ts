// Guard tests for issue #145: SCHEMA (configSchema.ts) must remain the single
// source of truth for configuration defaults. These lock in the behaviour that
// the hydration pipeline surfaces schema defaults without re-declaring literals,
// and prevent reintroduction of inline `|| 'literal'` fallbacks / `rawMap.X!`
// non-null assertions in the hydration code.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { allKeys, defaultValue } from '../src/runtime/configSchema';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

describe('configuration single source of truth (#145)', () => {
  // Behaviour guard (green/green): every key that declares a schema default must
  // surface that exact default through hydration when nothing is provided.
  it('surfaces every schema default through hydration (class-scoped)', () => {
    const { config } = hydrateConfig({ env: {} });
    const defaulted = allKeys().filter((k) => defaultValue(k) !== undefined);
    // Sanity: there is a meaningful number of defaulted keys to guard.
    expect(defaulted.length).toBeGreaterThan(15);
    for (const k of defaulted) {
      expect(config.__raw[k], `__raw[${k}] should equal schema default`).toBe(
        String(defaultValue(k))
      );
    }
  });

  // Backpressure single-source guard (green/green): the BALANCED profile (and the
  // observe-only LEGACY profile) must be exactly the schema defaults, so the
  // presets can be derived from SCHEMA rather than restated as literals.
  it('BALANCED backpressure profile equals schema defaults (effective config)', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'BALANCED' } });
    const bp = config.backpressure;
    expect(bp.initialMax).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX')));
    expect(bp.softFactor).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_SOFT_FACTOR')) / 100);
    expect(bp.severeFactor).toBe(
      Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_SEVERE_FACTOR')) / 100
    );
    expect(bp.recoveryIntervalMs).toBe(
      Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_RECOVERY_INTERVAL_MS'))
    );
    expect(bp.recoveryStep).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_RECOVERY_STEP')));
    expect(bp.decayQuietMs).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_DECAY_QUIET_MS')));
    expect(bp.floor).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_FLOOR')));
    expect(bp.severeThreshold).toBe(
      Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_SEVERE_THRESHOLD'))
    );
    expect(bp.maxWaiters).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_MAX_WAITERS')));
    expect(bp.healthyRecoveryMultiplier).toBe(
      Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_HEALTHY_RECOVERY_MULTIPLIER')) / 100
    );
    expect(bp.unlimitedAfterHealthyMs).toBe(
      Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_UNLIMITED_AFTER_HEALTHY_MS'))
    );
  });

  it('LEGACY backpressure profile knobs equal schema defaults (effective config)', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_SDK_BACKPRESSURE_PROFILE: 'LEGACY' } });
    const bp = config.backpressure;
    expect(bp.observeOnly).toBe(true);
    expect(bp.initialMax).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX')));
    expect(bp.maxWaiters).toBe(Number(defaultValue('CAMUNDA_SDK_BACKPRESSURE_MAX_WAITERS')));
  });

  // Anti-pattern lint guard (red until the refactor lands): the hydration source
  // must not re-declare schema defaults as inline `|| 'literal'` fallbacks, nor
  // assert non-null on rawMap reads (`rawMap.X!`). Both hide divergence from SCHEMA.
  it('hydration source contains no inline default fallbacks or rawMap non-null assertions', () => {
    const src = readFileSync(
      fileURLToPath(new URL('../src/runtime/unifiedConfiguration.ts', import.meta.url)),
      'utf8'
    );

    // `rawMap.CAMUNDA_X!` — non-null assertion on a rawMap read. The negative
    // lookahead `(?!=)` excludes comparison operators (`!=` / `!==`) so a future
    // `rawMap.KEY !== ...` is not a false positive.
    const nonNull = src.match(/rawMap\.[A-Z_]+!(?!=)/g) ?? [];
    // `rawMap.CAMUNDA_X || 'literal'` or `|| 3` — inline literal default fallback.
    // `|| undefined` is allowed (genuinely optional field, not a duplicated default).
    const inlineDefault = src.match(/rawMap\.[A-Z_]+(?:\?\.\w+\(\))?\s*\|\|\s*['"\d]/g) ?? [];
    // `reqInt(...) || 70` etc. — an accessor result with an inline literal fallback,
    // which both duplicates the SCHEMA default and masks a NaN from a failed parse.
    const accessorDefault = src.match(/req(?:Int|Str|Bool)\([^)]*\)\s*\|\|\s*['"\d]/g) ?? [];

    expect(nonNull, `Found rawMap non-null assertions: ${nonNull.join(', ')}`).toEqual([]);
    expect(
      inlineDefault,
      `Found inline default fallbacks duplicating SCHEMA: ${inlineDefault.join(', ')}`
    ).toEqual([]);
    expect(
      accessorDefault,
      `Found accessor default fallbacks duplicating SCHEMA: ${accessorDefault.join(', ')}`
    ).toEqual([]);
  });

  // Completeness guard: every key declared in SCHEMA must be explicitly handled in
  // the hydrator. This catches the "added a key to SCHEMA but forgot to wire it into
  // CamundaConfig" mistake — the structural mapping is still hand-written, so a new
  // key is otherwise silently absent from the effective config. Keys that are
  // intentionally consumed only via generic `allKeys()` iteration (never named) may
  // be added to ALLOW_UNREFERENCED with a justification.
  it('every SCHEMA key is referenced by name in the hydration source', () => {
    const ALLOW_UNREFERENCED = new Set<string>();
    const src = readFileSync(
      fileURLToPath(new URL('../src/runtime/unifiedConfiguration.ts', import.meta.url)),
      'utf8'
    );
    const missing = allKeys().filter((k) => !ALLOW_UNREFERENCED.has(k) && !src.includes(k));
    expect(
      missing,
      `SCHEMA keys never referenced in unifiedConfiguration.ts (wire them into CamundaConfig, or allow-list with a reason): ${missing.join(', ')}`
    ).toEqual([]);
  });
});
