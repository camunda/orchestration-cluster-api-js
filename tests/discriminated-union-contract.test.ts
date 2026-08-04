import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as schemas from '../src/gen/zod.gen';

// Regression guard for the discriminated-union half of the #405 generator audit.
//
// @hey-api/openapi-ts 0.86 always materialised an OpenAPI `discriminator` into
// the generated union. From 0.99 it only does so when the discriminator
// property is declared *required* on each member schema — and the Camunda spec
// declares it optional and loosely typed (`type?: string`) on several members.
// Those unions silently degraded to a bare `A | B`, which is not discriminated
// at all: because every member property is optional, TypeScript accepted a
// payload with the discriminator missing or misspelled, and the zod schema
// accepted `{}`.
//
// Concretely, `completeJob({ ..., result: { denied: true } })` compiled and
// passed `CAMUNDA_SDK_VALIDATION=req:strict`, and the broker received a job
// result it could not classify.
//
// `hooks/post/618-restore-discriminators.ts` restores the discriminator. These
// tests assert the *contract*, driven off the bundled spec rather than a
// hard-coded list, so a newly added discriminated union is covered the moment
// it appears — and so the guard cannot go stale if the generator changes shape
// again.

const ROOT = path.resolve(__dirname, '..');
const spec = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'external-spec/bundled/rest-api.bundle.json'), 'utf8')
);
const typesSrc = fs.readFileSync(path.join(ROOT, 'src/gen/types.gen.ts'), 'utf8');

interface DiscriminatedUnion {
  name: string;
  prop: string;
  members: Array<{ literal: string; member: string }>;
}

/** Every `oneOf` + `discriminator` schema declared in the bundled spec. */
const unions: DiscriminatedUnion[] = Object.entries(
  (spec.components?.schemas ?? {}) as Record<string, any>
)
  .filter(([, s]) => s?.discriminator?.propertyName && s?.discriminator?.mapping && s?.oneOf)
  .map(([name, s]) => ({
    name,
    prop: s.discriminator.propertyName as string,
    members: Object.entries(s.discriminator.mapping as Record<string, string>).map(
      ([literal, ref]) => ({
        literal,
        member: String(ref).replace(/^#\/components\/schemas\//, ''),
      })
    ),
  }));

/**
 * Read the `export type <name> = ...;` body out of types.gen.ts. Scans to the
 * terminating `;` at nesting depth 0 — the union members contain their own
 * `;`-separated properties, so a non-greedy regex would stop at the first one.
 */
function emittedType(name: string): string | undefined {
  const head = `\nexport type ${name} = `;
  const start = typesSrc.indexOf(head);
  if (start === -1) return undefined;
  const from = start + head.length;
  let depth = 0;
  let i = from;
  for (; i < typesSrc.length; i++) {
    const c = typesSrc[i];
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === ';' && depth === 0) break;
  }
  return typesSrc.slice(from, i);
}

describe('discriminated unions keep their discriminator (#405)', () => {
  it('the spec still declares discriminated unions (guard is not vacuous)', () => {
    expect(unions.length).toBeGreaterThan(0);
    // The two that regressed under 0.99 — if the spec drops or renames them the
    // rest of this file would quietly stop testing the actual regression.
    const names = unions.map((u) => u.name);
    expect(names).toContain('JobResult');
    expect(names).toContain('ProcessInstanceCreationRuntimeInstruction');
  });

  describe.each(unions)('$name', ({ name, prop, members }) => {
    it('the emitted TypeScript union carries the literal discriminator', () => {
      const body = emittedType(name);
      expect(body, `export type ${name} not found in types.gen.ts`).toBeDefined();
      for (const { literal } of members) {
        // e.g. `type: 'userTask'` — required, and a literal rather than `string`.
        expect(body).toMatch(new RegExp(`${prop}\\s*:\\s*'${literal}'`));
      }
    });

    it('the emitted zod schema is exported', () => {
      expect(
        (schemas as Record<string, unknown>)[`z${name}`],
        `z${name} not exported from zod.gen.ts`
      ).toBeDefined();
    });

    it('the zod schema rejects a payload with no discriminator', () => {
      const schema = (schemas as Record<string, any>)[`z${name}`];
      // Every member property is optional on several of these schemas, so an
      // empty object is exactly the payload a non-discriminated union waves
      // through. It must fail.
      expect(schema.safeParse({}).success).toBe(false);
    });

    it('the zod schema rejects an unknown discriminator value', () => {
      const schema = (schemas as Record<string, any>)[`z${name}`];
      expect(schema.safeParse({ [prop]: '__not_a_valid_discriminator__' }).success).toBe(false);
    });
  });
});

// Positive cases for the two unions that actually regressed, so the guard also
// proves the restored schemas did not over-tighten into rejecting valid input.
describe('restored unions still accept valid payloads', () => {
  it('JobResult accepts a userTask result', () => {
    const r = schemas.zJobResult.safeParse({ type: 'userTask', denied: true });
    expect(r.success, JSON.stringify((r as any).error?.issues)).toBe(true);
  });

  it('JobResult accepts an adHocSubProcess result', () => {
    const r = schemas.zJobResult.safeParse({
      type: 'adHocSubProcess',
      isCompletionConditionFulfilled: true,
    });
    expect(r.success, JSON.stringify((r as any).error?.issues)).toBe(true);
  });

  it('JobResult rejects a userTask result that omits the discriminator', () => {
    expect(schemas.zJobResult.safeParse({ denied: true }).success).toBe(false);
  });

  it('ProcessInstanceCreationRuntimeInstruction accepts a terminate instruction', () => {
    const r = schemas.zProcessInstanceCreationRuntimeInstruction.safeParse({
      type: 'TERMINATE_PROCESS_INSTANCE',
      afterElementId: 'some-element',
    });
    expect(r.success, JSON.stringify((r as any).error?.issues)).toBe(true);
  });

  it('ProcessInstanceCreationRuntimeInstruction rejects one that omits the discriminator', () => {
    expect(
      schemas.zProcessInstanceCreationRuntimeInstruction.safeParse({
        afterElementId: 'some-element',
      }).success
    ).toBe(false);
  });
});
