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

## Deterministic Build

To verify release integrity we support deterministic builds:

```
CAMUNDA_SDK_DETERMINISTIC_BUILD=1 npm run build
```

This forces timestamps to the fixed epoch `1970-01-01T00:00:00.000Z`.

Publish workflow also sets:

```
CAMUNDA_SDK_SKIP_FETCH_SPEC=1
```

so it does not refetch the upstream REST API spec during the final integrity check (preventing mid‑release drift).

If you change generation scripts, ensure they honor `CAMUNDA_SDK_DETERMINISTIC_BUILD` for any time‑based fields.

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

## Branching & Releases

Semantic-release publishes from `main` only. Use feature branches and PRs; merge commits should follow conventional syntax to produce changelog entries.

Dry-run release locally:

```
CAMUNDA_SDK_DETERMINISTIC_BUILD=1 npx semantic-release --dry-run
```

(Will report no publication if not on `main`.)

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
