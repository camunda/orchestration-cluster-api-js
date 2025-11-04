// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it, expect } from 'vitest';

import { createCamundaClient, JobActionReceiptSymbol } from '../../dist';

describe('activateJobs', () => {
  it('returns enriched jobs with action methods', async () => {
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
      expect(typeof job.cancel).toBe('function');
      expect(typeof job.ignore).toBe('function');
      expect(typeof job.log).toBe('object');
      // Invoke completion via enriched method
      const receipt = await job.complete({ variables: { someResult: 'value' } });
      expect(receipt).toBe(JobActionReceiptSymbol);
      expect((job as any).acknowledged).toBe(true);
    }
  });
});
