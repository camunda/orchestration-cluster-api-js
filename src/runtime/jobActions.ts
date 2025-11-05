import { JobActionReceipt } from './jobWorker';

import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivatedJobResult } from '../gen/types.gen';

/** Enriched job type with convenience methods. */
export interface EnrichedActivatedJob extends ActivatedJobResult {
  complete(variables?: { [k: string]: any }): Promise<JobActionReceipt>;
  fail(body: any): Promise<JobActionReceipt>;
  cancelWorkflow(): Promise<JobActionReceipt>;
  ignore(): Promise<JobActionReceipt>;
  /**
   * Extend the timeout for the job by setting a new timeout
   */
  modifyJobTimeout: ({ newTimeoutMs }: { newTimeoutMs: number }) => Promise<void>;
  modifyRetries: ({ retries }: { retries: number }) => Promise<void>;
  log: ReturnType<CamundaClient['logger']>;
  /** Set true once any acknowledgement method is invoked. */
  acknowledged?: boolean;
}

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
  log: ReturnType<CamundaClient['logger']>
): EnrichedActivatedJob {
  let acknowledged = false;
  const ack = () => {
    if (!acknowledged) {
      acknowledged = true;
      job.acknowledged = true;
    }
  };
  const job: Partial<EnrichedActivatedJob> = { ...raw, log };
  job.complete = async (
    variables: {
      [k: string]: any;
    } = {}
  ): Promise<JobActionReceipt> => {
    try {
      await client.completeJob({ variables, jobKey: raw.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.fail = async (reason: JobFailureConfiguration): Promise<JobActionReceipt> => {
    try {
      await client.failJob({ ...reason, jobKey: raw.jobKey });
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
    client.updateJob({ changeset: { timeout: newTimeoutMs }, jobKey: raw.jobKey });
  job.modifyRetries = ({ retries }: { retries: number }) =>
    client.updateJob({ changeset: { retries }, jobKey: raw.jobKey });
  return job as EnrichedActivatedJob;
}
