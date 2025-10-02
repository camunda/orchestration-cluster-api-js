import { test, expect } from 'vitest';

import { createCamundaClient, TenantId } from '../dist';

test('activates and completes job correctly', async () => {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('<default>');

  const res = await camunda.deployResourcesFromFiles(
    ['./tests-integration/fixtures/test-job-process.bpmn'],
    { tenantId }
  );

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
    tenantId,
  });

  const jobs = await camunda.activateJobs({
    maxJobsToActivate: 1,
    timeout: 1000,
    worker: 'test-job-worker',
    type: 'test-job',
    tenantIds: [tenantId],
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
    tenantIds: [tenantId],
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
