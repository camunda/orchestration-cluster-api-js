<h1 align="center">Maintainer Guide – Orchestration Cluster TypeScript SDK</h1>

Green‑field documentation of the current (post‑refactor) architecture. End‑user consumption docs live in `README.md`.

---

## 1. High‑Level Flow

`npm run build` orchestrates a linear, deterministic pipeline:

1. `clean` – purge `dist/`, `src/gen/`, `src/facade/`.
2. `fetch:spec` – sparse clone upstream repo (directory: `zeebe/gateway-protocol/src/main/proto/v2`) → materialize as:
   - `external-spec/upstream/zeebe/gateway-protocol/src/main/proto/v2/*` (kept for traceability)
   - Entry file: `external-spec/upstream/zeebe/gateway-protocol/src/main/proto/v2/rest-api.yaml` (consumed by downstream steps)
3. `preprocess` – analyze semantic key schemas (`x-semantic-type` | `x-semantic-key`) → emit branding metadata.
4. `generate:sdk` – invoke `@hey-api/openapi-ts` (with branding plugin) → produce raw generated trio:
   - `src/gen/types.gen.ts`
   - `src/gen/zod.gen.ts`
   - `src/gen/sdk.gen.ts`
5. `postprocess-deployment-schema` – targeted structural adjustments (deployment specific).
6. `generate:class` – synthesize `CamundaClient.ts` from template markers + operation metadata.
7. `generate:facade` – build higher level facade helpers.
8. `gate` – invariant & drift checks (fail fast if generation anomalies detected).
9. Unit tests – `vitest` (excluding integration) to assert surface + branding contract.
10. `docs:config` (during build) – generate configuration docs.
11. `tsup` – bundle ESM + CJS + type declarations into `dist/`.

Each step is idempotent given identical upstream spec + environment.

---

## 2. Spec Acquisition & Reproducibility

- Upstream repository: `camunda/camunda` (branch: `main`).
- Sparse checkout uses non‑cone mode + single file path.
- Result is ephemeral (ignored by git). We intentionally keep an immutable copy (the checked-out spec directory) per run for diffing.

Enhancements (optional, not yet implemented):

- Pin a specific commit/tag via `ORCH_SPEC_REF` env var.
- Store SHA256 next to the fetched upstream spec directory for provenance.
- Offline fallback: reuse last downloaded spec if network unavailable.

---

## 3. Semantic Key Branding

Signal: presence of `x-semantic-type` (equivalent to implicit `x-semantic-key: true`). Explicit `x-semantic-key` also accepted.

Flow:

1. `preprocess-brands.ts` parses spec, collecting schemas with the marker.
2. Produces `branding-metadata.json` (keys, unions, arrays, constraints, stable IDs).
3. Branding plugin (in the openapi-ts config) injects:
   - Generic `CamundaKey<T>` alias (if absent)
   - Branded key type aliases (`export type ProcessInstanceKey = CamundaKey<'ProcessInstanceKey'>`)
   - Namespace helpers / lifters if configured.

No structural inheritance (legacy `CamundaKey` base) remains; detection is purely semantic.

---

## 4. Generated Artifacts

| File               | Purpose                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| `types.gen.ts`     | Base TypeScript types from OpenAPI schemas/operations (post branding injection). |
| `zod.gen.ts`       | Programmatic validators & schema objects (shared with class generator).          |
| `sdk.gen.ts`       | Raw operation functions (thin HTTP call layer).                                  |
| `CamundaClient.ts` | Aggregated class with ergonomic method surfaces + typed inputs.                  |
| `facade/*`         | Higher-level convenience wrappers (strategy / composition).                      |

Generated files are entirely disposable; never edit them manually—change inputs or scripts instead.

---

## 5. Class Generation (`generate-class-methods.ts`)

Reads:

- `external-spec/upstream/zeebe/gateway-protocol/src/main/proto/v2/rest-api.yaml`
- `sdk.gen.ts` (harvest JSDoc & argument shapes)
- `zod.gen.ts` (presence test for response schemas & void markers)

Markers in template:

```
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===
// === AUTO-GENERATED CAMUNDA METHODS START ===
// === AUTO-GENERATED CAMUNDA METHODS END ===
```

Between these, the generator inserts:

- Operation input helper types (body/path/query extraction).
- Consistency management helpers for eventually consistent operations.
- Method implementations binding to `Sdk.<operationId>`.

Special cases (example): `createDeployment` enforces `File[]` for `resources`.

---

## 6. Facade Generation

`generate-facade.ts` builds aggregation helpers or compositional APIs on top of `CamundaClient`. Keep logic stateless and derivable. Add new surfaces here rather than mutating generated client code.

---

## 7. Gate Validation

`postprocess-gate-validation.ts` executes structural sanity checks (e.g., required branding present, no empty operation sets). Placement near the end ensures failures surface before bundling.

---

## 8. Validation Modes

Environment variable (still supported): `CAMUNDA_SDK_VALIDATION`.
Grammar:

- Global: `none | warn | strict`
- Pair form: `req:<mode>[,res:<mode>]` (order agnostic). Missing side defaults to `none`.

Usage Example:

```
CAMUNDA_SDK_VALIDATION=req:warn,res:strict node your-script.mjs
```

Implementation lives in lightweight runtime config (see `src/` – exact path may evolve; search for `VALIDATION` token).

---

## 9. Customizing Generation

Add or modify steps by inserting scripts in `package.json` before dependent stages. Guidelines:

- New spec transforms: place after `fetch:spec` but before `preprocess` if they change semantic key eligibility; otherwise before `generate:sdk`.
- Augment generated raw artifacts: insert between `generate:sdk` and `generate:class`.
- Add documentation surfaces: after `generate:facade` but before `gate`.

Never mutate generated files in-place inside version control; alter the generator script or spec.

---

## 10. Testing Strategy

During `generate` we run a fast Vitest suite (unit-level). Integration tests are kept separate (excluded by pattern). Extend tests when introducing:

- New branding behaviors.
- Additional method synthesis rules.
- Consistency management semantics.

Add failing test first for generator changes (classic red/green).

---

## 11. Releasing (Future)

Current version is pre-release (`0.0.0-dev`). Before publishing:

1. Pin upstream spec commit (add `ORCH_SPEC_REF`).
2. Update `CHANGELOG.md`.
3. Bump `package.json` version.
4. Tag & publish.
5. Archive spec hash used for the release.

---

## 12. Troubleshooting

| Issue                                | Likely Cause                          | Action                                                                |
| ------------------------------------ | ------------------------------------- | --------------------------------------------------------------------- |
| Missing branded key alias            | Absent `x-semantic-type`              | Add vendor extension to schema & rerun.                               |
| Operation absent in `CamundaClient`  | Sanitization or missing `operationId` | Ensure unique `operationId` in spec.                                  |
| Wrong input type (path/query mixing) | Generator inference gap               | Patch `generate-class-methods.ts` logic (add case).                   |
| Spec fetch fails                     | Network / repo moved                  | Retry; if persistent, add offline fallback (future enhancement).      |
| Branding metadata empty              | Spec path mismatch or no markers      | Confirm `external-spec/upstream/.../rest-api.yaml` & markers present. |
| Validation modes ignored             | Env var mis-specified                 | Use lowercase or explicit `req:`, `res:` pairs.                       |

---

## 13. Future Enhancements (Tracked Ideas)

- Commit pinning & hash provenance file.
- Offline spec cache & diff report (show upstream delta summary each build).
- Automated semantic key coverage & drift trend metrics.
- Response-type narrowing via discriminated unions for major polymorphic resources.
- Retry & auth pluggable hooks.
- Pagination auto-iterators.

---

## 14. Maintenance Quick Commands

| Task                      | Command              |
| ------------------------- | -------------------- | ---------------------------------------- |
| Full build                | `npm run build`      |
| Regenerate only           | `npm run generate`   |
| Fetch spec only           | `npm run fetch:spec` |
| Inspect branding metadata | `jq '.keys           | length' branding/branding-metadata.json` |
| Quick clean               | `npm run clean`      |

---

## 15. Test Scaffold Automation

Every exported SDK operation (`export const <opName> =` in `src/gen/sdk.gen.ts`) must have a matching integration test scaffold file at:

```
tests-integration/methods/<opName>.test.ts
```

### Pipeline Integration

`npm run generate` now performs:

1. Code generation & postprocessing (existing steps)
2. `npm run scaffold:methods` – create any missing scaffold test files (idempotent; never overwrites existing)
3. `npm run validate:scaffolds` – fails (non-zero) if any operation lacks a scaffold (after accounting for ignores)

### Manifest

`tests-integration/methods/manifest.json` is rewritten by the scaffold generator with:

- `operations`: count of discovered SDK exports
- `tests`: count of present `*.test.ts` files
- `missing`: array of still-missing scaffolds (should be empty after a clean run)
- `ignored`: operations intentionally excluded
- `files`: sorted list of scaffold filenames

### Ignoring an Operation

Add the operation name (without `.test.ts`) to the `ignored` array in `manifest.json`. Example:

```jsonc
{
  "ignored": ["experimentalOperation"],
}
```

On the next run:

- No scaffold will be generated for ignored entries.
- Validator will not require a test for them.

Use ignores sparingly; prefer scaffolding even if the test body remains a TODO, for visibility.

### Creating Real Tests

Scaffolds contain a minimal `describe('<opName>')` with a placeholder. Expand them with:

- Test data fixtures (shared via `test-support/` if needed)
- Assertions on response shape, error handling, validation modes

### Adding a New Operation (End-to-End)

1. Update the OpenAPI spec adding a new operationId.
2. Run `npm run generate`.
3. Verify new scaffold exists & manifest lists zero `missing`.
4. Implement test logic.
5. Commit changes including updated `manifest.json`.

### CI Failure Scenario

If CI fails with:

```
[validate-test-scaffolds] Missing test scaffolds for operations:
   - someNewOp
```

Run locally:

```
npm run scaffold:methods
```

Commit the newly created test file (and updated manifest). If intentionally skipped, add to `ignored` and commit.

---

Contributions: open a draft PR early when altering generator semantics (branding, class synthesis, facade layering) to surface design discussion before large diffs land.
