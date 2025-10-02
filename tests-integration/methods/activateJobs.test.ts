// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('activateJobs', () => {
  it('scaffold', async () => {
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
      maxJobsToActivate: 100,
      type: 'test-job',
      timeout: 2_000,
      requestTimeout: 2_000,
    });
    for (const job of response.jobs) {
      await camunda.completeJob({
        jobKey: job.jobKey,
      });
    }
  });
});
