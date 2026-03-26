import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCamundaClient, type ProcessInstanceKey } from '../../dist';

// The handler fixture is a .ts file loaded via dynamic import() in the worker thread.
// Node < 22 cannot import .ts files, so skip the entire suite on older runtimes.
const nodeVersion = parseInt(process.versions.node, 10);
const describeIf = nodeVersion >= 22 ? describe : describe.skip;

/** Cancel a process instance, swallowing 404 (already completed). */
async function safeCancel(
  camunda: ReturnType<typeof createCamundaClient>,
  processInstanceKey: ProcessInstanceKey
) {
  try {
    await camunda.cancelProcessInstance({ processInstanceKey });
  } catch (e: any) {
    if (e?.status !== 404) throw e;
  }
}

describeIf('createThreadedJobWorker', () => {
  it('services a job via a threaded worker', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient();
    const jobType = `threaded-test-job-${randomUUID()}`;

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/threaded-job-process.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];

    const worker = camunda.createThreadedJobWorker({
      jobType,
      handlerModule: join(process.cwd(), 'tests-integration/fixtures/threaded-handler.ts'),
      maxParallelJobs: 5,
      jobTimeoutMs: 30_000,
      threadPoolSize: 1,
    });

    let processInstanceKey: ProcessInstanceKey | undefined;
    try {
      const result = await camunda.createProcessInstance({
        processDefinitionKey,
        variables: { jobType, orderId: 'integration-test-123' },
        awaitCompletion: true,
        requestTimeout: 15_000,
      });
      processInstanceKey = result.processInstanceKey;

      expect(result.variables.processed).toBe(true);
      expect(result.variables.handledBy).toBe('threaded-worker');
    } finally {
      await worker.stopGracefully({ waitUpToMs: 3000 });
      camunda.stopAllWorkers();
      if (processInstanceKey) await safeCancel(camunda, processInstanceKey);
    }
  });

  it('services multiple jobs concurrently with a thread pool', { timeout: 30_000 }, async () => {
    const camunda = createCamundaClient();
    const jobType = `threaded-test-job-${randomUUID()}`;

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/threaded-job-process.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];

    const worker = camunda.createThreadedJobWorker({
      jobType,
      handlerModule: join(process.cwd(), 'tests-integration/fixtures/threaded-handler.ts'),
      maxParallelJobs: 10,
      jobTimeoutMs: 30_000,
      threadPoolSize: 2,
    });

    const instanceKeys: ProcessInstanceKey[] = [];
    try {
      const instances = await Promise.all(
        Array.from({ length: 3 }, () =>
          camunda.createProcessInstance({
            processDefinitionKey,
            variables: { jobType, orderId: `batch-${Date.now()}-${Math.random()}` },
            awaitCompletion: true,
            requestTimeout: 20_000,
          })
        )
      );
      instanceKeys.push(...instances.map((i) => i.processInstanceKey));

      for (const instance of instances) {
        expect(instance.variables.processed).toBe(true);
        expect(instance.variables.handledBy).toBe('threaded-worker');
      }
    } finally {
      await worker.stopGracefully({ waitUpToMs: 3000 });
      camunda.stopAllWorkers();
      await Promise.all(instanceKeys.map((key) => safeCancel(camunda, key)));
    }
  });
});
