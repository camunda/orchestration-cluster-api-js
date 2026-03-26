// Compilable usage examples for authorization operations.
// These examples are type-checked during build to guard against API regressions.

import { AuthorizationKey, createCamundaClient } from '@camunda8/orchestration-cluster-api';

//#region CreateAuthorization
async function createAuthorizationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createAuthorization({
    ownerId: 'user-123',
    ownerType: 'USER',
    resourceId: 'order-process',
    resourceType: 'PROCESS_DEFINITION',
    permissionTypes: ['CREATE_PROCESS_INSTANCE', 'READ_PROCESS_INSTANCE'],
  });

  console.log(`Authorization key: ${result.authorizationKey}`);
}
//#endregion CreateAuthorization

//#region GetAuthorization
async function getAuthorizationExample() {
  const camunda = createCamundaClient();

  const authorizationKey = AuthorizationKey.assumeExists('2251799813685249');

  const authorization = await camunda.getAuthorization(
    { authorizationKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Owner: ${authorization.ownerId} (${authorization.ownerType})`);
}
//#endregion GetAuthorization

//#region SearchAuthorizations
async function searchAuthorizationsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchAuthorizations(
    {
      filter: { ownerType: 'USER' },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const auth of result.items ?? []) {
    console.log(`${auth.authorizationKey}: ${auth.ownerId} - ${auth.resourceType}`);
  }
}
//#endregion SearchAuthorizations

//#region UpdateAuthorization
async function updateAuthorizationExample() {
  const camunda = createCamundaClient();

  const authorizationKey = AuthorizationKey.assumeExists('2251799813685249');

  await camunda.updateAuthorization({
    authorizationKey,
    ownerId: 'user-123',
    ownerType: 'USER',
    resourceId: 'order-process',
    resourceType: 'PROCESS_DEFINITION',
    permissionTypes: [
      'CREATE_PROCESS_INSTANCE',
      'READ_PROCESS_INSTANCE',
      'DELETE_PROCESS_INSTANCE',
    ],
  });
}
//#endregion UpdateAuthorization

//#region DeleteAuthorization
async function deleteAuthorizationExample() {
  const camunda = createCamundaClient();

  const authorizationKey = AuthorizationKey.assumeExists('2251799813685249');

  await camunda.deleteAuthorization({ authorizationKey });
}
//#endregion DeleteAuthorization

// Suppress "declared but never read"
void createAuthorizationExample;
void getAuthorizationExample;
void searchAuthorizationsExample;
void updateAuthorizationExample;
void deleteAuthorizationExample;

// Suppress "declared but never read"
void createAuthorizationExample;
void getAuthorizationExample;
void searchAuthorizationsExample;
void updateAuthorizationExample;
void deleteAuthorizationExample;
