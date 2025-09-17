import fs from 'fs';
import path from 'path';

const root = process.cwd();
const typesPath = path.join(root, 'src/gen/types.gen.ts');

if (!fs.existsSync(typesPath)) {
  console.error('[postprocess-brand-aliases] types.gen.ts not found');
  process.exit(0);
}
const metaPath = path.join(root, 'branding/branding-metadata.json');
if (!fs.existsSync(metaPath)) {
  console.error('[postprocess-brand-aliases] branding metadata missing');
  process.exit(0);
}

interface MetadataKey {
  name: string;
}
interface Metadata {
  keys: MetadataKey[];
}

const metadata: Metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const keyNames = new Set(metadata.keys.map((k) => k.name));
let source = fs.readFileSync(typesPath, 'utf8');

// Ensure import
if (!/import type \{ CamundaKey \} from '.\/branding.gen';/.test(source)) {
  const headerMatch = source.match(/^(\/\/ This file is auto-generated[^\n]*\n)/);
  if (headerMatch) {
    const insertIdx = headerMatch[0].length;
    source =
      source.slice(0, insertIdx) +
      "import type { CamundaKey } from './branding.gen';\n// branding postprocess applied\n" +
      source.slice(insertIdx);
  } else {
    source =
      "import type { CamundaKey } from './branding.gen';\n// branding postprocess applied\n" +
      source;
  }
}

const aliasRegex = /^export type (\w+) = ([^;]+);$/gm;
let count = 0;
source = source.replace(aliasRegex, (full, name, rhs) => {
  if (!keyNames.has(name)) return full;
  if (/CamundaKey<'/.test(rhs)) return full; // already transformed
  if (rhs.includes('|')) return full; // skip unions
  // Reject anything that looks like an object/array/function type
  if (/[{}()[\]=?:]/.test(rhs)) return full;
  // Only allow branding if rhs tokens are limited to identifier tokens joined by & and optional unknown
  const allowedTokenPattern = /^(?:[A-Za-z0-9_]+)(?:\s*&\s*[A-Za-z0-9_]+)*\s*&?\s*unknown?$/i;
  if (!allowedTokenPattern.test(rhs.trim())) return full;
  count++;
  return `export type ${name} = CamundaKey<'${name}'>;`;
});

fs.writeFileSync(typesPath, source, 'utf8');
console.log(`[postprocess-brand-aliases] Updated ${count} aliases to branded form`);
