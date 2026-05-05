const base = require('@camunda8/sdk-infra/configs/release.config.base.cjs');

module.exports = {
  ...base,
  plugins: [
    ...base.plugins,
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
