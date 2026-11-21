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

function run(args: string[] = [], opts: { deriveFromPackage?: boolean } = {}): RunResult {
  const env: Record<string, string | undefined> = {
    ...process.env,
    API_REPORT_ROOT: tmp,
    API_REPORT_ENTRIES: 'index:dist/index.d.ts,logger:dist/logger.d.ts',
  };
  if (opts.deriveFromPackage) {
    // Let the script derive the entry points from the fixture's package.json
    // instead of pinning them (the entry-point map guard tests need this).
    delete env.API_REPORT_ENTRIES;
  }
  try {
    const stdout = execFileSync(process.execPath, ['--import', 'tsx', SCRIPT, ...args], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env,
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
  // Safety net, not a correctness signal: each case spawns API Extractor several times and is slow on a loaded runner.
  const T = 180_000;

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

  it('fails update AND check when a declaration has an unresolved import', {
    timeout: T,
  }, () => {
    // Compiler diagnostics (ts2304/2305/2307 — unresolved types or imports)
    // mean the extracted report does not faithfully describe the public API:
    // the unresolved symbol is silently recorded as `any`. The guard must
    // refuse to record (--update) or accept (check) such a report — a warning
    // is not enough, because a warning still lets update commit the invalid
    // report and the next byte-exact check then passes against it.
    setupFixture();
    mutateDist(
      (c) =>
        "import type { Missing } from './does-not-exist';\n" +
        c.replace(
          'export declare function createThing(name: string): { id: string };',
          'export declare function createThing(name: string): { id: Missing };'
        )
    );
    const update = run(['--update']);
    expect(update.status).toBe(1);
    // The invalid report must NOT have been committed.
    expect(fs.existsSync(path.join(tmp, 'etc', 'index.api.md'))).toBe(false);
    // And check mode fails too (no committed report to match, and the
    // extraction itself is invalid).
    expect(run().status).toBe(1);
  });

  it('accepts typeof queries on resolvable namespace imports of Node built-ins', {
    timeout: T,
  }, () => {
    // Guards against false positives: API Extractor's bundled TypeScript 6
    // defaults `types` to [], so without loading @types/node explicitly the
    // `node:*` modules are unresolved and every `typeof node_x` would fail.
    setupFixture();
    mutateDist(
      (c) =>
        "import * as node_url from 'node:url';\n" +
        c +
        'export declare const deps: { url: typeof node_url; u: typeof node_url.URL };\n'
    );
    expect(run(['--update']).status).toBe(0);
  });

  it('accepts a call-expression heritage clause', { timeout: T }, () => {
    // Guards against false positives: `extends mixin(Base)` has no symbol for
    // the full expression, which must not be mistaken for a missing member.
    setupFixture();
    mutateDist(
      (c) =>
        c +
        'declare class Base0 {}\ndeclare function mixin<C>(c: C): C;\n' +
        'export declare class Mixed extends mixin(Base0) {}\n'
    );
    expect(run(['--update']).status).toBe(0);
  });

  it('accepts a valid declaration-less virtual symbol (typeof C.prototype)', { timeout: T }, () => {
    // Guards against false positives: TypeScript creates a valid virtual
    // `prototype` symbol (SymbolFlags.Prototype) for every class, with NO
    // declarations. A public signature referencing `typeof C.prototype` must
    // be accepted by both api:update and api:check — declaration-less is not
    // the same as unresolved. API Extractor's own helper
    // (TypeScriptHelpers.tryGetADeclaration) explicitly tolerates such
    // virtual symbols.
    setupFixture();
    mutateDist(
      (c) =>
        c +
        'export declare class Widget { render(): void; }\n' +
        'export declare const widgetProto: typeof Widget.prototype;\n' +
        "export declare function eeProto(): typeof import('node:events').EventEmitter.prototype;\n"
    );
    expect(run(['--update']).status).toBe(0);
    // And the committed report must then pass a byte-exact check.
    expect(run().status).toBe(0);
  });

  it.each([
    [
      'a mapped-type property (typeof fields.name)',
      "declare const fields: Record<'name', string>;\nexport type Name = typeof fields.name;\n",
    ],
    [
      'a mapped-type property literally named unknown',
      "declare const fields2: Record<'unknown', string>;\nexport type U2 = typeof fields2.unknown;\n",
    ],
    [
      'a homomorphic mapped-type property',
      'interface Src { a: string }\ndeclare const ro: Readonly<Src>;\nexport type A3 = typeof ro.a;\n',
    ],
  ])('accepts a valid synthesized (Transient) symbol: %s', { timeout: T }, (_label, decl) => {
    // Synthesized properties of mapped types are Transient and may lack
    // declarations, yet are perfectly valid references.
    setupFixture();
    mutateDist((c) => c + decl);
    expect(run(['--update']).status).toBe(0);
    expect(run().status).toBe(0);
  });

  it.each([
    [
      'an unresolved import() type',
      "export declare function f(): import('./does-not-exist').Foo;\n",
    ],
    ['an unresolved typeof import()', "export declare const g: typeof import('./also-missing');\n"],
    [
      'an unresolved import() qualifier',
      "export declare function h(): import('./index').NoSuchThing;\n",
    ],
    [
      'an unresolved import used only in a typeof query',
      "import { Missing } from './does-not-exist';\nexport declare const value: typeof Missing;\n",
    ],
    [
      'an unresolved import used only in a typeof query on a qualified name',
      "import * as NS from './does-not-exist';\nexport declare const value2: typeof NS.Missing;\n",
    ],
    [
      'an unresolved import used only as a heritage clause',
      "import { MissingBase } from './does-not-exist';\nexport declare class Derived extends MissingBase {}\n",
    ],
    [
      'a missing member of a resolvable namespace in a type reference',
      "import * as NS from 'node:url';\nexport type T1 = NS.NoSuchThing;\n",
    ],
    [
      'a missing member of a resolvable namespace in a typeof query',
      "import * as NS from 'node:url';\nexport declare const v1: typeof NS.noSuchValue;\n",
    ],
    [
      'a missing member of a resolvable namespace in a heritage clause',
      "import * as NS from 'node:events';\nexport declare class D1 extends NS.NoSuchBase {}\n",
    ],
  ])('fails update when a declaration has %s', { timeout: T }, (_label, decl) => {
    setupFixture();
    mutateDist((c) => c + decl);
    expect(run(['--update']).status).toBe(1);
    expect(fs.existsSync(path.join(tmp, 'etc', 'index.api.md'))).toBe(false);
  });
});

/*
 * api:update ⇒ api:check must be a true round trip for EVERY change class the
 * guard can detect — including a whitespace-only change inside a string
 * literal. API Extractor's localBuild auto-write compares reports with
 * whitespace collapsed (areEquivalentApiFileContents), so it can report
 * success while leaving the committed report stale; the next byte-exact check
 * then fails on a report the update just "refreshed". The script must write
 * the committed reports itself, byte-for-byte.
 */
describe('api-report update round trip', () => {
  // Safety net, not a correctness signal: each case spawns API Extractor several times and is slow on a loaded runner.
  const T = 180_000;

  it('update refreshes a whitespace-only change so the next check passes', { timeout: T }, () => {
    setupFixture({ withReports: true });
    // Whitespace inside a string literal: a real declaration change that the
    // whitespace-collapsing comparison treats as "equivalent".
    mutateDist((c) => c.replace('"a" | "b"', '"a"  |  "b"'));
    const update = run(['--update']);
    expect(update.status).toBe(0);
    // The committed report must carry the new bytes, not the stale ones.
    const committed = fs.readFileSync(path.join(tmp, 'etc', 'index.api.md'), 'utf8');
    expect(committed).toContain('"a"  |  "b"');
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('public API surface unchanged');
  });
});

/*
 * The public import surface is package.json's "exports"/"imports" map, not
 * the set of declaration files: removing or renaming a subpath (or retargeting
 * one at a different file) leaves every committed declaration report matching
 * — the orphaned dist/*.d.ts still builds and analyzes — while the public API
 * is gone. The guard must therefore derive its entry points from package.json
 * and compare the committed map alongside the reports.
 */
describe('api-report entry-point map guard', () => {
  // Safety net, not a correctness signal: each case spawns API Extractor several times and is slow on a loaded runner.
  const T = 180_000;

  /** Fixture with its own package.json, so the script derives entry points. */
  function setupPackageFixture(): void {
    setupFixture();
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      `${JSON.stringify(
        {
          name: 'fixture-pkg',
          version: '0.0.0',
          exports: {
            '.': { types: './dist/index.d.ts', import: './dist/index.js' },
            './logger': { types: './dist/logger.d.ts', import: './dist/logger.js' },
          },
        },
        null,
        2
      )}\n`
    );
    // No API_REPORT_ENTRIES: the script must derive the entry points (and the
    // map) from the fixture's package.json.
    const update = run(['--update'], { deriveFromPackage: true });
    expect(update.status).toBe(0);
    expect(fs.existsSync(path.join(tmp, 'etc', 'index.api.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'etc', 'logger.api.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmp, 'etc', 'entry-points.json'))).toBe(true);
  }

  function editFixturePackage(edit: (pkg: { exports: Record<string, unknown> }) => void): void {
    const file = path.join(tmp, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    edit(pkg);
    fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  it('derives entry points from package.json and passes when nothing changed', {
    timeout: T,
  }, () => {
    setupPackageFixture();
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('public API surface unchanged');
  });

  it('fails when a public subpath export is removed', { timeout: T }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      delete pkg.exports['./logger'];
    });
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('entry-points.json');
  });

  it('fails when a public subpath export is renamed', { timeout: T }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      pkg.exports['./log'] = pkg.exports['./logger'];
      delete pkg.exports['./logger'];
    });
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('entry-points.json');
  });

  it('fails when a public subpath is retargeted at a different file', { timeout: T }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      pkg.exports['./logger'] = { types: './dist/logger.d.ts', import: './dist/logger.mjs' };
    });
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('entry-points.json');
  });

  it('passes again after api:update records the new map', { timeout: T }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      delete pkg.exports['./logger'];
    });
    expect(run([], { deriveFromPackage: true }).status).toBe(1);
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    expect(run([], { deriveFromPackage: true }).status).toBe(0);
  });

  it('flags a stale committed report whose entry point was removed, and update removes it', {
    timeout: T,
  }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      delete pkg.exports['./logger'];
    });
    // Even after recording the new map, the orphaned logger report must not
    // survive: it records an API nothing can import anymore.
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    expect(fs.existsSync(path.join(tmp, 'etc', 'logger.api.md'))).toBe(false);
    expect(run([], { deriveFromPackage: true }).status).toBe(0);
    // And a stale report that slips in anyway fails the check.
    fs.writeFileSync(path.join(tmp, 'etc', 'logger.api.md'), 'stale\n');
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('logger.api.md');
  });

  it('guards a string-valued export target through its declaration twin', { timeout: T }, () => {
    setupPackageFixture();
    editFixturePackage((pkg) => {
      pkg.exports['./logger'] = './dist/logger.js';
    });
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    expect(fs.existsSync(path.join(tmp, 'etc', 'logger.api.md'))).toBe(true);
    const dts = path.join(tmp, 'dist', 'logger.d.ts');
    fs.writeFileSync(dts, fs.readFileSync(dts, 'utf8').replace('msg: string', 'msg: number'));
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('logger.api.md');
  });

  // Class: Node's root "exports" sugar (string, array, condition-only object)
  // must still guard the root surface, not drop it.
  it.each([
    ['a string root export', './dist/index.js'],
    ['an array root export', ['./dist/index.js']],
    ['a condition-only root export', { types: './dist/index.d.ts', import: './dist/index.js' }],
  ])('guards %s', { timeout: T }, (_label, rootExport) => {
    setupPackageFixture();
    const file = path.join(tmp, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    pkg.exports = rootExport;
    fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    expect(fs.existsSync(path.join(tmp, 'etc', 'index.api.md'))).toBe(true);
    const dts = path.join(tmp, 'dist', 'index.d.ts');
    const before = fs.readFileSync(dts, 'utf8');
    fs.writeFileSync(dts, `${before}\nexport declare const addedForTest: number;\n`);
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('index.api.md');
  });

  // Class: a runtime target with a declaration twin must be guarded whatever
  // its module suffix (.js/.mjs/.cjs → .d.ts/.d.mts/.d.cts) and whatever
  // condition key it sits under (not only import/require/default).
  it.each([
    ['an .mjs string target with a .d.mts twin', './dist/logger.mjs', 'logger.d.mts'],
    ['a require .cjs target with a .d.cts twin', { require: './dist/logger.cjs' }, 'logger.d.cts'],
    ['a custom-condition .js target', { node: './dist/logger.js' }, 'logger.d.ts'],
    ['a nested custom-condition target', { worker: { deno: './dist/logger.js' } }, 'logger.d.ts'],
  ])('guards %s through its declaration twin', { timeout: T }, (_label, target, twinName) => {
    setupPackageFixture();
    const twin = path.join(tmp, 'dist', twinName);
    if (twinName !== 'logger.d.ts') {
      fs.renameSync(path.join(tmp, 'dist', 'logger.d.ts'), twin);
    }
    editFixturePackage((pkg) => {
      pkg.exports['./logger'] = target;
    });
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    const reports = fs.readdirSync(path.join(tmp, 'etc')).filter((f) => f.includes('logger'));
    expect(reports.length).toBeGreaterThan(0);
    fs.writeFileSync(twin, fs.readFileSync(twin, 'utf8').replace('msg: string', 'msg: number'));
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
  });

  // Class: when a .mjs/.cjs target has BOTH a plain .d.ts and a suffixed
  // twin, each is a resolvable surface and each must be guarded.
  it.each([
    ['import', './dist/logger.mjs', 'logger.d.mts'],
    ['require', './dist/logger.cjs', 'logger.d.cts'],
  ])(
    'guards the %s suffixed twin even when a .d.ts twin also exists',
    { timeout: T },
    (cond, target, twinName) => {
      setupPackageFixture();
      const plain = path.join(tmp, 'dist', 'logger.d.ts');
      const twin = path.join(tmp, 'dist', twinName);
      fs.copyFileSync(plain, twin);
      editFixturePackage((pkg) => {
        pkg.exports['./logger'] = { [cond]: target };
      });
      expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
      // Mutate ONLY the suffixed twin.
      fs.writeFileSync(twin, fs.readFileSync(twin, 'utf8').replace('msg: string', 'msg: boolean'));
      expect(run([], { deriveFromPackage: true }).status).toBe(1);
    }
  );

  it('guards .d.ts, .d.mts and .d.cts typings of one subpath without name collisions', {
    timeout: T,
  }, () => {
    setupPackageFixture();
    const src = fs.readFileSync(path.join(tmp, 'dist', 'logger.d.ts'), 'utf8');
    fs.writeFileSync(path.join(tmp, 'dist', 'logger.d.mts'), src);
    fs.writeFileSync(path.join(tmp, 'dist', 'logger.d.cts'), src);
    editFixturePackage((pkg) => {
      pkg.exports['./logger'] = {
        browser: { types: './dist/logger.d.ts' },
        import: { types: './dist/logger.d.mts' },
        require: { types: './dist/logger.d.cts' },
      };
    });
    const update = run(['--update'], { deriveFromPackage: true });
    expect(update.status, update.stderr).toBe(0);
    const reports = fs.readdirSync(path.join(tmp, 'etc')).filter((f) => f.startsWith('logger'));
    expect(reports.sort()).toEqual([
      'logger--dist-logger-cts.api.md',
      'logger--dist-logger-mts.api.md',
      'logger.api.md',
    ]);
    for (const ext of ['d.mts', 'd.cts']) {
      const f = path.join(tmp, 'dist', `logger.${ext}`);
      const before = fs.readFileSync(f, 'utf8');
      fs.writeFileSync(f, before.replace('msg: string', 'msg: number'));
      const result = run([], { deriveFromPackage: true });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`logger-${ext.slice(2)}`);
      fs.writeFileSync(f, before);
    }
  });

  it.each(['d.mts', 'd.cts'])(
    'ignores diagnostic location shifts in .%s declarations (comment-only change)',
    { timeout: T },
    (ext) => {
      setupPackageFixture();
      const f = path.join(tmp, 'dist', `logger.${ext}`);
      fs.writeFileSync(
        f,
        'declare type Helper = { level: string };\n' +
          fs.readFileSync(path.join(tmp, 'dist', 'logger.d.ts'), 'utf8') +
          'export declare function helper(): Helper;\nexport {};\n'
      );
      fs.rmSync(path.join(tmp, 'dist', 'logger.d.ts'));
      editFixturePackage((pkg) => {
        pkg.exports['./logger'] = { types: `./dist/logger.${ext}` };
      });
      expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
      const committed = fs.readFileSync(path.join(tmp, 'etc', 'logger.api.md'), 'utf8');
      expect(committed).toContain('ae-forgotten-export');
      expect(committed).not.toMatch(/\.d\.(c|m)?ts:\d+:\d+/);
      fs.writeFileSync(f, `// layout-only comment\n${fs.readFileSync(f, 'utf8')}`);
      const result = run([], { deriveFromPackage: true });
      expect(result.status).toBe(0);
    }
  );

  it('guards every distinct declaration target of one subpath', { timeout: T }, () => {
    setupPackageFixture();
    fs.writeFileSync(
      path.join(tmp, 'dist', 'logger-browser.d.ts'),
      'export declare function createLogger(): { warn(msg: string): void };\n'
    );
    editFixturePackage((pkg) => {
      pkg.exports['./logger'] = {
        types: './dist/logger.d.ts',
        browser: { types: './dist/logger-browser.d.ts' },
        import: './dist/logger.js',
      };
    });
    expect(run(['--update'], { deriveFromPackage: true }).status).toBe(0);
    const secondary = path.join(tmp, 'dist', 'logger-browser.d.ts');
    fs.writeFileSync(
      secondary,
      fs.readFileSync(secondary, 'utf8').replace('msg: string', 'msg: number')
    );
    const result = run([], { deriveFromPackage: true });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('logger-browser');
  });
});
