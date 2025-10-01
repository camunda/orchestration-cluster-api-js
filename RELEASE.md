## Release & Branch Strategy

### Goals
1. Published npm artifact exactly matches `main`.
2. No publish if generated sources cannot be committed.
3. Deterministic & auditable: spec snapshot + build metadata stored.
4. Zero infinite CI loops (use `[skip release]` on sync commit, `[skip ci]` on version bump commit).

### Pipeline Overview
1. `generate` job: build, generate SDK from latest spec, run tests, snapshot spec, commit changes (if any) to a temp branch `release/apply/<run-id>`.
2. `merge` job: fast-forward `main` to the temp branch (aborts if non-FF → next run will retry with fresh generation).
3. `publish` job: regenerates from merged `main`, asserts clean diff, writes `BUILDINFO.json`, runs semantic-release to publish & create GitHub Release with assets.

### Artifacts
| File | Purpose |
|------|---------|
| `spec-snapshots/spec-<sha>.yaml` | Immutable copy of spec used for that build |
| `branding/branding-metadata.json` | Branded key metadata for auditing changes |
| `BUILDINFO.json` | Commit, run id, spec & metadata hashes, node version |

### Commit Markers
| Marker | Effect |
|--------|--------|
| `[skip release]` | Prevents semantic-release triggering on sync commit content (conventional analyzer ignores if no relevant commit type) |
| `[skip ci]` | Added by semantic-release git plugin to avoid rerunning workflow on version bump commit |

### Failure Modes & Guards
| Failure | Guard |
|---------|-------|
| Generated diff not committed | Sync commit step; if push fails, no merge → no publish |
| Drift between generation & publish | Regenerate + `git diff --exit-code` before semantic-release |
| Non-fast-forward (main advanced) | FF merge fails → pipeline stops (next scheduled run retries) |
| Upstream spec changed mid-pipeline | Regeneration in publish step detects drift |

### Local Reproduction
```
npm ci
npm run build
sha256sum rest-api.source.yaml
node scripts/write-buildinfo.ts
```

### Adding New Release Assets
1. Add to `release.config.cjs` GitHub plugin assets array.
2. Ensure workflow creates the file before semantic-release step.

### When No Code Changes
If the spec hasn't changed and no relevant commits exist, `generate.changed == false`; merge job is skipped; publish still runs to allow versioning for other commit types (docs/chore fix) if present.

### Known Limitations
* Upstream spec is implicitly “latest” at run time; pin via a spec ref file + PR automation if stricter reproducibility desired.
* Fast-forward only: manual intervention needed if divergent commits land on main between detect & merge.

### Future Enhancements
* Add drift daily job to open an issue if spec changes but generation yields no semantic-release-worthy commits.
* Add a contract test to verify each branded key still appears in metadata and `types.gen.ts`.

### Notable Changes

#### Added CAMUNDA_DEFAULT_TENANT_ID (minor)
Introduces a new configuration variable `CAMUNDA_DEFAULT_TENANT_ID` (default `<default>`). Hydration exposes this as `config.defaultTenantId`. Future helper methods may implicitly use this when an operation's tenantId is optional and not supplied. Explicit tenantId arguments always take precedence. No migration required; set to a custom tenant string if you operate primarily in a non-`<default>` tenant context.
