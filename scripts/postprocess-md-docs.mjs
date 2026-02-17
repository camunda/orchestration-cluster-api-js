#!/usr/bin/env node
/**
 * Post-process typedoc-plugin-markdown output for Docusaurus compatibility.
 *
 * - Adds Docusaurus YAML frontmatter (id, title, sidebar_label)
 * - Escapes bare JSX-like syntax outside code blocks (if any)
 * - Creates _category_.json files for Docusaurus sidebar ordering
 *
 * Usage: node scripts/postprocess-md-docs.mjs [docs-md]
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const docsDir = process.argv[2] || 'docs-md';

if (!existsSync(docsDir)) {
  console.error(`Directory not found: ${docsDir}`);
  process.exit(1);
}

/** Convert a filename stem to a human-readable title. */
function stemToTitle(stem) {
  // CamelCase → spaced: "CamundaClient" stays as-is
  // kebab-case → Title Case: "type-aliases" → "Type Aliases"
  if (stem.includes('-')) {
    return stem
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return stem;
}

/** Category labels for known directories. */
const CATEGORY_LABELS = {
  classes: 'Classes',
  interfaces: 'Interfaces',
  'type-aliases': 'Type Aliases',
  functions: 'Functions',
  namespaces: 'Namespaces',
  index: 'Core',
  fp: 'Functional Programming (Technical Preview)',
  logger: 'Logger',
};

/** Sidebar positions for top-level module directories. */
const CATEGORY_POSITIONS = {
  index: 1,
  logger: 2,
  fp: 3,
};

/** Module-level entry page overrides. */
const MODULE_TITLES = {
  index: 'TypeScript SDK API Reference',
};

/** Sidebar positions for top-level docs (files at the root of api-reference/). */
const DOC_POSITIONS = {
  index: 0,
  modules: 99,
};

/**
 * Add Docusaurus frontmatter to a markdown file.
 * Skips if frontmatter already exists.
 */
function addFrontmatter(filePath) {
  let content = readFileSync(filePath, 'utf-8');

  // Already has frontmatter
  if (content.startsWith('---\n')) return;

  const stem = basename(filePath, '.md');
  const dir = basename(dirname(filePath));

  // Derive title from first H1, or filename
  const h1Match = content.match(/^#\s+(.+)$/m);
  let title = h1Match ? h1Match[1].replace(/[`*]/g, '') : stemToTitle(stem);

  // Override known module entry pages
  if (stem === 'index' && dir === basename(docsDir)) {
    title = MODULE_TITLES.index || title;
  }

  // Strip MDX backslash escapes (e.g. \< \>) — they are invalid inside
  // double-quoted YAML strings and unnecessary in frontmatter values.
  const yamlTitle = title.replace(/\\([<>])/g, '$1');
  const sidebarLabel = stem === 'index' ? 'Overview' : yamlTitle.split(':').pop().trim();

  // Add sidebar_position for top-level docs
  const isTopLevel = dir === basename(docsDir);
  const positionLine =
    isTopLevel && stem in DOC_POSITIONS ? `sidebar_position: ${DOC_POSITIONS[stem]}\n` : '';

  const frontmatter = `---
title: "${yamlTitle}"
sidebar_label: "${sidebarLabel}"
${positionLine}mdx:
  format: md
---

`;
  content = frontmatter + content;
  writeFileSync(filePath, content, 'utf-8');
}

/**
 * Clean up HTML blocks in generated markdown for readability.
 *
 * With `mdx: { format: md }` in frontmatter, Docusaurus parses these files
 * as CommonMark, so angle brackets and curly braces are safe. We still
 * convert styled HTML (from OpenAPI descriptions) to markdown for cleaner output.
 */
function cleanHtml(filePath) {
  let content = readFileSync(filePath, 'utf-8');

  // Separate frontmatter from body
  let frontmatter = '';
  let body = content;
  const fmMatch = content.match(/^(---\n[\s\S]*?\n---\n)/);
  if (fmMatch) {
    frontmatter = fmMatch[1];
    body = content.slice(frontmatter.length);
  }

  // Split on fenced code blocks — only transform prose regions
  const codeBlockParts = body.split(/(```[\s\S]*?```)/);
  let changed = false;

  for (let i = 0; i < codeBlockParts.length; i++) {
    if (codeBlockParts[i].startsWith('```')) continue;

    const before = codeBlockParts[i];

    // Convert styled HTML to markdown (these come from OpenAPI descriptions).
    codeBlockParts[i] = codeBlockParts[i]
      .replace(/<em>([^<]*)<\/em>/g, '*$1*')
      .replace(/<strong>([^<]*)<\/strong>/g, '**$1**')
      .replace(/<code>([^<]*)<\/code>/g, '`$1`')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<p>([^<]*)<\/p>/g, '\n$1\n')
      .replace(/<p>/g, '\n')
      .replace(/<\/p>/g, '\n');

    // Strip list structure: remove <ul>/<ol> wrappers, convert <li> to "- "
    // Run multiple passes to handle nested lists
    for (let pass = 0; pass < 3; pass++) {
      codeBlockParts[i] = codeBlockParts[i]
        .replace(/<ul[^>]*>\n?/g, '\n')
        .replace(/<\/ul>\n?/g, '\n')
        .replace(/<ol[^>]*>\n?/g, '\n')
        .replace(/<\/ol>\n?/g, '\n')
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1');
    }

    // Final cleanup: strip any residual HTML tags
    codeBlockParts[i] = codeBlockParts[i].replace(
      /<\/?(?:ul|ol|li|div|span|a|p|br|em|strong|code|pre|blockquote|table|thead|tbody|tr|td|th|hr|h[1-6]|img|figure|figcaption|section|article|nav|header|footer|main|aside|details|summary|dl|dt|dd)[^>]*>/g,
      ''
    );

    if (codeBlockParts[i] !== before) changed = true;
  }

  if (changed) {
    writeFileSync(filePath, frontmatter + codeBlockParts.join(''), 'utf-8');
  }
}

/**
 * Rewrite _media/ links to GitHub repo URLs.
 * TypeDoc copies referenced files into _media/ but those aren't valid in Docusaurus.
 */
function rewriteMediaLinks(filePath) {
  const GITHUB_BASE = 'https://github.com/camunda/orchestration-cluster-api-js/blob/main/';
  let content = readFileSync(filePath, 'utf-8');
  const before = content;
  content = content.replace(
    /\[([^\]]+)\]\(_media\/([^)]+)\)/g,
    (_, text, path) => `[${text}](${GITHUB_BASE}${path})`
  );
  if (content !== before) {
    writeFileSync(filePath, content, 'utf-8');
  }
}

/**
 * Create _category_.json for Docusaurus sidebar in each subdirectory.
 */
function createCategoryFiles(dir) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (!statSync(fullPath).isDirectory()) continue;
    if (entry.startsWith('_') || entry.startsWith('.')) continue;

    const label = CATEGORY_LABELS[entry] || stemToTitle(entry);
    const categoryFile = join(fullPath, '_category_.json');

    if (!existsSync(categoryFile)) {
      const category = {
        label,
      };
      if (CATEGORY_POSITIONS[entry] !== undefined) {
        category.position = CATEGORY_POSITIONS[entry];
      }
      writeFileSync(categoryFile, JSON.stringify(category, null, 2) + '\n', 'utf-8');
    }

    // Recurse into subdirectories
    createCategoryFiles(fullPath);
  }
}

/**
 * Add a Technical Preview admonition banner after the first heading in FP module pages.
 */
function addTechnicalPreviewBanner(filePath) {
  const rel = filePath.replace(/\\/g, '/'); // normalise for Windows
  // Match files under the fp/ directory
  if (!rel.includes('/fp/') && !rel.endsWith('/fp/index.md')) return;

  let content = readFileSync(filePath, 'utf-8');
  const banner =
    '\n:::caution Technical Preview\nThe Functional Programming API is a **technical preview**. Its surface may change in future releases without following semver.\n:::\n';

  // Insert after first H1
  const h1End = content.match(/^#\s+.+$/m);
  if (h1End) {
    const pos = h1End.index + h1End[0].length;
    const updated = content.slice(0, pos) + '\n' + banner + content.slice(pos);
    if (updated !== content) {
      writeFileSync(filePath, updated, 'utf-8');
    }
  }
}

/**
 * Process all markdown files recursively.
 */
function processDirectory(dir) {
  const entries = readdirSync(dir);
  let count = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      count += processDirectory(fullPath);
    } else if (entry.endsWith('.md')) {
      addFrontmatter(fullPath);
      cleanHtml(fullPath);
      rewriteMediaLinks(fullPath);
      addTechnicalPreviewBanner(fullPath);
      count++;
    }
  }

  return count;
}

// Run
const count = processDirectory(docsDir);
createCategoryFiles(docsDir);
console.log(`Post-processed ${count} markdown files in ${docsDir}`);
