import fs from 'node:fs';
import path from 'node:path';

import SwaggerParser from '@apidevtools/swagger-parser';
import { parse as parseYaml } from 'yaml';


import { listFilesRecursive } from './openapi-load';
import {
  LOCAL_BUNDLED_SPEC_PATH,
  LOCAL_SPEC_ENTRY_PATH,
  LOCAL_UPSTREAM_ROOT_DIR,
} from './spec-location';

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

function rewriteExternalRefsToLocal(root: any) {
  const stack: any[] = [root];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== 'object') continue;

    if (Array.isArray(cur)) {
      for (const item of cur) stack.push(item);
      continue;
    }

    if (cur['$ref'] && typeof cur['$ref'] === 'string') {
      const ref = cur['$ref'];
      // Rewrite external file refs to local component refs
      // Matches: anything ending in .yaml or .yml followed by #/components/schemas/Name
      if (
        ref.includes('#/components/schemas/') &&
        (ref.includes('.yaml') || ref.includes('.yml'))
      ) {
        const name = ref.split('#/components/schemas/').pop();
        if (name) {
          cur['$ref'] = `#/components/schemas/${name}`;
        }
      }
    }

    for (const k of Object.keys(cur)) {
      if (k !== '$ref') stack.push(cur[k]);
    }
  }
}

function jsonPointerDecode(segment: string): string {
  return decodeURIComponent(segment.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function resolveInternalRef(root: any, ref: string): any {
  if (!ref.startsWith('#/')) return undefined;
  const segments = ref.slice(2).split('/');
  let cur = root;
  for (const seg of segments) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = cur[jsonPointerDecode(seg)];
  }
  return cur;
}

function sortKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      }, {} as any);
  }
  return obj;
}

function canonicalStringify(obj: any): string {
  return JSON.stringify(sortKeys(obj));
}

async function main(): Promise<void> {
  fs.mkdirSync(path.dirname(LOCAL_BUNDLED_SPEC_PATH), { recursive: true });

  // Bundle merges a multi-file spec into a single document while keeping $refs
  // (but making them internal). This avoids downstream tools needing to resolve
  // external file references.
  const bundled = (await SwaggerParser.bundle(LOCAL_SPEC_ENTRY_PATH)) as any;

  // Augment bundle with schemas from all upstream files.
  // SwaggerParser.bundle unfortunately drops schemas that are referenced via defined structure
  // if they are not part of the root file's explicit components list (it inlines them instead).
  // This causes openapi-ts to generate anonymous/internal types (which sometimes fail to emit).
  // By flattening all upstream schemas into the bundle, we ensure openapi-ts sees them as named components.
  console.log('[bundle-openapi] Augmenting bundle with missing schemas...');
  const allFiles = listFilesRecursive(LOCAL_UPSTREAM_ROOT_DIR);
  let augmentedCount = 0;

  if (!bundled.components) bundled.components = {};
  if (!bundled.components.schemas) bundled.components.schemas = {};

  for (const file of allFiles) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    try {
      const content = fs.readFileSync(file, 'utf8');
      const doc = parseYaml(content) as any;
      if (doc?.components?.schemas) {
        for (const [name, schema] of Object.entries(doc.components.schemas)) {
          // Only add if missing. This prioritization preserves the "bundle" decision
          // if it already hoisted it, but captures missing ones (like TagSet).
          if (!bundled.components.schemas[name]) {
            // Apply rewriting to the schema being inserted to strip file paths from refs
            const s = JSON.parse(JSON.stringify(schema)); // Clone to avoid mutation issues if cached
            rewriteExternalRefsToLocal(s);
            bundled.components.schemas[name] = s;
            augmentedCount++;
          }
        }
      }
    } catch (e) {
      console.warn(`[bundle-openapi] Failed to parse/merge ${file}`, e);
    }
  }
  console.log(`[bundle-openapi] Added ${augmentedCount} missing schemas.`);

  // Logic to skip normalization for the definitions themselves
  const componentSchemas = bundled.components.schemas;
  const componentValues = new Set(Object.values(componentSchemas));

  // 1. Build signature map for all components
  const schemaSignatureMap = new Map<string, string>();
  for (const [name, schema] of Object.entries(componentSchemas)) {
    // Only map schemas that look "useful" (e.g. have type or properties or enum)
    schemaSignatureMap.set(canonicalStringify(schema), name);
  }

  // Specialized traversal that skips roots of components
  // We need to avoid traversing INTO components.schemas values with the intent to replace them.
  // Actually, we WANT to traverse inside them (e.g. properties of a component).
  // But we must not replace the Component Root Object.

  function safeNormalize(root: any, seen = new Set<any>()) {
    if (!root || typeof root !== 'object') return;
    if (seen.has(root)) return;
    seen.add(root);

    if (componentValues.has(root)) {
      // This object IS a component definition root. Don't replace it with a ref to itself.
      // But traverse its children to normalize them.
      for (const v of Object.values(root)) safeNormalize(v, seen);
      return;
    }

    if (Array.isArray(root)) {
      root.forEach((x: any) => safeNormalize(x, seen));
      return;
    }

    // Post-order traversal: normalize children FIRST
    for (const v of Object.values(root)) {
      safeNormalize(v, seen);
    }

    // Now check if we can rewrite self

    // 1. Rewrite weird path refs
    if (root['$ref'] && typeof root['$ref'] === 'string' && root['$ref'].startsWith('#/paths/')) {
      const resolved = resolveInternalRef(bundled, root['$ref']);
      if (resolved) {
        // Recursively normalize the target first to ensure nested refs are clean
        safeNormalize(resolved, seen);

        // Optimization: If the target resolved to a direct component ref (or was replaced by one),
        // adopt that ref directly. This handles chained refs or normalized inline objects.
        if (
          resolved['$ref'] &&
          typeof resolved['$ref'] === 'string' &&
          resolved['$ref'].startsWith('#/components/schemas/')
        ) {
          root['$ref'] = resolved['$ref'];
          return;
        }

        // Manual overrides for known tricky paths that fail signature matching
        // due to slight description variations or nesting depth.
        const manualOverrides: Record<string, string> = {
          '#/paths/~1process-instances~1search/post/requestBody/content/application~1json/schema/properties/filter/allOf/0':
            'ProcessInstanceFilter',
          '#/paths/~1process-definitions~1%7BprocessDefinitionKey%7D~1statistics~1element-instances/post/requestBody/content/application~1json/schema/properties/filter/allOf/0/allOf/0':
            'BaseProcessInstanceFilterFields',
        };

        if (manualOverrides[root['$ref']]) {
          root['$ref'] = `#/components/schemas/${manualOverrides[root['$ref']]}`;
          return;
        }

        const sig = canonicalStringify(resolved);
        const matchingName = schemaSignatureMap.get(sig);

        if (matchingName) {
          root['$ref'] = `#/components/schemas/${matchingName}`;
          // If we replaced it with a ref, we are done with this object
          return;
        }
      }
    }

    // 2. Rewrite inline matching objects
    if (!root['$ref']) {
      // Re-calculate signature now that children might have changed
      const sig = canonicalStringify(root);
      const matchingName = schemaSignatureMap.get(sig);
      if (matchingName) {
        // Found a matching component! Replace with ref.
        for (const k of Object.keys(root)) delete root[k];
        root['$ref'] = `#/components/schemas/${matchingName}`;
      }
    }

    // 3. Rewrite x-semantic-type
    if (root['x-semantic-type'] && !root['$ref'] && componentSchemas[root['x-semantic-type']]) {
      const target = root['x-semantic-type'];
      for (const k of Object.keys(root)) delete root[k];
      root['$ref'] = `#/components/schemas/${target}`;
    }
  }

  safeNormalize(bundled);
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
