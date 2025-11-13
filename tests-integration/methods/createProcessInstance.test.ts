// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('createProcessInstance', () => {
  it('creates Process Instance', async () => {
    const camunda = createCamundaClient();
    const filepath = './tests-integration/fixtures/test-process.bpmn';
    const deployment = await camunda.deployResourcesFromFiles([filepath]);

    // We terminate the process instance right after the start event, before the service task
    const process = await camunda.createProcessInstance({
      processDefinitionId: deployment.processes[0].processDefinitionId,
      // Known issue: https://github.com/camunda/camunda/issues/38481
      // runtimeInstructions: [{ type: 'TERMINATE_PROCESS_INSTANCE', afterElementId: ElementId.assumeExists('Activity_106kosb') }],
    });
    expect(process.tags).toBeDefined();
    const processInstance = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10_000 } }
    );
    expect(processInstance.processInstanceKey).toBe(process.processInstanceKey);
  }, 12_000);
});
