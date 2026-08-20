import {
  createCamundaEffectClient,
  createCamundaEffectWorker,
  eventually,
  type Job,
  layer,
} from '@camunda8/orchestration-cluster-api/effect';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';

// End-to-end: an Effect worker completes a real job, driving a process instance to
// completion. The worker is provided the `/effect` client `Layer` (#437) as its
// dependency and runs inside a `Scope` so it is interrupted when the program ends.
//
// NOTE: this test deploys a *dedicated* fixture + job type (`effect-worker-job`)
// rather than sharing the `test-job` type used by the other integration tests. The
// worker is torn down via scope-close interruption (which aborts its in-flight
// long-poll `activateJobs`), and against a shared broker that abort leaves a brief
// consumer/lock window; if it polled `test-job` it could grab the job a later,
// sequential test (e.g. `methods/activateJobs.test.ts`) creates, starving it to 0
// jobs. Isolating the job type makes that cross-test contention impossible.

describe('effect worker', () => {
  it('deploys -> starts instance -> Effect worker completes the job -> instance completes', {
    timeout: 30000,
  }, async () => {
    const camunda = createCamundaEffectClient();

    // Deploy + start an instance up-front (Promise-flavoured Effect pipeline).
    const setup = Effect.gen(function* () {
      const deployment = yield* camunda.deployResourcesFromFiles([
        './tests-integration/fixtures/effect-worker-job-process.bpmn',
      ]);
      const { processInstanceKey } = yield* camunda.createProcessInstance({
        processDefinitionKey: deployment.processes[0].processDefinitionKey,
      });
      return processInstanceKey;
    });

    const processInstanceKey = await Effect.runPromise(setup);

    // Run an Effect worker that completes the `effect-worker-job` job, then wait until the
    // process instance is reported completed.
    const program = Effect.gen(function* () {
      yield* createCamundaEffectWorker<{ handledBy: string; jobKey: string }>({
        type: 'effect-worker-job',
        handler: (job: Job) =>
          Effect.succeed({ handledBy: 'effect-worker', jobKey: String(job.jobKey) }),
        pollInterval: '250 millis',
        maxJobsToActivate: 5,
      });

      const search = yield* eventually(
        camunda.searchProcessInstances(
          { filter: { processInstanceKey } },
          { consistency: { waitUpToMs: 0 } }
        ),
        (s) =>
          s.items.some(
            (i) => i.processInstanceKey === processInstanceKey && i.state === 'COMPLETED'
          ),
        { waitUpTo: '25 seconds', interval: '500 millis' }
      );
      return search;
    }).pipe(Effect.scoped, Effect.provide(layer()));

    const search = await Effect.runPromise(program);

    expect(
      search.items.some(
        (i) => i.processInstanceKey === processInstanceKey && i.state === 'COMPLETED'
      )
    ).toBe(true);
  });
});
