import { describe, it, expect } from 'vitest';

import { createCamundaClient, JobActionReceiptSymbol } from '../dist';
import { JobWorker } from '../src/runtime/jobWorker';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('JobWorker graceful stop', () => {
  it('drains active jobs before stopping', async () => {
    const camunda = createCamundaClient();
    // Deploy a process producing service task jobs of type test-job
    const dep = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-job-process.bpmn',
    ]);
    const defKey = dep.processes[0].processDefinitionKey;
    // Start several instances to ensure multiple jobs available
    const instances = 3;
    for (let i = 0; i < instances; i++) {
      await camunda.createProcessInstance({ processDefinitionKey: defKey });
    }

    // Create worker with small concurrency to show draining behavior
    const worker = new JobWorker(camunda as any, {
      jobType: 'test-job',
      maxParallelJobs: 2,
      jobTimeoutMs: 30_000,
      jobHandler: async (job: any) => {
        // Simulate work time
        await delay(50);
        await job.complete();
        return JobActionReceiptSymbol;
      },
    });

    // Wait until at least one job is being processed
    const startWait = Date.now();
    while (worker.activeJobs === 0 && Date.now() - startWait < 2000) {
      await delay(10);
    }
    expect(worker.activeJobs).toBeGreaterThan(0);

    // Initiate graceful stop
    const resultPromise = worker.stopGracefully({ waitUpToMs: 3000 });

    // While graceful stop is waiting, active jobs should eventually drop to 0
    const drainStart = Date.now();
    while (worker.activeJobs > 0 && Date.now() - drainStart < 4000) {
      await delay(10);
    }

    const result = await resultPromise;
    expect(worker.stopped).toBe(true);
    expect(worker.activeJobs).toBe(0);
    expect(result.timedOut).toBe(false);
    expect(result.remainingJobs).toBe(0);
  });
});
