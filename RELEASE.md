## Release process

This repository publishes an npm package using `semantic-release` in GitHub Actions.

The process is intentionally simple:

- `main` publishes **alpha** prereleases for the next stable minor.
- `stable/<major>.<minor>` publishes **stable** patch releases for that minor line.
- A single stable line (configured via a GitHub repo variable) is treated as the “current stable” and gets promoted to npm dist-tag `latest`.

### Branch model

The publishing behavior is defined in `release.config.cjs` and wired to the GitHub repo variable:

- `CAMUNDA_SDK_CURRENT_STABLE_MINOR` (example: `8.8`)

Semantic-release uses that value to treat `stable/<minor>` as the primary stable release branch.

| Branch                   | Type               | What it publishes   | npm dist-tag / channel                       |
| ------------------------ | ------------------ | ------------------- | -------------------------------------------- |
| `main`                   | prerelease         | `8.(n+1).0-alpha.*` | `alpha`                                      |
| `stable/<major>.<minor>` | stable/maintenance | `8.<minor>.x`       | `stable-<major>.<minor>` (e.g. `stable-8.8`) |

Additionally, the workflow promotes the configured current stable line to npm dist-tag `latest`.

### Workflow

Publishing is performed by a single workflow:

- [.github/workflows/release.yml](.github/workflows/release.yml)

It triggers on:

- pushes to `main`
- pushes to `stable/**`
- manual runs via `workflow_dispatch`

High level, the workflow does:

1. **Generate & Test**: install deps, build (including code generation), run unit + integration tests.
2. **Version determination**: run a semantic-release dry-run to compute `next_version`.
3. **Publish** (only when a release is needed): bump `package.json`, rebuild, run smoke tests, commit/push the bump, then run semantic-release publish.
4. **Promote dist-tag `latest`** (stable branches only): if `GITHUB_REF_NAME` matches `CAMUNDA_SDK_CURRENT_STABLE_MINOR`, add npm dist-tag `latest`.

### Authentication and required configuration

**Repository variable**

- Set `CAMUNDA_SDK_CURRENT_STABLE_MINOR` to the currently supported stable minor (e.g. `8.8`).
- Ensure the corresponding branch (e.g. `stable/8.8`) exists on the remote repository.

**GitHub permissions**

The workflow needs:

- `contents: write` (push version bump commits and tags)
- `id-token: write` (OIDC exchange for npm publish)

**npm authentication**

Publishing uses npm OIDC/provenance in CI. No long-lived `NPM_TOKEN` is required.

Note: npm currently does not support running `npm dist-tag add` directly via Trusted Publishing OIDC. The release workflow works around this by exchanging the GitHub OIDC token for a short-lived npm access token and using it only for dist-tag promotion.

### Day-to-day usage

**Alpha releases (from `main`)**

- Merge changes into `main`.
- A push to `main` triggers the release workflow.
- If a release is required, semantic-release publishes to dist-tag `alpha`.

**Stable patch releases (from `stable/<major>.<minor>`)**

- Cherry-pick fixes into the target `stable/<major>.<minor>` branch.
- A push to that branch triggers the release workflow.
- semantic-release publishes to dist-tag `stable-<major>.<minor>`.
- If that branch is the current stable line (`CAMUNDA_SDK_CURRENT_STABLE_MINOR`), the workflow also promotes the same version to npm dist-tag `latest`.

### Promotion procedure (switch current stable line)

To promote a new stable line (e.g. `8.8` → `8.9`):

1. Create the new stable branch on the remote:

```sh
git checkout main
git pull
git checkout -b stable/8.9
git push -u origin stable/8.9
```

2. Update the GitHub repo variable `CAMUNDA_SDK_CURRENT_STABLE_MINOR` to `8.9`.

After promotion:

- Releases from `stable/8.9` will be the “current stable” and will be promoted to npm dist-tag `latest`.
- Releases from older stable branches (e.g. `stable/8.8`) will continue to publish to their own `stable-8.8` dist-tag, but will not be promoted to `latest`.

### Versioning rules (mutated semver)

This repo uses Conventional Commits for readability, but the release type mapping is customized:

- `fix:` / `feat:` / `perf:` / `revert:` => patch bump
- `server:` => minor bump (reserved for Camunda server minor line bumps, e.g. `8.8` → `8.9`)
- `server-major:` => major bump (reserved for Camunda server major line bumps, e.g. `8.x` → `9.0`)

This is configured in `release.config.cjs` via `@semantic-release/commit-analyzer` `releaseRules`.

### Troubleshooting

**`ERELEASEBRANCHES`**

- Usually means the configured `stable/<CAMUNDA_SDK_CURRENT_STABLE_MINOR>` branch does not exist on the remote, or the repo variable is unset/malformed.

**`EINVALIDNEXTVERSION` (out of range)**

- Usually means an unrelated release branch with a conflicting version line is included in the semantic-release branch model.
- Ensure only `main` (alpha) and the stable branches are part of the semantic-release `branches` configuration.

### Local notes

You can run build/tests locally:

```sh
npm ci
npm run build
npm test
```

Running `semantic-release` locally is generally not useful without CI credentials.

```

```
