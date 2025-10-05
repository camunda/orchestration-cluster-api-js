import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../src';

describe('eventual consistency', () => {
  it('demonstrates the eventually consistent characteristic', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];

    const process = await camunda.createProcessInstance({
      processDefinitionKey,
    });
    console.log(
      `Created process instance with key ${process.processInstanceKey} for definition ${processDefinitionKey}`
    );

    const getProcess = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10_000, trace: true } }
    );

    console.log(JSON.stringify(getProcess, null, 2));
    expect(getProcess.processInstanceKey).toBe(process.processInstanceKey);
  });
});
