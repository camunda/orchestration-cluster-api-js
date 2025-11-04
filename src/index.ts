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
// eventualPoll unified with result mode; no separate export
export {
  createCamundaClient,
  createCamundaClientLoose,
  type CamundaClientLoose,
  type Loose,
  CamundaClient,
};
// Public type for client construction options
export type { CamundaOptions } from './gen/CamundaClient';
export type { EnrichedActivatedJob } from './runtime/jobActions';
export default createCamundaClient;
