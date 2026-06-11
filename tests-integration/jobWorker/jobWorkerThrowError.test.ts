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

    // Cancel any leftover instances of this definition from prior runs, then wait
    // for the batch operation to reach a terminal state BEFORE creating the new
    // instance. cancelProcessInstancesBatchOperation is asynchronous: it returns a
    // batchOperationKey immediately and cancels matching instances over a
    // server-side window. Because the filter matches on processDefinitionKey alone,
    // an in-flight batch can cancel the instance we create below, removing its
    // sad-flow job so awaitCompletion never resolves. Waiting for a terminal state
    // is the deterministic signal that cancellation can no longer affect the new
    // instance.
    const { batchOperationKey } = await camunda.cancelProcessInstancesBatchOperation(
      { filter: { processDefinitionKey } },
      { consistency: { waitUpToMs: 0 } }
    );
    const TERMINAL_BATCH_STATES = ['COMPLETED', 'PARTIALLY_COMPLETED', 'CANCELED', 'FAILED'];
    await camunda.getBatchOperation(
      { batchOperationKey },
      {
        consistency: {
          waitUpToMs: 15_000,
          pollIntervalMs: 200,
          predicate: (batch) => TERMINAL_BATCH_STATES.includes(batch.state),
        },
      }
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
    const result = await camunda.createProcessInstance({
      processDefinitionKey,
      requestTimeout: 20_000,
      variables: {},
      awaitCompletion: true,
    });
    expect(result.variables.bpmnErrorCaught).toBe(true);
    camunda.stopAllWorkers();
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
