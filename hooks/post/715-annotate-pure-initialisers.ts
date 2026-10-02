import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Marks side-effect-free top-level initialisers in generated code as
// `/* @__PURE__ */` so consumer bundlers can drop them (issue #537, phase 2).
//
// Why this is needed even though package.json declares `"sideEffects": false`:
// tsup bundles the whole SDK into a few large chunks, so the per-file
// `sideEffects` hint no longer separates modules. Inside a chunk, a bundler must
// keep any top-level call it cannot prove pure — e.g. hey-api's
//
//   export const client = createClient(createConfig({ throwOnError: true }));
//
// which dragged the entire fetch client into every consumer bundle, even one that
// imported only `isSdkError`.
//
// Policy: every EAGERLY EVALUATED top-level call / `new` in the scanned files
// must have its callee in PURE_CALLEES (then it is annotated) or in
// BUNDLER_KNOWN_PURE (bundlers already treat it as pure). Anything else FAILS the
// pipeline, so a new top-level call introduced by a generator upgrade gets a
// human decision instead of silently re-breaking tree-shaking.
//
// "Eagerly evaluated" is the load-bearing distinction, and the reason this gate
// walks the TypeScript AST instead of a regex: a call runs at import time only if
// it is reached while evaluating a module-level initialiser WITHOUT first
// entering a function body. `export const client = createClient(...)` runs the
// call; `export const getFoo = (o) => (o.client ?? client).get(...)` does NOT —
// the `.get(...)` lives in an arrow body and only runs when `getFoo()` is later
// called. The 240+ generated SDK methods are exactly this lazy shape and are
// textually indistinguishable from an eager `a ?? sneaky()` by regex alone, so a
// text matcher is either fail-open (misses eager calls wrapped in `?:` / `??` /
// other expressions) or false-positives on every lazy SDK export. The AST walk
// collects eager calls regardless of expression wrapper and stops at every
// function/arrow/class boundary, so it is fail-closed for every initialiser shape
// without touching the lazy ones. Guarded end-to-end by
// scripts/check-tree-shaking.mjs and tests/annotate-pure-initialisers.test.ts.
//
// Ordering: this hook is numbered 715 so it runs AFTER the last generated-source
// mutator (700-enrich-activate-jobs, 710-derive-present-when — post hooks execute
// in lexicographic order). A gate that runs before those hooks would validate a
// tree that later hooks then rewrite, letting an eager initializer they introduce
// bypass the allowlist. Any FUTURE hook that writes under src/gen must be
// numbered below 715 (the regression suite asserts this ordering) — UNLESS it
// rewrites ONLY a file this gate EXCLUDEs (today: zod.gen.ts). Hook
// 720-pure-zod-schemas is the one reviewed exception: it rewrites zod.gen.ts
// (which this gate skips) into pure IIFEs, so it sorts after the gate and is
// allowlisted in tests/annotate-pure-initialisers.test.ts.

// zod.gen.ts is excluded: it is only ever loaded lazily via `import()`, and its
// schema definitions call `.register(...)` into a global registry (a real side
// effect we must not mark pure).
const EXCLUDE = new Set(['zod.gen.ts']);

/** Callees reviewed as side-effect-free at construction time. */
const PURE_CALLEES = new Set([
  'createClient', // builds a client object; no I/O until a request is made
  'createConfig', // merges defaults into a plain object
  'createQuerySerializer', // returns a serializer closure
  'Object.entries', // over a module-local object literal
]);
/** Constructors esbuild/rollup/webpack already treat as pure. */
const BUNDLER_KNOWN_PURE = new Set(['new Set', 'new Map', 'new WeakMap', 'new WeakSet']);

const PURE = '/* @__PURE__ */ ';

export interface AnnotateResult {
  /** Number of @__PURE__ hints inserted this run. */
  annotated: number;
  /** One message per eagerly-evaluated unreviewed call (empty = gate passes). */
  unreviewed: string[];
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.ts') && !EXCLUDE.has(d.name) ? [p] : [];
  });
}

/** Text of a call/new callee, e.g. `createClient`, `Object.entries`, `foo.bar`. */
function calleeText(expr: ts.Expression): string {
  return expr.getText().replace(/\s+/g, '');
}

/** True if `node`'s immediate leading trivia already carries a @__PURE__ hint. */
function alreadyAnnotated(src: string, node: ts.Node): boolean {
  return src.slice(node.getFullStart(), node.getStart()).includes('@__PURE__');
}

type EagerCall = {
  node:
    | ts.CallExpression
    | ts.NewExpression
    | ts.TaggedTemplateExpression
    | ts.Decorator
    | ts.EnumDeclaration
    | ts.ModuleDeclaration;
  key: string;
  pure: boolean;
};

/**
 * Collect every call / `new` / tagged template that is EAGERLY evaluated while
 * running `init` as a module-level construct — i.e. reachable without crossing a
 * function, arrow, method, accessor, or constructor boundary, or a deferred
 * (instance / body) part of a class (those defer evaluation to call /
 * construction time). A method/accessor's COMPUTED NAME is still eager — it is
 * evaluated when the containing object literal or class is defined — so the
 * name is visited before the deferred body is skipped. The arguments of an
 * eager call are themselves eager, so we
 * descend into them, and so are a class's decorators (including PARAMETER
 * decorators), `extends` expression, computed member names, static field
 * initialisers and static blocks. A tagged template is an eager invocation too —
 * its tag and substitutions are collected the same way.
 */
function collectEagerCalls(init: ts.Node, out: EagerCall[]): void {
  const visit = (node: ts.Node): void => {
    // Stop at any construct whose BODY is not evaluated at module-init time —
    // but a method/accessor/constructor's COMPUTED NAME is evaluated eagerly
    // (when the containing object literal or class is defined), so visit the
    // name before skipping the deferred body. Without this,
    // `export const x = { [sneakySideEffect()]() {} }` bypassed the gate.
    if (
      ts.isMethodDeclaration(node) ||
      ts.isConstructorDeclaration(node) ||
      ts.isGetAccessorDeclaration(node) ||
      ts.isSetAccessorDeclaration(node)
    ) {
      if (node.name && ts.isComputedPropertyName(node.name)) visit(node.name.expression);
      return;
    }
    if (
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionDeclaration(node)
    ) {
      return;
    }
    // Defining a class EAGERLY evaluates its decorators, `extends` expression,
    // computed member names, static field initialisers, and static blocks, so a
    // call there still runs at import time: `const C = class { static v = sneaky() }`
    // must not bypass the gate. Instance-field initialisers and method/accessor/
    // constructor bodies run later, so those stay deferred. Visit only the eager
    // parts rather than returning (which would skip the whole class).
    if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      visitClassEagerParts(node);
      return;
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const ctor = ts.isNewExpression(node);
      const callee = calleeText(node.expression);
      const key = ctor ? `new ${callee}` : callee;
      const pure = !ctor && PURE_CALLEES.has(callee);
      out.push({ node, key, pure });
      // Descend into the callee and arguments: both are eager. A call's own
      // callee can itself be a parenthesised IIFE etc., and its arguments can be
      // further eager calls (`createClient(createConfig(...))`).
      ts.forEachChild(node, visit);
      return;
    }
    if (ts.isTaggedTemplateExpression(node)) {
      // A tagged template IS an eager invocation — `tag\`...\`` calls `tag` at
      // evaluation time — but it is not a CallExpression, so without this branch
      // `export const x = sneakyTag\`value\`` would bypass the gate. The tag and
      // every substitution are eager; descend into both.
      const tag = calleeText(node.tag);
      out.push({ node, key: tag, pure: PURE_CALLEES.has(tag) });
      ts.forEachChild(node, visit);
      return;
    }
    if (ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node)) {
      // A runtime `enum` or `namespace`/`module` declaration contains NO
      // CallExpression in source, so the walk above collects nothing — yet
      // TypeScript emits a top-level IIFE for it
      // (`var E; (function (E) { ... })(E || (E = {}));`), an eagerly-evaluated
      // side effect that defeats tree-shaking exactly like an unreviewed call.
      // Reached in an eager position it must fail the fail-closed gate (it can
      // never be a reviewed pure callee). An AMBIENT (`declare`) declaration
      // emits nothing, but rejecting it too keeps the gate simple and is
      // harmless: generated code has no ambient enums/namespaces, and a human
      // can allowlist one if that ever changes.
      const kind = ts.isEnumDeclaration(node) ? 'enum' : 'namespace';
      out.push({ node, key: `${kind} ${node.name.getText()}`, pure: false });
      // Still descend: a namespace body can hold nested eager constructs.
      ts.forEachChild(node, visit);
      return;
    }
    ts.forEachChild(node, visit);
  };

  const visitDecorators = (node: ts.Node): void => {
    if (ts.canHaveDecorators(node)) {
      for (const d of ts.getDecorators(node) ?? []) {
        // A BARE decorator (`@dec`, `@ns.dec`) is itself an eager invocation:
        // the decorator function is CALLED with the decorated target when the
        // class is defined. Its expression is an Identifier / PropertyAccess,
        // not a CallExpression, so `visit(d.expression)` alone would collect
        // nothing and the import-time side effect would bypass the fail-closed
        // gate. Treat the decorator application as an eager call keyed on the
        // decorator expression (annotated when reviewed, rejected otherwise).
        // A CALL decorator (`@dec()`) already IS a CallExpression, so leave it
        // to `visit` below to avoid double-counting.
        if (!ts.isCallExpression(d.expression)) {
          const key = calleeText(d.expression);
          out.push({ node: d, key, pure: PURE_CALLEES.has(key) });
        }
        visit(d.expression);
      }
    }
  };

  // Visit the eagerly-evaluated parts of a class, descending into nested
  // expressions via `visit` while leaving deferred bodies (method/accessor/
  // constructor bodies and instance-field initialisers) untouched.
  const visitClassEagerParts = (node: ts.ClassLikeDeclaration): void => {
    visitDecorators(node);
    for (const clause of node.heritageClauses ?? []) {
      // `extends X` evaluates X at definition time; `implements` is type-only.
      if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
        for (const type of clause.types) visit(type.expression);
      }
    }
    for (const member of node.members) {
      visitDecorators(member);
      // A computed member name is evaluated eagerly whether or not it is static.
      if (member.name && ts.isComputedPropertyName(member.name)) {
        visit(member.name.expression);
      }
      // Parameter decorators are evaluated when the class is DEFINED, so a call
      // in `m(@sneaky() v: string)` is eager even though the method BODY is
      // deferred. Visit the decorators on every parameter of a method, accessor,
      // or constructor declaration (including overloads).
      if (
        ts.isMethodDeclaration(member) ||
        ts.isConstructorDeclaration(member) ||
        ts.isGetAccessorDeclaration(member) ||
        ts.isSetAccessorDeclaration(member)
      ) {
        for (const param of member.parameters) visitDecorators(param);
      }
      const isStatic =
        ts.canHaveModifiers(member) &&
        (ts.getModifiers(member) ?? []).some((m) => m.kind === ts.SyntaxKind.StaticKeyword);
      if (ts.isPropertyDeclaration(member) && isStatic && member.initializer) {
        visit(member.initializer); // static field initialiser: eager
      } else if (ts.isClassStaticBlockDeclaration(member)) {
        for (const stmt of member.body.statements) visit(stmt); // static block: eager
      }
    }
  };

  visit(init);
}

/**
 * Annotate pure top-level initialisers under `<root>/src/gen` in place and report
 * every eagerly-evaluated unreviewed call. Pure run: no files changed and an
 * empty `unreviewed`. Does NOT throw or exit — the CLI wrapper below turns a
 * non-empty `unreviewed` into a failing process.
 */
export function annotatePureInitialisers(root: string): AnnotateResult {
  const GEN_DIR = path.join(root, 'src', 'gen');
  let annotated = 0;
  const unreviewed: string[] = [];

  for (const file of walk(GEN_DIR)) {
    const src = fs.readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, /* setParentNodes */ true);

    const inserts: number[] = []; // offsets at which to splice in a @__PURE__ hint
    // Walk EVERY top-level statement, not just `const/let/var`. An eager call can
    // run at import time from an expression statement (`registerPlugin();`), an
    // `export default createClient()`, or an `export =` just as much as from a
    // variable initialiser — collectEagerCalls stops at deferred bodies, so a
    // statement that is itself a function/class declaration contributes nothing.
    for (const stmt of sf.statements) {
      const eager: EagerCall[] = [];
      collectEagerCalls(stmt, eager);
      for (const { node, key, pure } of eager) {
        if (BUNDLER_KNOWN_PURE.has(key)) continue; // bundlers already drop these
        if (pure) {
          if (!alreadyAnnotated(src, node)) inserts.push(node.getStart());
          continue;
        }
        // A pre-existing @__PURE__ hint on an unreviewed callee is a bundler
        // annotation, not the promised human review, so it still fails.
        unreviewed.push(
          `${path.relative(root, file)}: eagerly-evaluated unreviewed call '${key}(...)' in a top-level initialiser`
        );
      }
    }

    if (inserts.length) {
      annotated += inserts.length;
      let out = src;
      for (const offset of [...inserts].sort((a, b) => b - a)) {
        out = out.slice(0, offset) + PURE + out.slice(offset);
      }
      if (out !== src) fs.writeFileSync(file, out, 'utf8');
    }
  }

  return { annotated, unreviewed };
}

/** CLI entry: annotate `process.cwd()`'s src/gen, print, and fail on unreviewed. */
function main(): void {
  const { annotated, unreviewed } = annotatePureInitialisers(process.cwd());
  if (unreviewed.length) {
    console.error(
      '[annotate-pure] Unreviewed top-level calls in generated code. Each one runs at import ' +
        'time and defeats tree-shaking. Review it and add the callee to PURE_CALLEES in ' +
        'hooks/post/715-annotate-pure-initialisers.ts if it is side-effect-free:\n  ' +
        unreviewed.join('\n  ')
    );
    process.exit(1);
  }
  console.log(`[annotate-pure] Annotated ${annotated} top-level initialisers as /* @__PURE__ */`);
}

// Run only when executed directly (tsx hooks/post/715-annotate-pure-initialisers.ts),
// not when imported by the test suite — which calls annotatePureInitialisers()
// in-process so it never pays the tsx + TypeScript-compiler startup cost per case.
const invokedDirectly =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) main();
