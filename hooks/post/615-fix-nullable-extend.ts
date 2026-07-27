import fs from 'node:fs';
import path from 'node:path';

// Fixes `.extend()` calls on nullable object schemas in generated Zod code.
//
// hey-api 0.96+ emits a nullable object schema as `z.object({ ... }).nullable()` (a
// `ZodNullable<ZodObject>`), whereas 0.86 emitted `z.union([z.object({ ... }), z.null()])`.
// It also builds discriminated unions by calling `.extend({ <discriminator>: z.literal(...) })`
// on each member schema. `.extend()` exists only on `ZodObject`, not on `ZodNullable`, so a
// discriminated-union member that references a nullable base fails to type-check:
//
//   src/gen/zod.gen.ts(N): error TS2339: Property 'extend' does not exist on type
//   'ZodNullable<ZodObject<...>>'.
//
// We unwrap the nullable base before extending: `zFoo.extend(...)` → `zFoo.unwrap().extend(...)`.
// A discriminated-union member must be a plain object anyway (the discriminator is a required key),
// so dropping the outer nullable at the member level is correct. Only schemas that are actually
// declared `.nullable()` are rewritten, leaving `.extend()` on plain objects untouched.
//
// Under hey-api 0.86 this hook is a no-op: nullable schemas are unions (no `.nullable()` const
// terminator) and discriminated unions use `.and()` rather than `.extend()`, so no `.extend()`
// calls target a nullable base and the file is left byte-identical.

const root = process.cwd();
const zodGenPath = path.join(root, 'src/gen/zod.gen.ts');

if (!fs.existsSync(zodGenPath)) {
  console.error('[fix-nullable-extend] zod.gen.ts not found');
  process.exit(0);
}

const source = fs.readFileSync(zodGenPath, 'utf8');

// Collect the names of top-level schema consts whose value ends in `.nullable()`.
// Generated statements start with `export const zName = ` and terminate with `;` at end of line;
// property lines inside object bodies end with `,`, so the first `;`-terminated line is the whole
// statement. We only need the trailing chain, so capture the value and test its tail.
const nullableNames = new Set<string>();
const constRegex = /^export const (z\w+) = ([\s\S]*?);$/gm;
for (const match of source.matchAll(constRegex)) {
  const [, name, value] = match;
  // Nullable if the top-level (outermost) chain ends with `.nullable()`, optionally followed by
  // further wrappers we still need to unwrap past for `.extend` (e.g. none observed today).
  if (/\.nullable\(\)$/.test(value.trim())) {
    nullableNames.add(name);
  }
}

let patched = source;
let replacements = 0;
for (const name of nullableNames) {
  // Rewrite `<name>.extend(` → `<name>.unwrap().extend(`, skipping any already unwrapped.
  const re = new RegExp(`\\b${name}\\.extend\\(`, 'g');
  patched = patched.replace(re, () => {
    replacements++;
    return `${name}.unwrap().extend(`;
  });
}

if (replacements > 0) {
  fs.writeFileSync(zodGenPath, patched, 'utf8');
  console.log(
    `[fix-nullable-extend] Unwrapped ${replacements} .extend() call(s) on nullable schemas in zod.gen.ts`
  );
} else {
  console.log('[fix-nullable-extend] No .extend() calls on nullable schemas — nothing to patch');
}
