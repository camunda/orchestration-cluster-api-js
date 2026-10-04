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

    // Regression (Copilot round 14): a chain rooted at a PROVEN SCHEMA whose FIRST member is
    // a registry MUTATOR re-registers an existing schema rather than producing a fresh one.
    // `export const zAlias = zBase.register(z.globalRegistry, meta)` passed the root check
    // (rooted at the proven schema `zBase`) and was wrapped `/*#__PURE__*/`; if `zAlias` is
    // tree-shaken while `zBase` stays referenced, the required registry mutation disappears.
    // Distinguish schema-PRODUCING combinators from mutators on an existing schema: a chain
    // rooted at a proven schema whose first operation is a mutator (`register`, …) fails
    // closed. A chain that DERIVES a fresh schema first (`zBase.extend({…}).register(…)`)
    // stays wrapped — its registry entry is consumed via the exported const.
    describe('schema-mutator-first chains (fail the whole class)', () => {
      it('fails closed on a proven-schema-rooted .register (re-registration)', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zAlias = zBase.register(z.globalRegistry, { id: "base" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zAlias/);
      });

      it('fails closed on a proven-schema-rooted bracket-notation .register', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zAlias = zBase["register"](z.globalRegistry, { id: "base" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zAlias/);
      });

      it('still wraps a chain that DERIVES a fresh schema before .register', () => {
        // `.extend({…})` produces a fresh schema; the trailing `.register(…)` registers THAT
        // new schema and is consumed via the exported const — it must stay wrapped.
        const src = [
          "import * as z from 'zod';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zDerived = zBase.extend({ b: z.number() }).register(z.globalRegistry, { id: "d" });',
        ].join('\n');
        const out = wrapSchemaInitialisers(src);
        expect(out).toContain(`export const zDerived = ${WRAP}zBase.extend(`);
      });
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

    // Regression (Copilot round 11): the service/mutator classification ran ONLY on the
    // OUTER initialiser chain (`namespaceServiceRoot(init)`), while the nested eager-call
    // traversal (`findUnreviewedEagerCall`) accepted any call merely because its chain
    // root is `z`. So a nested namespace mutation — e.g. `z.any().default(z.globalRegistry
    // .add(zBar, meta))` — is rooted at `z` for the outer chain AND for the nested call,
    // slipped both checks, and was wrapped `/*#__PURE__*/`, letting a bundler drop the
    // eager registry mutation together with the schema. Every eagerly-evaluated call must
    // be classified, not only the outer one: a nested `z.<service>` mutation fails closed.
    describe('nested namespace service/mutator mutations (fail the whole class)', () => {
      it('fails closed on a nested z.globalRegistry.add in an eager argument', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBar = z.object({ a: z.string() });',
          'export const zFoo = z.any().default(z.globalRegistry.add(zBar, { id: "foo" }));',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed on a nested z.registry().add in an eager argument', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBar = z.object({ a: z.string() });',
          'export const zFoo = z.object({ v: z.registry().add(zBar, { id: "foo" }) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed on a deeply nested bracket-notation service mutation', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBar = z.object({ a: z.string() });',
          "export const zFoo = z.object({ a: z.object({ b: z.any().default(z['globalRegistry'].add(zBar, {})) }) });",
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed when a wrapped (idempotent) body hides a nested service mutation', () => {
        // The idempotency branch re-validates the wrapped body with the same traversal,
        // so a `/*#__PURE__*/ (() => …)()` wrapper hiding a nested mutation also fails.
        const src = [
          "import * as z from 'zod';",
          'export const zBar = z.object({ a: z.string() });',
          `export const zFoo = ${WRAP}z.any().default(z.globalRegistry.add(zBar, {})))();`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('still wraps a schema whose nested chain PASSES a registry as an argument', () => {
        // `.register(z.globalRegistry, …)` nested inside an eager argument is rooted at the
        // schema constructor `z.string`, not the registry object — it stays wrapped.
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ v: z.string().register(z.globalRegistry, { id: "x" }) });',
        ].join('\n');
        const out = wrapSchemaInitialisers(src);
        expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
      });
    });

    // Regression (Copilot round 12): the namespace classifier was a BLACKLIST of two known
    // service objects (`globalRegistry`, `registry`), so it FAILED OPEN on every other
    // direct `z` member. Zod 4's `z.config(...)` mutates global configuration,
    // `z.setErrorMap(...)` mutates the global error map, and a computed root such as
    // `z[key](...)` is not even statically known — yet each resolved to a `z` root and was
    // wrapped `/*#__PURE__*/`, letting a bundler drop the global mutation. The classifier is
    // now an ALLOWLIST of reviewed schema constructors: any direct `z` member not on the
    // allowlist — a known mutator, an unknown/future member, or a computed `z[key]` — fails
    // closed. These assert the whole class, not just the cited `z.config` instance.
    describe('allowlist for z namespace members (fail the whole non-constructor class)', () => {
      it('fails closed on an EXPORTED const rooted at z.config (global mutation)', () => {
        const src = [
          "import * as z from 'zod';",
          'export const registration = z.config({ customError: () => "x" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it('fails closed on an EXPORTED const rooted at z.setErrorMap (global mutation)', () => {
        const src = [
          "import * as z from 'zod';",
          'export const applied = z.setErrorMap(() => ({ message: "x" }));',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/applied/);
      });

      it('fails closed on a COMPUTED root member — z[key](...)', () => {
        // `z[key]` is not statically known, so it cannot be proven a schema constructor and
        // must fail closed rather than be wrapped as droppable.
        const src = [
          "import * as z from 'zod';",
          'const key = "object";',
          'export const zFoo = z[key]({ a: 1 });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed on a bracket-notation non-constructor member — z["config"](...)', () => {
        const src = [
          "import * as z from 'zod';",
          'export const registration = z["config"]({ customError: () => "x" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it('fails closed on a NESTED non-constructor member in an eager argument', () => {
        // `z.config(...)` nested as an eager argument is rooted at `z` for the nested call
        // too, so the per-eager-call allowlist classification must reject it — not only the
        // outer initialiser chain.
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ v: z.any().default(z.config({ customError: () => "x" })) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed when a wrapped (idempotent) body is rooted at a non-constructor member', () => {
        // The idempotency branch re-validates the wrapped body with the same allowlist, so a
        // `/*#__PURE__*/ (() => …)()` wrapper hiding a global mutation also fails closed.
        const src = [
          "import * as z from 'zod';",
          `export const registration = ${WRAP}z.config({ customError: () => "x" }))();`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/registration/);
      });

      it('still wraps allowlisted sub-namespace constructors — z.coerce and z.iso', () => {
        // `z.coerce.number()` / `z.iso.date()` are rooted at the `z` identifier whose first
        // member is the allowlisted sub-namespace `coerce`/`iso`; they stay wrapped.
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ n: z.coerce.number(), d: z.iso.date() });',
        ].join('\n');
        const out = wrapSchemaInitialisers(src);
        expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
      });

      it('fails closed on a tagged template rooted at a non-constructor member — z.config`x`', () => {
        // A tagged template invokes its tag eagerly; a `z.<non-constructor>` tag is a global
        // mutation just like the call form and must fail closed.
        const src = [
          "import * as z from 'zod';",
          'export const zFoo = z.object({ v: z.string().default(z.config`x`) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });
    });
  });

  // Regression (Copilot round 13): the idempotency branch validated that a wrapped body had
  // no UNREVIEWED eager call, then recorded the declaration as a proven schema — but a body
  // with NO call at all (`/*#__PURE__*/ (() => importedSideEffect)()`) has nothing to flag,
  // so it passed and entered `schemaNames`. A later `export const zFoo = zEvil()` was then
  // wrongly accepted as pure even though it invokes an arbitrary imported function. Only a
  // wrapped body that IS a schema-construction call (rooted at `z` or a proven schema) may
  // be recorded as a proven schema; anything else fails closed.
  describe('pure-IIFE body must be a schema construction (fail the whole class)', () => {
    it('fails closed on a pure-IIFE whose body is a bare identifier (no call)', () => {
      const src = [
        "import * as z from 'zod';",
        "import { importedSideEffect } from './side-effect';",
        'export const zEvil = /*#__PURE__*/ (() => importedSideEffect)();',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('does not let a no-call pure-IIFE become a proven schema root for a later schema', () => {
      const src = [
        "import * as z from 'zod';",
        "import { importedSideEffect } from './side-effect';",
        'export const zEvil = /*#__PURE__*/ (() => importedSideEffect)();',
        'export const zFoo = zEvil();',
      ].join('\n');
      // zEvil must be reported (not recorded as a proven schema), so the chain rooted at it
      // is not silently accepted either.
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('fails closed on a pure-IIFE whose body is a bare proven-schema identifier (no construction)', () => {
      // Even a body that is just a reference to a real schema is NOT itself a construction:
      // `(() => zFoo)()` is an alias shape, not a call, and must not be recorded as a fresh
      // proven-schema construction via the call branch (the identifier-alias branch handles
      // genuine aliases). Recording it here would let a no-call wrapper masquerade as a root.
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string() });',
        'export const zAlias = /*#__PURE__*/ (() => zFoo)();',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zAlias/);
    });

    it('still accepts a pure-IIFE whose body IS a schema-construction call (idempotent)', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = /*#__PURE__*/ (() => z.object({ a: z.string() }))();',
        'export const zBar = /*#__PURE__*/ (() => zFoo.extend({ b: z.number() }))();',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toBe(src);
    });
  });

  // Regression (Copilot round 13): the fail-closed traversal classified only INVOCATIONS
  // (call/new/tagged-template), so other eager side effects were accepted. An assignment,
  // update, or delete expression in an eager position (`z.literal(globalState = true)`,
  // `z.literal(counter++)`, `z.literal(delete obj.x)`) runs at module evaluation, yet only
  // allowlisted Zod calls were found — so the initialiser was wrapped `/*#__PURE__*/` and a
  // bundler could drop the side effect. Reject every eager assignment/update/delete before
  // annotating the initialiser.
  describe('eager assignment/update/delete side effects (fail the whole class)', () => {
    it('fails closed on an assignment in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { globalState } from './side-effect';",
        'export const zFoo = z.literal((globalState.value = true));',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a compound assignment in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { state } from './side-effect';",
        'export const zFoo = z.literal((state.n += 1));',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an update expression in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { state } from './side-effect';",
        'export const zFoo = z.literal(state.counter++);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a delete expression in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { state } from './side-effect';",
        'export const zFoo = z.literal(delete state.x);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an assignment hidden in a wrapped (idempotent) body', () => {
      const src = [
        "import * as z from 'zod';",
        "import { globalState } from './side-effect';",
        `export const zFoo = ${WRAP}z.literal((globalState.value = true)))();`,
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('still wraps a schema whose eager arguments are side-effect-free', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string(), b: z.literal("x") });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });
  });
});
