#!/usr/bin/env tsx
/**
 * Post-generation hook: inject @example tags with inlined code snippets
 * into generated JSDoc comments so examples are visible in IntelliSense.
 *
 * Reads examples/operation-map.json, extracts region-tagged code from
 * example files, and inlines it directly in JSDoc @example blocks in:
 *   - src/gen/CamundaClient.ts
 *   - src/facade/operations.gen.ts
 *
 * The hook is idempotent: it strips any previously injected @example blocks
 * before re-injecting fresh ones.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const mapPath = resolve(root, 'examples/operation-map.json');

if (!existsSync(mapPath)) {
  console.log('[inject-examples] examples/operation-map.json not found — skipping');
  process.exit(0);
}

type ExampleRef = { file: string; region: string; label: string };
const operationMap: Record<string, ExampleRef[]> = JSON.parse(readFileSync(mapPath, 'utf8'));

/** Cache of already-read example files */
const fileCache = new Map<string, string>();

/** Extract the code between //#region Name and //#endregion Name from a file */
function extractRegion(filePath: string, region: string): string | null {
  if (!fileCache.has(filePath)) {
    if (!existsSync(filePath)) return null;
    fileCache.set(filePath, readFileSync(filePath, 'utf8'));
  }
  const content = fileCache.get(filePath)!;
  // Use line-anchored regex to avoid prefix matches (e.g. CreateDocument vs CreateDocumentLink)
  const escapedRegion = region.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const startRe = new RegExp(`^\\s*//#region\\s+${escapedRegion}\\s*$`, 'm');
  const endRe = new RegExp(`^\\s*//#endregion\\s+${escapedRegion}\\s*$`, 'm');
  const startMatch = startRe.exec(content);
  if (!startMatch) return null;
  const afterStart = startMatch.index + startMatch[0].length;
  const endMatch = endRe.exec(content.slice(afterStart));
  if (!endMatch) return null;

  const regionContent = content.slice(afterStart, afterStart + endMatch.index);
  // Strip all CR so we work with pure LF, then split and trim
  const lines = regionContent.replace(/\r/g, '').split('\n');
  // Drop first line if empty (newline after start tag)
  if (lines.length > 0 && lines[0].trim() === '') lines.shift();
  // Drop last line if empty (newline before end tag)
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

  // Find minimum indentation
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return null;
  const minIndent = Math.min(...nonEmptyLines.map((l) => l.match(/^(\s*)/)![1].length));
  return lines.map((l) => l.slice(minIndent)).join('\n');
}

const examplesDir = resolve(root, 'examples');

const targets = [
  resolve(root, 'src/gen/CamundaClient.ts'),
  resolve(root, 'src/facade/operations.gen.ts'),
];

let totalInjected = 0;

for (const filePath of targets) {
  if (!existsSync(filePath)) continue;
  let src = readFileSync(filePath, 'utf8');
  let fileInjections = 0;

  // Detect line ending style (CRLF or LF)
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const eolRe = eol === '\r\n' ? '\\r\\n' : '\\n';

  // Strip previously injected @example blocks only before @operationId markers
  // (preserves manual @example blocks elsewhere, e.g. createJobWorker).
  // An injected block is: one or more @example lines (with continuation code lines)
  // immediately preceding an @operationId line.
  src = src.replace(
    new RegExp(
      `(?:` +
        `(?:[ \\t]*\\*[ \\t]*)@example [^\\r\\n]*${eolRe}` + // @example line
        `(?:[ \\t]*\\*(?:[ \\t][^@\\r\\n][^\\r\\n]*|[ \\t]*)${eolRe})*` + // continuation lines
        `)+` + // one or more @example blocks
        `(?=[ \\t]*\\*[ \\t]*@operationId )`, // only if followed by @operationId
      'g'
    ),
    ''
  );

  for (const [opId, examples] of Object.entries(operationMap)) {
    // Match the @operationId tag line and inject @example blocks before it
    const marker = `@operationId ${opId}${eol}`;
    const idx = src.indexOf(marker);
    if (idx === -1) continue;

    // Detect the indentation prefix (e.g. "   * " or " * ")
    const lineStart = src.lastIndexOf(eol, idx) + eol.length;
    const prefix = src.slice(lineStart, idx); // e.g. "   * "

    const exampleLines: string[] = [];
    let injectedCount = 0;
    for (const ex of examples) {
      const code = extractRegion(resolve(examplesDir, ex.file), ex.region);
      if (!code) continue;

      injectedCount++;
      exampleLines.push(`${prefix}@example ${ex.label}`);
      // Wrap code in fenced code block so TypeDoc renders it as code in markdown
      exampleLines.push(`${prefix}\`\`\`ts`);
      for (const codeLine of code.split('\n')) {
        exampleLines.push(`${prefix}${codeLine}`);
      }
      exampleLines.push(`${prefix}\`\`\``);
    }

    if (exampleLines.length === 0) continue;

    // Insert example lines before the @operationId line
    const injection = `${exampleLines.join(eol)}${eol}`;
    src = src.slice(0, lineStart) + injection + src.slice(lineStart);
    fileInjections += injectedCount;
  }

  // Second pass: resolve any remaining {@includeCode} references from other hooks
  // (e.g. createJobWorker examples injected by class-methods hook)
  const includeCodeRe =
    /([ \t]*\*[ \t]*)(\{@includeCode\s+(?:\.\.\/)*examples\/([^#}]+)#([^}]+)\})/g;
  src = src.replace(
    includeCodeRe,
    (_match, prefix: string, _directive: string, file: string, region: string) => {
      const code = extractRegion(resolve(examplesDir, file), region);
      if (!code) return `${prefix}${_directive}`; // leave as-is if region not found
      fileInjections++;
      const codeLines = code
        .split('\n')
        .map((line) => `${prefix}${line}`);
      return [`${prefix}\`\`\`ts`, ...codeLines, `${prefix}\`\`\``].join(eol);
    }
  );

  if (fileInjections > 0) {
    writeFileSync(filePath, src, 'utf8');
    totalInjected += fileInjections;
  }
}

console.log(
  `[inject-examples] Injected ${totalInjected} @example tags across ${targets.length} files`
);
