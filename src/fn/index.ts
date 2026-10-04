/**
 * Standalone, tree-shakeable operation functions.
 *
 * ```ts
 * import { createCamundaCore, getTopology } from '@camunda8/orchestration-cluster-api/fn';
 *
 * const core = createCamundaCore(); // same options as createCamundaClient()
 * const topology = await getTopology(core);
 * ```
 *
 * Each function takes the core as its first argument, then exactly the arguments of
 * the `CamundaClient` method of the same name, and behaves identically: the class
 * methods delegate to these functions. The one exception is operations that take no
 * input: there the function's second argument is the `OperationOptions` object
 * (`getTopology(core, { retry: false })` applies the options), whereas the class
 * method keeps its historical `(arg?, options?)` signature and binds a lone object
 * to the unused `arg` — so `client.getTopology({ retry: false })` ignores it. Pass
 * options to such class methods as the second argument (`client.getTopology(undefined,
 * { retry: false })`). Bundlers keep only the operations you import,
 * plus the zod schemas those operations validate with (loaded lazily, and only when
 * validation is enabled).
 *
 * A `CamundaClient` is also a `CamundaCore`, so these functions accept an existing
 * client too.
 *
 * @module
 */
export * from '../gen/operations.gen';
export { CamundaCore, type CamundaOptions, createCamundaCore } from '../runtime/camundaCore';
export type { CancelablePromise } from '../runtime/cancelable';
export type { OperationOptions } from '../runtime/retry';
