import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../dist';

describe('eventual consistency', () =>
  it('can do all the things', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });

    const get = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10000, trace: true } }
    );

    expect(get.processInstanceKey).toBe(process.processInstanceKey);
  }));
