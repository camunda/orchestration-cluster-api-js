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

const TOP_LEVEL_CALL =
  /^((?:export )?(?:const|let) [\w$]+(?:: [^=\n]+)? = )(\/\* @__PURE__ \*\/ )?(new )?([\w$.]+)(?:<[^\n(]*>)?\(/gm;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.ts') && !EXCLUDE.has(d.name) ? [p] : [];
  });
}

let annotated = 0;
const unreviewed: string[] = [];
for (const file of walk(GEN_DIR)) {
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(
    TOP_LEVEL_CALL,
    (whole, decl: string, pure: string | undefined, ctor: string | undefined, callee: string) => {
      const key = `${ctor ?? ''}${callee}`;
      if (BUNDLER_KNOWN_PURE.has(key)) return whole;
      if (!PURE_CALLEES.has(callee) || ctor) {
        unreviewed.push(`${path.relative(root, file)}: ${whole.trim()}`);
        return whole;
      }
      if (pure) return whole; // idempotent
      annotated++;
      return whole.replace(decl, `${decl}/* @__PURE__ */ `);
    }
  );
  // A pure annotation lets the bundler drop the outer call, but it still keeps any
  // argument that is itself an un-annotated call (e.g. `createClient(createConfig(...))`).
  // Annotate reviewed callees nested on the same initialiser line too.
  const nested = new RegExp(
    `(?<!@__PURE__ \\*/ )\\b(${[...PURE_CALLEES].map((c) => c.replace('.', '\\.')).join('|')})(<[^\\n(]*>)?\\(`,
    'g'
  );
  const finalOut = out
    .split('\n')
    .map((line) => {
      if (!/^(?:export )?(?:const|let) [\w$]+(?:: [^=]+)? = \/\* @__PURE__ \*\/ /.test(line)) {
        return line;
      }
      const [head, rest] = [
        line.slice(0, line.indexOf('/* @__PURE__ */ ') + 16),
        line.slice(line.indexOf('/* @__PURE__ */ ') + 16),
      ];
      // Skip the outer callee (already annotated), annotate the nested ones.
      const firstParen = rest.indexOf('(');
      const inner = rest.slice(firstParen).replace(nested, (m) => {
        annotated++;
        return `/* @__PURE__ */ ${m}`;
      });
      return head + rest.slice(0, firstParen) + inner;
    })
    .join('\n');
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
