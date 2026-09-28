import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// TypeDoc flattens every linked repo file into `_media/<basename>`, dropping its directory.
// camunda-docs cannot resolve `_media/` (and runs any `*.test.ts` in it as a Jest test),
// so the post-processor must link each file at its real repo path and ship no `_media/`.

const script = join(__dirname, '..', 'scripts', 'postprocess-md-docs.mjs');
const GITHUB_BASE = 'https://github.com/camunda/orchestration-cluster-api-js/blob/main/';

let docsDir: string;

function setup(pages: Record<string, string>, media: string[]) {
  docsDir = mkdtempSync(join(tmpdir(), 'docs-md-'));
  for (const [name, body] of Object.entries(pages)) {
    mkdirSync(dirname(join(docsDir, name)), { recursive: true });
    writeFileSync(join(docsDir, name), body);
  }
  mkdirSync(join(docsDir, '_media'));
  for (const name of media) writeFileSync(join(docsDir, '_media', name), '');
  return spawnSync(process.execPath, [script, docsDir], { encoding: 'utf8' });
}

afterEach(() => rmSync(docsDir, { recursive: true, force: true }));

describe('postprocess-md-docs _media handling', () => {
  it('links every _media file at its real repo path, from any page depth', () => {
    const run = setup(
      {
        'index.md': 'See [di](_media/effect-worker-di.test.ts) and [m](_media/MIGRATION.md#x).',
        'effect/functions/f.md': 'See [c](../../_media/CONTRIBUTING.md).',
      },
      ['effect-worker-di.test.ts', 'MIGRATION.md', 'CONTRIBUTING.md']
    );

    expect(run.status, run.stderr).toBe(0);
    const index = readFileSync(join(docsDir, 'index.md'), 'utf8');
    expect(index).toContain(`(${GITHUB_BASE}tests/effect-worker-di.test.ts)`);
    expect(index).toContain(`(${GITHUB_BASE}MIGRATION.md#x)`);
    const nested = readFileSync(join(docsDir, 'effect/functions/f.md'), 'utf8');
    expect(nested).toContain(`(${GITHUB_BASE}CONTRIBUTING.md)`);
    expect(index + nested).not.toContain('_media/');
  });

  it('does not ship the _media directory', () => {
    const run = setup({ 'index.md': '[m](_media/MIGRATION.md)' }, ['MIGRATION.md']);

    expect(run.status, run.stderr).toBe(0);
    expect(existsSync(join(docsDir, '_media'))).toBe(false);
  });

  it('fails rather than guess when a _media file is not a tracked repo file', () => {
    const run = setup({ 'index.md': '[x](_media/no-such-file.ts)' }, ['no-such-file.ts']);

    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('no-such-file.ts');
  });

  it('fails rather than guess when a _media file matches several tracked files', () => {
    // index.ts is tracked at several paths (src/, src/gen/, example-app/, ...).
    const run = setup({ 'index.md': '[x](_media/index.ts)' }, ['index.ts']);

    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('src/index.ts');
    expect(readFileSync(join(docsDir, 'index.md'), 'utf8')).not.toContain(GITHUB_BASE);
  });
});
