/**
 * Test fixture: a threaded handler that throws (uncaught), exercising the
 * worker's direct `onError` failure callback rather than a handler-issued
 * `job.fail(...)`.
 */
const handler = async (_job, _client) => {
  throw new Error('intentional uncaught handler error');
};
export default handler;
