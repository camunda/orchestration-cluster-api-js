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
| 8.11           | 11        | `main` (alpha) |

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

To promote a new stable line when a new Camunda server minor is released (e.g. server 8.11, SDK 11), follow these steps **in order**. Each one depends on the release state the previous one creates.

1. **Tag the cut point and create the stable branch.** Put a temporary lightweight `v11.0.0` tag on the current `main` tip and create `stable/11` at the same commit:

```sh
git fetch origin
X=$(git rev-parse origin/main)
git tag v11.0.0 "$X" && git push origin v11.0.0
git push origin "$X:refs/heads/stable/11"
```

2. **Update the GitHub repo variable** `CAMUNDA_SDK_CURRENT_STABLE_MAJOR` to `11`. Do this only after `stable/11` exists: with the variable set and the branch missing, every `main` release run fails with `ERELEASEBRANCHES`.

3. **Move `main` to the next major.** Merge a PR into `main` (rebase merge, label `breaking-change-approved`) whose commit carries a footer:

```
BREAKING CHANGE: SDK major version bumped from 11 to 12
```

CI publishes `12.0.0-alpha.1`. A prerelease branch computes its major from the last release reachable from it; the temporary `v11.0.0` tag is what makes this `12` rather than another `11.0.0-alpha.*`.

4. **Delete the temporary tag** once `12.0.0-alpha.1` is published:

```sh
git push origin :refs/tags/v11.0.0 && git tag -d v11.0.0
```

5. **Pin the spec and release the stable line.** On `stable/11`, point the `bundle:spec` default in `package.json` at the new server branch (`${SPEC_REF:-stable/8.11}`), so the first `11.x` artifact is generated from the 8.11 API, and commit that with a breaking-change footer:

```sh
git checkout -b stable/11 origin/stable/11
# package.json: "bundle:spec": "camunda-schema-bundler --ref ${SPEC_REF:-stable/8.11} ..."
git commit -am "feat: release SDK 11 for Camunda server 8.11" \
  -m "BREAKING CHANGE: SDK major version bumped from 10 to 11 to track Camunda server 8.11"
git push origin stable/11
```

If the default already points at `stable/8.11`, use `git commit --allow-empty` instead. CI publishes `11.0.0` to dist-tag `latest`. This only works after step 3: the current stable branch can only release below `main`'s first release that is not on it, so until `main` has `12.0.0-alpha.1` there is no room for `11.0.0` (semantic-release reports `EINVALIDNEXTVERSION`).

6. **Update npm dist-tags.** Move the previous stable line to its maintenance dist-tag:

```sh
npm dist-tag add @camunda8/orchestration-cluster-api@<last-10.x-version> 10-stable
```

7. **Add the new stable branch to Renovate** in [.github/renovate.json](.github/renovate.json): append it to `baseBranchPatterns` and mirror the stable-branch `packageRules` entries (patch-only updates; GitHub Actions disabled) for it.

After promotion:

- Releases from `stable/11` are the "current stable" and publish to npm dist-tag `latest`.
- Releases from older stable branches (e.g. `stable/10`) publish to `10-stable`.
- Subsequent commits on `main` produce `12.0.0-alpha.*` prereleases.

### Versioning rules (standard semver)

This repo uses standard Conventional Commits with standard semver:

- `fix:` / `perf:` / `revert:` → patch bump
- `feat:` → minor bump
- `BREAKING CHANGE` / `!` suffix → major bump
- `chore:` / `docs:` / `ci:` → no release

This is the default `@semantic-release/commit-analyzer` behavior with no custom `releaseRules`.

### Troubleshooting

**`ERELEASEBRANCHES` (empty branches array)**

semantic-release classifies branches into three types based on properties:

| Property      | Branch type |
| ------------- | ----------- |
| `range`       | maintenance |
| `prerelease`  | pre-release |
| neither       | release     |

At least 1 release branch (no `range`, no `prerelease`) is required. If all configured branches are maintenance or pre-release, you get `ERELEASEBRANCHES`.

The config in `release.config.cjs` handles this by making `main` a plain release branch when running on stable/* (satisfying the constraint), and vice versa. See the config comments for details.

Other common causes:
- The configured `stable/<CAMUNDA_SDK_CURRENT_STABLE_MAJOR>` branch does not exist on the remote.
- The repo variable `CAMUNDA_SDK_CURRENT_STABLE_MAJOR` is unset or malformed.

**Main publishes the wrong major (e.g. `10.0.0-alpha.54` instead of `11.0.0-alpha.1`)**

A pre-release branch advances its major from the last *release* reachable from it, and stable releases are tagged on `stable/<N>`, not on `main`. Another breaking commit on its own stays on the current alpha line. Fix:

1. Put the temporary `vN.0.0` tag on a `main` commit (promotion procedure step 1) and check it is reachable: `git merge-base --is-ancestor vN.0.0 origin/main`.
2. Merge a fresh commit with a `BREAKING CHANGE:` footer into `main`.

**`EINVALIDNEXTVERSION` (out of range)**

- On the current stable branch during a promotion: `main` has not yet published the next major's first alpha (promotion step 3), or the temporary `vN.0.0` tag still exists when releasing `N.0.0` (step 4).
- Usually means an unrelated release branch with a conflicting version line is included in the semantic-release branch model.
- Ensure only `main` (alpha) and the stable branches are part of the semantic-release `branches` configuration.
- Check that `semver.satisfies()` works as expected — pre-release versions (e.g. `10.0.0-alpha.1`) do **not** satisfy simple ranges like `10.x`.

### Local notes

You can run build/tests locally:

```sh
npm ci
npm run build
npm test
```

Running `semantic-release` locally is generally not useful without CI credentials.
