## Release workflows & procedures

This repo publishes to npm using `semantic-release` plus GitHub Actions.

### Branch model (what publishes where)

The publishing behavior is defined in `release.config.cjs`.

| Branch                                       | What it is                                    | npm dist-tag / channel                       |
| -------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| `main`                                       | next-minor development stream                 | `alpha` (pre-releases)                       |
| `latest`                                     | optional stable stream branch                 | `latest`                                     |
| `stable/<major>.<minor>` (e.g. `stable/8.8`) | maintenance stream for a specific stable line | `stable-<major>.<minor>` (e.g. `stable-8.8`) |

The currently promoted stable line is configured via the GitHub repo variable `CAMUNDA_SDK_CURRENT_STABLE_MINOR` (e.g. `8.8`).

- Maintenance releases from `stable/<major>.<minor>` publish to the matching dist-tag (e.g. `8.8`).
- Maintenance releases from `stable/<major>.<minor>` publish to the matching dist-tag (e.g. `stable-8.8`).
- If that stable branch matches `CAMUNDA_SDK_CURRENT_STABLE_MINOR`, the workflow also promotes the same version to npm dist-tag `latest`.

### Workflows (what runs)

| Workflow file                                                         | Triggers            | Purpose                                                                                       |
| --------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| `.github/workflows/orchestration-cluster-api-release.yml`             | push to `main`      | validate, regenerate (if needed), publish alpha from `main`, deploy dev docs from `main` only |
| `.github/workflows/orchestration-cluster-api-release-maintenance.yml` | push to `stable/**` | validate, regenerate (if needed), publish maintenance to the matching dist-tag, no docs       |

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
1. This branch is optional and does not auto-publish.
1. If you keep it, you can still run `.github/workflows/orchestration-cluster-api-release.yml` manually (workflow_dispatch) on `latest` to publish a stable stream release.

**Maintenance releases (from `stable/<major>.<minor>`)**

1. Cherry-pick fixes into the relevant `stable/<major>.<minor>` branch.
2. Push triggers `.github/workflows/orchestration-cluster-api-release-maintenance.yml`.
3. semantic-release publishes to the dist-tag matching the branch (e.g. `stable-8.8`).

### Versioning rules (mutated semver)

This repo uses Conventional Commits for readability, but the release type mapping is customized:

- `fix:` / `feat:` / `perf:` / `revert:` => patch bump
- `server:` => minor bump (reserved for Camunda server minor line bumps, e.g. `8.8` → `8.9`)
- `server-major:` => major bump (reserved for Camunda server major line bumps, e.g. `8.x` → `9.0`)

This is configured in `release.config.cjs` via `@semantic-release/commit-analyzer` `releaseRules`.

### Promotion procedure (switch current stable line)

When a new stable line is ready (e.g. moving from `stable/8.8` to `stable/8.9`):

1. Create the new stable branch from the desired commit:

   ```sh
   git checkout main
   git pull
   git checkout -b stable/8.9
   git push -u origin stable/8.9
   ```

2. Update the GitHub repo variable `CAMUNDA_SDK_CURRENT_STABLE_MINOR` to `8.9`.

After promotion:

- Releases from `stable/8.9` will also promote npm dist-tag `latest`.
- Releases from `stable/8.8` will stop promoting npm dist-tag `latest`.

#### Automatic `latest` dist-tag promotion (how it behaves day-to-day)

- When you are staying on the same stable line (e.g. continuing to ship `stable/8.8`), you do **not** need to merge to `latest` on every fix. As long as `CAMUNDA_SDK_CURRENT_STABLE_MINOR=8.8`, releases from `stable/8.8` will keep promoting npm dist-tag `latest`.
- When you are changing the current stable line (e.g. `stable/8.8` → `stable/8.9`), you update `CAMUNDA_SDK_CURRENT_STABLE_MINOR` once. After that:
  - releases from the new line promote npm dist-tag `latest`
  - releases from the old line stop promoting npm dist-tag `latest`
- Dev docs deployment (GitHub Pages) currently only runs from pushes to the `main` git branch via `.github/workflows/orchestration-cluster-api-release.yml`.
- Stable documentation is handled separately (out of scope for this workflow).

### One-time bootstrap: switch to 8.x versioning

The repo previously published `1.x` versions. semantic-release cannot automatically jump from `1.2.3` to `8.8.0` (it would normally go to `2.0.0`).

To switch to server-line versioning, do a one-time bootstrap publish on each stream:

1. Create (or confirm) the stable branch:

```sh
git checkout -b stable/8.8
git push -u origin stable/8.8
```

2. Set `CAMUNDA_SDK_CURRENT_STABLE_MINOR=8.8` in GitHub repo variables.

3. Bootstrap stable `8.8.0` on `stable/8.8` (one-time manual publish):

```sh
git checkout stable/8.8
npm version 8.8.0 --no-git-tag-version
npm run build
git commit -am "chore(release): 8.8.0 (bootstrap)"
git tag v8.8.0
git push --follow-tags

# Publish (requires npm auth)
npm publish --tag stable-8.8
npm dist-tag add @camunda8/orchestration-cluster-api@8.8.0 latest
```

4. Bootstrap alpha `8.9.0-alpha.1` on `main` (one-time manual publish):

```sh
git checkout main
npm version 8.9.0-alpha.1 --no-git-tag-version
npm run build
git commit -am "chore(release): 8.9.0-alpha.1 (bootstrap)"
git tag v8.9.0-alpha.1
git push --follow-tags

# Publish (requires npm auth)
npm publish --tag alpha
```

After that, semantic-release will continue within each line (e.g. `8.8.1`, `8.8.2`, `8.9.0-alpha.2`, ...).

#### Important: semantic-release channel notes (required for bootstraps)

This repo uses semantic-release "channels" (e.g. `alpha`, `stable-8.8`) and semantic-release tracks channel membership via git notes refs named `refs/notes/semantic-release-v<version>`.

If you publish a bootstrap version manually (tag + `npm publish`) without creating the matching notes ref, semantic-release will usually ignore that tag when computing the next version for that channel and can "fall back" to the last semantic-release-managed version (historically the `1.x` line).

To make a manual bootstrap tag visible to semantic-release, add and push the notes ref for that version.

Example (alpha bootstrap on `main`):

```sh
git notes --ref=refs/notes/semantic-release-v8.9.0-alpha.1 add \
  -m '{"channels":["alpha"]}' \
  $(git rev-list -n 1 v8.9.0-alpha.1)

git push origin refs/notes/semantic-release-v8.9.0-alpha.1
```

Example (maintenance bootstrap on `stable/8.8`):

```sh
git notes --ref=refs/notes/semantic-release-v8.8.0 add \
  -m '{"channels":["stable-8.8"]}' \
  $(git rev-list -n 1 v8.8.0)

git push origin refs/notes/semantic-release-v8.8.0
```

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
find external-spec/upstream/zeebe/gateway-protocol/src/main/proto/v2 -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum
# Optional: semantic-release dry run to inspect next version
npx semantic-release --dry-run --no-ci
```
