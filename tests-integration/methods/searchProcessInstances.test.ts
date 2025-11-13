// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient, ProcessInstanceKey, Tag } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

const camunda = createCamundaClient();

describe('searchProcessInstances', () => {
  it('can search by processInstanceKey and variables', async () => {
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const uniqueId = Date.now().toString()
    const tag = Tag.fromString(`tag-${uniqueId}`)
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: uniqueId,
      },
      tags: [tag]
    });

    const search = await camunda.searchProcessInstances(
      {
        filter: { variables: [{ name: 'testVar', value: `"${uniqueId}"` }] },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );
    console.log(search)
    validateResponseShape(
      { path: '/process-instances/search', method: 'POST', status: '200' },
      search
    )
    // expect(search.items[0].tags?.[0]).toBe(tag);
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  }, 12_000);

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
