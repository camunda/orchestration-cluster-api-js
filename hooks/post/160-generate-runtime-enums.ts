/**
 * Post-generation hook: generate runtime enum value objects.
 *
 * Scans types.gen.ts for `export type FooEnum = 'A' | 'B' | ...;` patterns
 * and emits companion `as const` objects so consumers can validate raw strings,
 * write type guards, and use dot-access with autocomplete.
 *
 * Runs after 150-annotate-deprecated-enums so that @deprecated annotations
 * are preserved in the generated const objects.
 *
 * Before:
 *   export type FooEnum = 'A' | 'B';
 *
 * After:
 *   export const FooEnum = { A: 'A', B: 'B' } as const;
 *   export type FooEnum = (typeof FooEnum)[keyof typeof FooEnum];
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TYPES_GEN_PATH = path.join(ROOT, 'src/gen/types.gen.ts');

/**
 * Parse a single enum member segment (between `|` separators), which may
 * include a leading `@deprecated` JSDoc comment.
 *
 * Examples:
 *   `'ACCESS'`
 *   `/** @deprecated since 8.9.0 *​/ 'UNSPECIFIED'`
 */
interface EnumMember {
  value: string;
  deprecatedComment: string | null;
}

function parseMembers(membersPart: string): EnumMember[] {
  // Split on | but keep any inline JSDoc annotations attached to the value
  const segments = membersPart.split('|').map((s) => s.trim());
  const members: EnumMember[] = [];

  for (const segment of segments) {
    if (!segment) continue;

    // Check for /** @deprecated ... */ prefix
    const deprecatedMatch = segment.match(
      /^(\/\*\*\s*@deprecated\s[^*]*\*\/)\s*'([^']+)'$/
    );
    if (deprecatedMatch) {
      members.push({
        value: deprecatedMatch[2],
        deprecatedComment: deprecatedMatch[1],
      });
      continue;
    }

    // Plain string literal
    const plainMatch = segment.match(/^'([^']+)'$/);
    if (plainMatch) {
      members.push({ value: plainMatch[1], deprecatedComment: null });
      continue;
    }

    // Skip anything we don't recognize
    console.warn(`[runtime-enums] Skipping unrecognized segment: ${segment}`);
  }

  return members;
}

function generateConstObject(name: string, members: EnumMember[]): string {
  const entries = members.map((m) => {
    const prefix = m.deprecatedComment ? `  ${m.deprecatedComment}\n` : '';
    return `${prefix}  ${m.value}: '${m.value}',`;
  });

  return [
    `export const ${name} = {`,
    ...entries,
    '} as const;',
    `export type ${name} = (typeof ${name})[keyof typeof ${name}];`,
  ].join('\n');
}

function main(): void {
  if (!fs.existsSync(TYPES_GEN_PATH)) {
    console.error('[runtime-enums] types.gen.ts not found');
    process.exitCode = 1;
    return;
  }

  let source = fs.readFileSync(TYPES_GEN_PATH, 'utf8');
  let patchCount = 0;

  // Match: export type XxxEnum = 'A' | 'B' | ...;
  // The members part may contain /** @deprecated ... */ annotations.
  const enumPattern = /^(export type (\w+Enum)\s*=\s*)([^;]+)(;)\s*$/gm;

  let match: RegExpExecArray | null;
  const replacements: Array<{ original: string; replacement: string }> = [];

  while ((match = enumPattern.exec(source)) !== null) {
    const [fullMatch, , name, membersPart] = match;
    const members = parseMembers(membersPart);

    if (members.length === 0) {
      console.warn(`[runtime-enums] No members found for ${name}, skipping`);
      continue;
    }

    const constObject = generateConstObject(name, members);
    replacements.push({ original: fullMatch, replacement: constObject });
    patchCount++;
  }

  // Apply replacements (iterate in reverse to preserve offsets — not strictly
  // needed with string replace, but safer)
  for (const { original, replacement } of replacements) {
    source = source.replace(original, replacement);
  }

  if (patchCount > 0) {
    fs.writeFileSync(TYPES_GEN_PATH, source, 'utf8');
  }

  console.log(
    `[runtime-enums] Generated ${patchCount} runtime enum object(s) in types.gen.ts`
  );
}

try {
  main();
} catch (err) {
  console.error('[runtime-enums] Failed');
  console.error(err);
  process.exitCode = 1;
}
