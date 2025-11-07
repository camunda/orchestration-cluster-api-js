import { test, expect } from 'vitest';

import { createCamundaClient, createCamundaClientLoose } from '../dist';

test('activates and completes job correctly', async () => {
  const camunda = createCamundaClient();

  const res = await camunda.deployResourcesFromFiles([
    './tests-integration/fixtures/test-job-process.bpmn',
  ]);

  // Cancel existing instances
  const existingProcesses = await camunda.searchProcessInstances(
    {
      filter: {
        processDefinitionKey: res.processes[0].processDefinitionKey,
        state: 'ACTIVE',
      },
    },
    { consistency: { waitUpToMs: 0 } }
  );
  for (const process of existingProcesses.items) {
    await camunda
      .cancelProcessInstance({
        processInstanceKey: process.processInstanceKey,
      })
      .catch((e) => {
        if (e?.status !== 404) {
          throw e;
        }
      });
  }

  const process = await camunda.createProcessInstance({
    processDefinitionKey: res.processes[0].processDefinitionKey,
  });

  const jobs = await camunda.activateJobs({
    maxJobsToActivate: 1,
    timeout: 1000,
    worker: 'test-job-worker',
    type: 'test-job',
  });

  expect(jobs.jobs[0].retries).toBe(3);

  await camunda.failJob({
    jobKey: jobs.jobs[0].jobKey,
    retries: 1,
  });

  await camunda.failJob({
    jobKey: jobs.jobs[0].jobKey,
    retries: 8,
  });

  const jobs2 = await camunda.activateJobs({
    maxJobsToActivate: 1,
    timeout: 1000,
    worker: 'test-job-worker',
    type: 'test-job',
  });

  expect(jobs.jobs[0].jobKey).toBe(jobs2.jobs[0].jobKey);
  await camunda.completeJob({ jobKey: jobs.jobs[0].jobKey });

  await camunda
    .cancelProcessInstance({ processInstanceKey: process.processInstanceKey })
    .catch((e) => {
      if (!e?.message.includes('NOT_FOUND')) {
        throw e;
      }
    });
});

test('Can cancel an in-flight REST job activation call', async () => {
  const camunda = createCamundaClientLoose();
  const res = camunda.activateJobs({
    maxJobsToActivate: 2,
    requestTimeout: 5000,
    timeout: 5000,
    type: 'non-existent-type-' + Date.now().toString(),
    worker: 'test',
  });

  res.cancel();
  await expect(res).rejects.toMatchObject({ name: 'CancelSdkError' });
});
