/**
 * Post-generation hook: annotate deprecated enum members.
 *
 * Reads `deprecatedEnumMembers` from spec-metadata.json and patches
 * types.gen.ts to add inline `@deprecated` JSDoc tags on affected
 * string literal union members.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const METADATA_PATH = path.join(ROOT, 'external-spec/bundled/spec-metadata.json');
const TYPES_GEN_PATH = path.join(ROOT, 'src/gen/types.gen.ts');

interface DeprecatedMember {
  name: string;
  deprecatedInVersion: string;
}

interface DeprecatedEnumSchema {
  schemaName: string;
  enumValues: string[];
  deprecatedMembers: DeprecatedMember[];
}

function main(): void {
  if (!fs.existsSync(METADATA_PATH)) {
    console.log('[deprecated-enums] spec-metadata.json not found, skipping');
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
  const entries: DeprecatedEnumSchema[] = metadata.deprecatedEnumMembers || [];

  if (entries.length === 0) {
    console.log('[deprecated-enums] No deprecated enum members found, skipping');
    return;
  }

  if (!fs.existsSync(TYPES_GEN_PATH)) {
    console.error('[deprecated-enums] types.gen.ts not found');
    process.exitCode = 1;
    return;
  }

  let source = fs.readFileSync(TYPES_GEN_PATH, 'utf8');
  let patchCount = 0;

  for (const entry of entries) {
    // Build a lookup of deprecated member name → version
    const deprecatedMap = new Map<string, string>();
    for (const m of entry.deprecatedMembers) {
      deprecatedMap.set(m.name, m.deprecatedInVersion);
    }

    // Match: export type SchemaName = 'A' | 'B' | 'C';
    const typePattern = new RegExp(`(export type ${entry.schemaName}\\s*=\\s*)([^;]+)(;)`);
    const match = source.match(typePattern);
    if (!match) continue;

    const [fullMatch, prefix, membersPart, suffix] = match;

    // Split on | and annotate deprecated members
    const members = membersPart.split('|').map((m) => m.trim());
    const annotated = members.map((member) => {
      // Extract the string literal value (e.g. 'UNSPECIFIED' → UNSPECIFIED)
      const literalMatch = member.match(/^'([^']+)'$/);
      if (!literalMatch) return member;
      const value = literalMatch[1];
      const version = deprecatedMap.get(value);
      if (!version) return member;
      return `/** @deprecated since ${version} */ ${member}`;
    });

    const newMembersPart = annotated.join(' | ');
    source = source.replace(fullMatch, `${prefix}${newMembersPart}${suffix}`);
    patchCount++;
  }

  if (patchCount > 0) {
    fs.writeFileSync(TYPES_GEN_PATH, source, 'utf8');
  }

  console.log(`[deprecated-enums] Annotated ${patchCount} enum type(s) in types.gen.ts`);
}

try {
  main();
} catch (err) {
  console.error('[deprecated-enums] Failed');
  console.error(err);
  process.exitCode = 1;
}
