#!/usr/bin/env node
/**
 * Fail the markdown docs build if any client operation lacks a method entry.
 *
 * TypeDoc silently omits members of non-exported classes, so a refactor that stops
 * exporting the class carrying the client's methods drops the whole method reference
 * from the published docs without any error. Every `@operationId` in the generated
 * client must appear as a `### name()` heading on some class page.
 *
 * Usage: node scripts/check-client-method-docs.mjs [docs-md]
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = process.argv[2] || 'docs-md';
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientSource = readFileSync(join(repoRoot, 'src/gen/CamundaClient.ts'), 'utf-8');

const operationIds = [
  ...new Set([...clientSource.matchAll(/@operationId\s+(\w+)/g)].map((m) => m[1])),
];
if (operationIds.length === 0) {
  console.error(
    'No @operationId tags found in src/gen/CamundaClient.ts; cannot verify the method reference.'
  );
  process.exit(1);
}

const classesDir = join(docsDir, 'index', 'classes');
const documented = new Set();
if (existsSync(classesDir)) {
  for (const file of readdirSync(classesDir).filter((f) => f.endsWith('.md'))) {
    const page = readFileSync(join(classesDir, file), 'utf-8');
    // Deprecated members render struck through: ### ~~name()~~
    for (const m of page.matchAll(/^### (?:~~)?(\w+)\(\)(?:~~)?\s*$/gm)) {
      documented.add(m[1].toLowerCase());
    }
  }
}

// Method names differ from operation IDs only in acronym casing (getProcessDefinitionXML → getProcessDefinitionXml).
const missing = operationIds.filter((op) => !documented.has(op.toLowerCase()));
if (missing.length > 0) {
  console.error(
    `${missing.length} of ${operationIds.length} client operations have no method entry under ${classesDir}:`
  );
  for (const op of missing) console.error(`  ${op}`);
  console.error('Is the class declaring these methods exported from the package entry?');
  process.exit(1);
}
console.log(`All ${operationIds.length} client operations are documented.`);
