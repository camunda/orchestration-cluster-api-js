import { createCamundaFpClient, isLeft } from '@camunda8/orchestration-cluster-api/fp';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { describe, it, expect } from 'vitest';

describe('fp-ts client', () => {
  it(
    'deploys -> starts instance -> finds it via eventual search (TaskEither pipeline)',
    { timeout: 30000 },
    async () => {
      const fp = createCamundaFpClient({});

      const program = pipe(
        fp.deployResourcesFromFiles(['./tests-integration/fixtures/test-process.bpmn']),
        TE.chain((deployment) =>
          fp.createProcessInstance({
            processDefinitionKey: deployment.processes[0].processDefinitionKey,
          })
        ),
        TE.chain(({ processInstanceKey }) =>
          pipe(
            fp.searchProcessInstances(
              {
                filter: { processInstanceKey },
              },
              { consistency: { waitUpToMs: 30000, pollIntervalMs: 750 } }
            ),
            TE.map((search) => ({ instanceKey: processInstanceKey, search }))
          )
        )
      );

      const result = await program();

      if (isLeft(result))
        throw new Error(
          'FP pipeline failed: ' + ((result.left as any)?.message || JSON.stringify(result.left))
        );
      if (result._tag !== 'Right') {
        throw new Error(`Expected Right but got Left: ${JSON.stringify(result.left)}`);
      }
      const { instanceKey, search } = result.right;
      expect(Array.isArray(search.items)).toBe(true);
      expect(search.items.some((i: any) => i.processInstanceKey === instanceKey)).toBe(true);
    }
  );
});
