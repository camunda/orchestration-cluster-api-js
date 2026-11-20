# Contributing

Thanks for your interest in contributing to the Camunda 8 Orchestration Cluster TypeScript SDK.

## Development Setup

Requirements:

- Node >= 20 (>=18 works with global File polyfill; we target >=20 in CI)
- npm 9+ recommended

Install deps:

```
npm ci
```

Run full build + tests:

```
npm run build
```

Integration tests spin up containers (Zeebe, Operate, etc.). Use:

```
npm run test:integration
```

## Deterministic Build & Timestamp Policy

The repository enforces a drift guard: regenerated artifacts must be byte‑for‑byte identical across builds unless a real source/input change occurred. To make this reliable we **removed all embedded generation timestamps** (e.g. `generatedAt`, banner date strings) from committed artifacts.

Current policy:

- Do **not** reintroduce wall‑clock timestamps, date banners, or build times into any committed generated file (TypeScript, JSON, Markdown) unless they are logically required for runtime behavior.
- If you need provenance, prefer stable content hashes (already present: `specHash`, branding key hashes) or add a new hash field rather than a timestamp.
- Where an external generator insists on stamping one — `assert-json-body extract` writes `metadata.generatedAt` into `json-body-assertions/responses.json` — strip it afterwards. `npm run responses:strip-timestamps` does this, and `tests/response-fixture-determinism.test.ts` fails if a regeneration script skips it.
- The publish workflow sets `CAMUNDA_SDK_SKIP_FETCH_SPEC=1` to avoid pulling a moving upstream spec mid‑release.

Rationale:

1. Eliminates false positive drift failures due solely to time.
2. Simplifies local verification: two consecutive `npm run build` runs must yield zero git diffs.
3. Improves review signal: any diff now reflects a substantive schema/template/script change.

Contributor guidance:

| Scenario                                 | What to do                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| Need to record when something was built  | Use runtime logging or external release notes, not a committed artifact field.   |
| Want to tag provenance in generated code | Add or extend a stable hash (e.g. combine spec hash + template hash).            |
| Adding a new generation script           | Ensure output ordering is deterministic (sort keys, arrays) and omit timestamps. |

If you inadvertently add a timestamp, the second local build will show a diff—remove the field instead of guarding it behind the deterministic flag.

## Public API surface reports (`etc/*.api.md`)

The package's public API surface is guarded by committed [API Extractor](https://api-extractor.com/) reports. `npm run api:check` extracts an API report from the built declarations of every public entry point (`index`, `logger`, `fn`, `effect`, and the `#platform` node/browser entries) and fails if it differs from the committed report in `etc/*.api.md`, printing the diff. The blocking check always runs against declarations regenerated from the **committed spec bundle** (`npm run build:local`; CI runs `generate:local && build:types && api:check` as a dedicated step) — never against a build that re-bundled the moving upstream spec, which would fail an unchanged PR on upstream drift.

A diff means the public API changed — types widened or narrowed, an optional field became required (or the reverse), a union variant or enum member was dropped, or exports were added, removed or renamed. Because the public types are generated from the bundled spec, this can come from a spec bump, a `camunda-schema-bundler` bump, or a generator/hook change — not just a hand edit.

When the check fails:

1. If the change is **intentional**: run `npm run api:update`, review the diff in `etc/*.api.md` — it is the public API review surface — and commit it with your PR. If the diff removes or narrows anything, mark the PR as breaking (`BREAKING CHANGE:` footer).
2. If the change is **not intentional**: find the spec/generator/hook change that caused it before merging.

The reports are deterministic — LF-normalized, no timestamps, diagnostic source locations (`dist/<hash>.d.ts:line:col`) stripped, and reachable-but-unexported helper types recorded in full (`includeForgottenExports`) — so a no-op dependency bump or a declaration-comment-only change produces no diff. This check complements the stable-branch API compatibility gate (`scripts/api-compat.ts`), which compares against the last published npm release; the reports catch every public API change relative to the branch's own committed baseline, whether or not it is breaking.

## Commit Message Guidelines

We use Conventional Commits enforced by commitlint.

Format:

```
<type>(optional scope): <subject>

<body>

BREAKING CHANGE: <explanation>
```

Allowed `type` values (common set):

- feat
- fix
- chore
- docs
- style
- refactor
- test
- ci
- build
- perf

Rules:

- Subject length: 5–100 characters (commitlint enforces `subject-min-length` & `subject-max-length`).
- Use imperative mood ("add support", not "added support").
- Lowercase subject (except proper nouns). No PascalCase subjects (rule enforced).
- Keep subject concise; body can include details, rationale, links.
- Prefix breaking changes with `BREAKING CHANGE:` either in body or footer.

Examples:

```
feat(worker): add job worker concurrency gating
fix(retry): prevent double backoff application
chore(ci): stabilize deterministic publish (skip spec fetch)
docs: document deterministic build flag
refactor(auth): simplify token refresh jitter logic
```

### Breaking change commits

Breaking change markers (`BREAKING CHANGE:` in the body/footer) trigger a major version bump and a CHANGELOG entry. **Never** use these markers for intra-branch corrections on a feature branch — they pollute the release history and cause unnecessary major version increments.

PR CI includes a breaking change guard that fails when it detects these markers. If the breaking change is intentional, add the `breaking-change-approved` label to the PR. Otherwise, rewrite the commit history to remove the markers before merging.

## Branching & Releases

Releases are performed by GitHub Actions using semantic-release:

- `main` publishes alpha prereleases.
- `stable/<major>.<minor>` publishes stable patch releases for that minor line.

Use feature branches and PRs; merge commits should follow conventional syntax to produce changelog entries.

To understand what will be released, prefer inspecting the CI logs/artifacts for the release workflow (it runs semantic-release in dry-run mode as part of the pipeline).

## Testing Strategy

- Unit tests: `npm test` (fast, deterministic). Avoid relying on wall-clock timers.
- Integration tests: `npm run test:integration` (requires container stack up; CI spins it automatically in generate job).
- Add test scaffolds for new REST operations via existing generation pipeline; run `npm run scaffold:methods` if needed.

## Validation & Schemas

If adding new runtime validation paths or job worker actions, ensure they integrate cleanly with:

- `CAMUNDA_SDK_VALIDATION` grammar (req/res strict/warn/none)
- Job worker unique symbol receipts (`JobActionReceipt`).

## Performance Considerations

Large generation outputs are committed; avoid unnecessary formatting churn. When modifying templates:

- Keep imports stable.
- Reuse deterministic timestamp injection.
- Avoid introducing non-deterministic ordering (Object.keys without sort, randomization, etc.).

## Adding Dependencies

Prefer lightweight, maintained libraries. Changes affecting bundle size must include justification in PR description.

## Security

Do not log secrets. Redaction logic already masks sensitive env values in hydrated config logs. If adding new secret env vars, update redaction list.

## Code Style

Prettier + ESLint run in build pipeline. Run:

```
npm run format && npm run lint
```

before pushing sizable changes.

## Questions

Open a GitHub issue or start a PR draft with your questions in the description.

Happy hacking!
