// @generated ergonomic operation wrappers
// DO NOT EDIT MANUALLY – run npm run generate
import { /* underlying */ activateAdHocSubProcessActivities as _activateAdHocSubProcessActivities, activateJobs as _activateJobs, assignClientToGroup as _assignClientToGroup, assignClientToTenant as _assignClientToTenant, assignGroupToTenant as _assignGroupToTenant, assignMappingRuleToGroup as _assignMappingRuleToGroup, assignMappingRuleToTenant as _assignMappingRuleToTenant, assignRoleToClient as _assignRoleToClient, assignRoleToGroup as _assignRoleToGroup, assignRoleToMappingRule as _assignRoleToMappingRule, assignRoleToTenant as _assignRoleToTenant, assignRoleToUser as _assignRoleToUser, assignUserTask as _assignUserTask, assignUserToGroup as _assignUserToGroup, assignUserToTenant as _assignUserToTenant, broadcastSignal as _broadcastSignal, cancelBatchOperation as _cancelBatchOperation, cancelProcessInstance as _cancelProcessInstance, cancelProcessInstancesBatchOperation as _cancelProcessInstancesBatchOperation, completeJob as _completeJob, completeUserTask as _completeUserTask, correlateMessage as _correlateMessage, createAdminUser as _createAdminUser, createAuthorization as _createAuthorization, createDeployment as _createDeployment, createDocument as _createDocument, createDocumentLink as _createDocumentLink, createDocuments as _createDocuments, createElementInstanceVariables as _createElementInstanceVariables, createGroup as _createGroup, createMappingRule as _createMappingRule, createProcessInstance as _createProcessInstance, createRole as _createRole, createTenant as _createTenant, createUser as _createUser, deleteAuthorization as _deleteAuthorization, deleteDocument as _deleteDocument, deleteGroup as _deleteGroup, deleteMappingRule as _deleteMappingRule, deleteResource as _deleteResource, deleteRole as _deleteRole, deleteTenant as _deleteTenant, deleteUser as _deleteUser, evaluateDecision as _evaluateDecision, failJob as _failJob, getAuthentication as _getAuthentication, getAuthorization as _getAuthorization, getBatchOperation as _getBatchOperation, getDecisionDefinition as _getDecisionDefinition, getDecisionDefinitionXml as _getDecisionDefinitionXml, getDecisionInstance as _getDecisionInstance, getDecisionRequirements as _getDecisionRequirements, getDecisionRequirementsXml as _getDecisionRequirementsXml, getDocument as _getDocument, getElementInstance as _getElementInstance, getGroup as _getGroup, getIncident as _getIncident, getLicense as _getLicense, getMappingRule as _getMappingRule, getProcessDefinition as _getProcessDefinition, getProcessDefinitionStatistics as _getProcessDefinitionStatistics, getProcessDefinitionXml as _getProcessDefinitionXml, getProcessInstance as _getProcessInstance, getProcessInstanceCallHierarchy as _getProcessInstanceCallHierarchy, getProcessInstanceSequenceFlows as _getProcessInstanceSequenceFlows, getProcessInstanceStatistics as _getProcessInstanceStatistics, getResource as _getResource, getResourceContent as _getResourceContent, getRole as _getRole, getStartProcessForm as _getStartProcessForm, getStatus as _getStatus, getTenant as _getTenant, getTopology as _getTopology, getUsageMetrics as _getUsageMetrics, getUser as _getUser, getUserTask as _getUserTask, getUserTaskForm as _getUserTaskForm, getVariable as _getVariable, migrateProcessInstance as _migrateProcessInstance, migrateProcessInstancesBatchOperation as _migrateProcessInstancesBatchOperation, modifyProcessInstance as _modifyProcessInstance, modifyProcessInstancesBatchOperation as _modifyProcessInstancesBatchOperation, pinClock as _pinClock, publishMessage as _publishMessage, resetClock as _resetClock, resolveIncident as _resolveIncident, resolveIncidentsBatchOperation as _resolveIncidentsBatchOperation, resumeBatchOperation as _resumeBatchOperation, searchAuthorizations as _searchAuthorizations, searchBatchOperationItems as _searchBatchOperationItems, searchBatchOperations as _searchBatchOperations, searchClientsForGroup as _searchClientsForGroup, searchClientsForRole as _searchClientsForRole, searchClientsForTenant as _searchClientsForTenant, searchCorrelatedMessageSubscriptions as _searchCorrelatedMessageSubscriptions, searchDecisionDefinitions as _searchDecisionDefinitions, searchDecisionInstances as _searchDecisionInstances, searchDecisionRequirements as _searchDecisionRequirements, searchElementInstances as _searchElementInstances, searchGroupIdsForTenant as _searchGroupIdsForTenant, searchGroups as _searchGroups, searchGroupsForRole as _searchGroupsForRole, searchIncidents as _searchIncidents, searchJobs as _searchJobs, searchMappingRule as _searchMappingRule, searchMappingRulesForGroup as _searchMappingRulesForGroup, searchMappingRulesForRole as _searchMappingRulesForRole, searchMappingRulesForTenant as _searchMappingRulesForTenant, searchMessageSubscriptions as _searchMessageSubscriptions, searchProcessDefinitions as _searchProcessDefinitions, searchProcessInstanceIncidents as _searchProcessInstanceIncidents, searchProcessInstances as _searchProcessInstances, searchRoles as _searchRoles, searchRolesForGroup as _searchRolesForGroup, searchRolesForTenant as _searchRolesForTenant, searchTenants as _searchTenants, searchUsers as _searchUsers, searchUsersForGroup as _searchUsersForGroup, searchUsersForRole as _searchUsersForRole, searchUsersForTenant as _searchUsersForTenant, searchUserTasks as _searchUserTasks, searchUserTaskVariables as _searchUserTaskVariables, searchVariables as _searchVariables, suspendBatchOperation as _suspendBatchOperation, throwJobError as _throwJobError, unassignClientFromGroup as _unassignClientFromGroup, unassignClientFromTenant as _unassignClientFromTenant, unassignGroupFromTenant as _unassignGroupFromTenant, unassignMappingRuleFromGroup as _unassignMappingRuleFromGroup, unassignMappingRuleFromTenant as _unassignMappingRuleFromTenant, unassignRoleFromClient as _unassignRoleFromClient, unassignRoleFromGroup as _unassignRoleFromGroup, unassignRoleFromMappingRule as _unassignRoleFromMappingRule, unassignRoleFromTenant as _unassignRoleFromTenant, unassignRoleFromUser as _unassignRoleFromUser, unassignUserFromGroup as _unassignUserFromGroup, unassignUserFromTenant as _unassignUserFromTenant, unassignUserTask as _unassignUserTask, updateAuthorization as _updateAuthorization, updateGroup as _updateGroup, updateJob as _updateJob, updateMappingRule as _updateMappingRule, updateRole as _updateRole, updateTenant as _updateTenant, updateUser as _updateUser, updateUserTask as _updateUserTask } from '../gen/sdk.gen';
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

type _activateJobs_Options = Parameters<typeof _activateJobs>[0];
type _activateJobs_MaybeBody = _activateJobs_Options extends { body?: infer B } ? B : never;
type _activateJobs_Body = [ _activateJobs_MaybeBody ] extends [never] ? unknown : _activateJobs_MaybeBody;
/**
 * Activate jobs
 * Iterate through all known partitions and activate jobs up to the requested maximum.
 *
  *
 * @operationId activateJobs
 * @tags Job
 */
export function activateJobs(body: _activateJobs_Body): CancelablePromise<_DataOf<typeof _activateJobs>> {
  return toCancelable(signal => _activateJobs({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _broadcastSignal_Options = Parameters<typeof _broadcastSignal>[0];
type _broadcastSignal_MaybeBody = _broadcastSignal_Options extends { body?: infer B } ? B : never;
type _broadcastSignal_Body = [ _broadcastSignal_MaybeBody ] extends [never] ? unknown : _broadcastSignal_MaybeBody;
/**
 * Broadcast signal
 * Broadcasts a signal.
  *
 * @operationId broadcastSignal
 * @tags Signal
 */
export function broadcastSignal(body: _broadcastSignal_Body): CancelablePromise<_DataOf<typeof _broadcastSignal>> {
  return toCancelable(signal => _broadcastSignal({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _cancelProcessInstancesBatchOperation_Options = Parameters<typeof _cancelProcessInstancesBatchOperation>[0];
type _cancelProcessInstancesBatchOperation_MaybeBody = _cancelProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _cancelProcessInstancesBatchOperation_Body = [ _cancelProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _cancelProcessInstancesBatchOperation_MaybeBody;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function cancelProcessInstancesBatchOperation(body: _cancelProcessInstancesBatchOperation_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _cancelProcessInstancesBatchOperation>> }): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _cancelProcessInstancesBatchOperation({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('cancelProcessInstancesBatchOperation', false, invoke, ec.consistency);
}

type _correlateMessage_Options = Parameters<typeof _correlateMessage>[0];
type _correlateMessage_MaybeBody = _correlateMessage_Options extends { body?: infer B } ? B : never;
type _correlateMessage_Body = [ _correlateMessage_MaybeBody ] extends [never] ? unknown : _correlateMessage_MaybeBody;
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
export function correlateMessage(body: _correlateMessage_Body): CancelablePromise<_DataOf<typeof _correlateMessage>> {
  return toCancelable(signal => _correlateMessage({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createAdminUser_Options = Parameters<typeof _createAdminUser>[0];
type _createAdminUser_MaybeBody = _createAdminUser_Options extends { body?: infer B } ? B : never;
type _createAdminUser_Body = [ _createAdminUser_MaybeBody ] extends [never] ? unknown : _createAdminUser_MaybeBody;
/**
 * Create admin user
 * Creates a new user and assigns the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
  *
 * @operationId createAdminUser
 * @tags Setup
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function createAdminUser(body: _createAdminUser_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _createAdminUser>> }): CancelablePromise<_DataOf<typeof _createAdminUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _createAdminUser({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('createAdminUser', false, invoke, ec.consistency);
}

type _createAuthorization_Options = Parameters<typeof _createAuthorization>[0];
type _createAuthorization_MaybeBody = _createAuthorization_Options extends { body?: infer B } ? B : never;
type _createAuthorization_Body = [ _createAuthorization_MaybeBody ] extends [never] ? unknown : _createAuthorization_MaybeBody;
/**
 * Create authorization
 * Create the authorization.
  *
 * @operationId createAuthorization
 * @tags Authorization
 */
export function createAuthorization(body: _createAuthorization_Body): CancelablePromise<_DataOf<typeof _createAuthorization>> {
  return toCancelable(signal => _createAuthorization({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createDeployment_Options = Parameters<typeof _createDeployment>[0];
type _createDeployment_MaybeBody = _createDeployment_Options extends { body?: infer B } ? B : never;
type _createDeployment_Body = [ _createDeployment_MaybeBody ] extends [never] ? unknown : _createDeployment_MaybeBody;
/**
 * Deploy resources
 * Deploys one or more resources (e.g. processes, decision models, or forms).
 * This is an atomic call, i.e. either all resources are deployed or none of them are.
 *
  *
 * @operationId createDeployment
 * @tags Resource
 */
export function createDeployment(body: _createDeployment_Body): CancelablePromise<_DataOf<typeof _createDeployment>> {
  return toCancelable(signal => _createDeployment({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createGroup_Options = Parameters<typeof _createGroup>[0];
type _createGroup_MaybeBody = _createGroup_Options extends { body?: infer B } ? B : never;
type _createGroup_Body = [ _createGroup_MaybeBody ] extends [never] ? unknown : _createGroup_MaybeBody;
/**
 * Create group
 * Create a new group.
 *
  *
 * @operationId createGroup
 * @tags Group
 */
export function createGroup(body: _createGroup_Body): CancelablePromise<_DataOf<typeof _createGroup>> {
  return toCancelable(signal => _createGroup({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createMappingRule_Options = Parameters<typeof _createMappingRule>[0];
type _createMappingRule_MaybeBody = _createMappingRule_Options extends { body?: infer B } ? B : never;
type _createMappingRule_Body = [ _createMappingRule_MaybeBody ] extends [never] ? unknown : _createMappingRule_MaybeBody;
/**
 * Create mapping rule
 * Create a new mapping rule
 *
  *
 * @operationId createMappingRule
 * @tags Mapping rule
 */
export function createMappingRule(body: _createMappingRule_Body): CancelablePromise<_DataOf<typeof _createMappingRule>> {
  return toCancelable(signal => _createMappingRule({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createProcessInstance_Options = Parameters<typeof _createProcessInstance>[0];
type _createProcessInstance_MaybeBody = _createProcessInstance_Options extends { body?: infer B } ? B : never;
type _createProcessInstance_Body = [ _createProcessInstance_MaybeBody ] extends [never] ? unknown : _createProcessInstance_MaybeBody;
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
export function createProcessInstance(body: _createProcessInstance_Body): CancelablePromise<_DataOf<typeof _createProcessInstance>> {
  return toCancelable(signal => _createProcessInstance({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createRole_Options = Parameters<typeof _createRole>[0];
type _createRole_MaybeBody = _createRole_Options extends { body?: infer B } ? B : never;
type _createRole_Body = [ _createRole_MaybeBody ] extends [never] ? unknown : _createRole_MaybeBody;
/**
 * Create role
 * Create a new role.
 *
  *
 * @operationId createRole
 * @tags Role
 */
export function createRole(body: _createRole_Body): CancelablePromise<_DataOf<typeof _createRole>> {
  return toCancelable(signal => _createRole({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createTenant_Options = Parameters<typeof _createTenant>[0];
type _createTenant_MaybeBody = _createTenant_Options extends { body?: infer B } ? B : never;
type _createTenant_Body = [ _createTenant_MaybeBody ] extends [never] ? unknown : _createTenant_MaybeBody;
/**
 * Create tenant
 * Creates a new tenant.
  *
 * @operationId createTenant
 * @tags Tenant
 */
export function createTenant(body: _createTenant_Body): CancelablePromise<_DataOf<typeof _createTenant>> {
  return toCancelable(signal => _createTenant({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _createUser_Options = Parameters<typeof _createUser>[0];
type _createUser_MaybeBody = _createUser_Options extends { body?: infer B } ? B : never;
type _createUser_Body = [ _createUser_MaybeBody ] extends [never] ? unknown : _createUser_MaybeBody;
/**
 * Create user
 * Create a new user.
  *
 * @operationId createUser
 * @tags User
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function createUser(body: _createUser_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _createUser>> }): CancelablePromise<_DataOf<typeof _createUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _createUser({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('createUser', false, invoke, ec.consistency);
}

type _evaluateDecision_Options = Parameters<typeof _evaluateDecision>[0];
type _evaluateDecision_MaybeBody = _evaluateDecision_Options extends { body?: infer B } ? B : never;
type _evaluateDecision_Body = [ _evaluateDecision_MaybeBody ] extends [never] ? unknown : _evaluateDecision_MaybeBody;
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
export function evaluateDecision(body: _evaluateDecision_Body): CancelablePromise<_DataOf<typeof _evaluateDecision>> {
  return toCancelable(signal => _evaluateDecision({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _migrateProcessInstancesBatchOperation_Options = Parameters<typeof _migrateProcessInstancesBatchOperation>[0];
type _migrateProcessInstancesBatchOperation_MaybeBody = _migrateProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _migrateProcessInstancesBatchOperation_Body = [ _migrateProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _migrateProcessInstancesBatchOperation_MaybeBody;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function migrateProcessInstancesBatchOperation(body: _migrateProcessInstancesBatchOperation_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _migrateProcessInstancesBatchOperation>> }): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _migrateProcessInstancesBatchOperation({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('migrateProcessInstancesBatchOperation', false, invoke, ec.consistency);
}

type _modifyProcessInstancesBatchOperation_Options = Parameters<typeof _modifyProcessInstancesBatchOperation>[0];
type _modifyProcessInstancesBatchOperation_MaybeBody = _modifyProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _modifyProcessInstancesBatchOperation_Body = [ _modifyProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _modifyProcessInstancesBatchOperation_MaybeBody;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function modifyProcessInstancesBatchOperation(body: _modifyProcessInstancesBatchOperation_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _modifyProcessInstancesBatchOperation>> }): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _modifyProcessInstancesBatchOperation({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('modifyProcessInstancesBatchOperation', false, invoke, ec.consistency);
}

type _pinClock_Options = Parameters<typeof _pinClock>[0];
type _pinClock_MaybeBody = _pinClock_Options extends { body?: infer B } ? B : never;
type _pinClock_Body = [ _pinClock_MaybeBody ] extends [never] ? unknown : _pinClock_MaybeBody;
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
export function pinClock(body: _pinClock_Body): CancelablePromise<_DataOf<typeof _pinClock>> {
  return toCancelable(signal => _pinClock({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _publishMessage_Options = Parameters<typeof _publishMessage>[0];
type _publishMessage_MaybeBody = _publishMessage_Options extends { body?: infer B } ? B : never;
type _publishMessage_Body = [ _publishMessage_MaybeBody ] extends [never] ? unknown : _publishMessage_MaybeBody;
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
export function publishMessage(body: _publishMessage_Body): CancelablePromise<_DataOf<typeof _publishMessage>> {
  return toCancelable(signal => _publishMessage({ body, signal } as any).then((r:any)=> r?.data ?? r));
}

type _resolveIncidentsBatchOperation_Options = Parameters<typeof _resolveIncidentsBatchOperation>[0];
type _resolveIncidentsBatchOperation_MaybeBody = _resolveIncidentsBatchOperation_Options extends { body?: infer B } ? B : never;
type _resolveIncidentsBatchOperation_Body = [ _resolveIncidentsBatchOperation_MaybeBody ] extends [never] ? unknown : _resolveIncidentsBatchOperation_MaybeBody;
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function resolveIncidentsBatchOperation(body: _resolveIncidentsBatchOperation_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _resolveIncidentsBatchOperation>> }): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _resolveIncidentsBatchOperation({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('resolveIncidentsBatchOperation', false, invoke, ec.consistency);
}

type _searchAuthorizations_Options = Parameters<typeof _searchAuthorizations>[0];
type _searchAuthorizations_MaybeBody = _searchAuthorizations_Options extends { body?: infer B } ? B : never;
type _searchAuthorizations_Body = [ _searchAuthorizations_MaybeBody ] extends [never] ? unknown : _searchAuthorizations_MaybeBody;
/**
 * Search authorizations
 * Search for authorizations based on given criteria.
 *
  *
 * @operationId searchAuthorizations
 * @tags Authorization
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchAuthorizations(body: _searchAuthorizations_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchAuthorizations>> }): CancelablePromise<_DataOf<typeof _searchAuthorizations>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchAuthorizations({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchAuthorizations', false, invoke, ec.consistency);
}

type _searchBatchOperationItems_Options = Parameters<typeof _searchBatchOperationItems>[0];
type _searchBatchOperationItems_MaybeBody = _searchBatchOperationItems_Options extends { body?: infer B } ? B : never;
type _searchBatchOperationItems_Body = [ _searchBatchOperationItems_MaybeBody ] extends [never] ? unknown : _searchBatchOperationItems_MaybeBody;
/**
 * Search batch operation items
 * Search for batch operation items based on given criteria.
  *
 * @operationId searchBatchOperationItems
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchBatchOperationItems(body: _searchBatchOperationItems_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchBatchOperationItems>> }): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchBatchOperationItems({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchBatchOperationItems', false, invoke, ec.consistency);
}

type _searchBatchOperations_Options = Parameters<typeof _searchBatchOperations>[0];
type _searchBatchOperations_MaybeBody = _searchBatchOperations_Options extends { body?: infer B } ? B : never;
type _searchBatchOperations_Body = [ _searchBatchOperations_MaybeBody ] extends [never] ? unknown : _searchBatchOperations_MaybeBody;
/**
 * Search batch operations
 * Search for batch operations based on given criteria.
  *
 * @operationId searchBatchOperations
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchBatchOperations(body: _searchBatchOperations_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchBatchOperations>> }): CancelablePromise<_DataOf<typeof _searchBatchOperations>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchBatchOperations({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchBatchOperations', false, invoke, ec.consistency);
}

type _searchCorrelatedMessageSubscriptions_Options = Parameters<typeof _searchCorrelatedMessageSubscriptions>[0];
type _searchCorrelatedMessageSubscriptions_MaybeBody = _searchCorrelatedMessageSubscriptions_Options extends { body?: infer B } ? B : never;
type _searchCorrelatedMessageSubscriptions_Body = [ _searchCorrelatedMessageSubscriptions_MaybeBody ] extends [never] ? unknown : _searchCorrelatedMessageSubscriptions_MaybeBody;
/**
 * Search correlated message subscriptions
 * Search correlated message subscriptions based on given criteria.
  *
 * @operationId searchCorrelatedMessageSubscriptions
 * @tags Message subscription
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchCorrelatedMessageSubscriptions(body: _searchCorrelatedMessageSubscriptions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchCorrelatedMessageSubscriptions>> }): CancelablePromise<_DataOf<typeof _searchCorrelatedMessageSubscriptions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchCorrelatedMessageSubscriptions({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchCorrelatedMessageSubscriptions', false, invoke, ec.consistency);
}

type _searchDecisionDefinitions_Options = Parameters<typeof _searchDecisionDefinitions>[0];
type _searchDecisionDefinitions_MaybeBody = _searchDecisionDefinitions_Options extends { body?: infer B } ? B : never;
type _searchDecisionDefinitions_Body = [ _searchDecisionDefinitions_MaybeBody ] extends [never] ? unknown : _searchDecisionDefinitions_MaybeBody;
/**
 * Search decision definitions
 * Search for decision definitions based on given criteria.
 *
  *
 * @operationId searchDecisionDefinitions
 * @tags Decision definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionDefinitions(body: _searchDecisionDefinitions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionDefinitions>> }): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionDefinitions({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchDecisionDefinitions', false, invoke, ec.consistency);
}

type _searchDecisionInstances_Options = Parameters<typeof _searchDecisionInstances>[0];
type _searchDecisionInstances_MaybeBody = _searchDecisionInstances_Options extends { body?: infer B } ? B : never;
type _searchDecisionInstances_Body = [ _searchDecisionInstances_MaybeBody ] extends [never] ? unknown : _searchDecisionInstances_MaybeBody;
/**
 * Search decision instances
 * Search for decision instances based on given criteria.
 *
  *
 * @operationId searchDecisionInstances
 * @tags Decision instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionInstances(body: _searchDecisionInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionInstances>> }): CancelablePromise<_DataOf<typeof _searchDecisionInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionInstances({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchDecisionInstances', false, invoke, ec.consistency);
}

type _searchDecisionRequirements_Options = Parameters<typeof _searchDecisionRequirements>[0];
type _searchDecisionRequirements_MaybeBody = _searchDecisionRequirements_Options extends { body?: infer B } ? B : never;
type _searchDecisionRequirements_Body = [ _searchDecisionRequirements_MaybeBody ] extends [never] ? unknown : _searchDecisionRequirements_MaybeBody;
/**
 * Search decision requirements
 * Search for decision requirements based on given criteria.
 *
  *
 * @operationId searchDecisionRequirements
 * @tags Decision requirements
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchDecisionRequirements(body: _searchDecisionRequirements_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchDecisionRequirements>> }): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchDecisionRequirements({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchDecisionRequirements', false, invoke, ec.consistency);
}

type _searchElementInstances_Options = Parameters<typeof _searchElementInstances>[0];
type _searchElementInstances_MaybeBody = _searchElementInstances_Options extends { body?: infer B } ? B : never;
type _searchElementInstances_Body = [ _searchElementInstances_MaybeBody ] extends [never] ? unknown : _searchElementInstances_MaybeBody;
/**
 * Search element instances
 * Search for element instances based on given criteria.
 *
  *
 * @operationId searchElementInstances
 * @tags Element instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchElementInstances(body: _searchElementInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchElementInstances>> }): CancelablePromise<_DataOf<typeof _searchElementInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchElementInstances({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchElementInstances', false, invoke, ec.consistency);
}

type _searchGroups_Options = Parameters<typeof _searchGroups>[0];
type _searchGroups_MaybeBody = _searchGroups_Options extends { body?: infer B } ? B : never;
type _searchGroups_Body = [ _searchGroups_MaybeBody ] extends [never] ? unknown : _searchGroups_MaybeBody;
/**
 * Search groups
 * Search for groups based on given criteria.
 *
  *
 * @operationId searchGroups
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroups(body: _searchGroups_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroups>> }): CancelablePromise<_DataOf<typeof _searchGroups>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroups({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchGroups', false, invoke, ec.consistency);
}

type _searchIncidents_Options = Parameters<typeof _searchIncidents>[0];
type _searchIncidents_MaybeBody = _searchIncidents_Options extends { body?: infer B } ? B : never;
type _searchIncidents_Body = [ _searchIncidents_MaybeBody ] extends [never] ? unknown : _searchIncidents_MaybeBody;
/**
 * Search incidents
 * Search for incidents based on given criteria.
 *
  *
 * @operationId searchIncidents
 * @tags Incident
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchIncidents(body: _searchIncidents_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchIncidents>> }): CancelablePromise<_DataOf<typeof _searchIncidents>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchIncidents({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchIncidents', false, invoke, ec.consistency);
}

type _searchJobs_Options = Parameters<typeof _searchJobs>[0];
type _searchJobs_MaybeBody = _searchJobs_Options extends { body?: infer B } ? B : never;
type _searchJobs_Body = [ _searchJobs_MaybeBody ] extends [never] ? unknown : _searchJobs_MaybeBody;
/**
 * Search jobs
 * Search for jobs based on given criteria.
  *
 * @operationId searchJobs
 * @tags Job
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchJobs(body: _searchJobs_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchJobs>> }): CancelablePromise<_DataOf<typeof _searchJobs>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchJobs({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchJobs', false, invoke, ec.consistency);
}

type _searchMappingRule_Options = Parameters<typeof _searchMappingRule>[0];
type _searchMappingRule_MaybeBody = _searchMappingRule_Options extends { body?: infer B } ? B : never;
type _searchMappingRule_Body = [ _searchMappingRule_MaybeBody ] extends [never] ? unknown : _searchMappingRule_MaybeBody;
/**
 * Search mapping rules
 * Search for mapping rules based on given criteria.
 *
  *
 * @operationId searchMappingRule
 * @tags Mapping rule
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRule(body: _searchMappingRule_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRule>> }): CancelablePromise<_DataOf<typeof _searchMappingRule>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRule({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchMappingRule', false, invoke, ec.consistency);
}

type _searchMessageSubscriptions_Options = Parameters<typeof _searchMessageSubscriptions>[0];
type _searchMessageSubscriptions_MaybeBody = _searchMessageSubscriptions_Options extends { body?: infer B } ? B : never;
type _searchMessageSubscriptions_Body = [ _searchMessageSubscriptions_MaybeBody ] extends [never] ? unknown : _searchMessageSubscriptions_MaybeBody;
/**
 * Search message subscriptions
 * Search for message subscriptions based on given criteria.
 *
  *
 * @operationId searchMessageSubscriptions
 * @tags Message subscription
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMessageSubscriptions(body: _searchMessageSubscriptions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMessageSubscriptions>> }): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMessageSubscriptions({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchMessageSubscriptions', false, invoke, ec.consistency);
}

type _searchProcessDefinitions_Options = Parameters<typeof _searchProcessDefinitions>[0];
type _searchProcessDefinitions_MaybeBody = _searchProcessDefinitions_Options extends { body?: infer B } ? B : never;
type _searchProcessDefinitions_Body = [ _searchProcessDefinitions_MaybeBody ] extends [never] ? unknown : _searchProcessDefinitions_MaybeBody;
/**
 * Search process definitions
 * Search for process definitions based on given criteria.
 *
  *
 * @operationId searchProcessDefinitions
 * @tags Process definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessDefinitions(body: _searchProcessDefinitions_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessDefinitions>> }): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessDefinitions({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchProcessDefinitions', false, invoke, ec.consistency);
}

type _searchProcessInstances_Options = Parameters<typeof _searchProcessInstances>[0];
type _searchProcessInstances_MaybeBody = _searchProcessInstances_Options extends { body?: infer B } ? B : never;
type _searchProcessInstances_Body = [ _searchProcessInstances_MaybeBody ] extends [never] ? unknown : _searchProcessInstances_MaybeBody;
/**
 * Search process instances
 * Search for process instances based on given criteria.
 *
  *
 * @operationId searchProcessInstances
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessInstances(body: _searchProcessInstances_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessInstances>> }): CancelablePromise<_DataOf<typeof _searchProcessInstances>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessInstances({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchProcessInstances', false, invoke, ec.consistency);
}

type _searchRoles_Options = Parameters<typeof _searchRoles>[0];
type _searchRoles_MaybeBody = _searchRoles_Options extends { body?: infer B } ? B : never;
type _searchRoles_Body = [ _searchRoles_MaybeBody ] extends [never] ? unknown : _searchRoles_MaybeBody;
/**
 * Search roles
 * Search for roles based on given criteria.
 *
  *
 * @operationId searchRoles
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRoles(body: _searchRoles_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRoles>> }): CancelablePromise<_DataOf<typeof _searchRoles>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRoles({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchRoles', false, invoke, ec.consistency);
}

type _searchTenants_Options = Parameters<typeof _searchTenants>[0];
type _searchTenants_MaybeBody = _searchTenants_Options extends { body?: infer B } ? B : never;
type _searchTenants_Body = [ _searchTenants_MaybeBody ] extends [never] ? unknown : _searchTenants_MaybeBody;
/**
 * Search tenants
 * Retrieves a filtered and sorted list of tenants.
  *
 * @operationId searchTenants
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchTenants(body: _searchTenants_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchTenants>> }): CancelablePromise<_DataOf<typeof _searchTenants>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchTenants({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchTenants', false, invoke, ec.consistency);
}

type _searchUsers_Options = Parameters<typeof _searchUsers>[0];
type _searchUsers_MaybeBody = _searchUsers_Options extends { body?: infer B } ? B : never;
type _searchUsers_Body = [ _searchUsers_MaybeBody ] extends [never] ? unknown : _searchUsers_MaybeBody;
/**
 * Search users
 * Search for users based on given criteria.
 *
  *
 * @operationId searchUsers
 * @tags User
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsers(body: _searchUsers_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsers>> }): CancelablePromise<_DataOf<typeof _searchUsers>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsers({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUsers', false, invoke, ec.consistency);
}

type _searchUserTasks_Options = Parameters<typeof _searchUserTasks>[0];
type _searchUserTasks_MaybeBody = _searchUserTasks_Options extends { body?: infer B } ? B : never;
type _searchUserTasks_Body = [ _searchUserTasks_MaybeBody ] extends [never] ? unknown : _searchUserTasks_MaybeBody;
/**
 * Search user tasks
 * Search for user tasks based on given criteria.
 *
  *
 * @operationId searchUserTasks
 * @tags User task
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTasks(body: _searchUserTasks_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTasks>> }): CancelablePromise<_DataOf<typeof _searchUserTasks>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTasks({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUserTasks', false, invoke, ec.consistency);
}

type _searchVariables_Options = Parameters<typeof _searchVariables>[0];
type _searchVariables_MaybeBody = _searchVariables_Options extends { body?: infer B } ? B : never;
type _searchVariables_Body = [ _searchVariables_MaybeBody ] extends [never] ? unknown : _searchVariables_MaybeBody;
/**
 * Search variables
 * Search for process and local variables based on given criteria.
 *
  *
 * @operationId searchVariables
 * @tags Variable
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchVariables(body: _searchVariables_Body, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchVariables>> }): CancelablePromise<_DataOf<typeof _searchVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchVariables({ body, signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchVariables', false, invoke, ec.consistency);
}

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
export function activateAdHocSubProcessActivities(options?: Parameters<typeof _activateAdHocSubProcessActivities>[0]): CancelablePromise<_DataOf<typeof _activateAdHocSubProcessActivities>> {
  return toCancelable(signal => _activateAdHocSubProcessActivities({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a client to a group
 * Assigns a client to a group, making it a member of the group.
 * Members of the group inherit the group authorizations, roles, and tenant assignments.
 *
  *
 * @operationId assignClientToGroup
 * @tags Group
 */
export function assignClientToGroup(options?: Parameters<typeof _assignClientToGroup>[0]): CancelablePromise<_DataOf<typeof _assignClientToGroup>> {
  return toCancelable(signal => _assignClientToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a client to a tenant
 * Assign the client to the specified tenant.
 * The client can then access tenant data and perform authorized actions.
 *
  *
 * @operationId assignClientToTenant
 * @tags Tenant
 */
export function assignClientToTenant(options?: Parameters<typeof _assignClientToTenant>[0]): CancelablePromise<_DataOf<typeof _assignClientToTenant>> {
  return toCancelable(signal => _assignClientToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a group to a tenant
 * Assigns a group to a specified tenant.
 * Group members (users, clients) can then access tenant data and perform authorized actions.
 *
  *
 * @operationId assignGroupToTenant
 * @tags Tenant
 */
export function assignGroupToTenant(options?: Parameters<typeof _assignGroupToTenant>[0]): CancelablePromise<_DataOf<typeof _assignGroupToTenant>> {
  return toCancelable(signal => _assignGroupToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a mapping rule to a group
 * Assigns a mapping rule to a group.
 *
  *
 * @operationId assignMappingRuleToGroup
 * @tags Group
 */
export function assignMappingRuleToGroup(options?: Parameters<typeof _assignMappingRuleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToGroup>> {
  return toCancelable(signal => _assignMappingRuleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a mapping rule to a tenant
 * Assign a single mapping rule to a specified tenant.
  *
 * @operationId assignMappingRuleToTenant
 * @tags Tenant
 */
export function assignMappingRuleToTenant(options?: Parameters<typeof _assignMappingRuleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToTenant>> {
  return toCancelable(signal => _assignMappingRuleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a client
 * Assigns the specified role to the client.
 * The client will inherit the authorizations associated with this role.
 *
  *
 * @operationId assignRoleToClient
 * @tags Role
 */
export function assignRoleToClient(options?: Parameters<typeof _assignRoleToClient>[0]): CancelablePromise<_DataOf<typeof _assignRoleToClient>> {
  return toCancelable(signal => _assignRoleToClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a group
 * Assigns the specified role to the group.
 * Every member of the group (user or client) will inherit the authorizations associated with this role.
 *
  *
 * @operationId assignRoleToGroup
 * @tags Role
 */
export function assignRoleToGroup(options?: Parameters<typeof _assignRoleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignRoleToGroup>> {
  return toCancelable(signal => _assignRoleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a mapping rule
 * Assigns a role to a mapping rule.
 *
  *
 * @operationId assignRoleToMappingRule
 * @tags Role
 */
export function assignRoleToMappingRule(options?: Parameters<typeof _assignRoleToMappingRule>[0]): CancelablePromise<_DataOf<typeof _assignRoleToMappingRule>> {
  return toCancelable(signal => _assignRoleToMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a tenant
 * Assigns a role to a specified tenant.
 * Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
 *
  *
 * @operationId assignRoleToTenant
 * @tags Tenant
 */
export function assignRoleToTenant(options?: Parameters<typeof _assignRoleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignRoleToTenant>> {
  return toCancelable(signal => _assignRoleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a user
 * Assigns the specified role to the user.
 * The user will inherit the authorizations associated with this role.
 *
  *
 * @operationId assignRoleToUser
 * @tags Role
 */
export function assignRoleToUser(options?: Parameters<typeof _assignRoleToUser>[0]): CancelablePromise<_DataOf<typeof _assignRoleToUser>> {
  return toCancelable(signal => _assignRoleToUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign user task
 * Assigns a user task with the given key to the given assignee.
  *
 * @operationId assignUserTask
 * @tags User task
 */
export function assignUserTask(options?: Parameters<typeof _assignUserTask>[0]): CancelablePromise<_DataOf<typeof _assignUserTask>> {
  return toCancelable(signal => _assignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a user to a group
 * Assigns a user to a group, making the user a member of the group.
 * Group members inherit the group authorizations, roles, and tenant assignments.
 *
  *
 * @operationId assignUserToGroup
 * @tags Group
 */
export function assignUserToGroup(options?: Parameters<typeof _assignUserToGroup>[0]): CancelablePromise<_DataOf<typeof _assignUserToGroup>> {
  return toCancelable(signal => _assignUserToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a user to a tenant
 * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
  *
 * @operationId assignUserToTenant
 * @tags Tenant
 */
export function assignUserToTenant(options?: Parameters<typeof _assignUserToTenant>[0]): CancelablePromise<_DataOf<typeof _assignUserToTenant>> {
  return toCancelable(signal => _assignUserToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Cancel Batch operation
 * Cancels a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId cancelBatchOperation
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function cancelBatchOperation(options: Parameters<typeof _cancelBatchOperation>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _cancelBatchOperation>> }): CancelablePromise<_DataOf<typeof _cancelBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _cancelBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('cancelBatchOperation', false, invoke, ec.consistency);
}

/**
 * Cancel process instance
 * Cancels a running process instance. As a cancelation includes more than just the removal of the process instance resource, the cancelation resource must be posted.
  *
 * @operationId cancelProcessInstance
 * @tags Process instance
 */
export function cancelProcessInstance(options?: Parameters<typeof _cancelProcessInstance>[0]): CancelablePromise<_DataOf<typeof _cancelProcessInstance>> {
  return toCancelable(signal => _cancelProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Complete job
 * Complete a job with the given payload, which allows completing the associated service task.
 *
  *
 * @operationId completeJob
 * @tags Job
 */
export function completeJob(options?: Parameters<typeof _completeJob>[0]): CancelablePromise<_DataOf<typeof _completeJob>> {
  return toCancelable(signal => _completeJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Complete user task
 * Completes a user task with the given key.
  *
 * @operationId completeUserTask
 * @tags User task
 */
export function completeUserTask(options?: Parameters<typeof _completeUserTask>[0]): CancelablePromise<_DataOf<typeof _completeUserTask>> {
  return toCancelable(signal => _completeUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function createDocument(options?: Parameters<typeof _createDocument>[0]): CancelablePromise<_DataOf<typeof _createDocument>> {
  return toCancelable(signal => _createDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function createDocumentLink(options?: Parameters<typeof _createDocumentLink>[0]): CancelablePromise<_DataOf<typeof _createDocumentLink>> {
  return toCancelable(signal => _createDocumentLink({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Upload multiple documents
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
export function createDocuments(options?: Parameters<typeof _createDocuments>[0]): CancelablePromise<_DataOf<typeof _createDocuments>> {
  return toCancelable(signal => _createDocuments({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function createElementInstanceVariables(options?: Parameters<typeof _createElementInstanceVariables>[0]): CancelablePromise<_DataOf<typeof _createElementInstanceVariables>> {
  return toCancelable(signal => _createElementInstanceVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete authorization
 * Deletes the authorization with the given key.
  *
 * @operationId deleteAuthorization
 * @tags Authorization
 */
export function deleteAuthorization(options?: Parameters<typeof _deleteAuthorization>[0]): CancelablePromise<_DataOf<typeof _deleteAuthorization>> {
  return toCancelable(signal => _deleteAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function deleteDocument(options?: Parameters<typeof _deleteDocument>[0]): CancelablePromise<_DataOf<typeof _deleteDocument>> {
  return toCancelable(signal => _deleteDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete group
 * Deletes the group with the given ID.
 *
  *
 * @operationId deleteGroup
 * @tags Group
 */
export function deleteGroup(options?: Parameters<typeof _deleteGroup>[0]): CancelablePromise<_DataOf<typeof _deleteGroup>> {
  return toCancelable(signal => _deleteGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete a mapping rule
 * Deletes the mapping rule with the given ID.
 *
  *
 * @operationId deleteMappingRule
 * @tags Mapping rule
 */
export function deleteMappingRule(options?: Parameters<typeof _deleteMappingRule>[0]): CancelablePromise<_DataOf<typeof _deleteMappingRule>> {
  return toCancelable(signal => _deleteMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function deleteResource(options?: Parameters<typeof _deleteResource>[0]): CancelablePromise<_DataOf<typeof _deleteResource>> {
  return toCancelable(signal => _deleteResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete role
 * Deletes the role with the given ID.
 *
  *
 * @operationId deleteRole
 * @tags Role
 */
export function deleteRole(options?: Parameters<typeof _deleteRole>[0]): CancelablePromise<_DataOf<typeof _deleteRole>> {
  return toCancelable(signal => _deleteRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete tenant
 * Deletes an existing tenant.
  *
 * @operationId deleteTenant
 * @tags Tenant
 */
export function deleteTenant(options?: Parameters<typeof _deleteTenant>[0]): CancelablePromise<_DataOf<typeof _deleteTenant>> {
  return toCancelable(signal => _deleteTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete user
 * Deletes a user.
 *
  *
 * @operationId deleteUser
 * @tags User
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function deleteUser(options: Parameters<typeof _deleteUser>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _deleteUser>> }): CancelablePromise<_DataOf<typeof _deleteUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _deleteUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('deleteUser', false, invoke, ec.consistency);
}

/**
 * Fail job
 * Mark the job as failed
 *
  *
 * @operationId failJob
 * @tags Job
 */
export function failJob(options?: Parameters<typeof _failJob>[0]): CancelablePromise<_DataOf<typeof _failJob>> {
  return toCancelable(signal => _failJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get current user
 * Retrieves the current authenticated user.
  *
 * @operationId getAuthentication
 * @tags Authentication
 */
export function getAuthentication(options?: Parameters<typeof _getAuthentication>[0]): CancelablePromise<_DataOf<typeof _getAuthentication>> {
  return toCancelable(signal => _getAuthentication({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get authorization
 * Get authorization by the given key.
  *
 * @operationId getAuthorization
 * @tags Authorization
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getAuthorization(options: Parameters<typeof _getAuthorization>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getAuthorization>> }): CancelablePromise<_DataOf<typeof _getAuthorization>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getAuthorization', true, invoke, ec.consistency);
}

/**
 * Get batch operation
 * Get batch operation by key.
  *
 * @operationId getBatchOperation
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getBatchOperation(options: Parameters<typeof _getBatchOperation>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getBatchOperation>> }): CancelablePromise<_DataOf<typeof _getBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getBatchOperation', true, invoke, ec.consistency);
}

/**
 * Get decision definition
 * Returns a decision definition by key.
 *
  *
 * @operationId getDecisionDefinition
 * @tags Decision definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionDefinition(options: Parameters<typeof _getDecisionDefinition>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionDefinition>> }): CancelablePromise<_DataOf<typeof _getDecisionDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getDecisionDefinition', true, invoke, ec.consistency);
}

/**
 * Get decision definition XML
 * Returns decision definition as XML.
 *
  *
 * @operationId getDecisionDefinitionXML
 * @tags Decision definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionDefinitionXml(options: Parameters<typeof _getDecisionDefinitionXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionDefinitionXml>> }): CancelablePromise<_DataOf<typeof _getDecisionDefinitionXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getDecisionDefinitionXML', true, invoke, ec.consistency);
}
/** @deprecated Use getDecisionDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionDefinitionXML = getDecisionDefinitionXml;

/**
 * Get decision instance
 * Returns a decision instance.
 *
  *
 * @operationId getDecisionInstance
 * @tags Decision instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionInstance(options: Parameters<typeof _getDecisionInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionInstance>> }): CancelablePromise<_DataOf<typeof _getDecisionInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getDecisionInstance', true, invoke, ec.consistency);
}

/**
 * Get decision requirements
 * Returns Decision Requirements as JSON.
 *
  *
 * @operationId getDecisionRequirements
 * @tags Decision requirements
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionRequirements(options: Parameters<typeof _getDecisionRequirements>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionRequirements>> }): CancelablePromise<_DataOf<typeof _getDecisionRequirements>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionRequirements({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getDecisionRequirements', true, invoke, ec.consistency);
}

/**
 * Get decision requirements XML
 * Returns decision requirements as XML.
 *
  *
 * @operationId getDecisionRequirementsXML
 * @tags Decision requirements
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getDecisionRequirementsXml(options: Parameters<typeof _getDecisionRequirementsXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getDecisionRequirementsXml>> }): CancelablePromise<_DataOf<typeof _getDecisionRequirementsXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getDecisionRequirementsXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getDecisionRequirementsXML', true, invoke, ec.consistency);
}
/** @deprecated Use getDecisionRequirementsXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionRequirementsXML = getDecisionRequirementsXml;

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
export function getDocument(options?: Parameters<typeof _getDocument>[0]): CancelablePromise<_DataOf<typeof _getDocument>> {
  return toCancelable(signal => _getDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get element instance
 * Returns element instance as JSON.
 *
  *
 * @operationId getElementInstance
 * @tags Element instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getElementInstance(options: Parameters<typeof _getElementInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getElementInstance>> }): CancelablePromise<_DataOf<typeof _getElementInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getElementInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getElementInstance', true, invoke, ec.consistency);
}

/**
 * Get group
 * Get a group by its ID.
 *
  *
 * @operationId getGroup
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getGroup(options: Parameters<typeof _getGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getGroup>> }): CancelablePromise<_DataOf<typeof _getGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getGroup', true, invoke, ec.consistency);
}

/**
 * Get incident
 * Returns incident as JSON.
 *
  *
 * @operationId getIncident
 * @tags Incident
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getIncident(options: Parameters<typeof _getIncident>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getIncident>> }): CancelablePromise<_DataOf<typeof _getIncident>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getIncident', true, invoke, ec.consistency);
}

/**
 * Get license status
 * Obtains the status of the current Camunda license.
  *
 * @operationId getLicense
 * @tags License
 */
export function getLicense(options?: Parameters<typeof _getLicense>[0]): CancelablePromise<_DataOf<typeof _getLicense>> {
  return toCancelable(signal => _getLicense({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get a mapping rule
 * Gets the mapping rule with the given ID.
 *
  *
 * @operationId getMappingRule
 * @tags Mapping rule
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getMappingRule(options: Parameters<typeof _getMappingRule>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getMappingRule>> }): CancelablePromise<_DataOf<typeof _getMappingRule>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getMappingRule', true, invoke, ec.consistency);
}

/**
 * Get process definition
 * Returns process definition as JSON.
 *
  *
 * @operationId getProcessDefinition
 * @tags Process definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinition(options: Parameters<typeof _getProcessDefinition>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinition>> }): CancelablePromise<_DataOf<typeof _getProcessDefinition>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessDefinition', true, invoke, ec.consistency);
}

/**
 * Get process definition statistics
 * Get statistics about elements in currently running process instances by process definition key and search filter.
 *
  *
 * @operationId getProcessDefinitionStatistics
 * @tags Process definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionStatistics(options: Parameters<typeof _getProcessDefinitionStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessDefinitionStatistics', false, invoke, ec.consistency);
}

/**
 * Get process definition XML
 * Returns process definition as XML.
 *
  *
 * @operationId getProcessDefinitionXML
 * @tags Process definition
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessDefinitionXml(options: Parameters<typeof _getProcessDefinitionXml>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessDefinitionXml>> }): CancelablePromise<_DataOf<typeof _getProcessDefinitionXml>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessDefinitionXML', true, invoke, ec.consistency);
}
/** @deprecated Use getProcessDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getProcessDefinitionXML = getProcessDefinitionXml;

/**
 * Get process instance
 * Get the process instance by the process instance key.
 *
  *
 * @operationId getProcessInstance
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstance(options: Parameters<typeof _getProcessInstance>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstance>> }): CancelablePromise<_DataOf<typeof _getProcessInstance>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessInstance', true, invoke, ec.consistency);
}

/**
 * Get call hierarchy for process instance
 * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
 *
  *
 * @operationId getProcessInstanceCallHierarchy
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceCallHierarchy(options: Parameters<typeof _getProcessInstanceCallHierarchy>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceCallHierarchy>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceCallHierarchy>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceCallHierarchy({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessInstanceCallHierarchy', true, invoke, ec.consistency);
}

/**
 * Get process instance sequence flows
 * Get sequence flows taken by the process instance.
 *
  *
 * @operationId getProcessInstanceSequenceFlows
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceSequenceFlows(options: Parameters<typeof _getProcessInstanceSequenceFlows>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceSequenceFlows>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceSequenceFlows>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceSequenceFlows({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessInstanceSequenceFlows', true, invoke, ec.consistency);
}

/**
 * Get process instance statistics
 * Get statistics about elements by the process instance key.
 *
  *
 * @operationId getProcessInstanceStatistics
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getProcessInstanceStatistics(options: Parameters<typeof _getProcessInstanceStatistics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getProcessInstanceStatistics>> }): CancelablePromise<_DataOf<typeof _getProcessInstanceStatistics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getProcessInstanceStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getProcessInstanceStatistics', true, invoke, ec.consistency);
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
export function getResource(options?: Parameters<typeof _getResource>[0]): CancelablePromise<_DataOf<typeof _getResource>> {
  return toCancelable(signal => _getResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function getResourceContent(options?: Parameters<typeof _getResourceContent>[0]): CancelablePromise<_DataOf<typeof _getResourceContent>> {
  return toCancelable(signal => _getResourceContent({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get role
 * Get a role by its ID.
 *
  *
 * @operationId getRole
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getRole(options: Parameters<typeof _getRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getRole>> }): CancelablePromise<_DataOf<typeof _getRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getRole', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getStartProcessForm(options: Parameters<typeof _getStartProcessForm>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getStartProcessForm>> }): CancelablePromise<_DataOf<typeof _getStartProcessForm>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getStartProcessForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getStartProcessForm', true, invoke, ec.consistency);
}

/**
 * Get cluster status
 * Checks the health status of the cluster by verifying if there's at least one partition with a healthy leader.
  *
 * @operationId getStatus
 * @tags Cluster
 */
export function getStatus(options?: Parameters<typeof _getStatus>[0]): CancelablePromise<_DataOf<typeof _getStatus>> {
  return toCancelable(signal => _getStatus({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get tenant
 * Retrieves a single tenant by tenant ID.
  *
 * @operationId getTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getTenant(options: Parameters<typeof _getTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getTenant>> }): CancelablePromise<_DataOf<typeof _getTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getTenant', true, invoke, ec.consistency);
}

/**
 * Get cluster topology
 * Obtains the current topology of the cluster the gateway is part of.
  *
 * @operationId getTopology
 * @tags Cluster
 */
export function getTopology(options?: Parameters<typeof _getTopology>[0]): CancelablePromise<_DataOf<typeof _getTopology>> {
  return toCancelable(signal => _getTopology({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get usage metrics
 * Retrieve the usage metrics based on given criteria.
  *
 * @operationId getUsageMetrics
 * @tags System
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUsageMetrics(options: Parameters<typeof _getUsageMetrics>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUsageMetrics>> }): CancelablePromise<_DataOf<typeof _getUsageMetrics>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUsageMetrics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getUsageMetrics', true, invoke, ec.consistency);
}

/**
 * Get user
 * Get a user by its username.
 *
  *
 * @operationId getUser
 * @tags User
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUser(options: Parameters<typeof _getUser>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUser>> }): CancelablePromise<_DataOf<typeof _getUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getUser', true, invoke, ec.consistency);
}

/**
 * Get user task
 * Get the user task by the user task key.
 *
  *
 * @operationId getUserTask
 * @tags User task
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUserTask(options: Parameters<typeof _getUserTask>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUserTask>> }): CancelablePromise<_DataOf<typeof _getUserTask>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getUserTask', true, invoke, ec.consistency);
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
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getUserTaskForm(options: Parameters<typeof _getUserTaskForm>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getUserTaskForm>> }): CancelablePromise<_DataOf<typeof _getUserTaskForm>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getUserTaskForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getUserTaskForm', true, invoke, ec.consistency);
}

/**
 * Get variable
 * Get the variable by the variable key.
 *
  *
 * @operationId getVariable
 * @tags Variable
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function getVariable(options: Parameters<typeof _getVariable>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _getVariable>> }): CancelablePromise<_DataOf<typeof _getVariable>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _getVariable({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('getVariable', true, invoke, ec.consistency);
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
export function migrateProcessInstance(options?: Parameters<typeof _migrateProcessInstance>[0]): CancelablePromise<_DataOf<typeof _migrateProcessInstance>> {
  return toCancelable(signal => _migrateProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function modifyProcessInstance(options?: Parameters<typeof _modifyProcessInstance>[0]): CancelablePromise<_DataOf<typeof _modifyProcessInstance>> {
  return toCancelable(signal => _modifyProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
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
export function resetClock(options?: Parameters<typeof _resetClock>[0]): CancelablePromise<_DataOf<typeof _resetClock>> {
  return toCancelable(signal => _resetClock({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Resolve incident
 * Marks the incident as resolved; most likely a call to Update job will be necessary to reset the job’s retries, followed by this call.
 *
  *
 * @operationId resolveIncident
 * @tags Incident
 */
export function resolveIncident(options?: Parameters<typeof _resolveIncident>[0]): CancelablePromise<_DataOf<typeof _resolveIncident>> {
  return toCancelable(signal => _resolveIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Resume Batch operation
 * Resumes a suspended batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId resumeBatchOperation
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function resumeBatchOperation(options: Parameters<typeof _resumeBatchOperation>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _resumeBatchOperation>> }): CancelablePromise<_DataOf<typeof _resumeBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _resumeBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('resumeBatchOperation', false, invoke, ec.consistency);
}

/**
 * Search group clients
 * Search clients assigned to a group.
 *
  *
 * @operationId searchClientsForGroup
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForGroup(options: Parameters<typeof _searchClientsForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForGroup>> }): CancelablePromise<_DataOf<typeof _searchClientsForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchClientsForGroup', false, invoke, ec.consistency);
}

/**
 * Search role clients
 * Search clients with assigned role.
 *
  *
 * @operationId searchClientsForRole
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForRole(options: Parameters<typeof _searchClientsForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForRole>> }): CancelablePromise<_DataOf<typeof _searchClientsForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchClientsForRole', false, invoke, ec.consistency);
}

/**
 * Search clients for tenant
 * Retrieves a filtered and sorted list of clients for a specified tenant.
  *
 * @operationId searchClientsForTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchClientsForTenant(options: Parameters<typeof _searchClientsForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchClientsForTenant>> }): CancelablePromise<_DataOf<typeof _searchClientsForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchClientsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchClientsForTenant', false, invoke, ec.consistency);
}

/**
 * Search groups for tenant
 * Retrieves a filtered and sorted list of groups for a specified tenant.
  *
 * @operationId searchGroupIdsForTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroupIdsForTenant(options: Parameters<typeof _searchGroupIdsForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroupIdsForTenant>> }): CancelablePromise<_DataOf<typeof _searchGroupIdsForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroupIdsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchGroupIdsForTenant', false, invoke, ec.consistency);
}

/**
 * Search role groups
 * Search groups with assigned role.
 *
  *
 * @operationId searchGroupsForRole
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchGroupsForRole(options: Parameters<typeof _searchGroupsForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchGroupsForRole>> }): CancelablePromise<_DataOf<typeof _searchGroupsForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchGroupsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchGroupsForRole', false, invoke, ec.consistency);
}

/**
 * Search group mapping rules
 * Search mapping rules assigned to a group.
 *
  *
 * @operationId searchMappingRulesForGroup
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForGroup(options: Parameters<typeof _searchMappingRulesForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForGroup>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchMappingRulesForGroup', false, invoke, ec.consistency);
}

/**
 * Search role mapping rules
 * Search mapping rules with assigned role.
 *
  *
 * @operationId searchMappingRulesForRole
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForRole(options: Parameters<typeof _searchMappingRulesForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForRole>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchMappingRulesForRole', false, invoke, ec.consistency);
}

/**
 * Search mapping rules for tenant
 * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
  *
 * @operationId searchMappingRulesForTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchMappingRulesForTenant(options: Parameters<typeof _searchMappingRulesForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchMappingRulesForTenant>> }): CancelablePromise<_DataOf<typeof _searchMappingRulesForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchMappingRulesForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchMappingRulesForTenant', false, invoke, ec.consistency);
}

/**
 * Search for incidents associated with a process instance
 * Search for incidents caused by the process instance or any of its called process or decision instances.
 *
  *
 * @operationId searchProcessInstanceIncidents
 * @tags Process instance
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchProcessInstanceIncidents(options: Parameters<typeof _searchProcessInstanceIncidents>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchProcessInstanceIncidents>> }): CancelablePromise<_DataOf<typeof _searchProcessInstanceIncidents>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchProcessInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchProcessInstanceIncidents', false, invoke, ec.consistency);
}

/**
 * Search group roles
 * Search roles assigned to a group.
 *
  *
 * @operationId searchRolesForGroup
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRolesForGroup(options: Parameters<typeof _searchRolesForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRolesForGroup>> }): CancelablePromise<_DataOf<typeof _searchRolesForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRolesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchRolesForGroup', false, invoke, ec.consistency);
}

/**
 * Search roles for tenant
 * Retrieves a filtered and sorted list of roles for a specified tenant.
  *
 * @operationId searchRolesForTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchRolesForTenant(options: Parameters<typeof _searchRolesForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchRolesForTenant>> }): CancelablePromise<_DataOf<typeof _searchRolesForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchRolesForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchRolesForTenant', false, invoke, ec.consistency);
}

/**
 * Search group users
 * Search users assigned to a group.
 *
  *
 * @operationId searchUsersForGroup
 * @tags Group
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForGroup(options: Parameters<typeof _searchUsersForGroup>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForGroup>> }): CancelablePromise<_DataOf<typeof _searchUsersForGroup>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUsersForGroup', false, invoke, ec.consistency);
}

/**
 * Search role users
 * Search users with assigned role.
 *
  *
 * @operationId searchUsersForRole
 * @tags Role
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForRole(options: Parameters<typeof _searchUsersForRole>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForRole>> }): CancelablePromise<_DataOf<typeof _searchUsersForRole>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUsersForRole', false, invoke, ec.consistency);
}

/**
 * Search users for tenant
 * Retrieves a filtered and sorted list of users for a specified tenant.
  *
 * @operationId searchUsersForTenant
 * @tags Tenant
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUsersForTenant(options: Parameters<typeof _searchUsersForTenant>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUsersForTenant>> }): CancelablePromise<_DataOf<typeof _searchUsersForTenant>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUsersForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUsersForTenant', false, invoke, ec.consistency);
}

/**
 * Search user task variables
 * Search for user task variables based on given criteria.
 *
  *
 * @operationId searchUserTaskVariables
 * @tags User task
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function searchUserTaskVariables(options: Parameters<typeof _searchUserTaskVariables>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _searchUserTaskVariables>> }): CancelablePromise<_DataOf<typeof _searchUserTaskVariables>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _searchUserTaskVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('searchUserTaskVariables', false, invoke, ec.consistency);
}

/**
 * Suspend Batch operation
 * Suspends a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId suspendBatchOperation
 * @tags Batch operation
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function suspendBatchOperation(options: Parameters<typeof _suspendBatchOperation>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _suspendBatchOperation>> }): CancelablePromise<_DataOf<typeof _suspendBatchOperation>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _suspendBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('suspendBatchOperation', false, invoke, ec.consistency);
}

/**
 * Throw error for job
 * Reports a business error (i.e. non-technical) that occurs while processing a job.
 *
  *
 * @operationId throwJobError
 * @tags Job
 */
export function throwJobError(options?: Parameters<typeof _throwJobError>[0]): CancelablePromise<_DataOf<typeof _throwJobError>> {
  return toCancelable(signal => _throwJobError({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a client from a group
 * Unassigns a client from a group.
 * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
 *
  *
 * @operationId unassignClientFromGroup
 * @tags Group
 */
export function unassignClientFromGroup(options?: Parameters<typeof _unassignClientFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromGroup>> {
  return toCancelable(signal => _unassignClientFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a client from a tenant
 * Unassigns the client from the specified tenant.
 * The client can no longer access tenant data.
 *
  *
 * @operationId unassignClientFromTenant
 * @tags Tenant
 */
export function unassignClientFromTenant(options?: Parameters<typeof _unassignClientFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromTenant>> {
  return toCancelable(signal => _unassignClientFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a group from a tenant
 * Unassigns a group from a specified tenant.
 * Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
 *
  *
 * @operationId unassignGroupFromTenant
 * @tags Tenant
 */
export function unassignGroupFromTenant(options?: Parameters<typeof _unassignGroupFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignGroupFromTenant>> {
  return toCancelable(signal => _unassignGroupFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a mapping rule from a group
 * Unassigns a mapping rule from a group.
 *
  *
 * @operationId unassignMappingRuleFromGroup
 * @tags Group
 */
export function unassignMappingRuleFromGroup(options?: Parameters<typeof _unassignMappingRuleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromGroup>> {
  return toCancelable(signal => _unassignMappingRuleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a mapping rule from a tenant
 * Unassigns a single mapping rule from a specified tenant without deleting the rule.
  *
 * @operationId unassignMappingRuleFromTenant
 * @tags Tenant
 */
export function unassignMappingRuleFromTenant(options?: Parameters<typeof _unassignMappingRuleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromTenant>> {
  return toCancelable(signal => _unassignMappingRuleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a client
 * Unassigns the specified role from the client.
 * The client will no longer inherit the authorizations associated with this role.
 *
  *
 * @operationId unassignRoleFromClient
 * @tags Role
 */
export function unassignRoleFromClient(options?: Parameters<typeof _unassignRoleFromClient>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromClient>> {
  return toCancelable(signal => _unassignRoleFromClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a group
 * Unassigns the specified role from the group.
 * All group members (user or client) no longer inherit the authorizations associated with this role.
 *
  *
 * @operationId unassignRoleFromGroup
 * @tags Role
 */
export function unassignRoleFromGroup(options?: Parameters<typeof _unassignRoleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromGroup>> {
  return toCancelable(signal => _unassignRoleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a mapping rule
 * Unassigns a role from a mapping rule.
 *
  *
 * @operationId unassignRoleFromMappingRule
 * @tags Role
 */
export function unassignRoleFromMappingRule(options?: Parameters<typeof _unassignRoleFromMappingRule>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromMappingRule>> {
  return toCancelable(signal => _unassignRoleFromMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a tenant
 * Unassigns a role from a specified tenant.
 * Users, Clients or Groups, that have the role assigned, will no longer have access to the
 * tenant's data - unless they are assigned directly to the tenant.
 *
  *
 * @operationId unassignRoleFromTenant
 * @tags Tenant
 */
export function unassignRoleFromTenant(options?: Parameters<typeof _unassignRoleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromTenant>> {
  return toCancelable(signal => _unassignRoleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a user
 * Unassigns a role from a user.
 * The user will no longer inherit the authorizations associated with this role.
 *
  *
 * @operationId unassignRoleFromUser
 * @tags Role
 */
export function unassignRoleFromUser(options?: Parameters<typeof _unassignRoleFromUser>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromUser>> {
  return toCancelable(signal => _unassignRoleFromUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a user from a group
 * Unassigns a user from a group.
 * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
 *
  *
 * @operationId unassignUserFromGroup
 * @tags Group
 */
export function unassignUserFromGroup(options?: Parameters<typeof _unassignUserFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromGroup>> {
  return toCancelable(signal => _unassignUserFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a user from a tenant
 * Unassigns the user from the specified tenant.
 * The user can no longer access tenant data.
 *
  *
 * @operationId unassignUserFromTenant
 * @tags Tenant
 */
export function unassignUserFromTenant(options?: Parameters<typeof _unassignUserFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromTenant>> {
  return toCancelable(signal => _unassignUserFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign user task
 * Removes the assignee of a task with the given key.
  *
 * @operationId unassignUserTask
 * @tags User task
 */
export function unassignUserTask(options?: Parameters<typeof _unassignUserTask>[0]): CancelablePromise<_DataOf<typeof _unassignUserTask>> {
  return toCancelable(signal => _unassignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update authorization
 * Update the authorization with the given key.
  *
 * @operationId updateAuthorization
 * @tags Authorization
 */
export function updateAuthorization(options?: Parameters<typeof _updateAuthorization>[0]): CancelablePromise<_DataOf<typeof _updateAuthorization>> {
  return toCancelable(signal => _updateAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update group
 * Update a group with the given ID.
 *
  *
 * @operationId updateGroup
 * @tags Group
 */
export function updateGroup(options?: Parameters<typeof _updateGroup>[0]): CancelablePromise<_DataOf<typeof _updateGroup>> {
  return toCancelable(signal => _updateGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update job
 * Update a job with the given key.
  *
 * @operationId updateJob
 * @tags Job
 */
export function updateJob(options?: Parameters<typeof _updateJob>[0]): CancelablePromise<_DataOf<typeof _updateJob>> {
  return toCancelable(signal => _updateJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update mapping rule
 * Update a mapping rule.
 *
  *
 * @operationId updateMappingRule
 * @tags Mapping rule
 */
export function updateMappingRule(options?: Parameters<typeof _updateMappingRule>[0]): CancelablePromise<_DataOf<typeof _updateMappingRule>> {
  return toCancelable(signal => _updateMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update role
 * Update a role with the given ID.
 *
  *
 * @operationId updateRole
 * @tags Role
 */
export function updateRole(options?: Parameters<typeof _updateRole>[0]): CancelablePromise<_DataOf<typeof _updateRole>> {
  return toCancelable(signal => _updateRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update tenant
 * Updates an existing tenant.
  *
 * @operationId updateTenant
 * @tags Tenant
 */
export function updateTenant(options?: Parameters<typeof _updateTenant>[0]): CancelablePromise<_DataOf<typeof _updateTenant>> {
  return toCancelable(signal => _updateTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update user
 * Updates a user.
 *
  *
 * @operationId updateUser
 * @tags User
  *
 * Consistency: Eventually consistent – may return 404/empty until propagation.
 */
export function updateUser(options: Parameters<typeof _updateUser>[0] | undefined, ec: { consistency: ConsistencyOptions<_DataOf<typeof _updateUser>> }): CancelablePromise<_DataOf<typeof _updateUser>> {
  if (!ec || !ec.consistency) throw new Error('Missing consistency options (mandatory for eventually consistent endpoint)');
  const invoke = () => toCancelable(signal => _updateUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
  return eventualPoll('updateUser', false, invoke, ec.consistency);
}

/**
 * Update user task
 * Update a user task with the given key.
  *
 * @operationId updateUserTask
 * @tags User task
 */
export function updateUserTask(options?: Parameters<typeof _updateUserTask>[0]): CancelablePromise<_DataOf<typeof _updateUserTask>> {
  return toCancelable(signal => _updateUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

// SENTINEL_FACADE_PREWRITE hash=6f3828ae4c839991 totalWrappers=146 elements=1020 physicalLines=2259
