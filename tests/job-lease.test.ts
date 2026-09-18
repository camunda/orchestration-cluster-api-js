import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createCamundaClient } from '../src';
import type { CamundaClient } from '../src/gen/CamundaClient';
import { enrichActivatedJob } from '../src/runtime/jobActions';

/**
 * Lease-token threading + `withLease` worker surface (issue #513).
 *
 * Two related contracts, both derived from the `x-present-when` marker on
 * `ActivatedJobResult.jobLeaseToken`:
 *
 *  §2  A worker configured with `withLease: true` sends `withLease: true` in the
 *      activation request body; a worker without it sends no `withLease`.
 *  §3  When a job carries a `jobLeaseToken`, the fenced `complete` / `fail` / `error`
 *      commands thread it back (matching the effect worker). When the job has no
 *      lease token, the commands carry none.
 */

function createMockJob(overrides: Record<string, unknown> = {}) {
  return {
    jobKey: 'job-1',
    type: 'test-task',
    processInstanceKey: 'pi-1',
    processDefinitionKey: 'pd-1',
    bpmnProcessId: 'test-process',
    processDefinitionVersion: 1,
    elementId: 'task-1',
    elementInstanceKey: 'ei-1',
    retries: 3,
    deadline: new Date(Date.now() + 30000).toISOString(),
    variables: {},
    customHeaders: {},
    worker: 'test-worker',
    tenantId: '<default>',
    jobLeaseToken: null,
    ...overrides,
  } as any;
}

const mockLog = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

async function waitFor(pred: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  while (!pred()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor: timed out');
    await new Promise((r) => setTimeout(r, 5));
  }
}

describe('§3 jobLeaseToken threading through fenced commands', () => {
  it('threads jobLeaseToken into complete/fail/error when the job is leased', async () => {
    const completeJob = vi.fn().mockResolvedValue(undefined);
    const failJob = vi.fn().mockResolvedValue(undefined);
    const throwJobError = vi.fn().mockResolvedValue(undefined);
    const client = { completeJob, failJob, throwJobError } as unknown as CamundaClient;

    const raw = createMockJob({ jobLeaseToken: 'lease-abc' });
    const job = enrichActivatedJob(raw, client, mockLog);

    await job.complete({ ok: true });
    await job.fail({ errorMessage: 'boom', retries: 2 });
    await job.error({ errorCode: 'E', errorMessage: 'nope' });

    expect(completeJob.mock.calls[0][0]).toMatchObject({
      jobKey: 'job-1',
      jobLeaseToken: 'lease-abc',
    });
    expect(failJob.mock.calls[0][0]).toMatchObject({ jobKey: 'job-1', jobLeaseToken: 'lease-abc' });
    expect(throwJobError.mock.calls[0][0]).toMatchObject({
      jobKey: 'job-1',
      jobLeaseToken: 'lease-abc',
    });
  });

  it('omits jobLeaseToken from the commands when the job is not leased', async () => {
    const completeJob = vi.fn().mockResolvedValue(undefined);
    const failJob = vi.fn().mockResolvedValue(undefined);
    const throwJobError = vi.fn().mockResolvedValue(undefined);
    const client = { completeJob, failJob, throwJobError } as unknown as CamundaClient;

    const raw = createMockJob({ jobLeaseToken: null });
    const job = enrichActivatedJob(raw, client, mockLog);

    await job.complete({ ok: true });
    await job.fail({ errorMessage: 'boom', retries: 2 });
    await job.error({ errorCode: 'E', errorMessage: 'nope' });

    expect(completeJob.mock.calls[0][0]).not.toHaveProperty('jobLeaseToken');
    expect(failJob.mock.calls[0][0]).not.toHaveProperty('jobLeaseToken');
    expect(throwJobError.mock.calls[0][0]).not.toHaveProperty('jobLeaseToken');
  });
});

describe('§3 jobLeaseToken threading through updateJob (modifyJobTimeout/modifyRetries)', () => {
  it('threads jobLeaseToken into updateJob for both modify actions when leased', async () => {
    const updateJob = vi.fn().mockResolvedValue(undefined);
    const client = { updateJob } as unknown as CamundaClient;

    const job = enrichActivatedJob(createMockJob({ jobLeaseToken: 'lease-upd' }), client, mockLog);
    await job.modifyJobTimeout({ newTimeoutMs: 5000 });
    await job.modifyRetries({ retries: 4 });

    expect(updateJob.mock.calls[0][0]).toMatchObject({
      jobKey: 'job-1',
      jobLeaseToken: 'lease-upd',
    });
    expect(updateJob.mock.calls[1][0]).toMatchObject({
      jobKey: 'job-1',
      jobLeaseToken: 'lease-upd',
    });
  });

  it('omits jobLeaseToken from updateJob for both modify actions when unleased', async () => {
    const updateJob = vi.fn().mockResolvedValue(undefined);
    const client = { updateJob } as unknown as CamundaClient;

    const job = enrichActivatedJob(createMockJob({ jobLeaseToken: null }), client, mockLog);
    await job.modifyJobTimeout({ newTimeoutMs: 5000 });
    await job.modifyRetries({ retries: 4 });

    expect(updateJob.mock.calls[0][0]).not.toHaveProperty('jobLeaseToken');
    expect(updateJob.mock.calls[1][0]).not.toHaveProperty('jobLeaseToken');
  });
});

describe('§3 failure paths thread jobLeaseToken (handler error + validation failure)', () => {
  it('threads jobLeaseToken when the handler throws on a leased job', async () => {
    const { client } = makeCapturingClient([
      createMockJob({ jobLeaseToken: 'lease-xyz', retries: 3 }),
    ]);
    const failJob = vi.fn().mockResolvedValue(undefined);
    (client as any).failJob = failJob;
    const worker = client.createJobWorker({
      jobType: 'leased-task',
      jobHandler: async () => {
        throw new Error('handler boom');
      },
      withLease: true,
      maxParallelJobs: 1,
    });
    await waitFor(() => failJob.mock.calls.length > 0);
    worker.stop();
    expect(failJob.mock.calls[0][0]).toMatchObject({ jobKey: 'job-1', jobLeaseToken: 'lease-xyz' });
  });

  it('omits jobLeaseToken when the handler throws on an unleased job', async () => {
    const { client } = makeCapturingClient([createMockJob({ jobLeaseToken: null, retries: 3 })]);
    const failJob = vi.fn().mockResolvedValue(undefined);
    (client as any).failJob = failJob;
    const worker = client.createJobWorker({
      jobType: 'plain-task',
      jobHandler: async () => {
        throw new Error('handler boom');
      },
      maxParallelJobs: 1,
    });
    await waitFor(() => failJob.mock.calls.length > 0);
    worker.stop();
    expect(failJob.mock.calls[0][0]).not.toHaveProperty('jobLeaseToken');
  });

  it('threads jobLeaseToken when schema validation fails on a leased job', async () => {
    const { client } = makeCapturingClient([
      createMockJob({ jobLeaseToken: 'lease-val', variables: { n: 'not-a-number' } }),
    ]);
    const failJob = vi.fn().mockResolvedValue(undefined);
    (client as any).failJob = failJob;
    const worker = client.createJobWorker({
      jobType: 'leased-validated',
      inputSchema: z.object({ n: z.number() }),
      validateSchemas: true,
      jobHandler: async (job) => job.complete(),
      withLease: true,
      maxParallelJobs: 1,
    });
    await waitFor(() => failJob.mock.calls.length > 0);
    worker.stop();
    expect(failJob.mock.calls[0][0]).toMatchObject({ jobKey: 'job-1', jobLeaseToken: 'lease-val' });
  });
});

function makeCapturingClient(jobs: unknown[]) {
  const bodies: Array<Record<string, unknown>> = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (/\/jobs\/activation\b/.test(url)) {
      const raw =
        typeof init?.body === 'string'
          ? init.body
          : input instanceof Request
            ? await input.text()
            : '{}';
      bodies.push(JSON.parse(raw || '{}'));
      return new Response(JSON.stringify({ jobs }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const client = createCamundaClient({
    config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
    fetch: fetchMock as unknown as typeof fetch,
  });
  return { client, bodies };
}

describe('§2 withLease worker surface', () => {
  it('sends withLease: true in the activation body when configured', async () => {
    const { client, bodies } = makeCapturingClient([]);
    const worker = client.createJobWorker({
      jobType: 'leased-task',
      jobHandler: async (job) => job.complete(),
      withLease: true,
      maxParallelJobs: 1,
    });
    await waitFor(() => bodies.length > 0);
    worker.stop();
    expect(bodies[0]?.withLease).toBe(true);
  });

  it('omits withLease from the activation body by default', async () => {
    const { client, bodies } = makeCapturingClient([]);
    const worker = client.createJobWorker({
      jobType: 'plain-task',
      jobHandler: async (job) => job.complete(),
      maxParallelJobs: 1,
    });
    await waitFor(() => bodies.length > 0);
    worker.stop();
    expect(bodies[0]).not.toHaveProperty('withLease');
  });
});

describe('§3 runtime guard: newer client vs older server', () => {
  it('fails loudly when withLease: true is requested but no jobLeaseToken is returned', async () => {
    const { client } = makeCapturingClient([createMockJob({ jobLeaseToken: null })]);
    await expect(
      client.activateJobs({ type: 't', timeout: 1000, maxJobsToActivate: 1, withLease: true })
    ).rejects.toThrow(/jobLeaseToken/);
  });

  it('does not guard when withLease is not requested', async () => {
    const { client } = makeCapturingClient([createMockJob({ jobLeaseToken: null })]);
    const res = await client.activateJobs({ type: 't', timeout: 1000, maxJobsToActivate: 1 });
    expect(res.jobs).toHaveLength(1);
  });
});

/**
 * §1 Compile-time proof that the `x-present-when` marker derivation narrows
 * `jobLeaseToken` by the `withLease` literal. This function is never executed — it
 * exists purely so `npm run typecheck` (which includes `tests/`) fails if the
 * generated overloads regress. `{}` accepts any non-null value but rejects
 * `null` / `undefined`, so it doubles as a non-null assertion.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _presentWhenTypeProof(client: CamundaClient) {
  const leased = (
    await client.activateJobs({ type: 't', timeout: 1000, maxJobsToActivate: 1, withLease: true })
  ).jobs[0];
  // present projection: jobLeaseToken is required + non-null.
  const _present: NonNullable<unknown> = leased.jobLeaseToken;

  const dynamicFlag: boolean = Boolean(1);
  const dynamic = (
    await client.activateJobs({
      type: 't',
      timeout: 1000,
      maxJobsToActivate: 1,
      withLease: dynamicFlag,
    })
  ).jobs[0];
  // @ts-expect-error dynamic projection keeps jobLeaseToken nullable — not assignable to a non-null type
  const _dynamic: NonNullable<unknown> = dynamic.jobLeaseToken;

  void _present;
  void _dynamic;
}
