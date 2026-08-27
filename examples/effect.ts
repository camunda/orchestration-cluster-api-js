// Compilable usage examples for the opt-in `/effect` subpath that appear in README.md.
// These snippets are synced into README.md by scripts/sync-readme-snippets.ts and are
// type-checked during build (via hooks/post/950-typecheck-examples.ts) to guard against
// API drift — the same contract the Promise-first examples in `readme.ts` are held to.
//
// `effect` is an optional peer dependency of the SDK; it is a devDependency of this repo,
// so these examples compile here. Consumers install it alongside the SDK.

// The per-block import lists rendered in README.md live in `readme-imports.txt` (the
// repo-wide convention — one organized import block per example file cannot also be
// split per snippet). Every symbol they name is imported here too, so removing an
// export breaks this file's type-check.
import {
  createCamundaEffectClient,
  createCamundaEffectWorker,
  type EventualConsistencyTimeout,
  eventually,
  layer,
  RetryableJobError,
  TerminalJobError,
} from '@camunda8/orchestration-cluster-api/effect';
import { Effect, Schedule, Stream } from 'effect';

// ---------------------------------------------------------------------------
// Effect client
// ---------------------------------------------------------------------------

async function _readmeEffectClient() {
  //#region ReadmeEffectClient
  const camunda = createCamundaEffectClient();

  const program = Effect.gen(function* () {
    const deployment = yield* camunda.deployResourcesFromFiles(['./bpmn/process.bpmn']);
    const { processInstanceKey } = yield* camunda.createProcessInstance({
      processDefinitionKey: deployment.processes[0].processDefinitionKey,
    });
    // Poll on the Effect Clock until the instance is searchable, timing out deterministically.
    // waitUpToMs: 0 asks the SDK for the latest available state without its own wall-clock
    // wait, so the Effect `eventually` combinator owns the predicate + timeout horizon —
    // making the eventual-consistency wait deterministic under TestClock.
    const search = yield* eventually(
      camunda.searchProcessInstances(
        { filter: { processInstanceKey } },
        { consistency: { waitUpToMs: 0 } }
      ),
      (s) => s.items.some((i) => i.processInstanceKey === processInstanceKey),
      { waitUpTo: '30 seconds', interval: '750 millis' }
    );
    return { processInstanceKey, search };
  }).pipe(
    // Tagged errors → discriminate with catchTag / catchTags instead of a manual switch.
    Effect.catchTag('EventualConsistencyTimeout', (e: EventualConsistencyTimeout) =>
      Effect.logError(`Timed out: ${e.message}`).pipe(Effect.andThen(Effect.fail(e)))
    )
  );

  const result = await Effect.runPromise(program);
  //#endregion ReadmeEffectClient
  console.log(result.processInstanceKey);
}

// ---------------------------------------------------------------------------
// Paginated search as a Stream
// ---------------------------------------------------------------------------

async function _readmeEffectPaginate() {
  //#region ReadmeEffectPaginate
  const camunda = createCamundaEffectClient();

  // Walk every ACTIVE process instance, 100 per request, without ever holding more
  // than one page in memory. `Stream.take` stops pulling — and so stops fetching.
  const activeKeys = await Effect.runPromise(
    camunda.searchProcessInstances
      .paginate({ filter: { state: 'ACTIVE' }, page: { limit: 100 } })
      .items()
      .pipe(
        Stream.map((instance) => instance.processInstanceKey),
        Stream.take(500),
        Stream.runCollect
      )
  );
  //#endregion ReadmeEffectPaginate
  console.log(activeKeys.length);
}

// ---------------------------------------------------------------------------
// Effect job worker
// ---------------------------------------------------------------------------

/** Stand-in for a real downstream health probe. */
const isServiceDown = (): Effect.Effect<boolean> => Effect.succeed(false);

function _readmeEffectWorker() {
  //#region ReadmeEffectWorker
  const program = Effect.gen(function* () {
    // Forked into the current Scope: interrupted (with a best-effort lease release) when
    // the scope closes.
    yield* createCamundaEffectWorker<{ ok: boolean }>({
      type: 'payment-processing',
      maxJobsToActivate: 10, // activation batch size
      concurrency: 10, // max jobs handled in parallel (backpressure)
      pollInterval: '1 second', // between empty polls, on the Effect Clock
      // Optional: retry the handler in-process on a RetryableJobError before failing the job.
      handlerRetrySchedule: Schedule.spaced('2 seconds'),
      handler: (job) =>
        Effect.gen(function* () {
          if (!job.variables.amount) {
            // Terminal → raise a BPMN error / incident.
            return yield* Effect.fail(
              new TerminalJobError({ code: 'INVALID_INPUT', message: 'amount is required' })
            );
          }
          if (yield* isServiceDown()) {
            // Retryable → failJob(retries - 1) with a re-activation backoff.
            return yield* Effect.fail(
              new RetryableJobError({
                message: 'downstream unavailable',
                retryBackoff: '5 seconds',
              })
            );
          }
          return { ok: true }; // success → completeJob(variables)
        }),
    });

    // ... the worker runs for the lifetime of this scope.
    yield* Effect.never;
  }).pipe(
    Effect.scoped,
    Effect.provide(layer()) // provides the `/effect` client the worker depends on
  );

  void program;
  //#endregion ReadmeEffectWorker
}

void _readmeEffectClient;
void _readmeEffectPaginate;
void _readmeEffectWorker;
