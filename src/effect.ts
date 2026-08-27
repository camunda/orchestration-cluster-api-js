// First-class Effect adapter for the Camunda client.
//
// Mirrors the Promise-based `CamundaClient` surface, mapping every method to an
// `Effect.Effect<Awaited<R>, DomainError, never>` via the same `Proxy` +
// method-memoization trick the former functional adapter used (it already handles
// `CancelablePromise`/sync returns via `isPromiseLike`).
//
// `effect` is an OPTIONAL peer dependency: importing this module (the `./effect`
// subpath) is the only way to pull `effect` into the runtime graph. The main `.`
// entry never imports it, so Promise-first users are never forced to adopt Effect.

import { Context, Data, Duration, Effect, Layer, Schedule, Stream } from 'effect';
import { type CamundaClient, type CamundaOptions, createCamundaClient } from './gen/CamundaClient';
import {
  EventualConsistencyTimeoutError as RuntimeEventualConsistencyTimeoutError,
  CamundaValidationError as RuntimeValidationError,
} from './runtime/errors';
import type { ConsistencyOptions } from './runtime/eventual';
import {
  nextPageRequest,
  type PaginationMode,
  type Paginator,
  type SearchBody,
  type SearchResponse,
} from './runtime/pagination';
import type { SearchPaginateOptions } from './runtime/searchPagination';

// --- Tagged domain errors -------------------------------------------------------
//
// Modeled as `Data.TaggedError` classes so callers discriminate with
// `Effect.catchTag` / `Effect.catchTags` instead of a hand-rolled classification
// switch. Each carries a stable `_tag` literal.

/** A request/response validation failure surfaced by the SDK. */
export class CamundaValidationError extends Data.TaggedError('CamundaValidationError')<{
  readonly side: 'request' | 'response';
  readonly operationId?: string;
  readonly summary: string;
  readonly issues: string[];
  readonly message: string;
  readonly cause?: unknown;
}> {}

/** An eventual-consistency poll that did not converge within its budget. */
export class EventualConsistencyTimeout extends Data.TaggedError('EventualConsistencyTimeout')<{
  readonly attempts?: number;
  readonly elapsedMs?: number;
  readonly message: string;
  readonly cause?: unknown;
}> {}

/** An HTTP-level failure (non-2xx / transport carrying a status). */
export class HttpError extends Data.TaggedError('HttpError')<{
  readonly status?: number;
  readonly body?: unknown;
  readonly message: string;
  readonly cause?: unknown;
}> {}

/** Any other thrown value that does not map to a more specific tag. */
export class CamundaGenericError extends Data.TaggedError('CamundaGenericError')<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/** The typed error channel for every Effect the client produces. */
export type DomainError =
  | CamundaValidationError
  | EventualConsistencyTimeout
  | HttpError
  | CamundaGenericError;

/** The tag literals of the {@link DomainError} union. */
export type DomainErrorTag = DomainError['_tag'];

// Narrow an arbitrary thrown value into the tagged `DomainError` union.
function toDomainError(err: unknown): DomainError {
  if (err instanceof RuntimeValidationError) {
    return new CamundaValidationError({
      side: err.side,
      operationId: err.operationId,
      summary: err.summary,
      issues: err.issues,
      message: err.message,
      cause: err,
    });
  }
  if (err instanceof RuntimeEventualConsistencyTimeoutError) {
    return new EventualConsistencyTimeout({
      attempts: err.attempts,
      elapsedMs: err.elapsedMs,
      message: err.message,
      cause: err,
    });
  }
  const anyErr = err as { status?: unknown; body?: unknown; message?: unknown } | null | undefined;
  if (anyErr && typeof anyErr === 'object' && typeof anyErr.status === 'number') {
    return new HttpError({
      status: anyErr.status,
      body: anyErr.body,
      message: typeof anyErr.message === 'string' ? anyErr.message : `HTTP ${anyErr.status}`,
      cause: err,
    });
  }
  if (err instanceof Error) {
    return new CamundaGenericError({ message: err.message, cause: err });
  }
  return new CamundaGenericError({ message: String(err), cause: err });
}

// --- Paginated search -----------------------------------------------------------
//
// The Promise client attaches a `.paginate` helper to every `search*` operation
// (`installSearchPagination`), returning a lazy `AsyncIterable` `Paginator`. The
// Effect client keeps that helper but re-expresses it in Effect terms: pages and
// items become `Stream`s, and the eager drain becomes an `Effect`.
//
// The page-advance *algebra* is shared with the Promise engine — `nextPageRequest`
// (pure) decides cursor-vs-offset and end-of-results identically for both. Only the
// driver differs, and it has to: the Promise engine is an async generator advanced
// by `AbortSignal`, and bridging that into a `Stream` (`Stream.fromAsyncIterable`)
// pulls through an uninterruptible `Effect.tryPromise`, so a fiber blocked on an
// in-flight page could not be interrupted. Driving the loop with the Effect search
// call — which already cancels its `CancelablePromise` on interrupt — keeps the
// whole stream interruptible.

/** Options for the Effect client's `.paginate`. */
export interface EffectPaginateOptions<TData = unknown> {
  /**
   * Safety cap on pages fetched (default: unbounded). A non-positive value fetches
   * no pages at all — the cap is enforced *before* the first request.
   */
  readonly maxPages?: number;
  /** How to advance. `auto` prefers a cursor, falls back to offset. */
  readonly mode?: PaginationMode;
  /**
   * Eventual-consistency controls forwarded to the underlying search call. Defaults
   * to `{ waitUpToMs: 0 }`. Only the **first** page honours this window: once paging
   * is under way an empty page is end-of-results, not a not-yet-consistent read.
   */
  readonly consistency?: ConsistencyOptions<TData>;
}

/**
 * The Effect-flavoured counterpart of a {@link Paginator}: the same three views
 * (`pages` / `items` / `toArray`) over a multi-page search, as `Stream`s and an
 * `Effect` rather than async iterables and a `Promise`.
 *
 * Every view is lazy — a page is fetched only when pulled — and interruptible:
 * interrupting the fiber cancels the in-flight page request rather than leaving it
 * to settle unobserved.
 */
export interface EffectPaginator<TItem> {
  /** A `Stream` of whole pages, each fetched lazily as it is pulled. */
  pages(): Stream.Stream<SearchResponse<TItem>, DomainError>;
  /** A `Stream` of individual items, flattened across all pages. */
  items(): Stream.Stream<TItem, DomainError>;
  /** Eagerly drains every item into an array. Bounded result sets only. */
  toArray(): Effect.Effect<TItem[], DomainError>;
}

/** The Effect-returning search call a paginator drives. */
type EffectSearch = (
  body: SearchBody,
  consistencyArg: { consistency: ConsistencyOptions<unknown> }
) => Effect.Effect<SearchResponse<unknown>, DomainError>;

/** Build the Effect `.paginate` helper for one Effect-returning search operation. */
function effectifyPaginate(search: EffectSearch) {
  return (body: SearchBody, opts: EffectPaginateOptions = {}): EffectPaginator<unknown> => {
    const { consistency, maxPages = Number.POSITIVE_INFINITY, mode = 'auto' } = opts;

    const pagesFrom = (
      pageBody: SearchBody,
      remaining: number,
      isFirstPage: boolean
    ): Stream.Stream<SearchResponse<unknown>, DomainError> => {
      if (remaining <= 0) return Stream.empty;
      // Waiting on eventual consistency only makes sense for the initial query: once
      // paging forward, an empty page means end-of-results, not an inconsistent read,
      // so waiting (and its terminal timeout) must not apply to later fetches.
      const consistencyArg = {
        consistency: isFirstPage ? (consistency ?? { waitUpToMs: 0 }) : { waitUpToMs: 0 },
      } as { consistency: ConsistencyOptions<unknown> };

      return Stream.unwrap(
        search(pageBody, consistencyArg).pipe(
          Effect.map((response) => {
            const next = nextPageRequest(pageBody, response, mode);
            const head = Stream.make(response);
            return next === null
              ? head
              : Stream.concat(head, pagesFrom(next, remaining - 1, false));
          })
        )
      );
    };

    const pages = () => pagesFrom(body, maxPages, true);
    const items = () =>
      pages().pipe(
        Stream.map((response) => response.items),
        Stream.flattenIterable
      );

    return {
      pages,
      items,
      toArray: () => Stream.runCollect(items()).pipe(Effect.map((chunk) => [...chunk])),
    };
  };
}

// --- Client shape ---------------------------------------------------------------

/** Keys of `C` whose values are callable. */
export type FnKeys<C> = { [K in keyof C]: C[K] extends (...a: any) => any ? K : never }[keyof C];

/**
 * Helpers attached to a client *method* (not to the client), re-expressed in Effect
 * terms. Resolves to `unknown` — the identity of `&` — for a method that carries none.
 */
type EffectifyMethodHelpers<F> = F extends {
  paginate(body: infer B, opts?: SearchPaginateOptions<infer D>): Paginator<infer I>;
}
  ? { paginate(body: B, opts?: EffectPaginateOptions<D>): EffectPaginator<I> }
  : unknown;

/** Maps a single method to its Effect-returning form, keeping its attached helpers. */
type EffectifyMethod<F> = F extends (...a: infer A) => infer R
  ? ((...a: A) => Effect.Effect<Awaited<R>, DomainError, never>) & EffectifyMethodHelpers<F>
  : never;

/** Maps every method of `C` to an Effect-returning method, preserving non-fn members. */
export type Effectify<C> = {
  [K in FnKeys<C>]: EffectifyMethod<C[K]>;
} & { inner: C } & { [K in Exclude<keyof C, FnKeys<C>>]: C[K] };

/** The Effect-flavoured Camunda client. Every operation returns an `Effect`. */
export type CamundaEffectClient = Effectify<CamundaClient>;

// Runtime detection of promise-like (includes CancelablePromise).
function isPromiseLike<T>(v: unknown): v is Promise<T> {
  return !!v && typeof (v as { then?: unknown }).then === 'function';
}

/**
 * Create an Effect-flavoured Camunda client.
 *
 * Every `CamundaClient` method becomes `(...args) => Effect.Effect<Awaited<R>,
 * DomainError, never>`. Failures are narrowed into the tagged {@link DomainError}
 * union so callers use `Effect.catchTag`/`catchTags`. The underlying throwing
 * client is reachable via the `.inner` escape hatch.
 *
 * @description Camunda Effect Client. See the README and [this test](https://github.com/camunda/orchestration-cluster-api-js/blob/main/tests-integration/effect.test.ts) for example usage.
 */
export function createCamundaEffectClient(options?: CamundaOptions): CamundaEffectClient {
  const base = createCamundaClient(options);
  const cache = new Map<string | symbol, unknown>();

  function wrap(fn: (...a: any[]) => any) {
    const wrapped = (...args: any[]) =>
      Effect.suspend(() => {
        // The generated client can throw *synchronously* (e.g. an eventual
        // endpoint invoked without `consistencyManagement`). Map those to the
        // tagged error channel too, rather than letting them escape as a defect.
        let r: unknown;
        try {
          r = fn.apply(base, args);
        } catch (e) {
          return Effect.fail(toDomainError(e));
        }
        if (!isPromiseLike(r)) return Effect.succeed(r);
        const promise = r;
        return Effect.callback<any, DomainError>((resume) => {
          promise.then(
            (a: unknown) => resume(Effect.succeed(a)),
            (e: unknown) => resume(Effect.fail(toDomainError(e)))
          );
          // Honour Effect interruption: if the fiber is interrupted (e.g. by
          // `withTimeout` or a parent), cancel the underlying `CancelablePromise`
          // so the in-flight HTTP request is aborted instead of leaking.
          const cancel = (r as { cancel?: () => void }).cancel;
          return typeof cancel === 'function' ? Effect.sync(() => cancel.call(r)) : undefined;
        });
      });

    // A fresh arrow carries none of the own properties the runtime attaches to the
    // original method. Re-attach the ones the client installs, adapted to Effect —
    // otherwise the Effect client silently loses part of the Promise client's API
    // (`.paginate` on all ~48 `search*` operations). Guarded by
    // `tests/effect-client-surface.test.ts`, which fails if a new method-attached
    // helper appears here without being adapted.
    //
    // The Effect paginator drives `wrapped` (this very Effect search call), not the
    // Promise `.paginate`; the presence of `.paginate` on the original is what marks
    // this method as a paginated search operation.
    if (typeof (fn as { paginate?: unknown }).paginate === 'function') {
      (wrapped as { paginate?: unknown }).paginate = effectifyPaginate(
        wrapped as unknown as EffectSearch
      );
    }

    return wrapped;
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

  return new Proxy({}, handler) as CamundaEffectClient;
}

// --- Combinators (Effect-native) ------------------------------------------------

/**
 * Human-readable rendering of a `Duration.Input` for error messages. `String()`
 * degrades to `[object Object]` for non-string inputs (millis-numbers, `Duration`
 * values, `[seconds, nanos]` tuples); this normalises them via `Duration.format`.
 */
function formatDuration(d: Duration.Input): string {
  // Only used to build error messages. `fromInputUnsafe` throws on a malformed
  // (but statically typed) Duration.Input, so guard it — a formatting failure
  // must never turn a typed timeout failure into an unexpected defect.
  try {
    return Duration.format(Duration.fromInputUnsafe(d));
  } catch {
    return String(d);
  }
}

/**
 * Retry an effect with exponential backoff (+ jitter), capped attempts, and an
 * optional predicate over the error.
 */
export function retryWithBackoff<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  opts: {
    max: number;
    baseDelay?: Duration.Input;
    while?: (e: E) => boolean;
  }
): Effect.Effect<A, E, R> {
  const backoff = Schedule.exponential(opts.baseDelay ?? '100 millis').pipe(Schedule.jittered);
  // `times: n` caps at n retries after the initial attempt → n+1 total attempts.
  // (v4 dropped `Schedule.intersect`; the retry options object composes the
  // exponential-backoff schedule with the attempt cap and the error predicate.)
  return Effect.retry(effect, {
    schedule: backoff,
    times: Math.max(0, opts.max - 1),
    while: opts.while,
  });
}

/**
 * Fail an effect with a real interruption if it does not settle within `duration`
 * (true interruption, not a best-effort `Promise.race`).
 */
export function withTimeout<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  duration: Duration.Input,
  onTimeout?: () => E | EventualConsistencyTimeout
): Effect.Effect<A, E | EventualConsistencyTimeout, R> {
  return Effect.timeoutOrElse(effect, {
    duration,
    orElse: () =>
      Effect.fail(
        onTimeout
          ? onTimeout()
          : new EventualConsistencyTimeout({
              message: `Timed out after ${formatDuration(duration)}`,
            })
      ),
  });
}

/**
 * Poll `effect` on the Effect `Clock` until `predicate` holds, timing out to
 * {@link EventualConsistencyTimeout} once `waitUpTo` elapses. Because it uses the
 * Effect `Clock` (not `Date.now`/`setTimeout`), `TestClock.adjust` advances it
 * deterministically in tests — no real-clock burn.
 */
export function eventually<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  predicate: (a: A) => boolean,
  opts: {
    waitUpTo: Duration.Input;
    interval?: Duration.Input;
  }
): Effect.Effect<A, E | EventualConsistencyTimeout, R> {
  const interval = opts.interval ?? '500 millis';
  // Poll on the Effect `Clock` (Effect.sleep), returning the value A once the
  // predicate holds. Kept as an Effect-valued loop (not `Effect.repeat` with a
  // schedule, whose success channel is the schedule output, not A).
  const poll: Effect.Effect<A, E, R> = Effect.suspend(() =>
    effect.pipe(
      Effect.flatMap((a) =>
        predicate(a) ? Effect.succeed(a) : Effect.sleep(interval).pipe(Effect.andThen(poll))
      )
    )
  );
  return withTimeout(
    poll,
    opts.waitUpTo,
    () =>
      new EventualConsistencyTimeout({
        message: `Eventual consistency timeout after ${formatDuration(opts.waitUpTo)}`,
      })
  );
}

// --- Dependency injection -------------------------------------------------------

/**
 * `Context` service key for the Effect Camunda client. Compose worker/orchestration
 * code against this tag and provide {@link layer} (or a test double) via `Layer`.
 */
export class CamundaEffect extends Context.Service<CamundaEffect, CamundaEffectClient>()(
  'CamundaEffect'
) {}

/**
 * A `Layer` that constructs a {@link CamundaEffectClient} and provides it as the
 * {@link CamundaEffect} service. Swap in a test double by providing a different
 * `Layer` for the same tag.
 */
export function layer(options?: CamundaOptions): Layer.Layer<CamundaEffect> {
  return Layer.sync(CamundaEffect, () => createCamundaEffectClient(options));
}
