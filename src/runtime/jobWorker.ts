import { z } from 'zod';

import type { EnrichedActivatedJob } from './jobActions';
import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivatedJobResult } from '../gen/types.gen';

/** Unique receipt symbol returned by job action methods. */
// Unique symbol used as opaque receipt sentinel for completed job actions.
export const JobActionReceipt = 'JOB_ACTION_RECEIPT' as const;
export type JobActionReceipt = typeof JobActionReceipt;

export interface JobWorkerConfig<
  In extends z.ZodTypeAny = any,
  Out extends z.ZodTypeAny = any,
  Headers extends z.ZodTypeAny = any,
> {
  inputSchema?: In;
  outputSchema?: Out;
  customHeadersSchema?: Headers;
  /* Backoff between polls - default 1ms */
  pollIntervalMs?: number;
  jobHandler: (job: Job<In, Headers>) => Promise<JobActionReceipt> | JobActionReceipt;
  /* default true */
  autoStart?: boolean;
  /* concurrency limit */
  maxParallelJobs: number;
  /* requestTimeout for activation long poll - default 55_000 */
  pollTimeoutMs?: number;
  /* Job activation timeout */
  jobTimeoutMs: number;
  /* Zeebe job type */
  jobType: string;
  /** @deprecated Not used; pacing handled by long polling + client backpressure. Present only for migration compatibility. */
  maxBackoffTimeMs?: number;
  /* Optional explicit name */
  workerName?: string;
  /* default false */
  validateSchemas?: boolean;
}

type InferOrUnknown<T extends z.ZodTypeAny | undefined> = T extends z.ZodTypeAny
  ? z.infer<T>
  : Record<string, unknown>;

export type Job<
  In extends z.ZodTypeAny | undefined,
  Headers extends z.ZodTypeAny | undefined,
> = EnrichedActivatedJob & {
  variables: InferOrUnknown<In>;
  customHeaders: InferOrUnknown<Headers>;
};

let _workerCounter = 0;

const DEFAULT_LONGPOLL_TIMEOUT = 55_000;

export class JobWorker {
  private _client: CamundaClient;
  private _cfg: JobWorkerConfig;
  private _name: string;
  private _activeJobs = 0;
  private _stopped = false;
  private _pollTimer: any = null;
  private _inFlightActivation: any = null; // CancelablePromise-like
  private _log: ReturnType<CamundaClient['logger']>;

  constructor(client: CamundaClient, cfg: JobWorkerConfig) {
    this._client = client;
    this._cfg = { pollIntervalMs: 1, autoStart: true, validateSchemas: false, ...cfg };
    this._name = cfg.workerName || `worker-${cfg.jobType}-${++_workerCounter}`;
    this._log = this._client.logger().scope(`worker:${this._name}`);
    if (cfg.maxBackoffTimeMs !== undefined) {
      this._log.debug(() => [
        'worker.config.deprecated',
        { maxBackoffTimeMs: cfg.maxBackoffTimeMs },
      ]);
    }
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

  start() {
    if (this._stopped) return;
    if (this._pollTimer) return; // already running
    this._log.info('worker.start');
    this._scheduleNext(0);
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

  /**
   * Gracefully stop the worker: prevent new polls, allow any in-flight activation to finish
   * without cancellation, and wait for currently active jobs to drain (be acknowledged) up to waitUpToMs.
   * If timeout is reached, falls back to hard stop logic (cancels activation if still pending).
   */
  async stopGracefully(opts?: { waitUpToMs?: number; checkIntervalMs?: number }) {
    const waitUpToMs = opts?.waitUpToMs ?? 5000;
    const checkIntervalMs = opts?.checkIntervalMs ?? 10;
    this._stopped = true;
    if (this._pollTimer) clearTimeout(this._pollTimer);
    this._pollTimer = null;
    const start = Date.now();
    // Wait for activation to settle (do not cancel proactively)
    if (this._inFlightActivation) {
      try {
        await Promise.race([
          this._inFlightActivation,
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error('activation.wait.timeout')), waitUpToMs)
          ),
        ]);
      } catch (e: any) {
        // If activation timed out, we will proceed to fallback below.
        if (e && e.message === 'activation.wait.timeout') {
          this._log.debug('worker.gracefulStop.activationTimeout');
        }
      }
    }
    // Wait for active jobs to drain
    while (this._activeJobs > 0 && Date.now() - start < waitUpToMs) {
      await new Promise((r) => setTimeout(r, checkIntervalMs));
    }
    const timedOut = this._activeJobs > 0;
    if (timedOut) {
      // Fallback: cancel activation if still present and perform hard stop semantics.
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

  private _scheduleNext(delayMs: number) {
    if (this._stopped) return;
    this._pollTimer = setTimeout(() => this._poll(), delayMs);
  }

  private async _poll() {
    this._pollTimer = null;
    if (this._stopped) return;
    // If at capacity, defer
    if (this._activeJobs >= this._cfg.maxParallelJobs) {
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    const batchSize = this._cfg.maxParallelJobs - this._activeJobs;
    if (batchSize <= 0) {
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    // Activation body shape inferred – using common fields
    const body = {
      type: this._cfg.jobType,
      worker: this._name,
      maxJobsToActivate: batchSize,
      requestTimeout: this._cfg.pollTimeoutMs ?? DEFAULT_LONGPOLL_TIMEOUT,
      timeout: this._cfg.jobTimeoutMs,
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
      if (this._stopped) return; // Ignore errors after stop
      // Suppress logging for intentional cancellation (user-initiated stop).
      if ((e as any)?.name === 'CancelSdkError') {
        this._log.debug('activation.cancelled');
      } else {
        this._log.error('activation.error', e);
      }
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    if (!result || result.length === 0) {
      // No jobs – simply schedule next poll
      this._scheduleNext(this._cfg.pollIntervalMs!);
      return;
    }
    this._activeJobs += result.length;
    // Immediately schedule next poll (long polling already provided delay)
    this._scheduleNext(0);
    for (const raw of result) {
      this._handleJob(raw).catch((err) => {
        this._log.error('job.handler.unexpected', err);
      });
    }
  }

  private async _handleJob(raw: ActivatedJobResult & Partial<EnrichedActivatedJob>) {
    if (this._stopped) {
      this._decrementOnce();
      return;
    }
    // Validation of input/custom headers
    let variables: any = raw.variables;
    let headers: any = raw.customHeaders;
    if (this._cfg.validateSchemas) {
      if (this._cfg.inputSchema) {
        const parsed = this._cfg.inputSchema.safeParse(variables);
        if (!parsed.success) {
          this._log.warn('job.validation.variables.failed', parsed.error.flatten());
          await this._failValidation(raw as ActivatedJobResult, 'Invalid variables');
          return;
        }
        variables = parsed.data;
      }
      if (this._cfg.customHeadersSchema) {
        const parsed = this._cfg.customHeadersSchema.safeParse(headers);
        if (!parsed.success) {
          this._log.warn('job.validation.headers.failed', parsed.error.flatten());
          await this._failValidation(raw as ActivatedJobResult, 'Invalid custom headers');
          return;
        }
        headers = parsed.data;
      }
    }
    // Mutate enriched job with validated data if present
    const job: Job<any, any> = Object.assign(raw, { variables, customHeaders: headers }) as Job<
      any,
      any
    >;
    try {
      const receipt = await this._cfg.jobHandler(job);
      if (!job.acknowledged) {
        this._log.warn('job.handler.noAction', { jobKey: raw.jobKey });
      }
      return receipt;
    } catch (e: any) {
      this._log.error('job.handler.error', e);
      try {
        const retries = raw.retries;
        await this._client.failJob({
          jobKey: raw.jobKey,
          errorMessage: e?.message || 'Handler error',
          retries: typeof retries === 'number' ? Math.max(0, retries - 1) : 0,
        });
      } catch (failErr) {
        this._log.error('job.fail.error', failErr);
      }
      return JobActionReceipt;
    } finally {
      this._decrementOnce();
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
