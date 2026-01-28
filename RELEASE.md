## Release workflows & procedures

This repo publishes to npm using `semantic-release` plus GitHub Actions.

### Branch model (what publishes where)

The publishing behavior is defined in `release.config.cjs`.

| Branch                             | What it is                           | npm dist-tag / channel                       |
| ---------------------------------- | ------------------------------------ | -------------------------------------------- |
| `main`                             | next-minor development stream        | `alpha` (pre-releases)                       |
| `stable/<major>.<minor>` (current) | current stable stream                | `latest`                                     |
| `stable/<major>.<minor>` (other)   | maintenance stream for a stable line | `<major>.<minor>-stable` (e.g. `8.8-stable`) |

The currently promoted stable line is configured via the GitHub repo variable `CAMUNDA_SDK_CURRENT_STABLE_MINOR` (e.g. `8.8`).

- Releases from `main` publish prereleases to dist-tag `alpha`.
- Releases from `stable/<major>.<minor>` publish:
  - to dist-tag `latest` if that branch matches `CAMUNDA_SDK_CURRENT_STABLE_MINOR`
  - otherwise to dist-tag `<major>.<minor>-stable` (e.g. `8.8-stable`)

### Workflows (what runs)

| Workflow file                   | Triggers                   | Purpose                                                                                                                   |
| ------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/release.yml` | push to `main`/`stable/**` | validate, regenerate (if needed), publish (alpha from `main`; stable tags from `stable/**`); deploy docs from `main` only |

The workflow has the same shape:

1. **Generate & Test**: `npm ci` → `npm run build` → unit + integration tests → snapshot spec → detect drift → commit drift from the canonical Node 22.x leg.
2. **Version & Publish**: dry-run semantic-release to compute next version → if needed, bump `package.json`, rebuild, smoke tests, push bump commit → run semantic-release to publish.

### Required secrets and permissions

- No long-lived `NPM_TOKEN` is required. Publishing uses npm OIDC Trusted Publishing.
- `GITHUB_TOKEN` (provided by Actions): required for tags and pushing release commits.
- Workflow permissions must include `contents: write` and `id-token: write` (already configured).

Note: We do not run `npm dist-tag` in CI. Dist-tags are set in one-shot at publish time via `npm publish --tag <tag>`.

### Day-to-day usage

**Alpha releases (from `main`)**

1. Merge conventional commits (e.g. `feat:`, `fix:`) into `main`.
2. Push/merge triggers `.github/workflows/release.yml`.
3. If a release is required, semantic-release publishes a prerelease to the `alpha` dist-tag.

**Maintenance releases (from `stable/<major>.<minor>`)**

1. Cherry-pick fixes into the relevant `stable/<major>.<minor>` branch.
2. Push triggers `.github/workflows/release.yml`.
3. semantic-release publishes to `latest` if it’s the current stable line; otherwise to `<major>.<minor>-stable`.

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

- Releases from `stable/8.9` will publish to npm dist-tag `latest`.
- Releases from `stable/8.8` will publish to npm dist-tag `8.8-stable`.

#### Stable dist-tag behavior (day-to-day)

- When you are staying on the same stable line (e.g. continuing to ship `stable/8.8`), as long as `CAMUNDA_SDK_CURRENT_STABLE_MINOR=8.8`, releases from `stable/8.8` will keep publishing to npm dist-tag `latest`.
- When you are changing the current stable line (e.g. `stable/8.8` → `stable/8.9`), you update `CAMUNDA_SDK_CURRENT_STABLE_MINOR` once. After that:
  - releases from the new line publish to npm dist-tag `latest`
  - releases from the old line publish to `<major>.<minor>-stable`
- Dev docs deployment (GitHub Pages) currently only runs from pushes to the `main` git branch via `.github/workflows/release.yml`.
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
npm publish --tag latest
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

### Troubleshooting

**`ERELEASEBRANCHES` (“problematic branches is []”)**

This almost always means semantic-release can’t see the configured release branch(es) on the remote.

- Ensure the target release branch exists on the remote (e.g. `main` or `stable/<major>.<minor>`).
- Ensure `CAMUNDA_SDK_CURRENT_STABLE_MINOR` is set to a valid `<major>.<minor>` value (e.g. `8.8`) if you expect a stable line to publish to dist-tag `latest`.

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
