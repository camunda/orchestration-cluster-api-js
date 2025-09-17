// Factory producing a client with all CamundaKey<T>-branded string types downgraded to plain string.
// Purely a type-level transformation: runtime behavior identical to createCamundaClient.

import { createCamundaClient } from './gen/CamundaClient';

// Detect a branded string of the form string & { readonly __brand: ... }
type IsBrandedKey<T> = T extends string & { readonly __brand: infer _B } ? true : false;

// Transform function parameters & return types recursively.
// We handle promises, arrays, readonly arrays, objects, and functions.
// Note: We relax types only (brand -> string) so casting is safe.
export type Loose<T> =
  // Branded key -> plain string
  IsBrandedKey<T> extends true
    ? string
    : // Promise unwrap & rewrap
      T extends Promise<infer P>
      ? Promise<Loose<P>>
      : // Arrays
        T extends (infer U)[]
        ? Loose<U>[]
        : T extends ReadonlyArray<infer U>
          ? ReadonlyArray<Loose<U>>
          : // Functions
            T extends (...a: infer A) => infer R
            ? (...a: { [I in keyof A]: Loose<A[I]> }) => Loose<R>
            : // Objects (exclude primitives/Date/etc.)
              T extends object
              ? { [K in keyof T]: Loose<T[K]> }
              : // Fallback: leave as-is
                T;

/**
 * Create a client where all branded key types are widened to string.
 * Use when integrating with external systems or when dynamic string keys are common and brand friction is unwanted.
 * For maximum type safety prefer the strict createCamundaClient.
 */
export function createCamundaClientLoose(
  ...args: Parameters<typeof createCamundaClient>
): Loose<ReturnType<typeof createCamundaClient>> {
  const strict = createCamundaClient(...args);
  return strict as unknown as Loose<ReturnType<typeof createCamundaClient>>;
}

export type CamundaClientLoose = ReturnType<typeof createCamundaClientLoose>;
