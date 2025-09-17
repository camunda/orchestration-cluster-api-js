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
import { ConsistencyOptions, eventualPoll } from '../runtime/eventual'
import { installAuthInterceptor } from '../runtime/installAuthInterceptor';
import { createLogger, Logger, LogLevel, LogTransport } from '../runtime/logger';
import { wrapFetch, withCorrelation as _withCorrelation, getCorrelation } from '../runtime/telemetry';
import { ValidationManager } from '../runtime/validationManager';
import type { Client } from '../gen/client/types.gen';


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
// Generated 2025-09-17T03:48:16.521Z
// Operations: 146
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;
type activateAdHocSubProcessActivitiesOptions = Parameters<typeof Sdk.activateAdHocSubProcessActivities>[0];
type activateAdHocSubProcessActivitiesBody = (NonNullable<activateAdHocSubProcessActivitiesOptions> extends { body?: infer B } ? B : never);
type activateAdHocSubProcessActivitiesPathParam_adHocSubProcessInstanceKey = (NonNullable<activateAdHocSubProcessActivitiesOptions> extends { path: { adHocSubProcessInstanceKey: infer P } } ? P : any);
type activateAdHocSubProcessActivitiesInput = activateAdHocSubProcessActivitiesBody & { adHocSubProcessInstanceKey: activateAdHocSubProcessActivitiesPathParam_adHocSubProcessInstanceKey };
type activateJobsOptions = Parameters<typeof Sdk.activateJobs>[0];
type activateJobsBody = (NonNullable<activateJobsOptions> extends { body?: infer B } ? B : never);
type activateJobsInput = activateJobsBody;
type assignClientToGroupOptions = Parameters<typeof Sdk.assignClientToGroup>[0];
type assignClientToGroupPathParam_groupId = (NonNullable<assignClientToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignClientToGroupPathParam_clientId = (NonNullable<assignClientToGroupOptions> extends { path: { clientId: infer P } } ? P : any);
type assignClientToGroupInput = { groupId: assignClientToGroupPathParam_groupId; clientId: assignClientToGroupPathParam_clientId };
type assignClientToTenantOptions = Parameters<typeof Sdk.assignClientToTenant>[0];
type assignClientToTenantPathParam_tenantId = (NonNullable<assignClientToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignClientToTenantPathParam_clientId = (NonNullable<assignClientToTenantOptions> extends { path: { clientId: infer P } } ? P : any);
type assignClientToTenantInput = { tenantId: assignClientToTenantPathParam_tenantId; clientId: assignClientToTenantPathParam_clientId };
type assignGroupToTenantOptions = Parameters<typeof Sdk.assignGroupToTenant>[0];
type assignGroupToTenantPathParam_tenantId = (NonNullable<assignGroupToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignGroupToTenantPathParam_groupId = (NonNullable<assignGroupToTenantOptions> extends { path: { groupId: infer P } } ? P : any);
type assignGroupToTenantInput = { tenantId: assignGroupToTenantPathParam_tenantId; groupId: assignGroupToTenantPathParam_groupId };
type assignMappingRuleToGroupOptions = Parameters<typeof Sdk.assignMappingRuleToGroup>[0];
type assignMappingRuleToGroupPathParam_groupId = (NonNullable<assignMappingRuleToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignMappingRuleToGroupPathParam_mappingRuleId = (NonNullable<assignMappingRuleToGroupOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type assignMappingRuleToGroupInput = { groupId: assignMappingRuleToGroupPathParam_groupId; mappingRuleId: assignMappingRuleToGroupPathParam_mappingRuleId };
type assignMappingRuleToTenantOptions = Parameters<typeof Sdk.assignMappingRuleToTenant>[0];
type assignMappingRuleToTenantPathParam_tenantId = (NonNullable<assignMappingRuleToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignMappingRuleToTenantPathParam_mappingRuleId = (NonNullable<assignMappingRuleToTenantOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type assignMappingRuleToTenantInput = { tenantId: assignMappingRuleToTenantPathParam_tenantId; mappingRuleId: assignMappingRuleToTenantPathParam_mappingRuleId };
type assignRoleToClientOptions = Parameters<typeof Sdk.assignRoleToClient>[0];
type assignRoleToClientPathParam_roleId = (NonNullable<assignRoleToClientOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToClientPathParam_clientId = (NonNullable<assignRoleToClientOptions> extends { path: { clientId: infer P } } ? P : any);
type assignRoleToClientInput = { roleId: assignRoleToClientPathParam_roleId; clientId: assignRoleToClientPathParam_clientId };
type assignRoleToGroupOptions = Parameters<typeof Sdk.assignRoleToGroup>[0];
type assignRoleToGroupPathParam_roleId = (NonNullable<assignRoleToGroupOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToGroupPathParam_groupId = (NonNullable<assignRoleToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignRoleToGroupInput = { roleId: assignRoleToGroupPathParam_roleId; groupId: assignRoleToGroupPathParam_groupId };
type assignRoleToMappingRuleOptions = Parameters<typeof Sdk.assignRoleToMappingRule>[0];
type assignRoleToMappingRulePathParam_roleId = (NonNullable<assignRoleToMappingRuleOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToMappingRulePathParam_mappingRuleId = (NonNullable<assignRoleToMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type assignRoleToMappingRuleInput = { roleId: assignRoleToMappingRulePathParam_roleId; mappingRuleId: assignRoleToMappingRulePathParam_mappingRuleId };
type assignRoleToTenantOptions = Parameters<typeof Sdk.assignRoleToTenant>[0];
type assignRoleToTenantPathParam_tenantId = (NonNullable<assignRoleToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignRoleToTenantPathParam_roleId = (NonNullable<assignRoleToTenantOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToTenantInput = { tenantId: assignRoleToTenantPathParam_tenantId; roleId: assignRoleToTenantPathParam_roleId };
type assignRoleToUserOptions = Parameters<typeof Sdk.assignRoleToUser>[0];
type assignRoleToUserPathParam_roleId = (NonNullable<assignRoleToUserOptions> extends { path: { roleId: infer P } } ? P : any);
type assignRoleToUserPathParam_username = (NonNullable<assignRoleToUserOptions> extends { path: { username: infer P } } ? P : any);
type assignRoleToUserInput = { roleId: assignRoleToUserPathParam_roleId; username: assignRoleToUserPathParam_username };
type assignUserTaskOptions = Parameters<typeof Sdk.assignUserTask>[0];
type assignUserTaskBody = (NonNullable<assignUserTaskOptions> extends { body?: infer B } ? B : never);
type assignUserTaskPathParam_userTaskKey = (NonNullable<assignUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type assignUserTaskInput = assignUserTaskBody & { userTaskKey: assignUserTaskPathParam_userTaskKey };
type assignUserToGroupOptions = Parameters<typeof Sdk.assignUserToGroup>[0];
type assignUserToGroupPathParam_groupId = (NonNullable<assignUserToGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type assignUserToGroupPathParam_username = (NonNullable<assignUserToGroupOptions> extends { path: { username: infer P } } ? P : any);
type assignUserToGroupInput = { groupId: assignUserToGroupPathParam_groupId; username: assignUserToGroupPathParam_username };
type assignUserToTenantOptions = Parameters<typeof Sdk.assignUserToTenant>[0];
type assignUserToTenantPathParam_tenantId = (NonNullable<assignUserToTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type assignUserToTenantPathParam_username = (NonNullable<assignUserToTenantOptions> extends { path: { username: infer P } } ? P : any);
type assignUserToTenantInput = { tenantId: assignUserToTenantPathParam_tenantId; username: assignUserToTenantPathParam_username };
type broadcastSignalOptions = Parameters<typeof Sdk.broadcastSignal>[0];
type broadcastSignalBody = (NonNullable<broadcastSignalOptions> extends { body?: infer B } ? B : never);
type broadcastSignalInput = broadcastSignalBody;
type cancelBatchOperationOptions = Parameters<typeof Sdk.cancelBatchOperation>[0];
type cancelBatchOperationBody = (NonNullable<cancelBatchOperationOptions> extends { body?: infer B } ? B : never);
type cancelBatchOperationPathParam_batchOperationKey = (NonNullable<cancelBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
type cancelBatchOperationInput = cancelBatchOperationBody & { batchOperationKey: cancelBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
type cancelBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelBatchOperation>> 
};
type cancelProcessInstanceOptions = Parameters<typeof Sdk.cancelProcessInstance>[0];
type cancelProcessInstanceBody = (NonNullable<cancelProcessInstanceOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancePathParam_processInstanceKey = (NonNullable<cancelProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type cancelProcessInstanceInput = cancelProcessInstanceBody & { processInstanceKey: cancelProcessInstancePathParam_processInstanceKey };
type cancelProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.cancelProcessInstancesBatchOperation>[0];
type cancelProcessInstancesBatchOperationBody = (NonNullable<cancelProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancesBatchOperationInput = cancelProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
type cancelProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>> 
};
type completeJobOptions = Parameters<typeof Sdk.completeJob>[0];
type completeJobBody = (NonNullable<completeJobOptions> extends { body?: infer B } ? B : never);
type completeJobPathParam_jobKey = (NonNullable<completeJobOptions> extends { path: { jobKey: infer P } } ? P : any);
type completeJobInput = completeJobBody & { jobKey: completeJobPathParam_jobKey };
type completeUserTaskOptions = Parameters<typeof Sdk.completeUserTask>[0];
type completeUserTaskBody = (NonNullable<completeUserTaskOptions> extends { body?: infer B } ? B : never);
type completeUserTaskPathParam_userTaskKey = (NonNullable<completeUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type completeUserTaskInput = completeUserTaskBody & { userTaskKey: completeUserTaskPathParam_userTaskKey };
type correlateMessageOptions = Parameters<typeof Sdk.correlateMessage>[0];
type correlateMessageBody = (NonNullable<correlateMessageOptions> extends { body?: infer B } ? B : never);
type correlateMessageInput = correlateMessageBody;
type createAdminUserOptions = Parameters<typeof Sdk.createAdminUser>[0];
type createAdminUserBody = (NonNullable<createAdminUserOptions> extends { body?: infer B } ? B : never);
type createAdminUserInput = createAdminUserBody;
/** Management of eventual consistency **/
type createAdminUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createAdminUser>> 
};
type createAuthorizationOptions = Parameters<typeof Sdk.createAuthorization>[0];
type createAuthorizationBody = (NonNullable<createAuthorizationOptions> extends { body?: infer B } ? B : never);
type createAuthorizationInput = createAuthorizationBody;
type createDeploymentOptions = Parameters<typeof Sdk.createDeployment>[0];
type createDeploymentBody = (NonNullable<createDeploymentOptions> extends { body?: infer B } ? B : never);
type createDeploymentInput = Omit<createDeploymentBody, 'resources'> & { resources: File[] };
type createDocumentOptions = Parameters<typeof Sdk.createDocument>[0];
type createDocumentBody = (NonNullable<createDocumentOptions> extends { body?: infer B } ? B : never);
type createDocumentQueryParam_storeId = (NonNullable<createDocumentOptions> extends { query: { storeId: infer Q } } ? Q : any);
type createDocumentQueryParam_documentId = (NonNullable<createDocumentOptions> extends { query: { documentId: infer Q } } ? Q : any);
type createDocumentInput = createDocumentBody & { storeId: createDocumentQueryParam_storeId; documentId: createDocumentQueryParam_documentId };
type createDocumentLinkOptions = Parameters<typeof Sdk.createDocumentLink>[0];
type createDocumentLinkBody = (NonNullable<createDocumentLinkOptions> extends { body?: infer B } ? B : never);
type createDocumentLinkPathParam_documentId = (NonNullable<createDocumentLinkOptions> extends { path: { documentId: infer P } } ? P : any);
type createDocumentLinkQueryParam_storeId = (NonNullable<createDocumentLinkOptions> extends { query: { storeId: infer Q } } ? Q : any);
type createDocumentLinkQueryParam_contentHash = (NonNullable<createDocumentLinkOptions> extends { query: { contentHash: infer Q } } ? Q : any);
type createDocumentLinkInput = createDocumentLinkBody & { documentId: createDocumentLinkPathParam_documentId; storeId: createDocumentLinkQueryParam_storeId; contentHash: createDocumentLinkQueryParam_contentHash };
type createDocumentsOptions = Parameters<typeof Sdk.createDocuments>[0];
type createDocumentsBody = (NonNullable<createDocumentsOptions> extends { body?: infer B } ? B : never);
type createDocumentsQueryParam_storeId = (NonNullable<createDocumentsOptions> extends { query: { storeId: infer Q } } ? Q : any);
type createDocumentsInput = createDocumentsBody & { storeId: createDocumentsQueryParam_storeId };
type createElementInstanceVariablesOptions = Parameters<typeof Sdk.createElementInstanceVariables>[0];
type createElementInstanceVariablesBody = (NonNullable<createElementInstanceVariablesOptions> extends { body?: infer B } ? B : never);
type createElementInstanceVariablesPathParam_elementInstanceKey = (NonNullable<createElementInstanceVariablesOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
type createElementInstanceVariablesInput = createElementInstanceVariablesBody & { elementInstanceKey: createElementInstanceVariablesPathParam_elementInstanceKey };
type createGroupOptions = Parameters<typeof Sdk.createGroup>[0];
type createGroupBody = (NonNullable<createGroupOptions> extends { body?: infer B } ? B : never);
type createGroupInput = createGroupBody;
type createMappingRuleOptions = Parameters<typeof Sdk.createMappingRule>[0];
type createMappingRuleBody = (NonNullable<createMappingRuleOptions> extends { body?: infer B } ? B : never);
type createMappingRuleInput = createMappingRuleBody;
type createProcessInstanceOptions = Parameters<typeof Sdk.createProcessInstance>[0];
type createProcessInstanceBody = (NonNullable<createProcessInstanceOptions> extends { body?: infer B } ? B : never);
type createProcessInstanceInput = createProcessInstanceBody;
type createRoleOptions = Parameters<typeof Sdk.createRole>[0];
type createRoleBody = (NonNullable<createRoleOptions> extends { body?: infer B } ? B : never);
type createRoleInput = createRoleBody;
type createTenantOptions = Parameters<typeof Sdk.createTenant>[0];
type createTenantBody = (NonNullable<createTenantOptions> extends { body?: infer B } ? B : never);
type createTenantInput = createTenantBody;
type createUserOptions = Parameters<typeof Sdk.createUser>[0];
type createUserBody = (NonNullable<createUserOptions> extends { body?: infer B } ? B : never);
type createUserInput = createUserBody;
/** Management of eventual consistency **/
type createUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createUser>> 
};
type deleteAuthorizationOptions = Parameters<typeof Sdk.deleteAuthorization>[0];
type deleteAuthorizationPathParam_authorizationKey = (NonNullable<deleteAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
type deleteAuthorizationInput = { authorizationKey: deleteAuthorizationPathParam_authorizationKey };
type deleteDocumentOptions = Parameters<typeof Sdk.deleteDocument>[0];
type deleteDocumentPathParam_documentId = (NonNullable<deleteDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type deleteDocumentQueryParam_storeId = (NonNullable<deleteDocumentOptions> extends { query: { storeId: infer Q } } ? Q : any);
type deleteDocumentInput = { documentId: deleteDocumentPathParam_documentId; storeId: deleteDocumentQueryParam_storeId };
type deleteGroupOptions = Parameters<typeof Sdk.deleteGroup>[0];
type deleteGroupPathParam_groupId = (NonNullable<deleteGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type deleteGroupInput = { groupId: deleteGroupPathParam_groupId };
type deleteMappingRuleOptions = Parameters<typeof Sdk.deleteMappingRule>[0];
type deleteMappingRulePathParam_mappingRuleId = (NonNullable<deleteMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type deleteMappingRuleInput = { mappingRuleId: deleteMappingRulePathParam_mappingRuleId };
type deleteResourceOptions = Parameters<typeof Sdk.deleteResource>[0];
type deleteResourceBody = (NonNullable<deleteResourceOptions> extends { body?: infer B } ? B : never);
type deleteResourcePathParam_resourceKey = (NonNullable<deleteResourceOptions> extends { path: { resourceKey: infer P } } ? P : any);
type deleteResourceInput = deleteResourceBody & { resourceKey: deleteResourcePathParam_resourceKey };
type deleteRoleOptions = Parameters<typeof Sdk.deleteRole>[0];
type deleteRolePathParam_roleId = (NonNullable<deleteRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type deleteRoleInput = { roleId: deleteRolePathParam_roleId };
type deleteTenantOptions = Parameters<typeof Sdk.deleteTenant>[0];
type deleteTenantPathParam_tenantId = (NonNullable<deleteTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type deleteTenantInput = { tenantId: deleteTenantPathParam_tenantId };
type deleteUserOptions = Parameters<typeof Sdk.deleteUser>[0];
type deleteUserPathParam_username = (NonNullable<deleteUserOptions> extends { path: { username: infer P } } ? P : any);
type deleteUserInput = { username: deleteUserPathParam_username };
/** Management of eventual consistency **/
type deleteUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteUser>> 
};
type evaluateDecisionOptions = Parameters<typeof Sdk.evaluateDecision>[0];
type evaluateDecisionBody = (NonNullable<evaluateDecisionOptions> extends { body?: infer B } ? B : never);
type evaluateDecisionInput = evaluateDecisionBody;
type failJobOptions = Parameters<typeof Sdk.failJob>[0];
type failJobBody = (NonNullable<failJobOptions> extends { body?: infer B } ? B : never);
type failJobPathParam_jobKey = (NonNullable<failJobOptions> extends { path: { jobKey: infer P } } ? P : any);
type failJobInput = failJobBody & { jobKey: failJobPathParam_jobKey };
type getAuthenticationOptions = Parameters<typeof Sdk.getAuthentication>[0];
type getAuthenticationInput = void;
type getAuthorizationOptions = Parameters<typeof Sdk.getAuthorization>[0];
type getAuthorizationPathParam_authorizationKey = (NonNullable<getAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
type getAuthorizationInput = { authorizationKey: getAuthorizationPathParam_authorizationKey };
/** Management of eventual consistency **/
type getAuthorizationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getAuthorization>> 
};
type getBatchOperationOptions = Parameters<typeof Sdk.getBatchOperation>[0];
type getBatchOperationPathParam_batchOperationKey = (NonNullable<getBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
type getBatchOperationInput = { batchOperationKey: getBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
type getBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getBatchOperation>> 
};
type getDecisionDefinitionOptions = Parameters<typeof Sdk.getDecisionDefinition>[0];
type getDecisionDefinitionPathParam_decisionDefinitionKey = (NonNullable<getDecisionDefinitionOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
type getDecisionDefinitionInput = { decisionDefinitionKey: getDecisionDefinitionPathParam_decisionDefinitionKey };
/** Management of eventual consistency **/
type getDecisionDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinition>> 
};
type getDecisionDefinitionXmlOptions = Parameters<typeof Sdk.getDecisionDefinitionXml>[0];
type getDecisionDefinitionXmlPathParam_decisionDefinitionKey = (NonNullable<getDecisionDefinitionXmlOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
type getDecisionDefinitionXmlInput = { decisionDefinitionKey: getDecisionDefinitionXmlPathParam_decisionDefinitionKey };
/** Management of eventual consistency **/
type getDecisionDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinitionXml>> 
};
type getDecisionInstanceOptions = Parameters<typeof Sdk.getDecisionInstance>[0];
type getDecisionInstancePathParam_decisionEvaluationInstanceKey = (NonNullable<getDecisionInstanceOptions> extends { path: { decisionEvaluationInstanceKey: infer P } } ? P : any);
type getDecisionInstanceInput = { decisionEvaluationInstanceKey: getDecisionInstancePathParam_decisionEvaluationInstanceKey };
/** Management of eventual consistency **/
type getDecisionInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionInstance>> 
};
type getDecisionRequirementsOptions = Parameters<typeof Sdk.getDecisionRequirements>[0];
type getDecisionRequirementsPathParam_decisionRequirementsKey = (NonNullable<getDecisionRequirementsOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
type getDecisionRequirementsInput = { decisionRequirementsKey: getDecisionRequirementsPathParam_decisionRequirementsKey };
/** Management of eventual consistency **/
type getDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirements>> 
};
type getDecisionRequirementsXmlOptions = Parameters<typeof Sdk.getDecisionRequirementsXml>[0];
type getDecisionRequirementsXmlPathParam_decisionRequirementsKey = (NonNullable<getDecisionRequirementsXmlOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
type getDecisionRequirementsXmlInput = { decisionRequirementsKey: getDecisionRequirementsXmlPathParam_decisionRequirementsKey };
/** Management of eventual consistency **/
type getDecisionRequirementsXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirementsXml>> 
};
type getDocumentOptions = Parameters<typeof Sdk.getDocument>[0];
type getDocumentPathParam_documentId = (NonNullable<getDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type getDocumentQueryParam_storeId = (NonNullable<getDocumentOptions> extends { query: { storeId: infer Q } } ? Q : any);
type getDocumentQueryParam_contentHash = (NonNullable<getDocumentOptions> extends { query: { contentHash: infer Q } } ? Q : any);
type getDocumentInput = { documentId: getDocumentPathParam_documentId; storeId: getDocumentQueryParam_storeId; contentHash: getDocumentQueryParam_contentHash };
type getElementInstanceOptions = Parameters<typeof Sdk.getElementInstance>[0];
type getElementInstancePathParam_elementInstanceKey = (NonNullable<getElementInstanceOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
type getElementInstanceInput = { elementInstanceKey: getElementInstancePathParam_elementInstanceKey };
/** Management of eventual consistency **/
type getElementInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getElementInstance>> 
};
type getGroupOptions = Parameters<typeof Sdk.getGroup>[0];
type getGroupPathParam_groupId = (NonNullable<getGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type getGroupInput = { groupId: getGroupPathParam_groupId };
/** Management of eventual consistency **/
type getGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGroup>> 
};
type getIncidentOptions = Parameters<typeof Sdk.getIncident>[0];
type getIncidentPathParam_incidentKey = (NonNullable<getIncidentOptions> extends { path: { incidentKey: infer P } } ? P : any);
type getIncidentInput = { incidentKey: getIncidentPathParam_incidentKey };
/** Management of eventual consistency **/
type getIncidentConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getIncident>> 
};
type getLicenseOptions = Parameters<typeof Sdk.getLicense>[0];
type getLicenseInput = void;
type getMappingRuleOptions = Parameters<typeof Sdk.getMappingRule>[0];
type getMappingRulePathParam_mappingRuleId = (NonNullable<getMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type getMappingRuleInput = { mappingRuleId: getMappingRulePathParam_mappingRuleId };
/** Management of eventual consistency **/
type getMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getMappingRule>> 
};
type getProcessDefinitionOptions = Parameters<typeof Sdk.getProcessDefinition>[0];
type getProcessDefinitionPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
type getProcessDefinitionInput = { processDefinitionKey: getProcessDefinitionPathParam_processDefinitionKey };
/** Management of eventual consistency **/
type getProcessDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinition>> 
};
type getProcessDefinitionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionStatistics>[0];
type getProcessDefinitionStatisticsBody = (NonNullable<getProcessDefinitionStatisticsOptions> extends { body?: infer B } ? B : never);
type getProcessDefinitionStatisticsPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionStatisticsOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
type getProcessDefinitionStatisticsInput = getProcessDefinitionStatisticsBody & { processDefinitionKey: getProcessDefinitionStatisticsPathParam_processDefinitionKey };
/** Management of eventual consistency **/
type getProcessDefinitionStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionStatistics>> 
};
type getProcessDefinitionXmlOptions = Parameters<typeof Sdk.getProcessDefinitionXml>[0];
type getProcessDefinitionXmlPathParam_processDefinitionKey = (NonNullable<getProcessDefinitionXmlOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
type getProcessDefinitionXmlInput = { processDefinitionKey: getProcessDefinitionXmlPathParam_processDefinitionKey };
/** Management of eventual consistency **/
type getProcessDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionXml>> 
};
type getProcessInstanceOptions = Parameters<typeof Sdk.getProcessInstance>[0];
type getProcessInstancePathParam_processInstanceKey = (NonNullable<getProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type getProcessInstanceInput = { processInstanceKey: getProcessInstancePathParam_processInstanceKey };
/** Management of eventual consistency **/
type getProcessInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstance>> 
};
type getProcessInstanceCallHierarchyOptions = Parameters<typeof Sdk.getProcessInstanceCallHierarchy>[0];
type getProcessInstanceCallHierarchyPathParam_processInstanceKey = (NonNullable<getProcessInstanceCallHierarchyOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type getProcessInstanceCallHierarchyInput = { processInstanceKey: getProcessInstanceCallHierarchyPathParam_processInstanceKey };
/** Management of eventual consistency **/
type getProcessInstanceCallHierarchyConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>> 
};
type getProcessInstanceSequenceFlowsOptions = Parameters<typeof Sdk.getProcessInstanceSequenceFlows>[0];
type getProcessInstanceSequenceFlowsPathParam_processInstanceKey = (NonNullable<getProcessInstanceSequenceFlowsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type getProcessInstanceSequenceFlowsInput = { processInstanceKey: getProcessInstanceSequenceFlowsPathParam_processInstanceKey };
/** Management of eventual consistency **/
type getProcessInstanceSequenceFlowsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>> 
};
type getProcessInstanceStatisticsOptions = Parameters<typeof Sdk.getProcessInstanceStatistics>[0];
type getProcessInstanceStatisticsPathParam_processInstanceKey = (NonNullable<getProcessInstanceStatisticsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type getProcessInstanceStatisticsInput = { processInstanceKey: getProcessInstanceStatisticsPathParam_processInstanceKey };
/** Management of eventual consistency **/
type getProcessInstanceStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatistics>> 
};
type getResourceOptions = Parameters<typeof Sdk.getResource>[0];
type getResourcePathParam_resourceKey = (NonNullable<getResourceOptions> extends { path: { resourceKey: infer P } } ? P : any);
type getResourceInput = { resourceKey: getResourcePathParam_resourceKey };
type getResourceContentOptions = Parameters<typeof Sdk.getResourceContent>[0];
type getResourceContentPathParam_resourceKey = (NonNullable<getResourceContentOptions> extends { path: { resourceKey: infer P } } ? P : any);
type getResourceContentInput = { resourceKey: getResourceContentPathParam_resourceKey };
type getRoleOptions = Parameters<typeof Sdk.getRole>[0];
type getRolePathParam_roleId = (NonNullable<getRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type getRoleInput = { roleId: getRolePathParam_roleId };
/** Management of eventual consistency **/
type getRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getRole>> 
};
type getStartProcessFormOptions = Parameters<typeof Sdk.getStartProcessForm>[0];
type getStartProcessFormPathParam_processDefinitionKey = (NonNullable<getStartProcessFormOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
type getStartProcessFormInput = { processDefinitionKey: getStartProcessFormPathParam_processDefinitionKey };
/** Management of eventual consistency **/
type getStartProcessFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getStartProcessForm>> 
};
type getStatusOptions = Parameters<typeof Sdk.getStatus>[0];
type getStatusInput = void;
type getTenantOptions = Parameters<typeof Sdk.getTenant>[0];
type getTenantPathParam_tenantId = (NonNullable<getTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type getTenantInput = { tenantId: getTenantPathParam_tenantId };
/** Management of eventual consistency **/
type getTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenant>> 
};
type getTopologyOptions = Parameters<typeof Sdk.getTopology>[0];
type getTopologyInput = void;
type getUsageMetricsOptions = Parameters<typeof Sdk.getUsageMetrics>[0];
type getUsageMetricsQueryParam_startTime = (NonNullable<getUsageMetricsOptions> extends { query: { startTime: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_endTime = (NonNullable<getUsageMetricsOptions> extends { query: { endTime: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_tenantId = (NonNullable<getUsageMetricsOptions> extends { query: { tenantId: infer Q } } ? Q : any);
type getUsageMetricsQueryParam_withTenants = (NonNullable<getUsageMetricsOptions> extends { query: { withTenants: infer Q } } ? Q : any);
type getUsageMetricsInput = { startTime: getUsageMetricsQueryParam_startTime; endTime: getUsageMetricsQueryParam_endTime; tenantId: getUsageMetricsQueryParam_tenantId; withTenants: getUsageMetricsQueryParam_withTenants };
/** Management of eventual consistency **/
type getUsageMetricsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUsageMetrics>> 
};
type getUserOptions = Parameters<typeof Sdk.getUser>[0];
type getUserPathParam_username = (NonNullable<getUserOptions> extends { path: { username: infer P } } ? P : any);
type getUserInput = { username: getUserPathParam_username };
/** Management of eventual consistency **/
type getUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUser>> 
};
type getUserTaskOptions = Parameters<typeof Sdk.getUserTask>[0];
type getUserTaskPathParam_userTaskKey = (NonNullable<getUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type getUserTaskInput = { userTaskKey: getUserTaskPathParam_userTaskKey };
/** Management of eventual consistency **/
type getUserTaskConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTask>> 
};
type getUserTaskFormOptions = Parameters<typeof Sdk.getUserTaskForm>[0];
type getUserTaskFormPathParam_userTaskKey = (NonNullable<getUserTaskFormOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type getUserTaskFormInput = { userTaskKey: getUserTaskFormPathParam_userTaskKey };
/** Management of eventual consistency **/
type getUserTaskFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTaskForm>> 
};
type getVariableOptions = Parameters<typeof Sdk.getVariable>[0];
type getVariablePathParam_variableKey = (NonNullable<getVariableOptions> extends { path: { variableKey: infer P } } ? P : any);
type getVariableInput = { variableKey: getVariablePathParam_variableKey };
/** Management of eventual consistency **/
type getVariableConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getVariable>> 
};
type migrateProcessInstanceOptions = Parameters<typeof Sdk.migrateProcessInstance>[0];
type migrateProcessInstanceBody = (NonNullable<migrateProcessInstanceOptions> extends { body?: infer B } ? B : never);
type migrateProcessInstancePathParam_processInstanceKey = (NonNullable<migrateProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type migrateProcessInstanceInput = migrateProcessInstanceBody & { processInstanceKey: migrateProcessInstancePathParam_processInstanceKey };
type migrateProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.migrateProcessInstancesBatchOperation>[0];
type migrateProcessInstancesBatchOperationBody = (NonNullable<migrateProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type migrateProcessInstancesBatchOperationInput = migrateProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
type migrateProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>> 
};
type modifyProcessInstanceOptions = Parameters<typeof Sdk.modifyProcessInstance>[0];
type modifyProcessInstanceBody = (NonNullable<modifyProcessInstanceOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancePathParam_processInstanceKey = (NonNullable<modifyProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type modifyProcessInstanceInput = modifyProcessInstanceBody & { processInstanceKey: modifyProcessInstancePathParam_processInstanceKey };
type modifyProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.modifyProcessInstancesBatchOperation>[0];
type modifyProcessInstancesBatchOperationBody = (NonNullable<modifyProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancesBatchOperationInput = modifyProcessInstancesBatchOperationBody;
/** Management of eventual consistency **/
type modifyProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>> 
};
type pinClockOptions = Parameters<typeof Sdk.pinClock>[0];
type pinClockBody = (NonNullable<pinClockOptions> extends { body?: infer B } ? B : never);
type pinClockInput = pinClockBody;
type publishMessageOptions = Parameters<typeof Sdk.publishMessage>[0];
type publishMessageBody = (NonNullable<publishMessageOptions> extends { body?: infer B } ? B : never);
type publishMessageInput = publishMessageBody;
type resetClockOptions = Parameters<typeof Sdk.resetClock>[0];
type resetClockInput = void;
type resolveIncidentOptions = Parameters<typeof Sdk.resolveIncident>[0];
type resolveIncidentBody = (NonNullable<resolveIncidentOptions> extends { body?: infer B } ? B : never);
type resolveIncidentPathParam_incidentKey = (NonNullable<resolveIncidentOptions> extends { path: { incidentKey: infer P } } ? P : any);
type resolveIncidentInput = resolveIncidentBody & { incidentKey: resolveIncidentPathParam_incidentKey };
type resolveIncidentsBatchOperationOptions = Parameters<typeof Sdk.resolveIncidentsBatchOperation>[0];
type resolveIncidentsBatchOperationBody = (NonNullable<resolveIncidentsBatchOperationOptions> extends { body?: infer B } ? B : never);
type resolveIncidentsBatchOperationInput = resolveIncidentsBatchOperationBody;
/** Management of eventual consistency **/
type resolveIncidentsBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>> 
};
type resumeBatchOperationOptions = Parameters<typeof Sdk.resumeBatchOperation>[0];
type resumeBatchOperationBody = (NonNullable<resumeBatchOperationOptions> extends { body?: infer B } ? B : never);
type resumeBatchOperationPathParam_batchOperationKey = (NonNullable<resumeBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
type resumeBatchOperationInput = resumeBatchOperationBody & { batchOperationKey: resumeBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
type resumeBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resumeBatchOperation>> 
};
type searchAuthorizationsOptions = Parameters<typeof Sdk.searchAuthorizations>[0];
type searchAuthorizationsBody = (NonNullable<searchAuthorizationsOptions> extends { body?: infer B } ? B : never);
type searchAuthorizationsInput = searchAuthorizationsBody;
/** Management of eventual consistency **/
type searchAuthorizationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuthorizations>> 
};
type searchBatchOperationItemsOptions = Parameters<typeof Sdk.searchBatchOperationItems>[0];
type searchBatchOperationItemsBody = (NonNullable<searchBatchOperationItemsOptions> extends { body?: infer B } ? B : never);
type searchBatchOperationItemsInput = searchBatchOperationItemsBody;
/** Management of eventual consistency **/
type searchBatchOperationItemsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperationItems>> 
};
type searchBatchOperationsOptions = Parameters<typeof Sdk.searchBatchOperations>[0];
type searchBatchOperationsBody = (NonNullable<searchBatchOperationsOptions> extends { body?: infer B } ? B : never);
type searchBatchOperationsInput = searchBatchOperationsBody;
/** Management of eventual consistency **/
type searchBatchOperationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperations>> 
};
type searchClientsForGroupOptions = Parameters<typeof Sdk.searchClientsForGroup>[0];
type searchClientsForGroupBody = (NonNullable<searchClientsForGroupOptions> extends { body?: infer B } ? B : never);
type searchClientsForGroupPathParam_groupId = (NonNullable<searchClientsForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type searchClientsForGroupInput = searchClientsForGroupBody & { groupId: searchClientsForGroupPathParam_groupId };
/** Management of eventual consistency **/
type searchClientsForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForGroup>> 
};
type searchClientsForRoleOptions = Parameters<typeof Sdk.searchClientsForRole>[0];
type searchClientsForRoleBody = (NonNullable<searchClientsForRoleOptions> extends { body?: infer B } ? B : never);
type searchClientsForRolePathParam_roleId = (NonNullable<searchClientsForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type searchClientsForRoleInput = searchClientsForRoleBody & { roleId: searchClientsForRolePathParam_roleId };
/** Management of eventual consistency **/
type searchClientsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForRole>> 
};
type searchClientsForTenantOptions = Parameters<typeof Sdk.searchClientsForTenant>[0];
type searchClientsForTenantBody = (NonNullable<searchClientsForTenantOptions> extends { body?: infer B } ? B : never);
type searchClientsForTenantPathParam_tenantId = (NonNullable<searchClientsForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type searchClientsForTenantInput = searchClientsForTenantBody & { tenantId: searchClientsForTenantPathParam_tenantId };
/** Management of eventual consistency **/
type searchClientsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForTenant>> 
};
type searchCorrelatedMessagesOptions = Parameters<typeof Sdk.searchCorrelatedMessages>[0];
type searchCorrelatedMessagesBody = (NonNullable<searchCorrelatedMessagesOptions> extends { body?: infer B } ? B : never);
type searchCorrelatedMessagesInput = searchCorrelatedMessagesBody;
/** Management of eventual consistency **/
type searchCorrelatedMessagesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchCorrelatedMessages>> 
};
type searchDecisionDefinitionsOptions = Parameters<typeof Sdk.searchDecisionDefinitions>[0];
type searchDecisionDefinitionsBody = (NonNullable<searchDecisionDefinitionsOptions> extends { body?: infer B } ? B : never);
type searchDecisionDefinitionsInput = searchDecisionDefinitionsBody;
/** Management of eventual consistency **/
type searchDecisionDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionDefinitions>> 
};
type searchDecisionInstancesOptions = Parameters<typeof Sdk.searchDecisionInstances>[0];
type searchDecisionInstancesBody = (NonNullable<searchDecisionInstancesOptions> extends { body?: infer B } ? B : never);
type searchDecisionInstancesInput = searchDecisionInstancesBody;
/** Management of eventual consistency **/
type searchDecisionInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionInstances>> 
};
type searchDecisionRequirementsOptions = Parameters<typeof Sdk.searchDecisionRequirements>[0];
type searchDecisionRequirementsBody = (NonNullable<searchDecisionRequirementsOptions> extends { body?: infer B } ? B : never);
type searchDecisionRequirementsInput = searchDecisionRequirementsBody;
/** Management of eventual consistency **/
type searchDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionRequirements>> 
};
type searchElementInstancesOptions = Parameters<typeof Sdk.searchElementInstances>[0];
type searchElementInstancesBody = (NonNullable<searchElementInstancesOptions> extends { body?: infer B } ? B : never);
type searchElementInstancesInput = searchElementInstancesBody;
/** Management of eventual consistency **/
type searchElementInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchElementInstances>> 
};
type searchGroupIdsForTenantOptions = Parameters<typeof Sdk.searchGroupIdsForTenant>[0];
type searchGroupIdsForTenantBody = (NonNullable<searchGroupIdsForTenantOptions> extends { body?: infer B } ? B : never);
type searchGroupIdsForTenantPathParam_tenantId = (NonNullable<searchGroupIdsForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type searchGroupIdsForTenantInput = searchGroupIdsForTenantBody & { tenantId: searchGroupIdsForTenantPathParam_tenantId };
/** Management of eventual consistency **/
type searchGroupIdsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupIdsForTenant>> 
};
type searchGroupsOptions = Parameters<typeof Sdk.searchGroups>[0];
type searchGroupsBody = (NonNullable<searchGroupsOptions> extends { body?: infer B } ? B : never);
type searchGroupsInput = searchGroupsBody;
/** Management of eventual consistency **/
type searchGroupsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroups>> 
};
type searchGroupsForRoleOptions = Parameters<typeof Sdk.searchGroupsForRole>[0];
type searchGroupsForRoleBody = (NonNullable<searchGroupsForRoleOptions> extends { body?: infer B } ? B : never);
type searchGroupsForRolePathParam_roleId = (NonNullable<searchGroupsForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type searchGroupsForRoleInput = searchGroupsForRoleBody & { roleId: searchGroupsForRolePathParam_roleId };
/** Management of eventual consistency **/
type searchGroupsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupsForRole>> 
};
type searchIncidentsOptions = Parameters<typeof Sdk.searchIncidents>[0];
type searchIncidentsBody = (NonNullable<searchIncidentsOptions> extends { body?: infer B } ? B : never);
type searchIncidentsInput = searchIncidentsBody;
/** Management of eventual consistency **/
type searchIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchIncidents>> 
};
type searchJobsOptions = Parameters<typeof Sdk.searchJobs>[0];
type searchJobsBody = (NonNullable<searchJobsOptions> extends { body?: infer B } ? B : never);
type searchJobsInput = searchJobsBody;
/** Management of eventual consistency **/
type searchJobsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchJobs>> 
};
type searchMappingRuleOptions = Parameters<typeof Sdk.searchMappingRule>[0];
type searchMappingRuleBody = (NonNullable<searchMappingRuleOptions> extends { body?: infer B } ? B : never);
type searchMappingRuleInput = searchMappingRuleBody;
/** Management of eventual consistency **/
type searchMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRule>> 
};
type searchMappingRulesForGroupOptions = Parameters<typeof Sdk.searchMappingRulesForGroup>[0];
type searchMappingRulesForGroupBody = (NonNullable<searchMappingRulesForGroupOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForGroupPathParam_groupId = (NonNullable<searchMappingRulesForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type searchMappingRulesForGroupInput = searchMappingRulesForGroupBody & { groupId: searchMappingRulesForGroupPathParam_groupId };
/** Management of eventual consistency **/
type searchMappingRulesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForGroup>> 
};
type searchMappingRulesForRoleOptions = Parameters<typeof Sdk.searchMappingRulesForRole>[0];
type searchMappingRulesForRoleBody = (NonNullable<searchMappingRulesForRoleOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForRolePathParam_roleId = (NonNullable<searchMappingRulesForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type searchMappingRulesForRoleInput = searchMappingRulesForRoleBody & { roleId: searchMappingRulesForRolePathParam_roleId };
/** Management of eventual consistency **/
type searchMappingRulesForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForRole>> 
};
type searchMappingsForTenantOptions = Parameters<typeof Sdk.searchMappingsForTenant>[0];
type searchMappingsForTenantBody = (NonNullable<searchMappingsForTenantOptions> extends { body?: infer B } ? B : never);
type searchMappingsForTenantPathParam_tenantId = (NonNullable<searchMappingsForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type searchMappingsForTenantInput = searchMappingsForTenantBody & { tenantId: searchMappingsForTenantPathParam_tenantId };
/** Management of eventual consistency **/
type searchMappingsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingsForTenant>> 
};
type searchMessageSubscriptionsOptions = Parameters<typeof Sdk.searchMessageSubscriptions>[0];
type searchMessageSubscriptionsBody = (NonNullable<searchMessageSubscriptionsOptions> extends { body?: infer B } ? B : never);
type searchMessageSubscriptionsInput = searchMessageSubscriptionsBody;
/** Management of eventual consistency **/
type searchMessageSubscriptionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMessageSubscriptions>> 
};
type searchProcessDefinitionsOptions = Parameters<typeof Sdk.searchProcessDefinitions>[0];
type searchProcessDefinitionsBody = (NonNullable<searchProcessDefinitionsOptions> extends { body?: infer B } ? B : never);
type searchProcessDefinitionsInput = searchProcessDefinitionsBody;
/** Management of eventual consistency **/
type searchProcessDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessDefinitions>> 
};
type searchProcessInstanceIncidentsOptions = Parameters<typeof Sdk.searchProcessInstanceIncidents>[0];
type searchProcessInstanceIncidentsBody = (NonNullable<searchProcessInstanceIncidentsOptions> extends { body?: infer B } ? B : never);
type searchProcessInstanceIncidentsPathParam_processInstanceKey = (NonNullable<searchProcessInstanceIncidentsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
type searchProcessInstanceIncidentsInput = searchProcessInstanceIncidentsBody & { processInstanceKey: searchProcessInstanceIncidentsPathParam_processInstanceKey };
/** Management of eventual consistency **/
type searchProcessInstanceIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstanceIncidents>> 
};
type searchProcessInstancesOptions = Parameters<typeof Sdk.searchProcessInstances>[0];
type searchProcessInstancesBody = (NonNullable<searchProcessInstancesOptions> extends { body?: infer B } ? B : never);
type searchProcessInstancesInput = searchProcessInstancesBody;
/** Management of eventual consistency **/
type searchProcessInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstances>> 
};
type searchRolesOptions = Parameters<typeof Sdk.searchRoles>[0];
type searchRolesBody = (NonNullable<searchRolesOptions> extends { body?: infer B } ? B : never);
type searchRolesInput = searchRolesBody;
/** Management of eventual consistency **/
type searchRolesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRoles>> 
};
type searchRolesForGroupOptions = Parameters<typeof Sdk.searchRolesForGroup>[0];
type searchRolesForGroupBody = (NonNullable<searchRolesForGroupOptions> extends { body?: infer B } ? B : never);
type searchRolesForGroupPathParam_groupId = (NonNullable<searchRolesForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type searchRolesForGroupInput = searchRolesForGroupBody & { groupId: searchRolesForGroupPathParam_groupId };
/** Management of eventual consistency **/
type searchRolesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForGroup>> 
};
type searchRolesForTenantOptions = Parameters<typeof Sdk.searchRolesForTenant>[0];
type searchRolesForTenantBody = (NonNullable<searchRolesForTenantOptions> extends { body?: infer B } ? B : never);
type searchRolesForTenantPathParam_tenantId = (NonNullable<searchRolesForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type searchRolesForTenantInput = searchRolesForTenantBody & { tenantId: searchRolesForTenantPathParam_tenantId };
/** Management of eventual consistency **/
type searchRolesForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForTenant>> 
};
type searchTenantsOptions = Parameters<typeof Sdk.searchTenants>[0];
type searchTenantsBody = (NonNullable<searchTenantsOptions> extends { body?: infer B } ? B : never);
type searchTenantsInput = searchTenantsBody;
/** Management of eventual consistency **/
type searchTenantsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchTenants>> 
};
type searchUsersOptions = Parameters<typeof Sdk.searchUsers>[0];
type searchUsersBody = (NonNullable<searchUsersOptions> extends { body?: infer B } ? B : never);
type searchUsersInput = searchUsersBody;
/** Management of eventual consistency **/
type searchUsersConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsers>> 
};
type searchUsersForGroupOptions = Parameters<typeof Sdk.searchUsersForGroup>[0];
type searchUsersForGroupBody = (NonNullable<searchUsersForGroupOptions> extends { body?: infer B } ? B : never);
type searchUsersForGroupPathParam_groupId = (NonNullable<searchUsersForGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type searchUsersForGroupInput = searchUsersForGroupBody & { groupId: searchUsersForGroupPathParam_groupId };
/** Management of eventual consistency **/
type searchUsersForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForGroup>> 
};
type searchUsersForRoleOptions = Parameters<typeof Sdk.searchUsersForRole>[0];
type searchUsersForRoleBody = (NonNullable<searchUsersForRoleOptions> extends { body?: infer B } ? B : never);
type searchUsersForRolePathParam_roleId = (NonNullable<searchUsersForRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type searchUsersForRoleInput = searchUsersForRoleBody & { roleId: searchUsersForRolePathParam_roleId };
/** Management of eventual consistency **/
type searchUsersForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForRole>> 
};
type searchUsersForTenantOptions = Parameters<typeof Sdk.searchUsersForTenant>[0];
type searchUsersForTenantBody = (NonNullable<searchUsersForTenantOptions> extends { body?: infer B } ? B : never);
type searchUsersForTenantPathParam_tenantId = (NonNullable<searchUsersForTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type searchUsersForTenantInput = searchUsersForTenantBody & { tenantId: searchUsersForTenantPathParam_tenantId };
/** Management of eventual consistency **/
type searchUsersForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForTenant>> 
};
type searchUserTasksOptions = Parameters<typeof Sdk.searchUserTasks>[0];
type searchUserTasksBody = (NonNullable<searchUserTasksOptions> extends { body?: infer B } ? B : never);
type searchUserTasksInput = searchUserTasksBody;
/** Management of eventual consistency **/
type searchUserTasksConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTasks>> 
};
type searchUserTaskVariablesOptions = Parameters<typeof Sdk.searchUserTaskVariables>[0];
type searchUserTaskVariablesBody = (NonNullable<searchUserTaskVariablesOptions> extends { body?: infer B } ? B : never);
type searchUserTaskVariablesPathParam_userTaskKey = (NonNullable<searchUserTaskVariablesOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type searchUserTaskVariablesInput = searchUserTaskVariablesBody & { userTaskKey: searchUserTaskVariablesPathParam_userTaskKey };
/** Management of eventual consistency **/
type searchUserTaskVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTaskVariables>> 
};
type searchVariablesOptions = Parameters<typeof Sdk.searchVariables>[0];
type searchVariablesBody = (NonNullable<searchVariablesOptions> extends { body?: infer B } ? B : never);
type searchVariablesInput = searchVariablesBody;
/** Management of eventual consistency **/
type searchVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchVariables>> 
};
type suspendBatchOperationOptions = Parameters<typeof Sdk.suspendBatchOperation>[0];
type suspendBatchOperationBody = (NonNullable<suspendBatchOperationOptions> extends { body?: infer B } ? B : never);
type suspendBatchOperationPathParam_batchOperationKey = (NonNullable<suspendBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
type suspendBatchOperationInput = suspendBatchOperationBody & { batchOperationKey: suspendBatchOperationPathParam_batchOperationKey };
/** Management of eventual consistency **/
type suspendBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.suspendBatchOperation>> 
};
type throwJobErrorOptions = Parameters<typeof Sdk.throwJobError>[0];
type throwJobErrorBody = (NonNullable<throwJobErrorOptions> extends { body?: infer B } ? B : never);
type throwJobErrorPathParam_jobKey = (NonNullable<throwJobErrorOptions> extends { path: { jobKey: infer P } } ? P : any);
type throwJobErrorInput = throwJobErrorBody & { jobKey: throwJobErrorPathParam_jobKey };
type unassignClientFromGroupOptions = Parameters<typeof Sdk.unassignClientFromGroup>[0];
type unassignClientFromGroupPathParam_groupId = (NonNullable<unassignClientFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignClientFromGroupPathParam_clientId = (NonNullable<unassignClientFromGroupOptions> extends { path: { clientId: infer P } } ? P : any);
type unassignClientFromGroupInput = { groupId: unassignClientFromGroupPathParam_groupId; clientId: unassignClientFromGroupPathParam_clientId };
type unassignClientFromTenantOptions = Parameters<typeof Sdk.unassignClientFromTenant>[0];
type unassignClientFromTenantPathParam_tenantId = (NonNullable<unassignClientFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignClientFromTenantPathParam_clientId = (NonNullable<unassignClientFromTenantOptions> extends { path: { clientId: infer P } } ? P : any);
type unassignClientFromTenantInput = { tenantId: unassignClientFromTenantPathParam_tenantId; clientId: unassignClientFromTenantPathParam_clientId };
type unassignGroupFromTenantOptions = Parameters<typeof Sdk.unassignGroupFromTenant>[0];
type unassignGroupFromTenantPathParam_tenantId = (NonNullable<unassignGroupFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignGroupFromTenantPathParam_groupId = (NonNullable<unassignGroupFromTenantOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignGroupFromTenantInput = { tenantId: unassignGroupFromTenantPathParam_tenantId; groupId: unassignGroupFromTenantPathParam_groupId };
type unassignMappingRuleFromGroupOptions = Parameters<typeof Sdk.unassignMappingRuleFromGroup>[0];
type unassignMappingRuleFromGroupPathParam_groupId = (NonNullable<unassignMappingRuleFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignMappingRuleFromGroupPathParam_mappingRuleId = (NonNullable<unassignMappingRuleFromGroupOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type unassignMappingRuleFromGroupInput = { groupId: unassignMappingRuleFromGroupPathParam_groupId; mappingRuleId: unassignMappingRuleFromGroupPathParam_mappingRuleId };
type unassignMappingRuleFromTenantOptions = Parameters<typeof Sdk.unassignMappingRuleFromTenant>[0];
type unassignMappingRuleFromTenantPathParam_tenantId = (NonNullable<unassignMappingRuleFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignMappingRuleFromTenantPathParam_mappingRuleId = (NonNullable<unassignMappingRuleFromTenantOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type unassignMappingRuleFromTenantInput = { tenantId: unassignMappingRuleFromTenantPathParam_tenantId; mappingRuleId: unassignMappingRuleFromTenantPathParam_mappingRuleId };
type unassignRoleFromClientOptions = Parameters<typeof Sdk.unassignRoleFromClient>[0];
type unassignRoleFromClientPathParam_roleId = (NonNullable<unassignRoleFromClientOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromClientPathParam_clientId = (NonNullable<unassignRoleFromClientOptions> extends { path: { clientId: infer P } } ? P : any);
type unassignRoleFromClientInput = { roleId: unassignRoleFromClientPathParam_roleId; clientId: unassignRoleFromClientPathParam_clientId };
type unassignRoleFromGroupOptions = Parameters<typeof Sdk.unassignRoleFromGroup>[0];
type unassignRoleFromGroupPathParam_roleId = (NonNullable<unassignRoleFromGroupOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromGroupPathParam_groupId = (NonNullable<unassignRoleFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignRoleFromGroupInput = { roleId: unassignRoleFromGroupPathParam_roleId; groupId: unassignRoleFromGroupPathParam_groupId };
type unassignRoleFromMappingRuleOptions = Parameters<typeof Sdk.unassignRoleFromMappingRule>[0];
type unassignRoleFromMappingRulePathParam_roleId = (NonNullable<unassignRoleFromMappingRuleOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromMappingRulePathParam_mappingRuleId = (NonNullable<unassignRoleFromMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type unassignRoleFromMappingRuleInput = { roleId: unassignRoleFromMappingRulePathParam_roleId; mappingRuleId: unassignRoleFromMappingRulePathParam_mappingRuleId };
type unassignRoleFromTenantOptions = Parameters<typeof Sdk.unassignRoleFromTenant>[0];
type unassignRoleFromTenantPathParam_tenantId = (NonNullable<unassignRoleFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignRoleFromTenantPathParam_roleId = (NonNullable<unassignRoleFromTenantOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromTenantInput = { tenantId: unassignRoleFromTenantPathParam_tenantId; roleId: unassignRoleFromTenantPathParam_roleId };
type unassignRoleFromUserOptions = Parameters<typeof Sdk.unassignRoleFromUser>[0];
type unassignRoleFromUserPathParam_roleId = (NonNullable<unassignRoleFromUserOptions> extends { path: { roleId: infer P } } ? P : any);
type unassignRoleFromUserPathParam_username = (NonNullable<unassignRoleFromUserOptions> extends { path: { username: infer P } } ? P : any);
type unassignRoleFromUserInput = { roleId: unassignRoleFromUserPathParam_roleId; username: unassignRoleFromUserPathParam_username };
type unassignUserFromGroupOptions = Parameters<typeof Sdk.unassignUserFromGroup>[0];
type unassignUserFromGroupPathParam_groupId = (NonNullable<unassignUserFromGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type unassignUserFromGroupPathParam_username = (NonNullable<unassignUserFromGroupOptions> extends { path: { username: infer P } } ? P : any);
type unassignUserFromGroupInput = { groupId: unassignUserFromGroupPathParam_groupId; username: unassignUserFromGroupPathParam_username };
type unassignUserFromTenantOptions = Parameters<typeof Sdk.unassignUserFromTenant>[0];
type unassignUserFromTenantPathParam_tenantId = (NonNullable<unassignUserFromTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type unassignUserFromTenantPathParam_username = (NonNullable<unassignUserFromTenantOptions> extends { path: { username: infer P } } ? P : any);
type unassignUserFromTenantInput = { tenantId: unassignUserFromTenantPathParam_tenantId; username: unassignUserFromTenantPathParam_username };
type unassignUserTaskOptions = Parameters<typeof Sdk.unassignUserTask>[0];
type unassignUserTaskPathParam_userTaskKey = (NonNullable<unassignUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type unassignUserTaskInput = { userTaskKey: unassignUserTaskPathParam_userTaskKey };
type updateAuthorizationOptions = Parameters<typeof Sdk.updateAuthorization>[0];
type updateAuthorizationBody = (NonNullable<updateAuthorizationOptions> extends { body?: infer B } ? B : never);
type updateAuthorizationPathParam_authorizationKey = (NonNullable<updateAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
type updateAuthorizationInput = updateAuthorizationBody & { authorizationKey: updateAuthorizationPathParam_authorizationKey };
type updateGroupOptions = Parameters<typeof Sdk.updateGroup>[0];
type updateGroupBody = (NonNullable<updateGroupOptions> extends { body?: infer B } ? B : never);
type updateGroupPathParam_groupId = (NonNullable<updateGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type updateGroupInput = updateGroupBody & { groupId: updateGroupPathParam_groupId };
type updateJobOptions = Parameters<typeof Sdk.updateJob>[0];
type updateJobBody = (NonNullable<updateJobOptions> extends { body?: infer B } ? B : never);
type updateJobPathParam_jobKey = (NonNullable<updateJobOptions> extends { path: { jobKey: infer P } } ? P : any);
type updateJobInput = updateJobBody & { jobKey: updateJobPathParam_jobKey };
type updateMappingRuleOptions = Parameters<typeof Sdk.updateMappingRule>[0];
type updateMappingRuleBody = (NonNullable<updateMappingRuleOptions> extends { body?: infer B } ? B : never);
type updateMappingRulePathParam_mappingRuleId = (NonNullable<updateMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type updateMappingRuleInput = updateMappingRuleBody & { mappingRuleId: updateMappingRulePathParam_mappingRuleId };
type updateRoleOptions = Parameters<typeof Sdk.updateRole>[0];
type updateRoleBody = (NonNullable<updateRoleOptions> extends { body?: infer B } ? B : never);
type updateRolePathParam_roleId = (NonNullable<updateRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type updateRoleInput = updateRoleBody & { roleId: updateRolePathParam_roleId };
type updateTenantOptions = Parameters<typeof Sdk.updateTenant>[0];
type updateTenantBody = (NonNullable<updateTenantOptions> extends { body?: infer B } ? B : never);
type updateTenantPathParam_tenantId = (NonNullable<updateTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type updateTenantInput = updateTenantBody & { tenantId: updateTenantPathParam_tenantId };
type updateUserOptions = Parameters<typeof Sdk.updateUser>[0];
type updateUserBody = (NonNullable<updateUserOptions> extends { body?: infer B } ? B : never);
type updateUserPathParam_username = (NonNullable<updateUserOptions> extends { path: { username: infer P } } ? P : any);
type updateUserInput = updateUserBody & { username: updateUserPathParam_username };
/** Management of eventual consistency **/
type updateUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.updateUser>> 
};
type updateUserTaskOptions = Parameters<typeof Sdk.updateUserTask>[0];
type updateUserTaskBody = (NonNullable<updateUserTaskOptions> extends { body?: infer B } ? B : never);
type updateUserTaskPathParam_userTaskKey = (NonNullable<updateUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type updateUserTaskInput = updateUserTaskBody & { userTaskKey: updateUserTaskPathParam_userTaskKey };
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
export class CancelError extends Error { constructor() { super('Cancelled'); this.name = 'CancelError'; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
function toCancelable<T>(factory: (signal: AbortSignal) => Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  const p: any = new Promise<T>((resolve, reject) => { factory(ac.signal).then(resolve, reject); });
  p.cancel = () => ac.abort();
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
  telemetry?: { hooks?: import('../runtime/telemetry').TelemetryHooks; correlation?: boolean; mirrorToLog?: boolean };
  // If true (default), non-2xx HTTP responses throw instead of returning an error object.
  // Set to false to opt into non-throwing behavior.
  throwOnError?: boolean;
}

export function createCamundaClient(options?: CamundaOptions) { return new CamundaClient(options); }

export class CamundaClient {
  private _client: Client;
  private _config: Readonly<CamundaConfig>;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', raw: 'req:none,res:none' } as any,
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: ''
  } as any);
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();

  // Internal fixed error mode for eventual consistency ('throw' | 'result'). Not user mutable after construction.
  private readonly _errorMode: 'throw' | 'result';

  private _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
  this._config = deepFreeze(config) as Readonly<CamundaConfig>;
  // Initialize per-client logger
  this._log = createLogger({ level: opts.log?.level || this._config.logLevel, transport: opts.log?.transport });
  const baseFetch = opts.fetch;
  this._fetch = baseFetch;
    // Telemetry wrap (after logger & config known). If user provided explicit telemetry, honor it.
    // Else if environment enabled auto telemetry logging, wrap with mirrorToLog + optional correlation.
    if (opts.telemetry) {
      this._fetch = wrapFetch(this._fetch || fetch as any, { hooks: opts.telemetry.hooks, correlation: opts.telemetry.correlation ? () => getCorrelation() : undefined, logger: this._log, mirrorToLog: opts.telemetry.mirrorToLog });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || fetch as any, { hooks: undefined, correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined, logger: this._log, mirrorToLog: true });
    }
  this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch, throwOnError: opts.throwOnError !== false });
  installAuthInterceptor(this._client, () => this._config.auth.strategy, () => this._auth.getAuthHeaders());
  this._auth = createAuthFacade(this._config, { fetch: this._fetch, logger: this._log, telemetryHooks: opts.telemetry?.hooks, correlationProvider: (opts.telemetry?.correlation || (!opts.telemetry && this._config.telemetry?.correlation)) ? () => getCorrelation() : undefined });
  this._validation.update(this._config.validation);
  this._validation.attachLogger(this._log);
  this._errorMode = (opts as any).errorMode === 'result' ? 'result' : 'throw';
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

  get config(): Readonly<CamundaConfig> { return this._config; }
  /**
   * Read-only snapshot of current hydrated configuration (do not mutate directly).
   * Use configure(...) to apply changes.
   */
  getConfig(): Readonly<CamundaConfig> { return this._config; }

  // Merge new overrides and re-hydrate.
  configure(next: CamundaOptions) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
  if (next.fetch) this._fetch = next.fetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    // Re-wrap fetch if telemetry present OR env auto telemetry toggled
    if (next.telemetry) {
      this._fetch = wrapFetch(this._fetch || fetch as any, { hooks: next.telemetry.hooks, correlation: next.telemetry.correlation ? () => getCorrelation() : undefined, logger: this._log, mirrorToLog: next.telemetry.mirrorToLog });
    } else if (this._config.telemetry?.log) {
      this._fetch = wrapFetch(this._fetch || fetch as any, { hooks: undefined, correlation: this._config.telemetry.correlation ? () => getCorrelation() : undefined, logger: this._log, mirrorToLog: true });
    }
  this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch, throwOnError: next.throwOnError !== false });
  installAuthInterceptor(this._client, () => this._config.auth.strategy, () => this._auth.getAuthHeaders());
  // Update logger level / transport if provided, else apply config log level
  if (next.log?.level) this._log.setLevel(next.log.level); else this._log.setLevel(this._config.logLevel);
  if (next.log?.transport !== undefined) this._log.setTransport(next.log.transport);
  this._auth = createAuthFacade(this._config, { fetch: this._fetch, logger: this._log, telemetryHooks: next.telemetry?.hooks, correlationProvider: (next.telemetry?.correlation || (!next.telemetry && this._config.telemetry?.correlation)) ? () => getCorrelation() : undefined });
  this._validation.update(this._config.validation);
  this._validation.attachLogger(this._log);
  // _errorMode intentionally not mutable post-construction.
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
  async getAuthHeaders() { return this._auth.getAuthHeaders(); }
  async forceAuthRefresh() { return this._auth.forceRefresh(); }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) { this._auth.clearCache(opts); }
  onAuthHeaders(h: (headers: Record<string, string>) => Record<string, string> | Promise<Record<string, string>>) { this._auth.registerHeadersHook(h); }

  /** @internal ValidationManager is internal; tests may reach via (client as any)._validation */
  /** Access a scoped logger (internal & future user emission). */
  logger(scope?: string) { return scope ? this._log.scope(scope) : this._log; }

  /** Internal accessor (read-only) for eventual consistency error mode. */
  getErrorMode(): 'throw' | 'result' { return this._errorMode; }

  // Run a function with a correlation ID (manual propagation phase 1)
  withCorrelation<T>(id: string, fn: () => Promise<T> | T): Promise<T> { return _withCorrelation(id, fn); }

  // Helper for detecting documented void responses (stable public contract)
  // Referenced from generated code - DO NOT REMOVE
  private _isVoidResponse(name: string): boolean {
    try { return (Schemas as any)[name]?.type === "void"; } catch { return false; }
  }
  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // Generated methods (2025-09-17T03:48:16.524Z)
  /**
   * Activate activities within an ad-hoc sub-process
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.activateAdHocSubProcessActivities(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Activate jobs
   * Iterate through all known partitions and activate jobs up to the requested maximum.
   *
    *
   * @operationId activateJobs
   * @tags Job
   */
  activateJobs(input: activateJobsInput): CancelablePromise<_DataOf<typeof Sdk.activateJobs>>;
  activateJobs(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('activateJobs', Schemas.zActivateJobsData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.activateJobs(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a client to a group
   * Assigns a client to a group, making it a member of the group. Members of the group inherit the group authorizations, roles, and tenant assignments.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignClientToGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a client to a tenant
   * Assign the client to the specified tenant. The client can then access tenant data and perform authorized actions.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignClientToTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a group to a tenant
   * Assigns a group to a specified tenant. Group members (users, clients) can then access tenant data and perform authorized actions.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignGroupToTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a mapping rule to a group
   * Assigns a mapping rule to a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignMappingRuleToGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a mapping rule to a tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignMappingRuleToTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a role to a client
   * Assigns the specified role to the client.
   * The client will inherit the authorizations associated with this role.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignRoleToClient(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a role to a group
   *  Assigns the specified role to the group.  Every member of the group (user or client) will inherit the authorizations associated with this role.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignRoleToGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a role to a mapping rule
   * Assigns a role to a mapping rule.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignRoleToMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a role to a tenant
   * Assigns a role to a specified tenant. Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignRoleToTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a role to a user
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignRoleToUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign user task
   * Assigns a user task with the given key to the given assignee.
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.assignUserTask(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a user to a group
   * Assigns a user to a group, making the user a member of the group. Group members inherit the group authorizations, roles, and tenant assignments.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignUserToGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Assign a user to a tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.assignUserToTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Broadcast signal
   * Broadcasts a signal.
    *
   * @operationId broadcastSignal
   * @tags Signal
   */
  broadcastSignal(input: broadcastSignalInput): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('broadcastSignal', Schemas.zBroadcastSignalData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.broadcastSignal(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Cancel Batch operation
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.cancelBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('cancelBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Cancel process instance
   * Cancels a running process instance. As a cancelation includes more than just the removal of the process instance resource, the cancelation resource must be posted.
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.cancelProcessInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create a batch operation to cancel process instances
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.cancelProcessInstancesBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('cancelProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Complete job
   * Complete a job with the given payload, which allows completing the associated service task.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.completeJob(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Complete user task
   * Completes a user task with the given key.
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.completeUserTask(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Correlate message
   * Publishes a message and correlates it to a subscription.
   * If correlation is successful it will return the first process instance key the message correlated with.
   * The message is not buffered.
   * Use the publish message endpoint to send messages that can be buffered.
   *
    *
   * @operationId correlateMessage
   * @tags Message
   */
  correlateMessage(input: correlateMessageInput): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('correlateMessage', Schemas.zCorrelateMessageData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.correlateMessage(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create admin user
   * Creates a new user and assign the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createAdminUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('createAdminUser', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Create authorization
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createAuthorization(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Deploy resources
   * Deploys one or more resources (e.g. processes, decision models, or forms).
   * This is an atomic call, i.e. either all resources are deployed or none of them are.
   *
    *
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
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createDeployment', Schemas.zCreateDeploymentData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createDeployment(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
        const _respSchemaName = 'zCreateDeploymentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        // Enrich deployment response
        const base = data as _DataOf<typeof Sdk.createDeployment>;
        const ext: ExtendedDeploymentResult = { ...base, processes: [], decisions: [], decisionRequirements: [], forms: [], resources: [] };
        for (const d of base.deployments) {
          if (d.processDefinition) ext.processes.push(d.processDefinition);
          if (d.decisionDefinition) ext.decisions.push(d.decisionDefinition);
          if (d.decisionRequirements) ext.decisionRequirements.push(d.decisionRequirements);
          if (d.form) ext.forms.push(d.form);
          if (d.resource) ext.resources.push(d.resource);
        }
        data = ext;
        if (this._validation.settings.res !== 'none') {
          const _schema = Schemas.zCreateDeploymentResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('createDeployment', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Upload document
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
      const opts: any = { client: this._client, signal };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createDocument(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create document link
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createDocumentLink(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Upload multiple documents
   * Upload multiple documents to the Camunda 8 cluster.
   *
   * The caller must provide a file name for each document, which will be used in case of a multi-status responseto identify which documents failed to upload. The file name can be provided in the `Content-Disposition` headerof the file part or in the `fileName` field of the metadata. You can add a parallel array of metadata objects. Theseare matched with the files based on index, and must have the same length as the files array.To pass homogenous metadata for all files, spread the metadata over the metadata array.  A filename value provided explicitly via the metadata array in the request overrides the `Content-Disposition` headerof the file part.
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
      const opts: any = { client: this._client, signal };
      if (envelope.query) opts.query = envelope.query;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createDocuments(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update element instance variables
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createElementInstanceVariables(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create group
   * Create a new group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create mapping rule
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create process instance
   * Creates and starts an instance of the specified process.
   * The process definition to use to create the instance can be specified either using its unique key
   * (as returned by Deploy resources), or using the BPMN process ID and a version.
   *
   * Waits for the completion of the process instance before returning a result
   * when awaitCompletion is enabled.
   *
    *
   * @operationId createProcessInstance
   * @tags Process instance
   */
  createProcessInstance(input: createProcessInstanceInput): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('createProcessInstance', Schemas.zCreateProcessInstanceData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createProcessInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create role
   * Create a new role.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create user
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.createUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('createUser', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Delete authorization
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteAuthorization(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Delete document
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        const r = await Sdk.deleteDocument(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
        const _respSchemaName = 'zDeleteDocumentResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete group
   * Deletes the group with the given ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Delete a mapping rule
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Delete resource
   * Deletes a deployed resource.
   * This can be a process definition, decision requirements definition, or form definition
   * deployed using the deploy resources endpoint. Specify the resource you want to delete in the `resourceKey` parameter.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.deleteResource(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
        const _respSchemaName = 'zDeleteResourceResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete role
   * Deletes the role with the given ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Delete tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Delete user
   * Deletes a user.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.deleteUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('deleteUser', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Evaluate decision
   * Evaluates a decision.
   * You specify the decision to evaluate either by using its unique key (as returned by
   * DeployResource), or using the decision ID. When using the decision ID, the latest deployed
   * version of the decision is used.
   *
    *
   * @operationId evaluateDecision
   * @tags Decision definition
   */
  evaluateDecision(input: evaluateDecisionInput): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('evaluateDecision', Schemas.zEvaluateDecisionData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.evaluateDecision(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Fail job
   * Mark the job as failed
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.failJob(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get current user
   * Retrieves the current authenticated user.
    *
   * @operationId getAuthentication
   * @tags Authentication
   */
  getAuthentication(): CancelablePromise<_DataOf<typeof Sdk.getAuthentication>>;
  getAuthentication(arg?: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal };
      const call = async () => {
        const r = await Sdk.getAuthentication(opts as any);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get authorization
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getAuthorization(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getAuthorization', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get batch operation
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getBatchOperation', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get decision definition
   * Returns a decision definition by key.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getDecisionDefinition(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionDefinition', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get decision definition XML
   * Returns decision definition as XML.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getDecisionDefinitionXml(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionDefinitionXML', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get decision instance
   * Returns a decision instance.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getDecisionInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionInstance', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get decision requirements
   * Returns Decision Requirements as JSON.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getDecisionRequirements(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionRequirements', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get decision requirements XML
   * Returns decision requirements as XML.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getDecisionRequirementsXml(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getDecisionRequirementsXML', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Download document
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        const r = await Sdk.getDocument(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get element instance
   * Returns element instance as JSON.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getElementInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getElementInstance', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get group
   * Get a group by its ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getGroup', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get incident
   * Returns incident as JSON.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getIncident(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getIncident', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get license status
   * Obtains the status of the current Camunda license.
    *
   * @operationId getLicense
   * @tags License
   */
  getLicense(): CancelablePromise<_DataOf<typeof Sdk.getLicense>>;
  getLicense(arg?: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal };
      const call = async () => {
        const r = await Sdk.getLicense(opts as any);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get a mapping rule
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getMappingRule', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process definition
   * Returns process definition as JSON.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessDefinition(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinition', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process definition statistics
   * Get statistics about elements in currently running process instances by process definition key and search filter.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.getProcessDefinitionStatistics(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionStatistics', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process definition XML
   * Returns process definition as XML.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessDefinitionXml(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessDefinitionXML', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process instance
   * Get the process instance by the process instance key.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstance', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get call hierarchy for process instance
   * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessInstanceCallHierarchy(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceCallHierarchy', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process instance sequence flows
   * Get sequence flows taken by the process instance.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessInstanceSequenceFlows(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceSequenceFlows', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process instance statistics
   * Get statistics about elements by the process instance key.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getProcessInstanceStatistics(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getProcessInstanceStatistics', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get resource
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getResource(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get resource content
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getResourceContent(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get role
   * Get a role by its ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getRole', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get process start form
   * Get the start form of a process.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getStartProcessForm(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getStartProcessForm', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get cluster status
   * Checks the health status of the cluster by verifying if there's at least one partition with a healthy leader.
    *
   * @operationId getStatus
   * @tags Cluster
   */
  getStatus(): CancelablePromise<_DataOf<typeof Sdk.getStatus>>;
  getStatus(arg?: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal };
      const call = async () => {
        const r = await Sdk.getStatus(opts as any);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getTenant', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get cluster topology
   * Obtains the current topology of the cluster the gateway is part of.
    *
   * @operationId getTopology
   * @tags Cluster
   */
  getTopology(): CancelablePromise<_DataOf<typeof Sdk.getTopology>>;
  getTopology(arg?: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const opts: any = { client: this._client, signal };
      const call = async () => {
        const r = await Sdk.getTopology(opts as any);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Get usage metrics
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
      const opts: any = { client: this._client, signal };
      if (envelope.query) opts.query = envelope.query;
      const call = async () => {
        const r = await Sdk.getUsageMetrics(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUsageMetrics', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get user
   * Get a user by its username.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUser', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get user task
   * Get the user task by the user task key.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getUserTask(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUserTask', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get user task form
   * Get the form of a user task.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getUserTaskForm(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getUserTaskForm', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Get variable
   * Get the variable by the variable key.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.getVariable(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('getVariable', true, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Migrate process instance
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.migrateProcessInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create a batch operation to migrate process instances
   * Migrate multiple instances of process instances.
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.migrateProcessInstancesBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('migrateProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Modify process instance
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.modifyProcessInstance(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create a batch operation to modify process instances
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.modifyProcessInstancesBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('modifyProcessInstancesBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Pin internal clock (alpha)
   * Set a precise, static time for the Zeebe engine’s internal clock.
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.pinClock(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Publish message
   * Publishes a single message.
   * Messages are published to specific partitions computed from their correlation keys.
   * Messages can be buffered.
   * The endpoint does not wait for a correlation result.
   * Use the message correlation endpoint for such use cases.
   *
    *
   * @operationId publishMessage
   * @tags Message
   */
  publishMessage(input: publishMessageInput): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(arg: any): CancelablePromise<any> {
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('publishMessage', Schemas.zPublishMessageData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.publishMessage(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Reset internal clock (alpha)
   * Resets the Zeebe engine’s internal clock to the current system time, enabling it to tick in real-time.
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
      const opts: any = { client: this._client, signal };
      const call = async () => {
        const r = await Sdk.resetClock(opts as any);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Resolve incident
   * Marks the incident as resolved; most likely a call to Update job will be necessary to reset the job’s retries, followed by this call.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.resolveIncident(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Create a batch operation to resolve incidents of process instances
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.resolveIncidentsBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('resolveIncidentsBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Resume Batch operation
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.resumeBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('resumeBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search authorizations
   * Search for authorizations based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchAuthorizations(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchAuthorizations', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search batch operation items
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchBatchOperationItems(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchBatchOperationItems', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search batch operations
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchBatchOperations(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchBatchOperations', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search group clients
   * Search clients assigned to a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchClientsForGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForGroup', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search role clients
   * Search clients with assigned role.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchClientsForRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForRole', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search clients for tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchClientsForTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchClientsForTenant', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search correlated messages
   * Search for correlated messages based on given criteria.
    *
   * @operationId searchCorrelatedMessages
   * @tags Message
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchCorrelatedMessages(input: searchCorrelatedMessagesInput, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessagesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchCorrelatedMessages>>;
  searchCorrelatedMessages(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessagesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchCorrelatedMessages', Schemas.zSearchCorrelatedMessagesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchCorrelatedMessages(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
        const _respSchemaName = 'zSearchCorrelatedMessagesResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schema = Schemas.zSearchCorrelatedMessagesResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchCorrelatedMessages', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchCorrelatedMessages', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search decision definitions
   * Search for decision definitions based on given criteria.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchDecisionDefinitions(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionDefinitions', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search decision instances
   * Search for decision instances based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchDecisionInstances(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionInstances', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search decision requirements
   * Search for decision requirements based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchDecisionRequirements(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchDecisionRequirements', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search element instances
   * Search for element instances based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchElementInstances(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchElementInstances', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search groups for tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchGroupIdsForTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroupIdsForTenant', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search groups
   * Search for groups based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchGroups(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroups', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search role groups
   * Search groups with assigned role.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchGroupsForRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchGroupsForRole', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search incidents
   * Search for incidents based on given criteria.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchIncidents(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchIncidents', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search jobs
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchJobs(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchJobs', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search mapping rules
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRule', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search group mapping rules
   * Search mapping rules assigned to a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchMappingRulesForGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRulesForGroup', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search role mapping rules
   * Search mapping rules with assigned role.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchMappingRulesForRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingRulesForRole', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search mapping rules for tenant
   * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
    *
   * @operationId searchMappingsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingsForTenant(input: searchMappingsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingsForTenant>>;
  searchMappingsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(async signal => {
      const { tenantId, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { tenantId };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchMappingsForTenant', Schemas.zSearchMappingsForTenantData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchMappingsForTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
        const _respSchemaName = 'zSearchMappingsForTenantResponse';
        if (this._isVoidResponse(_respSchemaName)) {
          data = undefined;
        }
        if (this._validation.settings.res !== 'none') {
          const _schema = Schemas.zSearchMappingsForTenantResponse;
          if (_schema) {
            const maybeR = await this._validation.gateResponse('searchMappingsForTenant', _schema, data);
            if (this._validation.settings.res === 'strict') data = maybeR;
          }
        }
        return data;
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMappingsForTenant', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search message subscriptions
   * Search for message subscriptions based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchMessageSubscriptions(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchMessageSubscriptions', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search process definitions
   * Search for process definitions based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchProcessDefinitions(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessDefinitions', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search for incidents associated with a process instance
   * Search for incidents caused by the process instance or any of its called process or decision instances.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchProcessInstanceIncidents(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessInstanceIncidents', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search process instances
   * Search for process instances based on given criteria.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchProcessInstances(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchProcessInstances', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search roles
   * Search for roles based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchRoles(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRoles', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search group roles
   * Search roles assigned to a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchRolesForGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRolesForGroup', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search roles for tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchRolesForTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchRolesForTenant', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search tenants
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchTenants(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchTenants', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search users
   * Search for users based on given criteria.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUsers(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsers', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search group users
   * Search users assigned to a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUsersForGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForGroup', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search role users
   * Search users with assigned role.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUsersForRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForRole', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search users for tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUsersForTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUsersForTenant', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search user tasks
   * Search for user tasks based on given criteria.
   *
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUserTasks(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTasks', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search user task variables
   * Search for user task variables based on given criteria.
   *
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
      const { userTaskKey, ..._body } = arg || {};
      let envelope: any = {};
      envelope.path = { userTaskKey };
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchUserTaskVariables', Schemas.zSearchUserTaskVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchUserTaskVariables(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchUserTaskVariables', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Search variables
   * Search for process and local variables based on given criteria.
   *
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
      const _body = arg;
      let envelope: any = {};
      envelope.body = _body;
      if (this._validation.settings.req !== 'none') {
        const maybe = await this._validation.gateRequest('searchVariables', Schemas.zSearchVariablesData, envelope);
        if (this._validation.settings.req === 'strict') envelope = maybe;
      }
      const opts: any = { client: this._client, signal };
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.searchVariables(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('searchVariables', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Suspend Batch operation
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.suspendBatchOperation(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('suspendBatchOperation', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Throw error for job
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.throwJobError(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a client from a group
   * Unassigns a client from a group.
   * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignClientFromGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a client from a tenant
   * Unassigns the client from the specified tenant. The client can no longer access tenant data.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignClientFromTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a group from a tenant
   * Unassigns a group from a specified tenant. Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignGroupFromTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a mapping rule from a group
   * Unassigns a mapping rule from a group.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignMappingRuleFromGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a mapping rule from a tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignMappingRuleFromTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a role from a client
   *  Unassigns the specified role from the client.  The client will no longer inherit the authorizations associated with this role.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignRoleFromClient(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a role from a group
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignRoleFromGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a role from a mapping rule
   * Unassigns a role from a mapping rule.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignRoleFromMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a role from a tenant
   * Unassigns a role from a specified tenant. Users, Clients or Groups, that have the role assigned, will no longer have access to the tenant's data - unless they are assigned directly to the tenant.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignRoleFromTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a role from a user
   * Unassigns a role from a user.
   * The user will no longer inherit the authorizations associated with this role.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignRoleFromUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a user from a group
   * Unassigns a user from a group.
   * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignUserFromGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign a user from a tenant
   * Unassigns the user from the specified tenant. The user can no longer access tenant data.
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignUserFromTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Unassign user task
   * Removes the assignee of a task with the given key.
    *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      const call = async () => {
        const r = await Sdk.unassignUserTask(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update authorization
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateAuthorization(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update group
   * Update a group with the given ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateGroup(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update job
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateJob(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update mapping rule
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateMappingRule(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update role
   * Update a role with the given ID.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateRole(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update tenant
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateTenant(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

  /**
   * Update user
   * Updates a user.
   *
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateUser(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      const invoke = () => toCancelable(()=>call());
      if (useConsistency) return eventualPoll('updateUser', false, invoke, { ...useConsistency, logger: (this as any)._log });
      return invoke();
    });
  }

  /**
   * Update user task
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
      const opts: any = { client: this._client, signal };
      if (envelope.path) opts.path = envelope.path;
      if (envelope.body !== undefined) opts.body = envelope.body;
      const call = async () => {
        const r = await Sdk.updateUserTask(opts);
        let data = (r as any)?.data;
        if (data === undefined) data = r;
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
      };
      return call();
    });
  }

// === AUTO-GENERATED CAMUNDA METHODS END ===

  /**
   * Node-only convenience: deploy resources from local filesystem paths.
   * @param resourceFilenames Absolute or relative file paths to BPMN/DMN/form/resource files.
   * @param options Optional: tenantId.
   * @returns ExtendedDeploymentResult 
   */
  deployResourcesFromFiles(resourceFilenames: string[], options?: { tenantId?: string }): CancelablePromise<ExtendedDeploymentResult> {
    return toCancelable(async _signal => {
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
        import('node:path')
      ]);
      // Best-effort MIME inference
      const mimeFor = (filename: string): string => {
        const ext = filename.toLowerCase().split('.').pop() || '';
        switch (ext) {
          case 'bpmn':
          case 'dmn':
          case 'xml': return 'application/xml';
          case 'json':
          case 'form': return 'application/json';
          default: return 'application/octet-stream';
        }
      };
      if (typeof File !== 'function') {
        throw new Error('Global File constructor not available. Requires Node 18+ (fetch experimental) or Node 20+');
      }
      const files: File[] = [];
      for (const p of resourceFilenames) {
        if (typeof p !== 'string' || !p) throw new Error('Invalid resource filename encountered');
        const data = await readFile(p);
        const name = pathMod.basename(p);
  files.push(new File([data as any], name, { type: mimeFor(name) }));
      }
  const payload: createDeploymentInput = { resources: files, ...(options?.tenantId ? { tenantId: options.tenantId } : {}) } as any;
  return this.createDeployment(payload);
    });
  }
}
