// Strongly-typed fp-ts style adapter (no runtime dependency on fp-ts).
// Produces TaskEither-like thunks structurally compatible with fp-ts/TaskEither.
// Includes domain error typing and small helper combinators.

import { createCamundaClient, CamundaClient, CamundaOptions } from './gen/CamundaClient';
import { EventualConsistencyTimeoutError, CamundaValidationError } from './runtime/errors';

// Basic Either + TaskEither structural types (kept minimal to avoid runtime dependency).
export type Left<E> = { _tag: 'Left'; left: E };
export type Right<A> = { _tag: 'Right'; right: A };
export type Either<E, A> = Left<E> | Right<A>;
export type TaskEither<E, A> = () => Promise<Either<E, A>>;

export const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e });
export const right = <E = never, A = never>(a: A): Either<E, A> => ({ _tag: 'Right', right: a });
export const isLeft = <E, A>(e: Either<E, A>): e is Left<E> => e._tag === 'Left';
export const isRight = <E, A>(e: Either<E, A>): e is Right<A> => e._tag === 'Right';

// Domain error union (expand as needed):
export type HttpError = { name?: string; status?: number; body?: any; message?: string } & Record<
  string,
  any
>;
export type DomainError =
  | CamundaValidationError
  | EventualConsistencyTimeoutError
  | HttpError
  | Error;

// Utility to narrow thrown values into DomainError union.
function toDomainError(err: any): DomainError {
  if (err instanceof CamundaValidationError) return err;
  if (err instanceof EventualConsistencyTimeoutError) return err;
  if (err instanceof Error) return err;
  if (typeof err === 'object') return err as HttpError;
  return { message: String(err) } as HttpError;
}

// Classification + folding helpers -------------------------------------------------
export type DomainErrorTag = 'validation' | 'timeout' | 'http' | 'generic';

export function classifyDomainError(err: DomainError): DomainErrorTag {
  if (err instanceof CamundaValidationError) return 'validation';
  if (err instanceof EventualConsistencyTimeoutError) return 'timeout';
  // Heuristic: HttpError is plain object without stack OR has status property.
  if (!(err instanceof Error) || (err as any).status !== undefined) return 'http';
  return 'generic';
}

// Exhaustive fold over DomainError; forces caller to consider each class.
export function foldDomainError<A>(handlers: {
  validation: (e: CamundaValidationError) => A;
  timeout: (e: EventualConsistencyTimeoutError) => A;
  http: (e: HttpError) => A;
  generic: (e: Error) => A;
}): (err: DomainError) => A {
  return (err: DomainError) => {
    switch (classifyDomainError(err)) {
      case 'validation':
        return handlers.validation(err as CamundaValidationError);
      case 'timeout':
        return handlers.timeout(err as EventualConsistencyTimeoutError);
      case 'http':
        return handlers.http(err as HttpError);
      case 'generic':
        return handlers.generic(err as Error);
    }
  };
}

// Function keys & mapping helpers
export type FnKeys<C> = { [K in keyof C]: C[K] extends (...a: any) => any ? K : never }[keyof C];
export type Fpify<C> = {
  [K in FnKeys<C>]: C[K] extends (...a: infer A) => infer R
    ? (...a: A) => TaskEither<DomainError, Awaited<R>>
    : never;
} & { inner: C } & { [K in Exclude<keyof C, FnKeys<C>>]: C[K] };

export type CamundaFpClient = Fpify<CamundaClient>;

// Runtime detection of promise-like (includes CancelablePromise)
function isPromiseLike<T>(v: any): v is Promise<T> {
  return v && typeof v.then === 'function';
}

/**
 *
 * @experimental This feature under development and is not guaranteed to be stable.
 * @description Camunda FP Client - a Task-Either compatible client. See the README and [this test](https://github.com/camunda/orchestration-cluster-api-js/blob/main/tests-integration/fp.test.ts) for example usage.
 */
export function createCamundaFpClient(options?: CamundaOptions): CamundaFpClient {
  const base = createCamundaClient(options);
  const cache = new Map<string | symbol, any>();

  function wrap<M extends (...a: any) => any>(fn: M) {
    return (...args: Parameters<M>): TaskEither<DomainError, Awaited<ReturnType<M>>> =>
      async () => {
        try {
          const r = fn.apply(base, args) as ReturnType<M>;
          const val = isPromiseLike(r) ? await (r as any) : r;
          return right(val as Awaited<ReturnType<M>>);
        } catch (e) {
          return left(toDomainError(e));
        }
      };
  }

  const handler: ProxyHandler<any> = {
    get(_t, prop: string | symbol) {
      if (prop === 'inner') return base;
      if (cache.has(prop)) return cache.get(prop);
      const value = (base as any)[prop];
      if (typeof value === 'function') {
        const w = wrap(value);
        cache.set(prop, w);
        return w;
      }
      cache.set(prop, value);
      return value;
    },
  };

  return new Proxy({}, handler) as CamundaFpClient;
}

// --- Helper Combinators ---
// Retry with exponential backoff + optional max attempts. Simple version (no fp-ts dependency).
export function retryTE<E, A>(
  task: TaskEither<E, A>,
  opts: {
    max: number;
    baseDelayMs?: number;
    shouldRetry?: (e: E, attempt: number) => boolean | Promise<boolean>;
  }
): TaskEither<E, A> {
  const { max, baseDelayMs = 100, shouldRetry } = opts;
  return async () => {
    let attempt = 0;
    let lastLeft: Either<E, A> | undefined;
    while (attempt < max) {
      const res = await task();
      if (isRight(res)) return res;
      lastLeft = res;
      attempt++;
      const retry = attempt < max && (shouldRetry ? await shouldRetry(res.left, attempt) : true);
      if (!retry) return res;
      const delay = Math.min(2000, baseDelayMs * Math.pow(2, attempt - 1));
      await new Promise((r) => setTimeout(r, delay));
    }
    return lastLeft!; // last failure
  };
}

// Timeout wrapper: cancels if not settled within ms (best-effort; we can't always abort underlying promise).
export function withTimeoutTE<E, A>(
  task: TaskEither<E, A>,
  ms: number,
  onTimeout?: () => E
): TaskEither<E, A> {
  return async () => {
    let settled = false;
    const t = task().then((r) => {
      settled = true;
      return r;
    });
    const timeout = new Promise<Either<E, A>>((res) =>
      setTimeout(() => {
        if (!settled)
          res(left(onTimeout ? onTimeout() : (new Error(`Timeout after ${ms}ms`) as any)));
      }, ms)
    );
    return Promise.race([t, timeout]) as Promise<Either<E, A>>;
  };
}

// Eventually helper using a supplied polling function (wrap existing eventualPoll logic at call sites if needed).
export function eventuallyTE<E, A>(
  thunk: () => Promise<A>,
  predicate: (a: A) => boolean | Promise<boolean>,
  opts: { intervalMs?: number; waitUpToMs: number }
): TaskEither<E, A> {
  const { intervalMs = 500, waitUpToMs } = opts;
  return async () => {
    const start = Date.now();
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      attempt++;
      try {
        const val = await thunk();
        if (await predicate(val)) return right(val);
      } catch (e) {
        return left(e as E);
      }
      const elapsed = Date.now() - start;
      if (elapsed >= waitUpToMs)
        return left(
          new EventualConsistencyTimeoutError({ attempts: attempt, elapsedMs: elapsed }) as any as E
        );
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  };
}
