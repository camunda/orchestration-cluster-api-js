/**
 * Generation pipeline orchestrator.
 *
 * Runs numbered hooks in lexicographic order:
 *   hooks/pre/*   → preprocessing before openapi-ts generation
 *   (openapi-ts)  → code generation via @hey-api/openapi-ts
 *   hooks/post/*  → postprocessing and enrichment of generated code
 *
 * Each hook is a standalone .ts file executed via tsx.
 * Numbering controls execution order (100, 200, …).
 *
 * Usage:
 *   tsx scripts/run-pipeline.ts           # full pipeline (pre + generate + post + test)
 *   tsx scripts/run-pipeline.ts --no-test # skip tests at the end
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HOOKS_DIR = path.join(ROOT, 'hooks');
const skipTest = process.argv.includes('--no-test');

function discoverHooks(phase: string): string[] {
  const dir = path.join(HOOKS_DIR, phase);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .sort()
    .map((f) => path.join(dir, f));
}

function runHook(hookPath: string): void {
  const rel = path.relative(ROOT, hookPath);
  console.log(`\n▸ ${rel}`);
  execSync(`tsx ${hookPath}`, { cwd: ROOT, stdio: 'inherit' });
}

function runCommand(label: string, cmd: string): void {
  console.log(`\n▸ ${label}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

// ── Pipeline ──────────────────────────────────────────────
const preHooks = discoverHooks('pre');
const postHooks = discoverHooks('post');

console.log(
  `[pipeline] ${preHooks.length} pre hooks, ${postHooks.length} post hooks${skipTest ? ' (tests skipped)' : ''}`
);

// 1. Pre-generation hooks
for (const h of preHooks) runHook(h);

// 2. Code generation (openapi-ts)
runCommand('openapi-ts', 'openapi-ts -i ./external-spec/bundled/rest-api.bundle.json -o src/gen');

// 3. Post-generation hooks
for (const h of postHooks) runHook(h);

// 4. Tests
if (!skipTest) {
  runCommand(
    'test',
    "CAMUNDA_SDK_INTEGRATION=0 vitest run --passWithNoTests --exclude 'tests-integration/' --exclude 'camundacon/**'"
  );
}

console.log('\n[pipeline] ✓ complete');
