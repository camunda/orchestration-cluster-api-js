// Adaptive semaphore-based global backpressure controller.
// Escalates on broker backpressure signals, throttles initiating operations.
// Exempt operations (e.g., job completion/failure) bypass acquire.

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
}

export type BackpressureSeverity = 'healthy' | 'soft' | 'severe';

export interface BackpressureManagerOptions {
  logger?: Logger;
  config?: BackpressureConfig;
  now?: () => number;
}

interface Waiter {
  resolve: () => void;
  reject: (e: any) => void;
  signal?: AbortSignal;
}

export class BackpressureManager {
  private logger?: Logger;
  private now: () => number;
  private cfg: Required<BackpressureConfig>;
  private severity: BackpressureSeverity = 'healthy';
  private consecutive = 0;
  private lastEventAt = 0;
  private permitsCurrent = 0;
  private permitsMax: number | null; // null => unlimited
  private waiters: Waiter[] = [];
  private lastRecoverCheck = 0;
  private observeOnly = false;

  constructor(opts: BackpressureManagerOptions = {}) {
    this.logger = opts.logger;
    this.now = opts.now || (() => Date.now());
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
    };
  }

  private log(evt: string, data: any) {
    // Emit trace for detailed debugging and info for state change telemetry consumers.
    this.logger?.trace?.(() => ['backpressure.' + evt, data]);
    if (evt === 'severity' || evt.startsWith('permits.')) {
      this.logger?.info?.(() => ['bp.state.change', { event: evt, ...data }]);
    }
  }

  async acquire(signal?: AbortSignal) {
    if (this.observeOnly) return; // never gate in observe-only mode
    if (!this.isEnabled()) return;
    if (this.permitsMax === null) return; // unlimited fast path
    // Attempt immediate acquire
    if (this.permitsCurrent < (this.permitsMax || 0)) {
      this.permitsCurrent++;
      return;
    }
    // Queue
    return new Promise<void>((resolve, reject) => {
      const waiter: Waiter = { resolve: () => resolve(), reject, signal };
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
      }
      this.waiters.push(waiter);
    });
  }

  release() {
    if (!this.isEnabled()) return; // disabled or observeOnly (we don't track permits in observeOnly)
    if (this.permitsMax === null) return;
    if (this.permitsCurrent > 0) this.permitsCurrent--;
    // Drain a waiter if capacity
    while (this.waiters.length && this.permitsCurrent < (this.permitsMax || 0)) {
      const next = this.waiters.shift();
      if (!next) break;
      this.permitsCurrent++;
      try {
        next.resolve();
      } catch {
        /* ignore waiter resolve errors */
      }
    }
  }

  recordBackpressure() {
    if (!this.cfg.enabled && !this.observeOnly) return;
    const now = this.now();
    this.lastEventAt = now;
    this.consecutive++;
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
    if (this.severity !== prevSeverity) this.log('severity', { severity: this.severity });
  }

  recordHealthyHint() {
    // Called after a successful call with no backpressure classification
    if (!this.cfg.enabled && !this.observeOnly) return;
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
      if (this.severity === 'severe') this.severity = 'soft';
      else if (this.severity === 'soft') this.severity = 'healthy';
      if (this.severity === 'healthy') this.consecutive = 0;
      this.log('severity', { severity: this.severity });
    }
    // Restore permits gradually if not at initial bootstrap cap (we don't exceed original bootstrap cap here)
    if (this.permitsMax !== null) {
      // Chosen policy: we consider bootstrap cap (16) as transient; we could expose a hard upper bound in config later.
      if (this.permitsMax < 16) {
        this.permitsMax = Math.min(16, this.permitsMax + this.cfg.recoveryStep);
        this.log('permits.recover', { max: this.permitsMax });
        // Attempt draining waiters after increasing cap
        this.release();
      }
    }
  }
}
