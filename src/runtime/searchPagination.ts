/*
 * Binds the generic pagination engine (`./pagination`) onto the generated
 * Camunda client so every `search*` operation gains a `.paginate(body, opts)`
 * method returning a lazy, cancelable async stream (issue #3).
 *
 * Design goals:
 *  - No enumeration of the 46 search ops. The runtime discovers them by the
 *    `search*` naming contract; the types discover them via a `search${string}`
 *    key filter and infer each op's body/item types from its own signature.
 *  - One well-known wiring point: `installSearchPagination(this)` is called once
 *    from the client constructor (in CamundaClient.template.ts).
 *  - The generated per-op methods are never edited.
 */
import type { ConsistencyOptions } from './eventual';
import {
  type PaginateOptions,
  type Paginator,
  paginate,
  type SearchBody,
  type SearchResponse,
} from './pagination';

/** Options for `search*.paginate(...)`: page controls + per-call forwarding. */
export interface SearchPaginateOptions<TData> extends PaginateOptions {
  /**
   * Eventual-consistency controls forwarded to the underlying search call.
   * Defaults to `{ waitUpToMs: 0 }` (ignore eventual consistency) when omitted.
   *
   * Only the **first** page honours this window: once paging is under way an
   * empty page is a legitimate end-of-results, not a not-yet-consistent read,
   * so subsequent (and exhaustion-probe) fetches always use `{ waitUpToMs: 0 }`.
   * Waiting on those would make the terminal fetch of an exactly-full or empty
   * result set block for the whole window and then throw.
   */
  consistency?: ConsistencyOptions<TData>;
}

/**
 * `search*` prototype members that match the `search[A-Z]` naming contract but
 * are hand-written helpers rather than generated search operations — they have
 * a different call shape and must never be wrapped with `.paginate`.
 */
const NON_PAGINATED_SEARCH_METHODS = new Set<string>(['searchVariablesAsDto']);

/**
 * Attach a `.paginate` method to every `search*` operation on `client`.
 * Idempotent and enumeration-free: matches methods by the `search<Capital>`
 * naming contract on the prototype, excluding hand-written helpers whose call
 * shape is not `(body, consistency, options)`.
 */
export function installSearchPagination(client: object): void {
  const seen = new Set<string>();
  // Walk the prototype chain (stopping before Object.prototype) so a subclass
  // of the generated client still gains `.paginate` on the generated `search*`
  // methods it inherits — `Object.getPrototypeOf(client)` alone would only see
  // the subclass's own prototype and skip every inherited search operation.
  let proto = Object.getPrototypeOf(client) as Record<string, unknown> | null;
  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (seen.has(name)) continue;
      if (!/^search[A-Z]/.test(name)) continue;
      if (NON_PAGINATED_SEARCH_METHODS.has(name)) continue;
      const method = proto[name];
      if (typeof method !== 'function') continue;
      seen.add(name);

      const call = (method as (...a: unknown[]) => unknown).bind(client);

      // Preserve the original callable (and its CancelablePromise return); add
      // `.paginate` alongside it as a non-enumerable own property.
      const wrapper = ((...args: unknown[]) => call(...args)) as ((
        ...args: unknown[]
      ) => unknown) & {
        paginate?: (body: SearchBody, opts?: SearchPaginateOptions<unknown>) => Paginator<unknown>;
      };

      wrapper.paginate = (body: SearchBody, opts: SearchPaginateOptions<unknown> = {}) => {
        const { consistency, ...pageOpts } = opts;
        const fetchPage = (b: SearchBody, signal?: AbortSignal, isFirstPage = false) => {
          // Eventual-consistency waiting only makes sense for the initial query:
          // once we are paging forward an empty page means end-of-results, not an
          // inconsistency, so waiting (and its terminal timeout error) must not
          // apply to subsequent or exhaustion-probe fetches. `isFirstPage` is
          // supplied per iterator run by the engine, so reusing the paginator
          // does not leak the first-page window across iterators.
          const consistencyArg = {
            consistency: isFirstPage ? (consistency ?? { waitUpToMs: 0 }) : { waitUpToMs: 0 },
          };
          const p = call(b, consistencyArg) as Promise<SearchResponse<unknown>> & {
            cancel?: () => void;
          };
          // Honour mid-flight cancellation: the underlying call is a
          // CancelablePromise, so abort the in-flight page (not just between
          // pages) and clean the listener up once the page settles. Register the
          // listener *before* re-checking `signal.aborted` so an abort that fires
          // between the check and the subscription is not missed.
          if (signal) {
            const onAbort = () => p.cancel?.();
            signal.addEventListener('abort', onAbort, { once: true });
            const cleanup = () => signal.removeEventListener('abort', onAbort);
            p.then(cleanup, cleanup);
            if (signal.aborted) p.cancel?.();
          }
          return p as Promise<SearchResponse<unknown>>;
        };
        return paginate(fetchPage, body, pageOpts);
      };

      Object.defineProperty(client, name, {
        value: wrapper,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
    proto = Object.getPrototypeOf(proto) as Record<string, unknown> | null;
  }
}

// --- Type-level augmentation ------------------------------------------------
// The client's generated search methods are overloaded (public typed signature
// + `any` implementation signature). Conditional inference on an overloaded
// function resolves to the *last* (impl) signature, which is untyped — so we
// match a two-call-signature shape to bind the body/result of the *first*
// (public) overload instead.

/** Extract `{ body, result }` from a `search*` method's first (typed) overload. */
type SearchSignature<F> = F extends {
  (body: infer B, consistency: infer _C, options?: infer _O): infer R;
  (body: infer _B2, consistency: infer _C2, options?: infer _O2): infer _R2;
}
  ? { body: B; result: Awaited<R> }
  : F extends (body: infer B, consistency: infer _C, options?: infer _O) => infer R
    ? { body: B; result: Awaited<R> }
    : never;

/** The element type of a search response's `items` array. */
type ItemsOf<TData> = TData extends { items?: Array<infer I> } ? I : never;

/**
 * For a client type `C`, the set of `.paginate` methods to intersect onto it.
 * Only `search*` keys whose response actually carries `items` are included.
 */
export type SearchPaginationApi<C> = {
  [K in keyof C as K extends `search${string}`
    ? SearchSignature<C[K]> extends { result: infer D }
      ? [ItemsOf<D>] extends [never]
        ? never
        : K
      : never
    : never]: SearchSignature<C[K]> extends { body: infer B; result: infer D }
    ? {
        /**
         * Stream this search across all pages as a lazy, cancelable async
         * iterable. See `Paginator` for `.items()`, `.pages()`, `.toArray()`.
         */
        paginate(body: B, opts?: SearchPaginateOptions<D>): Paginator<ItemsOf<D>>;
      }
    : never;
};

/** A Camunda client augmented with `.paginate` on every search operation. */
export type WithSearchPagination<C> = C & SearchPaginationApi<C>;
