import { describe, it, expect } from 'vitest';

import { createCamundaClient, UserTaskKey } from '../../dist';

describe('searchUserTasks', () => {
  it('can search user tasks', async () => {
    const camunda = createCamundaClient();

    const results = await camunda.searchUserTasks(
      {
        filter: { state: 'CREATED' },
      },
      { consistency: { waitUpToMs: 0 } }
    );
    expect(results.items).toBeTruthy();
  });

  it('can use a task poller and can claim and complete a task', { timeout: 20_000 }, async () => {
    const camunda = createCamundaClient();
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/user-task-process.bpmn',
    ]);
    const { processDefinitionKey } = res.processes[0];
    const { processInstanceKey } = await camunda.createProcessInstance({
      processDefinitionKey,
      variables: {
        userTaskCompleted: false,
      },
    });

    // User task poller
    const last = new Set<UserTaskKey>();
    const userTaskPoller = camunda.searchUserTasks(
      {
        filter: {
          state: 'CREATED',
        },
      },
      {
        // To set up a subscription, set waitUpToMs to Infinity
        consistency: {
          waitUpToMs: Infinity,
          pollIntervalMs: 1_000,
          predicate: async (results) => {
            // polling memoization - handles idempotency with eventually consistent mutation
            const current = results.items.filter((item) => !last.has(item.userTaskKey));
            last.clear();
            results.items.forEach((task) => last.add(task.userTaskKey));
            for (const userTask of current) {
              // console.log(
              //   `Claiming task ${userTask.userTaskKey} from process ${userTask.processInstanceKey}`
              // );
              await camunda.assignUserTask({
                userTaskKey: userTask.userTaskKey,
                assignee: 'jwulf',
              });

              // console.log(
              //   `Completing user task ${userTask.userTaskKey} from process ${userTask.processInstanceKey}`
              // );
              await camunda.completeUserTask({
                userTaskKey: userTask.userTaskKey,
                variables: {
                  userTaskCompleted: true,
                },
              });
            }
            return false;
          },
        },
      }
    );
    userTaskPoller.catch((e) => {
      if (e.name === 'CancelSdkError') {
        return; // swallow cancelation
      }
      throw e;
    });

    // Wait for our process to be completed
    await camunda.searchProcessInstances(
      {
        filter: {
          processInstanceKey,
          state: 'COMPLETED',
        },
      },
      { consistency: { waitUpToMs: 10_000 } }
    );
    // console.log('Process completed, retrieving variables...');
    const variables = await camunda.searchVariables(
      {
        filter: {
          processInstanceKey,
        },
      },
      { consistency: { waitUpToMs: 5_000 } }
    );
    const finalValues = variables.items
      .map((item) => ({ [item.name]: item.value }))
      .reduce((curr, prev) => ({ ...curr, ...prev }), {});
    // console.log(`Process instance ${processInstanceKey} completed with variables:`, JSON.stringify(finalValues, null, 2));
    expect(finalValues.userTaskCompleted).toBe('true');
    userTaskPoller.cancel();
  });
});
