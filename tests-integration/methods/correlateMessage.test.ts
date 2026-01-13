import { randomUUID } from 'node:crypto';

import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../../src';

describe('correlateMessage', { timeout: 10_000 }, () => {
  it('correlates a message', async () => {
    // Type testing for https://github.com/camunda/orchestration-cluster-api-js/issues/45
    const camunda = createCamundaClient();

    const deployments = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/message-test.bpmn',
    ]);

    const { processDefinitionKey } = deployments.processes[0];

    const uuid = randomUUID();
    await camunda.createProcessInstance({
      processDefinitionKey,
      variables: {
        testMessageCorrelationField: uuid,
      },
    });

    const correlation = await camunda.correlateMessage({
      correlationKey: uuid,
      name: 'test-message-1',
    });

    const res = await camunda.searchCorrelatedMessageSubscriptions(
      {
        filter: { correlationKey: uuid },
      },
      { consistency: { waitUpToMs: 5000 } }
    );

    expect(res.items?.[0].correlationKey).toBe(uuid);
    expect(res.items?.[0].messageKey).toBe(correlation.messageKey);
  });
});
