import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function sha256(file: string): string {
  const data = fs.readFileSync(file);
  return 'sha256:' + crypto.createHash('sha256').update(data).digest('hex');
}

const specPath = path.resolve('rest-api.source.yaml');
const specHash = fs.existsSync(specPath) ? sha256(specPath) : 'absent';
const brandingMeta = path.resolve('branding/branding-metadata.json');
const brandingHash = fs.existsSync(brandingMeta) ? sha256(brandingMeta) : 'absent';

const generatedAt = process.env.GITHUB_EVENT_HEAD_COMMIT_TIMESTAMP;
if (generatedAt === undefined) {
  throw new Error('No GITHUB_EVENT_HEAD_COMMIT_TIMESTAMP value in the environment');
}
const info = {
  // Use deterministic timestamp from git commit to avoid drift across parallel matrix jobs
  generatedAt,
  commit: process.env.GITHUB_SHA || 'local',
  workflowRun: process.env.GITHUB_RUN_ID || 'local',
  node: process.version,
  specHash,
  brandingHash,
  generator: '@hey-api/openapi-ts',
};

fs.writeFileSync('BUILDINFO.json', JSON.stringify(info, null, 2) + '\n');
console.log('[write-buildinfo] wrote BUILDINFO.json');
