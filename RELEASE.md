## Release process

This repository publishes an npm package using `semantic-release` in GitHub Actions.

The process is intentionally simple:

- `main` publishes **alpha** prereleases for the next SDK major.
- `stable/<major>` publishes **stable** releases for that SDK major.
- A single stable line (configured via a GitHub repo variable) is treated as the "current stable" and publishes to npm dist-tag `latest`.

### Version mapping

The SDK major version tracks the Camunda server minor version:

| Server version | SDK major | Stable branch |
| -------------- | --------- | ------------- |
| 8.8            | 8         | `stable/8`    |
| 8.9            | 9         | `stable/9`    |
| 8.10           | 10        | `stable/10`   |

Within a stable line, standard semver applies: `fix:` → patch, `feat:` → minor, breaking → major.

### Branch model

The publishing behavior is defined in `release.config.cjs` and wired to the GitHub repo variable:

- `CAMUNDA_SDK_CURRENT_STABLE_MAJOR` (example: `9`)

Semantic-release uses that value to treat `stable/<major>` as the primary stable release branch.

| Branch                     | Type        | What it publishes    | npm dist-tag / channel             |
| -------------------------- | ----------- | -------------------- | ---------------------------------- |
| `main`                     | prerelease  | `<next>.0.0-alpha.*` | `alpha`                            |
| `stable/<major>` (current) | stable      | `<major>.x.y`        | `latest`                           |
| `stable/<major>` (older)   | maintenance | `<major>.x.y`        | `<major>-stable` (e.g. `8-stable`) |

Dist-tags are set at publish time via `npm publish --tag <tag>` (no separate `npm dist-tag` step in CI).

Each stable branch pins `SPEC_REF` to the corresponding upstream server branch (e.g. `stable/9` builds from `SPEC_REF=stable/8.9`).

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

### Authentication and required configuration

**Repository variable**

- Set `CAMUNDA_SDK_CURRENT_STABLE_MAJOR` to the currently supported SDK major (e.g. `9`).
- Ensure the corresponding branch (e.g. `stable/9`) exists on the remote repository.

**GitHub permissions**

The workflow needs:

- `contents: write` (push version bump commits and tags)
- `id-token: write` (OIDC exchange for npm publish)

**npm authentication**

Publishing uses npm OIDC/provenance in CI. No long-lived `NPM_TOKEN` is required.

### Day-to-day usage

**Alpha releases (from `main`)**

- Merge changes into `main`.
- A push to `main` triggers the release workflow.
- If a release is required, semantic-release publishes to dist-tag `alpha`.

**Stable releases (from `stable/<major>`)**

- Cherry-pick fixes into the target `stable/<major>` branch.
- A push to that branch triggers the release workflow.
- semantic-release publishes to dist-tag `latest` if that branch is the configured current stable line (`CAMUNDA_SDK_CURRENT_STABLE_MAJOR`).
- Otherwise it publishes to dist-tag `<major>-stable` (e.g. `8-stable`).

### Promotion procedure (new server minor release)

To promote a new stable line when a new Camunda server minor is released (e.g. server 8.9 → 8.10, SDK 9 → 10):

1. Create the new stable branch on the remote:

```sh
git checkout main
git pull
git checkout -b stable/10
git push -u origin stable/10
```

2. Update the `SPEC_REF` in the `build` script in `package.json` to point to the new server branch (e.g. `SPEC_REF=stable/8.10`).

3. Update the GitHub repo variable `CAMUNDA_SDK_CURRENT_STABLE_MAJOR` to `10`.

4. Add a Dependabot entry for the new stable branch in [.github/dependabot.yml](.github/dependabot.yml). Dependabot does not support wildcard branch patterns, so each `stable/*` branch must be listed explicitly.

After promotion:

- Releases from `stable/10` will be the "current stable" and will publish to npm dist-tag `latest`.
- Releases from older stable branches (e.g. `stable/9`) will publish to `9-stable`.

### Versioning rules (standard semver)

This repo uses standard Conventional Commits with standard semver:

- `fix:` / `perf:` / `revert:` → patch bump
- `feat:` → minor bump
- `BREAKING CHANGE` / `!` suffix → major bump
- `chore:` / `docs:` / `ci:` → no release

This is the default `@semantic-release/commit-analyzer` behavior with no custom `releaseRules`.

### Troubleshooting

**`ERELEASEBRANCHES`**

- Usually means the configured `stable/<CAMUNDA_SDK_CURRENT_STABLE_MAJOR>` branch does not exist on the remote, or the repo variable is unset/malformed.

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
