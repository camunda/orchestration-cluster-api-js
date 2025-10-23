#!/usr/bin/env tsx
/**
 * Fetches upstream orchestration cluster API spec via a sparse/partial clone.
 * - Clones only the specification/rest-api.yaml file from camunda/camunda-orchestration-cluster-api.
 * - Places it under external-spec/rest-api.upstream.yaml
 * - Copies (or optionally transforms) it to rest-api.source.yaml which the rest of the pipeline will consume.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'https://github.com/camunda/camunda-orchestration-cluster-api.git';
const BRANCH = 'main';
const REL_PATH = '/specification/rest-api.yaml';

const baseDir = process.cwd();
const externalDir = join(baseDir, 'external-spec');
const workDir = join(externalDir, 'tmp-clone');
const upstreamFile = join(externalDir, 'rest-api.upstream.yaml');
const consumedFile = join(baseDir, 'rest-api.source.yaml');

// Deterministic / publish-time optimization:
// Allow skipping the upstream fetch during the publish integrity check to avoid
// introducing new external changes (spec drift) between generate & publish.
// If CAMUNDA_SDK_SKIP_FETCH_SPEC=1 and both files already exist, we reuse them.
if (process.env.CAMUNDA_SDK_SKIP_FETCH_SPEC === '1') {
  if (existsSync(upstreamFile) && existsSync(consumedFile)) {
    console.log(
      '[fetch-spec] Skip fetch (CAMUNDA_SDK_SKIP_FETCH_SPEC=1) – using existing spec files'
    );
    process.exit(0);
  } else {
    console.log('[fetch-spec] Skip flag set but spec files missing – performing normal fetch');
  }
}

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit', cwd: baseDir });
}

if (!existsSync(externalDir)) mkdirSync(externalDir, { recursive: true });

// Fresh clone each time to avoid accidental stale state (fast because sparse & depth=1)
if (existsSync(workDir)) {
  rmSync(workDir, { recursive: true, force: true });
}

run(`git clone --depth 1 --filter=blob:none --sparse ${REPO} ${workDir}`);
// Ensure sparse-checkout is in non-cone mode to allow selecting a single file path
run(`git -C ${workDir} sparse-checkout init --no-cone`);
run(`git -C ${workDir} sparse-checkout set ${REL_PATH}`);
run(`git -C ${workDir} checkout ${BRANCH}`);

const sourcePath = join(workDir, REL_PATH);
if (!existsSync(sourcePath)) {
  throw new Error(`Upstream spec file not found at ${sourcePath}`);
}

copyFileSync(sourcePath, upstreamFile);
copyFileSync(sourcePath, consumedFile);

// Cleanup working clone (keep only the captured upstream file for traceability)
rmSync(workDir, { recursive: true, force: true });

console.log(`[fetch-spec] Upstream spec fetched -> ${upstreamFile}`);
console.log(`[fetch-spec] Pipeline input spec -> ${consumedFile}`);
