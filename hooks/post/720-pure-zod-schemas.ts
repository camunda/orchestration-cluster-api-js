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
 * blindly marked pure. Eager NON-call side effects fail closed the same way: an
 * assignment/update/delete, any object/call/array SPREAD (`z.object({ ...proxy })`
 * runs the operand's getters/Proxy traps at module evaluation), and any eager
 * property/element READ not rooted at the `z` namespace or a proven schema
 * (`z.literal(proxy.value)` runs the getter/Proxy `get` trap at module evaluation).
 * Calls inside deferred callback bodies (`z.lazy(() => …)`) are not eager and are skipped.
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
            const svc = nonSchemaNamespaceRoot(wrappedBody);
            if (svc !== null) {
              problems.push(
                `${decl.name.getText(sf)}: pure-IIFE initialiser is rooted at a non-schema zod namespace member (${svc}), not a reviewed schema constructor — ${init.getText(sf).slice(0, 120)}`
              );
              continue;
            }
            const mut = unreviewedSchemaMethodRoot(wrappedBody, schemaNames);
            if (mut !== null) {
              // A wrapped body whose chain is a schema-mutator call on a proven schema
              // (`(() => zBase.register(…))()`) hides a registry mutation behind the pure
              // annotation — fail closed exactly like the unwrapped form.
              problems.push(
                `${decl.name.getText(sf)}: pure-IIFE initialiser is a schema-mutator call rooted at a proven schema (${mut}), not a fresh schema construction — ${init.getText(sf).slice(0, 120)}`
              );
              continue;
            }
            const unreviewed = findUnreviewedEagerCall(wrappedBody, schemaNames);
            if (unreviewed !== null) {
              problems.push(
                `${decl.name.getText(sf)}: pure-IIFE initialiser wraps an eagerly-evaluated side effect that is not a reviewed schema-construction call (${unreviewed}) — ${init.getText(sf).slice(0, 120)}`
              );
              continue;
            }
            // Passing the traversal is necessary but NOT sufficient to be a proven schema:
            // it only proves there is no unreviewed eager call. A body with NO call at all
            // (`(() => importedSideEffect)()`, `(() => zFoo)()`) has nothing to flag, yet it
            // is not a schema CONSTRUCTION — recording it would let a later `zEvil()` be
            // accepted as pure even though it invokes an arbitrary value. Require the body
            // to be a call/`new` rooted at the zod namespace or a proven schema (the same
            // construction shape the hook itself emits) before recording the name.
            if (!isSchemaConstructionCall(wrappedBody, schemaNames)) {
              problems.push(
                `${decl.name.getText(sf)}: pure-IIFE initialiser body is not a schema-construction call rooted at the zod namespace or a proven schema — ${init.getText(sf).slice(0, 120)}`
              );
              continue;
            }
            if (ts.isIdentifier(decl.name)) schemaNames.add(decl.name.text);
            continue;
          }
          const svc = nonSchemaNamespaceRoot(init);
          if (svc !== null) {
            // Fail closed: exportedness + a `z`-rooted chain do NOT prove a schema
            // construction. Only a chain whose first `z` member is a reviewed schema
            // constructor (`z.object`, `z.string`, …) — see `ZOD_SCHEMA_NAMESPACE_MEMBERS`
            // — is a construction. `export const registration = z.globalRegistry.add(zFoo,
            // meta)` and `export const c = z.config(...)` are exported and `z`-rooted, but
            // their first member (`globalRegistry`/`config`) is a service/mutator, not a
            // constructor, so they are global MUTATIONS — wrapping them `/*#__PURE__*/`
            // would let a bundler drop the mutation while a referenced schema stays. A
            // computed root (`z[key](...)`) and any unknown future member fail closed too.
            problems.push(
              `${decl.name.getText(sf)}: initialiser is rooted at a non-schema zod namespace member (${svc}), not a reviewed schema constructor — ${init.getText(sf).slice(0, 120)}`
            );
            continue;
          }
          const mutator = unreviewedSchemaMethodRoot(init, schemaNames);
          if (mutator !== null) {
            // Fail closed: a chain rooted at a PROVEN schema whose FIRST member is a schema
            // mutator (`zBase.register(z.globalRegistry, meta)`) re-registers an existing
            // schema rather than producing a fresh one. Wrapped `/*#__PURE__*/`, a bundler
            // could drop the registry mutation while the base schema stays referenced. Only
            // a chain that DERIVES a fresh schema first (`zBase.extend({…}).register(…)`)
            // is a construction.
            problems.push(
              `${decl.name.getText(sf)}: initialiser is a schema-mutator call rooted at a proven schema (${mutator}), not a fresh schema construction — ${init.getText(sf).slice(0, 120)}`
            );
            continue;
          }
          const unreviewed = findUnreviewedEagerCall(init, schemaNames);
          if (unreviewed !== null) {
            // Fail closed: an eagerly-evaluated side effect that is not a reviewed
            // schema-construction call — an unreviewed call root (the outer chain OR a
            // nested argument), an assignment/update/delete, or a spread — could carry a
            // required side effect; marking the initialiser pure would let a bundler drop
            // it. Report it so the hook is extended deliberately.
            problems.push(
              `${decl.name.getText(sf)}: initialiser contains an eagerly-evaluated side effect that is not a reviewed schema-construction call (${unreviewed}) — ${init.getText(sf).slice(0, 120)}`
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
 * True when `expr` is a schema-CONSTRUCTION call: a `call`/`new` expression whose chain is
 * rooted at the `z` namespace or a schema already proven pure in this module. This is the
 * shape the hook itself emits (`z.object(...).register(...)`, `zFoo.extend(...)`), and the
 * only shape a wrapped body may have to be recorded as a proven schema. A bare identifier
 * (`(() => zFoo)()`), a literal, or any non-call expression is NOT a construction — it has
 * no eager call to flag, so it would otherwise slip past the traversal and be recorded as a
 * proven root for a later schema. The chain-root walk mirrors `findUnreviewedEagerCall`'s
 * `isReviewedRoot`, so the two agree on what counts as a construction root.
 */
function isSchemaConstructionCall(expr: ts.Expression, schemaNames: Set<string>): boolean {
  if (!ts.isCallExpression(expr) && !ts.isNewExpression(expr)) return false;
  const root = callChainRoot(expr.expression);
  return ts.isIdentifier(root) && (root.text === ZOD_NAMESPACE || schemaNames.has(root.text));
}

/**
 * True when `kind` is an assignment operator (`=`, `+=`, `-=`, `??=`, `&&=`, `||=`, …) — a
 * binary expression with one mutates its left-hand side. Used to reject eager assignments
 * inside a schema initialiser, which run at module evaluation yet carry no call for the
 * invocation classifier to flag. Comparison (`===`, `<`, …) and arithmetic (`+`, `??`)
 * operators are NOT assignments and are excluded.
 */
function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
  switch (kind) {
    case ts.SyntaxKind.EqualsToken:
    case ts.SyntaxKind.PlusEqualsToken:
    case ts.SyntaxKind.MinusEqualsToken:
    case ts.SyntaxKind.AsteriskEqualsToken:
    case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
    case ts.SyntaxKind.SlashEqualsToken:
    case ts.SyntaxKind.PercentEqualsToken:
    case ts.SyntaxKind.LessThanLessThanEqualsToken:
    case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
    case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
    case ts.SyntaxKind.AmpersandEqualsToken:
    case ts.SyntaxKind.BarEqualsToken:
    case ts.SyntaxKind.CaretEqualsToken:
    case ts.SyntaxKind.QuestionQuestionEqualsToken:
    case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
    case ts.SyntaxKind.BarBarEqualsToken:
      return true;
    default:
      return false;
  }
}

/**
 * True when `kind` is a binary operator that can COERCE an operand — and thereby run user
 * code — at evaluation. Arithmetic (`+ - * / % **`), loose (in)equality (`== !=`),
 * relational (`< > <= >=`) and bitwise (`& | ^ << >> >>>`) operators invoke an object
 * operand's `Symbol.toPrimitive`/`valueOf`/`toString`; `in` invokes a Proxy `has` trap and
 * `instanceof` invokes `Symbol.hasInstance`. None is a call for the invocation classifier to
 * flag, so `z.literal(importedObj + 1)` / `z.literal(key in importedProxy)` would otherwise
 * be wrapped `/*#__PURE__*\/` and a bundler could drop the coercion's side effect with the
 * schema. Fails CLOSED: only the operators that provably never coerce — strict (in)equality
 * (`=== !==`), the logical connectives (`&& || ??`, which short-circuit without coercion) and
 * the comma operator (its operands' own effects are caught by descending) — are excluded;
 * every other binary operator, including any a future TypeScript adds, is treated as
 * coercive. Assignment operators are handled by `isAssignmentOperator` before this guard.
 */
function isCoerciveBinaryOperator(kind: ts.SyntaxKind): boolean {
  switch (kind) {
    case ts.SyntaxKind.EqualsEqualsEqualsToken:
    case ts.SyntaxKind.ExclamationEqualsEqualsToken:
    case ts.SyntaxKind.AmpersandAmpersandToken:
    case ts.SyntaxKind.BarBarToken:
    case ts.SyntaxKind.QuestionQuestionToken:
    case ts.SyntaxKind.CommaToken:
      return false;
    default:
      return true;
  }
}

/**
 * True when `expr` is STATICALLY INERT — evaluating it cannot run user code (no getter,
 * Proxy trap, `Symbol.toPrimitive`/`valueOf`/`hasInstance`, or call). Only then may a
 * coercive operator (`+`, `<`, `instanceof`, a template substitution, unary `+`/`-`/`~`)
 * sit in an eager schema position without failing closed: `z.literal(-1)` / `z.string().
 * min(1 + 2)` coerce only literals and must stay wrappable, while `z.literal(importedObj +
 * 1)` must not. Fails CLOSED: a bare identifier is NOT inert — an imported binding can be a
 * Proxy or an object with a coercion hook, and even the identifier `undefined` is not safe:
 * an ES module can shadow it (`const undefined = importedObj`), so `z.literal(+undefined)`
 * would run the shadowed value's `Symbol.toPrimitive` at module evaluation. Without binding
 * analysis proving an identifier resolves to the global value, no identifier is inert. Inert
 * shapes: literals (number/bigint/string/no-substitution template/regex), the keywords
 * `true`/`false`/`null` (which — unlike `undefined` — cannot be rebound), a parenthesised
 * inert expression, a unary `+`/`-`/`~`/`!` on an inert operand, and a (non-assignment)
 * binary of two inert operands.
 */
function isStaticallyInertOperand(expr: ts.Expression): boolean {
  switch (expr.kind) {
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.BigIntLiteral:
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
    case ts.SyntaxKind.RegularExpressionLiteral:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.NullKeyword:
      return true;
  }
  // NOTE: `undefined` is deliberately NOT carved out. It is an identifier (a global
  // property), not a keyword, and a module can shadow it (`const undefined = importedObj`),
  // so `+undefined` may run a coercion hook. `true`/`false`/`null` are keywords that cannot
  // be rebound, so they stay inert. Fail closed on every identifier.
  if (ts.isParenthesizedExpression(expr)) return isStaticallyInertOperand(expr.expression);
  if (
    ts.isPrefixUnaryExpression(expr) &&
    (expr.operator === ts.SyntaxKind.PlusToken ||
      expr.operator === ts.SyntaxKind.MinusToken ||
      expr.operator === ts.SyntaxKind.TildeToken ||
      expr.operator === ts.SyntaxKind.ExclamationToken)
  ) {
    return isStaticallyInertOperand(expr.operand);
  }
  if (ts.isBinaryExpression(expr) && !isAssignmentOperator(expr.operatorToken.kind)) {
    return isStaticallyInertOperand(expr.left) && isStaticallyInertOperand(expr.right);
  }
  return false;
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
 * The same applies to a nested namespace MUTATION whose root happens to be `z`
 * (`z.any().default(z.globalRegistry.add(…))`, `z.config(…)`): its first `z` member is a
 * service/mutator, not a schema constructor, so every eager call is also run through
 * `nonSchemaNamespaceRoot` (an ALLOWLIST of schema constructors) and a nested
 * `z.<non-constructor>` / computed-`z[key]` chain fails closed just like the outer one.
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
    // An eager PROPERTY/ELEMENT READ is an unreviewed side effect exactly like an eager
    // spread: `z.literal(sideEffectingProxy.value)` synchronously runs the operand's getter
    // or Proxy `get` trap at module evaluation, yet carries no call for the invocation
    // classifier to flag — so without this branch the initialiser is annotated
    // `/*#__PURE__*/` and tree-shaking can discard the getter side effect with the schema.
    // Reject EVERY eager read, then carve out the reviewed shapes below: the callee chain
    // of an already-classified call (`z.object(…)`, `zFoo.extend(…)` — the CALL branch
    // classifies its root), and a read rooted at the `z` namespace or a proven schema
    // (`.register(z.globalRegistry, …)`, `zBase.shape.a` — plain data on the zod module /
    // a schema object). A read rooted anywhere else (`z.literal(proxy.value)`,
    // `z.literal(MyEnum.A)` — an imported enum-like object can be a Proxy) fails closed.
    // A read inside a deferred callback is not eager and is skipped above.
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const parent = node.parent;
      // Callee of an enclosing call/new/tagged-template: classified by that branch.
      const isCalleeChain =
        (parent !== undefined &&
          ((ts.isCallExpression(parent) && parent.expression === node) ||
            (ts.isNewExpression(parent) && parent.expression === node) ||
            (ts.isTaggedTemplateExpression(parent) && parent.tag === node) ||
            ((ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)) &&
              parent.expression === node))) === true;
      if (!isCalleeChain) {
        const root = callChainRoot(node);
        if (!isReviewedRoot(root)) {
          bad = `eager property/element read (runs the operand’s getter/Proxy trap): ${
            ts.isIdentifier(root) ? root.text : ts.SyntaxKind[root.kind]
          }`;
          return;
        }
      }
    }
    // An eager side effect that is NOT an invocation still mutates state at module
    // evaluation, so it must fail closed exactly like an unreviewed call. An assignment
    // (`z.literal(globalState = true)` / `+=` / `??=` …), an update (`counter++`,
    // `--state.n`), or a `delete` (`z.literal(delete obj.x)`) in an eager position runs now,
    // yet carries no call for the invocation classifier to flag — so without this branch the
    // initialiser is wrapped `/*#__PURE__*/` and a bundler can drop the mutation. A nested
    // assignment INSIDE a deferred callback is not eager and is skipped above.
    if (ts.isBinaryExpression(node) && isAssignmentOperator(node.operatorToken.kind)) {
      bad = `assignment (${ts.SyntaxKind[node.operatorToken.kind]})`;
      return;
    }
    // A COERCIVE binary operator (`+`, `<`, `==`, `&`, `in`, `instanceof`, …) can run user
    // code on a non-inert operand at module evaluation — arithmetic/relational/bitwise coerce
    // via `Symbol.toPrimitive`/`valueOf`/`toString`, `in` runs a Proxy `has` trap and
    // `instanceof` runs `Symbol.hasInstance` — yet none is a call for the invocation
    // classifier to flag. So `z.literal(importedObj + 1)` / `z.literal(key in importedProxy)`
    // would otherwise be wrapped `/*#__PURE__*/` and a bundler could drop that side effect
    // with the schema. Fail closed unless BOTH operands are statically inert (literals etc.),
    // which cannot trigger user code; non-coercive operators (`===`, `&&`, `??`, `,`) never
    // coerce and stay allowed, their operands still visited below for their own effects.
    if (
      ts.isBinaryExpression(node) &&
      isCoerciveBinaryOperator(node.operatorToken.kind) &&
      !(isStaticallyInertOperand(node.left) && isStaticallyInertOperand(node.right))
    ) {
      bad = `coercive operator (${ts.SyntaxKind[node.operatorToken.kind]}) on a non-inert operand (runs Symbol.toPrimitive/valueOf/has/hasInstance eagerly)`;
      return;
    }
    if (
      ts.isPrefixUnaryExpression(node) &&
      (node.operator === ts.SyntaxKind.PlusPlusToken ||
        node.operator === ts.SyntaxKind.MinusMinusToken)
    ) {
      bad = 'update (prefix ++/--)';
      return;
    }
    // Unary `+`/`-`/`~` numeric coercion runs `Symbol.toPrimitive`/`valueOf` on a non-inert
    // operand exactly like a coercive binary operator (`+importedObj`), so it fails closed
    // too unless the operand is statically inert (`-1`, `~0`). (`!x` only tests truthiness —
    // no coercion hook — and `typeof`/`void` never coerce, so they are not flagged here.)
    if (
      ts.isPrefixUnaryExpression(node) &&
      (node.operator === ts.SyntaxKind.PlusToken ||
        node.operator === ts.SyntaxKind.MinusToken ||
        node.operator === ts.SyntaxKind.TildeToken) &&
      !isStaticallyInertOperand(node.operand)
    ) {
      bad = `unary coercion (${ts.SyntaxKind[node.operator]}) on a non-inert operand (runs Symbol.toPrimitive/valueOf eagerly)`;
      return;
    }
    // A template literal with substitutions coerces each substitution to a string at module
    // evaluation (`z.literal(\`${importedObj}\`)` runs the operand's `Symbol.toPrimitive`/
    // `toString`), yet carries no call to flag. Fail closed unless every substitution is
    // statically inert. A no-substitution template is a plain string literal (not a
    // `TemplateExpression`) and stays allowed. A TAGGED template is an eager invocation and
    // is classified by the tagged-template branch below.
    if (
      ts.isTemplateExpression(node) &&
      node.templateSpans.some((span) => !isStaticallyInertOperand(span.expression))
    ) {
      bad =
        'template-literal substitution on a non-inert operand (runs Symbol.toPrimitive/toString eagerly)';
      return;
    }
    if (ts.isPostfixUnaryExpression(node)) {
      bad = 'update (postfix ++/--)';
      return;
    }
    if (ts.isDeleteExpression(node)) {
      bad = 'delete';
      return;
    }
    // An eager SPREAD is an unreviewed side effect even when its operand is a plain
    // identifier: `{ ...proxy }` / `f(...args)` synchronously runs the operand's
    // getters/Proxy traps (ownKeys/getOwnPropertyDescriptor/get for an object spread,
    // the iterator protocol for a call/array spread) at module evaluation, yet carries
    // no call for the invocation classifier to flag — so without this branch
    // `z.object({ ...sideEffectingProxy })` passes as pure and a bundler can drop the
    // spread's effects with the schema. The spread's OPERAND is still visited below
    // (`ts.forEachChild` descends into `.expression`), so a call operand
    // (`{ ...makeSchema() }`) is classified on its own merits; the spread ITSELF fails
    // closed here because its evaluation semantics cannot be proven side-effect-free.
    // A spread inside a deferred callback is not eager and is skipped above.
    if (ts.isSpreadAssignment(node)) {
      bad = 'object spread (runs the operand’s getters/Proxy traps eagerly)';
      return;
    }
    if (ts.isSpreadElement(node)) {
      bad = 'call/array spread (runs the operand’s iterator protocol eagerly)';
      return;
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      // Classify EVERY eager call against the schema-constructor ALLOWLIST, not just the
      // outer initialiser chain. A nested call rooted at `z` is not automatically a
      // construction: `z.config(…)`, `z.globalRegistry.add(…)` / `z.registry().add(…)`
      // (e.g. inside `z.any().default(z.globalRegistry.add(…))`), and computed `z[key](…)`
      // all resolve to a `z` root yet are global mutations / unreviewed members, so they
      // would otherwise pass the `isReviewedRoot` check and be wrapped `/*#__PURE__*/`,
      // letting a bundler drop the eager mutation with the schema. Fail closed on them
      // exactly like the outer guard; only an allowlisted `z.<constructor>` continues.
      const nonSchema = nonSchemaNamespaceRoot(node);
      if (nonSchema !== null) {
        bad = nonSchema;
        return;
      }
      // A nested chain rooted at a PROVEN schema whose first member is a mutator
      // (`z.object({ v: zBase.register(registry, meta) })`) re-registers an existing schema
      // as an eager side effect. Its root is `zBase` (reviewed), so without this it would
      // pass the `isReviewedRoot` check and be wrapped `/*#__PURE__*/`, letting a bundler
      // drop the registration. Classify EVERY visited call — not just the outer initialiser
      // — through the same mutator guard so a nested one fails closed too. A computed first
      // member (`zBase[key](...)`) is not statically known and also fails closed here.
      const nestedMutator = unreviewedSchemaMethodRoot(node, schemaNames);
      if (nestedMutator !== null) {
        bad = nestedMutator;
        return;
      }
      const root = callChainRoot(node.expression);
      if (!isReviewedRoot(root)) {
        flag(root);
        return;
      }
    } else if (ts.isTaggedTemplateExpression(node)) {
      // A tagged template IS an eager invocation — `tag`...`` calls `tag` at module
      // evaluation — but it is not a CallExpression, so without this branch
      // `z.object({ v: tag`x` })` would be wrapped pure and a bundler could drop the
      // tag's side effect. Reject a tag that is a non-schema `z` member (`` z.config`x` ``)
      // via the same allowlist, then check the tag's chain root like a call root; its
      // substitutions are eager too and are visited below.
      const nonSchemaTag = nonSchemaZChainRoot(node.tag);
      if (nonSchemaTag !== null) {
        bad = nonSchemaTag;
        return;
      }
      // Same mutator guard for a tag rooted at a proven schema (`` zBase.register`x` ``):
      // its first member off the schema is a mutator, so it fails closed exactly like the
      // call form above rather than being wrapped pure.
      const tagMutator = unreviewedSchemaMethodRoot(node.tag, schemaNames);
      if (tagMutator !== null) {
        bad = tagMutator;
        return;
      }
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

/**
 * ALLOWLIST of reviewed zod namespace members that PRODUCE a schema, so a call chain
 * rooted at one of them (`z.object(...)`, `z.string()`, `z.coerce.number()`,
 * `z.iso.datetime()`) is a construction that may be wrapped `/*#__PURE__*\/`. This is an
 * allowlist, NOT a blacklist of known mutators: every direct `z` member that is NOT listed
 * here fails closed. A blacklist (e.g. just `globalRegistry`/`registry`) fails OPEN on any
 * member it has not yet enumerated — Zod 4's `z.config(...)` mutates global configuration,
 * `z.setErrorMap(...)` mutates the global error map, and a future zod version could add
 * more — so `export const x = z.config(...)` would be wrapped as droppable and a bundler
 * could drop the mutation while `x` stays referenced. The allowlist rejects the unreviewed
 * by default; a legitimately new schema factory fails the build with a clear message and is
 * added here deliberately after review.
 *
 * `coerce` and `iso` are sub-namespaces whose own members are schema factories
 * (`z.coerce.number()`, `z.iso.date()`); the FIRST member off `z` is `coerce`/`iso`, so
 * allowlisting those two covers the whole sub-namespace.
 */
const ZOD_SCHEMA_NAMESPACE_MEMBERS = new Set<string>([
  // Primitive / literal schema factories
  'string',
  'number',
  'bigint',
  'boolean',
  'date',
  'symbol',
  'undefined',
  'null',
  'void',
  'any',
  'unknown',
  'never',
  'nan',
  'literal',
  'enum',
  'nativeEnum',
  // Composite schema factories
  'object',
  'strictObject',
  'looseObject',
  'interface',
  'array',
  'tuple',
  'union',
  'discriminatedUnion',
  'intersection',
  'record',
  'partialRecord',
  'map',
  'set',
  'function',
  'lazy',
  'promise',
  // Numeric-format schema factories
  'int',
  'int32',
  'uint32',
  'int64',
  'uint64',
  'float32',
  'float64',
  // Wrappers / combinators that PRODUCE a schema
  'nullable',
  'optional',
  'nonoptional',
  'readonly',
  'templateLiteral',
  'custom',
  'instanceof',
  'preprocess',
  'pipe',
  'transform',
  'codec',
  'stringbool',
  'file',
  // String-format schema factories
  'email',
  'uuid',
  'guid',
  'url',
  'httpUrl',
  'emoji',
  'nanoid',
  'cuid',
  'cuid2',
  'ulid',
  'xid',
  'ksuid',
  'base64',
  'base64url',
  'base32',
  'jwt',
  'ascii',
  'utf8',
  'e164',
  'lowercase',
  'uppercase',
  'hex',
  'hostname',
  'ipv4',
  'ipv6',
  'cidrv4',
  'cidrv6',
  // Sub-namespaces whose members are schema factories (z.coerce.number(), z.iso.date())
  'coerce',
  'iso',
]);

/**
 * If `node`'s call/`new` chain is rooted at the `z` namespace but its first member off `z`
 * is NOT a reviewed schema-producing constructor (see `ZOD_SCHEMA_NAMESPACE_MEMBERS`),
 * returns a description of that offending root; otherwise returns `null`. This is the
 * allowlist complement: it fails closed on a global mutator/service (`z.config(...)`,
 * `z.globalRegistry.add(...)`, `z.registry().add(...)`, `z.setErrorMap(...)`), on an
 * unknown member a future zod version might add, and on a COMPUTED member (`z[key](...)`,
 * whose name is not statically known) — all of which would otherwise resolve to a `z` root
 * and be wrapped `/*#__PURE__*\/` as droppable.
 *
 * Only the chain's first `z` member is inspected, so a schema construction rooted at
 * `z.object`/`zFoo.extend` that merely PASSES `z.globalRegistry` as an argument
 * (`.register(z.globalRegistry, …)`) is unaffected: its root member is `object`/`extend`.
 * A chain rooted at a proven schema or a non-`z` identifier is handled by the caller.
 *
 * The walk handles element access (`z['globalRegistry'].add(...)`) the same as property
 * access, mirroring `callChainRoot`, and peels transparent wrappers before the `z` test, so
 * `(z).globalRegistry.add(...)` and ``z[`globalRegistry`].add(...)`` are recognised exactly
 * like their plain dot/bracket forms.
 */
function nonSchemaNamespaceRoot(node: ts.Expression): string | null {
  if (!ts.isCallExpression(node) && !ts.isNewExpression(node)) return null;
  const chain = node.expression;
  if (!chain) return null;
  return nonSchemaZChainRoot(chain);
}

/**
 * The allowlist walk shared by `nonSchemaNamespaceRoot` (call/`new` callees) and the
 * tagged-template branch of `findUnreviewedEagerCall` (the tag expression): given a chain
 * expression, returns a description when it is rooted at the `z` namespace but its first
 * member is NOT an allowlisted schema constructor (including a computed `z[key]`),
 * otherwise `null` (allowlisted member, or not rooted at `z`).
 */
function nonSchemaZChainRoot(chain: ts.Expression): string | null {
  const root = callChainRoot(chain);
  // A chain rooted at a proven schema (`zFoo.extend(...)`) or a non-`z` identifier is a
  // construction (or handled elsewhere); only a `z.<member>` root is classified here.
  if (!ts.isIdentifier(root) || root.text !== ZOD_NAMESPACE) return null;
  // Walk the member/call chain from the namespace to its first property: `z.object` →
  // `object` (allowlisted constructor), `z.config` → `config` (a mutator, rejected),
  // `z.globalRegistry` → `globalRegistry` (a service object, rejected). Element access with
  // a static string argument (`z['globalRegistry']`) names the same property as dot access;
  // a computed one (`z[key]`) is not statically known and fails closed.
  let cur: ts.Expression = chain;
  while (true) {
    if (ts.isCallExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    if (ts.isPropertyAccessExpression(cur)) {
      const base = peelTransparent(cur.expression);
      if (ts.isIdentifier(base) && base.text === ZOD_NAMESPACE) {
        return ZOD_SCHEMA_NAMESPACE_MEMBERS.has(cur.name.text)
          ? null
          : `${ZOD_NAMESPACE}.${cur.name.text}`;
      }
      cur = cur.expression;
      continue;
    }
    if (ts.isElementAccessExpression(cur)) {
      const base = peelTransparent(cur.expression);
      if (ts.isIdentifier(base) && base.text === ZOD_NAMESPACE) {
        const propName = staticElementName(cur.argumentExpression);
        // A computed member (`z[key]`) is not statically known: fail closed rather than
        // treat it as a schema constructor.
        if (propName === null) return `${ZOD_NAMESPACE}[computed]`;
        return ZOD_SCHEMA_NAMESPACE_MEMBERS.has(propName) ? null : `${ZOD_NAMESPACE}.${propName}`;
      }
      cur = cur.expression;
      continue;
    }
    if (ts.isParenthesizedExpression(cur) || ts.isNonNullExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    break;
  }
  return null;
}

/**
 * ALLOWLIST of reviewed proven-schema instance methods that PRODUCE or purely ANNOTATE a
 * schema, so a chain whose FIRST operation on a proven schema is one of these may be wrapped
 * `/*#__PURE__*\/`. This is an allowlist, NOT a blacklist of known mutators: every other
 * first method off a proven schema fails closed. A blacklist (e.g. just `register`) fails
 * OPEN on any effectful method it has not enumerated — `zBase.parse(importedValue)` /
 * `zBase.safeParse(...)` synchronously run refinements/transforms with required side effects,
 * decode/encode APIs do too, and a future zod version could add more — so
 * `export const parsed = zBase.parse(importedValue)` would be wrapped as droppable and a
 * bundler could drop the parse while `parsed` stays referenced. The allowlist rejects the
 * unreviewed by default; a legitimately new schema combinator fails the build with a clear
 * message and is added here deliberately after review. Mirrors the `z`-namespace allowlist
 * (`ZOD_SCHEMA_NAMESPACE_MEMBERS`) philosophy for the proven-schema case.
 *
 * Deliberately EXCLUDED (fail closed): the parse/validate family (`parse`, `parseAsync`,
 * `safeParse`, `safeParseAsync`, `spa`), codec execution (`decode`, `encode`, `decodeAsync`,
 * `encodeAsync`), and the registry mutator `register`.
 */
const SCHEMA_PURE_METHODS = new Set<string>([
  // Base wrappers / combinators / pure annotators
  'optional',
  'nullable',
  'nullish',
  'nonoptional',
  'array',
  'promise',
  'or',
  'and',
  'transform',
  'default',
  'prefault',
  'catch',
  'describe',
  'meta',
  'brand',
  'readonly',
  'pipe',
  'refine',
  'superRefine',
  'check',
  'overwrite',
  'clone',
  'unwrap',
  // Object combinators
  'extend',
  'merge',
  'pick',
  'omit',
  'partial',
  'required',
  'passthrough',
  'strict',
  'strip',
  'catchall',
  'keyof',
  'deepPartial',
  // Size / range / numeric constraints (produce a refined schema)
  'min',
  'max',
  'length',
  'size',
  'element',
  'nonempty',
  'gt',
  'gte',
  'lt',
  'lte',
  'int',
  'positive',
  'negative',
  'nonnegative',
  'nonpositive',
  'multipleOf',
  'step',
  'finite',
  'safe',
  // String-format / transform constraints
  'regex',
  'includes',
  'startsWith',
  'endsWith',
  'trim',
  'toLowerCase',
  'toUpperCase',
  'normalize',
  'lowercase',
  'uppercase',
  'email',
  'url',
  'httpUrl',
  'emoji',
  'nanoid',
  'cuid',
  'cuid2',
  'ulid',
  'uuid',
  'guid',
  'xid',
  'ksuid',
  'base64',
  'base64url',
  'base32',
  'jwt',
  'date',
  'time',
  'datetime',
  'duration',
  'ip',
  'ipv4',
  'ipv6',
  'cidr',
  'cidrv4',
  'cidrv6',
  'e164',
  'hostname',
  'hex',
  'ascii',
  'utf8',
  // Enum narrowing (produce a fresh schema / pure accessor)
  'exclude',
  'extract',
  'options',
]);

/**
 * If `chain` is rooted at a proven schema (`schemaNames`) whose FIRST member access is NOT a
 * reviewed pure combinator (see `SCHEMA_PURE_METHODS`), returns a description of that
 * offending member; otherwise returns `null`. This is the proven-schema complement of
 * `nonSchemaZChainRoot`: that guard allowlists a `z.<constructor>` root, this one allowlists
 * a `<provenSchema>.<combinator>` root — `zBase.register(z.globalRegistry, meta)` mutates the
 * already-built `zBase` and `zBase.parse(importedValue)` runs refinements/transforms, so
 * neither is a pure construction even though its root is a proven schema. A chain that first
 * DERIVES a fresh schema (`zBase.extend({…}).register(…)`) has the combinator `extend` as its
 * first member, so it is NOT flagged here and stays wrapped.
 */
function unreviewedSchemaMethodRoot(chain: ts.Expression, schemaNames: Set<string>): string | null {
  const root = callChainRoot(chain);
  // Only a chain rooted at a proven schema is classified here; a `z` root is handled by
  // `nonSchemaZChainRoot`, and any other identifier fails closed in the caller.
  if (!ts.isIdentifier(root) || root.text === ZOD_NAMESPACE || !schemaNames.has(root.text)) {
    return null;
  }
  // Walk from the root toward the outermost call to find the FIRST member off the schema:
  // `zBase.extend({…})` → `extend` (an allowlisted combinator, accepted); `zBase.parse(...)`
  // / `zBase.register(...)` → not allowlisted, rejected. Element access with a static string
  // argument (`zBase['parse'](...)`) names the same property; a COMPUTED one (`zBase[key]`)
  // is not statically known, so it fails closed here rather than being assumed safe.
  let cur: ts.Expression = chain;
  while (true) {
    if (ts.isCallExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    if (ts.isPropertyAccessExpression(cur)) {
      const base = peelTransparent(cur.expression);
      if (ts.isIdentifier(base) && schemaNames.has(base.text)) {
        return SCHEMA_PURE_METHODS.has(cur.name.text) ? null : `${base.text}.${cur.name.text}`;
      }
      cur = cur.expression;
      continue;
    }
    if (ts.isElementAccessExpression(cur)) {
      const base = peelTransparent(cur.expression);
      if (ts.isIdentifier(base) && schemaNames.has(base.text)) {
        const propName = staticElementName(cur.argumentExpression);
        if (propName !== null) {
          // Statically-known key: an allowlisted combinator is a construction; anything else
          // (a mutator/parse/unknown method) fails closed.
          return SCHEMA_PURE_METHODS.has(propName) ? null : `${base.text}.${propName}`;
        }
        // A COMPUTED first member off a proven schema (`zBase[key](...)`) is not statically
        // known to be a reviewed combinator — `key` could be `parse`/`register`. The hook
        // promises fail-closed behaviour, so reject it rather than assume it is safe to wrap.
        return `${base.text}[<computed>]`;
      }
      cur = cur.expression;
      continue;
    }
    if (ts.isParenthesizedExpression(cur) || ts.isNonNullExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    break;
  }
  return null;
}

/**
 * Peels the transparent wrappers — parentheses and non-null assertions — that do not
 * change which expression a member access is rooted at: `(z).globalRegistry` is rooted at
 * `z` exactly like `z.globalRegistry`. Used before testing whether a chain segment's base
 * is the zod namespace identifier, so a wrapped `z` is recognised like the bare one.
 */
function peelTransparent(expr: ts.Expression): ts.Expression {
  let cur: ts.Expression = expr;
  while (ts.isParenthesizedExpression(cur) || ts.isNonNullExpression(cur)) {
    cur = cur.expression;
  }
  return cur;
}

/**
 * The static property name an element access denotes, or `null` when it is not statically
 * known. A string literal (`['globalRegistry']`) names its text; a no-substitution template
 * literal (`` [`globalRegistry`] ``) names its literal text — both are exactly equivalent to
 * dot access. A computed expression (`z[key]`) or a template WITH substitutions
 * (`` z[`${k}`] ``) is not statically known and returns `null`.
 */
function staticElementName(arg: ts.Expression | undefined): string | null {
  if (arg === undefined) return null;
  if (ts.isStringLiteral(arg)) return arg.text;
  if (ts.isNoSubstitutionTemplateLiteral(arg)) return arg.text;
  return null;
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
