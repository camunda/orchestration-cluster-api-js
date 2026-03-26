// Compilable usage examples for batch operations.
// These examples are type-checked during build to guard against API regressions.

import {
  BatchOperationKey,
  createCamundaClient,
  ElementId,
  ProcessDefinitionKey,
} from '@camunda8/orchestration-cluster-api';

//#region GetBatchOperation
async function getBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  const batch = await camunda.getBatchOperation(
    { batchOperationKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Batch: ${batch.batchOperationType} (${batch.state})`);
}
//#endregion GetBatchOperation

//#region SearchBatchOperations
async function searchBatchOperationsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchBatchOperations(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const batch of result.items ?? []) {
    console.log(`${batch.batchOperationKey}: ${batch.batchOperationType} (${batch.state})`);
  }
}
//#endregion SearchBatchOperations

//#region SearchBatchOperationItems
async function searchBatchOperationItemsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchBatchOperationItems(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const item of result.items ?? []) {
    console.log(`Item: ${item.itemKey} (${item.state})`);
  }
}
//#endregion SearchBatchOperationItems

//#region CancelBatchOperation
async function cancelBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.cancelBatchOperation({ batchOperationKey });
}
//#endregion CancelBatchOperation

//#region SuspendBatchOperation
async function suspendBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.suspendBatchOperation({ batchOperationKey });
}
//#endregion SuspendBatchOperation

//#region ResumeBatchOperation
async function resumeBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.resumeBatchOperation({ batchOperationKey });
}
//#endregion ResumeBatchOperation

//#region CancelProcessInstancesBatchOperation
async function cancelProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.cancelProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion CancelProcessInstancesBatchOperation

//#region DeleteProcessInstancesBatchOperation
async function deleteProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.deleteProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion DeleteProcessInstancesBatchOperation

//#region MigrateProcessInstancesBatchOperation
async function migrateProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.migrateProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
    migrationPlan: {
      targetProcessDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685250'),
      mappingInstructions: [
        {
          sourceElementId: ElementId.assumeExists('task-a'),
          targetElementId: ElementId.assumeExists('task-b'),
        },
      ],
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion MigrateProcessInstancesBatchOperation

//#region ModifyProcessInstancesBatchOperation
async function modifyProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.modifyProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
    moveInstructions: [
      {
        sourceElementId: ElementId.assumeExists('task-a'),
        targetElementId: ElementId.assumeExists('task-b'),
      },
    ],
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion ModifyProcessInstancesBatchOperation

//#region ResolveIncidentsBatchOperation
async function resolveIncidentsBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.resolveIncidentsBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion ResolveIncidentsBatchOperation

//#region DeleteDecisionInstancesBatchOperation
async function deleteDecisionInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.deleteDecisionInstancesBatchOperation({
    filter: {},
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion DeleteDecisionInstancesBatchOperation

// Suppress "declared but never read"
void getBatchOperationExample;
void searchBatchOperationsExample;
void searchBatchOperationItemsExample;
void cancelBatchOperationExample;
void suspendBatchOperationExample;
void resumeBatchOperationExample;
void cancelProcessInstancesBatchOperationExample;
void deleteProcessInstancesBatchOperationExample;
void migrateProcessInstancesBatchOperationExample;
void modifyProcessInstancesBatchOperationExample;
void resolveIncidentsBatchOperationExample;
void deleteDecisionInstancesBatchOperationExample;

// Suppress "declared but never read"
void getBatchOperationExample;
void searchBatchOperationsExample;
void searchBatchOperationItemsExample;
void cancelBatchOperationExample;
void suspendBatchOperationExample;
void resumeBatchOperationExample;
void cancelProcessInstancesBatchOperationExample;
void deleteProcessInstancesBatchOperationExample;
void migrateProcessInstancesBatchOperationExample;
void modifyProcessInstancesBatchOperationExample;
void resolveIncidentsBatchOperationExample;
void deleteDecisionInstancesBatchOperationExample;
