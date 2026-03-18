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
}

/** Cache of loaded handlers keyed by module path. Each thread loads a handler once per unique path. */
const handlerCache = new Map<string, (job: any, client: any) => Promise<any>>();

async function loadHandler(
  handlerModule: string
): Promise<(job: any, client: any) => Promise<any>> {
  const cached = handlerCache.get(handlerModule);
  if (cached) return cached;

  const modulePath =
    handlerModule.startsWith('.') || handlerModule.startsWith('/')
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

    const result: JobResult = { type: 'job-result', taskId, ok: true };
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

  job.complete = async (variables: Record<string, unknown> = {}) => {
    try {
      await client.completeJob({ variables, jobKey: jobData.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };

  job.fail = async (reason: any) => {
    try {
      await client.failJob({ ...reason, jobKey: jobData.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };

  job.error = async (error: any) => {
    try {
      await client.throwJobError({ ...error, jobKey: jobData.jobKey });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };

  job.cancelWorkflow = async () => {
    try {
      await client.cancelProcessInstance({
        processInstanceKey: jobData.processInstanceKey,
      });
    } finally {
      ack();
    }
    return JobActionReceipt;
  };

  job.ignore = async () => {
    ack();
    return JobActionReceipt;
  };

  job.modifyJobTimeout = ({ newTimeoutMs }: { newTimeoutMs: number }) =>
    client.updateJob({ changeset: { timeout: newTimeoutMs }, jobKey: jobData.jobKey });

  job.modifyRetries = ({ retries }: { retries: number }) =>
    client.updateJob({ changeset: { retries }, jobKey: jobData.jobKey });

  return job;
}

// Signal ready
parentPort.postMessage({ type: 'ready' });
