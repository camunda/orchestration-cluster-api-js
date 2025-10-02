// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, expect, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

describe('getProcessInstance', () => {
  it('scaffold', async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });
    const get = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 20000, trace: true } }
    );
    validateResponseShape(
      { path: '/process-instances/{processInstanceKey}', method: 'GET', status: '200' },
      get
    );
    expect(get.processInstanceKey).toBe(process.processInstanceKey);
  });
});
