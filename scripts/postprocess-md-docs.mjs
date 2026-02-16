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
import { join, basename, relative, dirname } from 'node:path';

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
  index: 'API Reference',
  fp: 'Functional Programming',
  logger: 'Logger',
};

/** Module-level entry page overrides. */
const MODULE_TITLES = {
  index: 'TypeScript SDK API Reference',
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
  const relPath = relative(docsDir, filePath);

  // Derive id from relative path (without .md)
  const id = relPath.replace(/\.md$/, '').replace(/\//g, '-').toLowerCase();

  // Derive title from first H1, or filename
  const h1Match = content.match(/^#\s+(.+)$/m);
  let title = h1Match ? h1Match[1].replace(/[`*]/g, '') : stemToTitle(stem);

  // Override known module entry pages
  if (stem === 'index' && dir === basename(docsDir)) {
    title = MODULE_TITLES.index || title;
  }

  const sidebarLabel = stem === 'index' ? 'Overview' : title.split(':').pop().trim();

  const frontmatter = `---
id: ${id}
title: "${title}"
sidebar_label: "${sidebarLabel}"
---

`;
  content = frontmatter + content;
  writeFileSync(filePath, content, 'utf-8');
}

/**
 * Escape JSX-like syntax outside code blocks for MDX compatibility.
 */
function escapeMdx(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const parts = content.split(/(```[\s\S]*?```)/);
  let changed = false;

  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].startsWith('```')) {
      const before = parts[i];
      // Escape <TypeName> patterns (but not HTML tags like <br>, <code>, etc.)
      parts[i] = parts[i].replace(/<([A-Z]\w+)>/g, '`<$1>`');
      // Escape bare {expression} patterns
      parts[i] = parts[i].replace(/\{([A-Za-z_]\w*)\}/g, '`{$1}`');
      if (parts[i] !== before) changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, parts.join(''), 'utf-8');
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
        link: existsSync(join(fullPath, 'index.md'))
          ? { type: 'doc', id: relative(docsDir, join(fullPath, 'index.md')).replace(/\.md$/, '').replace(/\//g, '-').toLowerCase() }
          : undefined,
      };
      writeFileSync(categoryFile, JSON.stringify(category, null, 2) + '\n', 'utf-8');
    }

    // Recurse into subdirectories
    createCategoryFiles(fullPath);
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
      escapeMdx(fullPath);
      count++;
    }
  }

  return count;
}

// Run
const count = processDirectory(docsDir);
createCategoryFiles(docsDir);
console.log(`Post-processed ${count} markdown files in ${docsDir}`);
