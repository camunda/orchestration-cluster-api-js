/*
 * Preprocess Camunda key-like schemas and emit stable branding metadata.
 *
 * Usage:
 *   npx ts-node scripts/preprocess-brands.ts [specPath] [outputJson]
 * Defaults:
 *   specPath    = ./rest-api.source.yaml
 *   outputJson  = ./sdks/typescript-codegen/branding/branding-metadata.json
 *
 * Policy (semantic key marker refactor):
 *   - A schema is branded if it declares x-semantic-type (treat as implicit x-semantic-key: true)
 *     or explicitly sets x-semantic-key: true.
 *   - Cursor & model id schemas retain category classification but only brand if they satisfy marker.
 *   - Union wrappers (e.g. ResourceKey) remain unbranded wrappers over branded refs.
 *   - Hybrid unions (e.g. BatchOperationKey) retain structural branch metadata; no implicit branding
 *     from historical CamundaKey ancestry.
 *   - Metadata is committed for stability & drift detection.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import yaml from 'yaml';

interface Constraints {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  format?: string;
}

type KeyCategory = 'system-key' | 'cursor' | 'model-id' | 'other';

interface BrandedKeyEntry {
  name: string;
  semanticType: string;
  category: KeyCategory;
  description?: string;
  composition: {
    schemaKind: 'allOf' | 'oneOf' | 'anyOf' | 'inline';
    refs: string[];
    inlineFragments: number;
  };
  constraints: Constraints;
  examples?: string[];
  brand: { tsType: string };
  zod: { schemaName: string; transformPipeline: string[] };
  source: { schemaPointer: string; lineStart?: number; lineEnd?: number };
  extensions?: Record<string, unknown>;
  flags: {
    semanticKey: boolean;
    includesLongKeyRef: boolean;
    deprecated: boolean;
  };
  stableId: string;
  notes?: string[];
}

interface UnionKeyBranch {
  branchType: 'branded-ref' | 'branded' | 'uuid' | 'other';
  ref?: string; // referenced schema name
  refs?: string[]; // for branded (composed) branch
  brand?: string;
  tsType?: string;
  constraints?: Constraints;
}

interface UnionKeyEntry {
  name: string;
  kind: 'union-wrapper' | 'hybrid-union';
  description?: string;
  branches: UnionKeyBranch[];
  tsType: string;
  zod: { schemaName: string };
  source: { schemaPointer: string; lineStart?: number; lineEnd?: number };
  stableId: string;
}

interface BrandingMetadata {
  schemaVersion: string;
  generatedAt: string;
  specHash: string;
  generator: { name: string; version?: string };
  brandingConfig: {
    genericTypeName: string;
    idTypesIncluded: boolean;
    namespaceFactories: boolean;
  };
  keys: BrandedKeyEntry[];
  unions: UnionKeyEntry[];
  arrays?: Array<{
    name: string;
    itemRef?: string;
    itemType?: string;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    source: { schemaPointer: string; lineStart?: number; lineEnd?: number };
  }>;
  integrity: {
    totalPrimaryKeys: number;
    totalUnionWrappers: number;
    implicitCamundaKeys: string[];
  };
}

const GENERIC_TYPE_NAME = 'CamundaKey';

const SPEC_DEFAULT = path.resolve(process.cwd(), './rest-api.source.yaml');
const OUT_DEFAULT = path.resolve(process.cwd(), './branding/branding-metadata.json');

const specPath = path.resolve(process.argv[2] || SPEC_DEFAULT);
const outPath = path.resolve(process.argv[3] || OUT_DEFAULT);

if (!fs.existsSync(specPath)) {
  console.error(`[preprocess-brands] Spec file not found: ${specPath}`);
  process.exit(1);
}

const specSource = fs.readFileSync(specPath, 'utf8');
const specHash = 'sha256:' + crypto.createHash('sha256').update(specSource).digest('hex');

let doc: any;
try {
  doc = yaml.parse(specSource);
} catch (e) {
  console.error('[preprocess-brands] Failed to parse YAML spec:', e);
  process.exit(1);
}

const schemas = doc?.components?.schemas || {};
const lines = specSource.split(/\r?\n/);

// Utility: find schema line range (best-effort, not required for logic)
function locateSchema(name: string): { lineStart?: number; lineEnd?: number } {
  const pattern = new RegExp('^ {0,}' + name + ':');
  let start: number | undefined;
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (!start) return {};
  // naive end: next schema at same indent level
  let end: number | undefined;
  for (let i = start; i < lines.length; i++) {
    if (/^ {0,}[A-Za-z0-9_]+:/.test(lines[i]) && !/^\s{2,}/.test(lines[i])) {
      // crude section boundary
      end = i;
      break;
    }
  }
  return { lineStart: start, lineEnd: end };
}

function toStableId(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function extractConstraints(obj: any): Constraints {
  if (!obj || typeof obj !== 'object') return {};
  const c: Constraints = {};
  if (obj.pattern) c.pattern = obj.pattern;
  if (typeof obj.minLength === 'number') c.minLength = obj.minLength;
  if (typeof obj.maxLength === 'number') c.maxLength = obj.maxLength;
  if (obj.format && typeof obj.format === 'string') c.format = obj.format;
  return c;
}

function mergeConstraints(target: Constraints, extra: Constraints) {
  if (!extra) return;
  Object.entries(extra).forEach(([k, v]) => {
    if (v !== undefined) (target as any)[k] = v;
  });
}

const brandedKeys: BrandedKeyEntry[] = [];
const unionKeys: UnionKeyEntry[] = [];
const implicitIds: string[] = [];
const arraySchemas: NonNullable<BrandingMetadata['arrays']> = [];

// First pass over schemas
for (const [name, schema] of Object.entries<any>(schemas)) {
  if (name === 'LongKey' || name === 'CamundaKey') continue; // CamundaKey removed in refactor but skip defensively

  const pointer = `#/components/schemas/${name}`;
  const { lineStart, lineEnd } = locateSchema(name);

  const isAllOf = Array.isArray(schema.allOf);
  const isOneOf = Array.isArray(schema.oneOf);
  const isAnyOf = Array.isArray(schema.anyOf);

  // Determine union wrappers early.
  if (isOneOf || isAnyOf) {
    const list = (schema.oneOf || schema.anyOf) as any[];
    const branches: UnionKeyBranch[] = [];
    for (const b of list) {
      if (b.$ref) {
        const refName = (b.$ref as string).split('/').pop()!;
        branches.push({ branchType: 'branded-ref', ref: refName });
      } else if (b.allOf) {
        const compRefs: string[] = [];
        for (const part of b.allOf) {
          if (part.$ref) compRefs.push((part.$ref as string).split('/').pop()!);
        }
        branches.push({ branchType: 'other', refs: compRefs });
      } else if (b.type === 'string' && b.format === 'uuid') {
        branches.push({ branchType: 'uuid', tsType: 'string', constraints: { format: 'uuid' } });
      } else {
        branches.push({ branchType: 'other' });
      }
    }
    // Classify union kind.
    const onlyRefs = branches.every((br) => br.branchType === 'branded-ref');
    const kind: UnionKeyEntry['kind'] = onlyRefs ? 'union-wrapper' : 'hybrid-union';
    // Build tsType string
    const tsType = branches
      .map((br) => (br.ref ? br.ref : (br.brand ?? br.tsType ?? 'string')))
      .join(' | ');
    unionKeys.push({
      name,
      kind,
      description: schema.description,
      branches,
      tsType,
      zod: { schemaName: 'z' + name },
      source: { schemaPointer: pointer, lineStart, lineEnd },
      stableId: toStableId(name),
    });
    continue; // unions are not primary branded primitives themselves
  }

  // Collect top-level array schemas with potential length constraints
  if (schema.type === 'array') {
    const pointer = `#/components/schemas/${name}`;
    const { lineStart, lineEnd } = locateSchema(name);
    const entry = {
      name,
      itemRef: schema.items?.$ref ? String(schema.items.$ref).split('/').pop() : undefined,
      itemType: schema.items?.type,
      minItems: typeof schema.minItems === 'number' ? schema.minItems : undefined,
      maxItems: typeof schema.maxItems === 'number' ? schema.maxItems : undefined,
      uniqueItems: !!schema.uniqueItems,
      source: { schemaPointer: pointer, lineStart, lineEnd },
    };
    arraySchemas.push(entry);
  }

  let includesLongKeyRef = false;
  const constraints: Constraints = {};
  let inlineFragments = 0;
  let schemaKind: 'allOf' | 'oneOf' | 'anyOf' | 'inline' = 'inline';
  let description: string | undefined = schema.description;
  let examples: string[] | undefined;
  const notes: string[] = [];
  const semanticType = schema['x-semantic-type'] || name;

  if (schema.example) examples = [String(schema.example)];

  if (isAllOf) {
    schemaKind = 'allOf';
    for (const part of schema.allOf) {
      if (part.$ref === '#/components/schemas/LongKey') includesLongKeyRef = true;
      if (!part.$ref) {
        inlineFragments++;
        mergeConstraints(constraints, extractConstraints(part));
        if (part.description) description = part.description; // prefer inline description
        if (part.example) (examples ||= []).push(String(part.example));
        if (part['x-semantic-type']) notes.push(`inline semantic-type: ${part['x-semantic-type']}`);
      }
    }
  } else {
    mergeConstraints(constraints, extractConstraints(schema));
  }

  // Option B implementation: inherit LongKey constraints when the schema is a pure alias
  // composed only of refs (CamundaKey + LongKey) and provided no inline fragment added
  // explicit constraints. This preserves DRY spec definitions while retaining runtime
  // validation for numeric key shapes.
  if (includesLongKeyRef && Object.keys(constraints).length === 0) {
    const longKey = (schemas as any)['LongKey'];
    if (longKey) {
      const beforeKeys = Object.keys(constraints).length;
      mergeConstraints(constraints, extractConstraints(longKey));
      if (Object.keys(constraints).length > beforeKeys) {
        notes.push('inherited constraints from LongKey');
      }
    }
  }

  // Determine semantic key marker
  const semanticKey = schema['x-semantic-key'] === true || !!schema['x-semantic-type'];

  // Cursor detection (explicit refs already flagged) – categorize specially for reporting.
  let category: KeyCategory = 'system-key';
  if (/Cursor$/i.test(name)) category = 'cursor';
  else if (/Id$/i.test(name)) category = 'model-id';
  else if (!includesLongKeyRef && !constraints.pattern) category = 'other';

  if (semanticKey) {
    const entry: BrandedKeyEntry = {
      name,
      semanticType: semanticType,
      category,
      description,
      composition: { schemaKind, refs: includesLongKeyRef ? ['LongKey'] : [], inlineFragments },
      constraints,
      examples,
      brand: { tsType: `${GENERIC_TYPE_NAME}<'${name}'>` },
      zod: { schemaName: 'z' + name, transformPipeline: ['brand-cast'] },
      source: { schemaPointer: pointer, lineStart, lineEnd },
      extensions: {
        'x-semantic-type': schema['x-semantic-type'],
        'x-semantic-key': schema['x-semantic-key'],
      },
      flags: {
        semanticKey,
        includesLongKeyRef,
        deprecated: !!schema.deprecated,
      },
      stableId: toStableId(name),
      notes: notes.length ? notes : undefined,
    };
    brandedKeys.push(entry);
  }
}

// Integrity counters
const metadata: BrandingMetadata = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  specHash,
  generator: { name: '@hey-api/openapi-ts' },
  brandingConfig: {
    genericTypeName: GENERIC_TYPE_NAME,
    idTypesIncluded: true,
    namespaceFactories: true,
  },
  keys: brandedKeys.sort((a, b) => a.name.localeCompare(b.name)),
  unions: unionKeys.sort((a, b) => a.name.localeCompare(b.name)),
  arrays: arraySchemas.sort((a, b) => a.name.localeCompare(b.name)),
  integrity: {
    totalPrimaryKeys: brandedKeys.length,
    totalUnionWrappers: unionKeys.length,
    implicitCamundaKeys: implicitIds.sort(),
  },
};

// Basic validation
if (!metadata.keys.length) {
  console.error('[preprocess-brands] No branded keys discovered – aborting.');
  process.exit(1);
}

// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(metadata, null, 2) + '\n', 'utf8');

// Human-readable summary
const summaryLines: string[] = [];
summaryLines.push('[preprocess-brands] Branding metadata generated.');
summaryLines.push(`  Spec: ${path.relative(process.cwd(), specPath)}`);
summaryLines.push(`  Out : ${path.relative(process.cwd(), outPath)}`);
summaryLines.push(`  Keys: ${metadata.integrity.totalPrimaryKeys}`);
summaryLines.push(`  Unions: ${metadata.integrity.totalUnionWrappers}`);
summaryLines.push(`  Arrays: ${metadata.arrays?.length || 0}`);
if (implicitIds.length) summaryLines.push(`  Implicit IDs: ${implicitIds.join(', ')}`);
console.log(summaryLines.join('\n'));

// Optional: exit non-zero if any hybrid-union missing a branded branch
const hybridIssues = metadata.unions.filter(
  (u) =>
    u.kind === 'hybrid-union' &&
    !u.branches.some((b) => b.branchType === 'branded' || b.branchType === 'branded-ref')
);
if (hybridIssues.length) {
  console.warn(
    '[preprocess-brands] WARNING: hybrid unions without branded branch:',
    hybridIssues.map((h) => h.name)
  );
}

export {}; // ensure module scope
