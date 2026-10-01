import fs from 'node:fs';
import path from 'node:path';

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
// Policy: every top-level `const x = call(...)` / `new X(...)` in the scanned
// files must have its callee in PURE_CALLEES (then it is annotated) or in
// BUNDLER_KNOWN_PURE (bundlers already treat it as pure). Anything else FAILS the
// pipeline, so a new top-level call introduced by a generator upgrade gets a
// human decision instead of silently re-breaking tree-shaking.
//
// The callee may start on a later line than the declaration (`const x =\n
// createClient(...)` is a shape the generator's formatter can emit), so detection
// tolerates whitespace — including newlines — between `=` and the callee, and the
// nested-call pass spans the whole initialiser statement. Anything else would be
// fail-open: a formatting change would bypass both annotation and the gate.
// Guarded end-to-end by scripts/check-tree-shaking.mjs.

const root = process.cwd();
const GEN_DIR = path.join(root, 'src', 'gen');

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

// The `=\s*` (not `= `) is load-bearing: the callee may begin on the next line.
const TOP_LEVEL_CALL =
  /^((?:export )?(?:const|let) [\w$]+(?:: [^=\n]+)? =\s*)(\/\* @__PURE__ \*\/ )?(new )?([\w$.]+)(?:<[^\n(]*>)?\(/gm;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.ts') && !EXCLUDE.has(d.name) ? [p] : [];
  });
}

/** Line/col of an absolute offset in `src`, 0-based. */
function locate(src: string, offset: number): { line: number; col: number } {
  const line = src.slice(0, offset).split('\n').length - 1;
  const col = offset - (src.lastIndexOf('\n', offset - 1) + 1);
  return { line, col };
}

/**
 * Range of lines [start, end] covered by the statement that starts on line
 * `start` — found by bracket balancing, so a multiline call's arguments are
 * included. Falls back to the first line ending in `;`.
 */
function statementRange(lines: string[], start: number): [number, number] {
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') depth--;
    }
    if (depth <= 0 && lines[i].trimEnd().endsWith(';')) return [start, i];
  }
  return [start, start];
}

let annotated = 0;
const unreviewed: string[] = [];
for (const file of walk(GEN_DIR)) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  // Lines that are part of a recognised top-level initialiser. The nested-call
  // pass below only annotates inside these runs.
  const consumed = new Array<boolean>(lines.length).fill(false);

  TOP_LEVEL_CALL.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOP_LEVEL_CALL.exec(src)) !== null) {
    const [whole, decl, pure, ctor, callee] = m;
    const { line: startLine } = locate(src, m.index);
    const { line: matchEndLine } = locate(src, m.index + whole.length);
    const mark = (through: number) => {
      for (let i = startLine; i <= through; i++) consumed[i] = true;
    };
    const key = `${ctor ?? ''}${callee}`;
    if (BUNDLER_KNOWN_PURE.has(key)) {
      mark(matchEndLine);
      continue;
    }
    if (!PURE_CALLEES.has(callee) || ctor) {
      unreviewed.push(`${path.relative(root, file)}: ${whole.trim()}`);
      mark(matchEndLine);
      continue;
    }
    if (pure) {
      mark(matchEndLine); // idempotent: already annotated
      continue;
    }
    annotated++;
    // Insert the annotation exactly where the callee starts, which may be a
    // later line than the declaration.
    const { line: declEndLine, col } = locate(src, m.index + decl.length);
    lines[declEndLine] = lines[declEndLine].slice(0, col) + PURE + lines[declEndLine].slice(col);
    mark(declEndLine);
  }

  // Extend each consumed run to the end of its initialiser statement so nested
  // calls on later lines (multiline argument lists) are covered too.
  for (let i = 0; i < lines.length; i++) {
    if (!consumed[i]) continue;
    const [, end] = statementRange(lines, i);
    for (let k = i; k <= end; k++) consumed[k] = true;
  }

  // Fail-closed gate for NESTED calls: an eagerly evaluated call or `new`
  // anywhere inside a reviewed initialiser must itself be reviewed — otherwise
  // `createClient(sneakySideEffect())` would pass the gate with the side effect
  // intact (the outer reviewed callee marks the statement consumed). Scan the
  // whole consumed statement for every callee-shaped token and fail on any that
  // is neither reviewed, bundler-known-pure, nor already annotated.
  const ANY_CALL = /(?:\bnew\s+)?([\w$]+(?:\s*\.\s*[\w$]+)*)(?:<[^\n(]*>)?\s*\(/g;
  let i = 0;
  while (i < lines.length) {
    if (!consumed[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < lines.length && consumed[j + 1]) j++;
    // Skip the outer call's own callee: everything up to its `(` was vetted by
    // the primary pass above.
    let parenLine = i;
    let parenCol = -1;
    for (let k = i; k <= j; k++) {
      const idx = lines[k].indexOf('(', lines[k].indexOf(PURE) + PURE.length);
      if (idx !== -1) {
        parenLine = k;
        parenCol = idx;
        break;
      }
    }
    for (let k = parenLine; k <= j; k++) {
      const from = k === parenLine ? parenCol : 0;
      const segment = lines[k].slice(from);
      ANY_CALL.lastIndex = 0;
      let cm: RegExpExecArray | null;
      while ((cm = ANY_CALL.exec(segment)) !== null) {
        const callee = cm[1].replace(/\s*\.\s*/g, '.');
        if (PURE_CALLEES.has(callee)) continue;
        const ctorPrefix = cm[0].slice(0, cm[0].indexOf(callee));
        if (BUNDLER_KNOWN_PURE.has(ctorPrefix + callee)) continue;
        if (segment.slice(Math.max(0, cm.index - PURE.length), cm.index) === PURE) continue;
        unreviewed.push(
          `${path.relative(root, file)}: nested call to unreviewed callee '${callee}' inside a reviewed initialiser`
        );
      }
    }
    i = j + 1;
  }

  // A pure annotation lets the bundler drop the outer call, but it still keeps any
  // argument that is itself an un-annotated call (e.g. `createClient(createConfig(...))`).
  // Annotate reviewed callees nested anywhere inside the initialiser statement.
  const nested = new RegExp(
    String.raw`(?<!@__PURE__ \*/ )\b(${[...PURE_CALLEES].map((c) => c.replace('.', '\\.')).join('|')})(<[^\n(]*>)?\(`,
    'g'
  );
  i = 0;
  while (i < lines.length) {
    if (!consumed[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < lines.length && consumed[j + 1]) j++;
    // Find the outer call's `(` — everything before it is the callee itself,
    // already handled by the primary pass.
    let parenLine = i;
    let parenCol = -1;
    for (let k = i; k <= j; k++) {
      const idx = lines[k].indexOf('(', lines[k].indexOf(PURE) + PURE.length);
      if (idx !== -1) {
        parenLine = k;
        parenCol = idx;
        break;
      }
    }
    for (let k = parenLine; k <= j; k++) {
      const from = k === parenLine ? parenCol : 0;
      lines[k] =
        lines[k].slice(0, from) +
        lines[k].slice(from).replace(nested, (mm) => {
          annotated++;
          return `${PURE}${mm}`;
        });
    }
    i = j + 1;
  }

  const finalOut = lines.join('\n');
  if (finalOut !== src) fs.writeFileSync(file, finalOut, 'utf8');
}

if (unreviewed.length) {
  console.error(
    '[annotate-pure] Unreviewed top-level calls in generated code. Each one runs at import ' +
      'time and defeats tree-shaking. Review it and add the callee to PURE_CALLEES in ' +
      'hooks/post/650-annotate-pure-initialisers.ts if it is side-effect-free:\n  ' +
      unreviewed.join('\n  ')
  );
  process.exit(1);
}
console.log(`[annotate-pure] Annotated ${annotated} top-level initialisers as /* @__PURE__ */`);
