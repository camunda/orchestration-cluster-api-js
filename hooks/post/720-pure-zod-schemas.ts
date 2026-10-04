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
 * A call initialiser is only accepted — and wrapped — when the root of its call chain
 * is the `z` namespace or a schema reference declared in this module; any other call
 * (which could carry a required side effect) is reported as unreviewed rather than
 * being blindly marked pure.
 *
 * Idempotent: already-wrapped initialisers are left untouched.
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
          if (isPureIife(init)) {
            // Already wrapped (idempotent rerun): it was proven a schema when first wrapped.
            if (ts.isIdentifier(decl.name)) schemaNames.add(decl.name.text);
            continue;
          }
          if (!isRecognizedSchemaCall(init, schemaNames)) {
            // Fail closed: an unrecognised call could have a required side effect, so
            // do NOT mark it pure — report it so the hook is extended deliberately.
            problems.push(
              `${decl.name.getText(sf)}: initialiser is a call whose chain is not rooted at the zod namespace or a schema reference — ${init.getText(sf).slice(0, 120)}`
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

function isPureIife(call: ts.CallExpression): boolean {
  if (call.arguments.length !== 0) return false;
  const callee = call.expression;
  if (!ts.isParenthesizedExpression(callee) || !ts.isArrowFunction(callee.expression)) return false;
  const full = call.getFullText();
  return /\/\*#__PURE__\*\/\s*\($/.test(full.slice(0, full.indexOf('(') + 1));
}

/**
 * A call initialiser is a recognised zod schema construction only when the root of its
 * call/property-access chain is the `z` namespace or a schema already proven pure in this
 * module. Walking to the leftmost expression rejects chains rooted at an arbitrary call
 * (`makeThing()(...)`) or an unknown identifier (`sideEffect(...)`), which could carry a
 * required side effect that must not be silently marked pure. `schemaNames` holds only
 * proven schema constructions — never an arbitrary module-level const — so a chain rooted
 * at a non-schema const fails closed.
 */
function isRecognizedSchemaCall(init: ts.CallExpression, schemaNames: Set<string>): boolean {
  let cur: ts.Expression = init;
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
  if (!ts.isIdentifier(cur)) return false;
  return cur.text === ZOD_NAMESPACE || schemaNames.has(cur.text);
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
