// TEMPLATE: Canonical Camunda class template (manually maintained)
// TEMPLATE: DO NOT add generated operation methods here; generator will produce CamundaClient.ts from this template.
import { createClient } from '../gen/client/client.gen';
import * as Sdk from '../gen/sdk.gen';
import { createAuthFacade } from '../runtime/auth';
import type { CamundaConfig } from '../runtime/unifiedConfiguration';
import type { EnvOverrides } from '../runtime/configSchema';
import { hydrateConfig } from '../runtime/unifiedConfiguration';
import { ConsistencyOptions, eventualPoll } from '../runtime/eventual';
import { installAuthInterceptor } from '../runtime/installAuthInterceptor';
import { createLogger, type Logger, type LogLevel, type LogTransport } from '../runtime/logger';
import {
  createSupportLogger,
  type SupportLogger,
  writeSupportLogPreamble,
} from '../runtime/supportLogger';
import {
  wrapFetch,
  withCorrelation as _withCorrelation,
  getCorrelation,
} from '../runtime/telemetry';
import { ValidationManager } from '../runtime/validationManager';
import type { Client } from '../gen/client/types.gen';
import {
  executeWithHttpRetry,
  defaultHttpClassifier,
  type HttpRetryPolicy,
  type OperationOptions,
} from '../runtime/retry';
import { normalizeError } from '../runtime/errors';
import { BackpressureManager } from '../runtime/backpressure';
import { JobWorker, type JobWorkerConfig } from '../runtime/jobWorker';
import { ThreadedJobWorker, type ThreadedJobWorkerConfig } from '../runtime/threadedJobWorker';
import { ThreadPool } from '../runtime/threadPool';
import { evaluateSdkResponse } from '../runtime/responseEvaluation';

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

// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// (generation inserts helper & per-operation option/body types here)
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'CancelError';
  }
}
export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}
function toCancelable<T>(factory: (signal: AbortSignal) => Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  let settled = false;
  let rejectRef: (e: any) => void = () => {};
  const p: any = new Promise<T>((resolve, reject) => {
    rejectRef = reject;
    factory(ac.signal)
      .then((v) => {
        settled = true;
        resolve(v);
      })
      .catch((e) => {
        // If already canceled and fetch produced an abort, translate to CancelSdkError once.
        if (
          ac.signal.aborted &&
          (e?.name === 'AbortError' || /abort|cancel/i.test(e?.message || ''))
        ) {
          const c = new Error('Cancelled') as any;
          c.name = 'CancelSdkError';
          return reject(c);
        }
        reject(e);
      });
  });
  p.cancel = () => {
    if (ac.signal.aborted) return; // idempotent
    ac.abort();
    // If underlying promise hasn't settled yet, proactively reject with CancelSdkError.
    if (!settled) {
      const c = new Error('Cancelled') as any;
      c.name = 'CancelSdkError';
      rejectRef(c);
    }
  };
  return p as CancelablePromise<T>;
}

// New simplified input: we only accept an already hydrated CamundaConfig. Users wanting env
// overrides or partials should call hydrateConfig first (single source of truth) and pass
// the resulting config.
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
}

export function createCamundaClient(options?: CamundaOptions) {
  return new CamundaClient(options);
}

export class CamundaClient {
  private _client: Client;
  private _config: Readonly<CamundaConfig>;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', raw: 'req:none,res:none' } as any,
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: '',
  } as any);
  private _baseFetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();
  private _bp: BackpressureManager;
  /** Registered job workers created via createJobWorker (lifecycle managed by user). */
  private _workers: any[] = [];
  /** Shared thread pool for all threaded job workers (lazy-initialised on first use). */
  private _threadPool: ThreadPool | null = null;
  /** Support logger (Node-only; no-op in browser). */
  private _supportLogger: SupportLogger = new (class implements SupportLogger {
    log() {}
  })();

  // Internal fixed error mode for eventual consistency ('throw' | 'result'). Not user mutable after construction.
  private readonly _errorMode: 'throw' | 'result';

  private _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
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
        supportLogger: this._supportLogger,
        mirrorToLog: opts.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
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
        supportLogger: this._supportLogger,
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
      this._supportLogger.log('CamundaClient constructed');
    } catch {
      /* ignore */
    }
    // Emit canonical support log preamble (idempotent; covers injected loggers)
    this.emitSupportLogPreamble();
    // Initialize global backpressure manager with tuned config
    this._bp = new BackpressureManager({
      logger: this._log.scope('bp'),
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
        supportLogger: this._supportLogger,
        mirrorToLog: next.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
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
        supportLogger: this._supportLogger,
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

  // Helper for detecting documented void responses (stable public contract)
  // Referenced from generated code - DO NOT REMOVE
  // Uses build-time generated VOID_RESPONSES set (no runtime zod dependency needed)
  private _isVoidResponse(name: string): boolean {
    return VOID_RESPONSES.has(name);
  }

  // Lazy-load zod schemas on first validation use. Returns cached module.
  private _schemasPromise: Promise<typeof import('../gen/zod.gen')> | null = null;
  private _loadSchemas(): Promise<typeof import('../gen/zod.gen')> {
    if (!this._schemasPromise) {
      this._schemasPromise = import('../gen/zod.gen');
    }
    return this._schemasPromise;
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
        }
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
  private _evaluateResponse(
    raw: any,
    opId: string,
    buildBackpressureError: (resp: any) => Error | undefined
  ) {
    return evaluateSdkResponse(raw, { opId, buildBackpressureError });
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
  /** Return a read-only snapshot of currently registered job workers. */
  getWorkers() {
    return [...this._workers];
  }
  /** Stop all registered job workers (best-effort) and terminate the shared thread pool. */
  stopAllWorkers() {
    for (const w of this._workers) {
      try {
        if (typeof w.stop === 'function') w.stop();
      } catch (e) {
        this._log.warn('worker.stop.error', e);
      }
    }
    if (this._threadPool) {
      this._threadPool.terminate();
      this._threadPool = null;
    }
  }

  /** Get or lazily create the shared thread pool for threaded job workers. */
  private _getOrCreateThreadPool(threadPoolSize?: number): ThreadPool {
    if (!this._threadPool) {
      this._threadPool = new ThreadPool(this as any, threadPoolSize);
    }
    return this._threadPool;
  }
  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // === AUTO-GENERATED CAMUNDA METHODS END ===

  /**
   * Create a job worker that activates and processes jobs of the given type.
   *
   * Worker configuration fields inherit global defaults resolved via the
   * unified configuration (environment variables or equivalent `CAMUNDA_WORKER_*`
   * keys provided via `CamundaOptions.config`) when not explicitly set on the
   * config object.
   * @param cfg Worker configuration
   * @example Create a job worker
   * {@includeCode ../../examples/job.ts#CreateJobWorker}
   * @example Job worker with error handling
   * {@includeCode ../../examples/job.ts#JobWorkerWithErrorHandling}
   */
  createJobWorker<
    In extends import('zod').ZodTypeAny = any,
    Out extends import('zod').ZodTypeAny = any,
    Headers extends import('zod').ZodTypeAny = any,
  >(cfg: JobWorkerConfig<In, Out, Headers>): JobWorker {
    const defaults = this._config.workerDefaults;
    const merged = defaults
      ? {
          ...cfg,
          jobTimeoutMs: cfg.jobTimeoutMs ?? defaults.jobTimeoutMs,
          maxParallelJobs: cfg.maxParallelJobs ?? defaults.maxParallelJobs,
          pollTimeoutMs: cfg.pollTimeoutMs ?? defaults.pollTimeoutMs,
          workerName: cfg.workerName ?? defaults.workerName,
          startupJitterMaxSeconds: cfg.startupJitterMaxSeconds ?? defaults.startupJitterMaxSeconds,
        }
      : cfg;
    const worker = new JobWorker(this as any, merged as JobWorkerConfig);
    this._workers.push(worker);
    return worker;
  }

  /**
   * Create a threaded job worker that runs handler logic in a pool of worker threads.
   * The handler must be a separate module file that exports a default function with
   * signature `(job, client) => Promise<JobActionReceipt>`.
   *
   * This keeps the main event loop free for polling and I/O, dramatically improving
   * throughput for CPU-bound job handlers.
   *
   * Worker configuration fields inherit global defaults resolved via the
   * unified configuration (environment variables or equivalent `CAMUNDA_WORKER_*`
   * keys provided via `CamundaOptions.config`) when not explicitly set on the
   * config object.
   *
   * @param cfg Threaded worker configuration
   * @example Create a threaded job worker
   * ```ts
   * const worker = client.createThreadedJobWorker({
   *   jobType: 'cpu-heavy-task',
   *   handlerModule: './my-handler.js',
   *   maxParallelJobs: 32,
   *   jobTimeoutMs: 30000,
   * })
   * ```
   */
  createThreadedJobWorker<
    In extends import('zod').ZodTypeAny = any,
    Out extends import('zod').ZodTypeAny = any,
    Headers extends import('zod').ZodTypeAny = any,
  >(cfg: ThreadedJobWorkerConfig<In, Out, Headers>): ThreadedJobWorker {
    const defaults = this._config.workerDefaults;
    const merged = defaults
      ? {
          ...cfg,
          jobTimeoutMs: cfg.jobTimeoutMs ?? defaults.jobTimeoutMs,
          maxParallelJobs: cfg.maxParallelJobs ?? defaults.maxParallelJobs,
          pollTimeoutMs: cfg.pollTimeoutMs ?? defaults.pollTimeoutMs,
          workerName: cfg.workerName ?? defaults.workerName,
          startupJitterMaxSeconds: cfg.startupJitterMaxSeconds ?? defaults.startupJitterMaxSeconds,
        }
      : cfg;
    const pool = this._getOrCreateThreadPool(cfg.threadPoolSize);
    const worker = new ThreadedJobWorker(this as any, pool, merged as ThreadedJobWorkerConfig);
    this._workers.push(worker);
    return worker;
  }

  /**
   * Node-only convenience: deploy resources from local filesystem paths.
   * @param resourceFilenames Absolute or relative file paths to BPMN/DMN/form/resource files.
   * @param options Optional: tenantId.
   * @returns ExtendedDeploymentResult
   */
  deployResourcesFromFiles(
    resourceFilenames: string[],
    options?: { tenantId?: string }
    // @ts-ignore - ExtendedDeploymentResult is injected by code generation (CamundaClient.ts)
  ): CancelablePromise<ExtendedDeploymentResult> {
    return toCancelable(async (_signal) => {
      if (!Array.isArray(resourceFilenames) || resourceFilenames.length === 0) {
        throw new Error('resourceFilenames must be a non-empty string[]');
      }
      // Basic environment guard (avoid accidental browser usage)
      if (typeof process === 'undefined' || !process.versions?.node) {
        throw new Error('deployResourcesFromFiles is only available in Node.js environments');
      }
      // Dynamic imports so that bundlers can tree-shake for browser builds
      const [{ readFile }, pathMod] = await Promise.all([
        import('node:fs/promises'),
        import('node:path'),
      ]);
      // Best-effort MIME inference
      const mimeFor = (filename: string): string => {
        const ext = filename.toLowerCase().split('.').pop() || '';
        switch (ext) {
          case 'bpmn':
          case 'dmn':
          case 'xml':
            return 'application/xml';
          case 'json':
          case 'form':
            return 'application/json';
          default:
            return 'application/octet-stream';
        }
      };
      if (typeof File !== 'function') {
        throw new Error(
          'Global File constructor not available. Requires Node 18+ (fetch experimental) or Node 20+'
        );
      }
      const files: File[] = [];
      for (const p of resourceFilenames) {
        if (typeof p !== 'string' || !p) throw new Error('Invalid resource filename encountered');
        const data = await readFile(p);
        const name = pathMod.basename(p);
        files.push(new File([data as any], name, { type: mimeFor(name) }));
      }
      // @ts-ignore - createDeploymentInput type added during generation
      const payload: createDeploymentInput = {
        resources: files,
        ...(options?.tenantId ? { tenantId: options.tenantId } : {}),
      } as any;
      // @ts-ignore - createDeployment method injected by generator
      return this.createDeployment(payload);
    });
  }
}
