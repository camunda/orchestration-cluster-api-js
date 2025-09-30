// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient, TenantId } from '../../dist';

describe('getProcessInstance', () => {
  it('scaffold', async () => {
    const camunda = createCamundaClient();
        const tenantId = TenantId.assumeExists('<default>')
    
        const res = await camunda.deployResourcesFromFiles([
            './tests-integration/fixtures/test-job-process.bpmn',
        ], { tenantId });
    const process = await camunda.createProcessInstance({
        processDefinitionKey: res.processes[0].processDefinitionKey,
        tenantId
    })
    console.log('process', JSON.stringify(process, null, 2))
    const get = await camunda.getProcessInstance(
        { processInstanceKey: process.processInstanceKey },
        { consistency: { waitUpToMs: 10000, trace: true } }
    );
    console.log('get', JSON.stringify(get, null, 2))
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  });
});
