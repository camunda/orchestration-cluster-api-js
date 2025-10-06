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
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist', label: 'dist directory (unpacked)' },
          { path: 'dist/**/*.js', label: 'Compiled JS files' },
          { path: 'dist/**/*.d.ts', label: 'TypeScript declarations' },
          { path: 'BUILDINFO.json', label: 'Build info' },
          { path: 'branding/branding-metadata.json', label: 'Branding metadata' },
          { path: 'spec-snapshots', label: 'Spec snapshots' },
        ],
      },
    ],
  ],
};
