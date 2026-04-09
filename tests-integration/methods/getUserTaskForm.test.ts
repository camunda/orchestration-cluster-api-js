import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../../dist';

describe('getUserTaskForm', () => {
  it('returns the form body for a user task with a linked form', { timeout: 30_000 }, async () => {
    const camunda = createCamundaClient();

    // Deploy the process with a linked form
    const deployment = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/form-test-process.bpmn',
      './tests-integration/fixtures/sdk-test-form.form',
    ]);
    const { processDefinitionKey } = deployment.processes[0];

    // Start a process instance to create a user task
    const { processInstanceKey } = await camunda.createProcessInstance({
      processDefinitionKey,
    });

    // Wait for the user task to be created and get its key
    const searchResult = await camunda.searchUserTasks(
      { filter: { processInstanceKey, state: 'CREATED' } },
      { consistency: { waitUpToMs: 10_000 } }
    );
    expect(searchResult.items!.length).toBeGreaterThan(0);
    const userTaskKey = searchResult.items![0].userTaskKey!;

    try {
      // Get the form for the user task — should return the form body, not undefined
      const form = await camunda.getUserTaskForm(
        { userTaskKey },
        { consistency: { waitUpToMs: 10_000 } }
      );

      expect(form).toBeDefined();
      expect(form).not.toBeNull();
      expect(form!.formId).toBe('sdk-test-form');
      expect(form!.schema).toBeTruthy();
      expect(form!.formKey).toBeTruthy();
    } finally {
      await camunda.cancelProcessInstance({ processInstanceKey });
    }
  });
});
