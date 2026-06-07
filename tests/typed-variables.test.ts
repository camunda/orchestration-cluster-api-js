import { describe, expect, it } from 'vitest';
import { ZodError, z } from 'zod';
import {
  type CancelableRequest,
  collectTypedVariables,
  createVariableSearchFetchPage,
  type TypedVariableItem,
  type TypedVariablePage,
  TypedVariablesError,
  VariableCollector,
  VariableDeserializationError,
  VariableMap,
  VariableScopeCollisionError,
  type VariableSearchPageResponse,
  variableNamesFromSchema,
} from '../src/runtime/typedVariables';

const OrderSchema = z.object({
  orderId: z.string(),
  amount: z.number().optional(),
});

function item(name: string, value: unknown, scopeKey = 'scope-1'): TypedVariableItem {
  return { name, value: JSON.stringify(value), scopeKey };
}

function page(items: TypedVariableItem[], endCursor: string | null = null): TypedVariablePage {
  return { items, endCursor };
}

describe('variableNamesFromSchema', () => {
  it('returns all declared keys including optional ones', () => {
    expect(variableNamesFromSchema(OrderSchema)).toEqual(['orderId', 'amount']);
  });

  it('returns an empty list for an empty schema', () => {
    expect(variableNamesFromSchema(z.object({}))).toEqual([]);
  });

  it('throws a clear TypedVariablesError when passed a non-schema value', () => {
    // Simulates a JS caller (or an `any` cast) passing something that is not a Zod object.
    // @ts-expect-error - intentionally invalid input
    expect(() => variableNamesFromSchema(null)).toThrow(TypedVariablesError);
    // @ts-expect-error - intentionally invalid input
    expect(() => variableNamesFromSchema({ notAShape: true })).toThrow(TypedVariablesError);
  });
});

describe('VariableMap lenient access', () => {
  const map = new VariableMap({ orderId: 'A-1', amount: 9.99 }, OrderSchema);

  it('reports presence via has()', () => {
    expect(map.has('orderId')).toBe(true);
    expect(map.has('missing')).toBe(false);
  });

  it('returns parsed values via get(), undefined when absent', () => {
    expect(map.get('amount')).toBe(9.99);
    expect(map.get('missing')).toBeUndefined();
  });

  it('exposes the raw record', () => {
    expect(map.raw).toEqual({ orderId: 'A-1', amount: 9.99 });
  });
});

describe('VariableMap.validate', () => {
  it('returns the fully-typed object when required variables are present', () => {
    const map = new VariableMap({ orderId: 'A-1', amount: 9.99 }, OrderSchema);
    expect(map.validate()).toEqual({ orderId: 'A-1', amount: 9.99 });
  });

  it('succeeds when only optional variables are absent', () => {
    const map = new VariableMap({ orderId: 'A-1' }, OrderSchema);
    expect(map.validate()).toEqual({ orderId: 'A-1' });
  });

  it('throws ZodError when a required variable is missing', () => {
    const map = new VariableMap({ amount: 9.99 }, OrderSchema);
    expect(() => map.validate()).toThrow(ZodError);
  });

  it('throws ZodError when a present value has the wrong type', () => {
    const map = new VariableMap({ orderId: 123 }, OrderSchema);
    expect(() => map.validate()).toThrow(ZodError);
  });
});

describe('VariableCollector', () => {
  it('keeps the first value seen per name across pages (first wins)', () => {
    const collector = new VariableCollector(['orderId']);
    collector.ingest([item('orderId', 'first')]);
    collector.ingest([item('orderId', 'second')]);
    expect(collector.build()).toEqual({ orderId: 'first' });
  });

  it('drops items for undeclared variables to stay memory-bounded', () => {
    const collector = new VariableCollector(['orderId']);
    collector.ingest([item('orderId', 'A-1'), item('unrelated', 'huge-blob')]);
    expect(collector.build()).toEqual({ orderId: 'A-1' });
  });

  it('throws VariableScopeCollisionError when a name appears at multiple scopes', () => {
    const collector = new VariableCollector(['orderId']);
    collector.ingest([item('orderId', 'A-1', 'scope-b'), item('orderId', 'A-2', 'scope-a')]);
    try {
      collector.build();
      throw new Error('expected a scope collision');
    } catch (error) {
      expect(error).toBeInstanceOf(VariableScopeCollisionError);
      expect((error as VariableScopeCollisionError).variableName).toBe('orderId');
      expect((error as VariableScopeCollisionError).scopeKeys).toEqual(['scope-a', 'scope-b']);
    }
  });

  it('throws VariableDeserializationError when a value is not valid JSON', () => {
    const collector = new VariableCollector(['orderId']);
    collector.ingest([{ name: 'orderId', value: 'not json', scopeKey: 'scope-1' }]);
    try {
      collector.build();
      throw new Error('expected a deserialization error');
    } catch (error) {
      expect(error).toBeInstanceOf(VariableDeserializationError);
      expect((error as VariableDeserializationError).variableName).toBe('orderId');
    }
  });
});

describe('collectTypedVariables paging', () => {
  it('pages until every declared variable is found, then stops early when scoped to one scope', async () => {
    const pages: TypedVariablePage[] = [
      page([item('orderId', 'A-1')], 'cursor-1'),
      page([item('amount', 9.99)], 'cursor-2'),
      page([item('shouldNotBeFetched', 'x')], 'cursor-3'),
    ];
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
      // Scoped to a single scope -> each name appears at most once -> early-stop is safe.
      singleScope: true,
      fetchPage: async () => {
        const next = pages[calls];
        calls += 1;
        return next;
      },
    });
    // Stops after page 2 because both names were found.
    expect(calls).toBe(2);
    expect(map.validate()).toEqual({ orderId: 'A-1', amount: 9.99 });
  });

  it('does not stop early when unscoped, surfacing a collision that only appears on a later page', async () => {
    const pages: TypedVariablePage[] = [
      // Page 1 already contains every declared name -> the old early-stop would terminate here.
      page([item('orderId', 'A-1', 'scope-a'), item('amount', 9.99, 'scope-a')], 'cursor-1'),
      // Page 2 reveals the same name at a second scope -> a collision the early-stop would miss.
      page([item('orderId', 'A-2', 'scope-b')], null),
    ];
    let calls = 0;
    await expect(
      collectTypedVariables({
        schema: OrderSchema,
        singleScope: false,
        fetchPage: async () => {
          const next = pages[calls];
          calls += 1;
          return next;
        },
      })
    ).rejects.toBeInstanceOf(VariableScopeCollisionError);
    // Proves paging continued past page 1 despite all names being found on it.
    expect(calls).toBe(2);
  });

  it('stops when the server reports no next cursor', async () => {
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
      singleScope: false,
      fetchPage: async () => {
        calls += 1;
        return page([item('orderId', 'A-1')], null);
      },
    });
    expect(calls).toBe(1);
    expect(map.has('orderId')).toBe(true);
    expect(map.has('amount')).toBe(false);
  });

  it('stops when a page comes back empty', async () => {
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
      singleScope: false,
      fetchPage: async () => {
        calls += 1;
        return page([], 'cursor-loops');
      },
    });
    expect(calls).toBe(1);
    expect(map.raw).toEqual({});
  });

  it('stops when a cursor repeats (defensive guard)', async () => {
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
      singleScope: false,
      fetchPage: async () => {
        calls += 1;
        return page([item('orderId', 'A-1')], 'stuck');
      },
    });
    // First page returns 'stuck'; second page returns 'stuck' again -> terminate.
    expect(calls).toBe(2);
    expect(map.has('orderId')).toBe(true);
  });

  it('returns an empty map without fetching for an empty schema', async () => {
    let calls = 0;
    const map = await collectTypedVariables({
      schema: z.object({}),
      singleScope: false,
      fetchPage: async () => {
        calls += 1;
        return page([]);
      },
    });
    expect(calls).toBe(0);
    expect(map.raw).toEqual({});
  });
});

describe('createVariableSearchFetchPage', () => {
  type Filter = { name: { $in: string[] }; processInstanceKey?: string };

  /** A resolved cancelable request whose cancel() records invocation. */
  function request(response: VariableSearchPageResponse): {
    req: CancelableRequest<VariableSearchPageResponse>;
    cancelled: () => boolean;
  } {
    let cancelled = false;
    const req: CancelableRequest<VariableSearchPageResponse> = Object.assign(
      Promise.resolve(response),
      {
        cancel: () => {
          cancelled = true;
        },
      }
    );
    return { req, cancelled: () => cancelled };
  }

  it('builds the request input with the name filter, page cursor, and truncateValues=false', async () => {
    const inputs: unknown[] = [];
    const filter: Filter = { name: { $in: ['orderId', 'amount'] }, processInstanceKey: 'pi-1' };
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter,
      limit: 25,
      signal: new AbortController().signal,
      search: (input) => {
        inputs.push(input);
        return request({
          items: [{ name: 'orderId', value: '"A-1"', scopeKey: 'scope-1' }],
          page: { endCursor: 'c1' },
        }).req;
      },
    });

    const first = await fetchPage(undefined);
    expect(inputs[0]).toEqual({ filter, page: { limit: 25 }, truncateValues: false });
    expect(first).toEqual({
      items: [{ name: 'orderId', value: '"A-1"', scopeKey: 'scope-1' }],
      endCursor: 'c1',
    });

    await fetchPage('c1');
    expect(inputs[1]).toEqual({ filter, page: { after: 'c1', limit: 25 }, truncateValues: false });
  });

  it('forwards an empty-string cursor as page.after (cursors are opaque)', async () => {
    const inputs: unknown[] = [];
    const filter: Filter = { name: { $in: ['a'] } };
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter,
      limit: 10,
      signal: new AbortController().signal,
      search: (input) => {
        inputs.push(input);
        return request({ items: [], page: { endCursor: null } }).req;
      },
    });

    await fetchPage('');
    expect(inputs[0]).toEqual({ filter, page: { after: '', limit: 10 }, truncateValues: false });
  });

  it('stringifies non-string scopeKey values in mapped items', async () => {
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter: { name: { $in: ['a'] } },
      limit: 10,
      signal: new AbortController().signal,
      search: () =>
        request({ items: [{ name: 'a', value: '1', scopeKey: 12345 }], page: { endCursor: null } })
          .req,
    });
    const result = await fetchPage(undefined);
    expect(result.items[0]?.scopeKey).toBe('12345');
  });

  it('forwards outer cancellation to the in-flight page request', async () => {
    const controller = new AbortController();
    let cancelled = false;
    let resolvePending: (v: VariableSearchPageResponse) => void = () => {};
    const pending: CancelableRequest<VariableSearchPageResponse> = Object.assign(
      new Promise<VariableSearchPageResponse>((resolve) => {
        resolvePending = resolve;
      }),
      {
        cancel: () => {
          cancelled = true;
          resolvePending({ items: [], page: { endCursor: null } });
        },
      }
    );
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter: { name: { $in: ['a'] } },
      limit: 10,
      signal: controller.signal,
      search: () => pending,
    });

    const inFlight = fetchPage(undefined);
    controller.abort();
    await inFlight;
    expect(cancelled).toBe(true);
  });

  it('cancels the in-flight request when the signal aborts before the listener is registered', async () => {
    // Reproduce the race: throwIfAborted() does not throw, but the signal is already aborted by
    // the time the abort listener would be attached (addEventListener never fires its callback).
    // The explicit `signal.aborted` guard must still cancel the in-flight request.
    const fakeSignal = {
      aborted: true,
      throwIfAborted() {
        // no-op: simulates the window where abort happened *after* this check
      },
      addEventListener() {
        // no-op: the abort event already fired, so the listener is never invoked
      },
      removeEventListener() {},
    } as unknown as AbortSignal;

    let cancelled = false;
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter: { name: { $in: ['a'] } },
      limit: 10,
      signal: fakeSignal,
      search: () => {
        const req: CancelableRequest<VariableSearchPageResponse> = Object.assign(
          Promise.resolve<VariableSearchPageResponse>({ items: [], page: { endCursor: null } }),
          {
            cancel: () => {
              cancelled = true;
            },
          }
        );
        return req;
      },
    });

    await fetchPage(undefined);
    expect(cancelled).toBe(true);
  });

  it('aborts before issuing a request when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    let called = false;
    const fetchPage = createVariableSearchFetchPage<Filter>({
      filter: { name: { $in: ['a'] } },
      limit: 10,
      signal: controller.signal,
      search: () => {
        called = true;
        return request({ items: [], page: { endCursor: null } }).req;
      },
    });
    await expect(fetchPage(undefined)).rejects.toThrow();
    expect(called).toBe(false);
  });
});
