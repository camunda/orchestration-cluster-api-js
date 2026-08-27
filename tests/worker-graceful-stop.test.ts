import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Guards for `JobWorker.stopGracefully`, which is duplicated line-for-line in
 * `threadedJobWorker.ts` and is about to be extracted into one shared helper.
 *
 * These land before the refactor and pass against the pre-refactor code, so a failure
 * afterwards means the extraction changed behaviour rather than that the guard is
 * aspirational.
 *
 * Only the threaded worker had unit coverage here; the non-threaded one was reachable
 * solely through `tests-integration/worker.graceful-stop.test.ts`, which needs a live
 * engine and covers the drain path only. The timeout branch below was unguarded.
 *
 * Real timers throughout: the drain loop is a liveness bound, and the whole point is that
 * it terminates on its own. Budgets are small so the suite stays fast; they are safety
 * nets, not correctness signals, so do not tighten them into a race.
 */

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const job = (key: string) => ({
  jobKey: key,
  type: 'test-type',
  processInstanceKey: '1',
  processDefinitionId: 'p',
  processDefinitionVersion: 1,
  processDefinitionKey: '1',
  elementId: 'e',
  elementInstanceKey: '1',
  customHeaders: {},
  worker: 'w',
  retries: 3,
  deadline: new Date(Date.now() + 30_000).toISOString(),
  variables: {},
  tenantId: '<default>',
});

/** The SDK calls fetch with a `Request`, not a URL string. */
const urlOf = (input: RequestInfo | URL) => (input instanceof Request ? input.url : String(input));

/** A client whose first activation yields one job and whose later polls yield none. */
function clientYieldingOneJob() {
  let served = false;
  return createCamundaClient({
    config: { CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 } as any,
    env: {},
    fetch: (async (input: RequestInfo | URL) => {
      if (urlOf(input).includes('activation')) {
        if (served) return jsonResponse({ jobs: [] });
        served = true;
        return jsonResponse({ jobs: [job('1')] });
      }
      return jsonResponse({});
    }) as any,
  });
}

/** Resolves once `predicate` holds, or rejects at `budgetMs`. */
async function until(predicate: () => boolean, budgetMs = 3_000) {
  const deadline = Date.now() + budgetMs;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('condition not reached within budget');
    await new Promise((r) => setTimeout(r, 5));
  }
}

describe('JobWorker.stopGracefully', () => {
  it('drains an in-flight job and reports it did not time out', async () => {
    const camunda = clientYieldingOneJob();
    let release!: () => void;
    const handlerRunning = new Promise<void>((r) => (release = r));

    const worker = camunda.createJobWorker({
      jobType: 'test-type',
      pollIntervalMs: 5,
      jobHandler: async () => {
        await handlerRunning;
      },
    } as any);

    await until(() => worker.activeJobs > 0);

    const stopping = worker.stopGracefully({ waitUpToMs: 3_000, checkIntervalMs: 5 });
    release();
    const result = await stopping;

    expect(result.timedOut).toBe(false);
    expect(result.remainingJobs).toBe(0);
    expect(worker.stopped).toBe(true);
  });

  // The branch the integration test never reaches.
  it('reports the job still running when the drain budget expires', async () => {
    const camunda = clientYieldingOneJob();
    let release!: () => void;
    const handlerRunning = new Promise<void>((r) => (release = r));

    const worker = camunda.createJobWorker({
      jobType: 'test-type',
      pollIntervalMs: 5,
      jobHandler: async () => {
        await handlerRunning;
      },
    } as any);

    await until(() => worker.activeJobs > 0);

    const result = await worker.stopGracefully({ waitUpToMs: 50, checkIntervalMs: 5 });

    expect(result.timedOut).toBe(true);
    expect(result.remainingJobs).toBeGreaterThan(0);
    expect(worker.stopped).toBe(true);

    release();
  });

  it('stops polling, so no further activation happens after it returns', async () => {
    let activations = 0;
    const camunda = createCamundaClient({
      config: { CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 } as any,
      env: {},
      fetch: (async (input: RequestInfo | URL) => {
        if (urlOf(input).includes('activation')) activations += 1;
        return jsonResponse({ jobs: [] });
      }) as any,
    });

    const worker = camunda.createJobWorker({
      jobType: 'test-type',
      pollIntervalMs: 5,
      jobHandler: async () => {},
    } as any);

    await until(() => activations > 0);
    await worker.stopGracefully({ waitUpToMs: 200, checkIntervalMs: 5 });

    const settled = activations;
    await new Promise((r) => setTimeout(r, 60));

    expect(activations).toBe(settled);
  });
});
