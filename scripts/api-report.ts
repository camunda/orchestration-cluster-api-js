/**
 * Public API surface guard (issue #700).
 *
 * Runs API Extractor over the built declarations of every public entry point
 * and compares the extracted reports with the committed ones in `etc/*.api.md`.
 * A difference means the package's public API surface changed — widened or
 * narrowed types, dropped union variants or enum members, added/removed/renamed
 * exports — whether the change came from a spec bump, a generator/hook change,
 * or a hand edit.
 *
 * Modes:
 *   tsx scripts/api-report.ts           check mode — exit 1 and print the diff
 *                                       when a committed report differs
 *   tsx scripts/api-report.ts --update  update mode — rewrite the committed
 *                                       reports from the current build
 *
 * Both modes require `dist/` declarations (run `npm run build` or
 * `npm run build:types` first).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Extractor,
  ExtractorConfig,
  type IConfigFile,
  type IExtractorInvokeOptions,
} from '@microsoft/api-extractor';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Tests point the script at a fixture tree instead of the repo (tests/api-report.test.ts).
const ROOT = process.env.API_REPORT_ROOT ? path.resolve(process.env.API_REPORT_ROOT) : REPO_ROOT;
const REPORT_DIR = path.join(ROOT, 'etc');
const TEMP_DIR = path.join(REPORT_DIR, 'temp');
const CONFIG_PATH = path.join(REPO_ROOT, 'api-extractor.json');
const PACKAGE_JSON = fs.existsSync(path.join(ROOT, 'package.json'))
  ? path.join(ROOT, 'package.json')
  : path.join(REPO_ROOT, 'package.json');

interface EntryPoint {
  /** Report file base name: `etc/<name>.api.md`. */
  name: string;
  /** Declaration file the extractor analyzes, relative to ROOT. */
  dts: string;
}

/**
 * `package.json` fields that map a public import specifier to runtime/types
 * files: "exports" for consumers, "imports" for the internal `#platform`
 * alias (reachable through its conditions and built by tsup as its own
 * entries). A change to either — a removed/renamed subpath, a retargeted
 * file — is itself a public API change, so the map is recorded and compared
 * alongside the declaration reports (see snapshotEntryPointMap).
 */
const ENTRY_POINT_MAP_FIELDS = ['exports', 'imports'] as const;
const ENTRY_POINT_MAP_FILE = 'entry-points.json';

/**
 * The public entry points are derived from package.json — the file that
 * actually defines the public import surface — never from a hardcoded list:
 * removing or renaming `./logger` in "exports" must shrink the guard's
 * coverage with it, and adding a new subpath export must extend it, without
 * anyone remembering to edit this script.
 *
 * Mapping:
 * - each "exports" subpath → its first declaration file
 *   (`.` → `index`, `./logger` → `logger`, `./fn` → `fn`, ...)
 * - each "imports" specifier → one entry per declaration file found anywhere
 *   in its (possibly nested) condition tree, named by the declaration file
 *   name (`#platform` → `platform-node`, `platform-browser`)
 *
 * Test override: API_REPORT_ENTRIES="name:path,name:path" relative to
 * API_REPORT_ROOT replaces the derivation entirely.
 */
function deriveEntryPoints(): EntryPoint[] {
  if (process.env.API_REPORT_ENTRIES) {
    return process.env.API_REPORT_ENTRIES.split(',').map((pair) => {
      const [name, dts] = pair.split(':');
      return { name, dts };
    });
  }
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')) as {
    exports?: Record<string, unknown>;
    imports?: Record<string, unknown>;
  };
  const entries: EntryPoint[] = [];
  const seen = new Set<string>();
  const add = (name: string, dts: string): void => {
    if (!seen.has(name)) {
      seen.add(name);
      entries.push({ name, dts });
    }
  };
  for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
    const types = findTypesConditions(target);
    if (types.length === 0) continue;
    const name = subpath === '.' ? 'index' : subpath.replace(/^\.\//, '').replaceAll('/', '-');
    add(name, types[0]);
  }
  for (const target of Object.values(pkg.imports ?? {})) {
    for (const dts of findTypesConditions(target)) {
      add(`platform-${path.basename(dts, '.d.ts')}`, dts);
    }
  }
  return entries;
}

/**
 * Every declaration file reachable through a package.json condition tree, in
 * stable depth-first order. A condition contributes its declaration file when
 * it either has an explicit `types` condition or points at a runtime file
 * (`import`/`require`/`default`) with a `.d.ts` twin on disk — the nested
 * `browser` condition of `#platform` has no `types` of its own, but tsup
 * builds `browser.ts` as its own entry with `browser.d.ts` beside the `.js`,
 * and that surface needs a report too. Handles both flat
 * (`{ types, import, require }`) and nested (`{ types, browser: { import } }`)
 * shapes.
 */
function findTypesConditions(node: unknown): string[] {
  if (typeof node === 'string') return [];
  if (!node || typeof node !== 'object') return [];
  const found: string[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (typeof value !== 'string') {
      found.push(...findTypesConditions(value));
      continue;
    }
    if (key === 'types') {
      found.push(value);
      continue;
    }
    if ((key === 'import' || key === 'require' || key === 'default') && /\.(c?js|mjs)$/.test(value)) {
      const twin = value.replace(/\.(c?js|mjs)$/, '.d.ts');
      if (fs.existsSync(path.join(ROOT, twin))) found.push(twin);
    }
  }
  return found;
}

const ENTRY_POINTS: ReadonlyArray<EntryPoint> = deriveEntryPoints();

/**
 * The recorded public entry-point map: exactly the `exports`/`imports` fields
 * of package.json, compared byte-for-byte (key order and whitespace included —
 * a committed-map update is one `api:update` away, and any difference is worth
 * a reviewer's eye). Removing or renaming a subpath, or retargeting one at a
 * different file, changes this map even when every declaration report still
 * matches, which is the case the declaration reports alone cannot see.
 */
function snapshotEntryPointMap(): string {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')) as Record<string, unknown>;
  const map: Record<string, unknown> = {};
  for (const field of ENTRY_POINT_MAP_FIELDS) {
    if (pkg[field] !== undefined) map[field] = pkg[field];
  }
  return `${JSON.stringify(map, null, 2)}\n`;
}

function main(): void {
  const update = process.argv.includes('--update');

  const missing = ENTRY_POINTS.filter((e) => !fs.existsSync(path.join(ROOT, e.dts)));
  if (missing.length > 0) {
    console.error(
      `Missing built declarations: ${missing.map((e) => e.dts).join(', ')}\n` +
        'Run `npm run build` (or `npm run build:types`) first.'
    );
    process.exit(2);
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  // Load the shared config once, then specialize it per entry point.
  const baseConfig = ExtractorConfig.loadFile(CONFIG_PATH) as IConfigFile;

  let failed = false;
  for (const entry of ENTRY_POINTS) {
    const configObject: IConfigFile = {
      ...baseConfig,
      mainEntryPointFilePath: path.join(ROOT, entry.dts),
      apiReport: {
        enabled: true,
        ...(baseConfig.apiReport ?? {}),
        reportFileName: `${entry.name}.api.md`,
        // Resolve the report folders against ROOT (not the config file's
        // <projectFolder>) so tests can point the script at a fixture tree.
        reportFolder: REPORT_DIR,
        reportTempFolder: TEMP_DIR,
      },
    };
    const extractorConfig = ExtractorConfig.prepare({
      configObject,
      configObjectFullPath: CONFIG_PATH,
      packageJsonFullPath: PACKAGE_JSON,
    });

    // Always run as a CI ("production") build — never API Extractor's
    // localBuild mode. localBuild decides whether to rewrite the committed
    // report with a WHITESPACE-INSENSITIVE comparison
    // (ApiReportGenerator.areEquivalentApiFileContents collapses all [\s]+
    // runs), so a whitespace-only change inside a string literal — `"a" | "b"`
    // → `"a"  |  "b"` — would leave the committed report stale while --update
    // still exits 0, and the next byte-exact check fails. This script does all
    // committed-report writing itself, byte-exact, in the update block below.
    const options: IExtractorInvokeOptions = {
      localBuild: false,
      showVerboseMessages: false,
    };
    const result = Extractor.invoke(extractorConfig, options);
    if (!result.succeeded) {
      // In check mode a report mismatch surfaces here as a warning ("You have
      // changed the API signature..."), not an error — so don't bail out: the
      // diff below is what the reviewer needs. Only hard-fail on real errors.
      if (result.errorCount > 0) {
        failed = true;
      }
      console.error(
        `api-extractor ${update ? 'update' : 'check'} reported drift for ${entry.name} ` +
          `(${result.errorCount} errors, ${result.warningCount} warnings)`
      );
    }

    // Normalize the freshly written temp report in place (see normalizeReport)
    // so the temp bytes and the committed bytes go through the same
    // normalization before they are compared — in BOTH modes.
    const tempReport = path.join(TEMP_DIR, `${entry.name}.api.md`);
    if (fs.existsSync(tempReport)) {
      fs.writeFileSync(tempReport, normalizeReport(fs.readFileSync(tempReport, 'utf8')));
    }
  }

  if (failed) {
    process.exit(1);
  }

  const committedMap = path.join(REPORT_DIR, ENTRY_POINT_MAP_FILE);

  if (update) {
    // Rewrite the committed reports byte-for-byte from the normalized temp
    // reports. Copying (not API Extractor's localBuild auto-write) is what
    // makes update ⇒ check a true round trip: the bytes the check compares
    // are exactly the bytes update wrote.
    for (const entry of ENTRY_POINTS) {
      const tempReport = path.join(TEMP_DIR, `${entry.name}.api.md`);
      if (fs.existsSync(tempReport)) {
        fs.copyFileSync(tempReport, path.join(REPORT_DIR, `${entry.name}.api.md`));
      }
    }
    // Remove committed reports whose entry point no longer exists in
    // package.json — a removed subpath must not leave a stale report behind.
    for (const stale of staleReports()) {
      fs.rmSync(path.join(REPORT_DIR, stale));
    }
    fs.writeFileSync(committedMap, snapshotEntryPointMap());
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`API reports updated in ${path.relative(ROOT, REPORT_DIR)}/`);
    return;
  }

  // Check mode: API Extractor wrote freshly extracted reports to the temp
  // folder. Diff each against the committed report so the failure output is a
  // readable, reviewable diff of the public API change.
  const changed: string[] = [];
  const diffs: string[] = [];
  for (const entry of ENTRY_POINTS) {
    const file = `${entry.name}.api.md`;
    const committed = path.join(REPORT_DIR, file);
    const fresh = path.join(TEMP_DIR, file);
    if (!fs.existsSync(committed)) {
      changed.push(file);
      diffs.push(
        `--- /dev/null\n+++ b/etc/${file}\n(new public API report — run \`npm run api:update\` and commit it)\n`
      );
      continue;
    }
    if (fs.readFileSync(committed, 'utf8') !== fs.readFileSync(fresh, 'utf8')) {
      changed.push(file);
      diffs.push(diffFiles(committed, fresh, `etc/${file}`));
    }
  }

  // The entry-point map is part of the guarded surface: a removed, renamed or
  // retargeted public subpath changes no declaration report (the orphaned
  // dist/*.d.ts still builds and analyzes) but absolutely changes the public
  // API. Compare it byte-for-byte alongside the reports.
  if (!fs.existsSync(committedMap)) {
    changed.push(ENTRY_POINT_MAP_FILE);
    diffs.push(
      `--- /dev/null\n+++ b/etc/${ENTRY_POINT_MAP_FILE}\n(new public entry-point map — run \`npm run api:update\` and commit it)\n`
    );
  } else if (fs.readFileSync(committedMap, 'utf8') !== snapshotEntryPointMap()) {
    changed.push(ENTRY_POINT_MAP_FILE);
    diffs.push(
      diffText(ENTRY_POINT_MAP_FILE, fs.readFileSync(committedMap, 'utf8'), snapshotEntryPointMap())
    );
  }

  // A committed report whose entry point is gone from package.json is stale:
  // it records an API nothing can import anymore.
  for (const stale of staleReports()) {
    changed.push(stale);
    diffs.push(
      `--- a/etc/${stale}\n+++ /dev/null\n(stale report — its entry point is no longer in package.json; run \`npm run api:update\` to remove it)\n`
    );
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  if (changed.length === 0) {
    console.log('API reports up to date: public API surface unchanged.');
    return;
  }

  console.error('');
  console.error('Public API surface changed. Report diff:');
  console.error('');
  for (const diff of diffs) {
    console.error(diff);
  }
  console.error(
    [
      `The committed API reports in etc/ no longer match the built declarations:`,
      ...changed.map((f) => `  - etc/${f}`),
      '',
      'This means the package public API changed (types widened/narrowed, exports',
      'added/removed/renamed, union variants or enum members dropped, ...).',
      '',
      'If the change is intentional:',
      '  1. run `npm run api:update`',
      '  2. review the diff in etc/*.api.md as the public API review surface',
      '  3. commit it with the PR — and if it removes or narrows anything, mark',
      '     the PR as breaking (BREAKING CHANGE: footer).',
      '',
      'If the change is not intentional, find the spec/generator/hook change that',
      'caused it before merging.',
    ].join('\n')
  );
  process.exit(1);
}

/**
 * Committed `*.api.md` reports whose entry point no longer exists in
 * package.json — e.g. `etc/logger.api.md` after `./logger` is removed from
 * "exports". The map comparison catches the removal itself; this catches the
 * orphaned report it would otherwise leave behind.
 */
function staleReports(): string[] {
  if (!fs.existsSync(REPORT_DIR)) return [];
  const live = new Set(ENTRY_POINTS.map((e) => `${e.name}.api.md`));
  return fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.api.md') && !live.has(f))
    .sort();
}

/**
 * Normalize a freshly written report so the committed bytes are stable:
 *
 * - CRLF → LF: API Extractor writes CRLF; this repo normalizes all text to LF
 *   (.gitattributes: `* text=auto eol=lf`).
 * - Diagnostic source locations stripped: ae-* message lines are emitted as
 *   `// dist/index-<hash>.d.ts:25871:9 - (ae-forgotten-export) The symbol ...`.
 *   The path carries tsup's content hash and the line:column shifts with any
 *   declaration-comment or layout change, neither of which is a public API
 *   change. Keep only the message id and text — a signature change still
 *   changes the symbol/name text, so detection power is unchanged. Applied in
 *   both check and update mode so the compared bytes agree.
 */
function normalizeReport(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/^(\s*\/\/ )[^\n]*?\.d\.ts:\d+:\d+ - (\(ae-[a-z-]+\) )/gm, '$1$2');
}

/** `git diff --no-index` between two on-disk files, labelled with the repo path. */
function diffFiles(committed: string, fresh: string, label: string): string {
  // Run from the report root with relative paths so git prints clean a/ b/
  // headers; then point them at the committed report's name.
  const relCommitted = path.relative(ROOT, committed);
  const relFresh = path.relative(ROOT, fresh);
  try {
    // Exits 1 when the files differ; the diff is on stdout either way.
    const out = execFileSync('git', ['diff', '--no-color', '--no-index', relCommitted, relFresh], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return relabelDiff(out, relCommitted, relFresh, label);
  } catch (e) {
    const out = (e as { stdout?: string }).stdout ?? '';
    return out ? relabelDiff(out, relCommitted, relFresh, label) : `(could not diff ${label})`;
  }
}

/** Unified diff between two in-memory texts (used for the entry-point map). */
function diffText(label: string, committed: string, fresh: string): string {
  const dir = fs.mkdtempSync(path.join(REPORT_DIR, '.diff-'));
  try {
    const a = path.join(dir, 'committed');
    const b = path.join(dir, 'fresh');
    fs.writeFileSync(a, committed);
    fs.writeFileSync(b, fresh);
    return diffFiles(a, b, `etc/${label}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Point the --no-index header paths at the committed report's repo path. */
function relabelDiff(diff: string, relCommitted: string, relFresh: string, label: string): string {
  // git --no-index already prints `a/<relCommitted>` / `b/<relFresh>` headers;
  // rewrite both to the committed report's name. Replace the fresh path first:
  // `etc/x.api.md` is a substring of the already-prefixed `a/etc/x.api.md`, so
  // replacing the committed path first would double-prefix it.
  return diff
    .replaceAll(`b/${relFresh}`, `b/${label}`)
    .replaceAll(`a/${relCommitted}`, `a/${label}`);
}

main();
