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

  // Regression (Copilot round 8): the fail-closed check validated each eager call's ROOT
  // but not the EXPORTEDNESS of the declaration it initialises, so any const call rooted
  // at `z` was eligible for a pure wrapper — including a namespace service/mutator chain
  // such as `const registration = z.globalRegistry.add(zFoo, metadata)`. Wrapped
  // `/*#__PURE__*/`, a bundler may drop that statement while `zFoo` stays referenced,
  // losing the required registry mutation. Only an EXPORTED schema declaration may be
  // wrapped; a non-exported const call initialiser is unreviewed and fails closed.
  describe('declaration guard (fail the whole class)', () => {
    it('fails closed on a non-exported const rooted at a zod namespace mutator chain', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'const registration = z.globalRegistry.add(zFoo, { id: "foo" });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
    });

    it('fails closed on a non-exported const rooted at an ordinary zod constructor call', () => {
      // Not only mutator chains: ANY non-exported const call initialiser is unreviewed,
      // even one rooted at a pure constructor — the hook only reviews exported schemas.
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'const helper = z.object({ b: z.number() });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/helper/);
    });

    it('still wraps every exported schema declaration in the same module', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'export const zBar = zFoo.extend({ b: z.number() }).register(z.globalRegistry, {});',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out.match(/\/\*#__PURE__\*\/ \(\(\) => /g)?.length).toBe(2);
    });
  });

  // Regression (Copilot round 10): the exportedness guard alone does not prove a schema
  // construction. An EXPORTED const rooted at a namespace service/mutator object — e.g.
  // `export const registration = z.globalRegistry.add(zFoo, metadata)` — is exported AND
  // `z`-rooted, so it passed both guards and was wrapped `/*#__PURE__*/`, letting a bundler
  // drop the registry mutation while the referenced `zFoo` stays. A reviewed schema
  // construction is rooted at a schema CONSTRUCTOR (`z.object`, `z.string`, …) or a proven
  // schema (`zFoo.extend`); a chain rooted at a namespace service object (`z.globalRegistry`,
  // `z.registry`, …) is a mutation/service call and must fail closed even when exported.
  describe('namespace service/mutator guard (fail the whole class)', () => {
    it('fails closed on an EXPORTED const rooted at z.globalRegistry.add', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'export const registration = z.globalRegistry.add(zFoo, { id: "foo" });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
    });

    it('fails closed on an EXPORTED const rooted at another namespace service object', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'export const reg = z.registry().add(zFoo, { id: "foo" });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/reg/);
    });

    it('still wraps an exported schema whose chain PASSES THROUGH a registry method', () => {
      // `.register(z.globalRegistry, …)` is rooted at the schema constructor `z.object`,
      // not at the registry object — the registry is only an argument. It must stay wrapped.
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() }).register(z.globalRegistry, { id: "foo" });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    // Regression (adversarial round 10): `namespaceServiceRoot`'s walk only peeled
    // CallExpression/PropertyAccessExpression/paren/non-null, while its sibling
    // `callChainRoot` (used by `findUnreviewedEagerCall`) also peels
    // ElementAccessExpression. So the bracket-notation form of the very mutation this
    // guard rejects — `z['globalRegistry'].add(zFoo, meta)` / `z['registry']().add(...)` —
    // resolved to a `z` root yet returned null from the guard and was wrapped
    // `/*#__PURE__*/`, letting a bundler drop the registry mutation while `zFoo` stays.
    // Element access with a string-literal argument names the same property as dot access
    // and must be treated identically.
    describe('bracket-notation (element access) forms of the same mutations', () => {
      it("fails closed on an EXPORTED const rooted at z['globalRegistry'].add", () => {
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'export const registration = z[\'globalRegistry\'].add(zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it("fails closed on an EXPORTED const rooted at z['registry']().add", () => {
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'export const reg = z[\'registry\']({}).add(zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/reg/);
      });

      it("still wraps a schema CONSTRUCTION reached by bracket access (z['object'])", () => {
        // The element-access peel must not fail open the guard's complement either:
        // `z['object'](…)` is a schema construction rooted at a constructor, not a
        // service/mutator object, so it stays wrapped — same as the dot form.
        const src = [
          "import * as z from 'zod';",
          "export const zFoo = z['object']({ a: z.string() });",
        ].join('\n');
        const out = wrapSchemaInitialisers(src);
        expect(out).toContain(`export const zFoo = ${WRAP}z['object'](`);
      });

      it('fails closed on a non-exported const rooted at a bracket-notation mutator chain', () => {
        // Same class through the exportedness guard: a non-exported bracket-notation
        // mutation is unreviewed before namespaceServiceRoot is even consulted.
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'const registration = z[\'globalRegistry\'].add(zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      // Same defect class, found on self-review: the `z` base test must peel transparent
      // wrappers (parens/non-null) and recognise every statically-known element-access
      // spelling, or a variant of the same mutation slips past the guard.
      it('fails closed when the z base is parenthesised — (z).globalRegistry.add', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'export const registration = (z).globalRegistry.add(zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it('fails closed on a no-substitution template element access — z[`globalRegistry`].add', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'export const registration = z[`globalRegistry`].add(zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it('fails closed on a mixed dot/bracket chain — z["globalRegistry"]["add"](...)', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ a: z.string() });',
          'export const registration = z["globalRegistry"]["add"](zFoo, { id: "foo" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });
    });
  });
});
