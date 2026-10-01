#!/usr/bin/env node
// Tree-shaking gate for the BUILT package (issue #537, phase 2).
//
// For every runtime export of every public entry point, bundle a consumer that
// imports ONLY that export (browser, minified, `#platform` via package.json
// "imports") and check its size against a budget. This guards the whole class of
// defect: any import-time cost (a top-level call, a namespace IIFE, a class with
// static initialisers) that bundlers cannot drop inflates every export's bundle
// at once and trips the budget — not just the export that introduced it.
//
// Heavy exports that genuinely carry a lot of code (the client classes) get an
// explicit, reviewed budget in HEAVY below. Everything else gets DEFAULT_BUDGET.
//
// Usage: node scripts/check-tree-shaking.mjs [--report]
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const report = process.argv.includes('--report');

/** Minified-bytes budget for an export that does not appear in HEAVY. */
const DEFAULT_BUDGET = 8 * 1024;
/** Reviewed budgets (minified bytes) for exports that legitimately pull in a lot. */
const HEAVY = {};

const require = createRequire(import.meta.url);
let failed = false;
const rows = [];
for (const [subpath, target] of Object.entries(pkg.exports)) {
  const entryFile = join(root, target.import);
  // Optional peers (e.g. `effect`) must be installed for the entry to load; skip
  // the value-export enumeration gracefully if they are not.
  let names;
  try {
    names = Object.keys(await import(pathToFileURL(entryFile).href));
  } catch {
    names = Object.keys(require(join(root, target.require)));
  }
  for (const name of names.sort()) {
    const key = `${subpath} ${name}`;
    const contents = `import { ${name} as __probe } from ${JSON.stringify(entryFile)}; console.log(__probe);`;
    const r = await build({
      absWorkingDir: root,
      stdin: { contents, resolveDir: root, loader: 'js' },
      bundle: true,
      minify: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      // Ignore this repo's tsconfig "paths" (source-time #platform alias).
      tsconfigRaw: '{}',
      // Optional peer deps are the consumer's cost, not ours.
      external: Object.keys(pkg.peerDependencies ?? {}),
      // Code-split so lazily `import()`ed chunks (e.g. zod schemas) are measured
      // separately: only the eagerly-loaded entry chunk counts toward the budget.
      splitting: true,
      outdir: '/tmp/tree-shaking-probe',
      logLevel: 'silent',
    });
    const entry = r.outputFiles.find((f) => /stdin\.js$/.test(f.path)) ?? r.outputFiles[0];
    const size = entry.contents.length;
    const budget = HEAVY[key] ?? DEFAULT_BUDGET;
    const ok = size <= budget;
    if (!ok) failed = true;
    rows.push({ key, size, gz: gzipSync(entry.contents).length, budget, ok });
  }
}

rows.sort((a, b) => b.size - a.size);
for (const r of rows) {
  if (report || !r.ok) {
    const mark = r.ok ? '✓' : '✗';
    console.log(
      `${mark} ${r.key.padEnd(48)} ${String(r.size).padStart(8)} B min ${String(r.gz).padStart(7)} B gz  (budget ${r.budget})`
    );
  }
}
console.log(
  failed
    ? `✗ tree-shaking budget exceeded (${rows.filter((r) => !r.ok).length}/${rows.length} exports)`
    : `✓ tree-shaking: all ${rows.length} exports within budget`
);
if (failed) process.exit(1);
