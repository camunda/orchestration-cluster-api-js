# AGENTS.md

> **Note:** This file delegates to a central AGENTS.md. Read and apply it before proceeding.

**URL:**
https://raw.githubusercontent.com/camunda/.github/refs/heads/main/AGENTS.md

Treat the central file's contents as if they were written directly in this file.
Instructions below extend those guidelines and take precedence if there is any conflict.

## Repo-specific instructions

### Role & boundary

This repo generates the TypeScript SDK (`@camunda8/orchestration-cluster-api`) from a multi-file OpenAPI spec sourced from the Camunda monorepo. The published SDK is consumed by application code and downstream tools (e.g. `c8ctl`).

Upstream dependencies — when they misbehave, fix them at the source rather than working around them here:

- [`camunda-schema-bundler`](https://github.com/camunda/camunda-schema-bundler) — fetches and bundles the upstream OpenAPI spec.
- [`@hey-api/openapi-ts`](https://github.com/hey-api/openapi-ts) — generates `src/gen/*` from the bundled spec.
- [`camunda/camunda`](https://github.com/camunda/camunda) — source of the OpenAPI spec.

**Path map:**

| Path                       | Ownership and intent                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/runtime/`             | Hand-written runtime (HTTP, retry, backpressure, workers, configuration) — primary edit surface for runtime behavior. |
| `src/template/`            | Hand-written templates the post-process hooks splice generated content into.                                          |
| `src/facade/`              | Thin functional facade over the generated SDK — partly generated, partly hand-written.                                |
| `src/gen/`                 | **Generated.** Produced by `npm run generate`. Never hand-edit.                                                       |
| `hooks/pre/`, `hooks/post/`| Pre/post-generation pipeline steps — primary edit surface for fixing generator output.                                |
| `plugins/branding-plugin/` | Plugin that runs inside `@hey-api/openapi-ts`.                                                                        |
| `scripts/run-pipeline.ts`  | Pipeline orchestrator.                                                                                                |
| `external-spec/bundled/`   | Bundled OpenAPI spec (`rest-api.bundle.json`) and `spec-metadata.json` — generator inputs.                            |
| `external-spec/upstream/`  | Sparse clone of the upstream repo. Transient; never commit.                                                           |
| `examples/readme.ts`       | Source of truth for `README.md` code examples — type-checked.                                                         |
| `tests/`                   | Unit tests (no live Camunda required).                                                                                |
| `tests-integration/`       | Integration tests (require live Camunda).                                                                             |

## Generator pipeline

### Key flows (what to run)

- Build (fetches upstream spec): `npm run build`
- Build using already-fetched spec (fast local iteration): `npm run build:local`
- Only regenerate the bundled OpenAPI spec: `npm run bundle:spec`

### Pipeline (high level)

1. `camunda-schema-bundler` → fetch upstream YAML (sparse clone) + bundle → `external-spec/bundled/rest-api.bundle.json` + `spec-metadata.json`
2. `scripts/run-pipeline.ts` orchestrates numbered hooks:
   - `hooks/pre/*` → preprocessing (branding metadata from `spec-metadata.json`)
   - `@hey-api/openapi-ts` → generate `src/gen/*` (types, zod, sdk)
   - `hooks/post/*` → postprocessing (index fix, deployment schema, class methods, facade, validation gate, zod augment, activate-jobs enrichment, test scaffolds)
   - Tests
3. `tsup --dts` → dist bundles + declaration output

Hooks are numbered (100, 200, …) and run in lexicographic order. To add a new step, create a file in `hooks/pre/` or `hooks/post/` with an appropriate number.

If you are debugging generation issues, prefer reproducing with `npm run build:local` to avoid fetch noise.

### Where things live

- Bundled spec input to the generator: `external-spec/bundled/rest-api.bundle.json`
- Spec metadata (operations, keys, unions): `external-spec/bundled/spec-metadata.json`
- Generator output (checked/used by build): `src/gen/`
- Spec bundling: `camunda-schema-bundler` npm package (handles fetch, bundle, normalization)
- Pipeline orchestrator: `scripts/run-pipeline.ts`
- Pre-generation hooks: `hooks/pre/`
- Post-generation hooks: `hooks/post/`
- Branding plugin (runs during openapi-ts): `plugins/branding-plugin/`
- Spec location constants: `scripts/spec-location.ts`
- Generator config: `openapi-ts.config.ts`

### Caution: temporary clone directories under `external-spec/`

The spec bundler creates `.tmp-clone-*` directories under `external-spec/upstream/` during sparse clones. These are transient and **must never be committed** — Git treats them as submodule gitlinks (mode `160000`), which breaks clones for anyone without the referenced commit. The `.gitignore` entry `external-spec/upstream/**/.tmp*` prevents this, but if a new `.tmp*` path slips through, remove it with `git rm --cached <path>` and verify with `git ls-tree -r HEAD | grep 160000`.

## Commit message guidelines

We use Conventional Commits.

Format:

```
<type>(optional scope): <subject>

<body>

BREAKING CHANGE: <explanation>
```

Allowed type values (common set):

```
feat
fix
chore
docs
style
refactor
test
ci
build
perf
```

Rules:

- Subject length: 5–100 characters.
- Use imperative mood ("add support", not "added support").
- Lowercase subject (except proper nouns). No PascalCase subjects.
- Keep subject concise; body can include details, rationale, links.
- Prefix breaking changes with `BREAKING CHANGE:` either in body or footer.

### Review-comment fix-ups

Commits that address PR review comments must use the `chore` type (e.g. `chore:` or `chore(<scope>):`), **not** the `fix` type.
`fix` commits trigger a patch release and a CHANGELOG entry — review iterations are not user-facing bug fixes.

```
# Correct
chore: address review comments — use logger.json for dry-run

# Wrong — will pollute the CHANGELOG
fix: address review comments — use logger.json for dry-run
```

### Separate generator changes from regenerated output

When a change modifies the generator (hooks, plugins, pipeline scripts, bundler integration, templates) **and** that change causes `src/gen/*` to differ, **split the work into two commits**:

1. **First commit** — generator change only: hook/plugin/script/template/test edits. No `src/gen/*` changes.
2. **Second commit** — regenerated output: `src/gen/*` (and any other byte-for-byte derived files like `dist/` if relevant) produced by running the pipeline against the first commit.

Why:

- **Cherry-picks stay clean.** Backports to `stable/*` only need the generator commit; the target branch's release CI regenerates `src/gen/*` itself. Mixing the two means the cherry-pick drags generated diff through, which conflicts with whatever generated state the target branch has.
- **Reviewers can read the change.** Generator commits are small and meaningful; regenerated commits are large and mechanical. Mixing them makes the review effectively unreadable.
- **`git blame` stays useful** for both surfaces.

Naming convention for the second commit:

```
chore(gen): regenerate src/gen for <short summary of generator change>
```

If `npm run build` (or `npm run build:local`) modifies `src/gen/*` after the generator commit, `git add src/gen` and commit it separately — do **not** amend it back into the generator commit.

The pre-push checklist below still applies: always run the full build before pushing, and commit any regenerated drift before the push.

## Pre-push checklist

Before pushing any commits, **always** run `npm run build`. This:

1. Regenerates `src/gen/` from the bundled spec
2. Syncs README code snippets from `examples/readme.ts` (fails if out of sync)
3. Runs all unit tests
4. Produces the `dist/` output

If the build modifies any files (e.g. README snippet drift, generated code changes), commit those changes before pushing — and respect the **separate-commits rule** above when the modified files are `src/gen/*`.

## Build pipeline

### Always-green policy

Warnings are fatal. Do not suppress a warning to make a build pass. Do not treat any failure as pre-existing or unrelated without explicit confirmation.

```bash
# Verify baseline -> always green (always run before an AI-assisted session)
npm run build

# Fast inner loop (unit tests only)
npm test

# Lint (Biome)
npx biome check
```

Never skip the lint and type-check steps before pushing.

## Bug fix process (red/green refactor)

Every bug fix **must** follow the red/green refactor discipline:

1. **Red** — Write a failing test **first**, before changing any production code. The test must fail for the reason you expect (the bug). Commit this separately or demonstrate the failure clearly in the PR.
2. **Green** — Apply the minimal production fix that makes the test pass.
3. **Refactor** (optional) — Clean up while keeping all tests green.

### Test scope: target the defect class, not just the instance

The regression test must be broad enough to detect the **class of defect**, not only the specific instance you are fixing. For example, if the bug is "generated method X omits a required parameter", the test should verify that **all** generated methods include their required parameters — not just method X.

A test that only covers the exact instance provides weaker protection: the same category of bug can recur in a different method without being caught.

### Why

- The failing test **proves** the test can detect this category of defect.
- The green step **proves** the fix resolves it.
- A class-scoped test acts as a durable regression guard against future reintroduction of the same pattern.

### There are no flaky tests

We do not acknowledge the existence of "flaky tests". A test that passes sometimes and fails other times is reporting one of two things:

1. **A test defect** — the test contains a race, an unbounded timeout, an order-of-operation assumption, an unsynchronised readiness signal, or a dependency on wall-clock timing. Fix the test so its outcome is deterministic for the behaviour it claims to assert.
2. **A product defect** — the production code has a race, a missed signal, an unhandled error path, or a resource it leaks under load. Fix the product.

Either way, an intermittent failure is a real defect that must be diagnosed and fixed before the change merges. Do not retry the CI job, mark the test `skip`, add a `.retry()`, or describe the failure as "flaky" or "unrelated" in the PR description. "Re-run and hope" is a coping strategy, not engineering.

When triaging an intermittent CI failure:

- Reproduce locally if possible (loops, resource pressure, timeout reduction). If you cannot reproduce, reason from first principles about what *could* differ between local and CI (load, filesystem semantics, signal delivery latency, parallel test interaction).
- Identify the specific race or assumption. Common shapes: polling for an output line that is printed *before* the relevant handler is registered; timeouts that double as correctness assertions; tests that share a temp directory across runs; tests that depend on event ordering across two processes.
- Pick category 1 vs category 2 explicitly in the fix commit message, and explain which signal the test was previously relying on and which deterministic signal it now relies on.
- If timeouts must be generous to absorb runner load, the timeout is a safety net — not a correctness signal. State this in a comment so future maintainers don't tighten it back into a race.

## Troubleshooting: `TS2304 Cannot find name '_heyapi_…_'`

### Symptom

`tsup --dts` fails with errors like:

- `src/gen/types.gen.ts: error TS2304: Cannot find name '_heyapi_701_'.`

This is a generator artifact: `@hey-api/openapi-ts` created an internal placeholder type (`_heyapi_…_`) but did not emit its definition.

### Root cause (known regression)

`SwaggerParser.bundle()` sometimes emits _internal_ `$ref`s under `#/paths/...` for the `$like` filter schema instead of referencing the canonical component schema.

Complication: those internal refs can be URI-encoded (e.g. `%24like` instead of `$like`).

If our normalization only matches the decoded form, the path-local `$like` refs survive into the final bundled spec, and `@hey-api/openapi-ts` can end up generating unresolved placeholder types.

Canonical intended shape:

- `$like` should ultimately reference `#/components/schemas/LikeFilter`

Bad shape (causes generator pain):

- `$like` references something like `#/paths/.../properties/%24like` (or the decoded `.../$like`)

### Fix location

The mitigation lives in the `camunda-schema-bundler` package (signature-based normalization + manual overrides).

There is also a fail-fast sanity check in the bundler that errors if any path-local `$like` refs survive.

Important detail: `manualOverrides` in the bundler matches specific `#/paths/...` ref strings and expects the _encoded_ form for some paths (e.g. `%7B`), so avoid globally decoding all refs too early. The `$like` rewrite should compare against a decoded/normalized view of the ref, but keep the original ref string unless rewriting.

### Quick debug checklist

1. Confirm the failure and that it’s the `_heyapi_*` pattern:
   - `npm run build:local`

2. Inspect whether the generated placeholder exists:
   - `grep -n "_heyapi_" src/gen/types.gen.ts | head`

3. Check whether the bundled spec contains path-local `$like` refs (should be 0):
   - `node - <<'NODE'
const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('external-spec/bundled/rest-api.bundle.json','utf8'));
let likePath = 0;
function walk(node){
  if(!node || typeof node !== 'object') return;
  if(Array.isArray(node)) return node.forEach(walk);
  if(typeof node.$ref === 'string' && node.$ref.startsWith('#/paths/') && /\/properties\/(\$like|%24like)$/.test(node.$ref)) likePath++;
  for(const v of Object.values(node)) walk(v);
}
walk(spec);
console.log({ likePath });
NODE`

4. If `likePath > 0`, regenerate bundle and re-check:
   - `npm run bundle:spec`

5. Sanity-check that `$like` properties point at `#/components/schemas/LikeFilter`:
   - `node - <<'NODE'
const fs = require('fs');
const spec = JSON.parse(fs.readFileSync('external-spec/bundled/rest-api.bundle.json','utf8'));
const refs = new Map();
function walk(node){
  if(!node || typeof node !== 'object') return;
  if(Array.isArray(node)) return node.forEach(walk);
  if(node.properties && node.properties['$like'] && typeof node.properties['$like'] === 'object') {
    const r = node.properties['$like'].$ref;
    if(typeof r === 'string') refs.set(r, (refs.get(r) || 0) + 1);
  }
  for(const v of Object.values(node)) walk(v);
}
walk(spec);
console.log({ distinct: refs.size, top: [...refs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5) });
NODE`

### If it happens again (what to do)

- First suspect: a new upstream schema change altered how bundling represents filters, or `SwaggerParser.bundle()` emitted new internal refs.
- Ensure the `$like` rewrite handles both encoded and decoded patterns.
- If the bundled spec looks clean (no path-local `$like` refs) but `_heyapi_*` persists, collect:
  - the bundled spec snippet around the failing type
  - the generator version (`@hey-api/openapi-ts`)
  - and open an issue upstream or pin a known-good generator version.

## README Code Examples

### API spec examples: prefer ergonomic helpers

The `examples/operation-map.json` file maps OpenAPI `operationId`s to example regions consumed by `hooks/post/450-inject-examples.ts`. That hook injects `@example` JSDoc blocks into generated sources, which are then rendered by TypeDoc (`npm run docs:api`) and surfaced in IntelliSense. See `MAINTAINER.md` ("API Docs Example Injection (Hook 450)") for the maintainer workflow.

When an ergonomic helper method exists for a generated operation, the operation-map entry **must** point to the helper — not to the raw generated method. Users should see the best developer experience by default in the generated API docs and editor hints.

Example: `createDeployment` maps to `DeployResourcesFromFiles` (file-path helper) instead of the raw `createDeployment` (requires manual `File` objects), so the injected `@example` shown in TypeDoc/IntelliSense demonstrates the ergonomic path. This preference is consistent across all three SDK repos (C#, TypeScript, Python).

Code blocks in `README.md` are **injected from compilable example files** — do not edit them inline.

- **Source of truth**: `examples/readme.ts` (type-checked during build via `tsc --noEmit`)
- **Sync script**: `scripts/sync-readme-snippets.ts`
- **CI gate**: `tsx scripts/sync-readme-snippets.ts --check` (fails if README is out of sync)

### How it works

1. Wrap code in `examples/readme.ts` with `//#region RegionName` / `//#endregion RegionName` tags.
2. In `README.md`, place a snippet marker immediately before the fenced code block:
   - New format: `<!-- snippet-source: examples/readme.ts | regions: RegionName -->`
   - Legacy format `<!-- snippet:RegionName -->` is auto-migrated on sync.
3. Run `tsx scripts/sync-readme-snippets.ts` to update README.
4. Composite regions: `regions: A+B` concatenates regions A and B separated by a blank line.
5. Blocks using external deps or pseudo-code that can't be type-checked: mark with `<!-- snippet-exempt: reason -->`.

### Adding or updating a README example

1. Add/edit the region-tagged code in `examples/readme.ts`.
2. Add/verify the `<!-- snippet-source: ... -->` marker in `README.md`.
3. Run `tsx scripts/sync-readme-snippets.ts` to sync.

**Never edit a snippet-marked code block directly in README.md** — it will be overwritten on the next sync.

## Type honesty: optional fields and runtime defaults

### The invariant

Every field marked `?` (optional) in a public config/options type **must** be genuinely optional at runtime — either because a built-in default exists in the constructor/factory, or because the code tolerates `undefined`.

If the type says `maxParallelJobs?: number`, a caller can legally write `{ jobType: 'x', jobHandler: fn }` and omit it. The runtime must not throw.

### Enforcement layers

1. **Compiler (strongest)**: Use an input/resolved type split. The public-facing type has `?` fields; the internal resolved type has them as required. The constructor spread bridges them with defaults. Adding a required field to the resolved type without a default is a compile error.

   ```ts
   // Public: users can omit
   export interface JobWorkerConfig {
     maxParallelJobs?: number;
     jobTimeoutMs?: number;
     workerName?: string;        // genuinely optional — no default needed
   }

   // Internal: after defaults applied
   interface ResolvedJobWorkerConfig {
     maxParallelJobs: number;    // required — default applied
     jobTimeoutMs: number;       // required — default applied
     workerName?: string;        // still optional
   }

   // Constructor: compiler enforces defaults
   const resolved: ResolvedJobWorkerConfig = {
     maxParallelJobs: 10,
     jobTimeoutMs: 60_000,
     ...cfg,
   };
   ```

2. **Type-honesty test (backstop)**: `tests/worker-type-honesty.test.ts` calls every public config-accepting entry point with only compile-required fields and no env vars. If it throws, the type is lying. When adding a new public API that accepts a config object, add a test case here.

3. **Code review (conventional)**: The test header documents the pattern. Reviewers should check that new `create*` methods have a corresponding test case.

### Default precedence

For fields that can be supplied via env vars, the precedence is:

```
explicit config value > env var (CAMUNDA_WORKER_*) > constructor default
```

The constructor default is the safety net — it ensures the field is never `undefined` regardless of whether the env var is set.

### Anti-patterns

- **`if (x === undefined) throw`** on a `?` field: the type says it's optional, the runtime says it's required. This is the defect this pattern prevents.
- **Non-null assertion (`!`)** on a field that depends on an external default (env var, schema): if someone removes the upstream default, the `!` becomes a silent crash. Prefer a fallback or the resolved type pattern.

### Configuration schema (`src/runtime/configSchema.ts`)

The schema is the canonical registry of env vars but the hydration in `unifiedConfiguration.ts` is currently hand-wired (see [#145](https://github.com/camunda/orchestration-cluster-api-js/issues/145)). Key hazards:
- 8 keys have redundant inline `|| 'fallback'` that can diverge from the schema default
- 6 keys use `!` (non-null assertion) relying on schema defaults existing
- Schema defaults do NOT flow into `workerDefaults` — those constructors must provide their own defaults
