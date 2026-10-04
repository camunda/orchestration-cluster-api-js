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
  // Pre-pass: collect the names of locally-declared functions that are invoked ANYWHERE in
  // a module-evaluated top-level expression — `function load() {…}; load();`, but also
  // `const p = await load();`, `cond && load()`, `const x = (load(), 1);` or
  // `const xs = [load()];`. Such a call runs the function's body during module evaluation,
  // so a dynamic import inside that body is eager, not deferred. (The import lives in the
  // CALLEE's own body, not in a callback argument, so this is a separate shape from the
  // synchronous-iterator case handled below.) Recognising only a bare `name()` statement or
  // a bare `const p = name()` initialiser misses the wrapped forms — an `await load()`
  // initialiser is an AwaitExpression, not a CallExpression, so the callee is never recorded
  // and the body is wrongly treated as deferred. Walk each top-level statement's full
  // expression tree instead, recording EVERY bare-identifier call callee found; the walk
  // stops at function-like boundaries only when the body genuinely defers execution —
  // IIFEs, `.call`/`.apply`/invoked-`.bind` chains, and callbacks handed to known
  // synchronous callees run during module evaluation, so calls inside them are
  // module-evaluated too and the walk descends. A call nested inside any other
  // (non-invoked) function stays deferred.
  const topLevelCalledLocals = new Set<string>();
  const collectTopLevelCalls = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      topLevelCalledLocals.add(node.expression.text);
    }
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isConstructorDeclaration(node) ||
      ts.isGetAccessorDeclaration(node) ||
      ts.isSetAccessorDeclaration(node)
    ) {
      // A function-like boundary defers its body UNLESS the function runs during module
      // evaluation — an IIFE (incl. `new`/tagged/`.call`/`.apply`/invoked-`.bind` forms) or
      // a callback a known-synchronous callee invokes inline.
      if (!isImmediatelyInvoked(node) && !isSynchronouslyInvokedCallback(node)) return;
    }
    ts.forEachChild(node, collectTopLevelCalls);
  };
  for (const st of sf.statements) {
    collectTopLevelCalls(st);
  }
  const visit = (node: ts.Node, deferred: boolean): void => {
    // A function-like body defers execution to call time: imports inside it are lazy —
    // UNLESS the function is immediately invoked (an IIFE), whose body runs eagerly now, OR
    // it is a callback handed to a KNOWN-synchronous top-level callee (an array iterator
    // such as `[1].forEach(cb)`), OR it is a locally-declared function invoked directly at
    // top level — each of which runs the body during module evaluation.
    const isFunctionLike =
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isConstructorDeclaration(node) ||
      ts.isGetAccessorDeclaration(node) ||
      ts.isSetAccessorDeclaration(node);
    // A local invoked directly at top level runs its body during module evaluation, so its
    // children are eager. Two bindings carry such a local: a hoisted `function load() {…}`
    // (matched by its own name) AND a `const load = () => …` / `const load = function () {…}`
    // arrow/function-expression bound to a name (matched by the variable it is assigned to).
    // The pre-pass records the called name in `topLevelCalledLocals` for both shapes; matching
    // only `FunctionDeclaration` here would skip the arrow/expression body as deferred.
    const boundLocalName =
      ts.isArrowFunction(node) || ts.isFunctionExpression(node)
        ? boundVariableName(node)
        : undefined;
    const calledAtTopLevel =
      (ts.isFunctionDeclaration(node) &&
        node.name !== undefined &&
        topLevelCalledLocals.has(node.name.text)) ||
      (boundLocalName !== undefined && topLevelCalledLocals.has(boundLocalName));
    const defersChildren =
      isFunctionLike &&
      !isImmediatelyInvoked(node) &&
      !isSynchronouslyInvokedCallback(node) &&
      !calledAtTopLevel;
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
 * The name of a local variable to which `node` (a function/arrow expression) is directly
 * bound — `const load = () => …` / `let load = function () {…}` → 'load'. Parentheses around
 * the initializer (`const load = (() => …)`) are peeled. Returns undefined when the function
 * is not the initializer of a simple identifier binding (e.g. it is an argument, a property
 * value, or bound via a destructuring pattern). Pairs with the top-level-call pre-pass:
 * a bound local whose name is invoked at module load runs its body eagerly.
 */
function boundVariableName(node: ts.Node): string | undefined {
  let cur: ts.Node = node;
  while (cur.parent && ts.isParenthesizedExpression(cur.parent)) cur = cur.parent;
  const parent = cur.parent;
  if (
    parent !== undefined &&
    ts.isVariableDeclaration(parent) &&
    parent.initializer === cur &&
    ts.isIdentifier(parent.name)
  ) {
    return parent.name.text;
  }
  return undefined;
}

/**
 * The statically-known method name of a call's callee, resolved consistently across BOTH
 * member-access forms: `foo.bar` → 'bar' (property access) and `foo['bar']` /
 * `` foo[`bar`] `` → 'bar' (element access with a static string key). Returns null for a
 * dynamic/computed key (`foo[k]`) or a non-member callee. Mirrors `staticElementName` in
 * hooks/post/720-pure-zod-schemas.ts so method dispatch is detected the same whether written
 * in dot or bracket notation — otherwise the bracket form silently bypasses the gate.
 */
function calleeMethodName(callee: ts.Expression): string | null {
  if (ts.isPropertyAccessExpression(callee)) return callee.name.text;
  if (ts.isElementAccessExpression(callee)) {
    const arg = callee.argumentExpression;
    if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) return arg.text;
  }
  return null;
}

/**
 * True when `node` is a function/arrow expression that is IMMEDIATELY INVOKED — its body
 * executes during module evaluation, not at a later call. Recognised forms:
 *   - direct IIFE: `(() => …)()`, `(async () => …)()`, `(function () { … })()` — the
 *     function is the call's callee;
 *   - constructor IIFE: `new (function () { … })()` — a NewExpression runs the constructor
 *     body at module load;
 *   - tagged template: `` (async () => …)`tpl` `` — the function is invoked as the
 *     template's tag;
 *   - `.call` / `.apply` invocation: `(async () => …).call(thisArg)`, `(function () { …
 *     }).apply(null, args)` — the function is the base of a `.call`/`.apply` property access
 *     that is itself called. These run the body eagerly exactly like `()()`, so they must not
 *     be treated as deferred;
 *   - invoked `.bind` chain: `(async () => …).bind(thisArg)()` — `.bind(...)` only CREATES a
 *     bound function, but when that bound result is itself the callee of an enclosing call the
 *     body still runs at module load. An uninvoked `.bind(...)` (no trailing `()`) stays
 *     deferred and is NOT eager.
 * A function DECLARATION is never a call callee, so it can never be an IIFE. Parentheses
 * wrapping the callee (`((() => …))()`) are peeled before testing identity against the
 * call's callee. A function that is merely an ARGUMENT (`xs.forEach(() => …)`) or the base
 * of a non-invoking access (`(fn).name`) is NOT immediately invoked.
 */
function isImmediatelyInvoked(node: ts.Node): boolean {
  if (!ts.isFunctionExpression(node) && !ts.isArrowFunction(node)) return false;
  let cur: ts.Node = node;
  while (cur.parent && ts.isParenthesizedExpression(cur.parent)) cur = cur.parent;
  const parent = cur.parent;
  if (parent === undefined) return false;
  // Direct IIFE: the (paren-peeled) function is the call's callee.
  if (ts.isCallExpression(parent) && parent.expression === cur) return true;
  // Constructor IIFE: `new (function () { … })()` / `new (() => …)()` — a NewExpression whose
  // callee is the function executes the constructor body during module evaluation.
  if (ts.isNewExpression(parent) && parent.expression === cur) return true;
  // Tagged template: `` (async () => …)`tpl` `` invokes the function as the template's tag,
  // running its body at module load exactly like a call.
  if (ts.isTaggedTemplateExpression(parent) && parent.tag === cur) return true;
  // `.call` / `.apply` / `.bind` chain: the function is the base of `fn.call(...)`,
  // `fn.apply(...)`, or `fn.bind(...)` — in EITHER dot or bracket notation (`fn['call'](...)`).
  // `.call`/`.apply` invoke immediately; `.bind` only CREATES a bound function, so it is eager
  // only when the chain continues and is ultimately invoked. Walk the whole chain: each link
  // is a `.bind`/`.call`/`.apply` access over the previous result, followed by its `(...)`
  // call. The chain is eager iff it ends in an invocation — either a `.call`/`.apply` link
  // being called, or the final bound result being the callee of an enclosing CallExpression.
  if (
    (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)) &&
    parent.expression === cur
  ) {
    const name0 = calleeMethodName(parent);
    if (name0 === 'call' || name0 === 'apply' || name0 === 'bind') {
      // `access` is the current `.bind`/`.call`/`.apply` member access (property OR element)
      // whose base is the function (or the previous link's bound result). Loop invariant:
      // `access` is the member access of the link we are classifying.
      let access: ts.PropertyAccessExpression | ts.ElementAccessExpression = parent;
      for (;;) {
        const call = access.parent;
        // The access must be invoked: `fn.bind(a)` / `fn.call(a)` / `fn.apply(a)`.
        if (call === undefined || !ts.isCallExpression(call) || call.expression !== access) {
          return false;
        }
        const accessName = calleeMethodName(access);
        // `.call` / `.apply` run the body as soon as they are invoked — eager.
        if (accessName === 'call' || accessName === 'apply') return true;
        // `.bind(...)`: eager only if the bound result is itself invoked or chained into an
        // invocation. `next` is whatever consumes the bound function.
        const next = call.parent;
        if (next === undefined) return false;
        // Directly invoked bound result: `fn.bind(a)()`.
        if (ts.isCallExpression(next) && next.expression === call) return true;
        // Chained: `fn.bind(a).bind(b)…` / `fn.bind(a).call(b)` / `fn.bind(a).apply(b)` — keep
        // walking from the new access (either member-access form).
        if (
          (ts.isPropertyAccessExpression(next) || ts.isElementAccessExpression(next)) &&
          next.expression === call
        ) {
          const nextName = calleeMethodName(next);
          if (nextName === 'call' || nextName === 'apply' || nextName === 'bind') {
            access = next;
            continue;
          }
        }
        // Anything else (assigned, passed as an argument, a non-invoking access) stays deferred.
        return false;
      }
    }
  }
  return false;
}

/**
 * Callees that invoke their callback argument SYNCHRONOUSLY, before they return — so a
 * callback's body runs during the enclosing module's evaluation, exactly like an IIFE.
 * Array iteration methods are the canonical case: `[1].forEach(cb)`, `xs.map(cb)`,
 * `xs.filter(cb)`, … run `cb` once per element, in-line. A callback passed to one of these
 * at the top level is NOT deferred, so a dynamic import inside it is eager.
 *
 * Conservative by design: only these statically-known synchronous iterators are treated as
 * eager. Known-async schedulers (`setTimeout`, `Promise.resolve().then`, `addEventListener`,
 * …) and every unknown callee keep their callbacks deferred — the gate errs toward not
 * flagging a pattern it cannot prove is synchronous, so it never false-positives on a
 * genuinely lazy load.
 */
const SYNC_ITERATOR_METHODS = new Set([
  'forEach',
  'map',
  'filter',
  'reduce',
  'reduceRight',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'some',
  'every',
  'flatMap',
]);

/**
 * True when `node` is a function/arrow passed as an ARGUMENT to a call whose callee runs it
 * SYNCHRONOUSLY during module evaluation — so its body is eager, not deferred. Two
 * statically-provable shapes: a known synchronous iterator method (`[1].forEach(() => …)`,
 * `xs.map(function () {…})` — in EITHER dot or bracket notation, `xs['forEach'](cb)`), and
 * the `new Promise(executor)` constructor, whose executor runs inline during construction
 * (`new Promise(() => import('zod'))` loads Zod eagerly). A `.bind(...)` chain wrapping the
 * callback does not defer it — binding changes `this`, not WHEN the body runs — so a bound
 * callback handed to either shape (`[1].forEach(cb.bind(x))`) is eager too. Anything else (a
 * method call we cannot prove synchronous, an async scheduler, a callback stored for later,
 * a direct call of an opaque local function) stays deferred — the gate errs toward not
 * flagging a pattern it cannot prove is eager.
 */
function isSynchronouslyInvokedCallback(node: ts.Node): boolean {
  if (!ts.isFunctionExpression(node) && !ts.isArrowFunction(node)) return false;
  let cur: ts.Node = node;
  while (cur.parent && ts.isParenthesizedExpression(cur.parent)) cur = cur.parent;
  // Peel a `.bind(...)` chain: `fn.bind(a)`, `fn.bind(a).bind(b)`, … each produce a bound
  // function that is STILL a function value. Binding only changes `this`, NOT when the body
  // runs — so when such a bound result is then passed to a synchronous callee (a sync
  // iterator or a `new Promise` executor, tested below) its body runs during module
  // evaluation exactly like the un-bound callback. Trace through every `.bind` link so the
  // final bound value is tested against the callee. `.call`/`.apply` are NOT peeled here:
  // they invoke the body immediately and are handled by `isImmediatelyInvoked`. A `.bind`
  // chain that is itself invoked (`fn.bind(a)()`) is likewise an IIFE handled there, so the
  // loop stops before an invoking `()` (that `()` is a CallExpression whose callee is the
  // `.bind(...)` result, not a further `.bind` access) and leaves it to that helper.
  for (;;) {
    const access = cur.parent;
    if (
      access === undefined ||
      !(ts.isPropertyAccessExpression(access) || ts.isElementAccessExpression(access)) ||
      access.expression !== cur ||
      calleeMethodName(access) !== 'bind'
    ) {
      break;
    }
    const call = access.parent;
    if (call === undefined || !ts.isCallExpression(call) || call.expression !== access) break;
    cur = call;
    while (cur.parent && ts.isParenthesizedExpression(cur.parent)) cur = cur.parent;
  }
  const parent = cur.parent;
  if (parent === undefined) return false;
  // `new Promise(executor)`: the Promise constructor runs its executor SYNCHRONOUSLY during
  // construction, so a dynamic import inside `new Promise(() => import('zod'))` is eager and
  // starts loading Zod at module evaluation. Only the FIRST argument (the executor) runs
  // synchronously, and only for the global `Promise` identifier — a shadowed/other
  // constructor is not statically provable and stays deferred.
  if (
    ts.isNewExpression(parent) &&
    ts.isIdentifier(parent.expression) &&
    parent.expression.text === 'Promise' &&
    parent.arguments !== undefined &&
    parent.arguments.length > 0 &&
    parent.arguments[0] === cur
  ) {
    return true;
  }
  // The function must be an argument of a call: `callee(…, fn, …)`.
  if (!ts.isCallExpression(parent)) return false;
  if (!parent.arguments.some((arg) => arg === cur)) return false;
  // `[1].forEach(cb)` / `xs.map(cb)` / `xs['forEach'](cb)`: a known synchronous iterator
  // method, resolved the same whether written in dot or bracket notation.
  const method = calleeMethodName(parent.expression);
  return method !== null && SYNC_ITERATOR_METHODS.has(method);
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

  // Regression (Copilot round 13): the IIFE check only recognised a function used DIRECTLY
  // as a call's callee. `(async () => import('zod')).call(undefined)` and
  // `(function () { … }).apply(null, [])` invoke the body at module load just like `()()`,
  // but the function's parent is a property access (`.call`/`.apply`), so the gate returned
  // false and skipped the eager import. Recognise immediate invocation through `.call` /
  // `.apply` (and `.bind` chains that are then invoked) as eager.
  it("reports `(async () => import('zod')).call(undefined)` as eager", () => {
    const file = write(
      'iife-call.ts',
      "void (async () => import('zod')).call(undefined);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(function () { import('zod') }).apply(null)` as eager", () => {
    const file = write(
      'iife-apply.ts',
      "void (function () {\n  import('zod');\n}).apply(null);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod')).call(this)` (thisArg variant) as eager", () => {
    const file = write(
      'iife-call-this.ts',
      "void (async () => import('zod')).call(this);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod')).bind(null)()` (invoked `.bind` chain) as eager", () => {
    // `.bind(null)` returns a new function; the trailing `()` invokes it, so the body runs at
    // module load exactly like `()()` — the gate must not treat the import as deferred.
    const file = write(
      'iife-bind.ts',
      "void (async () => import('zod')).bind(null)();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(function () { import('zod') }).bind(null)()` (function-expression invoked `.bind`) as eager", () => {
    const file = write(
      'iife-bind-fn.ts',
      "void (function () {\n  import('zod');\n}).bind(null)();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report an import inside a `.bind` chain that is NOT invoked', () => {
    // `.bind(null)` merely creates a bound function; without a trailing `()` the body stays
    // deferred, so the import is lazy.
    const file = write(
      'not-iife-bind-uninvoked.ts',
      "const f = (async () => import('zod')).bind(null);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it("reports `(async () => import('zod')).bind(null).call(undefined)` (mixed `.bind`→`.call`) as eager", () => {
    // The bound function is invoked via `.call`, so the body runs at module load.
    const file = write(
      'iife-bind-call.ts',
      "void (async () => import('zod')).bind(null).call(undefined);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod')).bind(null).bind(null)()` (chained `.bind` then invoked) as eager", () => {
    const file = write(
      'iife-bind-bind.ts',
      "void (async () => import('zod')).bind(null).bind(null)();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod')).bind(null).apply(null)` (mixed `.bind`→`.apply`) as eager", () => {
    const file = write(
      'iife-bind-apply.ts',
      "void (async () => import('zod')).bind(null).apply(null);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports an import inside a `.bind` chain passed to a sync iterator (invoked) as eager', () => {
    // `forEach` invokes the bound callback SYNCHRONOUSLY during module evaluation — binding
    // changes `this`, not WHEN the body runs — so the `import('zod')` is eager. The `.bind`
    // wrapper must not hide the callback from the sync-iterator eager check (Copilot round 16).
    const file = write(
      'iife-bind-forEach.ts',
      "[1].forEach((async () => import('zod')).bind(null));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a chained `.bind` callback passed to a sync iterator as eager', () => {
    const file = write(
      'iife-bind-bind-forEach.ts',
      "[1].forEach((() => import('zod')).bind(null).bind(null));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a `.bind` callback passed to a bracket-notation sync iterator as eager', () => {
    const file = write(
      'iife-bind-forEach-bracket.ts',
      "[1]['forEach']((() => import('zod')).bind(null));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a `.bind` executor passed to `new Promise` as eager', () => {
    const file = write(
      'iife-bind-promise.ts',
      "void new Promise((() => import('zod')).bind(null));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report a `.bind` chain assigned to a variable (never invoked)', () => {
    // The bound function is stored, not handed to a synchronous callee — the body stays deferred.
    const file = write(
      'not-iife-bind-assigned.ts',
      "const f = (async () => import('zod')).bind(null);\nexport const x = f;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('does NOT report a `.bind` callback passed to an async scheduler (setTimeout)', () => {
    // `setTimeout` defers its callback; binding does not make it synchronous, so the import is lazy.
    const file = write(
      'not-iife-bind-settimeout.ts',
      "setTimeout((() => import('zod')).bind(null), 0);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  // Regression (Copilot round 14, previously-missed): the deferred-body rule treated EVERY
  // callback argument as deferred, but a function passed to a SYNCHRONOUSLY-invoking
  // top-level call runs during module evaluation. `[1].forEach(() => import('zod'))`
  // invokes its callback before `forEach` returns, so the import is EAGER — yet the gate
  // marked the arrow deferred and passed. The same bypass exists for `.map`/`.filter`/…
  // and for a locally declared function called at top level. The gate now treats a
  // callback to a KNOWN-synchronous callee (array iterators, a direct top-level call of a
  // local function) as eager, while known-async schedulers (setTimeout, .then,
  // addEventListener) stay deferred.
  it("reports `[1].forEach(() => import('zod'))` (synchronous callback) as eager", () => {
    const file = write(
      'sync-foreach.ts',
      "[1].forEach(() => import('zod'));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `[1].map(() => import('zod'))` (synchronous map callback) as eager", () => {
    const file = write('sync-map.ts', "[1].map(() => import('zod'));\nexport const x = 1;\n");
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a locally declared function called at top level as eager', () => {
    const file = write(
      'sync-local-call.ts',
      "function load() {\n  return import('zod');\n}\nvoid load();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  // Regression (adversarial, round 14): the top-level-call pre-pass recorded the called name
  // for `const load = () => …; load();`, but the deferral check only treated a
  // FunctionDeclaration as called-at-top-level — so an arrow or function EXPRESSION bound to
  // that same name still had its body skipped as deferred, eager-loading zod past the gate.
  // Match the binding (via `boundVariableName`), not only the FunctionDeclaration shape.
  it('reports a const-bound arrow called at top level as eager', () => {
    const file = write(
      'sync-const-arrow-call.ts',
      "const load = () => import('zod');\nload();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a const-bound function expression called at top level as eager', () => {
    const file = write(
      'sync-const-fnexpr-call.ts',
      "const load = function () {\n  return import('zod');\n};\nvoid load();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a const-bound arrow invoked via a top-level initializer call as eager', () => {
    const file = write(
      'sync-const-arrow-init-call.ts',
      "const load = () => import('zod');\nconst p = load();\nexport const x = p;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  // Regression (Copilot round 17): the top-level-call pre-pass only recognised a bare
  // `name();` statement or a bare `const p = name()` initialiser. A local loader invoked
  // INSIDE a larger module-evaluated expression — `const p = await load();` (the
  // initialiser is an AwaitExpression, not a CallExpression), `cond && load()`,
  // `(load(), 1)`, `[load()]` — was never recorded, so the loader's body was treated as
  // deferred and its top-level `import('zod')` passed the gate even though the call runs
  // during module evaluation. The pre-pass now walks each top-level statement's full
  // expression tree and records every bare-identifier call callee.
  it('reports a local loader invoked via a top-level `await load()` initialiser as eager', () => {
    const file = write(
      'sync-await-load.ts',
      "async function load() {\n  return import('zod');\n}\nconst p = await load();\nexport const x = p;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a local loader invoked in a top-level conditional expression as eager', () => {
    const file = write(
      'sync-cond-load.ts',
      "declare const flag: boolean;\nfunction load() {\n  return import('zod');\n}\nconst p = flag && load();\nexport const x = p;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a local loader invoked in a top-level comma expression as eager', () => {
    const file = write(
      'sync-comma-load.ts',
      "function load() {\n  return import('zod');\n}\nconst p = (load(), 1);\nexport const x = p;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a local loader invoked inside a top-level array/object literal as eager', () => {
    const file = write(
      'sync-literal-load.ts',
      "function load() {\n  return import('zod');\n}\nconst xs = [load()];\nexport const x = xs;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('end-to-end: fails the gate on a wrapped-initializer eager zod load', () => {
    const entry = write(
      'sync-await-load-entry.ts',
      "async function load() {\n  return import('zod');\n}\nconst p = await load();\nexport const y = p;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('does NOT report a local loader invoked only inside a nested (deferred) function', () => {
    // `load` is called inside `later`, which is never invoked at module load — the call is
    // not module-evaluated, so the import stays deferred.
    const file = write(
      'deferred-nested-call.ts',
      "function load() {\n  return import('zod');\n}\nexport function later() {\n  return load();\n}\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('does NOT report a local loader invoked only inside a deferred callback argument', () => {
    // The call sits inside a `setTimeout` callback: the callback body is deferred, so the
    // `load()` call (and its import) never runs at module evaluation.
    const file = write(
      'deferred-callback-call.ts',
      "function load() {\n  return import('zod');\n}\nsetTimeout(() => load(), 0);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('reports a local loader invoked inside a top-level IIFE body as eager', () => {
    // The IIFE body runs during module evaluation, so the `load()` call inside it is
    // module-evaluated and the loader's import is eager.
    const file = write(
      'sync-iife-nested-load.ts',
      "function load() {\n  return import('zod');\n}\nvoid (() => {\n  load();\n})();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('reports a local loader invoked inside a sync-iterator callback as eager', () => {
    // `forEach` runs its callback synchronously during module evaluation, so the `load()`
    // call inside the callback is module-evaluated.
    const file = write(
      'sync-iterator-nested-load.ts',
      "function load() {\n  return import('zod');\n}\n[1].forEach(() => {\n  load();\n});\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report a const-bound arrow that is never invoked', () => {
    const file = write(
      'deferred-const-arrow.ts',
      "const load = () => import('zod');\nexport const x = load;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  // Regression (adversarial, round 14): `isSynchronouslyInvokedCallback` only recognised a
  // PropertyAccess callee, so the computed-member form `[1]['forEach'](() => import('zod'))`
  // bypassed the gate even though it is identical to `[1].forEach(...)`. Resolve the method
  // name through `calleeMethodName`, which handles both dot and static-key bracket notation.
  it("reports `[1]['forEach'](() => import('zod'))` (bracket-notation sync callback) as eager", () => {
    const file = write(
      'sync-foreach-bracket.ts',
      "[1]['forEach'](() => import('zod'));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod'))['call'](undefined)` (bracket-notation `.call`) as eager", () => {
    const file = write(
      'iife-bracket-call.ts',
      "(async () => import('zod'))['call'](undefined);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `(async () => import('zod'))['bind'](null)()` (bracket-notation invoked `.bind`) as eager", () => {
    const file = write(
      'iife-bracket-bind.ts',
      "(async () => import('zod'))['bind'](null)();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `[1].filter(() => import('zod'))` and reduces (other sync iterators) as eager", () => {
    const file = write('sync-filter.ts', "[1].filter(() => import('zod'));\nexport const x = 1;\n");
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report an import inside a `setTimeout` callback (async scheduler stays deferred)', () => {
    const file = write(
      'async-settimeout.ts',
      "setTimeout(() => import('zod'), 0);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  // Regression (Copilot round 14, inline): the IIFE check only recognised a function whose
  // parent is a CallExpression. Two more contexts run the body at module load but were
  // missed: `new (function () { import('zod') })()` (a NewExpression executes the
  // constructor body eagerly) and `` (async () => import('zod'))`tag` `` (a tagged template
  // invokes the function as its tag). Recognise NewExpression and TaggedTemplateExpression
  // as immediate-invocation contexts.
  it("reports `void new (function () { import('zod') })()` (constructor IIFE) as eager", () => {
    const file = write(
      'iife-new.ts',
      "void new (function () {\n  import('zod');\n})();\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `new (() => import('zod'))()` (arrow constructor) as eager", () => {
    const file = write('iife-new-arrow.ts', "new (() => import('zod'))();\nexport const x = 1;\n");
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports a tagged-template invocation `` (async () => import('zod'))`tpl` `` as eager", () => {
    const file = write(
      'iife-tagged.ts',
      "void (async () => import('zod'))`tpl`;\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('end-to-end: fails the gate on a constructor-IIFE eager zod load', () => {
    const entry = write(
      'iife-new-entry.ts',
      "void new (function () {\n  import('zod');\n})();\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  // Regression (Copilot round 15, inline): `new Promise(executor)` runs its executor
  // SYNCHRONOUSLY during construction, so `new Promise(() => import('zod'))` starts loading
  // Zod at module evaluation. The arrow is an ARGUMENT of a NewExpression, so neither the
  // immediate-invocation nor the sync-iterator helper recognised it — the gate missed the
  // eager import. The Promise executor is now treated as a synchronously-invoked callback.
  it("reports `new Promise(() => import('zod'))` (Promise executor) as eager", () => {
    const file = write(
      'sync-promise-executor.ts',
      "new Promise(() => import('zod'));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it("reports `new Promise((res, rej) => { import('zod'); })` (two-arg executor) as eager", () => {
    const file = write(
      'sync-promise-executor-args.ts',
      "new Promise((res, rej) => {\n  void rej;\n  import('zod').then(res);\n});\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual(['zod']);
  });

  it('does NOT report an import deferred inside the Promise executor via a nested callback', () => {
    // The executor runs sync, but the import is nested in a `setTimeout` callback the
    // executor merely schedules — it stays deferred, so the gate must not flag it.
    const file = write(
      'promise-executor-deferred.ts',
      "new Promise(() => {\n  setTimeout(() => import('zod'), 0);\n});\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('end-to-end: fails the gate on a Promise-executor eager zod load', () => {
    const entry = write(
      'sync-promise-entry.ts',
      "new Promise(() => import('zod'));\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('does NOT report an import inside a `Promise.resolve().then` callback (microtask stays deferred)', () => {
    const file = write(
      'async-then.ts',
      "Promise.resolve().then(() => import('zod'));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('does NOT report an import inside an `addEventListener` callback (event stays deferred)', () => {
    const file = write(
      'async-event.ts',
      "window.addEventListener('load', () => import('zod'));\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
  });

  it('end-to-end: fails the gate on a synchronous-callback eager zod load', () => {
    const entry = write(
      'sync-foreach-entry.ts',
      "[1].forEach(() => import('zod'));\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('end-to-end: fails the gate on a `.bind`-invoked eager zod load', () => {
    const entry = write(
      'iife-bind-entry.ts',
      "void (async () => import('zod')).bind(null)();\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('end-to-end: fails the gate on a `.call`-invoked eager zod load', () => {
    const entry = write(
      'iife-call-entry.ts',
      "void (async () => import('zod')).call(undefined);\nexport const y = 2;\n"
    );
    expect(eagerZodImportersFrom(entry)).not.toEqual([]);
  });

  it('does NOT report an import inside a non-invoked function passed as a `.call` argument', () => {
    // The arrow is an ARGUMENT to an async scheduler, not the callee of `.call` — it stays
    // deferred. (A synchronous callee like `forEach` WOULD run it eagerly; that is the
    // separate regression covered above, so this uses `setTimeout`, which genuinely defers.)
    const file = write(
      'not-iife-call-arg.ts',
      "setTimeout(() => import('zod'), 0);\nexport const x = 1;\n"
    );
    expect(dynamicImportsOf(file)).toEqual([]);
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
