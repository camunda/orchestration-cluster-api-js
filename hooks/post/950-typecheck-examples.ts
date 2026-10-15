#!/usr/bin/env tsx
/**
 * Post-generation hook: type-check compilable API examples.
 *
 * Runs `tsc --noEmit` against docs/examples/ using a separate tsconfig
 * that maps the package import to source. This catches type-contract
 * regressions flowing in from upstream spec changes.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const root = process.cwd();
const examplesDir = resolve(root, 'examples');
const tsconfig = resolve(examplesDir, 'tsconfig.json');

// Resolve the TypeScript compiler JS entrypoint so we can invoke it via
// `node <tsc> -p <tsconfig>`. This avoids a shell (no path interpolation)
// while remaining cross-platform: spawning `node` sidesteps the Windows
// `npx.cmd`/`tsc.cmd` shim that `execFileSync('npx', …)` cannot resolve.
const TSC = createRequire(import.meta.url).resolve('typescript/bin/tsc');

if (!existsSync(tsconfig)) {
  console.log('⚠ examples/tsconfig.json not found — skipping example type-check');
  process.exit(0);
}

try {
  execFileSync(process.execPath, [TSC, '-p', tsconfig], { cwd: root, stdio: 'inherit' });
  console.log('✓ API examples type-check passed');
} catch {
  console.error('✗ API examples failed type-check — fix examples/*.ts');
  process.exit(1);
}
