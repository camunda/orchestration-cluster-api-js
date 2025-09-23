// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it, expect } from 'vitest';

import { createCamundaClient, ElementId, ProcessDefinitionId } from '../../dist';

describe('createProcessInstance', () => {
  it('creates Process Instance with runtime instructions', async () => {
    const _camunda = createCamundaClient();
    const filepath = './tests-integration/fixtures/test-process.bpmn';
    const deployment = await _camunda.deployResourcesFromFiles([filepath]);

    // We terminate the process instance right after the start event, before the service task
    const process = await _camunda.createProcessInstance({
      processDefinitionId: deployment.processes[0].processDefinitionId,
      runtimeInstructions: [{ type: 'TERMINATE_PROCESS_INSTANCE', afterElementId: ElementId.assumeExists('Activity_106kosb') }],
    })
    expect(() =>
      _camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey })
    ).rejects.toThrow();
  });
});

