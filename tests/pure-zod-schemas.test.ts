import { describe, expect, it } from 'vitest';
import { wrapSchemaInitialisers } from '../hooks/post/720-pure-zod-schemas';

/**
 * Focused contract tests for the hook-720 source transformer.
 *
 * `wrapSchemaInitialisers` rewrites `src/gen/zod.gen.ts` so each schema is an
 * individually droppable `/*#__PURE__*\/ (() => …)()` IIFE. These tests pin the
 * transformer's stated contracts directly (independent of the generated output),
 * mirroring the hook-helper tests in `tests/inject-examples.test.ts`:
 *  - wraps `export const` call initialisers;
 *  - leaves identifier aliases untouched (no side effect to annotate);
 *  - is idempotent (an already-wrapped initialiser is not re-wrapped);
 *  - preserves the reviewed non-schema statements (imports, the zod-augment
 *    retention `void` expression);
 *  - fails fast on any unreviewed top-level statement shape.
 */
describe('wrapSchemaInitialisers', () => {
  it('wraps a call-expression initialiser in an annotated pure IIFE', () => {
    const src = 'export const zFoo = z.object({ a: z.string() }).register(r, { id: "Foo" });';
    expect(wrapSchemaInitialisers(src)).toBe(
      'export const zFoo = /*#__PURE__*/ (() => z.object({ a: z.string() }).register(r, { id: "Foo" }))();'
    );
  });

  it('wraps every schema when several are present', () => {
    const src = ['export const zA = z.string();', 'export const zB = z.number();'].join('\n');
    const out = wrapSchemaInitialisers(src);
    expect(out).toBe(
      [
        'export const zA = /*#__PURE__*/ (() => z.string())();',
        'export const zB = /*#__PURE__*/ (() => z.number())();',
      ].join('\n')
    );
  });

  it('leaves identifier aliases untouched (no side effect to annotate)', () => {
    const src = 'export const zAlias = zFoo;';
    expect(wrapSchemaInitialisers(src)).toBe(src);
  });

  it('is idempotent: an already-wrapped initialiser is not re-wrapped', () => {
    const src = 'export const zFoo = z.object({}).register(r, {});';
    const once = wrapSchemaInitialisers(src);
    const twice = wrapSchemaInitialisers(once);
    expect(twice).toBe(once);
  });

  it('preserves import declarations and the zod-augment retention statement', () => {
    const src = [
      'import { z } from "zod";',
      'void __zodAugmentApplied;',
      'export const zFoo = z.string();',
    ].join('\n');
    const out = wrapSchemaInitialisers(src);
    expect(out).toContain('import { z } from "zod";');
    expect(out).toContain('void __zodAugmentApplied;');
    expect(out).toContain('export const zFoo = /*#__PURE__*/ (() => z.string())();');
  });

  it('fails fast on an unreviewed top-level statement', () => {
    const src = 'sideEffect();';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed top-level statement/);
  });

  it('fails fast on a const initialiser that is neither a call nor an identifier', () => {
    const src = 'export const zFoo = { a: 1 };';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/initialiser kind/);
  });

  it('fails fast on a non-exported const call initialiser (unreviewed internal side effect)', () => {
    const src = 'const registry = initialize();';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed const declaration/);
  });

  it('fails fast on an exported const whose name is not a zod schema (not z*)', () => {
    const src = 'export const config = buildConfig();';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed const declaration/);
  });

  it('fails fast on a z* export whose call-chain root is not a reviewed Zod/schema root', () => {
    // Exported + `z*`-named, but the call is an arbitrary side-effecting factory, not a zod
    // (`z.*`) or reviewed-schema chain — must not be marked pure.
    const src = 'export const zBootstrap = registerGlobalState();';
    expect(() => wrapSchemaInitialisers(src)).toThrow(
      /unreviewed call-chain root registerGlobalState/
    );
  });

  it('fails fast on an unknown z* callee that is not a declared schema root', () => {
    const src = 'export const zFoo = zMystery().optional();';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed call-chain root zMystery/);
  });

  it('fails fast on a nested eager side-effecting call even when the outer root is reviewed', () => {
    // Outer chain is rooted at `z` (reviewed), but a nested argument eagerly calls an
    // unreviewed factory. Wrapping the initialiser in a pure IIFE would let a bundler drop
    // the whole schema — and with it the eager `registerGlobalState()` side effect. The
    // fail-closed guarantee must reject this.
    const src = 'export const zFoo = z.object({ value: registerGlobalState() });';
    expect(() => wrapSchemaInitialisers(src)).toThrow(
      /unreviewed call-chain root registerGlobalState/
    );
  });

  it('fails fast on a deeply nested eager side-effecting call', () => {
    const src = 'export const zFoo = z.object({ a: z.object({ b: evilFactory() }) });';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed call-chain root evilFactory/);
  });

  it('fails fast on an eager side-effecting default-value argument', () => {
    const src = 'export const zFoo = z.string().default(computeDefault());';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed call-chain root computeDefault/);
  });

  it('fails fast on an eager tagged-template invocation (tag is an unreviewed call)', () => {
    // A tagged template IS an eager invocation — `tag\`...\`` calls `tag` at module
    // evaluation — but it is not a CallExpression, so a visitor that only checks calls and
    // `new` would accept and wrap it as pure, letting a bundler drop the tag's
    // module-initialization side effect. The fail-closed traversal must reject it.
    const src = 'export const zFoo = z.object({ value: registerGlobalStateTag`x` });';
    expect(() => wrapSchemaInitialisers(src)).toThrow(
      /unreviewed call-chain root registerGlobalStateTag/
    );
  });

  it('fails fast on an eager side-effecting call inside a tagged-template substitution', () => {
    // Substitutions in a tagged template are eager too: even a reviewed tag must not hide an
    // unreviewed eager call in `${...}`.
    const src = 'export const zFoo = z.object({ value: z.tag`${evilFactory()}` });';
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed call-chain root evilFactory/);
  });

  it('allows unreviewed calls inside deferred callback bodies (lazy / refine / transform)', () => {
    // Calls inside arrow/function bodies run when the callback is invoked, not at module
    // evaluation, so they are not eager side effects and must not fail the fail-closed check.
    const src = [
      'export const zLazy = z.lazy(() => deferredFactory());',
      'export const zRefined = z.string().refine((v) => sideEffect(v));',
    ].join('\n');
    const out = wrapSchemaInitialisers(src);
    expect(out).toBe(
      [
        'export const zLazy = /*#__PURE__*/ (() => z.lazy(() => deferredFactory()))();',
        'export const zRefined = /*#__PURE__*/ (() => z.string().refine((v) => sideEffect(v)))();',
      ].join('\n')
    );
  });

  it('wraps a chain rooted at another declared z* schema (schema composition)', () => {
    const src = [
      'export const zParent = z.object({ a: z.string() });',
      'export const zChild = zParent.extend({ b: z.number() });',
    ].join('\n');
    const out = wrapSchemaInitialisers(src);
    expect(out).toBe(
      [
        'export const zParent = /*#__PURE__*/ (() => z.object({ a: z.string() }))();',
        'export const zChild = /*#__PURE__*/ (() => zParent.extend({ b: z.number() }))();',
      ].join('\n')
    );
  });
});
