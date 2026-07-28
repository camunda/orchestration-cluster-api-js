/**
 * Regression guard for CVE-2026-48819 / GHSA-hhx9-57xq-r5rw: the generated
 * `buildClientParams` must not let a caller-supplied key reach the `__proto__`
 * setter.
 *
 * src/gen/core/params.gen.ts is a runtime template copied out of
 * @hey-api/openapi-ts and shipped to consumers. It writes caller-controlled keys
 * into the `body` / `headers` / `path` / `query` slots, so those slots must have a
 * null prototype (upstream's 0.97.3 fix, applied on this branch by
 * scripts/postprocess-harden-client-params.ts).
 *
 * This targets the **class** of defect — a behavioural check that pollution is
 * impossible, plus a static check that no slot regresses to a plain `{}` — rather
 * than any single field.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { buildClientParams } from '../src/gen/core/params.gen';

const PARAMS_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'core', 'params.gen.ts');
const SLOTS = ['body', 'headers', 'path', 'query'] as const;

describe('buildClientParams prototype pollution', () => {
  it('params.gen.ts initialises every slot with a null prototype', () => {
    const source = readFileSync(PARAMS_GEN_PATH, 'utf8');
    const initialiser = source.match(/const params: Params = \{[\s\S]*?\n\s*\};/);

    expect(
      initialiser,
      'Could not find the `const params: Params = {...}` initialiser in params.gen.ts'
    ).not.toBeNull();

    const unhardened = SLOTS.filter((slot) =>
      new RegExp(`\\b${slot}:\\s*\\{\\}`).test(initialiser![0])
    );

    expect(
      unhardened,
      `Slot(s) ${unhardened.join(', ')} use a plain object literal. They must use ` +
        'Object.create(null) so a caller-supplied `__proto__` key cannot invoke the ' +
        'prototype setter. See scripts/postprocess-harden-client-params.ts and ' +
        'https://github.com/advisories/GHSA-hhx9-57xq-r5rw'
    ).toEqual([]);
  });

  it('does not pollute Object.prototype via a $<slot>___proto__ extra key', () => {
    const fields = [{ args: [{ in: 'query' as const, key: 'q' }] }];

    const params = buildClientParams(
      [{ q: 'hello', $query___proto__: { polluted: 'yes' } }],
      fields
    );

    // The global prototype must be untouched...
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.prototype).not.toHaveProperty('polluted');
    // ...and the returned slot must not have inherited the payload either.
    expect(Object.getPrototypeOf(params.query)).toBeNull();
    expect((params.query as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('does not pollute Object.prototype via a bare __proto__ key under allowExtra', () => {
    const fields = [{ allowExtra: { query: true }, args: [] }];

    buildClientParams([{ __proto__: { alsoPolluted: 'yes' } }], fields);

    expect(({} as Record<string, unknown>).alsoPolluted).toBeUndefined();
    expect(Object.prototype).not.toHaveProperty('alsoPolluted');
  });
});
