/**
 * Test fixture: a simple threaded job handler that completes the job.
 */
import type { ThreadedJobHandler } from '../../src/runtime/threadedJobWorker';

const handler: ThreadedJobHandler = async (job, _client) => {
  return job.complete({ processed: true, jobKey: job.jobKey });
};
export default handler;
