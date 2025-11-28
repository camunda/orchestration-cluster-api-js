import { test, expect } from 'vitest';

import { createCamundaClient } from '../../dist';

test(
	'Throws a business error that is caught in the process',
	async () => {
		const camunda = createCamundaClient();

		const res = await camunda.deployResourcesFromFiles([
			'./tests-integration/fixtures/Client-ThrowError.bpmn',
		]);
		const { processDefinitionKey } = res.processes[0] 
		await camunda.cancelProcessInstancesBatchOperation({filter: {processDefinitionKey}}, {consistency: {waitUpToMs: 0}})

		camunda.createJobWorker({
			jobHandler: (job) => {
				return job.error({errorCode: 'BUSINESS_ERROR', errorMessage: 'Well, that did not work'})
			},
			jobType: 'throw-bpmn-error-task',
			jobTimeoutMs: 30_000,
			maxParallelJobs: 1
		})
		camunda.createJobWorker({
			jobType: 'sad-flow',
			jobHandler: (job) => {
				return job.complete({
					bpmnErrorCaught: true,
				})
			},
			maxParallelJobs: 1,
			jobTimeoutMs: 10_000
		})
		const result = await camunda.createProcessInstance({
			processDefinitionKey,
			requestTimeout: 20_000,
			variables: {},
			awaitCompletion: true
		})
		expect(result.variables.bpmnErrorCaught).toBe(true)
		camunda.stopAllWorkers()
	}, {timeout: 20_000}
)

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
