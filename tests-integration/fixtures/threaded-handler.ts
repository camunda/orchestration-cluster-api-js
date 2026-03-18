/**
 * Integration test handler for threaded job worker.
 * Runs inside a worker_thread, receives job + client proxy.
 */
import type { ThreadedJobHandler } from '../../src/runtime/threadedJobWorker';

const handler: ThreadedJobHandler = async (job, _client) => {
  const { orderId } = job.variables;
  // Verify we received the expected variable
  if (!orderId) {
    return job.fail({ errorMessage: 'Missing orderId variable' });
  }
  return job.complete({ variables: { processed: true, handledBy: 'threaded-worker' } });
};
export default handler;
