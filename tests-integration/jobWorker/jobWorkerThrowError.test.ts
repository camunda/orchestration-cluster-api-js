import { expect, test } from 'vitest';
import { createCamundaClient } from '../../dist';

test(
  'Throws a business error that is caught in the process',
  async () => {
    const camunda = createCamundaClient();

    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/Client-ThrowError.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];

    // Test- and test-run isolation: deterministically cancel any leftover ACTIVE
    // instances of this definition from prior runs BEFORE creating the new instance.
    //
    // We snapshot the currently-active instances and cancel each one explicitly by
    // key, rather than firing cancelProcessInstancesBatchOperation. A batch operation
    // is asynchronous and matches on processDefinitionKey over a server-side execution
    // window; when a backlog of active instances widens that window, the batch can
    // cancel the instance we create below — removing its sad-flow job so
    // awaitCompletion never resolves (a 20s timeout). Per-key cancellation targets
    // only instances that existed at snapshot time, never the one created afterwards,
    // so it isolates the run deterministically regardless of backlog size.
    //
    // The search uses waitUpToMs: 0 (a single read, no eventual-consistency wait):
    // the default search predicate blocks until items are non-empty, which would time
    // out on a clean run or on the final empty page. Snapshot all keys read-only
    // first (cursors stay valid because reads don't mutate), then cancel.
    type InstanceSearch = Awaited<ReturnType<typeof camunda.searchProcessInstances>>;
    const leftover: InstanceSearch['items'] = [];
    let after: InstanceSearch['page']['endCursor'] | undefined;
    do {
      const existing = await camunda.searchProcessInstances(
        {
          filter: { processDefinitionKey, state: 'ACTIVE' },
          page: after ? { after, limit: 100 } : { limit: 100 },
        },
        { consistency: { waitUpToMs: 0 } }
      );
      leftover.push(...existing.items);
      after = existing.page.endCursor ?? undefined;
    } while (after);
    await Promise.all(
      leftover.map((instance) =>
        // Tolerate instances that reached a terminal state between snapshot and
        // cancel — they are no longer a concern for isolation.
        camunda
          .cancelProcessInstance({ processInstanceKey: instance.processInstanceKey })
          .catch(() => undefined)
      )
    );

    camunda.createJobWorker({
      jobHandler: (job) => {
        return job.error({ errorCode: 'BUSINESS_ERROR', errorMessage: 'Well, that did not work' });
      },
      jobType: 'throw-bpmn-error-task',
      jobTimeoutMs: 30_000,
      maxParallelJobs: 1,
    });
    camunda.createJobWorker({
      jobType: 'sad-flow',
      jobHandler: (job) => {
        return job.complete({
          bpmnErrorCaught: true,
        });
      },
      maxParallelJobs: 1,
      jobTimeoutMs: 10_000,
    });
    try {
      const result = await camunda.createProcessInstance({
        processDefinitionKey,
        requestTimeout: 20_000,
        variables: {},
        awaitCompletion: true,
      });
      expect(result.variables.bpmnErrorCaught).toBe(true);
    } finally {
      // Always stop workers, even if awaitCompletion throws (timeout/transient
      // cluster error), so leftover workers cannot interfere with later tests.
      camunda.stopAllWorkers();
    }
  },
  { timeout: 60_000 }
);

// test.runIf(allowAny([{ deployment: 'saas' }, { deployment: 'self-managed' }]))(
// 	'Can set variables when throwing a BPMN Error',
// 	async () => {
// 		const zbc = new ZeebeGrpcClient()
// 		;({ bpmnProcessId, processDefinitionKey } = (
// 			await zbc.deployResource({
// 				processFilename: './src/__tests__/testdata/Client-ThrowError-2.bpmn',
// 			})
// 		).deployments[0].process)
// 		await cancelProcesses(processDefinitionKey)
// 		// This worker takes the first job and throws a BPMN error, setting a variable
// 		zbc.createWorker({
// 			taskHandler: (job) =>
// 				job.error({
// 					errorCode: 'BUSINESS_ERROR',
// 					errorMessage: "Well, that didn't work",
// 					variables: { something: 'someValue' },
// 				}),
// 			taskType: 'throw-bpmn-error-task-2',
// 		})
// 		// This worker is on the business error throw path
// 		zbc.createWorker({
// 			taskType: 'sad-flow-2',
// 			taskHandler: (job) =>
// 				job.complete({
// 					bpmnErrorCaught: true,
// 				}),
// 		})
// 		const result = await zbc.createProcessInstanceWithResult({
// 			bpmnProcessId,
// 			requestTimeout: 20000,
// 			variables: {},
// 		})
// 		expect(result.variables.bpmnErrorCaught).toBe(true)
// 		// This requires output mapping on the error in the BPMN diagram
// 		expect(result.variables.something).toBe('someValue')
// 		await zbc.close()
// 	}
// )
