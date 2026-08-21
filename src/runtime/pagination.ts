/*
 * Async-generator pagination engine for `search*` operations (issue #3).
 *
 * A single, shared runtime that turns any Orchestration Cluster `search*`
 * operation into a lazy, cancelable async stream — instead of hand-writing
 * next-page bookkeeping on 46 endpoints. This module is the pure core (no
 * dependency on generated types or the client); `searchPagination.ts` binds it
 * onto the generated client so every search method gains a `.paginate(...)`.
 */

/** The `page` object every search response carries (structural subset). */
export interface SearchPageResponse {
  totalItems: number;
  hasMoreTotalItems: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/** Any search response: an `items` array plus the `page` cursor block. */
export interface SearchResponse<TItem> {
  items: TItem[];
  page: SearchPageResponse;
}

/** The `page` field of a search request body (cursor-forward or offset). */
export interface SearchPageRequest {
  /** Cursor-forward: `endCursor` of the previous page. */
  after?: string;
  /** Cursor-backward: `startCursor` of the previous page (mutually exclusive with `after`/`from`). */
  before?: string;
  /** Offset: index to start from. */
  from?: number;
  limit?: number;
  [k: string]: unknown;
}

/** A request body that optionally carries a `page` block. */
export type SearchBody = { page?: SearchPageRequest } & Record<string, unknown>;

export type PaginationMode = 'auto' | 'cursor' | 'offset';

export interface PaginateOptions {
  /** Abort between pages; a fired signal stops further fetches. */
  signal?: AbortSignal;
  /**
   * Safety cap on pages fetched (default: unbounded). A non-positive value
   * (`0` or negative) fetches no pages at all — the cap is enforced *before*
   * the first request, so it is always honoured exactly.
   */
  maxPages?: number;
  /** How to advance. `auto` prefers a cursor, falls back to offset. */
  mode?: PaginationMode;
}

/**
 * Fetches one page for a given body. Decoupled from the facade's `ec` arg.
 *
 * `isFirstPage` is `true` only for the initial fetch of *this* iteration run
 * (each `pages()`/`items()`/`toArray()` call starts a fresh run). Adapters that
 * carry per-first-page state (e.g. an eventual-consistency window) must key off
 * this flag rather than closure state so that reusing a paginator, or consuming
 * two views concurrently, does not leak first-page behaviour across iterators.
 */
export type FetchPage<TItem, TBody extends SearchBody> = (
  body: TBody,
  signal?: AbortSignal,
  isFirstPage?: boolean
) => Promise<SearchResponse<TItem>>;

export interface Paginator<TItem> extends AsyncIterable<SearchResponse<TItem>> {
  /** Yields whole pages, fetching each lazily as it is consumed. */
  pages(): AsyncGenerator<SearchResponse<TItem>, void, void>;
  /** Yields individual items across all pages (`yield*`-flattened). */
  items(): AsyncGenerator<TItem, void, void>;
  /** Eagerly drains every item into an array. Bounded result sets only. */
  toArray(): Promise<TItem[]>;
}

function abortError(): Error {
  const e = new Error('Pagination aborted');
  e.name = 'AbortError';
  return e;
}

function limitOf(body: SearchBody): number | undefined {
  const l = body.page?.limit;
  return typeof l === 'number' ? l : undefined;
}

/**
 * Build the next `page` block, keeping caller fields (e.g. `limit`) but dropping
 * pagination fields incompatible with the mode we're advancing in. The server's
 * `SearchQueryPageRequest` contract forbids mixing offset (`from`) and cursor
 * (`after`/`before`) fields, so we strip the ones that don't belong before
 * adding our own — otherwise spreading the previous `page` would leak an
 * offset/backward field into a forward-cursor request (or vice versa).
 */
function advancePage(
  prev: SearchPageRequest | undefined,
  advance: { after: string } | { from: number }
): SearchPageRequest {
  const rest: SearchPageRequest = { ...(prev ?? {}) };
  delete rest.after;
  delete rest.from;
  delete rest.before;
  return { ...rest, ...advance };
}

/**
 * Compute the next request body from the previous body + response, or `null`
 * when no further page exists. Pure — the async generator is built on top of it.
 */
export function nextPageRequest<TItem, TBody extends SearchBody>(
  body: TBody,
  response: SearchResponse<TItem>,
  mode: PaginationMode = 'auto'
): TBody | null {
  const limit = limitOf(body);
  const count = response.items.length;

  // No items at all → definitely nothing after this.
  if (count === 0) return null;
  // A short page (fewer than requested) means we've reached the end.
  if (limit !== undefined && count < limit) return null;

  const endCursor = response.page?.endCursor ?? null;

  // Decide cursor vs offset. In `auto` mode, pin the choice to the pagination
  // style the *request* already uses whenever it uses exactly one: a request
  // carrying only `after`/`before` is cursor pagination and must NOT fall back to
  // an offset (`from`) request just because a full page returned
  // `endCursor: null`; a request carrying only `from` is offset pagination and
  // must NOT flip to a cursor request just because a response happened to include
  // an `endCursor`. Either flip would mix mutually-exclusive fields, which the
  // server's `SearchQueryPageRequest` contract forbids. When the request pins
  // neither style (typically the first page) — or, pathologically, carries both —
  // fall back to response cursor presence.
  const hasCursor = body.page?.after !== undefined || body.page?.before !== undefined;
  const hasFrom = typeof body.page?.from === 'number';
  let useCursor: boolean;
  if (mode === 'cursor') useCursor = true;
  else if (mode === 'offset') useCursor = false;
  else if (hasCursor && !hasFrom) useCursor = true;
  else if (hasFrom && !hasCursor) useCursor = false;
  else useCursor = endCursor !== null;

  if (useCursor) {
    if (endCursor === null) return null;
    // No-progress guard: a server echoing the same cursor must not loop forever.
    if (body.page?.after === endCursor) return null;
    return {
      ...body,
      page: advancePage(body.page, { after: endCursor }),
    } as TBody;
  }

  // Offset mode: advance `from` by however many items we actually received.
  const prevFrom = typeof body.page?.from === 'number' ? body.page.from : 0;
  return {
    ...body,
    page: advancePage(body.page, { from: prevFrom + count }),
  } as TBody;
}

/**
 * Wrap a search operation as a lazy, cancelable async stream.
 *
 * @example
 *   const p = paginate((b, s) => searchProcessInstances(b, { ... }), body);
 *   for await (const pi of p.items()) { ... }        // item-by-item
 *   for await (const page of p.pages()) { ... }       // page-by-page
 */
export function paginate<TItem, TBody extends SearchBody>(
  fetchPage: FetchPage<TItem, TBody>,
  body: TBody,
  opts: PaginateOptions = {}
): Paginator<TItem> {
  const { signal, maxPages = Number.POSITIVE_INFINITY, mode = 'auto' } = opts;

  async function* pages(): AsyncGenerator<SearchResponse<TItem>, void, void> {
    let current: TBody = body;
    let fetched = 0;

    while (true) {
      // Enforce the page cap *before* fetching so a non-positive `maxPages`
      // (0 or negative) fetches nothing, and a positive cap is never exceeded.
      if (fetched >= maxPages) return;
      if (signal?.aborted) throw abortError();

      const response = await fetchPage(current, signal, fetched === 0);
      // Compute the next request BEFORE yielding. A page consumer that mutates
      // the yielded `response.items` (e.g. clears or splices it) while it holds
      // the page must not be able to shorten `count` or otherwise alter the
      // cursor/offset we derive for traversal — generated `items` arrays are
      // ordinary mutable arrays, so snapshot our traversal decision first.
      const next = nextPageRequest(current, response, mode);
      yield response;
      fetched += 1;

      if (next === null) return;
      current = next;
    }
  }

  async function* items(): AsyncGenerator<TItem, void, void> {
    for await (const page of pages()) {
      yield* page.items;
    }
  }

  async function toArray(): Promise<TItem[]> {
    const out: TItem[] = [];
    for await (const item of items()) out.push(item);
    return out;
  }

  return {
    pages,
    items,
    toArray,
    [Symbol.asyncIterator]: pages,
  };
}
