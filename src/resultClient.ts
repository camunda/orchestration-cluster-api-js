// Functional-style wrapper that converts thrown errors into Result objects.
import { createCamundaClient, CamundaOptions, CamundaClient } from './gen/CamundaClient';

export type Result<T, E = unknown> = { ok: true; value: T } | { ok: false; error: E };
export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok;
export const isErr = <T, E>(r: Result<T, E>): r is { ok: false; error: E } => !r.ok;

// Narrow utility: detect a thenable
function isPromise(v: any): v is Promise<unknown> {
  return v && typeof v.then === 'function';
}

/**
 * @experimental This feature is under development and is not guaranteed to be fully tested or stable.
 * @description Factory returning a proxy that mirrors the CamundaClient surface but never throws.
 * All async returning methods (Promise or CancelablePromise) are wrapped into Promise<Result<..>>.
 * Synchronous utility methods (e.g. logger(), getConfig()) are passed through unchanged.
 * */
export function createCamundaResultClient(options?: CamundaOptions) {
  const base = createCamundaClient(options);

  const handler: ProxyHandler<any> = {
    get(_target, prop, _recv) {
      if (prop === 'inner') return base;
      const value = (base as any)[prop];
      if (typeof value !== 'function') return value;
      return (...args: any[]) => {
        try {
          const out = value.apply(base, args);
          if (isPromise(out)) {
            return out
              .then((v: any) => ({ ok: true, value: v }) as const)
              .catch((e: unknown) => ({ ok: false, error: e }) as const);
          }
          return Promise.resolve({ ok: true, value: out } as const);
        } catch (e) {
          return Promise.resolve({ ok: false, error: e } as const);
        }
      };
    },
  };

  return new Proxy({}, handler) as CamundaResultClient;
}

// Structural type describing the returned proxy (subset – only async operation methods mapped to Result).
// We purposefully keep it simple; operation methods become (...args) => Promise<Result<Return>>.
export type CamundaResultClient = {
  inner: CamundaClient;
} & {
  [K in keyof CamundaClient]: CamundaClient[K] extends (...a: infer A) => Promise<infer R>
    ? (...a: A) => Promise<Result<R>>
    : CamundaClient[K] extends (...a: infer A) => any
      ? (...a: A) => Promise<Result<ReturnType<CamundaClient[K]>>> | ReturnType<CamundaClient[K]>
      : CamundaClient[K];
};
