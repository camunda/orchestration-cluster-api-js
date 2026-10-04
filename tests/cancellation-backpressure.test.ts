import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { BackpressureManager } from '../src/runtime/backpressure';

// Regression: an operation canceled while it is still waiting for a backpressure permit
// (or sleeping in the backoff-at-floor delay) must not remain queued, consume a permit,
// or invoke the transport afterwards. The operation's AbortSignal is threaded from
// toCancelable through _invokeWithRetry into BackpressureManager.acquire.
describe('cancellation through backpressure gating', () => {
  it('cancel() while queued for a permit rejects without invoking transport', async () => {
    const BASE = 'https://mock.local';
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const camunda = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: BASE },
      fetch: fetchMock as any,
    });
    const core = camunda as any;

    // Force a finite cap of 1 and occupy the only permit so the next op queues.
    core._bp.recordBackpressure();
    core._bp.cfg.initialMaxConcurrency = 1;
    core._bp.permitsMax = 1;
    core._bp.permitsCurrent = 1;

    const p: any = camunda.getStatus();
    p.cancel();
    await expect(p).rejects.toMatchObject({ name: 'CancelSdkError' });
    // The canceled waiter must have been removed, not left to consume a later permit.
    expect(core._bp.waiters).toHaveLength(0);
    // Transport must never be invoked for an operation canceled while queued.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('cancel() during backoff-at-floor sleep rejects instead of acquiring afterwards', async () => {
    const ac = new AbortController();
    let resolveSleep: (() => void) | undefined;
    const bp = new BackpressureManager({
      sleep: (ms: number) =>
        new Promise<void>((resolve) => {
          if (ms > 0) resolveSleep = resolve;
          else resolve();
        }),
      config: { initialMaxConcurrency: 1, backoffInitialMs: 25 },
    });
    bp.recordBackpressure();
    // Force the backoff-at-floor path: finite cap of 1 with a pending backoff delay.
    (bp as any).permitsMax = 1;
    (bp as any).backoffMs = 25;

    const acquiring = bp.acquire(ac.signal);
    const rejection = expect(acquiring).rejects.toThrow();
    ac.abort();
    resolveSleep?.();
    await rejection;
    // The aborted acquire must not have consumed a permit.
    expect((bp as any).permitsCurrent).toBe(0);
  });

  it('acquire with an already-aborted signal rejects before consuming a permit', async () => {
    const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
    bp.recordBackpressure();
    (bp as any).permitsMax = 1;
    const ac = new AbortController();
    ac.abort();
    await expect(bp.acquire(ac.signal)).rejects.toThrow();
    expect((bp as any).permitsCurrent).toBe(0);
  });
});
