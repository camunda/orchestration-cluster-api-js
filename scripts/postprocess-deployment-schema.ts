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

const marker = 'export const zCreateDeploymentData = z.object({';
const idx = text.indexOf(marker);
if (idx === -1) {
  console.error('[postprocess-deployment-schema] zCreateDeploymentData not found, skipping');
  process.exit(0);
}
// Regex targets the resources: z.array(z.string())... block inside zCreateDeploymentData body definition.
const resourcesRegex = /(resources:\s*z\.array\(z\.string\(\)\)[^}]*)/m;
if (!resourcesRegex.test(text)) {
  console.warn('[postprocess-deployment-schema] resources schema pattern not found or already patched');
} else {
  const replacement = `resources: z.array(\n            z.any().refine(\n                (v) => (typeof File !== 'undefined' && v instanceof File),\n                { message: 'Expected File (with a filename & extension)' }\n            )\n        ).nonempty().register(z.globalRegistry, {`;
  text = text.replace(resourcesRegex, replacement);
  fs.writeFileSync(file, text, 'utf8');
  console.log('[postprocess-deployment-schema] patched createDeployment resources schema');
}
