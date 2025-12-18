import fs from 'node:fs';
import path from 'node:path';

import SwaggerParser from '@apidevtools/swagger-parser';

import { LOCAL_BUNDLED_SPEC_PATH, LOCAL_SPEC_ENTRY_PATH } from './spec-location';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeInternalRef(ref: string): string {
  // SwaggerParser.bundle emits URI-encoded fragments (e.g. `%24like`, `%2B`).
  // openapi-ts' resolver does not appear to decode these.
  if (!ref.startsWith('#') || !ref.includes('%')) return ref;
  try {
    const fragment = ref.slice(1);
    return '#' + decodeURIComponent(fragment);
  } catch {
    return ref;
  }
}

function rewriteInternalRefs(root: unknown): void {
  const stack: unknown[] = [root];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur) continue;

    if (Array.isArray(cur)) {
      for (const item of cur) stack.push(item);
      continue;
    }

    if (!isRecord(cur)) continue;

    const ref = cur['$ref'];
    if (typeof ref === 'string') {
      cur['$ref'] = normalizeInternalRef(ref);
    }

    for (const value of Object.values(cur)) {
      stack.push(value);
    }
  }
}

async function main(): Promise<void> {
  fs.mkdirSync(path.dirname(LOCAL_BUNDLED_SPEC_PATH), { recursive: true });

  // Bundle merges a multi-file spec into a single document while keeping $refs
  // (but making them internal). This avoids downstream tools needing to resolve
  // external file references.
  const bundled = (await SwaggerParser.bundle(LOCAL_SPEC_ENTRY_PATH)) as any;

  rewriteInternalRefs(bundled);

  fs.writeFileSync(LOCAL_BUNDLED_SPEC_PATH, JSON.stringify(bundled, null, 2) + '\n', 'utf8');

  // Keep log small but useful.
  const pathCount = bundled?.paths ? Object.keys(bundled.paths).length : 0;
  const schemaCount = bundled?.components?.schemas
    ? Object.keys(bundled.components.schemas).length
    : 0;
  console.log(
    `[bundle-openapi] Wrote bundled spec to ${LOCAL_BUNDLED_SPEC_PATH} (paths=${pathCount}, schemas=${schemaCount})`
  );
}

try {
  await main();
} catch (err) {
  console.error('[bundle-openapi] Failed to bundle OpenAPI spec');
  console.error(err);
  process.exitCode = 1;
}
