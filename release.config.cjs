function currentBranchName() {
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    // Lazy require to avoid making this file ESM.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { execSync } = require('node:child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function stableMinorFromBranch(branch) {
  // stable/<major>.<minor> (e.g. stable/8.8)
  const m = /^stable\/(\d+\.\d+)$/.exec(branch);
  return m ? m[1] : null;
}

function stableDistTagForMinor(minor) {
  // npm dist-tags must NOT be a valid SemVer version or range.
  // Tags like "8.8" are considered a SemVer range by npm and are rejected.
  return `${minor}-stable`;
}

function envCurrentStableMinor() {
  // Expected format: <major>.<minor> (e.g. 8.8)
  const v = (process.env.CAMUNDA_SDK_CURRENT_STABLE_MINOR || '').trim();
  return /^\d+\.\d+$/.test(v) ? v : null;
}

const branch = currentBranchName();
const stableMinor = stableMinorFromBranch(branch);
const currentStableMinor = envCurrentStableMinor();

function maintenanceBranchConfig(branchName, minor) {
  return {
    name: branchName,
    range: `${minor}.x`,
    // Publish maintenance line under a dedicated dist-tag (e.g. 8.8-stable)
    channel: stableDistTagForMinor(minor),
  };
}

function dedupeBranches(branches) {
  const seen = new Set();
  const out = [];
  for (const b of branches) {
    const name = typeof b === 'string' ? b : b?.name;
    if (!name) continue;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(b);
  }
  return out;
}

module.exports = {
  // Branch model:
  // - main: alpha prereleases for the next stable line (npm dist-tag: alpha)
  // - stable/<major>.<minor> (current): stable releases (npm dist-tag: latest)
  // - stable/<major>.<minor> (other): maintenance stream for that minor (npm dist-tag: <major>.<minor>-stable)
  //
  // Stable-line selection:
  // - The currently promoted stable minor is configured via `CAMUNDA_SDK_CURRENT_STABLE_MINOR`.
  // - Publishing to npm dist-tag `latest` is done in a one-shot `npm publish --tag latest` (no separate `npm dist-tag` step).
  branches: dedupeBranches([
    // Alpha prereleases are published from `main`.
    // Bootstrapping to a new major/minor (e.g. 8.9.0-alpha.1) is handled as a one-time procedure.
    {
      name: 'main',
      prerelease: 'alpha',
      channel: 'alpha',
    },

    // The configured current stable line is the single semantic-release "release branch".
    // This must exist on the remote repository.
    ...(currentStableMinor
      ? [
          {
            name: `stable/${currentStableMinor}`,
            // Publish the current stable line directly to npm dist-tag `latest`.
            channel: 'latest',
          },
        ]
      : []),

    // Any other stable/* branch publishes as a maintenance line (range <minor>.x).
    // IMPORTANT: Do not treat the current stable line as maintenance as well.
    ...(stableMinor && stableMinor !== currentStableMinor
      ? [maintenanceBranchConfig(branch, stableMinor)]
      : []),
  ]),
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        // This repo uses a "mutated semver" policy:
        // - Patch: normal changes (including features)
        // - Minor: reserved for Camunda server minor line bumps (e.g. 8.8 -> 8.9)
        // - Major: reserved for Camunda server major line bumps (e.g. 8.x -> 9.x)
        //
        // Conventional commits still used for readability, but release type is controlled here.
        releaseRules: [
          // Default behavior in semantic-release would bump minor for `feat:`; override to patch.
          { type: 'feat', release: 'patch' },
          // Keep common patch-worthy types explicit.
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'revert', release: 'patch' },

          // Breaking changes should not automatically bump major/minor in this scheme.
          // Use explicit `server:` commits below for line bumps.
          { breaking: true, release: 'patch' },

          // Explicit server-line bumps:
          // - `server: ...` => minor bump (e.g. 8.8 -> 8.9)
          // - `server-major: ...` => major bump (e.g. 8.x -> 9.0)
          { type: 'server', release: 'minor' },
          { type: 'server-major', release: 'major' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        // GitHub release assets must have unique names. Uploading folders directly (e.g. `src/gen/**`)
        // causes collisions (multiple `index.ts`, etc). The release workflow generates a single,
        // versioned tarball under `release-assets/` for upload.
        assets: ['release-assets/*.tgz'],

        // Leave a trace on referenced issues/PRs when a release succeeds.
        // NOTE: automatic issue closing still depends on merges into the default branch.
        successComment:
          'Released in `${nextRelease.gitTag}` (npm: `@camunda8/orchestration-cluster-api@${nextRelease.version}`).',
      },
    ],
  ],
};
