import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../dist';

describe('eventual consistency demo', () =>
  it.only('can do all the things', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });

    const search = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10000, trace: true } }
    );

    console.log('ProcessInstance', JSON.stringify(process, null, 2));

    expect(search.processInstanceKey).toBe(process.processInstanceKey);
    // expect(search.items.length).toBe(1);
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  }));
