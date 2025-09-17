import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { EventualConsistencyTimeoutError, createCamundaClient } from '../src';

// We monkey patch fetch to simulate eventual consistency responses.

function makeResponse(status: number, body: any) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('eventual consistency searchJobs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls until items present then returns', async () => {
    let calls = 0;
    const camunda = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:4567' },
      fetch: vi.fn().mockImplementation((_url: string) => {
        calls++;
        if (calls < 3) return Promise.resolve(makeResponse(200, { items: [] }));
        return Promise.resolve(makeResponse(200, { items: [{ id: 1 }] }));
      }),
    });
    const p = camunda.searchJobs({}, { consistency: { waitUpToMs: 1000, pollIntervalMs: 50 } });
    // advance two failed polls + third success
    await vi.advanceTimersByTimeAsync(0); // initial
    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(50);
    const result: any = await p;
    expect(result.items?.length).toBe(1);
    expect(calls).toBe(3);
  });

  it('times out and throws EventualConsistencyTimeoutError', async () => {
    let calls = 0;
    const camunda = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:4567' },
      fetch: vi.fn().mockImplementation((_url: string) => {
        calls++;
        return Promise.resolve(makeResponse(200, { items: [] }));
      }),
    });
    const p = camunda.searchJobs({} as any, {
      consistency: { waitUpToMs: 120, pollIntervalMs: 40 },
    });
    const expectation = expect(p).rejects.toBeInstanceOf(EventualConsistencyTimeoutError);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(40);
    await vi.advanceTimersByTimeAsync(40);
    await vi.advanceTimersByTimeAsync(40); // total 120ms
    await expectation;
    expect(calls).toBeGreaterThanOrEqual(3);
  });
});
