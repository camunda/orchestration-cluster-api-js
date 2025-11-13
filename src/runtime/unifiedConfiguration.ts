// Unified configuration hydration rebuilt on top of configSchema + typed-env.
// Single source of truth: configSchema.ts (SCHEMA)
// Responsibilities kept: precedence, conditional requirements, validation grammar,
// strict parsing (booleans, ints), secrets redaction, aggregated errors.

// Static import for path placed before other module imports to satisfy lint ordering
import path from 'node:path';

import { createEnv } from 'typed-env';

import {
  SCHEMA,
  EnvVarKey,
  EnvOverrides,
  allKeys,
  schemaEntry,
  isSecret,
  requiredWhen as requiredWhenMeta,
} from './configSchema';

export type AuthStrategy = 'NONE' | 'OAUTH' | 'BASIC';
export type ValidationMode = 'none' | 'warn' | 'strict' | 'fanatical';

export interface Warning {
  key?: string;
  code: WarningCode;
  message: string;
  details?: any; // future-proof details for machine processing
}

export enum WarningCode {
  DEPRECATED = 'DEPRECATED',
}

export interface ConfigErrorDetail {
  key?: string;
  code: ConfigErrorCode;
  message: string;
  details?: any;
}

export enum ConfigErrorCode {
  CONFIG_MISSING_REQUIRED = 'CONFIG_MISSING_REQUIRED',
  CONFIG_INVALID_ENUM = 'CONFIG_INVALID_ENUM',
  CONFIG_INVALID_BOOLEAN = 'CONFIG_INVALID_BOOLEAN',
  CONFIG_INVALID_INTEGER = 'CONFIG_INVALID_INTEGER',
  CONFIG_INVALID_VALIDATION_SYNTAX = 'CONFIG_INVALID_VALIDATION_SYNTAX',
}

export class CamundaConfigurationError extends Error {
  public readonly errors: ConfigErrorDetail[];
  constructor(errors: ConfigErrorDetail[]) {
    const msg = errors.map((e) => `${e.code}${e.key ? `(${e.key})` : ''}: ${e.message}`).join('\n');
    super(msg);
    this.name = 'CamundaConfigurationError';
    this.errors = errors;
  }
}

// (Legacy SPEC removed; use SCHEMA in configSchema.ts)

// Public type helpers for constructing flat env-style override objects
// (Legacy flat config types removed; use EnvOverrides and EnvVarKey instead.)

// Resulting strongly typed config
export interface CamundaConfig {
  restAddress: string;
  tokenAudience: string;
  defaultTenantId: string; // branded at usage sites as TenantId
  httpRetry: { maxAttempts: number; baseDelayMs: number; maxDelayMs: number }; // generic HTTP operation retry policy
  backpressure: {
    enabled: boolean;
    profile: string; // BALANCED | CONSERVATIVE | AGGRESSIVE | LEGACY
    observeOnly: boolean; // LEGACY profile semantics (collect signals, no gating)
    initialMax: number;
    softFactor: number;
    severeFactor: number;
    recoveryIntervalMs: number;
    recoveryStep: number;
    decayQuietMs: number;
    floor: number;
    severeThreshold: number;
  };
  oauth: {
    clientId?: string;
    clientSecret?: string;
    oauthUrl: string;
    grantType: string;
    scope?: string;
    timeoutMs: number;
    retry: { max: number; baseDelayMs: number };
    cacheDir?: string;
  };
  auth: {
    strategy: AuthStrategy;
    basic?: { username?: string; password?: string };
  };
  validation: {
    req: ValidationMode;
    res: ValidationMode;
    raw: string; // normalized raw spec for reproducibility
  };
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  eventual?: { pollDefaultMs: number };
  // authVerbose removed (pre-release cleanup)
  mtls?: {
    cert?: string;
    key?: string;
    ca?: string;
    keyPassphrase?: string;
    certPath?: string;
    keyPath?: string;
    caPath?: string;
  };
  telemetry?: { log: boolean; correlation: boolean };
  supportLog?: { enabled: boolean; filePath: string };
  // Raw access (canonical uppercase enums applied) keyed by env var (internal/debug)
  __raw: Record<string, string | undefined>;
}

export interface HydratedConfiguration {
  config: CamundaConfig;
  warnings: Warning[];
  provided: Record<string, string>; // User provided (including explicit defaults, excluding empty strings)
  effective: Record<string, string>; // All keys with effective values (defaults filled)
  redacted: Record<string, string>; // Redacted effective
  toProvidedObject(): Record<string, string>;
  toEffectiveObject(): Record<string, string>;
  toRedactedObject(): Record<string, string>;
  toDisplayString(): string;
}

export interface HydrateOptions {
  env?: Record<string, string | undefined>;
  overrides?: EnvOverrides; // strongly typed overrides
}

// Utility: deep freeze
function deepFreeze<T>(o: T): T {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const k of Object.keys(o)) {
      // @ts-ignore
      deepFreeze(o[k]);
    }
  }
  return o;
}

// Secrets redaction (keep length, mask all but last 4; <=4 => all masked)
function redactSecret(v: string): string {
  const len = v.length;
  if (len <= 4) return '*'.repeat(len);
  const tail = v.slice(-4);
  return '*'.repeat(len - 4) + tail;
}

// Boolean parser
function parseBoolean(raw: string, key: string, errors: ConfigErrorDetail[]): boolean | undefined {
  const v = raw.trim().toLowerCase();
  if (v === '') return undefined;
  if (['true', 'yes', '1', 'on'].includes(v)) return true;
  if (['false', 'no', '0', 'off'].includes(v)) return false;
  errors.push({
    code: ConfigErrorCode.CONFIG_INVALID_BOOLEAN,
    key,
    message: `Invalid boolean value '${raw}'. Expected one of true,false,yes,no,1,0,on,off.`,
  });
  return undefined;
}

// Integer parser
function parseInteger(raw: string, key: string, errors: ConfigErrorDetail[]): number | undefined {
  const v = raw.trim();
  if (v === '') return undefined;
  if (/^[0-9]+$/.test(v)) return parseInt(v, 10);
  errors.push({
    code: ConfigErrorCode.CONFIG_INVALID_INTEGER,
    key,
    message: `Invalid integer '${raw}'. Only unsigned base-10 integers allowed.`,
  });
  return undefined;
}

// Validation mini-language parser (strict per design)
function parseValidation(
  raw: string,
  errors: ConfigErrorDetail[]
): { req: ValidationMode; res: ValidationMode; raw: string } {
  const val = raw.trim();
  if (val === '') return { req: 'none', res: 'none', raw: 'req:none,res:none' };
  const lower = val.toLowerCase();
  if (['none', 'warn', 'strict', 'fanatical'].includes(lower)) {
    return {
      req: lower as ValidationMode,
      res: lower as ValidationMode,
      raw: `req:${lower},res:${lower}`,
    };
  }
  const parts = val
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const seen: Record<string, boolean> = {};
  let req: ValidationMode = 'none';
  let res: ValidationMode = 'none';
  for (const part of parts) {
    const [lhs, rhs] = part.split(':').map((s) => s?.trim().toLowerCase());
    if (!lhs || !rhs) {
      errors.push({
        code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX,
        key: 'CAMUNDA_SDK_VALIDATION',
        message: `Malformed segment '${part}'`,
      });
      continue;
    }
    if (lhs !== 'req' && lhs !== 'res') {
      errors.push({
        code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX,
        key: 'CAMUNDA_SDK_VALIDATION',
        message: `Unknown scope '${lhs}'`,
      });
      continue;
    }
    if (!['none', 'warn', 'strict', 'fanatical'].includes(rhs)) {
      errors.push({
        code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX,
        key: 'CAMUNDA_SDK_VALIDATION',
        message: `Unknown mode '${rhs}'`,
      });
      continue;
    }
    if (seen[lhs]) {
      errors.push({
        code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX,
        key: 'CAMUNDA_SDK_VALIDATION',
        message: `Duplicate scope '${lhs}'`,
      });
      continue;
    }
    seen[lhs] = true;
    if (lhs === 'req') req = rhs as ValidationMode;
    else res = rhs as ValidationMode;
  }
  return { req, res, raw: `req:${req},res:${res}` };
}

export function hydrateConfig(options: HydrateOptions = {}): HydratedConfiguration {
  const baseEnv =
    options.env ||
    (typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>) : {});
  const overrides = options.overrides || {};
  const errors: ConfigErrorDetail[] = [];
  const warnings: Warning[] = [];
  const provided: Record<string, string> = {};
  const effective: Record<string, string> = {};
  const rawMap: Record<string, string | undefined> = {};
  // Track provided (user intent): env or override present (non-empty string for env)
  for (const k of allKeys()) {
    if ((overrides as any)[k] !== undefined) {
      provided[k] = String((overrides as any)[k]).trim();
    } else if (baseEnv[k] !== undefined && baseEnv[k]!.trim() !== '') {
      provided[k] = baseEnv[k]!.trim();
    }
  }
  // Flag: did the user explicitly set an auth strategy (via env or overrides)?
  const userSetStrategy =
    provided['CAMUNDA_AUTH_STRATEGY'] !== undefined &&
    provided['CAMUNDA_AUTH_STRATEGY'].trim() !== '';

  // Build typed-env schema with parser functions that accumulate errors instead of throwing early
  const parseErrors: ConfigErrorDetail[] = [];
  function boolParserFactory(key: string) {
    return (v: string) => {
      const parsed = parseBoolean(v, key, parseErrors);
      if (parsed === undefined) return undefined;
      return parsed;
    };
  }
  function intParserFactory(key: string) {
    return (v: string) => {
      const parsed = parseInteger(v, key, parseErrors);
      if (parsed === undefined) return undefined;
      return parsed;
    };
  }
  function enumParserFactory(key: string, choices: readonly string[]) {
    // Case-insensitive parsing. Canonicalize to schema-declared casing style.
    // If all choices are lowercase => return lowercase value.
    // If all choices are uppercase => return uppercase value.
    // Mixed casing (currently unused) => return the exact schema choice matched.
    const lowered = choices.map((c) => c.toLowerCase());
    const allLower = choices.every((c) => c === c.toLowerCase());
    const allUpper = choices.every((c) => c === c.toUpperCase());
    return (v: string) => {
      const raw = v.trim();
      const candidateLower = raw.toLowerCase();
      const idx = lowered.indexOf(candidateLower);
      if (idx === -1) {
        parseErrors.push({
          code: ConfigErrorCode.CONFIG_INVALID_ENUM,
          key,
          message: `Invalid value '${v}' (expected one of ${choices.join('|')}).`,
        });
        return undefined;
      }
      if (allLower) return lowered[idx];
      if (allUpper) return choices[idx];
      return choices[idx];
    };
  }

  const typedEnvSchema: Record<string, any> = {};
  for (const k of allKeys()) {
    const entry = schemaEntry(k);
    const baseOpt = { optional: true };
    if (entry.type === 'string') {
      typedEnvSchema[k] =
        entry.default !== undefined
          ? { type: 'string', default: entry.default, ...baseOpt }
          : { type: 'string', ...baseOpt };
    } else if (entry.type === 'boolean') {
      const base: any = { parser: boolParserFactory(k), ...baseOpt };
      if (entry.default !== undefined) base.default = !!entry.default;
      typedEnvSchema[k] = base;
    } else if (entry.type === 'int') {
      const base: any = { parser: intParserFactory(k), ...baseOpt };
      if (entry.default !== undefined) base.default = entry.default;
      typedEnvSchema[k] = base;
    } else if (entry.type === 'enum') {
      const base: any = { parser: enumParserFactory(k, entry.choices || []), ...baseOpt };
      if (entry.default !== undefined) base.default = entry.default;
      typedEnvSchema[k] = base;
    }
  }

  // Compose input env (process.env + overrides stringified) (defaults handled by typed-env schema)
  const envInput: Record<string, string> = {};
  for (const k of allKeys()) {
    if ((overrides as any)[k] !== undefined) envInput[k] = String((overrides as any)[k]);
    else if (baseEnv[k] !== undefined) envInput[k] = baseEnv[k]!;
  }
  // Alias handling: promote CAMUNDA_SUPPORT_LOGGER to CAMUNDA_SUPPORT_LOG_ENABLED if set
  if (
    envInput['CAMUNDA_SUPPORT_LOG_ENABLED'] === undefined &&
    envInput['CAMUNDA_SUPPORT_LOGGER'] !== undefined
  ) {
    envInput['CAMUNDA_SUPPORT_LOG_ENABLED'] = envInput['CAMUNDA_SUPPORT_LOGGER'];
  }

  // Alias: accept ZEEBE_REST_ADDRESS as CAMUNDA_REST_ADDRESS (if primary unset)
  if (
    envInput['CAMUNDA_REST_ADDRESS'] === undefined &&
    baseEnv['ZEEBE_REST_ADDRESS'] !== undefined &&
    baseEnv['ZEEBE_REST_ADDRESS']!.trim() !== ''
  ) {
    envInput['CAMUNDA_REST_ADDRESS'] = baseEnv['ZEEBE_REST_ADDRESS']!.trim();
  }

  // Implicit auth strategy inference: if OAUTH URL provided and no explicit strategy, default to OAUTH
  if (
    (envInput['CAMUNDA_AUTH_STRATEGY'] === undefined ||
      envInput['CAMUNDA_AUTH_STRATEGY'].trim() === '') &&
    envInput['CAMUNDA_OAUTH_URL'] !== undefined &&
    envInput['CAMUNDA_OAUTH_URL'].trim() !== '' &&
    envInput['CAMUNDA_CLIENT_ID'] !== undefined &&
    envInput['CAMUNDA_CLIENT_ID'].trim() !== '' &&
    envInput['CAMUNDA_CLIENT_SECRET'] !== undefined &&
    envInput['CAMUNDA_CLIENT_SECRET'].trim() !== ''
  ) {
    envInput['CAMUNDA_AUTH_STRATEGY'] = 'OAUTH';
  }

  // Run typed-env (will not throw for our parser-based validation; parseErrors collects issues)
  let envTyped: Record<string, any> = {};
  envTyped = createEnv(typedEnvSchema, { env: envInput });

  // Build rawMap from typed values (string representation); fill in defaults for unset keys if defined
  for (const k of allKeys()) {
    const entry = schemaEntry(k);
    const rawProvided = envInput[k];
    const val = envTyped[k];
    if (val !== undefined && val !== null) {
      rawMap[k] = typeof val === 'string' ? val : String(val);
    } else if (rawProvided !== undefined) {
      // A provided value failed to parse; parseErrors already collected.
      // Leave rawMap unset so conditional logic can still detect missing requiredWhen.
    } else if (entry.default !== undefined) {
      rawMap[k] = String(entry.default);
    }
  }

  // Post-default inference safeguard: if auth strategy still NONE (default applied) but OAuth URL provided
  // and user did not explicitly set a strategy, infer OAUTH. This covers cases where earlier inference
  // might be overridden by schema default application.
  if (
    !userSetStrategy &&
    rawMap['CAMUNDA_AUTH_STRATEGY'] === 'NONE' &&
    rawMap['CAMUNDA_OAUTH_URL'] &&
    rawMap['CAMUNDA_OAUTH_URL']!.trim() !== '' &&
    rawMap['CAMUNDA_CLIENT_ID'] &&
    rawMap['CAMUNDA_CLIENT_ID']!.trim() !== '' &&
    rawMap['CAMUNDA_CLIENT_SECRET'] &&
    rawMap['CAMUNDA_CLIENT_SECRET']!.trim() !== ''
  ) {
    rawMap['CAMUNDA_AUTH_STRATEGY'] = 'OAUTH';
  }

  // Parse primitives (int, boolean, enum normalization) replicating original semantics
  const authStrategyRaw = (rawMap['CAMUNDA_AUTH_STRATEGY'] || 'NONE').toString();
  const authStrategy = authStrategyRaw.trim().toUpperCase();
  if (!['NONE', 'OAUTH', 'BASIC'].includes(authStrategy)) {
    errors.push({
      code: ConfigErrorCode.CONFIG_INVALID_ENUM,
      key: 'CAMUNDA_AUTH_STRATEGY',
      message: `Invalid auth strategy '${authStrategyRaw}'. Expected NONE|OAUTH|BASIC.`,
    });
  }

  // Collect conditional missing keys by strategy for merged error messages
  const missingByCondition: Record<string, string[]> = {};

  // Conditional requirement evaluation
  for (const k of allKeys()) {
    const req = requiredWhenMeta(k as EnvVarKey);
    if (req) {
      const condValue = rawMap[req.key]?.trim().toUpperCase();
      if (condValue === req.equals) {
        const origin = (baseEnv[k] ?? overrides[k] ?? '').toString().trim();
        if (origin === '') {
          const list = missingByCondition[req.equals] || (missingByCondition[req.equals] = []);
          list.push(k);
        }
      }
    }
  }

  // Merge parseErrors into main errors (after conditional pass to accumulate all)
  for (const pe of parseErrors) errors.push(pe);
  // Filter: eliminate any error without a key (we only care about keyed invalid values)
  for (let i = errors.length - 1; i >= 0; i--) {
    if (!errors[i].key) errors.splice(i, 1);
  }
  // Remove any spurious errors recorded without key (guard future logic)
  // Also, do not treat missing optional keys as errors: current parseErrors only include invalid provided values.

  // Aggregate missing condition keys into single error per condition (strategy)
  for (const cond of Object.keys(missingByCondition)) {
    const keys = Array.from(new Set(missingByCondition[cond])).sort();
    errors.push({
      code: ConfigErrorCode.CONFIG_MISSING_REQUIRED,
      message: `Missing required configuration for ${cond}: ${keys.join(', ')}`,
      details: { strategy: cond, keys },
    });
  }

  // mTLS completeness validation: if any cert/key indicator present require both sides
  const mtlsCertProvided = !!(rawMap['CAMUNDA_MTLS_CERT'] || rawMap['CAMUNDA_MTLS_CERT_PATH']);
  const mtlsKeyProvided = !!(rawMap['CAMUNDA_MTLS_KEY'] || rawMap['CAMUNDA_MTLS_KEY_PATH']);
  const mtlsAny =
    mtlsCertProvided ||
    mtlsKeyProvided ||
    rawMap['CAMUNDA_MTLS_CA'] ||
    rawMap['CAMUNDA_MTLS_CA_PATH'] ||
    rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE'];
  if (mtlsAny && (!mtlsCertProvided || !mtlsKeyProvided)) {
    errors.push({
      code: ConfigErrorCode.CONFIG_MISSING_REQUIRED,
      message:
        'Incomplete mTLS configuration; both certificate (CAMUNDA_MTLS_CERT|_PATH) and key (CAMUNDA_MTLS_KEY|_PATH) must be provided.',
    });
  }

  // Parse validation config after potential errors so we gather full set
  const validationRaw = rawMap['CAMUNDA_SDK_VALIDATION'] || 'req:none,res:none';
  const validation = parseValidation(validationRaw, errors);

  // If any errors, throw aggregated (sorted by key then code for determinism)
  if (errors.length) {
    errors.sort((a, b) => (a.key || '').localeCompare(b.key || '') || a.code.localeCompare(b.code));
    throw new CamundaConfigurationError(errors);
  }

  // Build effective map (string values) & redacted
  for (const k of allKeys()) {
    const val = rawMap[k];
    if (val !== undefined) effective[k] = val;
  }
  // Redacted copy
  const redacted: Record<string, string> = {};
  for (const [k, v] of Object.entries(effective)) {
    if (isSecret(k as EnvVarKey) && v) redacted[k] = redactSecret(v);
    else redacted[k] = v;
  }

  // Normalize restAddress to ensure it ends with /v2 (idempotent)
  let _restAddress = rawMap['CAMUNDA_REST_ADDRESS']!;
  if (_restAddress) {
    // Trim whitespace and trailing slashes first
    _restAddress = _restAddress.trim();
    // If it already ends with /v2 or /v2/, leave as-is; else append
    if (!/\/v2\/?$/i.test(_restAddress)) {
      _restAddress = _restAddress.replace(/\/+$/, '') + '/v2';
    } else {
      // Canonicalize to no trailing slash (optional design choice); keep existing behavior by not altering
    }
  }
  // Apply backpressure profile defaults if individual vars not explicitly provided.
  const profile = (rawMap['CAMUNDA_SDK_BACKPRESSURE_PROFILE'] || 'BALANCED')
    .toString()
    .toUpperCase();
  interface BpPreset {
    initialMax: number;
    soft: number;
    severe: number;
    recoveryInterval: number;
    recoveryStep: number;
    quietMs: number;
    floor: number;
    severeThreshold: number;
  }
  const PRESETS: Record<string, BpPreset> = {
    BALANCED: {
      initialMax: 16,
      soft: 70,
      severe: 50,
      recoveryInterval: 1000,
      recoveryStep: 1,
      quietMs: 2000,
      floor: 1,
      severeThreshold: 3,
    },
    CONSERVATIVE: {
      initialMax: 12,
      soft: 60,
      severe: 40,
      recoveryInterval: 1200,
      recoveryStep: 1,
      quietMs: 2500,
      floor: 1,
      severeThreshold: 2,
    },
    AGGRESSIVE: {
      initialMax: 24,
      soft: 80,
      severe: 60,
      recoveryInterval: 800,
      recoveryStep: 2,
      quietMs: 1500,
      floor: 2,
      severeThreshold: 4,
    },
    LEGACY: {
      // observe-only: we still need plausible defaults if user overrides individual knobs
      initialMax: 16,
      soft: 70,
      severe: 50,
      recoveryInterval: 1000,
      recoveryStep: 1,
      quietMs: 2000,
      floor: 1,
      severeThreshold: 3,
    },
  };
  const preset = PRESETS[profile] || PRESETS.BALANCED;
  // Only override when user did NOT explicitly provide a value (env or override). We rely on the
  // 'provided' map built earlier; default schema values should not block profile application.
  function ensure(k: string, val: number) {
    if (!provided[k]) rawMap[k] = String(val);
  }
  // Only fill when the specific env var is absent (explicit override wins over profile).
  ensure('CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX', preset.initialMax);
  ensure('CAMUNDA_SDK_BACKPRESSURE_SOFT_FACTOR', preset.soft);
  ensure('CAMUNDA_SDK_BACKPRESSURE_SEVERE_FACTOR', preset.severe);
  ensure('CAMUNDA_SDK_BACKPRESSURE_RECOVERY_INTERVAL_MS', preset.recoveryInterval);
  ensure('CAMUNDA_SDK_BACKPRESSURE_RECOVERY_STEP', preset.recoveryStep);
  ensure('CAMUNDA_SDK_BACKPRESSURE_DECAY_QUIET_MS', preset.quietMs);
  ensure('CAMUNDA_SDK_BACKPRESSURE_FLOOR', preset.floor);
  ensure('CAMUNDA_SDK_BACKPRESSURE_SEVERE_THRESHOLD', preset.severeThreshold);
  const config: CamundaConfig = {
    restAddress: _restAddress,
    tokenAudience: rawMap['CAMUNDA_TOKEN_AUDIENCE']!,
    defaultTenantId: rawMap['CAMUNDA_DEFAULT_TENANT_ID'] || '<default>',
    httpRetry: {
      maxAttempts: parseInt(rawMap['CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS'] || '3', 10),
      baseDelayMs: parseInt(rawMap['CAMUNDA_SDK_HTTP_RETRY_BASE_DELAY_MS'] || '100', 10),
      maxDelayMs: parseInt(rawMap['CAMUNDA_SDK_HTTP_RETRY_MAX_DELAY_MS'] || '2000', 10),
    },
    backpressure: {
      enabled: profile !== 'LEGACY',
      profile,
      observeOnly: profile === 'LEGACY',
      initialMax: parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX'] || '16', 10),
      softFactor: Math.min(
        1,
        Math.max(
          0.01,
          (parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_SOFT_FACTOR'] || '70', 10) || 70) / 100
        )
      ),
      severeFactor: Math.min(
        1,
        Math.max(
          0.01,
          (parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_SEVERE_FACTOR'] || '50', 10) || 50) / 100
        )
      ),
      recoveryIntervalMs: parseInt(
        rawMap['CAMUNDA_SDK_BACKPRESSURE_RECOVERY_INTERVAL_MS'] || '1000',
        10
      ),
      recoveryStep: parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_RECOVERY_STEP'] || '1', 10),
      decayQuietMs: parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_DECAY_QUIET_MS'] || '2000', 10),
      floor: parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_FLOOR'] || '1', 10),
      severeThreshold: parseInt(rawMap['CAMUNDA_SDK_BACKPRESSURE_SEVERE_THRESHOLD'] || '3', 10),
    },
    oauth: {
      clientId: rawMap['CAMUNDA_CLIENT_ID']?.trim() || undefined,
      clientSecret: rawMap['CAMUNDA_CLIENT_SECRET']?.trim() || undefined,
      oauthUrl: rawMap['CAMUNDA_OAUTH_URL']!,
      grantType: rawMap['CAMUNDA_OAUTH_GRANT_TYPE']!,
      scope: rawMap['CAMUNDA_OAUTH_SCOPE']?.trim() || undefined,
      timeoutMs: parseInt(rawMap['CAMUNDA_OAUTH_TIMEOUT_MS']!, 10),
      retry: {
        max: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_MAX']!, 10),
        baseDelayMs: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS']!, 10),
      },
      cacheDir: rawMap['CAMUNDA_OAUTH_CACHE_DIR']?.trim() || undefined,
    },
    auth: {
      strategy: authStrategy as AuthStrategy,
      basic:
        authStrategy === 'BASIC'
          ? {
              username: rawMap['CAMUNDA_BASIC_AUTH_USERNAME']?.trim(),
              password: rawMap['CAMUNDA_BASIC_AUTH_PASSWORD']?.trim(),
            }
          : undefined,
    },
    validation: { req: validation.req, res: validation.res, raw: validation.raw },
    logLevel: (rawMap['CAMUNDA_SDK_LOG_LEVEL'] as CamundaConfig['logLevel']) || 'error',
    eventual: {
      pollDefaultMs: parseInt(rawMap['CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS'] || '500', 10),
    },
    mtls:
      rawMap['CAMUNDA_MTLS_CERT_PATH'] ||
      rawMap['CAMUNDA_MTLS_KEY_PATH'] ||
      rawMap['CAMUNDA_MTLS_CA_PATH'] ||
      rawMap['CAMUNDA_MTLS_CERT'] ||
      rawMap['CAMUNDA_MTLS_KEY'] ||
      rawMap['CAMUNDA_MTLS_CA'] ||
      rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE']
        ? {
            cert: rawMap['CAMUNDA_MTLS_CERT'] || undefined,
            key: rawMap['CAMUNDA_MTLS_KEY'] || undefined,
            ca: rawMap['CAMUNDA_MTLS_CA'] || undefined,
            keyPassphrase: rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE'] || undefined,
            certPath: rawMap['CAMUNDA_MTLS_CERT_PATH'] || undefined,
            keyPath: rawMap['CAMUNDA_MTLS_KEY_PATH'] || undefined,
            caPath: rawMap['CAMUNDA_MTLS_CA_PATH'] || undefined,
          }
        : undefined,
    telemetry: {
      log: (rawMap['CAMUNDA_SDK_TELEMETRY_LOG'] || 'false').toString().toLowerCase() === 'true',
      correlation:
        (rawMap['CAMUNDA_SDK_TELEMETRY_CORRELATION'] || 'false').toString().toLowerCase() ===
        'true',
    },
    supportLog: {
      enabled:
        (rawMap['CAMUNDA_SUPPORT_LOG_ENABLED'] || 'false').toString().toLowerCase() === 'true',
      filePath:
        rawMap['CAMUNDA_SUPPORT_LOG_FILE_PATH'] ||
        (typeof process !== 'undefined' && typeof process.cwd === 'function'
          ? path.join(process.cwd(), 'camunda-support.log')
          : 'camunda-support.log'),
    },
    __raw: { ...rawMap },
  };

  deepFreeze(config);

  const api: HydratedConfiguration = {
    config,
    warnings,
    provided: Object.keys(provided)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = provided[k];
        return acc;
      }, {}),
    effective: Object.keys(effective)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = effective[k];
        return acc;
      }, {}),
    redacted: Object.keys(redacted)
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = redacted[k];
        return acc;
      }, {}),
    toProvidedObject() {
      return { ...this.provided };
    },
    toEffectiveObject() {
      return { ...this.effective };
    },
    toRedactedObject() {
      return { ...this.redacted };
    },
    toDisplayString() {
      return Object.entries(this.redacted)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
    },
  };
  // Record last hydrated configuration for runtime consumers (e.g., validation gating) that
  // call convenience helpers without explicit DI. This preserves test semantics where
  // hydrateConfig({ env: { ... } }) is invoked directly without also calling a higher-level
  // apply function. (Greenfield simplification: single source of truth here.)
  try {
    (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG = api;
  } catch {
    /* ignore (SSR edge) */
  }
  return api;
}

// Async variant scaffolding (supports fetch + timeout + window global). Implementation minimal until browser integration.
export interface HydrateAsyncOptions extends HydrateOptions {
  fetch?: () => Promise<Record<string, string | undefined>>;
  timeoutMs?: number;
}
export async function hydrateConfigAsync(
  options: HydrateAsyncOptions = {}
): Promise<HydratedConfiguration> {
  const { fetch, timeoutMs } = options;
  let fetched: Record<string, string | undefined> = {};
  if (fetch) {
    fetched = await (timeoutMs ? withTimeout(fetch(), timeoutMs) : fetch());
  } else if (typeof window !== 'undefined' && (window as any).CAMUNDA_CONFIG) {
    fetched = (window as any).CAMUNDA_CONFIG;
  }
  return hydrateConfig({
    env: { ...(options.env || {}), ...fetched },
    overrides: options.overrides,
  });
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let to: any; // eslint-disable-line
  return await Promise.race([
    p.then((v) => {
      clearTimeout(to);
      return v;
    }),
    new Promise<T>((_, rej) => {
      to = setTimeout(
        () =>
          rej(
            new CamundaConfigurationError([
              {
                code: ConfigErrorCode.CONFIG_INVALID_ENUM,
                message: `Configuration fetch timed out after ${ms}ms`,
              },
            ])
          ),
        ms
      );
    }),
  ]);
}

// Export spec for TypeDoc extraction tooling
// Export projection of schema entries for docs generation
export function configurationSpec() {
  return SCHEMA;
}

/**
 * Non-mutating accessor for the most recently hydrated configuration.
 * Returns the same HydratedConfiguration object that the last call to
 * hydrateConfig / hydrateConfigAsync produced, or undefined if hydration
 * has not occurred yet in this process. This function NEVER performs
 * hydration itself (no environment reads / parsing side-effects).
 */
export function getConfig(): HydratedConfiguration | undefined {
  try {
    return (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG as HydratedConfiguration | undefined;
  } catch {
    return undefined;
  }
}
