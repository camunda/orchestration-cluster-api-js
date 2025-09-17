import fs from 'fs';
import path from 'path';

// Rewrites the side-effect import of zod-augment in generated zod.gen.ts into
// a named import that references a dummy export, ensuring retention under tree-shaking.
// This script should be invoked after openapi generation and any branding postprocess.

const root = process.cwd();
const zodGenPath = path.join(root, 'src/gen/zod.gen.ts');

if (!fs.existsSync(zodGenPath)) {
  console.error('[postprocess-zod-augment] zod.gen.ts not found');
  process.exit(0);
}

let source = fs.readFileSync(zodGenPath, 'utf8');

// Only rewrite if we still have the bare side-effect import form.
const sideEffectImport = /import '\.\.\/zod-augment';/;
if (sideEffectImport.test(source) && !/__zodAugmentApplied/.test(source)) {
  source = source.replace(sideEffectImport, "import { __zodAugmentApplied } from '../zod-augment';\nvoid __zodAugmentApplied; // ensure module retained for prototype patch");
  fs.writeFileSync(zodGenPath, source, 'utf8');
  console.log('[postprocess-zod-augment] Rewrote zod augmentation import to retain side-effect');
} else {
  console.log('[postprocess-zod-augment] No rewrite needed');
}
