# Configuration Guide

Comprehensive reference and examples for the unified configuration system powering the Camunda 8 Orchestration Cluster TypeScript SDK.

## Goals Recap

- Single declarative spec (see `configurationSpec()`).
- Deterministic hydration: defaults + env + explicit overrides.
- Conditional requirements (OAuth / Basic).
- Strict parsing (fail fast & explicit).
- Pure DI (no global mutation of `process.env`).
- Secure logging via redaction.

## Supported Environment Variables

| Key                               | Type        | Default                                    | Conditional Requirement             | Secret | Notes                                                             |
| --------------------------------- | ----------- | ------------------------------------------ | ----------------------------------- | ------ | ----------------------------------------------------------------- | --- | ------------------ |
| CAMUNDA_REST_ADDRESS              | string      | http://localhost:8080                      | —                                   |        | Base REST endpoint (SDK auto-appends `/v2` if missing).           |
| CAMUNDA_TOKEN_AUDIENCE            | string      | zeebe.camunda.io                           | —                                   |        | OAuth audience.                                                   |
| CAMUNDA_CLIENT_ID                 | string      | —                                          | when CAMUNDA_AUTH_STRATEGY=OAUTH    |        | Required for OAuth.                                               |
| CAMUNDA_CLIENT_SECRET             | string      | —                                          | when CAMUNDA_AUTH_STRATEGY=OAUTH    | yes    | Required for OAuth (redacted in logs).                            |
| CAMUNDA_OAUTH_URL                 | string      | https://login.cloud.camunda.io/oauth/token | —                                   |        | Token endpoint.                                                   |
| CAMUNDA_OAUTH_GRANT_TYPE          | string      | client_credentials                         | —                                   |        | OAuth grant (currently only client_credentials supported).        |
| CAMUNDA_OAUTH_SCOPE               | string      | —                                          | —                                   |        | Optional space-delimited scopes.                                  |
| CAMUNDA_OAUTH_TIMEOUT_MS          | int         | 10000                                      | —                                   |        | Per token request timeout.                                        |
| CAMUNDA_OAUTH_RETRY_MAX           | int         | 4                                          | —                                   |        | Max retry attempts for token fetch.                               |
| CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS | int         | 1000                                       | —                                   |        | Initial backoff slot (exponential, jittered).                     |
| CAMUNDA_OAUTH_CACHE_DIR           | string      | ~/.camunda-sdk                             | —                                   |        | Directory for persisting token cache (node only).                 |
| CAMUNDA_SDK_LOG_LEVEL             | string      | error                                      | —                                   |        | SDK log level: silent,error,warn,info,debug,trace.                |
| CAMUNDA_AUTH_STRATEGY             | enum(NONE   | OAUTH                                      | BASIC)                              | NONE   | —                                                                 |     | Selects auth mode. |
| CAMUNDA_BASIC_AUTH_USERNAME       | string      | —                                          | when CAMUNDA_AUTH_STRATEGY=BASIC    |        | Basic username.                                                   |
| CAMUNDA_BASIC_AUTH_PASSWORD       | string      | —                                          | when CAMUNDA_AUTH_STRATEGY=BASIC    | yes    | Basic password (redacted).                                        |
| CAMUNDA_SDK_VALIDATION            | mini‑lang   | req:none,res:none                          | —                                   |        | Validation modes (see below).                                     |
| CAMUNDA_SDK_VALIDATION_VERBOSE    | boolean     | (unset)                                    | —                                   |        | Verbose union diagnostics.                                        |
| CAMUNDA_MTLS_CERT                 | string(pem) | —                                          | when any mTLS var set requires key  | yes    | Inline client certificate (PEM). Inline values override \*\_PATH. |
| CAMUNDA_MTLS_KEY                  | string(pem) | —                                          | when any mTLS var set requires cert | yes    | Inline client private key (PEM).                                  |
| CAMUNDA_MTLS_CA                   | string(pem) | —                                          | —                                   |        | Inline custom CA bundle (PEM) if not system trust.                |
| CAMUNDA_MTLS_CERT_PATH            | string      | —                                          | —                                   |        | Path to client cert PEM (used if inline not provided).            |
| CAMUNDA_MTLS_KEY_PATH             | string      | —                                          | —                                   |        | Path to private key PEM (used if inline not provided).            |
| CAMUNDA_MTLS_CA_PATH              | string      | —                                          | —                                   |        | Path to CA bundle PEM (used if inline not provided).              |
| CAMUNDA_MTLS_KEY_PASSPHRASE       | string      | —                                          | —                                   | yes    | Optional key passphrase.                                          |

## Precedence

`defaults < process.env < overrides (explicit object)`

In the browser async helper: `defaults < window.CAMUNDA_CONFIG < fetched config < explicit overrides`.

## Boolean & Enum Parsing

- Booleans accepted (case‑insensitive): `true,false,yes,no,1,0,on,off`.
- Enums case‑normalized silently to canonical uppercase.

## Validation Mini‑Language

Forms:

- Global: `warn` / `strict` / `none` → applies to both sides.
- Pair list: `req:warn,res:strict` (order independent, commas + trim).

Unknown scope, mode, duplicate scope ⇒ error (`CamundaConfigurationError`).

## Typical Environment Sets

### 1. Basic Auth (request validation warn, response strict, verbose diagnostics)

```bash
export CAMUNDA_AUTH_STRATEGY=BASIC
export CAMUNDA_BASIC_AUTH_USERNAME=alice
export CAMUNDA_BASIC_AUTH_PASSWORD=supersecret123
export CAMUNDA_REST_ADDRESS=https://cluster.example
export CAMUNDA_SDK_VALIDATION=req:warn,res:strict
export CAMUNDA_SDK_VALIDATION_VERBOSE=1
```

### 2. OAuth (global warn validation + retry tuning)

```bash
export CAMUNDA_AUTH_STRATEGY=OAUTH
export CAMUNDA_CLIENT_ID=abc123
export CAMUNDA_CLIENT_SECRET=shhDontTellAnyone
export CAMUNDA_OAUTH_URL=https://login.cloud.camunda.io/oauth/token
export CAMUNDA_TOKEN_AUDIENCE=zeebe.camunda.io
export CAMUNDA_OAUTH_SCOPE="openid profile"
export CAMUNDA_OAUTH_RETRY_MAX=6
export CAMUNDA_REST_ADDRESS=https://api.cluster.example
export CAMUNDA_SDK_VALIDATION=warn
```

### 3. Disable Validation

```bash
export CAMUNDA_SDK_VALIDATION=none
```

### 4. Fine‑Grained Modes

### 5. mTLS (client cert authentication layer)

```bash
export CAMUNDA_AUTH_STRATEGY=OAUTH # or BASIC / NONE; mTLS is transport-level
export CAMUNDA_CLIENT_ID=abc123
export CAMUNDA_CLIENT_SECRET=shh
export CAMUNDA_MTLS_CERT_PATH=/etc/certs/client.crt
export CAMUNDA_MTLS_KEY_PATH=/etc/certs/client.key
export CAMUNDA_MTLS_CA_PATH=/etc/certs/ca.pem
```

Inline override example (takes precedence over \*\_PATH):

```bash
export CAMUNDA_MTLS_CERT="$(cat client.crt)"
export CAMUNDA_MTLS_KEY="$(cat client.key)"
```

If only one of cert/key is provided an error is raised during hydration; CA is optional.

```bash
export CAMUNDA_SDK_VALIDATION=req:warn,res:strict
```

## Programmatic Hydration (Node) & Auth Facade

```ts
import camunda from '@camunda8/orchestration-cluster';
import { hydrateConfig } from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';
import { createAuthFacade } from '@camunda8/orchestration-cluster/dist/runtime/auth';

const { config, redacted } = hydrateConfig();
camunda.OpenAPI.BASE = config.restAddress;

// Build auth facade (handles Basic/OAuth, token caching, retries, mTLS agent)
const auth = createAuthFacade(config);

// Optional: add custom headers hook (runs after auth header) e.g. to override Authorization
auth.registerHeadersHook(async (headers) => ({ ...headers, 'X-Custom': 'demo' }));

// Force a token refresh (client_credentials) if needed
await auth.forceRefresh?.();

// Use SDK operations normally – OpenAPI proxy pulls headers via facade
await camunda.getTopology();

console.log('[config] redacted', redacted);
```

## Programmatic Hydration (Browser Async)

```ts
import { hydrateConfigAsync } from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';
import camunda from '@camunda8/orchestration-cluster';

// Example: fetch JSON config served by your app (e.g. /sdk-config.json)
const { config } = await hydrateConfigAsync({
  fetch: async () => await (await fetch('/sdk-config.json', { credentials: 'include' })).json(),
});

camunda.OpenAPI.BASE = config.restAddress;
```

You may also predefine `window.CAMUNDA_CONFIG = { CAMUNDA_REST_ADDRESS: '...' }` before the bundle loads.

## Error Handling

Missing conditional vars or parsing errors throw `CamundaConfigurationError`:

```ts
import {
  hydrateConfig,
  CamundaConfigurationError,
} from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';

try {
  hydrateConfig({ env: { CAMUNDA_AUTH_STRATEGY: 'OAUTH' } }); // Missing client id & secret
} catch (e) {
  if (e instanceof CamundaConfigurationError) {
    for (const err of e.errors) {
      console.error(err.code, err.key, err.message);
    }
  }
}
```

## Provided vs Effective vs Redacted

```ts
const { provided, effective, redacted } = hydrateConfig();
// provided: only explicitly set non-empty env / override values
// effective: full map with defaults applied
// redacted: effective with secrets masked (length preserved, last 4 chars shown if > 4)
```

## Logging Safely

Never log secrets directly; use `redacted` or `toDisplayString()`:

```ts
const { toDisplayString } = hydrateConfig();
console.log(toDisplayString());
```

## Troubleshooting

| Symptom                                                             | Cause                                                | Action                                            |
| ------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| CamundaConfigurationError: Missing required configuration for OAUTH | Strategy set to OAUTH but credentials absent / empty | Set `CAMUNDA_CLIENT_ID` & `CAMUNDA_CLIENT_SECRET` |
| Invalid boolean value 'maybe'                                       | Unsupported boolean literal                          | Use true/false/yes/no/1/0/on/off                  |
| Unknown scope 'foo' in validation var                               | Typo in validation mini‑lang                         | Correct to req/res scopes                         |
| Secret appears fully in logs                                        | Logged `effective` instead of `redacted`             | Switch to redacted object                         |

## Future Extensions

- Additional numeric knobs (timeouts, retry counts) via `int` type entries. (Several implemented for OAuth already.)
- Deprecation warnings surface in `warnings` array.
- Potential multi‑source merge strategies for multi‑tenant browser apps.

---

For a concise table view see [`SDK_REFERENCE.md`](./SDK_REFERENCE.md).
