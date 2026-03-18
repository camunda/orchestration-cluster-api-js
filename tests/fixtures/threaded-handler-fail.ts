/**
 * Test fixture: a threaded handler that fails the job.
 */
import type { ThreadedJobHandler } from '../../src/runtime/threadedJobWorker';

const handler: ThreadedJobHandler = async (job, _client) => {
  return job.fail({ errorMessage: 'intentional failure', retries: 0 });
};
export default handler;
