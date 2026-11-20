/*
 * Guards the public API surface guard (scripts/api-report.ts, issue #700).
 *
 * Scoped to the defect class, not one instance: the guard must FAIL with a
 * readable diff whenever the built public API surface differs from the
 * committed reports in etc/ — for ANY entry point (a spec bump, generator or
 * hook change can touch index, fn, effect, logger or the platform entries) —
 * and PASS when nothing changed, so a no-op dependency bump stays green.
 *
 * The test builds tiny fixture declarations in a temp copy of the config and
 * runs the real script against them via API_REPORT_* env overrides; it never
 * touches the repo's own dist/ or etc/.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const REPO_ROOT = path.resolve(__dirname, '..');
const SCRIPT = path.join(REPO_ROOT, 'scripts', 'api-report.ts');

let tmp: string;

/** Minimal two-entry fixture: one "dist" tree, one committed "etc" tree. */
function setupFixture(opts: { withReports?: boolean } = {}): void {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'api-report-test-'));
  fs.mkdirSync(path.join(tmp, 'dist'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'etc'), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, 'dist', 'index.d.ts'),
    'export declare function createThing(name: string): { id: string };\nexport declare const MODE: "a" | "b";\n'
  );
  fs.writeFileSync(
    path.join(tmp, 'dist', 'logger.d.ts'),
    'export declare function createLogger(): { info(msg: string): void };\n'
  );
  if (opts.withReports) {
    run(['--update']);
  }
}

interface RunResult {
  status: number;
  stdout: string;
  stderr: string;
}

function run(args: string[] = []): RunResult {
  try {
    const stdout = execFileSync(process.execPath, ['--import', 'tsx', SCRIPT, ...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        API_REPORT_ROOT: tmp,
        API_REPORT_ENTRIES: 'index:dist/index.d.ts,logger:dist/logger.d.ts',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { status: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

function mutateDist(edit: (content: string) => string): void {
  const dts = path.join(tmp, 'dist', 'index.d.ts');
  fs.writeFileSync(dts, edit(fs.readFileSync(dts, 'utf8')));
}

beforeEach(() => {
  tmp = '';
});

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
});

describe('api-report guard', () => {
  // Each run spawns API Extractor (a full TypeScript analysis) per entry point;
  // ~6s per invocation. The timeout is a safety net for runner load, not a
  // correctness signal.
  const T = 60_000;

  it('passes when the built declarations match the committed reports', { timeout: T }, () => {
    setupFixture({ withReports: true });
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('public API surface unchanged');
  });

  it('fails with a readable diff when a public type is narrowed', { timeout: T }, () => {
    setupFixture({ withReports: true });
    // Drop a union variant — the silent drift class from issue #700.
    mutateDist((c) => c.replace('"a" | "b"', '"a"'));
    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Public API surface changed');
    expect(result.stderr).toContain('index.api.md');
    // The diff must name the removed variant so a reviewer can read it.
    expect(result.stderr).toMatch(/-.*"a" \| "b"/);
    expect(result.stderr).toMatch(/\+.*"a"/);
    expect(result.stderr).toContain('npm run api:update');
  });

  it('fails when an export is removed from any entry point', { timeout: T }, () => {
    setupFixture({ withReports: true });
    mutateDist((c) => c.replace('export declare const MODE: "a" | "b";\n', ''));
    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('index.api.md');
  });

  it('fails when a committed report is missing', { timeout: T }, () => {
    setupFixture({ withReports: true });
    fs.rmSync(path.join(tmp, 'etc', 'logger.api.md'));
    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('logger.api.md');
  });

  it('passes again after api:update refreshes the reports', { timeout: T }, () => {
    setupFixture({ withReports: true });
    mutateDist((c) => c.replace('"a" | "b"', '"a"'));
    expect(run().status).toBe(1);
    const update = run(['--update']);
    expect(update.status).toBe(0);
    expect(run().status).toBe(0);
  });

  it('refuses to run without built declarations', { timeout: T }, () => {
    setupFixture(); // no --update, and remove dist
    fs.rmSync(path.join(tmp, 'dist'), { recursive: true, force: true });
    const result = run();
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('npm run build');
  });
});
