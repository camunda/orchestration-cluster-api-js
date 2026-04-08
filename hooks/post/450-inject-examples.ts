#!/usr/bin/env tsx
/**
 * Post-generation hook: inject @example tags with inlined code snippets
 * into generated JSDoc comments so examples are visible in IntelliSense.
 *
 * Reads examples/operation-map.json, extracts region-tagged code from
 * example files, and inlines it directly in JSDoc @example blocks in:
 *   - src/gen/CamundaClient.ts
 *   - src/facade/operations.gen.ts
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
  const startTag = `//#region ${region}`;
  const endTag = `//#endregion ${region}`;
  const startIdx = content.indexOf(startTag);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf(endTag, startIdx);
  if (endIdx === -1) return null;

  const regionContent = content.slice(startIdx + startTag.length, endIdx);
  // Normalize to LF, then trim leading/trailing blank lines and remove common leading indentation
  const lines = regionContent.replace(/\r\n/g, '\n').split('\n');
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

  // Strip any previously injected @example blocks (old {@includeCode} or inlined code).
  // An @example block is: one @example line followed by lines that are NOT a JSDoc tag
  // (i.e. lines matching " * " but not " * @something"), up to the next tag or end of comment.
  src = src.replace(
    new RegExp(
      `([ \\t]*\\*[ \\t]*)@example [^\\n]*${eolRe}` + // @example line
        `(?:[ \\t]*\\*(?:[ \\t][^@\\n][^\\n]*|[ \\t]*)${eolRe})*`, // continuation lines (code or blank JSDoc lines)
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
    for (const ex of examples) {
      const code = extractRegion(resolve(examplesDir, ex.file), ex.region);
      if (!code) continue;

      exampleLines.push(`${prefix}@example ${ex.label}`);
      // Indent each line of code with the JSDoc prefix
      for (const codeLine of code.split('\n')) {
        exampleLines.push(`${prefix}${codeLine}`);
      }
    }

    if (exampleLines.length === 0) continue;

    // Insert example lines before the @operationId line
    const injection = `${exampleLines.join(eol)}${eol}`;
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
