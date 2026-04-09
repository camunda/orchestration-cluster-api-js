import fs from 'node:fs';
import path from 'node:path';

// Replaces z.coerce.bigint() with z.coerce.number() in generated Zod schemas.
//
// The upstream generator (@hey-api/openapi-ts) maps OpenAPI int64 to
// z.coerce.bigint() in Zod but to `number` in TypeScript types. When strict
// or fanatical validation is enabled, the Zod-parsed value becomes a bigint
// at runtime while TypeScript expects number — causing silent type
// mismatches (e.g. totalItems + 1 throws TypeError).
//
// JSON.parse already returns number for integers (with precision loss beyond
// Number.MAX_SAFE_INTEGER), so coercing to bigint does not recover anything.
// Aligning Zod with the TypeScript types keeps all validation modes
// consistent.
//
// Upstream tracking: https://github.com/hey-api/openapi-ts/issues/1802
// Internal tracking: https://github.com/camunda/orchestration-cluster-api-js/issues/124

const root = process.cwd();
const zodGenPath = path.join(root, 'src/gen/zod.gen.ts');

if (!fs.existsSync(zodGenPath)) {
  console.error('[fix-int64-bigint] zod.gen.ts not found');
  process.exit(0);
}

const source = fs.readFileSync(zodGenPath, 'utf8');

// Replace z.coerce.bigint() with z.coerce.number().int() to keep integer
// semantics (rejects 1.5 under strict/fanatical) while aligning the runtime
// type with the TypeScript `number` declaration.
let patched = source.replaceAll('z.coerce.bigint()', 'z.coerce.number().int()');

// Also replace BigInt(...) literals used in .default(), .gte(), .min(), .max()
// constraints — these are invalid on z.number() and should be plain numbers.
const bigIntLiteralCount = (patched.match(/BigInt\(\s*[\d-]+\s*\)/g) ?? []).length;
patched = patched.replace(/BigInt\(\s*([\d-]+)\s*\)/g, '$1');

const count = (source.match(/z\.coerce\.bigint\(\)/g) ?? []).length;
const didPatch = count > 0 || bigIntLiteralCount > 0;

if (didPatch) {
  fs.writeFileSync(zodGenPath, patched, 'utf8');
  const parts: string[] = [];
  if (count > 0) parts.push(`${count} z.coerce.bigint() → z.coerce.number().int()`);
  if (bigIntLiteralCount > 0) parts.push(`${bigIntLiteralCount} BigInt() literal(s)`);
  console.log(`[fix-int64-bigint] Replaced ${parts.join(' and ')} in zod.gen.ts`);
} else {
  console.log('[fix-int64-bigint] No z.coerce.bigint() or BigInt() literals found — nothing to patch');
}
