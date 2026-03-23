/**
 * Synchronize code snippets in README.md from compilable example files.
 *
 * Replaces code blocks between `<!-- snippet:RegionName -->` markers in
 * README.md with the corresponding region-tagged code from examples/*.ts
 * and examples/*.txt.
 *
 * Usage:
 *   tsx scripts/sync-readme-snippets.ts          # update README.md in-place
 *   tsx scripts/sync-readme-snippets.ts --check  # CI mode: exit 1 if out of sync
 *
 * Region tags use `//#region Name` ... `//#endregion Name`.
 * Tag names may contain word characters, hyphens, and dots (e.g. `MyRegion`, `my-region.1`).
 * Markers in README.md use `<!-- snippet:RegionName -->` before a fenced
 * code block. The script replaces everything between the opening and closing
 * fences (inclusive) with freshly extracted content.
 *
 * Composite regions: `<!-- snippet:A+B -->` concatenates multiple regions
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

function loadAllRegions(): Map<string, string> {
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
        duplicates.push(`region "${key}" defined in both ${regionSources.get(key)} and ${file}`);
      }
      allRegions.set(key, value);
      regionSources.set(key, file);
    }
  }

  if (duplicates.length > 0) {
    for (const msg of duplicates) {
      process.stderr.write(`ERROR: duplicate ${msg}\n`);
    }
    process.exit(1);
  }

  return allRegions;
}

// ---------------------------------------------------------------------------
// README rewriting
// ---------------------------------------------------------------------------

const SNIPPET_MARKER = /^<!--\s*snippet:([\w.+-]+)\s*-->$/;

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

function syncReadme(regions: Map<string, string>, check: boolean): boolean {
  const readmeText = fs.readFileSync(README_PATH, 'utf-8');
  const lines = readmeText.split('\n');

  const out: string[] = [];
  let i = 0;
  let changed = false;
  const missing: string[] = [];
  const errors: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const m = line.trim().match(SNIPPET_MARKER);

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

    // Keep the marker line
    out.push(lines[i]);
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
    console.log('README.md updated');
  } else {
    console.log('README.md is already up to date');
  }

  return changed;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const check = process.argv.includes('--check');
const regions = loadAllRegions();
const changed = syncReadme(regions, check);

if (check && changed) {
  process.exit(1);
}
