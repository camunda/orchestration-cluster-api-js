import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Regression guard for the toolchain half of the #405 generator audit.
//
// @hey-api/openapi-ts raised `engines.node` from >=20.19.0 to >=22.18.0 in
// 0.96.0. The 0.86.12 -> 0.99.0 upgrade landed as a lockfile-only Renovate PR,
// so nothing forced anyone to notice, and the CI test matrix kept a Node 20 leg
// that runs `npm run build` -> `npm run generate` -> openapi-ts. That leg was
// regenerating the whole SDK on a runtime the generator does not support; it
// stayed green only because npm's engine check is a warning by default.
//
// This test ties the three numbers together — the CI matrix, this package's
// engines, and the generator's engines — so the next time a dev-tool raises its
// Node floor, CI says so instead of silently running unsupported.

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/** Lowest major from a `node: [22.x, 24.x]` matrix line in the workflow. */
function matrixNodeMajors(): number[] {
  const ci = read('.github/workflows/ci.yml');
  const m = /^\s*node:\s*\[([^\]]+)\]/m.exec(ci);
  expect(m, 'could not find a `node: [...]` matrix in .github/workflows/ci.yml').toBeTruthy();
  return (m as RegExpExecArray)[1]
    .split(',')
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

/** Major.minor floor from a `>=X.Y.Z` / `>=X` engines range. */
function engineFloor(range: string | undefined): { major: number; minor: number } {
  expect(range, 'missing engines.node').toBeTruthy();
  const m = /(\d+)(?:\.(\d+))?/.exec(range as string);
  expect(m, `could not parse a floor out of engines.node "${range}"`).toBeTruthy();
  return {
    major: Number.parseInt((m as RegExpExecArray)[1], 10),
    minor: Number.parseInt((m as RegExpExecArray)[2] ?? '0', 10),
  };
}

describe('CI Node matrix stays within the toolchain floor (#405)', () => {
  const majors = matrixNodeMajors();
  const pkg = JSON.parse(read('package.json'));
  const generator = JSON.parse(read('node_modules/@hey-api/openapi-ts/package.json'));

  it('the matrix is non-empty (guard is not vacuous)', () => {
    expect(majors.length).toBeGreaterThan(0);
  });

  it('every matrix Node satisfies this package engines.node', () => {
    const floor = engineFloor(pkg.engines?.node);
    for (const major of majors) {
      expect(
        major,
        `CI runs Node ${major}.x but package.json requires >=${floor.major}`
      ).toBeGreaterThanOrEqual(floor.major);
    }
  });

  it('every matrix Node satisfies @hey-api/openapi-ts engines.node', () => {
    // The `test` job regenerates via `npm run build`, so the generator's floor
    // applies to every leg of the matrix, not just the `quality` job.
    const floor = engineFloor(generator.engines?.node);
    for (const major of majors) {
      expect(
        major,
        `CI regenerates on Node ${major}.x but @hey-api/openapi-ts@${generator.version} ` +
          `requires >=${floor.major}.${floor.minor}`
      ).toBeGreaterThanOrEqual(floor.major);
    }
  });

  it('this package does not claim to support a Node the generator cannot build on', () => {
    const pkgFloor = engineFloor(pkg.engines?.node);
    const genFloor = engineFloor(generator.engines?.node);
    expect(
      pkgFloor.major,
      `package.json engines.node >=${pkgFloor.major} but the generator requires ` +
        `>=${genFloor.major}.${genFloor.minor}`
    ).toBeGreaterThanOrEqual(genFloor.major);
  });
});
