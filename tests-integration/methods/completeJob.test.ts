import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('completeJob', () => {
  it('can complete with result', { timeout: 15_000 }, async () => {
    const _camunda = createCamundaClient();
    const filepath = './tests-integration/fixtures/test-complete-job-process.bpmn';
    const deployment = await _camunda.deployResourcesFromFiles([filepath]);

    const process = await _camunda.createProcessInstance({
      processDefinitionId: deployment.processes[0].processDefinitionId,
    });

    const jobsResponse = await _camunda.activateJobs({
      maxJobsToActivate: 1,
      type: 'test-complete-job',
      timeout: 30000,
    });

    expect(jobsResponse.jobs[0].processDefinitionKey).toBe(process.processDefinitionKey);

    await _camunda.completeJob({
      jobKey: jobsResponse.jobs[0].jobKey,
      variables: { someResult: 'value' },
    });
  });
});
