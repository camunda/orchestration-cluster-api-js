import fs from 'fs';
import path from 'path';

// Validates that every exported SDK operation has a corresponding test scaffold.
// Exit code 1 if any are missing (excluding ignored list in manifest.json).

const ROOT = process.cwd();
const SDK_FILE = path.join(ROOT, 'src/gen/sdk.gen.ts');
const TEST_DIR = path.join(ROOT, 'tests-integration', 'methods');
const MANIFEST = path.join(TEST_DIR, 'manifest.json');

if (!fs.existsSync(SDK_FILE)) {
  console.error('[validate-test-scaffolds] sdk.gen.ts not found');
  process.exit(1);
}
if (!fs.existsSync(TEST_DIR)) {
  console.error('[validate-test-scaffolds] test directory missing');
  process.exit(1);
}

const sdkSource = fs.readFileSync(SDK_FILE, 'utf8');
const opRegex = /^export const (\w+)\s*=\s*/gm;
const operations: string[] = [];
let m: RegExpExecArray | null;
while ((m = opRegex.exec(sdkSource)) !== null) operations.push(m[1]);

let ignore: string[] = [];
if (fs.existsSync(MANIFEST)) {
  try {
    const data = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    if (Array.isArray(data.ignored)) ignore = data.ignored;
  } catch {
    /* ignore */
  }
}

const tests = fs.readdirSync(TEST_DIR).filter((f) => f.endsWith('.test.ts'));
const testSet = new Set(tests);
const missing = operations.filter(
  (op) => ignore.indexOf(op) === -1 && !testSet.has(`${op}.test.ts`)
);

if (missing.length) {
  console.error(
    '[validate-test-scaffolds] Missing test scaffolds for operations:\n' +
      missing.map((o) => '  - ' + o).join('\n')
  );
  console.error('Run: npm run scaffold:methods');
  process.exit(1);
}

console.log('[validate-test-scaffolds] All operations have corresponding test scaffolds.');
