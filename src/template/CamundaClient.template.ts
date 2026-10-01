// TEMPLATE: Canonical Camunda class template (manually maintained)
// TEMPLATE: DO NOT add generated operation methods here; generator will produce CamundaClient.ts from this template.

import type * as Sdk from '../gen/sdk.gen';
import type { ProcessInstanceKey, ScopeKey, TenantId, VariableFilter } from '../gen/types.gen';
import { CamundaCore, type CamundaOptions } from '../runtime/camundaCore';
import { type CancelablePromise, toCancelable } from '../runtime/cancelable';
import { JobWorker, type JobWorkerConfig } from '../runtime/jobWorker';
import type { OperationOptions } from '../runtime/retry';
import { installSearchPagination, type WithSearchPagination } from '../runtime/searchPagination';
import { ThreadedJobWorker, type ThreadedJobWorkerConfig } from '../runtime/threadedJobWorker';
import { ThreadPool } from '../runtime/threadPool';
import {
  type AnyVariableSchema,
  collectTypedVariables,
  createVariableSearchFetchPage,
  type VariableMap,
  variableNamesFromSchema,
} from '../runtime/typedVariables';
import { node } from '#platform';

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
export type { CamundaOptions, CancelablePromise };

export function createCamundaClient(options?: CamundaOptions): CamundaClient {
  return new CamundaClient(options);
}

/**
 * The Camunda client's operation methods. Create clients with {@link createCamundaClient}
 * or {@link CamundaClient}, which add `.paginate(...)` to every search operation.
 */
export class CamundaClientBase extends CamundaCore {
  /** Registered job workers created via createJobWorker (lifecycle managed by user). */
  private _workers: any[] = [];
  /** Shared thread pool for all threaded job workers (lazy-initialised on first use). */
  private _threadPool: ThreadPool | null = null;

  constructor(opts: CamundaOptions = {}) {
    super(opts);
    // Attach `.paginate` to every search* operation (issue #3). One well-known
    // wiring point; discovers search methods generically (no per-op list).
    installSearchPagination(this);
  }

  // Helper for detecting documented void responses (stable public contract).
  // The generated per-operation functions carry their own copy of the set.
  // Uses build-time generated VOID_RESPONSES set (no runtime zod dependency needed)
  private _isVoidResponse(name: string): boolean {
    return VOID_RESPONSES.has(name);
  }

  // Lazy-load the full zod schema module. Returns cached module. Operations load
  // their own per-operation schema module instead (see operations.gen.ts); this
  // stays on the class (not the core) so the per-operation entry point does not
  // reference the whole schema module.
  private _schemasPromise: Promise<typeof import('../gen/zod.gen')> | null = null;
  private _loadSchemas(): Promise<typeof import('../gen/zod.gen')> {
    if (!this._schemasPromise) {
      this._schemasPromise = import('../gen/zod.gen');
    }
    return this._schemasPromise;
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
      if (!node || typeof process === 'undefined' || !process.versions?.node) {
        throw new Error('deployResourcesFromFiles is only available in Node.js environments');
      }
      // Node built-ins come from the #platform seam (undefined in browser builds)
      const {
        fsPromises: { readFile },
        path: pathMod,
      } = node;
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

  /**
   * Search for process variables and bind them to a Zod schema (the DTO).
   *
   * The schema's keys are the exact variable names to fetch; its shape drives validation. Only
   * those declared variables are queried (via a `name $in [...]` filter), so memory stays bound
   * by the DTO shape rather than the total number of variables on the instance. Results are
   * paged internally until every declared variable is found or the result set is exhausted.
   *
   * Returns a {@link VariableMap} offering lenient access (`has` / `get`) and a strict
   * `validate()` that parses the collected values against the schema — returning a fully-typed
   * object or throwing a `ZodError` when a required variable is missing or malformed.
   *
   * @param schema A Zod object schema declaring the variables to fetch.
   * @param options Query scope. `processInstanceKey` is required; `scopeKey` narrows to a single
   *   element-instance scope, `tenantId` filters by tenant, and `pageSize` tunes the page limit.
   *   `consistency` controls eventual-consistency tolerance for the underlying `searchVariables`
   *   calls: it defaults to `{ waitUpToMs: 0 }` (no waiting), but a non-zero `waitUpToMs` makes the
   *   paging calls poll until the data is consistent, avoiding intermittent missing variables /
   *   `ZodError` on a freshly-updated instance.
   * @throws {VariableScopeCollisionError} when a declared variable is found at more than one
   *   scope and no `scopeKey` was provided to disambiguate.
   * @throws {VariableDeserializationError} when a variable's value is not valid JSON.
   *
   * @example
   * ```ts
   * import { z } from 'zod';
   * const OrderVariables = z.object({ orderId: z.string(), amount: z.number().optional() });
   * const map = await client.searchVariablesAsDto(OrderVariables, { processInstanceKey });
   * if (map.has('amount')) console.log(map.get('amount'));
   * const order = map.validate(); // { orderId: string; amount?: number }
   * ```
   */
  searchVariablesAsDto<TSchema extends AnyVariableSchema>(
    schema: TSchema,
    options: {
      processInstanceKey: ProcessInstanceKey;
      scopeKey?: ScopeKey;
      tenantId?: TenantId;
      pageSize?: number;
      consistency?: { waitUpToMs: number; pollIntervalMs?: number };
    }
  ): CancelablePromise<VariableMap<TSchema>> {
    return toCancelable(async (signal) => {
      if (!options?.processInstanceKey) {
        throw new Error('searchVariablesAsDto requires options.processInstanceKey');
      }
      const names = variableNamesFromSchema(schema);
      const limit = options.pageSize && options.pageSize > 0 ? options.pageSize : 100;
      const filter: VariableFilter = {
        name: { $in: names },
        processInstanceKey: options.processInstanceKey,
      };
      if (options.scopeKey) filter.scopeKey = options.scopeKey;
      if (options.tenantId) filter.tenantId = options.tenantId;

      return collectTypedVariables({
        schema,
        // A single scopeKey restricts results to one scope, so each declared name appears at most
        // once and paging can stop as soon as all are found. Otherwise we page to exhaustion so a
        // same-name/different-scope collision on a later page surfaces as a VariableScopeCollisionError.
        singleScope: Boolean(options.scopeKey),
        // Eventual-consistency waiting happens at the collection level: re-read until every declared
        // variable is visible or the budget expires. The per-page search never waits — a paging read
        // that legitimately returns 0 items must not block, and waiting on the first search alone
        // settles on a partial result (its success condition is merely "any matching variable").
        consistency: options.consistency,
        fetchPage: createVariableSearchFetchPage({
          filter,
          limit,
          signal,
          // @ts-ignore - searchVariables method & input type injected by generator
          search: (input) => this.searchVariables(input, { consistency: { waitUpToMs: 0 } }),
        }),
      });
    });
  }
}

/**
 * Public Camunda client type: the base class augmented with `.paginate(...)` on
 * every `search*` operation. The `.paginate` methods are installed at runtime by
 * the constructor (via `installSearchPagination`), so both construction paths —
 * the `createCamundaClient` factory *and* direct `new CamundaClient()` — yield a
 * value whose static type matches the runtime shape.
 *
 * This is expressed as a separate type + value pair rather than
 * declaration-merging an interface onto the class because
 * `SearchPaginationApi<CamundaClient>` is self-referential (it maps over
 * `keyof CamundaClient`), which TypeScript rejects as an interface `extends`
 * clause ("recursively references itself as a base type").
 */
export type CamundaClient = WithSearchPagination<CamundaClientBase>;
export const CamundaClient = CamundaClientBase as unknown as {
  new (options?: CamundaOptions): CamundaClient;
} & typeof CamundaClientBase;
