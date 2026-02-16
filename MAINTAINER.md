<h1 align="center">Maintainer Guide – Orchestration Cluster TypeScript SDK</h1>

Architecture and pipeline documentation for the `@camunda8/orchestration-cluster-api` SDK generator. End‑user consumption docs live in `README.md`; contributor setup is in `CONTRIBUTING.md`.

---

## 1. High‑Level Flow

`npm run build` runs a deterministic pipeline:

1. **Clean** – purge `dist/`, `src/gen/`, `src/facade/`.
2. **Bundle spec** – `camunda-schema-bundler` fetches the upstream multi-file OpenAPI spec (sparse clone of `camunda/camunda`, directory `zeebe/gateway-protocol/src/main/proto/v2`) and bundles it into:
   - `external-spec/bundled/rest-api.bundle.json` (single-file spec consumed by the generator)
   - `external-spec/bundled/spec-metadata.json` (operation metadata: keys, unions, consistency info)
3. **Pipeline** (`tsx scripts/run-pipeline.ts`) – runs numbered hooks in lexicographic order:
   - Pre-generation hooks (`hooks/pre/*`)
   - `@hey-api/openapi-ts` code generation → `src/gen/` (types, zod, sdk)
   - Post-generation hooks (`hooks/post/*`)
   - Unit tests (vitest, excluding integration)
4. **Documentation** – generate config reference docs.
5. **Bundle** – `tsup` produces ESM + CJS + declarations in `dist/`.

Each step is idempotent given identical upstream spec + environment.

### Build Variants

| Command                     | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `npm run build`             | Full build: fetch upstream spec, generate, test, bundle          |
| `npm run build:local`       | Fast local iteration: use already-fetched spec, skip format step |
| `npm run bundle:spec`       | Only fetch & bundle the upstream spec                            |
| `npm run bundle:spec:local` | Only bundle from local spec files (no network fetch)             |
| `npm run generate`          | Clean + bundle spec (remote) + run pipeline                      |
| `npm run generate:local`    | Clean + bundle spec (local) + run pipeline                       |

Pin a spec branch/tag: `SPEC_REF=my-branch npm run build`.

---

## 2. Pipeline Orchestrator

`scripts/run-pipeline.ts` discovers `.ts` files in `hooks/pre/` and `hooks/post/`, sorts them lexicographically, and runs each via `tsx`. Between the two hook phases it invokes `@hey-api/openapi-ts` (configured in `openapi-ts.config.ts`). After all hooks, it runs the unit test suite (skippable with `--no-test`).

### Hook Numbering Convention

Hooks are numbered in increments of 100 (100, 200, …). To insert a new step between existing hooks, use an intermediate number (e.g., 450 between 400 and 500). The lexicographic sort on filenames determines execution order.

---

## 3. Spec Acquisition

Spec fetching and bundling is handled by the `camunda-schema-bundler` npm package (separate repo). It performs:

- Sparse clone of `camunda/camunda` (configurable branch via `SPEC_REF`)
- `SwaggerParser.bundle()` to merge multi-file YAML into a single JSON
- Schema augmentation from all upstream YAML files
- Path-local `$ref` normalization (signature matching + manual overrides)
- Emission of `spec-metadata.json` (operation IDs, key types, union types, consistency annotations)

The raw upstream spec is also materialized at `external-spec/upstream/` for traceability and local bundling.

Spec location constants are centralized in `scripts/spec-location.ts` to prevent drift.

---

## 4. Hook Reference

### Pre-generation hooks (`hooks/pre/`)

| Hook                       | Purpose                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `100-preprocess-brands.ts` | Reads `spec-metadata.json` and enriches it with SDK-specific fields (TypeScript branded types, Zod schema names, source pointers) → produces `branding/branding-metadata.json` |

### Post-generation hooks (`hooks/post/`)

| Hook                             | Purpose                                                                                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `100-fix-gen-index.ts`           | Replaces `export type *` with `export *` in `src/gen/index.ts` so runtime key-helper namespaces (not just types) are re-exported                                                       |
| `200-fix-deployment-schema.ts`   | Patches `zod.gen.ts` so the `createDeployment` resources schema accepts `Blob\|File` and enforces non-empty arrays                                                                     |
| `300-generate-class-methods.ts`  | Reads spec metadata + template → generates typed methods on `CamundaClient` (inserted between auto-generation markers), including per-operation `Input` and `Consistency` helper types |
| `400-generate-facade.ts`         | Builds ergonomic `CancelablePromise` wrappers in `src/facade/` that flatten body-only operations and unwrap the `{ data }` envelope                                                    |
| `450-inject-examples.ts`         | Reads `examples/operation-map.json` and injects `@example` JSDoc tags with `{@includeCode}` references into generated source files                                                     |
| `500-gate-validation.ts`         | Strips inline `requestValidator`/`responseValidator` from `sdk.gen.ts` (validation is handled by `CamundaClient` via `ValidationManager`)                                              |
| `600-fix-zod-augment.ts`         | Rewrites the bare `import '../zod-augment'` in `zod.gen.ts` into a named import to survive tree-shaking                                                                                |
| `700-enrich-activate-jobs.ts`    | Patches `CamundaClient` to import and apply `enrichActivatedJob`, adding action methods (complete, fail, etc.) to activated job objects                                                |
| `800-generate-test-scaffolds.ts` | Scans `sdk.gen.ts` for exported operations and auto-generates missing integration test scaffold files in `tests-integration/methods/`, updating `manifest.json`                        |
| `900-validate-test-scaffolds.ts` | Validates every exported SDK operation has a corresponding test scaffold; exits non-zero if any are missing (excluding ignored list)                                                   |
| `950-typecheck-examples.ts`      | Runs `tsc --noEmit` against `examples/tsconfig.json` to catch type-contract regressions from upstream spec changes                                                                     |

---

## 5. Semantic Key Branding

Signal: presence of `x-semantic-type` (equivalent to implicit `x-semantic-key: true`). Explicit `x-semantic-key` also accepted.

Flow:

1. `camunda-schema-bundler` detects `x-semantic-type` markers during bundling and records them in `spec-metadata.json`.
2. Pre-hook `100-preprocess-brands.ts` enriches this into `branding/branding-metadata.json` (keys, unions, arrays, constraints, stable IDs).
3. The branding plugin (`plugins/branding-plugin/`) runs during `@hey-api/openapi-ts` generation and injects:
   - Generic `CamundaKey<T>` alias
   - Branded key type aliases (`export type ProcessInstanceKey = CamundaKey<'ProcessInstanceKey'>`)
   - Zod refinements for key fields
   - Namespace helpers / lifters if configured

Detection is purely semantic—no structural inheritance.

---

## 6. Generated Artifacts

| File               | Location      | Purpose                                                                    |
| ------------------ | ------------- | -------------------------------------------------------------------------- |
| `types.gen.ts`     | `src/gen/`    | TypeScript types from OpenAPI schemas (with branded key injection)         |
| `zod.gen.ts`       | `src/gen/`    | Zod validators & schema objects                                            |
| `sdk.gen.ts`       | `src/gen/`    | Raw operation functions (thin HTTP call layer)                             |
| `CamundaClient.ts` | `src/gen/`    | Aggregated class with ergonomic methods, typed inputs, consistency helpers |
| `facade/*`         | `src/facade/` | Higher-level convenience wrappers (`CancelablePromise` surface)            |

Generated files are entirely disposable; never edit them manually—change inputs, templates, or hooks instead.

### Template

The CamundaClient is generated from `src/template/CamundaClient.template.ts`. This template contains:

- Hand-written infrastructure: HttpClient setup, auth, retry, backpressure, job workers
- Auto-generation markers where hook 300 inserts methods and support types

To add hand-written methods (like `createJobWorker`), edit the template. To modify auto-generated methods, edit hook 300.

---

## 7. Class Generation (Hook 300)

Reads:

- `external-spec/bundled/spec-metadata.json` (operations, consistency annotations)
- `src/gen/sdk.gen.ts` (harvest JSDoc & argument shapes)
- `src/gen/zod.gen.ts` (presence test for response schemas & void markers)

Markers in template:

```
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===
// === AUTO-GENERATED CAMUNDA METHODS START ===
// === AUTO-GENERATED CAMUNDA METHODS END ===
```

Between these, the generator inserts:

- `export type <Op>Input` helper types (body/path/query extraction)
- `export type <Op>Consistency` helpers for eventually consistent operations
- Method implementations binding to `Sdk.<operationId>`

Special cases: `createDeployment` enforces `File[]` for `resources`.

---

## 8. Compilable Examples & Documentation

### Examples Directory

`examples/` contains compilable TypeScript examples organized by API domain:

| File                  | Domains                                      |
| --------------------- | -------------------------------------------- |
| `client.ts`           | Client construction, configuration           |
| `decision.ts`         | Decision evaluation, search                  |
| `deployment.ts`       | Deploy resources                             |
| `incident.ts`         | Incident resolution, search                  |
| `job.ts`              | Job activation, completion, failure, workers |
| `message-signal.ts`   | Message correlation, signal broadcast        |
| `process-instance.ts` | Process start, cancel, search                |
| `user-task.ts`        | User task assignment, completion, search     |

Examples use `//#region Name` / `//#endregion Name` markers to define named regions that can be referenced individually.

### Type-Checking (Hook 950)

Examples are type-checked at build time via `tsc --noEmit -p examples/tsconfig.json`. This catches type-contract regressions when the upstream spec changes. The separate tsconfig maps `@camunda8/orchestration-cluster-api` to `../src/index.ts` for direct type resolution.

### Operation Map

`examples/operation-map.json` maps operation IDs to example file+region references:

```json
{
  "activateJobs": ["examples/job.ts#ActivateJobs"],
  "createProcessInstance": ["examples/process-instance.ts#CreateProcessInstance"]
}
```

Hook 450 reads this map and injects `@example` JSDoc tags with `{@includeCode}` inline tags into the generated source.

### Adding a New Example

1. Add a `//#region MyExample` ... `//#endregion MyExample` block to the appropriate example file.
2. Add a mapping entry to `examples/operation-map.json`.
3. Run `npm run build:local` to verify type-checking passes and the example appears in generated docs.

For hand-written methods (not in the operation map, like `createJobWorker`), add `@example` tags with `{@includeCode}` directly in the template.

### TypeDoc Configuration

`typedoc.json` is configured with:

- `jsDocCompatibility.exampleTag: false` — required for `{@includeCode}` inline tags to resolve inside `@example` blocks (TSDoc mode)
- Custom `blockTags`: `@operationId`, `@tags`, `@consistency`, `@description` (in addition to TSDoc defaults)
- `intentionallyNotExported`: internal utility types (`IsBrandedKey`, `InferOrUnknown`)
- Entry points: `src/index.ts`, `src/logger.ts`, `src/fp/index.ts`

Generate API docs: `npm run docs:api`. Output goes to `docs/`.

---

## 9. Facade Generation (Hook 400)

Builds `CancelablePromise` wrappers in `src/facade/` that:

- Flatten body-only operations (no path/query params)
- Unwrap the `{ data }` transport envelope so callers receive the domain payload directly

Keep facade logic stateless and derivable. Add new surfaces here rather than mutating the generated client.

---

## 10. Validation Modes

Environment variable: `CAMUNDA_SDK_VALIDATION`.

Grammar:

- Global: `none | warn | strict`
- Pair form: `req:<mode>[,res:<mode>]` (order agnostic). Missing side defaults to `none`.

```bash
CAMUNDA_SDK_VALIDATION=req:warn,res:strict node your-script.mjs
```

Implementation: `src/runtime/validationManager.ts` + `src/runtime/validationCore.ts`.

Hook 500 strips inline validators from `sdk.gen.ts` because validation is centralized in the client.

---

## 11. Runtime Components

The `src/runtime/` directory contains hand-written infrastructure:

| Module                                       | Purpose                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| `unifiedConfiguration.ts`                    | Environment variable hydration, configuration schema |
| `auth.ts` / `installAuthInterceptor.ts`      | OAuth / Basic auth with token management             |
| `retry.ts`                                   | Exponential backoff with jitter                      |
| `backpressure.ts`                            | Adaptive concurrency management                      |
| `eventual.ts`                                | Eventual consistency polling                         |
| `jobWorker.ts` / `jobActions.ts`             | Job worker with enriched action methods              |
| `validationManager.ts` / `validationCore.ts` | Request/response validation using Zod schemas        |
| `telemetry.ts`                               | Telemetry hooks                                      |
| `logger.ts` / `supportLogger.ts`             | Logging infrastructure                               |
| `errors.ts`                                  | Custom error types                                   |

---

## 12. Package Entry Points

The SDK exports three subpath entry points (configured in `package.json` `exports`):

| Subpath    | Source            | Purpose                                                             |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| `.`        | `src/index.ts`    | Main entry: `CamundaClient`, all types, result client, loose client |
| `./logger` | `src/logger.ts`   | Standalone logger utilities                                         |
| `./fp`     | `src/fp/index.ts` | Functional programming client (`fp-ts` Either-based)                |

---

## 13. Testing Strategy

### Unit Tests

Run during the pipeline (after post hooks): `npm test` or `vitest run`. Fast, deterministic, no containers required.

### Integration Tests

Separate suite requiring a running Camunda cluster:

```bash
npm run docker:start          # spin up containers
npm run test:integration      # run integration tests
npm run docker:stop           # tear down
```

### Test Scaffold Automation

Every exported SDK operation in `sdk.gen.ts` must have a matching integration test scaffold at `tests-integration/methods/<opName>.test.ts`.

Hooks 800/900 automate this:

- Hook 800 scans `sdk.gen.ts` and generates missing scaffold files (idempotent, never overwrites)
- Hook 900 validates all operations are covered; fails the build if any are missing

`tests-integration/methods/manifest.json` tracks operations, files, missing, and ignored lists.

To ignore an operation, add it to the `ignored` array in `manifest.json`.

---

## 14. Releasing

Uses [semantic-release](https://github.com/semantic-release/semantic-release) (config: `release.config.cjs`).

- `main` branch → alpha prereleases
- `stable/*` branches → stable releases
- Conventional Commits determine version bumps (`fix:` → patch, `feat:` → patch, `server:` → minor, `server-major:` → major)
- `chore:`, `docs:`, `ci:` commits produce no release

Commit messages are linted by commitlint (`commitlint.config.cjs`).

---

## 15. Customizing Generation

To add a new pipeline step:

1. Create a `.ts` file in `hooks/pre/` or `hooks/post/` with an appropriate number.
2. The pipeline orchestrator will discover and run it automatically in sort order.

Guidelines:

- **New spec transforms**: place in `hooks/pre/` (before openapi-ts runs).
- **Augment raw generated artifacts**: place in `hooks/post/` with a number below 300 (before class generation).
- **Modify the generated client**: place after 300.
- **Add documentation surfaces**: place after 400 but before 500 (gate validation).
- **Add quality gates**: place after 500.

Never edit generated files in `src/gen/` manually—they are overwritten every build.

---

## 16. Where Things Live

| What                          | Path                                         |
| ----------------------------- | -------------------------------------------- |
| Pipeline orchestrator         | `scripts/run-pipeline.ts`                    |
| Spec location constants       | `scripts/spec-location.ts`                   |
| Generator config              | `openapi-ts.config.ts`                       |
| Branding plugin               | `plugins/branding-plugin/`                   |
| Branding metadata (generated) | `branding/branding-metadata.json`            |
| CamundaClient template        | `src/template/CamundaClient.template.ts`     |
| Pre-generation hooks          | `hooks/pre/`                                 |
| Post-generation hooks         | `hooks/post/`                                |
| Bundled spec input            | `external-spec/bundled/rest-api.bundle.json` |
| Spec metadata                 | `external-spec/bundled/spec-metadata.json`   |
| Raw upstream spec             | `external-spec/upstream/`                    |
| Generated code                | `src/gen/`                                   |
| Generated facade              | `src/facade/`                                |
| Runtime infrastructure        | `src/runtime/`                               |
| Compilable examples           | `examples/`                                  |
| Example operation map         | `examples/operation-map.json`                |
| TypeDoc config                | `typedoc.json`                               |
| Generated API docs            | `docs/`                                      |
| Integration test scaffolds    | `tests-integration/methods/`                 |
| Scaffold manifest             | `tests-integration/methods/manifest.json`    |

---

## 17. Docusaurus Integration (camunda-docs)

The SDK's API reference documentation is published on the [Camunda docs site](https://docs.camunda.io) via an inversion-of-control pattern: a GitHub Actions workflow **in the camunda-docs repo** checks out this SDK, generates documentation, and opens a PR to copy the output into the docs site.

### How it works

1. The sync workflow (`sync-ts-sdk-docs.yaml` in `camunda/camunda-docs`) runs on a weekly schedule (Thursdays at 4 PM UTC) or on manual dispatch.
2. It checks out this repo (default: `main` branch) and runs:
   ```bash
   npm ci
   npm run docs:md
   ```
3. The generated Markdown files from `docs-md/` are copied into the docs repo at:
   - **Next version:** `docs/apis-tools/typescript/api-reference/`
   - **Released version:** `versioned_docs/version-<X.Y>/apis-tools/typescript/api-reference/`
4. A PR is opened automatically via `peter-evans/create-pull-request`.

### Doc generation command

`npm run docs:md` generates Docusaurus-compatible Markdown using TypeDoc with `typedoc-plugin-markdown`. Output lands in `docs-md/`.

### Updating a released version

To backport docs to a released version (e.g. 8.8):

1. Go to the **Actions** tab in `camunda/camunda-docs`.
2. Select the **Sync TypeScript SDK API Reference** workflow.
3. Click **Run workflow** and enter `8.8` in the `docs_version` field.
4. The workflow checks out `stable/8.8` from this repo and copies docs into `versioned_docs/version-8.8/`.

The PR branch is version-scoped (e.g. `update-ts-sdk-docs/8.8`), so backport and next-version syncs can coexist.

### What lives where

| What | Location |
| --- | --- |
| Doc generation config | `typedoc-md.json` |
| Generated Markdown output | `docs-md/` |
| Sync workflow (in camunda-docs) | `.github/workflows/sync-ts-sdk-docs.yaml` |
| Docs site target (next) | `docs/apis-tools/typescript/api-reference/` |

---

## 18. Troubleshooting

| Issue                                   | Likely Cause                              | Action                                                                                |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `TS2304 Cannot find name '_heyapi_…_'`  | Path-local `$like` refs survived bundling | See `.github/copilot-instructions.md` for detailed debug checklist                    |
| Missing branded key alias               | Absent `x-semantic-type` in upstream spec | Add vendor extension to schema upstream & regenerate                                  |
| Operation absent in `CamundaClient`     | Missing `operationId` in spec             | Ensure unique `operationId` in spec                                                   |
| Wrong input type (path/query mixing)    | Generator inference gap in hook 300       | Patch `hooks/post/300-generate-class-methods.ts` logic                                |
| Spec fetch fails                        | Network / repo moved                      | Use `npm run build:local` with existing spec; check `SPEC_REF`                        |
| Branding metadata empty                 | Spec path mismatch or no markers          | Confirm `external-spec/bundled/spec-metadata.json` has content                        |
| Validation modes ignored                | Env var mis-specified                     | Use lowercase or explicit `req:`, `res:` pairs                                        |
| TypeDoc warnings for unknown tags       | Custom block tag not registered           | Add to `blockTags` array in `typedoc.json`                                            |
| TypeDoc "not included in documentation" | Type not exported from entry point        | Export from `src/index.ts` or `src/fp/index.ts`, or add to `intentionallyNotExported` |
| Example type-check fails                | Upstream spec changed type contracts      | Fix example code in `examples/` to match new types                                    |

---

## 19. Maintenance Quick Commands

| Task                                          | Command                                                |
| --------------------------------------------- | ------------------------------------------------------ |
| Full build (fetch + generate + test + bundle) | `npm run build`                                        |
| Fast local build (no fetch, no format)        | `npm run build:local`                                  |
| Generate only (fetch + pipeline)              | `npm run generate`                                     |
| Generate only (local spec)                    | `npm run generate:local`                               |
| Bundle spec only                              | `npm run bundle:spec`                                  |
| Run unit tests                                | `npm test`                                             |
| Run integration tests                         | `npm run test:integration`                             |
| Generate API docs                             | `npm run docs:api`                                     |
| Generate config docs                          | `npm run docs:config`                                  |
| Format                                        | `npm run format`                                       |
| Lint                                          | `npm run lint`                                         |
| Clean                                         | `npm run clean`                                        |
| Inspect branding metadata                     | `jq '.keys \| length' branding/branding-metadata.json` |
| Start Docker containers                       | `npm run docker:start`                                 |
| Stop Docker containers                        | `npm run docker:stop`                                  |

---

Contributions: open a draft PR early when altering generator semantics (branding, class synthesis, facade layering) to surface design discussion before large diffs land.
