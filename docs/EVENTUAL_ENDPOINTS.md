# Eventually Consistent Endpoints

| Operation | Method | Path | Service | Description |
|-----------|--------|------|---------|-------------|
| cancelBatchOperation | POST | /batch-operations/{batchOperationKey}/cancellation | BatchOperationService | Cancel Batch operation |
| cancelProcessInstancesBatchOperation | POST | /process-instances/cancellation | ProcessInstanceService | Create a batch operation to cancel process instances |
| createAdminUser | POST | /setup/user | SetupService | Create admin user |
| createUser | POST | /users | UserService | Create user |
| deleteUser | DELETE | /users/{username} | UserService | Delete user |
| getAuthorization | GET | /authorizations/{authorizationKey} | AuthorizationService | Get authorization |
| getBatchOperation | GET | /batch-operations/{batchOperationKey} | BatchOperationService | Get batch operation |
| getDecisionDefinition | GET | /decision-definitions/{decisionDefinitionKey} | DecisionDefinitionService | Get decision definition |
| getDecisionDefinitionXml | GET | /decision-definitions/{decisionDefinitionKey}/xml | DecisionDefinitionService | Get decision definition XML |
| getDecisionInstance | GET | /decision-instances/{decisionEvaluationInstanceKey} | DecisionInstanceService | Get decision instance |
| getDecisionRequirements | GET | /decision-requirements/{decisionRequirementsKey} | DecisionRequirementsService | Get decision requirements |
| getDecisionRequirementsXml | GET | /decision-requirements/{decisionRequirementsKey}/xml | DecisionRequirementsService | Get decision requirements XML |
| getElementInstance | GET | /element-instances/{elementInstanceKey} | ElementInstanceService | Get element instance |
| getGroup | GET | /groups/{groupId} | GroupService | Get group |
| getIncident | GET | /incidents/{incidentKey} | IncidentService | Get incident |
| getMappingRule | GET | /mapping-rules/{mappingRuleId} | MappingRuleService | Get a mapping rule |
| getProcessDefinition | GET | /process-definitions/{processDefinitionKey} | ProcessDefinitionService | Get process definition |
| getProcessDefinitionStatistics | POST | /process-definitions/{processDefinitionKey}/statistics/element-instances | ProcessDefinitionService | Get process definition statistics |
| getProcessDefinitionXml | GET | /process-definitions/{processDefinitionKey}/xml | ProcessDefinitionService | Get process definition XML |
| getProcessInstance | GET | /process-instances/{processInstanceKey} | ProcessInstanceService | Get process instance |
| getProcessInstanceCallHierarchy | GET | /process-instances/{processInstanceKey}/call-hierarchy | ProcessInstanceService | Get call hierarchy for process instance |
| getProcessInstanceSequenceFlows | GET | /process-instances/{processInstanceKey}/sequence-flows | ProcessInstanceService | Get process instance sequence flows |
| getProcessInstanceStatistics | GET | /process-instances/{processInstanceKey}/statistics/element-instances | ProcessInstanceService | Get process instance statistics |
| getRole | GET | /roles/{roleId} | RoleService | Get role |
| getStartProcessForm | GET | /process-definitions/{processDefinitionKey}/form | ProcessDefinitionService | Get process start form |
| getTenant | GET | /tenants/{tenantId} | TenantService | Get tenant |
| getUsageMetrics | GET | /system/usage-metrics | SystemService | Get usage metrics |
| getUser | GET | /users/{username} | UserService | Get user |
| getUserTask | GET | /user-tasks/{userTaskKey} | UserTaskService | Get user task |
| getUserTaskForm | GET | /user-tasks/{userTaskKey}/form | UserTaskService | Get user task form |
| getVariable | GET | /variables/{variableKey} | VariableService | Get variable |
| migrateProcessInstancesBatchOperation | POST | /process-instances/migration | ProcessInstanceService | Create a batch operation to migrate process instances |
| modifyProcessInstancesBatchOperation | POST | /process-instances/modification | ProcessInstanceService | Create a batch operation to modify process instances |
| resolveIncidentsBatchOperation | POST | /process-instances/incident-resolution | ProcessInstanceService | Create a batch operation to resolve incidents of process instances |
| resumeBatchOperation | POST | /batch-operations/{batchOperationKey}/resumption | BatchOperationService | Resume Batch operation |
| searchAuthorizations | POST | /authorizations/search | AuthorizationService | Search authorizations |
| searchBatchOperationItems | POST | /batch-operation-items/search | BatchOperationService | Search batch operation items |
| searchBatchOperations | POST | /batch-operations/search | BatchOperationService | Search batch operations |
| searchClientsForGroup | POST | /groups/{groupId}/clients/search | GroupService | Search group clients |
| searchClientsForRole | POST | /roles/{roleId}/clients/search | RoleService | Search role clients |
| searchClientsForTenant | POST | /tenants/{tenantId}/clients/search | TenantService | Search clients for tenant |
| searchDecisionDefinitions | POST | /decision-definitions/search | DecisionDefinitionService | Search decision definitions |
| searchDecisionInstances | POST | /decision-instances/search | DecisionInstanceService | Search decision instances |
| searchDecisionRequirements | POST | /decision-requirements/search | DecisionRequirementsService | Search decision requirements |
| searchElementInstances | POST | /element-instances/search | ElementInstanceService | Search element instances |
| searchGroupIdsForTenant | POST | /tenants/{tenantId}/groups/search | TenantService | Search groups for tenant |
| searchGroups | POST | /groups/search | GroupService | Search groups |
| searchGroupsForRole | POST | /roles/{roleId}/groups/search | RoleService | Search role groups |
| searchIncidents | POST | /incidents/search | IncidentService | Search incidents |
| searchJobs | POST | /jobs/search | JobService | Search jobs |
| searchMappingRule | POST | /mapping-rules/search | MappingRuleService | Search mapping rules |
| searchMappingRulesForGroup | POST | /groups/{groupId}/mapping-rules/search | GroupService | Search group mapping rules |
| searchMappingRulesForRole | POST | /roles/{roleId}/mapping-rules/search | RoleService | Search role mapping rules |
| searchMappingsForTenant | POST | /tenants/{tenantId}/mapping-rules/search | TenantService | Search mapping rules for tenant |
| searchMessageSubscriptions | POST | /message-subscriptions/search | MessageSubscriptionService | Search message subscriptions |
| searchProcessDefinitions | POST | /process-definitions/search | ProcessDefinitionService | Search process definitions |
| searchProcessInstanceIncidents | POST | /process-instances/{processInstanceKey}/incidents/search | ProcessInstanceService | Search for incidents associated with a process instance |
| searchProcessInstances | POST | /process-instances/search | ProcessInstanceService | Search process instances |
| searchRoles | POST | /roles/search | RoleService | Search roles |
| searchRolesForGroup | POST | /groups/{groupId}/roles/search | GroupService | Search group roles |
| searchRolesForTenant | POST | /tenants/{tenantId}/roles/search | TenantService | Search roles for tenant |
| searchTenants | POST | /tenants/search | TenantService | Search tenants |
| searchUsers | POST | /users/search | UserService | Search users |
| searchUsersForGroup | POST | /groups/{groupId}/users/search | GroupService | Search group users |
| searchUsersForRole | POST | /roles/{roleId}/users/search | RoleService | Search role users |
| searchUsersForTenant | POST | /tenants/{tenantId}/users/search | TenantService | Search users for tenant |
| searchUserTasks | POST | /user-tasks/search | UserTaskService | Search user tasks |
| searchUserTaskVariables | POST | /user-tasks/{userTaskKey}/variables/search | UserTaskService | Search user task variables |
| searchVariables | POST | /variables/search | VariableService | Search variables |
| suspendBatchOperation | POST | /batch-operations/{batchOperationKey}/suspension | BatchOperationService | Suspend Batch operation |
| updateUser | PUT | /users/{username} | UserService | Update user |
