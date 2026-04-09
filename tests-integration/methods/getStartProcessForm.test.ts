import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../../dist';

describe('getStartProcessForm', () => {
  it('returns the form body when a linked form exists', { timeout: 30_000 }, async () => {
    const camunda = createCamundaClient();

    // Deploy the process with a start form
    const deployment = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/start-form-test-process.bpmn',
      './tests-integration/fixtures/sdk-test-form.form',
    ]);
    const { processDefinitionKey } = deployment.processes[0];

    // Get the start form — should return the form body, not undefined
    const form = await camunda.getStartProcessForm(
      { processDefinitionKey },
      { consistency: { waitUpToMs: 10_000 } }
    );

    expect(form).toBeDefined();
    expect(form).not.toBeNull();
    expect(form!.formId).toBe('sdk-test-form');
    expect(form!.schema).toBeTruthy();
    expect(form!.formKey).toBeTruthy();
  });
});
