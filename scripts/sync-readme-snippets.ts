/**
 * Synchronize code snippets in README.md from compilable example files.
 *
 * Replaces code blocks between snippet markers in README.md with the
 * corresponding region-tagged code from examples/*.ts and examples/*.txt.
 *
 * Usage:
 *   tsx scripts/sync-readme-snippets.ts          # update README.md in-place
 *   tsx scripts/sync-readme-snippets.ts --check  # CI mode: exit 1 if out of sync
 *
 * Region tags use `//#region Name` ... `//#endregion Name`.
 * Tag names may contain word characters, hyphens, and dots (e.g. `MyRegion`, `my-region.1`).
 *
 * Markers in README.md use the descriptive format::
 *
 *   <!-- snippet-source: examples/readme.ts | regions: RegionName -->
 *
 * Legacy markers (`<!-- snippet:RegionName -->`) are auto-migrated.
 *
 * Composite regions: `regions: A+B` concatenates multiple regions
 * separated by blank lines.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const README_PATH = path.join(REPO_ROOT, 'README.md');
const EXAMPLES_DIR = path.join(REPO_ROOT, 'examples');

// ---------------------------------------------------------------------------
// Region extraction
// ---------------------------------------------------------------------------

function parseRegionTags(filePath: string): Map<string, string> {
  const text = fs.readFileSync(filePath, 'utf-8');
  const regions = new Map<string, string>();
  let currentTag: string | null = null;
  let lines: string[] = [];

  for (const line of text.split('\n')) {
    const stripped = line.trim();
    const openMatch = stripped.match(/^\/\/#region\s+([\w.-]+)\s*$/);
    const closeMatch = stripped.match(/^\/\/#endregion\s+([\w.-]+)\s*$/);

    if (openMatch) {
      currentTag = openMatch[1];
      lines = [];
    } else if (closeMatch && currentTag === closeMatch[1]) {
      regions.set(currentTag, dedent(lines.join('\n')));
      currentTag = null;
      lines = [];
    } else if (currentTag !== null) {
      lines.push(line);
    }
  }

  return regions;
}

function dedent(text: string): string {
  const lines = text.split('\n');
  // Filter out empty lines for indent calculation
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return text;

  const minIndent = Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)![1].length));
  if (minIndent === 0) return text;

  return lines.map((l) => (l.trim().length === 0 ? '' : l.slice(minIndent))).join('\n');
}

function loadAllRegions(): { regions: Map<string, string>; regionSources: Map<string, string> } {
  const allRegions = new Map<string, string>();
  const regionSources = new Map<string, string>();

  const files = fs
    .readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.txt'))
    .sort();

  const duplicates: string[] = [];

  for (const file of files) {
    const regions = parseRegionTags(path.join(EXAMPLES_DIR, file));
    for (const [key, value] of regions) {
      if (allRegions.has(key)) {
        duplicates.push(
          `region "${key}" defined in both ${regionSources.get(key)} and examples/${file}`
        );
      }
      allRegions.set(key, value);
      regionSources.set(key, `examples/${file}`);
    }
  }

  if (duplicates.length > 0) {
    for (const msg of duplicates) {
      process.stderr.write(`ERROR: duplicate ${msg}\n`);
    }
    process.exit(1);
  }

  return { regions: allRegions, regionSources };
}

// ---------------------------------------------------------------------------
// README rewriting
// ---------------------------------------------------------------------------

// New descriptive format:
//   <!-- snippet-source: examples/readme.ts | regions: RegionName -->
const NEW_MARKER = /^<!--\s*snippet-source:\s*\S+\s*\|\s*regions:\s*([\w.+-]+)\s*-->$/;
// Legacy format (for migration):
//   <!-- snippet:RegionName -->
const OLD_MARKER = /^<!--\s*snippet:([\w.+-]+)\s*-->$/;

function matchMarker(line: string): RegExpMatchArray | null {
  return line.match(NEW_MARKER) ?? line.match(OLD_MARKER);
}

function buildMarker(regionName: string, regionSources: Map<string, string>): string {
  const parts = regionName.includes('+') ? regionName.split('+') : [regionName];
  const sources = new Set<string>();
  for (const part of parts) {
    const source = regionSources.get(part);
    if (source) sources.add(source);
  }
  let sourceFile: string;
  if (sources.size === 0) {
    sourceFile = 'examples/?.ts';
  } else if (sources.size === 1) {
    sourceFile = [...sources][0];
  } else {
    sourceFile = [...sources].sort().join(',');
  }
  return `<!-- snippet-source: ${sourceFile} | regions: ${regionName} -->`;
}

function resolveRegion(name: string, regions: Map<string, string>): string | null {
  if (!name.includes('+')) {
    return regions.get(name) ?? null;
  }

  const parts = name.split('+');
  const resolved = parts.map((p) => regions.get(p));

  if (resolved.some((r) => r === undefined)) {
    return null;
  }

  return resolved.filter((r) => r).join('\n\n');
}

function syncReadme(
  regions: Map<string, string>,
  regionSources: Map<string, string>,
  check: boolean
): boolean {
  const readmeText = fs.readFileSync(README_PATH, 'utf-8');
  const lines = readmeText.split('\n');

  const out: string[] = [];
  let i = 0;
  let changed = false;
  const missing: string[] = [];
  const errors: string[] = [];
  let snippetCount = 0;

  while (i < lines.length) {
    const line = lines[i];
    const m = matchMarker(line.trim());

    if (!m) {
      out.push(lines[i]);
      i++;
      continue;
    }

    const regionName = m[1];
    const content = resolveRegion(regionName, regions);

    if (content === null) {
      const parts = regionName.split('+');
      const missingParts = parts.filter((p) => !regions.has(p));
      missing.push(...missingParts);
      out.push(lines[i]);
      i++;
      continue;
    }

    snippetCount++;

    // Upgrade legacy marker to descriptive format
    const newMarker = buildMarker(regionName, regionSources);
    if (lines[i].trim() !== newMarker) {
      changed = true;
    }
    out.push(newMarker);
    i++;

    // Skip whitespace between marker and opening fence
    while (i < lines.length && lines[i].trim() === '') {
      out.push(lines[i]);
      i++;
    }

    // Expect opening fence
    if (i >= lines.length || !lines[i].trim().startsWith('```')) {
      errors.push(`snippet:${regionName} — expected \`\`\` after marker`);
      continue;
    }

    const fenceLang = lines[i].trim(); // e.g. ```ts

    // Find closing fence
    let closeIdx = i + 1;
    while (closeIdx < lines.length && lines[closeIdx].trim() !== '```') {
      closeIdx++;
    }

    if (closeIdx >= lines.length) {
      errors.push(`snippet:${regionName} — no closing \`\`\` found`);
      out.push(lines[i]);
      i++;
      continue;
    }

    // Build replacement block
    const newBlockLines = [fenceLang, content, '```'];
    const newBlock = newBlockLines.join('\n');
    const oldBlock = lines.slice(i, closeIdx + 1).join('\n');

    if (oldBlock !== newBlock) {
      changed = true;
    }

    out.push(...newBlockLines);
    i = closeIdx + 1;
  }

  if (errors.length > 0) {
    for (const err of errors) {
      process.stderr.write(`ERROR: ${err}\n`);
    }
  }

  if (missing.length > 0) {
    const unique = [...new Set(missing)];
    process.stderr.write(`ERROR: missing regions: ${unique.join(', ')}\n`);
  }

  if (errors.length > 0 || missing.length > 0) {
    process.exit(1);
  }

  const newText = out.join('\n');

  if (check) {
    if (changed) {
      console.log('README.md is out of sync with example snippets. Run:');
      console.log('  npm run sync-readme');
    }
    return changed;
  }

  if (changed) {
    fs.writeFileSync(README_PATH, newText, 'utf-8');
    console.log(`README.md updated (${snippetCount} snippets synced)`);
  } else {
    console.log('README.md is already up to date');
  }

  return changed;
}

// ---------------------------------------------------------------------------
// Un-injected code block detection
// ---------------------------------------------------------------------------

const CHECKED_LANGUAGES = new Set(['ts', 'typescript', 'js', 'javascript']);

// Exempt marker: <!-- snippet-exempt: reason --> signals the block is intentionally un-injected
const EXEMPT_MARKER = /^<!--\s*snippet-exempt:.*-->$/;

function detectUninjectedCodeBlocks(readmePath: string): Array<{ line: number; fence: string }> {
  const text = fs.readFileSync(readmePath, 'utf-8');
  const lines = text.split('\n');
  const uninjected: Array<{ line: number; fence: string }> = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const stripped = lines[idx].trim();
    if (!stripped.startsWith('```')) continue;

    const lang = stripped.slice(3).trim().toLowerCase();
    if (!CHECKED_LANGUAGES.has(lang)) continue;

    // Look backward for a snippet marker or exempt marker (skip blank lines)
    let prev = idx - 1;
    while (prev >= 0 && lines[prev].trim() === '') prev--;
    if (prev >= 0) {
      const prevTrimmed = lines[prev].trim();
      if (matchMarker(prevTrimmed) || EXEMPT_MARKER.test(prevTrimmed)) continue;
    }

    uninjected.push({ line: idx + 1, fence: stripped });
  }

  return uninjected;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const check = process.argv.includes('--check');
const { regions, regionSources } = loadAllRegions();
const changed = syncReadme(regions, regionSources, check);

// Detect un-injected TS/JS code blocks
const uninjected = detectUninjectedCodeBlocks(README_PATH);
if (uninjected.length > 0) {
  process.stderr.write(
    `\nWARNING: ${uninjected.length} TypeScript/JavaScript code block(s) in README.md are NOT snippet-injected (not type-checked):\n`
  );
  for (const { line, fence } of uninjected) {
    process.stderr.write(`  line ${line}: ${fence}\n`);
  }
  if (check) {
    process.stderr.write(
      '\nAll TS/JS code blocks must be injected from compilable examples in examples/. ' +
        'Add a snippet marker above each block, or move the code to examples/readme.ts with region tags.\n'
    );
    process.exit(1);
  }
}

if (check && changed) {
  process.exit(1);
}
