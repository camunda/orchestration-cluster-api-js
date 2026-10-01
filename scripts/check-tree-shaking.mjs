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
// The per-operation entry point (`./fn`, issue #537 phase 2b) is measured
// differently — see FN below: what a consumer of one operation actually ships.
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
/**
 * Reviewed budgets (minified bytes) for exports that legitimately pull in a lot.
 * The client constructors carry the full typed client (~270 methods + runtime);
 * measured ~527 KB on introduction. Zod schemas stay in a lazily loaded chunk —
 * if they ever got eagerly pulled in, these would jump to ~930 KB and trip.
 */
const CLIENT_BUDGET = 600 * 1024;
const HEAVY = {
  '. default': CLIENT_BUDGET,
  '. CamundaClient': CLIENT_BUDGET,
  '. CamundaClientBase': CLIENT_BUDGET,
  '. createCamundaClient': CLIENT_BUDGET,
  '. createCamundaClientLoose': CLIENT_BUDGET,
  '. createCamundaResultClient': CLIENT_BUDGET,
  './effect layer': CLIENT_BUDGET,
  './effect createCamundaEffectClient': CLIENT_BUDGET,
};

/**
 * `./fn`: standalone per-operation functions over a shared core. Measured as a
 * consumer bundle WITHOUT code splitting, so it counts everything the operation can
 * ever load — including its lazily imported zod schemas — and none of the
 * operations it does not use:
 *
 *  - the core (`createCamundaCore` / `CamundaCore`) against FN.coreBudget;
 *  - every operation as the increment of `{ createCamundaCore, op }` over the
 *    core, against FN.opBudget. An operation that reached the whole schema module
 *    (or another operation's code) would add ~700 KB and trip this.
 *
 * zod is not part of the core: the validation runtime recognises zod values
 * structurally, so zod arrives only with an operation's (lazily imported) schemas.
 * Each operation increment therefore includes zod itself (~68 KB).
 *
 * Measured: core ~70 KB (was ~138 KB while the core imported zod eagerly);
 * operations add ~72–128 KB including zod (activateJobs largest: it carries
 * job-action enrichment). coreBudget is set so that zod re-entering the core
 * (+~68 KB) fails the gate.
 */
const FN = {
  subpath: './fn',
  coreExports: ['createCamundaCore', 'CamundaCore'],
  coreBudget: 80 * 1024,
  opBudget: 144 * 1024,
};

const require = createRequire(import.meta.url);
let failed = false;
const rows = [];

/** Minified size of a consumer bundle importing `names` from `entryFile` (no splitting). */
async function unsplitSize(entryFile, names) {
  const contents = `import { ${names.join(', ')} } from ${JSON.stringify(entryFile)}; console.log(${names.join(', ')});`;
  const r = await build({
    absWorkingDir: root,
    stdin: { contents, resolveDir: root, loader: 'js' },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    tsconfigRaw: '{}',
    external: Object.keys(pkg.peerDependencies ?? {}),
    logLevel: 'silent',
  });
  return r.outputFiles[0].contents;
}

if (!pkg.exports[FN.subpath]) {
  console.log(`✗ missing per-operation entry point: package.json exports["${FN.subpath}"]`);
  failed = true;
}

for (const [subpath, target] of Object.entries(pkg.exports)) {
  if (subpath === FN.subpath) {
    const entryFile = join(root, target.import);
    const names = Object.keys(await import(pathToFileURL(entryFile).href)).sort();
    for (const c of FN.coreExports) {
      if (!names.includes(c)) {
        console.log(`✗ ${FN.subpath} does not export ${c}`);
        failed = true;
      }
    }
    const core = await unsplitSize(entryFile, [FN.coreExports[0]]);
    for (const name of names) {
      const isCore = FN.coreExports.includes(name);
      const bytes = await unsplitSize(entryFile, isCore ? [name] : [FN.coreExports[0], name]);
      const size = isCore ? bytes.length : bytes.length - core.length;
      const budget = isCore ? FN.coreBudget : FN.opBudget;
      const ok = size <= budget;
      if (!ok) failed = true;
      const label = isCore ? name : `+${name}`;
      const gz = gzipSync(bytes).length - (isCore ? 0 : gzipSync(core).length);
      rows.push({ key: `${subpath} ${label}`, size, gz, budget, ok });
    }
    continue;
  }
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
