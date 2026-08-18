import fs from 'node:fs';
import path from 'node:path';

// Fixes `.register()` calls misattributed to the inner operand of a `z.and()`
// intersection instead of the exported intersection schema itself.
//
// For an allOf schema with its own top-level description, @hey-api/openapi-ts emits:
//
//   export const zClusterRestoreRequest = zRestoreRequest.and(z.object({
//       overrides: z.record(z.string(), zRestoreRequest).nullish()
//   }).register(z.globalRegistry, {
//       description: 'Describes a restore request issued by a cluster admin. ...'
//   }));
//
// `.register()` here targets the anonymous inline `z.object({...})` argument passed to
// `.and()`, not the `ZodIntersection` instance returned by `.and()` and bound to
// `zClusterRestoreRequest`. Metadata registered via `z.globalRegistry` is keyed by schema
// *instance*, so `z.globalRegistry.get(zClusterRestoreRequest)` returns nothing — the
// description is registered against an object nobody can look up. We rewrite this to
// register the intersection instance itself:
//
//   export const zClusterRestoreRequest = zRestoreRequest.and(z.object({
//       overrides: z.record(z.string(), zRestoreRequest).nullish()
//   })).register(z.globalRegistry, {
//       description: 'Describes a restore request issued by a cluster admin. ...'
//   });
//
// This targets the whole defect class: any `<base>.and(z.object({...}).register(...))`
// statement where the `.and(...)` call is not already followed by an outer `.register(`.

const root = process.cwd();
const zodGenPath = path.join(root, 'src/gen/zod.gen.ts');

if (!fs.existsSync(zodGenPath)) {
  console.error('[fix-intersection-register] zod.gen.ts not found');
  process.exit(0);
}

const source = fs.readFileSync(zodGenPath, 'utf8');
const lines = source.split('\n');

// A statement in this shape always spans:
//   1. `export const <name> = <base>.and(z.object({` — the opening line.
//   2. some line ending in `}).register(z.globalRegistry, {` — closes the inline object,
//      opens the misattributed `.register()` call.
//   3. a line that is exactly `}));` — closes the register options object, the `.register()`
//      call, and the `.and()` call, terminating the statement.
// Step 3's shape distinguishes the (unfixed) defect from an already-correct statement, which
// would instead close with `})).register(` on its own trailing line (outer register present).
const openRe = /^export const \w+ = [\w.]+\.and\(z\.object\(\{/;
// Anchored with no leading whitespace: the generator prints the inline object's closing brace
// at column 0 (matching the `export const` statement's own indentation), whereas a *property*
// inside that object whose own value happens to end in `.register(z.globalRegistry, {` is always
// indented. Without the `^` anchor, a property line like
// `    tenants: z.record(...).register(z.globalRegistry, {` false-matches and corrupts the file.
const midRe = /^\}\)\.register\(z\.globalRegistry, \{$/;
const closeRe = /^\}\)\);$/;

let replacements = 0;
let i = 0;
while (i < lines.length) {
  if (openRe.test(lines[i])) {
    let j = i + 1;
    let foundMid = -1;
    while (j < lines.length && j < i + 60) {
      if (midRe.test(lines[j])) {
        foundMid = j;
        break;
      }
      // Statement ended (or a nested .and/.register already resolved it) before we found the
      // misattributed register — nothing to fix for this statement.
      if (/^\}\)\);$/.test(lines[j]) || /^\}\)\)\.register\(/.test(lines[j])) break;
      j++;
    }
    if (foundMid !== -1) {
      let k = foundMid + 1;
      while (k < lines.length && k < foundMid + 15) {
        if (closeRe.test(lines[k])) {
          // Move `.and(`'s closing paren before `.register(`, and drop the now-redundant
          // closing paren from the final line.
          lines[foundMid] = lines[foundMid].replace(
            /\}\)\.register\(z\.globalRegistry, \{$/,
            '})).register(z.globalRegistry, {'
          );
          lines[k] = lines[k].replace(/^\}\)\);$/, '});');
          replacements++;
          break;
        }
        if (/^\}\)\)\.register\(/.test(lines[k])) break;
        k++;
      }
    }
  }
  i++;
}

if (replacements > 0) {
  fs.writeFileSync(zodGenPath, lines.join('\n'), 'utf8');
  console.log(
    `[fix-intersection-register] Moved ${replacements} misattributed .register() call(s) onto their exported intersection schema(s) in zod.gen.ts`
  );
} else {
  console.log(
    '[fix-intersection-register] No misattributed intersection .register() calls found — nothing to patch'
  );
}
