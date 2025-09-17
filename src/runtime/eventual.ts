// Eventual consistency polling runtime.
// This file purposely avoids depending on generated core modules (legacy path ../gen/core/* removed)
// and instead provides a lightweight CancelablePromise wrapper locally so it can be used
// by codegen without circular deps.
import { EventualConsistencyTimeoutError } from './errors';
import { hydrateConfig } from './unifiedConfiguration';
import type { Result } from '../resultClient';

import type { Logger } from './logger';

export interface CancelablePromise<T> extends Promise<T> { cancel(): void }

function toCancelable<T>(factory:(signal:AbortSignal)=>void | Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  let rejectFn: (e:any)=>void = () => {};
  let resolveFn: (v:T)=>void = () => {};
  const p = new Promise<T>((resolve, reject) => {
    resolveFn = resolve; rejectFn = reject;
    const r = factory(ac.signal);
    if (r && typeof (r as Promise<T>).then === 'function') {
      (r as Promise<T>).then(resolve, reject);
    }
  }) as CancelablePromise<T>;
  (p as any).cancel = () => { ac.abort(); rejectFn(new Error('Cancelled')); };
  return p;
}

/** Manages eventual consistency for a given operation */
export interface ConsistencyOptions<T> {
  /* How long are you willing to wait, in ms? Set to 0 to ignore eventual consistency */
  waitUpToMs: number;
  /* How often will we poll the endpoint? Default 500ms */
  pollIntervalMs?: number; // user provided (optional override)
  /* Optional predicate function to determine if the result is valid */
  predicate?: (result: T) => boolean | Promise<boolean>;
  onAttempt?: (info: { attempt: number; elapsedMs: number; remainingMs: number; status?: number; predicateResult?: boolean; nextDelayMs?: number }) => void;
  onComplete?: (info: { attempts: number; elapsedMs: number }) => void;
  abortSignal?: AbortSignal;
  /** When true, log every 200 attempt result body (raw response) before predicate evaluation */
  trace?: boolean;
}

// Internal union shape (reserved for potential future use when refactoring invoke handling)
type PollInvokeResult<T> = { kind: 'success'; value: T; status?: number } | { kind: 'error'; error: any; status?: number };

function now() { return Date.now(); }

// errorMode: 'throw' returns CancelablePromise<T> rejecting on errors; 'result' resolves with Result<T> never throwing.
// Overloads (Option A):
// - Default / throw mode -> CancelablePromise<T>
// - Result mode -> CancelablePromise<Result<T>>
export function eventualPoll<T>(operationId: string, isGet: boolean, invoke: () => CancelablePromise<T>, options: ConsistencyOptions<T> & { logger?: Logger; errorMode?: 'throw' | undefined }): CancelablePromise<T>;
export function eventualPoll<T>(operationId: string, isGet: boolean, invoke: () => CancelablePromise<T>, options: ConsistencyOptions<T> & { logger?: Logger; errorMode: 'result' }): CancelablePromise<Result<T>>;
export function eventualPoll<T>(operationId: string, isGet: boolean, invoke: () => CancelablePromise<T>, options: ConsistencyOptions<T> & { logger?: Logger; errorMode?: 'throw' | 'result' }): CancelablePromise<any> {
  const { waitUpToMs, predicate, onAttempt, onComplete, abortSignal, trace } = options;
  const elog = options.logger?.scope('eventual');
  const pollDefaultMs = hydrateConfig().config.eventual?.pollDefaultMs || 500;
  const userInterval = options.pollIntervalMs;
  const baseInterval = userInterval != null ? userInterval : pollDefaultMs;
  const pollInterval = Math.max(10, baseInterval);

  if (waitUpToMs === 0) {
    const base = invoke();
    if (options.errorMode === 'result') {
      return toCancelable<Result<T>>((signal) => {
        signal.addEventListener('abort', () => (base as any).cancel?.());
        return base.then(v => ({ ok: true, value: v } as Result<T>)).catch(e => ({ ok: false, error: e } as Result<T>));
      });
    }
    return base;
  }

  return toCancelable<any>(outerSignal => {
    let attempts = 0;
    const started = now();
    let cancelled = false;
    const abortImmediateStatuses = new Set([400,401,403,409,422]);

    const externalAbort = () => { cancelled = true; };
    if (abortSignal) {
      if (abortSignal.aborted) externalAbort();
      else abortSignal.addEventListener('abort', externalAbort);
    }

    const loop = (resolve: (v:T)=>void, reject:(e:any)=>void) => {
      if (cancelled || outerSignal.aborted) return reject(new Error('Cancelled'));
      attempts++;
      const attemptStarted = now();
      let settled = false;
  const settleOk = (val: T) => { if (settled) return; settled = true; if (options.errorMode === 'result') (resolve as any)({ ok: true, value: val } as Result<T>); else resolve(val as any); };
  const settleErr = (err: any) => { if (settled) return; settled = true; if (options.errorMode === 'result') (resolve as any)({ ok: false, error: err } as Result<T>); else reject(err); };
      const req = invoke();
      (req as any).then(async (res: any) => {
        if (cancelled || outerSignal.aborted) return settleErr(new Error('Cancelled'));
        if (trace) {
          try {
            // Use debug to avoid spamming higher log levels; serialize carefully.
            const preview = typeof res === 'object' ? JSON.stringify(res).slice(0, 1000) : String(res);
            elog?.debug?.(() => [`op=${operationId} attempt=${attempts} trace body=${preview}`]);
          } catch { /* ignore serialization issues */ }
        }
        let ok = true;
        try {
          if (predicate) ok = await predicate(res);
          else if (!isGet && res && typeof res === 'object' && Array.isArray((res as any).items)) ok = (res as any).items.length > 0;
        } catch (e) { return settleErr(e); }
        const elapsed = now() - started;
        const remaining = waitUpToMs - elapsed;
        if (ok) {
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status: 200, predicateResult: ok, nextDelayMs: 0 });
          if (trace) {
            elog?.debug?.(() => [`op=${operationId} attempt=${attempts} status=200 predicate=true elapsed=${elapsed}ms totalAttempts=${attempts}`]);
          }
          onComplete?.({ attempts, elapsedMs: elapsed });
          return settleOk(res);
        }
        if (remaining <= 0) {
          return settleErr(new EventualConsistencyTimeoutError({ attempts, elapsedMs: elapsed, lastStatus: 200, lastResponse: res, operationId }));
        }
        const delay = Math.min(pollInterval, remaining);
        onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status: 200, predicateResult: ok, nextDelayMs: delay });
  elog?.debug?.(() => [`op=${operationId} attempt=${attempts} status=200 predicate=false nextDelay=${delay}ms remaining=${remaining}`]);
        setTimeout(() => loop(resolve, reject), delay);
      }).catch((err: any) => {
        if (cancelled || outerSignal.aborted) return settleErr(new Error('Cancelled'));
        const status: number | undefined = err?.status;
        const elapsed = now() - started;
        const remaining = waitUpToMs - elapsed;
        if (status === 404 && isGet && remaining > 0) {
          const delay = Math.min(pollInterval, remaining);
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status, predicateResult: false, nextDelayMs: delay });
          return setTimeout(() => loop(resolve, reject), delay);
        }
        if (status === 429 && remaining > 0) {
          let delay = pollInterval * 2;
          const ra = (err?.headers?.['retry-after']) || (err?.headers?.['Retry-After']) || err?.body?.['retryAfter'] || err?.body?.['Retry-After'];
            if (ra) { const parsed = parseInt(ra,10); if (!isNaN(parsed)) delay = parsed < 1000 ? parsed*1000 : parsed; }
          delay = Math.min(delay, pollInterval * 5, 2000, remaining);
          const jitter = 0.9 + Math.random()*0.2; delay = Math.floor(delay * jitter);
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status, predicateResult: false, nextDelayMs: delay });
          return setTimeout(() => loop(resolve, reject), delay);
        }
        if (status && (abortImmediateStatuses.has(status) || status >= 500)) return settleErr(err);
        if (remaining <= 0) return settleErr(new EventualConsistencyTimeoutError({ attempts, elapsedMs: elapsed, lastStatus: status, lastResponse: err?.body, operationId }));
        return settleErr(err);
      });
    };

    return new Promise<T>((resolve,reject)=> loop(resolve,reject));
  });
}
