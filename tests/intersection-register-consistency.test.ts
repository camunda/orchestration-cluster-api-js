/**
 * Regression guard for the misattributed intersection `.register()` defect fixed by
 * hooks/post/619-fix-intersection-register.ts.
 *
 * @hey-api/openapi-ts emits allOf schemas with a top-level description as
 * `<base>.and(z.object({ ... }).register(z.globalRegistry, { description: ... }))`. The
 * `.register()` call there targets the anonymous inline `z.object({...})` argument passed to
 * `.and()`, not the `ZodIntersection` instance bound to the exported const. Metadata registered
 * via `z.globalRegistry` is keyed by schema *instance*, so `z.globalRegistry.get(zExported)`
 * would return nothing for any const left in this shape — the description is registered
 * against an object nobody can look up.
 *
 * This test targets the **class** of defect: any exported schema whose declaration is
 * `<base>.and(z.object({...}).register(...))` with no outer `.register(...)` wrapping the
 * whole `.and(...)` call, across the entire generated file — not just one instance.
 *
 * The 720 hook wraps every schema initialiser in a pure-annotated IIFE
 * (`/*#__PURE__...` + `(() => ...)()`), so
 * the extractor accepts both the bare form and the IIFE-wrapped form. It also asserts a
 * non-zero candidate count: a guard whose regex matches nothing passes vacuously, which
 * is exactly the failure mode the IIFE wrap would otherwise introduce.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ZOD_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'zod.gen.ts');

describe('intersection schema .register() consistency', () => {
  it('zod.gen.ts registers metadata on the exported intersection, not its inline operand', () => {
    const source = readFileSync(ZOD_GEN_PATH, 'utf8');
    const lines = source.split('\n');

    // Accepts both the bare form (`export const zX = zBase.and(z.object({`) and the
    // 720-hook IIFE-wrapped form (`export const zX = /*#__PURE__*/ (() => zBase.and(z.object({`).
    const openRe =
      /^export const (\w+) = (?:\/\*#__PURE__\*\/ \(\(\) => )?[\w.]+\.and\(z\.object\(\{/;
    // Anchored with no leading whitespace — see hooks/post/619-fix-intersection-register.ts for
    // why the unindented close is what distinguishes the outer object's own closing brace from
    // an indented property line that happens to end the same way.
    const midRe = /^\}\)\.register\(z\.globalRegistry, \{$/;

    const violations: string[] = [];
    let candidates = 0;
    for (let i = 0; i < lines.length; i++) {
      const openMatch = openRe.exec(lines[i]);
      if (!openMatch) continue;
      candidates++;
      const name = openMatch[1];

      let foundMid = -1;
      for (let j = i + 1; j < lines.length && j < i + 60; j++) {
        if (midRe.test(lines[j])) {
          foundMid = j;
          break;
        }
        // Statement resolved (with or without an outer register) before an inner register
        // was found — no defect on this const. The close is `}` + one-or-more `)` +
        // optional IIFE invocation `()` + optional `;` (bare `}));` vs IIFE `})))();`),
        // or the start of an outer `.register(` (`})).register(`).
        if (/^\}\)+(\(\))?;?$/.test(lines[j]) || /^\}\)+\.register\(/.test(lines[j])) break;
      }
      if (foundMid === -1) continue;

      // An inner `.register()` was found immediately after the inline object closes. This is
      // only a defect if the statement terminates with the bare `.and()` close rather than an
      // outer `.register()` (`})).register(`) — i.e. nothing rescues the metadata onto the
      // exported binding. The bare close may itself be IIFE-terminated (`})))();`).
      for (let k = foundMid + 1; k < lines.length && k < foundMid + 15; k++) {
        if (/^\}\)+(\(\))?;?$/.test(lines[k]) && !/\.register\(/.test(lines[k])) {
          violations.push(name);
          break;
        }
        if (/^\}\)+\.register\(/.test(lines[k])) break;
      }
    }

    expect(
      candidates,
      'The intersection extractor matched zero declarations — the guard is vacuous. ' +
        'Update openRe to the current zod.gen.ts declaration shape (see hooks/post/720-pure-zod-schemas.ts).'
    ).toBeGreaterThan(0);
    expect(
      violations.length,
      `Found exported intersection schema(s) whose .register() metadata targets the inline ` +
        `.and() operand instead of the exported binding: ${violations.join(', ')}. ` +
        'See hooks/post/619-fix-intersection-register.ts.'
    ).toBe(0);
  });
});
