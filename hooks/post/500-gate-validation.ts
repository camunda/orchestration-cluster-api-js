#!/usr/bin/env tsx
/**
 * Post-generation transform: STRIP inline request/response validators from sdk.gen.ts.
 * Rationale: Validation is handled exclusively by CamundaClient methods via ValidationManager.
 * We neutralize any requestValidator/responseValidator entries produced by the underlying generator
 * to avoid double validation cost. Legacy gatedValidation import removal retained for backward
 * compatibility but file has been removed.
 * Idempotent & non-invasive: safe to run multiple times.
 */
import fs from 'node:fs';
import path from 'node:path';

const sdkPath = path.resolve(process.cwd(), 'src/gen/sdk.gen.ts');
if (!fs.existsSync(sdkPath)) {
  console.error('[strip-validation] sdk.gen.ts not found, skipping');
  process.exit(0);
}
let code = fs.readFileSync(sdkPath, 'utf8');

// Normalize opId constants (legacy gating inserted them); keep them (harmless) or ensure presence? We leave untouched.

// Replace any gated request/response validator wrappers with undefined.
code = code.replace(
  /requestValidator:\s*async\s*\(data\)\s*=>\s*{[^}]*?}\s*,/g,
  'requestValidator: undefined,'
);
code = code.replace(
  /responseValidator:\s*async\s*\(data\)\s*=>\s*{[^}]*?}\s*,/g,
  'responseValidator: undefined,'
);

// Also replace direct parseAsync validators (original generator form) with undefined.
code = code.replace(
  /requestValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await z[A-Za-z0-9_]+Data\.parseAsync\(data\);\s*}\s*,/g,
  'requestValidator: undefined,'
);
code = code.replace(
  /responseValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await z[A-Za-z0-9_]+Response\.parseAsync\(data\);\s*}\s*,/g,
  'responseValidator: undefined,'
);

// hey-api 0.96+ emits validators as arrow-expression bodies (no braces) of the form:
//   requestValidator: async (data) => await z.object({ body: ..., path: ..., query: ... }).parseAsync(data),
//   responseValidator: async (data) => await zXxxResponse.parseAsync(data),
// Strip these too so we don't double-validate (and so sdk.gen.ts doesn't reference
// per-part schemas like zXxxBody / zXxxQuery / zXxxResponse that are no longer imported).
code = stripExpressionValidators(code, 'requestValidator');
code = stripExpressionValidators(code, 'responseValidator');

function stripExpressionValidators(
  src: string,
  kind: 'requestValidator' | 'responseValidator'
): string {
  const needle = `${kind}: async (data) => await `;
  let out = '';
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf(needle, i);
    if (idx === -1) {
      out += src.slice(i);
      break;
    }
    out += src.slice(i, idx);
    // Scan from end of `await ` until we find a `,` at paren/brace depth 0.
    let j = idx + needle.length;
    let depthParen = 0;
    let depthBrace = 0;
    while (j < src.length) {
      const ch = src[j];
      if (ch === '(') depthParen++;
      else if (ch === ')') depthParen--;
      else if (ch === '{') depthBrace++;
      else if (ch === '}') depthBrace--;
      else if (ch === ',' && depthParen === 0 && depthBrace === 0) break;
      j++;
    }
    out += `${kind}: undefined`;
    i = j; // leave the trailing `,` in place
  }
  return out;
}

// Strip the zod.gen import line — validators are neutralized so the import is dead code.
// Removing it prevents sdk.gen.ts from eagerly loading the 10K-line zod schema module.
code = code.replace(/^import\s*\{[^}]*\}\s*from\s*'\.\/zod\.gen';\s*\n/m, '');

// Ensure at least one Options export still follows imports (no change expected) – no action.

fs.writeFileSync(sdkPath, code, 'utf8');
console.log('[strip-validation] Neutralized validators in sdk.gen.ts');
