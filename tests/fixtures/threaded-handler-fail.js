/**
 * Test fixture: a threaded handler that fails the job.
 */
const handler = async (job, _client) => {
  return job.fail({ errorMessage: 'intentional failure', retries: 0 });
};
export default handler;
