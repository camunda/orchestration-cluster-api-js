import fs from 'node:fs';
import path from 'node:path';

const GEN_INDEX_PATH = path.resolve(process.cwd(), 'src', 'gen', 'index.ts');
const TYPES_GEN_PATH = path.resolve(process.cwd(), 'src', 'gen', 'types.gen.ts');

/**
 * Names `types.gen.ts` declares as `export namespace` — the CamundaKey branding
 * helpers. Unlike a plain type alias these carry a *value* side (`assumeExists` and
 * friends), which is the whole reason this hook exists.
 */
function valueNamespaces(): Set<string> {
  const source = fs.readFileSync(TYPES_GEN_PATH, 'utf8');
  return new Set([...source.matchAll(/^export namespace (\w+) \{/gm)].map((m) => m[1]));
}

/**
 * Drop the value-carrying namespaces from an explicit `export type { … }` list.
 *
 * An explicit named export *shadows* a wildcard `export *` for the same name, so
 * listing `ProcessInstanceKey` in the type-only re-export strips its value side even
 * though `export * from './types.gen'` is also present — the namespace stays reachable
 * at runtime but is type-only to consumers, and `ProcessInstanceKey.assumeExists(…)`
 * fails to compile. Removing those names from the explicit list lets the wildcard
 * supply both sides.
 */
function stripValueNamespacesFromTypeExport(source: string, namespaces: Set<string>): string {
  return source.replace(
    /export type \{([^}]+)\}\s*from\s*'\.\/types\.gen';\n?/,
    (whole, list: string) => {
      const kept = list
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n.length > 0)
        .filter((n) => !namespaces.has(n));
      if (kept.length === 0) return '';
      const rebuilt = `export type { ${kept.join(', ')} } from './types.gen';\n`;
      return rebuilt === whole ? whole : rebuilt;
    }
  );
}

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

  // Appending the wildcard is not sufficient on its own: any name *also* listed in the
  // explicit `export type { … }` re-export stays type-only, because an explicit named
  // export wins over `export *`. Strip the value-carrying namespaces from that list so
  // the wildcard actually reaches consumers as values. Guarded by
  // `tests/gen-index-runtime-exports.test.ts`.
  const namespaces = valueNamespaces();
  const stripped = stripValueNamespacesFromTypeExport(updated, namespaces);
  if (stripped !== updated) {
    updated = stripped;
    changed = true;
    console.log(
      `[postprocess-gen-index] Unshadowed ${namespaces.size} key namespaces from the type-only re-export`
    );
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
