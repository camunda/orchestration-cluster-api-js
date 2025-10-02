// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it, vitest } from 'vitest';

import { createCamundaClient } from '../../dist';

vitest.setConfig({ testTimeout: 15_000 });

describe('cancelProcessInstance', () => {
  it('can cancel a process instance', async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });
    const search = await camunda.searchProcessInstances(
      {
        filter: { processInstanceKey: process.processInstanceKey, state: 'ACTIVE' },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );
    expect(search.items[0].processInstanceKey).toBe(process.processInstanceKey);

    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });

    const search2 = await camunda.searchProcessInstances(
      {
        filter: { processInstanceKey: process.processInstanceKey, state: 'ACTIVE' },
      },
      { consistency: { waitUpToMs: 10_000, predicate: (res) => res.items.length === 0 } }
    );

    expect(search2.items.length).toBe(0);
  });
});
