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
 * zod-augment retention statement, `export const` with a call or identifier
 * initialiser) fails the build, so a generator change cannot silently reintroduce
 * module-level side effects.
 *
 * Idempotent: already-wrapped initialisers are left untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ZOD_PATH = path.join(process.cwd(), 'src/gen/zod.gen.ts');
const PURE_IIFE_PREFIX = '/*#__PURE__*/ (() => ';

export function wrapSchemaInitialisers(src: string, fileName = 'zod.gen.ts'): string {
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, true);
  const edits: { start: number; end: number; text: string }[] = [];
  const problems: string[] = [];

  // Reviewed call-chain roots: the zod namespace (`import * as z from 'zod'`) and every
  // exported `z*` schema const in this file (schemas build on one another, e.g.
  // `zChild = zParent.extend(...)`). A call initialiser is only droppable-by-annotation if
  // its chain is rooted at one of these — otherwise an upstream
  // `export const zBootstrap = registerGlobalState()` would be marked pure despite its side
  // effect, defeating the hook's fail-closed promise.
  const schemaRoots = collectSchemaRoots(sf);

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
      // This hook has only reviewed exported zod schema declarations (`export const zX = …`).
      // Anything else — an internal `const registry = initialize()`, a non-`z*` export — is
      // unreviewed: fail fast rather than silently mark a potential side effect droppable.
      const isExported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
      for (const decl of st.declarationList.declarations) {
        const name = decl.name.getText(sf);
        if (!isExported || !name.startsWith('z')) {
          problems.push(`unreviewed const declaration: ${st.getText(sf).slice(0, 120)}`);
          continue;
        }
        const init = decl.initializer;
        if (!init || ts.isIdentifier(init)) continue; // alias: no side effect
        if (ts.isCallExpression(init)) {
          if (isPureIife(init)) continue; // already wrapped (idempotent rerun)
          // Validate every *eagerly* evaluated call in the initialiser, not just the outer
          // chain root: a nested argument such as `z.object({ v: registerGlobalState() })`
          // is rooted at `z` at the top but still runs `registerGlobalState()` at module
          // evaluation, and the pure IIFE would let a bundler drop that side effect. Calls
          // inside deferred callback bodies (e.g. `z.lazy(() => …)`) are skipped — they run
          // later, not at module load.
          const unreviewed = findUnreviewedEagerCallRoot(init, schemaRoots);
          if (unreviewed !== null) {
            problems.push(`${name}: unreviewed call-chain root ${unreviewed}`);
            continue;
          }
          const exprText = init.getText(sf);
          edits.push({
            start: init.getStart(sf),
            end: init.getEnd(),
            text: `${PURE_IIFE_PREFIX}${exprText})()`,
          });
          continue;
        }
        problems.push(`${name}: initialiser kind ${ts.SyntaxKind[init.kind]}`);
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

function isPureIife(call: ts.CallExpression): boolean {
  if (call.arguments.length !== 0) return false;
  const callee = call.expression;
  if (!ts.isParenthesizedExpression(callee) || !ts.isArrowFunction(callee.expression)) return false;
  const full = call.getFullText();
  return /\/\*#__PURE__\*\/\s*\($/.test(full.slice(0, full.indexOf('(') + 1));
}

/** Names of exported `z*` schema consts — the reviewed roots a schema call chain may build on. */
function collectSchemaRoots(sf: ts.SourceFile): Set<string> {
  const roots = new Set<string>();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st) || !(st.declarationList.flags & ts.NodeFlags.Const)) continue;
    const isExported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    if (!isExported) continue;
    for (const decl of st.declarationList.declarations) {
      const name = decl.name.getText(sf);
      if (name.startsWith('z')) roots.add(name);
    }
  }
  return roots;
}

/** Leftmost identifier a call/member chain is rooted at (e.g. `z` in `z.object(...).register(...)`). */
function callChainRoot(expr: ts.Expression): ts.Expression {
  let node: ts.Expression = expr;
  for (;;) {
    if (
      ts.isCallExpression(node) ||
      ts.isPropertyAccessExpression(node) ||
      ts.isElementAccessExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isParenthesizedExpression(node)
    ) {
      node = node.expression;
    } else {
      return node;
    }
  }
}

/**
 * Returns the root name of the first *eagerly evaluated* call/`new` expression inside
 * `init` whose chain is NOT rooted at the zod namespace (`z`) or a reviewed schema, or
 * `null` if every eager call is reviewed.
 *
 * Wrapping an initialiser in `/*#__PURE__*\/ (() => …)()` tells bundlers the whole
 * expression — including every call it evaluates at module load — is side-effect free and
 * droppable. The outer chain root alone is therefore not enough: a nested eager argument
 * (`z.object({ v: registerGlobalState() })`) would be silently dropped with the schema.
 * Traverse the whole initialiser, but stop at deferred callback bodies (arrow/function
 * expressions such as `z.lazy(() => …)` or `.refine((v) => …)`) — those run when the
 * callback is invoked, not at module evaluation, so calls inside them are not eager side
 * effects.
 */
function findUnreviewedEagerCallRoot(init: ts.Expression, schemaRoots: Set<string>): string | null {
  let bad: string | null = null;
  const visit = (node: ts.Node): void => {
    if (bad !== null) return;
    // Deferred callback bodies evaluate later, not at module load: do not descend.
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return;
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const root = callChainRoot(node.expression);
      if (!ts.isIdentifier(root) || !(root.text === 'z' || schemaRoots.has(root.text))) {
        bad = ts.isIdentifier(root) ? root.text : ts.SyntaxKind[root.kind];
        return;
      }
    }
    if (ts.isTaggedTemplateExpression(node)) {
      // A tagged template IS an eager invocation — `tag\`...\`` calls `tag` at module
      // evaluation — but it is not a CallExpression, so without this branch
      // `z.object({ v: registerGlobalStateTag\`x\` })` would be wrapped as pure and a bundler
      // could drop the tag's module-initialization side effect. Check the tag's chain root
      // exactly like a call root; the substitutions are eager too and are visited below.
      const root = callChainRoot(node.tag);
      if (!ts.isIdentifier(root) || !(root.text === 'z' || schemaRoots.has(root.text))) {
        bad = ts.isIdentifier(root) ? root.text : ts.SyntaxKind[root.kind];
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(init);
  return bad;
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
