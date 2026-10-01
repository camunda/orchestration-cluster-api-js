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
});
