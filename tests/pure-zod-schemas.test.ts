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

      // Regression (Copilot round 15): the mutator guard ran ONLY on the outer initialiser
      // chain, so a proven-schema-rooted mutator NESTED in an eager argument slipped through
      // — its root is a reviewed schema, so `findUnreviewedEagerCall` accepted it and the
      // whole initialiser was wrapped `/*#__PURE__*/`, letting a bundler drop the eager
      // re-registration. A non-`z` registry argument isolates the `.register` detection from
      // the namespace-service guard that would otherwise catch `z.globalRegistry`.
      it('fails closed on a NESTED proven-schema-rooted .register in an eager argument', () => {
        const src = [
          "import * as z from 'zod';",
          "import { registry } from './registry';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zFoo = z.object({ v: zBase.register(registry, { id: "x" }) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed on a NESTED bracket-notation proven-schema .register', () => {
        const src = [
          "import * as z from 'zod';",
          "import { registry } from './registry';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zFoo = z.object({ v: zBase["register"](registry, { id: "x" }) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      it('fails closed on a NESTED proven-schema-rooted tagged-template mutator', () => {
        const src = [
          "import * as z from 'zod';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zFoo = z.object({ v: zBase.register`x` });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });

      // Regression (Copilot round 15): a COMPUTED first member off a proven schema
      // (`zBase[key](...)`) is not statically known to be a combinator — `key` could be
      // `register`. The mutator guard previously returned `null` (accept) for it, failing
      // OPEN; the hook promises fail-closed behaviour, so it must be rejected.
      it('fails closed on a COMPUTED first member off a proven schema — zBase[key](...)', () => {
        const src = [
          "import * as z from 'zod';",
          "import { key, registry } from './dyn';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zAlias = zBase[key](registry, { id: "base" });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zAlias/);
      });

      it('fails closed on a NESTED computed first member off a proven schema', () => {
        const src = [
          "import * as z from 'zod';",
          "import { key, registry } from './dyn';",
          'export const zBase = z.object({ a: z.string() });',
          'export const zFoo = z.object({ v: zBase[key](registry, { id: "x" }) });',
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
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

    it('still wraps a schema whose eager argument is a bare identifier (enum-like value)', () => {
      // A bare identifier argument (`z.nativeEnum(MyEnum)`) is a REFERENCE, not a read —
      // passing the value does not run a getter, so it stays wrappable. (Reading a MEMBER
      // of such an object — `z.literal(MyEnum.A)` — is the unproven eager read rejected in
      // the dedicated suite below.)
      const src = [
        "import * as z from 'zod';",
        "import { MyEnum } from './enums';",
        'export const zFoo = z.nativeEnum(MyEnum);',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.nativeEnum(`);
    });
  });

  // Regression (Copilot round 17): the fail-closed traversal classified only INVOCATIONS
  // and assignment/update/delete, so an eager SPREAD was accepted.
  // `z.object({ ...sideEffectingProxy })` contains only a reviewed Zod call and no
  // assignment/update/delete, yet object spread SYNCHRONOUSLY runs the operand's
  // getters/Proxy traps at module evaluation — so the initialiser was wrapped
  // `/*#__PURE__*/` and a bundler could drop those effects with the schema. The same holds
  // for a call/array spread (`z.union([...schemas])`, `f(...args)`), which runs the
  // operand's iterator protocol eagerly. Reject every eager SpreadAssignment/SpreadElement
  // before annotating the initialiser; a spread inside a DEFERRED callback stays allowed.
  describe('eager spread side effects (fail the whole class)', () => {
    it('fails closed on an object spread in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        'export const zFoo = z.object({ ...sideEffectingProxy });',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an array spread in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { schemas } from './side-effect';",
        'export const zFoo = z.union([...schemas]);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a call spread in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { args } from './side-effect';",
        'export const zFoo = z.string(...args);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an object spread hidden in a wrapped (idempotent) body', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        `export const zFoo = ${WRAP}z.object({ ...sideEffectingProxy }))();`,
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('still treats a spread inside a DEFERRED callback body as lazy', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        'export const zFoo = z.lazy(() => z.object({ ...sideEffectingProxy }));',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.lazy(`);
    });
  });

  // Regression (Copilot round 18, previously-missed): the fail-closed traversal rejected
  // unreviewed CALLS, assignments/updates/deletes, and spreads — but not an eager
  // PROPERTY/ELEMENT READ. `z.literal(sideEffectingProxy.value)` contains only an
  // allowlisted Zod call and no rejected node, yet reading `.value` synchronously runs the
  // operand's getter or Proxy `get` trap at module evaluation — so the initialiser was
  // annotated `/*#__PURE__*/` and tree-shaking could discard the getter side effect with
  // the schema. Reject every eager property/element read whose chain is NOT rooted at the
  // `z` namespace or a proven schema (a callee chain of a classified call, `.register(
  // z.globalRegistry, …)`, and literal/identifier/proven-schema arguments stay allowed).
  describe('eager property/element reads (fail the whole class)', () => {
    it('fails closed on an unproven property read in an eager argument', () => {
      // `z.literal(proxy.value)` reads `.value` at module evaluation — a getter/Proxy trap
      // on the operand runs eagerly, yet no call is flagged without the read guard.
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        'export const zFoo = z.literal(sideEffectingProxy.value);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an unproven element read in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        "export const zFoo = z.literal(sideEffectingProxy['value']);",
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on a computed element read in an eager argument', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy, key } from './side-effect';",
        'export const zFoo = z.literal(sideEffectingProxy[key]);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an unproven property read of an imported enum-like object', () => {
      // `z.literal(MyEnum.A)` reads a MEMBER of an imported object at module evaluation —
      // an imported enum-like object can be a Proxy, so the read is unproven and fails
      // closed. (Passing the object itself — `z.nativeEnum(MyEnum)` — is a bare reference,
      // not a read, and stays allowed; see the assignment/update/delete suite.)
      const src = [
        "import * as z from 'zod';",
        "import { MyEnum } from './enums';",
        'export const zFoo = z.literal(MyEnum.A);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('fails closed on an unproven property read hidden in a wrapped (idempotent) body', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        `export const zFoo = ${WRAP}z.literal(sideEffectingProxy.value)))();`,
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
    });

    it('still treats a property read inside a DEFERRED callback body as lazy', () => {
      const src = [
        "import * as z from 'zod';",
        "import { sideEffectingProxy } from './side-effect';",
        'export const zFoo = z.lazy(() => z.literal(sideEffectingProxy.value));',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.lazy(`);
    });

    it('still wraps a schema that reads a member of the z namespace as an argument', () => {
      // `.register(z.globalRegistry, …)` passes a `z`-rooted read as an argument — plain
      // data on the zod module, not an unproven getter — so it must stay wrappable.
      const src = [
        "import * as z from 'zod';",
        "export const zFoo = z.object({ a: z.string() }).register(z.globalRegistry, { id: 'Foo' });",
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    it('still wraps a schema that reads a member of a PROVEN schema as an argument', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zBase = z.object({ a: z.string() });',
        'export const zFoo = z.object({ b: zBase.shape.a });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    it('still wraps a schema whose arguments are literals and identifiers only', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({ a: z.string(), b: z.literal("x"), c: z.enum(["y", "z"]) });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });
  });

  // Regression (Copilot "Previously missed", round 20): `findUnreviewedEagerCall` flagged
  // ASSIGNMENT binary operators but not other binary operators, and unary `+`/`-`/`~` and
  // template substitutions were not flagged at all. A COERCIVE operator runs user code on a
  // non-inert operand at module evaluation — arithmetic/relational/bitwise coerce via
  // `Symbol.toPrimitive`/`valueOf`/`toString`, `in` runs a Proxy `has` trap, `instanceof`
  // runs `Symbol.hasInstance`, a template substitution runs `toString` — yet none is a call
  // for the invocation classifier to flag, so `z.literal(importedObj + 1)` was wrapped
  // `/*#__PURE__*/` and a bundler could drop the side effect. Fail closed on the whole
  // class unless every operand is statically inert.
  describe('eager coercive operators (fail the whole class)', () => {
    const cases: Array<[string, string]> = [
      ['binary + (valueOf/Symbol.toPrimitive)', 'z.literal(importedObj + 1)'],
      ['binary * (valueOf)', 'z.literal(importedObj * 2)'],
      ['relational < (Symbol.toPrimitive)', 'z.literal(importedObj < 5)'],
      ['loose equality == (valueOf)', 'z.literal(importedObj == 5)'],
      ['bitwise & (valueOf)', 'z.literal(importedObj & 1)'],
      ['in operator (Proxy has trap)', 'z.literal("k" in importedObj)'],
      ['instanceof (Symbol.hasInstance)', 'z.literal(importedObj instanceof importedCtor)'],
      ['unary minus (valueOf)', 'z.literal(-importedObj)'],
      ['unary plus (valueOf)', 'z.literal(+importedObj)'],
      ['unary bitwise-not (valueOf)', 'z.literal(~importedObj)'],
      ['template substitution (toString)', 'z.literal(`v=${importedObj}`)'],
      ['nested coercion in an object schema', 'z.object({ v: z.literal(importedObj + 1) })'],
    ];
    for (const [name, initExpr] of cases) {
      it(`fails closed on ${name}`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedObj, importedCtor } from './side-effect';",
          `export const zEvil = ${initExpr};`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
      });
    }

    it('still wraps coercion of statically inert operands (literals)', () => {
      // Literal-only operators cannot run user code, so they stay wrappable: `1 + 2`, `-1`,
      // `` `x${2}` ``, `'a' === 'b'`.
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({',
        '  a: z.string().min(1 + 2),',
        '  b: z.number().gt(-1),',
        '  c: z.literal(`x${2}`),',
        '  d: z.literal(2 ** 3),',
        '});',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    it('still wraps non-coercive operators (=== && ?? ,) on identifiers', () => {
      // These operators never coerce an operand, so an identifier operand is safe; the
      // operand is still visited for its own side effects (here it has none).
      const src = [
        "import * as z from 'zod';",
        "import { flagA, flagB } from './flags';",
        'export const zFoo = z.object({ a: z.literal(flagA ?? flagB), b: z.literal(flagA === flagB) });',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    it('still wraps coercion inside a deferred callback body (not eager)', () => {
      const src = [
        "import * as z from 'zod';",
        "import { importedObj } from './side-effect';",
        'export const zFoo = z.lazy(() => z.literal(importedObj + 1));',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.lazy(`);
    });
  });

  // Regression (Copilot "Previously missed", round 20): the proven-schema method guard was a
  // BLACKLIST (`register` only), so any other first method off a proven schema was marked
  // pure — `zBase.parse(importedValue)` runs refinements/transforms with required side
  // effects, and `safeParse`/decode/encode/unknown methods have the same problem, yet were
  // wrapped `/*#__PURE__*/`. The guard is now an ALLOWLIST of reviewed combinators, so every
  // effectful or unknown first method fails closed.
  describe('non-combinator schema methods (fail the whole class)', () => {
    const effectful = [
      'parse',
      'parseAsync',
      'safeParse',
      'safeParseAsync',
      'decode',
      'encode',
      'decodeAsync',
      'encodeAsync',
      'register',
      'someFutureEffectfulMethod',
    ];
    for (const method of effectful) {
      it(`fails closed on a proven-schema-rooted .${method}`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedValue } from './side-effect';",
          'export const zBase = z.object({ a: z.string() });',
          `export const zEvil = zBase.${method}(importedValue);`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
      });

      it(`fails closed on a NESTED proven-schema-rooted .${method}`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedValue } from './side-effect';",
          'export const zBase = z.object({ a: z.string() });',
          `export const zFoo = z.object({ v: zBase.${method}(importedValue) });`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zFoo/);
      });
    }

    it('fails closed on a bracket-notation effectful method (zBase["parse"])', () => {
      const src = [
        "import * as z from 'zod';",
        "import { importedValue } from './side-effect';",
        'export const zBase = z.object({ a: z.string() });',
        'export const zEvil = zBase["parse"](importedValue);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('still wraps proven-schema-rooted combinators (.extend/.optional/.and/.nullable/.array)', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zBase = z.object({ a: z.string() });',
        'export const zA = zBase.extend({ b: z.number() });',
        'export const zB = zBase.optional();',
        'export const zC = zBase.and(z.object({ c: z.string() }));',
        'export const zD = zBase.nullable();',
        'export const zE = zBase.array().min(1);',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out.match(/\/\*#__PURE__\*\/ \(\(\) => /g)?.length).toBe(6);
      expect(out).toContain(`export const zA = ${WRAP}zBase.extend(`);
      expect(out).toContain(`export const zE = ${WRAP}zBase.array(`);
    });
  });

  // Regression (Copilot round 21, inline): the inert-operand classifier treated the bare
  // identifier `undefined` as statically inert, so `z.literal(+undefined)` /
  // `z.literal(undefined + 1)` were wrapped `/*#__PURE__*/`. But an ES module can SHADOW
  // `undefined` (`const undefined = importedObj`), and then the coercion runs the shadowed
  // value's `Symbol.toPrimitive`/`valueOf` at module evaluation — a side effect a bundler
  // could then drop with the schema. Without binding analysis proving the identifier resolves
  // to the global value, NO identifier is statically inert — including `undefined`. The
  // classifier now fails closed on every identifier.
  describe('shadowed-undefined is not statically inert (fail the whole class)', () => {
    const cases: Array<[string, string]> = [
      ['unary + on undefined', 'z.literal(+undefined)'],
      ['unary - on undefined', 'z.literal(-undefined)'],
      ['unary ~ on undefined', 'z.literal(~undefined)'],
      ['binary + with undefined', 'z.literal(undefined + 1)'],
      ['relational with undefined', 'z.literal(undefined < 5)'],
      ['template substitution of undefined', 'z.literal(`v=${undefined}`)'],
    ];
    for (const [name, initExpr] of cases) {
      it(`fails closed on ${name} (a module can shadow undefined)`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedObj } from './side-effect';",
          // A module-level shadowing declaration: `undefined` here is NOT the global value.
          'const undefined = importedObj;',
          `export const zEvil = ${initExpr};`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
      });
    }

    it('fails closed on a coercive `undefined` operand even WITHOUT a visible shadowing declaration', () => {
      // The classifier does no binding analysis, so it cannot distinguish the global
      // `undefined` from a shadowed one. Fail closed on the identifier form regardless —
      // the safe literal-only schemas below stay wrappable, so this costs nothing real.
      const src = [
        "import * as z from 'zod';",
        'export const zEvil = z.literal(undefined + 1);',
      ].join('\n');
      expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
    });

    it('still wraps literal-only coercion (no identifier operand)', () => {
      // Removing the `undefined` carve-out must not regress the genuinely inert cases:
      // numeric/string literal arithmetic stays wrappable.
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({',
        '  a: z.string().min(1 + 2),',
        '  b: z.number().gt(-1),',
        '  c: z.literal(2 ** 3),',
        '});',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });
  });

  // Regression (Copilot round 22): the alias branch accepted ANY identifier initialiser,
  // including a destructuring binding name (`const { value } = importedProxy`). A
  // destructuring declaration synchronously runs a property read / the iterator protocol
  // (a getter or Proxy trap) at module load, yet the alias branch silently `continue`d
  // instead of failing closed. Only an identifier-to-identifier declaration is a reviewed
  // alias/schema shape; every destructuring binding name — regardless of its initialiser
  // kind — must fail closed so the hook is extended deliberately.
  describe('destructuring binding guard (fail the whole class)', () => {
    const cases: Array<[string, string[]]> = [
      [
        'object destructuring from an imported identifier (getter/Proxy get trap)',
        ['const { value } = importedProxy;'],
      ],
      [
        'array destructuring from an imported identifier (iterator protocol)',
        ['const [first] = importedProxy;'],
      ],
      [
        'renamed object destructuring from an imported identifier',
        ['const { value: v } = importedProxy;'],
      ],
      [
        'object destructuring from a proven schema (schema getter)',
        ['export const zFoo = z.object({ a: z.string() });', 'const { shape } = zFoo;'],
      ],
      [
        'object destructuring from a pure schema-construction call',
        ['const { shape } = z.object({ a: z.string() });'],
      ],
    ];
    for (const [name, decls] of cases) {
      it(`fails closed on ${name}`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedProxy } from './side-effect';",
          ...decls,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/destructuring/);
      });
    }

    it('still leaves an identifier-to-identifier alias untouched', () => {
      const src = [
        "import * as z from 'zod';",
        'export const zFoo = z.object({});',
        'export const zAlias = zFoo;',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain('export const zAlias = zFoo;');
    });
  });

  // Regression (Copilot round 22): the eager-side-effect walk missed computed property-name
  // coercion. `z.object({ [key]: z.string() })` evaluates `key[Symbol.toPrimitive]`/
  // `toString` (or a Proxy trap) at module load, yet the visitor saw only a bare identifier
  // and accepted the initialiser — letting the pure wrapper make that effect droppable. A
  // non-inert computed property-name key must fail closed exactly like a template
  // substitution or a coercive operator; a literal computed key runs no user code and a
  // computed key inside a deferred callback is not eager.
  describe('eager computed property names (fail the whole class)', () => {
    const cases: Array<[string, string]> = [
      ['identifier key (Symbol.toPrimitive/toString)', 'z.object({ [importedKey]: z.string() })'],
      [
        'template-literal key with a non-inert substitution',
        'z.object({ [`k${importedKey}`]: z.string() })',
      ],
      ['call-expression key (eager invocation)', 'z.object({ [makeKey()]: z.string() })'],
      [
        'nested computed key inside an object schema',
        'z.object({ outer: z.object({ [importedKey]: z.string() }) })',
      ],
    ];
    for (const [name, initExpr] of cases) {
      it(`fails closed on ${name}`, () => {
        const src = [
          "import * as z from 'zod';",
          "import { importedKey, makeKey } from './side-effect';",
          `export const zEvil = ${initExpr};`,
        ].join('\n');
        expect(() => wrapSchemaInitialisers(src)).toThrow(/zEvil/);
      });
    }

    it('still wraps a statically inert (literal) computed property key', () => {
      // A string/numeric literal key runs no user code, so it stays wrappable.
      const src = [
        "import * as z from 'zod';",
        "export const zFoo = z.object({ ['a']: z.string(), [0]: z.number() });",
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.object(`);
    });

    it('still wraps a computed property key inside a deferred callback body (not eager)', () => {
      const src = [
        "import * as z from 'zod';",
        "import { importedKey } from './side-effect';",
        'export const zFoo = z.lazy(() => z.object({ [importedKey]: z.string() }));',
      ].join('\n');
      const out = wrapSchemaInitialisers(src);
      expect(out).toContain(`export const zFoo = ${WRAP}z.lazy(`);
    });
  });
});
