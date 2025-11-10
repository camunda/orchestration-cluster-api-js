import { describe, it, expect } from 'vitest';

import {
  createCamundaClient,
  EventualConsistencyTimeoutError,
  ProcessDefinitionId,
  ProcessInstanceKey,
} from '../dist';

describe('eventual consistency', () => {
  it('can wait for eventual consistency', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
    });

    const get = await camunda.getProcessInstance(
      { processInstanceKey: process.processInstanceKey },
      { consistency: { waitUpToMs: 10_000, trace: true } }
    );

    expect(get.processInstanceKey).toBe(process.processInstanceKey);
  });

  it('throws by default', { timeout: 2_000 }, async () => {
    const camunda = createCamundaClient();

    await expect(
      camunda.searchProcessInstances(
        {
          filter: {
            processDefinitionId: ProcessDefinitionId.assumeExists(
              'this-definitely-does-not-exist' + Date.now().toString()
            ),
          },
        },
        { consistency: { waitUpToMs: 1_000 } }
      )
    ).rejects.toThrow();
  });

  it('can cancel, and throws', { timeout: 2_000 }, async () => {
    const camunda = createCamundaClient();

    const res = camunda.searchProcessInstances(
      {
        filter: {
          processDefinitionId: ProcessDefinitionId.assumeExists(
            'this-definitely-does-not-exist' + Date.now().toString()
          ),
        },
      },
      { consistency: { waitUpToMs: 1_000 } }
    );
    res.cancel();
    await expect(res).rejects.toThrow('Cancelled');
  });

  it(
    'throws EventualConsistencyTimeoutError when nothing is found',
    { timeout: 2_000 },
    async () => {
      const camunda = createCamundaClient();

      const res = camunda.searchProcessInstances(
        {
          filter: {
            processDefinitionId: ProcessDefinitionId.assumeExists(
              'this-definitely-does-not-exist' + Date.now().toString()
            ),
          },
        },
        { consistency: { waitUpToMs: 1_000 } }
      );
      await expect(res).rejects.toThrowError(EventualConsistencyTimeoutError);
    }
  );

  it('throws NOT_FOUND when nothing is found and waitUpToMs is 0', { timeout: 2_000 }, async () => {
    const camunda = createCamundaClient();

    const res = camunda.getProcessInstance(
      {
        processInstanceKey: ProcessInstanceKey.assumeExists(Date.now().toString()),
      },
      { consistency: { waitUpToMs: 0 } }
    );
    await expect(res).rejects.toThrowError('NOT_FOUND');
  });

  it(
    'throws EventualConsistencyTimeoutError when nothing is found and waitUpToMs is 1_000',
    { timeout: 2_000 },
    async () => {
      const camunda = createCamundaClient();

      const res = camunda.getProcessInstance(
        {
          processInstanceKey: ProcessInstanceKey.assumeExists(Date.now().toString()),
        },
        { consistency: { waitUpToMs: 1_000 } }
      );
      await expect(res).rejects.toThrowError(EventualConsistencyTimeoutError);
    }
  );
});
