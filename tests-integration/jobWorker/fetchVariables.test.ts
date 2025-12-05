import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../dist';

// This test verifies that when fetchVariables is configured on the worker,
// the variables visible on activated jobs are limited to the specified keys.
// Note: This test assumes a running Camunda 8 environment reachable via env config.
// If the environment is not available, this test will be skipped or fail accordingly.

describe('job worker fetchVariables', () => {
  it(
    'only fetches requested variables on activation',
    async () => {
      const camunda = createCamundaClient();

      // Deploy a simple process with a service task of type 'test-job'
      const dep = await camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/fetch-variables-process.bpmn',
      ]);
      const defKey = dep.processes[0].processDefinitionKey;

      const seen: any[] = [];
      const worker = camunda.createJobWorker({
        jobType: 'fetch-variable-test-job',
        jobTimeoutMs: 10_000,
        maxParallelJobs: 1,
        fetchVariables: ['keepMe'],
        jobHandler: async (job) => {
          seen.push(job.variables);
          return job.complete();
        },
      });

      // Start a process instance with extra variables so filtering can be observed
      await camunda.createProcessInstance({
        processDefinitionKey: defKey,
        variables: { keepMe: 'value', dropMe: 'secret', another: 123 },
        requestTimeout: 10_000,
      });

      // Allow some time for activation and handling
      await new Promise((r) => setTimeout(r, 4000));

      await worker.stopGracefully({ waitUpToMs: 5000 });

      // Assert variable filtering occurred on any observed jobs
      expect(seen.length).toBeGreaterThan(0);
      for (const v of seen) {
        expect(v).toHaveProperty('keepMe');
        expect(v.keepMe).toBe('value');
        expect(v).not.toHaveProperty('dropMe');
        expect(v).not.toHaveProperty('another');
      }
    },
    { timeout: 15000 }
  );
});
