// Entry point: export Camunda class, key types, and errors.
import { createCamundaClient } from './gen/CamundaClient';
import { type CamundaClientLoose, createCamundaClientLoose, type Loose } from './loose';

export { SPEC_HASH } from './gen/specHash';
export { type CamundaFpClient, createCamundaFpClient, type Either, isLeft, isRight } from './fp-ts';
// Re-export all public types from CamundaClient (Input, Consistency, CancelablePromise, etc.)
export * from './gen/CamundaClient';
export * from './gen/types.gen';
export {
  type CamundaResultClient,
  createCamundaResultClient,
  isErr,
  isOk,
  type Result,
} from './resultClient';
export type { BackpressureSeverity } from './runtime/backpressure';
export type { SdkError } from './runtime/errors';
export {
  CamundaValidationError,
  EventualConsistencyTimeoutError,
  isSdkError,
} from './runtime/errors';
export type { EnrichedActivatedJob } from './runtime/jobActions';
// Public re-exports for worker API
export type { Job, JobActionReceipt, JobWorker, JobWorkerConfig } from './runtime/jobWorker';
export { JobActionReceipt as JobActionReceiptSymbol } from './runtime/jobWorker';
export type { CreateLoggerOptions } from './runtime/logger';
export type { HttpRetryPolicy, OperationOptions } from './runtime/retry';
export type { SupportLogger } from './runtime/supportLogger';
export type { TelemetryHooks } from './runtime/telemetry';
export type {
  ThreadedJob,
  ThreadedJobHandler,
  ThreadedJobWorker,
  ThreadedJobWorkerConfig,
} from './runtime/threadedJobWorker';
export type { ThreadPool } from './runtime/threadPool';
// Runtime types used in public signatures
export type { AuthStrategy, CamundaConfig, ValidationMode } from './runtime/unifiedConfiguration';
// eventualPoll unified with result mode; no separate export
export { type CamundaClientLoose, createCamundaClientLoose, type Loose };
export default createCamundaClient;
