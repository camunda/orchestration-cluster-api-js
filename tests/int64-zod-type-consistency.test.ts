/**
 * Regression guard for #124: int64 fields must use z.coerce.number() in Zod,
 * not z.coerce.bigint(). The TypeScript types map int64 → number, so the Zod
 * schema must agree — otherwise strict/fanatical validation returns bigint at
 * runtime while TypeScript says number.
 *
 * This test targets the **class** of defect (any z.coerce.bigint() in the
 * generated Zod schemas), not individual fields.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ZOD_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'zod.gen.ts');

describe('int64 Zod/TypeScript type consistency', () => {
  it('zod.gen.ts contains no z.coerce.bigint() calls', () => {
    const source = readFileSync(ZOD_GEN_PATH, 'utf8');
    const matches = source.match(/z\.coerce\.bigint\(\)/g) ?? [];
    expect(
      matches.length,
      `Found ${matches.length} occurrence(s) of z.coerce.bigint() in zod.gen.ts. ` +
        'All int64 fields should use z.coerce.number().int() to match the TypeScript types. ' +
        'See https://github.com/camunda/orchestration-cluster-api-js/issues/124'
    ).toBe(0);
  });

  it('zod.gen.ts contains no BigInt() literals in constraints or defaults', () => {
    const source = readFileSync(ZOD_GEN_PATH, 'utf8');
    const matches = source.match(/BigInt\(\s*[\d-]+\s*\)/g) ?? [];
    expect(
      matches.length,
      `Found ${matches.length} BigInt() literal(s) in zod.gen.ts. ` +
        'These should be plain number literals to match z.coerce.number() schemas.'
    ).toBe(0);
  });
});
