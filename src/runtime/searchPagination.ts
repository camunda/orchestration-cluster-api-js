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
import type { OperationOptions } from './retry';

/** Options for `search*.paginate(...)`: page controls + per-call forwarding. */
export interface SearchPaginateOptions<TData> extends PaginateOptions {
  /**
   * Eventual-consistency controls forwarded to the underlying search call.
   * Defaults to `{ waitUpToMs: 0 }` (ignore eventual consistency) when omitted.
   */
  consistency?: ConsistencyOptions<TData>;
  /** Low-level per-request options (retry, etc.) forwarded to each page call. */
  request?: OperationOptions;
}

/**
 * Attach a `.paginate` method to every `search*` operation on `client`.
 * Idempotent and enumeration-free: matches methods by the `search<Capital>`
 * naming contract on the prototype.
 */
export function installSearchPagination(client: object): void {
  const proto = Object.getPrototypeOf(client) as Record<string, unknown>;
  for (const name of Object.getOwnPropertyNames(proto)) {
    if (!/^search[A-Z]/.test(name)) continue;
    const method = proto[name];
    if (typeof method !== 'function') continue;

    const call = (method as (...a: unknown[]) => unknown).bind(client);

    // Preserve the original callable (and its CancelablePromise return); add
    // `.paginate` alongside it as a non-enumerable own property.
    const wrapper = ((...args: unknown[]) => call(...args)) as ((...args: unknown[]) => unknown) & {
      paginate?: (body: SearchBody, opts?: SearchPaginateOptions<unknown>) => Paginator<unknown>;
    };

    wrapper.paginate = (body: SearchBody, opts: SearchPaginateOptions<unknown> = {}) => {
      const { consistency, request, ...pageOpts } = opts;
      const consistencyArg = { consistency: consistency ?? { waitUpToMs: 0 } };
      const fetchPage = (b: SearchBody) =>
        call(b, consistencyArg, request) as Promise<SearchResponse<unknown>>;
      return paginate(fetchPage, body, pageOpts);
    };

    Object.defineProperty(client, name, {
      value: wrapper,
      writable: true,
      enumerable: false,
      configurable: true,
    });
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
