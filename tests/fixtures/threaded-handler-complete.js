/**
 * Test fixture: a simple threaded job handler that completes the job.
 */
const handler = async (job, _client) => {
  return job.complete({ processed: true, jobKey: job.jobKey });
};
export default handler;
