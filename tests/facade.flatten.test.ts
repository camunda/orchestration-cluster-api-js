import fs from 'fs';
import path from 'path';

import { describe, it, expect } from 'vitest';

// Regression guard: body-only operations must expose ONLY a (body, ...) signature.
// They are identified in the generated facade by the trio of type aliases:
//   type _<op>_Options ...
//   type _<op>_MaybeBody ...
//   type _<op>_Body ...
// Passthrough (non body-only) operations will NOT have a _<op>_Body alias.
// For every body-only op we assert:
//  1. Exactly one exported function definition line for that op.
//  2. That definition starts with first parameter named 'body'.
//  3. There is no overload variant containing '(options:' for that op.
//  4. There is no generic union style overload with (arg: any) for that op.

describe('facade body-only operation flattening', () => {
  const facadePath = path.resolve(__dirname, '../src/facade/operations.gen.ts').replace(/\\/g, '/');
  const src = fs.readFileSync(facadePath, 'utf8');
  const lines = src.split(/\r?\n/);

  // Collect body-only operation names
  const bodyTypeRe = /^type _([a-zA-Z0-9_]+)_Body\b/;
  const bodyOnlyOps = lines
    .map((l) => {
      const m = l.match(bodyTypeRe);
      return m ? m[1] : null;
    })
    .filter((v): v is string => !!v);

  // Deduplicate in case of accidental repeats
  const uniqueBodyOnly = Array.from(new Set(bodyOnlyOps)).sort();

  it('has at least one body-only operation (sanity)', () => {
    expect(uniqueBodyOnly.length).toBeGreaterThan(0);
  });

  it('ensures each body-only operation exposes only a single body signature', () => {
    const violations: string[] = [];
    for (const op of uniqueBodyOnly) {
      const fnDefRe = new RegExp(`^export function ${op}\\(`);
      const fnLines = lines.filter((l) => fnDefRe.test(l));
      if (fnLines.length !== 1) {
        violations.push(`${op}: expected 1 function definition, found ${fnLines.length}`);
        continue;
      }
      const sig = fnLines[0];
      // Parameter list portion after op(
      const params = sig.substring(sig.indexOf('(') + 1, sig.indexOf(')')); // crude but adequate
      if (!/^body\s*:/.test(params.trim())) {
        violations.push(`${op}: first parameter is not 'body': ${params}`);
      }
      if (/options\s*:/.test(sig)) {
        violations.push(`${op}: contains unexpected options parameter`);
      }
      // Check any stray overload lines referencing options or arg: any for this op
      const overloadOptionsRe = new RegExp(`export function ${op}\\(options:`);
      const overloadArgAnyRe = new RegExp(`export function ${op}\\(arg:`);
      if (lines.some((l) => overloadOptionsRe.test(l))) {
        violations.push(`${op}: overload with options: detected`);
      }
      if (lines.some((l) => overloadArgAnyRe.test(l))) {
        violations.push(`${op}: overload with arg: any detected`);
      }
    }
    if (violations.length) {
      // Provide helpful diff-like output
      throw new Error('Body-only facade flattening regressions:\n' + violations.join('\n'));
    }
  });
});
