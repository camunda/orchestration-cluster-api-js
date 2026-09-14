import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Marker-derivation guard (issue #513), scoped to the CLASS of defect rather than
 * the `leaseToken` instance.
 *
 * The `x-present-when: { request, equals }` vendor extension encodes a
 * request→response dependent-presence relationship. `hooks/post/710-derive-present-when.ts`
 * derives dependent typing from every such marker. This test scans the bundled
 * spec for ALL markers and asserts, for each, that the generator emitted the
 * present/absent projection types and rewrote the owning client operation into
 * literal-keyed overloads with a runtime guard.
 *
 * A future second `x-present-when` field therefore cannot be added upstream
 * without this generator deriving its typing too — the same defect class cannot
 * silently recur on a different field.
 */

interface Json {
  [k: string]: any;
}

function load(rel: string): string {
  return readFileSync(join(__dirname, '..', rel), 'utf8');
}

function loadSpec(): Json {
  return JSON.parse(load('external-spec/bundled/rest-api.bundle.json'));
}

interface Marker {
  schemaName: string;
  prop: string;
  request: string;
  equals: unknown;
}

function collectMarkers(spec: Json): Marker[] {
  const markers: Marker[] = [];
  const schemas: Json = spec.components?.schemas ?? {};
  for (const [schemaName, schema] of Object.entries<Json>(schemas)) {
    const props: Json | undefined = schema?.properties;
    if (!props) continue;
    for (const [prop, def] of Object.entries<Json>(props)) {
      const marker = def?.['x-present-when'];
      if (marker && typeof marker === 'object') {
        markers.push({ schemaName, prop, request: marker.request, equals: marker.equals });
      }
    }
  }
  return markers;
}

function pascal(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

describe('x-present-when marker derivation (class-scoped)', () => {
  const spec = loadSpec();
  const markers = collectMarkers(spec);

  it('finds at least one marker (leaseToken is the canonical case)', () => {
    expect(markers.length).toBeGreaterThan(0);
    expect(
      markers.some((m) => m.schemaName === 'ActivatedJobResult' && m.prop === 'leaseToken')
    ).toBe(true);
  });

  it('every marker is well-formed: string request + scalar equals', () => {
    for (const m of markers) {
      expect(typeof m.request).toBe('string');
      expect(['string', 'number', 'boolean']).toContain(typeof m.equals);
    }
  });

  it('emits present + absent projection type aliases for every marker', () => {
    const types = load('src/gen/types.gen.ts');
    for (const m of markers) {
      const present = `${m.schemaName}With${pascal(m.prop)}`;
      const absent = `${m.schemaName}Without${pascal(m.prop)}`;
      expect(types, `missing present projection ${present}`).toContain(`export type ${present} =`);
      expect(types, `missing absent projection ${absent}`).toContain(`export type ${absent} =`);
      // present makes the property required + non-null; absent models the nullable
      // wire shape (the field may be absent or explicitly null, never a real token).
      expect(types).toContain(
        `export type ${present} = Omit<${m.schemaName}, '${m.prop}'> & { ${m.prop}: NonNullable<${m.schemaName}['${m.prop}']> };`
      );
      expect(types).toContain(
        `export type ${absent} = Omit<${m.schemaName}, '${m.prop}'> & { ${m.prop}?: null };`
      );
    }
  });

  it('rewrites the owning client operation into literal-keyed overloads with a runtime guard', () => {
    const client = load('src/gen/CamundaClient.ts');
    for (const m of markers) {
      // Find the operation(s) whose response carries the marked schema as an array
      // and whose request has the marker field. Only these are wired by the hook.
      const opIds = findOwningOperations(spec, m);
      for (const opId of opIds) {
        const present = `${m.schemaName}With${pascal(m.prop)}`;
        // present overload keyed on the literal
        expect(client, `missing present overload for ${opId}`).toMatch(
          new RegExp(`${opId}\\(input: ${opId}Input & \\{ ${m.request}: `)
        );
        expect(client).toContain(present);
        // absent overload: only enumerable for a boolean matcher — the
        // false/null/undefined complement, typed by the Without... projection.
        if (typeof m.equals === 'boolean') {
          const absent = `${m.schemaName}Without${pascal(m.prop)}`;
          expect(client, `missing absent overload for ${opId}`).toMatch(
            new RegExp(`${opId}\\(input: ${opId}Input & \\{ ${m.request}\\?: `)
          );
          expect(client, `missing absent projection ${absent} in overload`).toContain(absent);
        }
        // runtime guard fences newer-client vs older-server. The guard marker is
        // keyed per marker (request field + matched literal + marked property) so
        // that a second marker on the SAME operation cannot be skipped by the
        // first marker's idempotence marker — assert that marker-specific form.
        const litKey = typeof m.equals === 'string' ? JSON.stringify(m.equals) : String(m.equals);
        expect(client, `missing marker-specific runtime guard for ${opId}`).toContain(
          `present-when-guard:${opId}:${m.request}=${litKey}:${m.prop}`
        );
      }
      expect(opIds.length).toBeGreaterThan(0);
    }
  });

  it('guards every marker of a shared operation independently (multi-marker class scope)', () => {
    // The hook keys each runtime guard and each present overload on its own
    // marker, so two markers binding one operation both get wired. Assert the
    // guard marker embeds the request field, literal and property — the parts
    // that distinguish co-located markers — rather than only the operation id.
    const client = load('src/gen/CamundaClient.ts');
    for (const m of markers) {
      for (const opId of findOwningOperations(spec, m)) {
        const litKey = typeof m.equals === 'string' ? JSON.stringify(m.equals) : String(m.equals);
        const bareOpGuard = `present-when-guard:${opId} `;
        // The old operation-only marker form must NOT be emitted (it would let a
        // co-located marker be skipped); only the fully-qualified form is valid.
        expect(client, `bare operation-only guard marker leaked for ${opId}`).not.toContain(
          `/* ${bareOpGuard}*/`
        );
        expect(client).toContain(`present-when-guard:${opId}:${m.request}=${litKey}:${m.prop}`);
      }
    }
  });

  it('every collected marker binds to at least one client operation (generator fails fast otherwise)', () => {
    // Advisory: a marker that binds to zero operations is a silent no-op — the
    // client never honours its declared dependent-presence contract. The
    // generator now throws when this happens, so the derivation output can never
    // ship an unbound marker. This locks that invariant on the real spec.
    for (const m of markers) {
      expect(
        findOwningOperations(spec, m).length,
        `${m.schemaName}.${m.prop} bound to 0 ops`
      ).toBeGreaterThan(0);
    }
  });

  it('narrowed overloads project the generic EnrichedActivatedJobOf, base stays the interface', () => {
    // Back-compat: `EnrichedActivatedJob` is restored to a plain (non-generic)
    // interface so consumers can still declaration-merge / `extends` it. The
    // dependent-presence narrowing is expressed through the generic companion
    // `EnrichedActivatedJobOf<...>` instead of re-parameterising the interface.
    const client = load('src/gen/CamundaClient.ts');
    for (const m of markers) {
      for (const opId of findOwningOperations(spec, m)) {
        // The dynamic-base overload keeps the non-generic interface + array.
        expect(client, `missing base interface array for ${opId}`).toMatch(
          new RegExp(
            `${opId}\\(input: ${opId}Input, options\\?: OperationOptions\\): CancelablePromise<\\{ \\w+: EnrichedActivatedJob\\[\\] \\}>;`
          )
        );
        // The narrowed overloads use the generic projection, never the interface
        // with a type argument (which no longer compiles).
        expect(client, `narrowed overload should use EnrichedActivatedJobOf for ${opId}`).toContain(
          'EnrichedActivatedJobOf<'
        );
        expect(
          client,
          `narrowed overload must not parameterise the interface for ${opId}`
        ).not.toMatch(/EnrichedActivatedJob<[^O]/);
      }
    }
  });

  it('relaxes the marked response property to tolerate absence under strict validation', () => {
    // Threads on PR #514: the marked property is `required` + `nullable` in the
    // spec, so `res:strict`/`res:fanatical` response validation demands the key be
    // present. An older server that predates the feature omits it entirely, which
    // would fail validation BEFORE the dependent-presence terminal guard runs — the
    // worker would then back off forever instead of stopping. The generator relaxes
    // the marked property to `.nullish()` (tolerates absent) so the omitting response
    // passes validation and reaches the terminal guard. Class-scoped over every
    // marker, not just leaseToken.
    const zod = load('src/gen/zod.gen.ts');
    for (const m of markers) {
      const block = zodSchemaBlock(zod, m.schemaName);
      expect(block, `zod schema block z${m.schemaName} not found`).not.toBe('');
      const nullableRe = new RegExp(`\\n\\s*${m.prop}:\\s*[^\\n]*\\.nullable\\(\\)`);
      const nullishRe = new RegExp(`\\n\\s*${m.prop}:\\s*[^\\n]*\\.nullish\\(\\)`);
      expect(
        nullableRe.test(block),
        `${m.schemaName}.${m.prop} must not stay .nullable() (fails strict validation before the terminal guard)`
      ).toBe(false);
      expect(
        nullishRe.test(block),
        `${m.schemaName}.${m.prop} must be relaxed to .nullish() so an omitting server reaches the terminal guard`
      ).toBe(true);
    }
  });

  it('emits no duplicated / stale present-when overloads for an operation (atomic rebuild)', () => {
    // Suppressed advisory on PR #514: an incremental rerun that adds a marker to an
    // already-patched operation must REBUILD the hook-owned overload block, not
    // append beside stale narrower overloads (TypeScript's first-match resolution
    // would then pick a stale overload and drop the new projection). The generated
    // output must therefore never contain a duplicated marker overload line.
    const client = load('src/gen/CamundaClient.ts');
    const seen = new Set<string>();
    for (const m of markers) {
      for (const opId of findOwningOperations(spec, m)) {
        if (seen.has(opId)) continue;
        seen.add(opId);
        const overloadRe = new RegExp(
          `^  ${opId}\\(input: ${opId}Input & \\{[^\\n]*\\}, options\\?: OperationOptions\\): CancelablePromise<[^\\n]*>;$`,
          'gm'
        );
        const lines = client.match(overloadRe) ?? [];
        const counts = new Map<string, number>();
        for (const l of lines) counts.set(l, (counts.get(l) ?? 0) + 1);
        for (const [line, n] of counts) {
          expect(n, `duplicated present-when overload for ${opId}: ${line}`).toBe(1);
        }
      }
    }
  });

  it('imports every EnrichedActivatedJobOf projection it references (import merge invariant)', () => {
    // Thread on PR #514: on an incremental rerun the jobActions import may predate a
    // symbol hook 710 now emits. If the import is not merged, the generated
    // overloads reference an unimported `EnrichedActivatedJobOf` and typechecking
    // fails. Lock the invariant on the generated output: any reference implies an
    // import.
    const client = load('src/gen/CamundaClient.ts');
    if (client.includes('EnrichedActivatedJobOf<')) {
      const importRe = /import \{([^}]*)\} from '\.\.\/runtime\/jobActions';/;
      const imp = client.match(importRe);
      expect(imp, 'jobActions import missing though EnrichedActivatedJobOf is referenced').not.toBe(
        null
      );
      const names = (imp?.[1] ?? '').split(',').map((s) => s.trim());
      expect(names).toContain('EnrichedActivatedJobOf');
    }
  });
});

/** Extract a `z<schemaName>` object body (up to the next top-level export). */
function zodSchemaBlock(zod: string, schemaName: string): string {
  const decl = `export const z${schemaName} = z.object({`;
  const start = zod.indexOf(decl);
  if (start === -1) return '';
  const rest = zod.slice(start + decl.length);
  const next = rest.indexOf('\nexport const ');
  const end = next === -1 ? zod.length : start + decl.length + next;
  return zod.slice(start, end);
}

function findOwningOperations(spec: Json, m: Marker): string[] {
  const ids: string[] = [];
  const paths: Json = spec.paths ?? {};
  for (const methods of Object.values<Json>(paths)) {
    for (const op of Object.values<Json>(methods)) {
      if (!op?.operationId) continue;
      const reqContent = op.requestBody?.content;
      const respContent = op.responses?.['200']?.content;
      if (!reqContent || !respContent) continue;
      const reqSchema = resolve(
        Object.entries<Json>(reqContent).find(([ct]) => /json/i.test(ct))?.[1]?.schema,
        spec
      );
      const hasField = Boolean(reqSchema?.properties?.[m.request]);
      const respSchema = resolve(
        Object.entries<Json>(respContent).find(([ct]) => /json/i.test(ct))?.[1]?.schema,
        spec
      );
      const arrayOf =
        respSchema?.properties &&
        Object.values<Json>(respSchema.properties).some(
          (p) =>
            p?.type === 'array' &&
            typeof p.items?.$ref === 'string' &&
            p.items.$ref.split('/').pop() === m.schemaName
        );
      if (hasField && arrayOf) ids.push(op.operationId);
    }
  }
  return ids;
}

function resolve(schema: Json | undefined, spec: Json): Json | undefined {
  if (!schema) return undefined;
  if (typeof schema.$ref === 'string')
    return spec.components?.schemas?.[schema.$ref.split('/').pop()!];
  return schema;
}
