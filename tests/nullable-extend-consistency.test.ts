/**
 * Regression guard for the ZodNullable `.extend()` defect fixed by
 * hooks/post/615-fix-nullable-extend.ts.
 *
 * @hey-api/openapi-ts 0.96+ emits nullable object schemas as
 * `z.object({ ... }).nullable()` and builds discriminated unions by calling
 * `.extend({ <discriminator>: z.literal(...) })` on each member. `.extend()`
 * exists only on `ZodObject`, not `ZodNullable`, so a member that references a
 * nullable base fails to type-check (TS2339). The 615 hook rewrites such calls
 * to `<name>.unwrap().extend(...)`.
 *
 * This test targets the **class** of defect: any `<name>.extend(` where `<name>`
 * is a top-level schema const declared `.nullable()` (i.e. an un-unwrapped
 * `.extend` on a nullable base). Under the currently pinned generator (0.86)
 * nullable schemas are unions and no `.extend()` calls exist, so this passes
 * trivially; it becomes an active guard once the generator is bumped to 0.96+.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ZOD_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'zod.gen.ts');

describe('nullable schema .extend() consistency', () => {
  it('zod.gen.ts contains no .extend() calls on nullable schema consts', () => {
    const source = readFileSync(ZOD_GEN_PATH, 'utf8');

    // Collect top-level schema consts whose value chain ends in `.nullable()`.
    // Property lines inside object bodies end with `,`, so the first `;`-terminated
    // line is the whole statement (matches the detection in the 615 hook).
    const nullableNames = new Set<string>();
    for (const match of source.matchAll(/^export const (z\w+) = ([\s\S]*?);$/gm)) {
      const [, name, value] = match;
      if (/\.nullable\(\)$/.test(value.trim())) nullableNames.add(name);
    }

    // A bare `<name>.extend(` on a nullable base is the defect. After the hook runs
    // it becomes `<name>.unwrap().extend(`, which this pattern does not match.
    const violations: string[] = [];
    for (const name of nullableNames) {
      const re = new RegExp(`\\b${name}\\.extend\\(`, 'g');
      const count = (source.match(re) ?? []).length;
      if (count > 0) violations.push(`${name} (${count})`);
    }

    expect(
      violations.length,
      `Found .extend() called directly on nullable schema const(s): ${violations.join(', ')}. ` +
        'ZodNullable has no .extend(); the base must be unwrapped first ' +
        '(`zX.unwrap().extend(...)`). See hooks/post/615-fix-nullable-extend.ts.'
    ).toBe(0);
  });
});
