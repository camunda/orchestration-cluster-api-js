// Compilable usage examples for tenant management operations.
// These examples are type-checked during build to guard against API regressions.

import { createCamundaClient, TenantId, Username } from '@camunda8/orchestration-cluster-api';

//#region CreateTenant
async function createTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    name: 'Customer Service',
  });

  console.log(`Created tenant: ${result.tenantId}`);
}
//#endregion CreateTenant

//#region GetTenant
async function getTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  const tenant = await camunda.getTenant({ tenantId }, { consistency: { waitUpToMs: 5000 } });

  console.log(`Tenant: ${tenant.name}`);
}
//#endregion GetTenant

//#region SearchTenants
async function searchTenantsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchTenants(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const tenant of result.items ?? []) {
    console.log(`${tenant.tenantId}: ${tenant.name}`);
  }
}
//#endregion SearchTenants

//#region UpdateTenant
async function updateTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  await camunda.updateTenant({
    tenantId,
    name: 'Customer Service Team',
  });
}
//#endregion UpdateTenant

//#region DeleteTenant
async function deleteTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  await camunda.deleteTenant({ tenantId });
}
//#endregion DeleteTenant

//#region AssignUserToTenant
async function assignUserToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignUserToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    username: Username.assumeExists('alice'),
  });
}
//#endregion AssignUserToTenant

//#region UnassignUserFromTenant
async function unassignUserFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignUserFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    username: Username.assumeExists('alice'),
  });
}
//#endregion UnassignUserFromTenant

//#region AssignGroupToTenant
async function assignGroupToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignGroupToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    groupId: 'engineering-team',
  });
}
//#endregion AssignGroupToTenant

//#region UnassignGroupFromTenant
async function unassignGroupFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignGroupFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    groupId: 'engineering-team',
  });
}
//#endregion UnassignGroupFromTenant

//#region AssignRoleToTenant
async function assignRoleToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    roleId: 'process-admin',
  });
}
//#endregion AssignRoleToTenant

//#region UnassignRoleFromTenant
async function unassignRoleFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    roleId: 'process-admin',
  });
}
//#endregion UnassignRoleFromTenant

//#region AssignClientToTenant
async function assignClientToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignClientToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    clientId: 'my-service-account',
  });
}
//#endregion AssignClientToTenant

//#region UnassignClientFromTenant
async function unassignClientFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignClientFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    clientId: 'my-service-account',
  });
}
//#endregion UnassignClientFromTenant

//#region AssignMappingRuleToTenant
async function assignMappingRuleToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignMappingRuleToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    mappingRuleId: 'rule-123',
  });
}
//#endregion AssignMappingRuleToTenant

//#region UnassignMappingRuleFromTenant
async function unassignMappingRuleFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignMappingRuleFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    mappingRuleId: 'rule-123',
  });
}
//#endregion UnassignMappingRuleFromTenant

//#region SearchUsersForTenant
async function searchUsersForTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUsersForTenant(
    { tenantId: TenantId.assumeExists('customer-service') },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const user of result.items ?? []) {
    console.log(`Tenant member: ${user.username}`);
  }
}
//#endregion SearchUsersForTenant

//#region SearchClientsForTenant
async function searchClientsForTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchClientsForTenant(
    { tenantId: TenantId.assumeExists('customer-service') },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const client of result.items ?? []) {
    console.log(`Client: ${client.clientId}`);
  }
}
//#endregion SearchClientsForTenant

//#region SearchGroupIdsForTenant
async function searchGroupIdsForTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchGroupIdsForTenant(
    { tenantId: TenantId.assumeExists('customer-service') },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const group of result.items ?? []) {
    console.log(`Group: ${group.groupId}`);
  }
}
//#endregion SearchGroupIdsForTenant

//#region SearchRolesForTenant
async function searchRolesForTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchRolesForTenant(
    { tenantId: TenantId.assumeExists('customer-service') },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const role of result.items ?? []) {
    console.log(`Role: ${role.name}`);
  }
}
//#endregion SearchRolesForTenant

//#region SearchMappingRulesForTenant
async function searchMappingRulesForTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchMappingRulesForTenant(
    { tenantId: TenantId.assumeExists('customer-service') },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const rule of result.items ?? []) {
    console.log(`Mapping rule: ${rule.name}`);
  }
}
//#endregion SearchMappingRulesForTenant
