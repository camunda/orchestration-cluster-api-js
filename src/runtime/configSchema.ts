// Canonical configuration schema (single source of truth)
// Each entry describes one environment variable exposed to users.
// Types are inferred via 'as const' and mapped to runtime & compile-time types.

export const SCHEMA = {
  CAMUNDA_REST_ADDRESS: {
    type: 'string',
    default: 'http://localhost:8080/v2',
    doc: 'Base REST endpoint address.',
  },
  CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: {
    desc: 'Maximum total HTTP attempts (including the initial attempt) for transient failures (429,503, network).',
    type: 'int',
    default: 3,
  },
  CAMUNDA_SDK_HTTP_RETRY_BASE_DELAY_MS: {
    desc: 'Base delay in milliseconds for exponential backoff (full jitter) for HTTP retries.',
    type: 'int',
    default: 100,
  },
  CAMUNDA_SDK_HTTP_RETRY_MAX_DELAY_MS: {
    desc: 'Maximum delay cap in milliseconds for HTTP retry backoff.',
    type: 'int',
    default: 2000,
  },
  CAMUNDA_TOKEN_AUDIENCE: {
    type: 'string',
    default: 'zeebe.camunda.io',
    doc: 'Token audience for OAuth flows.',
  },
  CAMUNDA_CLIENT_ID: {
    type: 'string',
    doc: 'OAuth client id (required when CAMUNDA_AUTH_STRATEGY=OAUTH).',
    requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'OAUTH' },
  },
  CAMUNDA_CLIENT_SECRET: {
    type: 'string',
    secret: true,
    doc: 'OAuth client secret (required when CAMUNDA_AUTH_STRATEGY=OAUTH).',
    requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'OAUTH' },
  },
  CAMUNDA_OAUTH_URL: {
    type: 'string',
    default: 'https://login.cloud.camunda.io/oauth/token',
    doc: 'OAuth token URL.',
  },
  CAMUNDA_OAUTH_GRANT_TYPE: {
    type: 'string',
    default: 'client_credentials',
    doc: 'OAuth grant type.',
  },
  CAMUNDA_OAUTH_SCOPE: {
    type: 'string',
    doc: 'Optional OAuth scope (space-separated).',
  },
  CAMUNDA_OAUTH_TIMEOUT_MS: {
    type: 'int',
    default: 5000,
    doc: 'Timeout in ms for OAuth token fetch.',
  },
  CAMUNDA_OAUTH_RETRY_MAX: {
    type: 'int',
    default: 5,
    doc: 'Maximum OAuth token fetch attempts (including initial).',
  },
  CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: {
    type: 'int',
    default: 1000,
    doc: 'Base delay (ms) for first retry (exponential backoff).',
  },
  CAMUNDA_OAUTH_CACHE_DIR: {
    type: 'string',
    doc: 'Directory for disk caching OAuth tokens (Node only).',
  },
  CAMUNDA_AUTH_STRATEGY: {
    type: 'enum',
    choices: ['NONE', 'OAUTH', 'BASIC'] as const,
    default: 'NONE',
    doc: 'Authentication strategy.',
  },
  CAMUNDA_BASIC_AUTH_USERNAME: {
    type: 'string',
    doc: 'Basic auth username (required when CAMUNDA_AUTH_STRATEGY=BASIC).',
    requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'BASIC' },
  },
  CAMUNDA_BASIC_AUTH_PASSWORD: {
    type: 'string',
    secret: true,
    doc: 'Basic auth password (required when CAMUNDA_AUTH_STRATEGY=BASIC).',
    requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'BASIC' },
  },
  CAMUNDA_SDK_VALIDATION: {
    type: 'string',
    default: 'req:none,res:none',
    doc: 'Validation mini-language controlling req/res modes.',
  },
  CAMUNDA_SDK_LOG_LEVEL: {
    type: 'enum',
    choices: ['silent', 'error', 'warn', 'info', 'debug', 'trace', 'silly'] as const,
    default: 'error',
    doc: 'SDK log level. "silly" adds unsafe deep diagnostics including HTTP request and response bodies.',
  },
  CAMUNDA_SDK_TELEMETRY_LOG: {
    type: 'boolean',
    default: false,
    doc: 'Emit telemetry (auth/http/retry) events to the SDK logger automatically (no code).',
  },
  CAMUNDA_SDK_TELEMETRY_CORRELATION: {
    type: 'boolean',
    default: false,
    doc: 'Enable correlation context (withCorrelation helper) when auto telemetry logging is on.',
  },
  CAMUNDA_MTLS_CERT_PATH: { type: 'string', doc: 'Path to client certificate (PEM) for mTLS.' },
  CAMUNDA_MTLS_KEY_PATH: { type: 'string', doc: 'Path to client private key (PEM) for mTLS.' },
  CAMUNDA_MTLS_CA_PATH: { type: 'string', doc: 'Path to CA certificate bundle (PEM) for mTLS.' },
  CAMUNDA_MTLS_KEY_PASSPHRASE: {
    type: 'string',
    secret: true,
    doc: 'Optional passphrase for encrypted private key.',
  },
  CAMUNDA_MTLS_CERT: { type: 'string', doc: 'Inline PEM client certificate.' },
  CAMUNDA_MTLS_KEY: { type: 'string', secret: true, doc: 'Inline PEM client private key.' },
  CAMUNDA_MTLS_CA: { type: 'string', doc: 'Inline PEM CA bundle.' },
  CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS: {
    type: 'int',
    default: 500,
    doc: 'Default poll interval (ms) for eventually consistent endpoint polling.',
  },
  CAMUNDA_DEFAULT_TENANT_ID: {
    type: 'string',
    default: '<default>',
    doc: 'Default tenant id applied to operations when an explicit tenantId is not provided (branded TenantId).',
  },
  // CAMUNDA_SDK_BACKPRESSURE_ENABLED removed in favor of profile LEGACY (observe-only) vs others (active gating)
  CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX: {
    type: 'int',
    default: 16,
    doc: 'Initial bootstrap concurrency cap once first backpressure signal occurs.',
  },
  CAMUNDA_SDK_BACKPRESSURE_SOFT_FACTOR: {
    type: 'int',
    default: 70,
    doc: 'Percentage (integer) multiplier applied to permits on soft backpressure event (e.g. 70 => 0.7x).',
  },
  CAMUNDA_SDK_BACKPRESSURE_SEVERE_FACTOR: {
    type: 'int',
    default: 50,
    doc: 'Percentage multiplier applied when escalating to severe (e.g. 50 => 0.5x).',
  },
  CAMUNDA_SDK_BACKPRESSURE_RECOVERY_INTERVAL_MS: {
    type: 'int',
    default: 1000,
    doc: 'Interval in ms between passive recovery checks while healthy hints observed.',
  },
  CAMUNDA_SDK_BACKPRESSURE_RECOVERY_STEP: {
    type: 'int',
    default: 1,
    doc: 'Permits regained per recovery interval until reaching bootstrap cap.',
  },
  CAMUNDA_SDK_BACKPRESSURE_DECAY_QUIET_MS: {
    type: 'int',
    default: 2000,
    doc: 'Quiet period (ms) without backpressure signals required to downgrade severity.',
  },
  CAMUNDA_SDK_BACKPRESSURE_FLOOR: {
    type: 'int',
    default: 1,
    doc: 'Minimum floor concurrency when degraded.',
  },
  CAMUNDA_SDK_BACKPRESSURE_SEVERE_THRESHOLD: {
    type: 'int',
    default: 3,
    doc: 'Consecutive backpressure events required to enter severe state.',
  },
  CAMUNDA_SDK_BACKPRESSURE_PROFILE: {
    type: 'enum',
    choices: ['BALANCED', 'CONSERVATIVE', 'AGGRESSIVE', 'LEGACY'] as const,
    default: 'BALANCED',
    doc: 'Preset profile for backpressure tuning (LEGACY = observe-only, no gating; other profiles enable adaptive global concurrency control).',
  },
  // Support logging (optional diagnostic file emission; Node-only)
  CAMUNDA_SUPPORT_LOG_ENABLED: {
    type: 'boolean',
    default: false,
    doc: 'Enable creation of a support log file with environment & configuration diagnostics (Node-only).',
  },
  CAMUNDA_SUPPORT_LOG_FILE_PATH: {
    type: 'string',
    doc: 'Override support log output file path (default: ./camunda-support.log in current working directory).',
  },
  // Backward-compatible alias (boolean) if users set CAMUNDA_SUPPORT_LOGGER=true by mistake
  CAMUNDA_SUPPORT_LOGGER: {
    type: 'boolean',
    default: false,
    doc: 'Alias for CAMUNDA_SUPPORT_LOG_ENABLED (deprecated).',
  },
} as const;

export type EnvVarKey = keyof typeof SCHEMA;

// Map schema primitive to TS type
type PrimitiveType<T> = T extends { type: 'string' }
  ? string
  : T extends { type: 'boolean' }
    ? boolean
    : T extends { type: 'int' }
      ? number
      : T extends { type: 'enum'; choices: readonly (infer C)[] }
        ? C
        : never;

export type EnvVarValue<K extends EnvVarKey> = PrimitiveType<(typeof SCHEMA)[K]>;

// Flat overrides (strongly typed values)
export type EnvOverrides = Partial<{ [K in EnvVarKey]: EnvVarValue<K> }>;

// Secret metadata accessor
export function isSecret(key: EnvVarKey): boolean {
  return !!(SCHEMA as any)[key].secret;
}
export function requiredWhen(key: EnvVarKey): { key: EnvVarKey; equals: string } | undefined {
  return (SCHEMA as any)[key].requiredWhen;
}
export function defaultValue(key: EnvVarKey): any {
  return (SCHEMA as any)[key].default;
}
export function schemaEntry(key: EnvVarKey) {
  return (SCHEMA as any)[key];
}
export function allKeys(): EnvVarKey[] {
  return Object.keys(SCHEMA) as EnvVarKey[];
}
