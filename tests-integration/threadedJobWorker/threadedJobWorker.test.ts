import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../dist';

// The handler fixture is a .ts file loaded via dynamic import() in the worker thread.
// Node < 22 cannot import .ts files, so skip the entire suite on older runtimes.
const nodeVersion = parseInt(process.versions.node, 10);
const describeIf = nodeVersion >= 22 ? describe : describe.skip;

describeIf('createThreadedJobWorker', () => {
  it(
    'services a job via a threaded worker',
    async () => {
      const camunda = createCamundaClient();

      const res = await camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/threaded-job-process.bpmn',
      ]);
      const { processDefinitionKey } = res.processes[0];

      // Start the threaded worker before creating the process instance
      const worker = camunda.createThreadedJobWorker({
        jobType: 'threaded-test-job',
        handlerModule: join(process.cwd(), 'tests-integration/fixtures/threaded-handler.ts'),
        maxParallelJobs: 5,
        jobTimeoutMs: 30_000,
        threadPoolSize: 1,
      });

      // Create the process instance with awaitCompletion so we block until the
      // threaded worker completes the service task and the process finishes.
      const result = await camunda.createProcessInstance({
        processDefinitionKey,
        variables: { orderId: 'integration-test-123' },
        awaitCompletion: true,
        requestTimeout: 15_000,
      });

      expect(result.variables.processed).toBe(true);
      expect(result.variables.handledBy).toBe('threaded-worker');

      await worker.stopGracefully({ waitUpToMs: 3000 });
      camunda.stopAllWorkers();
    },
    { timeout: 20_000 }
  );

  it(
    'services multiple jobs concurrently with a thread pool',
    async () => {
      const camunda = createCamundaClient();

      const res = await camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/threaded-job-process.bpmn',
      ]);
      const { processDefinitionKey } = res.processes[0];

      const worker = camunda.createThreadedJobWorker({
        jobType: 'threaded-test-job',
        handlerModule: join(process.cwd(), 'tests-integration/fixtures/threaded-handler.ts'),
        maxParallelJobs: 10,
        jobTimeoutMs: 30_000,
        threadPoolSize: 2,
      });

      // Start several instances and wait for them all to complete
      const instances = await Promise.all(
        Array.from({ length: 3 }, () =>
          camunda.createProcessInstance({
            processDefinitionKey,
            variables: { orderId: `batch-${Date.now()}-${Math.random()}` },
            awaitCompletion: true,
            requestTimeout: 20_000,
          })
        )
      );

      for (const instance of instances) {
        expect(instance.variables.processed).toBe(true);
        expect(instance.variables.handledBy).toBe('threaded-worker');
      }

      await worker.stopGracefully({ waitUpToMs: 3000 });
      camunda.stopAllWorkers();
    },
    { timeout: 30_000 }
  );
});
