import { describe, expect, it } from 'vitest';
import { wrapSchemaInitialisers } from '../hooks/post/720-pure-zod-schemas';

/**
 * Hook 720 marks generated zod schema initialisers as `/*#__PURE__*\/` so bundlers can
 * drop unreferenced schemas. It must FAIL CLOSED: only a call chain rooted at the `z`
 * namespace or a schema declared in the module is a reviewed pure construction. Any other
 * top-level call could carry a required side effect, so it must be reported as unreviewed
 * rather than blindly wrapped — otherwise a future generator change could silently make a
 * side-effecting statement droppable.
 */

const WRAP = '/*#__PURE__*/ (() => ';

describe('wrapSchemaInitialisers', () => {
  it('wraps schema calls rooted at the z namespace or a schema reference', () => {
    const src = [
      "import * as z from 'zod';",
      'export const zFoo = z.object({ a: z.string() });',
      'export const zBar = z.enum(["x", "y"]);',
      'export const zBaz = zFoo.extend({ b: z.number() }).register(z.globalRegistry, {});',
    ].join('\n');
    const out = wrapSchemaInitialisers(src);
    // Every schema initialiser is wrapped (three schemas, plus none spuriously).
    expect(out.match(/\/\*#__PURE__\*\/ \(\(\) => /g)?.length).toBe(3);
    expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    expect(out).toContain(`export const zBaz = ${WRAP}zFoo.extend(`);
  });

  it('leaves identifier aliases and already-wrapped initialisers untouched (idempotent)', () => {
    const src = [
      "import * as z from 'zod';",
      'export const zFoo = z.object({});',
      'export const zAlias = zFoo;',
    ].join('\n');
    const once = wrapSchemaInitialisers(src);
    const twice = wrapSchemaInitialisers(once);
    expect(twice).toBe(once);
    // Alias is not wrapped (no side effect).
    expect(once).toContain('export const zAlias = zFoo;');
  });

  it('fails closed on a call initialiser not rooted at the zod namespace or a schema', () => {
    const src = [
      "import * as z from 'zod';",
      'export const zFoo = z.object({});',
      'export const zEvil = sideEffect();',
    ].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
  });

  it('fails closed on a call rooted at a module-level const that is NOT a proven schema', () => {
    // Regression: `declaredNames` used to hold every module-level const, so a call chain
    // rooted at a non-schema const (an alias of an imported side effect) was wrongly
    // accepted and marked pure — silently dropping a required side effect. Only a root
    // already proven to be a zod schema construction may qualify.
    const src = [
      "import * as z from 'zod';",
      'import { importedSideEffect } from "./side-effect";',
      'const helper = importedSideEffect;',
      'export const zFoo = helper();',
    ].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
  });

  it('fails closed on a call rooted at a non-schema const even when it is exported', () => {
    const src = [
      "import * as z from 'zod';",
      "import { sideEffect } from './side-effect';",
      'export const helper = sideEffect;',
      'export const zFoo = helper();',
    ].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
  });

  it('still wraps a chain rooted at an alias of a proven schema', () => {
    const src = [
      "import * as z from 'zod';",
      'export const zFoo = z.object({});',
      'const helper = zFoo;',
      'export const zBar = helper.extend({ b: z.number() });',
    ].join('\n');
    const out = wrapSchemaInitialisers(src);
    expect(out).toContain(`export const zBar = ${WRAP}helper.extend(`);
  });

  it('fails closed on a chain rooted at another call (not an identifier)', () => {
    const src = ["import * as z from 'zod';", 'export const zEvil = makeThing()("x");'].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
  });

  it('fails closed on a non-call, non-identifier initialiser', () => {
    const src = ["import * as z from 'zod';", 'export const zEvil = 1 + 2;'].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
  });

  it('fails closed on an unreviewed top-level statement', () => {
    const src = ["import * as z from 'zod';", 'console.log("side effect");'].join('\n');
    expect(() => wrapSchemaInitialisers(src)).toThrow(/unreviewed top-level statement/);
  });
});
