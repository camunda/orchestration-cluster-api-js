import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

/**
 * Verifies the JobWorker applies exponential backoff (not a flat 1ms retry) on
 * consecutive failed activation requests, and resets to the fast poll interval
 * after a successful poll. This is the fix for tight retry-loops during a
 * transient outage (connection refused / connect timeout / LAN blip).
 */

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('job worker activation backoff', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('backs off exponentially on failure then resets to pollIntervalMs on success', async () => {
    // rng() === 0 makes each backoff deterministic (== cap/2).
    vi.spyOn(Math, 'random').mockReturnValue(0);

    let calls = 0;

    const fetchMock = vi.fn(async () => {
      calls += 1;
      // First two polls fail at the transport layer, then every poll succeeds
      // (fresh Response each time so its body is never re-read).
      if (calls <= 2)
        throw new Error(calls === 1 ? 'connect ECONNREFUSED' : 'UND_ERR_CONNECT_TIMEOUT');
      return jsonResponse({ jobs: [] });
    });

    // Disable the transport-layer retry (maxAttempts includes the first) so one
    // worker poll maps to exactly one fetch call — keeps the backoff schedule
    // deterministic and isolates the worker-level backoff under test.
    const client = createCamundaClient({
      config: { CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 },
      fetch: fetchMock as any,
    });
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    const worker = client.createJobWorker({
      jobType: 'backoff-test',
      jobHandler: async () => 'JOB_ACTION_RECEIPT' as const,
      maxParallelJobs: 1,
      jobTimeoutMs: 1000,
      pollIntervalMs: 1,
      pollBackoffMinMs: 1000,
      pollBackoffMaxMs: 30_000,
    });

    // Flush the start gate (scheduleNext(0)) and let poll #1 fail.
    await vi.advanceTimersByTimeAsync(0);
    // Advance through the first backoff (attempt 1: cap 1000 → 500) into poll #2.
    await vi.advanceTimersByTimeAsync(500);
    // Advance through the second backoff (attempt 2: cap 2000 → 1000) into poll #3 (success).
    await vi.advanceTimersByTimeAsync(1000);
    // After success, the next poll is scheduled at pollIntervalMs (1ms).
    await vi.advanceTimersByTimeAsync(1);

    worker.stop();

    const delays = setTimeoutSpy.mock.calls.map((c) => c[1]);
    // The two escalating backoffs must be present, in order.
    expect(delays).toContain(500);
    expect(delays).toContain(1000);
    const firstBackoffIdx = delays.indexOf(500);
    const secondBackoffIdx = delays.indexOf(1000);
    expect(firstBackoffIdx).toBeLessThan(secondBackoffIdx);
    // A flat 1ms retry (the old buggy behaviour) must NOT have been used for a
    // failure: the *first* 1ms poll-interval reschedule must appear only AFTER
    // both failure backoffs, i.e. it is the post-success reset and no 1ms retry
    // ever leaked into the failure streak.
    const firstOneMsIdx = delays.indexOf(1);
    expect(firstOneMsIdx).toBeGreaterThan(secondBackoffIdx);
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('falls back to pollIntervalMs on failure when backoff is disabled (pollBackoffMinMs=0)', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls += 1;
      // Every poll fails at the transport layer.
      throw new Error(calls === 1 ? 'connect ECONNREFUSED' : 'UND_ERR_CONNECT_TIMEOUT');
    });

    const client = createCamundaClient({
      config: { CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1 },
      fetch: fetchMock as any,
    });
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    const worker = client.createJobWorker({
      jobType: 'backoff-disabled-test',
      jobHandler: async () => 'JOB_ACTION_RECEIPT' as const,
      maxParallelJobs: 1,
      jobTimeoutMs: 1000,
      pollIntervalMs: 5,
      // Disabling backoff must NOT devolve into a 0ms tight retry loop; failures
      // should schedule at pollIntervalMs instead.
      pollBackoffMinMs: 0,
      pollBackoffMaxMs: 0,
    });

    await vi.advanceTimersByTimeAsync(0); // start gate + poll #1 (fails)
    await vi.advanceTimersByTimeAsync(5); // poll #2 (fails)
    await vi.advanceTimersByTimeAsync(5); // poll #3 (fails)

    worker.stop();

    const delays = setTimeoutSpy.mock.calls.map((c) => c[1]);
    // Failed polls must reschedule at the poll interval, never a 0ms tight loop.
    expect(delays).toContain(5);
    const failureDelays = delays.filter((d) => d !== 0);
    expect(failureDelays.every((d) => d === 5)).toBe(true);
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
