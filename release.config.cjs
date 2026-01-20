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

function safeExec(cmd) {
  try {
    // Lazy require to avoid making this file ESM.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { execSync } = require('node:child_process');
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function parseMajorMinor(minor) {
  const m = /^(\d+)\.(\d+)$/.exec(String(minor));
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]) };
}

function incMinor(majorMinor) {
  const parsed = parseMajorMinor(majorMinor);
  if (!parsed) return null;
  return `${parsed.major}.${parsed.minor + 1}`;
}

function stableMinorFromBranch(branch) {
  // stable/<major>.<minor> (e.g. stable/8.8)
  const m = /^stable\/(\d+\.\d+)$/.exec(branch);
  return m ? m[1] : null;
}

function stableMinorFromRef(refName) {
  // Try to infer which stable/<major>.<minor> line a ref belongs to by checking which
  // origin/stable/* branches contain it.
  //
  // This allows `latest` to be a pointer branch (same commit as a stable/* head) while
  // still enforcing stable-line version ranges.
  const stableRefsRaw = safeExec(
    "git for-each-ref --format='%(refname:short)' refs/remotes/origin/stable"
  );
  const stableRefs = stableRefsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stableRef of stableRefs) {
    // Is refName reachable from stableRef?
    const ok = safeExec(
      `git merge-base --is-ancestor ${refName} ${stableRef} && echo yes || echo no`
    );
    if (ok === 'yes') {
      const m = /^origin\/stable\/(\d+\.\d+)$/.exec(stableRef);
      if (m) return m[1];
    }
  }

  return null;
}

const branch = currentBranchName();
const stableMinor = stableMinorFromBranch(branch);

// Determine the currently promoted stable line from the `latest` pointer branch.
// - On stable/* branches we already know the minor from the branch name.
// - On the `latest` branch, infer from HEAD.
// - On `main`, infer from origin/latest (requires CI to fetch that ref).
const promotedStableMinor =
  stableMinor ||
  (branch === 'latest' ? stableMinorFromRef('HEAD') : stableMinorFromRef('origin/latest'));
const nextStableMinor = promotedStableMinor ? incMinor(promotedStableMinor) : null;
function maintenanceBranchConfig(branchName, minor) {
  return {
    name: branchName,
    range: `${minor}.x`,
    // Publish maintenance line under a dedicated dist-tag (e.g. 8.8)
    channel: minor,
  };
}

function stableStreamBranchConfig(branchName, minor) {
  return {
    name: branchName,
    range: `${minor}.x`,
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
  // - latest: current stable stream (npm dist-tag: latest)
  // - stable/<major>.<minor>: maintenance stream for that minor (npm dist-tag: <major>.<minor>)
  //
  // Promotion flow:
  // - while 8.8 is current stable: keep `latest` fast-forwarded to stable/8.8
  // - when 8.9 drops: create stable/8.9, then fast-forward `latest` to stable/8.9
  branches: dedupeBranches([
    // Ensure `main` always publishes alpha prereleases in the *next* stable line.
    // Example: if `latest` points at the 8.8 line, `main` releases in 8.9.x as 8.9.0-alpha.*.
    {
      name: 'main',
      prerelease: 'alpha',
      channel: 'alpha',
      ...(nextStableMinor ? { range: `${nextStableMinor}.x` } : {}),
    },

    // `latest` is a pointer branch; constrain it to the currently promoted stable line.
    ...(promotedStableMinor
      ? [stableStreamBranchConfig('latest', promotedStableMinor)]
      : ['latest']),

    ...(stableMinor ? [maintenanceBranchConfig(branch, stableMinor)] : []),
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
