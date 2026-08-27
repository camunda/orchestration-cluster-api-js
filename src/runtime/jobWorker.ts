import type { z } from 'zod';
import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivateJobsResponses } from '../gen/types.gen';
import type { EnrichedActivatedJob } from './jobActions';
import {
  DEFAULT_POLL_BACKOFF_MAX_MS,
  DEFAULT_POLL_BACKOFF_MIN_MS,
  nextActivationRetryDelayMs,
} from './pollBackoff';
import { stopWorkerGracefully } from './workerGracefulStop';
import { WorkerStartGate } from './workerStartGate';

type ActivatedJobResult = ActivateJobsResponses[200]['jobs'][number];

/** Unique receipt symbol returned by job action methods. */
// Unique symbol used as opaque receipt sentinel for completed job actions.
export const JobActionReceipt = 'JOB_ACTION_RECEIPT' as const;
export type JobActionReceipt = typeof JobActionReceipt;

export interface JobWorkerConfig<
  In extends z.ZodTypeAny = any,
  Out extends z.ZodTypeAny = any,
  Headers extends z.ZodTypeAny = any,
> {
  /** Zod schema for variables in the activated job */
  inputSchema?: In;
  /** Zod schema for variables in the complete command */
  outputSchema?: Out;
  /** Zod schema for custom headers in the activated job */
  customHeadersSchema?: Headers;
  /** Backoff between polls - default 1ms */
  pollIntervalMs?: number;
  /**
   * Floor (ms) of the exponential backoff applied between *failed* activation
   * requests (connection refused, connect timeout, broker restart, LAN blip …).
   * The first retry waits ≈ this/2–this ms; subsequent consecutive failures
   * double the window up to {@link pollBackoffMaxMs}, with jitter, and reset to
   * zero on the first successful poll. Default `1000`. Set to `0` to disable backoff (failed polls then fall back to {@link pollIntervalMs} rather than retrying immediately).
   */
  pollBackoffMinMs?: number;
  /**
   * Ceiling (ms) of the between-failed-poll exponential backoff. Default `30000`.
   */
  pollBackoffMaxMs?: number;
  jobHandler: (job: Job<In, Headers>) => Promise<JobActionReceipt> | JobActionReceipt;
  /** Immediately start polling for work - default `true` */
  autoStart?: boolean;
  /** Concurrency limit — default `10`. Overridden by CAMUNDA_WORKER_MAX_CONCURRENT_JOBS env var. */
  maxParallelJobs?: number;
  /**
   * The request will be completed when at least one job is activated or after the requestTimeout.
   * If the requestTimeout = 0, the request will be completed after a default configured timeout in the broker.
   * To immediately complete the request when no job is activated set the requestTimeout to a negative value
   *
   */
  pollTimeoutMs?: number;
  /** Job activation timeout in ms — default `60000`. Overridden by CAMUNDA_WORKER_TIMEOUT env var. */
  jobTimeoutMs?: number;
  /** Zeebe job type */
  jobType: string;
  /** Optional list of variable names to fetch during activation */
  fetchVariables?: In extends z.ZodTypeAny ? Array<Extract<keyof z.infer<In>, string>> : string[];
  /** @deprecated Not used; pacing handled by long polling + client backpressure. Present only for migration compatibility. */
  maxBackoffTimeMs?: number;
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
}

/**
 * Internal shape after constructor defaults are applied: the defaulted fields
 * become required so the class body needs no non-null assertions on them. The
 * constructor's spread literal is checked against this type, so adding a new
 * defaulted field here without a matching default in the spread is a compile error.
 */
type ResolvedJobWorkerConfig = JobWorkerConfig & {
  pollIntervalMs: number;
  pollBackoffMinMs: number;
  pollBackoffMaxMs: number;
  autoStart: boolean;
  validateSchemas: boolean;
  maxParallelJobs: number;
  jobTimeoutMs: number;
};

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

const DEFAULT_LONGPOLL_TIMEOUT = 0;

export class JobWorker {
  private _client: CamundaClient;
  private _cfg: ResolvedJobWorkerConfig;
  private _maxParallelJobs: number;
  private _jobTimeoutMs: number;
  private _name: string;
  private _activeJobs = 0;
  private _stopped = false;
  private _pollWait: AbortController | null = null;
  private _inFlightActivation: any = null; // CancelablePromise-like
  /** Consecutive failed activation requests; drives the retry backoff, reset on success. */
  private _consecutiveActivationErrors = 0;
  private _log: ReturnType<CamundaClient['logger']>;
  private _startGate: WorkerStartGate;

  constructor(client: CamundaClient, cfg: JobWorkerConfig) {
    this._client = client;
    // Nullish-coalesce each defaulted field so an explicitly-passed `undefined`
    // cannot wipe out a required runtime default (a plain `{...defaults, ...cfg}`
    // spread would let `maxParallelJobs: undefined` override the default).
    this._cfg = {
      ...cfg,
      pollIntervalMs: cfg.pollIntervalMs ?? 1,
      pollBackoffMinMs: cfg.pollBackoffMinMs ?? DEFAULT_POLL_BACKOFF_MIN_MS,
      pollBackoffMaxMs: cfg.pollBackoffMaxMs ?? DEFAULT_POLL_BACKOFF_MAX_MS,
      autoStart: cfg.autoStart ?? true,
      validateSchemas: cfg.validateSchemas ?? false,
      maxParallelJobs: cfg.maxParallelJobs ?? 10,
      jobTimeoutMs: cfg.jobTimeoutMs ?? 60_000,
    };
    this._maxParallelJobs = this._cfg.maxParallelJobs;
    this._jobTimeoutMs = this._cfg.jobTimeoutMs;
    this._name = cfg.workerName || `worker-${cfg.jobType}-${++_workerCounter}`;
    this._log = this._client.logger().scope(`worker:${this._name}`);
    if (cfg.maxBackoffTimeMs !== undefined) {
      this._log.debug(() => [
        'worker.config.deprecated',
        { maxBackoffTimeMs: cfg.maxBackoffTimeMs },
      ]);
    }
    // The plain worker's transport (the HTTP client) is constructed synchronously,
    // so its readiness signal is already-resolved. The gate is still required: it
    // holds the first poll until after the tick in which the factory returns the
    // handle, and it makes start() idempotent across the whole worker lifetime.
    this._startGate = new WorkerStartGate(
      () => Promise.resolve(),
      () => this._stopped
    );
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

  /**
   * Begin polling for jobs. Safe to call at any point: the request is buffered
   * until the transport is ready, and redundant calls (including an explicit
   * call on an `autoStart` worker) are dropped rather than starting a second
   * poll loop. Once the worker is stopped, `start()` is a no-op.
   */
  start() {
    if (this._stopped) return;
    const accepted = this._startGate.request(
      () => this._beginPolling(),
      (err) => this._log.error('worker.start.transportError', err)
    );
    if (!accepted) {
      this._log.debug('worker.start.alreadyRequested');
      return;
    }
    this._log.info('worker.start');
  }

  private _beginPolling() {
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
    this._pollWait?.abort();
    this._pollWait = null;
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
    return stopWorkerGracefully(
      {
        haltPolling: () => {
          this._stopped = true;
          this._pollWait?.abort();
          this._pollWait = null;
        },
        activeJobs: () => this._activeJobs,
        inFlightActivation: () => this._inFlightActivation,
        log: this._log,
      },
      opts
    );
  }

  private _scheduleNext(delayMs: number) {
    if (this._stopped) return;
    const wait = new AbortController();
    this._pollWait = wait;
    // Rejects when stop() aborts the wait; nothing to do in that case.
    void this._client.clock.sleep(delayMs, wait.signal).then(
      () => {
        if (this._pollWait === wait) this._pollWait = null;
        void this._poll();
      },
      () => {}
    );
  }

  private async _poll() {
    if (this._stopped) return;
    // If at capacity, defer
    if (this._activeJobs >= this._maxParallelJobs) {
      this._scheduleNext(this._cfg.pollIntervalMs);
      return;
    }
    const batchSize = this._maxParallelJobs - this._activeJobs;
    if (batchSize <= 0) {
      this._scheduleNext(this._cfg.pollIntervalMs);
      return;
    }
    // Activation body shape inferred – using common fields
    const body = {
      type: this._cfg.jobType,
      worker: this._name,
      maxJobsToActivate: batchSize,
      requestTimeout: this._cfg.pollTimeoutMs ?? DEFAULT_LONGPOLL_TIMEOUT,
      timeout: this._jobTimeoutMs,
      // API expects `fetchVariable`; map from config `fetchVariables`
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
      // A successful poll (jobs or an empty long-poll) proves connectivity —
      // clear the failure streak so the next error starts backoff from the floor.
      this._consecutiveActivationErrors = 0;
      result = activation?.jobs || [];
      this._log.debug(() => ['activation.response', { jobs: result.length }]);
    } catch (e) {
      this._inFlightActivation = null;
      if (this._stopped) return; // Ignore errors after stop
      // Suppress logging + backoff for intentional cancellation (user-initiated stop).
      if ((e as any)?.name === 'CancelSdkError') {
        this._log.debug('activation.cancelled');
        this._scheduleNext(this._cfg.pollIntervalMs);
        return;
      }
      // Any non-cancellation activation failure: back off exponentially (with
      // jitter) so a sustained fault — a transport outage (broker restart, LAN
      // blip, DNS flap) or a persistent server/auth/validation error — does not
      // turn into a tight sub-millisecond retry loop that floods logs and hammers
      // the endpoint. Transport outages are the motivating case, but backing off
      // on *every* recurring failure is deliberate: it is the safe default that
      // keeps the retry cadence bounded regardless of the error class. Resets to
      // the floor on the next successful poll.
      this._consecutiveActivationErrors += 1;
      // nextActivationRetryDelayMs is the single source of truth shared with
      // ThreadedJobWorker so the two implementations cannot drift. When backoff
      // is disabled (pollBackoffMinMs <= 0) it falls back to the normal poll
      // interval rather than 0, which would spin an even tighter retry loop than
      // the old behaviour — the opposite of what "disable" should mean.
      const delayMs = nextActivationRetryDelayMs(this._consecutiveActivationErrors, this._cfg);
      this._log.error('activation.error', e);
      this._log.debug(() => [
        'activation.retry',
        { attempt: this._consecutiveActivationErrors, retryInMs: delayMs },
      ]);
      this._scheduleNext(delayMs);
      return;
    }
    if (!result || result.length === 0) {
      // No jobs – simply schedule next poll
      this._scheduleNext(this._cfg.pollIntervalMs);
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
