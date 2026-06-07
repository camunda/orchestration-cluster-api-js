import { describe, expect, it } from 'vitest';
import { ZodError, z } from 'zod';
import {
  collectTypedVariables,
  type TypedVariableItem,
  type TypedVariablePage,
  VariableCollector,
  VariableDeserializationError,
  VariableMap,
  VariableScopeCollisionError,
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
      expect.unreachable('expected a scope collision');
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
      expect.unreachable('expected a deserialization error');
    } catch (error) {
      expect(error).toBeInstanceOf(VariableDeserializationError);
      expect((error as VariableDeserializationError).variableName).toBe('orderId');
    }
  });
});

describe('collectTypedVariables paging', () => {
  it('pages until every declared variable is found, then stops early', async () => {
    const pages: TypedVariablePage[] = [
      page([item('orderId', 'A-1')], 'cursor-1'),
      page([item('amount', 9.99)], 'cursor-2'),
      page([item('shouldNotBeFetched', 'x')], 'cursor-3'),
    ];
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
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

  it('stops when the server reports no next cursor', async () => {
    let calls = 0;
    const map = await collectTypedVariables({
      schema: OrderSchema,
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
      fetchPage: async () => {
        calls += 1;
        return page([]);
      },
    });
    expect(calls).toBe(0);
    expect(map.raw).toEqual({});
  });
});
