#!/usr/bin/env node

/**
 * CI Guard: Verify every public CamundaClient method has a matching example
 * region in the examples/ directory.
 *
 * Extracts method names from two regions of the generated CamundaClient.ts:
 *   1. Template methods (before AUTO-GENERATED CAMUNDA METHODS START)
 *   2. Generated methods (between START/END markers, via @operationId tags)
 *
 * Addresses: https://github.com/camunda/orchestration-cluster-api-js/issues/122
 *
 * Exits with code 1 if any public method lacks an example region.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const clientPath = path.join(rootDir, 'src', 'gen', 'CamundaClient.ts');
const examplesDir = path.join(rootDir, 'examples');

if (!fs.existsSync(clientPath)) {
  console.error(`CamundaClient source not found at ${clientPath}`);
  console.error("Run 'npm run build:local' first to generate the client.");
  process.exit(2);
}

const clientSource = fs.readFileSync(clientPath, 'utf8');

// ── Step 1: Extract generated method names via @operationId ─────────────────

const genStartMarker = '// === AUTO-GENERATED CAMUNDA METHODS START ===';
const genEndMarker = '// === AUTO-GENERATED CAMUNDA METHODS END ===';
const genStartIdx = clientSource.indexOf(genStartMarker);
const genEndIdx = clientSource.indexOf(genEndMarker);

const generatedMethods = new Set();
if (genStartIdx !== -1 && genEndIdx !== -1) {
  const genSection = clientSource.slice(genStartIdx, genEndIdx);
  const opIdRe = /@operationId\s+(\w+)/g;
  let m;
  while ((m = opIdRe.exec(genSection)) !== null) {
    generatedMethods.add(m[1]);
  }
}

// ── Step 2: Extract template (hand-written) method names ────────────────────

// Template methods live between the class body start and the AUTO-GENERATED marker.
// We find the class declaration, then parse only within the class body.
const classStartMatch = clientSource.match(/^export class CamundaClient\s*\{/m);
const classBodyStart = classStartMatch ? classStartMatch.index + classStartMatch[0].length : 0;

const templateSection =
  genStartIdx !== -1
    ? clientSource.slice(classBodyStart, genStartIdx)
    : clientSource.slice(classBodyStart);

// Also include everything after END marker (e.g. createJobWorker, deployResourcesFromFiles)
const afterGenSection = genEndIdx !== -1 ? clientSource.slice(genEndIdx + genEndMarker.length) : '';

// Find the closing brace of the class to avoid picking up file-level functions
const classEndMatch = afterGenSection.match(/^}\s*$/m);
const afterGenClassBody = classEndMatch
  ? afterGenSection.slice(0, classEndMatch.index)
  : afterGenSection;

const fullTemplateSection = templateSection + '\n' + afterGenClassBody;

const templateMethods = new Set();

// Regex: match method declarations at 2-space indent (class body level).
// Patterns:   async methodName(   |   methodName(   |   get propName()   |   methodName<T>(
const methodDeclRe = /^ {2}(?:async\s+)?(?:get\s+)?(\w+)\s*[<(]/gm;
let tm;
while ((tm = methodDeclRe.exec(fullTemplateSection)) !== null) {
  const name = tm[1];
  const lineStart = fullTemplateSection.lastIndexOf('\n', tm.index) + 1;
  const line = fullTemplateSection.slice(lineStart, tm.index + tm[0].length);
  // Skip private/protected/static
  if (/\bprivate\b|\bprotected\b|\bstatic\b/.test(line)) continue;
  templateMethods.add(name);
}

// Remove infrastructure/lifecycle/internal methods that don't need examples
const EXCLUDED = new Set([
  'constructor',
  '_invokeWithRetry',
  '_getSupportLogger',
  '_isVoidResponse',
  '_loadSchemas',
  '_getOrCreateThreadPool',
  '_evaluateResponse',
  // Internal accessors & diagnostics (not user-facing API)
  'logger',
  'getErrorMode',
  'emitSupportLogPreamble',
  'onAuthHeaders',
]);

for (const excl of EXCLUDED) {
  templateMethods.delete(excl);
}

// All public methods = generated + template
const allMethods = new Set([...generatedMethods, ...templateMethods]);

// ── Step 3: Collect all example regions from examples/ ──────────────────────

const REGION_START = /^\s*\/\/#region\s+(.+?)\s*$/;
const REGION_END = /^\s*\/\/#endregion(?:\s+(.+?))?\s*$/;

function extractRegions(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regions = new Set();
  const stack = [];

  for (const line of content.split(/\r?\n/)) {
    const startMatch = line.match(REGION_START);
    if (startMatch) {
      stack.push(startMatch[1].trim());
      continue;
    }

    const endMatch = line.match(REGION_END);
    if (!endMatch) {
      continue;
    }

    if (stack.length === 0) {
      continue;
    }

    const openRegion = stack.pop();
    const endRegion = endMatch[1]?.trim();

    if (!endRegion || endRegion === openRegion) {
      regions.add(openRegion);
    }
  }
  return regions;
}

const allRegions = new Set();
const exampleFiles = fs.readdirSync(examplesDir).filter((f) => f.endsWith('.ts'));
for (const file of exampleFiles) {
  for (const region of extractRegions(path.join(examplesDir, file))) {
    allRegions.add(region);
  }
}

// ── Step 4: Build method → region mapping ───────────────────────────────────

// Convention: region name is PascalCase of the method name.
function toPascalCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Also check operation-map.json for multi-region spec methods
const operationMapPath = path.join(examplesDir, 'operation-map.json');
const operationMap = fs.existsSync(operationMapPath)
  ? JSON.parse(fs.readFileSync(operationMapPath, 'utf8'))
  : {};

const methodsWithExamples = new Set();

for (const method of allMethods) {
  const pascal = toPascalCase(method);
  if (allRegions.has(pascal)) {
    methodsWithExamples.add(method);
    continue;
  }
  if (operationMap[method]) {
    methodsWithExamples.add(method);
  }
}

// ── Step 5: Report ──────────────────────────────────────────────────────────

const missingExamples = [];
for (const method of [...allMethods].sort()) {
  if (!methodsWithExamples.has(method)) {
    missingExamples.push(method);
  }
}

console.log(`Generated methods:             ${generatedMethods.size}`);
console.log(`Template methods:              ${templateMethods.size}`);
console.log(`Total public methods:          ${allMethods.size}`);
console.log(`Methods with example regions:  ${methodsWithExamples.size}`);

let exitCode = 0;

if (missingExamples.length > 0) {
  console.error(`\n✗ ${missingExamples.length} public method(s) missing example regions:`);
  for (const m of missingExamples) {
    console.error(`  - ${m} (expected region: ${toPascalCase(m)})`);
  }
  console.error(`\nTo fix: add example regions in examples/*.ts for each missing method.`);
  exitCode = 1;
}

if (exitCode === 0) {
  console.log('\n✓ All public methods have example regions.');
}

process.exit(exitCode);
