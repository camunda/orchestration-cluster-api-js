import { test, expect } from 'vitest';

import { createCamundaClient, TenantId } from '../dist';

test('activates and completes job correctly', async () => {
    const camunda = createCamundaClient();

    const tenantId = TenantId.assumeExists('<default>')

    const res = await camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/test-job-process.bpmn',
    ], { tenantId });

    console.log('res', JSON.stringify(res, null, 2))
    const process = await camunda.createProcessInstance({
        processDefinitionKey: res.processes[0].processDefinitionKey,
        tenantId
    });

    // const get = await camunda.getProcessInstance(
    //     { processInstanceKey: process.processInstanceKey },
    //     { consistency: { waitUpToMs: 10000, trace: true } }
    // );

    const jobs = await camunda.activateJobs({
        maxJobsToActivate: 1,
        timeout: 1000,
        worker: 'test-job-worker',
        type: 'test-job',
        tenantIds: [tenantId]
    })

    console.log(JSON.stringify(jobs.jobs[0], null, 2))

    // expect(jobs.jobs[0].retries).toBe(3)

    const failureResponse = await camunda.failJob({
        jobKey: jobs.jobs[0].jobKey,
        retries: 1
    })

    await camunda.failJob({
        jobKey: jobs.jobs[0].jobKey,
        retries: 8
    })


    const jobs2 = await camunda.activateJobs({
        maxJobsToActivate: 1,
        timeout: 1000,
        worker: 'test-job-worker',
        type: 'test-job',
        tenantIds: [tenantId]
    })

    console.log(JSON.stringify(jobs2.jobs[0], null, 2))

    expect(jobs.jobs[0].jobKey).toBe(jobs2.jobs[0].jobKey)
    await camunda.completeJob({ jobKey: jobs.jobs[0].jobKey })

    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey }).catch(e => e);
})
