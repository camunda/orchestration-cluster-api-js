## Release & Branch Strategy

### Goals

1. Published npm artifact exactly matches the tip of `main`.
2. No publish if generated sources cannot be committed (fast‑forward guarantee).
3. Deterministic generation: spec snapshot retained; no volatile build metadata file.
4. Zero infinite CI loops (semantic-release commit includes `[skip ci]`).

### Pipeline Overview

1. `generate` job: build, generate SDK from latest spec, run unit + integration tests, snapshot spec, commit drift (if any) from canonical Node 22.x leg as `fix(gen): regenerate artifacts` to a staging branch `release/stage/<run-id>`.
2. `merge` job: fast-forward `main` to staging branch if drift occurred.
3. `publish` job (runs on `main`): semantic-release dry run → if release needed (e.g. `fix:` / `feat:` present) bump `package.json` (no tag yet), rebuild (embeds version), smoke test, commit `chore(release): vX.Y.Z`, run semantic-release (publishes, tags, updates CHANGELOG, commits assets), build & deploy docs.

No post‑publish mutation: tag points at the commit containing final generated artifacts + bumped version.

### Artifacts

| File                              | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `spec-snapshots/spec-<sha>.yaml`  | Immutable copy of spec used for that build |
| `branding/branding-metadata.json` | Branded key metadata for auditing changes  |

`BUILDINFO.json` was removed (previously stored commit/run/version hashes) to eliminate redundant drift sources. Reproducibility is ensured by deterministic regeneration + clean diff checks.

### Commit Conventions

| Pattern                          | Effect / Release impact                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `fix(gen): regenerate artifacts` | Triggers patch release if no higher type present             |
| `feat: ...`                      | Triggers minor (or major if breaking) per conventional rules |
| `fix: ...`                       | Triggers patch                                               |
| `chore(release): vX.Y.Z`         | Version bump commit created before semantic-release run      |
| `[skip ci]`                      | Added by semantic-release asset commit to prevent loop       |

Pure `ci:` / generic `chore:` (non `chore(release)`) commits do not release.

### Failure Modes & Guards

| Failure                          | Guard / Behavior                                           |
| -------------------------------- | ---------------------------------------------------------- |
| Generated diff not committed     | No staging commit → merge/publish proceed without drift    |
| Non-fast-forward (main advanced) | FF merge fails → workflow stops; next run regenerates      |
| Upstream spec changes mid-run    | Publish rebuild sees new spec diff → new run will capture  |
| Missing release-worthy commits   | Dry run sets `publish_needed=false`; publish steps skipped |

### Local Reproduction

```
npm ci
npm run build
sha256sum rest-api.source.yaml
# Optional: semantic-release dry run to inspect next version
npx semantic-release --dry-run --no-ci
```

### Adding New Release Assets

1. Add to `release.config.cjs` GitHub plugin assets array.
2. Ensure workflow creates the file before semantic-release step.

### When No Code Changes

If no spec drift and no conventional commits since last tag (feat/fix), dry run finds no release; version bump + publish steps are skipped.

### Known Limitations

- Upstream spec is implicitly “latest”; pin with a ref file if stricter reproducibility required.
- Fast-forward only; divergent commits landing between staging and merge abort the run.
- Manual bump logic plus semantic-release still produces an additional asset commit (CHANGELOG). Acceptable duplication.

### Future Enhancements

- Scheduled drift check detecting spec changes without corresponding conventional commits.
- Contract test verifying branded keys coverage in generated types.
- Optional rule set (releaseRules) to treat certain `refactor:` or scoped `chore:` commits as patch.

### Notable Changes

#### Added CAMUNDA_DEFAULT_TENANT_ID (minor)

Introduces a new configuration variable `CAMUNDA_DEFAULT_TENANT_ID` (default `<default>`). Hydration exposes this as `config.defaultTenantId`. Future helper methods may implicitly use this when an operation's tenantId is optional and not supplied. Explicit tenantId arguments always take precedence. No migration required; set to a custom tenant string if you operate primarily in a non-`<default>` tenant context.

#### Body-level tenantId default injection

Operations with an optional `tenantId` field in the request body will now have that field auto-populated from `config.defaultTenantId` if omitted. This occurs before request validation so strict/fanatical modes treat the injected value as part of the validated shape. Path parameters are unaffected (still explicit). Set `CAMUNDA_DEFAULT_TENANT_ID` to change the default.

Trace-level log event emitted when injection occurs:
`tenant.default.inject` with data `{ op, tenant }`. Enable via `CAMUNDA_SDK_LOG_LEVEL=trace` (or programmatic log level) to observe.
