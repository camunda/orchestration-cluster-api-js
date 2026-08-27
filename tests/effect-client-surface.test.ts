import { describe, expect, it } from 'vitest';
import { createCamundaEffectClient } from '../src/effect';
import { createCamundaClient } from '../src/gen/CamundaClient';

// Guards the *surface-loss* defect class: `createCamundaEffectClient` rebuilds every
// client method as a fresh Effect-returning arrow. A fresh function carries none of
// the own properties the runtime attaches to the original method — so any helper
// installed *onto a method* (today `.paginate`, installed on all ~40 `search*`
// operations by `installSearchPagination`) silently vanishes from the Effect client.
//
// These tests are deliberately scoped to the whole surface rather than to
// `searchProcessInstances`: a new method-attached helper must not be able to go
// missing on the Effect client without a test failing and forcing a deliberate
// decision about how to adapt it.

// Own function properties a plain function always has — not part of the API surface.
const INTRINSIC_FUNCTION_PROPS = new Set(['length', 'name', 'prototype', 'constructor']);

function methodHelperNames(fn: unknown): string[] {
  if (typeof fn !== 'function') return [];
  return Object.getOwnPropertyNames(fn)
    .filter((p) => !INTRINSIC_FUNCTION_PROPS.has(p))
    .filter((p) => typeof (fn as unknown as Record<string, unknown>)[p] === 'function')
    .sort();
}

// Every method name reachable on the Promise client (own props — where
// `installSearchPagination` writes — plus the whole prototype chain).
function methodNames(client: object): string[] {
  const names = new Set<string>();
  let node: object | null = client;
  while (node && node !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(node)) {
      if (INTRINSIC_FUNCTION_PROPS.has(name)) continue;
      if (typeof (client as Record<string, unknown>)[name] === 'function') names.add(name);
    }
    node = Object.getPrototypeOf(node) as object | null;
  }
  return [...names].sort();
}

describe('Effect client preserves the Promise client method surface', () => {
  const promiseClient = createCamundaClient();
  const effectClient = createCamundaEffectClient() as unknown as Record<string, unknown>;

  it('installs `.paginate` on every search operation that has one', () => {
    const paginated = methodNames(promiseClient).filter(
      (name) =>
        typeof (promiseClient as unknown as Record<string, Record<string, unknown>>)[name]
          ?.paginate === 'function'
    );

    // Sanity: the Promise client really does carry a broad `.paginate` surface, so a
    // regression in `installSearchPagination` cannot make this test vacuously pass.
    expect(paginated.length).toBeGreaterThan(10);

    const missing = paginated.filter(
      (name) => typeof (effectClient[name] as Record<string, unknown>)?.paginate !== 'function'
    );
    expect(missing).toEqual([]);
  });

  it('loses no method-attached helper anywhere on the surface', () => {
    const lost: Array<{ method: string; helpers: string[] }> = [];

    for (const name of methodNames(promiseClient)) {
      const expected = methodHelperNames(
        (promiseClient as unknown as Record<string, unknown>)[name]
      );
      if (expected.length === 0) continue;
      const actual = new Set(methodHelperNames(effectClient[name]));
      const helpers = expected.filter((h) => !actual.has(h));
      if (helpers.length > 0) lost.push({ method: name, helpers });
    }

    expect(lost).toEqual([]);
  });
});
