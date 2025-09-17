// Unified configuration hydration rebuilt on top of configSchema + typed-env.
// Single source of truth: configSchema.ts (SCHEMA)
// Responsibilities kept: precedence, conditional requirements, validation grammar,
// strict parsing (booleans, ints), secrets redaction, aggregated errors.

import { createEnv } from 'typed-env';
import { SCHEMA, EnvVarKey, EnvOverrides, allKeys, schemaEntry, isSecret, requiredWhen as requiredWhenMeta } from './configSchema';

export type AuthStrategy = 'NONE' | 'OAUTH' | 'BASIC';
export type ValidationMode = 'none' | 'warn' | 'strict' | 'fanatical';

export interface Warning {
  key?: string;
  code: WarningCode;
  message: string;
  details?: any; // future-proof details for machine processing
}

export enum WarningCode {
  DEPRECATED = 'DEPRECATED'
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
  CONFIG_INVALID_VALIDATION_SYNTAX = 'CONFIG_INVALID_VALIDATION_SYNTAX'
}

export class CamundaConfigurationError extends Error {
  public readonly errors: ConfigErrorDetail[];
  constructor(errors: ConfigErrorDetail[]) {
    const msg = errors.map(e => `${e.code}${e.key ? `(${e.key})` : ''}: ${e.message}`).join('\n');
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
  cert?: string; key?: string; ca?: string; keyPassphrase?: string;
  certPath?: string; keyPath?: string; caPath?: string;
  };
  telemetry?: { log: boolean; correlation: boolean };
  // Raw access (canonical uppercase enums applied) keyed by env var (internal/debug)
  __raw: Record<string,string|undefined>;
}

export interface HydratedConfiguration {
  config: CamundaConfig;
  warnings: Warning[];
  provided: Record<string,string>;      // User provided (including explicit defaults, excluding empty strings)
  effective: Record<string,string>;     // All keys with effective values (defaults filled)
  redacted: Record<string,string>;      // Redacted effective
  toProvidedObject(): Record<string,string>;
  toEffectiveObject(): Record<string,string>;
  toRedactedObject(): Record<string,string>;
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
    for (const k of Object.keys(o as any)) {
      // @ts-ignore
      deepFreeze((o as any)[k]);
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
  if (['true','yes','1','on'].includes(v)) return true;
  if (['false','no','0','off'].includes(v)) return false;
  errors.push({ code: ConfigErrorCode.CONFIG_INVALID_BOOLEAN, key, message: `Invalid boolean value '${raw}'. Expected one of true,false,yes,no,1,0,on,off.` });
  return undefined;
}

// Integer parser
function parseInteger(raw: string, key: string, errors: ConfigErrorDetail[]): number | undefined {
  const v = raw.trim();
  if (v === '') return undefined;
  if (/^[0-9]+$/.test(v)) return parseInt(v, 10);
  errors.push({ code: ConfigErrorCode.CONFIG_INVALID_INTEGER, key, message: `Invalid integer '${raw}'. Only unsigned base-10 integers allowed.` });
  return undefined;
}

// Validation mini-language parser (strict per design)
function parseValidation(raw: string, errors: ConfigErrorDetail[]): { req: ValidationMode; res: ValidationMode; raw: string } {
  const original = raw;
  const val = raw.trim();
  if (val === '') return { req: 'none', res: 'none', raw: 'req:none,res:none' };
  const lower = val.toLowerCase();
  if (['none','warn','strict','fanatical'].includes(lower)) {
    return { req: lower as ValidationMode, res: lower as ValidationMode, raw: `req:${lower},res:${lower}` };
  }
  const parts = val.split(',').map(p => p.trim()).filter(Boolean);
  const seen: Record<string,boolean> = {};
  let req: ValidationMode = 'none';
  let res: ValidationMode = 'none';
  for (const part of parts) {
    const [lhs, rhs] = part.split(':').map(s => s?.trim().toLowerCase());
    if (!lhs || !rhs) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Malformed segment '${part}'` });
      continue;
    }
    if (lhs !== 'req' && lhs !== 'res') {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Unknown scope '${lhs}'` });
      continue;
    }
  if (!['none','warn','strict','fanatical'].includes(rhs)) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Unknown mode '${rhs}'` });
      continue;
    }
    if (seen[lhs]) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Duplicate scope '${lhs}'` });
      continue;
    }
    seen[lhs] = true;
    if (lhs === 'req') req = rhs as ValidationMode; else res = rhs as ValidationMode;
  }
  return { req, res, raw: `req:${req},res:${res}` };
}

export function hydrateConfig(options: HydrateOptions = {}): HydratedConfiguration {
  const baseEnv = options.env || (typeof process !== 'undefined' ? (process.env as Record<string,string|undefined>) : {});
  const overrides = options.overrides || {};
  const errors: ConfigErrorDetail[] = [];
  const warnings: Warning[] = [];
  const provided: Record<string,string> = {};
  const effective: Record<string,string> = {};
  const rawMap: Record<string,string|undefined> = {};
  // Track provided (user intent): env or override present (non-empty string for env)
  for (const k of allKeys()) {
    if ((overrides as any)[k] !== undefined) {
      provided[k] = String((overrides as any)[k]).trim();
    } else if (baseEnv[k] !== undefined && baseEnv[k]!.trim() !== '') {
      provided[k] = baseEnv[k]!.trim();
    }
  }

  // Build typed-env schema with parser functions that accumulate errors instead of throwing early
  const parseErrors: ConfigErrorDetail[] = [];
  function boolParserFactory(key: string) {
    return (v: string) => {
      const parsed = parseBoolean(v, key, parseErrors);
      if (parsed === undefined) return undefined as any;
      return parsed;
    };
  }
  function intParserFactory(key: string) {
    return (v: string) => {
      const parsed = parseInteger(v, key, parseErrors);
      if (parsed === undefined) return undefined as any;
      return parsed;
    };
  }
  function enumParserFactory(key: string, choices: readonly string[]) {
    return (v: string) => {
      const norm = v.trim().toUpperCase();
      if (!choices.includes(norm)) {
        parseErrors.push({ code: ConfigErrorCode.CONFIG_INVALID_ENUM, key, message: `Invalid value '${v}' (expected one of ${choices.join('|')}).` });
        return undefined as any;
      }
      return norm;
    };
  }

  const typedEnvSchema: Record<string, any> = {};
  for (const k of allKeys()) {
    const entry = schemaEntry(k);
    const baseOpt = { optional: true };
    if (entry.type === 'string') {
      typedEnvSchema[k] = entry.default !== undefined ? { type: 'string', default: entry.default, ...baseOpt } : { type: 'string', ...baseOpt };
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
  const envInput: Record<string,string> = {};
  for (const k of allKeys()) {
    if ((overrides as any)[k] !== undefined) envInput[k] = String((overrides as any)[k]);
    else if (baseEnv[k] !== undefined) envInput[k] = baseEnv[k]!;
  }

  // Run typed-env (will not throw for our parser-based validation; parseErrors collects issues)
  let envTyped: Record<string, any> = {};
  envTyped = createEnv(typedEnvSchema as any, { env: envInput });

  // Build rawMap from typed values (string representation); fill in defaults for unset keys if defined
  for (const k of allKeys()) {
    const entry = schemaEntry(k);
    const rawProvided = envInput[k];
    const val = (envTyped as any)[k];
    if (val !== undefined && val !== null) {
      rawMap[k] = typeof val === 'string' ? val : String(val);
    } else if (rawProvided !== undefined) {
      // A provided value failed to parse; parseErrors already collected.
      // Leave rawMap unset so conditional logic can still detect missing requiredWhen.
    } else if (entry.default !== undefined) {
      rawMap[k] = String(entry.default);
    }
  }

  // Parse primitives (int, boolean, enum normalization) replicating original semantics
  const authStrategyRaw = (rawMap['CAMUNDA_AUTH_STRATEGY'] || 'NONE').toString();
  const authStrategy = authStrategyRaw.trim().toUpperCase();
  if (!['NONE','OAUTH','BASIC'].includes(authStrategy)) {
    errors.push({ code: ConfigErrorCode.CONFIG_INVALID_ENUM, key: 'CAMUNDA_AUTH_STRATEGY', message: `Invalid auth strategy '${authStrategyRaw}'. Expected NONE|OAUTH|BASIC.` });
  }

  // Collect conditional missing keys by strategy for merged error messages
  const missingByCondition: Record<string,string[]> = {};

  // Conditional requirement evaluation
  for (const k of allKeys()) {
    const req = requiredWhenMeta(k as EnvVarKey);
    if (req) {
      const condValue = rawMap[req.key]?.trim().toUpperCase();
      if (condValue === req.equals) {
        const origin = (baseEnv[k] ?? (overrides as any)[k] ?? '').toString().trim();
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
  for (let i = errors.length -1; i >=0; i--) {
    if (!errors[i].key) errors.splice(i,1);
  }
  // Remove any spurious errors recorded without key (guard future logic)
  // Also, do not treat missing optional keys as errors: current parseErrors only include invalid provided values.

  // Aggregate missing condition keys into single error per condition (strategy)
  for (const cond of Object.keys(missingByCondition)) {
    const keys = Array.from(new Set(missingByCondition[cond])).sort();
    errors.push({ code: ConfigErrorCode.CONFIG_MISSING_REQUIRED, message: `Missing required configuration for ${cond}: ${keys.join(', ')}`, details: { strategy: cond, keys } });
  }

  // mTLS completeness validation: if any cert/key indicator present require both sides
  const mtlsCertProvided = !!(rawMap['CAMUNDA_MTLS_CERT'] || rawMap['CAMUNDA_MTLS_CERT_PATH']);
  const mtlsKeyProvided = !!(rawMap['CAMUNDA_MTLS_KEY'] || rawMap['CAMUNDA_MTLS_KEY_PATH']);
  const mtlsAny = mtlsCertProvided || mtlsKeyProvided || rawMap['CAMUNDA_MTLS_CA'] || rawMap['CAMUNDA_MTLS_CA_PATH'] || rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE'];
  if (mtlsAny && (!mtlsCertProvided || !mtlsKeyProvided)) {
    errors.push({ code: ConfigErrorCode.CONFIG_MISSING_REQUIRED, message: 'Incomplete mTLS configuration; both certificate (CAMUNDA_MTLS_CERT|_PATH) and key (CAMUNDA_MTLS_KEY|_PATH) must be provided.' });
  }

  // Parse validation config after potential errors so we gather full set
  const validationRaw = rawMap['CAMUNDA_SDK_VALIDATION'] || 'req:none,res:none';
  const validation = parseValidation(validationRaw, errors);

  // If any errors, throw aggregated (sorted by key then code for determinism)
  if (errors.length) {
    errors.sort((a,b) => (a.key || '').localeCompare(b.key || '') || a.code.localeCompare(b.code));
    throw new CamundaConfigurationError(errors);
  }

  // Build effective map (string values) & redacted
  for (const k of allKeys()) {
    const val = rawMap[k];
    if (val !== undefined) effective[k] = val;
  }
  // Redacted copy
  const redacted: Record<string,string> = {};
  for (const [k,v] of Object.entries(effective)) {
    if (isSecret(k as EnvVarKey) && v) redacted[k] = redactSecret(v); else redacted[k] = v;
  }

  const config: CamundaConfig = {
    restAddress: rawMap['CAMUNDA_REST_ADDRESS']!,
    tokenAudience: rawMap['CAMUNDA_TOKEN_AUDIENCE']!,
    oauth: {
      clientId: rawMap['CAMUNDA_CLIENT_ID']?.trim() || undefined,
      clientSecret: rawMap['CAMUNDA_CLIENT_SECRET']?.trim() || undefined,
      oauthUrl: rawMap['CAMUNDA_OAUTH_URL']!,
      grantType: rawMap['CAMUNDA_OAUTH_GRANT_TYPE']!,
      scope: rawMap['CAMUNDA_OAUTH_SCOPE']?.trim() || undefined,
      timeoutMs: parseInt(rawMap['CAMUNDA_OAUTH_TIMEOUT_MS']!, 10),
      retry: { max: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_MAX']!, 10), baseDelayMs: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS']!, 10) },
      cacheDir: rawMap['CAMUNDA_OAUTH_CACHE_DIR']?.trim() || undefined
    },
    auth: {
      strategy: authStrategy as AuthStrategy,
      basic: (authStrategy === 'BASIC') ? {
        username: rawMap['CAMUNDA_BASIC_AUTH_USERNAME']?.trim(),
        password: rawMap['CAMUNDA_BASIC_AUTH_PASSWORD']?.trim()
      } : undefined
    },
  validation: { req: validation.req, res: validation.res, raw: validation.raw },
    logLevel: (rawMap['CAMUNDA_SDK_LOG_LEVEL'] as any) as CamundaConfig['logLevel'] || 'error',
    eventual: { pollDefaultMs: parseInt(rawMap['CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS'] || '500', 10) },
    mtls: (rawMap['CAMUNDA_MTLS_CERT_PATH'] || rawMap['CAMUNDA_MTLS_KEY_PATH'] || rawMap['CAMUNDA_MTLS_CA_PATH'] || rawMap['CAMUNDA_MTLS_CERT'] || rawMap['CAMUNDA_MTLS_KEY'] || rawMap['CAMUNDA_MTLS_CA'] || rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE']) ? {
      cert: rawMap['CAMUNDA_MTLS_CERT'] || undefined,
      key: rawMap['CAMUNDA_MTLS_KEY'] || undefined,
      ca: rawMap['CAMUNDA_MTLS_CA'] || undefined,
      keyPassphrase: rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE'] || undefined,
      certPath: rawMap['CAMUNDA_MTLS_CERT_PATH'] || undefined,
      keyPath: rawMap['CAMUNDA_MTLS_KEY_PATH'] || undefined,
      caPath: rawMap['CAMUNDA_MTLS_CA_PATH'] || undefined
    } : undefined,
  telemetry: { log: (rawMap['CAMUNDA_SDK_TELEMETRY_LOG']||'false').toString().toLowerCase() === 'true', correlation: (rawMap['CAMUNDA_SDK_TELEMETRY_CORRELATION']||'false').toString().toLowerCase() === 'true' },
    __raw: { ...rawMap }
  };

  deepFreeze(config);

  const api: HydratedConfiguration = {
    config,
    warnings,
    provided: Object.keys(provided).sort().reduce<Record<string,string>>((acc,k) => { acc[k]=provided[k]; return acc; }, {}),
    effective: Object.keys(effective).sort().reduce<Record<string,string>>((acc,k)=>{acc[k]=effective[k];return acc;},{}),
    redacted: Object.keys(redacted).sort().reduce<Record<string,string>>((acc,k)=>{acc[k]=redacted[k];return acc;},{}),
    toProvidedObject() { return { ...this.provided }; },
    toEffectiveObject() { return { ...this.effective }; },
    toRedactedObject() { return { ...this.redacted }; },
    toDisplayString() { return Object.entries(this.redacted).map(([k,v]) => `${k}=${v}`).join('\n'); }
  };
  // Record last hydrated configuration for runtime consumers (e.g., validation gating) that
  // call convenience helpers without explicit DI. This preserves test semantics where
  // hydrateConfig({ env: { ... } }) is invoked directly without also calling a higher-level
  // apply function. (Greenfield simplification: single source of truth here.)
  try {
    (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG = api;
  } catch { /* ignore (SSR edge) */ }
  return api;
}

// Async variant scaffolding (supports fetch + timeout + window global). Implementation minimal until browser integration.
export interface HydrateAsyncOptions extends HydrateOptions { fetch?: () => Promise<Record<string,string|undefined>>; timeoutMs?: number; }
export async function hydrateConfigAsync(options: HydrateAsyncOptions = {}): Promise<HydratedConfiguration> {
  const { fetch, timeoutMs } = options;
  let fetched: Record<string,string|undefined> = {};
  if (fetch) {
    fetched = await (timeoutMs ? withTimeout(fetch(), timeoutMs) : fetch());
  } else if (typeof window !== 'undefined' && (window as any).CAMUNDA_CONFIG) {
    fetched = (window as any).CAMUNDA_CONFIG;
  }
  return hydrateConfig({ env: { ...(options.env||{}), ...fetched }, overrides: options.overrides });
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let to: any; // eslint-disable-line
  return await Promise.race([
    p.then(v => { clearTimeout(to); return v; }),
    new Promise<T>((_,rej)=> { to = setTimeout(()=> rej(new CamundaConfigurationError([{ code: ConfigErrorCode.CONFIG_INVALID_ENUM, message: `Configuration fetch timed out after ${ms}ms` }] as any)), ms); })
  ]);
}

// Export spec for TypeDoc extraction tooling
// Export projection of schema entries for docs generation
export function configurationSpec() { return SCHEMA; }

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
