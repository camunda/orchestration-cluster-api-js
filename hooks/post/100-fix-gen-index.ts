import fs from 'node:fs';
import path from 'node:path';

const GEN_INDEX_PATH = path.resolve(process.cwd(), 'src', 'gen', 'index.ts');

function main(): void {
  const original = fs.readFileSync(GEN_INDEX_PATH, 'utf8');

  // We need runtime key helper namespaces emitted into `types.gen.ts` (e.g. the
  // CamundaKey branding namespaces such as `ProcessInstanceKey.assumeExists`) to be
  // reachable from `src/gen` consumers.
  //
  // hey-api 0.86 emits `export type * from './types.gen';` which strips runtime exports.
  // hey-api 0.96+ emits an explicit `export type { Foo, Bar, ... } from './types.gen';`
  // which also strips runtime exports.
  //
  // In the legacy form, swap the wildcard `type *` to `*` so values flow through.
  // In the explicit form, append a `export * from './types.gen';` line so the runtime
  // namespaces are re-exported alongside the existing explicit type re-exports.
  let updated = original;
  let changed = false;
  if (updated.includes("export type * from './types.gen';")) {
    updated = updated.replace("export type * from './types.gen';", "export * from './types.gen';");
    changed = true;
  } else if (
    /export type \{[^}]+\}\s*from\s*'\.\/types\.gen';/.test(updated) &&
    !updated.includes("export * from './types.gen';")
  ) {
    if (!updated.endsWith('\n')) updated += '\n';
    updated += "export * from './types.gen';\n";
    changed = true;
  }

  if (changed) {
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
