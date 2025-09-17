import { describe, it, expect } from 'vitest';

import { createCamundaClient, Tag } from '../src';

describe('tag demo', () => {
  it.skip('has type safety', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    // Somewhere on a code path in the application
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      tags: ['test:!@#$%^&' as Tag],
    });

    const search = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10000, trace: true } }
    );

    console.log('ProcessInstance', JSON.stringify(process, null, 2));

    expect(search.processInstanceKey).toBe(process.processInstanceKey);
    // expect(search.items.length).toBe(1);
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  });

  it('has type safety', { timeout: 20000 }, async () => {
    // Application lifecycle: startup
    const tag = Tag.fromString('test:!@#$%^&');

    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      tags: [tag],
    });

    const search = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10000, trace: true } }
    );

    console.log('ProcessInstance', JSON.stringify(process, null, 2));

    expect(search.processInstanceKey).toBe(process.processInstanceKey);
    // expect(search.items.length).toBe(1);
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  });
});
