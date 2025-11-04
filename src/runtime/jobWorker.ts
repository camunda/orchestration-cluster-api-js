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
  pollIntervalMs?: number; // default 1ms
  jobHandler: (job: Job<In, Headers>) => Promise<JobActionReceipt> | JobActionReceipt;
  autoStart?: boolean; // default true
  maxParallelJobs: number; // concurrency limit
  timeoutMs: number; // requestTimeout for activation long poll
  jobType: string; // Zeebe job type
  /** @deprecated Not used; pacing handled by long polling + client backpressure. Present only for migration compatibility. */
  maxBackoffTimeMs?: number;
  workerName?: string; // optional explicit name
  validateSchemas?: boolean; // default false
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
      requestTimeout: this._cfg.timeoutMs,
      timeout: this._cfg.timeoutMs,
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
      this._log.error('activation.error', e);
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
        await (this._client as any).failJob({
          jobKey: raw.jobKey,
          errorMessage: e?.message || 'Handler error',
          retries:
            typeof (raw as any).retries === 'number'
              ? Math.max(0, (raw as any).retries - 1)
              : undefined,
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
      await (this._client as any).failJob({ jobKey: raw.jobKey, errorMessage: msg });
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
