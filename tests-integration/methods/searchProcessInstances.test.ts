// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient, ProcessInstanceKey } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

const camunda = createCamundaClient();

describe('searchProcessInstances', () => {
  it('can search by processInstanceKey and variables', async () => {
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: 3,
      },
    });
    const search = await camunda.searchProcessInstances(
      {
        filter: { variables: [{ name: 'testVar', value: '3' }] },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );
    validateResponseShape(
      { path: '/process-instances/search', method: 'POST', status: '200' },
      search
    );
    expect(search.items[0].tags).toBeDefined();
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  });
  it.skip('can search for a specific process instance', async () => {
    await camunda.searchProcessInstances(
      {
        filter: { processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685370') },
      },
      {
        consistency: { waitUpToMs: 0 },
      }
    );
  });
});
