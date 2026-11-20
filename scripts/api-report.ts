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

/**
 * Every public entry point: the package.json "exports" surface plus the two
 * `#platform` implementations (reachable through the package.json "imports"
 * conditions and built by tsup as their own entries). The report file name is
 * `etc/<name>.api.md`.
 */
const DEFAULT_ENTRY_POINTS: ReadonlyArray<{ name: string; dts: string }> = [
  { name: 'index', dts: 'dist/index.d.ts' },
  { name: 'logger', dts: 'dist/logger.d.ts' },
  { name: 'fn', dts: 'dist/fn/index.d.ts' },
  { name: 'effect', dts: 'dist/effect/index.d.ts' },
  { name: 'platform-node', dts: 'dist/runtime/platform/node.d.ts' },
  { name: 'platform-browser', dts: 'dist/runtime/platform/browser.d.ts' },
];

// Test override: "name:path,name:path" relative to API_REPORT_ROOT.
const ENTRY_POINTS: ReadonlyArray<{ name: string; dts: string }> = process.env.API_REPORT_ENTRIES
  ? process.env.API_REPORT_ENTRIES.split(',').map((pair) => {
      const [name, dts] = pair.split(':');
      return { name, dts };
    })
  : DEFAULT_ENTRY_POINTS;

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

    const options: IExtractorInvokeOptions = {
      localBuild: update,
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

    // Normalize the freshly written report in place (see normalizeReport). This
    // runs in BOTH modes so the committed bytes and the temp bytes go through
    // the same normalization before they are compared.
    for (const dir of [REPORT_DIR, TEMP_DIR]) {
      const report = path.join(dir, `${entry.name}.api.md`);
      if (fs.existsSync(report)) {
        fs.writeFileSync(report, normalizeReport(fs.readFileSync(report, 'utf8')));
      }
    }
  }

  if (failed) {
    process.exit(1);
  }

  if (update) {
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
