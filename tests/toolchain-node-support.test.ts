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
// This test ties the numbers together — every Node version the workflow can
// select, this package's engines, and the generator's engines — so the next
// time a dev-tool raises its Node floor, CI says so instead of silently running
// unsupported.

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const CI_PATH = '.github/workflows/ci.yml';

/**
 * A Node version as the workflow declares it. `minor: null` means the spec
 * leaves the minor open (`22.x`, `22`), which setup-node resolves to the newest
 * release in that major — so it satisfies any floor within the same major.
 */
interface VersionSpec {
  raw: string;
  major: number;
  minor: number | null;
}

/** A `>=X.Y.Z` engines floor. */
interface Floor {
  major: number;
  minor: number;
}

function parseVersionSpec(raw: string): VersionSpec | undefined {
  const m = /^(\d+)(?:\.(\d+|x))?/.exec(raw.trim());
  if (!m) return undefined; // `lts/*`, `node`, an expression — not comparable
  return {
    raw: raw.trim(),
    major: Number.parseInt(m[1], 10),
    minor: m[2] === undefined || m[2] === 'x' ? null : Number.parseInt(m[2], 10),
  };
}

/**
 * Every Node version the workflow can select: the `node: [...]` matrix plus the
 * standalone `node-version:` scalars used by the jobs that are not matrixed
 * (`quality` and `generation-drift` both run the generator too, so the floor
 * applies to them as well).
 */
function workflowNodeVersions(): VersionSpec[] {
  const ci = read(CI_PATH);
  const raws: string[] = [];

  for (const m of ci.matchAll(/^\s*node:\s*\[([^\]]+)\]/gm)) {
    raws.push(...m[1].split(',').map((s) => s.trim()));
  }
  for (const m of ci.matchAll(/^\s*node-version:\s*(\S+)/gm)) {
    // Skip matrix indirection (`${{ matrix.node }}`) — covered by the list above.
    if (!m[1].includes('${{')) raws.push(m[1].trim());
  }

  return raws.map(parseVersionSpec).filter((v): v is VersionSpec => v !== undefined);
}

function engineFloor(range: string | undefined, label: string): Floor {
  expect(range, `missing engines.node for ${label}`).toBeTruthy();
  const m = /(\d+)(?:\.(\d+))?/.exec(range as string);
  expect(m, `could not parse a floor out of ${label} engines.node "${range}"`).toBeTruthy();
  return {
    major: Number.parseInt((m as RegExpExecArray)[1], 10),
    minor: Number.parseInt((m as RegExpExecArray)[2] ?? '0', 10),
  };
}

/**
 * Whether a workflow version spec is guaranteed to resolve to a runtime that
 * satisfies `floor`. An open minor (`22.x`) resolves to the newest release in
 * that major, so it clears any floor in the same major; a pinned minor
 * (`22.14.3`) has to be compared outright.
 */
function satisfies(spec: VersionSpec, floor: Floor): boolean {
  if (spec.major !== floor.major) return spec.major > floor.major;
  return spec.minor === null || spec.minor >= floor.minor;
}

const fmtFloor = (f: Floor) => `>=${f.major}.${f.minor}`;

describe('CI Node versions stay within the toolchain floor (#405)', () => {
  const versions = workflowNodeVersions();
  const pkg = JSON.parse(read('package.json'));
  const generator = JSON.parse(read('node_modules/@hey-api/openapi-ts/package.json'));

  it('the workflow declares comparable Node versions (guard is not vacuous)', () => {
    expect(
      versions.length,
      `no parseable Node version found in ${CI_PATH} — the workflow shape may have changed`
    ).toBeGreaterThan(0);
  });

  it('every workflow Node satisfies this package engines.node', () => {
    const floor = engineFloor(pkg.engines?.node, 'package.json');
    for (const spec of versions) {
      expect(
        satisfies(spec, floor),
        `${CI_PATH} runs Node ${spec.raw} but package.json requires ${fmtFloor(floor)}`
      ).toBe(true);
    }
  });

  it('every workflow Node satisfies @hey-api/openapi-ts engines.node', () => {
    // `quality`, `generation-drift` and every leg of `test` all invoke the
    // generator, so its floor applies to all of them — including the minor,
    // which is what 0.96.0 actually raised (20.19.0 -> 22.18.0).
    const floor = engineFloor(generator.engines?.node, '@hey-api/openapi-ts');
    for (const spec of versions) {
      expect(
        satisfies(spec, floor),
        `${CI_PATH} regenerates on Node ${spec.raw} but ` +
          `@hey-api/openapi-ts@${generator.version} requires ${fmtFloor(floor)}`
      ).toBe(true);
    }
  });

  // Deliberately NOT asserted: that `package.json` engines.node clears the
  // generator's floor. @hey-api/openapi-ts is a devDependency — consumers of the
  // published package never run it — so propagating its floor (currently
  // >=22.18.0) into engines.node would narrow the supported runtime for users
  // for no reason. The generator's floor constrains CI and contributors, which
  // is exactly what the workflow assertion above covers.
});
