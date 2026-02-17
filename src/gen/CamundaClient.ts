// @generated from CamundaClient.template.ts - DO NOT EDIT DIRECTLY
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable import/order */
import { createClient } from '../gen/client/client.gen';
import * as Sdk from '../gen/sdk.gen';
import * as Schemas from '../gen/zod.gen';
import { createAuthFacade } from '../runtime/auth';
import type { CamundaConfig } from '../runtime/unifiedConfiguration';
import type { EnvOverrides } from '../runtime/configSchema';
import { hydrateConfig } from '../runtime/unifiedConfiguration';
import { ConsistencyOptions, eventualPoll } from '../runtime/eventual';
import { installAuthInterceptor } from '../runtime/installAuthInterceptor';
import { createLogger, Logger, LogLevel, LogTransport } from '../runtime/logger';
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
import { executeWithHttpRetry, defaultHttpClassifier } from '../runtime/retry';
import { normalizeError } from '../runtime/errors';
import { BackpressureManager } from '../runtime/backpressure';
import { JobWorker, type JobWorkerConfig } from '../runtime/jobWorker';
import { enrichActivatedJob, EnrichedActivatedJob } from '../runtime/jobActions';
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
// Operations: 175
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
/** Management of eventual consistency **/
export type cancelBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelBatchOperation>> 
};
type cancelProcessInstanceOptions = Parameters<typeof Sdk.cancelProcessInstance>[0];
type cancelProcessInstanceBody = (NonNullable<cancelProcessInstanceOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancePathParam_processInstanceKey = (NonNullable<cancelProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type cancelProcessInstanceInput = cancelProcessInstanceBody & { processInstanceKey: cancelProcessInstancePathParam_processInstanceKey };
type cancelProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.cancelProcessInstancesBatchOperation>[0];
type cancelProcessInstancesBatchOperationBody = (NonNullable<cancelProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type cancelProcessInstancesBatchOperationInput = cancelProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
export type cancelProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type createAdminUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createAdminUser>> 
};
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
/** Management of eventual consistency **/
export type createGlobalTaskListenerConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createGlobalTaskListener>> 
};
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
/** Management of eventual consistency **/
export type createUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createUser>> 
};
type deleteAuthorizationOptions = Parameters<typeof Sdk.deleteAuthorization>[0];
type deleteAuthorizationPathParam_authorizationKey = (NonNullable<deleteAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
export type deleteAuthorizationInput = { authorizationKey: deleteAuthorizationPathParam_authorizationKey };
type deleteDecisionInstanceOptions = Parameters<typeof Sdk.deleteDecisionInstance>[0];
type deleteDecisionInstanceBody = (NonNullable<deleteDecisionInstanceOptions> extends { body?: infer B } ? B : never);
type deleteDecisionInstancePathParam_decisionInstanceKey = (NonNullable<deleteDecisionInstanceOptions> extends { path: { decisionInstanceKey: infer P } } ? P : any);
export type deleteDecisionInstanceInput = deleteDecisionInstanceBody & { decisionInstanceKey: deleteDecisionInstancePathParam_decisionInstanceKey };
/** Management of eventual consistency **/
export type deleteDecisionInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteDecisionInstance>> 
};
type deleteDecisionInstancesBatchOperationOptions = Parameters<typeof Sdk.deleteDecisionInstancesBatchOperation>[0];
type deleteDecisionInstancesBatchOperationBody = (NonNullable<deleteDecisionInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type deleteDecisionInstancesBatchOperationInput = deleteDecisionInstancesBatchOperationBody;
/** Management of eventual consistency **/
export type deleteDecisionInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteDecisionInstancesBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type deleteGlobalTaskListenerConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteGlobalTaskListener>> 
};
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
/** Management of eventual consistency **/
export type deleteProcessInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteProcessInstance>> 
};
type deleteProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.deleteProcessInstancesBatchOperation>[0];
type deleteProcessInstancesBatchOperationBody = (NonNullable<deleteProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type deleteProcessInstancesBatchOperationInput = deleteProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
export type deleteProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteProcessInstancesBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type deleteUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteUser>> 
};
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
/** Management of eventual consistency **/
export type migrateProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>> 
};
type modifyProcessInstanceOptions = Parameters<typeof Sdk.modifyProcessInstance>[0];
type modifyProcessInstanceBody = (NonNullable<modifyProcessInstanceOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancePathParam_processInstanceKey = (NonNullable<modifyProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type modifyProcessInstanceInput = modifyProcessInstanceBody & { processInstanceKey: modifyProcessInstancePathParam_processInstanceKey };
type modifyProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.modifyProcessInstancesBatchOperation>[0];
type modifyProcessInstancesBatchOperationBody = (NonNullable<modifyProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
export type modifyProcessInstancesBatchOperationInput = modifyProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
export type modifyProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type resolveIncidentsBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>> 
};
type resolveProcessInstanceIncidentsOptions = Parameters<typeof Sdk.resolveProcessInstanceIncidents>[0];
type resolveProcessInstanceIncidentsPathParam_processInstanceKey = (NonNullable<resolveProcessInstanceIncidentsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
export type resolveProcessInstanceIncidentsInput = { processInstanceKey: resolveProcessInstanceIncidentsPathParam_processInstanceKey };
/** Management of eventual consistency **/
export type resolveProcessInstanceIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resolveProcessInstanceIncidents>> 
};
type resumeBatchOperationOptions = Parameters<typeof Sdk.resumeBatchOperation>[0];
type resumeBatchOperationBody = (NonNullable<resumeBatchOperationOptions> extends { body?: infer B } ? B : never);
type resumeBatchOperationPathParam_batchOperationKey = (NonNullable<resumeBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
export type resumeBatchOperationInput = resumeBatchOperationBody & { batchOperationKey: resumeBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
export type resumeBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resumeBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type suspendBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.suspendBatchOperation>> 
};
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
/** Management of eventual consistency **/
export type updateGlobalTaskListenerConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.updateGlobalTaskListener>> 
};
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
/** Management of eventual consistency **/
export type updateUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.updateUser>> 
};
type updateUserTaskOptions = Parameters<typeof Sdk.updateUserTask>[0];
type updateUserTaskBody = (NonNullable<updateUserTaskOptions> extends { body?: infer B } ? B : never);
type updateUserTaskPathParam_userTaskKey = (NonNullable<updateUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
export type updateUserTaskInput = updateUserTaskBody & { userTaskKey: updateUserTaskPathParam_userTaskKey };
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
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();
  private _bp: BackpressureManager;
  /** Registered job workers created via createJobWorker (lifecycle managed by user). */
  private _workers: any[] = [];
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
    if (next.fetch) this._fetch = next.fetch;
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
  private _isVoidResponse(name: string): boolean {
    try {
      return (Schemas as any)[name]?.type === 'void';
    } catch {
      return false;
    }
  }

  /** Internal invocation helper to apply global backpressure gating + retry + normalization */
  public async _invokeWithRetry<T>(
    op: () => Promise<T>,
    opts: {
      opId: string;
      exempt?: boolean;
      classify?: (e: any) => { retryable: boolean; reason: string };
    }
  ): Promise<T> {
    const { opId, exempt, classify } = opts;
    const signal: AbortSignal | undefined = undefined; // placeholder if we later pass through
    if (!exempt) {
      await this._bp.acquire(signal);
    }
    try {
      const result = await executeWithHttpRetry(
        async () => op(),
        this._config.httpRetry,
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
  /** Stop all registered job workers (best-effort). */
  stopAllWorkers() {
    for (const w of this._workers) {
      try {
        if (typeof w.stop === 'function') w.stop();
      } catch (e) {
        this._log.warn('worker.stop.error', e);
      }
    }
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
   * @operationId activateAdHocSubProcessActivities
   * @tags Ad-hoc sub-process
   */
  activateAdHocSubProcessActivities(input: activateAdHocSubProcessActivitiesInput): CancelablePromise<_DataOf<typeof Sdk.activateAdHocSubProcessActivities>>;
  activateAdHocSubProcessActivities(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { adHocSubProcessInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { adHocSubProcessInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('activateAdHocSubProcessActivities', Schemas.zActivateAdHocSubProcessActivitiesData, envelope);
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
          const _schema = Schemas.zActivateAdHocSubProcessActivitiesResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'activateAdHocSubProcessActivities', exempt: false });
    });
  }

  /**
   * Activate jobs
   *
   * Iterate through all known partitions and activate jobs up to the requested maximum.
   *
    *
   * @example Activate and process jobs
   * {@includeCode ../../examples/job.ts#ActivateJobs}
   * @operationId activateJobs
   * @tags Job
   */
  activateJobs(input: activateJobsInput): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;
  activateJobs(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('activateJobs', Schemas.zActivateJobsData, envelope);
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
          const _schema = Schemas.zActivateJobsResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'activateJobs', exempt: false });
    });
  }

  /**
   * Assign a client to a group
   *
   * Assigns a client to a group, making it a member of the group.
   * Members of the group inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @operationId assignClientToGroup
   * @tags Group
   */
  assignClientToGroup(input: assignClientToGroupInput): CancelablePromise<_DataOf<typeof Sdk.assignClientToGroup>>;
  assignClientToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignClientToGroup', Schemas.zAssignClientToGroupData, envelope);
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
          const _schema = Schemas.zAssignClientToGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignClientToGroup', exempt: false });
    });
  }

  /**
   * Assign a client to a tenant
   *
   * Assign the client to the specified tenant.
   * The client can then access tenant data and perform authorized actions.
   *
    *
   * @operationId assignClientToTenant
   * @tags Tenant
   */
  assignClientToTenant(input: assignClientToTenantInput): CancelablePromise<_DataOf<typeof Sdk.assignClientToTenant>>;
  assignClientToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignClientToTenant', Schemas.zAssignClientToTenantData, envelope);
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
          const _schema = Schemas.zAssignClientToTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignClientToTenant', exempt: false });
    });
  }

  /**
   * Assign a group to a tenant
   *
   * Assigns a group to a specified tenant.
   * Group members (users, clients) can then access tenant data and perform authorized actions.
   *
    *
   * @operationId assignGroupToTenant
   * @tags Tenant
   */
  assignGroupToTenant(input: assignGroupToTenantInput): CancelablePromise<_DataOf<typeof Sdk.assignGroupToTenant>>;
  assignGroupToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignGroupToTenant', Schemas.zAssignGroupToTenantData, envelope);
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
          const _schema = Schemas.zAssignGroupToTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignGroupToTenant', exempt: false });
    });
  }

  /**
   * Assign a mapping rule to a group
   *
   * Assigns a mapping rule to a group.
    *
   * @operationId assignMappingRuleToGroup
   * @tags Group
   */
  assignMappingRuleToGroup(input: assignMappingRuleToGroupInput): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToGroup>>;
  assignMappingRuleToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignMappingRuleToGroup', Schemas.zAssignMappingRuleToGroupData, envelope);
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
          const _schema = Schemas.zAssignMappingRuleToGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignMappingRuleToGroup', exempt: false });
    });
  }

  /**
   * Assign a mapping rule to a tenant
   *
   * Assign a single mapping rule to a specified tenant.
    *
   * @operationId assignMappingRuleToTenant
   * @tags Tenant
   */
  assignMappingRuleToTenant(input: assignMappingRuleToTenantInput): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToTenant>>;
  assignMappingRuleToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignMappingRuleToTenant', Schemas.zAssignMappingRuleToTenantData, envelope);
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
          const _schema = Schemas.zAssignMappingRuleToTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignMappingRuleToTenant', exempt: false });
    });
  }

  /**
   * Assign a role to a client
   *
   * Assigns the specified role to the client. The client will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToClient
   * @tags Role
   */
  assignRoleToClient(input: assignRoleToClientInput): CancelablePromise<_DataOf<typeof Sdk.assignRoleToClient>>;
  assignRoleToClient(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignRoleToClient', Schemas.zAssignRoleToClientData, envelope);
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
          const _schema = Schemas.zAssignRoleToClientResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToClient', exempt: false });
    });
  }

  /**
   * Assign a role to a group
   *
   * Assigns the specified role to the group. Every member of the group (user or client) will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToGroup
   * @tags Role
   */
  assignRoleToGroup(input: assignRoleToGroupInput): CancelablePromise<_DataOf<typeof Sdk.assignRoleToGroup>>;
  assignRoleToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignRoleToGroup', Schemas.zAssignRoleToGroupData, envelope);
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
          const _schema = Schemas.zAssignRoleToGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToGroup', exempt: false });
    });
  }

  /**
   * Assign a role to a mapping rule
   *
   * Assigns a role to a mapping rule.
    *
   * @operationId assignRoleToMappingRule
   * @tags Role
   */
  assignRoleToMappingRule(input: assignRoleToMappingRuleInput): CancelablePromise<_DataOf<typeof Sdk.assignRoleToMappingRule>>;
  assignRoleToMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignRoleToMappingRule', Schemas.zAssignRoleToMappingRuleData, envelope);
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
          const _schema = Schemas.zAssignRoleToMappingRuleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToMappingRule', exempt: false });
    });
  }

  /**
   * Assign a role to a tenant
   *
   * Assigns a role to a specified tenant.
   * Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
   *
    *
   * @operationId assignRoleToTenant
   * @tags Tenant
   */
  assignRoleToTenant(input: assignRoleToTenantInput): CancelablePromise<_DataOf<typeof Sdk.assignRoleToTenant>>;
  assignRoleToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, roleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignRoleToTenant', Schemas.zAssignRoleToTenantData, envelope);
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
          const _schema = Schemas.zAssignRoleToTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToTenant', exempt: false });
    });
  }

  /**
   * Assign a role to a user
   *
   * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToUser
   * @tags Role
   */
  assignRoleToUser(input: assignRoleToUserInput): CancelablePromise<_DataOf<typeof Sdk.assignRoleToUser>>;
  assignRoleToUser(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignRoleToUser', Schemas.zAssignRoleToUserData, envelope);
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
          const _schema = Schemas.zAssignRoleToUserResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignRoleToUser', exempt: false });
    });
  }

  /**
   * Assign user task
   *
   * Assigns a user task with the given key to the given assignee.
    *
   * @example Assign a user task
   * {@includeCode ../../examples/user-task.ts#AssignUserTask}
   * @operationId assignUserTask
   * @tags User task
   */
  assignUserTask(input: assignUserTaskInput): CancelablePromise<_DataOf<typeof Sdk.assignUserTask>>;
  assignUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignUserTask', Schemas.zAssignUserTaskData, envelope);
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
          const _schema = Schemas.zAssignUserTaskResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignUserTask', exempt: false });
    });
  }

  /**
   * Assign a user to a group
   *
   * Assigns a user to a group, making the user a member of the group.
   * Group members inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @operationId assignUserToGroup
   * @tags Group
   */
  assignUserToGroup(input: assignUserToGroupInput): CancelablePromise<_DataOf<typeof Sdk.assignUserToGroup>>;
  assignUserToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignUserToGroup', Schemas.zAssignUserToGroupData, envelope);
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
          const _schema = Schemas.zAssignUserToGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignUserToGroup', exempt: false });
    });
  }

  /**
   * Assign a user to a tenant
   *
   * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
    *
   * @operationId assignUserToTenant
   * @tags Tenant
   */
  assignUserToTenant(input: assignUserToTenantInput): CancelablePromise<_DataOf<typeof Sdk.assignUserToTenant>>;
  assignUserToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('assignUserToTenant', Schemas.zAssignUserToTenantData, envelope);
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
          const _schema = Schemas.zAssignUserToTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'assignUserToTenant', exempt: false });
    });
  }

  /**
   * Broadcast signal
   *
   * Broadcasts a signal.
    *
   * @example Broadcast a signal
   * {@includeCode ../../examples/message-signal.ts#BroadcastSignal}
   * @operationId broadcastSignal
   * @tags Signal
   */
  broadcastSignal(input: broadcastSignalInput): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'broadcastSignal', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('broadcastSignal', Schemas.zBroadcastSignalData, envelope);
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
          const _schema = Schemas.zBroadcastSignalResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'broadcastSignal', exempt: false });
    });
  }

  /**
   * Cancel Batch operation
   *
   * Cancels a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId cancelBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  cancelBatchOperation(input: cancelBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: cancelBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: cancelBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('cancelBatchOperation', Schemas.zCancelBatchOperationData, envelope);
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
          const _schema = Schemas.zCancelBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('cancelBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Cancel process instance
   *
   * Cancels a running process instance. As a cancellation includes more than just the removal of the process instance resource, the cancellation resource must be posted.
    *
   * @example Cancel a process instance
   * {@includeCode ../../examples/process-instance.ts#CancelProcessInstance}
   * @operationId cancelProcessInstance
   * @tags Process instance
   */
  cancelProcessInstance(input: cancelProcessInstanceInput): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstance>>;
  cancelProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('cancelProcessInstance', Schemas.zCancelProcessInstanceData, envelope);
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
          const _schema = Schemas.zCancelProcessInstanceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'cancelProcessInstance', exempt: false });
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
   * @operationId cancelProcessInstancesBatchOperation
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  cancelProcessInstancesBatchOperation(input: cancelProcessInstancesBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: cancelProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: cancelProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('cancelProcessInstancesBatchOperation', Schemas.zCancelProcessInstancesBatchOperationData, envelope);
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
          const _schema = Schemas.zCancelProcessInstancesBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('cancelProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Complete job
   *
   * Complete a job with the given payload, which allows completing the associated service task.
   *
    *
   * @example Complete a job
   * {@includeCode ../../examples/job.ts#CompleteJob}
   * @operationId completeJob
   * @tags Job
   */
  completeJob(input: completeJobInput): CancelablePromise<_DataOf<typeof Sdk.completeJob>>;
  completeJob(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('completeJob', Schemas.zCompleteJobData, envelope);
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
          const _schema = Schemas.zCompleteJobResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'completeJob', exempt: true });
    });
  }

  /**
   * Complete user task
   *
   * Completes a user task with the given key.
    *
   * @example Complete a user task
   * {@includeCode ../../examples/user-task.ts#CompleteUserTask}
   * @operationId completeUserTask
   * @tags User task
   */
  completeUserTask(input: completeUserTaskInput): CancelablePromise<_DataOf<typeof Sdk.completeUserTask>>;
  completeUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('completeUserTask', Schemas.zCompleteUserTaskData, envelope);
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
          const _schema = Schemas.zCompleteUserTaskResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'completeUserTask', exempt: true });
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
   * {@includeCode ../../examples/message-signal.ts#CorrelateMessage}
   * @operationId correlateMessage
   * @tags Message
   */
  correlateMessage(input: correlateMessageInput): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'correlateMessage', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('correlateMessage', Schemas.zCorrelateMessageData, envelope);
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
          const _schema = Schemas.zCorrelateMessageResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'correlateMessage', exempt: false });
    });
  }

  /**
   * Create admin user
   *
   * Creates a new user and assigns the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
    *
   * @operationId createAdminUser
   * @tags Setup
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  createAdminUser(input: createAdminUserInput, /** Management of eventual consistency **/ consistencyManagement: createAdminUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: createAdminUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createAdminUser', Schemas.zCreateAdminUserData, envelope);
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
          const _schema = Schemas.zCreateAdminUserResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('createAdminUser', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Create authorization
   *
   * Create the authorization.
    *
   * @operationId createAuthorization
   * @tags Authorization
   */
  createAuthorization(input: createAuthorizationInput): CancelablePromise<_DataOf<typeof Sdk.createAuthorization>>;
  createAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createAuthorization', Schemas.zCreateAuthorizationData, envelope);
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
          const _schema = Schemas.zCreateAuthorizationResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createAuthorization', exempt: false });
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
   * {@includeCode ../../examples/deployment.ts#CreateDeployment}
   * @operationId createDeployment
   * @tags Resource
   * @returns Enriched deployment result with typed arrays (processes, decisions, decisionRequirements, forms, resources).
   */
  createDeployment(input: createDeploymentInput): CancelablePromise<ExtendedDeploymentResult>;
  createDeployment(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'createDeployment', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createDeployment', Schemas.zCreateDeploymentData, envelope);
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
          const _schema = Schemas.zCreateDeploymentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createDeployment', exempt: false });
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
   * @operationId createDocument
   * @tags Document
   */
  createDocument(input: createDocumentInput): CancelablePromise<_DataOf<typeof Sdk.createDocument>>;
  createDocument(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { storeId, documentId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { storeId, documentId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createDocument', Schemas.zCreateDocumentData, envelope);
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
          const _schema = Schemas.zCreateDocumentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createDocument', exempt: false });
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
   * @operationId createDocumentLink
   * @tags Document
   */
  createDocumentLink(input: createDocumentLinkInput): CancelablePromise<_DataOf<typeof Sdk.createDocumentLink>>;
  createDocumentLink(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId, contentHash, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId, contentHash };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createDocumentLink', Schemas.zCreateDocumentLinkData, envelope);
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
          const _schema = Schemas.zCreateDocumentLinkResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createDocumentLink', exempt: false });
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
   * @operationId createDocuments
   * @tags Document
   */
  createDocuments(input: createDocumentsInput): CancelablePromise<_DataOf<typeof Sdk.createDocuments>>;
  createDocuments(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { storeId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { storeId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createDocuments', Schemas.zCreateDocumentsData, envelope);
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
          const _schema = Schemas.zCreateDocumentsResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createDocuments', exempt: false });
    });
  }

  /**
   * Update element instance variables
   *
   * Updates all the variables of a particular scope (for example, process instance, element instance) with the given variable data.
   * Specify the element instance in the `elementInstanceKey` parameter.
   *
    *
   * @operationId createElementInstanceVariables
   * @tags Element instance
   */
  createElementInstanceVariables(input: createElementInstanceVariablesInput): CancelablePromise<_DataOf<typeof Sdk.createElementInstanceVariables>>;
  createElementInstanceVariables(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { elementInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createElementInstanceVariables', Schemas.zCreateElementInstanceVariablesData, envelope);
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
          const _schema = Schemas.zCreateElementInstanceVariablesResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createElementInstanceVariables', exempt: false });
    });
  }

  /**
   * Create a global-scoped cluster variable
   *
   * Create a global-scoped cluster variable.
    *
   * @operationId createGlobalClusterVariable
   * @tags Cluster Variable
   */
  createGlobalClusterVariable(input: createGlobalClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.createGlobalClusterVariable>>;
  createGlobalClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createGlobalClusterVariable', Schemas.zCreateGlobalClusterVariableData, envelope);
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
          const _schema = Schemas.zCreateGlobalClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createGlobalClusterVariable', exempt: false });
    });
  }

  /**
   * Create global user task listener
   *
   * Create a new global user task listener.
    *
   * @operationId createGlobalTaskListener
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  createGlobalTaskListener(input: createGlobalTaskListenerInput, /** Management of eventual consistency **/ consistencyManagement: createGlobalTaskListenerConsistency): CancelablePromise<_DataOf<typeof Sdk.createGlobalTaskListener>>;
  createGlobalTaskListener(arg: any, /** Management of eventual consistency **/ consistencyManagement: createGlobalTaskListenerConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createGlobalTaskListener', Schemas.zCreateGlobalTaskListenerData, envelope);
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
          const _schema = Schemas.zCreateGlobalTaskListenerResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('createGlobalTaskListener', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Create group
   *
   * Create a new group.
    *
   * @operationId createGroup
   * @tags Group
   */
  createGroup(input: createGroupInput): CancelablePromise<_DataOf<typeof Sdk.createGroup>>;
  createGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createGroup', Schemas.zCreateGroupData, envelope);
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
          const _schema = Schemas.zCreateGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createGroup', exempt: false });
    });
  }

  /**
   * Create mapping rule
   *
   * Create a new mapping rule
   *
    *
   * @operationId createMappingRule
   * @tags Mapping rule
   */
  createMappingRule(input: createMappingRuleInput): CancelablePromise<_DataOf<typeof Sdk.createMappingRule>>;
  createMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createMappingRule', Schemas.zCreateMappingRuleData, envelope);
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
          const _schema = Schemas.zCreateMappingRuleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createMappingRule', exempt: false });
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
   * @example Create by process definition ID
   * {@includeCode ../../examples/process-instance.ts#CreateProcessInstanceById}
   * @example Create by process definition key
   * {@includeCode ../../examples/process-instance.ts#CreateProcessInstanceByKey}
   * @operationId createProcessInstance
   * @tags Process instance
   */
  createProcessInstance(input: createProcessInstanceInput): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'createProcessInstance', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createProcessInstance', Schemas.zCreateProcessInstanceData, envelope);
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
          const _schema = Schemas.zCreateProcessInstanceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createProcessInstance', exempt: false });
    });
  }

  /**
   * Create role
   *
   * Create a new role.
    *
   * @operationId createRole
   * @tags Role
   */
  createRole(input: createRoleInput): CancelablePromise<_DataOf<typeof Sdk.createRole>>;
  createRole(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createRole', Schemas.zCreateRoleData, envelope);
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
          const _schema = Schemas.zCreateRoleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createRole', exempt: false });
    });
  }

  /**
   * Create tenant
   *
   * Creates a new tenant.
    *
   * @operationId createTenant
   * @tags Tenant
   */
  createTenant(input: createTenantInput): CancelablePromise<_DataOf<typeof Sdk.createTenant>>;
  createTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createTenant', Schemas.zCreateTenantData, envelope);
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
          const _schema = Schemas.zCreateTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createTenant', exempt: false });
    });
  }

  /**
   * Create a tenant-scoped cluster variable
   *
   * Create a new cluster variable for the given tenant.
    *
   * @operationId createTenantClusterVariable
   * @tags Cluster Variable
   */
  createTenantClusterVariable(input: createTenantClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.createTenantClusterVariable>>;
  createTenantClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createTenantClusterVariable', Schemas.zCreateTenantClusterVariableData, envelope);
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
          const _schema = Schemas.zCreateTenantClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'createTenantClusterVariable', exempt: false });
    });
  }

  /**
   * Create user
   *
   * Create a new user.
    *
   * @operationId createUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  createUser(input: createUserInput, /** Management of eventual consistency **/ consistencyManagement: createUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: createUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createUser', Schemas.zCreateUserData, envelope);
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
          const _schema = Schemas.zCreateUserResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('createUser', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Delete authorization
   *
   * Deletes the authorization with the given key.
    *
   * @operationId deleteAuthorization
   * @tags Authorization
   */
  deleteAuthorization(input: deleteAuthorizationInput): CancelablePromise<_DataOf<typeof Sdk.deleteAuthorization>>;
  deleteAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { authorizationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteAuthorization', Schemas.zDeleteAuthorizationData, envelope);
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
          const _schema = Schemas.zDeleteAuthorizationResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteAuthorization', exempt: false });
    });
  }

  /**
   * Delete decision instance
   *
   * Delete all associated decision evaluations based on provided key.
    *
   * @operationId deleteDecisionInstance
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteDecisionInstance(input: deleteDecisionInstanceInput, /** Management of eventual consistency **/ consistencyManagement: deleteDecisionInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstance>>;
  deleteDecisionInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteDecisionInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteDecisionInstance', Schemas.zDeleteDecisionInstanceData, envelope);
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
          const _schema = Schemas.zDeleteDecisionInstanceResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteDecisionInstance', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Delete decision instances (batch)
   *
   * Delete multiple decision instances. This will delete the historic data from secondary storage.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId deleteDecisionInstancesBatchOperation
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteDecisionInstancesBatchOperation(input: deleteDecisionInstancesBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: deleteDecisionInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstancesBatchOperation>>;
  deleteDecisionInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteDecisionInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteDecisionInstancesBatchOperation', Schemas.zDeleteDecisionInstancesBatchOperationData, envelope);
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
          const _schema = Schemas.zDeleteDecisionInstancesBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteDecisionInstancesBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * @operationId deleteDocument
   * @tags Document
   */
  deleteDocument(input: deleteDocumentInput): CancelablePromise<_DataOf<typeof Sdk.deleteDocument>>;
  deleteDocument(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteDocument', Schemas.zDeleteDocumentData, envelope);
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
          const _schema = Schemas.zDeleteDocumentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteDocument', exempt: false });
    });
  }

  /**
   * Delete a global-scoped cluster variable
   *
   * Delete a global-scoped cluster variable.
    *
   * @operationId deleteGlobalClusterVariable
   * @tags Cluster Variable
   */
  deleteGlobalClusterVariable(input: deleteGlobalClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalClusterVariable>>;
  deleteGlobalClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { name } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteGlobalClusterVariable', Schemas.zDeleteGlobalClusterVariableData, envelope);
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
          const _schema = Schemas.zDeleteGlobalClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteGlobalClusterVariable', exempt: false });
    });
  }

  /**
   * Delete global user task listener
   *
   * Deletes a global user task listener.
    *
   * @operationId deleteGlobalTaskListener
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteGlobalTaskListener(input: deleteGlobalTaskListenerInput, /** Management of eventual consistency **/ consistencyManagement: deleteGlobalTaskListenerConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalTaskListener>>;
  deleteGlobalTaskListener(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteGlobalTaskListenerConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { id } = arg || {};
      let envelope: any = {};
      envelope.path = { id };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteGlobalTaskListener', Schemas.zDeleteGlobalTaskListenerData, envelope);
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
          const _schema = Schemas.zDeleteGlobalTaskListenerResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteGlobalTaskListener', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Delete group
   *
   * Deletes the group with the given ID.
    *
   * @operationId deleteGroup
   * @tags Group
   */
  deleteGroup(input: deleteGroupInput): CancelablePromise<_DataOf<typeof Sdk.deleteGroup>>;
  deleteGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteGroup', Schemas.zDeleteGroupData, envelope);
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
          const _schema = Schemas.zDeleteGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteGroup', exempt: false });
    });
  }

  /**
   * Delete a mapping rule
   *
   * Deletes the mapping rule with the given ID.
   *
    *
   * @operationId deleteMappingRule
   * @tags Mapping rule
   */
  deleteMappingRule(input: deleteMappingRuleInput): CancelablePromise<_DataOf<typeof Sdk.deleteMappingRule>>;
  deleteMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteMappingRule', Schemas.zDeleteMappingRuleData, envelope);
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
          const _schema = Schemas.zDeleteMappingRuleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteMappingRule', exempt: false });
    });
  }

  /**
   * Delete process instance
   *
   * Deletes a process instance. Only instances that are completed or terminated can be deleted.
    *
   * @operationId deleteProcessInstance
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteProcessInstance(input: deleteProcessInstanceInput, /** Management of eventual consistency **/ consistencyManagement: deleteProcessInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstance>>;
  deleteProcessInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteProcessInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteProcessInstance', Schemas.zDeleteProcessInstanceData, envelope);
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
          const _schema = Schemas.zDeleteProcessInstanceResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteProcessInstance', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * @operationId deleteProcessInstancesBatchOperation
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteProcessInstancesBatchOperation(input: deleteProcessInstancesBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: deleteProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstancesBatchOperation>>;
  deleteProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteProcessInstancesBatchOperation', Schemas.zDeleteProcessInstancesBatchOperationData, envelope);
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
          const _schema = Schemas.zDeleteProcessInstancesBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * {@includeCode ../../examples/deployment.ts#DeleteResource}
   * @operationId deleteResource
   * @tags Resource
   */
  deleteResource(input: deleteResourceInput): CancelablePromise<_DataOf<typeof Sdk.deleteResource>>;
  deleteResource(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteResource', Schemas.zDeleteResourceData, envelope);
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
          const _schema = Schemas.zDeleteResourceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteResource', exempt: false });
    });
  }

  /**
   * Delete role
   *
   * Deletes the role with the given ID.
    *
   * @operationId deleteRole
   * @tags Role
   */
  deleteRole(input: deleteRoleInput): CancelablePromise<_DataOf<typeof Sdk.deleteRole>>;
  deleteRole(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteRole', Schemas.zDeleteRoleData, envelope);
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
          const _schema = Schemas.zDeleteRoleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteRole', exempt: false });
    });
  }

  /**
   * Delete tenant
   *
   * Deletes an existing tenant.
    *
   * @operationId deleteTenant
   * @tags Tenant
   */
  deleteTenant(input: deleteTenantInput): CancelablePromise<_DataOf<typeof Sdk.deleteTenant>>;
  deleteTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteTenant', Schemas.zDeleteTenantData, envelope);
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
          const _schema = Schemas.zDeleteTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteTenant', exempt: false });
    });
  }

  /**
   * Delete a tenant-scoped cluster variable
   *
   * Delete a tenant-scoped cluster variable.
    *
   * @operationId deleteTenantClusterVariable
   * @tags Cluster Variable
   */
  deleteTenantClusterVariable(input: deleteTenantClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.deleteTenantClusterVariable>>;
  deleteTenantClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, name } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteTenantClusterVariable', Schemas.zDeleteTenantClusterVariableData, envelope);
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
          const _schema = Schemas.zDeleteTenantClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'deleteTenantClusterVariable', exempt: false });
    });
  }

  /**
   * Delete user
   *
   * Deletes a user.
    *
   * @operationId deleteUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteUser(input: deleteUserInput, /** Management of eventual consistency **/ consistencyManagement: deleteUserConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { username } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('deleteUser', Schemas.zDeleteUserData, envelope);
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
          const _schema = Schemas.zDeleteUserResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteUser', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * @operationId evaluateConditionals
   * @tags Conditional
   */
  evaluateConditionals(input: evaluateConditionalsInput): CancelablePromise<_DataOf<typeof Sdk.evaluateConditionals>>;
  evaluateConditionals(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateConditionals', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('evaluateConditionals', Schemas.zEvaluateConditionalsData, envelope);
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
          const _schema = Schemas.zEvaluateConditionalsResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'evaluateConditionals', exempt: false });
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
   * @example Evaluate by decision definition ID
   * {@includeCode ../../examples/decision.ts#EvaluateDecisionById}
   * @example Evaluate by decision definition key
   * {@includeCode ../../examples/decision.ts#EvaluateDecisionByKey}
   * @operationId evaluateDecision
   * @tags Decision definition
   */
  evaluateDecision(input: evaluateDecisionInput): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateDecision', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('evaluateDecision', Schemas.zEvaluateDecisionData, envelope);
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
          const _schema = Schemas.zEvaluateDecisionResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'evaluateDecision', exempt: false });
    });
  }

  /**
   * Evaluate an expression
   *
   * Evaluates a FEEL expression and returns the result. Supports references to tenant scoped cluster variables when a tenant ID is provided.
    *
   * @operationId evaluateExpression
   * @tags Expression
   */
  evaluateExpression(input: evaluateExpressionInput): CancelablePromise<_DataOf<typeof Sdk.evaluateExpression>>;
  evaluateExpression(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'evaluateExpression', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('evaluateExpression', Schemas.zEvaluateExpressionData, envelope);
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
          const _schema = Schemas.zEvaluateExpressionResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'evaluateExpression', exempt: false });
    });
  }

  /**
   * Fail job
   *
   * Mark the job as failed.
   *
    *
   * @example Fail a job with retry
   * {@includeCode ../../examples/job.ts#FailJob}
   * @operationId failJob
   * @tags Job
   */
  failJob(input: failJobInput): CancelablePromise<_DataOf<typeof Sdk.failJob>>;
  failJob(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('failJob', Schemas.zFailJobData, envelope);
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
          const _schema = Schemas.zFailJobResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'failJob', exempt: true });
    });
  }

  /**
   * Get audit log
   *
   * Get an audit log entry by auditLogKey.
    *
   * @operationId getAuditLog
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuditLog(input: getAuditLogInput, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency): CancelablePromise<_DataOf<typeof Sdk.getAuditLog>>;
  getAuditLog(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { auditLogKey } = arg || {};
      let envelope: any = {};
      envelope.path = { auditLogKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getAuditLog', Schemas.zGetAuditLogData, envelope);
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
          const _schema = Schemas.zGetAuditLogResponse;
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
   * @operationId getAuthentication
   * @tags Authentication
   */
  getAuthentication(): CancelablePromise<_DataOf<typeof Sdk.getAuthentication>>;
  getAuthentication(arg?: any): CancelablePromise<any> {
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
          const _schema = Schemas.zGetAuthenticationResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getAuthentication', exempt: false });
    });
  }

  /**
   * Get authorization
   *
   * Get authorization by the given key.
    *
   * @operationId getAuthorization
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuthorization(input: getAuthorizationInput, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { authorizationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getAuthorization', Schemas.zGetAuthorizationData, envelope);
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
          const _schema = Schemas.zGetAuthorizationResponse;
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
   * @operationId getBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getBatchOperation(input: getBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { batchOperationKey } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getBatchOperation', Schemas.zGetBatchOperationData, envelope);
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
          const _schema = Schemas.zGetBatchOperationResponse;
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
   * {@includeCode ../../examples/decision.ts#GetDecisionDefinition}
   * @operationId getDecisionDefinition
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinition(input: getDecisionDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDecisionDefinition', Schemas.zGetDecisionDefinitionData, envelope);
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
          const _schema = Schemas.zGetDecisionDefinitionResponse;
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
   * @operationId getDecisionDefinitionXML
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinitionXml(input: getDecisionDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDecisionDefinitionXML', Schemas.zGetDecisionDefinitionXmlData, envelope);
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
          const _schema = Schemas.zGetDecisionDefinitionXmlResponse;
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
   * @operationId getDecisionInstance
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionInstance(input: getDecisionInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionEvaluationInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionEvaluationInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDecisionInstance', Schemas.zGetDecisionInstanceData, envelope);
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
          const _schema = Schemas.zGetDecisionInstanceResponse;
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
   * @operationId getDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirements(input: getDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionRequirementsKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionRequirementsKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDecisionRequirements', Schemas.zGetDecisionRequirementsData, envelope);
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
          const _schema = Schemas.zGetDecisionRequirementsResponse;
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
   * @operationId getDecisionRequirementsXML
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirementsXml(input: getDecisionRequirementsXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { decisionRequirementsKey } = arg || {};
      let envelope: any = {};
      envelope.path = { decisionRequirementsKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDecisionRequirementsXML', Schemas.zGetDecisionRequirementsXmlData, envelope);
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
          const _schema = Schemas.zGetDecisionRequirementsXmlResponse;
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
   * @operationId getDocument
   * @tags Document
   */
  getDocument(input: getDocumentInput): CancelablePromise<_DataOf<typeof Sdk.getDocument>>;
  getDocument(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { documentId, storeId, contentHash } = arg || {};
      let envelope: any = {};
      envelope.path = { documentId };
      envelope.query = { storeId, contentHash };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getDocument', Schemas.zGetDocumentData, envelope);
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
          const _schema = Schemas.zGetDocumentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getDocument', exempt: false });
    });
  }

  /**
   * Get element instance
   *
   * Returns element instance as JSON.
    *
   * @operationId getElementInstance
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getElementInstance(input: getElementInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { elementInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getElementInstance', Schemas.zGetElementInstanceData, envelope);
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
          const _schema = Schemas.zGetElementInstanceResponse;
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
   * @operationId getGlobalClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalClusterVariable(input: getGlobalClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency): CancelablePromise<_DataOf<typeof Sdk.getGlobalClusterVariable>>;
  getGlobalClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { name } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getGlobalClusterVariable', Schemas.zGetGlobalClusterVariableData, envelope);
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
          const _schema = Schemas.zGetGlobalClusterVariableResponse;
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
   * @operationId getGlobalJobStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalJobStatistics(input: getGlobalJobStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getGlobalJobStatistics>>;
  getGlobalJobStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { from, to, jobType } = arg || {};
      let envelope: any = {};
      envelope.query = { from, to, jobType };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getGlobalJobStatistics', Schemas.zGetGlobalJobStatisticsData, envelope);
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
          const _schema = Schemas.zGetGlobalJobStatisticsResponse;
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
   * Get group
   *
   * Get a group by its ID.
    *
   * @operationId getGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGroup(input: getGroupInput, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getGroup', Schemas.zGetGroupData, envelope);
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
          const _schema = Schemas.zGetGroupResponse;
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
   * {@includeCode ../../examples/incident.ts#GetIncident}
   * @operationId getIncident
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getIncident(input: getIncidentInput, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(arg: any, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { incidentKey } = arg || {};
      let envelope: any = {};
      envelope.path = { incidentKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getIncident', Schemas.zGetIncidentData, envelope);
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
          const _schema = Schemas.zGetIncidentResponse;
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
   * Get license status
   *
   * Obtains the status of the current Camunda license.
    *
   * @operationId getLicense
   * @tags License
   */
  getLicense(): CancelablePromise<_DataOf<typeof Sdk.getLicense>>;
  getLicense(arg?: any): CancelablePromise<any> {
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
          const _schema = Schemas.zGetLicenseResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getLicense', exempt: false });
    });
  }

  /**
   * Get a mapping rule
   *
   * Gets the mapping rule with the given ID.
   *
    *
   * @operationId getMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getMappingRule(input: getMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getMappingRule', Schemas.zGetMappingRuleData, envelope);
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
          const _schema = Schemas.zGetMappingRuleResponse;
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
   * @operationId getProcessDefinition
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinition(input: getProcessDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinition', Schemas.zGetProcessDefinitionData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionResponse;
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
   * @operationId getProcessDefinitionInstanceStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceStatistics(input: getProcessDefinitionInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceStatistics>>;
  getProcessDefinitionInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinitionInstanceStatistics', Schemas.zGetProcessDefinitionInstanceStatisticsData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionInstanceStatisticsResponse;
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
   * @operationId getProcessDefinitionInstanceVersionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceVersionStatistics(input: getProcessDefinitionInstanceVersionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceVersionStatistics>>;
  getProcessDefinitionInstanceVersionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinitionInstanceVersionStatistics', Schemas.zGetProcessDefinitionInstanceVersionStatisticsData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionInstanceVersionStatisticsResponse;
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
   * @operationId getProcessDefinitionMessageSubscriptionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionMessageSubscriptionStatistics(input: getProcessDefinitionMessageSubscriptionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionMessageSubscriptionStatistics>>;
  getProcessDefinitionMessageSubscriptionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinitionMessageSubscriptionStatistics', Schemas.zGetProcessDefinitionMessageSubscriptionStatisticsData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionMessageSubscriptionStatisticsResponse;
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
   * @operationId getProcessDefinitionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionStatistics(input: getProcessDefinitionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinitionStatistics', Schemas.zGetProcessDefinitionStatisticsData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionStatisticsResponse;
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
   * @operationId getProcessDefinitionXML
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionXml(input: getProcessDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessDefinitionXML', Schemas.zGetProcessDefinitionXmlData, envelope);
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
          const _schema = Schemas.zGetProcessDefinitionXmlResponse;
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
   * {@includeCode ../../examples/process-instance.ts#GetProcessInstance}
   * @operationId getProcessInstance
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstance(input: getProcessInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstance', Schemas.zGetProcessInstanceData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceResponse;
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
   * @operationId getProcessInstanceCallHierarchy
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceCallHierarchy(input: getProcessInstanceCallHierarchyInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstanceCallHierarchy', Schemas.zGetProcessInstanceCallHierarchyData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceCallHierarchyResponse;
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
   * @operationId getProcessInstanceSequenceFlows
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceSequenceFlows(input: getProcessInstanceSequenceFlowsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstanceSequenceFlows', Schemas.zGetProcessInstanceSequenceFlowsData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceSequenceFlowsResponse;
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
   * @operationId getProcessInstanceStatistics
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatistics(input: getProcessInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstanceStatistics', Schemas.zGetProcessInstanceStatisticsData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceStatisticsResponse;
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
   * @operationId getProcessInstanceStatisticsByDefinition
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByDefinition(input: getProcessInstanceStatisticsByDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByDefinition>>;
  getProcessInstanceStatisticsByDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstanceStatisticsByDefinition', Schemas.zGetProcessInstanceStatisticsByDefinitionData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceStatisticsByDefinitionResponse;
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
   * @operationId getProcessInstanceStatisticsByError
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByError(input: getProcessInstanceStatisticsByErrorInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByError>>;
  getProcessInstanceStatisticsByError(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getProcessInstanceStatisticsByError', Schemas.zGetProcessInstanceStatisticsByErrorData, envelope);
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
          const _schema = Schemas.zGetProcessInstanceStatisticsByErrorResponse;
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
   * @operationId getResource
   * @tags Resource
   */
  getResource(input: getResourceInput): CancelablePromise<_DataOf<typeof Sdk.getResource>>;
  getResource(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getResource', Schemas.zGetResourceData, envelope);
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
          const _schema = Schemas.zGetResourceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getResource', exempt: false });
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
   * @operationId getResourceContent
   * @tags Resource
   */
  getResourceContent(input: getResourceContentInput): CancelablePromise<_DataOf<typeof Sdk.getResourceContent>>;
  getResourceContent(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { resourceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { resourceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getResourceContent', Schemas.zGetResourceContentData, envelope);
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
          const _schema = Schemas.zGetResourceContentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getResourceContent', exempt: false });
    });
  }

  /**
   * Get role
   *
   * Get a role by its ID.
    *
   * @operationId getRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getRole(input: getRoleInput, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getRole', Schemas.zGetRoleData, envelope);
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
          const _schema = Schemas.zGetRoleResponse;
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
   * @operationId getStartProcessForm
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getStartProcessForm(input: getStartProcessFormInput, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processDefinitionKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processDefinitionKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getStartProcessForm', Schemas.zGetStartProcessFormData, envelope);
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
          const _schema = Schemas.zGetStartProcessFormResponse;
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
   * @operationId getStatus
   * @tags Cluster
   */
  getStatus(): CancelablePromise<_DataOf<typeof Sdk.getStatus>>;
  getStatus(arg?: any): CancelablePromise<any> {
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
          const _schema = Schemas.zGetStatusResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getStatus', exempt: false });
    });
  }

  /**
   * Get tenant
   *
   * Retrieves a single tenant by tenant ID.
    *
   * @operationId getTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenant(input: getTenantInput, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getTenant', Schemas.zGetTenantData, envelope);
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
          const _schema = Schemas.zGetTenantResponse;
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
   * @operationId getTenantClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenantClusterVariable(input: getTenantClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency): CancelablePromise<_DataOf<typeof Sdk.getTenantClusterVariable>>;
  getTenantClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, name } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getTenantClusterVariable', Schemas.zGetTenantClusterVariableData, envelope);
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
          const _schema = Schemas.zGetTenantClusterVariableResponse;
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
   * {@includeCode ../../examples/client.ts#GetTopology}
   * @operationId getTopology
   * @tags Cluster
   */
  getTopology(): CancelablePromise<_DataOf<typeof Sdk.getTopology>>;
  getTopology(arg?: any): CancelablePromise<any> {
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
          const _schema = Schemas.zGetTopologyResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'getTopology', exempt: false });
    });
  }

  /**
   * Get usage metrics
   *
   * Retrieve the usage metrics based on given criteria.
    *
   * @operationId getUsageMetrics
   * @tags System
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUsageMetrics(input: getUsageMetricsInput, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency): CancelablePromise<_DataOf<typeof Sdk.getUsageMetrics>>;
  getUsageMetrics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { startTime, endTime, tenantId, withTenants } = arg || {};
      let envelope: any = {};
      envelope.query = { startTime, endTime, tenantId, withTenants };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getUsageMetrics', Schemas.zGetUsageMetricsData, envelope);
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
          const _schema = Schemas.zGetUsageMetricsResponse;
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
   * @operationId getUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUser(input: getUserInput, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { username } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getUser', Schemas.zGetUserData, envelope);
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
          const _schema = Schemas.zGetUserResponse;
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
   * @operationId getUserTask
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTask(input: getUserTaskInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getUserTask', Schemas.zGetUserTaskData, envelope);
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
          const _schema = Schemas.zGetUserTaskResponse;
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
   * @operationId getUserTaskForm
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTaskForm(input: getUserTaskFormInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getUserTaskForm', Schemas.zGetUserTaskFormData, envelope);
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
          const _schema = Schemas.zGetUserTaskFormResponse;
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
   * Get the variable by the variable key.
    *
   * @operationId getVariable
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getVariable(input: getVariableInput, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { variableKey } = arg || {};
      let envelope: any = {};
      envelope.path = { variableKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('getVariable', Schemas.zGetVariableData, envelope);
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
          const _schema = Schemas.zGetVariableResponse;
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
   * @operationId migrateProcessInstance
   * @tags Process instance
   */
  migrateProcessInstance(input: migrateProcessInstanceInput): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstance>>;
  migrateProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('migrateProcessInstance', Schemas.zMigrateProcessInstanceData, envelope);
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
          const _schema = Schemas.zMigrateProcessInstanceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'migrateProcessInstance', exempt: false });
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
   * @operationId migrateProcessInstancesBatchOperation
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  migrateProcessInstancesBatchOperation(input: migrateProcessInstancesBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: migrateProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: migrateProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('migrateProcessInstancesBatchOperation', Schemas.zMigrateProcessInstancesBatchOperationData, envelope);
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
          const _schema = Schemas.zMigrateProcessInstancesBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('migrateProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * @operationId modifyProcessInstance
   * @tags Process instance
   */
  modifyProcessInstance(input: modifyProcessInstanceInput): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstance>>;
  modifyProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('modifyProcessInstance', Schemas.zModifyProcessInstanceData, envelope);
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
          const _schema = Schemas.zModifyProcessInstanceResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'modifyProcessInstance', exempt: false });
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
   * @operationId modifyProcessInstancesBatchOperation
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  modifyProcessInstancesBatchOperation(input: modifyProcessInstancesBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: modifyProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: modifyProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('modifyProcessInstancesBatchOperation', Schemas.zModifyProcessInstancesBatchOperationData, envelope);
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
          const _schema = Schemas.zModifyProcessInstancesBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('modifyProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
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
   * @operationId pinClock
   * @tags Clock
   */
  pinClock(input: pinClockInput): CancelablePromise<_DataOf<typeof Sdk.pinClock>>;
  pinClock(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('pinClock', Schemas.zPinClockData, envelope);
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
          const _schema = Schemas.zPinClockResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'pinClock', exempt: false });
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
   * {@includeCode ../../examples/message-signal.ts#PublishMessage}
   * @operationId publishMessage
   * @tags Message
   */
  publishMessage(input: publishMessageInput): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (envelope.body && (envelope.body.tenantId === undefined || envelope.body.tenantId === null)) {
        envelope.body.tenantId = this._config.defaultTenantId;
        this._log.trace(() => ['tenant.default.inject', { op: 'publishMessage', tenant: this._config.defaultTenantId }]);
      }
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('publishMessage', Schemas.zPublishMessageData, envelope);
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
          const _schema = Schemas.zPublishMessageResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'publishMessage', exempt: false });
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
   * @operationId resetClock
   * @tags Clock
   */
  resetClock(): CancelablePromise<_DataOf<typeof Sdk.resetClock>>;
  resetClock(arg?: any): CancelablePromise<any> {
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
          const _schema = Schemas.zResetClockResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'resetClock', exempt: false });
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
   * {@includeCode ../../examples/incident.ts#ResolveIncident}
   * @operationId resolveIncident
   * @tags Incident
   */
  resolveIncident(input: resolveIncidentInput): CancelablePromise<_DataOf<typeof Sdk.resolveIncident>>;
  resolveIncident(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { incidentKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { incidentKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('resolveIncident', Schemas.zResolveIncidentData, envelope);
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
          const _schema = Schemas.zResolveIncidentResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'resolveIncident', exempt: false });
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
   * @operationId resolveIncidentsBatchOperation
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  resolveIncidentsBatchOperation(input: resolveIncidentsBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: resolveIncidentsBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: resolveIncidentsBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('resolveIncidentsBatchOperation', Schemas.zResolveIncidentsBatchOperationData, envelope);
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
          const _schema = Schemas.zResolveIncidentsBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('resolveIncidentsBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Resolve related incidents
   *
   * Creates a batch operation to resolve multiple incidents of a process instance.
    *
   * @operationId resolveProcessInstanceIncidents
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  resolveProcessInstanceIncidents(input: resolveProcessInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: resolveProcessInstanceIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.resolveProcessInstanceIncidents>>;
  resolveProcessInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: resolveProcessInstanceIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('resolveProcessInstanceIncidents', Schemas.zResolveProcessInstanceIncidentsData, envelope);
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
          const _schema = Schemas.zResolveProcessInstanceIncidentsResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('resolveProcessInstanceIncidents', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Resume Batch operation
   *
   * Resumes a suspended batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId resumeBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  resumeBatchOperation(input: resumeBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: resumeBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: resumeBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('resumeBatchOperation', Schemas.zResumeBatchOperationData, envelope);
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
          const _schema = Schemas.zResumeBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('resumeBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Search audit logs
   *
   * Search for audit logs based on given criteria.
    *
   * @operationId searchAuditLogs
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuditLogs(input: searchAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchAuditLogs>>;
  searchAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchAuditLogs', Schemas.zSearchAuditLogsData, envelope);
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
          const _schema = Schemas.zSearchAuditLogsResponse;
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
   * @operationId searchAuthorizations
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuthorizations(input: searchAuthorizationsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchAuthorizations', Schemas.zSearchAuthorizationsData, envelope);
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
          const _schema = Schemas.zSearchAuthorizationsResponse;
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
   * @operationId searchBatchOperationItems
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperationItems(input: searchBatchOperationItemsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchBatchOperationItems', Schemas.zSearchBatchOperationItemsData, envelope);
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
          const _schema = Schemas.zSearchBatchOperationItemsResponse;
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
   * @operationId searchBatchOperations
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperations(input: searchBatchOperationsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchBatchOperations', Schemas.zSearchBatchOperationsData, envelope);
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
          const _schema = Schemas.zSearchBatchOperationsResponse;
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
   * @operationId searchClientsForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForGroup(input: searchClientsForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchClientsForGroup', Schemas.zSearchClientsForGroupData, envelope);
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
          const _schema = Schemas.zSearchClientsForGroupResponse;
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
   * @operationId searchClientsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForRole(input: searchClientsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchClientsForRole', Schemas.zSearchClientsForRoleData, envelope);
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
          const _schema = Schemas.zSearchClientsForRoleResponse;
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
   * @operationId searchClientsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForTenant(input: searchClientsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchClientsForTenant', Schemas.zSearchClientsForTenantData, envelope);
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
          const _schema = Schemas.zSearchClientsForTenantResponse;
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
   * @operationId searchClusterVariables
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClusterVariables(input: searchClusterVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClusterVariables>>;
  searchClusterVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchClusterVariables', Schemas.zSearchClusterVariablesData, envelope);
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
          const _schema = Schemas.zSearchClusterVariablesResponse;
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
   * @operationId searchCorrelatedMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchCorrelatedMessageSubscriptions(input: searchCorrelatedMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchCorrelatedMessageSubscriptions>>;
  searchCorrelatedMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchCorrelatedMessageSubscriptions', Schemas.zSearchCorrelatedMessageSubscriptionsData, envelope);
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
          const _schema = Schemas.zSearchCorrelatedMessageSubscriptionsResponse;
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
   * {@includeCode ../../examples/decision.ts#SearchDecisionDefinitions}
   * @operationId searchDecisionDefinitions
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionDefinitions(input: searchDecisionDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchDecisionDefinitions', Schemas.zSearchDecisionDefinitionsData, envelope);
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
          const _schema = Schemas.zSearchDecisionDefinitionsResponse;
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
   * @operationId searchDecisionInstances
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionInstances(input: searchDecisionInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchDecisionInstances', Schemas.zSearchDecisionInstancesData, envelope);
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
          const _schema = Schemas.zSearchDecisionInstancesResponse;
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
   * @operationId searchDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionRequirements(input: searchDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchDecisionRequirements', Schemas.zSearchDecisionRequirementsData, envelope);
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
          const _schema = Schemas.zSearchDecisionRequirementsResponse;
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
   * @operationId searchElementInstanceIncidents
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstanceIncidents(input: searchElementInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchElementInstanceIncidents>>;
  searchElementInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { elementInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { elementInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchElementInstanceIncidents', Schemas.zSearchElementInstanceIncidentsData, envelope);
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
          const _schema = Schemas.zSearchElementInstanceIncidentsResponse;
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
   * @operationId searchElementInstances
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstances(input: searchElementInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchElementInstances', Schemas.zSearchElementInstancesData, envelope);
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
          const _schema = Schemas.zSearchElementInstancesResponse;
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
   * Search groups for tenant
   *
   * Retrieves a filtered and sorted list of groups for a specified tenant.
    *
   * @operationId searchGroupIdsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupIdsForTenant(input: searchGroupIdsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchGroupIdsForTenant', Schemas.zSearchGroupIdsForTenantData, envelope);
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
          const _schema = Schemas.zSearchGroupIdsForTenantResponse;
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
   * @operationId searchGroups
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroups(input: searchGroupsInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchGroups', Schemas.zSearchGroupsData, envelope);
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
          const _schema = Schemas.zSearchGroupsResponse;
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
   * @operationId searchGroupsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupsForRole(input: searchGroupsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchGroupsForRole', Schemas.zSearchGroupsForRoleData, envelope);
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
          const _schema = Schemas.zSearchGroupsForRoleResponse;
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
   * {@includeCode ../../examples/incident.ts#SearchIncidents}
   * @operationId searchIncidents
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchIncidents(input: searchIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchIncidents', Schemas.zSearchIncidentsData, envelope);
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
          const _schema = Schemas.zSearchIncidentsResponse;
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
   * @operationId searchJobs
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchJobs(input: searchJobsInput, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchJobs', Schemas.zSearchJobsData, envelope);
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
          const _schema = Schemas.zSearchJobsResponse;
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
   * @operationId searchMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRule(input: searchMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMappingRule', Schemas.zSearchMappingRuleData, envelope);
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
          const _schema = Schemas.zSearchMappingRuleResponse;
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
   * @operationId searchMappingRulesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForGroup(input: searchMappingRulesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMappingRulesForGroup', Schemas.zSearchMappingRulesForGroupData, envelope);
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
          const _schema = Schemas.zSearchMappingRulesForGroupResponse;
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
   * @operationId searchMappingRulesForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForRole(input: searchMappingRulesForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMappingRulesForRole', Schemas.zSearchMappingRulesForRoleData, envelope);
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
          const _schema = Schemas.zSearchMappingRulesForRoleResponse;
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
   * @operationId searchMappingRulesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForTenant(input: searchMappingRulesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForTenant>>;
  searchMappingRulesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMappingRulesForTenant', Schemas.zSearchMappingRulesForTenantData, envelope);
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
          const _schema = Schemas.zSearchMappingRulesForTenantResponse;
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
   * @operationId searchMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMessageSubscriptions(input: searchMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMessageSubscriptions', Schemas.zSearchMessageSubscriptionsData, envelope);
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
          const _schema = Schemas.zSearchMessageSubscriptionsResponse;
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
   * @operationId searchProcessDefinitions
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessDefinitions(input: searchProcessDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchProcessDefinitions', Schemas.zSearchProcessDefinitionsData, envelope);
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
          const _schema = Schemas.zSearchProcessDefinitionsResponse;
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
   * @operationId searchProcessInstanceIncidents
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstanceIncidents(input: searchProcessInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { processInstanceKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { processInstanceKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchProcessInstanceIncidents', Schemas.zSearchProcessInstanceIncidentsData, envelope);
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
          const _schema = Schemas.zSearchProcessInstanceIncidentsResponse;
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
   * {@includeCode ../../examples/process-instance.ts#SearchProcessInstances}
   * @operationId searchProcessInstances
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstances(input: searchProcessInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchProcessInstances', Schemas.zSearchProcessInstancesData, envelope);
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
          const _schema = Schemas.zSearchProcessInstancesResponse;
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
   * @operationId searchRoles
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRoles(input: searchRolesInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchRoles', Schemas.zSearchRolesData, envelope);
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
          const _schema = Schemas.zSearchRolesResponse;
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
   * @operationId searchRolesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForGroup(input: searchRolesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchRolesForGroup', Schemas.zSearchRolesForGroupData, envelope);
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
          const _schema = Schemas.zSearchRolesForGroupResponse;
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
   * @operationId searchRolesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForTenant(input: searchRolesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchRolesForTenant', Schemas.zSearchRolesForTenantData, envelope);
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
          const _schema = Schemas.zSearchRolesForTenantResponse;
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
   * @operationId searchTenants
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchTenants(input: searchTenantsInput, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchTenants', Schemas.zSearchTenantsData, envelope);
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
          const _schema = Schemas.zSearchTenantsResponse;
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
   * @operationId searchUsers
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsers(input: searchUsersInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUsers', Schemas.zSearchUsersData, envelope);
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
          const _schema = Schemas.zSearchUsersResponse;
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
   * @operationId searchUsersForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForGroup(input: searchUsersForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUsersForGroup', Schemas.zSearchUsersForGroupData, envelope);
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
          const _schema = Schemas.zSearchUsersForGroupResponse;
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
   * @operationId searchUsersForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForRole(input: searchUsersForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUsersForRole', Schemas.zSearchUsersForRoleData, envelope);
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
          const _schema = Schemas.zSearchUsersForRoleResponse;
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
   * @operationId searchUsersForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForTenant(input: searchUsersForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUsersForTenant', Schemas.zSearchUsersForTenantData, envelope);
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
          const _schema = Schemas.zSearchUsersForTenantResponse;
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
   * @operationId searchUserTaskAuditLogs
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskAuditLogs(input: searchUserTaskAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskAuditLogs>>;
  searchUserTaskAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUserTaskAuditLogs', Schemas.zSearchUserTaskAuditLogsData, envelope);
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
          const _schema = Schemas.zSearchUserTaskAuditLogsResponse;
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
   * Search user tasks
   *
   * Search for user tasks based on given criteria.
    *
   * @example Search user tasks
   * {@includeCode ../../examples/user-task.ts#SearchUserTasks}
   * @operationId searchUserTasks
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTasks(input: searchUserTasksInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUserTasks', Schemas.zSearchUserTasksData, envelope);
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
          const _schema = Schemas.zSearchUserTasksResponse;
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
   * Search for user task variables based on given criteria. By default, long variable values in the response are truncated.
    *
   * @operationId searchUserTaskVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskVariables(input: searchUserTaskVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { userTaskKey, truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUserTaskVariables', Schemas.zSearchUserTaskVariablesData, envelope);
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
          const _schema = Schemas.zSearchUserTaskVariablesResponse;
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
   * Search for process and local variables based on given criteria. By default, long variable values in the response are truncated.
    *
   * @operationId searchVariables
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchVariables(input: searchVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { truncateValues, ..._body } = arg || {};
      let envelope: any = {};
      envelope.query = { truncateValues };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchVariables', Schemas.zSearchVariablesData, envelope);
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
          const _schema = Schemas.zSearchVariablesResponse;
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
   * @operationId suspendBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  suspendBatchOperation(input: suspendBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: suspendBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: suspendBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { batchOperationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { batchOperationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('suspendBatchOperation', Schemas.zSuspendBatchOperationData, envelope);
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
          const _schema = Schemas.zSuspendBatchOperationResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('suspendBatchOperation', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Throw error for job
   *
   * Reports a business error (i.e. non-technical) that occurs while processing a job.
   *
    *
   * @operationId throwJobError
   * @tags Job
   */
  throwJobError(input: throwJobErrorInput): CancelablePromise<_DataOf<typeof Sdk.throwJobError>>;
  throwJobError(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('throwJobError', Schemas.zThrowJobErrorData, envelope);
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
          const _schema = Schemas.zThrowJobErrorResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'throwJobError', exempt: true });
    });
  }

  /**
   * Unassign a client from a group
   *
   * Unassigns a client from a group.
   * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @operationId unassignClientFromGroup
   * @tags Group
   */
  unassignClientFromGroup(input: unassignClientFromGroupInput): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromGroup>>;
  unassignClientFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignClientFromGroup', Schemas.zUnassignClientFromGroupData, envelope);
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
          const _schema = Schemas.zUnassignClientFromGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignClientFromGroup', exempt: false });
    });
  }

  /**
   * Unassign a client from a tenant
   *
   * Unassigns the client from the specified tenant.
   * The client can no longer access tenant data.
   *
    *
   * @operationId unassignClientFromTenant
   * @tags Tenant
   */
  unassignClientFromTenant(input: unassignClientFromTenantInput): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromTenant>>;
  unassignClientFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignClientFromTenant', Schemas.zUnassignClientFromTenantData, envelope);
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
          const _schema = Schemas.zUnassignClientFromTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignClientFromTenant', exempt: false });
    });
  }

  /**
   * Unassign a group from a tenant
   *
   * Unassigns a group from a specified tenant.
   * Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
   *
    *
   * @operationId unassignGroupFromTenant
   * @tags Tenant
   */
  unassignGroupFromTenant(input: unassignGroupFromTenantInput): CancelablePromise<_DataOf<typeof Sdk.unassignGroupFromTenant>>;
  unassignGroupFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignGroupFromTenant', Schemas.zUnassignGroupFromTenantData, envelope);
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
          const _schema = Schemas.zUnassignGroupFromTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignGroupFromTenant', exempt: false });
    });
  }

  /**
   * Unassign a mapping rule from a group
   *
   * Unassigns a mapping rule from a group.
    *
   * @operationId unassignMappingRuleFromGroup
   * @tags Group
   */
  unassignMappingRuleFromGroup(input: unassignMappingRuleFromGroupInput): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromGroup>>;
  unassignMappingRuleFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignMappingRuleFromGroup', Schemas.zUnassignMappingRuleFromGroupData, envelope);
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
          const _schema = Schemas.zUnassignMappingRuleFromGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignMappingRuleFromGroup', exempt: false });
    });
  }

  /**
   * Unassign a mapping rule from a tenant
   *
   * Unassigns a single mapping rule from a specified tenant without deleting the rule.
    *
   * @operationId unassignMappingRuleFromTenant
   * @tags Tenant
   */
  unassignMappingRuleFromTenant(input: unassignMappingRuleFromTenantInput): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromTenant>>;
  unassignMappingRuleFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignMappingRuleFromTenant', Schemas.zUnassignMappingRuleFromTenantData, envelope);
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
          const _schema = Schemas.zUnassignMappingRuleFromTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignMappingRuleFromTenant', exempt: false });
    });
  }

  /**
   * Unassign a role from a client
   *
   * Unassigns the specified role from the client. The client will no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromClient
   * @tags Role
   */
  unassignRoleFromClient(input: unassignRoleFromClientInput): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromClient>>;
  unassignRoleFromClient(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, clientId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, clientId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignRoleFromClient', Schemas.zUnassignRoleFromClientData, envelope);
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
          const _schema = Schemas.zUnassignRoleFromClientResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromClient', exempt: false });
    });
  }

  /**
   * Unassign a role from a group
   *
   * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromGroup
   * @tags Role
   */
  unassignRoleFromGroup(input: unassignRoleFromGroupInput): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromGroup>>;
  unassignRoleFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, groupId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, groupId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignRoleFromGroup', Schemas.zUnassignRoleFromGroupData, envelope);
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
          const _schema = Schemas.zUnassignRoleFromGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromGroup', exempt: false });
    });
  }

  /**
   * Unassign a role from a mapping rule
   *
   * Unassigns a role from a mapping rule.
    *
   * @operationId unassignRoleFromMappingRule
   * @tags Role
   */
  unassignRoleFromMappingRule(input: unassignRoleFromMappingRuleInput): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromMappingRule>>;
  unassignRoleFromMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, mappingRuleId } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, mappingRuleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignRoleFromMappingRule', Schemas.zUnassignRoleFromMappingRuleData, envelope);
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
          const _schema = Schemas.zUnassignRoleFromMappingRuleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromMappingRule', exempt: false });
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
   * @operationId unassignRoleFromTenant
   * @tags Tenant
   */
  unassignRoleFromTenant(input: unassignRoleFromTenantInput): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromTenant>>;
  unassignRoleFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, roleId } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, roleId };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignRoleFromTenant', Schemas.zUnassignRoleFromTenantData, envelope);
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
          const _schema = Schemas.zUnassignRoleFromTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromTenant', exempt: false });
    });
  }

  /**
   * Unassign a role from a user
   *
   * Unassigns a role from a user. The user will no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromUser
   * @tags Role
   */
  unassignRoleFromUser(input: unassignRoleFromUserInput): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromUser>>;
  unassignRoleFromUser(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignRoleFromUser', Schemas.zUnassignRoleFromUserData, envelope);
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
          const _schema = Schemas.zUnassignRoleFromUserResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignRoleFromUser', exempt: false });
    });
  }

  /**
   * Unassign a user from a group
   *
   * Unassigns a user from a group.
   * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @operationId unassignUserFromGroup
   * @tags Group
   */
  unassignUserFromGroup(input: unassignUserFromGroupInput): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromGroup>>;
  unassignUserFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignUserFromGroup', Schemas.zUnassignUserFromGroupData, envelope);
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
          const _schema = Schemas.zUnassignUserFromGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserFromGroup', exempt: false });
    });
  }

  /**
   * Unassign a user from a tenant
   *
   * Unassigns the user from the specified tenant.
   * The user can no longer access tenant data.
   *
    *
   * @operationId unassignUserFromTenant
   * @tags Tenant
   */
  unassignUserFromTenant(input: unassignUserFromTenantInput): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromTenant>>;
  unassignUserFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, username } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, username };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignUserFromTenant', Schemas.zUnassignUserFromTenantData, envelope);
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
          const _schema = Schemas.zUnassignUserFromTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserFromTenant', exempt: false });
    });
  }

  /**
   * Unassign user task
   *
   * Removes the assignee of a task with the given key.
    *
   * @example Unassign a user task
   * {@includeCode ../../examples/user-task.ts#UnassignUserTask}
   * @operationId unassignUserTask
   * @tags User task
   */
  unassignUserTask(input: unassignUserTaskInput): CancelablePromise<_DataOf<typeof Sdk.unassignUserTask>>;
  unassignUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('unassignUserTask', Schemas.zUnassignUserTaskData, envelope);
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
          const _schema = Schemas.zUnassignUserTaskResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'unassignUserTask', exempt: false });
    });
  }

  /**
   * Update authorization
   *
   * Update the authorization with the given key.
    *
   * @operationId updateAuthorization
   * @tags Authorization
   */
  updateAuthorization(input: updateAuthorizationInput): CancelablePromise<_DataOf<typeof Sdk.updateAuthorization>>;
  updateAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { authorizationKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { authorizationKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateAuthorization', Schemas.zUpdateAuthorizationData, envelope);
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
          const _schema = Schemas.zUpdateAuthorizationResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateAuthorization', exempt: false });
    });
  }

  /**
   * Update a global-scoped cluster variable
   *
   * Updates the value of an existing global cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @operationId updateGlobalClusterVariable
   * @tags Cluster Variable
   */
  updateGlobalClusterVariable(input: updateGlobalClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.updateGlobalClusterVariable>>;
  updateGlobalClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { name, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { name };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateGlobalClusterVariable', Schemas.zUpdateGlobalClusterVariableData, envelope);
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
          const _schema = Schemas.zUpdateGlobalClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateGlobalClusterVariable', exempt: false });
    });
  }

  /**
   * Update global user task listener
   *
   * Updates a global user task listener.
    *
   * @operationId updateGlobalTaskListener
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  updateGlobalTaskListener(input: updateGlobalTaskListenerInput, /** Management of eventual consistency **/ consistencyManagement: updateGlobalTaskListenerConsistency): CancelablePromise<_DataOf<typeof Sdk.updateGlobalTaskListener>>;
  updateGlobalTaskListener(arg: any, /** Management of eventual consistency **/ consistencyManagement: updateGlobalTaskListenerConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { id, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { id };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateGlobalTaskListener', Schemas.zUpdateGlobalTaskListenerData, envelope);
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
          const _schema = Schemas.zUpdateGlobalTaskListenerResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('updateGlobalTaskListener', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Update group
   *
   * Update a group with the given ID.
    *
   * @operationId updateGroup
   * @tags Group
   */
  updateGroup(input: updateGroupInput): CancelablePromise<_DataOf<typeof Sdk.updateGroup>>;
  updateGroup(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { groupId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { groupId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateGroup', Schemas.zUpdateGroupData, envelope);
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
          const _schema = Schemas.zUpdateGroupResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateGroup', exempt: false });
    });
  }

  /**
   * Update job
   *
   * Update a job with the given key.
    *
   * @operationId updateJob
   * @tags Job
   */
  updateJob(input: updateJobInput): CancelablePromise<_DataOf<typeof Sdk.updateJob>>;
  updateJob(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { jobKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { jobKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateJob', Schemas.zUpdateJobData, envelope);
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
          const _schema = Schemas.zUpdateJobResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateJob', exempt: false });
    });
  }

  /**
   * Update mapping rule
   *
   * Update a mapping rule.
   *
    *
   * @operationId updateMappingRule
   * @tags Mapping rule
   */
  updateMappingRule(input: updateMappingRuleInput): CancelablePromise<_DataOf<typeof Sdk.updateMappingRule>>;
  updateMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { mappingRuleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { mappingRuleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateMappingRule', Schemas.zUpdateMappingRuleData, envelope);
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
          const _schema = Schemas.zUpdateMappingRuleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateMappingRule', exempt: false });
    });
  }

  /**
   * Update role
   *
   * Update a role with the given ID.
    *
   * @operationId updateRole
   * @tags Role
   */
  updateRole(input: updateRoleInput): CancelablePromise<_DataOf<typeof Sdk.updateRole>>;
  updateRole(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { roleId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { roleId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateRole', Schemas.zUpdateRoleData, envelope);
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
          const _schema = Schemas.zUpdateRoleResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateRole', exempt: false });
    });
  }

  /**
   * Update tenant
   *
   * Updates an existing tenant.
    *
   * @operationId updateTenant
   * @tags Tenant
   */
  updateTenant(input: updateTenantInput): CancelablePromise<_DataOf<typeof Sdk.updateTenant>>;
  updateTenant(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateTenant', Schemas.zUpdateTenantData, envelope);
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
          const _schema = Schemas.zUpdateTenantResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateTenant', exempt: false });
    });
  }

  /**
   * Update a tenant-scoped cluster variable
   *
   * Updates the value of an existing tenant-scoped cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @operationId updateTenantClusterVariable
   * @tags Cluster Variable
   */
  updateTenantClusterVariable(input: updateTenantClusterVariableInput): CancelablePromise<_DataOf<typeof Sdk.updateTenantClusterVariable>>;
  updateTenantClusterVariable(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { tenantId, name, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId, name };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateTenantClusterVariable', Schemas.zUpdateTenantClusterVariableData, envelope);
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
          const _schema = Schemas.zUpdateTenantClusterVariableResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateTenantClusterVariable', exempt: false });
    });
  }

  /**
   * Update user
   *
   * Updates a user.
    *
   * @operationId updateUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  updateUser(input: updateUserInput, /** Management of eventual consistency **/ consistencyManagement: updateUserConsistency): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: updateUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { username, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { username };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateUser', Schemas.zUpdateUserData, envelope);
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
          const _schema = Schemas.zUpdateUserResponse;
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
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('updateUser', false, invoke, { ...useConsistency, logger: this._log });
      return invoke();
    });
  }

  /**
   * Update user task
   *
   * Update a user task with the given key.
    *
   * @operationId updateUserTask
   * @tags User task
   */
  updateUserTask(input: updateUserTaskInput): CancelablePromise<_DataOf<typeof Sdk.updateUserTask>>;
  updateUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('updateUserTask', Schemas.zUpdateUserTaskData, envelope);
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
          const _schema = Schemas.zUpdateUserTaskResponse;
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
      return this._invokeWithRetry(() => call(), { opId: 'updateUserTask', exempt: false });
    });
  }

// === AUTO-GENERATED CAMUNDA METHODS END ===

  /**
   * Create a job worker that activates and processes jobs of the given type.
   * @param cfg Worker configuration
   * @example Create a job worker
   * {@includeCode ../../examples/job.ts#CreateJobWorker}
   * @example Job worker with error handling
   * {@includeCode ../../examples/job.ts#JobWorkerWithErrorHandling}
   */
  createJobWorker<
    In extends import('zod').ZodTypeAny = any,
    Out extends import('zod').ZodTypeAny = any,
    Headers extends import('zod').ZodTypeAny = any,
  >(cfg: JobWorkerConfig<In, Out, Headers>): JobWorker {
    const worker = new JobWorker(this as any, cfg as JobWorkerConfig);
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
