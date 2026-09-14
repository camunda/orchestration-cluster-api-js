import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivateJobsResponses, JobResult, ThrowJobErrorData } from '../gen/types.gen';
import type { HandlerClock } from './clock';
import { JobActionReceipt } from './jobWorker';

type ActivatedJobResult = ActivateJobsResponses[200]['jobs'][number];
type JobErrorRequest = ThrowJobErrorData['body'];

/** Convenience action methods spliced onto an activated job. */
export interface EnrichedActivatedJobActions {
  complete(variables?: { [k: string]: any }, result?: JobResult): Promise<JobActionReceipt>;
  fail(body: any): Promise<JobActionReceipt>;
  error(error: JobErrorRequest): Promise<JobActionReceipt>;
  cancelWorkflow(): Promise<JobActionReceipt>;
  ignore(): Promise<JobActionReceipt>;
  /**
   * Extend the timeout for the job by setting a new timeout
   */
  modifyJobTimeout: ({ newTimeoutMs }: { newTimeoutMs: number }) => Promise<void>;
  modifyRetries: ({ retries }: { retries: number }) => Promise<void>;
  log: ReturnType<CamundaClient['logger']>;
  /**
   * The clock this worker's client resolves time through. Reading and waiting through it
   * means a test that pins the client's clock also drives the handler.
   */
  clock: HandlerClock;
  /** Set true once any acknowledgement method is invoked. */
  acknowledged?: boolean;
}

/**
 * Enriched job type with convenience methods.
 *
 * A back-compatible **interface** so downstream consumers can declaration-merge
 * or `extends` it exactly as they could before the dependent-presence typing
 * work landed (restoring the pre-#513 public surface — turning it into a generic
 * type alias was a breaking change for those consumers). It resolves to the base
 * `ActivatedJobResult` shape plus the action methods.
 *
 * The marker-driven dependent-presence projections (see
 * `hooks/post/710-derive-present-when.ts`) narrow individual response properties
 * via the generic {@link EnrichedActivatedJobOf} companion instead of
 * re-parameterising this interface — an interface cannot intersect an arbitrary
 * type parameter, and keeping this name non-generic preserves back-compat.
 */
export interface EnrichedActivatedJob extends EnrichedActivatedJobActions {}
export interface EnrichedActivatedJob extends ActivatedJobResult {}

/**
 * Generic projection of an enriched job over its underlying activated-job shape
 * `J`, used by the marker-driven dependent-presence overloads to narrow
 * individual response properties — e.g. `leaseToken` becomes non-null when a job
 * was activated with `withLease: true`, or an optional nullable field
 * (`{ leaseToken?: null }`) when it was not. The absent projection re-types the
 * property as optional-and-null rather than removing it, so it is not assignable
 * to the base non-nullable narrowing; `J` is therefore left unconstrained rather
 * than bounded by `ActivatedJobResult`. Defaults to the base `ActivatedJobResult`,
 * so `EnrichedActivatedJobOf` with no argument equals {@link EnrichedActivatedJob}.
 */
export type EnrichedActivatedJobOf<J = ActivatedJobResult> = J & EnrichedActivatedJobActions;

export interface JobFailureConfiguration {
  errorMessage: string;
  /**
   * If not specified, the library will decrement the "current remaining retries" count by one
   */
  retries?: number;
  /**
   * Optional backoff for subsequent retries, in milliseconds. If not specified, it is zero.
   */
  retryBackOff?: number;
  /**
   * Optional variable update for the job
   */
  variables?: { [key: string]: any };
}

/** Create an enriched job object with action methods (no worker bookkeeping). */
export function enrichActivatedJob(
  raw: ActivatedJobResult,
  client: CamundaClient,
  log: ReturnType<CamundaClient['logger']>,
  clock: HandlerClock = client.clock
): EnrichedActivatedJob {
  let acknowledged = false;
  const ack = () => {
    if (!acknowledged) {
      acknowledged = true;
      job.acknowledged = true;
    }
  };
  // Narrowed rather than passed by reference: the type omits `deadline`, and handing over
  // the client clock would still expose it to JS callers and to anyone reaching past the type.
  const job: Partial<EnrichedActivatedJob> = {
    ...raw,
    log,
    clock: { now: () => clock.now(), sleep: (ms, signal) => clock.sleep(ms, signal) },
  };
  job.complete = async (
    variables: { [k: string]: any } = {},
    result?: JobResult
  ): Promise<JobActionReceipt> => {
    try {
      await client.completeJob({
        variables,
        jobKey: raw.jobKey,
        ...(result !== undefined && { result }),
        ...(raw.leaseToken != null ? { leaseToken: raw.leaseToken } : {}),
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.fail = async (reason: JobFailureConfiguration): Promise<JobActionReceipt> => {
    try {
      await client.failJob({
        ...reason,
        jobKey: raw.jobKey,
        ...(raw.leaseToken != null ? { leaseToken: raw.leaseToken } : {}),
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.error = async (error: JobErrorRequest): Promise<JobActionReceipt> => {
    try {
      await client.throwJobError({
        ...error,
        jobKey: raw.jobKey,
        ...(raw.leaseToken != null ? { leaseToken: raw.leaseToken } : {}),
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.cancelWorkflow = async (): Promise<JobActionReceipt> => {
    try {
      await client.cancelProcessInstance({
        processInstanceKey: raw.processInstanceKey,
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.ignore = async (): Promise<JobActionReceipt> => {
    ack();
    return JobActionReceipt;
  };
  job.modifyJobTimeout = ({ newTimeoutMs }: { newTimeoutMs: number }) =>
    client.updateJob({
      changeset: { timeout: newTimeoutMs },
      jobKey: raw.jobKey,
      ...(raw.leaseToken != null ? { leaseToken: raw.leaseToken } : {}),
    });
  job.modifyRetries = ({ retries }: { retries: number }) =>
    client.updateJob({
      changeset: { retries },
      jobKey: raw.jobKey,
      ...(raw.leaseToken != null ? { leaseToken: raw.leaseToken } : {}),
    });
  return job as EnrichedActivatedJob;
}
