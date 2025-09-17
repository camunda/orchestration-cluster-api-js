// Runtime augmentation for generated zod schemas.
// Provides z.globalRegistry and a no-op .register() chainable method to avoid runtime errors
// when the upstream augmentation package is not present.
import { z } from 'zod';

// We purposefully do NOT attach a real globalRegistry onto the z export to avoid mutating a frozen object.
// Generated code passes (z as any).globalRegistry into .register; we accept an undefined registry.

// Prototype shim for chainable .register(registry, meta?) returning same schema.
try {
  const proto: any = (z as any).ZodType?.prototype;
  if (proto && !Object.prototype.hasOwnProperty.call(proto, 'register')) {
    Object.defineProperty(proto, 'register', {
      value: function (_registry: unknown, meta?: { description?: string }) {
        // If description provided and no explicit description already, apply via .describe
        if (meta && (meta as any).description && typeof this.describe === 'function') {
          try {
            return (this as any).describe((meta as any).description);
          } catch {
            /* ignore */
          }
        }
        return this;
      },
      configurable: true,
      writable: false,
    });
  }
} catch {
  /* ignore */
}

// Dummy export to force bundlers (tsup/esbuild) to retain this module even when
// package.json sets "sideEffects": false. A bare import would otherwise be tree-shaken
// and the prototype patch below (adding .register) would be lost, breaking generated
// schema code that calls .register().
export const __zodAugmentApplied = true;

export {}; // ensure this is a module
