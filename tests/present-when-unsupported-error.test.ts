import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { isPresentWhenUnsupportedError, isSdkError, normalizeError } from '../src/runtime/errors';

/**
 * PR #514 review — the dependent-presence guard error must be a first-class,
 * terminal SDK error.
 *
 * When a newer client requests a dependent field (e.g. `withLease: true`) from a
 * server that predates the feature, the generated guard throws a
 * `PresentWhenUnsupportedError`. Two properties must hold:
 *   1. `normalizeError` preserves it (name + non-retryable) instead of
 *      downgrading it to a generic `NetworkSdkError` — otherwise callers cannot
 *      discriminate it and the retry layer would treat it as transient.
 *   2. A job worker whose activation raises it STOPS, rather than looping on
 *      exponential backoff forever against a request that can never succeed.
 */

function makeGuardError(): any {
  const e: any = new Error(
    "activateJobs: withLease=true was requested but the server returned an item without 'leaseToken'"
  );
  e.name = 'PresentWhenUnsupportedError';
  e.nonRetryable = true;
  return e;
}

describe('PresentWhenUnsupportedError classification', () => {
  it('is recognised as a stable SDK error', () => {
    const e = makeGuardError();
    expect(isSdkError(e)).toBe(true);
    expect(isPresentWhenUnsupportedError(e)).toBe(true);
  });

  it('normalizeError preserves the name and non-retryable marker (no NetworkSdkError downgrade)', () => {
    const normalized = normalizeError(makeGuardError(), { opId: 'activateJobs' });
    expect(normalized.name).toBe('PresentWhenUnsupportedError');
    expect((normalized as any).nonRetryable).toBe(true);
    expect(isPresentWhenUnsupportedError(normalized)).toBe(true);
  });

  it('does not misclassify unrelated errors as PresentWhenUnsupportedError', () => {
    expect(isPresentWhenUnsupportedError(new Error('nope'))).toBe(false);
    expect(isPresentWhenUnsupportedError(normalizeError(new Error('boom')))).toBe(false);
  });
});

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

function leasedJobWithoutToken() {
  return {
    jobKey: 'job-1',
    type: 'lease-terminal-test',
    processInstanceKey: 'pi-1',
    processDefinitionKey: 'pd-1',
    bpmnProcessId: 'p',
    processDefinitionVersion: 1,
    elementId: 'task-1',
    elementInstanceKey: 'ei-1',
    retries: 3,
    deadline: new Date(Date.now() + 30000).toISOString(),
    variables: {},
    customHeaders: {},
    worker: 'w',
    tenantId: '<default>',
    // leaseToken intentionally absent: an older server that ignored withLease.
  };
}

describe('job worker stops on PresentWhenUnsupportedError (terminal, no infinite backoff)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('a leased activation against a server that returns no token stops the worker', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ jobs: [leasedJobWithoutToken()] }));

    const client = createCamundaClient({
      config: { CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 },
      env: {},
      fetch: fetchMock as any,
    });

    const worker = client.createJobWorker({
      jobType: 'lease-terminal-test',
      jobHandler: async () => 'JOB_ACTION_RECEIPT' as const,
      maxParallelJobs: 1,
      jobTimeoutMs: 1000,
      pollIntervalMs: 1,
      pollBackoffMinMs: 1000,
      pollBackoffMaxMs: 30_000,
      withLease: true,
    });

    // Start gate + first poll: activation raises the guard error and the worker
    // must stop itself rather than scheduling a backoff retry.
    await vi.advanceTimersByTimeAsync(0);
    expect(worker.stopped).toBe(true);

    // Even if more time elapses, no further activation polls fire (the worker is
    // terminal, not merely backing off).
    const callsAfterStop = fetchMock.mock.calls.length;
    await vi.advanceTimersByTimeAsync(60_000);
    expect(fetchMock.mock.calls.length).toBe(callsAfterStop);
  });
});
