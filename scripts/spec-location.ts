// Centralized spec location configuration used by fetch + generation scripts.
// Keeping this in one place prevents drift across scripts.

import path from 'node:path';

export const UPSTREAM_REPO_URL = 'https://github.com/camunda/camunda.git';
export const UPSTREAM_BRANCH = 'main';

// Multi-file OpenAPI spec directory (relative to repo root)
export const UPSTREAM_SPEC_DIR = 'zeebe/gateway-protocol/src/main/proto/v2';
export const UPSTREAM_SPEC_ENTRY_FILE = 'rest-api.yaml';

// Where we materialize the upstream spec inside this repo.
// We preserve the upstream relative directory structure to keep any ../ refs working.
export const LOCAL_UPSTREAM_ROOT_DIR = path.resolve(
  process.cwd(),
  'external-spec',
  'upstream',
  UPSTREAM_SPEC_DIR
);

export const LOCAL_SPEC_ENTRY_PATH = path.resolve(
  LOCAL_UPSTREAM_ROOT_DIR,
  UPSTREAM_SPEC_ENTRY_FILE
);

// Single-file bundle of the upstream spec, generated locally before running openapi-ts.
// This avoids generators having to resolve multi-file $refs themselves.
export const LOCAL_BUNDLED_SPEC_PATH = path.resolve(
  process.cwd(),
  'external-spec',
  'bundled',
  'rest-api.bundle.json'
);
