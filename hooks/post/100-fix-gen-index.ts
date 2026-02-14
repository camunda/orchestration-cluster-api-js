import fs from 'node:fs';
import path from 'node:path';

const GEN_INDEX_PATH = path.resolve(process.cwd(), 'src', 'gen', 'index.ts');

function main(): void {
  const original = fs.readFileSync(GEN_INDEX_PATH, 'utf8');

  // We need runtime key helper namespaces emitted into `types.gen.ts` to be
  // reachable from `src/gen` consumers. openapi-ts generates `export type *` here
  // which strips runtime exports.
  const updated = original.replace(
    "export type * from './types.gen';",
    "export * from './types.gen';"
  );

  if (updated !== original) {
    fs.writeFileSync(GEN_INDEX_PATH, updated, 'utf8');
    console.log('[postprocess-gen-index] Enabled runtime exports from types.gen');
  } else {
    console.log('[postprocess-gen-index] No changes needed');
  }
}

try {
  main();
} catch (err) {
  console.error('[postprocess-gen-index] Failed');
  console.error(err);
  process.exitCode = 1;
}
