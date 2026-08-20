// Simple post-build smoke test executed via `npm run test:dist`
// Runs outside vitest to avoid source transform/build race.
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Assert the main `.` entry pulls in ZERO Effect at runtime: `effect` is an
// OPTIONAL peer dependency reachable only via the `./effect` subpath. We walk the
// static import graph reachable from dist/index.js and fail if any module imports
// the bare `effect` package (or an `effect/...` subpath). This guards the hard
// constraint from #437: the `.` entry's runtime graph contains no `effect`.
async function assertNoEffectInMainEntry(root) {
  const distDir = path.join(root, 'dist');
  const entry = path.join(distDir, 'index.js');

  // Match module specifiers in ESM output: `from '...'`, bare `import '...'`,
  // `require('...')`, and dynamic `import('...')`.
  const specRe = /(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*|\bimport\s*\(\s*)['"]([^'"]+)['"]/g;

  const seen = new Set();
  const queue = [entry];

  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);

    let src;
    try {
      src = await readFile(file, 'utf8');
    } catch {
      continue; // sourcemaps / missing chunk — ignore
    }

    for (const m of src.matchAll(specRe)) {
      const spec = m[1];
      if (spec === 'effect' || spec.startsWith('effect/')) {
        throw new Error(
          `Main entry graph imports Effect ('${spec}') via ${path.relative(root, file)} — ` +
            'the `.` entry must contain zero Effect at runtime (effect is an optional peer).'
        );
      }
      // Follow only relative specifiers (stay inside dist/).
      if (spec.startsWith('./') || spec.startsWith('../')) {
        const resolved = path.resolve(path.dirname(file), spec);
        // tsup emits extensionless relative imports pointing at .js chunks.
        const candidates = resolved.endsWith('.js') ? [resolved] : [`${resolved}.js`, resolved];
        queue.push(...candidates);
      }
    }
  }
}

async function main() {
  const root = path.resolve(process.cwd());
  const distIndex = path.join(root, 'dist', 'index.js');
  await stat(distIndex).catch(() => {
    throw new Error('dist/index.js missing; did build succeed?');
  });
  const mod = await import(pathToFileURL(distIndex).href);
  if (typeof mod.default !== 'function')
    throw new Error('Default export (createCamundaClient) missing');
  const { CamundaClient, createCamundaClient } = mod;
  if (typeof CamundaClient !== 'function') throw new Error('Expected CamundaClient class export');
  if (typeof createCamundaClient !== 'function')
    throw new Error('Expected createCamundaClient factory export');
  const { ProcessDefinitionKey } = mod;
  if (typeof ProcessDefinitionKey?.assumeExists !== 'function')
    throw new Error('ProcessDefinitionKey.assumeExists missing');
  const k = ProcessDefinitionKey.assumeExists('42');
  if (String(k) !== '42') throw new Error('Key branding roundtrip failed');

  await assertNoEffectInMainEntry(root);
  console.log('[dist-smoke] OK (main entry loads with zero Effect present)');
}

main().catch((e) => {
  console.error('[dist-smoke] FAIL', e);
  process.exit(1);
});
