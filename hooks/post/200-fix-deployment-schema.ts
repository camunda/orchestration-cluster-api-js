#!/usr/bin/env tsx
/**
 * Post-generation patch: fix createDeployment resources schema to accept Blob|File and be non-empty.
 * We modify src/gen/zod.gen.ts in-place after openapi-ts generation.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(process.cwd(), 'src/gen/zod.gen.ts');
if (!fs.existsSync(file)) {
  console.error('[postprocess-deployment-schema] zod.gen.ts not found, skipping');
  process.exit(0);
}
let text = fs.readFileSync(file, 'utf8');

// hey-api 0.86 emits `zCreateDeploymentData` (envelope); 0.96+ emits `zCreateDeploymentBody`
// (body-only). Accept either; fail loud if neither is present so generator upgrades that
// rename the schema again surface immediately instead of silently shipping an unpatched
// File-rejecting resources schema.
const markers = [
  'export const zCreateDeploymentData = z.object({',
  'export const zCreateDeploymentBody = z.object({',
];
const matchedMarker = markers.find((m) => text.indexOf(m) !== -1);
if (!matchedMarker) {
  throw new Error(
    '[postprocess-deployment-schema] No createDeployment schema marker found ' +
      `(looked for: ${markers.join(', ')}). The hey-api generator likely renamed the ` +
      'schema; update this hook to match the new name.'
  );
}
// Regex targets the resources: z.array(z.string())... block inside the createDeployment schema.
const resourcesRegex = /(resources:\s*z\.array\(z\.string\(\)\)[^}]*)/m;
if (!resourcesRegex.test(text)) {
  console.warn(
    '[postprocess-deployment-schema] resources schema pattern not found or already patched'
  );
} else {
  const replacement = `resources: z.array(\n            z.any().refine(\n                (v) => (typeof File !== 'undefined' && v instanceof File),\n                { message: 'Expected File (with a filename & extension)' }\n            )\n        ).nonempty().register(z.globalRegistry, {`;
  text = text.replace(resourcesRegex, replacement);
  fs.writeFileSync(file, text, 'utf8');
  console.log(
    `[postprocess-deployment-schema] patched createDeployment resources schema (matched: ${matchedMarker.slice(13, matchedMarker.indexOf(' = '))})`
  );
}
