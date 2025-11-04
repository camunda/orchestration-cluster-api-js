import { JobActionReceipt } from './jobWorker';

import type { CamundaClient } from '../gen/CamundaClient';
import type { ActivatedJobResult } from '../gen/types.gen';

/** Enriched job type with convenience methods. */
export interface EnrichedActivatedJob extends ActivatedJobResult {
  complete(body: any): Promise<JobActionReceipt>;
  fail(body: any): Promise<JobActionReceipt>;
  cancelWorkflow(body: any): Promise<JobActionReceipt>;
  cancel(body: any): Promise<JobActionReceipt>;
  ignore(): Promise<JobActionReceipt>;
  log: ReturnType<CamundaClient['logger']>;
  /** Set true once any acknowledgement method is invoked. */
  acknowledged?: boolean;
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
      (job as any).acknowledged = true;
    }
  };
  const job: Partial<EnrichedActivatedJob> = { ...raw, log };
  job.complete = async (body: any): Promise<JobActionReceipt> => {
    try {
      await (client as any).completeJob({ ...body, jobKey: raw.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.fail = async (body: any): Promise<JobActionReceipt> => {
    try {
      await (client as any).failJob({ ...body, jobKey: raw.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.cancelWorkflow = async (body: any): Promise<JobActionReceipt> => {
    try {
      await (client as any).cancelProcessInstance({
        ...body,
        processInstanceKey: raw.processInstanceKey,
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };
  job.cancel = async (body: any): Promise<JobActionReceipt> => {
    try {
      await (client as any).cancelProcessInstance({
        ...body,
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
  return job as EnrichedActivatedJob;
}
