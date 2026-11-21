/*
 * Guards the release workflow's API-report sequencing (PR #703 review):
 * the "Bump version & regenerate artifacts" step of the publish job must
 *
 *   1. run the committed-input API check (generate:local && build:types &&
 *      api:check) BEFORE the fetching `npm run build` — that build re-bundles
 *      the spec from camunda/camunda@main, so a check after it can fail on
 *      upstream movement the release did not cause; and
 *   2. refresh the committed API reports (`api:update`) AFTER that final
 *      build — the fetching build can move the public declarations, and the
 *      release commit must record reports matching the declarations it ships,
 *      or the next PR's committed-input check fails on drift it did not cause.
 *
 * Scoped to the defect class: this asserts the relative ORDER of the commands,
 * not the presence of any one line, so reordering or dropping any of them
 * fails the test. In particular it asserts the full
 * `generate:local → build:types → api:check` committed-input chain: removing
 * `generate:local` or `build:types`, or moving either after `api:check`,
 * would leave the check comparing stale or missing declarations instead of
 * output regenerated from the committed spec inputs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const RELEASE_YML = path.resolve(__dirname, '..', '.github', 'workflows', 'release.yml');

/** Command lines (npm run / npm version) of the publish job's bump step, in order. */
function bumpStepCommands(): string[] {
  const doc = fs.readFileSync(RELEASE_YML, 'utf8');
  const step = doc.match(
    /- name: Bump version & regenerate artifacts\n(?:.*\n)*? {8}run: \|([\s\S]*?)\n {6}\S/
  );
  if (!step) throw new Error('could not locate the "Bump version & regenerate artifacts" step');
  return step[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('npm '));
}

describe('release workflow API report sequencing', () => {
  it('checks the committed-input API surface before the fetching build, and refreshes the reports after it', () => {
    const commands = bumpStepCommands();
    const at = (cmd: string) => {
      const i = commands.indexOf(cmd);
      expect(i, `expected bump step to run \`${cmd}\``).toBeGreaterThanOrEqual(0);
      return i;
    };
    const generateLocal = at('npm run generate:local');
    const buildTypes = at('npm run build:types');
    const check = at('npm run api:check');
    const build = at('npm run build');
    const update = at('npm run api:update');
    // Committed-input chain first — regenerate from the committed spec, build
    // declarations, then check — so api:check compares freshly regenerated
    // committed-input declarations, not stale or missing ones.
    expect(generateLocal).toBeLessThan(buildTypes);
    expect(buildTypes).toBeLessThan(check);
    // Committed-input check before the fetching build; report refresh last.
    expect(check).toBeLessThan(build);
    expect(build).toBeLessThan(update);
  });
});
