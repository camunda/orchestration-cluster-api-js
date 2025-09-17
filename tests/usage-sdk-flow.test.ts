import { describe, it, expect, vi } from 'vitest';
import { ProcessInstanceKey } from '../src';
import createCamundaClient from '../src'

describe('End-to-end usage (mocked) - create instance -> search', () => {
  it('starts and searches using class instance operations', async () => {
    const BASE = 'https://mock.local';
    const fetchMock = vi.fn();

    const camunda = createCamundaClient({ config: { CAMUNDA_REST_ADDRESS: BASE }, fetch: fetchMock as any });

    // Mock responses:
    // 0. createDeployment
    fetchMock.mockImplementationOnce(async (input: Request) => {
      expect(input.url).toContain('/deployments');
      return new Response(JSON.stringify({ deployments: [{ processDefinition: { processDefinitionKey: '1001', bpmnProcessId: 'demoProcess', version: 1 } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    // 1. createProcessInstance
    fetchMock.mockImplementationOnce(async (input: Request) => {
      expect(input.url).toContain('/process-instances');
      return new Response(JSON.stringify({ processInstanceKey: '5001', processDefinitionKey: '1001', bpmnProcessId: 'demoProcess', version: 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    // 2. searchProcessInstances
    fetchMock.mockImplementationOnce(async (input: Request) => {
      expect(input.url).toContain('/process-instances/search');
      return new Response(JSON.stringify({ items: [{ processInstanceKey: '5001', processDefinitionKey: '1001' }], total: 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });

    const deployment = await camunda.createDeployment({ resources: [new File(['dummy content'], 'dummy.bpmn', { type: 'application/octet-stream'})] });

    const { processDefinitionKey } = deployment.deployments[0].processDefinition!;
    const createResult = await camunda.createProcessInstance({ processDefinitionKey });

    const instanceKey = ProcessInstanceKey.assumeExists(String(createResult.processInstanceKey));

    const searchRes = await camunda.searchProcessInstances({ filter: { processInstanceKey: instanceKey } }, { consistency: { waitUpToMs: 5000 } });
    expect(createResult).toHaveProperty('processInstanceKey');
    expect(searchRes.items[0].processInstanceKey).toBe(String(instanceKey));
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});


