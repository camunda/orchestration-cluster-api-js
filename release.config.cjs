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

const branch = currentBranchName();
const stableMinor = stableMinorFromBranch(branch);
function maintenanceBranchConfig(branchName, minor) {
  return {
    name: branchName,
    range: `${minor}.x`,
    // Publish maintenance line under a dedicated dist-tag (e.g. 8.8)
    channel: minor,
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
  // - main: alpha prereleases for the next minor (npm dist-tag: alpha)
  // - latest: current stable stream (npm dist-tag: latest)
  // - stable/<major>.<minor>: maintenance stream for that minor (npm dist-tag: <major>.<minor>)
  //
  // Promotion flow:
  // - while 8.8 is current stable: keep `latest` fast-forwarded to stable/8.8
  // - when 8.9 drops: create stable/8.9, then fast-forward `latest` to stable/8.9
  branches: dedupeBranches([
    { name: 'main', prerelease: 'alpha', channel: 'alpha' },
    'latest',
    ...(stableMinor ? [maintenanceBranchConfig(branch, stableMinor)] : []),
  ]),
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'src/runtime/version.ts', 'src/gen/**'],
        // Keep commit message compact; full notes are in CHANGELOG.md and GitHub release.
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  ],
};
