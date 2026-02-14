// Entry point: export Camunda class, key types, and errors.
import { createCamundaClient, CamundaClient } from './gen/CamundaClient';
import { createCamundaClientLoose, type CamundaClientLoose, type Loose } from './loose';
// Public re-exports for worker API
export type { JobWorkerConfig, JobWorker, Job, JobActionReceipt } from './runtime/jobWorker';
export { JobActionReceipt as JobActionReceiptSymbol } from './runtime/jobWorker';

export {
  createCamundaResultClient,
  type CamundaResultClient,
  type Result,
  isOk,
  isErr,
} from './resultClient';
export { createCamundaFpClient, type CamundaFpClient, type Either, isLeft, isRight } from './fp-ts';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';
// Re-export all public types from CamundaClient (Input, Consistency, CancelablePromise, etc.)
export * from './gen/CamundaClient';
// eventualPoll unified with result mode; no separate export
export {
  createCamundaClientLoose,
  type CamundaClientLoose,
  type Loose,
};
export type { EnrichedActivatedJob } from './runtime/jobActions';
// Runtime types used in public signatures
export type { CamundaConfig, AuthStrategy, ValidationMode } from './runtime/unifiedConfiguration';
export type { SupportLogger } from './runtime/supportLogger';
export type { BackpressureSeverity } from './runtime/backpressure';
export type { TelemetryHooks } from './runtime/telemetry';
export type { CreateLoggerOptions } from './runtime/logger';
export default createCamundaClient;
