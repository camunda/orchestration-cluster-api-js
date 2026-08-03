import fs from 'node:fs';
import path from 'node:path';

// Restores OpenAPI `discriminator` information that the generator drops.
//
// For a schema that is `oneOf` + `discriminator`, @hey-api/openapi-ts 0.86
// always materialised the discriminator into the union:
//
//   export type JobResult = ({ type: 'userTask' } & JobResultUserTask)
//                         | ({ type: 'adHocSubProcess' } & JobResultAdHocSubProcess);
//   export const zJobResult = z.union([
//     z.object({ type: z.literal('userTask') }).and(zJobResultUserTask), ...
//   ]);
//
// From 0.99 it only does so when the discriminator property is declared
// *required* on each member schema. The Camunda spec declares it optional and
// loosely typed (`type?: string`) on some members, so those unions degraded to:
//
//   export type JobResult = JobResultUserTask | JobResultAdHocSubProcess;
//   export const zJobResult = z.union([zJobResultUserTask, zJobResultAdHocSubProcess]);
//
// Because every member property is optional, that union is no longer
// discriminated: TypeScript accepts a result with the discriminator missing or
// misspelled, and the zod schema accepts `{}`. A worker can complete a job with
// a result the broker cannot classify, and neither the compiler nor
// `CAMUNDA_SDK_VALIDATION=req:strict` says a word. See issue #405 (audit of the
// 0.86.12 -> 0.99.0 generator upgrade).
//
// This hook is spec-driven rather than hard-coded: it walks every `oneOf` +
// `discriminator` schema in the bundled spec and rewrites only those whose
// emitted union has lost the discriminator, so a newly added discriminated
// union is covered automatically. Unions the generator already emits correctly
// — as an intersection or as `z.discriminatedUnion(...)` — are left untouched.
//
// The real fix belongs upstream in the Camunda spec: add the discriminator
// property to each member's `required` list and type it as an enum of the
// mapping keys. Once that lands, this hook becomes a no-op (it reports each
// union it leaves alone).

const root = process.cwd();
const SPEC = path.join(root, 'external-spec/bundled/rest-api.bundle.json');
const TYPES = path.join(root, 'src/gen/types.gen.ts');
const ZOD = path.join(root, 'src/gen/zod.gen.ts');

for (const f of [SPEC, TYPES, ZOD]) {
  if (!fs.existsSync(f)) {
    console.error(`[restore-discriminators] ${path.relative(root, f)} not found — skipping`);
    process.exit(0);
  }
}

interface Union {
  /** Schema name as it appears in components.schemas. */
  name: string;
  /** Discriminator property name, e.g. `type`. */
  prop: string;
  /** Literal value -> member schema name, in mapping order. */
  members: Array<{ literal: string; member: string }>;
}

const spec = JSON.parse(fs.readFileSync(SPEC, 'utf8'));
const schemas: Record<string, any> = spec.components?.schemas ?? {};

const refName = (ref: string) => ref.replace(/^#\/components\/schemas\//, '');

const unions: Union[] = [];
for (const [name, schema] of Object.entries(schemas)) {
  const disc = (schema as any)?.discriminator;
  if (!disc?.propertyName || !disc.mapping || !Array.isArray((schema as any).oneOf)) continue;
  const members = Object.entries(disc.mapping as Record<string, string>).map(([literal, ref]) => ({
    literal,
    member: refName(ref),
  }));
  if (members.length) unions.push({ name, prop: disc.propertyName, members });
}

if (!unions.length) {
  console.error(
    '[restore-discriminators] no `oneOf` + `discriminator` schemas found in the bundled spec — ' +
      'the spec shape may have changed; review this hook.'
  );
  process.exit(1);
}

/**
 * Replace the body of `export <kind> <name> = ...;` with `replacement`, keeping
 * any preceding JSDoc intact. Returns null when the declaration is absent.
 */
function replaceExport(
  src: string,
  kind: 'type' | 'const',
  name: string,
  replacement: string
): { src: string; body: string } | null {
  const head = `export ${kind} ${name} = `;
  const start = src.indexOf(`\n${head}`);
  if (start === -1) return null;
  const bodyStart = start + 1 + head.length;
  // Scan to the `;` that closes the declaration, respecting nesting and strings.
  let depth = 0;
  let i = bodyStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') depth--;
    else if (c === ';' && depth === 0) break;
    else if (c === "'" || c === '"' || c === '`') {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') i++;
        i++;
      }
    }
  }
  const body = src.slice(bodyStart, i);
  return { src: src.slice(0, bodyStart) + replacement + src.slice(i), body };
}

let typesSrc = fs.readFileSync(TYPES, 'utf8');
let zodSrc = fs.readFileSync(ZOD, 'utf8');

const patchedTypes: string[] = [];
const patchedZod: string[] = [];
const alreadyOk: string[] = [];
const problems: string[] = [];

for (const u of unions) {
  // ---- TypeScript ------------------------------------------------------
  // Correct output mentions every literal as a property type on the union.
  const tsHasAll = (body: string) =>
    u.members.every((m) => new RegExp(`${u.prop}\\??\\s*:\\s*'${m.literal}'`).test(body));

  const tsReplacement = u.members
    .map((m) => `({\n    ${u.prop}: '${m.literal}';\n} & ${m.member})`)
    .join(' | ');

  const tsPeek = replaceExport(typesSrc, 'type', u.name, tsReplacement);
  if (!tsPeek) {
    problems.push(`type ${u.name}: declaration not found in types.gen.ts`);
  } else if (tsHasAll(tsPeek.body)) {
    alreadyOk.push(`type ${u.name}`);
  } else if (u.members.some((m) => !new RegExp(`\\b${m.member}\\b`).test(typesSrc))) {
    problems.push(`type ${u.name}: a member type from the discriminator mapping is not emitted`);
  } else {
    typesSrc = tsPeek.src;
    patchedTypes.push(u.name);
  }

  // ---- Zod -------------------------------------------------------------
  // Correct output is either `z.discriminatedUnion('<prop>', ...)` or an
  // intersection carrying `<prop>: z.literal('<lit>')` for every member.
  const zName = `z${u.name}`;
  const zodHasAll = (body: string) =>
    new RegExp(`z\\.discriminatedUnion\\(\\s*'${u.prop}'`).test(body) ||
    u.members.every((m) => new RegExp(`${u.prop}:\\s*z\\.literal\\('${m.literal}'\\)`).test(body));

  const zodArms = u.members.map(
    (m) => `z.object({\n        ${u.prop}: z.literal('${m.literal}')\n    }).and(z${m.member})`
  );
  const zodReplacement =
    zodArms.length === 1 ? zodArms[0] : `z.union([\n    ${zodArms.join(',\n    ')}\n])`;

  const zodPeek = replaceExport(zodSrc, 'const', zName, zodReplacement);
  if (!zodPeek) {
    problems.push(`const ${zName}: declaration not found in zod.gen.ts`);
  } else if (zodHasAll(zodPeek.body)) {
    alreadyOk.push(`const ${zName}`);
  } else if (u.members.some((m) => !new RegExp(`\\bz${m.member}\\b`).test(zodSrc))) {
    problems.push(`const ${zName}: a member schema from the discriminator mapping is not emitted`);
  } else {
    zodSrc = zodPeek.src;
    patchedZod.push(zName);
  }
}

if (problems.length) {
  console.error('[restore-discriminators] could not reconcile some discriminated unions:');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('  The generator output shape may have changed; review this hook.');
  process.exit(1);
}

if (patchedTypes.length) fs.writeFileSync(TYPES, typesSrc, 'utf8');
if (patchedZod.length) fs.writeFileSync(ZOD, zodSrc, 'utf8');

console.log(
  `[restore-discriminators] ${unions.length} discriminated union(s) in spec; ` +
    `${alreadyOk.length} already correct, ` +
    `${patchedTypes.length + patchedZod.length} restored`
);
if (patchedTypes.length) console.log(`  types.gen.ts: ${patchedTypes.join(', ')}`);
if (patchedZod.length) console.log(`  zod.gen.ts:   ${patchedZod.join(', ')}`);
