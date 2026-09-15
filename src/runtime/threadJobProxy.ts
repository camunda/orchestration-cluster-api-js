/**
 * Build a job object with action methods that proxy through the client, used by
 * the threaded worker entry point (`threadWorkerEntry.ts`).
 *
 * Kept in its own module — separate from the worker-thread bootstrap, which
 * throws on import outside a `worker_threads` Worker — so the proxy's behaviour
 * (in particular that EVERY job action forwards the activation `leaseToken` back
 * to the main-thread client) is unit-testable directly, without spinning up a
 * real worker thread.
 *
 * The job data is plain serialized data from the main thread. Completion actions
 * (complete/fail/error/cancelWorkflow) are captured as intent on
 * `job._completionAction` and executed by the main thread; the non-completion
 * actions (modifyJobTimeout/modifyRetries) proxy straight through the client.
 */
import type { JobResult as ApiJobResult } from '../gen/types.gen';

// Inline the JobActionReceipt constant to avoid importing the full SDK dependency
// chain (jobWorker.ts → ../gen/CamundaClient → entire SDK) into the worker thread.
const JobActionReceipt = 'JOB_ACTION_RECEIPT' as const;

export function createJobProxy(jobData: Record<string, unknown>, client: any): any {
  const acknowledged = { value: false };
  const ack = () => {
    acknowledged.value = true;
    job.acknowledged = true;
  };

  const job: any = { ...jobData };

  /**
   * Completion actions (complete/fail/error/cancelWorkflow) are stored as intent
   * rather than proxied through the MessagePort. The thread returns immediately,
   * and the main thread executes the API call asynchronously. This keeps threads
   * free for CPU work instead of blocking on I/O round-trips.
   */

  job.complete = async (variables: Record<string, unknown> = {}, result?: ApiJobResult) => {
    ack();
    job._completionAction = {
      method: 'completeJob',
      args: [
        {
          variables,
          jobKey: jobData.jobKey,
          ...(result !== undefined && { result }),
          ...(jobData.leaseToken != null ? { leaseToken: jobData.leaseToken } : {}),
        },
      ],
    };
    return JobActionReceipt;
  };

  job.fail = async (reason: any) => {
    ack();
    job._completionAction = {
      method: 'failJob',
      args: [
        {
          ...reason,
          jobKey: jobData.jobKey,
          ...(jobData.leaseToken != null ? { leaseToken: jobData.leaseToken } : {}),
        },
      ],
    };
    return JobActionReceipt;
  };

  job.error = async (error: any) => {
    ack();
    job._completionAction = {
      method: 'throwJobError',
      args: [
        {
          ...error,
          jobKey: jobData.jobKey,
          ...(jobData.leaseToken != null ? { leaseToken: jobData.leaseToken } : {}),
        },
      ],
    };
    return JobActionReceipt;
  };

  job.cancelWorkflow = async () => {
    ack();
    job._completionAction = {
      method: 'cancelProcessInstance',
      args: [{ processInstanceKey: jobData.processInstanceKey }],
    };
    return JobActionReceipt;
  };

  job.ignore = async () => {
    ack();
    return JobActionReceipt;
  };

  // Non-completion actions still proxy through the client (rare, need response)
  job.modifyJobTimeout = ({ newTimeoutMs }: { newTimeoutMs: number }) =>
    client.updateJob({
      changeset: { timeout: newTimeoutMs },
      jobKey: jobData.jobKey,
      ...(jobData.leaseToken != null ? { leaseToken: jobData.leaseToken } : {}),
    });

  job.modifyRetries = ({ retries }: { retries: number }) =>
    client.updateJob({
      changeset: { retries },
      jobKey: jobData.jobKey,
      ...(jobData.leaseToken != null ? { leaseToken: jobData.leaseToken } : {}),
    });

  return job;
}
