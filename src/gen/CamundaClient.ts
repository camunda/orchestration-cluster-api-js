// @generated from CamundaClient.template.ts - DO NOT EDIT DIRECTLY
import { createClient } from '../gen/client/client.gen';
import * as Sdk from '../gen/sdk.gen';
import { createAuthFacade } from '../runtime/auth';
import type { CamundaConfig } from '../runtime/unifiedConfiguration';
import type { EnvOverrides } from '../runtime/configSchema';
import { hydrateConfig } from '../runtime/unifiedConfiguration';
import { ConsistencyOptions, eventualPoll } from '../runtime/eventual';
import { installAuthInterceptor } from '../runtime/installAuthInterceptor';
import { createLogger, type Logger, type LogLevel, type LogTransport } from '../runtime/logger';
import {
  createSupportLogger,
  type SupportLogger,
  writeSupportLogPreamble,
} from '../runtime/supportLogger';
import {
  wrapFetch,
  withCorrelation as _withCorrelation,
  getCorrelation,
} from '../runtime/telemetry';
import { ValidationManager } from '../runtime/validationManager';
import type { Client } from '../gen/client/types.gen';
import {
  executeWithHttpRetry,
  defaultHttpClassifier,
  type HttpRetryPolicy,
  type OperationOptions,
} from '../runtime/retry';
import { normalizeError } from '../runtime/errors';
import { BackpressureManager } from '../runtime/backpressure';
import { JobWorker, type JobWorkerConfig } from '../runtime/jobWorker';
import { enrichActivatedJob, EnrichedActivatedJob } from '../runtime/jobActions';
import { ThreadedJobWorker, type ThreadedJobWorkerConfig } from '../runtime/threadedJobWorker';
import { ThreadPool } from '../runtime/threadPool';
import { evaluateSdkResponse } from '../runtime/responseEvaluation';

// Internal deep-freeze to make exposed config immutable for consumers.
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj as any);
    for (const v of Object.values(obj as any)) {
      if (v && typeof v === 'object') deepFreeze(v as any);
    }
  }
  return obj;
}

// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// Generated
// Operations: 183
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;
type activateAdHocSubProcessActivitiesOptions = Parameters<typeof Sdk.activateAdHocSubProcessActivities>[0];
type activateAdHocSubProcessActivitiesBody = (NonNullable<activateAdHocSubProcessActivitiesOptions> extends { body?: infer B } ? B : never);
type activateAdHocSubProcessActivitiesPathParam_adHocSubProcessInstanceKey = (NonNullable<activateAdHocSubProcessActivitiesOptions> extends { path: { adHocSubProcessInstanceKey: infer P } } ? P : any);
export type activateAdHocSubProcessActivitiesInput = activateAdHocSubProcessActivitiesBody & { adHocSubProcessInstanceKey: activateAdHocSubProcessActivitiesPathParam_adHocSubProcessInstanceKey };
type activateJobsOptions = Parameters<typeof Sdk.activateJobs>[0];
type activateJobsBody = (NonNullable<activateJobsOptions> extends { body?: infer B } ? B : never);
export type activateJobsInput = activateJobsBody;
type assignClientToGroupOptions = Parameters<typeof Sdk.assignClientToGroup>[0];
type assignClientToGroupPathParam_groupId = (NonNullable<assignClientToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignClientToGroupPathParam_clientId = (NonNullable<assignClientToGroupOptions> extends { path: { clientId: infer P } } ? P : any);
export type assignClientToGroupInput = { groupId: assignClientToGroupPathParam_groupId; clientId: assignClientToGroupPathParam_clientId };
type assignClientToTenantOptions = Parameters<typeof Sdk.assignClientToTenant>[0];
type assignClientToTenantPathParam_tenantId = (NonNullable<assignClientToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignClientToTenantPathParam_clientId = (NonNullable<assignClientToTenantOptions> extends { path: { clientId: infer P } } ? P : any);
export type assignClientToTenantInput = { tenantId: assignClientToTenantPathParam_tenantId; clientId: assignClientToTenantPathParam_clientId };
type assignGroupToTenantOptions = Parameters<typeof Sdk.assignGroupToTenant>[0];
type assignGroupToTenantPathParam_tenantId = (NonNullable<assignGroupToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignGroupToTenantPathParam_groupId = (NonNullable<assignGroupToTenantOptions> extends { path: { groupId: infer P } } ? P : any);
export type assignGroupToTenantInput = { tenantId: assignGroupToTenantPathParam_tenantId; groupId: assignGroupToTenantPathParam_groupId };
type assignMappingRuleToGroupOptions = Parameters<typeof Sdk.assignMappingRuleToGroup>[0];
type assignMappingRuleToGroupPathParam_groupId = (NonNullable<assignMappingRuleToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignMappingRuleToGroupPathParam_mappingRuleId = (NonNullable<assignMappingRuleToGroupOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type assignMappingRuleToGroupInput = { groupId: assignMappingRuleToGroupPathParam_groupId; mappingRuleId: assignMappingRuleToGroupPathParam_mappingRuleId };
type assignMappingRuleToTenantOptions = Parameters<typeof Sdk.assignMappingRuleToTenant>[0];
type assignMappingRuleToTenantPathParam_tenantId = (NonNullable<assignMappingRuleToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignMappingRuleToTenantPathParam_mappingRuleId = (NonNullable<assignMappingRuleToTenantOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type assignMappingRuleToTenantInput = { tenantId: assignMappingRuleToTenantPathParam_tenantId; mappingRuleId: assignMappingRuleToTenantPathParam_mappingRuleId };
type assignRoleToClientOptions = Parameters<typeof Sdk.assignRoleToClient>[0];
type assignRoleToClientPathParam_roleId = (NonNullable<assignRoleToClientOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToClientPathParam_clientId = (NonNullable<assignRoleToClientOptions> extends { path: { clientId: infer P } } ? P : any);
export type assignRoleToClientInput = { roleId: assignRoleToClientPathParam_roleId; clientId: assignRoleToClientPathParam_clientId };
type assignRoleToGroupOptions = Parameters<typeof Sdk.assignRoleToGroup>[0];
type assignRoleToGroupPathParam_roleId = (NonNullable<assignRoleToGroupOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToGroupPathParam_groupId = (NonNullable<assignRoleToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type assignRoleToGroupInput = { roleId: assignRoleToGroupPathParam_roleId; groupId: assignRoleToGroupPathParam_groupId };
type assignRoleToMappingRuleOptions = Parameters<typeof Sdk.assignRoleToMappingRule>[0];
type assignRoleToMappingRulePathParam_roleId = (NonNullable<assignRoleToMappingRuleOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToMappingRulePathParam_mappingRuleId = (NonNullable<assignRoleToMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type assignRoleToMappingRuleInput = { roleId: assignRoleToMappingRulePathParam_roleId; mappingRuleId: assignRoleToMappingRulePathParam_mappingRuleId };
type assignRoleToTenantOptions = Parameters<typeof Sdk.assignRoleToTenant>[0];
type assignRoleToTenantPathParam_tenantId = (NonNullable<assignRoleToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignRoleToTenantPathParam_roleId = (NonNullable<assignRoleToTenantOptions> extends { path: { roleId: infer P } } ? P : any);
export type assignRoleToTenantInput = { tenantId: assignRoleToTenantPathParam_tenantId; roleId: assignRoleToTenantPathParam_roleId };
type assignRoleToUserOptions = Parameters<typeof Sdk.assignRoleToUser>[0];
type assignRoleToUserPathParam_roleId = (NonNullable<assignRoleToUserOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToUserPathParam_username = (NonNullable<assignRoleToUserOptions> extends { path: { username: infer P } } ? P : any);
export type assignRoleToUserInput = { roleId: assignRoleToUserPathParam_roleId; username: assignRoleToUserPathParam_username };
type assignUserTaskOptions = Parameters<typeof Sdk.assignUserTask>[0];
type assignUserTaskBody = (NonNullable<assignUserTaskOptions> extends { body?: infer B } ? B : never);
type assignUserTaskPathParam_userTaskKey = (NonNullable<assignUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type assignUserTaskInput = assignUserTaskBody & { userTaskKey: assignUserTaskPathParam_userTaskKey };
type assignUserToGroupOptions = Parameters<typeof Sdk.assignUserToGroup>[0];
type assignUserToGroupPathParam_groupId = (NonNullable<assignUserToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignUserToGroupPathParam_username = (NonNullable<assignUserToGroupOptions> extends { path: { username: infer P } } ? P : any);
export type assignUserToGroupInput = { groupId: assignUserToGroupPathParam_groupId; username: assignUserToGroupPathParam_username };
type assignUserToTenantOptions = Parameters<typeof Sdk.assignUserToTenant>[0];
type assignUserToTenantPathParam_tenantId = (NonNullable<assignUserToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignUserToTenantPathParam_username = (NonNullable<assignUserToTenantOptions> extends { path: { username: infer P } } ? P : any);
export type assignUserToTenantInput = { tenantId: assignUserToTenantPathParam_tenantId; username: assignUserToTenantPathParam_username };
type broadcastSignalOptions = Parameters<typeof Sdk.broadcastSignal>[0];
type broadcastSignalBody = (NonNullable<broadcastSignalOptions> extends { body?: infer B } ? B : never);
export type broadcastSignalInput = broadcastSignalBody;
type cancelBatchOperationOptions = Parameters<typeof Sdk.cancelBatchOperation>[0];
type cancelBatchOperationBody = (NonNullable<cancelBatchOperationOptions> extends { body?: infer B } ? B : never);
type cancelBatchOperationPathParam_batchOperationKey = (NonNullable<cancelBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
export type cancelBatchOperationInput = cancelBatchOperationBody & { batchOperationKey: cancelBatchOperationPathParam_batchOperationKey };
type cancelProcessInstanceOptions = Parameters<typeof Sdk.cancelProcessInstance>[0];
type cancelProcessInstanceBody = (NonNullable<cancelProcessInstanceOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancePathParam_processInstanceKey = (NonNullable<cancelProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type cancelProcessInstanceInput = cancelProcessInstanceBody & { processInstanceKey: cancelProcessInstancePathParam_processInstanceKey };
type cancelProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.cancelProcessInstancesBatchOperation>[0];
type cancelProcessInstancesBatchOperationBody = (NonNullable<cancelProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type cancelProcessInstancesBatchOperationInput = cancelProcessInstancesBatchOperationBody;
type completeJobOptions = Parameters<typeof Sdk.completeJob>[0];
type completeJobBody = (NonNullable<completeJobOptions> extends { body?: infer B } ? B : never);
type completeJobPathParam_jobKey = (NonNullable<completeJobOptions> extends { path: { jobKey: infer P } } ? P : any);
export type completeJobInput = completeJobBody & { jobKey: completeJobPathParam_jobKey };
type completeUserTaskOptions = Parameters<typeof Sdk.completeUserTask>[0];
type completeUserTaskBody = (NonNullable<completeUserTaskOptions> extends { body?: infer B } ? B : never);
type completeUserTaskPathParam_userTaskKey = (NonNullable<completeUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type completeUserTaskInput = completeUserTaskBody & { userTaskKey: completeUserTaskPathParam_userTaskKey };
type correlateMessageOptions = Parameters<typeof Sdk.correlateMessage>[0];
type correlateMessageBody = (NonNullable<correlateMessageOptions> extends { body?: infer B } ? B : never);
export type correlateMessageInput = correlateMessageBody;
type createAdminUserOptions = Parameters<typeof Sdk.createAdminUser>[0];
type createAdminUserBody = (NonNullable<createAdminUserOptions> extends { body?: infer B } ? B : never);
export type createAdminUserInput = createAdminUserBody;
type createAuthorizationOptions = Parameters<typeof Sdk.createAuthorization>[0];
type createAuthorizationBody = (NonNullable<createAuthorizationOptions> extends { body?: infer B } ? B : never);
export type createAuthorizationInput = createAuthorizationBody;
type createDeploymentOptions = Parameters<typeof Sdk.createDeployment>[0];
type createDeploymentBody = (NonNullable<createDeploymentOptions> extends { body?: infer B } ? B : never);
export type createDeploymentInput = Omit<createDeploymentBody, 'resources'> & { resources: File[] };
type createDocumentOptions = Parameters<typeof Sdk.createDocument>[0];
type createDocumentBody = (NonNullable<createDocumentOptions> extends { body?: infer B } ? B : never);
type createDocumentQueryParam_storeId = (NonNullable<createDocumentOptions> extends { query?: { storeId?: infer Q } } ? Q : any);
type createDocumentQueryParam_documentId = (NonNullable<createDocumentOptions> extends { query?: { documentId?: infer Q } } ? Q : any);
export type createDocumentInput = createDocumentBody & { storeId?: createDocumentQueryParam_storeId; documentId?: createDocumentQueryParam_documentId };
type createDocumentLinkOptions = Parameters<typeof Sdk.createDocumentLink>[0];
type createDocumentLinkBody = (NonNullable<createDocumentLinkOptions> extends { body?: infer B } ? B : never);
type createDocumentLinkPathParam_documentId = (NonNullable<createDocumentLinkOptions> extends { path: { documentId: infer P } } ? P : any);
type createDocumentLinkQueryParam_storeId = (NonNullable<createDocumentLinkOptions> extends { query?: { storeId?: infer Q } } ? Q : any);
type createDocumentLinkQueryParam_contentHash = (NonNullable<createDocumentLinkOptions> extends { query?: { contentHash?: infer Q } } ? Q : any);
export type createDocumentLinkInput = createDocumentLinkBody & { documentId: createDocumentLinkPathParam_documentId; storeId?: createDocumentLinkQueryParam_storeId; contentHash?: createDocumentLinkQueryParam_contentHash };
type createDocumentsOptions = Parameters<typeof Sdk.createDocuments>[0];
type createDocumentsBody = (NonNullable<createDocumentsOptions> extends { body?: infer B } ? B : never);
type createDocumentsQueryParam_storeId = (NonNullable<createDocumentsOptions> extends { query?: { storeId?: infer Q } } ? Q : any);
export type createDocumentsInput = createDocumentsBody & { storeId?: createDocumentsQueryParam_storeId };
type createElementInstanceVariablesOptions = Parameters<typeof Sdk.createElementInstanceVariables>[0];
type createElementInstanceVariablesBody = (NonNullable<createElementInstanceVariablesOptions> extends { body?: infer B } ? B : never);
type createElementInstanceVariablesPathParam_elementInstanceKey = (NonNullable<createElementInstanceVariablesOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
export type createElementInstanceVariablesInput = createElementInstanceVariablesBody & { elementInstanceKey: createElementInstanceVariablesPathParam_elementInstanceKey };
type createGlobalClusterVariableOptions = Parameters<typeof Sdk.createGlobalClusterVariable>[0];
type createGlobalClusterVariableBody = (NonNullable<createGlobalClusterVariableOptions> extends { body?: infer B } ? B : never);
export type createGlobalClusterVariableInput = createGlobalClusterVariableBody;
type createGlobalTaskListenerOptions = Parameters<typeof Sdk.createGlobalTaskListener>[0];
type createGlobalTaskListenerBody = (NonNullable<createGlobalTaskListenerOptions> extends { body?: infer B } ? B : never);
export type createGlobalTaskListenerInput = createGlobalTaskListenerBody;
type createGroupOptions = Parameters<typeof Sdk.createGroup>[0];
type createGroupBody = (NonNullable<createGroupOptions> extends { body?: infer B } ? B : never);
export type createGroupInput = createGroupBody;
type createMappingRuleOptions = Parameters<typeof Sdk.createMappingRule>[0];
type createMappingRuleBody = (NonNullable<createMappingRuleOptions> extends { body?: infer B } ? B : never);
export type createMappingRuleInput = createMappingRuleBody;
type createProcessInstanceOptions = Parameters<typeof Sdk.createProcessInstance>[0];
type createProcessInstanceBody = (NonNullable<createProcessInstanceOptions> extends { body?: infer B } ? B : never);
export type createProcessInstanceInput = createProcessInstanceBody;
type createRoleOptions = Parameters<typeof Sdk.createRole>[0];
type createRoleBody = (NonNullable<createRoleOptions> extends { body?: infer B } ? B : never);
export type createRoleInput = createRoleBody;
type createTenantOptions = Parameters<typeof Sdk.createTenant>[0];
type createTenantBody = (NonNullable<createTenantOptions> extends { body?: infer B } ? B : never);
export type createTenantInput = createTenantBody;
type createTenantClusterVariableOptions = Parameters<typeof Sdk.createTenantClusterVariable>[0];
type createTenantClusterVariableBody = (NonNullable<createTenantClusterVariableOptions> extends { body?: infer B } ? B : never);
type createTenantClusterVariablePathParam_tenantId = (NonNullable<createTenantClusterVariableOptions> extends { path: { tenantId: infer P } } ? P : any);
export type createTenantClusterVariableInput = createTenantClusterVariableBody & { tenantId: createTenantClusterVariablePathParam_tenantId };
type createUserOptions = Parameters<typeof Sdk.createUser>[0];
type createUserBody = (NonNullable<createUserOptions> extends { body?: infer B } ? B : never);
export type createUserInput = createUserBody;
type deleteAuthorizationOptions = Parameters<typeof Sdk.deleteAuthorization>[0];
type deleteAuthorizationPathParam_authorizationKey = (NonNullable<deleteAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
export type deleteAuthorizationInput = { authorizationKey: deleteAuthorizationPathParam_authorizationKey };
type deleteDecisionInstanceOptions = Parameters<typeof Sdk.deleteDecisionInstance>[0];
type deleteDecisionInstanceBody = (NonNullable<deleteDecisionInstanceOptions> extends { body?: infer B } ? B : never);
type deleteDecisionInstancePathParam_decisionEvaluationKey = (NonNullable<deleteDecisionInstanceOptions> extends { path: { decisionEvaluationKey: infer P } } ? P : any);
export type deleteDecisionInstanceInput = deleteDecisionInstanceBody & { decisionEvaluationKey: deleteDecisionInstancePathParam_decisionEvaluationKey };
type deleteDecisionInstancesBatchOperationOptions = Parameters<typeof Sdk.deleteDecisionInstancesBatchOperation>[0];
type deleteDecisionInstancesBatchOperationBody = (NonNullable<deleteDecisionInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type deleteDecisionInstancesBatchOperationInput = deleteDecisionInstancesBatchOperationBody;
type deleteDocumentOptions = Parameters<typeof Sdk.deleteDocument>[0];
type deleteDocumentPathParam_documentId = (NonNullable<deleteDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type deleteDocumentQueryParam_storeId = (NonNullable<deleteDocumentOptions> extends { query?: { storeId?: infer Q } } ? Q : any);
export type deleteDocumentInput = { documentId: deleteDocumentPathParam_documentId; storeId?: deleteDocumentQueryParam_storeId };
type deleteGlobalClusterVariableOptions = Parameters<typeof Sdk.deleteGlobalClusterVariable>[0];
type deleteGlobalClusterVariablePathParam_name = (NonNullable<deleteGlobalClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type deleteGlobalClusterVariableInput = { name: deleteGlobalClusterVariablePathParam_name };
type deleteGlobalTaskListenerOptions = Parameters<typeof Sdk.deleteGlobalTaskListener>[0];
type deleteGlobalTaskListenerPathParam_id = (NonNullable<deleteGlobalTaskListenerOptions> extends { path: { id: infer P } } ? P : any);
export type deleteGlobalTaskListenerInput = { id: deleteGlobalTaskListenerPathParam_id };
type deleteGroupOptions = Parameters<typeof Sdk.deleteGroup>[0];
type deleteGroupPathParam_groupId = (NonNullable<deleteGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type deleteGroupInput = { groupId: deleteGroupPathParam_groupId };
type deleteMappingRuleOptions = Parameters<typeof Sdk.deleteMappingRule>[0];
type deleteMappingRulePathParam_mappingRuleId = (NonNullable<deleteMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type deleteMappingRuleInput = { mappingRuleId: deleteMappingRulePathParam_mappingRuleId };
type deleteProcessInstanceOptions = Parameters<typeof Sdk.deleteProcessInstance>[0];
type deleteProcessInstanceBody = (NonNullable<deleteProcessInstanceOptions> extends { body?: infer B } ? B : never);
type deleteProcessInstancePathParam_processInstanceKey = (NonNullable<deleteProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type deleteProcessInstanceInput = deleteProcessInstanceBody & { processInstanceKey: deleteProcessInstancePathParam_processInstanceKey };
type deleteProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.deleteProcessInstancesBatchOperation>[0];
type deleteProcessInstancesBatchOperationBody = (NonNullable<deleteProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type deleteProcessInstancesBatchOperationInput = deleteProcessInstancesBatchOperationBody;
type deleteResourceOptions = Parameters<typeof Sdk.deleteResource>[0];
type deleteResourceBody = (NonNullable<deleteResourceOptions> extends { body?: infer B } ? B : never);
type deleteResourcePathParam_resourceKey = (NonNullable<deleteResourceOptions> extends { path: { resourceKey: infer P } } ? P : any);
export type deleteResourceInput = deleteResourceBody & { resourceKey: deleteResourcePathParam_resourceKey };
type deleteRoleOptions = Parameters<typeof Sdk.deleteRole>[0];
type deleteRolePathParam_roleId = (NonNullable<deleteRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type deleteRoleInput = { roleId: deleteRolePathParam_roleId };
type deleteTenantOptions = Parameters<typeof Sdk.deleteTenant>[0];
type deleteTenantPathParam_tenantId = (NonNullable<deleteTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type deleteTenantInput = { tenantId: deleteTenantPathParam_tenantId };
type deleteTenantClusterVariableOptions = Parameters<typeof Sdk.deleteTenantClusterVariable>[0];
type deleteTenantClusterVariablePathParam_tenantId = (NonNullable<deleteTenantClusterVariableOptions> extends { path: { tenantId: infer P } } ? P : any);
type deleteTenantClusterVariablePathParam_name = (NonNullable<deleteTenantClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type deleteTenantClusterVariableInput = { tenantId: deleteTenantClusterVariablePathParam_tenantId; name: deleteTenantClusterVariablePathParam_name };
type deleteUserOptions = Parameters<typeof Sdk.deleteUser>[0];
type deleteUserPathParam_username = (NonNullable<deleteUserOptions> extends { path: { username: infer P } } ? P : any);
export type deleteUserInput = { username: deleteUserPathParam_username };
type evaluateConditionalsOptions = Parameters<typeof Sdk.evaluateConditionals>[0];
type evaluateConditionalsBody = (NonNullable<evaluateConditionalsOptions> extends { body?: infer B } ? B : never);
export type evaluateConditionalsInput = evaluateConditionalsBody;
type evaluateDecisionOptions = Parameters<typeof Sdk.evaluateDecision>[0];
type evaluateDecisionBody = (NonNullable<evaluateDecisionOptions> extends { body?: infer B } ? B : never);
export type evaluateDecisionInput = evaluateDecisionBody;
type evaluateExpressionOptions = Parameters<typeof Sdk.evaluateExpression>[0];
type evaluateExpressionBody = (NonNullable<evaluateExpressionOptions> extends { body?: infer B } ? B : never);
export type evaluateExpressionInput = evaluateExpressionBody;
type failJobOptions = Parameters<typeof Sdk.failJob>[0];
type failJobBody = (NonNullable<failJobOptions> extends { body?: infer B } ? B : never);
type failJobPathParam_jobKey = (NonNullable<failJobOptions> extends { path: { jobKey: infer P } } ? P : any);
export type failJobInput = failJobBody & { jobKey: failJobPathParam_jobKey };
type getAuditLogOptions = Parameters<typeof Sdk.getAuditLog>[0];
type getAuditLogPathParam_auditLogKey = (NonNullable<getAuditLogOptions> extends { path: { auditLogKey: infer P } } ? P : any);
export type getAuditLogInput = { auditLogKey: getAuditLogPathParam_auditLogKey };
/** Management of eventual consistency **/
export type getAuditLogConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getAuditLog>> 
};
type getAuthenticationOptions = Parameters<typeof Sdk.getAuthentication>[0];
export type getAuthenticationInput = void;
type getAuthorizationOptions = Parameters<typeof Sdk.getAuthorization>[0];
type getAuthorizationPathParam_authorizationKey = (NonNullable<getAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
export type getAuthorizationInput = { authorizationKey: getAuthorizationPathParam_authorizationKey };
/** Management of eventual consistency **/
export type getAuthorizationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getAuthorization>> 
};
type getBatchOperationOptions = Parameters<typeof Sdk.getBatchOperation>[0];
type getBatchOperationPathParam_batchOperationKey = (NonNullable<getBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
export type getBatchOperationInput = { batchOperationKey: getBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
export type getBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getBatchOperation>> 
};
type getDecisionDefinitionOptions = Parameters<typeof Sdk.getDecisionDefinition>[0];
type getDecisionDefinitionPathParam_decisionDefinitionKey = (NonNullable<getDecisionDefinitionOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
export type getDecisionDefinitionInput = { decisionDefinitionKey: getDecisionDefinitionPathParam_decisionDefinitionKey };
/** Management of eventual consistency **/
export type getDecisionDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinition>> 
};
type getDecisionDefinitionXmlOptions = Parameters<typeof Sdk.getDecisionDefinitionXml>[0];
type getDecisionDefinitionXmlPathParam_decisionDefinitionKey = (NonNullable<getDecisionDefinitionXmlOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
export type getDecisionDefinitionXmlInput = { decisionDefinitionKey: getDecisionDefinitionXmlPathParam_decisionDefinitionKey };
/** Management of eventual consistency **/
export type getDecisionDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinitionXml>> 
};
type getDecisionInstanceOptions = Parameters<typeof Sdk.getDecisionInstance>[0];
type getDecisionInstancePathParam_decisionEvaluationInstanceKey = (NonNullable<getDecisionInstanceOptions> extends { path: { decisionEvaluationInstanceKey: infer P } } ? P : any);
export type getDecisionInstanceInput = { decisionEvaluationInstanceKey: getDecisionInstancePathParam_decisionEvaluationInstanceKey };
/** Management of eventual consistency **/
export type getDecisionInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionInstance>> 
};
type getDecisionRequirementsOptions = Parameters<typeof Sdk.getDecisionRequirements>[0];
type getDecisionRequirementsPathParam_decisionRequirementsKey = (NonNullable<getDecisionRequirementsOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
export type getDecisionRequirementsInput = { decisionRequirementsKey: getDecisionRequirementsPathParam_decisionRequirementsKey };
/** Management of eventual consistency **/
export type getDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirements>> 
};
type getDecisionRequirementsXmlOptions = Parameters<typeof Sdk.getDecisionRequirementsXml>[0];
type getDecisionRequirementsXmlPathParam_decisionRequirementsKey = (NonNullable<getDecisionRequirementsXmlOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
export type getDecisionRequirementsXmlInput = { decisionRequirementsKey: getDecisionRequirementsXmlPathParam_decisionRequirementsKey };
/** Management of eventual consistency **/
export type getDecisionRequirementsXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirementsXml>> 
};
type getDocumentOptions = Parameters<typeof Sdk.getDocument>[0];
type getDocumentPathParam_documentId = (NonNullable<getDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type getDocumentQueryParam_storeId = (NonNullable<getDocumentOptions> extends { query?: { storeId?: infer Q } } ? Q : any);
type getDocumentQueryParam_contentHash = (NonNullable<getDocumentOptions> extends { query?: { contentHash?: infer Q } } ? Q : any);
export type getDocumentInput = { documentId: getDocumentPathParam_documentId; storeId?: getDocumentQueryParam_storeId; contentHash?: getDocumentQueryParam_contentHash };
type getElementInstanceOptions = Parameters<typeof Sdk.getElementInstance>[0];
type getElementInstancePathParam_elementInstanceKey = (NonNullable<getElementInstanceOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
export type getElementInstanceInput = { elementInstanceKey: getElementInstancePathParam_elementInstanceKey };
/** Management of eventual consistency **/
export type getElementInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getElementInstance>> 
};
type getGlobalClusterVariableOptions = Parameters<typeof Sdk.getGlobalClusterVariable>[0];
type getGlobalClusterVariablePathParam_name = (NonNullable<getGlobalClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type getGlobalClusterVariableInput = { name: getGlobalClusterVariablePathParam_name };
/** Management of eventual consistency **/
export type getGlobalClusterVariableConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGlobalClusterVariable>> 
};
type getGlobalJobStatisticsOptions = Parameters<typeof Sdk.getGlobalJobStatistics>[0];
type getGlobalJobStatisticsQueryParam_from = (NonNullable<getGlobalJobStatisticsOptions> extends { query?: { from?: infer Q } } ? Q : any);
type getGlobalJobStatisticsQueryParam_to = (NonNullable<getGlobalJobStatisticsOptions> extends { query?: { to?: infer Q } } ? Q : any);
type getGlobalJobStatisticsQueryParam_jobType = (NonNullable<getGlobalJobStatisticsOptions> extends { query?: { jobType?: infer Q } } ? Q : any);
export type getGlobalJobStatisticsInput = { from: getGlobalJobStatisticsQueryParam_from; to: getGlobalJobStatisticsQueryParam_to; jobType?: getGlobalJobStatisticsQueryParam_jobType };
/** Management of eventual consistency **/
export type getGlobalJobStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGlobalJobStatistics>> 
};
type getGlobalTaskListenerOptions = Parameters<typeof Sdk.getGlobalTaskListener>[0];
type getGlobalTaskListenerPathParam_id = (NonNullable<getGlobalTaskListenerOptions> extends { path: { id: infer P } } ? P : any);
export type getGlobalTaskListenerInput = { id: getGlobalTaskListenerPathParam_id };
/** Management of eventual consistency **/
export type getGlobalTaskListenerConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGlobalTaskListener>> 
};
type getGroupOptions = Parameters<typeof Sdk.getGroup>[0];
type getGroupPathParam_groupId = (NonNullable<getGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type getGroupInput = { groupId: getGroupPathParam_groupId };
/** Management of eventual consistency **/
export type getGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGroup>> 
};
type getIncidentOptions = Parameters<typeof Sdk.getIncident>[0];
type getIncidentPathParam_incidentKey = (NonNullable<getIncidentOptions> extends { path: { incidentKey: infer P } } ? P : any);
export type getIncidentInput = { incidentKey: getIncidentPathParam_incidentKey };
/** Management of eventual consistency **/
export type getIncidentConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getIncident>> 
};
type getJobErrorStatisticsOptions = Parameters<typeof Sdk.getJobErrorStatistics>[0];
type getJobErrorStatisticsBody = (NonNullable<getJobErrorStatisticsOptions> extends { body?: infer B } ? B : never);
export type getJobErrorStatisticsInput = getJobErrorStatisticsBody;
/** Management of eventual consistency **/
export type getJobErrorStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobErrorStatistics>> 
};
type getJobTimeSeriesStatisticsOptions = Parameters<typeof Sdk.getJobTimeSeriesStatistics>[0];
type getJobTimeSeriesStatisticsBody = (NonNullable<getJobTimeSeriesStatisticsOptions> extends { body?: infer B } ? B : never);
export type getJobTimeSeriesStatisticsInput = getJobTimeSeriesStatisticsBody;
/** Management of eventual consistency **/
export type getJobTimeSeriesStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobTimeSeriesStatistics>> 
};
type getJobTypeStatisticsOptions = Parameters<typeof Sdk.getJobTypeStatistics>[0];
type getJobTypeStatisticsBody = (NonNullable<getJobTypeStatisticsOptions> extends { body?: infer B } ? B : never);
export type getJobTypeStatisticsInput = getJobTypeStatisticsBody;
/** Management of eventual consistency **/
export type getJobTypeStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobTypeStatistics>> 
};
type getJobWorkerStatisticsOptions = Parameters<typeof Sdk.getJobWorkerStatistics>[0];
type getJobWorkerStatisticsBody = (NonNullable<getJobWorkerStatisticsOptions> extends { body?: infer B } ? B : never);
export type getJobWorkerStatisticsInput = getJobWorkerStatisticsBody;
/** Management of eventual consistency **/
export type getJobWorkerStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobWorkerStatistics>> 
};
type getLicenseOptions = Parameters<typeof Sdk.getLicense>[0];
export type getLicenseInput = void;
type getMappingRuleOptions = Parameters<typeof Sdk.getMappingRule>[0];
type getMappingRulePathParam_mappingRuleId = (NonNullable<getMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type getMappingRuleInput = { mappingRuleId: getMappingRulePathParam_mappingRuleId };
/** Management of eventual consistency **/
export type getMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getMappingRule>> 
};
type getProcessDefinitionOptions = Parameters<typeof Sdk.getProcessDefinition>[0];
type getProcessDefinitionPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
export type getProcessDefinitionInput = { processDefinitionKey: getProcessDefinitionPathParam_processDefinitionKey };
/** Management of eventual consistency **/
export type getProcessDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinition>> 
};
type getProcessDefinitionInstanceStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionInstanceStatistics>[0];
type getProcessDefinitionInstanceStatisticsBody = (NonNullable<getProcessDefinitionInstanceStatisticsOptions> extends { body?: infer B } ? B : never);
export type getProcessDefinitionInstanceStatisticsInput = getProcessDefinitionInstanceStatisticsBody;
/** Management of eventual consistency **/
export type getProcessDefinitionInstanceStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionInstanceStatistics>> 
};
type getProcessDefinitionInstanceVersionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionInstanceVersionStatistics>[0];
type getProcessDefinitionInstanceVersionStatisticsBody = (NonNullable<getProcessDefinitionInstanceVersionStatisticsOptions> extends { body?: infer B } ? B : never);
export type getProcessDefinitionInstanceVersionStatisticsInput = getProcessDefinitionInstanceVersionStatisticsBody;
/** Management of eventual consistency **/
export type getProcessDefinitionInstanceVersionStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionInstanceVersionStatistics>> 
};
type getProcessDefinitionMessageSubscriptionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionMessageSubscriptionStatistics>[0];
type getProcessDefinitionMessageSubscriptionStatisticsBody = (NonNullable<getProcessDefinitionMessageSubscriptionStatisticsOptions> extends { body?: infer B } ? B : never);
export type getProcessDefinitionMessageSubscriptionStatisticsInput = getProcessDefinitionMessageSubscriptionStatisticsBody;
/** Management of eventual consistency **/
export type getProcessDefinitionMessageSubscriptionStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionMessageSubscriptionStatistics>> 
};
type getProcessDefinitionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionStatistics>[0];
type getProcessDefinitionStatisticsBody = (NonNullable<getProcessDefinitionStatisticsOptions> extends { body?: infer B } ? B : never);
type getProcessDefinitionStatisticsPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionStatisticsOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
export type getProcessDefinitionStatisticsInput = getProcessDefinitionStatisticsBody & { processDefinitionKey: getProcessDefinitionStatisticsPathParam_processDefinitionKey };
/** Management of eventual consistency **/
export type getProcessDefinitionStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionStatistics>> 
};
type getProcessDefinitionXmlOptions = Parameters<typeof Sdk.getProcessDefinitionXml>[0];
type getProcessDefinitionXmlPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionXmlOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
export type getProcessDefinitionXmlInput = { processDefinitionKey: getProcessDefinitionXmlPathParam_processDefinitionKey };
/** Management of eventual consistency **/
export type getProcessDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionXml>> 
};
type getProcessInstanceOptions = Parameters<typeof Sdk.getProcessInstance>[0];
type getProcessInstancePathParam_processInstanceKey = (NonNullable<getProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type getProcessInstanceInput = { processInstanceKey: getProcessInstancePathParam_processInstanceKey };
/** Management of eventual consistency **/
export type getProcessInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstance>> 
};
type getProcessInstanceCallHierarchyOptions = Parameters<typeof Sdk.getProcessInstanceCallHierarchy>[0];
type getProcessInstanceCallHierarchyPathParam_processInstanceKey = (NonNullable<getProcessInstanceCallHierarchyOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type getProcessInstanceCallHierarchyInput = { processInstanceKey: getProcessInstanceCallHierarchyPathParam_processInstanceKey };
/** Management of eventual consistency **/
export type getProcessInstanceCallHierarchyConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>> 
};
type getProcessInstanceSequenceFlowsOptions = Parameters<typeof Sdk.getProcessInstanceSequenceFlows>[0];
type getProcessInstanceSequenceFlowsPathParam_processInstanceKey = (NonNullable<getProcessInstanceSequenceFlowsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type getProcessInstanceSequenceFlowsInput = { processInstanceKey: getProcessInstanceSequenceFlowsPathParam_processInstanceKey };
/** Management of eventual consistency **/
export type getProcessInstanceSequenceFlowsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>> 
};
type getProcessInstanceStatisticsOptions = Parameters<typeof Sdk.getProcessInstanceStatistics>[0];
type getProcessInstanceStatisticsPathParam_processInstanceKey = (NonNullable<getProcessInstanceStatisticsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type getProcessInstanceStatisticsInput = { processInstanceKey: getProcessInstanceStatisticsPathParam_processInstanceKey };
/** Management of eventual consistency **/
export type getProcessInstanceStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatistics>> 
};
type getProcessInstanceStatisticsByDefinitionOptions = Parameters<typeof Sdk.getProcessInstanceStatisticsByDefinition>[0];
type getProcessInstanceStatisticsByDefinitionBody = (NonNullable<getProcessInstanceStatisticsByDefinitionOptions> extends { body?: infer B } ? B : never);
export type getProcessInstanceStatisticsByDefinitionInput = getProcessInstanceStatisticsByDefinitionBody;
/** Management of eventual consistency **/
export type getProcessInstanceStatisticsByDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatisticsByDefinition>> 
};
type getProcessInstanceStatisticsByErrorOptions = Parameters<typeof Sdk.getProcessInstanceStatisticsByError>[0];
type getProcessInstanceStatisticsByErrorBody = (NonNullable<getProcessInstanceStatisticsByErrorOptions> extends { body?: infer B } ? B : never);
export type getProcessInstanceStatisticsByErrorInput = getProcessInstanceStatisticsByErrorBody;
/** Management of eventual consistency **/
export type getProcessInstanceStatisticsByErrorConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatisticsByError>> 
};
type getResourceOptions = Parameters<typeof Sdk.getResource>[0];
type getResourcePathParam_resourceKey = (NonNullable<getResourceOptions> extends { path: { resourceKey: infer P } } ? P : any);
export type getResourceInput = { resourceKey: getResourcePathParam_resourceKey };
type getResourceContentOptions = Parameters<typeof Sdk.getResourceContent>[0];
type getResourceContentPathParam_resourceKey = (NonNullable<getResourceContentOptions> extends { path: { resourceKey: infer P } } ? P : any);
export type getResourceContentInput = { resourceKey: getResourceContentPathParam_resourceKey };
type getRoleOptions = Parameters<typeof Sdk.getRole>[0];
type getRolePathParam_roleId = (NonNullable<getRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type getRoleInput = { roleId: getRolePathParam_roleId };
/** Management of eventual consistency **/
export type getRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getRole>> 
};
type getStartProcessFormOptions = Parameters<typeof Sdk.getStartProcessForm>[0];
type getStartProcessFormPathParam_processDefinitionKey = (NonNullable<getStartProcessFormOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
export type getStartProcessFormInput = { processDefinitionKey: getStartProcessFormPathParam_processDefinitionKey };
/** Management of eventual consistency **/
export type getStartProcessFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getStartProcessForm>> 
};
type getStatusOptions = Parameters<typeof Sdk.getStatus>[0];
export type getStatusInput = void;
type getSystemConfigurationOptions = Parameters<typeof Sdk.getSystemConfiguration>[0];
export type getSystemConfigurationInput = void;
type getTenantOptions = Parameters<typeof Sdk.getTenant>[0];
type getTenantPathParam_tenantId = (NonNullable<getTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type getTenantInput = { tenantId: getTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type getTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenant>> 
};
type getTenantClusterVariableOptions = Parameters<typeof Sdk.getTenantClusterVariable>[0];
type getTenantClusterVariablePathParam_tenantId = (NonNullable<getTenantClusterVariableOptions> extends { path: { tenantId: infer P } } ? P : any);
type getTenantClusterVariablePathParam_name = (NonNullable<getTenantClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type getTenantClusterVariableInput = { tenantId: getTenantClusterVariablePathParam_tenantId; name: getTenantClusterVariablePathParam_name };
/** Management of eventual consistency **/
export type getTenantClusterVariableConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenantClusterVariable>> 
};
type getTopologyOptions = Parameters<typeof Sdk.getTopology>[0];
export type getTopologyInput = void;
type getUsageMetricsOptions = Parameters<typeof Sdk.getUsageMetrics>[0];
type getUsageMetricsQueryParam_startTime = (NonNullable<getUsageMetricsOptions> extends { query?: { startTime?: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_endTime = (NonNullable<getUsageMetricsOptions> extends { query?: { endTime?: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_tenantId = (NonNullable<getUsageMetricsOptions> extends { query?: { tenantId?: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_withTenants = (NonNullable<getUsageMetricsOptions> extends { query?: { withTenants?: infer Q } } ? Q : any);
export type getUsageMetricsInput = { startTime: getUsageMetricsQueryParam_startTime; endTime: getUsageMetricsQueryParam_endTime; tenantId?: getUsageMetricsQueryParam_tenantId; withTenants?: getUsageMetricsQueryParam_withTenants };
/** Management of eventual consistency **/
export type getUsageMetricsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUsageMetrics>> 
};
type getUserOptions = Parameters<typeof Sdk.getUser>[0];
type getUserPathParam_username = (NonNullable<getUserOptions> extends { path: { username: infer P } } ? P : any);
export type getUserInput = { username: getUserPathParam_username };
/** Management of eventual consistency **/
export type getUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUser>> 
};
type getUserTaskOptions = Parameters<typeof Sdk.getUserTask>[0];
type getUserTaskPathParam_userTaskKey = (NonNullable<getUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type getUserTaskInput = { userTaskKey: getUserTaskPathParam_userTaskKey };
/** Management of eventual consistency **/
export type getUserTaskConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTask>> 
};
type getUserTaskFormOptions = Parameters<typeof Sdk.getUserTaskForm>[0];
type getUserTaskFormPathParam_userTaskKey = (NonNullable<getUserTaskFormOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type getUserTaskFormInput = { userTaskKey: getUserTaskFormPathParam_userTaskKey };
/** Management of eventual consistency **/
export type getUserTaskFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTaskForm>> 
};
type getVariableOptions = Parameters<typeof Sdk.getVariable>[0];
type getVariablePathParam_variableKey = (NonNullable<getVariableOptions> extends { path: { variableKey: infer P } } ? P : any);
export type getVariableInput = { variableKey: getVariablePathParam_variableKey };
/** Management of eventual consistency **/
export type getVariableConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getVariable>> 
};
type migrateProcessInstanceOptions = Parameters<typeof Sdk.migrateProcessInstance>[0];
type migrateProcessInstanceBody = (NonNullable<migrateProcessInstanceOptions> extends { body?: infer B } ? B : never);
type migrateProcessInstancePathParam_processInstanceKey = (NonNullable<migrateProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type migrateProcessInstanceInput = migrateProcessInstanceBody & { processInstanceKey: migrateProcessInstancePathParam_processInstanceKey };
type migrateProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.migrateProcessInstancesBatchOperation>[0];
type migrateProcessInstancesBatchOperationBody = (NonNullable<migrateProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type migrateProcessInstancesBatchOperationInput = migrateProcessInstancesBatchOperationBody;
type modifyProcessInstanceOptions = Parameters<typeof Sdk.modifyProcessInstance>[0];
type modifyProcessInstanceBody = (NonNullable<modifyProcessInstanceOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancePathParam_processInstanceKey = (NonNullable<modifyProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type modifyProcessInstanceInput = modifyProcessInstanceBody & { processInstanceKey: modifyProcessInstancePathParam_processInstanceKey };
type modifyProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.modifyProcessInstancesBatchOperation>[0];
type modifyProcessInstancesBatchOperationBody = (NonNullable<modifyProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type modifyProcessInstancesBatchOperationInput = modifyProcessInstancesBatchOperationBody;
type pinClockOptions = Parameters<typeof Sdk.pinClock>[0];
type pinClockBody = (NonNullable<pinClockOptions> extends { body?: infer B } ? B : never);
export type pinClockInput = pinClockBody;
type publishMessageOptions = Parameters<typeof Sdk.publishMessage>[0];
type publishMessageBody = (NonNullable<publishMessageOptions> extends { body?: infer B } ? B : never);
export type publishMessageInput = publishMessageBody;
type resetClockOptions = Parameters<typeof Sdk.resetClock>[0];
export type resetClockInput = void;
type resolveIncidentOptions = Parameters<typeof Sdk.resolveIncident>[0];
type resolveIncidentBody = (NonNullable<resolveIncidentOptions> extends { body?: infer B } ? B : never);
type resolveIncidentPathParam_incidentKey = (NonNullable<resolveIncidentOptions> extends { path: { incidentKey: infer P } } ? P : any);
export type resolveIncidentInput = resolveIncidentBody & { incidentKey: resolveIncidentPathParam_incidentKey };
type resolveIncidentsBatchOperationOptions = Parameters<typeof Sdk.resolveIncidentsBatchOperation>[0];
type resolveIncidentsBatchOperationBody = (NonNullable<resolveIncidentsBatchOperationOptions> extends { body?: infer B } ? B : never);
export type resolveIncidentsBatchOperationInput = resolveIncidentsBatchOperationBody;
type resolveProcessInstanceIncidentsOptions = Parameters<typeof Sdk.resolveProcessInstanceIncidents>[0];
type resolveProcessInstanceIncidentsPathParam_processInstanceKey = (NonNullable<resolveProcessInstanceIncidentsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type resolveProcessInstanceIncidentsInput = { processInstanceKey: resolveProcessInstanceIncidentsPathParam_processInstanceKey };
type resumeBatchOperationOptions = Parameters<typeof Sdk.resumeBatchOperation>[0];
type resumeBatchOperationBody = (NonNullable<resumeBatchOperationOptions> extends { body?: infer B } ? B : never);
type resumeBatchOperationPathParam_batchOperationKey = (NonNullable<resumeBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
export type resumeBatchOperationInput = resumeBatchOperationBody & { batchOperationKey: resumeBatchOperationPathParam_batchOperationKey };
type searchAuditLogsOptions = Parameters<typeof Sdk.searchAuditLogs>[0];
type searchAuditLogsBody = (NonNullable<searchAuditLogsOptions> extends { body?: infer B } ? B : never);
export type searchAuditLogsInput = searchAuditLogsBody;
/** Management of eventual consistency **/
export type searchAuditLogsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuditLogs>> 
};
type searchAuthorizationsOptions = Parameters<typeof Sdk.searchAuthorizations>[0];
type searchAuthorizationsBody = (NonNullable<searchAuthorizationsOptions> extends { body?: infer B } ? B : never);
export type searchAuthorizationsInput = searchAuthorizationsBody;
/** Management of eventual consistency **/
export type searchAuthorizationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuthorizations>> 
};
type searchBatchOperationItemsOptions = Parameters<typeof Sdk.searchBatchOperationItems>[0];
type searchBatchOperationItemsBody = (NonNullable<searchBatchOperationItemsOptions> extends { body?: infer B } ? B : never);
export type searchBatchOperationItemsInput = searchBatchOperationItemsBody;
/** Management of eventual consistency **/
export type searchBatchOperationItemsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperationItems>> 
};
type searchBatchOperationsOptions = Parameters<typeof Sdk.searchBatchOperations>[0];
type searchBatchOperationsBody = (NonNullable<searchBatchOperationsOptions> extends { body?: infer B } ? B : never);
export type searchBatchOperationsInput = searchBatchOperationsBody;
/** Management of eventual consistency **/
export type searchBatchOperationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperations>> 
};
type searchClientsForGroupOptions = Parameters<typeof Sdk.searchClientsForGroup>[0];
type searchClientsForGroupBody = (NonNullable<searchClientsForGroupOptions> extends { body?: infer B } ? B : never);
type searchClientsForGroupPathParam_groupId = (NonNullable<searchClientsForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type searchClientsForGroupInput = searchClientsForGroupBody & { groupId: searchClientsForGroupPathParam_groupId };
/** Management of eventual consistency **/
export type searchClientsForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForGroup>> 
};
type searchClientsForRoleOptions = Parameters<typeof Sdk.searchClientsForRole>[0];
type searchClientsForRoleBody = (NonNullable<searchClientsForRoleOptions> extends { body?: infer B } ? B : never);
type searchClientsForRolePathParam_roleId = (NonNullable<searchClientsForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type searchClientsForRoleInput = searchClientsForRoleBody & { roleId: searchClientsForRolePathParam_roleId };
/** Management of eventual consistency **/
export type searchClientsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForRole>> 
};
type searchClientsForTenantOptions = Parameters<typeof Sdk.searchClientsForTenant>[0];
type searchClientsForTenantBody = (NonNullable<searchClientsForTenantOptions> extends { body?: infer B } ? B : never);
type searchClientsForTenantPathParam_tenantId = (NonNullable<searchClientsForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type searchClientsForTenantInput = searchClientsForTenantBody & { tenantId: searchClientsForTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type searchClientsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForTenant>> 
};
type searchClusterVariablesOptions = Parameters<typeof Sdk.searchClusterVariables>[0];
type searchClusterVariablesBody = (NonNullable<searchClusterVariablesOptions> extends { body?: infer B } ? B : never);
type searchClusterVariablesQueryParam_truncateValues = (NonNullable<searchClusterVariablesOptions> extends { query?: { truncateValues?: infer Q } } ? Q : any);
export type searchClusterVariablesInput = searchClusterVariablesBody & { truncateValues?: searchClusterVariablesQueryParam_truncateValues };
/** Management of eventual consistency **/
export type searchClusterVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClusterVariables>> 
};
type searchCorrelatedMessageSubscriptionsOptions = Parameters<typeof Sdk.searchCorrelatedMessageSubscriptions>[0];
type searchCorrelatedMessageSubscriptionsBody = (NonNullable<searchCorrelatedMessageSubscriptionsOptions> extends { body?: infer B } ? B : never);
export type searchCorrelatedMessageSubscriptionsInput = searchCorrelatedMessageSubscriptionsBody;
/** Management of eventual consistency **/
export type searchCorrelatedMessageSubscriptionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchCorrelatedMessageSubscriptions>> 
};
type searchDecisionDefinitionsOptions = Parameters<typeof Sdk.searchDecisionDefinitions>[0];
type searchDecisionDefinitionsBody = (NonNullable<searchDecisionDefinitionsOptions> extends { body?: infer B } ? B : never);
export type searchDecisionDefinitionsInput = searchDecisionDefinitionsBody;
/** Management of eventual consistency **/
export type searchDecisionDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionDefinitions>> 
};
type searchDecisionInstancesOptions = Parameters<typeof Sdk.searchDecisionInstances>[0];
type searchDecisionInstancesBody = (NonNullable<searchDecisionInstancesOptions> extends { body?: infer B } ? B : never);
export type searchDecisionInstancesInput = searchDecisionInstancesBody;
/** Management of eventual consistency **/
export type searchDecisionInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionInstances>> 
};
type searchDecisionRequirementsOptions = Parameters<typeof Sdk.searchDecisionRequirements>[0];
type searchDecisionRequirementsBody = (NonNullable<searchDecisionRequirementsOptions> extends { body?: infer B } ? B : never);
export type searchDecisionRequirementsInput = searchDecisionRequirementsBody;
/** Management of eventual consistency **/
export type searchDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionRequirements>> 
};
type searchElementInstanceIncidentsOptions = Parameters<typeof Sdk.searchElementInstanceIncidents>[0];
type searchElementInstanceIncidentsBody = (NonNullable<searchElementInstanceIncidentsOptions> extends { body?: infer B } ? B : never);
type searchElementInstanceIncidentsPathParam_elementInstanceKey = (NonNullable<searchElementInstanceIncidentsOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
export type searchElementInstanceIncidentsInput = searchElementInstanceIncidentsBody & { elementInstanceKey: searchElementInstanceIncidentsPathParam_elementInstanceKey };
/** Management of eventual consistency **/
export type searchElementInstanceIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchElementInstanceIncidents>> 
};
type searchElementInstancesOptions = Parameters<typeof Sdk.searchElementInstances>[0];
type searchElementInstancesBody = (NonNullable<searchElementInstancesOptions> extends { body?: infer B } ? B : never);
export type searchElementInstancesInput = searchElementInstancesBody;
/** Management of eventual consistency **/
export type searchElementInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchElementInstances>> 
};
type searchGlobalTaskListenersOptions = Parameters<typeof Sdk.searchGlobalTaskListeners>[0];
type searchGlobalTaskListenersBody = (NonNullable<searchGlobalTaskListenersOptions> extends { body?: infer B } ? B : never);
export type searchGlobalTaskListenersInput = searchGlobalTaskListenersBody;
/** Management of eventual consistency **/
export type searchGlobalTaskListenersConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGlobalTaskListeners>> 
};
type searchGroupIdsForTenantOptions = Parameters<typeof Sdk.searchGroupIdsForTenant>[0];
type searchGroupIdsForTenantBody = (NonNullable<searchGroupIdsForTenantOptions> extends { body?: infer B } ? B : never);
type searchGroupIdsForTenantPathParam_tenantId = (NonNullable<searchGroupIdsForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type searchGroupIdsForTenantInput = searchGroupIdsForTenantBody & { tenantId: searchGroupIdsForTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type searchGroupIdsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupIdsForTenant>> 
};
type searchGroupsOptions = Parameters<typeof Sdk.searchGroups>[0];
type searchGroupsBody = (NonNullable<searchGroupsOptions> extends { body?: infer B } ? B : never);
export type searchGroupsInput = searchGroupsBody;
/** Management of eventual consistency **/
export type searchGroupsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroups>> 
};
type searchGroupsForRoleOptions = Parameters<typeof Sdk.searchGroupsForRole>[0];
type searchGroupsForRoleBody = (NonNullable<searchGroupsForRoleOptions> extends { body?: infer B } ? B : never);
type searchGroupsForRolePathParam_roleId = (NonNullable<searchGroupsForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type searchGroupsForRoleInput = searchGroupsForRoleBody & { roleId: searchGroupsForRolePathParam_roleId };
/** Management of eventual consistency **/
export type searchGroupsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupsForRole>> 
};
type searchIncidentsOptions = Parameters<typeof Sdk.searchIncidents>[0];
type searchIncidentsBody = (NonNullable<searchIncidentsOptions> extends { body?: infer B } ? B : never);
export type searchIncidentsInput = searchIncidentsBody;
/** Management of eventual consistency **/
export type searchIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchIncidents>> 
};
type searchJobsOptions = Parameters<typeof Sdk.searchJobs>[0];
type searchJobsBody = (NonNullable<searchJobsOptions> extends { body?: infer B } ? B : never);
export type searchJobsInput = searchJobsBody;
/** Management of eventual consistency **/
export type searchJobsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchJobs>> 
};
type searchMappingRuleOptions = Parameters<typeof Sdk.searchMappingRule>[0];
type searchMappingRuleBody = (NonNullable<searchMappingRuleOptions> extends { body?: infer B } ? B : never);
export type searchMappingRuleInput = searchMappingRuleBody;
/** Management of eventual consistency **/
export type searchMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRule>> 
};
type searchMappingRulesForGroupOptions = Parameters<typeof Sdk.searchMappingRulesForGroup>[0];
type searchMappingRulesForGroupBody = (NonNullable<searchMappingRulesForGroupOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForGroupPathParam_groupId = (NonNullable<searchMappingRulesForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type searchMappingRulesForGroupInput = searchMappingRulesForGroupBody & { groupId: searchMappingRulesForGroupPathParam_groupId };
/** Management of eventual consistency **/
export type searchMappingRulesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForGroup>> 
};
type searchMappingRulesForRoleOptions = Parameters<typeof Sdk.searchMappingRulesForRole>[0];
type searchMappingRulesForRoleBody = (NonNullable<searchMappingRulesForRoleOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForRolePathParam_roleId = (NonNullable<searchMappingRulesForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type searchMappingRulesForRoleInput = searchMappingRulesForRoleBody & { roleId: searchMappingRulesForRolePathParam_roleId };
/** Management of eventual consistency **/
export type searchMappingRulesForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForRole>> 
};
type searchMappingRulesForTenantOptions = Parameters<typeof Sdk.searchMappingRulesForTenant>[0];
type searchMappingRulesForTenantBody = (NonNullable<searchMappingRulesForTenantOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForTenantPathParam_tenantId = (NonNullable<searchMappingRulesForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type searchMappingRulesForTenantInput = searchMappingRulesForTenantBody & { tenantId: searchMappingRulesForTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type searchMappingRulesForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForTenant>> 
};
type searchMessageSubscriptionsOptions = Parameters<typeof Sdk.searchMessageSubscriptions>[0];
type searchMessageSubscriptionsBody = (NonNullable<searchMessageSubscriptionsOptions> extends { body?: infer B } ? B : never);
export type searchMessageSubscriptionsInput = searchMessageSubscriptionsBody;
/** Management of eventual consistency **/
export type searchMessageSubscriptionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMessageSubscriptions>> 
};
type searchProcessDefinitionsOptions = Parameters<typeof Sdk.searchProcessDefinitions>[0];
type searchProcessDefinitionsBody = (NonNullable<searchProcessDefinitionsOptions> extends { body?: infer B } ? B : never);
export type searchProcessDefinitionsInput = searchProcessDefinitionsBody;
/** Management of eventual consistency **/
export type searchProcessDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessDefinitions>> 
};
type searchProcessInstanceIncidentsOptions = Parameters<typeof Sdk.searchProcessInstanceIncidents>[0];
type searchProcessInstanceIncidentsBody = (NonNullable<searchProcessInstanceIncidentsOptions> extends { body?: infer B } ? B : never);
type searchProcessInstanceIncidentsPathParam_processInstanceKey = (NonNullable<searchProcessInstanceIncidentsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type searchProcessInstanceIncidentsInput = searchProcessInstanceIncidentsBody & { processInstanceKey: searchProcessInstanceIncidentsPathParam_processInstanceKey };
/** Management of eventual consistency **/
export type searchProcessInstanceIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstanceIncidents>> 
};
type searchProcessInstancesOptions = Parameters<typeof Sdk.searchProcessInstances>[0];
type searchProcessInstancesBody = (NonNullable<searchProcessInstancesOptions> extends { body?: infer B } ? B : never);
export type searchProcessInstancesInput = searchProcessInstancesBody;
/** Management of eventual consistency **/
export type searchProcessInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstances>> 
};
type searchRolesOptions = Parameters<typeof Sdk.searchRoles>[0];
type searchRolesBody = (NonNullable<searchRolesOptions> extends { body?: infer B } ? B : never);
export type searchRolesInput = searchRolesBody;
/** Management of eventual consistency **/
export type searchRolesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRoles>> 
};
type searchRolesForGroupOptions = Parameters<typeof Sdk.searchRolesForGroup>[0];
type searchRolesForGroupBody = (NonNullable<searchRolesForGroupOptions> extends { body?: infer B } ? B : never);
type searchRolesForGroupPathParam_groupId = (NonNullable<searchRolesForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type searchRolesForGroupInput = searchRolesForGroupBody & { groupId: searchRolesForGroupPathParam_groupId };
/** Management of eventual consistency **/
export type searchRolesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForGroup>> 
};
type searchRolesForTenantOptions = Parameters<typeof Sdk.searchRolesForTenant>[0];
type searchRolesForTenantBody = (NonNullable<searchRolesForTenantOptions> extends { body?: infer B } ? B : never);
type searchRolesForTenantPathParam_tenantId = (NonNullable<searchRolesForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type searchRolesForTenantInput = searchRolesForTenantBody & { tenantId: searchRolesForTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type searchRolesForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForTenant>> 
};
type searchTenantsOptions = Parameters<typeof Sdk.searchTenants>[0];
type searchTenantsBody = (NonNullable<searchTenantsOptions> extends { body?: infer B } ? B : never);
export type searchTenantsInput = searchTenantsBody;
/** Management of eventual consistency **/
export type searchTenantsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchTenants>> 
};
type searchUsersOptions = Parameters<typeof Sdk.searchUsers>[0];
type searchUsersBody = (NonNullable<searchUsersOptions> extends { body?: infer B } ? B : never);
export type searchUsersInput = searchUsersBody;
/** Management of eventual consistency **/
export type searchUsersConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsers>> 
};
type searchUsersForGroupOptions = Parameters<typeof Sdk.searchUsersForGroup>[0];
type searchUsersForGroupBody = (NonNullable<searchUsersForGroupOptions> extends { body?: infer B } ? B : never);
type searchUsersForGroupPathParam_groupId = (NonNullable<searchUsersForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type searchUsersForGroupInput = searchUsersForGroupBody & { groupId: searchUsersForGroupPathParam_groupId };
/** Management of eventual consistency **/
export type searchUsersForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForGroup>> 
};
type searchUsersForRoleOptions = Parameters<typeof Sdk.searchUsersForRole>[0];
type searchUsersForRoleBody = (NonNullable<searchUsersForRoleOptions> extends { body?: infer B } ? B : never);
type searchUsersForRolePathParam_roleId = (NonNullable<searchUsersForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type searchUsersForRoleInput = searchUsersForRoleBody & { roleId: searchUsersForRolePathParam_roleId };
/** Management of eventual consistency **/
export type searchUsersForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForRole>> 
};
type searchUsersForTenantOptions = Parameters<typeof Sdk.searchUsersForTenant>[0];
type searchUsersForTenantBody = (NonNullable<searchUsersForTenantOptions> extends { body?: infer B } ? B : never);
type searchUsersForTenantPathParam_tenantId = (NonNullable<searchUsersForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type searchUsersForTenantInput = searchUsersForTenantBody & { tenantId: searchUsersForTenantPathParam_tenantId };
/** Management of eventual consistency **/
export type searchUsersForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForTenant>> 
};
type searchUserTaskAuditLogsOptions = Parameters<typeof Sdk.searchUserTaskAuditLogs>[0];
type searchUserTaskAuditLogsBody = (NonNullable<searchUserTaskAuditLogsOptions> extends { body?: infer B } ? B : never);
type searchUserTaskAuditLogsPathParam_userTaskKey = (NonNullable<searchUserTaskAuditLogsOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type searchUserTaskAuditLogsInput = searchUserTaskAuditLogsBody & { userTaskKey: searchUserTaskAuditLogsPathParam_userTaskKey };
/** Management of eventual consistency **/
export type searchUserTaskAuditLogsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTaskAuditLogs>> 
};
type searchUserTaskEffectiveVariablesOptions = Parameters<typeof Sdk.searchUserTaskEffectiveVariables>[0];
type searchUserTaskEffectiveVariablesBody = (NonNullable<searchUserTaskEffectiveVariablesOptions> extends { body?: infer B } ? B : never);
type searchUserTaskEffectiveVariablesPathParam_userTaskKey = (NonNullable<searchUserTaskEffectiveVariablesOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type searchUserTaskEffectiveVariablesQueryParam_truncateValues = (NonNullable<searchUserTaskEffectiveVariablesOptions> extends { query?: { truncateValues?: infer Q } } ? Q : any);
export type searchUserTaskEffectiveVariablesInput = searchUserTaskEffectiveVariablesBody & { userTaskKey: searchUserTaskEffectiveVariablesPathParam_userTaskKey; truncateValues?: searchUserTaskEffectiveVariablesQueryParam_truncateValues };
/** Management of eventual consistency **/
export type searchUserTaskEffectiveVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTaskEffectiveVariables>> 
};
type searchUserTasksOptions = Parameters<typeof Sdk.searchUserTasks>[0];
type searchUserTasksBody = (NonNullable<searchUserTasksOptions> extends { body?: infer B } ? B : never);
export type searchUserTasksInput = searchUserTasksBody;
/** Management of eventual consistency **/
export type searchUserTasksConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTasks>> 
};
type searchUserTaskVariablesOptions = Parameters<typeof Sdk.searchUserTaskVariables>[0];
type searchUserTaskVariablesBody = (NonNullable<searchUserTaskVariablesOptions> extends { body?: infer B } ? B : never);
type searchUserTaskVariablesPathParam_userTaskKey = (NonNullable<searchUserTaskVariablesOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type searchUserTaskVariablesQueryParam_truncateValues = (NonNullable<searchUserTaskVariablesOptions> extends { query?: { truncateValues?: infer Q } } ? Q : any);
export type searchUserTaskVariablesInput = searchUserTaskVariablesBody & { userTaskKey: searchUserTaskVariablesPathParam_userTaskKey; truncateValues?: searchUserTaskVariablesQueryParam_truncateValues };
/** Management of eventual consistency **/
export type searchUserTaskVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTaskVariables>> 
};
type searchVariablesOptions = Parameters<typeof Sdk.searchVariables>[0];
type searchVariablesBody = (NonNullable<searchVariablesOptions> extends { body?: infer B } ? B : never);
type searchVariablesQueryParam_truncateValues = (NonNullable<searchVariablesOptions> extends { query?: { truncateValues?: infer Q } } ? Q : any);
export type searchVariablesInput = searchVariablesBody & { truncateValues?: searchVariablesQueryParam_truncateValues };
/** Management of eventual consistency **/
export type searchVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchVariables>> 
};
type suspendBatchOperationOptions = Parameters<typeof Sdk.suspendBatchOperation>[0];
type suspendBatchOperationBody = (NonNullable<suspendBatchOperationOptions> extends { body?: infer B } ? B : never);
type suspendBatchOperationPathParam_batchOperationKey = (NonNullable<suspendBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
export type suspendBatchOperationInput = suspendBatchOperationBody & { batchOperationKey: suspendBatchOperationPathParam_batchOperationKey };
type throwJobErrorOptions = Parameters<typeof Sdk.throwJobError>[0];
type throwJobErrorBody = (NonNullable<throwJobErrorOptions> extends { body?: infer B } ? B : never);
type throwJobErrorPathParam_jobKey = (NonNullable<throwJobErrorOptions> extends { path: { jobKey: infer P } } ? P : any);
export type throwJobErrorInput = throwJobErrorBody & { jobKey: throwJobErrorPathParam_jobKey };
type unassignClientFromGroupOptions = Parameters<typeof Sdk.unassignClientFromGroup>[0];
type unassignClientFromGroupPathParam_groupId = (NonNullable<unassignClientFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignClientFromGroupPathParam_clientId = (NonNullable<unassignClientFromGroupOptions> extends { path: { clientId: infer P } } ? P : any);
export type unassignClientFromGroupInput = { groupId: unassignClientFromGroupPathParam_groupId; clientId: unassignClientFromGroupPathParam_clientId };
type unassignClientFromTenantOptions = Parameters<typeof Sdk.unassignClientFromTenant>[0];
type unassignClientFromTenantPathParam_tenantId = (NonNullable<unassignClientFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignClientFromTenantPathParam_clientId = (NonNullable<unassignClientFromTenantOptions> extends { path: { clientId: infer P } } ? P : any);
export type unassignClientFromTenantInput = { tenantId: unassignClientFromTenantPathParam_tenantId; clientId: unassignClientFromTenantPathParam_clientId };
type unassignGroupFromTenantOptions = Parameters<typeof Sdk.unassignGroupFromTenant>[0];
type unassignGroupFromTenantPathParam_tenantId = (NonNullable<unassignGroupFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignGroupFromTenantPathParam_groupId = (NonNullable<unassignGroupFromTenantOptions> extends { path: { groupId: infer P } } ? P : any);
export type unassignGroupFromTenantInput = { tenantId: unassignGroupFromTenantPathParam_tenantId; groupId: unassignGroupFromTenantPathParam_groupId };
type unassignMappingRuleFromGroupOptions = Parameters<typeof Sdk.unassignMappingRuleFromGroup>[0];
type unassignMappingRuleFromGroupPathParam_groupId = (NonNullable<unassignMappingRuleFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignMappingRuleFromGroupPathParam_mappingRuleId = (NonNullable<unassignMappingRuleFromGroupOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type unassignMappingRuleFromGroupInput = { groupId: unassignMappingRuleFromGroupPathParam_groupId; mappingRuleId: unassignMappingRuleFromGroupPathParam_mappingRuleId };
type unassignMappingRuleFromTenantOptions = Parameters<typeof Sdk.unassignMappingRuleFromTenant>[0];
type unassignMappingRuleFromTenantPathParam_tenantId = (NonNullable<unassignMappingRuleFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignMappingRuleFromTenantPathParam_mappingRuleId = (NonNullable<unassignMappingRuleFromTenantOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type unassignMappingRuleFromTenantInput = { tenantId: unassignMappingRuleFromTenantPathParam_tenantId; mappingRuleId: unassignMappingRuleFromTenantPathParam_mappingRuleId };
type unassignRoleFromClientOptions = Parameters<typeof Sdk.unassignRoleFromClient>[0];
type unassignRoleFromClientPathParam_roleId = (NonNullable<unassignRoleFromClientOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromClientPathParam_clientId = (NonNullable<unassignRoleFromClientOptions> extends { path: { clientId: infer P } } ? P : any);
export type unassignRoleFromClientInput = { roleId: unassignRoleFromClientPathParam_roleId; clientId: unassignRoleFromClientPathParam_clientId };
type unassignRoleFromGroupOptions = Parameters<typeof Sdk.unassignRoleFromGroup>[0];
type unassignRoleFromGroupPathParam_roleId = (NonNullable<unassignRoleFromGroupOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromGroupPathParam_groupId = (NonNullable<unassignRoleFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type unassignRoleFromGroupInput = { roleId: unassignRoleFromGroupPathParam_roleId; groupId: unassignRoleFromGroupPathParam_groupId };
type unassignRoleFromMappingRuleOptions = Parameters<typeof Sdk.unassignRoleFromMappingRule>[0];
type unassignRoleFromMappingRulePathParam_roleId = (NonNullable<unassignRoleFromMappingRuleOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromMappingRulePathParam_mappingRuleId = (NonNullable<unassignRoleFromMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type unassignRoleFromMappingRuleInput = { roleId: unassignRoleFromMappingRulePathParam_roleId; mappingRuleId: unassignRoleFromMappingRulePathParam_mappingRuleId };
type unassignRoleFromTenantOptions = Parameters<typeof Sdk.unassignRoleFromTenant>[0];
type unassignRoleFromTenantPathParam_tenantId = (NonNullable<unassignRoleFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignRoleFromTenantPathParam_roleId = (NonNullable<unassignRoleFromTenantOptions> extends { path: { roleId: infer P } } ? P : any);
export type unassignRoleFromTenantInput = { tenantId: unassignRoleFromTenantPathParam_tenantId; roleId: unassignRoleFromTenantPathParam_roleId };
type unassignRoleFromUserOptions = Parameters<typeof Sdk.unassignRoleFromUser>[0];
type unassignRoleFromUserPathParam_roleId = (NonNullable<unassignRoleFromUserOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromUserPathParam_username = (NonNullable<unassignRoleFromUserOptions> extends { path: { username: infer P } } ? P : any);
export type unassignRoleFromUserInput = { roleId: unassignRoleFromUserPathParam_roleId; username: unassignRoleFromUserPathParam_username };
type unassignUserFromGroupOptions = Parameters<typeof Sdk.unassignUserFromGroup>[0];
type unassignUserFromGroupPathParam_groupId = (NonNullable<unassignUserFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignUserFromGroupPathParam_username = (NonNullable<unassignUserFromGroupOptions> extends { path: { username: infer P } } ? P : any);
export type unassignUserFromGroupInput = { groupId: unassignUserFromGroupPathParam_groupId; username: unassignUserFromGroupPathParam_username };
type unassignUserFromTenantOptions = Parameters<typeof Sdk.unassignUserFromTenant>[0];
type unassignUserFromTenantPathParam_tenantId = (NonNullable<unassignUserFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignUserFromTenantPathParam_username = (NonNullable<unassignUserFromTenantOptions> extends { path: { username: infer P } } ? P : any);
export type unassignUserFromTenantInput = { tenantId: unassignUserFromTenantPathParam_tenantId; username: unassignUserFromTenantPathParam_username };
type unassignUserTaskOptions = Parameters<typeof Sdk.unassignUserTask>[0];
type unassignUserTaskPathParam_userTaskKey = (NonNullable<unassignUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type unassignUserTaskInput = { userTaskKey: unassignUserTaskPathParam_userTaskKey };
type updateAuthorizationOptions = Parameters<typeof Sdk.updateAuthorization>[0];
type updateAuthorizationBody = (NonNullable<updateAuthorizationOptions> extends { body?: infer B } ? B : never);
type updateAuthorizationPathParam_authorizationKey = (NonNullable<updateAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
export type updateAuthorizationInput = updateAuthorizationBody & { authorizationKey: updateAuthorizationPathParam_authorizationKey };
type updateGlobalClusterVariableOptions = Parameters<typeof Sdk.updateGlobalClusterVariable>[0];
type updateGlobalClusterVariableBody = (NonNullable<updateGlobalClusterVariableOptions> extends { body?: infer B } ? B : never);
type updateGlobalClusterVariablePathParam_name = (NonNullable<updateGlobalClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type updateGlobalClusterVariableInput = updateGlobalClusterVariableBody & { name: updateGlobalClusterVariablePathParam_name };
type updateGlobalTaskListenerOptions = Parameters<typeof Sdk.updateGlobalTaskListener>[0];
type updateGlobalTaskListenerBody = (NonNullable<updateGlobalTaskListenerOptions> extends { body?: infer B } ? B : never);
type updateGlobalTaskListenerPathParam_id = (NonNullable<updateGlobalTaskListenerOptions> extends { path: { id: infer P } } ? P : any);
export type updateGlobalTaskListenerInput = updateGlobalTaskListenerBody & { id: updateGlobalTaskListenerPathParam_id };
type updateGroupOptions = Parameters<typeof Sdk.updateGroup>[0];
type updateGroupBody = (NonNullable<updateGroupOptions> extends { body?: infer B } ? B : never);
type updateGroupPathParam_groupId = (NonNullable<updateGroupOptions> extends { path: { groupId: infer P } } ? P : any);
export type updateGroupInput = updateGroupBody & { groupId: updateGroupPathParam_groupId };
type updateJobOptions = Parameters<typeof Sdk.updateJob>[0];
type updateJobBody = (NonNullable<updateJobOptions> extends { body?: infer B } ? B : never);
type updateJobPathParam_jobKey = (NonNullable<updateJobOptions> extends { path: { jobKey: infer P } } ? P : any);
export type updateJobInput = updateJobBody & { jobKey: updateJobPathParam_jobKey };
type updateMappingRuleOptions = Parameters<typeof Sdk.updateMappingRule>[0];
type updateMappingRuleBody = (NonNullable<updateMappingRuleOptions> extends { body?: infer B } ? B : never);
type updateMappingRulePathParam_mappingRuleId = (NonNullable<updateMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
export type updateMappingRuleInput = updateMappingRuleBody & { mappingRuleId: updateMappingRulePathParam_mappingRuleId };
type updateRoleOptions = Parameters<typeof Sdk.updateRole>[0];
type updateRoleBody = (NonNullable<updateRoleOptions> extends { body?: infer B } ? B : never);
type updateRolePathParam_roleId = (NonNullable<updateRoleOptions> extends { path: { roleId: infer P } } ? P : any);
export type updateRoleInput = updateRoleBody & { roleId: updateRolePathParam_roleId };
type updateTenantOptions = Parameters<typeof Sdk.updateTenant>[0];
type updateTenantBody = (NonNullable<updateTenantOptions> extends { body?: infer B } ? B : never);
type updateTenantPathParam_tenantId = (NonNullable<updateTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
export type updateTenantInput = updateTenantBody & { tenantId: updateTenantPathParam_tenantId };
type updateTenantClusterVariableOptions = Parameters<typeof Sdk.updateTenantClusterVariable>[0];
type updateTenantClusterVariableBody = (NonNullable<updateTenantClusterVariableOptions> extends { body?: infer B } ? B : never);
type updateTenantClusterVariablePathParam_tenantId = (NonNullable<updateTenantClusterVariableOptions> extends { path: { tenantId: infer P } } ? P : any);
type updateTenantClusterVariablePathParam_name = (NonNullable<updateTenantClusterVariableOptions> extends { path: { name: infer P } } ? P : any);
export type updateTenantClusterVariableInput = updateTenantClusterVariableBody & { tenantId: updateTenantClusterVariablePathParam_tenantId; name: updateTenantClusterVariablePathParam_name };
type updateUserOptions = Parameters<typeof Sdk.updateUser>[0];
type updateUserBody = (NonNullable<updateUserOptions> extends { body?: infer B } ? B : never);
type updateUserPathParam_username = (NonNullable<updateUserOptions> extends { path: { username: infer P } } ? P : any);
export type updateUserInput = updateUserBody & { username: updateUserPathParam_username };
type updateUserTaskOptions = Parameters<typeof Sdk.updateUserTask>[0];
type updateUserTaskBody = (NonNullable<updateUserTaskOptions> extends { body?: infer B } ? B : never);
type updateUserTaskPathParam_userTaskKey = (NonNullable<updateUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type updateUserTaskInput = updateUserTaskBody & { userTaskKey: updateUserTaskPathParam_userTaskKey };
const VOID_RESPONSES = new Set(['zDeleteAuthorizationResponse', 'zUpdateAuthorizationResponse', 'zCancelBatchOperationResponse', 'zResumeBatchOperationResponse', 'zSuspendBatchOperationResponse', 'zPinClockResponse', 'zResetClockResponse', 'zDeleteGlobalClusterVariableResponse', 'zDeleteTenantClusterVariableResponse', 'zDeleteDecisionInstanceResponse', 'zDeleteDocumentResponse', 'zActivateAdHocSubProcessActivitiesResponse', 'zCreateElementInstanceVariablesResponse', 'zDeleteGlobalTaskListenerResponse', 'zDeleteGroupResponse', 'zUnassignClientFromGroupResponse', 'zAssignClientToGroupResponse', 'zUnassignMappingRuleFromGroupResponse', 'zAssignMappingRuleToGroupResponse', 'zUnassignUserFromGroupResponse', 'zAssignUserToGroupResponse', 'zResolveIncidentResponse', 'zUpdateJobResponse', 'zCompleteJobResponse', 'zThrowJobErrorResponse', 'zFailJobResponse', 'zDeleteMappingRuleResponse', 'zGetStartProcessFormResponse', 'zCancelProcessInstanceResponse', 'zDeleteProcessInstanceResponse', 'zMigrateProcessInstanceResponse', 'zModifyProcessInstanceResponse', 'zDeleteRoleResponse', 'zUnassignRoleFromClientResponse', 'zAssignRoleToClientResponse', 'zUnassignRoleFromGroupResponse', 'zAssignRoleToGroupResponse', 'zUnassignRoleFromMappingRuleResponse', 'zAssignRoleToMappingRuleResponse', 'zUnassignRoleFromUserResponse', 'zAssignRoleToUserResponse', 'zGetStatusResponse', 'zDeleteTenantResponse', 'zUnassignClientFromTenantResponse', 'zAssignClientToTenantResponse', 'zUnassignGroupFromTenantResponse', 'zAssignGroupToTenantResponse', 'zUnassignMappingRuleFromTenantResponse', 'zAssignMappingRuleToTenantResponse', 'zUnassignRoleFromTenantResponse', 'zAssignRoleToTenantResponse', 'zUnassignUserFromTenantResponse', 'zAssignUserToTenantResponse', 'zDeleteUserResponse', 'zUpdateUserTaskResponse', 'zUnassignUserTaskResponse', 'zAssignUserTaskResponse', 'zCompleteUserTaskResponse', 'zGetUserTaskFormResponse']);
/** Extended deployment result with typed buckets for direct access to deployed artifacts. */
export interface ExtendedDeploymentResult extends _DataOf<typeof Sdk.createDeployment> {
  processes: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["processDefinition"]>>;
  decisions: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["decisionDefinition"]>>;
  decisionRequirements: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["decisionRequirements"]>>;
  forms: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["form"]>>;
  resources: Array<NonNullable<_DataOf<typeof Sdk.createDeployment>["deployments"][number]["resource"]>>;
}
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'CancelError';
  }
}
export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}
function toCancelable<T>(factory: (signal: AbortSignal) => Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  let settled = false;
  let rejectRef: (e: any) => void = () => {};
  const p: any = new Promise<T>((resolve, reject) => {
    rejectRef = reject;
    factory(ac.signal)
      .then((v) => {
        settled = true;
        resolve(v);
      })
      .catch((e) => {
        // If already canceled and fetch produced an abort, translate to CancelSdkError once.
        if (
          ac.signal.aborted &&
          (e?.name === 'AbortError' || /abort|cancel/i.test(e?.message || ''))
        ) {
          const c = new Error('Cancelled') as any;
          c.name = 'CancelSdkError';
          return reject(c);
        }
        reject(e);
      });
  });
  p.cancel = () => {
    if (ac.signal.aborted) return; // idempotent
    ac.abort();
    // If underlying promise hasn't settled yet, proactively reject with CancelSdkError.
    if (!settled) {
      const c = new Error('Cancelled') as any;
      c.name = 'CancelSdkError';
      rejectRef(c);
    }
  };
  return p as CancelablePromise<T>;
}

// New simplified input: we only accept an already hydrated CamundaConfig. Users wanting env
// overrides or partials should call hydrateConfig first (single source of truth) and pass
// the resulting config.
export interface CamundaOptions {
  // Strongly typed env-style overrides (CAMUNDA_* keys). Optional.
  config?: EnvOverrides;
  // Custom fetch implementation.
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  // Provide a custom env map (mainly for tests). Defaults to process.env.
  env?: Record<string, string | undefined>;
  // Per-client logging options
  log?: { level?: LogLevel; transport?: LogTransport };
  // Telemetry (Phase 1)
  telemetry?: {
    hooks?: import('../runtime/telemetry').TelemetryHooks;
    correlation?: boolean;
    mirrorToLog?: boolean;
  };
  // If true (default), non-2xx HTTP responses throw instead of returning an error object.
  // Set to false to opt into non-throwing behavior.
  throwOnError?: boolean;
  // Optional injected SupportLogger (Node-only). If absent, auto-created when enabled via env/config.
  supportLogger?: SupportLogger;
}

export function createCamundaClient(options?: CamundaOptions) {
  return new CamundaClient(options);
}

export class CamundaClient {
  private _client: Client;
  private _config: Readonly<CamundaConfig>;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', raw: 'req:none,res:none' } as any,
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: '',
  } as any);
  private _baseFetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();
  private _bp: BackpressureManager;
  /** Registered job workers created via createJobWorker (lifecycle managed by user). */
  private _workers: any[] = [];
  /** Shared thread pool for all threaded job workers (lazy-initialised on first use). */
  private _threadPool: ThreadPool | null = null;
  /** Support logger (Node-only; no-op in browser). */
  private _supportLogger: SupportLogger = new (class implements SupportLogger {
    log() {}
  })();

  // Internal fixed error mode for eventual consistency ('throw' | 'result'). Not user mutable after construction.
  private readonly _errorMode: 'throw' | 'result';

  private _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Initialize per-client logger
    this._log = createLogger({
      level: opts.log?.level || this._config.logLevel,
      transport: opts.log?.transport,
    });
    const baseFetch = opts.fetch;
    this._baseFetch = baseFetch;
    this._fetch = baseFetch;
    // Telemetry wrap (after logger & config known). If user provided explicit telemetry, honor it.
    // Else if environment enabled auto telemetry logging, wrap with mirrorToLog + optional correlation.
    if (opts.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: opts.telemetry.hooks,
        correlation: opts.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: opts.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: true,
      });
    } else if (
      // Auto-enable mirror telemetry when trace level and user did not explicitly set CAMUNDA_SDK_TELEMETRY_LOG to a disabling value.
      /^(trace|silly)$/.test(this._log.level()) &&
      !this._config.telemetry?.log &&
      // No explicit override provided
      (this._overrides as any)['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined &&
      // And env var either absent or truthy enabling value
      (typeof process === 'undefined' ||
        process.env['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined ||
        /^(1|true|yes|on)$/i.test(process.env['CAMUNDA_SDK_TELEMETRY_LOG'] || ''))
    ) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry?.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: true,
      });
    }
    this._client = createClient({
      baseUrl: this._config.restAddress,
      fetch: this._fetch,
      throwOnError: opts.throwOnError !== false,
    });
    // Unsafe diagnostic level warning
    if (this._log.level() === 'silly') {
      this._log.warn(
        'log.level.silly.enabled',
        'HTTP request and response bodies will be logged; this may leak sensitive information. Use only for local debugging.'
      );
    }
    installAuthInterceptor(
      this._client,
      () => this._config.auth.strategy,
      () => this._auth.getAuthHeaders()
    );
    this._auth = createAuthFacade(this._config, {
      fetch: this._fetch,
      logger: this._log,
      telemetryHooks: opts.telemetry?.hooks,
      correlationProvider:
        opts.telemetry?.correlation || (!opts.telemetry && this._config.telemetry?.correlation)
          ? () => getCorrelation()
          : undefined,
    });
    this._validation.update(this._config.validation);
    this._validation.attachLogger(this._log);
    this._errorMode = (opts as any).errorMode === 'result' ? 'result' : 'throw';
    // Support logger initialization (after config hydration & before major components start emitting)
    this._supportLogger = createSupportLogger(this._config, opts.supportLogger);
    try {
      this._supportLogger.log('CamundaClient constructed');
    } catch {
      /* ignore */
    }
    // Emit canonical support log preamble (idempotent; covers injected loggers)
    this.emitSupportLogPreamble();
    // Initialize global backpressure manager with tuned config
    this._bp = new BackpressureManager({
      logger: this._log.scope('bp'),
      config: {
        enabled: this._config.backpressure.enabled,
        observeOnly: this._config.backpressure.observeOnly,
        // In observe-only or disabled modes we keep permitsMax null.
        initialMaxConcurrency:
          this._config.backpressure.enabled && !this._config.backpressure.observeOnly
            ? this._config.backpressure.initialMax || null
            : null,
        reduceFactor: this._config.backpressure.softFactor,
        severeReduceFactor: this._config.backpressure.severeFactor,
        recoveryIntervalMs: this._config.backpressure.recoveryIntervalMs,
        recoveryStep: this._config.backpressure.recoveryStep,
        decayQuietMs: this._config.backpressure.decayQuietMs,
        floorConcurrency: this._config.backpressure.floor,
        severeThreshold: this._config.backpressure.severeThreshold,
        maxWaiters: this._config.backpressure.maxWaiters,
        healthyRecoveryMultiplier: this._config.backpressure.healthyRecoveryMultiplier,
        unlimitedAfterHealthyMs: this._config.backpressure.unlimitedAfterHealthyMs,
      },
    });
    // Debug-level emission of redacted effective configuration (lazy)
    this._log.debug(() => {
      try {
        const last = (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG;
        const redacted = last?.toRedactedObject ? last.toRedactedObject() : undefined;
        return redacted ? ['config.hydrated', { config: redacted }] : ['config.hydrated'];
      } catch {
        return ['config.hydrated'];
      }
    });
  }

  get config(): Readonly<CamundaConfig> {
    return this._config;
  }
  /**
   * Read-only snapshot of current hydrated configuration (do not mutate directly).
   * Use configure(...) to apply changes.
   */
  getConfig(): Readonly<CamundaConfig> {
    return this._config;
  }

  // Merge new overrides and re-hydrate.
  configure(next: CamundaOptions) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
    if (next.fetch) this._baseFetch = next.fetch;
    // Always wrap from the base fetch to avoid accumulating closure layers on repeated configure() calls.
    this._fetch = this._baseFetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Re-wrap fetch if telemetry present OR env auto telemetry toggled
    if (next.telemetry) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: next.telemetry.hooks,
        correlation: next.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: next.telemetry.mirrorToLog,
      });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: true,
      });
    } else if (
      /^(trace|silly)$/.test(this._log.level()) &&
      !this._config.telemetry?.log &&
      (this._overrides as any)['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined &&
      (typeof process === 'undefined' ||
        process.env['CAMUNDA_SDK_TELEMETRY_LOG'] === undefined ||
        /^(1|true|yes|on)$/i.test(process.env['CAMUNDA_SDK_TELEMETRY_LOG'] || ''))
    ) {
      this._fetch = wrapFetch(this._fetch || (fetch as any), {
        hooks: undefined,
        correlation: this._config.telemetry?.correlation ? () => getCorrelation() : undefined,
        logger: this._log,
        supportLogger: this._supportLogger,
        mirrorToLog: true,
      });
    }
    this._client = createClient({
      baseUrl: this._config.restAddress,
      fetch: this._fetch,
      throwOnError: next.throwOnError !== false,
    });
    installAuthInterceptor(
      this._client,
      () => this._config.auth.strategy,
      () => this._auth.getAuthHeaders()
    );
    // Update logger level / transport if provided, else apply config log level
    if (next.log?.level) this._log.setLevel(next.log.level);
    else this._log.setLevel(this._config.logLevel);
    if (next.log?.transport !== undefined) this._log.setTransport(next.log.transport);
    this._auth = createAuthFacade(this._config, {
      fetch: this._fetch,
      logger: this._log,
      telemetryHooks: next.telemetry?.hooks,
      correlationProvider:
        next.telemetry?.correlation || (!next.telemetry && this._config.telemetry?.correlation)
          ? () => getCorrelation()
          : undefined,
    });
    this._validation.update(this._config.validation);
    this._validation.attachLogger(this._log);
    // _errorMode intentionally not mutable post-construction.
    // Re-init support logger only if it was disabled and now enabled (avoid overwriting custom injected instance)
    if (!next.supportLogger && !('supportLogger' in next)) {
      // Auto-detect change in enable flag
      const shouldEnable = this._config.supportLog?.enabled;
      const previouslyEnabled = (this._supportLogger as any).enabled === true; // heuristic
      if (shouldEnable && !previouslyEnabled) {
        this._supportLogger = createSupportLogger(this._config);
        this._supportLogger.log('Support logger enabled via reconfigure');
      }
    } else if (next.supportLogger) {
      this._supportLogger = next.supportLogger;
      this._supportLogger.log('Support logger injected via reconfigure');
    }
    // Emit updated redacted configuration when debug enabled
    this._log.debug(() => {
      try {
        const last = (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG;
        const redacted = last?.toRedactedObject ? last.toRedactedObject() : undefined;
        return redacted ? ['config.reconfigured', { config: redacted }] : ['config.reconfigured'];
      } catch {
        return ['config.reconfigured'];
      }
    });
  }

  // Auth helpers
  async getAuthHeaders() {
    return this._auth.getAuthHeaders();
  }
  async forceAuthRefresh() {
    return this._auth.forceRefresh();
  }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) {
    this._auth.clearCache(opts);
  }
  onAuthHeaders(
    h: (headers: Record<string, string>) => Record<string, string> | Promise<Record<string, string>>
  ) {
    this._auth.registerHeadersHook(h);
  }

  /** @internal ValidationManager is internal; tests may reach via (client as any)._validation */
  /** Access a scoped logger (internal & future user emission). */
  logger(scope?: string) {
    return scope ? this._log.scope(scope) : this._log;
  }

  /** Internal accessor (read-only) for eventual consistency error mode. */
  getErrorMode(): 'throw' | 'result' {
    return this._errorMode;
  }

  /** Internal accessor for support logger (no public API commitment yet). */
  _getSupportLogger(): SupportLogger {
    return this._supportLogger;
  }

  /**
   * Emit the standard support log preamble & redacted configuration to the current support logger.
   * Safe to call multiple times; subsequent calls are ignored (idempotent).
   * Useful when a custom supportLogger was injected and you still want the canonical header & config dump.
   */
  emitSupportLogPreamble() {
    try {
      writeSupportLogPreamble(this._supportLogger, this._config as CamundaConfig);
    } catch (e) {
      this._log.debug(() => ['supportLog.preamble.error', e]);
    }
  }

  // Run a function with a correlation ID (manual propagation phase 1)
  withCorrelation<T>(id: string, fn: () => Promise<T> | T): Promise<T> {
    return _withCorrelation(id, fn);
  }

  // Helper for detecting documented void responses (stable public contract)
  // Referenced from generated code - DO NOT REMOVE
  // Uses build-time generated VOID_RESPONSES set (no runtime zod dependency needed)
  private _isVoidResponse(name: string): boolean {
    return VOID_RESPONSES.has(name);
  }

  // Lazy-load zod schemas on first validation use. Returns cached module.
  private _schemasPromise: Promise<typeof import('../gen/zod.gen')> | null = null;
  private _loadSchemas(): Promise<typeof import('../gen/zod.gen')> {
    if (!this._schemasPromise) {
      this._schemasPromise = import('../gen/zod.gen');
    }
    return this._schemasPromise;
  }

  /** Internal invocation helper to apply global backpressure gating + retry + normalization */
  public async _invokeWithRetry<T>(
    op: () => Promise<T>,
    opts: {
      opId: string;
      exempt?: boolean;
      classify?: (e: any) => { retryable: boolean; reason: string };
      retryOverride?: Partial<HttpRetryPolicy> | false;
    }
  ): Promise<T> {
    const { opId, exempt, classify, retryOverride } = opts;
    const policy: HttpRetryPolicy =
      retryOverride === false
        ? { maxAttempts: 1, baseDelayMs: 0, maxDelayMs: 0 }
        : retryOverride
          ? { ...this._config.httpRetry, ...retryOverride }
          : this._config.httpRetry;
    const signal: AbortSignal | undefined = undefined; // placeholder if we later pass through
    if (!exempt) {
      await this._bp.acquire(signal);
    }
    try {
      const result = await executeWithHttpRetry(
        async () => op(),
        policy,
        this._log.scope(opId),
        (err) => {
          const decision = (classify ? classify(err) : defaultHttpClassifier(err)) as any;
          if (decision && decision.retryable && /backpressure|http-429/.test(decision.reason)) {
            this._bp.recordBackpressure();
          }
          return decision;
        }
      );
      this._bp.recordHealthyHint();
      return result;
    } catch (e: any) {
      // Non-retryable or exhausted
      if (e && (e as any).status && (e as any).status === 429) this._bp.recordBackpressure();
      throw normalizeError(e, { opId });
    } finally {
      if (!exempt) this._bp.release();
    }
  }
  /** Shared evaluation for raw transport responses (throwOnError:false) */
  private _evaluateResponse(
    raw: any,
    opId: string,
    buildBackpressureError: (resp: any) => Error | undefined
  ) {
    return evaluateSdkResponse(raw, { opId, buildBackpressureError });
  }
  /** Public accessor for current backpressure adaptive limiter state (stable) */
  getBackpressureState() {
    try {
      return this._bp.getState();
    } catch (e) {
      this._log.error('Error retrieving backpressure state', e);
      return {
        severity: 'healthy',
        permitsMax: null,
        permitsCurrent: 0,
        consecutive: 0,
        waiters: 0,
      };
    }
  }
  /** Return a read-only snapshot of currently registered job workers. */
  getWorkers() {
    return [...this._workers];
  }
  /** Stop all registered job workers (best-effort) and terminate the shared thread pool. */
  stopAllWorkers() {
    for (const w of this._workers) {
      try {
        if (typeof w.stop === 'function') w.stop();
      } catch (e) {
        this._log.warn('worker.stop.error', e);
      }
    }
    if (this._threadPool) {
      this._threadPool.terminate();
      this._threadPool = null;
    }
  }

  /** Get or lazily create the shared thread pool for threaded job workers. */
  private _getOrCreateThreadPool(threadPoolSize?: number): ThreadPool {
    if (!this._threadPool) {
      this._threadPool = new ThreadPool(this as any, threadPoolSize);
    }
    return this._threadPool;
  }
  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // Generated methods
  /**
   * Activate activities within an ad-hoc sub-process
   *
   * Activates selected activities within an ad-hoc sub-process identified by element ID.
   * The provided element IDs must exist within the ad-hoc sub-process instance identified by the
   * provided adHocSubProcessInstanceKey.
   *
    *
   * @example Activate ad-hoc sub-process activities
   * async function activateAdHocSubProcessActivitiesExample(
   *   adHocSubProcessInstanceKey: ElementInstanceKey,
   *   elementId: ElementId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.activateAdHocSubProcessActivities({
   *     adHocSubProcessInstanceKey,
   *     elements: [{ elementId }],
   *   });
   * }
   * @operationId activateAdHocSubProcessActivities
   * @tags Ad-hoc sub-process
   */
  activateAdHocSubProcessActivities(input: activateAdHocSubProcessActivitiesInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.activateAdHocSubProcessActivities>>;
  activateAdHocSubProcessActivities(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { adHocSubProcessInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { adHocSubProcessInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('activateAdHocSubProcessActivities', _schemas.zActivateAdHocSubProcessActivitiesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.activateAdHocSubProcessActivities(opts);
        let data = this._evaluateResponse(_raw, 'activateAdHocSubProcessActivities', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zActivateAdHocSubProcessActivitiesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zActivateAdHocSubProcessActivitiesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('activateAdHocSubProcessActivities', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'activateAdHocSubProcessActivities', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Activate jobs
   *
   * Iterate through all known partitions and activate jobs up to the requested maximum.
   *
    *
   * @example Activate and process jobs
   * async function activateJobsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.activateJobs({
   *     type: 'payment-processing',
   *     timeout: 30000,
   *     maxJobsToActivate: 5,
   *   });
   * 
   *   for (const job of result.jobs) {
   *     console.log(`Job ${job.jobKey}: ${job.type}`);
   * 
   *     // Each enriched job has helper methods
   *     await job.complete({ paymentId: 'PAY-123' });
   *   }
   * }
   * @operationId activateJobs
   * @tags Job
   */
  activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;
  activateJobs(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('activateJobs', _schemas.zActivateJobsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.activateJobs(opts);
        let data = this._evaluateResponse(_raw, 'activateJobs', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zActivateJobsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zActivateJobsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('activateJobs', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        if (data && data.jobs) { data.jobs = data.jobs.map((j: any) => enrichActivatedJob(j, this, this.logger().scope(`job:${j.jobKey}`))); }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'activateJobs', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a client to a group
   *
   * Assigns a client to a group, making it a member of the group.
   * Members of the group inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @example Assign a client to a group
   * async function assignClientToGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignClientToGroup({
   *     groupId: 'engineering-team',
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId assignClientToGroup
   * @tags Group
   */
  assignClientToGroup(input: assignClientToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToGroup>>;
  assignClientToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignClientToGroup', _schemas.zAssignClientToGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignClientToGroup(opts);
        let data = this._evaluateResponse(_raw, 'assignClientToGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignClientToGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignClientToGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignClientToGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignClientToGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a client to a tenant
   *
   * Assign the client to the specified tenant.
   * The client can then access tenant data and perform authorized actions.
   *
    *
   * @example Assign a client to a tenant
   * async function assignClientToTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignClientToTenant({
   *     tenantId,
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId assignClientToTenant
   * @tags Tenant
   */
  assignClientToTenant(input: assignClientToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToTenant>>;
  assignClientToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignClientToTenant', _schemas.zAssignClientToTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignClientToTenant(opts);
        let data = this._evaluateResponse(_raw, 'assignClientToTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignClientToTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignClientToTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignClientToTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignClientToTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a group to a tenant
   *
   * Assigns a group to a specified tenant.
   * Group members (users, clients) can then access tenant data and perform authorized actions.
   *
    *
   * @example Assign a group to a tenant
   * async function assignGroupToTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignGroupToTenant({
   *     tenantId,
   *     groupId: 'engineering-team',
   *   });
   * }
   * @operationId assignGroupToTenant
   * @tags Tenant
   */
  assignGroupToTenant(input: assignGroupToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignGroupToTenant>>;
  assignGroupToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignGroupToTenant', _schemas.zAssignGroupToTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignGroupToTenant(opts);
        let data = this._evaluateResponse(_raw, 'assignGroupToTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignGroupToTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignGroupToTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignGroupToTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignGroupToTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a mapping rule to a group
   *
   * Assigns a mapping rule to a group.
    *
   * @example Assign a mapping rule to a group
   * async function assignMappingRuleToGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignMappingRuleToGroup({
   *     groupId: 'engineering-team',
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId assignMappingRuleToGroup
   * @tags Group
   */
  assignMappingRuleToGroup(input: assignMappingRuleToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToGroup>>;
  assignMappingRuleToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignMappingRuleToGroup', _schemas.zAssignMappingRuleToGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignMappingRuleToGroup(opts);
        let data = this._evaluateResponse(_raw, 'assignMappingRuleToGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignMappingRuleToGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignMappingRuleToGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignMappingRuleToGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignMappingRuleToGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a mapping rule to a tenant
   *
   * Assign a single mapping rule to a specified tenant.
    *
   * @example Assign a mapping rule to a tenant
   * async function assignMappingRuleToTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignMappingRuleToTenant({
   *     tenantId,
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId assignMappingRuleToTenant
   * @tags Tenant
   */
  assignMappingRuleToTenant(input: assignMappingRuleToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToTenant>>;
  assignMappingRuleToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignMappingRuleToTenant', _schemas.zAssignMappingRuleToTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignMappingRuleToTenant(opts);
        let data = this._evaluateResponse(_raw, 'assignMappingRuleToTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignMappingRuleToTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignMappingRuleToTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignMappingRuleToTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignMappingRuleToTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a role to a client
   *
   * Assigns the specified role to the client. The client will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a client
   * async function assignRoleToClientExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToClient({
   *     roleId: 'process-admin',
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId assignRoleToClient
   * @tags Role
   */
  assignRoleToClient(input: assignRoleToClientInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToClient>>;
  assignRoleToClient(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignRoleToClient', _schemas.zAssignRoleToClientData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignRoleToClient(opts);
        let data = this._evaluateResponse(_raw, 'assignRoleToClient', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignRoleToClientResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignRoleToClientResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignRoleToClient', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToClient', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a role to a group
   *
   * Assigns the specified role to the group. Every member of the group (user or client) will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a group
   * async function assignRoleToGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToGroup({
   *     roleId: 'process-admin',
   *     groupId: 'engineering-team',
   *   });
   * }
   * @operationId assignRoleToGroup
   * @tags Role
   */
  assignRoleToGroup(input: assignRoleToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToGroup>>;
  assignRoleToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignRoleToGroup', _schemas.zAssignRoleToGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignRoleToGroup(opts);
        let data = this._evaluateResponse(_raw, 'assignRoleToGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignRoleToGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignRoleToGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignRoleToGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a role to a mapping rule
   *
   * Assigns a role to a mapping rule.
    *
   * @example Assign a role to a mapping rule
   * async function assignRoleToMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToMappingRule({
   *     roleId: 'process-admin',
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId assignRoleToMappingRule
   * @tags Role
   */
  assignRoleToMappingRule(input: assignRoleToMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToMappingRule>>;
  assignRoleToMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignRoleToMappingRule', _schemas.zAssignRoleToMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignRoleToMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'assignRoleToMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignRoleToMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignRoleToMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignRoleToMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToMappingRule', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a role to a tenant
   *
   * Assigns a role to a specified tenant.
   * Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
   *
    *
   * @example Assign a role to a tenant
   * async function assignRoleToTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToTenant({
   *     tenantId,
   *     roleId: 'process-admin',
   *   });
   * }
   * @operationId assignRoleToTenant
   * @tags Tenant
   */
  assignRoleToTenant(input: assignRoleToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToTenant>>;
  assignRoleToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, roleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignRoleToTenant', _schemas.zAssignRoleToTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignRoleToTenant(opts);
        let data = this._evaluateResponse(_raw, 'assignRoleToTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignRoleToTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignRoleToTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignRoleToTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a role to a user
   *
   * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a user
   * async function assignRoleToUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToUser({
   *     roleId: 'process-admin',
   *     username,
   *   });
   * }
   * @operationId assignRoleToUser
   * @tags Role
   */
  assignRoleToUser(input: assignRoleToUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToUser>>;
  assignRoleToUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignRoleToUser', _schemas.zAssignRoleToUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignRoleToUser(opts);
        let data = this._evaluateResponse(_raw, 'assignRoleToUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignRoleToUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignRoleToUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignRoleToUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign user task
   *
   * Assigns a user task with the given key to the given assignee. Assignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Assign a user task
   * async function assignUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserTask({
   *     userTaskKey,
   *     assignee: 'alice',
   *     allowOverride: true,
   *   });
   * }
   * @operationId assignUserTask
   * @tags User task
   */
  assignUserTask(input: assignUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserTask>>;
  assignUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignUserTask', _schemas.zAssignUserTaskData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.assignUserTask(opts);
        let data = this._evaluateResponse(_raw, 'assignUserTask', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignUserTaskResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignUserTaskResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignUserTask', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignUserTask', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a user to a group
   *
   * Assigns a user to a group, making the user a member of the group.
   * Group members inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @example Assign a user to a group
   * async function assignUserToGroupExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserToGroup({
   *     groupId: 'engineering-team',
   *     username,
   *   });
   * }
   * @operationId assignUserToGroup
   * @tags Group
   */
  assignUserToGroup(input: assignUserToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToGroup>>;
  assignUserToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignUserToGroup', _schemas.zAssignUserToGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignUserToGroup(opts);
        let data = this._evaluateResponse(_raw, 'assignUserToGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignUserToGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignUserToGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignUserToGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignUserToGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Assign a user to a tenant
   *
   * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
    *
   * @example Assign a user to a tenant
   * async function assignUserToTenantExample(tenantId: TenantId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserToTenant({
   *     tenantId,
   *     username,
   *   });
   * }
   * @operationId assignUserToTenant
   * @tags Tenant
   */
  assignUserToTenant(input: assignUserToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToTenant>>;
  assignUserToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('assignUserToTenant', _schemas.zAssignUserToTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.assignUserToTenant(opts);
        let data = this._evaluateResponse(_raw, 'assignUserToTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zAssignUserToTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zAssignUserToTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('assignUserToTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'assignUserToTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Broadcast signal
   *
   * Broadcasts a signal.
    *
   * @example Broadcast a signal
   * async function broadcastSignalExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.broadcastSignal({
   *     signalName: 'system-shutdown',
   *     variables: {
   *       reason: 'Scheduled maintenance',
   *     },
   *   });
   * 
   *   console.log(`Signal broadcast key: ${result.signalKey}`);
   * }
   * @operationId broadcastSignal
   * @tags Signal
   */
  broadcastSignal(input: broadcastSignalInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'broadcastSignal', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('broadcastSignal', _schemas.zBroadcastSignalData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.broadcastSignal(opts);
        let data = this._evaluateResponse(_raw, 'broadcastSignal', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zBroadcastSignalResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zBroadcastSignalResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('broadcastSignal', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'broadcastSignal', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Cancel Batch operation
   *
   * Cancels a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Cancel a batch operation
   * async function cancelBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.cancelBatchOperation({ batchOperationKey });
   * }
   * @operationId cancelBatchOperation
   * @tags Batch operation
   */
  cancelBatchOperation(input: cancelBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('cancelBatchOperation', _schemas.zCancelBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.cancelBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'cancelBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCancelBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCancelBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('cancelBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'cancelBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Cancel process instance
   *
   * Cancels a running process instance. As a cancellation includes more than just the removal of the process instance resource, the cancellation resource must be posted. Cancellation can wait on listener-related processing; when that processing does not complete in time, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Cancel a process instance
   * async function cancelProcessInstanceExample(processDefinitionId: ProcessDefinitionId) {
   *   const camunda = createCamundaClient();
   * 
   *   // Create a process instance and get its key from the response
   *   const created = await camunda.createProcessInstance({
   *     processDefinitionId,
   *   });
   * 
   *   // Cancel the process instance using the key from the creation response
   *   await camunda.cancelProcessInstance({
   *     processInstanceKey: created.processInstanceKey,
   *   });
   * }
   * @operationId cancelProcessInstance
   * @tags Process instance
   */
  cancelProcessInstance(input: cancelProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstance>>;
  cancelProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('cancelProcessInstance', _schemas.zCancelProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.cancelProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'cancelProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCancelProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCancelProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('cancelProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'cancelProcessInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Cancel process instances (batch)
   *
   * Cancels multiple running process instances.
   * Since only ACTIVE root instances can be cancelled, any given filters for state and
   * parentProcessInstanceKey are ignored and overridden during this batch operation.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Cancel process instances in batch
   * async function cancelProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.cancelProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId cancelProcessInstancesBatchOperation
   * @tags Process instance
   */
  cancelProcessInstancesBatchOperation(input: cancelProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('cancelProcessInstancesBatchOperation', _schemas.zCancelProcessInstancesBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.cancelProcessInstancesBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'cancelProcessInstancesBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCancelProcessInstancesBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCancelProcessInstancesBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('cancelProcessInstancesBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'cancelProcessInstancesBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Complete job
   *
   * Complete a job with the given payload, which allows completing the associated service task.
   *
    *
   * @example Complete a job
   * async function completeJobExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.completeJob({
   *     jobKey,
   *     variables: {
   *       paymentId: 'PAY-123',
   *       status: 'completed',
   *     },
   *   });
   * }
   * @operationId completeJob
   * @tags Job
   */
  completeJob(input: completeJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.completeJob>>;
  completeJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('completeJob', _schemas.zCompleteJobData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.completeJob(opts);
        let data = this._evaluateResponse(_raw, 'completeJob', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCompleteJobResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCompleteJobResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('completeJob', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'completeJob', exempt: true, retryOverride: options?.retry });
    });
  }

  /**
   * Complete user task
   *
   * Completes a user task with the given key. Completion waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Complete a user task
   * async function completeUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.completeUserTask({
   *     userTaskKey,
   *     variables: {
   *       approved: true,
   *       comment: 'Looks good',
   *     },
   *   });
   * }
   * @operationId completeUserTask
   * @tags User task
   */
  completeUserTask(input: completeUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.completeUserTask>>;
  completeUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('completeUserTask', _schemas.zCompleteUserTaskData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.completeUserTask(opts);
        let data = this._evaluateResponse(_raw, 'completeUserTask', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCompleteUserTaskResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCompleteUserTaskResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('completeUserTask', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'completeUserTask', exempt: true, retryOverride: options?.retry });
    });
  }

  /**
   * Correlate message
   *
   * Publishes a message and correlates it to a subscription.
   * If correlation is successful it will return the first process instance key the message correlated with.
   * The message is not buffered.
   * Use the publish message endpoint to send messages that can be buffered.
   *
    *
   * @example Correlate a message
   * async function correlateMessageExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.correlateMessage({
   *     name: 'order-payment-received',
   *     correlationKey: 'ORD-12345',
   *     variables: {
   *       paymentId: 'PAY-123',
   *       amount: 99.95,
   *     },
   *   });
   * 
   *   console.log(`Message correlated to: ${result.processInstanceKey}`);
   * }
   * @operationId correlateMessage
   * @tags Message
   */
  correlateMessage(input: correlateMessageInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'correlateMessage', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('correlateMessage', _schemas.zCorrelateMessageData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.correlateMessage(opts);
        let data = this._evaluateResponse(_raw, 'correlateMessage', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCorrelateMessageResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCorrelateMessageResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('correlateMessage', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'correlateMessage', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create admin user
   *
   * Creates a new user and assigns the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
    *
   * @example Create an admin user
   * async function createAdminUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createAdminUser({
   *     username,
   *     name: 'Admin User',
   *     email: 'admin@example.com',
   *     password: 'admin-password-123',
   *   });
   * 
   *   console.log(`Created admin user: ${result.username}`);
   * }
   * @operationId createAdminUser
   * @tags Setup
   */
  createAdminUser(input: createAdminUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createAdminUser', _schemas.zCreateAdminUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createAdminUser(opts);
        let data = this._evaluateResponse(_raw, 'createAdminUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateAdminUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateAdminUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createAdminUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createAdminUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create authorization
   *
   * Create the authorization.
    *
   * @example Create an authorization
   * async function createAuthorizationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createAuthorization({
   *     ownerId: 'user-123',
   *     ownerType: 'USER',
   *     resourceId: 'order-process',
   *     resourceType: 'PROCESS_DEFINITION',
   *     permissionTypes: ['CREATE_PROCESS_INSTANCE', 'READ_PROCESS_INSTANCE'],
   *   });
   * 
   *   console.log(`Authorization key: ${result.authorizationKey}`);
   * }
   * @operationId createAuthorization
   * @tags Authorization
   */
  createAuthorization(input: createAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createAuthorization>>;
  createAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createAuthorization', _schemas.zCreateAuthorizationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createAuthorization(opts);
        let data = this._evaluateResponse(_raw, 'createAuthorization', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateAuthorizationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateAuthorizationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createAuthorization', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createAuthorization', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Deploy resources
   *
   * Deploys one or more resources (e.g. processes, decision models, or forms).
   * This is an atomic call, i.e. either all resources are deployed or none of them are.
   *
    *
   * @example Deploy resources
   * async function createDeploymentExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const file = new File(['<xml/>'], 'order-process.bpmn', { type: 'application/xml' });
   * 
   *   const result = await camunda.createDeployment({
   *     resources: [file],
   *   });
   * 
   *   console.log(`Deployment key: ${result.deploymentKey}`);
   *   for (const process of result.processes ?? []) {
   *     console.log(`  Process: ${process.processDefinitionId} v${process.processDefinitionVersion}`);
   *   }
   * }
   * @operationId createDeployment
   * @tags Resource
   * @returns Enriched deployment result with typed arrays (processes, decisions, decisionRequirements, forms, resources).
   */
  createDeployment(input: createDeploymentInput, options?: OperationOptions): CancelablePromise<ExtendedDeploymentResult>;
  createDeployment(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'createDeployment', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createDeployment', _schemas.zCreateDeploymentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createDeployment(opts);
        let data = this._evaluateResponse(_raw, 'createDeployment', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateDeploymentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateDeploymentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createDeployment', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        // Enrich deployment response AFTER validation to avoid fanatical extras errors
        if (data) {
          const base = data as _DataOf<typeof Sdk.createDeployment>;
          const ext: ExtendedDeploymentResult = { ...base, processes: [], decisions: [], decisionRequirements: [], forms: [], resources: [] };
          if (Array.isArray(base.deployments)) {
            for (const d of base.deployments) {
              if (d?.processDefinition) ext.processes.push(d.processDefinition);
              if (d?.decisionDefinition) ext.decisions.push(d.decisionDefinition);
              if (d?.decisionRequirements) ext.decisionRequirements.push(d.decisionRequirements);
              if (d?.form) ext.forms.push(d.form);
              if (d?.resource) ext.resources.push(d.resource);
            }
          }
          data = ext;
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createDeployment', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Upload document
   *
   * Upload a document to the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Upload a document
   * Link
   * async function createDocumentLinkExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   const link = await camunda.createDocumentLink({
   *     documentId,
   *     timeToLive: 3600000,
   *   });
   * 
   *   console.log(`Document link: ${link.url}`);
   * }
   * @operationId createDocument
   * @tags Document
   */
  createDocument(input: createDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocument>>;
  createDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { storeId, documentId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { storeId, documentId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createDocument', _schemas.zCreateDocumentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createDocument(opts);
        let data = this._evaluateResponse(_raw, 'createDocument', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateDocumentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateDocumentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createDocument', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createDocument', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create document link
   *
   * Create a link to a document in the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, GCP
   *
    *
   * @example Create a document link
   * async function createDocumentLinkExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   const link = await camunda.createDocumentLink({
   *     documentId,
   *     timeToLive: 3600000,
   *   });
   * 
   *   console.log(`Document link: ${link.url}`);
   * }
   * @operationId createDocumentLink
   * @tags Document
   */
  createDocumentLink(input: createDocumentLinkInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocumentLink>>;
  createDocumentLink(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId, contentHash, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId, contentHash };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createDocumentLink', _schemas.zCreateDocumentLinkData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createDocumentLink(opts);
        let data = this._evaluateResponse(_raw, 'createDocumentLink', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateDocumentLinkResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateDocumentLinkResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createDocumentLink', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createDocumentLink', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Upload multiple documents
   *
   * Upload multiple documents to the Camunda 8 cluster.
   *
   * The caller must provide a file name for each document, which will be used in case of a multi-status response
   * to identify which documents failed to upload. The file name can be provided in the `Content-Disposition` header
   * of the file part or in the `fileName` field of the metadata. You can add a parallel array of metadata objects. These
   * are matched with the files based on index, and must have the same length as the files array.
   * To pass homogenous metadata for all files, spread the metadata over the metadata array.
   * A filename value provided explicitly via the metadata array in the request overrides the `Content-Disposition` header
   * of the file part.
   *
   * In case of a multi-status response, the response body will contain a list of `DocumentBatchProblemDetail` objects,
   * each of which contains the file name of the document that failed to upload and the reason for the failure.
   * The client can choose to retry the whole batch or individual documents based on the response.
   *
   * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Upload multiple documents
   * async function createDocumentsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const file1 = new Blob(['File one'], { type: 'text/plain' });
   *   const file2 = new Blob(['File two'], { type: 'text/plain' });
   * 
   *   const result = await camunda.createDocuments({
   *     files: [file1, file2],
   *     metadataList: [{ fileName: 'one.txt' }, { fileName: 'two.txt' }],
   *   });
   * 
   *   for (const doc of result.createdDocuments ?? []) {
   *     console.log(`Created: ${doc.documentId}`);
   *   }
   * }
   * @operationId createDocuments
   * @tags Document
   */
  createDocuments(input: createDocumentsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocuments>>;
  createDocuments(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { storeId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { storeId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createDocuments', _schemas.zCreateDocumentsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createDocuments(opts);
        let data = this._evaluateResponse(_raw, 'createDocuments', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateDocumentsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateDocumentsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createDocuments', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createDocuments', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update element instance variables
   *
   * Updates all the variables of a particular scope (for example, process instance, element instance) with the given variable data.
   * Specify the element instance in the `elementInstanceKey` parameter.
   * Variable updates can be delayed by listener-related processing; if processing exceeds the
   * request timeout, this endpoint can return 504. Other gateway timeout causes are also
   * possible. Retry with backoff and inspect listener worker availability and logs when this
   * repeats.
   *
    *
   * @example Create element instance variables
   * async function createElementInstanceVariablesExample(elementInstanceKey: ElementInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.createElementInstanceVariables({
   *     elementInstanceKey,
   *     variables: { orderId: 'ORD-12345', status: 'processing' },
   *   });
   * }
   * @operationId createElementInstanceVariables
   * @tags Element instance
   */
  createElementInstanceVariables(input: createElementInstanceVariablesInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createElementInstanceVariables>>;
  createElementInstanceVariables(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { elementInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createElementInstanceVariables', _schemas.zCreateElementInstanceVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createElementInstanceVariables(opts);
        let data = this._evaluateResponse(_raw, 'createElementInstanceVariables', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateElementInstanceVariablesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateElementInstanceVariablesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createElementInstanceVariables', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createElementInstanceVariables', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create a global-scoped cluster variable
   *
   * Create a global-scoped cluster variable.
    *
   * @example Create a global cluster variable
   * async function createGlobalClusterVariableExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createGlobalClusterVariable({
   *     name: 'feature-flags',
   *     value: { darkMode: true },
   *   });
   * 
   *   console.log(`Created: ${result.name}`);
   * }
   * @operationId createGlobalClusterVariable
   * @tags Cluster Variable
   */
  createGlobalClusterVariable(input: createGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGlobalClusterVariable>>;
  createGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createGlobalClusterVariable', _schemas.zCreateGlobalClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createGlobalClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'createGlobalClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateGlobalClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateGlobalClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createGlobalClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createGlobalClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create global user task listener
   *
   * Create a new global user task listener.
    *
   * @example Create a global task listener
   * async function createGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createGlobalTaskListener({
   *     id,
   *     eventTypes: ['completing'],
   *     type: 'audit-log-listener',
   *   });
   * 
   *   console.log(`Created listener: ${result.id}`);
   * }
   * @operationId createGlobalTaskListener
   * @tags Global listener
   */
  createGlobalTaskListener(input: createGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGlobalTaskListener>>;
  createGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createGlobalTaskListener', _schemas.zCreateGlobalTaskListenerData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createGlobalTaskListener(opts);
        let data = this._evaluateResponse(_raw, 'createGlobalTaskListener', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateGlobalTaskListenerResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateGlobalTaskListenerResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createGlobalTaskListener', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createGlobalTaskListener', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create group
   *
   * Create a new group.
    *
   * @example Create a group
   * async function createGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createGroup({
   *     groupId: 'engineering-team',
   *     name: 'Engineering Team',
   *   });
   * 
   *   console.log(`Created group: ${result.groupId}`);
   * }
   * @operationId createGroup
   * @tags Group
   */
  createGroup(input: createGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGroup>>;
  createGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createGroup', _schemas.zCreateGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createGroup(opts);
        let data = this._evaluateResponse(_raw, 'createGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create mapping rule
   *
   * Create a new mapping rule
   *
    *
   * @example Create a mapping rule
   * async function createMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createMappingRule({
   *     mappingRuleId: 'ldap-group-mapping',
   *     name: 'LDAP Group Mapping',
   *     claimName: 'groups',
   *     claimValue: 'engineering',
   *   });
   * 
   *   console.log(`Created mapping rule: ${result.mappingRuleId}`);
   * }
   * @operationId createMappingRule
   * @tags Mapping rule
   */
  createMappingRule(input: createMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createMappingRule>>;
  createMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createMappingRule', _schemas.zCreateMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'createMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createMappingRule', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create process instance
   *
   * Creates and starts an instance of the specified process.
   * The process definition to use to create the instance can be specified either using its unique key
   * (as returned by Deploy resources), or using the BPMN process id and a version.
   *
   * Waits for the completion of the process instance before returning a result
   * when awaitCompletion is enabled.
   *
    *
   * @example By ID
   * async function createProcessInstanceByIdExample(processDefinitionId: ProcessDefinitionId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createProcessInstance({
   *     processDefinitionId,
   *     variables: {
   *       orderId: 'ORD-12345',
   *       amount: 99.95,
   *     },
   *   });
   * 
   *   console.log(`Started process instance: ${result.processInstanceKey}`);
   * }
   * @example By key
   * async function createProcessInstanceByKeyExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   // Key from a previous API response (e.g. deployment)
   *   const result = await camunda.createProcessInstance({
   *     processDefinitionKey,
   *     variables: {
   *       orderId: 'ORD-12345',
   *       amount: 99.95,
   *     },
   *   });
   * 
   *   console.log(`Started process instance: ${result.processInstanceKey}`);
   * }
   * @operationId createProcessInstance
   * @tags Process instance
   */
  createProcessInstance(input: createProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'createProcessInstance', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createProcessInstance', _schemas.zCreateProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'createProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createProcessInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create role
   *
   * Create a new role.
    *
   * @example Create a role
   * async function createRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createRole({
   *     roleId: 'process-admin',
   *     name: 'Process Admin',
   *   });
   * 
   *   console.log(`Created role: ${result.roleId}`);
   * }
   * @operationId createRole
   * @tags Role
   */
  createRole(input: createRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createRole>>;
  createRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createRole', _schemas.zCreateRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createRole(opts);
        let data = this._evaluateResponse(_raw, 'createRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createRole', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create tenant
   *
   * Creates a new tenant.
    *
   * @example Create a tenant
   * async function createTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createTenant({
   *     tenantId,
   *     name: 'Customer Service',
   *   });
   * 
   *   console.log(`Created tenant: ${result.tenantId}`);
   * }
   * @operationId createTenant
   * @tags Tenant
   */
  createTenant(input: createTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createTenant>>;
  createTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createTenant', _schemas.zCreateTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createTenant(opts);
        let data = this._evaluateResponse(_raw, 'createTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create a tenant-scoped cluster variable
   *
   * Create a new cluster variable for the given tenant.
    *
   * @example Create a tenant cluster variable
   * async function createTenantClusterVariableExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createTenantClusterVariable({
   *     tenantId,
   *     name: 'config',
   *     value: { region: 'us-east-1' },
   *   });
   * 
   *   console.log(`Created: ${result.name}`);
   * }
   * @operationId createTenantClusterVariable
   * @tags Cluster Variable
   */
  createTenantClusterVariable(input: createTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createTenantClusterVariable>>;
  createTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createTenantClusterVariable', _schemas.zCreateTenantClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createTenantClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'createTenantClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateTenantClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateTenantClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createTenantClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createTenantClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Create user
   *
   * Create a new user.
    *
   * @example Create a user
   * async function createUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createUser({
   *     username,
   *     name: 'Alice Smith',
   *     email: 'alice@example.com',
   *     password: 'secure-password-123',
   *   });
   * 
   *   console.log(`Created user: ${result.username}`);
   * }
   * @operationId createUser
   * @tags User
   */
  createUser(input: createUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('createUser', _schemas.zCreateUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.createUser(opts);
        let data = this._evaluateResponse(_raw, 'createUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zCreateUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zCreateUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'createUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete authorization
   *
   * Deletes the authorization with the given key.
    *
   * @example Delete an authorization
   * async function deleteAuthorizationExample(authorizationKey: AuthorizationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteAuthorization({ authorizationKey });
   * }
   * @operationId deleteAuthorization
   * @tags Authorization
   */
  deleteAuthorization(input: deleteAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteAuthorization>>;
  deleteAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { authorizationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteAuthorization', _schemas.zDeleteAuthorizationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteAuthorization(opts);
        let data = this._evaluateResponse(_raw, 'deleteAuthorization', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteAuthorizationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteAuthorizationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteAuthorization', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteAuthorization', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete decision instance
   *
   * Delete all associated decision evaluations based on provided key.
    *
   * @example Delete a decision instance
   * async function deleteDecisionInstanceExample(decisionEvaluationKey: DecisionEvaluationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteDecisionInstance({ decisionEvaluationKey });
   * }
   * @operationId deleteDecisionInstance
   * @tags Decision instance
   */
  deleteDecisionInstance(input: deleteDecisionInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstance>>;
  deleteDecisionInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { decisionEvaluationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionEvaluationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteDecisionInstance', _schemas.zDeleteDecisionInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteDecisionInstance(opts);
        let data = this._evaluateResponse(_raw, 'deleteDecisionInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteDecisionInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteDecisionInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteDecisionInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteDecisionInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete decision instances (batch)
   *
   * Delete multiple decision instances. This will delete the historic data from secondary storage.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Delete decision instances in batch
   * async function deleteDecisionInstancesBatchOperationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.deleteDecisionInstancesBatchOperation({
   *     filter: {},
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId deleteDecisionInstancesBatchOperation
   * @tags Decision instance
   */
  deleteDecisionInstancesBatchOperation(input: deleteDecisionInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstancesBatchOperation>>;
  deleteDecisionInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteDecisionInstancesBatchOperation', _schemas.zDeleteDecisionInstancesBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteDecisionInstancesBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'deleteDecisionInstancesBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteDecisionInstancesBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteDecisionInstancesBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteDecisionInstancesBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteDecisionInstancesBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete document
   *
   * Delete a document from the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Delete a document
   * async function deleteDocumentExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteDocument({ documentId });
   * }
   * @operationId deleteDocument
   * @tags Document
   */
  deleteDocument(input: deleteDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDocument>>;
  deleteDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteDocument', _schemas.zDeleteDocumentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteDocument(opts);
        let data = this._evaluateResponse(_raw, 'deleteDocument', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteDocumentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteDocumentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteDocument', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteDocument', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete a global-scoped cluster variable
   *
   * Delete a global-scoped cluster variable.
    *
   * @example Delete a global cluster variable
   * async function deleteGlobalClusterVariableExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGlobalClusterVariable({ name: 'feature-flags' });
   * }
   * @operationId deleteGlobalClusterVariable
   * @tags Cluster Variable
   */
  deleteGlobalClusterVariable(input: deleteGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalClusterVariable>>;
  deleteGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { name } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteGlobalClusterVariable', _schemas.zDeleteGlobalClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteGlobalClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'deleteGlobalClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteGlobalClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteGlobalClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteGlobalClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteGlobalClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete global user task listener
   *
   * Deletes a global user task listener.
    *
   * @example Delete a global task listener
   * async function deleteGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGlobalTaskListener({
   *     id,
   *   });
   * }
   * @operationId deleteGlobalTaskListener
   * @tags Global listener
   */
  deleteGlobalTaskListener(input: deleteGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalTaskListener>>;
  deleteGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { id } = arg || {};
      let envelope: any = {};
      envelope.path = { id };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteGlobalTaskListener', _schemas.zDeleteGlobalTaskListenerData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteGlobalTaskListener(opts);
        let data = this._evaluateResponse(_raw, 'deleteGlobalTaskListener', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteGlobalTaskListenerResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteGlobalTaskListenerResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteGlobalTaskListener', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteGlobalTaskListener', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete group
   *
   * Deletes the group with the given ID.
    *
   * @example Delete a group
   * async function deleteGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGroup({ groupId: 'engineering-team' });
   * }
   * @operationId deleteGroup
   * @tags Group
   */
  deleteGroup(input: deleteGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGroup>>;
  deleteGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteGroup', _schemas.zDeleteGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteGroup(opts);
        let data = this._evaluateResponse(_raw, 'deleteGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete a mapping rule
   *
   * Deletes the mapping rule with the given ID.
   *
    *
   * @example Delete a mapping rule
   * async function deleteMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteMappingRule({ mappingRuleId: 'ldap-group-mapping' });
   * }
   * @operationId deleteMappingRule
   * @tags Mapping rule
   */
  deleteMappingRule(input: deleteMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteMappingRule>>;
  deleteMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteMappingRule', _schemas.zDeleteMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'deleteMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteMappingRule', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete process instance
   *
   * Deletes a process instance. Only instances that are completed or terminated can be deleted.
    *
   * @example Delete a process instance
   * async function deleteProcessInstanceExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteProcessInstance({ processInstanceKey });
   * }
   * @operationId deleteProcessInstance
   * @tags Process instance
   */
  deleteProcessInstance(input: deleteProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstance>>;
  deleteProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteProcessInstance', _schemas.zDeleteProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'deleteProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteProcessInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete process instances (batch)
   *
   * Delete multiple process instances. This will delete the historic data from secondary storage.
   * Only process instances in a final state (COMPLETED or TERMINATED) can be deleted.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Delete process instances in batch
   * async function deleteProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.deleteProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId deleteProcessInstancesBatchOperation
   * @tags Process instance
   */
  deleteProcessInstancesBatchOperation(input: deleteProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstancesBatchOperation>>;
  deleteProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteProcessInstancesBatchOperation', _schemas.zDeleteProcessInstancesBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteProcessInstancesBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'deleteProcessInstancesBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteProcessInstancesBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteProcessInstancesBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteProcessInstancesBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteProcessInstancesBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete resource
   *
   * Deletes a deployed resource. This can be a process definition, decision requirements
   * definition, or form definition deployed using the deploy resources endpoint. Specify the
   * resource you want to delete in the `resourceKey` parameter.
   *
   * Once a resource has been deleted it cannot be recovered. If the resource needs to be
   * available again, a new deployment of the resource is required.
   *
   * By default, only the resource itself is deleted from the runtime state. To also delete the
   * historic data associated with a resource, set the `deleteHistory` flag in the request body
   * to `true`. The historic data is deleted asynchronously via a batch operation. The details of
   * the created batch operation are included in the response. Note that history deletion is only
   * supported for process resources; for other resource types this flag is ignored and no history
   * will be deleted.
    *
   * @example Delete a resource
   * async function deleteResourceExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   // Use a process definition key as a resource key for deletion
   *   await camunda.deleteResource({
   *     resourceKey,
   *   });
   * }
   * @operationId deleteResource
   * @tags Resource
   */
  deleteResource(input: deleteResourceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteResource>>;
  deleteResource(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteResource', _schemas.zDeleteResourceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteResource(opts);
        let data = this._evaluateResponse(_raw, 'deleteResource', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteResourceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteResourceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteResource', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteResource', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete role
   *
   * Deletes the role with the given ID.
    *
   * @example Delete a role
   * async function deleteRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteRole({ roleId: 'process-admin' });
   * }
   * @operationId deleteRole
   * @tags Role
   */
  deleteRole(input: deleteRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRole>>;
  deleteRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteRole', _schemas.zDeleteRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteRole(opts);
        let data = this._evaluateResponse(_raw, 'deleteRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteRole', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete tenant
   *
   * Deletes an existing tenant.
    *
   * @example Delete a tenant
   * async function deleteTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteTenant({ tenantId });
   * }
   * @operationId deleteTenant
   * @tags Tenant
   */
  deleteTenant(input: deleteTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteTenant>>;
  deleteTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteTenant', _schemas.zDeleteTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteTenant(opts);
        let data = this._evaluateResponse(_raw, 'deleteTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete a tenant-scoped cluster variable
   *
   * Delete a tenant-scoped cluster variable.
    *
   * @example Delete a tenant cluster variable
   * async function deleteTenantClusterVariableExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteTenantClusterVariable({
   *     tenantId,
   *     name: 'config',
   *   });
   * }
   * @operationId deleteTenantClusterVariable
   * @tags Cluster Variable
   */
  deleteTenantClusterVariable(input: deleteTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteTenantClusterVariable>>;
  deleteTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, name } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteTenantClusterVariable', _schemas.zDeleteTenantClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteTenantClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'deleteTenantClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteTenantClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteTenantClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteTenantClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteTenantClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Delete user
   *
   * Deletes a user.
    *
   * @example Delete a user
   * async function deleteUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteUser({ username });
   * }
   * @operationId deleteUser
   * @tags User
   */
  deleteUser(input: deleteUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { username } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('deleteUser', _schemas.zDeleteUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.deleteUser(opts);
        let data = this._evaluateResponse(_raw, 'deleteUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zDeleteUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zDeleteUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('deleteUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'deleteUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Evaluate root level conditional start events
   *
   * Evaluates root-level conditional start events for process definitions.
   * If the evaluation is successful, it will return the keys of all created process instances, along with their associated process definition key.
   * Multiple root-level conditional start events of the same process definition can trigger if their conditions evaluate to true.
   *
    *
   * @example Evaluate conditionals
   * async function evaluateConditionalsExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.evaluateConditionals({
   *     variables: { orderReady: true },
   *     tenantId,
   *   });
   * 
   *   console.log(`Evaluated conditionals: ${JSON.stringify(result)}`);
   * }
   * @operationId evaluateConditionals
   * @tags Conditional
   */
  evaluateConditionals(input: evaluateConditionalsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateConditionals>>;
  evaluateConditionals(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateConditionals', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('evaluateConditionals', _schemas.zEvaluateConditionalsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.evaluateConditionals(opts);
        let data = this._evaluateResponse(_raw, 'evaluateConditionals', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zEvaluateConditionalsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zEvaluateConditionalsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('evaluateConditionals', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'evaluateConditionals', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Evaluate decision
   *
   * Evaluates a decision.
   * You specify the decision to evaluate either by using its unique key (as returned by
   * DeployResource), or using the decision ID. When using the decision ID, the latest deployed
   * version of the decision is used.
   *
    *
   * @example By ID
   * async function evaluateDecisionByIdExample(decisionDefinitionId: DecisionDefinitionId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.evaluateDecision({
   *     decisionDefinitionId,
   *     variables: {
   *       amount: 1000,
   *       invoiceCategory: 'Misc',
   *     },
   *   });
   * 
   *   console.log(`Decision: ${result.decisionDefinitionId}`);
   *   console.log(`Output: ${result.output}`);
   * }
   * @example By key
   * async function evaluateDecisionByKeyExample(decisionDefinitionKey: DecisionDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.evaluateDecision({
   *     decisionDefinitionKey,
   *     variables: {
   *       amount: 1000,
   *       invoiceCategory: 'Misc',
   *     },
   *   });
   * 
   *   console.log(`Decision output: ${result.output}`);
   * }
   * @operationId evaluateDecision
   * @tags Decision definition
   */
  evaluateDecision(input: evaluateDecisionInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateDecision', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('evaluateDecision', _schemas.zEvaluateDecisionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.evaluateDecision(opts);
        let data = this._evaluateResponse(_raw, 'evaluateDecision', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zEvaluateDecisionResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zEvaluateDecisionResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('evaluateDecision', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'evaluateDecision', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Evaluate an expression
   *
   * Evaluates a FEEL expression and returns the result. Supports references to tenant scoped cluster variables when a tenant ID is provided.
    *
   * @example Evaluate an expression
   * async function evaluateExpressionExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.evaluateExpression({
   *     expression: '= x + y',
   *     variables: { x: 10, y: 20 },
   *   });
   * 
   *   console.log(`Result: ${result.result}`);
   * }
   * @operationId evaluateExpression
   * @tags Expression
   */
  evaluateExpression(input: evaluateExpressionInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateExpression>>;
  evaluateExpression(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateExpression', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('evaluateExpression', _schemas.zEvaluateExpressionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.evaluateExpression(opts);
        let data = this._evaluateResponse(_raw, 'evaluateExpression', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zEvaluateExpressionResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zEvaluateExpressionResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('evaluateExpression', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'evaluateExpression', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Fail job
   *
   * Mark the job as failed.
   *
    *
   * @example Fail a job with retry
   * async function failJobExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.failJob({
   *     jobKey,
   *     retries: 2,
   *     errorMessage: 'Payment gateway timeout',
   *     retryBackOff: 5000,
   *   });
   * }
   * @operationId failJob
   * @tags Job
   */
  failJob(input: failJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.failJob>>;
  failJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('failJob', _schemas.zFailJobData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.failJob(opts);
        let data = this._evaluateResponse(_raw, 'failJob', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zFailJobResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zFailJobResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('failJob', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'failJob', exempt: true, retryOverride: options?.retry });
    });
  }

  /**
   * Get audit log
   *
   * Get an audit log entry by auditLogKey.
    *
   * @example Get an audit log entry
   * async function getAuditLogExample(auditLogKey: AuditLogKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const log = await camunda.getAuditLog({ auditLogKey }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Audit log: ${log.operationType}`);
   * }
   * @operationId getAuditLog
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuditLog(input: getAuditLogInput, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuditLog>>;
  getAuditLog(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { auditLogKey } = arg || {};
      let envelope: any = {};
      envelope.path = { auditLogKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getAuditLog', _schemas.zGetAuditLogData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getAuditLog(opts);
        let data = this._evaluateResponse(_raw, 'getAuditLog', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetAuditLogResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetAuditLogResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getAuditLog', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getAuditLog', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get current user
   *
   * Retrieves the current authenticated user.
    *
   * @example Get authentication info
   * async function getAuthenticationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const user = await camunda.getAuthentication();
   * 
   *   console.log(`Authenticated as: ${user.username}`);
   * }
   * @operationId getAuthentication
   * @tags Authentication
   */
  getAuthentication(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthentication>>;
  getAuthentication(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.getAuthentication(opts as any);
        let data = this._evaluateResponse(_raw, 'getAuthentication', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetAuthenticationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetAuthenticationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getAuthentication', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getAuthentication', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get authorization
   *
   * Get authorization by the given key.
    *
   * @example Get an authorization
   * async function getAuthorizationExample(authorizationKey: AuthorizationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const authorization = await camunda.getAuthorization(
   *     { authorizationKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Owner: ${authorization.ownerId} (${authorization.ownerType})`);
   * }
   * @operationId getAuthorization
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuthorization(input: getAuthorizationInput, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { authorizationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getAuthorization', _schemas.zGetAuthorizationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getAuthorization(opts);
        let data = this._evaluateResponse(_raw, 'getAuthorization', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetAuthorizationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetAuthorizationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getAuthorization', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getAuthorization', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get batch operation
   *
   * Get batch operation by key.
    *
   * @example Get a batch operation
   * async function getBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const batch = await camunda.getBatchOperation(
   *     { batchOperationKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Batch: ${batch.batchOperationType} (${batch.state})`);
   * }
   * @operationId getBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getBatchOperation(input: getBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { batchOperationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getBatchOperation', _schemas.zGetBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'getBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getBatchOperation', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get decision definition
   *
   * Returns a decision definition by key.
    *
   * @example Get a decision definition
   * async function getDecisionDefinitionExample(decisionDefinitionKey: DecisionDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const definition = await camunda.getDecisionDefinition(
   *     { decisionDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Decision: ${definition.decisionDefinitionId}`);
   *   console.log(`Version: ${definition.version}`);
   * }
   * @operationId getDecisionDefinition
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinition(input: getDecisionDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDecisionDefinition', _schemas.zGetDecisionDefinitionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getDecisionDefinition(opts);
        let data = this._evaluateResponse(_raw, 'getDecisionDefinition', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDecisionDefinitionResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDecisionDefinitionResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDecisionDefinition', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionDefinition', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get decision definition XML
   *
   * Returns decision definition as XML.
    *
   * @example Get decision definition XML
   * async function getDecisionDefinitionXmlExample(decisionDefinitionKey: DecisionDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const xml = await camunda.getDecisionDefinitionXml(
   *     { decisionDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`XML length: ${JSON.stringify(xml).length}`);
   * }
   * @operationId getDecisionDefinitionXML
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinitionXml(input: getDecisionDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDecisionDefinitionXML', _schemas.zGetDecisionDefinitionXmlData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getDecisionDefinitionXml(opts);
        let data = this._evaluateResponse(_raw, 'getDecisionDefinitionXML', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDecisionDefinitionXmlResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDecisionDefinitionXmlResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDecisionDefinitionXML', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionDefinitionXML', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get decision instance
   *
   * Returns a decision instance.
    *
   * @example Get a decision instance
   * async function getDecisionInstanceExample(
   *   decisionEvaluationInstanceKey: DecisionEvaluationInstanceKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const instance = await camunda.getDecisionInstance(
   *     { decisionEvaluationInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Decision: ${instance.decisionDefinitionId}`);
   * }
   * @operationId getDecisionInstance
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionInstance(input: getDecisionInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionEvaluationInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionEvaluationInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDecisionInstance', _schemas.zGetDecisionInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getDecisionInstance(opts);
        let data = this._evaluateResponse(_raw, 'getDecisionInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDecisionInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDecisionInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDecisionInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionInstance', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get decision requirements
   *
   * Returns Decision Requirements as JSON.
    *
   * @example Get decision requirements
   * async function getDecisionRequirementsExample(decisionRequirementsKey: DecisionRequirementsKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const requirements = await camunda.getDecisionRequirements(
   *     { decisionRequirementsKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Requirements: ${requirements.decisionRequirementsId}`);
   * }
   * @operationId getDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirements(input: getDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionRequirementsKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionRequirementsKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDecisionRequirements', _schemas.zGetDecisionRequirementsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getDecisionRequirements(opts);
        let data = this._evaluateResponse(_raw, 'getDecisionRequirements', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDecisionRequirementsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDecisionRequirementsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDecisionRequirements', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionRequirements', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get decision requirements XML
   *
   * Returns decision requirements as XML.
    *
   * @example Get decision requirements XML
   * async function getDecisionRequirementsXmlExample(decisionRequirementsKey: DecisionRequirementsKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const xml = await camunda.getDecisionRequirementsXml(
   *     { decisionRequirementsKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`XML length: ${JSON.stringify(xml).length}`);
   * }
   * @operationId getDecisionRequirementsXML
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirementsXml(input: getDecisionRequirementsXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionRequirementsKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionRequirementsKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDecisionRequirementsXML', _schemas.zGetDecisionRequirementsXmlData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getDecisionRequirementsXml(opts);
        let data = this._evaluateResponse(_raw, 'getDecisionRequirementsXML', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDecisionRequirementsXmlResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDecisionRequirementsXmlResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDecisionRequirementsXML', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionRequirementsXML', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Download document
   *
   * Download a document from the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Download a document
   * async function getDocumentExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.getDocument({ documentId });
   * 
   *   console.log(`Downloaded document: ${documentId}`);
   * }
   * @operationId getDocument
   * @tags Document
   */
  getDocument(input: getDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDocument>>;
  getDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId, contentHash } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId, contentHash };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getDocument', _schemas.zGetDocumentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        try {
        const _raw = await Sdk.getDocument(opts);
        let data = this._evaluateResponse(_raw, 'getDocument', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetDocumentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetDocumentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getDocument', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getDocument', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get element instance
   *
   * Returns element instance as JSON.
    *
   * @example Get an element instance
   * async function getElementInstanceExample(elementInstanceKey: ElementInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const element = await camunda.getElementInstance(
   *     { elementInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Element: ${element.elementId} (${element.type})`);
   * }
   * @operationId getElementInstance
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getElementInstance(input: getElementInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { elementInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getElementInstance', _schemas.zGetElementInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getElementInstance(opts);
        let data = this._evaluateResponse(_raw, 'getElementInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetElementInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetElementInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getElementInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getElementInstance', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get a global-scoped cluster variable
   *
   * Get a global-scoped cluster variable.
    *
   * @example Get a global cluster variable
   * async function getGlobalClusterVariableExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const variable = await camunda.getGlobalClusterVariable(
   *     { name: 'feature-flags' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`${variable.name} = ${variable.value}`);
   * }
   * @operationId getGlobalClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalClusterVariable(input: getGlobalClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalClusterVariable>>;
  getGlobalClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { name } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getGlobalClusterVariable', _schemas.zGetGlobalClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getGlobalClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'getGlobalClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetGlobalClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetGlobalClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getGlobalClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getGlobalClusterVariable', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Global job statistics
   *
   * Returns global aggregated counts for jobs. Optionally filter by the creation time window and/or jobType.
   *
    *
   * @example Get global job statistics
   * async function getGlobalJobStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getGlobalJobStatistics(
   *     {
   *       from: '2025-01-01T00:00:00Z',
   *       to: '2025-12-31T23:59:59Z',
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Statistics retrieved: ${JSON.stringify(result)}`);
   * }
   * @operationId getGlobalJobStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalJobStatistics(input: getGlobalJobStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalJobStatistics>>;
  getGlobalJobStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { from, to, jobType } = arg || {};
      let envelope: any = {};
      envelope.query = { from, to, jobType };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getGlobalJobStatistics', _schemas.zGetGlobalJobStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        try {
        const _raw = await Sdk.getGlobalJobStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getGlobalJobStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetGlobalJobStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetGlobalJobStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getGlobalJobStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getGlobalJobStatistics', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get global user task listener
   *
   * Get a global user task listener by its id.
    *
   * @example Get a global task listener
   * async function getGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   const listener = await camunda.getGlobalTaskListener(
   *     { id },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Listener: ${listener.type} (${listener.eventTypes})`);
   * }
   * @operationId getGlobalTaskListener
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalTaskListener(input: getGlobalTaskListenerInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalTaskListenerConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalTaskListener>>;
  getGlobalTaskListener(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalTaskListenerConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { id } = arg || {};
      let envelope: any = {};
      envelope.path = { id };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getGlobalTaskListener', _schemas.zGetGlobalTaskListenerData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getGlobalTaskListener(opts);
        let data = this._evaluateResponse(_raw, 'getGlobalTaskListener', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetGlobalTaskListenerResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetGlobalTaskListenerResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getGlobalTaskListener', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getGlobalTaskListener', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get group
   *
   * Get a group by its ID.
    *
   * @example Get a group
   * async function getGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const group = await camunda.getGroup(
   *     { groupId: 'engineering-team' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Group: ${group.name}`);
   * }
   * @operationId getGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGroup(input: getGroupInput, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getGroup', _schemas.zGetGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getGroup(opts);
        let data = this._evaluateResponse(_raw, 'getGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getGroup', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get incident
   *
   * Returns incident as JSON.
   *
    *
   * @example Get an incident
   * async function getIncidentExample(incidentKey: IncidentKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const incident = await camunda.getIncident(
   *     { incidentKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Type: ${incident.errorType}`);
   *   console.log(`State: ${incident.state}`);
   *   console.log(`Message: ${incident.errorMessage}`);
   * }
   * @operationId getIncident
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getIncident(input: getIncidentInput, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(arg: any, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { incidentKey } = arg || {};
      let envelope: any = {};
      envelope.path = { incidentKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getIncident', _schemas.zGetIncidentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getIncident(opts);
        let data = this._evaluateResponse(_raw, 'getIncident', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetIncidentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetIncidentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getIncident', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getIncident', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get error metrics for a job type
   *
   * Returns aggregated metrics per error for the given jobType.
   *
    *
   * @example Get job error statistics
   * async function getJobErrorStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getJobErrorStatistics(
   *     {
   *       filter: {
   *         from: '2025-01-01T00:00:00Z',
   *         to: '2025-12-31T23:59:59Z',
   *         jobType: 'payment-processing',
   *       },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Error: ${stat.errorMessage}, workers: ${stat.workers}`);
   *   }
   * }
   * @operationId getJobErrorStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobErrorStatistics(input: getJobErrorStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobErrorStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobErrorStatistics>>;
  getJobErrorStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobErrorStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getJobErrorStatistics', _schemas.zGetJobErrorStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getJobErrorStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getJobErrorStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetJobErrorStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetJobErrorStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getJobErrorStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getJobErrorStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get time-series metrics for a job type
   *
   * Returns a list of time-bucketed metrics ordered ascending by time.
   * The `from` and `to` fields select the time window of interest.
   * Each item in the response corresponds to one time bucket of the requested resolution.
   *
    *
   * @example Get job time series statistics
   * async function getJobTimeSeriesStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getJobTimeSeriesStatistics(
   *     {
   *       filter: {
   *         from: '2025-01-01T00:00:00Z',
   *         to: '2025-12-31T23:59:59Z',
   *         jobType: 'payment-processing',
   *       },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const point of result.items ?? []) {
   *     console.log(`Time: ${point.time}, created: ${point.created.count}`);
   *   }
   * }
   * @operationId getJobTimeSeriesStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobTimeSeriesStatistics(input: getJobTimeSeriesStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobTimeSeriesStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobTimeSeriesStatistics>>;
  getJobTimeSeriesStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobTimeSeriesStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getJobTimeSeriesStatistics', _schemas.zGetJobTimeSeriesStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getJobTimeSeriesStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getJobTimeSeriesStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetJobTimeSeriesStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetJobTimeSeriesStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getJobTimeSeriesStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getJobTimeSeriesStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get job statistics by type
   *
   * Get statistics about jobs, grouped by job type.
   *
    *
   * @example Get job type statistics
   * async function getJobTypeStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getJobTypeStatistics({}, { consistency: { waitUpToMs: 5000 } });
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Type: ${stat.jobType}, workers: ${stat.workers}`);
   *   }
   * }
   * @operationId getJobTypeStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobTypeStatistics(input: getJobTypeStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobTypeStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobTypeStatistics>>;
  getJobTypeStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobTypeStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getJobTypeStatistics', _schemas.zGetJobTypeStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getJobTypeStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getJobTypeStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetJobTypeStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetJobTypeStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getJobTypeStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getJobTypeStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get job statistics by worker
   *
   * Get statistics about jobs, grouped by worker, for a given job type.
   *
    *
   * @example Get job worker statistics
   * async function getJobWorkerStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getJobWorkerStatistics(
   *     {
   *       filter: {
   *         from: '2025-01-01T00:00:00Z',
   *         to: '2025-12-31T23:59:59Z',
   *         jobType: 'payment-processing',
   *       },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Worker: ${stat.worker}, completed: ${stat.completed.count}`);
   *   }
   * }
   * @operationId getJobWorkerStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobWorkerStatistics(input: getJobWorkerStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobWorkerStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobWorkerStatistics>>;
  getJobWorkerStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobWorkerStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getJobWorkerStatistics', _schemas.zGetJobWorkerStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getJobWorkerStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getJobWorkerStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetJobWorkerStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetJobWorkerStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getJobWorkerStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getJobWorkerStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get license status
   *
   * Obtains the status of the current Camunda license.
    *
   * @example Get license information
   * async function getLicenseExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const license = await camunda.getLicense();
   * 
   *   console.log(`License type: ${license.validLicense}`);
   * }
   * @operationId getLicense
   * @tags License
   */
  getLicense(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getLicense>>;
  getLicense(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.getLicense(opts as any);
        let data = this._evaluateResponse(_raw, 'getLicense', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetLicenseResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetLicenseResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getLicense', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getLicense', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get a mapping rule
   *
   * Gets the mapping rule with the given ID.
   *
    *
   * @example Get a mapping rule
   * async function getMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const rule = await camunda.getMappingRule(
   *     { mappingRuleId: 'ldap-group-mapping' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Rule: ${rule.name} (${rule.claimName}=${rule.claimValue})`);
   * }
   * @operationId getMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getMappingRule(input: getMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getMappingRule', _schemas.zGetMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'getMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getMappingRule', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process definition
   *
   * Returns process definition as JSON.
    *
   * @example Get a process definition
   * async function getProcessDefinitionExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const definition = await camunda.getProcessDefinition(
   *     { processDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Process: ${definition.processDefinitionId} v${definition.version}`);
   * }
   * @operationId getProcessDefinition
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinition(input: getProcessDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinition', _schemas.zGetProcessDefinitionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinition(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinition', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinition', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinition', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process instance statistics
   *
   * Get statistics about process instances, grouped by process definition and tenant.
   *
    *
   * @example Get process definition instance statistics
   * async function getProcessDefinitionInstanceStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessDefinitionInstanceStatistics(
   *     {},
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(
   *       `Definition ${stat.processDefinitionId}: ${stat.activeInstancesWithoutIncidentCount} active`
   *     );
   *   }
   * }
   * @operationId getProcessDefinitionInstanceStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceStatistics(input: getProcessDefinitionInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceStatistics>>;
  getProcessDefinitionInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinitionInstanceStatistics', _schemas.zGetProcessDefinitionInstanceStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinitionInstanceStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinitionInstanceStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionInstanceStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionInstanceStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinitionInstanceStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionInstanceStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process instance statistics by version
   *
   * Get statistics about process instances, grouped by version for a given process definition.
   * The process definition ID must be provided as a required field in the request body filter.
   *
    *
   * @example Get version statistics
   * async function getProcessDefinitionInstanceVersionStatisticsExample(
   *   processDefinitionId: ProcessDefinitionId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessDefinitionInstanceVersionStatistics(
   *     {
   *       filter: {
   *         processDefinitionId,
   *       },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(
   *       `Version ${stat.processDefinitionVersion}: ${stat.activeInstancesWithoutIncidentCount} active`
   *     );
   *   }
   * }
   * @operationId getProcessDefinitionInstanceVersionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceVersionStatistics(input: getProcessDefinitionInstanceVersionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceVersionStatistics>>;
  getProcessDefinitionInstanceVersionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinitionInstanceVersionStatistics', _schemas.zGetProcessDefinitionInstanceVersionStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinitionInstanceVersionStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinitionInstanceVersionStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionInstanceVersionStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionInstanceVersionStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinitionInstanceVersionStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionInstanceVersionStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get message subscription statistics
   *
   * Get message subscription statistics, grouped by process definition.
   *
    *
   * @example Get message subscription statistics
   * async function getProcessDefinitionMessageSubscriptionStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessDefinitionMessageSubscriptionStatistics(
   *     {},
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(
   *       `Definition ${stat.processDefinitionId}: ${stat.activeSubscriptions} subscriptions`
   *     );
   *   }
   * }
   * @operationId getProcessDefinitionMessageSubscriptionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionMessageSubscriptionStatistics(input: getProcessDefinitionMessageSubscriptionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionMessageSubscriptionStatistics>>;
  getProcessDefinitionMessageSubscriptionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinitionMessageSubscriptionStatistics', _schemas.zGetProcessDefinitionMessageSubscriptionStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinitionMessageSubscriptionStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinitionMessageSubscriptionStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionMessageSubscriptionStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionMessageSubscriptionStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinitionMessageSubscriptionStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionMessageSubscriptionStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process definition statistics
   *
   * Get statistics about elements in currently running process instances by process definition key and search filter.
    *
   * @example Get process definition element statistics
   * async function getProcessDefinitionStatisticsExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessDefinitionStatistics(
   *     { processDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Element ${stat.elementId}: active=${stat.active}`);
   *   }
   * }
   * @operationId getProcessDefinitionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionStatistics(input: getProcessDefinitionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinitionStatistics', _schemas.zGetProcessDefinitionStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinitionStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinitionStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinitionStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionStatistics', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process definition XML
   *
   * Returns process definition as XML.
    *
   * @example Get process definition XML
   * async function getProcessDefinitionXmlExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const xml = await camunda.getProcessDefinitionXml(
   *     { processDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`XML length: ${JSON.stringify(xml).length}`);
   * }
   * @operationId getProcessDefinitionXML
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionXml(input: getProcessDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessDefinitionXML', _schemas.zGetProcessDefinitionXmlData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessDefinitionXml(opts);
        let data = this._evaluateResponse(_raw, 'getProcessDefinitionXML', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessDefinitionXmlResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessDefinitionXmlResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessDefinitionXML', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionXML', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process instance
   *
   * Get the process instance by the process instance key.
    *
   * @example Get a process instance
   * async function getProcessInstanceExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const instance = await camunda.getProcessInstance(
   *     { processInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`State: ${instance.state}`);
   *   console.log(`Process: ${instance.processDefinitionId}`);
   * }
   * @operationId getProcessInstance
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstance(input: getProcessInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstance', _schemas.zGetProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstance', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get call hierarchy
   *
   * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
    *
   * @example Get process instance call hierarchy
   * async function getProcessInstanceCallHierarchyExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceCallHierarchy(
   *     { processInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Call hierarchy entries: ${result.length}`);
   * }
   * @operationId getProcessInstanceCallHierarchy
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceCallHierarchy(input: getProcessInstanceCallHierarchyInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstanceCallHierarchy', _schemas.zGetProcessInstanceCallHierarchyData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstanceCallHierarchy(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstanceCallHierarchy', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceCallHierarchyResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceCallHierarchyResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstanceCallHierarchy', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceCallHierarchy', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get sequence flows
   *
   * Get sequence flows taken by the process instance.
    *
   * @example Get process instance sequence flows
   * async function getProcessInstanceSequenceFlowsExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceSequenceFlows(
   *     { processInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const flow of result.items ?? []) {
   *     console.log(`Sequence flow: ${flow.sequenceFlowId}`);
   *   }
   * }
   * @operationId getProcessInstanceSequenceFlows
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceSequenceFlows(input: getProcessInstanceSequenceFlowsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstanceSequenceFlows', _schemas.zGetProcessInstanceSequenceFlowsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstanceSequenceFlows(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstanceSequenceFlows', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceSequenceFlowsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceSequenceFlowsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstanceSequenceFlows', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceSequenceFlows', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get element instance statistics
   *
   * Get statistics about elements by the process instance key.
    *
   * @example Get process instance statistics
   * async function getProcessInstanceStatisticsExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceStatistics(
   *     { processInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Element ${stat.elementId}: active=${stat.active}`);
   *   }
   * }
   * @operationId getProcessInstanceStatistics
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatistics(input: getProcessInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstanceStatistics', _schemas.zGetProcessInstanceStatisticsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstanceStatistics(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstanceStatistics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceStatisticsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceStatisticsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstanceStatistics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceStatistics', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process instance statistics by definition
   *
   * Returns statistics for active process instances with incidents, grouped by process
   * definition. The result set is scoped to a specific incident error hash code, which must be
   * provided as a filter in the request body.
   *
    *
   * @example Get instance statistics by definition
   * async function getProcessInstanceStatisticsByDefinitionExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceStatisticsByDefinition(
   *     {
   *       filter: {
   *         errorHashCode: 12345,
   *       },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(
   *       `Definition ${stat.processDefinitionId}: ${stat.activeInstancesWithErrorCount} incidents`
   *     );
   *   }
   * }
   * @operationId getProcessInstanceStatisticsByDefinition
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByDefinition(input: getProcessInstanceStatisticsByDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByDefinition>>;
  getProcessInstanceStatisticsByDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstanceStatisticsByDefinition', _schemas.zGetProcessInstanceStatisticsByDefinitionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstanceStatisticsByDefinition(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstanceStatisticsByDefinition', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceStatisticsByDefinitionResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceStatisticsByDefinitionResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstanceStatisticsByDefinition', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceStatisticsByDefinition', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process instance statistics by error
   *
   * Returns statistics for active process instances that currently have active incidents,
   * grouped by incident error hash code.
   *
    *
   * @example Get instance statistics by error
   * async function getProcessInstanceStatisticsByErrorExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceStatisticsByError(
   *     {},
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Error: ${stat.errorMessage}, count: ${stat.activeInstancesWithErrorCount}`);
   *   }
   * }
   * @operationId getProcessInstanceStatisticsByError
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByError(input: getProcessInstanceStatisticsByErrorInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByError>>;
  getProcessInstanceStatisticsByError(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getProcessInstanceStatisticsByError', _schemas.zGetProcessInstanceStatisticsByErrorData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.getProcessInstanceStatisticsByError(opts);
        let data = this._evaluateResponse(_raw, 'getProcessInstanceStatisticsByError', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetProcessInstanceStatisticsByErrorResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetProcessInstanceStatisticsByErrorResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getProcessInstanceStatisticsByError', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceStatisticsByError', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get resource
   *
   * Returns a deployed resource.
   * :::info
   * Currently, this endpoint only supports RPA resources.
   * :::
   *
    *
   * @example Get a resource
   * async function getResourceExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const resource = await camunda.getResource({
   *     resourceKey,
   *   });
   * 
   *   console.log(`Resource: ${resource.resourceName} (${resource.resourceId})`);
   * }
   * @operationId getResource
   * @tags Resource
   */
  getResource(input: getResourceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getResource>>;
  getResource(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getResource', _schemas.zGetResourceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getResource(opts);
        let data = this._evaluateResponse(_raw, 'getResource', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetResourceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetResourceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getResource', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getResource', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get resource content
   *
   * Returns the content of a deployed resource.
   * :::info
   * Currently, this endpoint only supports RPA resources.
   * :::
   *
    *
   * @example Get resource content
   * async function getResourceContentExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const content = await camunda.getResourceContent({
   *     resourceKey,
   *   });
   * 
   *   console.log(`Content retrieved (type: ${typeof content})`);
   * }
   * @operationId getResourceContent
   * @tags Resource
   */
  getResourceContent(input: getResourceContentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getResourceContent>>;
  getResourceContent(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getResourceContent', _schemas.zGetResourceContentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getResourceContent(opts);
        let data = this._evaluateResponse(_raw, 'getResourceContent', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetResourceContentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetResourceContentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getResourceContent', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getResourceContent', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get role
   *
   * Get a role by its ID.
    *
   * @example Get a role
   * async function getRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const role = await camunda.getRole(
   *     { roleId: 'process-admin' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Role: ${role.name}`);
   * }
   * @operationId getRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getRole(input: getRoleInput, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getRole', _schemas.zGetRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getRole(opts);
        let data = this._evaluateResponse(_raw, 'getRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getRole', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get process start form
   *
   * Get the start form of a process.
   * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
   *
    *
   * @example Get start process form
   * async function getStartProcessFormExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const form = await camunda.getStartProcessForm(
   *     { processDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   if (form) {
   *     console.log(`Form key: ${form.formKey}`);
   *   }
   * }
   * @operationId getStartProcessForm
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getStartProcessForm(input: getStartProcessFormInput, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getStartProcessForm', _schemas.zGetStartProcessFormData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getStartProcessForm(opts);
        let data = this._evaluateResponse(_raw, 'getStartProcessForm', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetStartProcessFormResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetStartProcessFormResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getStartProcessForm', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getStartProcessForm', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get cluster status
   *
   * Checks the health status of the cluster by verifying if there's at least one partition with a healthy leader.
    *
   * @example Check cluster status
   * async function getStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.getStatus();
   * 
   *   console.log('Cluster is healthy');
   * }
   * @operationId getStatus
   * @tags Cluster
   */
  getStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getStatus>>;
  getStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.getStatus(opts as any);
        let data = this._evaluateResponse(_raw, 'getStatus', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetStatusResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetStatusResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getStatus', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getStatus', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * System configuration (alpha)
   *
   * Returns the current system configuration. The response is an envelope
   * that groups settings by feature area.
   *
   * This endpoint is an alpha feature and may be subject to change
   * in future releases.
   *
    *
   * @example Get system configuration
   * async function getSystemConfigurationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const config = await camunda.getSystemConfiguration();
   * 
   *   console.log(`Configuration loaded: ${JSON.stringify(config)}`);
   * }
   * @operationId getSystemConfiguration
   * @tags System
   */
  getSystemConfiguration(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getSystemConfiguration>>;
  getSystemConfiguration(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.getSystemConfiguration(opts as any);
        let data = this._evaluateResponse(_raw, 'getSystemConfiguration', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetSystemConfigurationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetSystemConfigurationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getSystemConfiguration', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getSystemConfiguration', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get tenant
   *
   * Retrieves a single tenant by tenant ID.
    *
   * @example Get a tenant
   * async function getTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const tenant = await camunda.getTenant({ tenantId }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Tenant: ${tenant.name}`);
   * }
   * @operationId getTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenant(input: getTenantInput, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getTenant', _schemas.zGetTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getTenant(opts);
        let data = this._evaluateResponse(_raw, 'getTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getTenant', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get a tenant-scoped cluster variable
   *
   * Get a tenant-scoped cluster variable.
    *
   * @example Get a tenant cluster variable
   * async function getTenantClusterVariableExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const variable = await camunda.getTenantClusterVariable(
   *     {
   *       tenantId,
   *       name: 'config',
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`${variable.name} = ${variable.value}`);
   * }
   * @operationId getTenantClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenantClusterVariable(input: getTenantClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTenantClusterVariable>>;
  getTenantClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, name } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getTenantClusterVariable', _schemas.zGetTenantClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getTenantClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'getTenantClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetTenantClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetTenantClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getTenantClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getTenantClusterVariable', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get cluster topology
   *
   * Obtains the current topology of the cluster the gateway is part of.
    *
   * @example Get cluster topology
   * async function getTopologyExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const topology = await camunda.getTopology();
   * 
   *   console.log(`Cluster size: ${topology.clusterSize}`);
   *   console.log(`Partitions: ${topology.partitionsCount}`);
   *   for (const broker of topology.brokers ?? []) {
   *     console.log(`  Broker ${broker.nodeId}: ${broker.host}:${broker.port}`);
   *   }
   * }
   * @operationId getTopology
   * @tags Cluster
   */
  getTopology(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTopology>>;
  getTopology(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.getTopology(opts as any);
        let data = this._evaluateResponse(_raw, 'getTopology', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetTopologyResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetTopologyResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getTopology', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'getTopology', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Get usage metrics
   *
   * Retrieve the usage metrics based on given criteria.
    *
   * @example Get usage metrics
   * async function getUsageMetricsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const metrics = await camunda.getUsageMetrics(
   *     {
   *       startTime: '2025-01-01T00:00:00Z',
   *       endTime: '2025-12-31T23:59:59Z',
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Usage metrics retrieved: ${JSON.stringify(metrics)}`);
   * }
   * @operationId getUsageMetrics
   * @tags System
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUsageMetrics(input: getUsageMetricsInput, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUsageMetrics>>;
  getUsageMetrics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { startTime, endTime, tenantId, withTenants } = arg || {};
      let envelope: any = {};
      envelope.query = { startTime, endTime, tenantId, withTenants };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getUsageMetrics', _schemas.zGetUsageMetricsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        try {
        const _raw = await Sdk.getUsageMetrics(opts);
        let data = this._evaluateResponse(_raw, 'getUsageMetrics', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetUsageMetricsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetUsageMetricsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getUsageMetrics', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUsageMetrics', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get user
   *
   * Get a user by its username.
    *
   * @example Get a user
   * async function getUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   const user = await camunda.getUser({ username }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`User: ${user.name} (${user.email})`);
   * }
   * @operationId getUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUser(input: getUserInput, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { username } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getUser', _schemas.zGetUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getUser(opts);
        let data = this._evaluateResponse(_raw, 'getUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUser', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get user task
   *
   * Get the user task by the user task key.
    *
   * @example Get a user task
   * async function getUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const task = await camunda.getUserTask({ userTaskKey }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Task: ${task.name} (${task.state})`);
   * }
   * @operationId getUserTask
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTask(input: getUserTaskInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getUserTask', _schemas.zGetUserTaskData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getUserTask(opts);
        let data = this._evaluateResponse(_raw, 'getUserTask', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetUserTaskResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetUserTaskResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getUserTask', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUserTask', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get user task form
   *
   * Get the form of a user task.
   * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
   *
    *
   * @example Get a user task form
   * async function getUserTaskFormExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const form = await camunda.getUserTaskForm(
   *     { userTaskKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   if (form) {
   *     console.log(`Form key: ${form.formKey}`);
   *   }
   * }
   * @operationId getUserTaskForm
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTaskForm(input: getUserTaskFormInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getUserTaskForm', _schemas.zGetUserTaskFormData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getUserTaskForm(opts);
        let data = this._evaluateResponse(_raw, 'getUserTaskForm', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetUserTaskFormResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetUserTaskFormResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getUserTaskForm', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUserTaskForm', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Get variable
   *
   * Get a variable by its key.
   *
   * This endpoint returns both process-level and local (element-scoped) variables.
   * The variable's scopeKey indicates whether it's a process-level variable or scoped to a
   * specific element instance.
    *
   * @example Get a variable
   * async function getVariableExample(variableKey: VariableKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const variable = await camunda.getVariable(
   *     { variableKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`${variable.name} = ${variable.value}`);
   * }
   * @operationId getVariable
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getVariable(input: getVariableInput, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { variableKey } = arg || {};
      let envelope: any = {};
      envelope.path = { variableKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('getVariable', _schemas.zGetVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.getVariable(opts);
        let data = this._evaluateResponse(_raw, 'getVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zGetVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zGetVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('getVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getVariable', true, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Migrate process instance
   *
   * Migrates a process instance to a new process definition.
   * This request can contain multiple mapping instructions to define mapping between the active
   * process instance's elements and target process definition elements.
   *
   * Use this to upgrade a process instance to a new version of a process or to
   * a different process definition, e.g. to keep your running instances up-to-date with the
   * latest process improvements.
   *
    *
   * @example Migrate a process instance
   * async function migrateProcessInstanceExample(
   *   processInstanceKey: ProcessInstanceKey,
   *   targetProcessDefinitionKey: ProcessDefinitionKey,
   *   sourceElementId: ElementId,
   *   targetElementId: ElementId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.migrateProcessInstance({
   *     processInstanceKey,
   *     targetProcessDefinitionKey,
   *     mappingInstructions: [
   *       {
   *         sourceElementId,
   *         targetElementId,
   *       },
   *     ],
   *   });
   * }
   * @operationId migrateProcessInstance
   * @tags Process instance
   */
  migrateProcessInstance(input: migrateProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstance>>;
  migrateProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('migrateProcessInstance', _schemas.zMigrateProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.migrateProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'migrateProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zMigrateProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zMigrateProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('migrateProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'migrateProcessInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Migrate process instances (batch)
   *
   * Migrate multiple process instances.
   * Since only process instances with ACTIVE state can be migrated, any given
   * filters for state are ignored and overridden during this batch operation.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Migrate process instances in batch
   * async function migrateProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey,
   *   targetProcessDefinitionKey: ProcessDefinitionKey,
   *   sourceElementId: ElementId,
   *   targetElementId: ElementId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.migrateProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *     migrationPlan: {
   *       targetProcessDefinitionKey,
   *       mappingInstructions: [
   *         {
   *           sourceElementId,
   *           targetElementId,
   *         },
   *       ],
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId migrateProcessInstancesBatchOperation
   * @tags Process instance
   */
  migrateProcessInstancesBatchOperation(input: migrateProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('migrateProcessInstancesBatchOperation', _schemas.zMigrateProcessInstancesBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.migrateProcessInstancesBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'migrateProcessInstancesBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zMigrateProcessInstancesBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zMigrateProcessInstancesBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('migrateProcessInstancesBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'migrateProcessInstancesBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Modify process instance
   *
   * Modifies a running process instance.
   * This request can contain multiple instructions to activate an element of the process or
   * to terminate an active instance of an element.
   *
   * Use this to repair a process instance that is stuck on an element or took an unintended path.
   * For example, because an external system is not available or doesn't respond as expected.
   *
    *
   * @example Modify a process instance
   * async function modifyProcessInstanceExample(
   *   processInstanceKey: ProcessInstanceKey,
   *   elementId: ElementId,
   *   elementInstanceKey: ElementInstanceKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.modifyProcessInstance({
   *     processInstanceKey,
   *     activateInstructions: [{ elementId }],
   *     terminateInstructions: [{ elementInstanceKey }],
   *   });
   * }
   * @operationId modifyProcessInstance
   * @tags Process instance
   */
  modifyProcessInstance(input: modifyProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstance>>;
  modifyProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('modifyProcessInstance', _schemas.zModifyProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.modifyProcessInstance(opts);
        let data = this._evaluateResponse(_raw, 'modifyProcessInstance', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zModifyProcessInstanceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zModifyProcessInstanceResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('modifyProcessInstance', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'modifyProcessInstance', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Modify process instances (batch)
   *
   * Modify multiple process instances.
   * Since only process instances with ACTIVE state can be modified, any given
   * filters for state are ignored and overridden during this batch operation.
   * In contrast to single modification operation, it is not possible to add variable instructions or modify by element key.
   * It is only possible to use the element id of the source and target.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Modify process instances in batch
   * async function modifyProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey,
   *   sourceElementId: ElementId,
   *   targetElementId: ElementId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.modifyProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *     moveInstructions: [
   *       {
   *         sourceElementId,
   *         targetElementId,
   *       },
   *     ],
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId modifyProcessInstancesBatchOperation
   * @tags Process instance
   */
  modifyProcessInstancesBatchOperation(input: modifyProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('modifyProcessInstancesBatchOperation', _schemas.zModifyProcessInstancesBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.modifyProcessInstancesBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'modifyProcessInstancesBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zModifyProcessInstancesBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zModifyProcessInstancesBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('modifyProcessInstancesBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'modifyProcessInstancesBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Pin internal clock (alpha)
   *
   * Set a precise, static time for the Zeebe engine's internal clock.
   * When the clock is pinned, it remains at the specified time and does not advance.
   * To change the time, the clock must be pinned again with a new timestamp.
   *
   * This endpoint is an alpha feature and may be subject to change
   * in future releases.
   *
    *
   * @example Pin the cluster clock
   * async function pinClockExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.pinClock({
   *     timestamp: 1735689599000,
   *   });
   * 
   *   console.log('Clock pinned');
   * }
   * @operationId pinClock
   * @tags Clock
   */
  pinClock(input: pinClockInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.pinClock>>;
  pinClock(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('pinClock', _schemas.zPinClockData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.pinClock(opts);
        let data = this._evaluateResponse(_raw, 'pinClock', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zPinClockResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zPinClockResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('pinClock', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'pinClock', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Publish message
   *
   * Publishes a single message.
   * Messages are published to specific partitions computed from their correlation keys.
   * Messages can be buffered.
   * The endpoint does not wait for a correlation result.
   * Use the message correlation endpoint for such use cases.
   *
    *
   * @example Publish a message
   * async function publishMessageExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.publishMessage({
   *     name: 'order-payment-received',
   *     correlationKey: 'ORD-12345',
   *     timeToLive: 60000,
   *     variables: {
   *       paymentId: 'PAY-123',
   *     },
   *   });
   * }
   * @operationId publishMessage
   * @tags Message
   */
  publishMessage(input: publishMessageInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'publishMessage', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('publishMessage', _schemas.zPublishMessageData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.publishMessage(opts);
        let data = this._evaluateResponse(_raw, 'publishMessage', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zPublishMessageResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zPublishMessageResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('publishMessage', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'publishMessage', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Reset internal clock (alpha)
   *
   * Resets the Zeebe engine's internal clock to the current system time, enabling it to tick in real-time.
   * This operation is useful for returning the clock to
   * normal behavior after it has been pinned to a specific time.
   *
   * This endpoint is an alpha feature and may be subject to change
   * in future releases.
   *
    *
   * @example Reset the cluster clock
   * async function resetClockExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resetClock();
   * 
   *   console.log('Clock reset');
   * }
   * @operationId resetClock
   * @tags Clock
   */
  resetClock(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resetClock>>;
  resetClock(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal, throwOnError: false };
      const call = async () => {
        try {
        const _raw = await Sdk.resetClock(opts as any);
        let data = this._evaluateResponse(_raw, 'resetClock', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail))); 
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zResetClockResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zResetClockResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('resetClock', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'resetClock', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Resolve incident
   *
   * Marks the incident as resolved; most likely a call to Update job will be necessary
   * to reset the job's retries, followed by this call.
   *
    *
   * @example Resolve an incident
   * async function resolveIncidentExample(incidentKey: IncidentKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resolveIncident({ incidentKey });
   * }
   * @operationId resolveIncident
   * @tags Incident
   */
  resolveIncident(input: resolveIncidentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncident>>;
  resolveIncident(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { incidentKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { incidentKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('resolveIncident', _schemas.zResolveIncidentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.resolveIncident(opts);
        let data = this._evaluateResponse(_raw, 'resolveIncident', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zResolveIncidentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zResolveIncidentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('resolveIncident', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'resolveIncident', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Resolve related incidents (batch)
   *
   * Resolves multiple instances of process instances.
   * Since only process instances with ACTIVE state can have unresolved incidents, any given
   * filters for state are ignored and overridden during this batch operation.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Resolve incidents in batch
   * async function resolveIncidentsBatchOperationExample(processDefinitionKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.resolveIncidentsBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId resolveIncidentsBatchOperation
   * @tags Process instance
   */
  resolveIncidentsBatchOperation(input: resolveIncidentsBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('resolveIncidentsBatchOperation', _schemas.zResolveIncidentsBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.resolveIncidentsBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'resolveIncidentsBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zResolveIncidentsBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zResolveIncidentsBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('resolveIncidentsBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'resolveIncidentsBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Resolve related incidents
   *
   * Creates a batch operation to resolve multiple incidents of a process instance.
    *
   * @example Resolve process instance incidents
   * async function resolveProcessInstanceIncidentsExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.resolveProcessInstanceIncidents({ processInstanceKey });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * @operationId resolveProcessInstanceIncidents
   * @tags Process instance
   */
  resolveProcessInstanceIncidents(input: resolveProcessInstanceIncidentsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveProcessInstanceIncidents>>;
  resolveProcessInstanceIncidents(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('resolveProcessInstanceIncidents', _schemas.zResolveProcessInstanceIncidentsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.resolveProcessInstanceIncidents(opts);
        let data = this._evaluateResponse(_raw, 'resolveProcessInstanceIncidents', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zResolveProcessInstanceIncidentsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zResolveProcessInstanceIncidentsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('resolveProcessInstanceIncidents', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'resolveProcessInstanceIncidents', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Resume Batch operation
   *
   * Resumes a suspended batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Resume a batch operation
   * async function resumeBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resumeBatchOperation({ batchOperationKey });
   * }
   * @operationId resumeBatchOperation
   * @tags Batch operation
   */
  resumeBatchOperation(input: resumeBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('resumeBatchOperation', _schemas.zResumeBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.resumeBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'resumeBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zResumeBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zResumeBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('resumeBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'resumeBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Search audit logs
   *
   * Search for audit logs based on given criteria.
    *
   * @example Search audit logs
   * async function searchAuditLogsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchAuditLogs(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const log of result.items ?? []) {
   *     console.log(`${log.auditLogKey}: ${log.operationType}`);
   *   }
   * }
   * @operationId searchAuditLogs
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuditLogs(input: searchAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAuditLogs>>;
  searchAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchAuditLogs', _schemas.zSearchAuditLogsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchAuditLogs(opts);
        let data = this._evaluateResponse(_raw, 'searchAuditLogs', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchAuditLogsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchAuditLogsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchAuditLogs', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchAuditLogs', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search authorizations
   *
   * Search for authorizations based on given criteria.
    *
   * @example Search authorizations
   * async function searchAuthorizationsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchAuthorizations(
   *     {
   *       filter: { ownerType: 'USER' },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const auth of result.items ?? []) {
   *     console.log(`${auth.authorizationKey}: ${auth.ownerId} - ${auth.resourceType}`);
   *   }
   * }
   * @operationId searchAuthorizations
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuthorizations(input: searchAuthorizationsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchAuthorizations', _schemas.zSearchAuthorizationsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchAuthorizations(opts);
        let data = this._evaluateResponse(_raw, 'searchAuthorizations', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchAuthorizationsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchAuthorizationsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchAuthorizations', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchAuthorizations', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search batch operation items
   *
   * Search for batch operation items based on given criteria.
    *
   * @example Search batch operation items
   * async function searchBatchOperationItemsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchBatchOperationItems(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const item of result.items ?? []) {
   *     console.log(`Item: ${item.itemKey} (${item.state})`);
   *   }
   * }
   * @operationId searchBatchOperationItems
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperationItems(input: searchBatchOperationItemsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchBatchOperationItems', _schemas.zSearchBatchOperationItemsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchBatchOperationItems(opts);
        let data = this._evaluateResponse(_raw, 'searchBatchOperationItems', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchBatchOperationItemsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchBatchOperationItemsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchBatchOperationItems', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchBatchOperationItems', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search batch operations
   *
   * Search for batch operations based on given criteria.
    *
   * @example Search batch operations
   * async function searchBatchOperationsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchBatchOperations(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const batch of result.items ?? []) {
   *     console.log(`${batch.batchOperationKey}: ${batch.batchOperationType} (${batch.state})`);
   *   }
   * }
   * @operationId searchBatchOperations
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperations(input: searchBatchOperationsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchBatchOperations', _schemas.zSearchBatchOperationsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchBatchOperations(opts);
        let data = this._evaluateResponse(_raw, 'searchBatchOperations', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchBatchOperationsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchBatchOperationsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchBatchOperations', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchBatchOperations', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search group clients
   *
   * Search clients assigned to a group.
    *
   * @example Search clients in a group
   * async function searchClientsForGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClientsForGroup(
   *     { groupId: 'engineering-team' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const client of result.items ?? []) {
   *     console.log(`Client: ${client.clientId}`);
   *   }
   * }
   * @operationId searchClientsForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForGroup(input: searchClientsForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchClientsForGroup', _schemas.zSearchClientsForGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchClientsForGroup(opts);
        let data = this._evaluateResponse(_raw, 'searchClientsForGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchClientsForGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchClientsForGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchClientsForGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForGroup', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search role clients
   *
   * Search clients with assigned role.
    *
   * @example Search clients for a role
   * async function searchClientsForRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClientsForRole(
   *     { roleId: 'process-admin' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const client of result.items ?? []) {
   *     console.log(`Client: ${client.clientId}`);
   *   }
   * }
   * @operationId searchClientsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForRole(input: searchClientsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchClientsForRole', _schemas.zSearchClientsForRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchClientsForRole(opts);
        let data = this._evaluateResponse(_raw, 'searchClientsForRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchClientsForRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchClientsForRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchClientsForRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForRole', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search clients for tenant
   *
   * Retrieves a filtered and sorted list of clients for a specified tenant.
    *
   * @example Search clients for a tenant
   * async function searchClientsForTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClientsForTenant(
   *     { tenantId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const client of result.items ?? []) {
   *     console.log(`Client: ${client.clientId}`);
   *   }
   * }
   * @operationId searchClientsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForTenant(input: searchClientsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchClientsForTenant', _schemas.zSearchClientsForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchClientsForTenant(opts);
        let data = this._evaluateResponse(_raw, 'searchClientsForTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchClientsForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchClientsForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchClientsForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForTenant', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search for cluster variables based on given criteria. By default, long variable values in the response are truncated.
    *
   * @example Search cluster variables
   * async function searchClusterVariablesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClusterVariables(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const variable of result.items ?? []) {
   *     console.log(`${variable.name} = ${variable.value}`);
   *   }
   * }
   * @operationId searchClusterVariables
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClusterVariables(input: searchClusterVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClusterVariables>>;
  searchClusterVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchClusterVariables', _schemas.zSearchClusterVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchClusterVariables(opts);
        let data = this._evaluateResponse(_raw, 'searchClusterVariables', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchClusterVariablesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchClusterVariablesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchClusterVariables', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClusterVariables', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search correlated message subscriptions
   *
   * Search correlated message subscriptions based on given criteria.
    *
   * @example Search correlated message subscriptions
   * async function searchCorrelatedMessageSubscriptionsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchCorrelatedMessageSubscriptions(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const sub of result.items ?? []) {
   *     console.log(`Correlated subscription: ${sub.messageName}`);
   *   }
   * }
   * @operationId searchCorrelatedMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchCorrelatedMessageSubscriptions(input: searchCorrelatedMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchCorrelatedMessageSubscriptions>>;
  searchCorrelatedMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchCorrelatedMessageSubscriptions', _schemas.zSearchCorrelatedMessageSubscriptionsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchCorrelatedMessageSubscriptions(opts);
        let data = this._evaluateResponse(_raw, 'searchCorrelatedMessageSubscriptions', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchCorrelatedMessageSubscriptionsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchCorrelatedMessageSubscriptionsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchCorrelatedMessageSubscriptions', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchCorrelatedMessageSubscriptions', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search decision definitions
   *
   * Search for decision definitions based on given criteria.
    *
   * @example Search decision definitions
   * async function searchDecisionDefinitionsExample(decisionDefinitionId: DecisionDefinitionId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchDecisionDefinitions(
   *     {
   *       filter: { decisionDefinitionId },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const definition of result.items ?? []) {
   *     console.log(`${definition.decisionDefinitionId} v${definition.version}`);
   *   }
   * }
   * @operationId searchDecisionDefinitions
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionDefinitions(input: searchDecisionDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchDecisionDefinitions', _schemas.zSearchDecisionDefinitionsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchDecisionDefinitions(opts);
        let data = this._evaluateResponse(_raw, 'searchDecisionDefinitions', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchDecisionDefinitionsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchDecisionDefinitionsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchDecisionDefinitions', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionDefinitions', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search decision instances
   *
   * Search for decision instances based on given criteria.
    *
   * @example Search decision instances
   * async function searchDecisionInstancesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchDecisionInstances(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const instance of result.items ?? []) {
   *     console.log(`${instance.decisionEvaluationKey}: ${instance.decisionDefinitionId}`);
   *   }
   * }
   * @operationId searchDecisionInstances
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionInstances(input: searchDecisionInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchDecisionInstances', _schemas.zSearchDecisionInstancesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchDecisionInstances(opts);
        let data = this._evaluateResponse(_raw, 'searchDecisionInstances', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchDecisionInstancesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchDecisionInstancesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchDecisionInstances', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionInstances', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search decision requirements
   *
   * Search for decision requirements based on given criteria.
    *
   * @example Search decision requirements
   * async function searchDecisionRequirementsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchDecisionRequirements(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const req of result.items ?? []) {
   *     console.log(`${req.decisionRequirementsKey}: ${req.decisionRequirementsId}`);
   *   }
   * }
   * @operationId searchDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionRequirements(input: searchDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchDecisionRequirements', _schemas.zSearchDecisionRequirementsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchDecisionRequirements(opts);
        let data = this._evaluateResponse(_raw, 'searchDecisionRequirements', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchDecisionRequirementsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchDecisionRequirementsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchDecisionRequirements', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionRequirements', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search for incidents of a specific element instance
   *
   * Search for incidents caused by the specified element instance, including incidents of any child instances created from this element instance.
   *
   * Although the `elementInstanceKey` is provided as a path parameter to indicate the root element instance,
   * you may also include an `elementInstanceKey` within the filter object to narrow results to specific
   * child element instances. This is useful, for example, if you want to isolate incidents associated with
   * nested or subordinate elements within the given element instance while excluding incidents directly tied
   * to the root element itself.
   *
    *
   * @example Search element instance incidents
   * async function searchElementInstanceIncidentsExample(elementInstanceKey: ElementInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchElementInstanceIncidents(
   *     { elementInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const incident of result.items ?? []) {
   *     console.log(`Incident: ${incident.errorType}`);
   *   }
   * }
   * @operationId searchElementInstanceIncidents
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstanceIncidents(input: searchElementInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstanceIncidents>>;
  searchElementInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { elementInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchElementInstanceIncidents', _schemas.zSearchElementInstanceIncidentsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchElementInstanceIncidents(opts);
        let data = this._evaluateResponse(_raw, 'searchElementInstanceIncidents', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchElementInstanceIncidentsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchElementInstanceIncidentsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchElementInstanceIncidents', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchElementInstanceIncidents', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search element instances
   *
   * Search for element instances based on given criteria.
    *
   * @example Search element instances
   * async function searchElementInstancesExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchElementInstances(
   *     {
   *       filter: {
   *         processInstanceKey,
   *       },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const element of result.items ?? []) {
   *     console.log(`${element.elementId}: ${element.type} (${element.state})`);
   *   }
   * }
   * @operationId searchElementInstances
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstances(input: searchElementInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchElementInstances', _schemas.zSearchElementInstancesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchElementInstances(opts);
        let data = this._evaluateResponse(_raw, 'searchElementInstances', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchElementInstancesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchElementInstancesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchElementInstances', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchElementInstances', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search global user task listeners
   *
   * Search for global user task listeners based on given criteria.
    *
   * @example Search global task listeners
   * async function searchGlobalTaskListenersExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchGlobalTaskListeners(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const listener of result.items ?? []) {
   *     console.log(`${listener.id}: ${listener.type} (${listener.eventTypes})`);
   *   }
   * }
   * @operationId searchGlobalTaskListeners
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGlobalTaskListeners(input: searchGlobalTaskListenersInput, /** Management of eventual consistency **/ consistencyManagement: searchGlobalTaskListenersConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGlobalTaskListeners>>;
  searchGlobalTaskListeners(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGlobalTaskListenersConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchGlobalTaskListeners', _schemas.zSearchGlobalTaskListenersData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchGlobalTaskListeners(opts);
        let data = this._evaluateResponse(_raw, 'searchGlobalTaskListeners', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchGlobalTaskListenersResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchGlobalTaskListenersResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchGlobalTaskListeners', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGlobalTaskListeners', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search groups for tenant
   *
   * Retrieves a filtered and sorted list of groups for a specified tenant.
    *
   * @example Search groups for a tenant
   * async function searchGroupIdsForTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchGroupIdsForTenant(
   *     { tenantId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const group of result.items ?? []) {
   *     console.log(`Group: ${group.groupId}`);
   *   }
   * }
   * @operationId searchGroupIdsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupIdsForTenant(input: searchGroupIdsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchGroupIdsForTenant', _schemas.zSearchGroupIdsForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchGroupIdsForTenant(opts);
        let data = this._evaluateResponse(_raw, 'searchGroupIdsForTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchGroupIdsForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchGroupIdsForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchGroupIdsForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroupIdsForTenant', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search groups
   *
   * Search for groups based on given criteria.
    *
   * @example Search groups
   * async function searchGroupsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchGroups(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const group of result.items ?? []) {
   *     console.log(`${group.groupId}: ${group.name}`);
   *   }
   * }
   * @operationId searchGroups
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroups(input: searchGroupsInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchGroups', _schemas.zSearchGroupsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchGroups(opts);
        let data = this._evaluateResponse(_raw, 'searchGroups', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchGroupsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchGroupsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchGroups', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroups', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search role groups
   *
   * Search groups with assigned role.
    *
   * @example Search groups for a role
   * async function searchGroupsForRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchGroupsForRole(
   *     { roleId: 'process-admin' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const group of result.items ?? []) {
   *     console.log(`Group: ${group.groupId}`);
   *   }
   * }
   * @operationId searchGroupsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupsForRole(input: searchGroupsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchGroupsForRole', _schemas.zSearchGroupsForRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchGroupsForRole(opts);
        let data = this._evaluateResponse(_raw, 'searchGroupsForRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchGroupsForRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchGroupsForRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchGroupsForRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroupsForRole', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search incidents
   *
   * Search for incidents based on given criteria.
   *
    *
   * @example Search incidents
   * async function searchIncidentsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchIncidents(
   *     {
   *       filter: { state: 'ACTIVE' },
   *       sort: [{ field: 'creationTime', order: 'DESC' }],
   *       page: { limit: 20 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const incident of result.items ?? []) {
   *     console.log(`${incident.incidentKey}: ${incident.errorType} — ${incident.errorMessage}`);
   *   }
   *   console.log(`Total active incidents: ${result.page.totalItems}`);
   * }
   * @operationId searchIncidents
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchIncidents(input: searchIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchIncidents', _schemas.zSearchIncidentsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchIncidents(opts);
        let data = this._evaluateResponse(_raw, 'searchIncidents', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchIncidentsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchIncidentsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchIncidents', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchIncidents', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search jobs
   *
   * Search for jobs based on given criteria.
    *
   * @example Search jobs
   * async function searchJobsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchJobs(
   *     {
   *       filter: { type: 'payment-processing', state: 'CREATED' },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const job of result.items ?? []) {
   *     console.log(`Job ${job.jobKey}: ${job.type} (${job.state})`);
   *   }
   * }
   * @operationId searchJobs
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchJobs(input: searchJobsInput, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchJobs', _schemas.zSearchJobsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchJobs(opts);
        let data = this._evaluateResponse(_raw, 'searchJobs', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchJobsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchJobsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchJobs', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchJobs', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search mapping rules
   *
   * Search for mapping rules based on given criteria.
   *
    *
   * @example Search mapping rules
   * async function searchMappingRulesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRule(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`${rule.mappingRuleId}: ${rule.name}`);
   *   }
   * }
   * @operationId searchMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRule(input: searchMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchMappingRule', _schemas.zSearchMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'searchMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRule', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search group mapping rules
   *
   * Search mapping rules assigned to a group.
    *
   * @example Search mapping rules for a group
   * async function searchMappingRulesForGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRulesForGroup(
   *     { groupId: 'engineering-team' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`Mapping rule: ${rule.name}`);
   *   }
   * }
   * @operationId searchMappingRulesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForGroup(input: searchMappingRulesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchMappingRulesForGroup', _schemas.zSearchMappingRulesForGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchMappingRulesForGroup(opts);
        let data = this._evaluateResponse(_raw, 'searchMappingRulesForGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchMappingRulesForGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchMappingRulesForGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMappingRulesForGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRulesForGroup', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search role mapping rules
   *
   * Search mapping rules with assigned role.
    *
   * @example Search mapping rules for a role
   * async function searchMappingRulesForRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRulesForRole(
   *     { roleId: 'process-admin' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`Mapping rule: ${rule.name}`);
   *   }
   * }
   * @operationId searchMappingRulesForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForRole(input: searchMappingRulesForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchMappingRulesForRole', _schemas.zSearchMappingRulesForRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchMappingRulesForRole(opts);
        let data = this._evaluateResponse(_raw, 'searchMappingRulesForRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchMappingRulesForRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchMappingRulesForRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMappingRulesForRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRulesForRole', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search mapping rules for tenant
   *
   * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
    *
   * @example Search mapping rules for a tenant
   * async function searchMappingRulesForTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRulesForTenant(
   *     { tenantId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`Mapping rule: ${rule.name}`);
   *   }
   * }
   * @operationId searchMappingRulesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForTenant(input: searchMappingRulesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForTenant>>;
  searchMappingRulesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchMappingRulesForTenant', _schemas.zSearchMappingRulesForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchMappingRulesForTenant(opts);
        let data = this._evaluateResponse(_raw, 'searchMappingRulesForTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchMappingRulesForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchMappingRulesForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMappingRulesForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRulesForTenant', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search message subscriptions
   *
   * Search for message subscriptions based on given criteria.
    *
   * @example Search message subscriptions
   * async function searchMessageSubscriptionsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMessageSubscriptions(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const sub of result.items ?? []) {
   *     console.log(`Subscription: ${sub.messageName}`);
   *   }
   * }
   * @operationId searchMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMessageSubscriptions(input: searchMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchMessageSubscriptions', _schemas.zSearchMessageSubscriptionsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchMessageSubscriptions(opts);
        let data = this._evaluateResponse(_raw, 'searchMessageSubscriptions', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchMessageSubscriptionsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchMessageSubscriptionsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMessageSubscriptions', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMessageSubscriptions', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search process definitions
   *
   * Search for process definitions based on given criteria.
    *
   * @example Search process definitions
   * async function searchProcessDefinitionsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchProcessDefinitions(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const def of result.items ?? []) {
   *     console.log(`${def.processDefinitionKey}: ${def.processDefinitionId} v${def.version}`);
   *   }
   * }
   * @operationId searchProcessDefinitions
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessDefinitions(input: searchProcessDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchProcessDefinitions', _schemas.zSearchProcessDefinitionsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchProcessDefinitions(opts);
        let data = this._evaluateResponse(_raw, 'searchProcessDefinitions', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchProcessDefinitionsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchProcessDefinitionsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchProcessDefinitions', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessDefinitions', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search related incidents
   *
   * Search for incidents caused by the process instance or any of its called process or decision instances.
   *
   * Although the `processInstanceKey` is provided as a path parameter to indicate the root process instance,
   * you may also include a `processInstanceKey` within the filter object to narrow results to specific
   * child process instances. This is useful, for example, if you want to isolate incidents associated with
   * subprocesses or called processes under the root instance while excluding incidents directly tied to the root.
   *
    *
   * @example Search process instance incidents
   * async function searchProcessInstanceIncidentsExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchProcessInstanceIncidents(
   *     {
   *       processInstanceKey,
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const incident of result.items ?? []) {
   *     console.log(`Incident: ${incident.errorType} - ${incident.errorMessage}`);
   *   }
   * }
   * @operationId searchProcessInstanceIncidents
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstanceIncidents(input: searchProcessInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchProcessInstanceIncidents', _schemas.zSearchProcessInstanceIncidentsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchProcessInstanceIncidents(opts);
        let data = this._evaluateResponse(_raw, 'searchProcessInstanceIncidents', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchProcessInstanceIncidentsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchProcessInstanceIncidentsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchProcessInstanceIncidents', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessInstanceIncidents', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search process instances
   *
   * Search for process instances based on given criteria.
    *
   * @example Search process instances
   * async function searchProcessInstancesExample(processDefinitionId: ProcessDefinitionId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchProcessInstances(
   *     {
   *       filter: { processDefinitionId },
   *       sort: [{ field: 'startDate', order: 'DESC' }],
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const instance of result.items ?? []) {
   *     console.log(`${instance.processInstanceKey}: ${instance.state}`);
   *   }
   *   console.log(`Total: ${result.page.totalItems}`);
   * }
   * @operationId searchProcessInstances
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstances(input: searchProcessInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchProcessInstances', _schemas.zSearchProcessInstancesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchProcessInstances(opts);
        let data = this._evaluateResponse(_raw, 'searchProcessInstances', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchProcessInstancesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchProcessInstancesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchProcessInstances', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessInstances', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search roles
   *
   * Search for roles based on given criteria.
    *
   * @example Search roles
   * async function searchRolesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchRoles(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const role of result.items ?? []) {
   *     console.log(`${role.roleId}: ${role.name}`);
   *   }
   * }
   * @operationId searchRoles
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRoles(input: searchRolesInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchRoles', _schemas.zSearchRolesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchRoles(opts);
        let data = this._evaluateResponse(_raw, 'searchRoles', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchRolesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchRolesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchRoles', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRoles', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search group roles
   *
   * Search roles assigned to a group.
    *
   * @example Search roles for a group
   * async function searchRolesForGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchRolesForGroup(
   *     { groupId: 'engineering-team' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const role of result.items ?? []) {
   *     console.log(`Role: ${role.name}`);
   *   }
   * }
   * @operationId searchRolesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForGroup(input: searchRolesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchRolesForGroup', _schemas.zSearchRolesForGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchRolesForGroup(opts);
        let data = this._evaluateResponse(_raw, 'searchRolesForGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchRolesForGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchRolesForGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchRolesForGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRolesForGroup', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search roles for tenant
   *
   * Retrieves a filtered and sorted list of roles for a specified tenant.
    *
   * @example Search roles for a tenant
   * async function searchRolesForTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchRolesForTenant(
   *     { tenantId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const role of result.items ?? []) {
   *     console.log(`Role: ${role.name}`);
   *   }
   * }
   * @operationId searchRolesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForTenant(input: searchRolesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchRolesForTenant', _schemas.zSearchRolesForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchRolesForTenant(opts);
        let data = this._evaluateResponse(_raw, 'searchRolesForTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchRolesForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchRolesForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchRolesForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRolesForTenant', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search tenants
   *
   * Retrieves a filtered and sorted list of tenants.
    *
   * @example Search tenants
   * async function searchTenantsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchTenants(
   *     {
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const tenant of result.items ?? []) {
   *     console.log(`${tenant.tenantId}: ${tenant.name}`);
   *   }
   * }
   * @operationId searchTenants
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchTenants(input: searchTenantsInput, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchTenants', _schemas.zSearchTenantsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchTenants(opts);
        let data = this._evaluateResponse(_raw, 'searchTenants', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchTenantsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchTenantsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchTenants', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchTenants', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search users
   *
   * Search for users based on given criteria.
    *
   * @example Search users
   * async function searchUsersExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsers(
   *     {
   *       filter: {},
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`${user.username}: ${user.name}`);
   *   }
   * }
   * @operationId searchUsers
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsers(input: searchUsersInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUsers', _schemas.zSearchUsersData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUsers(opts);
        let data = this._evaluateResponse(_raw, 'searchUsers', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUsersResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUsersResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUsers', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsers', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search group users
   *
   * Search users assigned to a group.
    *
   * @example Search users in a group
   * async function searchUsersForGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsersForGroup(
   *     { groupId: 'engineering-team' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`Member: ${user.username}`);
   *   }
   * }
   * @operationId searchUsersForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForGroup(input: searchUsersForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUsersForGroup', _schemas.zSearchUsersForGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUsersForGroup(opts);
        let data = this._evaluateResponse(_raw, 'searchUsersForGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUsersForGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUsersForGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUsersForGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForGroup', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search role users
   *
   * Search users with assigned role.
    *
   * @example Search users for a role
   * async function searchUsersForRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsersForRole(
   *     { roleId: 'process-admin' },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`User: ${user.username}`);
   *   }
   * }
   * @operationId searchUsersForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForRole(input: searchUsersForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUsersForRole', _schemas.zSearchUsersForRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUsersForRole(opts);
        let data = this._evaluateResponse(_raw, 'searchUsersForRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUsersForRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUsersForRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUsersForRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForRole', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search users for tenant
   *
   * Retrieves a filtered and sorted list of users for a specified tenant.
    *
   * @example Search users for a tenant
   * async function searchUsersForTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsersForTenant(
   *     { tenantId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`Tenant member: ${user.username}`);
   *   }
   * }
   * @operationId searchUsersForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForTenant(input: searchUsersForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUsersForTenant', _schemas.zSearchUsersForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUsersForTenant(opts);
        let data = this._evaluateResponse(_raw, 'searchUsersForTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUsersForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUsersForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUsersForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForTenant', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search user task audit logs
   *
   * Search for user task audit logs based on given criteria.
    *
   * @example Search user task audit logs
   * async function searchUserTaskAuditLogsExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUserTaskAuditLogs(
   *     { userTaskKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const log of result.items ?? []) {
   *     console.log(`Audit: ${log.operationType} at ${log.timestamp}`);
   *   }
   * }
   * @operationId searchUserTaskAuditLogs
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskAuditLogs(input: searchUserTaskAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskAuditLogs>>;
  searchUserTaskAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUserTaskAuditLogs', _schemas.zSearchUserTaskAuditLogsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUserTaskAuditLogs(opts);
        let data = this._evaluateResponse(_raw, 'searchUserTaskAuditLogs', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUserTaskAuditLogsResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUserTaskAuditLogsResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUserTaskAuditLogs', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTaskAuditLogs', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search user task effective variables
   *
   * Search for the effective variables of a user task. This endpoint returns deduplicated
   * variables where each variable name appears at most once. When the same variable name exists
   * at multiple scope levels in the scope hierarchy, the value from the innermost scope (closest
   * to the user task) takes precedence. This is useful for retrieving the actual runtime state
   * of variables as seen by the user task. By default, long variable values in the response are
   * truncated.
   *
    *
   * @example Search user task effective variables
   * async function searchUserTaskEffectiveVariablesExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUserTaskEffectiveVariables(
   *     { userTaskKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const variable of result.items ?? []) {
   *     console.log(`${variable.name} = ${variable.value}`);
   *   }
   * }
   * @operationId searchUserTaskEffectiveVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskEffectiveVariables(input: searchUserTaskEffectiveVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskEffectiveVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskEffectiveVariables>>;
  searchUserTaskEffectiveVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskEffectiveVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey, truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUserTaskEffectiveVariables', _schemas.zSearchUserTaskEffectiveVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUserTaskEffectiveVariables(opts);
        let data = this._evaluateResponse(_raw, 'searchUserTaskEffectiveVariables', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUserTaskEffectiveVariablesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUserTaskEffectiveVariablesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUserTaskEffectiveVariables', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTaskEffectiveVariables', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search user tasks
   *
   * Search for user tasks based on given criteria.
    *
   * @example Search user tasks
   * async function searchUserTasksExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUserTasks(
   *     {
   *       filter: { assignee: 'alice', state: 'CREATED' },
   *       sort: [{ field: 'creationDate', order: 'DESC' }],
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const task of result.items ?? []) {
   *     console.log(`${task.userTaskKey}: ${task.name} (${task.state})`);
   *   }
   * }
   * @operationId searchUserTasks
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTasks(input: searchUserTasksInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUserTasks', _schemas.zSearchUserTasksData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUserTasks(opts);
        let data = this._evaluateResponse(_raw, 'searchUserTasks', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUserTasksResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUserTasksResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUserTasks', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTasks', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search user task variables
   *
   * Search for user task variables based on given criteria. This endpoint returns all variable
   * documents visible from the user task's scope, including variables from parent scopes in the
   * scope hierarchy. If the same variable name exists at multiple scope levels, each scope's
   * variable is returned as a separate result. Use the
   * `/user-tasks/{userTaskKey}/effective-variables/search` endpoint to get deduplicated variables
   * where the innermost scope takes precedence. By default, long variable values in the response
   * are truncated.
   *
    *
   * @example Search user task variables
   * async function searchUserTaskVariablesExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUserTaskVariables(
   *     { userTaskKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const variable of result.items ?? []) {
   *     console.log(`${variable.name} = ${variable.value}`);
   *   }
   * }
   * @operationId searchUserTaskVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskVariables(input: searchUserTaskVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey, truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchUserTaskVariables', _schemas.zSearchUserTaskVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchUserTaskVariables(opts);
        let data = this._evaluateResponse(_raw, 'searchUserTaskVariables', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchUserTaskVariablesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchUserTaskVariablesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchUserTaskVariables', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTaskVariables', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search variables
   *
   * Search for variables based on given criteria.
   *
   * This endpoint returns variables that exist directly at the specified scopes - it does not
   * include variables from parent scopes that would be visible through the scope hierarchy.
   *
   * Variables can be process-level (scoped to the process instance) or local (scoped to specific
   * BPMN elements like tasks, subprocesses, etc.).
   *
   * By default, long variable values in the response are truncated.
    *
   * @example Search variables
   * async function searchVariablesExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchVariables(
   *     {
   *       filter: {
   *         processInstanceKey,
   *       },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const variable of result.items ?? []) {
   *     console.log(`${variable.name} = ${variable.value}`);
   *   }
   * }
   * @operationId searchVariables
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchVariables(input: searchVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('searchVariables', _schemas.zSearchVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.searchVariables(opts);
        let data = this._evaluateResponse(_raw, 'searchVariables', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSearchVariablesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSearchVariablesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchVariables', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchVariables', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Suspend Batch operation
   *
   * Suspends a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Suspend a batch operation
   * async function suspendBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.suspendBatchOperation({ batchOperationKey });
   * }
   * @operationId suspendBatchOperation
   * @tags Batch operation
   */
  suspendBatchOperation(input: suspendBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('suspendBatchOperation', _schemas.zSuspendBatchOperationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.suspendBatchOperation(opts);
        let data = this._evaluateResponse(_raw, 'suspendBatchOperation', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zSuspendBatchOperationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zSuspendBatchOperationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('suspendBatchOperation', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'suspendBatchOperation', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Throw error for job
   *
   * Reports a business error (i.e. non-technical) that occurs while processing a job.
   *
    *
   * @example Throw a job error
   * async function throwJobErrorExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.throwJobError({
   *     jobKey,
   *     errorCode: 'PAYMENT_FAILED',
   *     errorMessage: 'Payment provider returned error',
   *   });
   * }
   * @operationId throwJobError
   * @tags Job
   */
  throwJobError(input: throwJobErrorInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.throwJobError>>;
  throwJobError(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('throwJobError', _schemas.zThrowJobErrorData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.throwJobError(opts);
        let data = this._evaluateResponse(_raw, 'throwJobError', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zThrowJobErrorResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zThrowJobErrorResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('throwJobError', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'throwJobError', exempt: true, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a client from a group
   *
   * Unassigns a client from a group.
   * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @example Unassign a client from a group
   * async function unassignClientFromGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignClientFromGroup({
   *     groupId: 'engineering-team',
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId unassignClientFromGroup
   * @tags Group
   */
  unassignClientFromGroup(input: unassignClientFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromGroup>>;
  unassignClientFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignClientFromGroup', _schemas.zUnassignClientFromGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignClientFromGroup(opts);
        let data = this._evaluateResponse(_raw, 'unassignClientFromGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignClientFromGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignClientFromGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignClientFromGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignClientFromGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a client from a tenant
   *
   * Unassigns the client from the specified tenant.
   * The client can no longer access tenant data.
   *
    *
   * @example Unassign a client from a tenant
   * async function unassignClientFromTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignClientFromTenant({
   *     tenantId,
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId unassignClientFromTenant
   * @tags Tenant
   */
  unassignClientFromTenant(input: unassignClientFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromTenant>>;
  unassignClientFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignClientFromTenant', _schemas.zUnassignClientFromTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignClientFromTenant(opts);
        let data = this._evaluateResponse(_raw, 'unassignClientFromTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignClientFromTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignClientFromTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignClientFromTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignClientFromTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a group from a tenant
   *
   * Unassigns a group from a specified tenant.
   * Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
   *
    *
   * @example Unassign a group from a tenant
   * async function unassignGroupFromTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignGroupFromTenant({
   *     tenantId,
   *     groupId: 'engineering-team',
   *   });
   * }
   * @operationId unassignGroupFromTenant
   * @tags Tenant
   */
  unassignGroupFromTenant(input: unassignGroupFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignGroupFromTenant>>;
  unassignGroupFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignGroupFromTenant', _schemas.zUnassignGroupFromTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignGroupFromTenant(opts);
        let data = this._evaluateResponse(_raw, 'unassignGroupFromTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignGroupFromTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignGroupFromTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignGroupFromTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignGroupFromTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a mapping rule from a group
   *
   * Unassigns a mapping rule from a group.
    *
   * @example Unassign a mapping rule from a group
   * async function unassignMappingRuleFromGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignMappingRuleFromGroup({
   *     groupId: 'engineering-team',
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId unassignMappingRuleFromGroup
   * @tags Group
   */
  unassignMappingRuleFromGroup(input: unassignMappingRuleFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromGroup>>;
  unassignMappingRuleFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignMappingRuleFromGroup', _schemas.zUnassignMappingRuleFromGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignMappingRuleFromGroup(opts);
        let data = this._evaluateResponse(_raw, 'unassignMappingRuleFromGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignMappingRuleFromGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignMappingRuleFromGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignMappingRuleFromGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignMappingRuleFromGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a mapping rule from a tenant
   *
   * Unassigns a single mapping rule from a specified tenant without deleting the rule.
    *
   * @example Unassign a mapping rule from a tenant
   * async function unassignMappingRuleFromTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignMappingRuleFromTenant({
   *     tenantId,
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId unassignMappingRuleFromTenant
   * @tags Tenant
   */
  unassignMappingRuleFromTenant(input: unassignMappingRuleFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromTenant>>;
  unassignMappingRuleFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignMappingRuleFromTenant', _schemas.zUnassignMappingRuleFromTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignMappingRuleFromTenant(opts);
        let data = this._evaluateResponse(_raw, 'unassignMappingRuleFromTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignMappingRuleFromTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignMappingRuleFromTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignMappingRuleFromTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignMappingRuleFromTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a role from a client
   *
   * Unassigns the specified role from the client. The client will no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a client
   * async function unassignRoleFromClientExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromClient({
   *     roleId: 'process-admin',
   *     clientId: 'my-service-account',
   *   });
   * }
   * @operationId unassignRoleFromClient
   * @tags Role
   */
  unassignRoleFromClient(input: unassignRoleFromClientInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromClient>>;
  unassignRoleFromClient(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, clientId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignRoleFromClient', _schemas.zUnassignRoleFromClientData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignRoleFromClient(opts);
        let data = this._evaluateResponse(_raw, 'unassignRoleFromClient', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignRoleFromClientResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignRoleFromClientResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignRoleFromClient', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromClient', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a role from a group
   *
   * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a group
   * async function unassignRoleFromGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromGroup({
   *     roleId: 'process-admin',
   *     groupId: 'engineering-team',
   *   });
   * }
   * @operationId unassignRoleFromGroup
   * @tags Role
   */
  unassignRoleFromGroup(input: unassignRoleFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromGroup>>;
  unassignRoleFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, groupId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignRoleFromGroup', _schemas.zUnassignRoleFromGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignRoleFromGroup(opts);
        let data = this._evaluateResponse(_raw, 'unassignRoleFromGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignRoleFromGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignRoleFromGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignRoleFromGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a role from a mapping rule
   *
   * Unassigns a role from a mapping rule.
    *
   * @example Unassign a role from a mapping rule
   * async function unassignRoleFromMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromMappingRule({
   *     roleId: 'process-admin',
   *     mappingRuleId: 'rule-123',
   *   });
   * }
   * @operationId unassignRoleFromMappingRule
   * @tags Role
   */
  unassignRoleFromMappingRule(input: unassignRoleFromMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromMappingRule>>;
  unassignRoleFromMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignRoleFromMappingRule', _schemas.zUnassignRoleFromMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignRoleFromMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'unassignRoleFromMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignRoleFromMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignRoleFromMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignRoleFromMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromMappingRule', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a role from a tenant
   *
   * Unassigns a role from a specified tenant.
   * Users, Clients or Groups, that have the role assigned, will no longer have access to the
   * tenant's data - unless they are assigned directly to the tenant.
   *
    *
   * @example Unassign a role from a tenant
   * async function unassignRoleFromTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromTenant({
   *     tenantId,
   *     roleId: 'process-admin',
   *   });
   * }
   * @operationId unassignRoleFromTenant
   * @tags Tenant
   */
  unassignRoleFromTenant(input: unassignRoleFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromTenant>>;
  unassignRoleFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, roleId };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignRoleFromTenant', _schemas.zUnassignRoleFromTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignRoleFromTenant(opts);
        let data = this._evaluateResponse(_raw, 'unassignRoleFromTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignRoleFromTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignRoleFromTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignRoleFromTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a role from a user
   *
   * Unassigns a role from a user. The user will no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a user
   * async function unassignRoleFromUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromUser({
   *     roleId: 'process-admin',
   *     username,
   *   });
   * }
   * @operationId unassignRoleFromUser
   * @tags Role
   */
  unassignRoleFromUser(input: unassignRoleFromUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromUser>>;
  unassignRoleFromUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignRoleFromUser', _schemas.zUnassignRoleFromUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignRoleFromUser(opts);
        let data = this._evaluateResponse(_raw, 'unassignRoleFromUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignRoleFromUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignRoleFromUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignRoleFromUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a user from a group
   *
   * Unassigns a user from a group.
   * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @example Unassign a user from a group
   * async function unassignUserFromGroupExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserFromGroup({
   *     groupId: 'engineering-team',
   *     username,
   *   });
   * }
   * @operationId unassignUserFromGroup
   * @tags Group
   */
  unassignUserFromGroup(input: unassignUserFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromGroup>>;
  unassignUserFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignUserFromGroup', _schemas.zUnassignUserFromGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignUserFromGroup(opts);
        let data = this._evaluateResponse(_raw, 'unassignUserFromGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignUserFromGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignUserFromGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignUserFromGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserFromGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign a user from a tenant
   *
   * Unassigns the user from the specified tenant.
   * The user can no longer access tenant data.
   *
    *
   * @example Unassign a user from a tenant
   * async function unassignUserFromTenantExample(tenantId: TenantId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserFromTenant({
   *     tenantId,
   *     username,
   *   });
   * }
   * @operationId unassignUserFromTenant
   * @tags Tenant
   */
  unassignUserFromTenant(input: unassignUserFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromTenant>>;
  unassignUserFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, username };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignUserFromTenant', _schemas.zUnassignUserFromTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignUserFromTenant(opts);
        let data = this._evaluateResponse(_raw, 'unassignUserFromTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignUserFromTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignUserFromTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignUserFromTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserFromTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Unassign user task
   *
   * Removes the assignee of a task with the given key. Unassignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Unassign a user task
   * async function unassignUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserTask({ userTaskKey });
   * }
   * @operationId unassignUserTask
   * @tags User task
   */
  unassignUserTask(input: unassignUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserTask>>;
  unassignUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('unassignUserTask', _schemas.zUnassignUserTaskData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        try {
        const _raw = await Sdk.unassignUserTask(opts);
        let data = this._evaluateResponse(_raw, 'unassignUserTask', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUnassignUserTaskResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUnassignUserTaskResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('unassignUserTask', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserTask', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update authorization
   *
   * Update the authorization with the given key.
    *
   * @example Update an authorization
   * async function updateAuthorizationExample(authorizationKey: AuthorizationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateAuthorization({
   *     authorizationKey,
   *     ownerId: 'user-123',
   *     ownerType: 'USER',
   *     resourceId: 'order-process',
   *     resourceType: 'PROCESS_DEFINITION',
   *     permissionTypes: [
   *       'CREATE_PROCESS_INSTANCE',
   *       'READ_PROCESS_INSTANCE',
   *       'DELETE_PROCESS_INSTANCE',
   *     ],
   *   });
   * }
   * @operationId updateAuthorization
   * @tags Authorization
   */
  updateAuthorization(input: updateAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateAuthorization>>;
  updateAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { authorizationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateAuthorization', _schemas.zUpdateAuthorizationData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateAuthorization(opts);
        let data = this._evaluateResponse(_raw, 'updateAuthorization', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateAuthorizationResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateAuthorizationResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateAuthorization', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateAuthorization', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update a global-scoped cluster variable
   *
   * Updates the value of an existing global cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @example Update a global cluster variable
   * async function updateGlobalClusterVariableExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGlobalClusterVariable({
   *     name: 'feature-flags',
   *     value: { darkMode: false },
   *   });
   * }
   * @operationId updateGlobalClusterVariable
   * @tags Cluster Variable
   */
  updateGlobalClusterVariable(input: updateGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGlobalClusterVariable>>;
  updateGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { name, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateGlobalClusterVariable', _schemas.zUpdateGlobalClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateGlobalClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'updateGlobalClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateGlobalClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateGlobalClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateGlobalClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateGlobalClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update global user task listener
   *
   * Updates a global user task listener.
    *
   * @example Update a global task listener
   * async function updateGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGlobalTaskListener({
   *     id,
   *     eventTypes: ['completing'],
   *     type: 'updated-audit-listener',
   *   });
   * }
   * @operationId updateGlobalTaskListener
   * @tags Global listener
   */
  updateGlobalTaskListener(input: updateGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGlobalTaskListener>>;
  updateGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { id, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { id };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateGlobalTaskListener', _schemas.zUpdateGlobalTaskListenerData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateGlobalTaskListener(opts);
        let data = this._evaluateResponse(_raw, 'updateGlobalTaskListener', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateGlobalTaskListenerResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateGlobalTaskListenerResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateGlobalTaskListener', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateGlobalTaskListener', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update group
   *
   * Update a group with the given ID.
    *
   * @example Update a group
   * async function updateGroupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGroup({
   *     groupId: 'engineering-team',
   *     name: 'Engineering Team',
   *   });
   * }
   * @operationId updateGroup
   * @tags Group
   */
  updateGroup(input: updateGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGroup>>;
  updateGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateGroup', _schemas.zUpdateGroupData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateGroup(opts);
        let data = this._evaluateResponse(_raw, 'updateGroup', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateGroupResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateGroupResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateGroup', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateGroup', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update job
   *
   * Update a job with the given key.
    *
   * @example Update a job
   * async function updateJobExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateJob({
   *     jobKey,
   *     changeset: { retries: 5, timeout: 60000 },
   *   });
   * }
   * @operationId updateJob
   * @tags Job
   */
  updateJob(input: updateJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateJob>>;
  updateJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateJob', _schemas.zUpdateJobData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateJob(opts);
        let data = this._evaluateResponse(_raw, 'updateJob', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateJobResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateJobResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateJob', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateJob', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update mapping rule
   *
   * Update a mapping rule.
   *
    *
   * @example Update a mapping rule
   * async function updateMappingRuleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateMappingRule({
   *     mappingRuleId: 'ldap-group-mapping',
   *     name: 'LDAP Group Mapping',
   *     claimName: 'groups',
   *     claimValue: 'engineering-team',
   *   });
   * }
   * @operationId updateMappingRule
   * @tags Mapping rule
   */
  updateMappingRule(input: updateMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateMappingRule>>;
  updateMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { mappingRuleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateMappingRule', _schemas.zUpdateMappingRuleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateMappingRule(opts);
        let data = this._evaluateResponse(_raw, 'updateMappingRule', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateMappingRuleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateMappingRuleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateMappingRule', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateMappingRule', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update role
   *
   * Update a role with the given ID.
    *
   * @example Update a role
   * async function updateRoleExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateRole({
   *     roleId: 'process-admin',
   *     name: 'Process Administrator',
   *   });
   * }
   * @operationId updateRole
   * @tags Role
   */
  updateRole(input: updateRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateRole>>;
  updateRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateRole', _schemas.zUpdateRoleData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateRole(opts);
        let data = this._evaluateResponse(_raw, 'updateRole', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateRoleResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateRoleResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateRole', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateRole', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update tenant
   *
   * Updates an existing tenant.
    *
   * @example Update a tenant
   * async function updateTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateTenant({
   *     tenantId,
   *     name: 'Customer Service Team',
   *   });
   * }
   * @operationId updateTenant
   * @tags Tenant
   */
  updateTenant(input: updateTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateTenant>>;
  updateTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateTenant', _schemas.zUpdateTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateTenant(opts);
        let data = this._evaluateResponse(_raw, 'updateTenant', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateTenant', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update a tenant-scoped cluster variable
   *
   * Updates the value of an existing tenant-scoped cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @example Update a tenant cluster variable
   * async function updateTenantClusterVariableExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateTenantClusterVariable({
   *     tenantId,
   *     name: 'config',
   *     value: { region: 'eu-west-1' },
   *   });
   * }
   * @operationId updateTenantClusterVariable
   * @tags Cluster Variable
   */
  updateTenantClusterVariable(input: updateTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateTenantClusterVariable>>;
  updateTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, name, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateTenantClusterVariable', _schemas.zUpdateTenantClusterVariableData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateTenantClusterVariable(opts);
        let data = this._evaluateResponse(_raw, 'updateTenantClusterVariable', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateTenantClusterVariableResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateTenantClusterVariableResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateTenantClusterVariable', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateTenantClusterVariable', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update user
   *
   * Updates a user.
    *
   * @example Update a user
   * async function updateUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateUser({
   *     username,
   *     name: 'Alice Jones',
   *     email: 'alice.jones@example.com',
   *   });
   * }
   * @operationId updateUser
   * @tags User
   */
  updateUser(input: updateUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { username, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateUser', _schemas.zUpdateUserData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateUser(opts);
        let data = this._evaluateResponse(_raw, 'updateUser', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateUserResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateUserResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateUser', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateUser', exempt: false, retryOverride: options?.retry });
    });
  }

  /**
   * Update user task
   *
   * Update a user task with the given key. Updates wait for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Update a user task
   * async function updateUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateUserTask({
   *     userTaskKey,
   *     changeset: {
   *       candidateUsers: ['alice', 'bob'],
   *       dueDate: '2025-12-31T23:59:59Z',
   *       priority: 80,
   *     },
   *   });
   * }
   * @operationId updateUserTask
   * @tags User task
   */
  updateUserTask(input: updateUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateUserTask>>;
  updateUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const _schemas = await this._loadSchemas();
        const maybe = await this._validation.gateRequest('updateUserTask', _schemas.zUpdateUserTaskData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal, throwOnError: false };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        try {
        const _raw = await Sdk.updateUserTask(opts);
        let data = this._evaluateResponse(_raw, 'updateUserTask', (resp: any) => {
          const st = resp.status ?? resp.response?.status;
          if (!st) return undefined;
          const candidate = st === 429 || st === 503 || st === 500;
          if (!candidate) return undefined;
          let prob: any = undefined;
          if (resp.error && typeof resp.error === 'object') prob = resp.error;
          const err: any = new Error((prob && (prob.title || prob.detail)) ? (prob.title || prob.detail) : ('HTTP ' + st));
          err.status = st; err.name = 'HttpSdkError';
          if (prob) { for (const k of ['type','title','detail','instance']) if (prob[k] !== undefined) err[k] = prob[k]; }
          const isBp = (st === 429) || (st === 503 && err.title === 'RESOURCE_EXHAUSTED') || (st === 500 && (typeof err.detail === 'string' && /RESOURCE_EXHAUSTED/.test(err.detail)));
          if (!isBp) err.nonRetryable = true;
          return err;
        });
        const _respSchemaName = 'zUpdateUserTaskResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schemas = await this._loadSchemas();
          const _schema = _schemas.zUpdateUserTaskResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('updateUserTask', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
        } catch(e) {
          // Defer normalization to outer executeWithHttpRetry boundary
          throw e;
        }
      };
      return this._invokeWithRetry(() => call(), { opId: 'updateUserTask', exempt: false, retryOverride: options?.retry });
    });
  }

// === AUTO-GENERATED CAMUNDA METHODS END ===

  /**
   * Create a job worker that activates and processes jobs of the given type.
   *
   * Worker configuration fields inherit global defaults resolved via the
   * unified configuration (environment variables or equivalent `CAMUNDA_WORKER_*`
   * keys provided via `CamundaOptions.config`) when not explicitly set on the
   * config object.
   * @param cfg Worker configuration
   */
  createJobWorker<
    In extends import('zod').ZodTypeAny = any,
    Out extends import('zod').ZodTypeAny = any,
    Headers extends import('zod').ZodTypeAny = any,
  >(cfg: JobWorkerConfig<In, Out, Headers>): JobWorker {
    const defaults = this._config.workerDefaults;
    const merged = defaults
      ? {
          ...cfg,
          jobTimeoutMs: cfg.jobTimeoutMs ?? defaults.jobTimeoutMs,
          maxParallelJobs: cfg.maxParallelJobs ?? defaults.maxParallelJobs,
          pollTimeoutMs: cfg.pollTimeoutMs ?? defaults.pollTimeoutMs,
          workerName: cfg.workerName ?? defaults.workerName,
          startupJitterMaxSeconds: cfg.startupJitterMaxSeconds ?? defaults.startupJitterMaxSeconds,
        }
      : cfg;
    const worker = new JobWorker(this as any, merged as JobWorkerConfig);
    this._workers.push(worker);
    return worker;
  }

  /**
   * Create a threaded job worker that runs handler logic in a pool of worker threads.
   * The handler must be a separate module file that exports a default function with
   * signature `(job, client) => Promise<JobActionReceipt>`.
   *
   * This keeps the main event loop free for polling and I/O, dramatically improving
   * throughput for CPU-bound job handlers.
   *
   * Worker configuration fields inherit global defaults resolved via the
   * unified configuration (environment variables or equivalent `CAMUNDA_WORKER_*`
   * keys provided via `CamundaOptions.config`) when not explicitly set on the
   * config object.
   *
   * @param cfg Threaded worker configuration
   */
  createThreadedJobWorker<
    In extends import('zod').ZodTypeAny = any,
    Out extends import('zod').ZodTypeAny = any,
    Headers extends import('zod').ZodTypeAny = any,
  >(cfg: ThreadedJobWorkerConfig<In, Out, Headers>): ThreadedJobWorker {
    const defaults = this._config.workerDefaults;
    const merged = defaults
      ? {
          ...cfg,
          jobTimeoutMs: cfg.jobTimeoutMs ?? defaults.jobTimeoutMs,
          maxParallelJobs: cfg.maxParallelJobs ?? defaults.maxParallelJobs,
          pollTimeoutMs: cfg.pollTimeoutMs ?? defaults.pollTimeoutMs,
          workerName: cfg.workerName ?? defaults.workerName,
          startupJitterMaxSeconds: cfg.startupJitterMaxSeconds ?? defaults.startupJitterMaxSeconds,
        }
      : cfg;
    const pool = this._getOrCreateThreadPool(cfg.threadPoolSize);
    const worker = new ThreadedJobWorker(this as any, pool, merged as ThreadedJobWorkerConfig);
    this._workers.push(worker);
    return worker;
  }

  /**
   * Node-only convenience: deploy resources from local filesystem paths.
   * @param resourceFilenames Absolute or relative file paths to BPMN/DMN/form/resource files.
   * @param options Optional: tenantId.
   * @returns ExtendedDeploymentResult
   */
  deployResourcesFromFiles(
    resourceFilenames: string[],
    options?: { tenantId?: string }
  ): CancelablePromise<ExtendedDeploymentResult> {
    return toCancelable(async (_signal) => {
      if (!Array.isArray(resourceFilenames) || resourceFilenames.length === 0) {
        throw new Error('resourceFilenames must be a non-empty string[]');
      }
      // Basic environment guard (avoid accidental browser usage)
      if (typeof process === 'undefined' || !process.versions?.node) {
        throw new Error('deployResourcesFromFiles is only available in Node.js environments');
      }
      // Dynamic imports so that bundlers can tree-shake for browser builds
      const [{ readFile }, pathMod] = await Promise.all([
        import('node:fs/promises'),
        import('node:path'),
      ]);
      // Best-effort MIME inference
      const mimeFor = (filename: string): string => {
        const ext = filename.toLowerCase().split('.').pop() || '';
        switch (ext) {
          case 'bpmn':
          case 'dmn':
          case 'xml':
            return 'application/xml';
          case 'json':
          case 'form':
            return 'application/json';
          default:
            return 'application/octet-stream';
        }
      };
      if (typeof File !== 'function') {
        throw new Error(
          'Global File constructor not available. Requires Node 18+ (fetch experimental) or Node 20+'
        );
      }
      const files: File[] = [];
      for (const p of resourceFilenames) {
        if (typeof p !== 'string' || !p) throw new Error('Invalid resource filename encountered');
        const data = await readFile(p);
        const name = pathMod.basename(p);
        files.push(new File([data as any], name, { type: mimeFor(name) }));
      }
      const payload: createDeploymentInput = {
        resources: files,
        ...(options?.tenantId ? { tenantId: options.tenantId } : {}),
      } as any;
      return this.createDeployment(payload);
    });
  }
}
