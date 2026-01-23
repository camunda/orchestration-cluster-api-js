#!/usr/bin/env tsx
/**
 * Post-generation patch: export internal operation types from CamundaClient.ts
 * so they can be re-exported in the Types namespace for documentation.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(process.cwd(), 'src/gen/CamundaClient.ts');
if (!fs.existsSync(file)) {
  console.error('[postprocess-export-types] CamundaClient.ts not found, skipping');
  process.exit(0);
}

let text = fs.readFileSync(file, 'utf8');

// Match type declarations that are Input, Consistency, Body, PathParam types
// Note: Options types are excluded because they show as Parameters<typeof Sdk.xxx>[0]
// Pattern: "type someName = " at the start of a line (not already exported)
const typePattern = /^(type\s+(\w+(?:Input|Consistency|PathParam_\w+|Body))\s*=)/gm;

let exportedTypes: string[] = [];
let count = 0;

text = text.replace(typePattern, (match, fullDecl, typeName) => {
  exportedTypes.push(typeName);
  count++;
  return `export ${fullDecl}`;
});

// Also export CancelablePromise and ExtendedDeploymentResult if not already exported
const additionalTypes = ['CancelablePromise', 'ExtendedDeploymentResult'];
for (const typeName of additionalTypes) {
  const pattern = new RegExp(`^(type\\s+${typeName}\\s*[=<])`, 'gm');
  if (pattern.test(text) && !text.includes(`export type ${typeName}`)) {
    text = text.replace(pattern, `export $1`);
    exportedTypes.push(typeName);
    count++;
  }
}

if (count > 0) {
  fs.writeFileSync(file, text, 'utf8');
  console.log(`[postprocess-export-types] exported ${count} internal types from CamundaClient.ts`);
} else {
  console.log('[postprocess-export-types] no types to export or already exported');
}
