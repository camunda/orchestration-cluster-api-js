# Camunda TypeScript SDK Reference

Generated: 2025-08-31T20:12:22.203Z

## Configuration

| Key                                 | Type      | Default                                      | Required                                  | Flags  | Status | Description                                                              |
| ----------------------------------- | --------- | -------------------------------------------- | ----------------------------------------- | ------ | ------ | ------------------------------------------------------------------------ | ----- | ------------------------ | ---- | ----- | ------- |
| `CAMUNDA_REST_ADDRESS`              | string    | `http://localhost:8080`                      | No                                        |        |        | Base REST endpoint address.                                              |
| `CAMUNDA_TOKEN_AUDIENCE`            | string    | `zeebe.camunda.io`                           | No                                        |        |        | Token audience for OAuth flows.                                          |
| `CAMUNDA_CLIENT_ID`                 | string    | —                                            | Required when CAMUNDA_AUTH_STRATEGY=OAUTH |        |        | OAuth client id (required when CAMUNDA_AUTH_STRATEGY=OAUTH).             |
| `CAMUNDA_CLIENT_SECRET`             | string    | —                                            | Required when CAMUNDA_AUTH_STRATEGY=OAUTH | secret |        | OAuth client secret (required when CAMUNDA_AUTH_STRATEGY=OAUTH).         |
| `CAMUNDA_OAUTH_URL`                 | string    | `https://login.cloud.camunda.io/oauth/token` | No                                        |        |        | OAuth token URL.                                                         |
| `CAMUNDA_OAUTH_GRANT_TYPE`          | string    | `client_credentials`                         | No                                        |        |        | OAuth grant type (currently client_credentials only).                    |
| `CAMUNDA_OAUTH_SCOPE`               | string    | —                                            | No                                        |        |        | Optional OAuth scope (space-separated).                                  |
| `CAMUNDA_OAUTH_TIMEOUT_MS`          | int       | `10000`                                      | No                                        |        |        | Timeout in ms for OAuth token fetch.                                     |
| `CAMUNDA_OAUTH_RETRY_MAX`           | int       | `4`                                          | No                                        |        |        | Maximum retry attempts after the initial token fetch try.                |
| `CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS` | int       | `1000`                                       | No                                        |        |        | Base delay (ms) for first retry (exponential backoff).                   |
| `CAMUNDA_OAUTH_CACHE_DIR`           | string    | `~/.camunda-sdk`                             | No                                        |        |        | Directory for disk caching OAuth tokens (Node only).                     |
| `CAMUNDA_AUTH_STRATEGY`             | enum(NONE | OAUTH                                        | BASIC)                                    | `NONE` | No     |                                                                          |       | Authentication strategy. |
| `CAMUNDA_BASIC_AUTH_USERNAME`       | string    | —                                            | Required when CAMUNDA_AUTH_STRATEGY=BASIC |        |        | Basic auth username (required when CAMUNDA_AUTH_STRATEGY=BASIC).         |
| `CAMUNDA_BASIC_AUTH_PASSWORD`       | string    | —                                            | Required when CAMUNDA_AUTH_STRATEGY=BASIC | secret |        | Basic auth password (required when CAMUNDA_AUTH_STRATEGY=BASIC).         |
| `CAMUNDA_SDK_VALIDATION`            | string    | `req:none,res:none`                          | No                                        |        |        | Validation mini-language controlling req/res modes.                      |
| `CAMUNDA_SDK_VALIDATION_VERBOSE`    | boolean   | —                                            | Yes\* (no default)                        |        |        | Verbose validation output flag.                                          |
| `CAMUNDA_SDK_LOG_LEVEL`             | string    | `error`                                      | No                                        |        |        | SDK log level (silent                                                    | error | warn                     | info | debug | trace). |
| `CAMUNDA_MTLS_CERT_PATH`            | string    | —                                            | No                                        |        |        | Path to client certificate (PEM) for mTLS (used if inline not provided). |
| `CAMUNDA_MTLS_KEY_PATH`             | string    | —                                            | No                                        |        |        | Path to client private key (PEM) for mTLS (used if inline not provided). |
| `CAMUNDA_MTLS_CA_PATH`              | string    | —                                            | No                                        |        |        | Path to CA certificate bundle (PEM) for mTLS (optional).                 |
| `CAMUNDA_MTLS_KEY_PASSPHRASE`       | string    | —                                            | No                                        | secret |        | Optional passphrase for encrypted private key.                           |
| `CAMUNDA_MTLS_CERT`                 | string    | —                                            | No                                        |        |        | Inline PEM client certificate (overrides path).                          |
| `CAMUNDA_MTLS_KEY`                  | string    | —                                            | No                                        | secret |        | Inline PEM client private key (overrides path).                          |
| `CAMUNDA_MTLS_CA`                   | string    | —                                            | No                                        |        |        | Inline PEM CA bundle (overrides path).                                   |
