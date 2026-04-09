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
let patched = source.replaceAll('z.coerce.bigint()', 'z.coerce.number()');

// Also replace BigInt(...) literals used in .default(), .gte(), .min(), .max()
// constraints — these are invalid on z.number() and should be plain numbers.
const bigIntLiteralCount = (patched.match(/BigInt\(\s*[\d-]+\s*\)/g) ?? []).length;
patched = patched.replace(/BigInt\(\s*([\d-]+)\s*\)/g, '$1');

const count = (source.match(/z\.coerce\.bigint\(\)/g) ?? []).length;

if (count > 0) {
  fs.writeFileSync(zodGenPath, patched, 'utf8');
  console.log(
    `[fix-int64-bigint] Replaced ${count} z.coerce.bigint() → z.coerce.number()` +
      (bigIntLiteralCount > 0 ? ` and ${bigIntLiteralCount} BigInt() literal(s)` : '') +
      ' in zod.gen.ts'
  );
} else {
  console.log('[fix-int64-bigint] No z.coerce.bigint() found — nothing to patch');
}
