import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import ts from 'typescript';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * zod must only load when validation is enabled (issue #537).
 *
 * With validation off (the default, `req:none,res:none`) no zod code is needed at
 * runtime: generated operations `import()` their schemas only when validation is on.
 * So no module reachable through STATIC value imports from a public entry point may
 * import a value from `zod` — otherwise bundlers that cannot drop module-level imports
 * (e.g. Rollup) ship zod eagerly to every consumer.
 *
 * Class-scoped: walks the whole static import graph from every entry, so a value
 * import of zod anywhere on the eager path fails, not just the known sites.
 * Type-only imports/exports cost nothing at load time and are ignored. A dynamic
 * `import()` is ignored ONLY when it is deferred — nested inside a function/method body,
 * so it runs when the operation is called, not at module load. A TOP-LEVEL dynamic
 * `import()` (e.g. `void import('zod')` at module scope) executes eagerly at load, so it
 * is treated exactly like a static value import: a top-level `import('zod')` fails, and a
 * top-level `import('./local')` is followed into the graph.
 */

const root = join(__dirname, '..');
const ENTRIES = ['src/index.ts', 'src/fn/index.ts', 'src/logger.ts', 'src/effect/index.ts'];
const PLATFORM = ['src/runtime/platform/node.ts', 'src/runtime/platform/browser.ts'];

function resolveLocal(from: string, spec: string): string[] {
  if (spec === '#platform') return PLATFORM.map((p) => join(root, p));
  if (!spec.startsWith('.')) return [];
  const base = resolve(dirname(from), spec).replace(/\.(js|ts)$/, '');
  for (const c of [`${base}.ts`, join(base, 'index.ts')]) if (existsSync(c)) return [c];
  return [];
}

/** Static value-import specifiers found on a parsed module (type-only and dynamic
 *  imports excluded). */
function valueImports(sf: ts.SourceFile): string[] {
  const specs: string[] = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      const clause = st.importClause;
      if (clause?.isTypeOnly) continue;
      const nb = clause?.namedBindings;
      const onlyTypeNames =
        clause &&
        !clause.name &&
        nb &&
        ts.isNamedImports(nb) &&
        nb.elements.length > 0 &&
        nb.elements.every((e) => e.isTypeOnly);
      if (onlyTypeNames) continue;
      specs.push(st.moduleSpecifier.text);
    } else if (
      ts.isExportDeclaration(st) &&
      st.moduleSpecifier &&
      ts.isStringLiteral(st.moduleSpecifier) &&
      !st.isTypeOnly
    ) {
      const ec = st.exportClause;
      if (
        ec &&
        ts.isNamedExports(ec) &&
        ec.elements.length > 0 &&
        ec.elements.every((e) => e.isTypeOnly)
      )
        continue;
      specs.push(st.moduleSpecifier.text);
    }
  }
  return specs;
}

/**
 * Specifiers of dynamic `import()` calls on a parsed module that are evaluated at MODULE
 * LOAD — i.e. not nested inside any function-like body (function/arrow/method/constructor/
 * accessor), whose execution is deferred to call time. A top-level `void import('zod')`
 * immediately starts loading zod, so it is an eager import on the load path; a
 * `import('zod')` inside an operation function is lazy and excluded. Only
 * statically-known string specifiers are reported (a computed `import(expr)` cannot be
 * followed and is skipped).
 *
 * A function/arrow body defers its children ONLY when it is not immediately invoked. An
 * IIFE's body runs during module evaluation, so `void (async () => import('zod'))()` is an
 * EAGER zod load despite living in an arrow body — it must not be skipped as deferred, or
 * the gate would pass a module that eager-loads zod through an IIFE.
 */
function topLevelDynamicImports(sf: ts.SourceFile): string[] {
  const specs: string[] = [];
  const visit = (node: ts.Node, deferred: boolean): void => {
    // A function-like body defers execution to call time: imports inside it are lazy —
    // UNLESS the function is immediately invoked (an IIFE), whose body runs eagerly now.
    const defersChildren =
      (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isConstructorDeclaration(node) ||
        ts.isGetAccessorDeclaration(node) ||
        ts.isSetAccessorDeclaration(node)) &&
      !isImmediatelyInvoked(node);
    if (
      !deferred &&
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specs.push(node.arguments[0].text);
    }
    ts.forEachChild(node, (child) => visit(child, deferred || defersChildren));
  };
  visit(sf, false);
  return specs;
}

/**
 * True when `node` is a function/arrow expression that is IMMEDIATELY INVOKED — the callee
 * of an enclosing call, i.e. an IIFE such as `(() => …)()`, `(async () => …)()`, or
 * `(function () { … })()`. Its body executes during module evaluation, not at a later call,
 * so for the eager-import scan it must NOT be treated as a deferred (lazy) body. A function
 * DECLARATION is never a call callee, so it can never be an IIFE. Parentheses wrapping the
 * callee (`((() => …))()`) are peeled before testing identity against the call's callee.
 */
function isImmediatelyInvoked(node: ts.Node): boolean {
  if (!ts.isFunctionExpression(node) && !ts.isArrowFunction(node)) return false;
  let cur: ts.Node = node;
  while (cur.parent && ts.isParenthesizedExpression(cur.parent)) cur = cur.parent;
  const parent = cur.parent;
  return parent !== undefined && ts.isCallExpression(parent) && parent.expression === cur;
}

/** Specifiers imported EAGERLY at module load: static value imports plus top-level
 *  (non-deferred) dynamic `import()` calls. Parses the file ONCE and feeds both scans
 *  from the same SourceFile — the BFS visits every reachable file, so re-parsing per
 *  scan would double the gate's cost and push the largest entry past the test timeout. */
function eagerImports(file: string): string[] {
  const sf = parseOnce(file);
  return [...valueImports(sf), ...topLevelDynamicImports(sf)];
}

// Parse counting, for the regression guard below. parseOnce is the ONLY path that turns
// a file into a SourceFile for the eager-import scan, so incrementing here counts every
// parse the scan performs. (ts.createSourceFile is a getter-only ESM export and cannot be
// monkey-patched, so the count lives at this single call site instead.)
let parseCount = 0;
function parseOnce(file: string): ts.SourceFile {
  parseCount++;
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

function eagerZodImportersFrom(start: string): string[] {
  return scanEagerGraph(start).offenders;
}

/**
 * The single BFS over the eager-import graph, shared by the gate and the parse-count
 * regression guard so the two can never drift onto different traversals. Returns the
 * offender chains plus the number of distinct files visited (the reachable-graph size).
 */
function scanEagerGraph(start: string): { offenders: string[]; files: number } {
  const parent = new Map<string, string | undefined>([[start, undefined]]);
  const queue = [start];
  const offenders: string[] = [];
  while (queue.length) {
    const file = queue.shift() as string;
    for (const spec of eagerImports(file)) {
      if (spec === 'zod' || spec.startsWith('zod/')) {
        const chain: string[] = [];
        for (let f: string | undefined = file; f; f = parent.get(f))
          chain.unshift(relative(root, f));
        offenders.push(chain.join(' -> '));
        continue;
      }
      for (const next of resolveLocal(file, spec)) {
        if (parent.has(next)) continue;
        parent.set(next, file);
        queue.push(next);
      }
    }
  }
  return { offenders, files: parent.size };
}

function eagerZodImporters(entry: string): string[] {
  return eagerZodImportersFrom(join(root, entry));
}

/**
 * Regression guard (adversarial round 12): the eager-import scan must parse each
 * reachable file ONCE. An earlier version ran valueImports() and topLevelDynamicImports()
 * as two independent passes, each calling ts.createSourceFile per file — so every
 * reachable file was parsed twice (the second pass a full recursive AST descent), roughly
 * tripling the gate's cost and pushing the src/index.ts entry past the default 5000ms
 * vitest timeout under parallel load (measured 5316ms there; ~3.6s even isolated, vs ~1s
 * single-parse). A wall-clock budget is load-dependent, so this asserts the INVARIANT
 * directly: the number of parses during a scan equals the number of reachable files — a
 * double-parse regression yields exactly 2x and fails deterministically on any machine.
 */
function scanStats(entry: string): { files: number; parses: number } {
  parseCount = 0;
  const { files } = scanEagerGraph(join(root, entry));
  return { files, parses: parseCount };
}

describe('zod is not loaded eagerly', () => {
  // These two suites each run a full BFS over the real source graph, parsing every
  // reachable file (hundreds, once src/gen is present) with the TypeScript compiler. That
  // is inherently CPU-heavy, so under parallel suite load on a busy runner a correct scan
  // can exceed vitest's 5000ms default and time out (measured here, and on this file before
  // this change — it is load-dependent, not a logic signal). The timeout below is a SAFETY
  // NET to absorb runner contention, NOT a correctness assertion: correctness is asserted
  // by the parse-count invariant (`parses === files`) and the offender-list expectations,
  // which are deterministic on any machine. Do not tighten it back into a wall-clock race.
  const SCAN_TIMEOUT_MS = 60_000;

  for (const entry of ENTRIES) {
    it(
      `${entry}: no static value import of zod on the eager path`,
      () => {
        expect(eagerZodImporters(entry)).toEqual([]);
      },
      SCAN_TIMEOUT_MS
    );
  }

  // Regression (adversarial round 12): the eager-import scan must parse each reachable
  // file ONCE. See scanStats above — this asserts the parse-count invariant directly
  // (deterministic on any machine), not a load-dependent wall-clock budget.
  for (const entry of ENTRIES) {
    it(
      `${entry}: eager-import scan parses each reachable file exactly once`,
      () => {
        const { files, parses } = scanStats(entry);
        // A regression that re-parses per scan (e.g. valueImports + topLevelDynamicImports
        // each calling ts.createSourceFile) yields parses === 2 * files.
        expect(parses).toBe(files);
        expect(parses).toBeGreaterThan(0);
      },
      SCAN_TIMEOUT_MS
    );
  }
});

// Regression (Copilot round 11, previously-missed): the gate ignored EVERY dynamic
// `import()`, so a reachable module could run `void import('zod')` at top level — which
// immediately starts loading zod at module evaluation — yet pass. A dynamic import is lazy
// only when deferred inside a function body; a top-level one is as eager as a static value
// import. The walker now distinguishes the two: a top-level `import('zod')` fails and a
// top-level `import('./local')` is followed, while function-nested dynamic imports stay
// ignored.
describe('top-level (eager) dynamic imports', () => {
  let dir: string;
  const write = (rel: string, body: string): string => {
    const file = join(dir, rel);
    writeFileSync(file, body);
    return file;
  };

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'no-eager-zod-'));
  });
  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  // Helper: parse a written file once and return its top-level dynamic imports.
  const dynamicImportsOf = (file: string): string[] =>
    topLevelDynamicImports(
      ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    );

  it("reports a top-level `import('zod')` as eager", () => {
    const file = write('eager.ts', "void import('zod');\nexport const x = 1;\n");
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("ignores a dynamic `import('zod')` deferred inside a function body", () => {
    const file = write(
      'lazy.ts',
      "export async function op() {\n  const z = await import('zod');\n  return z;\n}\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('ignores a dynamic import inside an arrow-function body', () => {
    const file = write('arrow.ts', "export const op = async () => await import('zod');\n");
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  // Regression (Copilot round 12): a function/arrow body was treated as deferred even when
  // IMMEDIATELY INVOKED. An IIFE's body runs during module evaluation, so a dynamic import
  // inside one is EAGER — the gate must report it, not skip it as lazy.
  it("reports a top-level arrow IIFE `(async () => import('zod'))()` as eager", () => {
    const file = write(
      'iife-arrow.ts',
      "void (async () => import('zod'))();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports a top-level function-expression IIFE `(function(){ import('zod') })()` as eager", () => {
    const file = write(
      'iife-fn.ts',
      "void (function () {\n  import('zod');\n})();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports an IIFE wrapped in extra parentheses as eager', () => {
    const file = write('iife-parens.ts', "void ((() => import('zod')))();\nexport const x = 1;\n");
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report an import deferred inside a non-invoked arrow RETURNED from an IIFE', () => {
    // The outer arrow is an IIFE (eager body), but it merely RETURNS an inner arrow whose
    // body is still deferred to a later call — so the import stays lazy.
    const file = write(
      'iife-returns-lazy.ts',
      "void (() => () => import('zod'))();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('end-to-end: fails the gate on a top-level IIFE eager zod load', () => {
    const entry = write(
      'iife-entry.ts',
      "void (async () => import('zod'))();\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('skips a computed (non-literal) top-level dynamic import', () => {
    const file = write('computed.ts', 'const s = "zod";\nvoid import(s);\n');
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it("fails the gate end-to-end on a top-level `import('zod')` on the eager path", () => {
    const entry = write('entry.ts', "void import('zod');\nexport const y = 2;\n");
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('follows a top-level local dynamic import into the graph and catches eager zod', () => {
    write('mid.ts', "import * as z from 'zod';\nexport const schema = z.string();\n");
    const entry = write('entry2.ts', "void import('./mid');\nexport const q = 3;\n");
    // The top-level `import('./mid')` is eager, so its static `import 'zod'` is on the
    // load path and must be reported — proving top-level local dynamic imports are followed.
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('does NOT follow a function-deferred local dynamic import', () => {
    write('mid-lazy.ts', "import * as z from 'zod';\nexport const schema = z.string();\n");
    const entry = write(
      'entry3.ts',
      "export async function load() {\n  return await import('./mid-lazy');\n}\n"
    );
    expect(eagerZodImportersFrom(entry)).toEqual([]);
  });
});
