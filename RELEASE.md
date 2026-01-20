## Release workflows & procedures

This repo publishes to npm using `semantic-release` plus GitHub Actions.

### Branch model (what publishes where)

The publishing behavior is defined in `release.config.cjs`.

| Branch                                       | What it is                                    | npm dist-tag / channel         |
| -------------------------------------------- | --------------------------------------------- | ------------------------------ |
| `main`                                       | next-minor development stream                 | `alpha` (pre-releases)         |
| `latest`                                     | current stable stream                         | `latest`                       |
| `stable/<major>.<minor>` (e.g. `stable/8.8`) | maintenance stream for a specific stable line | `<major>.<minor>` (e.g. `8.8`) |

Promotion is done by fast-forwarding `latest` to a different `stable/<major>.<minor>` branch.

### Workflows (what runs)

| Workflow file                                                         | Triggers                   | Purpose                                                                                                                 |
| --------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/orchestration-cluster-api-release.yml`             | push to `main` or `latest` | validate, regenerate (if needed), publish (`alpha` from `main`, `latest` from `latest`), deploy docs from `latest` only |
| `.github/workflows/orchestration-cluster-api-release-maintenance.yml` | push to `stable/**`        | validate, regenerate (if needed), publish maintenance to the matching dist-tag, no docs                                 |

Both workflows have the same shape:

1. **Generate & Test**: `npm ci` → `npm run build` → unit + integration tests → snapshot spec → detect drift → commit drift from the canonical Node 22.x leg.
2. **Version & Publish**: dry-run semantic-release to compute next version → if needed, bump `package.json`, rebuild, smoke tests, push bump commit → run semantic-release to publish.

### Required secrets and permissions

- `NPM_TOKEN` (repo secret): required for `npm whoami` and publishing via `@semantic-release/npm`.
- `GITHUB_TOKEN` (provided by Actions): required for tags and pushing release commits.
- Workflow permissions must include `contents: write` and `id-token: write` (already configured).

### Day-to-day usage

**Alpha releases (from `main`)**

1. Merge conventional commits (e.g. `feat:`, `fix:`) into `main`.
2. Push/merge triggers `.github/workflows/orchestration-cluster-api-release.yml`.
3. If a release is required, semantic-release publishes a prerelease to the `alpha` dist-tag.

**Latest stable releases (from `latest`)**

1. Ensure `latest` points at the desired stable line (see “Promotion” below).
2. Merge conventional commits into `latest` (usually by merging/cherry-picking from the corresponding `stable/<major>.<minor>`).
3. Push/merge triggers `.github/workflows/orchestration-cluster-api-release.yml`.
4. If a release is required, semantic-release publishes to `latest` and deploys docs.

**Maintenance releases (from `stable/<major>.<minor>`)**

1. Cherry-pick fixes into the relevant `stable/<major>.<minor>` branch.
2. Push triggers `.github/workflows/orchestration-cluster-api-release-maintenance.yml`.
3. semantic-release publishes to the dist-tag matching the branch (e.g. `8.8`).

### Versioning rules (mutated semver)

This repo uses Conventional Commits for readability, but the release type mapping is customized:

- `fix:` / `feat:` / `perf:` / `revert:` => patch bump
- `server:` => minor bump (reserved for Camunda server minor line bumps, e.g. `8.8` → `8.9`)
- `server-major:` => major bump (reserved for Camunda server major line bumps, e.g. `8.x` → `9.0`)

This is configured in `release.config.cjs` via `@semantic-release/commit-analyzer` `releaseRules`.

### Promotion procedure (move `latest` forward)

When a new stable line is ready (e.g. moving from `stable/8.8` to `stable/8.9`):

1. Create the new stable branch from the desired commit:

   ```sh
   git checkout main
   git pull
   git checkout -b stable/8.9
   git push -u origin stable/8.9
   ```

2. Fast-forward `latest` to the new stable branch:

   ```sh
   git checkout stable/8.9
   git pull
   git branch -f latest
   git push -u origin latest
   ```

After promotion, pushes to `latest` publish to `latest`.

Additionally, maintenance releases from `stable/<major>.<minor>` will automatically update the npm dist-tag `latest` when (and only when) the `latest` git branch points into that stable line.

### Troubleshooting

**`ERELEASEBRANCHES` (“problematic branches is []”)**

This almost always means semantic-release can’t see the configured release branch(es) on the remote.

- Ensure `latest` exists on the remote:

  ```sh
  git checkout stable/8.8
   git branch -f latest
   git push -u origin latest
  ```

**Re-run without publishing**

Use `scripts/next-version.mjs` (the workflows do this) or run locally:

```sh
npm ci
node scripts/next-version.mjs
```

### Local reproduction

```sh
npm ci
npm run build
npx semantic-release --dry-run --no-ci
```
