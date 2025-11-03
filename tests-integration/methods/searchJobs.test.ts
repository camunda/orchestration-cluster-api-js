// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { validateResponseShape } from 'assert-json-body';
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

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

    console.log(JSON.stringify(response, null, 2));
    validateResponseShape({ path: '/jobs/search', method: 'POST', status: '200' }, response);
    await camunda.cancelProcessInstance({ processInstanceKey });
  });
});
