/**
 * Regression guard for the duplicate `ClientOptions.baseUrl` union-member defect fixed by
 * hooks/post/170-dedupe-baseurl-union.ts.
 *
 * The bundled spec merges multiple upstream OpenAPI documents that can declare identical
 * `servers:` URL templates. @hey-api/openapi-ts emits one union member per source document
 * rather than deduping by value, so `ClientOptions.baseUrl` can end up with the same string
 * literal repeated several times. This doesn't break typing, but the 170 hook removes the noise.
 *
 * This test targets the class of defect generically: any duplicate literal member anywhere in
 * the `baseUrl` union, not just today's specific `'{schema}://{host}:{port}'` repeat.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const TYPES_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'types.gen.ts');

describe('ClientOptions.baseUrl union consistency', () => {
  it('types.gen.ts has no duplicate members in the baseUrl union', () => {
    const source = readFileSync(TYPES_GEN_PATH, 'utf8');

    const match = /^\s*baseUrl:\s*(.+?);$/m.exec(source);
    expect(
      match,
      'Expected to find a ClientOptions.baseUrl property in types.gen.ts'
    ).not.toBeNull();

    const members = match![1].split(' | ');
    const duplicates = members.filter((m, i) => members.indexOf(m) !== i);

    expect(
      duplicates.length,
      `Found duplicate member(s) in ClientOptions.baseUrl union: ${[...new Set(duplicates)].join(', ')}. ` +
        'See hooks/post/170-dedupe-baseurl-union.ts.'
    ).toBe(0);
  });
});
