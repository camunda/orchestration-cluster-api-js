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
  return `stable-${minor}`;
}

const branch = currentBranchName();
const stableMinor = stableMinorFromBranch(branch);

function maintenanceBranchConfig(branchName, minor) {
  return {
    name: branchName,
    range: `${minor}.x`,
    // Publish maintenance line under a dedicated dist-tag (e.g. stable-8.8)
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
  // - latest: optional stable stream branch (npm dist-tag: latest)
  // - stable/<major>.<minor>: maintenance stream for that minor (npm dist-tag: stable-<major>.<minor>)
  //
  // Stable-line selection:
  // - The currently promoted stable minor is configured via `CAMUNDA_SDK_CURRENT_STABLE_MINOR`.
  // - Workflows use that value to decide which stable/* line should also be npm dist-tagged as `latest`.
  branches: dedupeBranches([
    // Alpha prereleases are published from `main`.
    // Bootstrapping to a new major/minor (e.g. 8.9.0-alpha.1) is handled as a one-time procedure.
    {
      name: 'main',
      prerelease: 'alpha',
      channel: 'alpha',
    },

    // On stable/* branches, ensure the maintenance branch has higher precedence than the legacy
    // `latest` branch (which may still carry pre-8.x versions). This avoids semantic-release
    // constraining stable/* to an impossible upper bound like `<1.x`.
    ...(stableMinor ? [maintenanceBranchConfig(branch, stableMinor)] : []),

    // Optional stable stream branch.
    // Note: We intentionally do NOT constrain `latest` with a `range`, as that turns it into a
    // maintenance branch and can break semantic-release branch validation.
    'latest',
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
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/github',
      {
        // GitHub release assets must have unique names. Uploading folders directly (e.g. `src/gen/**`)
        // causes collisions (multiple `index.ts`, etc). The release workflow generates a single,
        // versioned tarball under `release-assets/` for upload.
        assets: ['release-assets/*.tgz'],
      },
    ],
  ],
};
