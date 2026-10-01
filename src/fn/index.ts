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
 * methods delegate to these functions. One intentional exception: for operations
 * that take no input (e.g. `getTopology`), the standalone functions honor their
 * `options` argument (`getTopology(core, { retry: false })` disables retry), while
 * the legacy class methods ignore an options argument passed to them
 * (`client.getTopology({ retry: false })` retries as usual) — a quirk preserved for
 * backward compatibility. Bundlers keep only the operations you import,
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
