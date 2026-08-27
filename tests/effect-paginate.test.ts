/*
 * Behaviour of the Effect client's `.paginate` helper: the Promise `Paginator`
 * (`pages()` / `items()` / `toArray()`) re-expressed as `Stream`s and an `Effect`.
 *
 * Offline — a fake `fetch` serves a cursor-paginated dataset, so these assert the
 * adapter's laziness, flattening, and scope-bound cancellation without a broker.
 */
import { Effect, Fiber, Stream } from 'effect';
import { describe, expect, it } from 'vitest';
import { createCamundaEffectClient } from '../src/effect';

type Page = { items: Array<{ processInstanceKey: string }>; page: Record<string, unknown> };

/**
 * A fake `fetch` serving `total` items in `pageSize` chunks via cursor pagination,
 * recording each request body and the abort signal it was handed.
 */
function pagedFetch(total: number, pageSize: number) {
  const bodies: Array<Record<string, any>> = [];
  const signals: AbortSignal[] = [];

  // The generated client calls `fetch(new Request(...))` — a single Request, no init.
  const fetch = async (input: Request): Promise<Response> => {
    const body = await input.clone().json();
    bodies.push(body);
    if (input.signal) signals.push(input.signal);

    const after = typeof body.page?.after === 'string' ? Number(body.page.after) : 0;
    const items = Array.from(
      { length: Math.max(0, Math.min(pageSize, total - after)) },
      (_, i) => ({
        processInstanceKey: String(after + i),
      })
    );
    const next = after + items.length;
    const payload: Page = {
      items,
      page: {
        totalItems: total,
        hasMoreTotalItems: false,
        startCursor: null,
        endCursor: next < total && items.length > 0 ? String(next) : null,
      },
    };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  return { fetch, bodies, signals };
}

function clientWith(fetch: unknown) {
  return createCamundaEffectClient({
    config: {
      CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
      CAMUNDA_AUTH_STRATEGY: 'NONE',
      CAMUNDA_SDK_VALIDATION_MODE: 'off',
    },
    fetch: fetch as typeof globalThis.fetch,
  } as never);
}

const searchBody = { filter: {}, page: { limit: 10 } };

describe('Effect client `.paginate`', () => {
  it('streams items flattened across every page', async () => {
    const { fetch, bodies } = pagedFetch(23, 10);
    const camunda = clientWith(fetch);

    const keys = await Effect.runPromise(
      Stream.runCollect(camunda.searchProcessInstances.paginate(searchBody).items())
    );

    expect(keys.map((k) => k.processInstanceKey)).toEqual(
      Array.from({ length: 23 }, (_, i) => String(i))
    );
    expect(bodies).toHaveLength(3); // 10 + 10 + 3
    // The filter is preserved on every page; only the cursor advances.
    expect(bodies[1]?.page).toMatchObject({ after: '10', limit: 10 });
  });

  it('streams whole pages', async () => {
    const { fetch } = pagedFetch(23, 10);
    const camunda = clientWith(fetch);

    const pages = await Effect.runPromise(
      Stream.runCollect(camunda.searchProcessInstances.paginate(searchBody).pages())
    );

    expect(pages.map((p) => p.items.length)).toEqual([10, 10, 3]);
  });

  it('drains every item with toArray', async () => {
    const { fetch } = pagedFetch(23, 10);
    const camunda = clientWith(fetch);

    const all = await Effect.runPromise(
      camunda.searchProcessInstances.paginate(searchBody).toArray()
    );

    expect(all).toHaveLength(23);
  });

  it('is lazy: a short take fetches only the pages it needs', async () => {
    const { fetch, bodies } = pagedFetch(100, 10);
    const camunda = clientWith(fetch);

    const first = await Effect.runPromise(
      Stream.runCollect(
        camunda.searchProcessInstances.paginate(searchBody).items().pipe(Stream.take(5))
      )
    );

    expect(first).toHaveLength(5);
    expect(bodies).toHaveLength(1); // never pulled the second page
  });

  it('cancels the in-flight page request when the fiber is interrupted', async () => {
    // Page 1 resolves; page 2 hangs forever. Interrupting the consuming fiber must
    // reach the hanging request's abort signal — the whole point of binding the
    // paginator to the stream's scope rather than letting it run detached.
    const { fetch: served } = pagedFetch(100, 10);
    let hanging: AbortSignal | undefined;
    let calls = 0;
    const fetch = async (input: Request): Promise<Response> => {
      calls += 1;
      if (calls === 1) return served(input);
      hanging = input.signal;
      return new Promise<Response>(() => {}); // never settles
    };

    const camunda = clientWith(fetch);
    const fiber = Effect.runFork(
      Stream.runCollect(
        camunda.searchProcessInstances.paginate(searchBody).items().pipe(Stream.take(15))
      )
    );

    // Let page 1 settle and page 2 go in flight before interrupting.
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(hanging?.aborted).toBe(false);

    await Effect.runPromise(Fiber.interrupt(fiber));

    expect(hanging?.aborted).toBe(true);
  });
});
