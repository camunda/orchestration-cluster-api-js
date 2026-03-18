import { z } from 'zod';

import type { EnrichedActivatedJob } from './jobActions';
import type { JobActionReceipt } from './jobWorker';
import type { ThreadPool } from './threadPool';
import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivateJobsResponses } from '../gen/types.gen';

type ActivatedJobResult = ActivateJobsResponses[200]['jobs'][number];

/**
 * The job object received by a threaded handler.
 * Same shape as EnrichedActivatedJob but without the logger (not available across threads).
 */
export type ThreadedJob = Omit<EnrichedActivatedJob, 'log'>;

/**
 * Handler function signature for threaded job workers.
 *
 * Import this type in your handler module for full intellisense on `job` and `client`:
 *
 * ```ts
 * import type { ThreadedJobHandler } from '@camunda8/orchestration-cluster-api';
 *
 * const handler: ThreadedJobHandler = async (job, client) => {
 *   // full intellisense for job.variables, job.complete(), client.publishMessage(), etc.
 *   return job.complete({ result: 'done' });
 * };
 * export default handler;
 * ```
 */
export type ThreadedJobHandler = (
  job: ThreadedJob,
  client: CamundaClient
) => Promise<JobActionReceipt> | JobActionReceipt;

/**
 * Configuration for a threaded job worker.
 * Same as JobWorkerConfig but replaces `jobHandler` with `handlerModule`.
 */
export interface ThreadedJobWorkerConfig<
  In extends z.ZodTypeAny = any,
  Out extends z.ZodTypeAny = any,
  Headers extends z.ZodTypeAny = any,
> {
  /** Absolute or relative path to a JS/TS module that exports a default handler function.
   *  The function signature must be: `(job, client) => Promise<JobActionReceipt>` */
  handlerModule: string;
  /** Zod schema for variables in the activated job */
  inputSchema?: In;
  /** Zod schema for variables in the complete command */
  outputSchema?: Out;
  /** Zod schema for custom headers in the activated job */
  customHeadersSchema?: Headers;
  /** Backoff between polls - default 1ms */
  pollIntervalMs?: number;
  /** Immediately start polling for work - default `true` */
  autoStart?: boolean;
  /** concurrency limit */
  maxParallelJobs: number;
  /**
   * The request will be completed when at least one job is activated or after the requestTimeout.
   * If the requestTimeout = 0, the request will be completed after a default configured timeout in the broker.
   * To immediately complete the request when no job is activated set the requestTimeout to a negative value
   */
  pollTimeoutMs?: number;
  /** Job activation timeout */
  jobTimeoutMs: number;
  /** Zeebe job type */
  jobType: string;
  /** Optional list of variable names to fetch during activation */
  fetchVariables?: In extends z.ZodTypeAny ? Array<Extract<keyof z.infer<In>, string>> : string[];
  /** Optional explicit name */
  workerName?: string;
  /**
   * Maximum random delay (in seconds) before the worker starts polling.
   * When multiple application instances restart simultaneously, this spreads out
   * initial activation requests to avoid saturating the server.
   * `0` (the default) means no delay.
   */
  startupJitterMaxSeconds?: number;
  /**
   * Validate any provided input, output, customheader schema
   * default: false
   **/
  validateSchemas?: boolean;
  /**
   * Number of threads in the shared pool (used only when the pool is first created;
   * subsequent workers share the existing pool).
   * Default: number of CPU cores available to the process.
   */
  threadPoolSize?: number;
}

let _workerCounter = 0;

const DEFAULT_LONGPOLL_TIMEOUT = 0;

/**
 * A job worker that runs handler logic in a shared pool of worker_threads,
 * keeping the main Node.js event loop free for polling and I/O.
 *
 * The thread pool is owned by CamundaClient and shared across all threaded workers.
 * Each thread is generic — the handler module path is sent with each job,
 * and threads cache loaded handlers by module path.
 */
export class ThreadedJobWorker {
  private _client: CamundaClient;
  private _pool: ThreadPool;
  private _cfg: ThreadedJobWorkerConfig;
  private _name: string;
  private _activeJobs = 0;
  private _stopped = false;
  private _pollTimer: any = null;
  private _inFlightActivation: any = null;
  private _log: ReturnType<CamundaClient['logger']>;
  private _jobQueue: Array<{ raw: ActivatedJobResult & Partial<EnrichedActivatedJob> }> = [];

  constructor(client: CamundaClient, pool: ThreadPool, cfg: ThreadedJobWorkerConfig) {
    this._client = client;
    this._pool = pool;
    this._cfg = { pollIntervalMs: 1, autoStart: true, validateSchemas: false, ...cfg };
    this._name = cfg.workerName || `threaded-worker-${cfg.jobType}-${++_workerCounter}`;
    this._log = this._client.logger().scope(`worker:${this._name}`);

    if (this._cfg.autoStart) this.start();
  }

  get name() {
    return this._name;
  }
  get activeJobs() {
    return this._activeJobs;
  }
  get stopped() {
    return this._stopped;
  }
  /** Number of threads in the shared pool. */
  get poolSize() {
    return this._pool.size;
  }
  /** Number of threads currently processing a job (across all workers). */
  get busyThreads() {
    return this._pool.busyCount;
  }
  /** Resolves when the shared thread pool has finished initialising. */
  get ready(): Promise<void> {
    return this._pool.ready;
  }

  start() {
    if (this._stopped) return;
    if (this._pollTimer) return;
    this._log.info('worker.start');
    const jitterMax = this._cfg.startupJitterMaxSeconds ?? 0;
    if (jitterMax > 0) {
      const jitterMs = Math.floor(Math.random() * jitterMax * 1000);
      this._log.info(() => ['worker.start.jitter', { delayMs: jitterMs }]);
      this._scheduleNext(jitterMs);
    } else {
      this._scheduleNext(0);
    }
  }

  stop() {
    this._stopped = true;
    if (this._pollTimer) clearTimeout(this._pollTimer);
    this._pollTimer = null;
    if (this._inFlightActivation?.cancel) {
      try {
        this._inFlightActivation.cancel();
      } catch {
        /* ignore */
      }
    }
    this._log.info('worker.stop');
  }

  async stopGracefully(opts?: { waitUpToMs?: number; checkIntervalMs?: number }) {
    const waitUpToMs = opts?.waitUpToMs ?? 5000;
    const checkIntervalMs = opts?.checkIntervalMs ?? 10;
    this._stopped = true;
    if (this._pollTimer) clearTimeout(this._pollTimer);
    this._pollTimer = null;
    const start = Date.now();
    if (this._inFlightActivation) {
      try {
        await Promise.race([
          this._inFlightActivation,
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error('activation.wait.timeout')), waitUpToMs)
          ),
        ]);
      } catch (e: any) {
        if (e && e.message === 'activation.wait.timeout') {
          this._log.debug('worker.gracefulStop.activationTimeout');
        }
      }
    }
    while (this._activeJobs > 0 && Date.now() - start < waitUpToMs) {
      await new Promise((r) => setTimeout(r, checkIntervalMs));
    }
    const timedOut = this._activeJobs > 0;
    if (timedOut) {
      if (this._inFlightActivation?.cancel) {
        try {
          this._inFlightActivation.cancel();
        } catch {
          /* ignore */
        }
      }
      this._log.debug('worker.gracefulStop.timeout', { remaining: this._activeJobs });
    } else {
      this._log.debug('worker.gracefulStop.done');
    }
    return { remainingJobs: this._activeJobs, timedOut };
  }

  // ─── Job dispatch ───

  private _drainQueue() {
    while (this._jobQueue.length > 0) {
      const idle = this._pool.getIdleWorker();
      if (!idle) break;
      const item = this._jobQueue.shift()!;
      this._dispatchToThread(idle, item.raw);
    }
  }

  private async _dispatchToThread(
    pw: import('./threadPool').PoolWorker,
    raw: ActivatedJobResult & Partial<EnrichedActivatedJob>
  ) {
    const jobData = this._serializeJob(raw);

    this._pool.dispatch(pw, jobData, this._cfg.handlerModule, {
      onComplete: () => {
        this._decrementOnce();
        this._drainQueue();
      },
      onError: (err) => {
        this._log.error('job.thread.error', { jobKey: raw.jobKey, err });
        this._client
          .failJob({
            jobKey: raw.jobKey!,
            errorMessage: err?.message || 'Thread handler error',
            retries: typeof raw.retries === 'number' ? Math.max(0, raw.retries - 1) : 0,
          })
          .catch((failErr: any) => {
            this._log.error('job.fail.error', failErr);
          })
          .finally(() => {
            this._decrementOnce();
            this._drainQueue();
          });
      },
    });
  }

  private _serializeJob(
    raw: ActivatedJobResult & Partial<EnrichedActivatedJob>
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'function') continue;
      if (key === 'log') continue;
      data[key] = value;
    }
    return JSON.parse(JSON.stringify(data));
  }

  // ─── Polling (same pattern as JobWorker) ───

  private _scheduleNext(delayMs: number) {
    if (this._stopped) return;
    this._pollTimer = setTimeout(() => this._poll(), delayMs);
  }

  private async _poll() {
    this._pollTimer = null;
    if (this._stopped) return;
    // Ensure shared thread pool is ready before polling
    await this._pool.ready;
    if (this._activeJobs >= this._cfg.maxParallelJobs) {
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    // Cap activation to idle threads to avoid client-side queueing.
    const availableThreads = this._pool.idleCount;
    const batchSize = Math.min(this._cfg.maxParallelJobs - this._activeJobs, availableThreads);
    if (batchSize <= 0) {
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    const body = {
      type: this._cfg.jobType,
      worker: this._name,
      maxJobsToActivate: batchSize,
      requestTimeout: this._cfg.pollTimeoutMs ?? DEFAULT_LONGPOLL_TIMEOUT,
      timeout: this._cfg.jobTimeoutMs,
      ...(this._cfg.fetchVariables && this._cfg.fetchVariables.length > 0
        ? { fetchVariable: this._cfg.fetchVariables }
        : {}),
    };
    this._log.debug(() => ['activation.request', { batchSize }]);
    let result: ActivatedJobResult[] = [];
    try {
      this._inFlightActivation = this._client.activateJobs(body);
      const activation = await this._inFlightActivation;
      this._inFlightActivation = null;
      result = activation?.jobs || [];
      this._log.debug(() => ['activation.response', { jobs: result.length }]);
    } catch (e) {
      this._inFlightActivation = null;
      if (this._stopped) return;
      if ((e as any)?.name === 'CancelSdkError') {
        this._log.debug('activation.cancelled');
      } else {
        this._log.error('activation.error', e);
      }
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    if (!result || result.length === 0) {
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    this._activeJobs += result.length;
    this._scheduleNext(0);
    for (const raw of result) {
      this._handleJob(raw as ActivatedJobResult & Partial<EnrichedActivatedJob>);
    }
  }

  private _handleJob(raw: ActivatedJobResult & Partial<EnrichedActivatedJob>) {
    if (this._stopped) {
      this._decrementOnce();
      return;
    }
    let variables: any = raw.variables;
    let headers: any = raw.customHeaders;
    if (this._cfg.validateSchemas) {
      if (this._cfg.inputSchema) {
        const parsed = this._cfg.inputSchema.safeParse(variables);
        if (!parsed.success) {
          this._log.warn('job.validation.variables.failed', parsed.error.flatten());
          this._failValidation(raw as ActivatedJobResult, 'Invalid variables');
          return;
        }
        variables = parsed.data;
      }
      if (this._cfg.customHeadersSchema) {
        const parsed = this._cfg.customHeadersSchema.safeParse(headers);
        if (!parsed.success) {
          this._log.warn('job.validation.headers.failed', parsed.error.flatten());
          this._failValidation(raw as ActivatedJobResult, 'Invalid custom headers');
          return;
        }
        headers = parsed.data;
      }
    }
    const enriched = Object.assign(raw, { variables, customHeaders: headers });
    const idle = this._pool.getIdleWorker();
    if (idle) {
      this._dispatchToThread(idle, enriched);
    } else {
      this._jobQueue.push({ raw: enriched });
    }
  }

  private async _failValidation(raw: ActivatedJobResult, msg: string) {
    try {
      await this._client.failJob({ jobKey: raw.jobKey, errorMessage: msg });
    } catch (e) {
      this._log.error('job.fail.validation.error', e);
    } finally {
      this._decrementOnce();
    }
  }

  private _decrementOnce() {
    this._activeJobs = Math.max(0, this._activeJobs - 1);
  }
}
