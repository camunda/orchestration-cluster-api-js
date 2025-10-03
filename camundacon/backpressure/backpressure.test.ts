import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

beforeAll(async () => {
  const camunda = createCamundaClient();

  const activeProcesses = await camunda.searchProcessInstances(
    {
      filter: {
        state: 'ACTIVE',
        processDefinitionId: 'Process_0f7cr6y',
      },
    },
    { consistency: { waitUpToMs: 0, trace: true } }
  );
  for (const instance of activeProcesses.items) {
    console.log(`Cleaning up process instance with key ${instance.processInstanceKey}`);
    await camunda.cancelProcessInstance({ processInstanceKey: instance.processInstanceKey });
  }
});

describe('backpressure', { timeout: 30_000 }, () => {
  it('demonstrates the backpressure characteristic', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_SDK_LOG_LEVEL: 'trace',
      },
    });

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];

    await camunda.getProcessDefinition(
      { processDefinitionKey },
      { consistency: { waitUpToMs: 1_000, trace: true } }
    );

    const processGenerator = setInterval(() => {
      camunda.createProcessInstance({
        processDefinitionKey,
      });
    }, 3);

    setTimeout(() => clearInterval(processGenerator), 10_000);

    setInterval(async () => {
      const jobs = await camunda.activateJobs({
        type: 'test-job',
        maxJobsToActivate: 1,
        timeout: 5_000,
        worker: 'test-worker-1',
      });
      await camunda.completeJob({ jobKey: jobs.jobs[0].jobKey, variables: { foo: 'bar' } });
    }, 3);

    await new Promise((resolve) => setTimeout(resolve, 15_000));
    // const getProcess = await camunda.getProcessInstance(
    //   { processInstanceKey: process.processInstanceKey },
    //   { consistency: { waitUpToMs: 1_000, trace: true } }
    // );

    // console.log(JSON.stringify(getProcess, null, 2));
    // expect(getProcess.processInstanceKey).toBe(process.processInstanceKey);
  });
});
