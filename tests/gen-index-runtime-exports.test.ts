/*
 * Guards the runtime reachability of the branded-key helper namespaces from `src/gen`.
 *
 * `types.gen.ts` declares ~40 `export namespace` blocks (ProcessInstanceKey,
 * ProcessDefinitionKey, TenantId, …) that carry *values* — `assumeExists`, and the
 * other key constructors. `hooks/post/100-fix-gen-index.ts` exists specifically to keep
 * those reachable from `src/gen`.
 *
 * The failure this pins: the generator also emits an explicit
 * `export type { …, ProcessInstanceKey, … } from './types.gen'` list, and an explicit
 * named export *shadows* a wildcard `export *` for the same name. So appending
 * `export * from './types.gen'` — what the hook did — silently did not restore the
 * value side, and `CamundaKeys.ProcessInstanceKey.assumeExists(...)` was a type error
 * even though the hook reported success.
 *
 * Scoped to every namespace rather than to the two keys that happened to be used by a
 * test, so the same shadowing cannot reappear for a different key.
 *
 * Note the two halves guard different things, and only together cover the bug:
 * shadowing is invisible at runtime (the wildcard still re-exports the object), so the
 * runtime assertions below catch a namespace disappearing entirely, while the
 * type-level assertion catches the value side being stripped. The latter only bites
 * because `tests` is in `tsconfig.typecheck.json`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as CamundaGen from '../src/gen';

const TYPES_GEN = path.resolve(process.cwd(), 'src', 'gen', 'types.gen.ts');

// --- Type-level guard -----------------------------------------------------------
// Compile-time counterpart to the runtime assertions: the namespaces must reach
// consumers with their *value* side intact. When the explicit `export type { … }` list
// shadows the wildcard, `assumeExists` is not visible on the module type and
// `KeyNamespaces` collapses to `never` — making these annotations fail to compile.
type GenModule = typeof CamundaGen;
type KeyNamespaces = {
  [K in keyof GenModule]: GenModule[K] extends { assumeExists: (v: string) => unknown } ? K : never;
}[keyof GenModule];

type Assert<T extends true> = T;
type _ProcessInstanceKeyIsAValue = Assert<
  'ProcessInstanceKey' extends KeyNamespaces ? true : false
>;
type _ProcessDefinitionKeyIsAValue = Assert<
  'ProcessDefinitionKey' extends KeyNamespaces ? true : false
>;
type _TenantIdIsAValue = Assert<'TenantId' extends KeyNamespaces ? true : false>;

/** Every `export namespace X` declared in types.gen.ts — i.e. every value-carrying key helper. */
function declaredValueNamespaces(): string[] {
  const source = fs.readFileSync(TYPES_GEN, 'utf8');
  return [...source.matchAll(/^export namespace (\w+) \{/gm)].map((m) => m[1]).sort();
}

describe('src/gen re-exports the branded-key helper namespaces as values', () => {
  const namespaces = declaredValueNamespaces();

  it('finds the key helper namespaces in types.gen.ts', () => {
    // Sanity: if the generator stopped emitting namespaces entirely, the reachability
    // assertion below would pass vacuously.
    expect(namespaces.length).toBeGreaterThan(10);
    expect(namespaces).toContain('ProcessInstanceKey');
    expect(namespaces).toContain('ProcessDefinitionKey');
  });

  it('exposes every one of them as a runtime value, not just a type', () => {
    const bag = CamundaGen as unknown as Record<string, unknown>;
    const missing = namespaces.filter((name) => bag[name] === undefined);
    expect(missing).toEqual([]);
  });

  it('exposes the key constructors those namespaces carry', () => {
    // The concrete capability the hook exists to preserve.
    expect(typeof CamundaGen.ProcessInstanceKey.assumeExists).toBe('function');
    expect(CamundaGen.ProcessInstanceKey.assumeExists('12345')).toBe('12345');
  });
});
