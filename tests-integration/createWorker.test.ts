import { describe, it, vitest, expect } from 'vitest';

import { createCamundaClient } from '../dist';

vitest.setConfig({ testTimeout: 15_000 });

describe('createJobWorker', () => {
  it('Creates a worker', () => {
    const camunda = createCamundaClient();
    camunda.createJobWorker({
      jobType: 'service-task',
      maxParallelJobs: 5,
      jobTimeoutMs: 20_000,
      jobHandler: (job) => {
        console.log(`[Zeebe Worker] handling job of type ${job.type}`);
        return job.complete({
          serviceTaskOutcome: 'We did it!',
        });
      },
    });
    camunda.stopAllWorkers();
  });
  it('can service jobs', async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: 3,
      },
    });
    await new Promise<void>((resolve) =>
      camunda.createJobWorker({
        jobType: 'test-job',
        maxParallelJobs: 5,
        jobTimeoutMs: 20_000,
        jobHandler: (job) => {
          resolve();
          return job.complete({
            serviceTaskOutcome: 'We did it!',
          });
        },
      })
    );
    expect(true).toBeTruthy();
  });
});
