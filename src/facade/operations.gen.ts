// @generated ergonomic operation wrappers
// DO NOT EDIT MANUALLY – run npm run generate
import { /* underlying */ activateAdHocSubProcessActivities as _activateAdHocSubProcessActivities, activateJobs as _activateJobs, assignClientToGroup as _assignClientToGroup, assignClientToTenant as _assignClientToTenant, assignGroupToTenant as _assignGroupToTenant, assignMappingRuleToGroup as _assignMappingRuleToGroup, assignMappingRuleToTenant as _assignMappingRuleToTenant, assignProcessInstanceBusinessId as _assignProcessInstanceBusinessId, assignRoleToClient as _assignRoleToClient, assignRoleToGroup as _assignRoleToGroup, assignRoleToMappingRule as _assignRoleToMappingRule, assignRoleToTenant as _assignRoleToTenant, assignRoleToUser as _assignRoleToUser, assignUserTask as _assignUserTask, assignUserToGroup as _assignUserToGroup, assignUserToTenant as _assignUserToTenant, broadcastSignal as _broadcastSignal, cancelBatchOperation as _cancelBatchOperation, cancelClusterRebalance as _cancelClusterRebalance, cancelProcessInstance as _cancelProcessInstance, cancelProcessInstancesBatchOperation as _cancelProcessInstancesBatchOperation, changeClusterMode as _changeClusterMode, changeClusterModeAsClusterAdmin as _changeClusterModeAsClusterAdmin, completeJob as _completeJob, completeUserTask as _completeUserTask, correlateMessage as _correlateMessage, createAdminUser as _createAdminUser, createAgentInstance as _createAgentInstance, createAuthorization as _createAuthorization, createDeployment as _createDeployment, createDocument as _createDocument, createDocumentLink as _createDocumentLink, createDocuments as _createDocuments, createElementInstanceVariables as _createElementInstanceVariables, createGlobalClusterVariable as _createGlobalClusterVariable, createGlobalTaskListener as _createGlobalTaskListener, createGroup as _createGroup, createMappingRule as _createMappingRule, createProcessInstance as _createProcessInstance, createRole as _createRole, createTenant as _createTenant, createTenantClusterVariable as _createTenantClusterVariable, createUser as _createUser, deleteAuthorization as _deleteAuthorization, deleteDecisionInstance as _deleteDecisionInstance, deleteDecisionInstancesBatchOperation as _deleteDecisionInstancesBatchOperation, deleteDocument as _deleteDocument, deleteGlobalClusterVariable as _deleteGlobalClusterVariable, deleteGlobalTaskListener as _deleteGlobalTaskListener, deleteGroup as _deleteGroup, deleteHistoryBackup as _deleteHistoryBackup, deleteHistoryBackupAsClusterAdmin as _deleteHistoryBackupAsClusterAdmin, deleteMappingRule as _deleteMappingRule, deleteProcessInstance as _deleteProcessInstance, deleteProcessInstancesBatchOperation as _deleteProcessInstancesBatchOperation, deleteResource as _deleteResource, deleteRole as _deleteRole, deleteRuntimeBackup as _deleteRuntimeBackup, deleteRuntimeBackupAsClusterAdmin as _deleteRuntimeBackupAsClusterAdmin, deleteRuntimeBackupState as _deleteRuntimeBackupState, deleteRuntimeBackupStateAsClusterAdmin as _deleteRuntimeBackupStateAsClusterAdmin, deleteTenant as _deleteTenant, deleteTenantClusterVariable as _deleteTenantClusterVariable, deleteUser as _deleteUser, evaluateConditionals as _evaluateConditionals, evaluateDecision as _evaluateDecision, evaluateExpression as _evaluateExpression, failJob as _failJob, getAgentDefinition as _getAgentDefinition, getAgentInstance as _getAgentInstance, getAuditLog as _getAuditLog, getAuthentication as _getAuthentication, getAuthorization as _getAuthorization, getBatchOperation as _getBatchOperation, getClusterExportingStatus as _getClusterExportingStatus, getClusterRebalance as _getClusterRebalance, getClusterStatus as _getClusterStatus, getClusterTopology as _getClusterTopology, getDecisionDefinition as _getDecisionDefinition, getDecisionDefinitionXml as _getDecisionDefinitionXml, getDecisionInstance as _getDecisionInstance, getDecisionRequirements as _getDecisionRequirements, getDecisionRequirementsXml as _getDecisionRequirementsXml, getDocument as _getDocument, getElementInstance as _getElementInstance, getExportingStatus as _getExportingStatus, getFormByKey as _getFormByKey, getGlobalClusterVariable as _getGlobalClusterVariable, getGlobalJobStatistics as _getGlobalJobStatistics, getGlobalTaskListener as _getGlobalTaskListener, getGroup as _getGroup, getHistoryBackup as _getHistoryBackup, getHistoryBackupAsClusterAdmin as _getHistoryBackupAsClusterAdmin, getIncident as _getIncident, getJobErrorStatistics as _getJobErrorStatistics, getJobTimeSeriesStatistics as _getJobTimeSeriesStatistics, getJobTypeStatistics as _getJobTypeStatistics, getJobWorkerStatistics as _getJobWorkerStatistics, getLicense as _getLicense, getMappingRule as _getMappingRule, getProcessDefinition as _getProcessDefinition, getProcessDefinitionInstanceStatistics as _getProcessDefinitionInstanceStatistics, getProcessDefinitionInstanceVersionStatistics as _getProcessDefinitionInstanceVersionStatistics, getProcessDefinitionMessageSubscriptionStatistics as _getProcessDefinitionMessageSubscriptionStatistics, getProcessDefinitionStatistics as _getProcessDefinitionStatistics, getProcessDefinitionXml as _getProcessDefinitionXml, getProcessInstance as _getProcessInstance, getProcessInstanceCallHierarchy as _getProcessInstanceCallHierarchy, getProcessInstanceSequenceFlows as _getProcessInstanceSequenceFlows, getProcessInstanceStatistics as _getProcessInstanceStatistics, getProcessInstanceStatisticsByDefinition as _getProcessInstanceStatisticsByDefinition, getProcessInstanceStatisticsByError as _getProcessInstanceStatisticsByError, getProcessInstanceWaitStateStatistics as _getProcessInstanceWaitStateStatistics, getResource as _getResource, getResourceContent as _getResourceContent, getResourceContentBinary as _getResourceContentBinary, getRestoreStatus as _getRestoreStatus, getRole as _getRole, getRuntimeBackup as _getRuntimeBackup, getRuntimeBackupAsClusterAdmin as _getRuntimeBackupAsClusterAdmin, getRuntimeBackupState as _getRuntimeBackupState, getRuntimeBackupStateAsClusterAdmin as _getRuntimeBackupStateAsClusterAdmin, getStartProcessForm as _getStartProcessForm, getStatus as _getStatus, getSystemConfiguration as _getSystemConfiguration, getTenant as _getTenant, getTenantClusterVariable as _getTenantClusterVariable, getTopology as _getTopology, getUsageMetrics as _getUsageMetrics, getUser as _getUser, getUserTask as _getUserTask, getUserTaskForm as _getUserTaskForm, getVariable as _getVariable, listHistoryBackups as _listHistoryBackups, listHistoryBackupsAsClusterAdmin as _listHistoryBackupsAsClusterAdmin, listRuntimeBackups as _listRuntimeBackups, listRuntimeBackupsAsClusterAdmin as _listRuntimeBackupsAsClusterAdmin, listSecrets as _listSecrets, migrateProcessInstance as _migrateProcessInstance, migrateProcessInstancesBatchOperation as _migrateProcessInstancesBatchOperation, modifyProcessInstance as _modifyProcessInstance, modifyProcessInstancesBatchOperation as _modifyProcessInstancesBatchOperation, pauseClusterExporting as _pauseClusterExporting, pauseExporting as _pauseExporting, pinClock as _pinClock, publishMessage as _publishMessage, resetClock as _resetClock, resolveIncident as _resolveIncident, resolveIncidentsBatchOperation as _resolveIncidentsBatchOperation, resolveProcessInstanceIncidents as _resolveProcessInstanceIncidents, resolveSecrets as _resolveSecrets, restore as _restore, restoreAsClusterAdmin as _restoreAsClusterAdmin, resumeBatchOperation as _resumeBatchOperation, resumeClusterExporting as _resumeClusterExporting, resumeExporting as _resumeExporting, resumeProcessInstance as _resumeProcessInstance, resumeProcessInstancesBatchOperation as _resumeProcessInstancesBatchOperation, searchAgentDefinitions as _searchAgentDefinitions, searchAgentInstanceHistory as _searchAgentInstanceHistory, searchAgentInstances as _searchAgentInstances, searchAuditLogs as _searchAuditLogs, searchAuthorizations as _searchAuthorizations, searchBatchOperationItems as _searchBatchOperationItems, searchBatchOperations as _searchBatchOperations, searchClientsForGroup as _searchClientsForGroup, searchClientsForRole as _searchClientsForRole, searchClientsForTenant as _searchClientsForTenant, searchClusterVariables as _searchClusterVariables, searchCorrelatedMessageSubscriptions as _searchCorrelatedMessageSubscriptions, searchDecisionDefinitions as _searchDecisionDefinitions, searchDecisionInstances as _searchDecisionInstances, searchDecisionRequirements as _searchDecisionRequirements, searchElementInstanceIncidents as _searchElementInstanceIncidents, searchElementInstances as _searchElementInstances, searchElementInstanceWaitStates as _searchElementInstanceWaitStates, searchGlobalTaskListeners as _searchGlobalTaskListeners, searchGroupIdsForTenant as _searchGroupIdsForTenant, searchGroups as _searchGroups, searchGroupsForRole as _searchGroupsForRole, searchIncidents as _searchIncidents, searchJobs as _searchJobs, searchMappingRule as _searchMappingRule, searchMappingRulesForGroup as _searchMappingRulesForGroup, searchMappingRulesForRole as _searchMappingRulesForRole, searchMappingRulesForTenant as _searchMappingRulesForTenant, searchMessageSubscriptions as _searchMessageSubscriptions, searchOwnAuthorizations as _searchOwnAuthorizations, searchProcessDefinitions as _searchProcessDefinitions, searchProcessDefinitionVariableNames as _searchProcessDefinitionVariableNames, searchProcessInstanceIncidents as _searchProcessInstanceIncidents, searchProcessInstances as _searchProcessInstances, searchResources as _searchResources, searchRoles as _searchRoles, searchRolesForGroup as _searchRolesForGroup, searchRolesForTenant as _searchRolesForTenant, searchTenants as _searchTenants, searchUsers as _searchUsers, searchUsersForGroup as _searchUsersForGroup, searchUsersForRole as _searchUsersForRole, searchUsersForTenant as _searchUsersForTenant, searchUserTaskAuditLogs as _searchUserTaskAuditLogs, searchUserTaskEffectiveVariables as _searchUserTaskEffectiveVariables, searchUserTasks as _searchUserTasks, searchUserTaskVariables as _searchUserTaskVariables, searchVariables as _searchVariables, suspendBatchOperation as _suspendBatchOperation, suspendProcessInstance as _suspendProcessInstance, suspendProcessInstancesBatchOperation as _suspendProcessInstancesBatchOperation, syncRuntimeBackupState as _syncRuntimeBackupState, syncRuntimeBackupStateAsClusterAdmin as _syncRuntimeBackupStateAsClusterAdmin, takeHistoryBackup as _takeHistoryBackup, takeHistoryBackupAsClusterAdmin as _takeHistoryBackupAsClusterAdmin, takeRuntimeBackup as _takeRuntimeBackup, takeRuntimeBackupAsClusterAdmin as _takeRuntimeBackupAsClusterAdmin, throwJobError as _throwJobError, triggerClusterRebalance as _triggerClusterRebalance, unassignClientFromGroup as _unassignClientFromGroup, unassignClientFromTenant as _unassignClientFromTenant, unassignGroupFromTenant as _unassignGroupFromTenant, unassignMappingRuleFromGroup as _unassignMappingRuleFromGroup, unassignMappingRuleFromTenant as _unassignMappingRuleFromTenant, unassignRoleFromClient as _unassignRoleFromClient, unassignRoleFromGroup as _unassignRoleFromGroup, unassignRoleFromMappingRule as _unassignRoleFromMappingRule, unassignRoleFromTenant as _unassignRoleFromTenant, unassignRoleFromUser as _unassignRoleFromUser, unassignUserFromGroup as _unassignUserFromGroup, unassignUserFromTenant as _unassignUserFromTenant, unassignUserTask as _unassignUserTask, updateAgentInstance as _updateAgentInstance, updateAuthorization as _updateAuthorization, updateGlobalClusterVariable as _updateGlobalClusterVariable, updateGlobalTaskListener as _updateGlobalTaskListener, updateGroup as _updateGroup, updateJob as _updateJob, updateJobsBatchOperation as _updateJobsBatchOperation, updateMappingRule as _updateMappingRule, updateRole as _updateRole, updateTenant as _updateTenant, updateTenantClusterVariable as _updateTenantClusterVariable, updateUser as _updateUser, updateUserTask as _updateUserTask } from '../gen/sdk.gen';
import { ActivateJobsData, BroadcastSignalData, CancelProcessInstancesBatchOperationData, CorrelateMessageData, CreateAdminUserData, CreateAgentInstanceData, CreateAuthorizationData, CreateDeploymentData, CreateGlobalClusterVariableData, CreateGlobalTaskListenerData, CreateGroupData, CreateMappingRuleData, CreateProcessInstanceData, CreateRoleData, CreateTenantData, CreateUserData, DeleteDecisionInstancesBatchOperationData, DeleteProcessInstancesBatchOperationData, EvaluateConditionalsData, EvaluateDecisionData, EvaluateExpressionData, GetJobErrorStatisticsData, GetJobTimeSeriesStatisticsData, GetJobTypeStatisticsData, GetJobWorkerStatisticsData, GetProcessDefinitionInstanceStatisticsData, GetProcessDefinitionInstanceVersionStatisticsData, GetProcessDefinitionMessageSubscriptionStatisticsData, GetProcessInstanceStatisticsByDefinitionData, GetProcessInstanceStatisticsByErrorData, ListSecretsData, MigrateProcessInstancesBatchOperationData, ModifyProcessInstancesBatchOperationData, PinClockData, PublishMessageData, ResolveIncidentsBatchOperationData, ResolveSecretsData, ResumeProcessInstancesBatchOperationData, SearchAgentDefinitionsData, SearchAgentInstancesData, SearchAuditLogsData, SearchAuthorizationsData, SearchBatchOperationItemsData, SearchBatchOperationsData, SearchCorrelatedMessageSubscriptionsData, SearchDecisionDefinitionsData, SearchDecisionInstancesData, SearchDecisionRequirementsData, SearchElementInstancesData, SearchElementInstanceWaitStatesData, SearchGlobalTaskListenersData, SearchGroupsData, SearchIncidentsData, SearchJobsData, SearchMappingRuleData, SearchMessageSubscriptionsData, SearchOwnAuthorizationsData, SearchProcessDefinitionsData, SearchProcessInstancesData, SearchResourcesData, SearchRolesData, SearchTenantsData, SearchUsersData, SearchUserTasksData, SuspendProcessInstancesBatchOperationData, TakeHistoryBackupData, TakeRuntimeBackupData, UpdateJobsBatchOperationData } from '../gen/types.gen';
import { eventualPoll, ConsistencyOptions } from '../runtime/eventual';

// Lightweight CancelablePromise implementation (local to facade)
export class CancelError extends Error { constructor(){ super("Cancelled"); this.name = "CancelError"; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
export function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  let inner = factory(ac.signal);
  const wrapped: any = new Promise<T>((resolve, reject) => {
    inner.then(resolve, reject);
  });
  wrapped.cancel = () => { ac.abort(); };
  return wrapped as CancelablePromise<T>;
}

// Helper conditional types to derive the success payload of the underlying call
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
// Exclude undefined so success payload types are always concrete (errors throw)
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;

type _activateJobs_Body = ActivateJobsData extends { body?: infer B } ? B : never;
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
export function activateJobs(body: _activateJobs_Body): CancelablePromise<_DataOf<typeof _activateJobs>> {
  return toCancelable(signal => _activateJobs({ body, signal }).then((r:any)=> (r as any).data));
}

type _broadcastSignal_Body = BroadcastSignalData extends { body?: infer B } ? B : never;
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
export function broadcastSignal(body: _broadcastSignal_Body): CancelablePromise<_DataOf<typeof _broadcastSignal>> {
  return toCancelable(signal => _broadcastSignal({ body, signal }).then((r:any)=> (r as any).data));
}

type _cancelProcessInstancesBatchOperation_Body = CancelProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
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
export function cancelProcessInstancesBatchOperation(body: _cancelProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>> {
  return toCancelable(signal => _cancelProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _correlateMessage_Body = CorrelateMessageData extends { body?: infer B } ? B : never;
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
export function correlateMessage(body: _correlateMessage_Body): CancelablePromise<_DataOf<typeof _correlateMessage>> {
  return toCancelable(signal => _correlateMessage({ body, signal }).then((r:any)=> (r as any).data));
}

type _createAdminUser_Body = CreateAdminUserData extends { body?: infer B } ? B : never;
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
export function createAdminUser(body: _createAdminUser_Body): CancelablePromise<_DataOf<typeof _createAdminUser>> {
  return toCancelable(signal => _createAdminUser({ body, signal }).then((r:any)=> (r as any).data));
}

type _createAgentInstance_Body = CreateAgentInstanceData extends { body?: infer B } ? B : never;
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
 *   jobLease: string
 * ) {
 *   const camunda = createCamundaClient();
 * 
 *   // The batch must open with a CONFIGURATION item; it establishes the model,
 *   // provider and system prompt for the instance.
 *   const result = await camunda.createAgentInstance({
 *     elementInstanceKey,
 *     jobKey,
 *     jobLease,
 *     history: [
 *       {
 *         historyItemId: 'configuration-1',
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
export function createAgentInstance(body: _createAgentInstance_Body): CancelablePromise<_DataOf<typeof _createAgentInstance>> {
  return toCancelable(signal => _createAgentInstance({ body, signal }).then((r:any)=> (r as any).data));
}

type _createAuthorization_Body = CreateAuthorizationData extends { body?: infer B } ? B : never;
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
export function createAuthorization(body: _createAuthorization_Body): CancelablePromise<_DataOf<typeof _createAuthorization>> {
  return toCancelable(signal => _createAuthorization({ body, signal }).then((r:any)=> (r as any).data));
}

type _createDeployment_Body = CreateDeploymentData extends { body?: infer B } ? B : never;
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
 */
export function createDeployment(body: _createDeployment_Body): CancelablePromise<_DataOf<typeof _createDeployment>> {
  return toCancelable(signal => _createDeployment({ body, signal }).then((r:any)=> (r as any).data));
}

type _createGlobalClusterVariable_Body = CreateGlobalClusterVariableData extends { body?: infer B } ? B : never;
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
export function createGlobalClusterVariable(body: _createGlobalClusterVariable_Body): CancelablePromise<_DataOf<typeof _createGlobalClusterVariable>> {
  return toCancelable(signal => _createGlobalClusterVariable({ body, signal }).then((r:any)=> (r as any).data));
}

type _createGlobalTaskListener_Body = CreateGlobalTaskListenerData extends { body?: infer B } ? B : never;
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
export function createGlobalTaskListener(body: _createGlobalTaskListener_Body): CancelablePromise<_DataOf<typeof _createGlobalTaskListener>> {
  return toCancelable(signal => _createGlobalTaskListener({ body, signal }).then((r:any)=> (r as any).data));
}

type _createGroup_Body = CreateGroupData extends { body?: infer B } ? B : never;
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
export function createGroup(body: _createGroup_Body): CancelablePromise<_DataOf<typeof _createGroup>> {
  return toCancelable(signal => _createGroup({ body, signal }).then((r:any)=> (r as any).data));
}

type _createMappingRule_Body = CreateMappingRuleData extends { body?: infer B } ? B : never;
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
export function createMappingRule(body: _createMappingRule_Body): CancelablePromise<_DataOf<typeof _createMappingRule>> {
  return toCancelable(signal => _createMappingRule({ body, signal }).then((r:any)=> (r as any).data));
}

type _createProcessInstance_Body = CreateProcessInstanceData extends { body?: infer B } ? B : never;
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
export function createProcessInstance(body: _createProcessInstance_Body): CancelablePromise<_DataOf<typeof _createProcessInstance>> {
  return toCancelable(signal => _createProcessInstance({ body, signal }).then((r:any)=> (r as any).data));
}

type _createRole_Body = CreateRoleData extends { body?: infer B } ? B : never;
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
export function createRole(body: _createRole_Body): CancelablePromise<_DataOf<typeof _createRole>> {
  return toCancelable(signal => _createRole({ body, signal }).then((r:any)=> (r as any).data));
}

type _createTenant_Body = CreateTenantData extends { body?: infer B } ? B : never;
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
export function createTenant(body: _createTenant_Body): CancelablePromise<_DataOf<typeof _createTenant>> {
  return toCancelable(signal => _createTenant({ body, signal }).then((r:any)=> (r as any).data));
}

type _createUser_Body = CreateUserData extends { body?: infer B } ? B : never;
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
export function createUser(body: _createUser_Body): CancelablePromise<_DataOf<typeof _createUser>> {
  return toCancelable(signal => _createUser({ body, signal }).then((r:any)=> (r as any).data));
}

type _deleteDecisionInstancesBatchOperation_Body = DeleteDecisionInstancesBatchOperationData extends { body?: infer B } ? B : never;
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
export function deleteDecisionInstancesBatchOperation(body: _deleteDecisionInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _deleteDecisionInstancesBatchOperation>> {
  return toCancelable(signal => _deleteDecisionInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _deleteProcessInstancesBatchOperation_Body = DeleteProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
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
export function deleteProcessInstancesBatchOperation(body: _deleteProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _deleteProcessInstancesBatchOperation>> {
  return toCancelable(signal => _deleteProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _evaluateConditionals_Body = EvaluateConditionalsData extends { body?: infer B } ? B : never;
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
export function evaluateConditionals(body: _evaluateConditionals_Body): CancelablePromise<_DataOf<typeof _evaluateConditionals>> {
  return toCancelable(signal => _evaluateConditionals({ body, signal }).then((r:any)=> (r as any).data));
}

type _evaluateDecision_Body = EvaluateDecisionData extends { body?: infer B } ? B : never;
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
export function evaluateDecision(body: _evaluateDecision_Body): CancelablePromise<_DataOf<typeof _evaluateDecision>> {
  return toCancelable(signal => _evaluateDecision({ body, signal }).then((r:any)=> (r as any).data));
}

type _evaluateExpression_Body = EvaluateExpressionData extends { body?: infer B } ? B : never;
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
export function evaluateExpression(body: _evaluateExpression_Body): CancelablePromise<_DataOf<typeof _evaluateExpression>> {
  return toCancelable(signal => _evaluateExpression({ body, signal }).then((r:any)=> (r as any).data));
}

type _getJobErrorStatistics_Body = GetJobErrorStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getJobErrorStatistics(body: _getJobErrorStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getJobErrorStatistics>> }): CancelablePromise<_DataOf<typeof _getJobErrorStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getJobErrorStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getJobErrorStatistics', false, invoke, ec.consistency);
}

type _getJobTimeSeriesStatistics_Body = GetJobTimeSeriesStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getJobTimeSeriesStatistics(body: _getJobTimeSeriesStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getJobTimeSeriesStatistics>> }): CancelablePromise<_DataOf<typeof _getJobTimeSeriesStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getJobTimeSeriesStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getJobTimeSeriesStatistics', false, invoke, ec.consistency);
}

type _getJobTypeStatistics_Body = GetJobTypeStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getJobTypeStatistics(body: _getJobTypeStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getJobTypeStatistics>> }): CancelablePromise<_DataOf<typeof _getJobTypeStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getJobTypeStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getJobTypeStatistics', false, invoke, ec.consistency);
}

type _getJobWorkerStatistics_Body = GetJobWorkerStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getJobWorkerStatistics(body: _getJobWorkerStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getJobWorkerStatistics>> }): CancelablePromise<_DataOf<typeof _getJobWorkerStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getJobWorkerStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getJobWorkerStatistics', false, invoke, ec.consistency);
}

type _getProcessDefinitionInstanceStatistics_Body = GetProcessDefinitionInstanceStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionInstanceStatistics(body: _getProcessDefinitionInstanceStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionInstanceStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionInstanceStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionInstanceStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinitionInstanceStatistics', false, invoke, ec.consistency);
}

type _getProcessDefinitionInstanceVersionStatistics_Body = GetProcessDefinitionInstanceVersionStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionInstanceVersionStatistics(body: _getProcessDefinitionInstanceVersionStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionInstanceVersionStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionInstanceVersionStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionInstanceVersionStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinitionInstanceVersionStatistics', false, invoke, ec.consistency);
}

type _getProcessDefinitionMessageSubscriptionStatistics_Body = GetProcessDefinitionMessageSubscriptionStatisticsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionMessageSubscriptionStatistics(body: _getProcessDefinitionMessageSubscriptionStatistics_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionMessageSubscriptionStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionMessageSubscriptionStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionMessageSubscriptionStatistics({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinitionMessageSubscriptionStatistics', false, invoke, ec.consistency);
}

type _getProcessInstanceStatisticsByDefinition_Body = GetProcessInstanceStatisticsByDefinitionData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceStatisticsByDefinition(body: _getProcessInstanceStatisticsByDefinition_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceStatisticsByDefinition>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceStatisticsByDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceStatisticsByDefinition({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceStatisticsByDefinition', false, invoke, ec.consistency);
}

type _getProcessInstanceStatisticsByError_Body = GetProcessInstanceStatisticsByErrorData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceStatisticsByError(body: _getProcessInstanceStatisticsByError_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceStatisticsByError>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceStatisticsByError>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceStatisticsByError({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceStatisticsByError', false, invoke, ec.consistency);
}

type _listSecrets_Body = ListSecretsData extends { body?: infer B } ? B : never;
/**
 * List secrets (alpha)
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
 * This endpoint is an alpha feature and may be subject to change in future releases.
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
export function listSecrets(body: _listSecrets_Body): CancelablePromise<_DataOf<typeof _listSecrets>> {
  return toCancelable(signal => _listSecrets({ body, signal }).then((r:any)=> (r as any).data));
}

type _migrateProcessInstancesBatchOperation_Body = MigrateProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
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
export function migrateProcessInstancesBatchOperation(body: _migrateProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>> {
  return toCancelable(signal => _migrateProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _modifyProcessInstancesBatchOperation_Body = ModifyProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
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
export function modifyProcessInstancesBatchOperation(body: _modifyProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>> {
  return toCancelable(signal => _modifyProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _pinClock_Body = PinClockData extends { body?: infer B } ? B : never;
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
export function pinClock(body: _pinClock_Body): CancelablePromise<_DataOf<typeof _pinClock>> {
  return toCancelable(signal => _pinClock({ body, signal }).then((r:any)=> (r as any).data));
}

type _publishMessage_Body = PublishMessageData extends { body?: infer B } ? B : never;
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
export function publishMessage(body: _publishMessage_Body): CancelablePromise<_DataOf<typeof _publishMessage>> {
  return toCancelable(signal => _publishMessage({ body, signal }).then((r:any)=> (r as any).data));
}

type _resolveIncidentsBatchOperation_Body = ResolveIncidentsBatchOperationData extends { body?: infer B } ? B : never;
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
export function resolveIncidentsBatchOperation(body: _resolveIncidentsBatchOperation_Body): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>> {
  return toCancelable(signal => _resolveIncidentsBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _resolveSecrets_Body = ResolveSecretsData extends { body?: infer B } ? B : never;
/**
 * Resolve secrets (alpha)
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
 * This endpoint is an alpha feature and may be subject to change in future releases.
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
export function resolveSecrets(body: _resolveSecrets_Body): CancelablePromise<_DataOf<typeof _resolveSecrets>> {
  return toCancelable(signal => _resolveSecrets({ body, signal }).then((r:any)=> (r as any).data));
}

type _resumeProcessInstancesBatchOperation_Body = ResumeProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
/**
 * Resume process instances (batch)
 *
 * Resumes multiple suspended process instances.
 * Since only SUSPENDED root instances can be resumed, any given
 * filters for state and parentProcessInstanceKey are ignored and overridden during this batch operation.
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
export function resumeProcessInstancesBatchOperation(body: _resumeProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _resumeProcessInstancesBatchOperation>> {
  return toCancelable(signal => _resumeProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _searchAgentDefinitions_Body = SearchAgentDefinitionsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAgentDefinitions(body: _searchAgentDefinitions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAgentDefinitions>> }): CancelablePromise<_DataOf<typeof _searchAgentDefinitions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAgentDefinitions({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchAgentDefinitions', false, invoke, ec.consistency);
}

type _searchAgentInstances_Body = SearchAgentInstancesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAgentInstances(body: _searchAgentInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAgentInstances>> }): CancelablePromise<_DataOf<typeof _searchAgentInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAgentInstances({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchAgentInstances', false, invoke, ec.consistency);
}

type _searchAuditLogs_Body = SearchAuditLogsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAuditLogs(body: _searchAuditLogs_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAuditLogs>> }): CancelablePromise<_DataOf<typeof _searchAuditLogs>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAuditLogs({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchAuditLogs', false, invoke, ec.consistency);
}

type _searchAuthorizations_Body = SearchAuthorizationsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAuthorizations(body: _searchAuthorizations_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAuthorizations>> }): CancelablePromise<_DataOf<typeof _searchAuthorizations>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAuthorizations({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchAuthorizations', false, invoke, ec.consistency);
}

type _searchBatchOperationItems_Body = SearchBatchOperationItemsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchBatchOperationItems(body: _searchBatchOperationItems_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchBatchOperationItems>> }): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchBatchOperationItems({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchBatchOperationItems', false, invoke, ec.consistency);
}

type _searchBatchOperations_Body = SearchBatchOperationsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchBatchOperations(body: _searchBatchOperations_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchBatchOperations>> }): CancelablePromise<_DataOf<typeof _searchBatchOperations>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchBatchOperations({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchBatchOperations', false, invoke, ec.consistency);
}

type _searchCorrelatedMessageSubscriptions_Body = SearchCorrelatedMessageSubscriptionsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchCorrelatedMessageSubscriptions(body: _searchCorrelatedMessageSubscriptions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchCorrelatedMessageSubscriptions>> }): CancelablePromise<_DataOf<typeof _searchCorrelatedMessageSubscriptions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchCorrelatedMessageSubscriptions({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchCorrelatedMessageSubscriptions', false, invoke, ec.consistency);
}

type _searchDecisionDefinitions_Body = SearchDecisionDefinitionsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionDefinitions(body: _searchDecisionDefinitions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionDefinitions>> }): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionDefinitions({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchDecisionDefinitions', false, invoke, ec.consistency);
}

type _searchDecisionInstances_Body = SearchDecisionInstancesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionInstances(body: _searchDecisionInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionInstances>> }): CancelablePromise<_DataOf<typeof _searchDecisionInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionInstances({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchDecisionInstances', false, invoke, ec.consistency);
}

type _searchDecisionRequirements_Body = SearchDecisionRequirementsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionRequirements(body: _searchDecisionRequirements_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionRequirements>> }): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionRequirements({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchDecisionRequirements', false, invoke, ec.consistency);
}

type _searchElementInstances_Body = SearchElementInstancesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchElementInstances(body: _searchElementInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchElementInstances>> }): CancelablePromise<_DataOf<typeof _searchElementInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchElementInstances({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchElementInstances', false, invoke, ec.consistency);
}

type _searchElementInstanceWaitStates_Body = SearchElementInstanceWaitStatesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchElementInstanceWaitStates(body: _searchElementInstanceWaitStates_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchElementInstanceWaitStates>> }): CancelablePromise<_DataOf<typeof _searchElementInstanceWaitStates>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchElementInstanceWaitStates({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchElementInstanceWaitStates', false, invoke, ec.consistency);
}

type _searchGlobalTaskListeners_Body = SearchGlobalTaskListenersData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGlobalTaskListeners(body: _searchGlobalTaskListeners_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGlobalTaskListeners>> }): CancelablePromise<_DataOf<typeof _searchGlobalTaskListeners>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGlobalTaskListeners({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchGlobalTaskListeners', false, invoke, ec.consistency);
}

type _searchGroups_Body = SearchGroupsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroups(body: _searchGroups_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroups>> }): CancelablePromise<_DataOf<typeof _searchGroups>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroups({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchGroups', false, invoke, ec.consistency);
}

type _searchIncidents_Body = SearchIncidentsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchIncidents(body: _searchIncidents_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchIncidents>> }): CancelablePromise<_DataOf<typeof _searchIncidents>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchIncidents({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchIncidents', false, invoke, ec.consistency);
}

type _searchJobs_Body = SearchJobsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchJobs(body: _searchJobs_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchJobs>> }): CancelablePromise<_DataOf<typeof _searchJobs>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchJobs({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchJobs', false, invoke, ec.consistency);
}

type _searchMappingRule_Body = SearchMappingRuleData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRule(body: _searchMappingRule_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRule>> }): CancelablePromise<_DataOf<typeof _searchMappingRule>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRule({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchMappingRule', false, invoke, ec.consistency);
}

type _searchMessageSubscriptions_Body = SearchMessageSubscriptionsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMessageSubscriptions(body: _searchMessageSubscriptions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMessageSubscriptions>> }): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMessageSubscriptions({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchMessageSubscriptions', false, invoke, ec.consistency);
}

type _searchOwnAuthorizations_Body = SearchOwnAuthorizationsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchOwnAuthorizations(body: _searchOwnAuthorizations_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchOwnAuthorizations>> }): CancelablePromise<_DataOf<typeof _searchOwnAuthorizations>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchOwnAuthorizations({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchOwnAuthorizations', false, invoke, ec.consistency);
}

type _searchProcessDefinitions_Body = SearchProcessDefinitionsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessDefinitions(body: _searchProcessDefinitions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessDefinitions>> }): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessDefinitions({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchProcessDefinitions', false, invoke, ec.consistency);
}

type _searchProcessInstances_Body = SearchProcessInstancesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessInstances(body: _searchProcessInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessInstances>> }): CancelablePromise<_DataOf<typeof _searchProcessInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessInstances({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchProcessInstances', false, invoke, ec.consistency);
}

type _searchResources_Body = SearchResourcesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchResources(body: _searchResources_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchResources>> }): CancelablePromise<_DataOf<typeof _searchResources>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchResources({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchResources', false, invoke, ec.consistency);
}

type _searchRoles_Body = SearchRolesData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRoles(body: _searchRoles_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRoles>> }): CancelablePromise<_DataOf<typeof _searchRoles>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRoles({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchRoles', false, invoke, ec.consistency);
}

type _searchTenants_Body = SearchTenantsData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchTenants(body: _searchTenants_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchTenants>> }): CancelablePromise<_DataOf<typeof _searchTenants>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchTenants({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchTenants', false, invoke, ec.consistency);
}

type _searchUsers_Body = SearchUsersData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsers(body: _searchUsers_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsers>> }): CancelablePromise<_DataOf<typeof _searchUsers>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsers({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchUsers', false, invoke, ec.consistency);
}

type _searchUserTasks_Body = SearchUserTasksData extends { body?: infer B } ? B : never;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTasks(body: _searchUserTasks_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTasks>> }): CancelablePromise<_DataOf<typeof _searchUserTasks>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTasks({ body, signal }).then((r:any)=> (r as any).data));
  return eventualPoll('searchUserTasks', false, invoke, ec.consistency);
}

type _suspendProcessInstancesBatchOperation_Body = SuspendProcessInstancesBatchOperationData extends { body?: infer B } ? B : never;
/**
 * Suspend process instances (batch)
 *
 * Suspends multiple running process instances.
 * Since only ACTIVE root instances can be suspended, any given
 * filters for state and parentProcessInstanceKey are ignored and overridden during this batch operation.
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
export function suspendProcessInstancesBatchOperation(body: _suspendProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _suspendProcessInstancesBatchOperation>> {
  return toCancelable(signal => _suspendProcessInstancesBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

type _takeHistoryBackup_Body = TakeHistoryBackupData extends { body?: infer B } ? B : never;
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
export function takeHistoryBackup(body: _takeHistoryBackup_Body): CancelablePromise<_DataOf<typeof _takeHistoryBackup>> {
  return toCancelable(signal => _takeHistoryBackup({ body, signal }).then((r:any)=> (r as any).data));
}

type _takeRuntimeBackup_Body = TakeRuntimeBackupData extends { body?: infer B } ? B : never;
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
export function takeRuntimeBackup(body: _takeRuntimeBackup_Body): CancelablePromise<_DataOf<typeof _takeRuntimeBackup>> {
  return toCancelable(signal => _takeRuntimeBackup({ body, signal }).then((r:any)=> (r as any).data));
}

type _updateJobsBatchOperation_Body = UpdateJobsBatchOperationData extends { body?: infer B } ? B : never;
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
export function updateJobsBatchOperation(body: _updateJobsBatchOperation_Body): CancelablePromise<_DataOf<typeof _updateJobsBatchOperation>> {
  return toCancelable(signal => _updateJobsBatchOperation({ body, signal }).then((r:any)=> (r as any).data));
}

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
export function activateAdHocSubProcessActivities(options?: Parameters<typeof _activateAdHocSubProcessActivities>[0]): CancelablePromise<_DataOf<typeof _activateAdHocSubProcessActivities>> {
  return toCancelable(signal => _activateAdHocSubProcessActivities({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignClientToGroup(options?: Parameters<typeof _assignClientToGroup>[0]): CancelablePromise<_DataOf<typeof _assignClientToGroup>> {
  return toCancelable(signal => _assignClientToGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignClientToTenant(options?: Parameters<typeof _assignClientToTenant>[0]): CancelablePromise<_DataOf<typeof _assignClientToTenant>> {
  return toCancelable(signal => _assignClientToTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignGroupToTenant(options?: Parameters<typeof _assignGroupToTenant>[0]): CancelablePromise<_DataOf<typeof _assignGroupToTenant>> {
  return toCancelable(signal => _assignGroupToTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignMappingRuleToGroup(options?: Parameters<typeof _assignMappingRuleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToGroup>> {
  return toCancelable(signal => _assignMappingRuleToGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignMappingRuleToTenant(options?: Parameters<typeof _assignMappingRuleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToTenant>> {
  return toCancelable(signal => _assignMappingRuleToTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignProcessInstanceBusinessId(options?: Parameters<typeof _assignProcessInstanceBusinessId>[0]): CancelablePromise<_DataOf<typeof _assignProcessInstanceBusinessId>> {
  return toCancelable(signal => _assignProcessInstanceBusinessId({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignRoleToClient(options?: Parameters<typeof _assignRoleToClient>[0]): CancelablePromise<_DataOf<typeof _assignRoleToClient>> {
  return toCancelable(signal => _assignRoleToClient({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignRoleToGroup(options?: Parameters<typeof _assignRoleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignRoleToGroup>> {
  return toCancelable(signal => _assignRoleToGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignRoleToMappingRule(options?: Parameters<typeof _assignRoleToMappingRule>[0]): CancelablePromise<_DataOf<typeof _assignRoleToMappingRule>> {
  return toCancelable(signal => _assignRoleToMappingRule({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignRoleToTenant(options?: Parameters<typeof _assignRoleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignRoleToTenant>> {
  return toCancelable(signal => _assignRoleToTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignRoleToUser(options?: Parameters<typeof _assignRoleToUser>[0]): CancelablePromise<_DataOf<typeof _assignRoleToUser>> {
  return toCancelable(signal => _assignRoleToUser({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignUserTask(options?: Parameters<typeof _assignUserTask>[0]): CancelablePromise<_DataOf<typeof _assignUserTask>> {
  return toCancelable(signal => _assignUserTask({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignUserToGroup(options?: Parameters<typeof _assignUserToGroup>[0]): CancelablePromise<_DataOf<typeof _assignUserToGroup>> {
  return toCancelable(signal => _assignUserToGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function assignUserToTenant(options?: Parameters<typeof _assignUserToTenant>[0]): CancelablePromise<_DataOf<typeof _assignUserToTenant>> {
  return toCancelable(signal => _assignUserToTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function cancelBatchOperation(options?: Parameters<typeof _cancelBatchOperation>[0]): CancelablePromise<_DataOf<typeof _cancelBatchOperation>> {
  return toCancelable(signal => _cancelBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function cancelClusterRebalance(options?: Parameters<typeof _cancelClusterRebalance>[0]): CancelablePromise<_DataOf<typeof _cancelClusterRebalance>> {
  return toCancelable(signal => _cancelClusterRebalance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function cancelProcessInstance(options?: Parameters<typeof _cancelProcessInstance>[0]): CancelablePromise<_DataOf<typeof _cancelProcessInstance>> {
  return toCancelable(signal => _cancelProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function changeClusterMode(options?: Parameters<typeof _changeClusterMode>[0]): CancelablePromise<_DataOf<typeof _changeClusterMode>> {
  return toCancelable(signal => _changeClusterMode({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function changeClusterModeAsClusterAdmin(options?: Parameters<typeof _changeClusterModeAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _changeClusterModeAsClusterAdmin>> {
  return toCancelable(signal => _changeClusterModeAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function completeJob(options?: Parameters<typeof _completeJob>[0]): CancelablePromise<_DataOf<typeof _completeJob>> {
  return toCancelable(signal => _completeJob({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function completeUserTask(options?: Parameters<typeof _completeUserTask>[0]): CancelablePromise<_DataOf<typeof _completeUserTask>> {
  return toCancelable(signal => _completeUserTask({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function createDocument(options?: Parameters<typeof _createDocument>[0]): CancelablePromise<_DataOf<typeof _createDocument>> {
  return toCancelable(signal => _createDocument({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function createDocumentLink(options?: Parameters<typeof _createDocumentLink>[0]): CancelablePromise<_DataOf<typeof _createDocumentLink>> {
  return toCancelable(signal => _createDocumentLink({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function createDocuments(options?: Parameters<typeof _createDocuments>[0]): CancelablePromise<_DataOf<typeof _createDocuments>> {
  return toCancelable(signal => _createDocuments({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function createElementInstanceVariables(options?: Parameters<typeof _createElementInstanceVariables>[0]): CancelablePromise<_DataOf<typeof _createElementInstanceVariables>> {
  return toCancelable(signal => _createElementInstanceVariables({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function createTenantClusterVariable(options?: Parameters<typeof _createTenantClusterVariable>[0]): CancelablePromise<_DataOf<typeof _createTenantClusterVariable>> {
  return toCancelable(signal => _createTenantClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteAuthorization(options?: Parameters<typeof _deleteAuthorization>[0]): CancelablePromise<_DataOf<typeof _deleteAuthorization>> {
  return toCancelable(signal => _deleteAuthorization({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteDecisionInstance(options?: Parameters<typeof _deleteDecisionInstance>[0]): CancelablePromise<_DataOf<typeof _deleteDecisionInstance>> {
  return toCancelable(signal => _deleteDecisionInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteDocument(options?: Parameters<typeof _deleteDocument>[0]): CancelablePromise<_DataOf<typeof _deleteDocument>> {
  return toCancelable(signal => _deleteDocument({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteGlobalClusterVariable(options?: Parameters<typeof _deleteGlobalClusterVariable>[0]): CancelablePromise<_DataOf<typeof _deleteGlobalClusterVariable>> {
  return toCancelable(signal => _deleteGlobalClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteGlobalTaskListener(options?: Parameters<typeof _deleteGlobalTaskListener>[0]): CancelablePromise<_DataOf<typeof _deleteGlobalTaskListener>> {
  return toCancelable(signal => _deleteGlobalTaskListener({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteGroup(options?: Parameters<typeof _deleteGroup>[0]): CancelablePromise<_DataOf<typeof _deleteGroup>> {
  return toCancelable(signal => _deleteGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteHistoryBackup(options?: Parameters<typeof _deleteHistoryBackup>[0]): CancelablePromise<_DataOf<typeof _deleteHistoryBackup>> {
  return toCancelable(signal => _deleteHistoryBackup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteHistoryBackupAsClusterAdmin(options?: Parameters<typeof _deleteHistoryBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _deleteHistoryBackupAsClusterAdmin>> {
  return toCancelable(signal => _deleteHistoryBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteMappingRule(options?: Parameters<typeof _deleteMappingRule>[0]): CancelablePromise<_DataOf<typeof _deleteMappingRule>> {
  return toCancelable(signal => _deleteMappingRule({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteProcessInstance(options?: Parameters<typeof _deleteProcessInstance>[0]): CancelablePromise<_DataOf<typeof _deleteProcessInstance>> {
  return toCancelable(signal => _deleteProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteResource(options?: Parameters<typeof _deleteResource>[0]): CancelablePromise<_DataOf<typeof _deleteResource>> {
  return toCancelable(signal => _deleteResource({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteRole(options?: Parameters<typeof _deleteRole>[0]): CancelablePromise<_DataOf<typeof _deleteRole>> {
  return toCancelable(signal => _deleteRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteRuntimeBackup(options?: Parameters<typeof _deleteRuntimeBackup>[0]): CancelablePromise<_DataOf<typeof _deleteRuntimeBackup>> {
  return toCancelable(signal => _deleteRuntimeBackup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteRuntimeBackupAsClusterAdmin(options?: Parameters<typeof _deleteRuntimeBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _deleteRuntimeBackupAsClusterAdmin>> {
  return toCancelable(signal => _deleteRuntimeBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteRuntimeBackupState(options?: Parameters<typeof _deleteRuntimeBackupState>[0]): CancelablePromise<_DataOf<typeof _deleteRuntimeBackupState>> {
  return toCancelable(signal => _deleteRuntimeBackupState({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteRuntimeBackupStateAsClusterAdmin(options?: Parameters<typeof _deleteRuntimeBackupStateAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _deleteRuntimeBackupStateAsClusterAdmin>> {
  return toCancelable(signal => _deleteRuntimeBackupStateAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteTenant(options?: Parameters<typeof _deleteTenant>[0]): CancelablePromise<_DataOf<typeof _deleteTenant>> {
  return toCancelable(signal => _deleteTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteTenantClusterVariable(options?: Parameters<typeof _deleteTenantClusterVariable>[0]): CancelablePromise<_DataOf<typeof _deleteTenantClusterVariable>> {
  return toCancelable(signal => _deleteTenantClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function deleteUser(options?: Parameters<typeof _deleteUser>[0]): CancelablePromise<_DataOf<typeof _deleteUser>> {
  return toCancelable(signal => _deleteUser({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function failJob(options?: Parameters<typeof _failJob>[0]): CancelablePromise<_DataOf<typeof _failJob>> {
  return toCancelable(signal => _failJob({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getAgentDefinition(options: Parameters<typeof _getAgentDefinition>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getAgentDefinition>> }): CancelablePromise<_DataOf<typeof _getAgentDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getAgentDefinition({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getAgentDefinition', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getAgentInstance(options: Parameters<typeof _getAgentInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getAgentInstance>> }): CancelablePromise<_DataOf<typeof _getAgentInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getAgentInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getAgentInstance', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getAuditLog(options: Parameters<typeof _getAuditLog>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getAuditLog>> }): CancelablePromise<_DataOf<typeof _getAuditLog>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getAuditLog({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getAuditLog', true, invoke, ec.consistency);
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
export function getAuthentication(options?: Parameters<typeof _getAuthentication>[0]): CancelablePromise<_DataOf<typeof _getAuthentication>> {
  return toCancelable(signal => _getAuthentication({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getAuthorization(options: Parameters<typeof _getAuthorization>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getAuthorization>> }): CancelablePromise<_DataOf<typeof _getAuthorization>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getAuthorization({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getAuthorization', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getBatchOperation(options: Parameters<typeof _getBatchOperation>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getBatchOperation>> }): CancelablePromise<_DataOf<typeof _getBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getBatchOperation', true, invoke, ec.consistency);
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
export function getClusterExportingStatus(options?: Parameters<typeof _getClusterExportingStatus>[0]): CancelablePromise<_DataOf<typeof _getClusterExportingStatus>> {
  return toCancelable(signal => _getClusterExportingStatus({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getClusterRebalance(options?: Parameters<typeof _getClusterRebalance>[0]): CancelablePromise<_DataOf<typeof _getClusterRebalance>> {
  return toCancelable(signal => _getClusterRebalance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getClusterStatus(options?: Parameters<typeof _getClusterStatus>[0]): CancelablePromise<_DataOf<typeof _getClusterStatus>> {
  return toCancelable(signal => _getClusterStatus({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getClusterTopology(options?: Parameters<typeof _getClusterTopology>[0]): CancelablePromise<_DataOf<typeof _getClusterTopology>> {
  return toCancelable(signal => _getClusterTopology({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionDefinition(options: Parameters<typeof _getDecisionDefinition>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionDefinition>> }): CancelablePromise<_DataOf<typeof _getDecisionDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionDefinition({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getDecisionDefinition', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionDefinitionXml(options: Parameters<typeof _getDecisionDefinitionXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionDefinitionXml>> }): CancelablePromise<_DataOf<typeof _getDecisionDefinitionXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getDecisionDefinitionXML', true, invoke, ec.consistency);
}
/** @deprecated Use getDecisionDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionDefinitionXML = getDecisionDefinitionXml;

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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionInstance(options: Parameters<typeof _getDecisionInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionInstance>> }): CancelablePromise<_DataOf<typeof _getDecisionInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getDecisionInstance', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionRequirements(options: Parameters<typeof _getDecisionRequirements>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionRequirements>> }): CancelablePromise<_DataOf<typeof _getDecisionRequirements>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionRequirements({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getDecisionRequirements', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionRequirementsXml(options: Parameters<typeof _getDecisionRequirementsXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionRequirementsXml>> }): CancelablePromise<_DataOf<typeof _getDecisionRequirementsXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionRequirementsXml({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getDecisionRequirementsXML', true, invoke, ec.consistency);
}
/** @deprecated Use getDecisionRequirementsXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionRequirementsXML = getDecisionRequirementsXml;

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
export function getDocument(options?: Parameters<typeof _getDocument>[0]): CancelablePromise<_DataOf<typeof _getDocument>> {
  return toCancelable(signal => _getDocument({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getElementInstance(options: Parameters<typeof _getElementInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getElementInstance>> }): CancelablePromise<_DataOf<typeof _getElementInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getElementInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getElementInstance', true, invoke, ec.consistency);
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
export function getExportingStatus(options?: Parameters<typeof _getExportingStatus>[0]): CancelablePromise<_DataOf<typeof _getExportingStatus>> {
  return toCancelable(signal => _getExportingStatus({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getFormByKey(options: Parameters<typeof _getFormByKey>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getFormByKey>> }): CancelablePromise<_DataOf<typeof _getFormByKey>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getFormByKey({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getFormByKey', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getGlobalClusterVariable(options: Parameters<typeof _getGlobalClusterVariable>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getGlobalClusterVariable>> }): CancelablePromise<_DataOf<typeof _getGlobalClusterVariable>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getGlobalClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getGlobalClusterVariable', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getGlobalJobStatistics(options: Parameters<typeof _getGlobalJobStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getGlobalJobStatistics>> }): CancelablePromise<_DataOf<typeof _getGlobalJobStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getGlobalJobStatistics({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getGlobalJobStatistics', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getGlobalTaskListener(options: Parameters<typeof _getGlobalTaskListener>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getGlobalTaskListener>> }): CancelablePromise<_DataOf<typeof _getGlobalTaskListener>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getGlobalTaskListener({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getGlobalTaskListener', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getGroup(options: Parameters<typeof _getGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getGroup>> }): CancelablePromise<_DataOf<typeof _getGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getGroup', true, invoke, ec.consistency);
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
export function getHistoryBackup(options?: Parameters<typeof _getHistoryBackup>[0]): CancelablePromise<_DataOf<typeof _getHistoryBackup>> {
  return toCancelable(signal => _getHistoryBackup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getHistoryBackupAsClusterAdmin(options?: Parameters<typeof _getHistoryBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _getHistoryBackupAsClusterAdmin>> {
  return toCancelable(signal => _getHistoryBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getIncident(options: Parameters<typeof _getIncident>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getIncident>> }): CancelablePromise<_DataOf<typeof _getIncident>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getIncident({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getIncident', true, invoke, ec.consistency);
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
export function getLicense(options?: Parameters<typeof _getLicense>[0]): CancelablePromise<_DataOf<typeof _getLicense>> {
  return toCancelable(signal => _getLicense({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getMappingRule(options: Parameters<typeof _getMappingRule>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getMappingRule>> }): CancelablePromise<_DataOf<typeof _getMappingRule>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getMappingRule({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getMappingRule', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinition(options: Parameters<typeof _getProcessDefinition>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinition>> }): CancelablePromise<_DataOf<typeof _getProcessDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinition({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinition', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionStatistics(options: Parameters<typeof _getProcessDefinitionStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionStatistics({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinitionStatistics', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionXml(options: Parameters<typeof _getProcessDefinitionXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionXml>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessDefinitionXML', true, invoke, ec.consistency);
}
/** @deprecated Use getProcessDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getProcessDefinitionXML = getProcessDefinitionXml;

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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstance(options: Parameters<typeof _getProcessInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstance>> }): CancelablePromise<_DataOf<typeof _getProcessInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstance', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceCallHierarchy(options: Parameters<typeof _getProcessInstanceCallHierarchy>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceCallHierarchy>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceCallHierarchy>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceCallHierarchy({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceCallHierarchy', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceSequenceFlows(options: Parameters<typeof _getProcessInstanceSequenceFlows>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceSequenceFlows>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceSequenceFlows>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceSequenceFlows({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceSequenceFlows', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceStatistics(options: Parameters<typeof _getProcessInstanceStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceStatistics({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceStatistics', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceWaitStateStatistics(options: Parameters<typeof _getProcessInstanceWaitStateStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceWaitStateStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceWaitStateStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceWaitStateStatistics({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getProcessInstanceWaitStateStatistics', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getResource(options: Parameters<typeof _getResource>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getResource>> }): CancelablePromise<_DataOf<typeof _getResource>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getResource({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getResource', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getResourceContent(options: Parameters<typeof _getResourceContent>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getResourceContent>> }): CancelablePromise<_DataOf<typeof _getResourceContent>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getResourceContent({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getResourceContent', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getResourceContentBinary(options: Parameters<typeof _getResourceContentBinary>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getResourceContentBinary>> }): CancelablePromise<_DataOf<typeof _getResourceContentBinary>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getResourceContentBinary({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getResourceContentBinary', true, invoke, ec.consistency);
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
export function getRestoreStatus(options?: Parameters<typeof _getRestoreStatus>[0]): CancelablePromise<_DataOf<typeof _getRestoreStatus>> {
  return toCancelable(signal => _getRestoreStatus({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getRole(options: Parameters<typeof _getRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getRole>> }): CancelablePromise<_DataOf<typeof _getRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getRole', true, invoke, ec.consistency);
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
export function getRuntimeBackup(options?: Parameters<typeof _getRuntimeBackup>[0]): CancelablePromise<_DataOf<typeof _getRuntimeBackup>> {
  return toCancelable(signal => _getRuntimeBackup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getRuntimeBackupAsClusterAdmin(options?: Parameters<typeof _getRuntimeBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _getRuntimeBackupAsClusterAdmin>> {
  return toCancelable(signal => _getRuntimeBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getRuntimeBackupState(options?: Parameters<typeof _getRuntimeBackupState>[0]): CancelablePromise<_DataOf<typeof _getRuntimeBackupState>> {
  return toCancelable(signal => _getRuntimeBackupState({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getRuntimeBackupStateAsClusterAdmin(options?: Parameters<typeof _getRuntimeBackupStateAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _getRuntimeBackupStateAsClusterAdmin>> {
  return toCancelable(signal => _getRuntimeBackupStateAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getStartProcessForm(options: Parameters<typeof _getStartProcessForm>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getStartProcessForm>> }): CancelablePromise<_DataOf<typeof _getStartProcessForm>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getStartProcessForm({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getStartProcessForm', true, invoke, ec.consistency);
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
export function getStatus(options?: Parameters<typeof _getStatus>[0]): CancelablePromise<_DataOf<typeof _getStatus>> {
  return toCancelable(signal => _getStatus({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function getSystemConfiguration(options?: Parameters<typeof _getSystemConfiguration>[0]): CancelablePromise<_DataOf<typeof _getSystemConfiguration>> {
  return toCancelable(signal => _getSystemConfiguration({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getTenant(options: Parameters<typeof _getTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getTenant>> }): CancelablePromise<_DataOf<typeof _getTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getTenant', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getTenantClusterVariable(options: Parameters<typeof _getTenantClusterVariable>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getTenantClusterVariable>> }): CancelablePromise<_DataOf<typeof _getTenantClusterVariable>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getTenantClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getTenantClusterVariable', true, invoke, ec.consistency);
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
export function getTopology(options?: Parameters<typeof _getTopology>[0]): CancelablePromise<_DataOf<typeof _getTopology>> {
  return toCancelable(signal => _getTopology({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUsageMetrics(options: Parameters<typeof _getUsageMetrics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUsageMetrics>> }): CancelablePromise<_DataOf<typeof _getUsageMetrics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUsageMetrics({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getUsageMetrics', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUser(options: Parameters<typeof _getUser>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUser>> }): CancelablePromise<_DataOf<typeof _getUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUser({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getUser', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUserTask(options: Parameters<typeof _getUserTask>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUserTask>> }): CancelablePromise<_DataOf<typeof _getUserTask>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUserTask({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getUserTask', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUserTaskForm(options: Parameters<typeof _getUserTaskForm>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUserTaskForm>> }): CancelablePromise<_DataOf<typeof _getUserTaskForm>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUserTaskForm({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getUserTaskForm', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getVariable(options: Parameters<typeof _getVariable>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getVariable>> }): CancelablePromise<_DataOf<typeof _getVariable>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('getVariable', true, invoke, ec.consistency);
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
export function listHistoryBackups(options?: Parameters<typeof _listHistoryBackups>[0]): CancelablePromise<_DataOf<typeof _listHistoryBackups>> {
  return toCancelable(signal => _listHistoryBackups({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function listHistoryBackupsAsClusterAdmin(options?: Parameters<typeof _listHistoryBackupsAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _listHistoryBackupsAsClusterAdmin>> {
  return toCancelable(signal => _listHistoryBackupsAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function listRuntimeBackups(options?: Parameters<typeof _listRuntimeBackups>[0]): CancelablePromise<_DataOf<typeof _listRuntimeBackups>> {
  return toCancelable(signal => _listRuntimeBackups({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function listRuntimeBackupsAsClusterAdmin(options?: Parameters<typeof _listRuntimeBackupsAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _listRuntimeBackupsAsClusterAdmin>> {
  return toCancelable(signal => _listRuntimeBackupsAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function migrateProcessInstance(options?: Parameters<typeof _migrateProcessInstance>[0]): CancelablePromise<_DataOf<typeof _migrateProcessInstance>> {
  return toCancelable(signal => _migrateProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function modifyProcessInstance(options?: Parameters<typeof _modifyProcessInstance>[0]): CancelablePromise<_DataOf<typeof _modifyProcessInstance>> {
  return toCancelable(signal => _modifyProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function pauseClusterExporting(options?: Parameters<typeof _pauseClusterExporting>[0]): CancelablePromise<_DataOf<typeof _pauseClusterExporting>> {
  return toCancelable(signal => _pauseClusterExporting({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function pauseExporting(options?: Parameters<typeof _pauseExporting>[0]): CancelablePromise<_DataOf<typeof _pauseExporting>> {
  return toCancelable(signal => _pauseExporting({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resetClock(options?: Parameters<typeof _resetClock>[0]): CancelablePromise<_DataOf<typeof _resetClock>> {
  return toCancelable(signal => _resetClock({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resolveIncident(options?: Parameters<typeof _resolveIncident>[0]): CancelablePromise<_DataOf<typeof _resolveIncident>> {
  return toCancelable(signal => _resolveIncident({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resolveProcessInstanceIncidents(options?: Parameters<typeof _resolveProcessInstanceIncidents>[0]): CancelablePromise<_DataOf<typeof _resolveProcessInstanceIncidents>> {
  return toCancelable(signal => _resolveProcessInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function restore(options?: Parameters<typeof _restore>[0]): CancelablePromise<_DataOf<typeof _restore>> {
  return toCancelable(signal => _restore({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function restoreAsClusterAdmin(options?: Parameters<typeof _restoreAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _restoreAsClusterAdmin>> {
  return toCancelable(signal => _restoreAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resumeBatchOperation(options?: Parameters<typeof _resumeBatchOperation>[0]): CancelablePromise<_DataOf<typeof _resumeBatchOperation>> {
  return toCancelable(signal => _resumeBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resumeClusterExporting(options?: Parameters<typeof _resumeClusterExporting>[0]): CancelablePromise<_DataOf<typeof _resumeClusterExporting>> {
  return toCancelable(signal => _resumeClusterExporting({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function resumeExporting(options?: Parameters<typeof _resumeExporting>[0]): CancelablePromise<_DataOf<typeof _resumeExporting>> {
  return toCancelable(signal => _resumeExporting({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
}

/**
 * Resume process instance
 *
 * Resumes a suspended process instance, returning it to the ACTIVE state and continuing processing.
 * Only process instances in the SUSPENDED state can be resumed.
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
export function resumeProcessInstance(options?: Parameters<typeof _resumeProcessInstance>[0]): CancelablePromise<_DataOf<typeof _resumeProcessInstance>> {
  return toCancelable(signal => _resumeProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAgentInstanceHistory(options: Parameters<typeof _searchAgentInstanceHistory>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAgentInstanceHistory>> }): CancelablePromise<_DataOf<typeof _searchAgentInstanceHistory>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAgentInstanceHistory({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchAgentInstanceHistory', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForGroup(options: Parameters<typeof _searchClientsForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForGroup>> }): CancelablePromise<_DataOf<typeof _searchClientsForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchClientsForGroup', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForRole(options: Parameters<typeof _searchClientsForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForRole>> }): CancelablePromise<_DataOf<typeof _searchClientsForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchClientsForRole', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForTenant(options: Parameters<typeof _searchClientsForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForTenant>> }): CancelablePromise<_DataOf<typeof _searchClientsForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchClientsForTenant', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClusterVariables(options: Parameters<typeof _searchClusterVariables>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClusterVariables>> }): CancelablePromise<_DataOf<typeof _searchClusterVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClusterVariables({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchClusterVariables', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchElementInstanceIncidents(options: Parameters<typeof _searchElementInstanceIncidents>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchElementInstanceIncidents>> }): CancelablePromise<_DataOf<typeof _searchElementInstanceIncidents>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchElementInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchElementInstanceIncidents', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroupIdsForTenant(options: Parameters<typeof _searchGroupIdsForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroupIdsForTenant>> }): CancelablePromise<_DataOf<typeof _searchGroupIdsForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroupIdsForTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchGroupIdsForTenant', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroupsForRole(options: Parameters<typeof _searchGroupsForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroupsForRole>> }): CancelablePromise<_DataOf<typeof _searchGroupsForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroupsForRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchGroupsForRole', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForGroup(options: Parameters<typeof _searchMappingRulesForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForGroup>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchMappingRulesForGroup', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForRole(options: Parameters<typeof _searchMappingRulesForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForRole>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchMappingRulesForRole', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForTenant(options: Parameters<typeof _searchMappingRulesForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForTenant>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchMappingRulesForTenant', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessDefinitionVariableNames(options: Parameters<typeof _searchProcessDefinitionVariableNames>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessDefinitionVariableNames>> }): CancelablePromise<_DataOf<typeof _searchProcessDefinitionVariableNames>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessDefinitionVariableNames({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchProcessDefinitionVariableNames', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessInstanceIncidents(options: Parameters<typeof _searchProcessInstanceIncidents>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessInstanceIncidents>> }): CancelablePromise<_DataOf<typeof _searchProcessInstanceIncidents>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchProcessInstanceIncidents', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRolesForGroup(options: Parameters<typeof _searchRolesForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRolesForGroup>> }): CancelablePromise<_DataOf<typeof _searchRolesForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRolesForGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchRolesForGroup', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRolesForTenant(options: Parameters<typeof _searchRolesForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRolesForTenant>> }): CancelablePromise<_DataOf<typeof _searchRolesForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRolesForTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchRolesForTenant', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForGroup(options: Parameters<typeof _searchUsersForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForGroup>> }): CancelablePromise<_DataOf<typeof _searchUsersForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUsersForGroup', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForRole(options: Parameters<typeof _searchUsersForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForRole>> }): CancelablePromise<_DataOf<typeof _searchUsersForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUsersForRole', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForTenant(options: Parameters<typeof _searchUsersForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForTenant>> }): CancelablePromise<_DataOf<typeof _searchUsersForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUsersForTenant', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTaskAuditLogs(options: Parameters<typeof _searchUserTaskAuditLogs>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTaskAuditLogs>> }): CancelablePromise<_DataOf<typeof _searchUserTaskAuditLogs>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTaskAuditLogs({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUserTaskAuditLogs', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTaskEffectiveVariables(options: Parameters<typeof _searchUserTaskEffectiveVariables>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTaskEffectiveVariables>> }): CancelablePromise<_DataOf<typeof _searchUserTaskEffectiveVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTaskEffectiveVariables({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUserTaskEffectiveVariables', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTaskVariables(options: Parameters<typeof _searchUserTaskVariables>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTaskVariables>> }): CancelablePromise<_DataOf<typeof _searchUserTaskVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTaskVariables({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchUserTaskVariables', false, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchVariables(options: Parameters<typeof _searchVariables>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchVariables>> }): CancelablePromise<_DataOf<typeof _searchVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchVariables({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
  return eventualPoll('searchVariables', false, invoke, ec.consistency);
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
export function suspendBatchOperation(options?: Parameters<typeof _suspendBatchOperation>[0]): CancelablePromise<_DataOf<typeof _suspendBatchOperation>> {
  return toCancelable(signal => _suspendBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
}

/**
 * Suspend process instance
 *
 * Suspends a running process instance, pausing further processing until it is resumed.
 * Only process instances in the ACTIVE state can be suspended.
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
export function suspendProcessInstance(options?: Parameters<typeof _suspendProcessInstance>[0]): CancelablePromise<_DataOf<typeof _suspendProcessInstance>> {
  return toCancelable(signal => _suspendProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function syncRuntimeBackupState(options?: Parameters<typeof _syncRuntimeBackupState>[0]): CancelablePromise<_DataOf<typeof _syncRuntimeBackupState>> {
  return toCancelable(signal => _syncRuntimeBackupState({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function syncRuntimeBackupStateAsClusterAdmin(options?: Parameters<typeof _syncRuntimeBackupStateAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _syncRuntimeBackupStateAsClusterAdmin>> {
  return toCancelable(signal => _syncRuntimeBackupStateAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function takeHistoryBackupAsClusterAdmin(options?: Parameters<typeof _takeHistoryBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _takeHistoryBackupAsClusterAdmin>> {
  return toCancelable(signal => _takeHistoryBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function takeRuntimeBackupAsClusterAdmin(options?: Parameters<typeof _takeRuntimeBackupAsClusterAdmin>[0]): CancelablePromise<_DataOf<typeof _takeRuntimeBackupAsClusterAdmin>> {
  return toCancelable(signal => _takeRuntimeBackupAsClusterAdmin({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function throwJobError(options?: Parameters<typeof _throwJobError>[0]): CancelablePromise<_DataOf<typeof _throwJobError>> {
  return toCancelable(signal => _throwJobError({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function triggerClusterRebalance(options?: Parameters<typeof _triggerClusterRebalance>[0]): CancelablePromise<_DataOf<typeof _triggerClusterRebalance>> {
  return toCancelable(signal => _triggerClusterRebalance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignClientFromGroup(options?: Parameters<typeof _unassignClientFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromGroup>> {
  return toCancelable(signal => _unassignClientFromGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignClientFromTenant(options?: Parameters<typeof _unassignClientFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromTenant>> {
  return toCancelable(signal => _unassignClientFromTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignGroupFromTenant(options?: Parameters<typeof _unassignGroupFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignGroupFromTenant>> {
  return toCancelable(signal => _unassignGroupFromTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignMappingRuleFromGroup(options?: Parameters<typeof _unassignMappingRuleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromGroup>> {
  return toCancelable(signal => _unassignMappingRuleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignMappingRuleFromTenant(options?: Parameters<typeof _unassignMappingRuleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromTenant>> {
  return toCancelable(signal => _unassignMappingRuleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignRoleFromClient(options?: Parameters<typeof _unassignRoleFromClient>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromClient>> {
  return toCancelable(signal => _unassignRoleFromClient({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignRoleFromGroup(options?: Parameters<typeof _unassignRoleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromGroup>> {
  return toCancelable(signal => _unassignRoleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignRoleFromMappingRule(options?: Parameters<typeof _unassignRoleFromMappingRule>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromMappingRule>> {
  return toCancelable(signal => _unassignRoleFromMappingRule({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignRoleFromTenant(options?: Parameters<typeof _unassignRoleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromTenant>> {
  return toCancelable(signal => _unassignRoleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignRoleFromUser(options?: Parameters<typeof _unassignRoleFromUser>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromUser>> {
  return toCancelable(signal => _unassignRoleFromUser({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignUserFromGroup(options?: Parameters<typeof _unassignUserFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromGroup>> {
  return toCancelable(signal => _unassignUserFromGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignUserFromTenant(options?: Parameters<typeof _unassignUserFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromTenant>> {
  return toCancelable(signal => _unassignUserFromTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function unassignUserTask(options?: Parameters<typeof _unassignUserTask>[0]): CancelablePromise<_DataOf<typeof _unassignUserTask>> {
  return toCancelable(signal => _unassignUserTask({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
 *   jobLease: string
 * ) {
 *   const camunda = createCamundaClient();
 * 
 *   await camunda.updateAgentInstance({
 *     agentInstanceKey,
 *     elementInstanceKey,
 *     jobKey,
 *     jobLease,
 *     status: 'THINKING',
 *     history: [
 *       {
 *         historyItemId: 'assistant-1',
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
export function updateAgentInstance(options?: Parameters<typeof _updateAgentInstance>[0]): CancelablePromise<_DataOf<typeof _updateAgentInstance>> {
  return toCancelable(signal => _updateAgentInstance({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateAuthorization(options?: Parameters<typeof _updateAuthorization>[0]): CancelablePromise<_DataOf<typeof _updateAuthorization>> {
  return toCancelable(signal => _updateAuthorization({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateGlobalClusterVariable(options?: Parameters<typeof _updateGlobalClusterVariable>[0]): CancelablePromise<_DataOf<typeof _updateGlobalClusterVariable>> {
  return toCancelable(signal => _updateGlobalClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateGlobalTaskListener(options?: Parameters<typeof _updateGlobalTaskListener>[0]): CancelablePromise<_DataOf<typeof _updateGlobalTaskListener>> {
  return toCancelable(signal => _updateGlobalTaskListener({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateGroup(options?: Parameters<typeof _updateGroup>[0]): CancelablePromise<_DataOf<typeof _updateGroup>> {
  return toCancelable(signal => _updateGroup({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateJob(options?: Parameters<typeof _updateJob>[0]): CancelablePromise<_DataOf<typeof _updateJob>> {
  return toCancelable(signal => _updateJob({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateMappingRule(options?: Parameters<typeof _updateMappingRule>[0]): CancelablePromise<_DataOf<typeof _updateMappingRule>> {
  return toCancelable(signal => _updateMappingRule({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateRole(options?: Parameters<typeof _updateRole>[0]): CancelablePromise<_DataOf<typeof _updateRole>> {
  return toCancelable(signal => _updateRole({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateTenant(options?: Parameters<typeof _updateTenant>[0]): CancelablePromise<_DataOf<typeof _updateTenant>> {
  return toCancelable(signal => _updateTenant({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateTenantClusterVariable(options?: Parameters<typeof _updateTenantClusterVariable>[0]): CancelablePromise<_DataOf<typeof _updateTenantClusterVariable>> {
  return toCancelable(signal => _updateTenantClusterVariable({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateUser(options?: Parameters<typeof _updateUser>[0]): CancelablePromise<_DataOf<typeof _updateUser>> {
  return toCancelable(signal => _updateUser({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
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
export function updateUserTask(options?: Parameters<typeof _updateUserTask>[0]): CancelablePromise<_DataOf<typeof _updateUserTask>> {
  return toCancelable(signal => _updateUserTask({ ...(options||{}), signal } as any).then((r:any)=> (r as any).data));
}

// SENTINEL_FACADE_PREWRITE hash=33578edfe2a47666 totalWrappers=243 elements=1503 physicalLines=3883
