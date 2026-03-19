/**
 * Worker thread entry point for the shared ThreadPool.
 *
 * Each thread in the pool runs this script. It:
 * 1. Waits for job messages on parentPort
 * 2. Dynamically imports and caches the handler module per handlerModule path
 * 3. Creates a client proxy + job proxy per job
 * 4. Calls the handler, sends back the result
 *
 * Threads are generic — the handler module is specified per-job, not per-thread.
 * Handlers are cached by module path so each import happens only once per thread.
 */
import { parentPort } from 'node:worker_threads';

import { createClientProxy } from './clientProxy.ts';

// Inline the JobActionReceipt constant to avoid importing the full SDK dependency chain
// (jobWorker.ts → ../gen/CamundaClient → entire SDK) in the worker thread.
const JobActionReceipt = 'JOB_ACTION_RECEIPT' as const;

if (!parentPort) {
  throw new Error('threadWorkerEntry must run inside a worker_threads Worker');
}

interface JobMessage {
  type: 'job';
  /** Unique ID for this job dispatch (correlates response) */
  taskId: string;
  /** Serialized job data (plain object, no methods) */
  jobData: Record<string, unknown>;
  /** Handler module path — resolved per job, cached per thread */
  handlerModule: string;
}

interface JobResult {
  type: 'job-result';
  taskId: string;
  ok: boolean;
  error?: string;
  /** When the handler acknowledged the job via complete/fail/error,
   *  the action is captured here for the main thread to execute. */
  completionAction?: {
    method: string;
    args: unknown[];
  };
}

/** Cache of loaded handlers keyed by module path. Each thread loads a handler once per unique path. */
const handlerCache = new Map<string, (job: any, client: any) => Promise<any>>();

async function loadHandler(
  handlerModule: string
): Promise<(job: any, client: any) => Promise<any>> {
  const cached = handlerCache.get(handlerModule);
  if (cached) return cached;

  // Convert filesystem paths to file:// URLs for dynamic import().
  // Handles relative (./ ../) paths, Unix absolute (/), and Windows absolute (C:\).
  const isPath =
    handlerModule.startsWith('.') ||
    handlerModule.startsWith('/') ||
    /^[a-zA-Z]:[\\/]/.test(handlerModule);
  const modulePath = isPath
    ? new URL(handlerModule, `file://${process.cwd()}/`).href
    : handlerModule;
  const mod = await import(modulePath);
  const handler = mod.default ?? mod.handler;
  if (typeof handler !== 'function') {
    throw new Error(
      `Threaded handler module '${handlerModule}' must export a default function or named 'handler' export`
    );
  }
  handlerCache.set(handlerModule, handler);
  return handler;
}

parentPort.on('message', async (msg: JobMessage & { clientPort?: any }) => {
  if (msg.type !== 'job') return;

  const { taskId, jobData, handlerModule, clientPort } = msg as JobMessage & {
    clientPort: import('node:worker_threads').MessagePort;
  };

  try {
    const handlerFn = await loadHandler(handlerModule);

    // Create a client proxy for this job's MessagePort
    const clientProxy = createClientProxy(clientPort);

    // Build a job-like object with proxied action methods
    const job = createJobProxy(jobData, clientProxy);

    await handlerFn(job, clientProxy);

    // If the handler never acknowledged the job (no complete/fail/error/ignore),
    // treat it as an error so the broker can retry rather than silently dropping it.
    if (!job.acknowledged) {
      const result: JobResult = {
        type: 'job-result',
        taskId,
        ok: false,
        error:
          `Handler for '${handlerModule}' returned without acknowledging the job. ` +
          'Call job.complete(), job.fail(), job.error(), or job.ignore().',
      };
      parentPort!.postMessage(result);
      return;
    }

    const result: JobResult = {
      type: 'job-result',
      taskId,
      ok: true,
      completionAction: job._completionAction || undefined,
    };
    parentPort!.postMessage(result);
  } catch (err: any) {
    const result: JobResult = {
      type: 'job-result',
      taskId,
      ok: false,
      error: err?.message || String(err),
    };
    parentPort!.postMessage(result);
  } finally {
    // Close this job's client port
    if (clientPort && typeof clientPort.close === 'function') {
      clientPort.close();
    }
  }
});

/**
 * Build a job object with action methods that proxy through the client.
 * The job data is plain serialized data from the main thread.
 * Action methods (complete, fail, error, etc.) call back to the main thread client.
 */
function createJobProxy(jobData: Record<string, unknown>, client: any): any {
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

  job.complete = async (variables: Record<string, unknown> = {}) => {
    ack();
    job._completionAction = {
      method: 'completeJob',
      args: [{ variables, jobKey: jobData.jobKey }],
    };
    return JobActionReceipt;
  };

  job.fail = async (reason: any) => {
    ack();
    job._completionAction = {
      method: 'failJob',
      args: [{ ...reason, jobKey: jobData.jobKey }],
    };
    return JobActionReceipt;
  };

  job.error = async (error: any) => {
    ack();
    job._completionAction = {
      method: 'throwJobError',
      args: [{ ...error, jobKey: jobData.jobKey }],
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
    client.updateJob({ changeset: { timeout: newTimeoutMs }, jobKey: jobData.jobKey });

  job.modifyRetries = ({ retries }: { retries: number }) =>
    client.updateJob({ changeset: { retries }, jobKey: jobData.jobKey });

  return job;
}

// Signal ready
parentPort.postMessage({ type: 'ready' });
