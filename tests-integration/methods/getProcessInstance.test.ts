import { describe, expect, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

describe('getProcessInstance', () => {
  it('can get a process instance', async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });
    const get = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 20_000, trace: true } }
    );
    validateResponseShape(
      { path: '/process-instances/{processInstanceKey}', method: 'GET', status: '200' },
      get
    );
    expect(get.processInstanceKey).toBe(process.processInstanceKey);
  }, 20_000);
});
