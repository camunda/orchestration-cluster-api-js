/**
 * The graceful-stop drain shared by `JobWorker` and `ThreadedJobWorker`, which carried
 * line-for-line copies of it.
 *
 * This is a **liveness bound**, not cadence: its job is to stop waiting, so it stays on
 * real time and deliberately does not take the injected clock. Pinning it would mean a
 * pinned clock deadlocks shutdown rather than timing out. See the contract in
 * camunda/orchestration-cluster-api-js#450.
 */

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
  const start = Date.now();

  // Let the in-flight activation settle rather than cancelling it: a request already sent
  // may return jobs, and cancelling here would strand them until their timeout expires.
  const inFlight = deps.inFlightActivation();
  if (inFlight) {
    try {
      await Promise.race([
        inFlight,
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error('activation.wait.timeout')), waitUpToMs)
        ),
      ]);
    } catch (e: any) {
      if (e && e.message === 'activation.wait.timeout') {
        deps.log.debug('worker.gracefulStop.activationTimeout');
      }
    }
  }

  while (deps.activeJobs() > 0 && Date.now() - start < waitUpToMs) {
    await new Promise((r) => setTimeout(r, checkIntervalMs));
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
