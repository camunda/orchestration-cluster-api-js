/**
 * Test fixture: a threaded handler that calls client.publishMessage.
 */
import type { ThreadedJobHandler } from '../../src/runtime/threadedJobWorker';

const handler: ThreadedJobHandler = async (job, client) => {
  await client.publishMessage({
    name: 'test-message',
    correlationKey: String(job.variables.orderId),
    variables: { status: 'done' },
  });
  return job.complete({ messaged: true });
};
export default handler;
