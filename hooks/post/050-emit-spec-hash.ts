/**
 * Emit the specHash from spec-metadata.json as an exported constant
 * so it is included in the published npm package.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const METADATA_PATH = path.join(ROOT, 'external-spec/bundled/spec-metadata.json');
const OUTPUT_PATH = path.join(ROOT, 'src/gen/specHash.ts');

function main(): void {
  if (!fs.existsSync(METADATA_PATH)) {
    throw new Error(
      `[emit-spec-hash] spec-metadata.json not found at ${METADATA_PATH} — cannot emit SPEC_HASH`
    );
  }

  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
  const specHash: string = metadata.specHash ?? '';

  if (!/^sha256:[0-9a-f]{64}$/.test(specHash)) {
    throw new Error(
      `[emit-spec-hash] specHash is missing or invalid (expected sha256:<64 hex chars>): ${specHash}`
    );
  }

  const specHashLiteral = JSON.stringify(specHash);
  const content = `// Auto-generated — do not edit.\n// SHA-256 digest of the OpenAPI spec this SDK was generated from.\nexport const SPEC_HASH = ${specHashLiteral} as const;\n`;

  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
  console.log(`[emit-spec-hash] Wrote ${OUTPUT_PATH}`);
}

try {
  main();
} catch (err) {
  console.error('[emit-spec-hash] Failed');
  console.error(err);
  process.exitCode = 1;
}
