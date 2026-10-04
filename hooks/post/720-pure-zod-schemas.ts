/**
 * Post-generation hook: make every zod schema in `src/gen/zod.gen.ts` individually
 * droppable by bundlers.
 *
 * Each generated schema is a top-level call chain such as
 *
 *   export const zFoo = z.object({ ... }).register(z.globalRegistry, { ... });
 *
 * A leading `/*#__PURE__*\/` only covers the outermost call: the nested
 * `z.object(...)` / `.register(...)` calls are still treated as side effects, so
 * bundlers keep every schema. Wrapping the initialiser in an annotated IIFE
 *
 *   export const zFoo = /*#__PURE__*\/ (() => z.object({ ... }).register(...))();
 *
 * lets esbuild and Rollup drop a schema nothing references (and keep the schemas a
 * retained one depends on). Evaluation order and values are unchanged: each IIFE runs
 * immediately, in declaration order, exactly where the initialiser ran before.
 *
 * Together with the per-operation schema modules emitted by hook 300
 * (`src/gen/zod/<operation>.gen.ts`), an application that imports a handful of
 * operations from `@camunda8/orchestration-cluster-api/fn` only bundles their schemas.
 *
 * Fail-fast: any top-level statement shape other than the reviewed ones (imports, the
 * zod-augment retention statement, `export const` aliasing another schema, or
 * `export const` whose initialiser is a zod schema-construction call chain) fails the
 * build, so a generator change cannot silently reintroduce module-level side effects.
 * Only an EXPORTED const is a reviewed schema declaration: a non-exported const call
 * initialiser (e.g. `const registration = z.globalRegistry.add(zFoo, meta)`) is a
 * namespace service/mutator statement, not a schema construction, and fails closed rather
 * than being wrapped — otherwise a bundler could drop the mutation while the schema it
 * registers stays referenced.
 * A call initialiser is only accepted — and wrapped — when EVERY eagerly evaluated call in
 * it (the outer chain AND nested arguments like `z.object({ v: sideEffect() })`) is rooted
 * at the `z` namespace or a schema reference declared in this module; any other eager call
 * (which could carry a required side effect) is reported as unreviewed rather than being
 * blindly marked pure. Calls inside deferred callback bodies (`z.lazy(() => …)`) are not
 * eager and are skipped.
 *
 * Idempotent: already-wrapped initialisers are left untouched — but their wrapped bodies
 * are still validated with the same eager-call traversal before the name is accepted as a
 * proven schema, so a `/*#__PURE__*\/ (() => …)()` wrapper that hides an unreviewed eager
 * side effect fails closed rather than being trusted by shape alone.
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ZOD_PATH = path.join(process.cwd(), 'src/gen/zod.gen.ts');
const PURE_IIFE_PREFIX = '/*#__PURE__*/ (() => ';
const ZOD_NAMESPACE = 'z';

export function wrapSchemaInitialisers(src: string, fileName = 'zod.gen.ts'): string {
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, true);
  const edits: { start: number; end: number; text: string }[] = [];
  const problems: string[] = [];

  // Names of consts already proven to be zod schema constructions (or aliases of one).
  // A call initialiser's chain may be rooted either at the `z` namespace (`z.object(...)`)
  // or at one of these proven schemas (`zFoo.extend(...)`); both are recognised pure
  // constructions. This is deliberately NOT the set of every module-level const: a const
  // such as `const helper = importedSideEffect` is not a schema, and a call rooted at it
  // (`helper()`) could carry a required side effect, so it must fail closed below. The set
  // is built up in the main pass below, in declaration order, as each schema is proven.
  const schemaNames = new Set<string>();

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) continue;
    // `void __zodAugmentApplied;` — deliberately retained (see hook 600).
    if (
      ts.isExpressionStatement(st) &&
      ts.isVoidExpression(st.expression) &&
      ts.isIdentifier(st.expression.expression)
    ) {
      continue;
    }
    if (ts.isVariableStatement(st) && st.declarationList.flags & ts.NodeFlags.Const) {
      // Only an EXPORTED const is a reviewed schema declaration. A non-exported const
      // call initialiser is NOT: `const registration = z.globalRegistry.add(zFoo, meta)`
      // is rooted at the zod namespace and would pass the eager-call traversal, but it is
      // a registry MUTATION, not a schema construction — wrapping it `/*#__PURE__*/` would
      // let a bundler drop the mutation while `zFoo` stays referenced. Fail closed on any
      // non-exported const call initialiser (aliases are still handled below).
      const isExported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) === true;
      for (const decl of st.declarationList.declarations) {
        const init = decl.initializer;
        if (!init) continue;
        if (ts.isIdentifier(init)) {
          // Alias: no side effect of its own. It is a proven schema only when its target
          // is — so an alias of a schema (`const a = zFoo`) stays a valid call root, while
          // an alias of anything else (`const h = sideEffect`) does not.
          if (schemaNames.has(init.text) && ts.isIdentifier(decl.name)) {
            schemaNames.add(decl.name.text);
          }
          continue;
        }
        if (ts.isCallExpression(init)) {
          if (!isExported) {
            // Fail closed: a non-exported const call initialiser is not a reviewed schema
            // declaration (see the exportedness guard above), so it is never wrapped.
            problems.push(
              `${decl.name.getText(sf)}: non-exported const call initialiser is not a reviewed schema declaration — ${init.getText(sf).slice(0, 120)}`
            );
            continue;
          }
          const wrappedBody = pureIifeBody(init);
          if (wrappedBody !== null) {
            // Already wrapped (idempotent rerun). Do NOT trust the `/*#__PURE__*/ (() => …)()`
            // shape alone: the annotation only asserts the OUTER expression is pure, so a
            // hand-written or generator-regressed wrapper could still hide an eager side
            // effect in its body (`(() => sideEffect())()`). Validate the wrapped body with
            // the same eager-call traversal before accepting the name as a proven schema —
            // an unreviewed eager call inside fails closed instead of being marked pure.
            const unreviewed = findUnreviewedEagerCall(wrappedBody, schemaNames);
            if (unreviewed !== null) {
              problems.push(
                `${decl.name.getText(sf)}: pure-IIFE initialiser wraps an eagerly-evaluated call whose chain is not rooted at the zod namespace or a schema reference (root: ${unreviewed}) — ${init.getText(sf).slice(0, 120)}`
              );
              continue;
            }
            if (ts.isIdentifier(decl.name)) schemaNames.add(decl.name.text);
            continue;
          }
          const unreviewed = findUnreviewedEagerCall(init, schemaNames);
          if (unreviewed !== null) {
            // Fail closed: an eagerly-evaluated call (the outer chain OR a nested argument)
            // whose root is not the zod namespace or a proven schema could carry a required
            // side effect; marking the initialiser pure would let a bundler drop it. Report
            // it so the hook is extended deliberately.
            problems.push(
              `${decl.name.getText(sf)}: initialiser contains an eagerly-evaluated call whose chain is not rooted at the zod namespace or a schema reference (root: ${unreviewed}) — ${init.getText(sf).slice(0, 120)}`
            );
            continue;
          }
          const exprText = init.getText(sf);
          edits.push({
            start: init.getStart(sf),
            end: init.getEnd(),
            text: `${PURE_IIFE_PREFIX}${exprText})()`,
          });
          // Recognised as a schema construction: record it so a later schema rooted at
          // this one (`zNext = zThis.and(...)`) is also recognised.
          if (ts.isIdentifier(decl.name)) schemaNames.add(decl.name.text);
          continue;
        }
        problems.push(`${decl.name.getText(sf)}: initialiser kind ${ts.SyntaxKind[init.kind]}`);
      }
      continue;
    }
    problems.push(`unreviewed top-level statement: ${st.getText(sf).slice(0, 120)}`);
  }

  if (problems.length) {
    throw new Error(
      `[pure-zod-schemas] zod.gen.ts has top-level code this hook has not reviewed:\n  ${problems.join('\n  ')}\n` +
        'Extend hooks/post/720-pure-zod-schemas.ts deliberately (and keep the module side-effect free).'
    );
  }

  let out = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

/**
 * If `call` is an already-wrapped pure IIFE — `/*#__PURE__*\/ (() => BODY)()` — returns
 * the wrapped BODY expression so the caller can validate it; otherwise returns `null`.
 * The wrapper is recognised structurally (zero-arg call of a parenthesised arrow whose
 * body is a single returned expression) plus the leading `/*#__PURE__*\/` annotation.
 */
function pureIifeBody(call: ts.CallExpression): ts.Expression | null {
  if (call.arguments.length !== 0) return null;
  const callee = call.expression;
  if (!ts.isParenthesizedExpression(callee) || !ts.isArrowFunction(callee.expression)) return null;
  const arrow = callee.expression;
  if (arrow.parameters.length !== 0) return null;
  const full = call.getFullText();
  if (!/\/\*#__PURE__\*\/\s*\($/.test(full.slice(0, full.indexOf('(') + 1))) return null;
  // The hook wraps with an expression-bodied arrow (`(() => EXPR)()`), so the body is the
  // expression itself. Tolerate a block body with a single `return EXPR;` too.
  if (!ts.isBlock(arrow.body)) return arrow.body;
  if (arrow.body.statements.length === 1) {
    const only = arrow.body.statements[0];
    if (ts.isReturnStatement(only) && only.expression) return only.expression;
  }
  return null;
}

/**
 * A call initialiser is a recognised zod schema construction only when EVERY eagerly
 * evaluated call/`new`/tagged-template in it is rooted at the `z` namespace or a schema
 * already proven pure in this module. Walking each chain to its leftmost expression
 * rejects chains rooted at an arbitrary call (`makeThing()(...)`) or an unknown identifier
 * (`sideEffect(...)`), which could carry a required side effect that must not be silently
 * marked pure. `schemaNames` holds only proven schema constructions — never an arbitrary
 * module-level const — so a chain rooted at a non-schema const fails closed.
 *
 * Returns a description of the first offending root, or `null` if every eager call is
 * recognised. It is NOT enough to validate the outer chain root alone: a nested eager
 * argument (`z.object({ v: registerGlobalState() })`) is rooted at `z` yet still runs
 * `registerGlobalState()` at module evaluation, and wrapping the initialiser in
 * `/*#__PURE__*\/ (() => …)()` would let a bundler drop that side effect with the schema.
 * Traverse the whole initialiser, but stop at deferred callback bodies (arrow/function
 * expressions such as `z.lazy(() => …)` or `.refine((v) => …)`) — those run when the
 * callback is invoked, not at module load, so calls inside them are not eager side effects.
 */
function findUnreviewedEagerCall(init: ts.Expression, schemaNames: Set<string>): string | null {
  let bad: string | null = null;
  const isReviewedRoot = (root: ts.Expression): boolean =>
    ts.isIdentifier(root) && (root.text === ZOD_NAMESPACE || schemaNames.has(root.text));
  const flag = (root: ts.Expression): void => {
    bad = ts.isIdentifier(root) ? root.text : ts.SyntaxKind[root.kind];
  };
  const visit = (node: ts.Node): void => {
    if (bad !== null) return;
    // Deferred callback bodies evaluate later, not at module load: do not descend.
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return;
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const root = callChainRoot(node.expression);
      if (!isReviewedRoot(root)) {
        flag(root);
        return;
      }
    } else if (ts.isTaggedTemplateExpression(node)) {
      // A tagged template IS an eager invocation — `tag`...`` calls `tag` at module
      // evaluation — but it is not a CallExpression, so without this branch
      // `z.object({ v: tag`x` })` would be wrapped pure and a bundler could drop the
      // tag's side effect. Check the tag's chain root like a call root; its
      // substitutions are eager too and are visited below.
      const root = callChainRoot(node.tag);
      if (!isReviewedRoot(root)) {
        flag(root);
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(init);
  return bad;
}

/**
 * Walks to the leftmost expression of a call/member chain — the "root" that determines
 * whether the chain is a zod construction. Peels call, property-access, element-access,
 * non-null and parenthesized wrappers.
 */
function callChainRoot(expr: ts.Expression): ts.Expression {
  let cur: ts.Expression = expr;
  while (true) {
    if (ts.isCallExpression(cur) || ts.isPropertyAccessExpression(cur)) {
      cur = cur.expression;
    } else if (ts.isElementAccessExpression(cur)) {
      cur = cur.expression;
    } else if (ts.isNonNullExpression(cur) || ts.isParenthesizedExpression(cur)) {
      cur = cur.expression;
    } else {
      break;
    }
  }
  return cur;
}

function main(): void {
  if (!fs.existsSync(ZOD_PATH)) {
    console.error('[pure-zod-schemas] zod.gen.ts not found');
    process.exit(1);
  }
  const src = fs.readFileSync(ZOD_PATH, 'utf8');
  const out = wrapSchemaInitialisers(src, ZOD_PATH);
  fs.writeFileSync(ZOD_PATH, out, 'utf8');
  const wrapped = (out.match(/\/\*#__PURE__\*\/ \(\(\) => /g) ?? []).length;
  console.log(`[pure-zod-schemas] ${wrapped} schema initialisers are pure IIFEs`);
}

// Only run when executed directly (not when imported for testing).
const isDirectRun =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('720-pure-zod-schemas.ts') ||
    process.argv[1].endsWith('720-pure-zod-schemas'));

if (isDirectRun) {
  main();
}
