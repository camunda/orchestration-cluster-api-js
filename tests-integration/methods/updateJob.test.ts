import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { cancelActiveInstancesForDefinitions } from '../setup/cancelTasks';

describe('updateJob', () => {
  it('can update a Job', { timeout: 30_000 }, async () => {
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_SDK_LOG_LEVEL: 'error',
      },
    });
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    await cancelActiveInstancesForDefinitions([res.processes[0].processDefinitionId]);
    const { processInstanceKey } = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      variables: {
        testVar: 3,
      },
    });

    const response = await camunda.searchJobs(
      {
        filter: {
          processInstanceKey,
        },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );
    const job1 = response.items[0];
    console.log('**************', job1);
    expect(job1.retries).toBe(3);

    await camunda.updateJob({ changeset: { retries: 4 }, jobKey: job1.jobKey });

    const jobs = await camunda.activateJobs({
      type: 'test-job',
      maxJobsToActivate: 1,
      timeout: 10_000,
    });
    const job2 = jobs.jobs[0];
    // const subsequentState = await camunda.searchJobs(
    //   {
    //     filter: {
    //       jobKey: job1.jobKey,
    //     },
    //   },
    //   {
    //     consistency: {
    //       waitUpToMs: 35_000,
    //       predicate: (res) => {
    //         // console.log(JSON.stringify(res, null, 2))
    //         return res.items[0]?.retries === 4;
    //       },
    //       pollIntervalMs: 1_000,
    //     },
    //   }
    // );
    // const job2 = subsequentState.items[0];
    expect(job2.retries).toBe(4);
    await camunda.cancelProcessInstance({ processInstanceKey });
  });
});
