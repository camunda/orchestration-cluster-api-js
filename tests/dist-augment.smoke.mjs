// Verifies that the zod augmentation side-effect is preserved in the built dist.
// Fails (throws) if .register is missing, which would happen if tree-shaken away.
import { z } from 'zod';
import '../dist/index.js';

const hasRegister = typeof z.string() /* base */.register === 'function';
if (!hasRegister) {
  console.error('[smoke] zod augmentation missing: .register not found on ZodType prototype');
  process.exit(1);
}
console.log('[smoke] zod augmentation present: .register is available');
