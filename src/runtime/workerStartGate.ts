/**
 * Buffers a job worker's `start()` request until its transport is ready to
 * service polls.
 *
 * `createJobWorker` / `createThreadedJobWorker` return the worker handle
 * synchronously, but the transport behind it may still be initialising — the
 * threaded worker's shared thread pool spawns its threads asynchronously. A
 * `start()` issued in that window used to schedule a poll against a transport
 * that was not up yet.
 *
 * The gate also owns start idempotency. Guarding on the poll timer alone is not
 * enough: the timer is null for the whole duration of an in-flight activation,
 * so a `start()` landing in that window opened a *second* concurrent poll loop
 * alongside the first — which is what an `autoStart: true` worker plus an eager
 * app-side `start()` produces. Once a request is accepted the gate drops every
 * later one, so autostart and an explicit caller cannot both kick off polling.
 *
 * See https://github.com/camunda/orchestration-cluster-api-js/issues/401.
 */
export class WorkerStartGate {
  private _requested = false;

  /**
   * @param transportReady Resolves when the worker's transport can service polls.
   * @param isStopped Reports whether the worker was stopped while the gate was buffering.
   */
  constructor(
    private readonly _transportReady: () => Promise<void>,
    private readonly _isStopped: () => boolean
  ) {}

  /** True once a start request has been accepted and not since released. */
  get requested(): boolean {
    return this._requested;
  }

  /**
   * Record a start request.
   *
   * The first accepted request invokes `onReady` once the transport resolves,
   * and only if the worker has not been stopped in the meantime. If the
   * transport fails to come up, `onError` is invoked and the gate is released so
   * a later `start()` can retry.
   *
   * @returns `false` when the request was dropped as redundant.
   */
  request(onReady: () => void, onError: (err: unknown) => void): boolean {
    if (this._requested) return false;
    this._requested = true;
    void this._transportReady().then(
      () => {
        if (this._isStopped()) return;
        onReady();
      },
      (err) => {
        this._requested = false;
        onError(err);
      }
    );
    return true;
  }
}
