function currentBranchName() {
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    // Lazy require to avoid making this file ESM.

    const { execSync } = require('node:child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function stableMajorFromBranch(branch) {
  // stable/<major> (e.g. stable/9)
  const m = /^stable\/(\d+)$/.exec(branch);
  return m ? m[1] : null;
}

function stableDistTagForMajor(major) {
  // npm dist-tags must NOT be a valid SemVer version or range.
  // "9" alone is a valid SemVer range, so append "-stable".
  return `${major}-stable`;
}

function envCurrentStableMajor() {
  // Expected format: integer (e.g. 9)
  const v = (process.env.CAMUNDA_SDK_CURRENT_STABLE_MAJOR || '').trim();
  return /^\d+$/.test(v) ? v : null;
}

const branch = currentBranchName();
const stableMajor = stableMajorFromBranch(branch);
const currentStableMajor = envCurrentStableMajor();
const isOnMain = branch === 'main';
const isOnCurrentStable = Boolean(stableMajor && stableMajor === currentStableMajor);

function maintenanceBranchConfig(branchName, major) {
  return {
    name: branchName,
    range: `${major}.x`,
    // Publish maintenance line under a dedicated dist-tag (e.g. 9-stable)
    channel: stableDistTagForMajor(major),
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
  // - main: alpha prereleases for the next SDK major (npm dist-tag: alpha)
  // - stable/<major> (current): stable releases (npm dist-tag: latest)
  // - stable/<major> (older): maintenance stream (npm dist-tag: <major>-stable)
  //
  // SDK major version tracks the Camunda server minor version:
  //   server 8.9 → SDK 9.x, server 8.10 → SDK 10.x
  //
  // Stable-line selection:
  // - The currently promoted stable major is configured via `CAMUNDA_SDK_CURRENT_STABLE_MAJOR`.
  // - Publishing to npm dist-tag `latest` is done in a one-shot `npm publish --tag latest` (no separate `npm dist-tag` step).
  branches: dedupeBranches([
    // semantic-release requires ≥1 "release branch" (no `range`, no `prerelease`).
    // Branch type classification (lib/definitions/branches.js):
    //   `range`      → maintenance
    //   `prerelease` → pre-release
    //   neither      → release
    //
    // The config is evaluated per-branch CI run, so each branch only needs
    // to make sense for its own run. We use the current branch to decide
    // which role each entry plays:
    //
    // On main:
    //   main        → prerelease (alpha)
    //   stable/N    → release branch (satisfies ≥1 constraint)
    //
    // On stable/N (current):
    //   stable/N    → maintenance with range N.x (constrains versions)
    //   main        → release branch (satisfies ≥1 constraint)
    //
    // On stable/N (older):
    //   stable/N    → maintenance with range N.x

    // main: prerelease when running on main, plain release branch otherwise.
    isOnMain ? { name: 'main', prerelease: 'alpha', channel: 'alpha' } : { name: 'main' },

    // Current stable line: constrained with range when running on it,
    // plain release branch when running from main.
    ...(currentStableMajor
      ? [
          {
            name: `stable/${currentStableMajor}`,
            ...(isOnCurrentStable ? { range: `${currentStableMajor}.x` } : {}),
            channel: 'latest',
          },
        ]
      : []),

    // Any other stable/* branch publishes as a maintenance line (range <major>.x).
    // IMPORTANT: Do not treat the current stable line as maintenance as well.
    ...(stableMajor && stableMajor !== currentStableMajor
      ? [maintenanceBranchConfig(branch, stableMajor)]
      : []),
  ]),
  plugins: [
    // Standard semver: fix → patch, feat → minor, breaking → major.
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
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
