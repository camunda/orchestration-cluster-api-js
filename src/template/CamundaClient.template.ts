/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable import/order */
// TEMPLATE: Canonical Camunda class template (manually maintained)
// TEMPLATE: DO NOT add generated operation methods here; generator will produce CamundaClient.ts from this template.
import { createClient } from '../gen/client/client.gen';
import * as Sdk from '../gen/sdk.gen';
import * as Schemas from '../gen/zod.gen';
import { createAuthFacade } from '../runtime/auth';
import type { CamundaConfig } from '../runtime/unifiedConfiguration';
import type { EnvOverrides } from '../runtime/configSchema';
import { hydrateConfig } from '../runtime/unifiedConfiguration';
import { ConsistencyOptions, eventualPoll } from '../runtime/eventual';
import { installAuthInterceptor } from '../runtime/installAuthInterceptor';
import { createLogger, Logger, LogLevel, LogTransport } from '../runtime/logger';
import {
  wrapFetch,
  withCorrelation as _withCorrelation,
  getCorrelation,
} from '../runtime/telemetry';
import { ValidationManager } from '../runtime/validationManager';
import type { Client } from '../gen/client/types.gen';
import { executeWithHttpRetry, defaultHttpClassifier } from '../runtime/retry';
import { normalizeError } from '../runtime/errors';
import { BackpressureManager } from '../runtime/backpressure';

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
  const p: any = new Promise<T>((resolve, reject) => {
    factory(ac.signal).then(resolve, reject);
  });
  p.cancel = () => ac.abort();
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
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();
  private _bp: BackpressureManager = new BackpressureManager();

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
    this._fetch = baseFetch;
    // Telemetry wrap (after logger & config known). If user provided explicit telemetry, honor it.
    // Else if environment enabled auto telemetry logging, wrap with mirrorToLog + optional correlation.
    if (opts.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: opts.telemetry.hooks,
        correlation: opts.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        mirrorToLog: opts.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        mirrorToLog: true,
      });
    }
    this._client = createClient({
      baseUrl: this._config.restAddress,
      fetch: this._fetch,
      throwOnError: opts.throwOnError !== false,
    });
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
    // Initialize global backpressure manager with tuned config
    this._bp = new BackpressureManager({
      logger: this._log.scope('bp'),
      config: {
        enabled: this._config.backpressure.enabled,
        initialMaxConcurrency: this._config.backpressure.initialMax || null,
        reduceFactor: this._config.backpressure.softFactor,
        severeReduceFactor: this._config.backpressure.severeFactor,
        recoveryIntervalMs: this._config.backpressure.recoveryIntervalMs,
        recoveryStep: this._config.backpressure.recoveryStep,
        decayQuietMs: this._config.backpressure.decayQuietMs,
        floorConcurrency: this._config.backpressure.floor,
        severeThreshold: this._config.backpressure.severeThreshold,
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
    if (next.fetch) this._fetch = next.fetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Re-wrap fetch if telemetry present OR env auto telemetry toggled
    if (next.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: next.telemetry.hooks,
        correlation: next.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        mirrorToLog: next.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
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

  // Run a function with a correlation ID (manual propagation phase 1)
  withCorrelation<T>(id: string, fn: () => Promise<T> | T): Promise<T> {
    return _withCorrelation(id, fn);
  }

  // Helper for detecting documented void responses (stable public contract)
  // Referenced from generated code - DO NOT REMOVE
  private _isVoidResponse(name: string): boolean {
    try {
      return (Schemas as any)[name]?.type === 'void';
    } catch {
      return false;
    }
  }

  /** Internal invocation helper to apply global backpressure gating + retry + normalization */
  public async _invokeWithRetry<T>(
    op: () => Promise<T>,
    opts: {
      opId: string;
      exempt?: boolean;
      classify?: (e: any) => { retryable: boolean; reason: string };
    }
  ): Promise<T> {
    const { opId, exempt, classify } = opts;
    const signal: AbortSignal | undefined = undefined; // placeholder if we later pass through
    if (!exempt) {
      await this._bp.acquire(signal);
    }
    try {
      const result = await executeWithHttpRetry(
        async () => op(),
        this._config.httpRetry,
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
  /** Public accessor for current backpressure adaptive limiter state (stable) */
  getBackpressureState() {
    try {
      return this._bp.getState();
    } catch {
      return {
        severity: 'healthy',
        permitsMax: null,
        permitsCurrent: 0,
        consecutive: 0,
        waiters: 0,
      };
    }
  }
  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // === AUTO-GENERATED CAMUNDA METHODS END ===

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
