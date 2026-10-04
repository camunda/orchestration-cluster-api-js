import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { BackpressureManager } from '../src/runtime/backpressure';
import { liveClock } from '../src/runtime/clock';

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

describe('queued-waiter drain races (adversarial round 5)', () => {
  it('cancel() after release() drains the waiter but before the continuation runs rejects and refunds the permit', async () => {
    const ac = new AbortController();
    const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
    (bp as any).permitsMax = 1;
    (bp as any).permitsCurrent = 1; // sole permit occupied -> next acquire queues

    const acquiring = bp.acquire(ac.signal);
    const rejection = expect(acquiring).rejects.toThrow();
    // Drain the waiter (permitsCurrent 1 -> 0 -> waiter shifted -> permitsCurrent 1),
    // then abort before the microtask continuation runs.
    bp.release();
    ac.abort();
    await rejection;
    // The post-drain abort must not leave a permit consumed for the canceled op.
    expect((bp as any).permitsCurrent).toBe(0);
    expect((bp as any).waiters).toHaveLength(0);
  });

  it('removes the abort listener when a queued waiter drains normally', async () => {
    const ac = new AbortController();
    const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
    (bp as any).permitsMax = 1;
    (bp as any).permitsCurrent = 1;

    const addSpy = vi.spyOn(ac.signal, 'addEventListener');
    const removeSpy = vi.spyOn(ac.signal, 'removeEventListener');

    const acquiring = bp.acquire(ac.signal);
    expect(addSpy).toHaveBeenCalledTimes(1);
    bp.release();
    await acquiring; // normal drain
    // The drain must detach the listener it registered, like _sleepAbortable does.
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('abort', addSpy.mock.calls[0][1]);
  });

  // Regression (Copilot round 6): with two queued acquires, releasing the first and
  // aborting it before its microtask continuation runs refunds a permit — but release()'s
  // own drain loop has already finished, so without routing the refund back through the
  // shared drain helper the freed capacity never reaches the second waiter, stranding it.
  it('post-drain refund wakes the next queued waiter (two-waiter race)', async () => {
    const ac = new AbortController();
    const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
    (bp as any).permitsMax = 1;
    (bp as any).permitsCurrent = 1; // sole permit occupied -> both acquires queue

    const first = bp.acquire(ac.signal); // waiter #1 (will be canceled)
    const second = bp.acquire(); // waiter #2 (must still be served)
    expect((bp as any).waiters).toHaveLength(2);
    const firstRejection = expect(first).rejects.toThrow();

    // Release once: drains waiter #1 (permitsCurrent 1 -> 0 -> shift #1 -> 1). Then abort
    // #1 before its continuation runs, so its refund — not release() — must re-drain #2.
    bp.release();
    ac.abort();
    await firstRejection;

    // Waiter #2 must have been served by the refund's re-drain, holding the one permit.
    await expect(second).resolves.toBeUndefined();
    expect((bp as any).waiters).toHaveLength(0);
    expect((bp as any).permitsCurrent).toBe(1);
  });

  // Regression (Copilot round 8): the post-drain abort refund decremented permitsCurrent
  // unconditionally (guarded only against going negative), without tracking whether THIS
  // waiter was actually granted a permit. The sustained-healthy (Phase-3) drain resolves
  // queued waiters WITHOUT taking a permit; if a new backpressure event then restores a
  // finite cap and another acquire consumes a permit before the waiter's continuation
  // runs, an abort there refunded the OTHER operation's permit — undercounting active
  // work and over-admitting. The refund must be tied to a per-waiter grant token.
  describe('permit-grant token (fail the whole class)', () => {
    it('does not refund a permit when the waiter was drained by the sustained-healthy (ungranted) path', async () => {
      const ac = new AbortController();
      const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
      (bp as any).permitsMax = 1;
      (bp as any).permitsCurrent = 1; // sole permit occupied -> acquire queues

      const acquiring = bp.acquire(ac.signal);
      expect((bp as any).waiters).toHaveLength(1);

      // Sustained-healthy transition: unlimited, counter reset, waiters resolved with NO
      // permit granted (mirrors maybeRecover Phase 3). Resolve FIRST: waiter.resolve()
      // runs cleanup(), detaching the abort listener — so the abort() below (same sync
      // block) lands while the continuation is queued but not yet run: the exact race the
      // post-drain re-check exists to catch.
      (bp as any).permitsMax = null;
      (bp as any).permitsCurrent = 0;
      const w = (bp as any).waiters.shift();
      w.resolve();
      expect((bp as any).waiters).toHaveLength(0);

      // A new backpressure event restores a finite cap; START another acquire (it takes
      // the permit synchronously, before its first await) but do NOT await it yet —
      // yielding here would let the stale waiter's continuation run before the abort.
      (bp as any).permitsMax = 1;
      const other = bp.acquire(); // permitsCurrent 0 -> 1 (the OTHER operation's permit)

      // Abort while the stale waiter's continuation is still queued (listener detached by
      // the resolve above). The post-drain re-check must NOT refund: this waiter was never
      // granted a permit, so decrementing would steal the OTHER operation's permit.
      ac.abort();
      await expect(acquiring).rejects.toThrow();
      await expect(other).resolves.toBeUndefined();
      expect((bp as any).permitsCurrent).toBe(1);
    });

    it('still refunds when the waiter WAS granted a permit by the normal drain', async () => {
      const ac = new AbortController();
      const bp = new BackpressureManager({ config: { initialMaxConcurrency: 1 } });
      (bp as any).permitsMax = 1;
      (bp as any).permitsCurrent = 1;

      const acquiring = bp.acquire(ac.signal);
      const rejection = expect(acquiring).rejects.toThrow();
      // Normal drain: release() grants this waiter the permit (1 -> 0 -> grant -> 1).
      bp.release();
      ac.abort();
      await rejection;
      // Granted permit refunded: nothing held for the canceled op.
      expect((bp as any).permitsCurrent).toBe(0);
    });
  });

  // Regression (Copilot round 8, previously-missed advisory): the abort race in
  // _sleepAbortable rejected the wrapper promptly but never propagated the signal to the
  // underlying sleep, so the production Clock.sleep timer kept running until the full
  // delay expired. Repeated cancellations during backoff leaked live timers/closures.
  // The signal must be forwarded so a signal-aware sleep cancels its scheduled timer,
  // while the race still rejects promptly for an injected sleep that ignores it.
  describe('sleep abort signal propagation (fail the whole class)', () => {
    it('forwards the abort signal to the injected sleep so it can cancel its timer', async () => {
      const ac = new AbortController();
      const seenSignals: (AbortSignal | undefined)[] = [];
      let resolveSleep: (() => void) | undefined;
      const bp = new BackpressureManager({
        sleep: (_ms: number, signal?: AbortSignal) => {
          seenSignals.push(signal);
          return new Promise<void>((resolve) => {
            resolveSleep = resolve;
          });
        },
        config: { initialMaxConcurrency: 1, backoffInitialMs: 25 },
      });
      (bp as any).permitsMax = 1;
      (bp as any).backoffMs = 25;

      const acquiring = bp.acquire(ac.signal);
      const rejection = expect(acquiring).rejects.toThrow();
      ac.abort();
      resolveSleep?.();
      await rejection;
      // The abortable sleep must have handed the operation's signal to the sleep
      // implementation, so a signal-aware clock cancels the underlying timer on abort.
      expect(seenSignals).toEqual([ac.signal]);
    });

    it('still rejects promptly on abort when the injected sleep ignores the signal', async () => {
      const ac = new AbortController();
      // A sleep that never settles on its own and ignores any signal: only the abort
      // race can reject the acquire.
      const bp = new BackpressureManager({
        sleep: () => new Promise<void>(() => {}),
        config: { initialMaxConcurrency: 1, backoffInitialMs: 25 },
      });
      (bp as any).permitsMax = 1;
      (bp as any).backoffMs = 25;

      const acquiring = bp.acquire(ac.signal);
      const rejection = expect(acquiring).rejects.toThrow();
      ac.abort();
      await rejection; // rejects via the race, not via the sleep settling
      expect((bp as any).permitsCurrent).toBe(0);
    });

    // Sibling of the above: the constructor's DEFAULT sleep (used when no `sleep` is
    // injected — the option is optional and the class is publicly exported) must also
    // forward the signal to liveClock.sleep. A default that passed only `ms` would drop
    // the signal, leaking the scheduled timer until the full delay expired even after
    // the acquire rejected on abort. Covers the untested non-injected path.
    it('default (non-injected) sleep forwards the abort signal to liveClock.sleep', async () => {
      const ac = new AbortController();
      const seenSignals: (AbortSignal | undefined)[] = [];
      const sleepSpy = vi
        .spyOn(liveClock, 'sleep')
        .mockImplementation((_ms: number, signal?: AbortSignal) => {
          seenSignals.push(signal);
          return new Promise<void>(() => {});
        });
      try {
        const bp = new BackpressureManager({
          config: { initialMaxConcurrency: 1, backoffInitialMs: 25 },
        });
        (bp as any).permitsMax = 1;
        (bp as any).backoffMs = 25;

        const acquiring = bp.acquire(ac.signal);
        const rejection = expect(acquiring).rejects.toThrow();
        ac.abort();
        await rejection;
        // The default sleep must hand the operation's signal to liveClock.sleep so a
        // signal-aware clock cancels its underlying timer on abort.
        expect(seenSignals).toEqual([ac.signal]);
      } finally {
        sleepSpy.mockRestore();
      }
    });
  });
});
