#!/usr/bin/env node
// Browser-compatibility gate for the BUILT package (issue #537).
//
// Complements tests/browser-bundle.test.ts (which checks src/ before tsup runs)
// by bundling the actual dist/ artifacts exactly as a consumer's bundler would:
// `--platform=browser`, no externals, `#platform` resolved by esbuild through the
// package.json "imports" map under the `browser` condition. Fails if any Node
// built-in is reachable from a public entry point.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

let failed = false;
for (const [subpath, target] of Object.entries(pkg.exports)) {
  for (const format of ['import', 'require']) {
    const entry = join(root, target[format]);
    try {
      await build({
        absWorkingDir: root,
        entryPoints: [entry],
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'esm',
        logLevel: 'silent',
        // Ignore this repo's tsconfig "paths" (source-time #platform alias): a consumer's
        // bundler only sees the package.json "imports" map.
        tsconfigRaw: '{}',
      });
      console.log(`✓ ${subpath} (${format}) bundles for the browser`);
    } catch (e) {
      failed = true;
      console.error(`✗ ${subpath} (${format}) does not bundle for the browser:`);
      for (const err of e.errors ?? [{ text: String(e) }]) console.error(`    ${err.text}`);
    }
  }
}
// ESM output must not call tsup's `__require` shim: under native ESM it throws
// "Dynamic require ... is not supported", silently disabling Node-only features.
for (const file of readdirSync(join(root, 'dist'), { recursive: true })) {
  if (!String(file).endsWith('.js')) continue;
  const src = readFileSync(join(root, 'dist', String(file)), 'utf8');
  if (/\b__require\(/.test(src)) {
    failed = true;
    console.error(`✗ dist/${file} calls the __require shim (CommonJS require in ESM output)`);
  }
}
if (!failed) console.log('✓ no __require shim calls in ESM output');
if (failed) process.exit(1);
