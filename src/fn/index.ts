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
 * methods delegate to these functions. Operations that take no input accept the
 * `OperationOptions` object as the function's second argument (`getTopology(core,
 * { retry: false })`) and, on the class, as the method's single argument
 * (`client.getTopology({ retry: false })`). Bundlers keep only the operations you
 * import, plus the zod schemas those operations validate with (loaded lazily, and
 * only when validation is enabled).
 *
 * One bundler limitation: this relies on the bundler tree-shaking dead dynamic-`import()`
 * targets (Rollup, or esbuild without code splitting). esbuild's `splitting: true` mode
 * retains the `import()` targets of unimported operations, so a code-split esbuild build
 * may still include schema chunks for operations you did not import; prefer an unsplit
 * build (or Rollup) when minimal bundles matter.
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
