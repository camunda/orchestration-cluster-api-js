/*
 * Tests for the async-generator pagination helper (issue #3).
 * Pure unit tests with a mock page-fetcher — no network, no live client.
 */
import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import {
  nextPageRequest,
  paginate,
  type SearchBody,
  type SearchResponse,
} from '../src/runtime/pagination';
import { installSearchPagination } from '../src/runtime/searchPagination';

type Item = { id: number };

/** Build a mock cursor-paginated dataset sliced into fixed-size pages. */
function cursorFetcher(total: number, pageSize: number) {
  return vi.fn(async (body: SearchBody): Promise<SearchResponse<Item>> => {
    const after = typeof body.page?.after === 'string' ? Number(body.page.after) : 0;
    const start = after;
    const slice = Array.from(
      { length: Math.max(0, Math.min(pageSize, total - start)) },
      (_, i) => ({ id: start + i })
    );
    const nextIndex = start + slice.length;
    const endCursor = nextIndex < total && slice.length > 0 ? String(nextIndex) : null;
    return {
      items: slice,
      page: { totalItems: total, hasMoreTotalItems: false, startCursor: null, endCursor },
    };
  });
}

/** Build a mock offset-paginated dataset (no cursors in the response). */
function offsetFetcher(total: number, pageSize: number) {
  return vi.fn(async (body: SearchBody): Promise<SearchResponse<Item>> => {
    const from = typeof body.page?.from === 'number' ? body.page.from : 0;
    const slice = Array.from({ length: Math.max(0, Math.min(pageSize, total - from)) }, (_, i) => ({
      id: from + i,
    }));
    return {
      items: slice,
      page: { totalItems: total, hasMoreTotalItems: false, startCursor: null, endCursor: null },
    };
  });
}

describe('paginate (spike)', () => {
  it('streams all items across cursor pages', async () => {
    const fetch = cursorFetcher(23, 10);
    const body: SearchBody = { filter: { state: 'ACTIVE' }, page: { limit: 10 } };

    const seen: number[] = [];
    for await (const item of paginate(fetch, body).items()) seen.push(item.id);

    expect(seen).toEqual(Array.from({ length: 23 }, (_, i) => i));
    expect(fetch).toHaveBeenCalledTimes(3); // 10 + 10 + 3
    // filter is preserved on every page; only `page.after` changes.
    expect(fetch.mock.calls[1]?.[0]).toMatchObject({
      filter: { state: 'ACTIVE' },
      page: { after: '10', limit: 10 },
    });
  });

  it('yields whole pages via pages()', async () => {
    const fetch = cursorFetcher(23, 10);
    const sizes: number[] = [];
    for await (const page of paginate(fetch, { page: { limit: 10 } }).pages()) {
      sizes.push(page.items.length);
    }
    expect(sizes).toEqual([10, 10, 3]);
  });

  it('drains all items via toArray()', async () => {
    const fetch = cursorFetcher(23, 10);
    const all = await paginate(fetch, { page: { limit: 10 } }).toArray();
    expect(all.map((i) => i.id)).toEqual(Array.from({ length: 23 }, (_, i) => i));
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('is lazy: breaking out stops fetching further pages', async () => {
    const fetch = cursorFetcher(100, 10);
    const collected: number[] = [];
    for await (const item of paginate(fetch, { page: { limit: 10 } }).items()) {
      collected.push(item.id);
      if (collected.length === 5) break; // stop mid-first-page
    }
    expect(collected).toHaveLength(5);
    expect(fetch).toHaveBeenCalledTimes(1); // no page 2 fetched
  });

  it('handles offset endpoints (no cursors in response)', async () => {
    const fetch = offsetFetcher(25, 10);
    const seen: number[] = [];
    for await (const item of paginate(fetch, { page: { from: 0, limit: 10 } }).items()) {
      seen.push(item.id);
    }
    expect(seen).toEqual(Array.from({ length: 25 }, (_, i) => i));
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch.mock.calls[1]?.[0]).toMatchObject({ page: { from: 10 } });
  });

  it('respects maxPages', async () => {
    const fetch = cursorFetcher(100, 10);
    const pages: number[] = [];
    for await (const page of paginate(fetch, { page: { limit: 10 } }, { maxPages: 2 }).pages()) {
      pages.push(page.items.length);
    }
    expect(pages).toEqual([10, 10]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  // Regression: a non-positive `maxPages` must fetch NOTHING — the cap is
  // enforced before the first request, not after it (any page count <= 0).
  it('fetches nothing for a non-positive maxPages', async () => {
    for (const cap of [0, -1, -100]) {
      const fetch = cursorFetcher(100, 10);
      const pages: number[] = [];
      for await (const page of paginate(
        fetch,
        { page: { limit: 10 } },
        { maxPages: cap }
      ).pages()) {
        pages.push(page.items.length);
      }
      expect(pages).toEqual([]);
      expect(fetch).toHaveBeenCalledTimes(0);
    }
  });

  it('aborts between pages via AbortSignal', async () => {
    const fetch = cursorFetcher(100, 10);
    const ac = new AbortController();
    const run = async () => {
      let n = 0;
      for await (const _ of paginate(
        fetch,
        { page: { limit: 10 } },
        { signal: ac.signal }
      ).pages()) {
        n += 1;
        if (n === 1) ac.abort();
      }
    };
    await expect(run()).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('nextPageRequest (spike)', () => {
  const full: SearchResponse<Item> = {
    items: [{ id: 0 }, { id: 1 }],
    page: { totalItems: 9, hasMoreTotalItems: false, startCursor: null, endCursor: '2' },
  };

  it('returns a cursor body when endCursor present and page full', () => {
    expect(nextPageRequest({ page: { limit: 2 } }, full)).toMatchObject({ page: { after: '2' } });
  });

  it('returns null on a short page', () => {
    const short: SearchResponse<Item> = { ...full, items: [{ id: 0 }] };
    expect(nextPageRequest({ page: { limit: 2 } }, short)).toBeNull();
  });

  it('returns null on empty items', () => {
    const empty: SearchResponse<Item> = { items: [], page: { ...full.page, endCursor: null } };
    expect(nextPageRequest({ page: { limit: 2 } }, empty)).toBeNull();
  });

  it('no-progress guard: same cursor stops the loop', () => {
    expect(nextPageRequest({ page: { limit: 2, after: '2' } }, full)).toBeNull();
  });

  // Regression (defect class: mixing incompatible pagination fields). The
  // server's SearchQueryPageRequest forbids combining offset (`from`) and
  // cursor (`after`/`before`) fields, so advancing must strip the fields that
  // don't belong to the mode we're moving in — never leak them via the spread.
  it('drops offset/backward fields when advancing with a forward cursor', () => {
    const next = nextPageRequest({ page: { limit: 2, from: 10, before: 'x' } }, full);
    expect(next).not.toBeNull();
    expect(next?.page).toEqual({ limit: 2, after: '2' });
    expect(next?.page).not.toHaveProperty('from');
    expect(next?.page).not.toHaveProperty('before');
  });

  it('drops cursor fields when advancing an offset page', () => {
    const offsetFull: SearchResponse<Item> = {
      items: [{ id: 0 }, { id: 1 }],
      page: { totalItems: 9, hasMoreTotalItems: false, startCursor: null, endCursor: null },
    };
    const next = nextPageRequest(
      { page: { limit: 2, from: 0, after: 'stale', before: 'x' } },
      offsetFull
    );
    expect(next?.page).toEqual({ limit: 2, from: 2 });
    expect(next?.page).not.toHaveProperty('after');
    expect(next?.page).not.toHaveProperty('before');
  });
});

describe('installSearchPagination', () => {
  // Minimal fake client: a couple of `search*` methods (uniform
  // `(input, consistency, options?)` shape) plus a non-search method.
  class FakeClient {
    calls: Array<{ name: string; args: unknown[] }> = [];

    searchThings(input: SearchBody, consistency: unknown, options?: unknown) {
      this.calls.push({ name: 'searchThings', args: [input, consistency, options] });
      const after = typeof input.page?.after === 'string' ? Number(input.page.after) : 0;
      const items = after < 10 ? [{ id: after }] : [];
      const endCursor = after < 10 ? String(after + 1) : null;
      return Promise.resolve({ items, page: { endCursor } });
    }
    // Not a search method — must be left untouched.
    getThing() {
      return 'thing';
    }
    // Hand-written helper that matches the `search[A-Z]` naming contract but is
    // NOT a generated search operation (different call shape). Must be excluded.
    searchVariablesAsDto(_schema: unknown, _options: unknown) {
      return Promise.resolve(new Map());
    }
  }

  it('attaches .paginate to search* methods only', () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    expect(typeof c.searchThings.paginate).toBe('function');
    expect((c.getThing as any).paginate).toBeUndefined();
  });

  // Regression: `searchVariablesAsDto` matches `/^search[A-Z]/` but is a
  // hand-written helper with a `(schema, options)` shape — wrapping it with
  // `.paginate` would expose a broken method, so it must be excluded.
  it('does not attach .paginate to the searchVariablesAsDto helper', () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    expect((c.searchVariablesAsDto as any).paginate).toBeUndefined();
  });

  it('.paginate streams pages and forwards a default consistency arg', async () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);

    const ids: number[] = [];
    for await (const item of c.searchThings.paginate({ page: { limit: 1 } }).items()) {
      ids.push((item as { id: number }).id);
    }
    expect(ids).toEqual(Array.from({ length: 10 }, (_, i) => i));

    // Each underlying call receives the consistency arg in position 2.
    const first = (c as FakeClient).calls[0];
    expect(first?.args[1]).toEqual({ consistency: { waitUpToMs: 0 } });
  });

  it('.paginate forwards a caller-supplied consistency', async () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    await c.searchThings
      .paginate({ page: { limit: 1 } }, { consistency: { waitUpToMs: 5000 } })
      .pages()
      .next();
    expect((c as FakeClient).calls[0]?.args[1]).toEqual({
      consistency: { waitUpToMs: 5000 },
    });
  });

  // Regression: eventual-consistency waiting must apply to the FIRST page only.
  // On later (and exhaustion-probe) fetches an empty page is a legitimate
  // end-of-results, so forwarding a non-zero window there makes the terminal
  // fetch block for the whole window and then throw a timeout.
  it('.paginate applies caller consistency to the first page only', async () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    for await (const _ of c.searchThings
      .paginate({ page: { limit: 1 } }, { consistency: { waitUpToMs: 5000 } })
      .items()) {
      // drain to exhaustion
    }
    const calls = (c as FakeClient).calls;
    expect(calls.length).toBeGreaterThan(1);
    expect(calls[0]?.args[1]).toEqual({ consistency: { waitUpToMs: 5000 } });
    for (const call of calls.slice(1)) {
      expect(call.args[1]).toEqual({ consistency: { waitUpToMs: 0 } });
    }
  });

  // Regression: cancellation must abort the in-flight HTTP page, not just take
  // effect between completed pages. The underlying call is a CancelablePromise,
  // so an abort during a page must invoke its `.cancel()`.
  it('cancels the in-flight page when the signal aborts', async () => {
    class SlowClient {
      cancelled = false;
      searchSlow(_input: SearchBody, _consistency: unknown) {
        const p = new Promise<SearchResponse<Item>>(() => {}) as Promise<SearchResponse<Item>> & {
          cancel: () => void;
        };
        p.cancel = () => {
          this.cancelled = true;
        };
        return p;
      }
    }
    const c = new SlowClient() as any;
    installSearchPagination(c);
    const ac = new AbortController();
    // Kick off the first page (runs synchronously up to the fetch await, so the
    // abort listener is registered) then abort mid-flight.
    void c.searchSlow
      .paginate({ page: { limit: 1 } }, { signal: ac.signal })
      .pages()
      .next();
    await Promise.resolve();
    ac.abort();
    await Promise.resolve();
    expect((c as SlowClient).cancelled).toBe(true);
  });

  // Regression (defect class: first-page state shared across iterators). The
  // eventual-consistency window must apply to the first page of EACH iterator
  // run — reusing a paginator (or consuming two views) must not send the second
  // iterator's first request with `{ waitUpToMs: 0 }` because a closure flag was
  // already consumed by the first.
  it('.paginate applies first-page consistency per iterator, not once per paginator', async () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    const p = c.searchThings.paginate(
      { page: { limit: 1 } },
      { consistency: { waitUpToMs: 5000 } }
    );
    // First iterator run: first call gets the caller window.
    await p.pages().next();
    // Second iterator run over the SAME paginator: its first call must ALSO get
    // the caller window, not the leaked `{ waitUpToMs: 0 }` from the first run.
    await p.pages().next();
    const calls = (c as FakeClient).calls;
    expect(calls[0]?.args[1]).toEqual({ consistency: { waitUpToMs: 5000 } });
    const secondRunFirstCall = calls[calls.length - 1];
    expect(secondRunFirstCall?.args[1]).toEqual({ consistency: { waitUpToMs: 5000 } });
  });

  // Regression (defect class: prototype-chain discovery). A subclass of a client
  // whose constructor installs pagination must still gain `.paginate` on the
  // generated `search*` methods it inherits from the base prototype.
  it('attaches .paginate to inherited search* methods on a subclass', () => {
    class SubClient extends FakeClient {
      extra() {
        return 1;
      }
    }
    const c = new SubClient() as any;
    installSearchPagination(c);
    expect(typeof c.searchThings.paginate).toBe('function');
    expect((c.searchVariablesAsDto as any).paginate).toBeUndefined();
  });

  it('preserves the original callable behaviour', async () => {
    const c = new FakeClient() as any;
    installSearchPagination(c);
    const res = await c.searchThings({ page: {} }, { consistency: { waitUpToMs: 0 } });
    expect(res.items).toEqual([{ id: 0 }]);
  });
});

// Regression (defect class: discovery tested only against a hand-written fake).
// A generator or prototype-layout change could leave real `search*` methods
// without `.paginate` while the FakeClient suite stays green. Construct the
// actual generated client (offline — no network) and assert every generated
// search operation gains `.paginate`, while the hand-written `searchVariablesAsDto`
// helper stays excluded.
describe('installSearchPagination on the generated client', () => {
  const client = createCamundaClient({
    config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
    fetch: (async () => new Response('{}', { status: 200 })) as any,
  }) as any;

  const generatedSearchMethods = (() => {
    const names = new Set<string>();
    let proto = Object.getPrototypeOf(client);
    while (proto && proto !== Object.prototype) {
      for (const name of Object.getOwnPropertyNames(proto)) {
        if (/^search[A-Z]/.test(name) && name !== 'searchVariablesAsDto') names.add(name);
      }
      proto = Object.getPrototypeOf(proto);
    }
    return [...names];
  })();

  it('discovers a representative set of generated search operations', () => {
    expect(generatedSearchMethods).toEqual(
      expect.arrayContaining(['searchProcessInstances', 'searchUserTasks', 'searchVariables'])
    );
    expect(generatedSearchMethods.length).toBeGreaterThan(20);
  });

  it('attaches .paginate to every generated search operation', () => {
    for (const name of generatedSearchMethods) {
      expect(typeof client[name]?.paginate, `${name}.paginate`).toBe('function');
    }
  });

  it('excludes the hand-written searchVariablesAsDto helper', () => {
    expect(client.searchVariablesAsDto?.paginate).toBeUndefined();
  });
});
