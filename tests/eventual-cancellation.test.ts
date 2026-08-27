import { describe, expect, it, vi } from 'vitest';
import { eventualPoll } from '../src/runtime/eventual';

/**
 * Cancelling a poll must release its pending sleep rather than let the timer elapse. The
 * poller only re-checks its cancelled flag when the sleep resolves, so without an abort
 * signal a cancelled 10s poll keeps a timer alive for the full interval and holds the
 * event loop open.
 *
 * Asserted against `eventualPoll` directly, not through a client method: the search
 * methods are wrapped by `installSearchPagination`, and the wrapper's `cancel` does not
 * reach this controller. That is pre-existing and separate from the sleep behaviour here.
 */
describe('eventual poll cancellation', () => {
  it('releases the pending poll timer when cancelled', async () => {
    vi.useFakeTimers();
    try {
      const invoke = () => {
        const p: any = Promise.resolve({ items: [] });
        p.cancel = () => {};
        return p;
      };

      const poll: any = eventualPoll('searchJobs', false, invoke, {
        waitUpToMs: 30_000,
        pollIntervalMs: 10_000,
        predicate: (r: any) => r.items.length > 0,
      });
      poll.catch(() => {});

      // Let the first attempt settle so the poller is parked on its sleep.
      await vi.advanceTimersByTimeAsync(0);
      expect(vi.getTimerCount()).toBe(1);

      poll.cancel();
      await vi.advanceTimersByTimeAsync(0);

      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
