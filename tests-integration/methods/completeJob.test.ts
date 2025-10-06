// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('completeJob', () => {
  it('can complete with result', async () => {
    const _camunda = createCamundaClient();
    const filepath = './tests-integration/fixtures/test-job-process.bpmn';
    const deployment = await _camunda.deployResourcesFromFiles([filepath]);

    const process = await _camunda.createProcessInstance({
      processDefinitionId: deployment.processes[0].processDefinitionId,
    });

    const jobsResponse = await _camunda.activateJobs({
      maxJobsToActivate: 1,
      type: 'test-job',
      timeout: 30000,
    });

    const res = await _camunda.completeJob({
      jobKey: jobsResponse.jobs[0].jobKey,
      variables: { someResult: 'value' },
      //  result: {type: 'adHocS ubProcess', isCancelRemainingInstances: true}
    });
  });
});
