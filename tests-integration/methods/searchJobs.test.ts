import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

describe('searchJobs', () => {
  it('can search Jobs', async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const { processInstanceKey } = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: 3,
      },
    });
    const response = await camunda.searchJobs(
      {
        filter: { processInstanceKey },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );

    validateResponseShape({ path: '/jobs/search', method: 'POST', status: '200' }, response);
    await camunda.cancelProcessInstance({ processInstanceKey });
  });
});
