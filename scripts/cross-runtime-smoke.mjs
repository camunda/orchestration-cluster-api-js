// Cross-runtime smoke orchestrator.
//
// Builds a real consumer of the *packed* package (so we test the published
// artifact + its resolved dependency tree, not the source tree) and runs
// tests/cross-runtime.smoke.mjs under every available JavaScript runtime
// (Node, Deno, Bun). This certifies that the shipped package loads, constructs
// a client, and — when a broker is reachable — performs live REST I/O on each
// runtime.
//
// Usage:
//   node scripts/cross-runtime-smoke.mjs
//
// Env:
//   XR_RUNTIMES            comma list to restrict runtimes (default: all found)
//   XR_REQUIRE_RUNTIMES    comma list that MUST be present or the run fails
//   CAMUNDA_REST_ADDRESS   when set, the smoke also does live REST I/O
//   XR_PROCESS_ID          when set (with a broker), also creates an instance
//   (all other CAMUNDA_* vars are passed through for auth)

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const smokeSrc = join(repoRoot, 'tests', 'cross-runtime.smoke.mjs');

/** Resolve a runtime binary on PATH, returning null when absent. */
function which(bin) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [bin], {
    encoding: 'utf8',
  });
  return r.status === 0 ? bin : null;
}

const ALL = [
  { name: 'node', bin: 'node', args: (f) => [f] },
  // Deno needs an explicit node_modules mode for a file:-installed npm package.
  { name: 'deno', bin: 'deno', args: (f) => ['run', '--node-modules-dir=manual', '-A', f] },
  { name: 'bun', bin: 'bun', args: (f) => [f] },
];

const only = (process.env.XR_RUNTIMES ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const required = (process.env.XR_REQUIRE_RUNTIMES ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const selected = ALL.filter((r) => (only.length ? only.includes(r.name) : true));

const log = (...a) => console.log('[cross-runtime]', ...a);

// 1. Pack the built package.
const tmp = mkdtempSync(join(tmpdir(), 'oca-cross-runtime-'));
log(`workdir ${tmp}`);
let tarball;
try {
  const packed = execFileSync('npm', ['pack', '--silent', '--pack-destination', tmp], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .pop();
  tarball = join(tmp, packed);
  log(`packed ${packed}`);
} catch (e) {
  console.error('[cross-runtime] npm pack failed:', e.message);
  process.exit(1);
}

// 2. Isolated consumer with a real (non-symlinked) dependency tree.
const consumer = join(tmp, 'consumer');
try {
  mkdirSync(consumer, { recursive: true });
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify(
      { name: 'oca-cross-runtime-consumer', private: true, type: 'module', version: '0.0.0' },
      null,
      2
    )
  );
  execFileSync('npm', ['install', tarball, '--silent', '--no-audit', '--no-fund'], {
    cwd: consumer,
    encoding: 'utf8',
  });
  writeFileSync(join(consumer, 'smoke.mjs'), readFileSync(smokeSrc, 'utf8'));
  log('installed packed package into isolated consumer');
} catch (e) {
  console.error('[cross-runtime] consumer setup failed:', e.message);
  process.exit(1);
}

// 3. Run the smoke under each available runtime.
const results = [];
for (const rt of selected) {
  const present = which(rt.bin);
  if (!present) {
    if (required.includes(rt.name)) {
      results.push({ name: rt.name, status: 'MISSING (required)' });
    } else {
      log(`skip ${rt.name} (not installed)`);
    }
    continue;
  }
  log(`running under ${rt.name}...`);
  const r = spawnSync(rt.bin, rt.args(join(consumer, 'smoke.mjs')), {
    cwd: consumer,
    stdio: 'inherit',
    env: process.env,
  });
  results.push({ name: rt.name, status: r.status === 0 ? 'PASS' : `FAIL (exit ${r.status})` });
}

// 4. Report + cleanup.
try {
  rmSync(tmp, { recursive: true, force: true });
} catch {
  /* best-effort */
}

console.log('\n[cross-runtime] summary:');
for (const r of results) console.log(`  - ${r.name}: ${r.status}`);

const ok = results.length > 0 && results.every((r) => r.status === 'PASS');
if (!ok) {
  console.error('[cross-runtime] one or more runtimes failed');
  process.exit(1);
}
console.log('[cross-runtime] all runtimes passed');
