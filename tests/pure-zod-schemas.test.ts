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

  // Regression (Copilot round 6): the fail-closed check validated only the OUTER chain
  // root, so a nested eager call such as `z.object({ v: registerGlobalState() })` passed
  // (outer root is `z`) and was wrapped `/*#__PURE__*/` — letting a bundler drop the
  // schema and, with it, the eager side effect. Every eagerly-evaluated call must be
  // rooted at `z` or a proven schema; calls inside deferred callback bodies are exempt.
  describe('nested eager side effects (fail the whole class)', () => {
    it('fails closed on a nested eager call argument rooted at a non-schema', () => {
      const src = [
        "import * as z from 'zod';",
        "import { registerGlobalState } from './side-effect';",
        'export const zFoo = z.object({ value: registerGlobalState() });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a deeply nested eager call argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffect } from './side-effect';",
        'export const zFoo = z.object({ a: z.object({ b: z.string().default(sideEffect()) }) });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a nested eager `new` expression rooted at a non-schema', () => {
      const src = [
        "import * as z from 'zod';",
        "import { Thing } from './side-effect';",
        'export const zFoo = z.object({ v: z.instanceof(new Thing()) });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a nested eager tagged-template rooted at a non-schema', () => {
      const src = [
        "import * as z from 'zod';",
        "import { tag } from './side-effect';",
        'export const zFoo = z.object({ v: z.string().default(tag`x`) });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('still wraps calls inside deferred callback bodies (not eager side effects)', () => {
      const src = [
        "import * as z from 'zod';",
        "import { later } from './side-effect';",
        // `later()` runs when the lazy/refine callback is invoked, not at module load.
        'export const zFoo = z.lazy(() => later()).refine((v) => later());',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.lazy(`);
    });

    it('still wraps nested eager calls rooted at the zod namespace', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string(), b: z.array(z.number()) });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });
  });

  // Regression (Copilot round 7): the idempotency branch trusted the `/*#__PURE__*/ (() => …)()`
  // SHAPE alone and added the name to `schemaNames` without inspecting the wrapped body — so
  // `export const zEvil = /*#__PURE__*/ (() => sideEffect())();` was accepted as a proven
  // schema, and a later schema rooted at `zEvil` was wrapped too. The wrapper only asserts
  // the OUTER expression is pure; the wrapped body must pass the same eager-call traversal.
  describe('pure-IIFE body validation (fail the whole class)', () => {
    it('fails closed on a pure-IIFE whose body is an unreviewed eager call', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffect } from './side-effect';",
        'export const zEvil = /*#__PURE__*/ (() => sideEffect())();',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('fails closed on a pure-IIFE whose body nests an unreviewed eager call', () => {
      const src = [
        "import * as z from 'zod';",
        "import { registerGlobalState } from './side-effect';",
        'export const zEvil = /*#__PURE__*/ (() => z.object({ v: registerGlobalState() }))();',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('does not let a malicious pure-IIFE become a proven schema root for a later schema', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffect } from './side-effect';",
        'export const zEvil = /*#__PURE__*/ (() => sideEffect())();',
        'export const zFoo = zEvil.extend({ b: z.number() });',
      ].join('\n');
      // zEvil must be reported (not recorded as a proven schema), so the chain rooted at
      // it is not silently accepted either.
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('still accepts a legitimate pure-IIFE wrapping a zod-rooted chain (idempotent)', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = /*#__PURE__*/ (() => z.object({ a: z.string() }))();',
        'export const zBar = /*#__PURE__*/ (() => zFoo.extend({ b: z.number() }))();',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      // Both already wrapped; left byte-identical (no double-wrap).
      expect(out).toBe(src);
    });
  });
});
