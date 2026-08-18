import fs from 'node:fs';
import path from 'node:path';

// Dedupes duplicate string-literal members in the generated `ClientOptions.baseUrl` union type.
//
// The bundled spec merges multiple upstream OpenAPI documents, each declaring its own `servers:`
// entry. When several of those documents specify the identical server URL template (e.g. every
// gateway-protocol file declaring `{schema}://{host}:{port}`), @hey-api/openapi-ts emits one union
// member per source document rather than deduping by value, e.g.:
//
//   baseUrl: '{schema}://{host}:{port}/v2' | '{schema}://{host}:{port}' | '{schema}://{host}:{port}'
//     | '{schema}://{host}:{port}' | '{schema}://{host}:{port}' | (string & {});
//
// This doesn't break typing (duplicate union members are harmless to the type checker) but adds
// noise for SDK consumers reading the type. We dedupe the union members here, preserving the
// first-seen order (including the trailing `(string & {})` catch-all).

const root = process.cwd();
const typesGenPath = path.join(root, 'src/gen/types.gen.ts');

if (!fs.existsSync(typesGenPath)) {
  console.error('[dedupe-baseurl-union] types.gen.ts not found');
  process.exit(0);
}

const source = fs.readFileSync(typesGenPath, 'utf8');

// Matches the single `baseUrl: <union>;` property line inside the `ClientOptions` type. The union
// members are `|`-separated string literals (and possibly the `(string & {})` catch-all), with no
// `|` occurring inside any individual member, so splitting on ` | ` is safe here.
const baseUrlLineRe = /^(\s*baseUrl:\s*)(.+?)(;)$/m;
const match = baseUrlLineRe.exec(source);

if (!match) {
  console.log('[dedupe-baseurl-union] No ClientOptions.baseUrl union found — nothing to patch');
  process.exit(0);
}

const [, prefix, unionBody, suffix] = match;
const members = unionBody.split(' | ');
const seen = new Set<string>();
const deduped: string[] = [];
for (const member of members) {
  if (!seen.has(member)) {
    seen.add(member);
    deduped.push(member);
  }
}

if (deduped.length === members.length) {
  console.log('[dedupe-baseurl-union] No duplicate union members — nothing to patch');
} else {
  const patchedLine = `${prefix}${deduped.join(' | ')}${suffix}`;
  const patched =
    source.slice(0, match.index) + patchedLine + source.slice(match.index + match[0].length);
  fs.writeFileSync(typesGenPath, patched, 'utf8');
  console.log(
    `[dedupe-baseurl-union] Deduped ClientOptions.baseUrl union from ${members.length} to ${deduped.length} member(s) in types.gen.ts`
  );
}
