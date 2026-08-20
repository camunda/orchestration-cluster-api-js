import { createCamundaEffectClient, eventually } from '@camunda8/orchestration-cluster-api/effect';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';

describe('effect client', () => {
  it('deploys -> starts instance -> finds it via eventual search (Effect pipeline)', {
    timeout: 30000,
  }, async () => {
    const camunda = createCamundaEffectClient();

    const program = Effect.gen(function* () {
      const deployment = yield* camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/test-process.bpmn',
      ]);

      const { processInstanceKey } = yield* camunda.createProcessInstance({
        processDefinitionKey: deployment.processes[0].processDefinitionKey,
      });

      const search = yield* eventually(
        // waitUpToMs: 0 disables the SDK's own wall-clock consistency polling —
        // the Effect `eventually` combinator below drives the predicate + timeout
        // on the Effect Clock instead, so the wait is deterministic under TestClock.
        camunda.searchProcessInstances(
          { filter: { processInstanceKey } },
          { consistency: { waitUpToMs: 0 } }
        ),
        (s) => s.items.some((i: any) => i.processInstanceKey === processInstanceKey),
        { waitUpTo: '30 seconds', interval: '750 millis' }
      );

      return { instanceKey: processInstanceKey, search };
    });

    const { instanceKey, search } = await Effect.runPromise(program);

    expect(Array.isArray(search.items)).toBe(true);
    expect(search.items.some((i: any) => i.processInstanceKey === instanceKey)).toBe(true);
  });
});
