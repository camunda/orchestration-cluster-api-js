// Compilable usage examples for user task operations.
// These examples are type-checked during build to guard against API regressions.

import { createCamundaClient, UserTaskKey } from '@camunda8/orchestration-cluster-api';

//#region AssignUserTask
async function assignUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.assignUserTask({
    userTaskKey,
    assignee: 'alice',
    allowOverride: true,
  });
}
//#endregion AssignUserTask

//#region CompleteUserTask
async function completeUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.completeUserTask({
    userTaskKey,
    variables: {
      approved: true,
      comment: 'Looks good',
    },
  });
}
//#endregion CompleteUserTask

//#region UnassignUserTask
async function unassignUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.unassignUserTask({ userTaskKey });
}
//#endregion UnassignUserTask

//#region SearchUserTasks
async function searchUserTasksExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUserTasks(
    {
      filter: { assignee: 'alice', state: 'CREATED' },
      sort: [{ field: 'creationDate', order: 'DESC' }],
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const task of result.items ?? []) {
    console.log(`${task.userTaskKey}: ${task.name} (${task.state})`);
  }
}
//#endregion SearchUserTasks

// Suppress "declared but never read"
void assignUserTaskExample;
void completeUserTaskExample;
void unassignUserTaskExample;
void searchUserTasksExample;
