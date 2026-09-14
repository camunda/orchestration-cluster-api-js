#!/usr/bin/env tsx
/**
 * Post-generation hook: derive request→response dependent typing from the
 * `x-present-when` vendor extension (upstream camunda/camunda#62777).
 *
 * OpenAPI 3.x cannot express that a response property's presence depends on a
 * request field, so every generated SDK types such properties as always-nullable.
 * The `x-present-when: { request: <F>, equals: <V> }` marker — placed on the
 * response property — is the ground truth from which we derive the dependent
 * projection rather than hardcoding the relationship. The canonical (and, as of
 * writing, only) case is `ActivatedJobResult.leaseToken`, present iff the
 * activation request carried `withLease: true`.
 *
 * This hook is fully **marker-driven**: it scans the bundled spec for every
 * `x-present-when` marker and, for each, emits present/absent projection type
 * aliases and rewrites the owning operation's client method into literal-keyed
 * overloads (present / absent / dynamic-base), per §2.21 of the upstream REST API
 * endpoint guidelines. A second `x-present-when` field added upstream is handled
 * without touching this hook.
 *
 * Wire-inert: the marker never changes the bundled schema, so the emitted types
 * are a pure client-typing refinement.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPEC_PATH = path.join(ROOT, 'external-spec/bundled/rest-api.bundle.json');
const TYPES_PATH = path.join(ROOT, 'src/gen/types.gen.ts');
const CLIENT_PATH = path.join(ROOT, 'src/gen/CamundaClient.ts');
const ZOD_PATH = path.join(ROOT, 'src/gen/zod.gen.ts');

type Json = Record<string, any>;

interface PresentWhenMarker {
  /** Schema that directly owns the conditionally-present property. */
  schemaName: string;
  /** The conditionally-present property name. */
  prop: string;
  /** Top-level request field the presence depends on. */
  requestField: string;
  /** Scalar literal the request field must equal for the property to be present. */
  equals: string | number | boolean;
}

interface OperationBinding {
  operationId: string;
  /** Response array property whose items are the marked schema (e.g. `jobs`). */
  arrayProp: string;
}

function refName(ref: string): string {
  return ref.split('/').pop() as string;
}

function resolveSchema(schema: Json | undefined, spec: Json): Json | undefined {
  if (!schema) return undefined;
  if (typeof schema.$ref === 'string') {
    return spec.components?.schemas?.[refName(schema.$ref)];
  }
  return schema;
}

function pascal(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function scalarLiteral(v: string | number | boolean): string {
  return typeof v === 'string' ? JSON.stringify(v) : String(v);
}

/** Collect every `x-present-when` marker across the bundled component schemas. */
function collectMarkers(spec: Json): PresentWhenMarker[] {
  const markers: PresentWhenMarker[] = [];
  const schemas: Json = spec.components?.schemas ?? {};
  for (const [schemaName, schema] of Object.entries<Json>(schemas)) {
    const props: Json | undefined = schema?.properties;
    if (!props) continue;
    for (const [prop, def] of Object.entries<Json>(props)) {
      const marker = def?.['x-present-when'];
      if (!marker || typeof marker !== 'object') continue;
      const requestField = marker.request;
      if (typeof requestField !== 'string') {
        throw new Error(
          `[present-when] ${schemaName}.${prop}: malformed marker — 'request' must be a string`
        );
      }
      if (!('equals' in marker)) {
        throw new Error(
          `[present-when] ${schemaName}.${prop}: malformed marker — missing 'equals'`
        );
      }
      const equals = marker.equals;
      const t = typeof equals;
      if (t !== 'string' && t !== 'number' && t !== 'boolean') {
        throw new Error(
          `[present-when] ${schemaName}.${prop}: malformed marker — 'equals' must be a scalar`
        );
      }
      markers.push({ schemaName, prop, requestField, equals });
    }
  }
  return markers;
}

/** Does the (resolved) request-body schema expose `field` as a top-level property? */
function requestHasField(opSchema: Json | undefined, field: string, spec: Json): boolean {
  const resolved = resolveSchema(opSchema, spec);
  if (!resolved) return false;
  const variants = (resolved.oneOf || resolved.anyOf) as Json[] | undefined;
  if (Array.isArray(variants)) {
    return variants.some((v) => requestHasField(v, field, spec));
  }
  return Boolean(resolved.properties?.[field]);
}

/**
 * Find, in the operation's 200 response, an array property whose items resolve to
 * `schemaName`. Returns the array property name (e.g. `jobs`) or null.
 */
function responseArrayOf(
  responseSchema: Json | undefined,
  schemaName: string,
  spec: Json
): string | null {
  const resolved = resolveSchema(responseSchema, spec);
  const props: Json | undefined = resolved?.properties;
  if (!props) return null;
  for (const [prop, def] of Object.entries<Json>(props)) {
    if (def?.type === 'array' && def.items) {
      const items = def.items;
      if (typeof items.$ref === 'string' && refName(items.$ref) === schemaName) return prop;
    }
  }
  return null;
}

/** Locate the operation(s) whose request carries `requestField` and whose 200 response contains the marked schema as an array. */
function bindOperations(marker: PresentWhenMarker, spec: Json): OperationBinding[] {
  const bindings: OperationBinding[] = [];
  const paths: Json = spec.paths ?? {};
  for (const methods of Object.values<Json>(paths)) {
    for (const op of Object.values<Json>(methods)) {
      if (!op || typeof op !== 'object' || !op.operationId) continue;
      const reqContent = op.requestBody?.content;
      if (!reqContent) continue;
      const reqSchema = Object.entries<Json>(reqContent).find(([ct]) => /json/i.test(ct))?.[1]
        ?.schema;
      if (!requestHasField(reqSchema, marker.requestField, spec)) continue;
      const respContent = op.responses?.['200']?.content;
      if (!respContent) continue;
      const respSchema = Object.entries<Json>(respContent).find(([ct]) => /json/i.test(ct))?.[1]
        ?.schema;
      const arrayProp = responseArrayOf(respSchema, marker.schemaName, spec);
      if (arrayProp) bindings.push({ operationId: op.operationId, arrayProp });
    }
  }
  return bindings;
}

/** Every non-empty subset of `items`, used to enumerate marker combinations. */
function nonEmptySubsets<T>(items: T[]): T[][] {
  const out: T[][] = [];
  const n = items.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    const subset: T[] = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(items[i]);
    out.push(subset);
  }
  return out;
}

function presentTypeName(m: PresentWhenMarker): string {
  return `${m.schemaName}With${pascal(m.prop)}`;
}
function absentTypeName(m: PresentWhenMarker): string {
  return `${m.schemaName}Without${pascal(m.prop)}`;
}

/** Emit present/absent projection type aliases into types.gen.ts. */
function emitProjectionTypes(markers: PresentWhenMarker[]): void {
  let src = fs.readFileSync(TYPES_PATH, 'utf8');
  const marker = '// ---- x-present-when dependent-presence projections (generated) ----';
  const startIdx = src.indexOf(marker);
  if (startIdx !== -1) src = `${src.slice(0, startIdx).replace(/\n+$/, '')}\n`;

  const blocks: string[] = [marker];
  for (const m of markers) {
    const present = presentTypeName(m);
    const absent = absentTypeName(m);
    blocks.push(
      `/** \`${m.schemaName}\` when \`${m.requestField} === ${scalarLiteral(
        m.equals
      )}\`: \`${m.prop}\` is present (required, non-null). */`,
      `export type ${present} = Omit<${m.schemaName}, '${m.prop}'> & { ${m.prop}: NonNullable<${m.schemaName}['${m.prop}']> };`,
      `/** \`${m.schemaName}\` when \`${m.requestField}\` is absent / a non-matching literal: \`${m.prop}\` is null (the nullable wire shape). */`,
      `export type ${absent} = Omit<${m.schemaName}, '${m.prop}'> & { ${m.prop}?: null };`
    );
  }
  src = `${src.replace(/\n+$/, '')}\n\n${blocks.join('\n')}\n`;
  fs.writeFileSync(TYPES_PATH, src, 'utf8');
}

/**
 * Rewrite the enriched client declaration for a bound operation into literal-keyed
 * overloads, and inject a runtime guard that fails loudly when a lease was
 * requested but the server (an older version) returned no token.
 */
function patchClient(markers: PresentWhenMarker[], spec: Json): number {
  let src = fs.readFileSync(CLIENT_PATH, 'utf8');
  let patched = 0;
  const usedTypes = new Set<string>();
  // Markers that were successfully rewritten into overloads. Any collected marker
  // NOT in this set — because it bound to zero operations, or its operation's
  // enriched declaration was not found — is a silent no-op we must fail on
  // (below), rather than shipping a marker the client never honours.
  const boundMarkers = new Set<PresentWhenMarker>();

  // Group markers by the operation they bind. A single operation can carry
  // several `x-present-when` markers (the hook is class-scoped, not hardcoded to
  // one field); they must be emitted as ONE coherent set of overloads so a call
  // satisfying multiple literals narrows *every* dependent field, not just the
  // first-declared one.
  interface OperationGroup {
    method: string;
    arr: string;
    markers: PresentWhenMarker[];
  }
  const groups = new Map<string, OperationGroup>();
  for (const m of markers) {
    for (const binding of bindOperations(m, spec)) {
      const key = `${binding.operationId}::${binding.arrayProp}`;
      let g = groups.get(key);
      if (!g) {
        g = { method: binding.operationId, arr: binding.arrayProp, markers: [] };
        groups.set(key, g);
      }
      g.markers.push(m);
    }
  }

  for (const g of groups.values()) {
    const { method, arr } = g;
    // The enriched single declaration emitted by hook 700, e.g.:
    //   activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;
    const declRe = new RegExp(
      `  ${method}\\(input: (${method}Input), options\\?: OperationOptions\\): CancelablePromise<\\{ ${arr}: (\\w+)\\[\\] \\}>;`
    );
    const declMatch = src.match(declRe);
    if (!declMatch) continue;
    const inputType = declMatch[1];
    const element = declMatch[2];

    // Enumerate every non-empty subset of this operation's markers, MOST-specific
    // (largest) first, so TypeScript's first-match overload resolution picks the
    // projection that narrows the most dependent fields for a call satisfying
    // several literals. The projection for a subset is the intersection of each
    // marker's present type.
    const subsets = nonEmptySubsets(g.markers).sort((a, b) => b.length - a.length);
    const localTypes = new Set<string>();
    const presentOverloads = subsets.map((subset) => {
      const constraint = subset
        .map((m) => `${m.requestField}: ${scalarLiteral(m.equals)}`)
        .join('; ');
      const projection = subset
        .map((m) => {
          const t = presentTypeName(m);
          localTypes.add(t);
          return t;
        })
        .join(' & ');
      return `  ${method}(input: ${inputType} & { ${constraint} }, options?: OperationOptions): CancelablePromise<{ ${arr}: ${element}Of<${projection}>[] }>;`;
    });

    // Idempotence (group-specific): if the most-specific present overload is
    // already spliced, this operation was handled on a previous run — skip
    // re-splicing. The projection names it needs are already imported.
    if (src.includes(presentOverloads[0])) {
      for (const m of g.markers) boundMarkers.add(m);
      patched++;
      continue;
    }
    for (const t of localTypes) usedTypes.add(t);

    // Atomically rebuild the hook-owned overload block: strip any present/absent
    // overloads this hook emitted for THIS operation on a previous run before
    // re-splicing the current group. Without this, adding a new marker to an
    // already-patched operation leaves the prior (narrower) marker overloads
    // sitting ABOVE the base declaration; TypeScript's first-match overload
    // resolution then selects a stale overload and omits the newly added
    // projection (e.g. an existing marker-A overload wins before the new A+B
    // overload). The base declaration (no `& { … }` intersection) is preserved —
    // it is re-appended below as the dynamic default. Idempotent: a pure rerun
    // short-circuits above, so this only runs when the group genuinely changed.
    const staleOverloadRe = new RegExp(
      `^  ${method}\\(input: ${inputType} & \\{[^\\n]*\\}, options\\?: OperationOptions\\): CancelablePromise<\\{ ${arr}: \\w+Of<[^\\n]*>\\[\\] \\}>;\\n`,
      'gm'
    );
    src = src.replace(staleOverloadRe, '');

    const overloads: string[] = [...presentOverloads];
    // absent: only enumerable for a lone boolean matcher (its complement). With
    // several markers the complement is not a single literal, so the dynamic base
    // overload (safe nullable default) covers it.
    if (g.markers.length === 1 && typeof g.markers[0].equals === 'boolean') {
      const m = g.markers[0];
      const absent = absentTypeName(m);
      usedTypes.add(absent);
      overloads.push(
        `  ${method}(input: ${inputType} & { ${m.requestField}?: ${scalarLiteral(
          !m.equals
        )} | null | undefined }, options?: OperationOptions): CancelablePromise<{ ${arr}: ${element}Of<${absent}>[] }>;`
      );
    }
    // dynamic base: unchanged nullable projection (safe default).
    overloads.push(declMatch[0]);
    src = src.replace(declMatch[0], overloads.join('\n'));

    // Runtime guards: newer client requested a dependent field against an older
    // server that ignores it and returns no value → fail fast, don't mis-type.
    // One guard per marker, each keyed on its own request field, literal and
    // marked property so a second marker on the same operation is NOT skipped by
    // the first marker's idempotence marker.
    const enrichAnchor = `if (data && data.${arr}) { data.${arr} = data.${arr}.map(`;
    if (src.includes(enrichAnchor)) {
      for (const m of g.markers) {
        const f = m.requestField;
        const lit = scalarLiteral(m.equals);
        const guardMark = `/* present-when-guard:${method}:${f}=${lit}:${m.prop} */`;
        if (src.includes(guardMark)) continue;
        // Build the message as a real JS string, then JSON.stringify it for
        // embedding so any literal/property value (e.g. one containing a quote)
        // yields valid TypeScript rather than a broken single-quoted string.
        const message = `${method}: ${f}=${lit} was requested but the server returned an item without '${m.prop}' — the server may predate this feature. Refusing to silently mis-type the dependent field.`;
        const guard = `${guardMark} if (data && data.${arr} && _body && (_body as any).${f} === ${lit}) { for (const _el of data.${arr}) { if (_el.${m.prop} == null) { const _e: any = new Error(${JSON.stringify(
          message
        )}); _e.name = 'PresentWhenUnsupportedError'; _e.nonRetryable = true; throw _e; } } }\n        `;
        src = src.replace(enrichAnchor, guard + enrichAnchor);
      }
    }
    for (const m of g.markers) boundMarkers.add(m);
    patched++;
  }

  // Fail-fast: a collected marker that produced no overloads is a silent no-op —
  // e.g. it bound to no operation (its request field / response array-of-schema
  // shape was not recognised), or the operation's enriched declaration was not
  // found. Shipping such a marker means the client never honours the declared
  // dependent-presence contract, so refuse to generate rather than emit a spec
  // whose typing silently diverges from the marker.
  const unbound = markers.filter((m) => !boundMarkers.has(m));
  if (unbound.length > 0) {
    const list = unbound.map((m) => `${m.schemaName}.${m.prop}⇐${m.requestField}`).join(', ');
    throw new Error(
      `[present-when] ${unbound.length} marker(s) bound to zero client operations: ${list}. ` +
        `Each x-present-when marker must resolve to an operation whose 200 response exposes ` +
        `the marked schema as an array property and whose request carries the dependency field. ` +
        `Fix the marker or extend the binding logic — refusing to emit an unhonoured contract.`
    );
  }

  // Ensure the projection types used by the overloads are imported. They live in
  // the same generated `types.gen` module the client already imports named types
  // from. Merge newly-discovered names into an existing marked import (an
  // incremental rerun that adds a marker must not leave new aliases unimported).
  if (usedTypes.size > 0) {
    const importMark = '// present-when projection imports';
    const importRe =
      /import type \{ ([^}]*) \} from '\.\.\/gen\/types\.gen'; \/\/ present-when projection imports/;
    const existing = src.match(importRe);
    const names = new Set<string>(usedTypes);
    if (existing) {
      for (const n of existing[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        names.add(n);
    }
    const importLine = `import type { ${[...names].sort().join(', ')} } from '../gen/types.gen'; ${importMark}`;
    if (existing) {
      src = src.replace(existing[0], importLine);
    } else {
      const anchor =
        "import type { ProcessInstanceKey, ScopeKey, TenantId, VariableFilter } from '../gen/types.gen';";
      if (src.includes(anchor)) {
        src = src.replace(anchor, `${anchor}\n${importLine}`);
      } else {
        // Fallback: insert after the first import statement.
        src = src.replace(/(^import .*?;\n)/m, `$1${importLine}\n`);
      }
    }
  }

  fs.writeFileSync(CLIENT_PATH, src, 'utf8');
  return patched;
}

/**
 * Relax the marked response property in the generated zod schema from
 * `.nullable()` to `.nullish()`.
 *
 * The marked property is `required` + `nullable` in the spec, so
 * `CAMUNDA_SDK_VALIDATION=res:strict` / `res:fanatical` response validation
 * demands the key be present (value `null` or a token). An older server that
 * predates the feature omits the key *entirely*, which would fail response
 * validation BEFORE the dependent-presence terminal guard (injected after
 * `gateResponse`) ever runs — the workers would then treat the contract mismatch
 * as an ordinary, transient activation failure and back off forever instead of
 * stopping. `.nullish()` additionally accepts an absent key, so the omitting
 * response passes validation and reaches the terminal `PresentWhenUnsupportedError`
 * guard, preserving the advertised non-retryable stop across every validation
 * mode. `.nullish()` is strictly more permissive than `.nullable()`, so the
 * present-null and present-token cases still validate unchanged.
 *
 * Idempotent: once a property is `.nullish()`, the `.nullable()` form is gone and
 * a rerun is a no-op.
 */
function relaxMarkedPropsInZod(markers: PresentWhenMarker[]): void {
  if (!fs.existsSync(ZOD_PATH)) return;
  let src = fs.readFileSync(ZOD_PATH, 'utf8');
  let changed = false;
  for (const m of markers) {
    const constDecl = `export const z${m.schemaName} = z.object({`;
    const start = src.indexOf(constDecl);
    if (start === -1) continue;
    // Scope the replacement to THIS schema's object body (up to the next
    // top-level `export const`), so a same-named property on another schema
    // (e.g. request schemas that already use `.nullish()`) is untouched.
    const rest = src.slice(start + constDecl.length);
    const nextExport = rest.indexOf('\nexport const ');
    const end = nextExport === -1 ? src.length : start + constDecl.length + nextExport;
    const block = src.slice(start, end);
    const propRe = new RegExp(`(\\n\\s*${m.prop}:\\s*[^\\n]*?)\\.nullable\\(\\)`);
    if (propRe.test(block)) {
      const patched = block.replace(propRe, '$1.nullish()');
      src = src.slice(0, start) + patched + src.slice(end);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(ZOD_PATH, src, 'utf8');
}

function main(): void {
  if (!fs.existsSync(SPEC_PATH)) {
    console.log('[present-when] bundled spec not found, skipping');
    return;
  }
  const spec: Json = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const markers = collectMarkers(spec);
  if (markers.length === 0) {
    console.log('[present-when] no x-present-when markers found, skipping');
    return;
  }
  console.log(
    `[present-when] ${markers.length} marker(s): ${markers
      .map((m) => `${m.schemaName}.${m.prop}⇐${m.requestField}`)
      .join(', ')}`
  );
  emitProjectionTypes(markers);
  relaxMarkedPropsInZod(markers);
  const patched = patchClient(markers, spec);
  console.log(`[present-when] emitted projections; patched ${patched} client operation(s)`);
}

main();
