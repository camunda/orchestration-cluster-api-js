#!/usr/bin/env tsx
/**
 * Post-generation hook: inject @example tags with {@includeCode} references
 * into generated JSDoc comments, linking operations to compilable examples.
 *
 * Reads examples/operation-map.json and patches:
 *   - src/gen/CamundaClient.ts
 *   - src/facade/operations.gen.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const mapPath = resolve(root, 'examples/operation-map.json');

if (!existsSync(mapPath)) {
  console.log('[inject-examples] examples/operation-map.json not found — skipping');
  process.exit(0);
}

type ExampleRef = { file: string; region: string; label: string };
const operationMap: Record<string, ExampleRef[]> = JSON.parse(readFileSync(mapPath, 'utf8'));

// Both generated files are under src/, relative path to examples/ is the same
const examplesRelPath = '../../examples';

const targets = [
  resolve(root, 'src/gen/CamundaClient.ts'),
  resolve(root, 'src/facade/operations.gen.ts'),
];

let totalInjected = 0;

for (const filePath of targets) {
  if (!existsSync(filePath)) continue;
  let src = readFileSync(filePath, 'utf8');
  let fileInjections = 0;

  for (const [opId, examples] of Object.entries(operationMap)) {
    // Match the @operationId tag line and inject @example blocks before it
    const marker = `@operationId ${opId}\n`;
    const idx = src.indexOf(marker);
    if (idx === -1) continue;

    // Detect the indentation prefix (e.g. "   * " or " * ")
    const lineStart = src.lastIndexOf('\n', idx) + 1;
    const prefix = src.slice(lineStart, idx); // e.g. "   * "

    const exampleLines = examples.flatMap((ex) => [
      `${prefix}@example ${ex.label}`,
      `${prefix}{@includeCode ${examplesRelPath}/${ex.file}#${ex.region}}`,
    ]);

    // Insert example lines before the @operationId line
    const injection = exampleLines.join('\n') + '\n';
    src = src.slice(0, lineStart) + injection + src.slice(lineStart);
    fileInjections += examples.length;
  }

  if (fileInjections > 0) {
    writeFileSync(filePath, src, 'utf8');
    totalInjected += fileInjections;
  }
}

console.log(
  `[inject-examples] Injected ${totalInjected} @example tags across ${targets.length} files`
);
