// Effect-native job-worker surface for the Camunda client.
//
// Where `./effect` (see `effect.ts`) gives an Effect surface over the *single-call*
// client (deploy/create/search/…), this adds the Effect surface for **job workers**:
// the long-running `activateJobs` → handle → `completeJob`/`failJob` loop.
//
// It composes over the existing client machinery — activation goes through the same
// `activateJobs` call (and therefore the same backpressure/retry runtime) as the
// Promise worker — rather than reimplementing activation. What it adds on top is
// Effect-native:
//   - a job handler `(job) => Effect<CompleteVars, JobError, R>` with a **typed
//     failure channel** (retryable → `failJob` with decremented retries; terminal →
//     `throwJobError`/incident);
//   - **`Schedule`** for activation backoff and in-handler retry, both running on the
//     Effect `Clock` (so `TestClock` makes their timing virtual in tests);
//   - **`Stream`** with bounded `concurrency` for backpressure over the activation loop;
//   - **`Layer`**/**`Scope`** DI + lifecycle: the worker forks into a scope and is
//     interrupted (with a best-effort lease release) when the scope closes.
//
// `effect` remains an OPTIONAL peer dependency: importing this module (via the
// `./effect` subpath) is the only way to pull `effect` into the runtime graph. The
// main `.` (Promise) worker API is untouched.

import { Data, Duration, Effect, Fiber, Layer, type Schedule, type Scope, Stream } from 'effect';
import { CamundaEffect, type DomainError } from './effect';
import type { ActivatedJobResult } from './gen/types.gen';

// --- Job shape ------------------------------------------------------------------

/**
 * A single activated job handed to an Effect handler. This is the raw activation
 * payload (variables + custom headers + lifecycle keys); acknowledgement is driven
 * by the value/error the handler's `Effect` produces, not by imperative methods.
 */
export type Job = ActivatedJobResult;

/** Variables to complete a job with. `void`/`undefined` completes with no variables. */
// biome-ignore lint/suspicious/noConfusingVoidType: a handler may complete a job with no variables, i.e. return Effect<void>
export type CompleteVars = { readonly [key: string]: unknown } | void | undefined;

// --- Typed job-failure channel --------------------------------------------------
//
// A handler discriminates its two failure modes with tagged errors instead of a
// hand-rolled classification: a **retryable** failure decrements retries and calls
// `failJob` (optionally after in-handler `Schedule` retries); a **terminal** failure
// raises a BPMN error / incident via `throwJobError`.

/**
 * A retryable job failure: the handler could not complete the job now, but a later
 * activation might succeed. Mapped to `failJob` with `retries - 1` and an optional
 * server-side re-activation backoff.
 */
export class RetryableJobError extends Data.TaggedError('RetryableJobError')<{
  readonly message: string;
  /** Server-side delay before the job becomes re-activatable (`failJob` `retryBackOff`). */
  readonly retryBackoff?: Duration.Input;
  /** Optional variables to attach to the job on failure. */
  readonly variables?: { readonly [key: string]: unknown };
  readonly cause?: unknown;
}> {}

/**
 * A terminal job failure: retrying will not help. Mapped to `throwJobError`, which
 * is caught by a matching BPMN error boundary event or — if uncaught — raises an
 * incident.
 */
export class TerminalJobError extends Data.TaggedError('TerminalJobError')<{
  /** The BPMN error code matched against an error catch event. */
  readonly code: string;
  readonly message: string;
  /** Optional variables to instantiate at the error catch event's scope. */
  readonly variables?: { readonly [key: string]: unknown };
  readonly cause?: unknown;
}> {}

/** The typed error channel a job handler may fail with. */
export type JobError = RetryableJobError | TerminalJobError;

/** A job handler: consumes a {@link Job}, produces completion variables or a {@link JobError}. */
export type JobHandler<A extends CompleteVars, R> = (job: Job) => Effect.Effect<A, JobError, R>;

// --- Configuration --------------------------------------------------------------

export interface ActivateJobsStreamOptions<R = never> {
  /** Worker name recorded on the activation request. Defaults to `effect-worker-<type>-<n>`, where `<n>` is an incrementing per-process counter. */
  readonly workerName?: string;
  /** Max jobs to activate per poll (the activation batch size). Default `10`. */
  readonly maxJobsToActivate?: number;
  /**
   * Delay between polls that returned **no** jobs, on the Effect `Clock` (so it is
   * virtual under `TestClock`). A poll that returns jobs schedules the next poll
   * immediately. Default `1 second`.
   */
  readonly pollInterval?: Duration.Input;
  /** Per-job activation lock timeout (server-side). Default `60 seconds`. */
  readonly jobTimeout?: Duration.Input;
  /**
   * Long-poll request timeout. `0` (the default) lets the broker hold the request
   * for its configured default; a negative value returns immediately when idle.
   */
  readonly requestTimeout?: Duration.Input | number;
  /** Restrict activation to these variable names. */
  readonly fetchVariables?: readonly string[];
  /**
   * `Schedule` used to back off and retry a **failed activation request** (transport
   * outage, broker restart, transient server error). Runs on the Effect `Clock`.
   * When omitted, an activation failure fails the stream.
   */
  readonly activationRetrySchedule?: Schedule.Schedule<unknown, DomainError, never, R>;
}

export interface EffectWorkerConfig<A extends CompleteVars, R = never>
  extends ActivateJobsStreamOptions<R> {
  /** The job type to activate. */
  readonly type: string;
  /** The Effect job handler. */
  readonly handler: JobHandler<A, R>;
  /**
   * Max jobs processed concurrently (handler parallelism / backpressure). The
   * activation loop will not pull faster than handlers drain, and the activation
   * batch is capped to this value (when it is a finite number) so the worker never
   * leases more jobs than it can process at once. Default: the value of
   * {@link ActivateJobsStreamOptions.maxJobsToActivate} (or `10`).
   */
  readonly concurrency?: number | 'unbounded';
  /**
   * `Schedule` used to retry the **handler** in-process on a {@link RetryableJobError}
   * before the job is failed back to the broker. Runs on the Effect `Clock`
   * (virtual under `TestClock`). A {@link TerminalJobError} is never retried.
   */
  readonly handlerRetrySchedule?: Schedule.Schedule<unknown, JobError, never, R>;
}

/** A handle to a running Effect worker. */
export interface CamundaEffectWorkerHandle {
  /** The job type this worker activates. */
  readonly type: string;
  /** Completes when the worker loop ends (only on a fatal, non-retryable activation error). */
  readonly join: Effect.Effect<void, DomainError>;
  /** Interrupt the worker (also happens automatically when the owning scope closes). */
  readonly interrupt: Effect.Effect<void>;
}

const DEFAULT_MAX_JOBS = 10;
const DEFAULT_POLL_INTERVAL: Duration.Input = '1 second';
const DEFAULT_JOB_TIMEOUT: Duration.Input = '60 seconds';
const DEFAULT_LONGPOLL_TIMEOUT = 0;

let _workerCounter = 0;

function toMillis(d: Duration.Input): number {
  return Duration.toMillis(Duration.fromInputUnsafe(d));
}

// --- Activation stream ----------------------------------------------------------

/**
 * A `Stream` of activated jobs of `type`. Repeatedly calls `activateJobs` (through the
 * `/effect` client `Layer`, i.e. the same backpressure-aware runtime the Promise worker
 * uses) and emits each activated job. The between-empty-polls delay and the optional
 * activation-retry `Schedule` both run on the Effect `Clock`, so `TestClock.adjust`
 * advances them deterministically in tests.
 */
export function activateJobsStream<R = never>(
  type: string,
  options: ActivateJobsStreamOptions<R> = {}
): Stream.Stream<Job, DomainError, CamundaEffect | R> {
  const worker = options.workerName ?? `effect-worker-${type}-${++_workerCounter}`;
  const batch = options.maxJobsToActivate ?? DEFAULT_MAX_JOBS;
  const pollInterval = options.pollInterval ?? DEFAULT_POLL_INTERVAL;
  const jobTimeout = options.jobTimeout ?? DEFAULT_JOB_TIMEOUT;
  const requestTimeout =
    typeof options.requestTimeout === 'number'
      ? options.requestTimeout
      : options.requestTimeout !== undefined
        ? toMillis(options.requestTimeout)
        : DEFAULT_LONGPOLL_TIMEOUT;

  const body = {
    type,
    worker,
    maxJobsToActivate: batch,
    requestTimeout,
    timeout: toMillis(jobTimeout),
    ...(options.fetchVariables && options.fetchVariables.length > 0
      ? { fetchVariable: [...options.fetchVariables] }
      : {}),
  };

  const pollOnce: Effect.Effect<Job[], DomainError, CamundaEffect> = Effect.gen(function* () {
    const camunda = yield* CamundaEffect;
    const result = yield* camunda.activateJobs(body);
    const jobs = (result?.jobs ?? []) as Job[];
    // Empty poll → wait on the Effect Clock before the next activation (virtual under
    // TestClock). A non-empty poll proceeds immediately; downstream `concurrency`
    // provides the backpressure.
    if (jobs.length === 0) yield* Effect.sleep(pollInterval);
    return jobs;
  });

  const activation: Effect.Effect<Job[], DomainError, CamundaEffect | R> =
    options.activationRetrySchedule
      ? Effect.retry(pollOnce, { schedule: options.activationRetrySchedule })
      : pollOnce;

  return Stream.fromIterableEffectRepeat(activation);
}

// --- Worker loop ----------------------------------------------------------------

function completeJob<A extends CompleteVars>(
  job: Job,
  vars: A
): Effect.Effect<void, DomainError, CamundaEffect> {
  return Effect.gen(function* () {
    const camunda = yield* CamundaEffect;
    yield* camunda.completeJob({
      jobKey: job.jobKey,
      variables: (vars ?? {}) as { [key: string]: unknown },
      ...(job.leaseToken != null ? { leaseToken: job.leaseToken } : {}),
    });
  });
}

function failJobRetryable(
  job: Job,
  error: RetryableJobError
): Effect.Effect<void, DomainError, CamundaEffect> {
  return Effect.gen(function* () {
    const camunda = yield* CamundaEffect;
    yield* camunda.failJob({
      jobKey: job.jobKey,
      errorMessage: error.message,
      retries: Math.max(0, (job.retries ?? 1) - 1),
      ...(error.retryBackoff !== undefined ? { retryBackOff: toMillis(error.retryBackoff) } : {}),
      ...(error.variables ? { variables: { ...error.variables } } : {}),
      ...(job.leaseToken != null ? { leaseToken: job.leaseToken } : {}),
    });
  });
}

function raiseIncident(
  job: Job,
  error: TerminalJobError
): Effect.Effect<void, DomainError, CamundaEffect> {
  return Effect.gen(function* () {
    const camunda = yield* CamundaEffect;
    yield* camunda.throwJobError({
      jobKey: job.jobKey,
      errorCode: error.code,
      errorMessage: error.message,
      ...(error.variables ? { variables: { ...error.variables } } : {}),
      ...(job.leaseToken != null ? { leaseToken: job.leaseToken } : {}),
    });
  });
}

// On interruption mid-handling, release the lease by failing the job back with its
// retries **unchanged** so it re-activates promptly instead of waiting for the lock
// to expire. Best-effort: a failure here (e.g. shutdown racing the HTTP call) is
// swallowed so it cannot turn interruption into a defect.
function releaseLease(job: Job): Effect.Effect<void, never, CamundaEffect> {
  return Effect.gen(function* () {
    const camunda = yield* CamundaEffect;
    yield* camunda.failJob({
      jobKey: job.jobKey,
      errorMessage: 'worker interrupted; releasing lease for re-activation',
      retries: job.retries ?? 1,
      ...(job.leaseToken != null ? { leaseToken: job.leaseToken } : {}),
    });
  }).pipe(Effect.ignore);
}

function processJob<A extends CompleteVars, R>(
  config: EffectWorkerConfig<A, R>,
  job: Job
): Effect.Effect<void, DomainError, CamundaEffect | R> {
  const handled: Effect.Effect<A, JobError, R> = config.handlerRetrySchedule
    ? Effect.retry(config.handler(job), {
        schedule: config.handlerRetrySchedule,
        while: (e: JobError) => e._tag === 'RetryableJobError',
      })
    : config.handler(job);

  return handled.pipe(
    Effect.flatMap((vars) => completeJob(job, vars)),
    Effect.catchTag('RetryableJobError', (e) => failJobRetryable(job, e)),
    Effect.catchTag('TerminalJobError', (e) => raiseIncident(job, e)),
    Effect.onInterrupt(() => releaseLease(job))
  );
}

/**
 * The worker loop: drains {@link activateJobsStream}, running the handler for each job
 * with bounded `concurrency` (the backpressure knob), and acknowledging via
 * `completeJob`/`failJob`/`throwJobError` per the handler's typed outcome.
 */
export function runWorkerLoop<A extends CompleteVars, R = never>(
  config: EffectWorkerConfig<A, R>
): Effect.Effect<void, DomainError, CamundaEffect | R> {
  const concurrency = config.concurrency ?? config.maxJobsToActivate ?? DEFAULT_MAX_JOBS;
  // Never lease more jobs per poll than we can process concurrently. Jobs activated
  // beyond `concurrency` would sit buffered in the stream while their server-side lock
  // timeout counts down, risking lock expiry / duplicate delivery (and stale-lease
  // rejections). Cap the activation batch to `concurrency` when it is a finite number,
  // matching the Promise worker's headroom-bounded activation. When `concurrency` is
  // `'unbounded'`, leave the batch as configured.
  const maxJobsToActivate =
    typeof concurrency === 'number'
      ? Math.min(config.maxJobsToActivate ?? DEFAULT_MAX_JOBS, concurrency)
      : config.maxJobsToActivate;
  return activateJobsStream<R>(config.type, { ...config, maxJobsToActivate }).pipe(
    Stream.mapEffect((job) => processJob(config, job), { concurrency }),
    Stream.runDrain
  );
}

/**
 * Create and start an Effect job worker, forked into the current `Scope`. The worker
 * runs until its scope closes (or {@link CamundaEffectWorkerHandle.interrupt} is run),
 * at which point it is interrupted and any in-flight job's lease is released.
 *
 * Depends on the {@link CamundaEffect} service — provide the `/effect` client `layer`.
 *
 * @description Camunda Effect Worker. See the README and [this test](https://github.com/camunda/orchestration-cluster-api-js/blob/main/tests-integration/effect-worker.test.ts) for example usage.
 */
export function createCamundaEffectWorker<A extends CompleteVars, R = never>(
  config: EffectWorkerConfig<A, R>
): Effect.Effect<CamundaEffectWorkerHandle, never, Scope.Scope | CamundaEffect | R> {
  return Effect.gen(function* () {
    const fiber = yield* Effect.forkScoped(runWorkerLoop(config));
    return {
      type: config.type,
      join: Fiber.join(fiber),
      interrupt: Fiber.interrupt(fiber).pipe(Effect.asVoid),
    } satisfies CamundaEffectWorkerHandle;
  });
}

/**
 * A `Layer` that runs a Camunda Effect worker for the layer's lifetime. Compose it
 * with the `/effect` client `layer` (which provides its {@link CamundaEffect}
 * dependency) plus a `Layer` for the handler's own requirements `R`.
 */
export function workerLayer<A extends CompleteVars, R = never>(
  config: EffectWorkerConfig<A, R>
): Layer.Layer<never, never, CamundaEffect | R> {
  return Layer.effectDiscard(createCamundaEffectWorker(config));
}
