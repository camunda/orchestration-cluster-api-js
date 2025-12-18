#!/usr/bin/env tsx
/**
 * Fetches upstream OpenAPI spec via a sparse/partial clone.
 *
 * New upstream (multi-file spec):
 * - Repo: camunda/camunda
 * - Spec directory: zeebe/gateway-protocol/src/main/proto/v2
 * - Entry file: rest-api.yaml
 *
 * We sparse-checkout the whole directory (not just a single file) so any local $ref
 * stays resolvable. The directory is copied into external-spec/upstream/... and then
 * used as the generator input.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  LOCAL_SPEC_ENTRY_PATH,
  LOCAL_UPSTREAM_ROOT_DIR,
  UPSTREAM_BRANCH,
  UPSTREAM_REPO_URL,
  UPSTREAM_SPEC_DIR,
  UPSTREAM_SPEC_ENTRY_FILE,
} from './spec-location';

const baseDir = process.cwd();
const externalDir = join(baseDir, 'external-spec');
const workDir = join(externalDir, 'tmp-clone');
const upstreamDir = LOCAL_UPSTREAM_ROOT_DIR;
const upstreamEntry = LOCAL_SPEC_ENTRY_PATH;

// Sparse checkout expects repo-root-relative paths.
const REL_DIR = '/' + UPSTREAM_SPEC_DIR;

// Deterministic / publish-time optimization:
// Allow skipping the upstream fetch during the publish integrity check to avoid
// introducing new external changes (spec drift) between generate & publish.
// If CAMUNDA_SDK_SKIP_FETCH_SPEC=1 and both files already exist, we reuse them.
if (process.env.CAMUNDA_SDK_SKIP_FETCH_SPEC === '1') {
  if (existsSync(upstreamEntry)) {
    console.log(
      '[fetch-spec] Skip fetch (CAMUNDA_SDK_SKIP_FETCH_SPEC=1) – using existing spec directory'
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

run(`git clone --depth 1 --filter=blob:none --sparse ${UPSTREAM_REPO_URL} ${workDir}`);
// Ensure sparse-checkout is in non-cone mode to allow selecting a single file path
run(`git -C ${workDir} sparse-checkout init --no-cone`);
run(`git -C ${workDir} sparse-checkout set ${REL_DIR}`);
run(`git -C ${workDir} checkout ${UPSTREAM_BRANCH}`);

const sourceDir = resolve(workDir, UPSTREAM_SPEC_DIR);
const sourceEntry = resolve(sourceDir, UPSTREAM_SPEC_ENTRY_FILE);
if (!existsSync(sourceEntry)) {
  throw new Error(`Upstream spec entry not found at ${sourceEntry}`);
}

// Replace existing upstream dir to avoid stale files.
if (existsSync(upstreamDir)) {
  rmSync(upstreamDir, { recursive: true, force: true });
}
mkdirSync(upstreamDir, { recursive: true });
cpSync(sourceDir, upstreamDir, { recursive: true });

// Cleanup working clone (keep only the captured upstream file for traceability)
rmSync(workDir, { recursive: true, force: true });

console.log(`[fetch-spec] Upstream spec directory fetched -> ${upstreamDir}`);
console.log(`[fetch-spec] Pipeline input spec entry -> ${upstreamEntry}`);
