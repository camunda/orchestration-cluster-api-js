import { describe, expect, it } from 'vitest';
import type { Clock } from '../src/runtime/clock';

/**
 * A clock under test, plus the means to move it forward. The live clock advances by real
 * waiting; a virtual clock advances on command. Everything else in the contract is shared.
 */
export interface ClockSubject {
  clock: Clock;
  advance: (ms: number) => Promise<void>;
}

/** Real time the deadline clauses wait on. Small, because they cannot be virtualised. */
const REAL_MS = 25;

/**
 * Every clause of the `Clock` contract in `src/runtime/clock.ts`, asserted against one
 * implementation. Call this for each `Clock` that exists rather than trusting review to
 * catch a broken one — a lint rule can ban ambient time, but it cannot tell whether an
 * implementation honours its own interface. See #478.
 */
export function describeClockContract(name: string, makeSubject: () => ClockSubject): void {
  describe(`Clock contract: ${name}`, () => {
    describe('now', () => {
      it('reports finite epoch milliseconds', () => {
        const { clock } = makeSubject();
        const t = clock.now();
        expect(Number.isFinite(t)).toBe(true);
        expect(t).toBeGreaterThanOrEqual(0);
      });

      it('never runs backwards across reads', async () => {
        const { clock, advance } = makeSubject();
        const readings = [clock.now()];
        for (let i = 0; i < 5; i++) {
          await advance(1);
          readings.push(clock.now());
        }
        const sorted = [...readings].sort((a, b) => a - b);
        expect(readings).toEqual(sorted);
      });
    });

    describe('sleep', () => {
      // The clause that hand-rolled clocks broke most often. The worker schedules its next
      // poll by awaiting sleep, so a microtask resolution turns the loop into a spin.
      it('does not settle synchronously or in a microtask', async () => {
        const { clock } = makeSubject();
        let settled = false;
        void clock.sleep(REAL_MS).then(() => {
          settled = true;
        });
        // Drain the microtask queue: anything resolved without a macrotask shows up here.
        await Promise.resolve();
        await Promise.resolve();
        expect(settled).toBe(false);
      });

      it('resolves once the clock has advanced by the requested duration', async () => {
        const { clock, advance } = makeSubject();
        let settled = false;
        const waiting = clock.sleep(REAL_MS).then(() => {
          settled = true;
        });
        await advance(REAL_MS);
        await waiting;
        expect(settled).toBe(true);
      });

      it('rejects with the signal reason when the signal aborts first', async () => {
        const { clock } = makeSubject();
        const ac = new AbortController();
        const reason = new Error('cancelled');
        const waiting = clock.sleep(60_000, ac.signal);
        ac.abort(reason);
        await expect(waiting).rejects.toBe(reason);
      });

      it('rejects immediately when handed an already-aborted signal', async () => {
        const { clock } = makeSubject();
        const ac = new AbortController();
        const reason = new Error('already gone');
        ac.abort(reason);
        await expect(clock.sleep(60_000, ac.signal)).rejects.toBe(reason);
      });

      it('leaves nothing behind that settles after an abort', async () => {
        const { clock, advance } = makeSubject();
        const ac = new AbortController();
        const waiting = clock.sleep(REAL_MS, ac.signal);
        ac.abort(new Error('cancelled'));
        await expect(waiting).rejects.toThrow('cancelled');
        // Advancing past the original wake point must not resurrect the cancelled wait.
        await advance(REAL_MS * 2);
      });
    });

    describe('deadline', () => {
      // Deadlines bound liveness, so they stay on real time even for a virtual clock:
      // code guarded by one must time out rather than hang when the clock is pinned.
      it('starts un-aborted', () => {
        const { clock } = makeSubject();
        const budget = clock.deadline(60_000);
        expect(budget.signal.aborted).toBe(false);
        budget.dispose();
      });

      it('aborts once the duration has elapsed', async () => {
        const { clock } = makeSubject();
        const budget = clock.deadline(REAL_MS);
        await new Promise((resolve) => setTimeout(resolve, REAL_MS * 4));
        expect(budget.signal.aborted).toBe(true);
      });

      it('does not abort after dispose', async () => {
        const { clock } = makeSubject();
        const budget = clock.deadline(REAL_MS);
        budget.dispose();
        await new Promise((resolve) => setTimeout(resolve, REAL_MS * 4));
        expect(budget.signal.aborted).toBe(false);
      });

      it('tolerates dispose after the deadline has already fired', async () => {
        const { clock } = makeSubject();
        const budget = clock.deadline(REAL_MS);
        await new Promise((resolve) => setTimeout(resolve, REAL_MS * 4));
        expect(budget.signal.aborted).toBe(true);
        expect(() => budget.dispose()).not.toThrow();
      });
    });
  });
}
