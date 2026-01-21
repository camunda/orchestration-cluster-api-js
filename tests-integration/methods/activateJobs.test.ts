import { describe, it, expect } from 'vitest';

import { createCamundaClient, JobActionReceiptSymbol } from '../../dist';

describe('activateJobs', () => {
  it('returns enriched jobs with action methods', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: 3,
      },
    });
    const response = await camunda.activateJobs({
      maxJobsToActivate: 1,
      type: 'test-job',
      timeout: 30_000,
    });
    expect(Array.isArray(response.jobs)).toBe(true);
    expect(response.jobs.length).toBeGreaterThan(0); // we just created one
    for (const job of response.jobs) {
      // Enriched method presence
      expect(typeof job.complete).toBe('function');
      expect(typeof job.fail).toBe('function');
      expect(typeof job.cancelWorkflow).toBe('function');
      expect(typeof job.ignore).toBe('function');
      expect(typeof job.log).toBe('object');
      // Invoke completion via enriched method with no arguments (defaults variables={})
      const receipt = await job.complete();
      expect(receipt).toBe(JobActionReceiptSymbol);
      expect((job as any).acknowledged).toBe(true);
    }
  });
  it('can cancel an activateJobs call', async () => {
    const camunda = createCamundaClient();
    // Use a unique job type so there are guaranteed to be no jobs; activation will long-poll.
    const uniqueType = 'no-jobs-' + Date.now();
    const activation = camunda.activateJobs({
      maxJobsToActivate: 1,
      type: uniqueType,
      timeout: 30_000,
    });
    // Cancel immediately while fetch is in-flight.
    activation.cancel();
    // Assert the promise rejects with our cancellation classification.
    await expect(activation).rejects.toMatchObject({ name: 'CancelSdkError' });
  });
});
