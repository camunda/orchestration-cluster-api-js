/**
 * Test fixture: a threaded job handler that completes with a job result (correction).
 */
const handler = async (job, _client) => {
  const result = {
    type: 'userTask',
    corrections: { assignee: 'corrected-user', priority: 80 },
  };
  return job.complete({ processed: true }, result);
};
export default handler;
