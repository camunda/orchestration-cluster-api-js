/**
 * Regression guard for #120: VOID_RESPONSES must only contain pure z.void() schemas,
 * never z.union([..., z.void()]) schemas. A union response means the endpoint can
 * return both a body (e.g. 200) and void (e.g. 204); treating it as void-only
 * discards the body.
 *
 * This test targets the **class** of defect (any union incorrectly in VOID_RESPONSES),
 * not just the two specific schemas that triggered the original bug.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ZOD_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'zod.gen.ts');
const CLIENT_GEN_PATH = join(__dirname, '..', 'src', 'gen', 'CamundaClient.ts');

describe('VOID_RESPONSES correctness', () => {
  it('does not include any response schema that is a z.union containing non-void members', () => {
    const zodSrc = readFileSync(ZOD_GEN_PATH, 'utf8');
    const clientSrc = readFileSync(CLIENT_GEN_PATH, 'utf8');

    // Extract the VOID_RESPONSES set entries from CamundaClient.ts
    const voidSetMatch = clientSrc.match(/const VOID_RESPONSES\s*=\s*new Set\(\[([^\]]+)\]\)/);
    expect(voidSetMatch).toBeTruthy();
    const voidNames = voidSetMatch![1].split(',').map((s) => s.trim().replace(/'/g, ''));

    // For each entry, verify the zod schema is pure z.void(), not a union
    const unionFalsePositives: string[] = [];
    for (const name of voidNames) {
      // Find the export for this schema in zod.gen.ts
      const re = new RegExp(`export const ${name}\\s*=\\s*([^;]+);`);
      const m = zodSrc.match(re);
      if (!m) continue; // schema not found — separate concern
      const rhs = m[1];
      // If it contains z.union, it's not a pure void response
      if (/z\.union\s*\(/.test(rhs)) {
        unionFalsePositives.push(name);
      }
    }

    expect(
      unionFalsePositives,
      `These response schemas are z.union types (can return a body) but were incorrectly classified as void-only: ${unionFalsePositives.join(', ')}`
    ).toEqual([]);
  });

  it('includes all pure z.void() response schemas', () => {
    const zodSrc = readFileSync(ZOD_GEN_PATH, 'utf8');
    const clientSrc = readFileSync(CLIENT_GEN_PATH, 'utf8');

    // Extract VOID_RESPONSES entries
    const voidSetMatch = clientSrc.match(/const VOID_RESPONSES\s*=\s*new Set\(\[([^\]]+)\]\)/);
    expect(voidSetMatch).toBeTruthy();
    const voidNames = new Set(voidSetMatch![1].split(',').map((s) => s.trim().replace(/'/g, '')));

    // Find all exported response schemas that are pure z.void()
    const rResp = /export const (z[A-Z][A-Za-z0-9_]*Response)\s*=\s*([^;]+);/g;
    let mm;
    const missingPureVoid: string[] = [];
    while ((mm = rResp.exec(zodSrc))) {
      const name = mm[1];
      const rhs = mm[2];
      // Pure void: the rhs is z.void() (possibly with .register(...))
      // and does NOT contain z.union
      const isVoid = /z\.void\s*\(\)/.test(rhs);
      const isUnion = /z\.union\s*\(/.test(rhs);
      if (isVoid && !isUnion && !voidNames.has(name)) {
        missingPureVoid.push(name);
      }
    }

    expect(
      missingPureVoid,
      `These pure z.void() response schemas are missing from VOID_RESPONSES: ${missingPureVoid.join(', ')}`
    ).toEqual([]);
  });
});
