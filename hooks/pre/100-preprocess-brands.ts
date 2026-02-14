/*
 * Produce branding-metadata.json from the bundler's spec-metadata.json.
 *
 * The bundler (camunda-schema-bundler) already extracts semantic keys, unions,
 * and arrays from the upstream spec.  This script augments that data with
 * SDK-specific fields (brand tsType, zod schema names, source pointers) that
 * the branding plugin and postprocessors expect.
 *
 * Usage:
 *   npx tsx scripts/preprocess-brands.ts [specMetadataPath] [outputJson]
 * Defaults:
 *   specMetadataPath = ./external-spec/bundled/spec-metadata.json
 *   outputJson       = ./branding/branding-metadata.json
 */

import fs from 'node:fs';
import path from 'node:path';

const GENERIC_TYPE_NAME = 'CamundaKey';

const META_DEFAULT = path.resolve(process.cwd(), 'external-spec/bundled/spec-metadata.json');
const OUT_DEFAULT = path.resolve(process.cwd(), './branding/branding-metadata.json');

const metaPath = path.resolve(process.argv[2] || META_DEFAULT);
const outPath = path.resolve(process.argv[3] || OUT_DEFAULT);

if (!fs.existsSync(metaPath)) {
  console.error(`[preprocess-brands] spec-metadata.json not found: ${metaPath}`);
  process.exit(1);
}

const specMetadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

// Transform semanticKeys → keys with SDK-specific augmentation
const keys = (specMetadata.semanticKeys || []).map((k: any) => ({
  ...k,
  brand: { tsType: `${GENERIC_TYPE_NAME}<'${k.name}'>` },
  zod: { schemaName: 'z' + k.name, transformPipeline: ['brand-cast'] },
  source: { schemaPointer: `#/components/schemas/${k.name}` },
}));

// Unions: map branchType 'ref' → 'branded-ref' for backward compat with downstream consumers
const unions = (specMetadata.unions || []).map((u: any) => ({
  ...u,
  branches: (u.branches || []).map((b: any) => ({
    ...b,
    branchType: b.branchType === 'ref' ? 'branded-ref' : b.branchType,
  })),
  tsType: (u.branches || [])
    .map((br: any) => br.ref || br.brand || br.tsType || 'string')
    .join(' | '),
  zod: { schemaName: 'z' + u.name },
  source: { schemaPointer: `#/components/schemas/${u.name}` },
}));

// Arrays: add source pointers
const arrays = (specMetadata.arrays || []).map((a: any) => ({
  ...a,
  source: { schemaPointer: `#/components/schemas/${a.name}` },
}));

const metadata = {
  schemaVersion: specMetadata.schemaVersion || '1.0.0',
  specHash: specMetadata.specHash,
  generator: { name: '@hey-api/openapi-ts' },
  brandingConfig: {
    genericTypeName: GENERIC_TYPE_NAME,
    idTypesIncluded: true,
    namespaceFactories: true,
  },
  keys: keys.sort((a: any, b: any) => a.name.localeCompare(b.name)),
  unions: unions.sort((a: any, b: any) => a.name.localeCompare(b.name)),
  arrays: arrays.sort((a: any, b: any) => a.name.localeCompare(b.name)),
  integrity: {
    totalPrimaryKeys: keys.length,
    totalUnionWrappers: unions.length,
    implicitCamundaKeys: [],
  },
};

if (!metadata.keys.length) {
  console.error('[preprocess-brands] No branded keys discovered – aborting.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(metadata, null, 2) + '\n', 'utf8');

console.log('[preprocess-brands] Branding metadata generated from spec-metadata.json.');
console.log(`  Source: ${path.relative(process.cwd(), metaPath)}`);
console.log(`  Out   : ${path.relative(process.cwd(), outPath)}`);
console.log(`  Keys  : ${metadata.integrity.totalPrimaryKeys}`);
console.log(`  Unions: ${metadata.integrity.totalUnionWrappers}`);
console.log(`  Arrays: ${metadata.arrays.length}`);

export {}; // ensure module scope
