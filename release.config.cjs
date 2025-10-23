module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        // Keep commit message compact; full notes are in CHANGELOG.md and GitHub release.
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist', label: 'dist directory (unpacked)' },
          { path: 'BUILDINFO.json', label: 'Build info' },
          { path: 'branding/branding-metadata.json', label: 'Branding metadata' },
          { path: 'spec-snapshots', label: 'Spec snapshots' },
        ],
      },
    ],
  ],
};
