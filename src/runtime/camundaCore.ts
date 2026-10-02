// Lightweight Camunda client core: configuration, auth, transport, validation, retry,
// backpressure, logging and clock. No operation methods.
//
// `CamundaClient` extends this class and adds the ~270 operation methods (each a
// one-line delegation to the standalone function in `src/gen/operations.gen.ts`),
// job workers and helpers. On its own, `CamundaCore` is the handle for the
// tree-shakeable per-operation functions exported from
// `@camunda8/orchestration-cluster-api/fn`:
//
//   const core = createCamundaCore();
//   const instance = await getProcessInstance(core, { processInstanceKey }, { consistency: { waitUpToMs: 0 } });
//
// Only the operations you import end up in your bundle.
import { createClient } from '../gen/client/client.gen';
import type { Client } from '../gen/client/types.gen';
import { createAuthFacade } from './auth';
import { BackpressureManager } from './backpressure';
import { type Clock, createLiveClock } from './clock';
import type { EnvOverrides } from './configSchema';
import { normalizeError } from './errors';
import { installAuthInterceptor } from './installAuthInterceptor';
import { createLogger, type Logger, type LogLevel, type LogTransport } from './logger';
import { evaluateSdkResponse } from './responseEvaluation';
import { defaultHttpClassifier, executeWithHttpRetry, type HttpRetryPolicy } from './retry';
import { createSupportLogger, type SupportLogger, writeSupportLogPreamble } from './supportLogger';
import { withCorrelation as _withCorrelation, getCorrelation, wrapFetch } from './telemetry';
import type { CamundaConfig } from './unifiedConfiguration';
import { hydrateConfig } from './unifiedConfiguration';
import { ValidationManager } from './validationManager';

// Internal deep-freeze to make exposed config immutable for consumers.
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj as any);
    for (const v of Object.values(obj as any)) {
      if (v && typeof v === 'object') deepFreeze(v as any);
    }
  }
  return obj;
}

// Input for constructing a CamundaCore (or CamundaClient). `config` takes strongly typed
// env-style overrides (CAMUNDA_* keys); the constructor hydrates them internally via
// hydrateConfig (single source of truth) — callers never handle a raw CamundaConfig.
export interface CamundaOptions {
  // Strongly typed env-style overrides (CAMUNDA_* keys). Optional.
  config?: EnvOverrides;
  // Custom fetch implementation.
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  // Provide a custom env map (mainly for tests). Defaults to process.env.
  env?: Record<string, string | undefined>;
  // Per-client logging options
  log?: { level?: LogLevel; transport?: LogTransport };
  // Telemetry (Phase 1)
  telemetry?: {
    hooks?: import('../runtime/telemetry').TelemetryHooks;
    correlation?: boolean;
    mirrorToLog?: boolean;
  };
  // If true (default), non-2xx HTTP responses throw instead of returning an error object.
  // Set to false to opt into non-throwing behavior.
  throwOnError?: boolean;
  // Optional injected SupportLogger (Node-only). If absent, auto-created when enabled via env/config.
  supportLogger?: SupportLogger;
  // Clock backing SDK-internal cadence (poll loops, backoff, decay). Inject a pinned clock
  // to drive those loops in tests without waiting for real time. Defaults to the live clock.
  // Liveness bounds — shutdown drains and request timeouts — deliberately do not use it.
  clock?: Clock;
  /**
   * Explicit component discriminator for support diagnostics. Set only by SDK-internal
   * subclasses: `CamundaClientBase` passes `'CamundaClient'` so the construction log names
   * the real component even when a consumer subclasses the public `CamundaCore` (where
   * `new.target !== CamundaCore` alone could not distinguish core-subclass from client).
   * @internal
   */
  __camundaComponent?: 'CamundaCore' | 'CamundaClient';
}

/**
 * Members of {@link CamundaCore} that the generated per-operation functions use.
 * @internal
 */
export interface OperationRuntime {
  readonly _config: Readonly<CamundaConfig>;
  readonly _log: Logger;
  readonly _validation: ValidationManager;
  readonly _client: Client;
  readonly _clock: Clock;
  _evaluateResponse(
    raw: any,
    opId: string,
    buildBackpressureError: (resp: any) => Error | undefined
  ): any;
  _invokeWithRetry<T>(
    op: () => Promise<T>,
    opts: {
      opId: string;
      exempt?: boolean;
      classify?: (e: any) => { retryable: boolean; reason: string };
      retryOverride?: Partial<HttpRetryPolicy> | false;
    }
  ): Promise<T>;
}

/** Create a {@link CamundaCore}: the lightweight handle for the per-operation functions. */
export function createCamundaCore(options?: CamundaOptions): CamundaCore {
  return new CamundaCore(options);
}

/**
 * Configuration, auth, transport, validation, retry and backpressure — without the
 * operation methods. Pass it to the functions exported from
 * `@camunda8/orchestration-cluster-api/fn`. A `CamundaClient` is also a `CamundaCore`.
 */
export class CamundaCore {
  protected _client: Client;
  protected _config: Readonly<CamundaConfig>;
  protected _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', raw: 'req:none,res:none' } as any,
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: '',
  } as any);
  protected _baseFetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  protected _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  protected _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  protected _log: Logger = createLogger();
  protected _bp: BackpressureManager;
  protected _clock: Clock;
  /** Support logger (Node-only; no-op in browser). */
  protected _supportLogger: SupportLogger = new (class implements SupportLogger {
    log() {}
  })();
  /**
   * Stable delegating sink handed to `wrapFetch`. The wrapped fetch captures this object
   * once, but every `log()` forwards to the *current* `_supportLogger` — so a support
   * logger assigned (or injected) after fetch is wrapped still receives http end/error
   * events. Passing `_supportLogger` directly would permanently capture whatever instance
   * existed at wrap time (the initial no-op), silently dropping those events.
   */
  protected readonly _supportLogSink: SupportLogger = {
    log: (message, addTimestamp) => this._supportLogger.log(message, addTimestamp),
  };

  // Internal fixed error mode for eventual consistency ('throw' | 'result'). Not user mutable after construction.
  protected readonly _errorMode: 'throw' | 'result';

  protected _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    this._clock = opts.clock ?? createLiveClock();
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Initialize per-client logger
    this._log = createLogger({
      level: opts.log?.level || this._config.logLevel,
      transport: opts.log?.transport,
    });
    const baseFetch = opts.fetch;
    this._baseFetch = baseFetch;
    this._fetch = baseFetch;
    // Telemetry wrap (after logger & config known). If user provided explicit telemetry, honor it.
    // Else if environment enabled auto telemetry logging, wrap with mirrorToLog + optional correlation.
    if (opts.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: opts.telemetry.hooks,
        correlation: opts.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: opts.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: true,
      });
    } else if (
      // Auto-enable mirror telemetry when trace level and user did not explicitly set CAMUNDA_SDK_TELEMETRY_LOG to a disabling value.
      /^(trace|silly)$/.test(this._log.level()) &&
      !this._config.telemetry?.log &&
      // No explicit override provided
      (this._overrides as any)['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined &&
      // And env var either absent or truthy enabling value
      (typeof process === 'undefined' ||
        process.env['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined ||
        /^(1|true|yes|on)$/i.test(process.env['CAMUNDA_SDK_TELEMETRY_LOG'] || ''))
    ) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry?.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: true,
      });
    }
    this._client = createClient({
      baseUrl: this._config.restAddress,
      fetch: this._fetch,
      throwOnError: opts.throwOnError !== false,
    });
    // Unsafe diagnostic level warning
    if (this._log.level() === 'silly') {
      this._log.warn(
        'log.level.silly.enabled',
        'HTTP request and response bodies will be logged; this may leak sensitive information. Use only for local debugging.'
      );
    }
    installAuthInterceptor(
      this._client,
      () => this._config.auth.strategy,
      () => this._auth.getAuthHeaders()
    );
    this._auth = createAuthFacade(this._config, {
      fetch: this._fetch,
      logger: this._log,
      clock: this._clock,
      telemetryHooks: opts.telemetry?.hooks,
      correlationProvider:
        opts.telemetry?.correlation || (!opts.telemetry && this._config.telemetry?.correlation)
          ? () => getCorrelation()
          : undefined,
    });
    this._validation.update(this._config.validation);
    this._validation.attachLogger(this._log);
    this._errorMode = (opts as any).errorMode === 'result' ? 'result' : 'throw';
    // Support logger initialization (after config hydration & before major components start emitting)
    this._supportLogger = createSupportLogger(this._config, opts.supportLogger);
    try {
      // Report the component actually constructed. The `__camundaComponent` discriminator is
      // authoritative: `CamundaCore` defaults to `'CamundaCore'` and `CamundaClientBase` passes
      // `'CamundaClient'`. An explicit marker (not `new.target`) is required because a consumer
      // may subclass the now-public `CamundaCore` — `new.target !== CamundaCore` for such a
      // subclass, so a `new.target`-based check would mislabel it "CamundaClient" in support
      // diagnostics even though it has no client operation surface. The marker is also immune to
      // minifiers renaming class identifiers and to test-transform (SSR) class re-instantiation.
      const component = opts.__camundaComponent ?? 'CamundaCore';
      this._supportLogger.log(`${component} constructed`);
    } catch {
      /* ignore */
    }
    // Emit canonical support log preamble (idempotent; covers injected loggers)
    this.emitSupportLogPreamble();
    // Initialize global backpressure manager with tuned config
    this._bp = new BackpressureManager({
      logger: this._log.scope('bp'),
      now: () => this._clock.now(),
      sleep: (ms) => this._clock.sleep(ms),
      config: {
        enabled: this._config.backpressure.enabled,
        observeOnly: this._config.backpressure.observeOnly,
        // In observe-only or disabled modes we keep permitsMax null.
        initialMaxConcurrency:
          this._config.backpressure.enabled && !this._config.backpressure.observeOnly
            ? this._config.backpressure.initialMax || null
            : null,
        reduceFactor: this._config.backpressure.softFactor,
        severeReduceFactor: this._config.backpressure.severeFactor,
        recoveryIntervalMs: this._config.backpressure.recoveryIntervalMs,
        recoveryStep: this._config.backpressure.recoveryStep,
        decayQuietMs: this._config.backpressure.decayQuietMs,
        floorConcurrency: this._config.backpressure.floor,
        severeThreshold: this._config.backpressure.severeThreshold,
        maxWaiters: this._config.backpressure.maxWaiters,
        healthyRecoveryMultiplier: this._config.backpressure.healthyRecoveryMultiplier,
        unlimitedAfterHealthyMs: this._config.backpressure.unlimitedAfterHealthyMs,
      },
    });
    // Debug-level emission of redacted effective configuration (lazy)
    this._log.debug(() => {
      try {
        const last = (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG;
        const redacted = last?.toRedactedObject ? last.toRedactedObject() : undefined;
        return redacted ? ['config.hydrated', { config: redacted }] : ['config.hydrated'];
      } catch {
        return ['config.hydrated'];
      }
    });
  }

  get config(): Readonly<CamundaConfig> {
    return this._config;
  }
  /**
   * Read-only snapshot of current hydrated configuration (do not mutate directly).
   * Use configure(...) to apply changes.
   */
  getConfig(): Readonly<CamundaConfig> {
    return this._config;
  }

  // Merge new overrides and re-hydrate.
  configure(next: CamundaOptions) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
    if (next.fetch) this._baseFetch = next.fetch;
    // Always wrap from the base fetch to avoid accumulating closure layers on repeated configure() calls.
    this._fetch = this._baseFetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Re-wrap fetch if telemetry present OR env auto telemetry toggled
    if (next.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: next.telemetry.hooks,
        correlation: next.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: next.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: true,
      });
    } else if (
      /^(trace|silly)$/.test(this._log.level()) &&
      !this._config.telemetry?.log &&
      (this._overrides as any)['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined &&
      (typeof process === 'undefined' ||
        process.env['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined ||
        /^(1|true|yes|on)$/i.test(process.env['CAMUNDA_SDK_TELEMETRY_LOG'] || ''))
    ) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry?.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogSink,
        mirrorToLog: true,
      });
    }
    this._client = createClient({
      baseUrl: this._config.restAddress,
      fetch: this._fetch,
      throwOnError: next.throwOnError !== false,
    });
    installAuthInterceptor(
      this._client,
      () => this._config.auth.strategy,
      () => this._auth.getAuthHeaders()
    );
    // Update logger level / transport if provided, else apply config log level
    if (next.log?.level) this._log.setLevel(next.log.level);
    else this._log.setLevel(this._config.logLevel);
    if (next.log?.transport !== undefined) this._log.setTransport(next.log.transport);
    this._auth = createAuthFacade(this._config, {
      fetch: this._fetch,
      logger: this._log,
      clock: this._clock,
      telemetryHooks: next.telemetry?.hooks,
      correlationProvider:
        next.telemetry?.correlation || (!next.telemetry && this._config.telemetry?.correlation)
          ? () => getCorrelation()
          : undefined,
    });
    this._validation.update(this._config.validation);
    this._validation.attachLogger(this._log);
    // _errorMode intentionally not mutable post-construction.
    // Re-init support logger only if it was disabled and now enabled (avoid overwriting custom injected instance)
    if (!next.supportLogger && !('supportLogger' in next)) {
      // Auto-detect change in enable flag
      const shouldEnable = this._config.supportLog?.enabled;
      const previouslyEnabled = (this._supportLogger as any).enabled === true; // heuristic
      if (shouldEnable && !previouslyEnabled) {
        this._supportLogger = createSupportLogger(this._config);
        this._supportLogger.log('Support logger enabled via reconfigure');
      }
    } else if (next.supportLogger) {
      this._supportLogger = next.supportLogger;
      this._supportLogger.log('Support logger injected via reconfigure');
    }
    // Emit updated redacted configuration when debug enabled
    this._log.debug(() => {
      try {
        const last = (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG;
        const redacted = last?.toRedactedObject ? last.toRedactedObject() : undefined;
        return redacted ? ['config.reconfigured', { config: redacted }] : ['config.reconfigured'];
      } catch {
        return ['config.reconfigured'];
      }
    });
  }

  // Auth helpers
  async getAuthHeaders() {
    return this._auth.getAuthHeaders();
  }
  async forceAuthRefresh() {
    return this._auth.forceRefresh();
  }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) {
    this._auth.clearCache(opts);
  }
  onAuthHeaders(
    h: (headers: Record<string, string>) => Record<string, string> | Promise<Record<string, string>>
  ) {
    this._auth.registerHeadersHook(h);
  }

  /** @internal ValidationManager is internal; tests may reach via (client as any)._validation */
  /** Access a scoped logger (internal & future user emission). */
  logger(scope?: string) {
    return scope ? this._log.scope(scope) : this._log;
  }

  /** Internal accessor (read-only) for eventual consistency error mode. */
  getErrorMode(): 'throw' | 'result' {
    return this._errorMode;
  }

  /** Internal accessor for support logger (no public API commitment yet). */
  _getSupportLogger(): SupportLogger {
    return this._supportLogger;
  }

  /**
   * Emit the standard support log preamble & redacted configuration to the current support logger.
   * Safe to call multiple times; subsequent calls are ignored (idempotent).
   * Useful when a custom supportLogger was injected and you still want the canonical header & config dump.
   */
  emitSupportLogPreamble() {
    try {
      writeSupportLogPreamble(this._supportLogger, this._config as CamundaConfig);
    } catch (e) {
      this._log.debug(() => ['supportLog.preamble.error', e]);
    }
  }

  // Run a function with a correlation ID (manual propagation phase 1)
  withCorrelation<T>(id: string, fn: () => Promise<T> | T): Promise<T> {
    return _withCorrelation(id, fn);
  }

  /** Internal invocation helper to apply global backpressure gating + retry + normalization */
  public async _invokeWithRetry<T>(
    op: () => Promise<T>,
    opts: {
      opId: string;
      exempt?: boolean;
      classify?: (e: any) => { retryable: boolean; reason: string };
      retryOverride?: Partial<HttpRetryPolicy> | false;
    }
  ): Promise<T> {
    const { opId, exempt, classify, retryOverride } = opts;
    const policy: HttpRetryPolicy =
      retryOverride === false
        ? { maxAttempts: 1, baseDelayMs: 0, maxDelayMs: 0 }
        : retryOverride
          ? { ...this._config.httpRetry, ...retryOverride }
          : this._config.httpRetry;
    const signal: AbortSignal | undefined = undefined; // placeholder if we later pass through
    if (!exempt) {
      await this._bp.acquire(signal);
    }
    try {
      const result = await executeWithHttpRetry(
        async () => op(),
        policy,
        this._log.scope(opId),
        (err) => {
          const decision = (classify ? classify(err) : defaultHttpClassifier(err)) as any;
          if (decision && decision.retryable && /backpressure|http-429/.test(decision.reason)) {
            this._bp.recordBackpressure();
          }
          return decision;
        },
        undefined,
        this._clock
      );
      this._bp.recordHealthyHint();
      return result;
    } catch (e: any) {
      // Non-retryable or exhausted
      if (e && (e as any).status && (e as any).status === 429) this._bp.recordBackpressure();
      throw normalizeError(e, { opId });
    } finally {
      if (!exempt) this._bp.release();
    }
  }
  /** Shared evaluation for raw transport responses (throwOnError:false) */
  protected _evaluateResponse(
    raw: any,
    opId: string,
    buildBackpressureError: (resp: any) => Error | undefined
  ) {
    return evaluateSdkResponse(raw, { opId, buildBackpressureError });
  }
  /** Clock backing SDK-internal cadence. The injected one when supplied, else the live clock. */
  get clock(): Clock {
    return this._clock;
  }
  /** Public accessor for current backpressure adaptive limiter state (stable) */
  getBackpressureState() {
    try {
      return this._bp.getState();
    } catch (e) {
      this._log.error('Error retrieving backpressure state', e);
      return {
        severity: 'healthy',
        permitsMax: null,
        permitsCurrent: 0,
        consecutive: 0,
        waiters: 0,
      };
    }
  }
}
