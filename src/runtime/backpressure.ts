// Adaptive semaphore-based global backpressure controller.
// Escalates on broker backpressure signals, throttles initiating operations.
// Exempt operations (e.g., job completion/failure) bypass acquire.

import { liveClock } from './clock';
import type { Logger } from './logger';

export interface BackpressureConfig {
  enabled?: boolean;
  observeOnly?: boolean; // LEGACY profile: record severity, never gate
  initialMaxConcurrency?: number | null; // null => unlimited until first backpressure
  floorConcurrency?: number; // minimum when degraded
  reduceFactor?: number; // factor applied on each backpressure event (soft)
  severeReduceFactor?: number; // factor when entering severe state
  recoveryIntervalMs?: number; // interval between passive recover steps
  recoveryStep?: number; // permits regained per interval
  severeThreshold?: number; // consecutive events to count as severe
  decayQuietMs?: number; // time with no events before reducing severity
  maxWaiters?: number; // max queued waiters before fail-fast rejection (default 1000)
  healthyRecoveryMultiplier?: number; // multiplicative increase factor when healthy (default 1.5)
  unlimitedAfterHealthyMs?: number; // return to unlimited after this many ms of healthy (default 30000)
  backoffInitialMs?: number; // initial backoff delay at floor (default 25)
  backoffMaxMs?: number; // maximum backoff delay (default 2000)
  backoffEscalate?: number; // backoff multiplier on each 429 at floor (default 2.0)
}

export type BackpressureSeverity = 'healthy' | 'soft' | 'severe';

export interface BackpressureManagerOptions {
  logger?: Logger;
  config?: BackpressureConfig;
  now?: () => number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>; // injectable for testing; signal lets a clock cancel its timer on abort
}

interface Waiter {
  resolve: () => void;
  reject: (e: any) => void;
  signal?: AbortSignal;
  /** Detaches the abort listener registered for this waiter (if any). */
  cleanup?: () => void;
  /**
   * Set only when the finite-cap drain actually grants this waiter a permit
   * (permitsCurrent++), and then to the permit EPOCH the grant was issued in. The
   * sustained-healthy (Phase-3) drain resolves waiters WITHOUT granting one (leaving this
   * undefined), so a post-drain abort must consult this token before refunding — otherwise
   * it would decrement a permit some OTHER operation later took. Carrying the epoch (not a
   * bare boolean) lets the refund detect a stale lease after an unlimited→finite transition.
   */
  granted?: number;
  /** The parked acquire's promise; the continuation awaits this. */
  promise: Promise<void>;
}

export class BackpressureManager {
  private logger?: Logger;
  private now: () => number;
  private sleep: (ms: number, signal?: AbortSignal) => Promise<void>;
  private cfg: Required<BackpressureConfig>;
  private severity: BackpressureSeverity = 'healthy';
  private consecutive = 0;
  private lastEventAt = 0;
  private permitsCurrent = 0;
  private permitsMax: number | null; // null => unlimited
  /**
   * Permit epoch: monotonically increasing generation of the finite-permit regime. It is
   * bumped every time the manager ENTERS unlimited (Phase 3 sets `permitsMax = null` and
   * resets `permitsCurrent = 0`), which invalidates every outstanding finite-era lease. A
   * grant token returned by `acquire()` carries the epoch it was issued in; `release(epoch)`
   * decrements only when the epoch still matches, so a stale lease surviving an
   * unlimited→finite transition cannot release a permit owned by the later epoch (an ABA
   * leak). `null` is the "no permit held" token (the unlimited / disabled / observe-only /
   * ungranted-Phase-3 fast paths).
   */
  private epoch = 0;
  private waiters: Waiter[] = [];
  private lastRecoverCheck = 0;
  private observeOnly = false;
  private healthySince = 0; // timestamp when severity last became healthy
  private backoffMs = 0; // current backoff delay in ms (0 = no backoff)

  constructor(opts: BackpressureManagerOptions = {}) {
    this.logger = opts.logger;
    this.now = opts.now || (() => liveClock.now());
    this.sleep = opts.sleep || ((ms, signal) => liveClock.sleep(ms, signal));
    this.cfg = {
      enabled: true,
      initialMaxConcurrency: null,
      floorConcurrency: 1,
      reduceFactor: 0.7,
      severeReduceFactor: 0.5,
      recoveryIntervalMs: 1000,
      recoveryStep: 1,
      severeThreshold: 3,
      decayQuietMs: 2000,
      maxWaiters: 1000,
      healthyRecoveryMultiplier: 1.5,
      unlimitedAfterHealthyMs: 30_000,
      backoffInitialMs: 25,
      backoffMaxMs: 2000,
      backoffEscalate: 2.0,
      ...opts.config,
    } as Required<BackpressureConfig>;
    this.observeOnly = !!this.cfg.observeOnly;
    this.permitsMax =
      this.cfg.enabled === false || this.observeOnly ? null : this.cfg.initialMaxConcurrency; // often null
  }

  isEnabled() {
    return this.cfg.enabled !== false && !this.observeOnly;
  }

  getState() {
    return {
      severity: this.severity,
      consecutive: this.consecutive,
      // When disabled, report unlimited semantics explicitly
      permitsMax: this.cfg.enabled === false ? null : this.permitsMax,
      permitsCurrent: this.cfg.enabled === false ? 0 : this.permitsCurrent,
      waiters: this.waiters.length,
      backoffMs: this.backoffMs,
    };
  }

  private log(evt: string, data: any, prevSeverity?: BackpressureSeverity) {
    // Always emit trace-level detailed event.
    this.logger?.trace?.(() => [`backpressure.${evt}`, data]);
    if (evt === 'severity') {
      const curr = data.severity as BackpressureSeverity;
      // Unhealthy boundary crossings at info: entering unhealthy (healthy->soft/severe)
      // and recovery (soft/severe->healthy). All other severity shifts at debug.
      const enteringUnhealthy = prevSeverity === 'healthy' && curr !== 'healthy';
      const recoveringHealthy = prevSeverity !== 'healthy' && curr === 'healthy';
      const level: 'info' | 'debug' = enteringUnhealthy || recoveringHealthy ? 'info' : 'debug';
      this.logger?.[level]?.(() => [
        'bp.state.change',
        { event: evt, from: prevSeverity, to: curr },
      ]);
    } else if (evt.startsWith('permits.')) {
      // Permits changes are noisy; emit at debug rather than info.
      this.logger?.debug?.(() => ['bp.state.change', { event: evt, ...data }]);
    }
  }

  /**
   * Acquire a permit for one invocation, gating on backpressure. Resolves the permit EPOCH
   * (a number) when THIS invocation consumed a finite permit — the caller MUST later call
   * `release(epoch)` with that exact token exactly once. Resolves `null` when it did not —
   * the disabled / observe-only / unlimited fast paths and the sustained-healthy (Phase-3)
   * drain all return without granting one. The epoch is a per-invocation grant token tied to
   * the current finite regime: a caller that aborts after acquire must refund ONLY when it
   * holds a non-null epoch, and `release(epoch)` no-ops when the regime has since reset
   * (entered unlimited and returned), so a stale lease cannot release a permit owned by a
   * later epoch.
   */
  async acquire(signal?: AbortSignal): Promise<number | null> {
    // Fail fast on an already-aborted operation before ANY fast path: a canceled
    // operation must never proceed to invoke the transport, even when backpressure
    // is disabled, observe-only, or currently unlimited (the default). These fast
    // paths return without consuming a permit, but returning normally still lets the
    // caller's op() run — so the aborted check must come first.
    if (signal?.aborted) throw signal.reason || new Error('aborted');
    if (this.observeOnly) return null; // never gate in observe-only mode
    if (!this.isEnabled()) return null;
    if (this.permitsMax === null) return null; // unlimited fast path
    // Backoff-at-floor: delay before acquiring to rate-limit at floor. The wait is
    // abort-aware: a canceled operation rejects here instead of waking up later to
    // consume a permit and invoke the transport.
    if (this.backoffMs > 0) {
      await this._sleepAbortable(this.backoffMs, signal);
      // Re-check after sleep — may have gone unlimited
      if (this.permitsMax === null) return null;
      // A cancel that landed during the sleep (e.g. via an injected sleep that does
      // not reject on its own) must not proceed to consume a permit.
      if (signal?.aborted) throw signal.reason || new Error('aborted');
    }
    // Attempt immediate acquire
    if (this.permitsCurrent < (this.permitsMax || 0)) {
      this.permitsCurrent++;
      return this.epoch;
    }
    // Fail-fast if waiter queue is at capacity
    if (this.waiters.length >= this.cfg.maxWaiters) {
      const err: any = new Error(
        `Backpressure waiter queue full (${this.cfg.maxWaiters}). Rejecting to prevent unbounded memory growth.`
      );
      err.code = 'BACKPRESSURE_QUEUE_FULL';
      throw err;
    }
    // Queue
    const waiter = this._acquireQueued(signal);
    await waiter.promise;
    // Re-check after the wait: a cancel that lands between release() draining this
    // waiter and this continuation running must not proceed to consume the permit
    // and invoke the transport. Symmetric with the backoff re-check above. This lives
    // in the await continuation (a microtask) rather than the waiter callback so it
    // observes an abort that fires synchronously after the drain.
    if (signal?.aborted) {
      // Refund ONLY if this waiter was actually granted a permit (the finite-cap drain
      // sets waiter.granted to the grant's epoch when it does permitsCurrent++). The
      // sustained-healthy (Phase-3) drain resolves waiters WITHOUT granting a permit, so
      // refunding there would decrement a permit a DIFFERENT operation took after a new
      // backpressure event restored a finite cap — undercounting active work. When a permit
      // was granted, hand the freed capacity to the next queued waiter: release()'s own
      // drain loop has already finished and will NOT re-enter, so without this re-drain,
      // releasing and aborting the first of two queued acquires would strand the second.
      // The epoch guard makes the refund a no-op if the regime reset in the gap.
      if (waiter.granted !== undefined) {
        this._refund(waiter.granted);
      }
      throw signal.reason || new Error('aborted');
    }
    // The queued path grants a permit only when the finite-cap drain set waiter.granted;
    // the sustained-healthy (Phase-3) drain resolves without granting one.
    return waiter.granted !== undefined ? waiter.granted : null;
  }

  /** @internal Queued acquire: parks until release() drains this waiter or the signal aborts.
   * Returns the Waiter (whose `granted` token the drain mutates in place before resolving)
   * so the post-drain abort re-check in acquire() can refund only a permit THIS waiter held. */
  private _acquireQueued(signal?: AbortSignal): Waiter {
    const waiter: Waiter = {
      resolve: () => {},
      reject: () => {},
      signal,
      promise: Promise.resolve(),
    };
    waiter.promise = new Promise<void>((resolve, reject) => {
      waiter.resolve = () => {
        waiter.cleanup?.();
        resolve();
      };
      waiter.reject = reject;
      if (signal) {
        if (signal.aborted) {
          reject(signal.reason || new Error('aborted'));
          return;
        }
        const onAbort = () => {
          this.waiters = this.waiters.filter((w) => w !== waiter);
          reject(signal.reason || new Error('aborted'));
        };
        signal.addEventListener('abort', onAbort, { once: true });
        waiter.cleanup = () => signal.removeEventListener('abort', onAbort);
      }
      this.waiters.push(waiter);
    });
    return waiter;
  }

  /**
   * Sleep that rejects promptly when the given signal aborts. The signal is ALSO forwarded
   * to the underlying sleep so a signal-aware implementation (the production Clock.sleep)
   * cancels its scheduled timer on abort instead of leaving it alive until the full delay
   * expires; the race below still rejects promptly for an injected sleep that ignores the
   * signal.
   */
  private _sleepAbortable(ms: number, signal?: AbortSignal): Promise<void> {
    if (!signal) return this.sleep(ms);
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason || new Error('aborted'));
        return;
      }
      const onAbort = () => reject(signal.reason || new Error('aborted'));
      signal.addEventListener('abort', onAbort, { once: true });
      this.sleep(ms, signal).then(
        () => {
          signal.removeEventListener('abort', onAbort);
          resolve();
        },
        (e) => {
          signal.removeEventListener('abort', onAbort);
          reject(e);
        }
      );
    });
  }

  /**
   * Release a permit previously granted by `acquire()`. `token` is the grant token
   * `acquire()` resolved: the permit EPOCH when a permit was consumed, or `null` when none
   * was. The two falsy-ish cases are NOT equivalent:
   *   - `null` (no permit was held) is a true no-op — nothing is decremented.
   *   - a MISSING token (the legacy no-argument `release()` form, used by the recovery paths
   *     below) is epoch-UNGUARDED: it unconditionally decrements a permit when one is held.
   *     Callers on the current grant-token API should always pass the resolved token so a
   *     stale lease is dropped; only the internal back-compat callers rely on the no-arg form.
   * A non-null token releases only when its epoch still matches the current regime — after a
   * finite→unlimited→finite transition the epoch has advanced, so a STALE lease's release is
   * dropped instead of decrementing a permit owned by the later epoch.
   */
  release(token?: number | null) {
    if (!this.isEnabled()) return; // disabled or observeOnly (we don't track permits in observeOnly)
    if (this.permitsMax === null) return;
    // No permit held (unlimited/disabled/observe-only/ungranted fast path): nothing to release.
    if (token === null) return;
    // A stale lease from a prior finite epoch must not release the current epoch's permit.
    if (token !== undefined && token !== this.epoch) return;
    if (this.permitsCurrent > 0) this.permitsCurrent--;
    this._drainWaiters();
  }

  /**
   * @internal Refund a permit that was granted to a waiter whose continuation then aborted.
   * Epoch-guarded exactly like `release(token)`: a grant from a prior finite epoch is dropped
   * rather than decrementing a permit owned by the current epoch. Always re-drains so freed
   * capacity reaches the next waiter.
   */
  private _refund(epoch: number) {
    if (!this.isEnabled() || this.permitsMax === null) return;
    if (epoch !== this.epoch) return; // stale lease from a prior finite epoch
    if (this.permitsCurrent > 0) this.permitsCurrent--;
    this._drainWaiters();
  }

  /**
   * @internal Hand out available permits to queued waiters, FIFO, until capacity is
   * exhausted or the queue empties. The single shared drain path: both a `release()` and
   * an aborted waiter refunding its permit route through here, so freed capacity always
   * reaches the next waiter regardless of which one freed it.
   */
  private _drainWaiters() {
    while (this.waiters.length && this.permitsCurrent < (this.permitsMax || 0)) {
      const next = this.waiters.shift();
      if (!next) break;
      this.permitsCurrent++;
      // Record the grant (with the current epoch) BEFORE resolving: the post-drain abort
      // re-check refunds only when this token is set, so a waiter resolved by the ungranted
      // Phase-3 drain never refunds a permit it never held, and a refund after an
      // unlimited→finite transition is recognised as stale by its epoch.
      next.granted = this.epoch;
      try {
        next.resolve();
      } catch {
        /* ignore waiter resolve errors */
      }
      // If the waiter's post-drain abort re-check refunds its permit, it re-enters this
      // helper, so the freed capacity still reaches the next waiter.
    }
  }

  recordBackpressure() {
    if (!this.cfg.enabled && !this.observeOnly) return;
    const now = this.now();
    this.lastEventAt = now;
    this.consecutive++;
    this.healthySince = 0; // reset sustained-healthy timer on any backpressure event
    if (!this.observeOnly) {
      if (this.permitsMax === null) {
        this.permitsMax = 16;
        this.permitsCurrent = Math.min(this.permitsCurrent, this.permitsMax);
      }
    }
    const prevSeverity = this.severity;
    if (this.consecutive >= this.cfg.severeThreshold) {
      this.severity = 'severe';
      if (!this.observeOnly) this.scalePermits(this.cfg.severeReduceFactor);
    } else if (this.severity === 'healthy') {
      this.severity = 'soft';
      if (!this.observeOnly) this.scalePermits(this.cfg.reduceFactor);
    } else if (this.severity === 'soft') {
      if (!this.observeOnly) this.scalePermits(this.cfg.reduceFactor);
    }
    // Escalate backoff when stuck at floor + severe
    if (
      !this.observeOnly &&
      this.permitsMax !== null &&
      this.permitsMax <= this.cfg.floorConcurrency &&
      this.severity === 'severe'
    ) {
      if (this.backoffMs === 0) {
        this.backoffMs = this.cfg.backoffInitialMs;
      } else {
        this.backoffMs = Math.min(this.cfg.backoffMaxMs, this.backoffMs * this.cfg.backoffEscalate);
      }
      this.log('backoff.escalate', { delayMs: this.backoffMs });
    }
    if (this.severity !== prevSeverity)
      this.log('severity', { severity: this.severity }, prevSeverity);
  }

  recordHealthyHint() {
    // Called after a successful call with no backpressure classification
    if (!this.cfg.enabled && !this.observeOnly) return;
    // Reset backoff immediately on success — server has capacity
    if (this.backoffMs > 0) {
      this.backoffMs = 0;
      this.log('backoff.clear', { reason: 'healthy-hint' });
    }
    const now = this.now();
    // Passive recovery check piggy-backed
    this.maybeRecover(now);
  }

  private scalePermits(factor: number) {
    if (this.permitsMax === null) return;
    const next = Math.max(this.cfg.floorConcurrency, Math.ceil(this.permitsMax * factor));
    if (next < this.permitsMax) {
      this.permitsMax = next;
      this.log('permits.scale', { max: this.permitsMax });
    }
  }

  private maybeRecover(now = this.now()) {
    if (this.permitsMax === null || this.observeOnly) return; // unlimited or observe-only
    if (now - this.lastRecoverCheck < this.cfg.recoveryIntervalMs) return;
    this.lastRecoverCheck = now;
    // Decay severity if quiet
    if (now - this.lastEventAt > this.cfg.decayQuietMs) {
      const prev = this.severity;
      if (this.severity === 'severe') this.severity = 'soft';
      else if (this.severity === 'soft') {
        this.severity = 'healthy';
        this.healthySince = now;
      }
      if (this.severity === 'healthy') this.consecutive = 0;
      if (prev !== this.severity) {
        // Clear backoff when severity improves
        if (this.backoffMs > 0) {
          this.backoffMs = 0;
          this.log('backoff.clear', { reason: 'severity-decay' });
        }
        this.log('severity', { severity: this.severity }, prev);
      }
    }
    // Recovery: grow permits back toward and beyond the bootstrap cap.
    // Phase 1 (soft/recovering): additive increase (+recoveryStep) up to bootstrap cap.
    // Phase 2 (healthy): multiplicative increase (×healthyRecoveryMultiplier) beyond bootstrap cap.
    // Phase 3 (sustained healthy): return to unlimited after unlimitedAfterHealthyMs.
    if (this.permitsMax !== null) {
      const bootstrapCap = this.cfg.initialMaxConcurrency ?? 16;
      if (this.severity !== 'healthy') {
        // Phase 1: additive recovery while not yet healthy
        if (this.permitsMax < bootstrapCap) {
          this.permitsMax = Math.min(bootstrapCap, this.permitsMax + this.cfg.recoveryStep);
          // Clear backoff when leaving floor
          if (this.permitsMax > this.cfg.floorConcurrency && this.backoffMs > 0) {
            this.backoffMs = 0;
            this.log('backoff.clear', { reason: 'left-floor' });
          }
          this.log('permits.recover', { max: this.permitsMax, phase: 'additive' }, this.severity);
          this.release();
        }
      } else {
        // Phase 3: sustained healthy → return to unlimited
        if (this.healthySince > 0 && now - this.healthySince >= this.cfg.unlimitedAfterHealthyMs) {
          this.permitsMax = null;
          this.permitsCurrent = 0;
          this.backoffMs = 0;
          // Invalidate every outstanding finite-era lease: entering unlimited resets the
          // permit regime, so a grant token issued before this point is stale and its later
          // release() must not decrement a permit owned by the NEXT finite epoch.
          this.epoch++;
          // Drain all waiters since we're now unlimited
          while (this.waiters.length) {
            const w = this.waiters.shift();
            try {
              w?.resolve();
            } catch {
              /* ignore */
            }
          }
          this.log('permits.unlimited', { reason: 'sustained-healthy' }, this.severity);
          return;
        }
        // Phase 2: multiplicative growth while healthy
        const next = Math.ceil(this.permitsMax * this.cfg.healthyRecoveryMultiplier);
        if (next > this.permitsMax) {
          this.permitsMax = next;
          this.log(
            'permits.recover',
            { max: this.permitsMax, phase: 'multiplicative' },
            this.severity
          );
          this.release();
        }
      }
    }
  }
}
