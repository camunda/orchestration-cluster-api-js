// Simple post-build smoke test executed via `npm run test:dist`
// Runs outside vitest to avoid source transform/build race.
import { stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

async function main() {
  const root = path.resolve(process.cwd());
  const distIndex = path.join(root, 'dist', 'index.js');
  await stat(distIndex).catch(() => { throw new Error('dist/index.js missing; did build succeed?'); });
  const mod = await import(pathToFileURL(distIndex).href);
  if (!mod.default) throw new Error('Default export missing');
  const {Camunda} = mod;
  if (typeof Camunda !== 'function') throw new Error('Expected Camunda class on default export');
  const { ProcessDefinitionKey } = mod;
  if (typeof ProcessDefinitionKey?.create !== 'function') throw new Error('ProcessDefinitionKey.create missing');
  const k = ProcessDefinitionKey.assumeExists('42');
  if (String(k) !== '42') throw new Error('Key branding roundtrip failed');
  console.log('[dist-smoke] OK');
}

main().catch(e => { console.error('[dist-smoke] FAIL', e); process.exit(1); });
