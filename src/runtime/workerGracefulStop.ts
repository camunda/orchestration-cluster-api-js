/**
 * The graceful-stop drain shared by `JobWorker` and `ThreadedJobWorker`, which carried
 * line-for-line copies of it.
 *
 * This is a **liveness bound**, not cadence: its job is to stop waiting. It therefore uses
 * `liveClock` — the shared *live* clock — and must never be handed the injected one, because
 * a pinned clock would deadlock shutdown instead of timing out. See the contract in
 * camunda/orchestration-cluster-api-js#450.
 *
 * Going through `liveClock` rather than ambient `Date.now`/`setTimeout` keeps every timer in
 * the runtime behind one module, and inherits its guarantees: a non-decreasing reading, so a
 * backward system-clock step cannot silently extend the budget, and timer chaining past the
 * 32-bit `setTimeout` limit.
 */

import { liveClock } from './clock';

/** An in-flight activation request, cancellable if the drain budget expires. */
type InFlightActivation = (PromiseLike<unknown> & { cancel?: () => void }) | null;

interface GracefulStopLogger {
  debug(event: string, meta?: Record<string, unknown>): void;
}

export interface GracefulStopOptions {
  waitUpToMs?: number;
  checkIntervalMs?: number;
}

export interface GracefulStopResult {
  remainingJobs: number;
  timedOut: boolean;
}

export interface GracefulStopDeps {
  /** Mark the worker stopped and cancel any scheduled poll. Runs before anything is awaited. */
  haltPolling: () => void;
  activeJobs: () => number;
  inFlightActivation: () => InFlightActivation;
  log: GracefulStopLogger;
}

export async function stopWorkerGracefully(
  deps: GracefulStopDeps,
  opts?: GracefulStopOptions
): Promise<GracefulStopResult> {
  const waitUpToMs = opts?.waitUpToMs ?? 5000;
  const checkIntervalMs = opts?.checkIntervalMs ?? 10;

  deps.haltPolling();
  const start = liveClock.now();

  // Let the in-flight activation settle rather than cancelling it: a request already sent
  // may return jobs, and cancelling here would strand them until their timeout expires.
  const inFlight = deps.inFlightActivation();
  if (inFlight) {
    // Disposed below, so a fast activation does not leave a timer holding the event loop
    // open for the rest of the budget.
    const budget = liveClock.deadline(waitUpToMs);
    try {
      await Promise.race([
        inFlight,
        new Promise((_, rej) => {
          const reject = () => rej(new Error('activation.wait.timeout'));
          if (budget.signal.aborted) reject();
          else budget.signal.addEventListener('abort', reject, { once: true });
        }),
      ]);
    } catch (e: any) {
      if (e && e.message === 'activation.wait.timeout') {
        deps.log.debug('worker.gracefulStop.activationTimeout');
      }
    } finally {
      budget.dispose();
    }
  }

  while (deps.activeJobs() > 0 && liveClock.now() - start < waitUpToMs) {
    await liveClock.sleep(checkIntervalMs);
  }

  const timedOut = deps.activeJobs() > 0;
  if (timedOut) {
    const pending = deps.inFlightActivation();
    if (pending?.cancel) {
      try {
        pending.cancel();
      } catch {
        /* ignore */
      }
    }
    deps.log.debug('worker.gracefulStop.timeout', { remaining: deps.activeJobs() });
  } else {
    deps.log.debug('worker.gracefulStop.done');
  }

  return { remainingJobs: deps.activeJobs(), timedOut };
}
