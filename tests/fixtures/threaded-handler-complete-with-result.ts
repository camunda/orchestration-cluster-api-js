/**
 * Test fixture: a threaded job handler that completes with a job result (correction).
 */
import type { JobResult } from '../../src/gen/types.gen';
import type { ThreadedJobHandler } from '../../src/runtime/threadedJobWorker';

const handler: ThreadedJobHandler = async (job, _client) => {
  const result: JobResult = {
    type: 'userTask',
    corrections: { assignee: 'corrected-user', priority: 80 },
  };
  return job.complete({ processed: true }, result);
};
export default handler;
