// @generated from CamundaClient.template.ts - DO NOT EDIT DIRECTLY

import type * as Sdk from '../gen/sdk.gen';
import type { ProcessInstanceKey, ScopeKey, TenantId, VariableFilter } from '../gen/types.gen';
import type { ActivatedJobResultWithJobLeaseToken, ActivatedJobResultWithoutJobLeaseToken } from '../gen/types.gen'; // present-when projection imports
import { CamundaCore, type CamundaOptions } from '../runtime/camundaCore';
import { type CancelablePromise, toCancelable } from '../runtime/cancelable';
import { JobWorker, type JobWorkerConfig } from '../runtime/jobWorker';
import { EnrichedActivatedJob, EnrichedActivatedJobOf } from '../runtime/jobActions';
import type { OperationOptions } from '../runtime/retry';
import { installSearchPagination, type WithSearchPagination } from '../runtime/searchPagination';
import { ThreadedJobWorker, type ThreadedJobWorkerConfig } from '../runtime/threadedJobWorker';
import { ThreadPool } from '../runtime/threadPool';
import {
  type AnyVariableSchema,
  collectTypedVariables,
  createVariableSearchFetchPage,
  type VariableMap,
  variableNamesFromSchema,
} from '../runtime/typedVariables';
import { node } from '#platform';

// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// Generated
// Operations: 244
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;
import * as Ops from './operations.gen';
import type { activateAdHocSubProcessActivitiesInput, activateJobsInput, assignClientToGroupInput, assignClientToTenantInput, assignGroupToTenantInput, assignMappingRuleToGroupInput, assignMappingRuleToTenantInput, assignProcessInstanceBusinessIdInput, assignRoleToClientInput, assignRoleToGroupInput, assignRoleToMappingRuleInput, assignRoleToTenantInput, assignRoleToUserInput, assignUserTaskInput, assignUserToGroupInput, assignUserToTenantInput, broadcastSignalInput, cancelBatchOperationInput, cancelClusterRebalanceInput, cancelProcessInstanceInput, cancelProcessInstancesBatchOperationInput, changeClusterModeInput, changeClusterModeAsClusterAdminInput, completeJobInput, completeUserTaskInput, correlateMessageInput, createAdminUserInput, createAgentInstanceInput, createAuthorizationInput, createDeploymentInput, createDocumentInput, createDocumentLinkInput, createDocumentsInput, createElementInstanceVariablesInput, createGlobalClusterVariableInput, createGlobalTaskListenerInput, createGroupInput, createMappingRuleInput, createProcessInstanceInput, createRoleInput, createTenantInput, createTenantClusterVariableInput, createUserInput, deleteAuthorizationInput, deleteDecisionInstanceInput, deleteDecisionInstancesBatchOperationInput, deleteDocumentInput, deleteGlobalClusterVariableInput, deleteGlobalTaskListenerInput, deleteGroupInput, deleteHistoryBackupInput, deleteHistoryBackupAsClusterAdminInput, deleteMappingRuleInput, deleteProcessInstanceInput, deleteProcessInstancesBatchOperationInput, deleteResourceInput, deleteRoleInput, deleteRuntimeBackupInput, deleteRuntimeBackupAsClusterAdminInput, deleteRuntimeBackupStateInput, deleteRuntimeBackupStateAsClusterAdminInput, deleteTenantInput, deleteTenantClusterVariableInput, deleteUserInput, evaluateConditionalsInput, evaluateDecisionInput, evaluateExpressionInput, failJobInput, getAgentDefinitionInput, getAgentDefinitionConsistency, getAgentInstanceInput, getAgentInstanceConsistency, getAuditLogInput, getAuditLogConsistency, getAuthenticationInput, getAuthorizationInput, getAuthorizationConsistency, getBatchOperationInput, getBatchOperationConsistency, getClusterExportingStatusInput, getClusterRebalanceInput, getClusterStatusInput, getClusterTopologyInput, getClusterUpgradeStatusInput, getDecisionDefinitionInput, getDecisionDefinitionConsistency, getDecisionDefinitionXmlInput, getDecisionDefinitionXmlConsistency, getDecisionInstanceInput, getDecisionInstanceConsistency, getDecisionRequirementsInput, getDecisionRequirementsConsistency, getDecisionRequirementsXmlInput, getDecisionRequirementsXmlConsistency, getDocumentInput, getElementInstanceInput, getElementInstanceConsistency, getExportingStatusInput, getFormByKeyInput, getFormByKeyConsistency, getGlobalClusterVariableInput, getGlobalClusterVariableConsistency, getGlobalJobStatisticsInput, getGlobalJobStatisticsConsistency, getGlobalTaskListenerInput, getGlobalTaskListenerConsistency, getGroupInput, getGroupConsistency, getHistoryBackupInput, getHistoryBackupAsClusterAdminInput, getIncidentInput, getIncidentConsistency, getJobErrorStatisticsInput, getJobErrorStatisticsConsistency, getJobTimeSeriesStatisticsInput, getJobTimeSeriesStatisticsConsistency, getJobTypeStatisticsInput, getJobTypeStatisticsConsistency, getJobWorkerStatisticsInput, getJobWorkerStatisticsConsistency, getLicenseInput, getMappingRuleInput, getMappingRuleConsistency, getProcessDefinitionInput, getProcessDefinitionConsistency, getProcessDefinitionInstanceStatisticsInput, getProcessDefinitionInstanceStatisticsConsistency, getProcessDefinitionInstanceVersionStatisticsInput, getProcessDefinitionInstanceVersionStatisticsConsistency, getProcessDefinitionMessageSubscriptionStatisticsInput, getProcessDefinitionMessageSubscriptionStatisticsConsistency, getProcessDefinitionStatisticsInput, getProcessDefinitionStatisticsConsistency, getProcessDefinitionXmlInput, getProcessDefinitionXmlConsistency, getProcessInstanceInput, getProcessInstanceConsistency, getProcessInstanceCallHierarchyInput, getProcessInstanceCallHierarchyConsistency, getProcessInstanceSequenceFlowsInput, getProcessInstanceSequenceFlowsConsistency, getProcessInstanceStatisticsInput, getProcessInstanceStatisticsConsistency, getProcessInstanceStatisticsByDefinitionInput, getProcessInstanceStatisticsByDefinitionConsistency, getProcessInstanceStatisticsByErrorInput, getProcessInstanceStatisticsByErrorConsistency, getProcessInstanceWaitStateStatisticsInput, getProcessInstanceWaitStateStatisticsConsistency, getResourceInput, getResourceConsistency, getResourceContentInput, getResourceContentConsistency, getResourceContentBinaryInput, getResourceContentBinaryConsistency, getRestoreStatusInput, getRoleInput, getRoleConsistency, getRuntimeBackupInput, getRuntimeBackupAsClusterAdminInput, getRuntimeBackupStateInput, getRuntimeBackupStateAsClusterAdminInput, getStartProcessFormInput, getStartProcessFormConsistency, getStatusInput, getSystemConfigurationInput, getTenantInput, getTenantConsistency, getTenantClusterVariableInput, getTenantClusterVariableConsistency, getTopologyInput, getUsageMetricsInput, getUsageMetricsConsistency, getUserInput, getUserConsistency, getUserTaskInput, getUserTaskConsistency, getUserTaskFormInput, getUserTaskFormConsistency, getVariableInput, getVariableConsistency, listHistoryBackupsInput, listHistoryBackupsAsClusterAdminInput, listRuntimeBackupsInput, listRuntimeBackupsAsClusterAdminInput, listSecretsInput, migrateProcessInstanceInput, migrateProcessInstancesBatchOperationInput, modifyProcessInstanceInput, modifyProcessInstancesBatchOperationInput, pauseClusterExportingInput, pauseExportingInput, pinClockInput, publishMessageInput, resetClockInput, resolveIncidentInput, resolveIncidentsBatchOperationInput, resolveProcessInstanceIncidentsInput, resolveSecretsInput, restoreInput, restoreAsClusterAdminInput, resumeBatchOperationInput, resumeClusterExportingInput, resumeExportingInput, resumeProcessInstanceInput, resumeProcessInstancesBatchOperationInput, searchAgentDefinitionsInput, searchAgentDefinitionsConsistency, searchAgentInstanceHistoryInput, searchAgentInstanceHistoryConsistency, searchAgentInstancesInput, searchAgentInstancesConsistency, searchAuditLogsInput, searchAuditLogsConsistency, searchAuthorizationsInput, searchAuthorizationsConsistency, searchBatchOperationItemsInput, searchBatchOperationItemsConsistency, searchBatchOperationsInput, searchBatchOperationsConsistency, searchClientsForGroupInput, searchClientsForGroupConsistency, searchClientsForRoleInput, searchClientsForRoleConsistency, searchClientsForTenantInput, searchClientsForTenantConsistency, searchClusterVariablesInput, searchClusterVariablesConsistency, searchCorrelatedMessageSubscriptionsInput, searchCorrelatedMessageSubscriptionsConsistency, searchDecisionDefinitionsInput, searchDecisionDefinitionsConsistency, searchDecisionInstancesInput, searchDecisionInstancesConsistency, searchDecisionRequirementsInput, searchDecisionRequirementsConsistency, searchElementInstanceIncidentsInput, searchElementInstanceIncidentsConsistency, searchElementInstancesInput, searchElementInstancesConsistency, searchElementInstanceWaitStatesInput, searchElementInstanceWaitStatesConsistency, searchGlobalTaskListenersInput, searchGlobalTaskListenersConsistency, searchGroupIdsForTenantInput, searchGroupIdsForTenantConsistency, searchGroupsInput, searchGroupsConsistency, searchGroupsForRoleInput, searchGroupsForRoleConsistency, searchIncidentsInput, searchIncidentsConsistency, searchJobsInput, searchJobsConsistency, searchMappingRuleInput, searchMappingRuleConsistency, searchMappingRulesForGroupInput, searchMappingRulesForGroupConsistency, searchMappingRulesForRoleInput, searchMappingRulesForRoleConsistency, searchMappingRulesForTenantInput, searchMappingRulesForTenantConsistency, searchMessageSubscriptionsInput, searchMessageSubscriptionsConsistency, searchOwnAuthorizationsInput, searchOwnAuthorizationsConsistency, searchProcessDefinitionsInput, searchProcessDefinitionsConsistency, searchProcessDefinitionVariableNamesInput, searchProcessDefinitionVariableNamesConsistency, searchProcessInstanceIncidentsInput, searchProcessInstanceIncidentsConsistency, searchProcessInstancesInput, searchProcessInstancesConsistency, searchResourcesInput, searchResourcesConsistency, searchRolesInput, searchRolesConsistency, searchRolesForGroupInput, searchRolesForGroupConsistency, searchRolesForTenantInput, searchRolesForTenantConsistency, searchTenantsInput, searchTenantsConsistency, searchUsersInput, searchUsersConsistency, searchUsersForGroupInput, searchUsersForGroupConsistency, searchUsersForRoleInput, searchUsersForRoleConsistency, searchUsersForTenantInput, searchUsersForTenantConsistency, searchUserTaskAuditLogsInput, searchUserTaskAuditLogsConsistency, searchUserTaskEffectiveVariablesInput, searchUserTaskEffectiveVariablesConsistency, searchUserTasksInput, searchUserTasksConsistency, searchUserTaskVariablesInput, searchUserTaskVariablesConsistency, searchVariablesInput, searchVariablesConsistency, suspendBatchOperationInput, suspendProcessInstanceInput, suspendProcessInstancesBatchOperationInput, syncRuntimeBackupStateInput, syncRuntimeBackupStateAsClusterAdminInput, takeHistoryBackupInput, takeHistoryBackupAsClusterAdminInput, takeRuntimeBackupInput, takeRuntimeBackupAsClusterAdminInput, throwJobErrorInput, triggerClusterRebalanceInput, unassignClientFromGroupInput, unassignClientFromTenantInput, unassignGroupFromTenantInput, unassignMappingRuleFromGroupInput, unassignMappingRuleFromTenantInput, unassignRoleFromClientInput, unassignRoleFromGroupInput, unassignRoleFromMappingRuleInput, unassignRoleFromTenantInput, unassignRoleFromUserInput, unassignUserFromGroupInput, unassignUserFromTenantInput, unassignUserTaskInput, updateAgentInstanceInput, updateAuthorizationInput, updateGlobalClusterVariableInput, updateGlobalTaskListenerInput, updateGroupInput, updateJobInput, updateJobsBatchOperationInput, updateMappingRuleInput, updateRoleInput, updateTenantInput, updateTenantClusterVariableInput, updateUserInput, updateUserTaskInput, ExtendedDeploymentResult } from './operations.gen';
export type { activateAdHocSubProcessActivitiesInput, activateJobsInput, assignClientToGroupInput, assignClientToTenantInput, assignGroupToTenantInput, assignMappingRuleToGroupInput, assignMappingRuleToTenantInput, assignProcessInstanceBusinessIdInput, assignRoleToClientInput, assignRoleToGroupInput, assignRoleToMappingRuleInput, assignRoleToTenantInput, assignRoleToUserInput, assignUserTaskInput, assignUserToGroupInput, assignUserToTenantInput, broadcastSignalInput, cancelBatchOperationInput, cancelClusterRebalanceInput, cancelProcessInstanceInput, cancelProcessInstancesBatchOperationInput, changeClusterModeInput, changeClusterModeAsClusterAdminInput, completeJobInput, completeUserTaskInput, correlateMessageInput, createAdminUserInput, createAgentInstanceInput, createAuthorizationInput, createDeploymentInput, createDocumentInput, createDocumentLinkInput, createDocumentsInput, createElementInstanceVariablesInput, createGlobalClusterVariableInput, createGlobalTaskListenerInput, createGroupInput, createMappingRuleInput, createProcessInstanceInput, createRoleInput, createTenantInput, createTenantClusterVariableInput, createUserInput, deleteAuthorizationInput, deleteDecisionInstanceInput, deleteDecisionInstancesBatchOperationInput, deleteDocumentInput, deleteGlobalClusterVariableInput, deleteGlobalTaskListenerInput, deleteGroupInput, deleteHistoryBackupInput, deleteHistoryBackupAsClusterAdminInput, deleteMappingRuleInput, deleteProcessInstanceInput, deleteProcessInstancesBatchOperationInput, deleteResourceInput, deleteRoleInput, deleteRuntimeBackupInput, deleteRuntimeBackupAsClusterAdminInput, deleteRuntimeBackupStateInput, deleteRuntimeBackupStateAsClusterAdminInput, deleteTenantInput, deleteTenantClusterVariableInput, deleteUserInput, evaluateConditionalsInput, evaluateDecisionInput, evaluateExpressionInput, failJobInput, getAgentDefinitionInput, getAgentDefinitionConsistency, getAgentInstanceInput, getAgentInstanceConsistency, getAuditLogInput, getAuditLogConsistency, getAuthenticationInput, getAuthorizationInput, getAuthorizationConsistency, getBatchOperationInput, getBatchOperationConsistency, getClusterExportingStatusInput, getClusterRebalanceInput, getClusterStatusInput, getClusterTopologyInput, getClusterUpgradeStatusInput, getDecisionDefinitionInput, getDecisionDefinitionConsistency, getDecisionDefinitionXmlInput, getDecisionDefinitionXmlConsistency, getDecisionInstanceInput, getDecisionInstanceConsistency, getDecisionRequirementsInput, getDecisionRequirementsConsistency, getDecisionRequirementsXmlInput, getDecisionRequirementsXmlConsistency, getDocumentInput, getElementInstanceInput, getElementInstanceConsistency, getExportingStatusInput, getFormByKeyInput, getFormByKeyConsistency, getGlobalClusterVariableInput, getGlobalClusterVariableConsistency, getGlobalJobStatisticsInput, getGlobalJobStatisticsConsistency, getGlobalTaskListenerInput, getGlobalTaskListenerConsistency, getGroupInput, getGroupConsistency, getHistoryBackupInput, getHistoryBackupAsClusterAdminInput, getIncidentInput, getIncidentConsistency, getJobErrorStatisticsInput, getJobErrorStatisticsConsistency, getJobTimeSeriesStatisticsInput, getJobTimeSeriesStatisticsConsistency, getJobTypeStatisticsInput, getJobTypeStatisticsConsistency, getJobWorkerStatisticsInput, getJobWorkerStatisticsConsistency, getLicenseInput, getMappingRuleInput, getMappingRuleConsistency, getProcessDefinitionInput, getProcessDefinitionConsistency, getProcessDefinitionInstanceStatisticsInput, getProcessDefinitionInstanceStatisticsConsistency, getProcessDefinitionInstanceVersionStatisticsInput, getProcessDefinitionInstanceVersionStatisticsConsistency, getProcessDefinitionMessageSubscriptionStatisticsInput, getProcessDefinitionMessageSubscriptionStatisticsConsistency, getProcessDefinitionStatisticsInput, getProcessDefinitionStatisticsConsistency, getProcessDefinitionXmlInput, getProcessDefinitionXmlConsistency, getProcessInstanceInput, getProcessInstanceConsistency, getProcessInstanceCallHierarchyInput, getProcessInstanceCallHierarchyConsistency, getProcessInstanceSequenceFlowsInput, getProcessInstanceSequenceFlowsConsistency, getProcessInstanceStatisticsInput, getProcessInstanceStatisticsConsistency, getProcessInstanceStatisticsByDefinitionInput, getProcessInstanceStatisticsByDefinitionConsistency, getProcessInstanceStatisticsByErrorInput, getProcessInstanceStatisticsByErrorConsistency, getProcessInstanceWaitStateStatisticsInput, getProcessInstanceWaitStateStatisticsConsistency, getResourceInput, getResourceConsistency, getResourceContentInput, getResourceContentConsistency, getResourceContentBinaryInput, getResourceContentBinaryConsistency, getRestoreStatusInput, getRoleInput, getRoleConsistency, getRuntimeBackupInput, getRuntimeBackupAsClusterAdminInput, getRuntimeBackupStateInput, getRuntimeBackupStateAsClusterAdminInput, getStartProcessFormInput, getStartProcessFormConsistency, getStatusInput, getSystemConfigurationInput, getTenantInput, getTenantConsistency, getTenantClusterVariableInput, getTenantClusterVariableConsistency, getTopologyInput, getUsageMetricsInput, getUsageMetricsConsistency, getUserInput, getUserConsistency, getUserTaskInput, getUserTaskConsistency, getUserTaskFormInput, getUserTaskFormConsistency, getVariableInput, getVariableConsistency, listHistoryBackupsInput, listHistoryBackupsAsClusterAdminInput, listRuntimeBackupsInput, listRuntimeBackupsAsClusterAdminInput, listSecretsInput, migrateProcessInstanceInput, migrateProcessInstancesBatchOperationInput, modifyProcessInstanceInput, modifyProcessInstancesBatchOperationInput, pauseClusterExportingInput, pauseExportingInput, pinClockInput, publishMessageInput, resetClockInput, resolveIncidentInput, resolveIncidentsBatchOperationInput, resolveProcessInstanceIncidentsInput, resolveSecretsInput, restoreInput, restoreAsClusterAdminInput, resumeBatchOperationInput, resumeClusterExportingInput, resumeExportingInput, resumeProcessInstanceInput, resumeProcessInstancesBatchOperationInput, searchAgentDefinitionsInput, searchAgentDefinitionsConsistency, searchAgentInstanceHistoryInput, searchAgentInstanceHistoryConsistency, searchAgentInstancesInput, searchAgentInstancesConsistency, searchAuditLogsInput, searchAuditLogsConsistency, searchAuthorizationsInput, searchAuthorizationsConsistency, searchBatchOperationItemsInput, searchBatchOperationItemsConsistency, searchBatchOperationsInput, searchBatchOperationsConsistency, searchClientsForGroupInput, searchClientsForGroupConsistency, searchClientsForRoleInput, searchClientsForRoleConsistency, searchClientsForTenantInput, searchClientsForTenantConsistency, searchClusterVariablesInput, searchClusterVariablesConsistency, searchCorrelatedMessageSubscriptionsInput, searchCorrelatedMessageSubscriptionsConsistency, searchDecisionDefinitionsInput, searchDecisionDefinitionsConsistency, searchDecisionInstancesInput, searchDecisionInstancesConsistency, searchDecisionRequirementsInput, searchDecisionRequirementsConsistency, searchElementInstanceIncidentsInput, searchElementInstanceIncidentsConsistency, searchElementInstancesInput, searchElementInstancesConsistency, searchElementInstanceWaitStatesInput, searchElementInstanceWaitStatesConsistency, searchGlobalTaskListenersInput, searchGlobalTaskListenersConsistency, searchGroupIdsForTenantInput, searchGroupIdsForTenantConsistency, searchGroupsInput, searchGroupsConsistency, searchGroupsForRoleInput, searchGroupsForRoleConsistency, searchIncidentsInput, searchIncidentsConsistency, searchJobsInput, searchJobsConsistency, searchMappingRuleInput, searchMappingRuleConsistency, searchMappingRulesForGroupInput, searchMappingRulesForGroupConsistency, searchMappingRulesForRoleInput, searchMappingRulesForRoleConsistency, searchMappingRulesForTenantInput, searchMappingRulesForTenantConsistency, searchMessageSubscriptionsInput, searchMessageSubscriptionsConsistency, searchOwnAuthorizationsInput, searchOwnAuthorizationsConsistency, searchProcessDefinitionsInput, searchProcessDefinitionsConsistency, searchProcessDefinitionVariableNamesInput, searchProcessDefinitionVariableNamesConsistency, searchProcessInstanceIncidentsInput, searchProcessInstanceIncidentsConsistency, searchProcessInstancesInput, searchProcessInstancesConsistency, searchResourcesInput, searchResourcesConsistency, searchRolesInput, searchRolesConsistency, searchRolesForGroupInput, searchRolesForGroupConsistency, searchRolesForTenantInput, searchRolesForTenantConsistency, searchTenantsInput, searchTenantsConsistency, searchUsersInput, searchUsersConsistency, searchUsersForGroupInput, searchUsersForGroupConsistency, searchUsersForRoleInput, searchUsersForRoleConsistency, searchUsersForTenantInput, searchUsersForTenantConsistency, searchUserTaskAuditLogsInput, searchUserTaskAuditLogsConsistency, searchUserTaskEffectiveVariablesInput, searchUserTaskEffectiveVariablesConsistency, searchUserTasksInput, searchUserTasksConsistency, searchUserTaskVariablesInput, searchUserTaskVariablesConsistency, searchVariablesInput, searchVariablesConsistency, suspendBatchOperationInput, suspendProcessInstanceInput, suspendProcessInstancesBatchOperationInput, syncRuntimeBackupStateInput, syncRuntimeBackupStateAsClusterAdminInput, takeHistoryBackupInput, takeHistoryBackupAsClusterAdminInput, takeRuntimeBackupInput, takeRuntimeBackupAsClusterAdminInput, throwJobErrorInput, triggerClusterRebalanceInput, unassignClientFromGroupInput, unassignClientFromTenantInput, unassignGroupFromTenantInput, unassignMappingRuleFromGroupInput, unassignMappingRuleFromTenantInput, unassignRoleFromClientInput, unassignRoleFromGroupInput, unassignRoleFromMappingRuleInput, unassignRoleFromTenantInput, unassignRoleFromUserInput, unassignUserFromGroupInput, unassignUserFromTenantInput, unassignUserTaskInput, updateAgentInstanceInput, updateAuthorizationInput, updateGlobalClusterVariableInput, updateGlobalTaskListenerInput, updateGroupInput, updateJobInput, updateJobsBatchOperationInput, updateMappingRuleInput, updateRoleInput, updateTenantInput, updateTenantClusterVariableInput, updateUserInput, updateUserTaskInput, ExtendedDeploymentResult } from './operations.gen';
const VOID_RESPONSES = new Set(['zDeleteAuthorizationResponse', 'zUpdateAuthorizationResponse', 'zDeleteRuntimeBackupStateResponse', 'zDeleteRuntimeBackupResponse', 'zDeleteHistoryBackupResponse', 'zCancelBatchOperationResponse', 'zResumeBatchOperationResponse', 'zSuspendBatchOperationResponse', 'zPinClockResponse', 'zResetClockResponse', 'zDeleteGlobalClusterVariableResponse', 'zDeleteTenantClusterVariableResponse', 'zDeleteDecisionInstanceResponse', 'zDeleteDocumentResponse', 'zActivateAdHocSubProcessActivitiesResponse', 'zCreateElementInstanceVariablesResponse', 'zPauseExportingResponse', 'zResumeExportingResponse', 'zDeleteGlobalTaskListenerResponse', 'zDeleteGroupResponse', 'zUnassignClientFromGroupResponse', 'zAssignClientToGroupResponse', 'zUnassignMappingRuleFromGroupResponse', 'zAssignMappingRuleToGroupResponse', 'zUnassignUserFromGroupResponse', 'zAssignUserToGroupResponse', 'zResolveIncidentResponse', 'zUpdateJobResponse', 'zCompleteJobResponse', 'zThrowJobErrorResponse', 'zFailJobResponse', 'zDeleteMappingRuleResponse', 'zAssignProcessInstanceBusinessIdResponse', 'zCancelProcessInstanceResponse', 'zDeleteProcessInstanceResponse', 'zMigrateProcessInstanceResponse', 'zModifyProcessInstanceResponse', 'zResumeProcessInstanceResponse', 'zSuspendProcessInstanceResponse', 'zDeleteRoleResponse', 'zUnassignRoleFromClientResponse', 'zAssignRoleToClientResponse', 'zUnassignRoleFromGroupResponse', 'zAssignRoleToGroupResponse', 'zUnassignRoleFromMappingRuleResponse', 'zAssignRoleToMappingRuleResponse', 'zUnassignRoleFromUserResponse', 'zAssignRoleToUserResponse', 'zGetStatusResponse', 'zDeleteTenantResponse', 'zUnassignClientFromTenantResponse', 'zAssignClientToTenantResponse', 'zUnassignGroupFromTenantResponse', 'zAssignGroupToTenantResponse', 'zUnassignMappingRuleFromTenantResponse', 'zAssignMappingRuleToTenantResponse', 'zUnassignRoleFromTenantResponse', 'zAssignRoleToTenantResponse', 'zUnassignUserFromTenantResponse', 'zAssignUserToTenantResponse', 'zPauseClusterExportingResponse', 'zResumeClusterExportingResponse', 'zDeleteRuntimeBackupStateAsClusterAdminResponse', 'zDeleteRuntimeBackupAsClusterAdminResponse', 'zDeleteHistoryBackupAsClusterAdminResponse', 'zDeleteUserResponse', 'zUpdateUserTaskResponse', 'zUnassignUserTaskResponse', 'zAssignUserTaskResponse', 'zCompleteUserTaskResponse']);
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'CancelError';
  }
}
export type { CamundaOptions, CancelablePromise };

export function createCamundaClient(options?: CamundaOptions): CamundaClient {
  return new CamundaClient(options);
}

/**
 * The Camunda client's operation methods. Create clients with {@link createCamundaClient}
 * or {@link CamundaClient}, which add `.paginate(...)` to every search operation.
 */
export class CamundaClientBase extends CamundaCore {
  /** Registered job workers created via createJobWorker (lifecycle managed by user). */
  private _workers: any[] = [];
  /** Shared thread pool for all threaded job workers (lazy-initialised on first use). */
  private _threadPool: ThreadPool | null = null;

  constructor(opts: CamundaOptions = {}) {
    // Discriminate the full client from bare `CamundaCore` (and consumer subclasses of
    // it) for support diagnostics — see `CamundaOptions.__camundaComponent`.
    super({ ...opts, __camundaComponent: 'CamundaClient' });
    // Attach `.paginate` to every search* operation (issue #3). One well-known
    // wiring point; discovers search methods generically (no per-op list).
    installSearchPagination(this);
  }

  // Helper for detecting documented void responses (stable public contract).
  // The generated per-operation functions carry their own copy of the set.
  // Uses build-time generated VOID_RESPONSES set (no runtime zod dependency needed)
  private _isVoidResponse(name: string): boolean {
    return VOID_RESPONSES.has(name);
  }

  // Lazy-load the full zod schema module. Returns cached module. Operations load
  // their own per-operation schema module instead (see operations.gen.ts); this
  // stays on the class (not the core) so the per-operation entry point does not
  // reference the whole schema module.
  private _schemasPromise: Promise<typeof import('../gen/zod.gen')> | null = null;
  private _loadSchemas(): Promise<typeof import('../gen/zod.gen')> {
    if (!this._schemasPromise) {
      this._schemasPromise = import('../gen/zod.gen');
    }
    return this._schemasPromise;
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
  // Generated methods: each delegates to its standalone function in operations.gen.ts
  /**
   * Activate activities within an ad-hoc sub-process
   *
   * Activates selected activities within an ad-hoc sub-process identified by element ID.
   * The provided element IDs must exist within the ad-hoc sub-process instance identified by the
   * provided adHocSubProcessInstanceKey.
   *
    *
   * @example Activate ad-hoc sub-process activities
   * ```ts
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
   * ```
   * @operationId activateAdHocSubProcessActivities
   * @tags Ad-hoc sub-process
   */
  activateAdHocSubProcessActivities(input: activateAdHocSubProcessActivitiesInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.activateAdHocSubProcessActivities>>;
  activateAdHocSubProcessActivities(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.activateAdHocSubProcessActivities(this, arg, options);
  }

  /**
   * Activate jobs
   *
   * Iterate through all known partitions and activate jobs up to the requested maximum.
   *
    *
   * @example Activate and process jobs
   * ```ts
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
   * ```
   * @operationId activateJobs
   * @tags Job
   */
  activateJobs(input: activateJobsInput & { withLease: true }, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJobOf<ActivatedJobResultWithJobLeaseToken>[] }>;
  activateJobs(input: activateJobsInput & { withLease?: false | null | undefined }, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJobOf<ActivatedJobResultWithoutJobLeaseToken>[] }>;
  activateJobs(input: activateJobsInput, options?: OperationOptions): CancelablePromise<{ jobs: EnrichedActivatedJob[] }>;
  activateJobs(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.activateJobs(this, arg, options);
  }

  /**
   * Assign a client to a group
   *
   * Assigns a client to a group, making it a member of the group.
   * Members of the group inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @example Assign a client to a group
   * ```ts
   * async function assignClientToGroupExample(groupId: GroupId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignClientToGroup({
   *     groupId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId assignClientToGroup
   * @tags Group
   */
  assignClientToGroup(input: assignClientToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToGroup>>;
  assignClientToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignClientToGroup(this, arg, options);
  }

  /**
   * Assign a client to a tenant
   *
   * Assign the client to the specified tenant.
   * The client can then access tenant data and perform authorized actions.
   *
    *
   * @example Assign a client to a tenant
   * ```ts
   * async function assignClientToTenantExample(tenantId: TenantId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignClientToTenant({
   *     tenantId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId assignClientToTenant
   * @tags Tenant
   */
  assignClientToTenant(input: assignClientToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToTenant>>;
  assignClientToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignClientToTenant(this, arg, options);
  }

  /**
   * Assign a group to a tenant
   *
   * Assigns a group to a specified tenant.
   * Group members (users, clients) can then access tenant data and perform authorized actions.
   *
    *
   * @example Assign a group to a tenant
   * ```ts
   * async function assignGroupToTenantExample(tenantId: TenantId, groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignGroupToTenant({
   *     tenantId,
   *     groupId,
   *   });
   * }
   * ```
   * @operationId assignGroupToTenant
   * @tags Tenant
   */
  assignGroupToTenant(input: assignGroupToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignGroupToTenant>>;
  assignGroupToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignGroupToTenant(this, arg, options);
  }

  /**
   * Assign a mapping rule to a group
   *
   * Assigns a mapping rule to a group.
    *
   * @example Assign a mapping rule to a group
   * ```ts
   * async function assignMappingRuleToGroupExample(groupId: GroupId, mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignMappingRuleToGroup({
   *     groupId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId assignMappingRuleToGroup
   * @tags Group
   */
  assignMappingRuleToGroup(input: assignMappingRuleToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToGroup>>;
  assignMappingRuleToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignMappingRuleToGroup(this, arg, options);
  }

  /**
   * Assign a mapping rule to a tenant
   *
   * Assign a single mapping rule to a specified tenant.
    *
   * @example Assign a mapping rule to a tenant
   * ```ts
   * async function assignMappingRuleToTenantExample(tenantId: TenantId, mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignMappingRuleToTenant({
   *     tenantId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId assignMappingRuleToTenant
   * @tags Tenant
   */
  assignMappingRuleToTenant(input: assignMappingRuleToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToTenant>>;
  assignMappingRuleToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignMappingRuleToTenant(this, arg, options);
  }

  /**
   * Assign business id to process instance
   *
   * Assigns a business id to an already-running process instance that currently has none.
   *
   * The assignment is single and irreversible: only artifacts created after the assignment
   * (for example future jobs, user tasks, decision instances, and message subscriptions) carry
   * the business id, while existing artifacts are not retroactively enriched. Re-sending the
   * same business id succeeds as a no-op. This endpoint is only useful while business id
   * uniqueness enforcement is disabled; when it is enabled, the request is rejected with a 409
   * response.
   *
    *
   * @example Assign a business ID to a process instance
   * ```ts
   * async function assignProcessInstanceBusinessIdExample(
   *   processInstanceKey: ProcessInstanceKey,
   *   businessId: BusinessId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignProcessInstanceBusinessId({
   *     processInstanceKey,
   *     businessId,
   *   });
   * }
   * ```
   * @operationId assignProcessInstanceBusinessId
   * @tags Process instance
   */
  assignProcessInstanceBusinessId(input: assignProcessInstanceBusinessIdInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignProcessInstanceBusinessId>>;
  assignProcessInstanceBusinessId(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignProcessInstanceBusinessId(this, arg, options);
  }

  /**
   * Assign a role to a client
   *
   * Assigns the specified role to the client. The client will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a client
   * ```ts
   * async function assignRoleToClientExample(roleId: RoleId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToClient({
   *     roleId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId assignRoleToClient
   * @tags Role
   */
  assignRoleToClient(input: assignRoleToClientInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToClient>>;
  assignRoleToClient(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignRoleToClient(this, arg, options);
  }

  /**
   * Assign a role to a group
   *
   * Assigns the specified role to the group. Every member of the group (user or client) will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a group
   * ```ts
   * async function assignRoleToGroupExample(roleId: RoleId, groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToGroup({
   *     roleId,
   *     groupId,
   *   });
   * }
   * ```
   * @operationId assignRoleToGroup
   * @tags Role
   */
  assignRoleToGroup(input: assignRoleToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToGroup>>;
  assignRoleToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignRoleToGroup(this, arg, options);
  }

  /**
   * Assign a role to a mapping rule
   *
   * Assigns a role to a mapping rule.
    *
   * @example Assign a role to a mapping rule
   * ```ts
   * async function assignRoleToMappingRuleExample(roleId: RoleId, mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToMappingRule({
   *     roleId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId assignRoleToMappingRule
   * @tags Role
   */
  assignRoleToMappingRule(input: assignRoleToMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToMappingRule>>;
  assignRoleToMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignRoleToMappingRule(this, arg, options);
  }

  /**
   * Assign a role to a tenant
   *
   * Assigns a role to a specified tenant.
   * Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
   *
    *
   * @example Assign a role to a tenant
   * ```ts
   * async function assignRoleToTenantExample(tenantId: TenantId, roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToTenant({
   *     tenantId,
   *     roleId,
   *   });
   * }
   * ```
   * @operationId assignRoleToTenant
   * @tags Tenant
   */
  assignRoleToTenant(input: assignRoleToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToTenant>>;
  assignRoleToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignRoleToTenant(this, arg, options);
  }

  /**
   * Assign a role to a user
   *
   * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
    *
   * @example Assign a role to a user
   * ```ts
   * async function assignRoleToUserExample(roleId: RoleId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignRoleToUser({
   *     roleId,
   *     username,
   *   });
   * }
   * ```
   * @operationId assignRoleToUser
   * @tags Role
   */
  assignRoleToUser(input: assignRoleToUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToUser>>;
  assignRoleToUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignRoleToUser(this, arg, options);
  }

  /**
   * Assign user task
   *
   * Assigns a user task with the given key to the given assignee. Assignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Assign a user task
   * ```ts
   * async function assignUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserTask({
   *     userTaskKey,
   *     assignee: 'alice',
   *     allowOverride: true,
   *   });
   * }
   * ```
   * @operationId assignUserTask
   * @tags User task
   */
  assignUserTask(input: assignUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserTask>>;
  assignUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignUserTask(this, arg, options);
  }

  /**
   * Assign a user to a group
   *
   * Assigns a user to a group, making the user a member of the group.
   * Group members inherit the group authorizations, roles, and tenant assignments.
   *
    *
   * @example Assign a user to a group
   * ```ts
   * async function assignUserToGroupExample(groupId: GroupId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserToGroup({
   *     groupId,
   *     username,
   *   });
   * }
   * ```
   * @operationId assignUserToGroup
   * @tags Group
   */
  assignUserToGroup(input: assignUserToGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToGroup>>;
  assignUserToGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignUserToGroup(this, arg, options);
  }

  /**
   * Assign a user to a tenant
   *
   * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
    *
   * @example Assign a user to a tenant
   * ```ts
   * async function assignUserToTenantExample(tenantId: TenantId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.assignUserToTenant({
   *     tenantId,
   *     username,
   *   });
   * }
   * ```
   * @operationId assignUserToTenant
   * @tags Tenant
   */
  assignUserToTenant(input: assignUserToTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToTenant>>;
  assignUserToTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.assignUserToTenant(this, arg, options);
  }

  /**
   * Broadcast signal
   *
   * Broadcasts a signal.
    *
   * @example Broadcast a signal
   * ```ts
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
   * ```
   * @operationId broadcastSignal
   * @tags Signal
   */
  broadcastSignal(input: broadcastSignalInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.broadcastSignal(this, arg, options);
  }

  /**
   * Cancel Batch operation
   *
   * Cancels a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Cancel a batch operation
   * ```ts
   * async function cancelBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.cancelBatchOperation({ batchOperationKey });
   * }
   * ```
   * @operationId cancelBatchOperation
   * @tags Batch operation
   */
  cancelBatchOperation(input: cancelBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.cancelBatchOperation(this, arg, options);
  }

  /**
   * Stop the running rebalance
   *
   * Asks the running rebalance to stop once the transfer in flight has finished. Partitions already transferred keep their new leaders, and those the rebalance had not yet reached keep their current ones.
   *
   * Cancellation requests are idempotent and always accepted. The `wasRunning` response field can be used to distinguish a cancellation that found a running rebalance from one that did not.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Cancel the running cluster rebalance
   * ```ts
   * async function cancelClusterRebalanceExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.cancelClusterRebalance();
   * 
   *   console.log(`Cancel requested; was a rebalance running? ${result.wasRunning}`);
   * }
   * ```
   * @operationId cancelClusterRebalance
   * @tags Cluster
   */
  cancelClusterRebalance(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelClusterRebalance>>;
  cancelClusterRebalance(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.cancelClusterRebalance(this, options ?? arg);
  }

  /**
   * Cancel process instance
   *
   * Cancels a running process instance. As a cancellation includes more than just the removal of the process instance resource, the cancellation resource must be posted. Cancellation can wait on listener-related processing; when that processing does not complete in time, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Cancel a process instance
   * ```ts
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
   * ```
   * @operationId cancelProcessInstance
   * @tags Process instance
   */
  cancelProcessInstance(input: cancelProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstance>>;
  cancelProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.cancelProcessInstance(this, arg, options);
  }

  /**
   * Cancel process instances (batch)
   *
   * Cancels multiple active or suspended process instances.
   * Only ACTIVE and SUSPENDED root instances can be cancelled. A state filter narrows the batch
   * to the given states. Requesting any state other than ACTIVE or SUSPENDED through the `$eq` or
   * `$in` operators is rejected. Other state operators (`$neq`, `$exists`, `$like`) are applied as
   * given, and the batch remains limited to ACTIVE and SUSPENDED instances. Without a state filter,
   * both ACTIVE and SUSPENDED instances are selected. Any given filter for parentProcessInstanceKey
   * is ignored and overridden during this batch operation.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Cancel process instances in batch
   * ```ts
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
   * ```
   * @operationId cancelProcessInstancesBatchOperation
   * @tags Process instance
   */
  cancelProcessInstancesBatchOperation(input: cancelProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.cancelProcessInstancesBatchOperation(this, arg, options);
  }

  /**
   * Change cluster mode
   *
   * Transitions the cluster between processing and recovery mode. This is a non-blocking operation: the request is acknowledged once the change has been accepted, before the transition itself has completed. Entering recovery mode deactivates all partitions so that only a restricted set of read-only operations remains available; exiting recovery mode returns the cluster to normal processing. Returns the planned cluster change so its progress can be monitored via the topology.
    *
   * @example Change cluster mode
   * ```ts
   * async function changeClusterModeExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Transition the cluster into recovery mode. Pass `dryRun: true` to validate
   *   // the request and inspect the resulting plan without applying it. Omit it (or
   *   // set it to false) to actually trigger the transition.
   *   const change = await camunda.changeClusterMode({
   *     mode: 'RECOVERING',
   *     dryRun: true,
   *   });
   * 
   *   // Operations are grouped by physical tenant; a null tenant means the operation
   *   // is not scoped to one, such as a broker lifecycle operation.
   *   console.log(`Cluster change ${change.changeId}:`);
   *   for (const group of change.plannedChanges) {
   *     console.log(`  ${group.physicalTenantId ?? 'cluster-wide'}:`);
   *     for (const op of group.operations) {
   *       console.log(`    ${op.operation}${op.mode ? ` -> ${op.mode}` : ''}`);
   *     }
   *   }
   * }
   * ```
   * @operationId changeClusterMode
   * @tags Recovery
   */
  changeClusterMode(input: changeClusterModeInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.changeClusterMode>>;
  changeClusterMode(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.changeClusterMode(this, arg, options);
  }

  /**
   * Change the cluster mode of one or every physical tenant
   *
   * Transitions physical tenants between processing and recovery mode.
   *
   * If the `physicalTenantId` parameter is not provided, all available physical tenants are transitioned individually.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Change cluster mode as cluster admin
   * ```ts
   * async function changeClusterModeAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // The cluster-admin variant can target a single physical tenant. Omit
   *   // `physicalTenantId` to apply the change to every physical tenant.
   *   const change = await camunda.changeClusterModeAsClusterAdmin({
   *     mode: 'RECOVERING',
   *     physicalTenantId: 'default',
   *     dryRun: true,
   *   });
   * 
   *   console.log(`Cluster change ${change.changeId}:`);
   *   for (const group of change.plannedChanges) {
   *     console.log(`  ${group.physicalTenantId ?? 'cluster-wide'}:`);
   *     for (const op of group.operations) {
   *       console.log(`    ${op.operation}${op.mode ? ` -> ${op.mode}` : ''}`);
   *     }
   *   }
   * }
   * ```
   * @operationId changeClusterModeAsClusterAdmin
   * @tags Recovery
   */
  changeClusterModeAsClusterAdmin(input: changeClusterModeAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.changeClusterModeAsClusterAdmin>>;
  changeClusterModeAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.changeClusterModeAsClusterAdmin(this, arg, options);
  }

  /**
   * Complete job
   *
   * Complete a job with the given payload, which allows completing the associated service task.
   *
    *
   * @example Complete a job
   * ```ts
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
   * ```
   * @operationId completeJob
   * @tags Job
   */
  completeJob(input: completeJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.completeJob>>;
  completeJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.completeJob(this, arg, options);
  }

  /**
   * Complete user task
   *
   * Completes a user task with the given key. Completion waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Complete a user task
   * ```ts
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
   * ```
   * @operationId completeUserTask
   * @tags User task
   */
  completeUserTask(input: completeUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.completeUserTask>>;
  completeUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.completeUserTask(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId correlateMessage
   * @tags Message
   */
  correlateMessage(input: correlateMessageInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.correlateMessage(this, arg, options);
  }

  /**
   * Create admin user
   *
   * Creates a new user and assigns the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
    *
   * @example Create an admin user
   * ```ts
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
   * ```
   * @operationId createAdminUser
   * @tags Setup
   */
  createAdminUser(input: createAdminUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createAdminUser(this, arg, options);
  }

  /**
   * Create agent instance
   *
   * Creates a new agent instance. The returned key identifies the instance and must
   * be used in subsequent update and query calls.
   *
    *
   * @example Create an agent instance
   * ```ts
   * async function createAgentInstanceExample(
   *   elementInstanceKey: ElementInstanceKey,
   *   jobKey: JobKey,
   *   jobLeaseToken: JobLeaseToken
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   // The batch must open with a CONFIGURATION item; it establishes the model,
   *   // provider and system prompt for the instance.
   *   const result = await camunda.createAgentInstance({
   *     elementInstanceKey,
   *     jobKey,
   *     jobLeaseToken,
   *     history: [
   *       {
   *         historyItemId: HistoryItemId.assumeExists('configuration-1'),
   *         loopIteration: 1,
   *         role: 'CONFIGURATION',
   *         content: [],
   *         producedAt: new Date().toISOString(),
   *         model: 'gpt-4o',
   *         provider: 'openai',
   *         systemPrompt: [{ contentType: 'TEXT', text: 'You are a helpful assistant.' }],
   *       },
   *     ],
   *   });
   * 
   *   console.log(`Created agent instance: ${result.agentInstanceKey}`);
   * }
   * ```
   * @operationId createAgentInstance
   * @tags Agent instance
   */
  createAgentInstance(input: createAgentInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createAgentInstance>>;
  createAgentInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createAgentInstance(this, arg, options);
  }

  /**
   * Create authorization
   *
   * Create the authorization.
    *
   * @example Create an authorization
   * ```ts
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
   * ```
   * @operationId createAuthorization
   * @tags Authorization
   */
  createAuthorization(input: createAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createAuthorization>>;
  createAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createAuthorization(this, arg, options);
  }

  /**
   * Deploy resources
   *
   * Deploys one or more resources, including BPMN processes, DMN decision models, forms, RPA resources, and generic files.
   * A deployment can contain any file type. Files that are not interpreted as BPMN, DMN, form, or RPA resources are stored as deployable generic resources in the engine.
   * This is an atomic call, i.e. either all resources are deployed or none of them are.
   *
    *
   * @example Deploy resources from files
   * ```ts
   * async function deployResourcesFromFilesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Node.js only: deploy directly from file paths
   *   const result = await camunda.deployResourcesFromFiles(['./process.bpmn', './decision.dmn']);
   * 
   *   console.log(`Deployment key: ${result.deploymentKey}`);
   * }
   * ```
   * @operationId createDeployment
   * @tags Resource
   * @returns Enriched deployment result with typed arrays (processes, decisions, decisionRequirements, forms, resources).
   */
  createDeployment(input: createDeploymentInput, options?: OperationOptions): CancelablePromise<ExtendedDeploymentResult>;
  createDeployment(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createDeployment(this, arg, options);
  }

  /**
   * Upload document
   *
   * Upload a document to the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, Azure, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Upload a document
   * ```ts
   * async function createDocumentExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const file = new Blob(['Hello, world!'], { type: 'text/plain' });
   * 
   *   const result = await camunda.createDocument({
   *     file,
   *     metadata: { fileName: 'hello.txt' },
   *   });
   * 
   *   console.log(`Document ID: ${result.documentId}`);
   * }
   * ```
   * @operationId createDocument
   * @tags Document
   */
  createDocument(input: createDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocument>>;
  createDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createDocument(this, arg, options);
  }

  /**
   * Create document link
   *
   * Create a link to a document in the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, Azure, GCP
   *
    *
   * @example Create a document link
   * ```ts
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
   * ```
   * @operationId createDocumentLink
   * @tags Document
   */
  createDocumentLink(input: createDocumentLinkInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocumentLink>>;
  createDocumentLink(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createDocumentLink(this, arg, options);
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
   * Note that this is currently supported for document stores of type: AWS, Azure, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Upload multiple documents
   * ```ts
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
   * ```
   * @operationId createDocuments
   * @tags Document
   */
  createDocuments(input: createDocumentsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createDocuments>>;
  createDocuments(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createDocuments(this, arg, options);
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
   * ```ts
   * async function createElementInstanceVariablesExample(elementInstanceKey: ElementInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.createElementInstanceVariables({
   *     elementInstanceKey,
   *     variables: { orderId: 'ORD-12345', status: 'processing' },
   *   });
   * }
   * ```
   * @operationId createElementInstanceVariables
   * @tags Element instance
   */
  createElementInstanceVariables(input: createElementInstanceVariablesInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createElementInstanceVariables>>;
  createElementInstanceVariables(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createElementInstanceVariables(this, arg, options);
  }

  /**
   * Create a global-scoped cluster variable
   *
   * Create a global-scoped cluster variable.
    *
   * @example Create a global cluster variable
   * ```ts
   * async function createGlobalClusterVariableExample(name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createGlobalClusterVariable({
   *     name,
   *     value: { darkMode: true },
   *   });
   * 
   *   console.log(`Created: ${result.name}`);
   * }
   * ```
   * @operationId createGlobalClusterVariable
   * @tags Cluster Variable
   */
  createGlobalClusterVariable(input: createGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGlobalClusterVariable>>;
  createGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createGlobalClusterVariable(this, arg, options);
  }

  /**
   * Create global user task listener
   *
   * Create a new global user task listener.
    *
   * @example Create a global task listener
   * ```ts
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
   * ```
   * @operationId createGlobalTaskListener
   * @tags Global listener
   */
  createGlobalTaskListener(input: createGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGlobalTaskListener>>;
  createGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createGlobalTaskListener(this, arg, options);
  }

  /**
   * Create group
   *
   * Create a new group.
   *
   * The supplied `groupId` is validated against `^[a-zA-Z0-9_~@.+-]+$`
   * (max 256 characters) by `IdentifierValidator.validateId` in the
   * runtime. This strict validation applies wherever the Groups API
   * is available: in OIDC deployments that set
   * `camunda.security.authentication.oidc.groupsClaim` the Groups
   * API (including this endpoint) is disabled entirely, so group
   * CRUD never sees externally-minted IdP IDs. The BYOG relaxation
   * only loosens validation when a group is referenced *as a member*
   * of a role or tenant (`assignRoleToGroup`,
   * `assignGroupToTenant`); group CRUD itself always uses the strict
   * default-id regex. The constraint is not advertised on the
   * `GroupId` schema so that the same schema can be reused at
   * member-reference sites without falsely rejecting
   * externally-minted IdP group IDs there.
   *
    *
   * @example Create a group
   * ```ts
   * async function createGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createGroup({
   *     groupId,
   *     name: 'Engineering Team',
   *   });
   * 
   *   console.log(`Created group: ${result.groupId}`);
   * }
   * ```
   * @operationId createGroup
   * @tags Group
   */
  createGroup(input: createGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createGroup>>;
  createGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createGroup(this, arg, options);
  }

  /**
   * Create mapping rule
   *
   * Create a new mapping rule
   *
    *
   * @example Create a mapping rule
   * ```ts
   * async function createMappingRuleExample(mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createMappingRule({
   *     mappingRuleId,
   *     name: 'LDAP Group Mapping',
   *     claimName: 'groups',
   *     claimValue: 'engineering',
   *   });
   * 
   *   console.log(`Created mapping rule: ${result.mappingRuleId}`);
   * }
   * ```
   * @operationId createMappingRule
   * @tags Mapping rule
   */
  createMappingRule(input: createMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createMappingRule>>;
  createMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createMappingRule(this, arg, options);
  }

  /**
   * Create process instance
   *
   * Creates and starts an instance of the specified process.
   * The process definition to use to create the instance can be specified either using its unique key
   * (as returned by Deploy resources), or using the BPMN process id and a version.
   * If only the process definition id is given, the latest ACTIVE version is used.
   * If no ACTIVE version exists, the request is rejected as not found.
   *
   * Waits for the completion of the process instance before returning a result
   * when awaitCompletion is enabled.
   *
    *
   * @example By ID
   * ```ts
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
   * ```
   * @example By key
   * ```ts
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
   * ```
   * @operationId createProcessInstance
   * @tags Process instance
   */
  createProcessInstance(input: createProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createProcessInstance(this, arg, options);
  }

  /**
   * Create role
   *
   * Create a new role.
    *
   * @example Create a role
   * ```ts
   * async function createRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createRole({
   *     roleId,
   *     name: 'Process Admin',
   *   });
   * 
   *   console.log(`Created role: ${result.roleId}`);
   * }
   * ```
   * @operationId createRole
   * @tags Role
   */
  createRole(input: createRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createRole>>;
  createRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createRole(this, arg, options);
  }

  /**
   * Create tenant
   *
   * Creates a new tenant.
    *
   * @example Create a tenant
   * ```ts
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
   * ```
   * @operationId createTenant
   * @tags Tenant
   */
  createTenant(input: createTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createTenant>>;
  createTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createTenant(this, arg, options);
  }

  /**
   * Create a tenant-scoped cluster variable
   *
   * Create a new cluster variable for the given tenant.
    *
   * @example Create a tenant cluster variable
   * ```ts
   * async function createTenantClusterVariableExample(tenantId: TenantId, name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.createTenantClusterVariable({
   *     tenantId,
   *     name,
   *     value: { region: 'us-east-1' },
   *   });
   * 
   *   console.log(`Created: ${result.name}`);
   * }
   * ```
   * @operationId createTenantClusterVariable
   * @tags Cluster Variable
   */
  createTenantClusterVariable(input: createTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createTenantClusterVariable>>;
  createTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createTenantClusterVariable(this, arg, options);
  }

  /**
   * Create user
   *
   * Create a new user.
    *
   * @example Create a user
   * ```ts
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
   * ```
   * @operationId createUser
   * @tags User
   */
  createUser(input: createUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.createUser(this, arg, options);
  }

  /**
   * Delete authorization
   *
   * Deletes the authorization with the given key.
    *
   * @example Delete an authorization
   * ```ts
   * async function deleteAuthorizationExample(authorizationKey: AuthorizationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteAuthorization({ authorizationKey });
   * }
   * ```
   * @operationId deleteAuthorization
   * @tags Authorization
   */
  deleteAuthorization(input: deleteAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteAuthorization>>;
  deleteAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteAuthorization(this, arg, options);
  }

  /**
   * Delete decision instance
   *
   * Delete all associated decision evaluations based on provided key.
    *
   * @example Delete a decision instance
   * ```ts
   * async function deleteDecisionInstanceExample(decisionEvaluationKey: DecisionEvaluationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteDecisionInstance({ decisionEvaluationKey });
   * }
   * ```
   * @operationId deleteDecisionInstance
   * @tags Decision instance
   */
  deleteDecisionInstance(input: deleteDecisionInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstance>>;
  deleteDecisionInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteDecisionInstance(this, arg, options);
  }

  /**
   * Delete decision instances (batch)
   *
   * Delete multiple decision instances. This will delete the historic data from secondary storage.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Delete decision instances in batch
   * ```ts
   * async function deleteDecisionInstancesBatchOperationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.deleteDecisionInstancesBatchOperation({
   *     filter: {},
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * ```
   * @operationId deleteDecisionInstancesBatchOperation
   * @tags Decision instance
   */
  deleteDecisionInstancesBatchOperation(input: deleteDecisionInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDecisionInstancesBatchOperation>>;
  deleteDecisionInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteDecisionInstancesBatchOperation(this, arg, options);
  }

  /**
   * Delete document
   *
   * Delete a document from the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, Azure, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Delete a document
   * ```ts
   * async function deleteDocumentExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteDocument({ documentId });
   * }
   * ```
   * @operationId deleteDocument
   * @tags Document
   */
  deleteDocument(input: deleteDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDocument>>;
  deleteDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteDocument(this, arg, options);
  }

  /**
   * Delete a global-scoped cluster variable
   *
   * Delete a global-scoped cluster variable.
    *
   * @example Delete a global cluster variable
   * ```ts
   * async function deleteGlobalClusterVariableExample(name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGlobalClusterVariable({ name });
   * }
   * ```
   * @operationId deleteGlobalClusterVariable
   * @tags Cluster Variable
   */
  deleteGlobalClusterVariable(input: deleteGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalClusterVariable>>;
  deleteGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteGlobalClusterVariable(this, arg, options);
  }

  /**
   * Delete global user task listener
   *
   * Deletes a global user task listener.
    *
   * @example Delete a global task listener
   * ```ts
   * async function deleteGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGlobalTaskListener({
   *     id,
   *   });
   * }
   * ```
   * @operationId deleteGlobalTaskListener
   * @tags Global listener
   */
  deleteGlobalTaskListener(input: deleteGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGlobalTaskListener>>;
  deleteGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteGlobalTaskListener(this, arg, options);
  }

  /**
   * Delete group
   *
   * Deletes the group with the given ID.
    *
   * @example Delete a group
   * ```ts
   * async function deleteGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteGroup({ groupId });
   * }
   * ```
   * @operationId deleteGroup
   * @tags Group
   */
  deleteGroup(input: deleteGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGroup>>;
  deleteGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteGroup(this, arg, options);
  }

  /**
   * Delete history backup
   *
   * Deletes the history backup with the given id, by deleting every snapshot that makes it
   * up.
   *
   * Only available on clusters whose secondary storage is Elasticsearch or OpenSearch.
   *
    *
   * @example Delete a history backup
   * ```ts
   * async function deleteHistoryBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteHistoryBackup({ backupId: 100 });
   * }
   * ```
   * @operationId deleteHistoryBackup
   * @tags Backup
   */
  deleteHistoryBackup(input: deleteHistoryBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteHistoryBackup>>;
  deleteHistoryBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteHistoryBackup(this, arg, options);
  }

  /**
   * Delete a history backup across physical tenants
   *
   * Deletes the history backup with the given id from every physical tenant of the cluster, or from the one named by `physicalTenantId`. A tenant that does not hold the backup has already reached the requested end state, so it counts as deleted rather than as a failure.
   *
   * The request is all-or-nothing: a physical tenant the backup cannot be deleted from fails the whole request, and the deletions that already succeeded on other tenants are not undone. Narrow the request with `physicalTenantId` to delete from the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Only available on clusters whose secondary storage is Elasticsearch or OpenSearch. Use `DELETE /v2/backups/history/{backupId}` to act as a single physical tenant.
    *
   * @example Delete a history backup (cluster admin)
   * ```ts
   * async function deleteHistoryBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Deletion fans out to every physical tenant (or a single one when
   *   // `physicalTenantId` is given) and is not undone if a later tenant fails.
   *   await camunda.deleteHistoryBackupAsClusterAdmin({ backupId: 100 });
   * }
   * ```
   * @operationId deleteHistoryBackupAsClusterAdmin
   * @tags Backup
   */
  deleteHistoryBackupAsClusterAdmin(input: deleteHistoryBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteHistoryBackupAsClusterAdmin>>;
  deleteHistoryBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteHistoryBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Delete a mapping rule
   *
   * Deletes the mapping rule with the given ID.
   *
    *
   * @example Delete a mapping rule
   * ```ts
   * async function deleteMappingRuleExample(mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteMappingRule({ mappingRuleId });
   * }
   * ```
   * @operationId deleteMappingRule
   * @tags Mapping rule
   */
  deleteMappingRule(input: deleteMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteMappingRule>>;
  deleteMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteMappingRule(this, arg, options);
  }

  /**
   * Delete process instance
   *
   * Deletes a process instance. Only instances that are completed or terminated can be deleted.
    *
   * @example Delete a process instance
   * ```ts
   * async function deleteProcessInstanceExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteProcessInstance({ processInstanceKey });
   * }
   * ```
   * @operationId deleteProcessInstance
   * @tags Process instance
   */
  deleteProcessInstance(input: deleteProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstance>>;
  deleteProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteProcessInstance(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId deleteProcessInstancesBatchOperation
   * @tags Process instance
   */
  deleteProcessInstancesBatchOperation(input: deleteProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteProcessInstancesBatchOperation>>;
  deleteProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteProcessInstancesBatchOperation(this, arg, options);
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
   * to `true`. History deletion is supported for process definitions and decision requirements
   * definitions; for other resource types (forms, generic resources) the flag is ignored and no
   * history is deleted.
   *
   * The two supported types differ in how the history is removed. For a decision requirements
   * definition the history is deleted asynchronously via a batch operation whose details are
   * returned in the `batchOperation` field of the response. For a process definition that still
   * exists in the runtime state, the definition first drains its running instances and its
   * history is deleted asynchronously once the definition is fully removed cluster-wide; no batch
   * operation is returned in the response. If the process definition has already been removed
   * from the runtime state and the deletion is later re-triggered with `deleteHistory` set to
   * `true`, a batch operation is created immediately and returned in the `batchOperation` field.
    *
   * @example Delete a resource
   * ```ts
   * async function deleteResourceExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   // Use a process definition key as a resource key for deletion
   *   await camunda.deleteResource({
   *     resourceKey,
   *   });
   * }
   * ```
   * @operationId deleteResource
   * @tags Resource
   */
  deleteResource(input: deleteResourceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteResource>>;
  deleteResource(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteResource(this, arg, options);
  }

  /**
   * Delete role
   *
   * Deletes the role with the given ID.
    *
   * @example Delete a role
   * ```ts
   * async function deleteRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteRole({ roleId });
   * }
   * ```
   * @operationId deleteRole
   * @tags Role
   */
  deleteRole(input: deleteRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRole>>;
  deleteRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteRole(this, arg, options);
  }

  /**
   * Delete runtime backup
   *
   * Deletes the runtime backup with the given id.
    *
   * @example Delete a runtime backup
   * ```ts
   * async function deleteRuntimeBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteRuntimeBackup({ backupId: 100 });
   * }
   * ```
   * @operationId deleteRuntimeBackup
   * @tags Backup
   */
  deleteRuntimeBackup(input: deleteRuntimeBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRuntimeBackup>>;
  deleteRuntimeBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteRuntimeBackup(this, arg, options);
  }

  /**
   * Delete a runtime backup across physical tenants
   *
   * Deletes the runtime backup with the given id from every physical tenant of the cluster, or from the one named by `physicalTenantId`. A tenant that does not hold the backup has already reached the requested end state, so it counts as deleted rather than as a failure — the same as deleting an unknown backup id through the per-physical-tenant endpoint.
   *
   * The request is all-or-nothing: a physical tenant the backup cannot be deleted from fails the whole request, and the deletions that already succeeded on other tenants are not undone. Narrow the request with `physicalTenantId` to delete from the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `DELETE /v2/backups/runtime/{backupId}` to act as a single physical tenant.
    *
   * @example Delete a runtime backup (cluster admin)
   * ```ts
   * async function deleteRuntimeBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Deletion fans out to every physical tenant (or a single one when
   *   // `physicalTenantId` is given) and is not undone if a later tenant fails.
   *   await camunda.deleteRuntimeBackupAsClusterAdmin({ backupId: 100 });
   * }
   * ```
   * @operationId deleteRuntimeBackupAsClusterAdmin
   * @tags Backup
   */
  deleteRuntimeBackupAsClusterAdmin(input: deleteRuntimeBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRuntimeBackupAsClusterAdmin>>;
  deleteRuntimeBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteRuntimeBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Delete runtime backup state
   *
   * Resets the runtime backup state of every partition of the physical tenant, clearing
   * all checkpoint info, backup info, checkpoint metadata, and backup ranges. Used when
   * switching backup stores.
   *
    *
   * @example Delete the runtime backup state
   * ```ts
   * async function deleteRuntimeBackupStateExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Clears all checkpoint info, backup info, checkpoint metadata, and backup
   *   // ranges on every partition. Used when switching backup stores.
   *   await camunda.deleteRuntimeBackupState();
   * }
   * ```
   * @operationId deleteRuntimeBackupState
   * @tags Backup
   */
  deleteRuntimeBackupState(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRuntimeBackupState>>;
  deleteRuntimeBackupState(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteRuntimeBackupState(this, options ?? arg);
  }

  /**
   * Delete runtime backup state across physical tenants
   *
   * Resets the runtime backup state of every partition of every physical tenant of the cluster, or of the one named by `physicalTenantId`, clearing all checkpoint info, backup info, checkpoint metadata, and backup ranges. Used when switching backup stores.
   *
   * The request is all-or-nothing: a physical tenant whose state cannot be reset fails the whole request, and the resets that already succeeded on other tenants are not undone. Narrow the request with `physicalTenantId` to reset the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `DELETE /v2/backups/runtime/state` to act as a single physical tenant.
    *
   * @example Delete the runtime backup state (cluster admin)
   * ```ts
   * async function deleteRuntimeBackupStateAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Clears all checkpoint info, backup info, checkpoint metadata, and backup
   *   // ranges on every partition of every targeted physical tenant (or a single one
   *   // when `physicalTenantId` is given). Used when switching backup stores.
   *   await camunda.deleteRuntimeBackupStateAsClusterAdmin({});
   * }
   * ```
   * @operationId deleteRuntimeBackupStateAsClusterAdmin
   * @tags Backup
   */
  deleteRuntimeBackupStateAsClusterAdmin(input: deleteRuntimeBackupStateAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRuntimeBackupStateAsClusterAdmin>>;
  deleteRuntimeBackupStateAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteRuntimeBackupStateAsClusterAdmin(this, arg, options);
  }

  /**
   * Delete tenant
   *
   * Deletes an existing tenant.
    *
   * @example Delete a tenant
   * ```ts
   * async function deleteTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteTenant({ tenantId });
   * }
   * ```
   * @operationId deleteTenant
   * @tags Tenant
   */
  deleteTenant(input: deleteTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteTenant>>;
  deleteTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteTenant(this, arg, options);
  }

  /**
   * Delete a tenant-scoped cluster variable
   *
   * Delete a tenant-scoped cluster variable.
    *
   * @example Delete a tenant cluster variable
   * ```ts
   * async function deleteTenantClusterVariableExample(tenantId: TenantId, name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteTenantClusterVariable({
   *     tenantId,
   *     name,
   *   });
   * }
   * ```
   * @operationId deleteTenantClusterVariable
   * @tags Cluster Variable
   */
  deleteTenantClusterVariable(input: deleteTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteTenantClusterVariable>>;
  deleteTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteTenantClusterVariable(this, arg, options);
  }

  /**
   * Delete user
   *
   * Deletes a user.
    *
   * @example Delete a user
   * ```ts
   * async function deleteUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.deleteUser({ username });
   * }
   * ```
   * @operationId deleteUser
   * @tags User
   */
  deleteUser(input: deleteUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.deleteUser(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId evaluateConditionals
   * @tags Conditional
   */
  evaluateConditionals(input: evaluateConditionalsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateConditionals>>;
  evaluateConditionals(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.evaluateConditionals(this, arg, options);
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
   * ```ts
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
   * ```
   * @example By key
   * ```ts
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
   * ```
   * @operationId evaluateDecision
   * @tags Decision definition
   */
  evaluateDecision(input: evaluateDecisionInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.evaluateDecision(this, arg, options);
  }

  /**
   * Evaluate an expression
   *
   * Evaluates a FEEL expression and returns the result. Supports references to tenant scoped
   * cluster variables when a tenant ID is provided. Optionally, provide a `scopeKey` to make the
   * variables of a specific process instance or element instance visible while evaluating the
   * expression.
   *
    *
   * @example Evaluate an expression
   * ```ts
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
   * ```
   * @operationId evaluateExpression
   * @tags Expression
   */
  evaluateExpression(input: evaluateExpressionInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateExpression>>;
  evaluateExpression(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.evaluateExpression(this, arg, options);
  }

  /**
   * Fail job
   *
   * Mark the job as failed.
   *
    *
   * @example Fail a job with retry
   * ```ts
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
   * ```
   * @operationId failJob
   * @tags Job
   */
  failJob(input: failJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.failJob>>;
  failJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.failJob(this, arg, options);
  }

  /**
   * Get agent definition
   *
   * Returns an agent definition by key.
    *
   * @example Get an agent definition
   * ```ts
   * async function getAgentDefinitionExample(agentDefinitionKey: AgentDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const definition = await camunda.getAgentDefinition(
   *     { agentDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Name: ${definition.name}`);
   *   console.log(`Type: ${definition.agentType}`);
   *   console.log(`Element: ${definition.elementId}`);
   * }
   * ```
   * @operationId getAgentDefinition
   * @tags Agent definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAgentDefinition(input: getAgentDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getAgentDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAgentDefinition>>;
  getAgentDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAgentDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getAgentDefinition(this, arg, consistencyManagement, options);
  }

  /**
   * Get agent instance
   *
   * Returns agent instance as JSON.
    *
   * @example Get an agent instance
   * ```ts
   * async function getAgentInstanceExample(agentInstanceKey: AgentInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const instance = await camunda.getAgentInstance(
   *     { agentInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Status: ${instance.status}`);
   *   console.log(`Element: ${instance.elementId}`);
   * }
   * ```
   * @operationId getAgentInstance
   * @tags Agent instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAgentInstance(input: getAgentInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getAgentInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAgentInstance>>;
  getAgentInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAgentInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getAgentInstance(this, arg, consistencyManagement, options);
  }

  /**
   * Get audit log
   *
   * Get an audit log entry by auditLogKey.
    *
   * @example Get an audit log entry
   * ```ts
   * async function getAuditLogExample(auditLogKey: AuditLogKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const log = await camunda.getAuditLog({ auditLogKey }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Audit log: ${log.operationType}`);
   * }
   * ```
   * @operationId getAuditLog
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuditLog(input: getAuditLogInput, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuditLog>>;
  getAuditLog(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuditLogConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getAuditLog(this, arg, consistencyManagement, options);
  }

  /**
   * Get current user
   *
   * Retrieves the current authenticated user.
    *
   * @example Get authentication info
   * ```ts
   * async function getAuthenticationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const user = await camunda.getAuthentication();
   * 
   *   console.log(`Authenticated as: ${user.username}`);
   * }
   * ```
   * @operationId getAuthentication
   * @tags Authentication
   */
  getAuthentication(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthentication>>;
  getAuthentication(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getAuthentication(this, options ?? arg);
  }

  /**
   * Get authorization
   *
   * Get authorization by the given key.
    *
   * @example Get an authorization
   * ```ts
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
   * ```
   * @operationId getAuthorization
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuthorization(input: getAuthorizationInput, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getAuthorization(this, arg, consistencyManagement, options);
  }

  /**
   * Get batch operation
   *
   * Get batch operation by key.
    *
   * @example Get a batch operation
   * ```ts
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
   * ```
   * @operationId getBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getBatchOperation(input: getBatchOperationInput, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getBatchOperation(this, arg, consistencyManagement, options);
  }

  /**
   * Get exporting status of the whole cluster
   *
   * Returns the exporting status of the whole cluster, folded over the exporting status of every physical tenant. Only `PAUSED` and `SOFT_PAUSED` confirm that exporting is paused cluster-wide; every other value means at least one physical tenant is not paused, so callers should keep polling. A physical tenant that itself reports `MIXED` makes the whole cluster `MIXED`.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Get cluster exporting status
   * ```ts
   * async function getClusterExportingStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Reports the aggregated exporting status of the whole cluster — useful to
   *   // confirm exporting has paused everywhere before taking a cluster-wide backup.
   *   const { status } = await camunda.getClusterExportingStatus();
   *   console.log(`Cluster exporting status: ${status}`);
   * }
   * ```
   * @operationId getClusterExportingStatus
   * @tags Exporting
   */
  getClusterExportingStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getClusterExportingStatus>>;
  getClusterExportingStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getClusterExportingStatus(this, options ?? arg);
  }

  /**
   * Report the cluster's current leadership balance
   *
   * Reports whether the cluster is currently balanced, the current leadership state of every partition, and what became of the last rebalance to finish. The last completed rebalance is held in memory by the coordinating broker, so none will be reported if the coordinator has moved or restarted since the last rebalance.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Get cluster rebalance status
   * ```ts
   * async function getClusterRebalanceExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const balance = await camunda.getClusterRebalance();
   * 
   *   console.log(`Cluster balance state: ${balance.state}`);
   *   for (const partition of balance.partitions) {
   *     console.log(
   *       `  Partition ${partition.partitionId}: state=${partition.state}, currentLeader=${partition.currentLeader}, desiredLeader=${partition.desiredLeader}`
   *     );
   *   }
   *   if (balance.runningRebalance) {
   *     console.log(`Running rebalance id=${balance.runningRebalance.rebalanceId}`);
   *   }
   * }
   * ```
   * @operationId getClusterRebalance
   * @tags Cluster
   */
  getClusterRebalance(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getClusterRebalance>>;
  getClusterRebalance(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getClusterRebalance(this, options ?? arg);
  }

  /**
   * Get the status of the whole cluster
   *
   * Checks the health status of the whole cluster, aggregated over all physical tenants. Returns `HEALTHY` when every physical tenant is healthy, `DOWN` when no physical tenant can process work, and `DEGRADED` in every other case. No per-tenant detail is reported; use `GET /cluster/v2/topology` for that.
   *
   * This endpoint is public and requires no authentication, unlike `PATCH /cluster/v2/mode` below, which needs cluster-admin credentials.
    *
   * @example Get cluster status
   * ```ts
   * async function getClusterStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const status = await camunda.getClusterStatus();
   * 
   *   console.log(`Cluster status: ${status.status}`);
   * }
   * ```
   * @operationId getClusterStatus
   * @tags Cluster
   */
  getClusterStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getClusterStatus>>;
  getClusterStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getClusterStatus(this, options ?? arg);
  }

  /**
   * Get the topology of the whole cluster
   *
   * Obtains the topology of the whole cluster, aggregated over all physical tenants. Cluster-level information is reported once; partition layout, replication and per-partition role, health and state are reported per physical tenant.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `GET /v2/topology` for the topology of a single physical tenant.
    *
   * @example Get cluster topology (v2)
   * ```ts
   * async function getClusterTopologyExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Returns the full cluster topology: brokers, physical tenants (in a
   *   // multi-tenant cluster), cluster size, and gateway version.
   *   const topology = await camunda.getClusterTopology();
   * 
   *   console.log(
   *     `Cluster ${topology.clusterId} — ${topology.clusterSize} broker(s), gateway ${topology.gatewayVersion}`
   *   );
   *   for (const broker of topology.brokers) {
   *     console.log(`  Broker ${broker.brokerId}: ${broker.host}:${broker.port} (${broker.version})`);
   *   }
   *   for (const tenant of topology.physicalTenants) {
   *     console.log(
   *       `  Physical tenant ${tenant.physicalTenantId}: ${tenant.partitionsCount} partition(s), replication ${tenant.replicationFactor}`
   *     );
   *   }
   * }
   * ```
   * @operationId getClusterTopology
   * @tags Cluster
   */
  getClusterTopology(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getClusterTopology>>;
  getClusterTopology(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getClusterTopology(this, options ?? arg);
  }

  /**
   * Get the upgrade-readiness status of the whole cluster
   *
   * Reports one overall upgrade-readiness status for the whole cluster, folded over every physical tenant and condition. `MIGRATED` only once every known condition has migrated for every known physical tenant; `MIGRATION_IN_PROGRESS` when at least one is confirmed not yet migrated; `UNKNOWN` otherwise (including before anything has been reported yet). No per-tenant or per-condition detail is reported here; see the `upgradeReadiness` actuator endpoint for that.
    *
   * @example Get cluster upgrade-readiness status
   * ```ts
   * async function getClusterUpgradeStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const upgradeStatus = await camunda.getClusterUpgradeStatus();
   * 
   *   console.log(`Cluster upgrade-readiness status: ${upgradeStatus.status}`);
   * }
   * ```
   * @operationId getClusterUpgradeStatus
   * @tags Cluster
   */
  getClusterUpgradeStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getClusterUpgradeStatus>>;
  getClusterUpgradeStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getClusterUpgradeStatus(this, options ?? arg);
  }

  /**
   * Get decision definition
   *
   * Returns a decision definition by key.
    *
   * @example Get a decision definition
   * ```ts
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
   * ```
   * @operationId getDecisionDefinition
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinition(input: getDecisionDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDecisionDefinition(this, arg, consistencyManagement, options);
  }

  /**
   * Get decision definition XML
   *
   * Returns decision definition as XML.
    *
   * @example Get decision definition XML
   * ```ts
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
   * ```
   * @operationId getDecisionDefinitionXML
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinitionXml(input: getDecisionDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDecisionDefinitionXml(this, arg, consistencyManagement, options);
  }

  /**
   * Get decision instance
   *
   * Returns a decision instance.
    *
   * @example Get a decision instance
   * ```ts
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
   * ```
   * @operationId getDecisionInstance
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionInstance(input: getDecisionInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDecisionInstance(this, arg, consistencyManagement, options);
  }

  /**
   * Get decision requirements
   *
   * Returns Decision Requirements as JSON.
    *
   * @example Get decision requirements
   * ```ts
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
   * ```
   * @operationId getDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirements(input: getDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDecisionRequirements(this, arg, consistencyManagement, options);
  }

  /**
   * Get decision requirements XML
   *
   * Returns decision requirements as XML.
    *
   * @example Get decision requirements XML
   * ```ts
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
   * ```
   * @operationId getDecisionRequirementsXML
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirementsXml(input: getDecisionRequirementsXmlInput, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDecisionRequirementsXml(this, arg, consistencyManagement, options);
  }

  /**
   * Download document
   *
   * Download a document from the Camunda 8 cluster.
   *
   * Note that this is currently supported for document stores of type: AWS, Azure, GCP, in-memory (non-production), local (non-production)
   *
    *
   * @example Download a document
   * ```ts
   * async function getDocumentExample(documentId: DocumentId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.getDocument({ documentId });
   * 
   *   console.log(`Downloaded document: ${documentId}`);
   * }
   * ```
   * @operationId getDocument
   * @tags Document
   */
  getDocument(input: getDocumentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getDocument>>;
  getDocument(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getDocument(this, arg, options);
  }

  /**
   * Get element instance
   *
   * Returns element instance as JSON.
    *
   * @example Get an element instance
   * ```ts
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
   * ```
   * @operationId getElementInstance
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getElementInstance(input: getElementInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getElementInstance(this, arg, consistencyManagement, options);
  }

  /**
   * Get exporting status
   *
   * Returns the exporting status of the physical tenant, aggregated over every replica of
   * every one of its partitions.
   *
   * Because pause and resume are applied to all replicas, the status is only a single phase
   * if every replica reports that phase; otherwise it is `MIXED`, which means a pause or
   * resume is still in flight or was only partially applied. Backup tooling should treat
   * only `PAUSED` and `SOFT_PAUSED` as confirmation that exporting is paused.
   *
    *
   * @example Get exporting status
   * ```ts
   * async function getExportingStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Reports the aggregated exporting status of the physical tenant — useful to
   *   // confirm exporting has actually paused before taking a backup, and that it
   *   // has resumed afterwards.
   *   const { status } = await camunda.getExportingStatus();
   *   console.log(`Exporting status: ${status}`);
   * }
   * ```
   * @operationId getExportingStatus
   * @tags Exporting
   */
  getExportingStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getExportingStatus>>;
  getExportingStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getExportingStatus(this, options ?? arg);
  }

  /**
   * Get form by key
   *
   * Get a form by its unique form key.
   *
    *
   * @example Get a form by key
   * ```ts
   * async function getFormByKeyExample(formKey: FormKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const form = await camunda.getFormByKey(
   *     {
   *       formKey,
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Form: ${form.formId}, version: ${form.version}`);
   * }
   * ```
   * @operationId getFormByKey
   * @tags Form
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getFormByKey(input: getFormByKeyInput, /** Management of eventual consistency **/ consistencyManagement: getFormByKeyConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getFormByKey>>;
  getFormByKey(arg: any, /** Management of eventual consistency **/ consistencyManagement: getFormByKeyConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getFormByKey(this, arg, consistencyManagement, options);
  }

  /**
   * Get a global-scoped cluster variable
   *
   * Get a global-scoped cluster variable.
    *
   * @example Get a global cluster variable
   * ```ts
   * async function getGlobalClusterVariableExample(name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   const variable = await camunda.getGlobalClusterVariable(
   *     { name },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`${variable.name} = ${variable.value}`);
   * }
   * ```
   * @operationId getGlobalClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalClusterVariable(input: getGlobalClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalClusterVariable>>;
  getGlobalClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalClusterVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getGlobalClusterVariable(this, arg, consistencyManagement, options);
  }

  /**
   * Global job statistics
   *
   * Returns global aggregated counts for jobs. Filter by the creation time window (required) and optionally by jobType.
   *
    *
   * @example Get global job statistics
   * ```ts
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
   * ```
   * @operationId getGlobalJobStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalJobStatistics(input: getGlobalJobStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalJobStatistics>>;
  getGlobalJobStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalJobStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getGlobalJobStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get global user task listener
   *
   * Get a global user task listener by its id.
    *
   * @example Get a global task listener
   * ```ts
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
   * ```
   * @operationId getGlobalTaskListener
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGlobalTaskListener(input: getGlobalTaskListenerInput, /** Management of eventual consistency **/ consistencyManagement: getGlobalTaskListenerConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGlobalTaskListener>>;
  getGlobalTaskListener(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGlobalTaskListenerConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getGlobalTaskListener(this, arg, consistencyManagement, options);
  }

  /**
   * Get group
   *
   * Get a group by its ID.
    *
   * @example Get a group
   * ```ts
   * async function getGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const group = await camunda.getGroup({ groupId }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Group: ${group.name}`);
   * }
   * ```
   * @operationId getGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGroup(input: getGroupInput, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getGroup(this, arg, consistencyManagement, options);
  }

  /**
   * Get history backup
   *
   * Returns detailed status of the history backup with the given id.
   *
   * Only available on clusters whose secondary storage is Elasticsearch or OpenSearch.
   *
    *
   * @example Get a history backup
   * ```ts
   * async function getHistoryBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const backup = await camunda.getHistoryBackup({ backupId: 100 });
   * 
   *   // The aggregated state is derived from the state of every expected snapshot.
   *   console.log(`History backup ${backup.backupId}: ${backup.state}`);
   * }
   * ```
   * @operationId getHistoryBackup
   * @tags Backup
   */
  getHistoryBackup(input: getHistoryBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getHistoryBackup>>;
  getHistoryBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getHistoryBackup(this, arg, options);
  }

  /**
   * Get a history backup across physical tenants
   *
   * Reports what every physical tenant of the cluster, or the one named by `physicalTenantId`, holds for the given backup id. There is no aggregated cluster-level state: a tenant that was reached and does not hold this backup reports `NOT_FOUND`, which is a successful observation rather than a failure.
   *
   * The request is all-or-nothing: a physical tenant whose state cannot be read fails the whole request. Narrow the request with `physicalTenantId` to read the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Only available on clusters whose secondary storage is Elasticsearch or OpenSearch. Use `GET /v2/backups/history/{backupId}` to act as a single physical tenant.
    *
   * @example Get a history backup (cluster admin)
   * ```ts
   * async function getHistoryBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Looking a backup id up directly lists every targeted physical tenant,
   *   // including the ones reporting `NOT_FOUND` — a backup that only some tenants
   *   // hold is a supported outcome.
   *   const backup = await camunda.getHistoryBackupAsClusterAdmin({ backupId: 100 });
   * 
   *   console.log(`Cluster history backup ${backup.backupId}:`);
   *   for (const tenant of backup.physicalTenants) {
   *     console.log(`  [${tenant.physicalTenantId}] ${tenant.state}`);
   *   }
   * }
   * ```
   * @operationId getHistoryBackupAsClusterAdmin
   * @tags Backup
   */
  getHistoryBackupAsClusterAdmin(input: getHistoryBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getHistoryBackupAsClusterAdmin>>;
  getHistoryBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getHistoryBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Get incident
   *
   * Returns incident as JSON.
   *
    *
   * @example Get an incident
   * ```ts
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
   * ```
   * @operationId getIncident
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getIncident(input: getIncidentInput, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(arg: any, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getIncident(this, arg, consistencyManagement, options);
  }

  /**
   * Get error metrics for a job type
   *
   * Returns aggregated metrics per error for the given jobType.
   *
    *
   * @example Get job error statistics
   * ```ts
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
   * ```
   * @operationId getJobErrorStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobErrorStatistics(input: getJobErrorStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobErrorStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobErrorStatistics>>;
  getJobErrorStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobErrorStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getJobErrorStatistics(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId getJobTimeSeriesStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobTimeSeriesStatistics(input: getJobTimeSeriesStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobTimeSeriesStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobTimeSeriesStatistics>>;
  getJobTimeSeriesStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobTimeSeriesStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getJobTimeSeriesStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get job statistics by type
   *
   * Get statistics about jobs, grouped by job type.
   *
    *
   * @example Get job type statistics
   * ```ts
   * async function getJobTypeStatisticsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getJobTypeStatistics({}, { consistency: { waitUpToMs: 5000 } });
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Type: ${stat.jobType}, workers: ${stat.workers}`);
   *   }
   * }
   * ```
   * @operationId getJobTypeStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobTypeStatistics(input: getJobTypeStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobTypeStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobTypeStatistics>>;
  getJobTypeStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobTypeStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getJobTypeStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get job statistics by worker
   *
   * Get statistics about jobs, grouped by worker, for a given job type.
   *
    *
   * @example Get job worker statistics
   * ```ts
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
   * ```
   * @operationId getJobWorkerStatistics
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getJobWorkerStatistics(input: getJobWorkerStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getJobWorkerStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getJobWorkerStatistics>>;
  getJobWorkerStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getJobWorkerStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getJobWorkerStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get license status
   *
   * Obtains the status of the current Camunda license.
    *
   * @example Get license information
   * ```ts
   * async function getLicenseExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const license = await camunda.getLicense();
   * 
   *   console.log(`License type: ${license.validLicense}`);
   * }
   * ```
   * @operationId getLicense
   * @tags License
   */
  getLicense(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getLicense>>;
  getLicense(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getLicense(this, options ?? arg);
  }

  /**
   * Get a mapping rule
   *
   * Gets the mapping rule with the given ID.
   *
    *
   * @example Get a mapping rule
   * ```ts
   * async function getMappingRuleExample(mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const rule = await camunda.getMappingRule(
   *     { mappingRuleId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`Rule: ${rule.name} (${rule.claimName}=${rule.claimValue})`);
   * }
   * ```
   * @operationId getMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getMappingRule(input: getMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getMappingRule(this, arg, consistencyManagement, options);
  }

  /**
   * Get process definition
   *
   * Returns process definition as JSON.
    *
   * @example Get a process definition
   * ```ts
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
   * ```
   * @operationId getProcessDefinition
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinition(input: getProcessDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinition(this, arg, consistencyManagement, options);
  }

  /**
   * Get process instance statistics
   *
   * Get statistics about process instances, grouped by process definition and tenant.
   *
    *
   * @example Get process definition instance statistics
   * ```ts
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
   * ```
   * @operationId getProcessDefinitionInstanceStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceStatistics(input: getProcessDefinitionInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceStatistics>>;
  getProcessDefinitionInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinitionInstanceStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get process instance statistics by version
   *
   * Get statistics about process instances, grouped by version for a given process definition.
   * The process definition ID must be provided as a required field in the request body filter.
   *
    *
   * @example Get version statistics
   * ```ts
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
   * ```
   * @operationId getProcessDefinitionInstanceVersionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionInstanceVersionStatistics(input: getProcessDefinitionInstanceVersionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionInstanceVersionStatistics>>;
  getProcessDefinitionInstanceVersionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionInstanceVersionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinitionInstanceVersionStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get message subscription statistics
   *
   * Get message subscription statistics, grouped by process definition.
   *
    *
   * @example Get message subscription statistics
   * ```ts
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
   * ```
   * @operationId getProcessDefinitionMessageSubscriptionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionMessageSubscriptionStatistics(input: getProcessDefinitionMessageSubscriptionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionMessageSubscriptionStatistics>>;
  getProcessDefinitionMessageSubscriptionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionMessageSubscriptionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinitionMessageSubscriptionStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get process definition statistics
   *
   * Get statistics about elements in currently running process instances by process definition key and search filter.
    *
   * @example Get process definition element statistics
   * ```ts
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
   * ```
   * @operationId getProcessDefinitionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionStatistics(input: getProcessDefinitionStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinitionStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get process definition XML
   *
   * Returns process definition as XML.
    *
   * @example Get process definition XML
   * ```ts
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
   * ```
   * @operationId getProcessDefinitionXML
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionXml(input: getProcessDefinitionXmlInput, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessDefinitionXml(this, arg, consistencyManagement, options);
  }

  /**
   * Get process instance
   *
   * Get the process instance by the process instance key.
    *
   * @example Get a process instance
   * ```ts
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
   * ```
   * @operationId getProcessInstance
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstance(input: getProcessInstanceInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstance(this, arg, consistencyManagement, options);
  }

  /**
   * Get call hierarchy
   *
   * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
    *
   * @example Get process instance call hierarchy
   * ```ts
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
   * ```
   * @operationId getProcessInstanceCallHierarchy
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceCallHierarchy(input: getProcessInstanceCallHierarchyInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceCallHierarchy(this, arg, consistencyManagement, options);
  }

  /**
   * Get sequence flows
   *
   * Get sequence flows taken by the process instance.
    *
   * @example Get process instance sequence flows
   * ```ts
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
   * ```
   * @operationId getProcessInstanceSequenceFlows
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceSequenceFlows(input: getProcessInstanceSequenceFlowsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceSequenceFlows(this, arg, consistencyManagement, options);
  }

  /**
   * Get element instance statistics
   *
   * Get statistics about elements by the process instance key.
    *
   * @example Get process instance statistics
   * ```ts
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
   * ```
   * @operationId getProcessInstanceStatistics
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatistics(input: getProcessInstanceStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceStatistics(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId getProcessInstanceStatisticsByDefinition
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByDefinition(input: getProcessInstanceStatisticsByDefinitionInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByDefinition>>;
  getProcessInstanceStatisticsByDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByDefinitionConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceStatisticsByDefinition(this, arg, consistencyManagement, options);
  }

  /**
   * Get process instance statistics by error
   *
   * Returns statistics for active process instances that currently have active incidents,
   * grouped by incident error hash code.
   *
    *
   * @example Get instance statistics by error
   * ```ts
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
   * ```
   * @operationId getProcessInstanceStatisticsByError
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatisticsByError(input: getProcessInstanceStatisticsByErrorInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatisticsByError>>;
  getProcessInstanceStatisticsByError(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsByErrorConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceStatisticsByError(this, arg, consistencyManagement, options);
  }

  /**
   * Get wait state statistics
   *
   * Get statistics about waiting element instances by the process instance key, grouped by element id.
    *
   * @example Get process instance wait state statistics
   * ```ts
   * async function getProcessInstanceWaitStateStatisticsExample(
   *   processInstanceKey: ProcessInstanceKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.getProcessInstanceWaitStateStatistics(
   *     { processInstanceKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const stat of result.items ?? []) {
   *     console.log(`Element ${stat.elementId}: waiting=${stat.waitingCount}`);
   *   }
   * }
   * ```
   * @operationId getProcessInstanceWaitStateStatistics
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceWaitStateStatistics(input: getProcessInstanceWaitStateStatisticsInput, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceWaitStateStatisticsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceWaitStateStatistics>>;
  getProcessInstanceWaitStateStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceWaitStateStatisticsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getProcessInstanceWaitStateStatistics(this, arg, consistencyManagement, options);
  }

  /**
   * Get resource
   *
   * Returns a deployed resource.
   * :::info
   * This endpoint does not return BPMN process definitions, DMN decision definitions, or form
   * resources. To query BPMN process definitions or DMN decision definitions, use their
   * respective APIs.
   * :::
   *
    *
   * @example Get a resource
   * ```ts
   * async function getResourceExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const resource = await camunda.getResource(
   *     {
   *       resourceKey,
   *     },
   *     { consistency: { waitUpToMs: 0 } }
   *   );
   * 
   *   console.log(`Resource: ${resource.resourceName} (${resource.resourceId})`);
   * }
   * ```
   * @operationId getResource
   * @tags Resource
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getResource(input: getResourceInput, /** Management of eventual consistency **/ consistencyManagement: getResourceConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getResource>>;
  getResource(arg: any, /** Management of eventual consistency **/ consistencyManagement: getResourceConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getResource(this, arg, consistencyManagement, options);
  }

  /**
   * Get RPA resource content (deprecated)
   *
   * **Deprecated** — use `/resources/{resourceKey}/content/binary` instead, which supports all
   * resource types and returns content as binary (octet-stream).
   *
   * Returns the content of a deployed RPA resource as JSON.
   * :::info
   * This endpoint only supports RPA resources. For generic resource content in binary format,
   * use the `/resources/{resourceKey}/content/binary` endpoint.
   * :::
   *
   *
   * @deprecated
    *
   * @example Get resource content
   * ```ts
   * async function getResourceContentExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const content = await camunda.getResourceContent(
   *     {
   *       resourceKey,
   *     },
   *     { consistency: { waitUpToMs: 0 } }
   *   );
   * 
   *   console.log(`Content retrieved (type: ${typeof content})`);
   * }
   * ```
   * @operationId getResourceContent
   * @tags Resource
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getResourceContent(input: getResourceContentInput, /** Management of eventual consistency **/ consistencyManagement: getResourceContentConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getResourceContent>>;
  getResourceContent(arg: any, /** Management of eventual consistency **/ consistencyManagement: getResourceContentConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getResourceContent(this, arg, consistencyManagement, options);
  }

  /**
   * Get resource content as binary
   *
   * Returns the content of a deployed resource in binary format (octet-stream).
   * :::info
   * This endpoint does not return BPMN process definitions, DMN decision definitions, or form
   * resources. To query BPMN process definitions or DMN decision definitions, use their
   * respective APIs.
   * :::
   *
    *
   * @example Get resource content as binary
   * ```ts
   * async function getResourceContentBinaryExample(resourceKey: ProcessDefinitionKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const content = await camunda.getResourceContentBinary(
   *     {
   *       resourceKey,
   *     },
   *     { consistency: { waitUpToMs: 0 } }
   *   );
   * 
   *   console.log(`Binary content retrieved (type: ${typeof content})`);
   * }
   * ```
   * @operationId getResourceContentBinary
   * @tags Resource
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getResourceContentBinary(input: getResourceContentBinaryInput, /** Management of eventual consistency **/ consistencyManagement: getResourceContentBinaryConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getResourceContentBinary>>;
  getResourceContentBinary(arg: any, /** Management of eventual consistency **/ consistencyManagement: getResourceContentBinaryConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getResourceContentBinary(this, arg, consistencyManagement, options);
  }

  /**
   * Get the status of the restore that is currently in progress
   *
   * Returns the status of the restore that is currently in progress, reported per broker and per partition. There is at most one restore in flight at any time. Once the restore has finished this endpoint returns 404; the per-partition detail is not retained after completion.
    *
   * @example Get restore status
   * ```ts
   * async function getRestoreStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const status = await camunda.getRestoreStatus();
   * 
   *   console.log(`Restore status: ${status.status} (change ${status.changeId})`);
   *   for (const broker of status.brokers) {
   *     console.log(
   *       `  Broker ${broker.brokerId}: ${broker.partitionsRestored}/${broker.partitionsToRestore} partitions restored`
   *     );
   *   }
   * }
   * ```
   * @operationId getRestoreStatus
   * @tags Recovery
   */
  getRestoreStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRestoreStatus>>;
  getRestoreStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRestoreStatus(this, options ?? arg);
  }

  /**
   * Get role
   *
   * Get a role by its ID.
    *
   * @example Get a role
   * ```ts
   * async function getRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const role = await camunda.getRole({ roleId }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Role: ${role.name}`);
   * }
   * ```
   * @operationId getRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getRole(input: getRoleInput, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRole(this, arg, consistencyManagement, options);
  }

  /**
   * Get runtime backup
   *
   * Returns detailed status of the runtime backup with the given id.
    *
   * @example Get a runtime backup
   * ```ts
   * async function getRuntimeBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const backup = await camunda.getRuntimeBackup({ backupId: 100 });
   * 
   *   console.log(`Backup ${backup.backupId}: ${backup.state}`);
   *   for (const partition of backup.details) {
   *     console.log(`  Partition ${partition.partitionId}: ${partition.state}`);
   *   }
   * }
   * ```
   * @operationId getRuntimeBackup
   * @tags Backup
   */
  getRuntimeBackup(input: getRuntimeBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRuntimeBackup>>;
  getRuntimeBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRuntimeBackup(this, arg, options);
  }

  /**
   * Get a runtime backup across physical tenants
   *
   * Reports what every physical tenant of the cluster, or the one named by `physicalTenantId`, holds for the given backup id, plus the state aggregated over all of them. A tenant that was reached and does not hold this backup reports `DOES_NOT_EXIST`, which is a successful observation rather than a failure — so a backup only some tenants hold aggregates to `INCOMPLETE`, the same way a backup only some partitions hold does within one tenant.
   *
   * The request is all-or-nothing: a physical tenant whose state cannot be read fails the whole request. Narrow the request with `physicalTenantId` to read the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `GET /v2/backups/runtime/{backupId}` to act as a single physical tenant.
    *
   * @example Get a runtime backup (cluster admin)
   * ```ts
   * async function getRuntimeBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Looking a backup id up directly lists every targeted physical tenant,
   *   // including the ones reporting `DOES_NOT_EXIST` — a backup that only some
   *   // tenants hold is a supported outcome.
   *   const backup = await camunda.getRuntimeBackupAsClusterAdmin({ backupId: 100 });
   * 
   *   console.log(`Cluster runtime backup ${backup.backupId}: ${backup.state}`);
   *   for (const tenant of backup.physicalTenants) {
   *     console.log(`  [${tenant.physicalTenantId}] ${tenant.state}`);
   *   }
   * }
   * ```
   * @operationId getRuntimeBackupAsClusterAdmin
   * @tags Backup
   */
  getRuntimeBackupAsClusterAdmin(input: getRuntimeBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRuntimeBackupAsClusterAdmin>>;
  getRuntimeBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRuntimeBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Get runtime backup state
   *
   * Returns the current checkpoint and backup state of every partition of the physical
   * tenant. Unlike the `backupRuntime` actuator, this fails the whole request if the
   * checkpoint state or the backup ranges cannot be retrieved from any partition, instead
   * of silently returning an empty section.
   *
    *
   * @example Get the runtime backup state
   * ```ts
   * async function getRuntimeBackupStateExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const state = await camunda.getRuntimeBackupState();
   * 
   *   for (const checkpoint of state.checkpointStates) {
   *     console.log(
   *       `Partition ${checkpoint.partitionId} checkpoint ${checkpoint.checkpointId} (${checkpoint.checkpointType})`
   *     );
   *   }
   *   for (const range of state.ranges) {
   *     console.log(
   *       `Partition ${range.partitionId} range: ${range.start?.checkpointId} -> ${range.end?.checkpointId}`
   *     );
   *   }
   * }
   * ```
   * @operationId getRuntimeBackupState
   * @tags Backup
   */
  getRuntimeBackupState(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRuntimeBackupState>>;
  getRuntimeBackupState(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRuntimeBackupState(this, options ?? arg);
  }

  /**
   * Get runtime backup state across physical tenants
   *
   * Reports the checkpoint and backup state of every partition of every physical tenant of the cluster, or of the one named by `physicalTenantId`, grouped by physical tenant. Checkpoint ids and log positions only mean anything within one physical tenant's partitions, so nothing is aggregated across tenants.
   *
   * The request is all-or-nothing: a physical tenant whose state cannot be read fails the whole request rather than contributing an empty section, which an operator making a delete or restore decision could not tell apart from "nothing to report yet". Narrow the request with `physicalTenantId` to read the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `GET /v2/backups/runtime/state` to act as a single physical tenant.
    *
   * @example Get the runtime backup state (cluster admin)
   * ```ts
   * async function getRuntimeBackupStateAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Returns the checkpoint and backup state of every targeted physical tenant.
   *   // Nothing is aggregated across tenants — checkpoint ids and log positions only
   *   // mean anything within one tenant's partitions.
   *   const clusterState = await camunda.getRuntimeBackupStateAsClusterAdmin({});
   * 
   *   for (const tenant of clusterState.physicalTenants) {
   *     console.log(`[${tenant.physicalTenantId}] ${tenant.state.checkpointStates.length} checkpoints`);
   *   }
   * }
   * ```
   * @operationId getRuntimeBackupStateAsClusterAdmin
   * @tags Backup
   */
  getRuntimeBackupStateAsClusterAdmin(input: getRuntimeBackupStateAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getRuntimeBackupStateAsClusterAdmin>>;
  getRuntimeBackupStateAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getRuntimeBackupStateAsClusterAdmin(this, arg, options);
  }

  /**
   * Get process start form
   *
   * Get the start form of a process.
   * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
   *
    *
   * @example Get start process form
   * ```ts
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
   * ```
   * @operationId getStartProcessForm
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getStartProcessForm(input: getStartProcessFormInput, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getStartProcessForm(this, arg, consistencyManagement, options);
  }

  /**
   * Get physical tenant status
   *
   * Checks the health status of the default physical tenant by verifying if there's at least one partition of its group with a healthy leader. This endpoint is scoped to the default physical tenant only: it is available unprefixed and at `/physical-tenants/default/v2/status`, but not for any other physical tenant id (`/physical-tenants/{id}/v2/status` returns 404 for every other id, whether or not a physical tenant with that id exists). On a cluster with only the default physical tenant this endpoint answers the same question as `/cluster/v2/status`, though not with the same response: `/cluster/v2/status` reports its status in a body and so also distinguishes a degraded tenant from a healthy one. Use `/cluster/v2/status` for the aggregated status of the whole cluster, or `/physical-tenants/{id}/v2/topology` for the health of a specific physical tenant's partitions.
    *
   * @example Check cluster status
   * ```ts
   * async function getStatusExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.getStatus();
   * 
   *   console.log('Cluster is healthy');
   * }
   * ```
   * @operationId getStatus
   * @tags Cluster
   */
  getStatus(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getStatus>>;
  getStatus(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getStatus(this, options ?? arg);
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
   * ```ts
   * async function getSystemConfigurationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const config = await camunda.getSystemConfiguration();
   * 
   *   console.log(`Configuration loaded: ${JSON.stringify(config)}`);
   * }
   * ```
   * @operationId getSystemConfiguration
   * @tags System
   */
  getSystemConfiguration(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getSystemConfiguration>>;
  getSystemConfiguration(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getSystemConfiguration(this, options ?? arg);
  }

  /**
   * Get tenant
   *
   * Retrieves a single tenant by tenant ID.
    *
   * @example Get a tenant
   * ```ts
   * async function getTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   const tenant = await camunda.getTenant({ tenantId }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Tenant: ${tenant.name}`);
   * }
   * ```
   * @operationId getTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenant(input: getTenantInput, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Get a tenant-scoped cluster variable
   *
   * Get a tenant-scoped cluster variable.
    *
   * @example Get a tenant cluster variable
   * ```ts
   * async function getTenantClusterVariableExample(tenantId: TenantId, name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   const variable = await camunda.getTenantClusterVariable(
   *     {
   *       tenantId,
   *       name,
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   console.log(`${variable.name} = ${variable.value}`);
   * }
   * ```
   * @operationId getTenantClusterVariable
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenantClusterVariable(input: getTenantClusterVariableInput, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTenantClusterVariable>>;
  getTenantClusterVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantClusterVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getTenantClusterVariable(this, arg, consistencyManagement, options);
  }

  /**
   * Get cluster topology
   *
   * Obtains the current topology of the cluster the gateway is part of.
    *
   * @example Get cluster topology
   * ```ts
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
   * ```
   * @operationId getTopology
   * @tags Cluster
   */
  getTopology(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getTopology>>;
  getTopology(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getTopology(this, options ?? arg);
  }

  /**
   * Get usage metrics
   *
   * Retrieve the usage metrics based on given criteria.
    *
   * @example Get usage metrics
   * ```ts
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
   * ```
   * @operationId getUsageMetrics
   * @tags System
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUsageMetrics(input: getUsageMetricsInput, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUsageMetrics>>;
  getUsageMetrics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getUsageMetrics(this, arg, consistencyManagement, options);
  }

  /**
   * Get user
   *
   * Get a user by its username.
    *
   * @example Get a user
   * ```ts
   * async function getUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   const user = await camunda.getUser({ username }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`User: ${user.name} (${user.email})`);
   * }
   * ```
   * @operationId getUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUser(input: getUserInput, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getUser(this, arg, consistencyManagement, options);
  }

  /**
   * Get user task
   *
   * Get the user task by the user task key.
    *
   * @example Get a user task
   * ```ts
   * async function getUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const task = await camunda.getUserTask({ userTaskKey }, { consistency: { waitUpToMs: 5000 } });
   * 
   *   console.log(`Task: ${task.name} (${task.state})`);
   * }
   * ```
   * @operationId getUserTask
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTask(input: getUserTaskInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getUserTask(this, arg, consistencyManagement, options);
  }

  /**
   * Get user task form
   *
   * Get the form of a user task.
   * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
   *
    *
   * @example Get a user task form
   * ```ts
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
   * ```
   * @operationId getUserTaskForm
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTaskForm(input: getUserTaskFormInput, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getUserTaskForm(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId getVariable
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getVariable(input: getVariableInput, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.getVariable(this, arg, consistencyManagement, options);
  }

  /**
   * List history backups
   *
   * Returns a list of all available history backups of the physical tenant, with their state
   * and additional info, most recent first by snapshot start time.
   *
   * Only available on clusters whose secondary storage is Elasticsearch or OpenSearch.
   *
    *
   * @example List history backups
   * ```ts
   * async function listHistoryBackupsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // `prefix` must end in a single '*'. Omit it to list every history backup.
   *   const backups = await camunda.listHistoryBackups({ prefix: '10*' });
   * 
   *   for (const backup of backups) {
   *     console.log(`History backup ${backup.backupId}: ${backup.state}`);
   *   }
   * }
   * ```
   * @operationId listHistoryBackups
   * @tags Backup
   */
  listHistoryBackups(input: listHistoryBackupsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.listHistoryBackups>>;
  listHistoryBackups(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.listHistoryBackups(this, arg, options);
  }

  /**
   * List history backups across physical tenants
   *
   * Lists the history backups of every physical tenant of the cluster, or of the one named by `physicalTenantId`, grouped by backup id. A backup id that only some physical tenants hold is a supported outcome rather than a degraded one, so only the tenants that hold it are listed under it.
   *
   * The request is all-or-nothing: a physical tenant whose backups cannot be read fails the whole request rather than silently dropping out of the listing. Narrow the request with `physicalTenantId` to list the backups of the tenants that can still be read.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Only available on clusters whose secondary storage is Elasticsearch or OpenSearch. Use `GET /v2/backups/history` to act as a single physical tenant.
    *
   * @example List history backups (cluster admin)
   * ```ts
   * async function listHistoryBackupsAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // `prefix` must end in a single '*'. Omit `physicalTenantId` to span every
   *   // physical tenant of the cluster — results are grouped by backup id, and each
   *   // group lists only the tenants that hold that id.
   *   const backups = await camunda.listHistoryBackupsAsClusterAdmin({ prefix: '10*' });
   * 
   *   for (const backup of backups) {
   *     console.log(`Cluster history backup ${backup.backupId}:`);
   *     for (const tenant of backup.physicalTenants) {
   *       console.log(`  [${tenant.physicalTenantId}] ${tenant.state}`);
   *     }
   *   }
   * }
   * ```
   * @operationId listHistoryBackupsAsClusterAdmin
   * @tags Backup
   */
  listHistoryBackupsAsClusterAdmin(input: listHistoryBackupsAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.listHistoryBackupsAsClusterAdmin>>;
  listHistoryBackupsAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.listHistoryBackupsAsClusterAdmin(this, arg, options);
  }

  /**
   * List runtime backups
   *
   * Returns a list of all available runtime backups of the physical tenant, with their
   * state and additional info, sorted in descending order of backupId.
   *
    *
   * @example List runtime backups
   * ```ts
   * async function listRuntimeBackupsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // `prefix` must end in a single '*'. Omit it to list every backup.
   *   const backups = await camunda.listRuntimeBackups({ prefix: '10*' });
   * 
   *   for (const backup of backups) {
   *     console.log(`Backup ${backup.backupId}: ${backup.state}`);
   *   }
   * }
   * ```
   * @operationId listRuntimeBackups
   * @tags Backup
   */
  listRuntimeBackups(input: listRuntimeBackupsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.listRuntimeBackups>>;
  listRuntimeBackups(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.listRuntimeBackups(this, arg, options);
  }

  /**
   * List runtime backups across physical tenants
   *
   * Lists the runtime backups of every physical tenant of the cluster, or of the one named by `physicalTenantId`, grouped by backup id. Every group reports every targeted tenant, including the ones holding nothing for that id, so a backup only some tenants hold aggregates to `INCOMPLETE` here exactly as it does when looked up directly — the state of a listed group can be trusted to say whether the cluster can be restored from it. A backup id that only some physical tenants hold is a supported outcome rather than a degraded one; tenants that generate their own backup ids never share one, so in that mode each backup forms its own group and the other tenants report `DOES_NOT_EXIST` under it.
   *
   * The request is all-or-nothing: a physical tenant whose backups cannot be read fails the whole request rather than silently dropping out of the listing. Narrow the request with `physicalTenantId` to list the backups of the tenants that can still be read.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `GET /v2/backups/runtime` to act as a single physical tenant.
    *
   * @example List runtime backups (cluster admin)
   * ```ts
   * async function listRuntimeBackupsAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // `prefix` must end in a single '*'. Omit `physicalTenantId` to span every
   *   // physical tenant — results are grouped by backup id, and each group reports
   *   // every targeted tenant, including ones holding nothing for that id (reported
   *   // as `DOES_NOT_EXIST`).
   *   const backups = await camunda.listRuntimeBackupsAsClusterAdmin({ prefix: '10*' });
   * 
   *   for (const backup of backups) {
   *     console.log(`Cluster runtime backup ${backup.backupId}: ${backup.state}`);
   *     for (const tenant of backup.physicalTenants) {
   *       console.log(`  [${tenant.physicalTenantId}] ${tenant.state}`);
   *     }
   *   }
   * }
   * ```
   * @operationId listRuntimeBackupsAsClusterAdmin
   * @tags Backup
   */
  listRuntimeBackupsAsClusterAdmin(input: listRuntimeBackupsAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.listRuntimeBackupsAsClusterAdmin>>;
  listRuntimeBackupsAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.listRuntimeBackupsAsClusterAdmin(this, arg, options);
  }

  /**
   * List secrets
   *
   * List the `camunda.secrets.*` references known for the caller's physical tenant.
   *
   * Only references the caller holds `SECRET:READ` on are returned. This endpoint never
   * returns secret values, only the reference names.
   *
   * The references are read from the secret stores configured for the caller's physical tenant.
   * A store may hold names outside the reference name charset (for example one containing a
   * dot); those are omitted, since `/secrets/resolve` would reject them and no permission can
   * be granted on them.
   *
   * A returned reference is usable verbatim with `/secrets/resolve`. In a FEEL expression,
   * however, a name that is not a bare identifier has to be backtick-escaped, since FEEL reads
   * a bare dash as the minus operator: a listed `camunda.secrets.db-password` is written
   * `` =camunda.secrets.`db-password` `` in a BPMN input mapping.
   *
    *
   * @example List secret references
   * ```ts
   * async function listSecretsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // The request body is reserved for future filtering options and currently
   *   // takes no properties.
   *   const result = await camunda.listSecrets({});
   * 
   *   // Only the references are returned — never the secret values. Use
   *   // `resolveSecrets` to fetch a value when one is actually needed.
   *   for (const reference of result.references) {
   *     console.log(`Secret available: ${reference}`);
   *   }
   * }
   * ```
   * @operationId listSecrets
   * @tags Secret
   */
  listSecrets(input: listSecretsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.listSecrets>>;
  listSecrets(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.listSecrets(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId migrateProcessInstance
   * @tags Process instance
   */
  migrateProcessInstance(input: migrateProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstance>>;
  migrateProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.migrateProcessInstance(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId migrateProcessInstancesBatchOperation
   * @tags Process instance
   */
  migrateProcessInstancesBatchOperation(input: migrateProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.migrateProcessInstancesBatchOperation(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId modifyProcessInstance
   * @tags Process instance
   */
  modifyProcessInstance(input: modifyProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstance>>;
  modifyProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.modifyProcessInstance(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId modifyProcessInstancesBatchOperation
   * @tags Process instance
   */
  modifyProcessInstancesBatchOperation(input: modifyProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.modifyProcessInstancesBatchOperation(this, arg, options);
  }

  /**
   * Pause exporting across the whole cluster
   *
   * Pauses exporting on every physical tenant of the cluster in one call. With `soft=true`, every physical tenant is soft-paused instead.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Pause cluster exporting
   * ```ts
   * async function pauseClusterExportingExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Cluster-admin variant: pauses exporting on every physical tenant of the
   *   // cluster. With `soft: true` exporting keeps running but its position is not
   *   // committed, so the log is still not compacted.
   *   await camunda.pauseClusterExporting({ soft: true });
   * }
   * ```
   * @operationId pauseClusterExporting
   * @tags Exporting
   */
  pauseClusterExporting(input: pauseClusterExportingInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.pauseClusterExporting>>;
  pauseClusterExporting(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.pauseClusterExporting(this, arg, options);
  }

  /**
   * Pause exporting
   *
   * Pauses exporting on all partitions of the physical tenant. While paused, exported records
   * are not committed, so the log is not compacted for the affected partitions.
   *
   * With `soft=true`, exporting continues to run but its position is not committed, so the
   * state after resuming is identical to a hard pause; use this variant when exporting must
   * keep progressing (e.g. to avoid falling behind) while still preventing log compaction,
   * such as during a backup.
   *
    *
   * @example Pause exporting
   * ```ts
   * async function pauseExportingExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // With `soft: true` exporting keeps running but its position is not committed,
   *   // so the log is still not compacted — use it when exporting must keep
   *   // progressing, for example while a backup is taken.
   *   await camunda.pauseExporting({ soft: true });
   * }
   * ```
   * @operationId pauseExporting
   * @tags Exporting
   */
  pauseExporting(input: pauseExportingInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.pauseExporting>>;
  pauseExporting(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.pauseExporting(this, arg, options);
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
   * ```ts
   * async function pinClockExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.pinClock({
   *     timestamp: 1735689599000,
   *   });
   * 
   *   console.log('Clock pinned');
   * }
   * ```
   * @operationId pinClock
   * @tags Clock
   */
  pinClock(input: pinClockInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.pinClock>>;
  pinClock(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.pinClock(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId publishMessage
   * @tags Message
   */
  publishMessage(input: publishMessageInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.publishMessage(this, arg, options);
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
   * ```ts
   * async function resetClockExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resetClock();
   * 
   *   console.log('Clock reset');
   * }
   * ```
   * @operationId resetClock
   * @tags Clock
   */
  resetClock(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resetClock>>;
  resetClock(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resetClock(this, options ?? arg);
  }

  /**
   * Resolve incident
   *
   * Marks the incident as resolved; most likely a call to Update job will be necessary
   * to reset the job's retries, followed by this call.
   *
    *
   * @example Resolve an incident
   * ```ts
   * async function resolveIncidentExample(incidentKey: IncidentKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resolveIncident({ incidentKey });
   * }
   * ```
   * @operationId resolveIncident
   * @tags Incident
   */
  resolveIncident(input: resolveIncidentInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncident>>;
  resolveIncident(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resolveIncident(this, arg, options);
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
   * ```ts
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
   * ```
   * @operationId resolveIncidentsBatchOperation
   * @tags Process instance
   */
  resolveIncidentsBatchOperation(input: resolveIncidentsBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resolveIncidentsBatchOperation(this, arg, options);
  }

  /**
   * Resolve related incidents
   *
   * Creates a batch operation to resolve multiple incidents of a process instance.
    *
   * @example Resolve process instance incidents
   * ```ts
   * async function resolveProcessInstanceIncidentsExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.resolveProcessInstanceIncidents({ processInstanceKey });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * ```
   * @operationId resolveProcessInstanceIncidents
   * @tags Process instance
   */
  resolveProcessInstanceIncidents(input: resolveProcessInstanceIncidentsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveProcessInstanceIncidents>>;
  resolveProcessInstanceIncidents(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resolveProcessInstanceIncidents(this, arg, options);
  }

  /**
   * Resolve secrets
   *
   * Resolve a deduplicated batch of `camunda.secrets.*` references for the caller's
   * physical tenant in a single round-trip.
   *
   * Each reference is authorized and resolved independently. For valid requests, the endpoint
   * always responds with HTTP 200: successfully resolved references are returned in `resolved`,
   * while references that could not be resolved (for example not found, malformed or over-long,
   * or the caller lacks `SECRET:REVEAL` on that reference) are returned in `errors`. A failure of
   * one reference never fails the others. Only structurally invalid requests are rejected with
   * HTTP 400: a missing or non-array `references` field, more than 20 references, or a null entry.
   *
   * References are resolved against the secret stores configured for the caller's physical
   * tenant, served from the gateway's secret cache when the value is already cached and read
   * from the store otherwise.
   *
    *
   * @example Resolve secrets
   * ```ts
   * async function resolveSecretsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.resolveSecrets({
   *     references: ['camunda.secrets.myApiToken', 'camunda.secrets.dbPassword'],
   *   });
   * 
   *   // Successfully resolved references are returned in `resolved`; references that
   *   // could not be resolved are returned in `errors`, each with a typed error code.
   *   // Never log a resolved value — it holds secret material. Pass it straight to the
   *   // consumer that needs it (HTTP client, DB driver, ...) instead.
   *   for (const resolved of result.resolved) {
   *     console.log(`Resolved ${resolved.reference} (value redacted)`);
   *     useSecret(resolved.value);
   *   }
   * 
   *   for (const error of result.errors) {
   *     console.log(`Failed to resolve ${error.reference}: ${error.code} - ${error.message}`);
   *   }
   * }
   * 
   * // Hands the resolved secret to whatever needs it, without logging it.
   * function useSecret(_value: string) {}
   * ```
   * @operationId resolveSecrets
   * @tags Secret
   */
  resolveSecrets(input: resolveSecretsInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveSecrets>>;
  resolveSecrets(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resolveSecrets(this, arg, options);
  }

  /**
   * Restore from a backup
   *
   * Restores the cluster from a backup. The restore is described either by a single backup ID or by a time range (`from`/`to`) that selects the backups to restore. This endpoint is only accessible while the cluster is in recovery mode; requests are rejected otherwise. The request is validated and acknowledged, but the restore itself is performed asynchronously.
    *
   * @example Restore from a backup
   * ```ts
   * async function restoreExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // The cluster must be in recovery mode before a restore is accepted. Provide
   *   // either a list of backup IDs (one per partition) or a time range (`from`/`to`)
   *   // that selects the backups to restore, but not both.
   *   const change = await camunda.restore({
   *     backupIds: [100, 101],
   *   });
   * 
   *   console.log(`Cluster change ${change.changeId}:`);
   *   for (const group of change.plannedChanges) {
   *     console.log(`  ${group.physicalTenantId ?? 'cluster-wide'}:`);
   *     for (const op of group.operations) {
   *       const mode = 'mode' in op ? op.mode : undefined;
   *       console.log(`    ${op.operation}${mode ? ` -> ${mode}` : ''}`);
   *     }
   *   }
   * }
   * ```
   * @operationId restore
   * @tags Recovery
   */
  restore(input: restoreInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.restore>>;
  restore(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.restore(this, arg, options);
  }

  /**
   * Restore one or every physical tenant from a backup
   *
   * Restores physical tenants from backups. The restore is described either by a list of backup IDs or by a time range (`from`/`to`) that selects the backups to restore. Restores are only accepted while the targeted physical tenants are in recovery mode; requests are rejected otherwise. The request is validated and acknowledged, but the restore itself is performed asynchronously.
   *
   * If the `physicalTenantId` parameter is provided, only that physical tenant is restored and `overrides` must be omitted.
   *
   * If it is not provided, every physical tenant of the cluster is restored: those named in `overrides` with their own backup selection, all others with the selection at the top level of the request body.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Restore from a backup as cluster admin
   * ```ts
   * async function restoreAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // The cluster-admin variant can target a specific physical tenant and supports
   *   // per-tenant overrides. Omit `physicalTenantId` to restore every physical
   *   // tenant. Provide either backup IDs (one per partition) or a time range
   *   // (`from`/`to`), but not both.
   *   const change = await camunda.restoreAsClusterAdmin({
   *     backupIds: [200, 201],
   *     physicalTenantId: 'default',
   *     dryRun: true,
   *   });
   * 
   *   console.log(`Cluster change ${change.changeId}:`);
   *   for (const group of change.plannedChanges) {
   *     console.log(`  ${group.physicalTenantId ?? 'cluster-wide'}:`);
   *     for (const op of group.operations) {
   *       const mode = 'mode' in op ? op.mode : undefined;
   *       console.log(`    ${op.operation}${mode ? ` -> ${mode}` : ''}`);
   *     }
   *   }
   * }
   * ```
   * @operationId restoreAsClusterAdmin
   * @tags Recovery
   */
  restoreAsClusterAdmin(input: restoreAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.restoreAsClusterAdmin>>;
  restoreAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.restoreAsClusterAdmin(this, arg, options);
  }

  /**
   * Resume Batch operation
   *
   * Resumes a suspended batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Resume a batch operation
   * ```ts
   * async function resumeBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resumeBatchOperation({ batchOperationKey });
   * }
   * ```
   * @operationId resumeBatchOperation
   * @tags Batch operation
   */
  resumeBatchOperation(input: resumeBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resumeBatchOperation(this, arg, options);
  }

  /**
   * Resume exporting across the whole cluster
   *
   * Resumes exporting on every physical tenant of the cluster in one call, after a pause or soft pause.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Resume cluster exporting
   * ```ts
   * async function resumeClusterExportingExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resumeClusterExporting();
   * }
   * ```
   * @operationId resumeClusterExporting
   * @tags Exporting
   */
  resumeClusterExporting(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeClusterExporting>>;
  resumeClusterExporting(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resumeClusterExporting(this, options ?? arg);
  }

  /**
   * Resume exporting
   *
   * Resumes exporting on all partitions of the physical tenant after a pause or soft pause.
   *
    *
   * @example Resume exporting
   * ```ts
   * async function resumeExportingExample() {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resumeExporting();
   * }
   * ```
   * @operationId resumeExporting
   * @tags Exporting
   */
  resumeExporting(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeExporting>>;
  resumeExporting(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resumeExporting(this, options ?? arg);
  }

  /**
   * Resume process instance
   *
   * Resumes a suspended process instance, returning it to the ACTIVE state and continuing processing.
   * Only process instances in the SUSPENDED state can be resumed.
   * A child process instance can be resumed independently of its parent or root process
   * instance; resumption does not cascade to or from related instances.
   *
    *
   * @example Resume a process instance
   * ```ts
   * async function resumeProcessInstanceExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.resumeProcessInstance({ processInstanceKey });
   * }
   * ```
   * @operationId resumeProcessInstance
   * @tags Process instance
   */
  resumeProcessInstance(input: resumeProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeProcessInstance>>;
  resumeProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resumeProcessInstance(this, arg, options);
  }

  /**
   * Resume process instances (batch)
   *
   * Resumes multiple suspended process instances.
   * Any given filter for state or parentProcessInstanceKey is ignored and overridden, as only
   * SUSPENDED process instances can be resumed and resumption does not cascade between parent
   * and child instances, so child instances are resumed independently of their parent or root
   * instance.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Resume process instances in batch
   * ```ts
   * async function resumeProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.resumeProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * ```
   * @operationId resumeProcessInstancesBatchOperation
   * @tags Process instance
   */
  resumeProcessInstancesBatchOperation(input: resumeProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeProcessInstancesBatchOperation>>;
  resumeProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.resumeProcessInstancesBatchOperation(this, arg, options);
  }

  /**
   * Search agent definitions
   *
   * Search for agent definitions based on given criteria.
    *
   * @example Search agent definitions
   * ```ts
   * async function searchAgentDefinitionsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchAgentDefinitions(
   *     {
   *       filter: { agentType: { $eq: 'AI_AGENT_TASK' } },
   *       sort: [{ field: 'name', order: 'ASC' }],
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const definition of result.items ?? []) {
   *     console.log(`${definition.agentDefinitionKey}: ${definition.name} (${definition.agentType})`);
   *   }
   *   console.log(`Total: ${result.page.totalItems}`);
   * }
   * ```
   * @operationId searchAgentDefinitions
   * @tags Agent definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAgentDefinitions(input: searchAgentDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchAgentDefinitionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAgentDefinitions>>;
  searchAgentDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAgentDefinitionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchAgentDefinitions(this, arg, consistencyManagement, options);
  }

  /**
   * Search agent instance history
   *
   * Searches the conversation history of an agent instance. Committed items
   * are returned by default.
   *
    *
   * @example Search agent instance history
   * ```ts
   * async function searchAgentInstanceHistoryExample(agentInstanceKey: AgentInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchAgentInstanceHistory(
   *     {
   *       agentInstanceKey,
   *       filter: { role: { $eq: 'ASSISTANT' } },
   *       sort: [{ field: 'producedAt', order: 'ASC' }],
   *       page: { limit: 20 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const item of result.items ?? []) {
   *     console.log(`${item.historyItemKey} (${item.role})`);
   *   }
   *   console.log(`Total: ${result.page.totalItems}`);
   * }
   * ```
   * @operationId searchAgentInstanceHistory
   * @tags Agent instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAgentInstanceHistory(input: searchAgentInstanceHistoryInput, /** Management of eventual consistency **/ consistencyManagement: searchAgentInstanceHistoryConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAgentInstanceHistory>>;
  searchAgentInstanceHistory(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAgentInstanceHistoryConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchAgentInstanceHistory(this, arg, consistencyManagement, options);
  }

  /**
   * Search agent instances
   *
   * Search for agent instances based on given criteria.
    *
   * @example Search agent instances
   * ```ts
   * async function searchAgentInstancesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchAgentInstances(
   *     {
   *       filter: { status: { $eq: 'IDLE' } },
   *       sort: [{ field: 'creationDate', order: 'DESC' }],
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const instance of result.items ?? []) {
   *     console.log(`${instance.agentInstanceKey}: ${instance.status}`);
   *   }
   *   console.log(`Total: ${result.page.totalItems}`);
   * }
   * ```
   * @operationId searchAgentInstances
   * @tags Agent instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAgentInstances(input: searchAgentInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchAgentInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAgentInstances>>;
  searchAgentInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAgentInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchAgentInstances(this, arg, consistencyManagement, options);
  }

  /**
   * Search audit logs
   *
   * Search for audit logs based on given criteria.
    *
   * @example Search audit logs
   * ```ts
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
   * ```
   * @operationId searchAuditLogs
   * @tags Audit Log
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuditLogs(input: searchAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAuditLogs>>;
  searchAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuditLogsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchAuditLogs(this, arg, consistencyManagement, options);
  }

  /**
   * Search authorizations
   *
   * Search for authorizations based on given criteria.
    *
   * @example Search authorizations
   * ```ts
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
   * ```
   * @operationId searchAuthorizations
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuthorizations(input: searchAuthorizationsInput, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchAuthorizations(this, arg, consistencyManagement, options);
  }

  /**
   * Search batch operation items
   *
   * Search for batch operation items based on given criteria.
    *
   * @example Search batch operation items
   * ```ts
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
   * ```
   * @operationId searchBatchOperationItems
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperationItems(input: searchBatchOperationItemsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchBatchOperationItems(this, arg, consistencyManagement, options);
  }

  /**
   * Search batch operations
   *
   * Search for batch operations based on given criteria.
    *
   * @example Search batch operations
   * ```ts
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
   * ```
   * @operationId searchBatchOperations
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperations(input: searchBatchOperationsInput, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchBatchOperations(this, arg, consistencyManagement, options);
  }

  /**
   * Search group clients
   *
   * Search clients assigned to a group.
    *
   * @example Search clients in a group
   * ```ts
   * async function searchClientsForGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClientsForGroup(
   *     { groupId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const client of result.items ?? []) {
   *     console.log(`Client: ${client.clientId}`);
   *   }
   * }
   * ```
   * @operationId searchClientsForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForGroup(input: searchClientsForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchClientsForGroup(this, arg, consistencyManagement, options);
  }

  /**
   * Search role clients
   *
   * Search clients with assigned role.
    *
   * @example Search clients for a role
   * ```ts
   * async function searchClientsForRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchClientsForRole(
   *     { roleId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const client of result.items ?? []) {
   *     console.log(`Client: ${client.clientId}`);
   *   }
   * }
   * ```
   * @operationId searchClientsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForRole(input: searchClientsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchClientsForRole(this, arg, consistencyManagement, options);
  }

  /**
   * Search clients for tenant
   *
   * Retrieves a filtered and sorted list of clients for a specified tenant.
    *
   * @example Search clients for a tenant
   * ```ts
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
   * ```
   * @operationId searchClientsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForTenant(input: searchClientsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchClientsForTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Search for cluster variables based on given criteria. By default, long variable values in the response are truncated.
    *
   * @example Search cluster variables
   * ```ts
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
   * ```
   * @operationId searchClusterVariables
   * @tags Cluster Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClusterVariables(input: searchClusterVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchClusterVariables>>;
  searchClusterVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClusterVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchClusterVariables(this, arg, consistencyManagement, options);
  }

  /**
   * Search correlated message subscriptions
   *
   * Search correlated message subscriptions based on given criteria.
    *
   * @example Search correlated message subscriptions
   * ```ts
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
   * ```
   * @operationId searchCorrelatedMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchCorrelatedMessageSubscriptions(input: searchCorrelatedMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchCorrelatedMessageSubscriptions>>;
  searchCorrelatedMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchCorrelatedMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchCorrelatedMessageSubscriptions(this, arg, consistencyManagement, options);
  }

  /**
   * Search decision definitions
   *
   * Search for decision definitions based on given criteria.
    *
   * @example Search decision definitions
   * ```ts
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
   * ```
   * @operationId searchDecisionDefinitions
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionDefinitions(input: searchDecisionDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchDecisionDefinitions(this, arg, consistencyManagement, options);
  }

  /**
   * Search decision instances
   *
   * Search for decision instances based on given criteria.
    *
   * @example Search decision instances
   * ```ts
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
   * ```
   * @operationId searchDecisionInstances
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionInstances(input: searchDecisionInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchDecisionInstances(this, arg, consistencyManagement, options);
  }

  /**
   * Search decision requirements
   *
   * Search for decision requirements based on given criteria.
    *
   * @example Search decision requirements
   * ```ts
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
   * ```
   * @operationId searchDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionRequirements(input: searchDecisionRequirementsInput, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchDecisionRequirements(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId searchElementInstanceIncidents
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstanceIncidents(input: searchElementInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstanceIncidents>>;
  searchElementInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchElementInstanceIncidents(this, arg, consistencyManagement, options);
  }

  /**
   * Search element instances
   *
   * Search for element instances based on given criteria.
    *
   * @example Search element instances
   * ```ts
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
   * ```
   * @operationId searchElementInstances
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstances(input: searchElementInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchElementInstances(this, arg, consistencyManagement, options);
  }

  /**
   * Search element instance wait states
   *
   * Returns the wait states for element instances matching the given filter.
   *
    *
   * @example Search element instance wait states
   * ```ts
   * async function searchElementInstanceWaitStatesExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchElementInstanceWaitStates(
   *     {
   *       filter: {
   *         processInstanceKey,
   *       },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const waitState of result.items ?? []) {
   *     const { details } = waitState;
   *     let description: string;
   *     if (details.waitStateType === 'JOB') {
   *       description = `waiting on job '${details.jobType}'`;
   *     } else if (details.waitStateType === 'MESSAGE') {
   *       description = `waiting for message '${details.messageName}'`;
   *     } else {
   *       description = `waiting (${details.waitStateType})`;
   *     }
   *     console.log(`${waitState.elementId}: ${description}`);
   *   }
   * }
   * ```
   * @operationId searchElementInstanceWaitStates
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstanceWaitStates(input: searchElementInstanceWaitStatesInput, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceWaitStatesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstanceWaitStates>>;
  searchElementInstanceWaitStates(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstanceWaitStatesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchElementInstanceWaitStates(this, arg, consistencyManagement, options);
  }

  /**
   * Search global user task listeners
   *
   * Search for global user task listeners based on given criteria.
    *
   * @example Search global task listeners
   * ```ts
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
   * ```
   * @operationId searchGlobalTaskListeners
   * @tags Global listener
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGlobalTaskListeners(input: searchGlobalTaskListenersInput, /** Management of eventual consistency **/ consistencyManagement: searchGlobalTaskListenersConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGlobalTaskListeners>>;
  searchGlobalTaskListeners(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGlobalTaskListenersConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchGlobalTaskListeners(this, arg, consistencyManagement, options);
  }

  /**
   * Search groups for tenant
   *
   * Retrieves a filtered and sorted list of groups for a specified tenant.
    *
   * @example Search groups for a tenant
   * ```ts
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
   * ```
   * @operationId searchGroupIdsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupIdsForTenant(input: searchGroupIdsForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchGroupIdsForTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Search groups
   *
   * Search for groups based on given criteria.
    *
   * @example Search groups
   * ```ts
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
   * ```
   * @operationId searchGroups
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroups(input: searchGroupsInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchGroups(this, arg, consistencyManagement, options);
  }

  /**
   * Search role groups
   *
   * Search groups with assigned role.
    *
   * @example Search groups for a role
   * ```ts
   * async function searchGroupsForRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchGroupsForRole(
   *     { roleId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const group of result.items ?? []) {
   *     console.log(`Group: ${group.groupId}`);
   *   }
   * }
   * ```
   * @operationId searchGroupsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupsForRole(input: searchGroupsForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchGroupsForRole(this, arg, consistencyManagement, options);
  }

  /**
   * Search incidents
   *
   * Search for incidents based on given criteria.
   *
    *
   * @example Search incidents
   * ```ts
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
   * ```
   * @operationId searchIncidents
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchIncidents(input: searchIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchIncidents(this, arg, consistencyManagement, options);
  }

  /**
   * Search jobs
   *
   * Search for jobs based on given criteria.
    *
   * @example Search jobs
   * ```ts
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
   * ```
   * @operationId searchJobs
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchJobs(input: searchJobsInput, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchJobs(this, arg, consistencyManagement, options);
  }

  /**
   * Search mapping rules
   *
   * Search for mapping rules based on given criteria.
   *
    *
   * @example Search mapping rules
   * ```ts
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
   * ```
   * @operationId searchMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRule(input: searchMappingRuleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchMappingRule(this, arg, consistencyManagement, options);
  }

  /**
   * Search group mapping rules
   *
   * Search mapping rules assigned to a group.
    *
   * @example Search mapping rules for a group
   * ```ts
   * async function searchMappingRulesForGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRulesForGroup(
   *     { groupId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`Mapping rule: ${rule.name}`);
   *   }
   * }
   * ```
   * @operationId searchMappingRulesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForGroup(input: searchMappingRulesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchMappingRulesForGroup(this, arg, consistencyManagement, options);
  }

  /**
   * Search role mapping rules
   *
   * Search mapping rules with assigned role.
    *
   * @example Search mapping rules for a role
   * ```ts
   * async function searchMappingRulesForRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchMappingRulesForRole(
   *     { roleId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const rule of result.items ?? []) {
   *     console.log(`Mapping rule: ${rule.name}`);
   *   }
   * }
   * ```
   * @operationId searchMappingRulesForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForRole(input: searchMappingRulesForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchMappingRulesForRole(this, arg, consistencyManagement, options);
  }

  /**
   * Search mapping rules for tenant
   *
   * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
    *
   * @example Search mapping rules for a tenant
   * ```ts
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
   * ```
   * @operationId searchMappingRulesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForTenant(input: searchMappingRulesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForTenant>>;
  searchMappingRulesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchMappingRulesForTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Search message subscriptions
   *
   * Search for message subscriptions based on given criteria.
   *
   * By default, both start and intermediate event subscriptions are returned. Use the
   * `messageSubscriptionType` filter to restrict results to a single type.
   *
   * **Version notes:**
   * - Start event subscriptions are only captured for deployments made with 8.10 or later.
   * - The `messageSubscriptionType` field is only populated for data created
   * with Camunda 8.10 or later. For pre-8.10 data, intermediate event entries have no
   * `messageSubscriptionType` value stored. For convenience, the API returns `PROCESS_EVENT`
   * as a default for such search results, though.
   * - Searching for intermediate event subscriptions **including legacy data** can be achieved
   * by filtering for `messageSubscriptionType` not matching `START_EVENT`.
   *
    *
   * @example Search message subscriptions
   * ```ts
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
   * ```
   * @operationId searchMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMessageSubscriptions(input: searchMessageSubscriptionsInput, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchMessageSubscriptions(this, arg, consistencyManagement, options);
  }

  /**
   * Search own authorizations
   *
   * Search for the current authenticated principal's own authorization records — including authorizations granted directly to the user or client, as well as those granted via a group, role, or mapping rule the principal belongs to.
    *
   * @example Search own authorizations
   * ```ts
   * async function searchOwnAuthorizationsExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchOwnAuthorizations(
   *     {
   *       filter: { resourceType: 'PROCESS_DEFINITION' },
   *       page: { limit: 10 },
   *     },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const auth of result.items ?? []) {
   *     console.log(`${auth.resourceId}: ${auth.permissionTypes?.join(', ')}`);
   *   }
   * }
   * ```
   * @operationId searchOwnAuthorizations
   * @tags Authentication
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchOwnAuthorizations(input: searchOwnAuthorizationsInput, /** Management of eventual consistency **/ consistencyManagement: searchOwnAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchOwnAuthorizations>>;
  searchOwnAuthorizations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchOwnAuthorizationsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchOwnAuthorizations(this, arg, consistencyManagement, options);
  }

  /**
   * Search process definitions
   *
   * Search for process definitions based on given criteria.
    *
   * @example Search process definitions
   * ```ts
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
   * ```
   * @operationId searchProcessDefinitions
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessDefinitions(input: searchProcessDefinitionsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchProcessDefinitions(this, arg, consistencyManagement, options);
  }

  /**
   * Search process definition variable names
   *
   * Search for distinct variable names defined on a process definition, optionally narrowed by the name filter.
    *
   * @example Search process definition variable names
   * ```ts
   * async function searchProcessDefinitionVariableNamesExample(
   *   processDefinitionKey: ProcessDefinitionKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchProcessDefinitionVariableNames(
   *     { processDefinitionKey },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const variable of result.items ?? []) {
   *     console.log(`Variable name: ${variable.name}`);
   *   }
   * }
   * ```
   * @operationId searchProcessDefinitionVariableNames
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessDefinitionVariableNames(input: searchProcessDefinitionVariableNamesInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionVariableNamesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitionVariableNames>>;
  searchProcessDefinitionVariableNames(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionVariableNamesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchProcessDefinitionVariableNames(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId searchProcessInstanceIncidents
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstanceIncidents(input: searchProcessInstanceIncidentsInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchProcessInstanceIncidents(this, arg, consistencyManagement, options);
  }

  /**
   * Search process instances
   *
   * Search for process instances based on given criteria.
    *
   * @example Search process instances
   * ```ts
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
   * ```
   * @operationId searchProcessInstances
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstances(input: searchProcessInstancesInput, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchProcessInstances(this, arg, consistencyManagement, options);
  }

  /**
   * Search resources
   *
   * Search for deployed resources based on given criteria.
   * :::info
   * This endpoint does not return BPMN process definitions, DMN decision definitions, or form
   * resources. To query BPMN process definitions or DMN decision definitions, use their
   * respective search APIs.
   * :::
   *
    *
   * @example Search resources
   * ```ts
   * async function searchResourcesExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchResources(
   *     { page: { limit: 10 } },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const resource of result.items ?? []) {
   *     console.log(`Resource: ${resource.resourceName}`);
   *   }
   * }
   * ```
   * @operationId searchResources
   * @tags Resource
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchResources(input: searchResourcesInput, /** Management of eventual consistency **/ consistencyManagement: searchResourcesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchResources>>;
  searchResources(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchResourcesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchResources(this, arg, consistencyManagement, options);
  }

  /**
   * Search roles
   *
   * Search for roles based on given criteria.
    *
   * @example Search roles
   * ```ts
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
   * ```
   * @operationId searchRoles
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRoles(input: searchRolesInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchRoles(this, arg, consistencyManagement, options);
  }

  /**
   * Search group roles
   *
   * Search roles assigned to a group.
    *
   * @example Search roles for a group
   * ```ts
   * async function searchRolesForGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchRolesForGroup(
   *     { groupId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const role of result.items ?? []) {
   *     console.log(`Role: ${role.name}`);
   *   }
   * }
   * ```
   * @operationId searchRolesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForGroup(input: searchRolesForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchRolesForGroup(this, arg, consistencyManagement, options);
  }

  /**
   * Search roles for tenant
   *
   * Retrieves a filtered and sorted list of roles for a specified tenant.
    *
   * @example Search roles for a tenant
   * ```ts
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
   * ```
   * @operationId searchRolesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForTenant(input: searchRolesForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchRolesForTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Search tenants
   *
   * Retrieves a filtered and sorted list of tenants.
    *
   * @example Search tenants
   * ```ts
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
   * ```
   * @operationId searchTenants
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchTenants(input: searchTenantsInput, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchTenants(this, arg, consistencyManagement, options);
  }

  /**
   * Search users
   *
   * Search for users based on given criteria.
    *
   * @example Search users
   * ```ts
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
   * ```
   * @operationId searchUsers
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsers(input: searchUsersInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUsers(this, arg, consistencyManagement, options);
  }

  /**
   * Search group users
   *
   * Search users assigned to a group.
    *
   * @example Search users in a group
   * ```ts
   * async function searchUsersForGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsersForGroup(
   *     { groupId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`Member: ${user.username}`);
   *   }
   * }
   * ```
   * @operationId searchUsersForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForGroup(input: searchUsersForGroupInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUsersForGroup(this, arg, consistencyManagement, options);
  }

  /**
   * Search role users
   *
   * Search users with assigned role.
    *
   * @example Search users for a role
   * ```ts
   * async function searchUsersForRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.searchUsersForRole(
   *     { roleId },
   *     { consistency: { waitUpToMs: 5000 } }
   *   );
   * 
   *   for (const user of result.items ?? []) {
   *     console.log(`User: ${user.username}`);
   *   }
   * }
   * ```
   * @operationId searchUsersForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForRole(input: searchUsersForRoleInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUsersForRole(this, arg, consistencyManagement, options);
  }

  /**
   * Search users for tenant
   *
   * Retrieves a filtered and sorted list of users for a specified tenant.
    *
   * @example Search users for a tenant
   * ```ts
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
   * ```
   * @operationId searchUsersForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForTenant(input: searchUsersForTenantInput, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUsersForTenant(this, arg, consistencyManagement, options);
  }

  /**
   * Search user task audit logs
   *
   * Search for user task audit logs based on given criteria.
    *
   * @example Search user task audit logs
   * ```ts
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
   * ```
   * @operationId searchUserTaskAuditLogs
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskAuditLogs(input: searchUserTaskAuditLogsInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskAuditLogs>>;
  searchUserTaskAuditLogs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskAuditLogsConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUserTaskAuditLogs(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId searchUserTaskEffectiveVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskEffectiveVariables(input: searchUserTaskEffectiveVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskEffectiveVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskEffectiveVariables>>;
  searchUserTaskEffectiveVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskEffectiveVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUserTaskEffectiveVariables(this, arg, consistencyManagement, options);
  }

  /**
   * Search user tasks
   *
   * Search for user tasks based on given criteria.
    *
   * @example Search user tasks
   * ```ts
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
   * ```
   * @operationId searchUserTasks
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTasks(input: searchUserTasksInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUserTasks(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId searchUserTaskVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskVariables(input: searchUserTaskVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchUserTaskVariables(this, arg, consistencyManagement, options);
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
   * ```ts
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
   * ```
   * @operationId searchVariables
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchVariables(input: searchVariablesInput, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency, options?: OperationOptions): CancelablePromise<any> {
    return Ops.searchVariables(this, arg, consistencyManagement, options);
  }

  /**
   * Suspend Batch operation
   *
   * Suspends a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Suspend a batch operation
   * ```ts
   * async function suspendBatchOperationExample(batchOperationKey: BatchOperationKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.suspendBatchOperation({ batchOperationKey });
   * }
   * ```
   * @operationId suspendBatchOperation
   * @tags Batch operation
   */
  suspendBatchOperation(input: suspendBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.suspendBatchOperation(this, arg, options);
  }

  /**
   * Suspend process instance
   *
   * Suspends a running process instance, pausing further processing until it is resumed.
   * Only process instances in the ACTIVE state can be suspended.
   * A child process instance can be suspended independently of its parent or root process
   * instance; suspension does not cascade to or from related instances.
   *
    *
   * @example Suspend a process instance
   * ```ts
   * async function suspendProcessInstanceExample(processInstanceKey: ProcessInstanceKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.suspendProcessInstance({ processInstanceKey });
   * }
   * ```
   * @operationId suspendProcessInstance
   * @tags Process instance
   */
  suspendProcessInstance(input: suspendProcessInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.suspendProcessInstance>>;
  suspendProcessInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.suspendProcessInstance(this, arg, options);
  }

  /**
   * Suspend process instances (batch)
   *
   * Suspends multiple running process instances.
   * Any given filter for state or parentProcessInstanceKey is ignored and overridden, as only
   * ACTIVE process instances can be suspended and suspension does not cascade between parent
   * and child instances, so child instances are suspended independently of their parent or
   * root instance.
   * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Suspend process instances in batch
   * ```ts
   * async function suspendProcessInstancesBatchOperationExample(
   *   processDefinitionKey: ProcessDefinitionKey
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.suspendProcessInstancesBatchOperation({
   *     filter: {
   *       processDefinitionKey,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * ```
   * @operationId suspendProcessInstancesBatchOperation
   * @tags Process instance
   */
  suspendProcessInstancesBatchOperation(input: suspendProcessInstancesBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.suspendProcessInstancesBatchOperation>>;
  suspendProcessInstancesBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.suspendProcessInstancesBatchOperation(this, arg, options);
  }

  /**
   * Force-write runtime backup state
   *
   * Force-writes the checkpoint and backup metadata of every partition of the physical
   * tenant to the backup store, independent of any backup being taken or confirmed, and
   * returns the updated state.
   *
    *
   * @example Force-write the runtime backup state
   * ```ts
   * async function syncRuntimeBackupStateExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Force-writes checkpoint and backup metadata of every partition to the backup
   *   // store, independent of any backup being taken, and returns the updated state.
   *   const state = await camunda.syncRuntimeBackupState();
   * 
   *   console.log(`Synced ${state.backupStates.length} partition backup states`);
   * }
   * ```
   * @operationId syncRuntimeBackupState
   * @tags Backup
   */
  syncRuntimeBackupState(options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.syncRuntimeBackupState>>;
  syncRuntimeBackupState(arg?: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.syncRuntimeBackupState(this, options ?? arg);
  }

  /**
   * Force-write runtime backup state across physical tenants
   *
   * Force-writes the checkpoint and backup metadata of every partition of every physical tenant of the cluster, or of the one named by `physicalTenantId`, to that tenant's backup store, independent of any backup being taken or confirmed, and returns the updated state per physical tenant.
   *
   * The request is all-or-nothing: a physical tenant whose metadata cannot be written fails the whole request, and the writes that already succeeded on other tenants are not undone. The operation is idempotent, so retrying the same call is the correct remedy. Narrow the request with `physicalTenantId` to write the tenants that can still be reached.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `POST /v2/backups/runtime/state/sync` to act as a single physical tenant.
    *
   * @example Force-write the runtime backup state (cluster admin)
   * ```ts
   * async function syncRuntimeBackupStateAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Force-writes checkpoint and backup metadata of every partition to the backup
   *   // store on every targeted physical tenant, independent of any backup being
   *   // taken, and returns the updated per-tenant state.
   *   const clusterState = await camunda.syncRuntimeBackupStateAsClusterAdmin({});
   * 
   *   console.log(`Synced ${clusterState.physicalTenants.length} physical tenants`);
   * }
   * ```
   * @operationId syncRuntimeBackupStateAsClusterAdmin
   * @tags Backup
   */
  syncRuntimeBackupStateAsClusterAdmin(input: syncRuntimeBackupStateAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.syncRuntimeBackupStateAsClusterAdmin>>;
  syncRuntimeBackupStateAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.syncRuntimeBackupStateAsClusterAdmin(this, arg, options);
  }

  /**
   * Take a history backup
   *
   * Triggers a backup of the physical tenant's history, by scheduling a snapshot of every
   * secondary storage index it owns.
   *
   * Unlike runtime backups, history backups have no generated-id mode: `backupId` is always
   * required.
   *
   * Only available on clusters whose secondary storage is Elasticsearch or OpenSearch.
   *
    *
   * @example Take a history backup
   * ```ts
   * async function takeHistoryBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Backups are logically ordered by id, so each successive backup must use a
   *   // higher id than the previous one.
   *   const backup = await camunda.takeHistoryBackup({ backupId: 100 });
   * 
   *   console.log(`Scheduled history backup ${backup.backupId}`);
   *   for (const snapshot of backup.scheduledSnapshots) {
   *     console.log(`  ${snapshot}`);
   *   }
   * }
   * ```
   * @operationId takeHistoryBackup
   * @tags Backup
   */
  takeHistoryBackup(input: takeHistoryBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.takeHistoryBackup>>;
  takeHistoryBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.takeHistoryBackup(this, arg, options);
  }

  /**
   * Take a history backup on one or every physical tenant
   *
   * Triggers a history backup on every physical tenant of the cluster, or on the one named by `physicalTenantId`. Every targeted tenant uses the same caller-supplied `backupId`, but the backups are independent: they are neither coordinated nor rolled back together.
   *
   * The request is all-or-nothing: the `backupId` is checked on every targeted tenant before any snapshot is scheduled, so a tenant that already holds this id, or that cannot be reached, fails the whole request and no backup is started anywhere. There is no aggregated cluster-level state in the response.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Only available on clusters whose secondary storage is Elasticsearch or OpenSearch. Use `POST /v2/backups/history` to act as a single physical tenant.
    *
   * @example Take a history backup (cluster admin)
   * ```ts
   * async function takeHistoryBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Cluster-admin variant: fans the backup out to every physical tenant of the
   *   // cluster (or a single one when `physicalTenantId` is given). Requires a
   *   // separate cluster-admin security chain — Orchestration Cluster user
   *   // credentials are NOT accepted. Each backup must use a higher id than the last.
   *   const backup = await camunda.takeHistoryBackupAsClusterAdmin({ backupId: 100 });
   * 
   *   console.log(`Scheduled cluster history backup ${backup.backupId}`);
   *   for (const tenant of backup.physicalTenants) {
   *     console.log(
   *       `  [${tenant.physicalTenantId}] scheduled ${tenant.scheduledSnapshots.length} snapshots`
   *     );
   *   }
   * }
   * ```
   * @operationId takeHistoryBackupAsClusterAdmin
   * @tags Backup
   */
  takeHistoryBackupAsClusterAdmin(input: takeHistoryBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.takeHistoryBackupAsClusterAdmin>>;
  takeHistoryBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.takeHistoryBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Take a runtime backup
   *
   * Triggers a backup of runtime data on all partitions of the physical tenant.
   *
   * The `backupId` must be omitted if continuous backups and/or a backup or checkpoint
   * schedule is enabled for the physical tenant, as the id is generated automatically.
   * Otherwise, `backupId` is required.
   *
    *
   * @example Take a runtime backup
   * ```ts
   * async function takeRuntimeBackupExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Omit `backupId` when continuous backups or a backup/checkpoint schedule is
   *   // enabled for the physical tenant — the id is then generated by the cluster.
   *   // Otherwise `backupId` is required and must be higher than any existing one.
   *   const backup = await camunda.takeRuntimeBackup({ backupId: 100 });
   * 
   *   console.log(`Scheduled backup ${backup.backupId}`);
   * }
   * ```
   * @operationId takeRuntimeBackup
   * @tags Backup
   */
  takeRuntimeBackup(input: takeRuntimeBackupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.takeRuntimeBackup>>;
  takeRuntimeBackup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.takeRuntimeBackup(this, arg, options);
  }

  /**
   * Take a runtime backup on one or every physical tenant
   *
   * Triggers a runtime backup on every physical tenant of the cluster, or on the one named by `physicalTenantId`. A cluster-wide backup is a set of independent per-tenant backups, not an atomic snapshot of the cluster: they are neither coordinated nor rolled back together, and each tenant stores its own, so the same `backupId` can be used for all of them.
   *
   * Every targeted physical tenant must be in the same backup-id mode. `backupId` must be omitted when every targeted tenant generates its own ids (because continuous backups and/or a backup or checkpoint schedule is enabled for it), and is required when none of them does. A cluster whose targeted tenants mix the two modes is rejected with 400 and has to be driven one tenant at a time through `POST /v2/backups/runtime`. In generated-id mode each tenant generates its own id, so the response reports an id per physical tenant rather than one for the cluster.
   *
   * The trigger is all-or-error, and never silent about a partial trigger: if any targeted tenant cannot be triggered the response carries an error status, but its body still lists every targeted tenant — which ones were triggered, under which `backupId` to monitor or delete them, and why the others failed. Nothing is rolled back, so the backups that were triggered keep running and have to be deleted explicitly. A request rejected before any tenant was triggered answers with a problem detail instead, and nothing is running.
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here. Use `POST /v2/backups/runtime` to act as a single physical tenant.
    *
   * @example Take a runtime backup (cluster admin)
   * ```ts
   * async function takeRuntimeBackupAsClusterAdminExample() {
   *   const camunda = createCamundaClient();
   * 
   *   // Cluster-admin variant: triggers a runtime backup on every physical tenant of
   *   // the cluster (or a single one when `physicalTenantId` is given). Requires the
   *   // separate cluster-admin security chain — Orchestration Cluster user
   *   // credentials are NOT accepted. Passing an explicit `backupId` is manual-id
   *   // mode: every targeted tenant must share that id (omit it for generated-id
   *   // mode, where each tenant generates its own). Either way the response lists the
   *   // outcome per physical tenant rather than cluster-wide.
   *   const backup = await camunda.takeRuntimeBackupAsClusterAdmin({ backupId: 100 });
   * 
   *   for (const tenant of backup.physicalTenants) {
   *     console.log(`[${tenant.physicalTenantId}] ${tenant.outcome} (backupId ${tenant.backupId})`);
   *   }
   * }
   * ```
   * @operationId takeRuntimeBackupAsClusterAdmin
   * @tags Backup
   */
  takeRuntimeBackupAsClusterAdmin(input: takeRuntimeBackupAsClusterAdminInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.takeRuntimeBackupAsClusterAdmin>>;
  takeRuntimeBackupAsClusterAdmin(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.takeRuntimeBackupAsClusterAdmin(this, arg, options);
  }

  /**
   * Throw error for job
   *
   * Reports a business error (i.e. non-technical) that occurs while processing a job.
   *
    *
   * @example Throw a job error
   * ```ts
   * async function throwJobErrorExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.throwJobError({
   *     jobKey,
   *     errorCode: 'PAYMENT_FAILED',
   *     errorMessage: 'Payment provider returned error',
   *   });
   * }
   * ```
   * @operationId throwJobError
   * @tags Job
   */
  throwJobError(input: throwJobErrorInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.throwJobError>>;
  throwJobError(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.throwJobError(this, arg, options);
  }

  /**
   * Trigger a cluster-wide leadership rebalance
   *
   * Transfers leadership of every partition that is not led by its highest-priority replica towards that replica, one partition at a time. Returns as soon as the rebalance has been accepted (poll `GET /cluster/v2/rebalance` to monitor progress).
   *
   * Each rebalance can specify overrides for the configured rebalance settings (e.g. maximum replication lag to allow). An absent request body means "use the configured settings".
   *
   * Requires the cluster-admin security chain. Although this operation lists `bearerAuth` / `basicAuth` like the rest of the Orchestration Cluster API, it does not accept an Orchestration Cluster user's credentials — only the separate cluster-admin credentials are valid here.
    *
   * @example Trigger a cluster-wide leadership rebalance
   * ```ts
   * async function triggerClusterRebalanceExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const balance = await camunda.triggerClusterRebalance({
   *     replicationLagThreshold: 10_000_000,
   *     maxTransferAttempts: 3,
   *   });
   * 
   *   console.log(`Cluster balance state: ${balance.state}`);
   *   if (balance.runningRebalance) {
   *     console.log(`Rebalance started: id=${balance.runningRebalance.rebalanceId}`);
   *   }
   * }
   * ```
   * @operationId triggerClusterRebalance
   * @tags Cluster
   */
  triggerClusterRebalance(input: triggerClusterRebalanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.triggerClusterRebalance>>;
  triggerClusterRebalance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.triggerClusterRebalance(this, arg, options);
  }

  /**
   * Unassign a client from a group
   *
   * Unassigns a client from a group.
   * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @example Unassign a client from a group
   * ```ts
   * async function unassignClientFromGroupExample(groupId: GroupId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignClientFromGroup({
   *     groupId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId unassignClientFromGroup
   * @tags Group
   */
  unassignClientFromGroup(input: unassignClientFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromGroup>>;
  unassignClientFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignClientFromGroup(this, arg, options);
  }

  /**
   * Unassign a client from a tenant
   *
   * Unassigns the client from the specified tenant.
   * The client can no longer access tenant data.
   *
    *
   * @example Unassign a client from a tenant
   * ```ts
   * async function unassignClientFromTenantExample(tenantId: TenantId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignClientFromTenant({
   *     tenantId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId unassignClientFromTenant
   * @tags Tenant
   */
  unassignClientFromTenant(input: unassignClientFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromTenant>>;
  unassignClientFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignClientFromTenant(this, arg, options);
  }

  /**
   * Unassign a group from a tenant
   *
   * Unassigns a group from a specified tenant.
   * Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
   *
    *
   * @example Unassign a group from a tenant
   * ```ts
   * async function unassignGroupFromTenantExample(tenantId: TenantId, groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignGroupFromTenant({
   *     tenantId,
   *     groupId,
   *   });
   * }
   * ```
   * @operationId unassignGroupFromTenant
   * @tags Tenant
   */
  unassignGroupFromTenant(input: unassignGroupFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignGroupFromTenant>>;
  unassignGroupFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignGroupFromTenant(this, arg, options);
  }

  /**
   * Unassign a mapping rule from a group
   *
   * Unassigns a mapping rule from a group.
    *
   * @example Unassign a mapping rule from a group
   * ```ts
   * async function unassignMappingRuleFromGroupExample(groupId: GroupId, mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignMappingRuleFromGroup({
   *     groupId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId unassignMappingRuleFromGroup
   * @tags Group
   */
  unassignMappingRuleFromGroup(input: unassignMappingRuleFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromGroup>>;
  unassignMappingRuleFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignMappingRuleFromGroup(this, arg, options);
  }

  /**
   * Unassign a mapping rule from a tenant
   *
   * Unassigns a single mapping rule from a specified tenant without deleting the rule.
    *
   * @example Unassign a mapping rule from a tenant
   * ```ts
   * async function unassignMappingRuleFromTenantExample(
   *   tenantId: TenantId,
   *   mappingRuleId: MappingRuleId
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignMappingRuleFromTenant({
   *     tenantId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId unassignMappingRuleFromTenant
   * @tags Tenant
   */
  unassignMappingRuleFromTenant(input: unassignMappingRuleFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromTenant>>;
  unassignMappingRuleFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignMappingRuleFromTenant(this, arg, options);
  }

  /**
   * Unassign a role from a client
   *
   * Unassigns the specified role from the client. The client will no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a client
   * ```ts
   * async function unassignRoleFromClientExample(roleId: RoleId, clientId: ClientId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromClient({
   *     roleId,
   *     clientId,
   *   });
   * }
   * ```
   * @operationId unassignRoleFromClient
   * @tags Role
   */
  unassignRoleFromClient(input: unassignRoleFromClientInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromClient>>;
  unassignRoleFromClient(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignRoleFromClient(this, arg, options);
  }

  /**
   * Unassign a role from a group
   *
   * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a group
   * ```ts
   * async function unassignRoleFromGroupExample(roleId: RoleId, groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromGroup({
   *     roleId,
   *     groupId,
   *   });
   * }
   * ```
   * @operationId unassignRoleFromGroup
   * @tags Role
   */
  unassignRoleFromGroup(input: unassignRoleFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromGroup>>;
  unassignRoleFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignRoleFromGroup(this, arg, options);
  }

  /**
   * Unassign a role from a mapping rule
   *
   * Unassigns a role from a mapping rule.
    *
   * @example Unassign a role from a mapping rule
   * ```ts
   * async function unassignRoleFromMappingRuleExample(roleId: RoleId, mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromMappingRule({
   *     roleId,
   *     mappingRuleId,
   *   });
   * }
   * ```
   * @operationId unassignRoleFromMappingRule
   * @tags Role
   */
  unassignRoleFromMappingRule(input: unassignRoleFromMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromMappingRule>>;
  unassignRoleFromMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignRoleFromMappingRule(this, arg, options);
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
   * ```ts
   * async function unassignRoleFromTenantExample(tenantId: TenantId, roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromTenant({
   *     tenantId,
   *     roleId,
   *   });
   * }
   * ```
   * @operationId unassignRoleFromTenant
   * @tags Tenant
   */
  unassignRoleFromTenant(input: unassignRoleFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromTenant>>;
  unassignRoleFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignRoleFromTenant(this, arg, options);
  }

  /**
   * Unassign a role from a user
   *
   * Unassigns a role from a user. The user will no longer inherit the authorizations associated with this role.
    *
   * @example Unassign a role from a user
   * ```ts
   * async function unassignRoleFromUserExample(roleId: RoleId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignRoleFromUser({
   *     roleId,
   *     username,
   *   });
   * }
   * ```
   * @operationId unassignRoleFromUser
   * @tags Role
   */
  unassignRoleFromUser(input: unassignRoleFromUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromUser>>;
  unassignRoleFromUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignRoleFromUser(this, arg, options);
  }

  /**
   * Unassign a user from a group
   *
   * Unassigns a user from a group.
   * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
   *
    *
   * @example Unassign a user from a group
   * ```ts
   * async function unassignUserFromGroupExample(groupId: GroupId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserFromGroup({
   *     groupId,
   *     username,
   *   });
   * }
   * ```
   * @operationId unassignUserFromGroup
   * @tags Group
   */
  unassignUserFromGroup(input: unassignUserFromGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromGroup>>;
  unassignUserFromGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignUserFromGroup(this, arg, options);
  }

  /**
   * Unassign a user from a tenant
   *
   * Unassigns the user from the specified tenant.
   * The user can no longer access tenant data.
   *
    *
   * @example Unassign a user from a tenant
   * ```ts
   * async function unassignUserFromTenantExample(tenantId: TenantId, username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserFromTenant({
   *     tenantId,
   *     username,
   *   });
   * }
   * ```
   * @operationId unassignUserFromTenant
   * @tags Tenant
   */
  unassignUserFromTenant(input: unassignUserFromTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromTenant>>;
  unassignUserFromTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignUserFromTenant(this, arg, options);
  }

  /**
   * Unassign user task
   *
   * Removes the assignee of a task with the given key. Unassignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Unassign a user task
   * ```ts
   * async function unassignUserTaskExample(userTaskKey: UserTaskKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.unassignUserTask({ userTaskKey });
   * }
   * ```
   * @operationId unassignUserTask
   * @tags User task
   */
  unassignUserTask(input: unassignUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserTask>>;
  unassignUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.unassignUserTask(this, arg, options);
  }

  /**
   * Update agent instance
   *
   * Updates the status of an agent instance and appends a batch of history items
   * to its conversation history. Each history item created for this request is
   * echoed back in the response.
   *
    *
   * @example Update an agent instance
   * ```ts
   * async function updateAgentInstanceExample(
   *   agentInstanceKey: AgentInstanceKey,
   *   elementInstanceKey: ElementInstanceKey,
   *   jobKey: JobKey,
   *   jobLeaseToken: JobLeaseToken
   * ) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateAgentInstance({
   *     agentInstanceKey,
   *     elementInstanceKey,
   *     jobKey,
   *     jobLeaseToken,
   *     status: 'THINKING',
   *     history: [
   *       {
   *         historyItemId: HistoryItemId.assumeExists('assistant-1'),
   *         loopIteration: 1,
   *         role: 'ASSISTANT',
   *         content: [{ contentType: 'TEXT', text: 'How can I help you?' }],
   *         producedAt: new Date().toISOString(),
   *         metrics: { inputTokens: 150, outputTokens: 50, durationMs: 820 },
   *       },
   *     ],
   *   });
   * 
   *   console.log(`Updated agent instance: ${agentInstanceKey}`);
   * }
   * ```
   * @operationId updateAgentInstance
   * @tags Agent instance
   */
  updateAgentInstance(input: updateAgentInstanceInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateAgentInstance>>;
  updateAgentInstance(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateAgentInstance(this, arg, options);
  }

  /**
   * Update authorization
   *
   * Update the authorization with the given key.
    *
   * @example Update an authorization
   * ```ts
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
   * ```
   * @operationId updateAuthorization
   * @tags Authorization
   */
  updateAuthorization(input: updateAuthorizationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateAuthorization>>;
  updateAuthorization(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateAuthorization(this, arg, options);
  }

  /**
   * Update a global-scoped cluster variable
   *
   * Updates the value of an existing global cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @example Update a global cluster variable
   * ```ts
   * async function updateGlobalClusterVariableExample(name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGlobalClusterVariable({
   *     name,
   *     value: { darkMode: false },
   *   });
   * }
   * ```
   * @operationId updateGlobalClusterVariable
   * @tags Cluster Variable
   */
  updateGlobalClusterVariable(input: updateGlobalClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGlobalClusterVariable>>;
  updateGlobalClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateGlobalClusterVariable(this, arg, options);
  }

  /**
   * Update global user task listener
   *
   * Updates a global user task listener.
    *
   * @example Update a global task listener
   * ```ts
   * async function updateGlobalTaskListenerExample(id: GlobalListenerId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGlobalTaskListener({
   *     id,
   *     eventTypes: ['completing'],
   *     type: 'updated-audit-listener',
   *   });
   * }
   * ```
   * @operationId updateGlobalTaskListener
   * @tags Global listener
   */
  updateGlobalTaskListener(input: updateGlobalTaskListenerInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGlobalTaskListener>>;
  updateGlobalTaskListener(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateGlobalTaskListener(this, arg, options);
  }

  /**
   * Update group
   *
   * Update a group with the given ID.
    *
   * @example Update a group
   * ```ts
   * async function updateGroupExample(groupId: GroupId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateGroup({
   *     groupId,
   *     name: 'Engineering Team',
   *   });
   * }
   * ```
   * @operationId updateGroup
   * @tags Group
   */
  updateGroup(input: updateGroupInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateGroup>>;
  updateGroup(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateGroup(this, arg, options);
  }

  /**
   * Update job
   *
   * Update a job with the given key.
    *
   * @example Update a job
   * ```ts
   * async function updateJobExample(jobKey: JobKey) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateJob({
   *     jobKey,
   *     changeset: { retries: 5, timeout: 60000 },
   *   });
   * }
   * ```
   * @operationId updateJob
   * @tags Job
   */
  updateJob(input: updateJobInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateJob>>;
  updateJob(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateJob(this, arg, options);
  }

  /**
   * Update jobs (batch)
   *
   * Creates a batch operation to update jobs matching the given filter. At least one changeset field must be non-null. This is done asynchronously; the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @example Update jobs in batch
   * ```ts
   * async function updateJobsBatchOperationExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const result = await camunda.updateJobsBatchOperation({
   *     filter: {
   *       type: 'payment-processing',
   *       hasFailedWithRetriesLeft: false,
   *     },
   *     changeset: {
   *       retries: 3,
   *     },
   *   });
   * 
   *   console.log(`Batch operation key: ${result.batchOperationKey}`);
   * }
   * ```
   * @operationId updateJobsBatchOperation
   * @tags Job
   */
  updateJobsBatchOperation(input: updateJobsBatchOperationInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateJobsBatchOperation>>;
  updateJobsBatchOperation(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateJobsBatchOperation(this, arg, options);
  }

  /**
   * Update mapping rule
   *
   * Update a mapping rule.
   *
    *
   * @example Update a mapping rule
   * ```ts
   * async function updateMappingRuleExample(mappingRuleId: MappingRuleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateMappingRule({
   *     mappingRuleId,
   *     name: 'LDAP Group Mapping',
   *     claimName: 'groups',
   *     claimValue: 'engineering-team',
   *   });
   * }
   * ```
   * @operationId updateMappingRule
   * @tags Mapping rule
   */
  updateMappingRule(input: updateMappingRuleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateMappingRule>>;
  updateMappingRule(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateMappingRule(this, arg, options);
  }

  /**
   * Update role
   *
   * Update a role with the given ID.
    *
   * @example Update a role
   * ```ts
   * async function updateRoleExample(roleId: RoleId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateRole({
   *     roleId,
   *     name: 'Process Administrator',
   *   });
   * }
   * ```
   * @operationId updateRole
   * @tags Role
   */
  updateRole(input: updateRoleInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateRole>>;
  updateRole(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateRole(this, arg, options);
  }

  /**
   * Update tenant
   *
   * Updates an existing tenant.
    *
   * @example Update a tenant
   * ```ts
   * async function updateTenantExample(tenantId: TenantId) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateTenant({
   *     tenantId,
   *     name: 'Customer Service Team',
   *   });
   * }
   * ```
   * @operationId updateTenant
   * @tags Tenant
   */
  updateTenant(input: updateTenantInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateTenant>>;
  updateTenant(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateTenant(this, arg, options);
  }

  /**
   * Update a tenant-scoped cluster variable
   *
   * Updates the value of an existing tenant-scoped cluster variable.
   * The variable must exist, otherwise a 404 error is returned.
   *
    *
   * @example Update a tenant cluster variable
   * ```ts
   * async function updateTenantClusterVariableExample(tenantId: TenantId, name: ClusterVariableName) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateTenantClusterVariable({
   *     tenantId,
   *     name,
   *     value: { region: 'eu-west-1' },
   *   });
   * }
   * ```
   * @operationId updateTenantClusterVariable
   * @tags Cluster Variable
   */
  updateTenantClusterVariable(input: updateTenantClusterVariableInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateTenantClusterVariable>>;
  updateTenantClusterVariable(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateTenantClusterVariable(this, arg, options);
  }

  /**
   * Update user
   *
   * Updates a user.
    *
   * @example Update a user
   * ```ts
   * async function updateUserExample(username: Username) {
   *   const camunda = createCamundaClient();
   * 
   *   await camunda.updateUser({
   *     username,
   *     name: 'Alice Jones',
   *     email: 'alice.jones@example.com',
   *   });
   * }
   * ```
   * @operationId updateUser
   * @tags User
   */
  updateUser(input: updateUserInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateUser(this, arg, options);
  }

  /**
   * Update user task
   *
   * Update a user task with the given key. Updates wait for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.
   *
    *
   * @example Update a user task
   * ```ts
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
   * ```
   * @operationId updateUserTask
   * @tags User task
   */
  updateUserTask(input: updateUserTaskInput, options?: OperationOptions): CancelablePromise<_DataOf<typeof Sdk.updateUserTask>>;
  updateUserTask(arg: any, options?: OperationOptions): CancelablePromise<any> {
    return Ops.updateUserTask(this, arg, options);
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
   * @example Create a job worker
   * ```ts
   * async function createJobWorkerExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const _worker = camunda.createJobWorker({
   *     jobType: 'payment-processing',
   *     jobTimeoutMs: 30000,
   *     maxParallelJobs: 5,
   *     jobHandler: async (job): Promise<JobActionReceipt> => {
   *       console.log(`Processing job ${job.jobKey}`);
   *       return job.complete({ processed: true });
   *     },
   *   });
   * 
   *   // Workers run continuously until closed
   *   // worker.close();
   * }
   * ```
   * @example Job worker with error handling
   * ```ts
   * async function jobWorkerWithErrorHandlingExample() {
   *   const camunda = createCamundaClient();
   * 
   *   const worker = camunda.createJobWorker({
   *     jobType: 'email-sending',
   *     jobTimeoutMs: 60000,
   *     maxParallelJobs: 10,
   *     pollIntervalMs: 300,
   *     jobHandler: async (job): Promise<JobActionReceipt> => {
   *       try {
   *         console.log(`Sending email for job ${job.jobKey}`);
   *         return job.complete({ sent: true });
   *       } catch (err) {
   *         return job.fail({
   *           errorMessage: String(err),
   *           retries: (job.retries ?? 1) - 1,
   *         });
   *       }
   *     },
   *   });
   * 
   *   void worker;
   * }
   * ```
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
   * @example Create a threaded job worker
   * ```ts
   * const worker = client.createThreadedJobWorker({
   *   jobType: 'cpu-heavy-task',
   *   handlerModule: './my-handler.js',
   *   maxParallelJobs: 32,
   *   jobTimeoutMs: 30000,
   * })
   * ```
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
      if (!node || typeof process === 'undefined' || !process.versions?.node) {
        throw new Error('deployResourcesFromFiles is only available in Node.js environments');
      }
      // Node built-ins come from the #platform seam (undefined in browser builds)
      const {
        fsPromises: { readFile },
        path: pathMod,
      } = node;
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

  /**
   * Search for process variables and bind them to a Zod schema (the DTO).
   *
   * The schema's keys are the exact variable names to fetch; its shape drives validation. Only
   * those declared variables are queried (via a `name $in [...]` filter), so memory stays bound
   * by the DTO shape rather than the total number of variables on the instance. Results are
   * paged internally until every declared variable is found or the result set is exhausted.
   *
   * Returns a {@link VariableMap} offering lenient access (`has` / `get`) and a strict
   * `validate()` that parses the collected values against the schema — returning a fully-typed
   * object or throwing a `ZodError` when a required variable is missing or malformed.
   *
   * @param schema A Zod object schema declaring the variables to fetch.
   * @param options Query scope. `processInstanceKey` is required; `scopeKey` narrows to a single
   *   element-instance scope, `tenantId` filters by tenant, and `pageSize` tunes the page limit.
   *   `consistency` controls eventual-consistency tolerance for the underlying `searchVariables`
   *   calls: it defaults to `{ waitUpToMs: 0 }` (no waiting), but a non-zero `waitUpToMs` makes the
   *   paging calls poll until the data is consistent, avoiding intermittent missing variables /
   *   `ZodError` on a freshly-updated instance.
   * @throws {VariableScopeCollisionError} when a declared variable is found at more than one
   *   scope and no `scopeKey` was provided to disambiguate.
   * @throws {VariableDeserializationError} when a variable's value is not valid JSON.
   *
   * @example
   * ```ts
   * import { z } from 'zod';
   * const OrderVariables = z.object({ orderId: z.string(), amount: z.number().optional() });
   * const map = await client.searchVariablesAsDto(OrderVariables, { processInstanceKey });
   * if (map.has('amount')) console.log(map.get('amount'));
   * const order = map.validate(); // { orderId: string; amount?: number }
   * ```
   */
  searchVariablesAsDto<TSchema extends AnyVariableSchema>(
    schema: TSchema,
    options: {
      processInstanceKey: ProcessInstanceKey;
      scopeKey?: ScopeKey;
      tenantId?: TenantId;
      pageSize?: number;
      consistency?: { waitUpToMs: number; pollIntervalMs?: number };
    }
  ): CancelablePromise<VariableMap<TSchema>> {
    return toCancelable(async (signal) => {
      if (!options?.processInstanceKey) {
        throw new Error('searchVariablesAsDto requires options.processInstanceKey');
      }
      const names = variableNamesFromSchema(schema);
      const limit = options.pageSize && options.pageSize > 0 ? options.pageSize : 100;
      const filter: VariableFilter = {
        name: { $in: names },
        processInstanceKey: options.processInstanceKey,
      };
      if (options.scopeKey) filter.scopeKey = options.scopeKey;
      if (options.tenantId) filter.tenantId = options.tenantId;

      return collectTypedVariables({
        schema,
        // A single scopeKey restricts results to one scope, so each declared name appears at most
        // once and paging can stop as soon as all are found. Otherwise we page to exhaustion so a
        // same-name/different-scope collision on a later page surfaces as a VariableScopeCollisionError.
        singleScope: Boolean(options.scopeKey),
        // Eventual-consistency waiting happens at the collection level: re-read until every declared
        // variable is visible or the budget expires. The per-page search never waits — a paging read
        // that legitimately returns 0 items must not block, and waiting on the first search alone
        // settles on a partial result (its success condition is merely "any matching variable").
        consistency: options.consistency,
        fetchPage: createVariableSearchFetchPage({
          filter,
          limit,
          signal,
          search: (input) => this.searchVariables(input, { consistency: { waitUpToMs: 0 } }),
        }),
      });
    });
  }
}

/**
 * Public Camunda client type: the base class augmented with `.paginate(...)` on
 * every `search*` operation. The `.paginate` methods are installed at runtime by
 * the constructor (via `installSearchPagination`), so both construction paths —
 * the `createCamundaClient` factory *and* direct `new CamundaClient()` — yield a
 * value whose static type matches the runtime shape.
 *
 * This is expressed as a separate type + value pair rather than
 * declaration-merging an interface onto the class because
 * `SearchPaginationApi<CamundaClient>` is self-referential (it maps over
 * `keyof CamundaClient`), which TypeScript rejects as an interface `extends`
 * clause ("recursively references itself as a base type").
 */
export type CamundaClient = WithSearchPagination<CamundaClientBase>;
export const CamundaClient = CamundaClientBase as unknown as {
  new (options?: CamundaOptions): CamundaClient;
} & typeof CamundaClientBase;
