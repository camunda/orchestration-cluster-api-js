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

  it('fails when a reachable non-exported helper type changes', { timeout: T }, () => {
    // tsup's declaration bundler emits public-signature helpers without
    // exporting them (e.g. `EffectifyMethod`, `NodeBuiltins`). The report must
    // record such a helper's full definition (includeForgottenExports), not
    // just its name in a warning — otherwise mutating it silently changes a
    // public return type without changing the recorded surface.
    setupFixture({ withReports: true });
    mutateDist(
      (c) =>
        'declare type ResultOf<F> = F extends (...a: never[]) => infer R ? Awaited<R> : never;\n' +
        c.replace(
          'export declare function createThing(name: string): { id: string };',
          'export declare function createThing(name: string): { id: string };\nexport declare function call<F extends (...a: never[]) => unknown>(fn: F): ResultOf<F>;'
        )
    );
    expect(run(['--update']).status).toBe(0);
    // Mutate ONLY the non-exported helper's definition.
    mutateDist((c) => c.replace('Awaited<R>', 'Awaited<R> | undefined'));
    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('index.api.md');
    expect(result.stderr).toMatch(/-.*Awaited<R>/);
    expect(result.stderr).toMatch(/\+.*Awaited<R> \| undefined/);
  });

  it('passes when only diagnostic source locations shift (comment-only change)', {
    timeout: T,
  }, () => {
    // API Extractor emits ae-* messages with source locations
    // (`dist/<hash>.d.ts:line:col`). A comment-only change shifts those
    // locations without changing the public API, so the check must stay green.
    // The fixture needs a forgotten export so the report has ae-* message
    // lines whose locations can shift.
    setupFixture({ withReports: true });
    mutateDist(
      (c) =>
        'declare type ResultOf<F> = F extends (...a: never[]) => infer R ? Awaited<R> : never;\n' +
        c.replace(
          'export declare function createThing(name: string): { id: string };',
          'export declare function createThing(name: string): { id: string };\nexport declare function call<F extends (...a: never[]) => unknown>(fn: F): ResultOf<F>;'
        )
    );
    expect(run(['--update']).status).toBe(0);
    // Sanity: the helper's full definition is recorded (includeForgottenExports)
    // and no diagnostic source locations survive normalization.
    const committed = fs.readFileSync(path.join(tmp, 'etc', 'index.api.md'), 'utf8');
    expect(committed).toContain('type ResultOf<F>');
    expect(committed).not.toMatch(/\.d\.ts:\d+:\d+/);
    // Comment-only change: shifts the line:col of every ae-* message below it
    // without touching any signature or doc status.
    mutateDist((c) =>
      c.replace('declare type ResultOf', '// layout-only comment\ndeclare type ResultOf')
    );
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('public API surface unchanged');
  });
});
