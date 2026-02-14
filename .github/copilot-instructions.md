# Copilot instructions (orchestration-cluster-api-js)

This repo generates a TypeScript SDK from a multi-file OpenAPI spec sourced from the Camunda monorepo.

## Key flows (what to run)

- Build (fetches upstream spec): `npm run build`
- Build using already-fetched spec (fast local iteration): `npm run build:local`
- Only regenerate the bundled OpenAPI spec: `npm run bundle:spec`

Generation pipeline (high level):

1. `camunda-schema-bundler` → fetch upstream YAML (sparse clone) + bundle → `external-spec/bundled/rest-api.bundle.json` + `spec-metadata.json`
2. `scripts/run-pipeline.ts` orchestrates numbered hooks:
   - `hooks/pre/*` → preprocessing (branding metadata from spec-metadata.json)
   - `@hey-api/openapi-ts` → generate `src/gen/*` (types, zod, sdk)
   - `hooks/post/*` → postprocessing (index fix, deployment schema, class methods, facade, validation gate, zod augment, activate-jobs enrichment, test scaffolds)
   - Tests
3. `tsup --dts` → dist bundles + declaration output

Hooks are numbered (100, 200, …) and run in lexicographic order. To add a new step, create a file in `hooks/pre/` or `hooks/post/` with an appropriate number.

If you are debugging generation issues, prefer reproducing with `npm run build:local` to avoid fetch noise.

## Where things live

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
