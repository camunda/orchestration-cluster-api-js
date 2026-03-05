import { describe, it, expect } from 'vitest';

import { BackpressureManager } from '../src/runtime/backpressure';

describe.skip('Backpressure recovery beyond bootstrap cap', () => {
  it('recovers permits beyond initial bootstrap cap via multiplicative growth', () => {
    let time = 0;
    const bp = new BackpressureManager({
      now: () => time,
      config: {
        initialMaxConcurrency: 8,
        floorConcurrency: 1,
        reduceFactor: 0.5,
        severeReduceFactor: 0.5,
        recoveryIntervalMs: 100,
        recoveryStep: 1,
        severeThreshold: 3,
        decayQuietMs: 50,
        healthyRecoveryMultiplier: 2.0,
        unlimitedAfterHealthyMs: 10_000,
        maxWaiters: 100,
      },
    });

    // Trigger backpressure to establish a finite permit cap
    bp.recordBackpressure();
    const stateAfterBp = bp.getState();
    expect(stateAfterBp.permitsMax).toBeLessThanOrEqual(8);
    expect(stateAfterBp.permitsMax).toBeGreaterThan(0);

    // Advance time past decay quiet and recovery intervals to decay severity to healthy
    // 1st recovery interval: severe->soft / soft->soft (additive recovery)
    time += 200;
    bp.recordHealthyHint();
    // 2nd interval: soft->healthy
    time += 200;
    bp.recordHealthyHint();
    // Now should be healthy — next recovery should use multiplicative growth
    time += 200;
    bp.recordHealthyHint();

    const stateHealthy = bp.getState();
    expect(stateHealthy.severity).toBe('healthy');

    // Keep recovering — permits should exceed bootstrap cap of 8
    for (let i = 0; i < 20; i++) {
      time += 200;
      bp.recordHealthyHint();
    }

    const stateRecovered = bp.getState();
    // With 2x multiplier, after several intervals we should be well past 8
    expect(stateRecovered.permitsMax).toBeGreaterThan(8);
  });

  it('returns to unlimited after sustained healthy period', () => {
    let time = 0;
    const bp = new BackpressureManager({
      now: () => time,
      config: {
        initialMaxConcurrency: null, // start unlimited
        floorConcurrency: 1,
        reduceFactor: 0.5,
        severeReduceFactor: 0.5,
        recoveryIntervalMs: 100,
        recoveryStep: 1,
        severeThreshold: 3,
        decayQuietMs: 50,
        healthyRecoveryMultiplier: 1.5,
        unlimitedAfterHealthyMs: 1000,
        maxWaiters: 100,
      },
    });

    // Start unlimited
    expect(bp.getState().permitsMax).toBeNull();

    // Trigger backpressure to get a finite cap
    bp.recordBackpressure();
    expect(bp.getState().permitsMax).not.toBeNull();

    // Recover to healthy: need two decay intervals (severe->soft->healthy or soft->healthy)
    time += 200;
    bp.recordHealthyHint();
    time += 200;
    bp.recordHealthyHint();

    // Now advance past unlimitedAfterHealthyMs (1000ms) in one big jump
    // to avoid multiplicative recovery reaching unlimited via a different path
    time += 1500;
    bp.recordHealthyHint();

    // Should be unlimited again
    expect(bp.getState().permitsMax).toBeNull();
  });

  it('resets sustained-healthy timer on new backpressure event', () => {
    let time = 0;
    const bp = new BackpressureManager({
      now: () => time,
      config: {
        initialMaxConcurrency: null, // start unlimited
        floorConcurrency: 1,
        reduceFactor: 0.5,
        severeReduceFactor: 0.5,
        recoveryIntervalMs: 100,
        recoveryStep: 1,
        severeThreshold: 3,
        decayQuietMs: 50,
        healthyRecoveryMultiplier: 1.01, // very slow multiplicative growth
        unlimitedAfterHealthyMs: 5000,
        maxWaiters: 100,
      },
    });

    // Trigger and recover to healthy
    bp.recordBackpressure();
    time += 200;
    bp.recordHealthyHint();
    time += 200;
    bp.recordHealthyHint();
    expect(bp.getState().severity).toBe('healthy');

    // Advance well under the unlimited threshold (5000ms)
    time += 2000;
    bp.recordHealthyHint();
    expect(bp.getState().permitsMax).not.toBeNull(); // not yet unlimited

    // New backpressure event resets the timer
    bp.recordBackpressure();
    expect(bp.getState().severity).not.toBe('healthy');

    // Recover again
    time += 200;
    bp.recordHealthyHint();
    time += 200;
    bp.recordHealthyHint();

    // Even after 4000ms more, should NOT be unlimited (timer was reset by backpressure)
    time += 4000;
    bp.recordHealthyHint();
    expect(bp.getState().permitsMax).not.toBeNull();

    // After full 5000ms from the latest recovery to healthy, should be unlimited
    time += 1500;
    bp.recordHealthyHint();
    expect(bp.getState().permitsMax).toBeNull();
  });
});

describe.skip('Bounded waiter queue', () => {
  it('rejects when waiter queue is at capacity', async () => {
    const time = 0;
    const bp = new BackpressureManager({
      now: () => time,
      config: {
        initialMaxConcurrency: 1,
        floorConcurrency: 1,
        reduceFactor: 0.5,
        severeReduceFactor: 0.5,
        recoveryIntervalMs: 100000,
        recoveryStep: 1,
        severeThreshold: 3,
        decayQuietMs: 100000,
        healthyRecoveryMultiplier: 1.5,
        unlimitedAfterHealthyMs: 100000,
        maxWaiters: 3,
      },
    });

    // Trigger backpressure to establish a low permit cap
    bp.recordBackpressure();
    // Fill the single permit
    await bp.acquire();

    // Queue 3 waiters (the max)
    const w1 = bp.acquire();
    const w2 = bp.acquire();
    const w3 = bp.acquire();

    // 4th should be rejected immediately
    await expect(bp.acquire()).rejects.toThrow(/queue full/i);

    // Verify error code
    try {
      await bp.acquire();
    } catch (e: any) {
      expect(e.code).toBe('BACKPRESSURE_QUEUE_FULL');
    }

    // Release permits to unblock queued waiters (cleanup)
    bp.release();
    bp.release();
    bp.release();
    await Promise.race([Promise.all([w1, w2, w3]), new Promise((r) => setTimeout(r, 100))]);
  });

  it('allows queuing when under capacity', async () => {
    const time = 0;
    const bp = new BackpressureManager({
      now: () => time,
      config: {
        initialMaxConcurrency: 1,
        floorConcurrency: 1,
        reduceFactor: 0.5,
        severeReduceFactor: 0.5,
        recoveryIntervalMs: 100000,
        recoveryStep: 1,
        severeThreshold: 3,
        decayQuietMs: 100000,
        healthyRecoveryMultiplier: 1.5,
        unlimitedAfterHealthyMs: 100000,
        maxWaiters: 5,
      },
    });

    bp.recordBackpressure();
    await bp.acquire(); // fill the single permit

    // Queue 2 waiters (under limit of 5)
    const w1 = bp.acquire();
    const w2 = bp.acquire();

    expect(bp.getState().waiters).toBe(2);

    // Release to unblock
    bp.release();
    bp.release();
    await Promise.race([Promise.all([w1, w2]), new Promise((r) => setTimeout(r, 100))]);
  });
});
