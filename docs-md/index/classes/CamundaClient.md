---
title: "Class: CamundaClient"
sidebar_label: "CamundaClient"
mdx:
  format: md
---

# Class: CamundaClient

Defined in: [gen/CamundaClient.ts:1181](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1181)

## Constructors

### Constructor

```ts
new CamundaClient(opts): CamundaClient;
```

Defined in: [gen/CamundaClient.ts:1210](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1210)

#### Parameters

##### opts

[`CamundaOptions`](../interfaces/CamundaOptions.md) = `{}`

#### Returns

`CamundaClient`

## Accessors

### config

#### Get Signature

```ts
get config(): Readonly<CamundaConfig>;
```

Defined in: [gen/CamundaClient.ts:1332](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1332)

##### Returns

`Readonly`\<[`CamundaConfig`](../interfaces/CamundaConfig.md)\>

## Methods

### \_getSupportLogger()

```ts
_getSupportLogger(): SupportLogger;
```

Defined in: [gen/CamundaClient.ts:1463](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1463)

Internal accessor for support logger (no public API commitment yet).

#### Returns

[`SupportLogger`](../interfaces/SupportLogger.md)

***

### \_invokeWithRetry()

```ts
_invokeWithRetry<T>(op, opts): Promise<T>;
```

Defined in: [gen/CamundaClient.ts:1502](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1502)

Internal invocation helper to apply global backpressure gating + retry + normalization

#### Type Parameters

##### T

`T`

#### Parameters

##### op

() => `Promise`\<`T`\>

##### opts

###### classify?

(`e`) => `object`

###### exempt?

`boolean`

###### opId

`string`

###### retryOverride?

  \| `false`
  \| `Partial`\<[`HttpRetryPolicy`](../interfaces/HttpRetryPolicy.md)\>

#### Returns

`Promise`\<`T`\>

***

### activateAdHocSubProcessActivities()

```ts
activateAdHocSubProcessActivities(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1609](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1609)

Activate activities within an ad-hoc sub-process

Activates selected activities within an ad-hoc sub-process identified by element ID.
The provided element IDs must exist within the ad-hoc sub-process instance identified by the
provided adHocSubProcessInstanceKey.

 *

#### Parameters

##### input

[`activateAdHocSubProcessActivitiesInput`](../type-aliases/activateAdHocSubProcessActivitiesInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function activateAdHocSubProcessActivitiesExample() {
  const camunda = createCamundaClient();

  const adHocSubProcessInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  await camunda.activateAdHocSubProcessActivities({
    adHocSubProcessInstanceKey,
    elements: [{ elementId: ElementId.assumeExists('task-a') }],
  });
}
```

#### Operation Id

activateAdHocSubProcessActivities

#### Tags

Ad-hoc sub-process

***

### activateJobs()

```ts
activateJobs(input, options?): CancelablePromise<{
  jobs: EnrichedActivatedJob[];
}>;
```

Defined in: [gen/CamundaClient.ts:1674](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1674)

Activate jobs

Iterate through all known partitions and activate jobs up to the requested maximum.

 *

#### Parameters

##### input

[`JobActivationRequest`](../type-aliases/JobActivationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<\{
  `jobs`: [`EnrichedActivatedJob`](../interfaces/EnrichedActivatedJob.md)[];
\}\>

#### Example

```ts
async function activateJobsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.activateJobs({
    type: 'payment-processing',
    timeout: 30000,
    maxJobsToActivate: 5,
  });

  for (const job of result.jobs) {
    console.log(`Job ${job.jobKey}: ${job.type}`);

    // Each enriched job has helper methods
    await job.complete({ paymentId: 'PAY-123' });
  }
}
```

#### Operation Id

activateJobs

#### Tags

Job

***

### assignClientToGroup()

```ts
assignClientToGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1739](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1739)

Assign a client to a group

Assigns a client to a group, making it a member of the group.
Members of the group inherit the group authorizations, roles, and tenant assignments.

 *

#### Parameters

##### input

[`assignClientToGroupInput`](../type-aliases/assignClientToGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignClientToGroupExample() {
  const camunda = createCamundaClient();

  await camunda.assignClientToGroup({
    groupId: 'engineering-team',
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

assignClientToGroup

#### Tags

Group

***

### assignClientToTenant()

```ts
assignClientToTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1803](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1803)

Assign a client to a tenant

Assign the client to the specified tenant.
The client can then access tenant data and perform authorized actions.

 *

#### Parameters

##### input

[`assignClientToTenantInput`](../type-aliases/assignClientToTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignClientToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignClientToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

assignClientToTenant

#### Tags

Tenant

***

### assignGroupToTenant()

```ts
assignGroupToTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1867](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1867)

Assign a group to a tenant

Assigns a group to a specified tenant.
Group members (users, clients) can then access tenant data and perform authorized actions.

 *

#### Parameters

##### input

[`assignGroupToTenantInput`](../type-aliases/assignGroupToTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignGroupToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignGroupToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    groupId: 'engineering-team',
  });
}
```

#### Operation Id

assignGroupToTenant

#### Tags

Tenant

***

### assignMappingRuleToGroup()

```ts
assignMappingRuleToGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1929](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1929)

Assign a mapping rule to a group

Assigns a mapping rule to a group.
 *

#### Parameters

##### input

[`assignMappingRuleToGroupInput`](../type-aliases/assignMappingRuleToGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignMappingRuleToGroupExample() {
  const camunda = createCamundaClient();

  await camunda.assignMappingRuleToGroup({
    groupId: 'engineering-team',
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

assignMappingRuleToGroup

#### Tags

Group

***

### assignMappingRuleToTenant()

```ts
assignMappingRuleToTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:1991](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1991)

Assign a mapping rule to a tenant

Assign a single mapping rule to a specified tenant.
 *

#### Parameters

##### input

[`assignMappingRuleToTenantInput`](../type-aliases/assignMappingRuleToTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignMappingRuleToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignMappingRuleToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

assignMappingRuleToTenant

#### Tags

Tenant

***

### assignRoleToClient()

```ts
assignRoleToClient(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2053](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2053)

Assign a role to a client

Assigns the specified role to the client. The client will inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`assignRoleToClientInput`](../type-aliases/assignRoleToClientInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignRoleToClientExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToClient({
    roleId: 'process-admin',
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

assignRoleToClient

#### Tags

Role

***

### assignRoleToGroup()

```ts
assignRoleToGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2115](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2115)

Assign a role to a group

Assigns the specified role to the group. Every member of the group (user or client) will inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`assignRoleToGroupInput`](../type-aliases/assignRoleToGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignRoleToGroupExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToGroup({
    roleId: 'process-admin',
    groupId: 'engineering-team',
  });
}
```

#### Operation Id

assignRoleToGroup

#### Tags

Role

***

### assignRoleToMappingRule()

```ts
assignRoleToMappingRule(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2177](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2177)

Assign a role to a mapping rule

Assigns a role to a mapping rule.
 *

#### Parameters

##### input

[`assignRoleToMappingRuleInput`](../type-aliases/assignRoleToMappingRuleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignRoleToMappingRuleExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToMappingRule({
    roleId: 'process-admin',
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

assignRoleToMappingRule

#### Tags

Role

***

### assignRoleToTenant()

```ts
assignRoleToTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2241](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2241)

Assign a role to a tenant

Assigns a role to a specified tenant.
Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.

 *

#### Parameters

##### input

[`assignRoleToTenantInput`](../type-aliases/assignRoleToTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignRoleToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    roleId: 'process-admin',
  });
}
```

#### Operation Id

assignRoleToTenant

#### Tags

Tenant

***

### assignRoleToUser()

```ts
assignRoleToUser(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2303](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2303)

Assign a role to a user

Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`assignRoleToUserInput`](../type-aliases/assignRoleToUserInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignRoleToUserExample() {
  const camunda = createCamundaClient();

  await camunda.assignRoleToUser({
    roleId: 'process-admin',
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

assignRoleToUser

#### Tags

Role

***

### assignUserTask()

```ts
assignUserTask(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2366](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2366)

Assign user task

Assigns a user task with the given key to the given assignee. Assignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.

 *

#### Parameters

##### input

[`assignUserTaskInput`](../type-aliases/assignUserTaskInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.assignUserTask({
    userTaskKey,
    assignee: 'alice',
    allowOverride: true,
  });
}
```

#### Operation Id

assignUserTask

#### Tags

User task

***

### assignUserToGroup()

```ts
assignUserToGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2432](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2432)

Assign a user to a group

Assigns a user to a group, making the user a member of the group.
Group members inherit the group authorizations, roles, and tenant assignments.

 *

#### Parameters

##### input

[`assignUserToGroupInput`](../type-aliases/assignUserToGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignUserToGroupExample() {
  const camunda = createCamundaClient();

  await camunda.assignUserToGroup({
    groupId: 'engineering-team',
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

assignUserToGroup

#### Tags

Group

***

### assignUserToTenant()

```ts
assignUserToTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2494](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2494)

Assign a user to a tenant

Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
 *

#### Parameters

##### input

[`assignUserToTenantInput`](../type-aliases/assignUserToTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function assignUserToTenantExample() {
  const camunda = createCamundaClient();

  await camunda.assignUserToTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

assignUserToTenant

#### Tags

Tenant

***

### broadcastSignal()

```ts
broadcastSignal(input, options?): CancelablePromise<SignalBroadcastResult>;
```

Defined in: [gen/CamundaClient.ts:2556](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2556)

Broadcast signal

Broadcasts a signal.
 *

#### Parameters

##### input

[`SignalBroadcastRequest`](../type-aliases/SignalBroadcastRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SignalBroadcastResult`](../type-aliases/SignalBroadcastResult.md)\>

#### Example

```ts
async function broadcastSignalExample() {
  const camunda = createCamundaClient();

  const result = await camunda.broadcastSignal({
    signalName: 'system-shutdown',
    variables: {
      reason: 'Scheduled maintenance',
    },
  });

  console.log(`Signal broadcast key: ${result.signalKey}`);
}
```

#### Operation Id

broadcastSignal

#### Tags

Signal

***

### cancelBatchOperation()

```ts
cancelBatchOperation(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2624](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2624)

Cancel Batch operation

Cancels a running batch operation.
This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

###### batchOperationKey

[`BatchOperationKey`](../type-aliases/BatchOperationKey.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function cancelBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.cancelBatchOperation({ batchOperationKey });
}
```

#### Operation Id

cancelBatchOperation

#### Tags

Batch operation

***

### cancelProcessInstance()

```ts
cancelProcessInstance(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2689](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2689)

Cancel process instance

Cancels a running process instance. As a cancellation includes more than just the removal of the process instance resource, the cancellation resource must be posted. Cancellation can wait on listener-related processing; when that processing does not complete in time, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.

 *

#### Parameters

##### input

`object` & `object`

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function cancelProcessInstanceExample() {
  const camunda = createCamundaClient();

  // Create a process instance and get its key from the response
  const created = await camunda.createProcessInstance({
    processDefinitionId: ProcessDefinitionId.assumeExists('order-process'),
  });

  // Cancel the process instance using the key from the creation response
  await camunda.cancelProcessInstance({
    processInstanceKey: created.processInstanceKey,
  });
}
```

#### Operation Id

cancelProcessInstance

#### Tags

Process instance

***

### cancelProcessInstancesBatchOperation()

```ts
cancelProcessInstancesBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:2757](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2757)

Cancel process instances (batch)

Cancels multiple running process instances.
Since only ACTIVE root instances can be cancelled, any given filters for state and
parentProcessInstanceKey are ignored and overridden during this batch operation.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`ProcessInstanceCancellationBatchOperationRequest`](../type-aliases/ProcessInstanceCancellationBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function cancelProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.cancelProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

cancelProcessInstancesBatchOperation

#### Tags

Process instance

***

### clearAuthCache()

```ts
clearAuthCache(opts?): void;
```

Defined in: [gen/CamundaClient.ts:1442](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1442)

#### Parameters

##### opts?

###### disk?

`boolean`

###### memory?

`boolean`

#### Returns

`void`

***

### completeJob()

```ts
completeJob(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2820](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2820)

Complete job

Complete a job with the given payload, which allows completing the associated service task.

 *

#### Parameters

##### input

[`completeJobInput`](../type-aliases/completeJobInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function completeJobExample() {
  const camunda = createCamundaClient();

  const jobKey = JobKey.assumeExists('2251799813685249');

  await camunda.completeJob({
    jobKey,
    variables: {
      paymentId: 'PAY-123',
      status: 'completed',
    },
  });
}
```

#### Operation Id

completeJob

#### Tags

Job

***

### completeUserTask()

```ts
completeUserTask(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:2885](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2885)

Complete user task

Completes a user task with the given key. Completion waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.

 *

#### Parameters

##### input

[`completeUserTaskInput`](../type-aliases/completeUserTaskInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function completeUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.completeUserTask({
    userTaskKey,
    variables: {
      approved: true,
      comment: 'Looks good',
    },
  });
}
```

#### Operation Id

completeUserTask

#### Tags

User task

***

### configure()

```ts
configure(next): void;
```

Defined in: [gen/CamundaClient.ts:1344](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1344)

#### Parameters

##### next

[`CamundaOptions`](../interfaces/CamundaOptions.md)

#### Returns

`void`

***

### correlateMessage()

```ts
correlateMessage(input, options?): CancelablePromise<MessageCorrelationResult>;
```

Defined in: [gen/CamundaClient.ts:2953](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L2953)

Correlate message

Publishes a message and correlates it to a subscription.
If correlation is successful it will return the first process instance key the message correlated with.
The message is not buffered.
Use the publish message endpoint to send messages that can be buffered.

 *

#### Parameters

##### input

[`MessageCorrelationRequest`](../type-aliases/MessageCorrelationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MessageCorrelationResult`](../type-aliases/MessageCorrelationResult.md)\>

#### Example

```ts
async function correlateMessageExample() {
  const camunda = createCamundaClient();

  const result = await camunda.correlateMessage({
    name: 'order-payment-received',
    correlationKey: 'ORD-12345',
    variables: {
      paymentId: 'PAY-123',
      amount: 99.95,
    },
  });

  console.log(`Message correlated to: ${result.processInstanceKey}`);
}
```

#### Operation Id

correlateMessage

#### Tags

Message

***

### createAdminUser()

```ts
createAdminUser(input, options?): CancelablePromise<UserCreateResult>;
```

Defined in: [gen/CamundaClient.ts:3019](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3019)

Create admin user

Creates a new user and assigns the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
 *

#### Parameters

##### input

[`UserRequest`](../type-aliases/UserRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`UserCreateResult`](../type-aliases/UserCreateResult.md)\>

#### Example

```ts
async function createAdminUserExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createAdminUser({
    username: Username.assumeExists('admin'),
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin-password-123',
  });

  console.log(`Created admin user: ${result.username}`);
}
```

#### Operation Id

createAdminUser

#### Tags

Setup

***

### createAuthorization()

```ts
createAuthorization(input, options?): CancelablePromise<AuthorizationCreateResult>;
```

Defined in: [gen/CamundaClient.ts:3081](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3081)

Create authorization

Create the authorization.
 *

#### Parameters

##### input

[`AuthorizationIdBasedRequest`](../type-aliases/AuthorizationIdBasedRequest.md) | [`AuthorizationPropertyBasedRequest`](../type-aliases/AuthorizationPropertyBasedRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuthorizationCreateResult`](../type-aliases/AuthorizationCreateResult.md)\>

#### Example

```ts
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
```

#### Operation Id

createAuthorization

#### Tags

Authorization

***

### createDeployment()

```ts
createDeployment(input, options?): CancelablePromise<ExtendedDeploymentResult>;
```

Defined in: [gen/CamundaClient.ts:3146](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3146)

Deploy resources

Deploys one or more resources (e.g. processes, decision models, or forms).
This is an atomic call, i.e. either all resources are deployed or none of them are.

 *

#### Parameters

##### input

[`createDeploymentInput`](../type-aliases/createDeploymentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ExtendedDeploymentResult`](../interfaces/ExtendedDeploymentResult.md)\>

Enriched deployment result with typed arrays (processes, decisions, decisionRequirements, forms, resources).

#### Example

```ts
async function createDeploymentExample() {
  const camunda = createCamundaClient();

  const file = new File(['<xml/>'], 'order-process.bpmn', { type: 'application/xml' });

  const result = await camunda.createDeployment({
    resources: [file],
  });

  console.log(`Deployment key: ${result.deploymentKey}`);
  for (const process of result.processes ?? []) {
    console.log(`  Process: ${process.processDefinitionId} v${process.processDefinitionVersion}`);
  }
}
```

#### Operation Id

createDeployment

#### Tags

Resource

***

### createDocument()

```ts
createDocument(input, options?): CancelablePromise<DocumentReference>;
```

Defined in: [gen/CamundaClient.ts:3228](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3228)

Upload document

Upload a document to the Camunda 8 cluster.

Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)

 *

#### Parameters

##### input

[`createDocumentInput`](../type-aliases/createDocumentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DocumentReference`](../type-aliases/DocumentReference.md)\>

#### Operation Id

createDocument

#### Tags

Document

***

### createDocumentLink()

```ts
createDocumentLink(input, options?): CancelablePromise<DocumentLink>;
```

Defined in: [gen/CamundaClient.ts:3295](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3295)

Create document link

Create a link to a document in the Camunda 8 cluster.

Note that this is currently supported for document stores of type: AWS, GCP

 *

#### Parameters

##### input

[`createDocumentLinkInput`](../type-aliases/createDocumentLinkInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DocumentLink`](../type-aliases/DocumentLink.md)\>

#### Example

```ts
async function createDocumentLinkExample() {
  const camunda = createCamundaClient();

  const documentId = DocumentId.assumeExists('doc-123');

  const link = await camunda.createDocumentLink({
    documentId,
    timeToLive: 3600000,
  });

  console.log(`Document link: ${link.url}`);
}
```

#### Operation Id

createDocumentLink

#### Tags

Document

***

### createDocuments()

```ts
createDocuments(input, options?): CancelablePromise<DocumentCreationBatchResponse>;
```

Defined in: [gen/CamundaClient.ts:3374](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3374)

Upload multiple documents

Upload multiple documents to the Camunda 8 cluster.

The caller must provide a file name for each document, which will be used in case of a multi-status response
to identify which documents failed to upload. The file name can be provided in the `Content-Disposition` header
of the file part or in the `fileName` field of the metadata. You can add a parallel array of metadata objects. These
are matched with the files based on index, and must have the same length as the files array.
To pass homogenous metadata for all files, spread the metadata over the metadata array.
A filename value provided explicitly via the metadata array in the request overrides the `Content-Disposition` header
of the file part.

In case of a multi-status response, the response body will contain a list of `DocumentBatchProblemDetail` objects,
each of which contains the file name of the document that failed to upload and the reason for the failure.
The client can choose to retry the whole batch or individual documents based on the response.

Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)

 *

#### Parameters

##### input

[`createDocumentsInput`](../type-aliases/createDocumentsInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DocumentCreationBatchResponse`](../type-aliases/DocumentCreationBatchResponse.md)\>

#### Operation Id

createDocuments

#### Tags

Document

***

### createElementInstanceVariables()

```ts
createElementInstanceVariables(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:3444](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3444)

Update element instance variables

Updates all the variables of a particular scope (for example, process instance, element instance) with the given variable data.
Specify the element instance in the `elementInstanceKey` parameter.
Variable updates can be delayed by listener-related processing; if processing exceeds the
request timeout, this endpoint can return 504. Other gateway timeout causes are also
possible. Retry with backoff and inspect listener worker availability and logs when this
repeats.

 *

#### Parameters

##### input

[`createElementInstanceVariablesInput`](../type-aliases/createElementInstanceVariablesInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function createElementInstanceVariablesExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  await camunda.createElementInstanceVariables({
    elementInstanceKey,
    variables: { orderId: 'ORD-12345', status: 'processing' },
  });
}
```

#### Operation Id

createElementInstanceVariables

#### Tags

Element instance

***

### createGlobalClusterVariable()

```ts
createGlobalClusterVariable(input, options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:3508](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3508)

Create a global-scoped cluster variable

Create a global-scoped cluster variable.
 *

#### Parameters

##### input

[`CreateClusterVariableRequest`](../type-aliases/CreateClusterVariableRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function createGlobalClusterVariableExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createGlobalClusterVariable({
    name: 'feature-flags',
    value: { darkMode: true },
  });

  console.log(`Created: ${result.name}`);
}
```

#### Operation Id

createGlobalClusterVariable

#### Tags

Cluster Variable

***

### createGlobalTaskListener()

```ts
createGlobalTaskListener(input, options?): CancelablePromise<GlobalTaskListenerResult>;
```

Defined in: [gen/CamundaClient.ts:3570](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3570)

Create global user task listener

Create a new global user task listener.
 *

#### Parameters

##### input

[`CreateGlobalTaskListenerRequest`](../type-aliases/CreateGlobalTaskListenerRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GlobalTaskListenerResult`](../type-aliases/GlobalTaskListenerResult.md)\>

#### Example

```ts
async function createGlobalTaskListenerExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createGlobalTaskListener({
    id: GlobalListenerId.assumeExists('audit-log-listener'),
    eventTypes: ['completing'],
    type: 'audit-log-listener',
  });

  console.log(`Created listener: ${result.id}`);
}
```

#### Operation Id

createGlobalTaskListener

#### Tags

Global listener

***

### createGroup()

```ts
createGroup(input, options?): CancelablePromise<GroupCreateResult>;
```

Defined in: [gen/CamundaClient.ts:3632](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3632)

Create group

Create a new group.
 *

#### Parameters

##### input

[`GroupCreateRequest`](../type-aliases/GroupCreateRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GroupCreateResult`](../type-aliases/GroupCreateResult.md)\>

#### Example

```ts
async function createGroupExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createGroup({
    groupId: 'engineering-team',
    name: 'Engineering Team',
  });

  console.log(`Created group: ${result.groupId}`);
}
```

#### Operation Id

createGroup

#### Tags

Group

***

### createJobWorker()

```ts
createJobWorker<In, Out, Headers>(cfg): JobWorker;
```

Defined in: [gen/CamundaClient.ts:13692](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13692)

Create a job worker that activates and processes jobs of the given type.

#### Type Parameters

##### In

`In` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

##### Out

`Out` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

##### Headers

`Headers` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

#### Parameters

##### cfg

[`JobWorkerConfig`](../interfaces/JobWorkerConfig.md)\<`In`, `Out`, `Headers`\>

Worker configuration

#### Returns

[`JobWorker`](../interfaces/JobWorker.md)

#### Examples

```ts
async function createJobWorkerExample() {
  const camunda = createCamundaClient();

  const _worker = camunda.createJobWorker({
    jobType: 'payment-processing',
    jobTimeoutMs: 30000,
    maxParallelJobs: 5,
    jobHandler: async (job): Promise<JobActionReceipt> => {
      console.log(`Processing job ${job.jobKey}`);
      return job.complete({ processed: true });
    },
  });

  // Workers run continuously until closed
  // worker.close();
}
```

```ts
async function jobWorkerWithErrorHandlingExample() {
  const camunda = createCamundaClient();

  const worker = camunda.createJobWorker({
    jobType: 'email-sending',
    jobTimeoutMs: 60000,
    maxParallelJobs: 10,
    pollIntervalMs: 300,
    jobHandler: async (job): Promise<JobActionReceipt> => {
      try {
        console.log(`Sending email for job ${job.jobKey}`);
        return job.complete({ sent: true });
      } catch (err) {
        return job.fail({
          errorMessage: String(err),
          retries: (job.retries ?? 1) - 1,
        });
      }
    },
  });

  void worker;
}
```

***

### createMappingRule()

```ts
createMappingRule(input, options?): CancelablePromise<MappingRuleCreateUpdateResult>;
```

Defined in: [gen/CamundaClient.ts:3695](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3695)

Create mapping rule

Create a new mapping rule

 *

#### Parameters

##### input

[`MappingRuleCreateRequest`](../type-aliases/MappingRuleCreateRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MappingRuleCreateUpdateResult`](../type-aliases/MappingRuleCreateUpdateResult.md)\>

#### Example

```ts
async function createMappingRuleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createMappingRule({
    mappingRuleId: 'ldap-group-mapping',
    name: 'LDAP Group Mapping',
    claimName: 'groups',
    claimValue: 'engineering',
  });

  console.log(`Created mapping rule: ${result.mappingRuleId}`);
}
```

#### Operation Id

createMappingRule

#### Tags

Mapping rule

***

### createProcessInstance()

```ts
createProcessInstance(input, options?): CancelablePromise<CreateProcessInstanceResult>;
```

Defined in: [gen/CamundaClient.ts:3765](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3765)

Create process instance

Creates and starts an instance of the specified process.
The process definition to use to create the instance can be specified either using its unique key
(as returned by Deploy resources), or using the BPMN process id and a version.

Waits for the completion of the process instance before returning a result
when awaitCompletion is enabled.

 *

#### Parameters

##### input

[`ProcessInstanceCreationInstructionByKey`](../type-aliases/ProcessInstanceCreationInstructionByKey.md) | [`ProcessInstanceCreationInstructionById`](../type-aliases/ProcessInstanceCreationInstructionById.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`CreateProcessInstanceResult`](../type-aliases/CreateProcessInstanceResult.md)\>

#### Examples

```ts
async function createProcessInstanceByIdExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createProcessInstance({
    processDefinitionId: ProcessDefinitionId.assumeExists('order-process'),
    variables: {
      orderId: 'ORD-12345',
      amount: 99.95,
    },
  });

  console.log(`Started process instance: ${result.processInstanceKey}`);
}
```

```ts
async function createProcessInstanceByKeyExample() {
  const camunda = createCamundaClient();

  // Key from a previous API response (e.g. deployment)
  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const result = await camunda.createProcessInstance({
    processDefinitionKey,
    variables: {
      orderId: 'ORD-12345',
      amount: 99.95,
    },
  });

  console.log(`Started process instance: ${result.processInstanceKey}`);
}
```

#### Operation Id

createProcessInstance

#### Tags

Process instance

***

### createRole()

```ts
createRole(input, options?): CancelablePromise<RoleCreateResult>;
```

Defined in: [gen/CamundaClient.ts:3831](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3831)

Create role

Create a new role.
 *

#### Parameters

##### input

[`RoleCreateRequest`](../type-aliases/RoleCreateRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`RoleCreateResult`](../type-aliases/RoleCreateResult.md)\>

#### Example

```ts
async function createRoleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createRole({
    roleId: 'process-admin',
    name: 'Process Admin',
  });

  console.log(`Created role: ${result.roleId}`);
}
```

#### Operation Id

createRole

#### Tags

Role

***

### createTenant()

```ts
createTenant(input, options?): CancelablePromise<TenantCreateResult>;
```

Defined in: [gen/CamundaClient.ts:3893](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3893)

Create tenant

Creates a new tenant.
 *

#### Parameters

##### input

[`TenantCreateRequest`](../type-aliases/TenantCreateRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TenantCreateResult`](../type-aliases/TenantCreateResult.md)\>

#### Example

```ts
async function createTenantExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    name: 'Customer Service',
  });

  console.log(`Created tenant: ${result.tenantId}`);
}
```

#### Operation Id

createTenant

#### Tags

Tenant

***

### createTenantClusterVariable()

```ts
createTenantClusterVariable(input, options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:3955](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L3955)

Create a tenant-scoped cluster variable

Create a new cluster variable for the given tenant.
 *

#### Parameters

##### input

[`createTenantClusterVariableInput`](../type-aliases/createTenantClusterVariableInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function createTenantClusterVariableExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createTenantClusterVariable({
    tenantId: TenantId.assumeExists('customer-service'),
    name: 'config',
    value: { region: 'us-east-1' },
  });

  console.log(`Created: ${result.name}`);
}
```

#### Operation Id

createTenantClusterVariable

#### Tags

Cluster Variable

***

### createThreadedJobWorker()

```ts
createThreadedJobWorker<In, Out, Headers>(cfg): ThreadedJobWorker;
```

Defined in: [gen/CamundaClient.ts:13721](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13721)

Create a threaded job worker that runs handler logic in a pool of worker threads.
The handler must be a separate module file that exports a default function with
signature `(job, client) => Promise<JobActionReceipt>`.

This keeps the main event loop free for polling and I/O, dramatically improving
throughput for CPU-bound job handlers.

#### Type Parameters

##### In

`In` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

##### Out

`Out` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

##### Headers

`Headers` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = `any`

#### Parameters

##### cfg

[`ThreadedJobWorkerConfig`](../interfaces/ThreadedJobWorkerConfig.md)\<`In`, `Out`, `Headers`\>

Threaded worker configuration

#### Returns

[`ThreadedJobWorker`](../interfaces/ThreadedJobWorker.md)

#### Example

```ts
const worker = client.createThreadedJobWorker({
  jobType: 'cpu-heavy-task',
  handlerModule: './my-handler.js',
  maxParallelJobs: 32,
  jobTimeoutMs: 30000,
})
```

***

### createUser()

```ts
createUser(input, options?): CancelablePromise<UserCreateResult>;
```

Defined in: [gen/CamundaClient.ts:4019](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4019)

Create user

Create a new user.
 *

#### Parameters

##### input

[`UserRequest`](../type-aliases/UserRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`UserCreateResult`](../type-aliases/UserCreateResult.md)\>

#### Example

```ts
async function createUserExample() {
  const camunda = createCamundaClient();

  const result = await camunda.createUser({
    username: Username.assumeExists('alice'),
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'secure-password-123',
  });

  console.log(`Created user: ${result.username}`);
}
```

#### Operation Id

createUser

#### Tags

User

***

### deleteAuthorization()

```ts
deleteAuthorization(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4081](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4081)

Delete authorization

Deletes the authorization with the given key.
 *

#### Parameters

##### input

[`deleteAuthorizationInput`](../type-aliases/deleteAuthorizationInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteAuthorizationExample() {
  const camunda = createCamundaClient();

  const authorizationKey = AuthorizationKey.assumeExists('2251799813685249');

  await camunda.deleteAuthorization({ authorizationKey });
}
```

#### Operation Id

deleteAuthorization

#### Tags

Authorization

***

### deleteDecisionInstance()

```ts
deleteDecisionInstance(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4143](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4143)

Delete decision instance

Delete all associated decision evaluations based on provided key.
 *

#### Parameters

##### input

`object` & `object`

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteDecisionInstanceExample() {
  const camunda = createCamundaClient();

  const decisionEvaluationKey = DecisionEvaluationKey.assumeExists('2251799813685249');

  await camunda.deleteDecisionInstance({ decisionEvaluationKey });
}
```

#### Operation Id

deleteDecisionInstance

#### Tags

Decision instance

***

### deleteDecisionInstancesBatchOperation()

```ts
deleteDecisionInstancesBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:4209](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4209)

Delete decision instances (batch)

Delete multiple decision instances. This will delete the historic data from secondary storage.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`DecisionInstanceDeletionBatchOperationRequest`](../type-aliases/DecisionInstanceDeletionBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function deleteDecisionInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.deleteDecisionInstancesBatchOperation({
    filter: {},
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

deleteDecisionInstancesBatchOperation

#### Tags

Decision instance

***

### deleteDocument()

```ts
deleteDocument(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4274](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4274)

Delete document

Delete a document from the Camunda 8 cluster.

Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)

 *

#### Parameters

##### input

[`deleteDocumentInput`](../type-aliases/deleteDocumentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteDocumentExample() {
  const camunda = createCamundaClient();

  const documentId = DocumentId.assumeExists('doc-123');

  await camunda.deleteDocument({ documentId });
}
```

#### Operation Id

deleteDocument

#### Tags

Document

***

### deleteGlobalClusterVariable()

```ts
deleteGlobalClusterVariable(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4338](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4338)

Delete a global-scoped cluster variable

Delete a global-scoped cluster variable.
 *

#### Parameters

##### input

[`deleteGlobalClusterVariableInput`](../type-aliases/deleteGlobalClusterVariableInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteGlobalClusterVariableExample() {
  const camunda = createCamundaClient();

  await camunda.deleteGlobalClusterVariable({ name: 'feature-flags' });
}
```

#### Operation Id

deleteGlobalClusterVariable

#### Tags

Cluster Variable

***

### deleteGlobalTaskListener()

```ts
deleteGlobalTaskListener(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4400](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4400)

Delete global user task listener

Deletes a global user task listener.
 *

#### Parameters

##### input

[`deleteGlobalTaskListenerInput`](../type-aliases/deleteGlobalTaskListenerInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteGlobalTaskListenerExample() {
  const camunda = createCamundaClient();

  await camunda.deleteGlobalTaskListener({
    id: GlobalListenerId.assumeExists('listener-123'),
  });
}
```

#### Operation Id

deleteGlobalTaskListener

#### Tags

Global listener

***

### deleteGroup()

```ts
deleteGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4462](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4462)

Delete group

Deletes the group with the given ID.
 *

#### Parameters

##### input

[`deleteGroupInput`](../type-aliases/deleteGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteGroupExample() {
  const camunda = createCamundaClient();

  await camunda.deleteGroup({ groupId: 'engineering-team' });
}
```

#### Operation Id

deleteGroup

#### Tags

Group

***

### deleteMappingRule()

```ts
deleteMappingRule(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4525](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4525)

Delete a mapping rule

Deletes the mapping rule with the given ID.

 *

#### Parameters

##### input

[`deleteMappingRuleInput`](../type-aliases/deleteMappingRuleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteMappingRuleExample() {
  const camunda = createCamundaClient();

  await camunda.deleteMappingRule({ mappingRuleId: 'ldap-group-mapping' });
}
```

#### Operation Id

deleteMappingRule

#### Tags

Mapping rule

***

### deleteProcessInstance()

```ts
deleteProcessInstance(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4587](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4587)

Delete process instance

Deletes a process instance. Only instances that are completed or terminated can be deleted.
 *

#### Parameters

##### input

`object` & `object`

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.deleteProcessInstance({ processInstanceKey });
}
```

#### Operation Id

deleteProcessInstance

#### Tags

Process instance

***

### deleteProcessInstancesBatchOperation()

```ts
deleteProcessInstancesBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:4654](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4654)

Delete process instances (batch)

Delete multiple process instances. This will delete the historic data from secondary storage.
Only process instances in a final state (COMPLETED or TERMINATED) can be deleted.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`ProcessInstanceDeletionBatchOperationRequest`](../type-aliases/ProcessInstanceDeletionBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function deleteProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.deleteProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

deleteProcessInstancesBatchOperation

#### Tags

Process instance

***

### deleteResource()

```ts
deleteResource(input, options?): CancelablePromise<DeleteResourceResponse>;
```

Defined in: [gen/CamundaClient.ts:4728](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4728)

Delete resource

Deletes a deployed resource. This can be a process definition, decision requirements
definition, or form definition deployed using the deploy resources endpoint. Specify the
resource you want to delete in the `resourceKey` parameter.

Once a resource has been deleted it cannot be recovered. If the resource needs to be
available again, a new deployment of the resource is required.

By default, only the resource itself is deleted from the runtime state. To also delete the
historic data associated with a resource, set the `deleteHistory` flag in the request body
to `true`. The historic data is deleted asynchronously via a batch operation. The details of
the created batch operation are included in the response. Note that history deletion is only
supported for process resources; for other resource types this flag is ignored and no history
will be deleted.
 *

#### Parameters

##### input

`object` & `object`

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DeleteResourceResponse`](../type-aliases/DeleteResourceResponse.md)\>

#### Example

```ts
async function deleteResourceExample() {
  const camunda = createCamundaClient();

  // Use a process definition key as a resource key for deletion
  const resourceKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  await camunda.deleteResource({
    resourceKey,
  });
}
```

#### Operation Id

deleteResource

#### Tags

Resource

***

### deleteRole()

```ts
deleteRole(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4792](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4792)

Delete role

Deletes the role with the given ID.
 *

#### Parameters

##### input

[`deleteRoleInput`](../type-aliases/deleteRoleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteRoleExample() {
  const camunda = createCamundaClient();

  await camunda.deleteRole({ roleId: 'process-admin' });
}
```

#### Operation Id

deleteRole

#### Tags

Role

***

### deleteTenant()

```ts
deleteTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4854](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4854)

Delete tenant

Deletes an existing tenant.
 *

#### Parameters

##### input

[`deleteTenantInput`](../type-aliases/deleteTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  await camunda.deleteTenant({ tenantId });
}
```

#### Operation Id

deleteTenant

#### Tags

Tenant

***

### deleteTenantClusterVariable()

```ts
deleteTenantClusterVariable(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4916](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4916)

Delete a tenant-scoped cluster variable

Delete a tenant-scoped cluster variable.
 *

#### Parameters

##### input

[`deleteTenantClusterVariableInput`](../type-aliases/deleteTenantClusterVariableInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteTenantClusterVariableExample() {
  const camunda = createCamundaClient();

  await camunda.deleteTenantClusterVariable({
    tenantId: TenantId.assumeExists('customer-service'),
    name: 'config',
  });
}
```

#### Operation Id

deleteTenantClusterVariable

#### Tags

Cluster Variable

***

### deleteUser()

```ts
deleteUser(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:4978](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L4978)

Delete user

Deletes a user.
 *

#### Parameters

##### input

[`deleteUserInput`](../type-aliases/deleteUserInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function deleteUserExample() {
  const camunda = createCamundaClient();

  const username = Username.assumeExists('alice');

  await camunda.deleteUser({ username });
}
```

#### Operation Id

deleteUser

#### Tags

User

***

### deployResourcesFromFiles()

```ts
deployResourcesFromFiles(resourceFilenames, options?): CancelablePromise<ExtendedDeploymentResult>;
```

Defined in: [gen/CamundaClient.ts:13738](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13738)

Node-only convenience: deploy resources from local filesystem paths.

#### Parameters

##### resourceFilenames

`string`[]

Absolute or relative file paths to BPMN/DMN/form/resource files.

##### options?

Optional: tenantId.

###### tenantId?

`string`

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ExtendedDeploymentResult`](../interfaces/ExtendedDeploymentResult.md)\>

ExtendedDeploymentResult

***

### emitSupportLogPreamble()

```ts
emitSupportLogPreamble(): void;
```

Defined in: [gen/CamundaClient.ts:1472](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1472)

Emit the standard support log preamble & redacted configuration to the current support logger.
Safe to call multiple times; subsequent calls are ignored (idempotent).
Useful when a custom supportLogger was injected and you still want the canonical header & config dump.

#### Returns

`void`

***

### evaluateConditionals()

```ts
evaluateConditionals(input, options?): CancelablePromise<EvaluateConditionalResult>;
```

Defined in: [gen/CamundaClient.ts:5043](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5043)

Evaluate root level conditional start events

Evaluates root-level conditional start events for process definitions.
If the evaluation is successful, it will return the keys of all created process instances, along with their associated process definition key.
Multiple root-level conditional start events of the same process definition can trigger if their conditions evaluate to true.

 *

#### Parameters

##### input

[`ConditionalEvaluationInstruction`](../type-aliases/ConditionalEvaluationInstruction.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`EvaluateConditionalResult`](../type-aliases/EvaluateConditionalResult.md)\>

#### Example

```ts
async function evaluateConditionalsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.evaluateConditionals({
    variables: { orderReady: true },
    tenantId: TenantId.assumeExists('customer-service'),
  });

  console.log(`Evaluated conditionals: ${JSON.stringify(result)}`);
}
```

#### Operation Id

evaluateConditionals

#### Tags

Conditional

***

### evaluateDecision()

```ts
evaluateDecision(input, options?): CancelablePromise<EvaluateDecisionResult>;
```

Defined in: [gen/CamundaClient.ts:5115](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5115)

Evaluate decision

Evaluates a decision.
You specify the decision to evaluate either by using its unique key (as returned by
DeployResource), or using the decision ID. When using the decision ID, the latest deployed
version of the decision is used.

 *

#### Parameters

##### input

[`DecisionEvaluationById`](../type-aliases/DecisionEvaluationById.md) | [`DecisionEvaluationByKey`](../type-aliases/DecisionEvaluationByKey.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`EvaluateDecisionResult`](../type-aliases/EvaluateDecisionResult.md)\>

#### Examples

```ts
async function evaluateDecisionByIdExample() {
  const camunda = createCamundaClient();

  const result = await camunda.evaluateDecision({
    decisionDefinitionId: DecisionDefinitionId.assumeExists('invoice-classification'),
    variables: {
      amount: 1000,
      invoiceCategory: 'Misc',
    },
  });

  console.log(`Decision: ${result.decisionDefinitionId}`);
  console.log(`Output: ${result.output}`);
}
```

```ts
async function evaluateDecisionByKeyExample() {
  const camunda = createCamundaClient();

  const decisionDefinitionKey = DecisionDefinitionKey.assumeExists('2251799813685249');

  const result = await camunda.evaluateDecision({
    decisionDefinitionKey,
    variables: {
      amount: 1000,
      invoiceCategory: 'Misc',
    },
  });

  console.log(`Decision output: ${result.output}`);
}
```

#### Operation Id

evaluateDecision

#### Tags

Decision definition

***

### evaluateExpression()

```ts
evaluateExpression(input, options?): CancelablePromise<ExpressionEvaluationResult>;
```

Defined in: [gen/CamundaClient.ts:5181](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5181)

Evaluate an expression

Evaluates a FEEL expression and returns the result. Supports references to tenant scoped cluster variables when a tenant ID is provided.
 *

#### Parameters

##### input

[`ExpressionEvaluationRequest`](../type-aliases/ExpressionEvaluationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ExpressionEvaluationResult`](../type-aliases/ExpressionEvaluationResult.md)\>

#### Example

```ts
async function evaluateExpressionExample() {
  const camunda = createCamundaClient();

  const result = await camunda.evaluateExpression({
    expression: '= x + y',
    variables: { x: 10, y: 20 },
  });

  console.log(`Result: ${result.result}`);
}
```

#### Operation Id

evaluateExpression

#### Tags

Expression

***

### failJob()

```ts
failJob(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:5248](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5248)

Fail job

Mark the job as failed.

 *

#### Parameters

##### input

[`failJobInput`](../type-aliases/failJobInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function failJobExample() {
  const camunda = createCamundaClient();

  const jobKey = JobKey.assumeExists('2251799813685249');

  await camunda.failJob({
    jobKey,
    retries: 2,
    errorMessage: 'Payment gateway timeout',
    retryBackOff: 5000,
  });
}
```

#### Operation Id

failJob

#### Tags

Job

***

### forceAuthRefresh()

```ts
forceAuthRefresh(): Promise<string | undefined>;
```

Defined in: [gen/CamundaClient.ts:1439](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1439)

#### Returns

`Promise`\<`string` \| `undefined`\>

***

### getAuditLog()

```ts
getAuditLog(
   input, 
   consistencyManagement, 
options?): CancelablePromise<AuditLogResult>;
```

Defined in: [gen/CamundaClient.ts:5313](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5313)

Get audit log

Get an audit log entry by auditLogKey.
 *

#### Parameters

##### input

[`getAuditLogInput`](../type-aliases/getAuditLogInput.md)

##### consistencyManagement

[`getAuditLogConsistency`](../type-aliases/getAuditLogConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuditLogResult`](../type-aliases/AuditLogResult.md)\>

#### Example

```ts
async function getAuditLogExample() {
  const camunda = createCamundaClient();

  const { AuditLogKey } = await import('@camunda8/orchestration-cluster-api');
  const auditLogKey = AuditLogKey.assumeExists('2251799813685249');

  const log = await camunda.getAuditLog({ auditLogKey }, { consistency: { waitUpToMs: 5000 } });

  console.log(`Audit log: ${log.operationType}`);
}
```

#### Operation Id

getAuditLog

#### Tags

Audit Log

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getAuthentication()

```ts
getAuthentication(options?): CancelablePromise<CamundaUserResult>;
```

Defined in: [gen/CamundaClient.ts:5379](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5379)

Get current user

Retrieves the current authenticated user.
 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`CamundaUserResult`](../type-aliases/CamundaUserResult.md)\>

#### Example

```ts
async function getAuthenticationExample() {
  const camunda = createCamundaClient();

  const user = await camunda.getAuthentication();

  console.log(`Authenticated as: ${user.username}`);
}
```

#### Operation Id

getAuthentication

#### Tags

Authentication

***

### getAuthHeaders()

```ts
getAuthHeaders(): Promise<Record<string, string>>;
```

Defined in: [gen/CamundaClient.ts:1436](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1436)

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

***

### getAuthorization()

```ts
getAuthorization(
   input, 
   consistencyManagement, 
options?): CancelablePromise<AuthorizationResult>;
```

Defined in: [gen/CamundaClient.ts:5432](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5432)

Get authorization

Get authorization by the given key.
 *

#### Parameters

##### input

[`getAuthorizationInput`](../type-aliases/getAuthorizationInput.md)

##### consistencyManagement

[`getAuthorizationConsistency`](../type-aliases/getAuthorizationConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuthorizationResult`](../type-aliases/AuthorizationResult.md)\>

#### Example

```ts
async function getAuthorizationExample() {
  const camunda = createCamundaClient();

  const authorizationKey = AuthorizationKey.assumeExists('2251799813685249');

  const authorization = await camunda.getAuthorization(
    { authorizationKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Owner: ${authorization.ownerId} (${authorization.ownerType})`);
}
```

#### Operation Id

getAuthorization

#### Tags

Authorization

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getBackpressureState()

```ts
getBackpressureState(): 
  | {
  backoffMs: number;
  consecutive: number;
  permitsCurrent: number;
  permitsMax: number | null;
  severity: BackpressureSeverity;
  waiters: number;
}
  | {
  consecutive: number;
  permitsCurrent: number;
  permitsMax: null;
  severity: string;
  waiters: number;
};
```

Defined in: [gen/CamundaClient.ts:1554](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1554)

Public accessor for current backpressure adaptive limiter state (stable)

#### Returns

  \| \{
  `backoffMs`: `number`;
  `consecutive`: `number`;
  `permitsCurrent`: `number`;
  `permitsMax`: `number` \| `null`;
  `severity`: [`BackpressureSeverity`](../type-aliases/BackpressureSeverity.md);
  `waiters`: `number`;
\}
  \| \{
  `consecutive`: `number`;
  `permitsCurrent`: `number`;
  `permitsMax`: `null`;
  `severity`: `string`;
  `waiters`: `number`;
\}

***

### getBatchOperation()

```ts
getBatchOperation(
   input, 
   consistencyManagement, 
options?): CancelablePromise<BatchOperationResponse>;
```

Defined in: [gen/CamundaClient.ts:5499](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5499)

Get batch operation

Get batch operation by key.
 *

#### Parameters

##### input

[`getBatchOperationInput`](../type-aliases/getBatchOperationInput.md)

##### consistencyManagement

[`getBatchOperationConsistency`](../type-aliases/getBatchOperationConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationResponse`](../type-aliases/BatchOperationResponse.md)\>

#### Example

```ts
async function getBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  const batch = await camunda.getBatchOperation(
    { batchOperationKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Batch: ${batch.batchOperationType} (${batch.state})`);
}
```

#### Operation Id

getBatchOperation

#### Tags

Batch operation

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getConfig()

```ts
getConfig(): Readonly<CamundaConfig>;
```

Defined in: [gen/CamundaClient.ts:1339](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1339)

Read-only snapshot of current hydrated configuration (do not mutate directly).
Use configure(...) to apply changes.

#### Returns

`Readonly`\<[`CamundaConfig`](../interfaces/CamundaConfig.md)\>

***

### getDecisionDefinition()

```ts
getDecisionDefinition(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionDefinitionResult>;
```

Defined in: [gen/CamundaClient.ts:5566](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5566)

Get decision definition

Returns a decision definition by key.
 *

#### Parameters

##### input

[`getDecisionDefinitionInput`](../type-aliases/getDecisionDefinitionInput.md)

##### consistencyManagement

[`getDecisionDefinitionConsistency`](../type-aliases/getDecisionDefinitionConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionDefinitionResult`](../type-aliases/DecisionDefinitionResult.md)\>

#### Example

```ts
async function getDecisionDefinitionExample() {
  const camunda = createCamundaClient();

  const decisionDefinitionKey = DecisionDefinitionKey.assumeExists('2251799813685249');

  const definition = await camunda.getDecisionDefinition(
    { decisionDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Decision: ${definition.decisionDefinitionId}`);
  console.log(`Version: ${definition.version}`);
}
```

#### Operation Id

getDecisionDefinition

#### Tags

Decision definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getDecisionDefinitionXml()

```ts
getDecisionDefinitionXml(
   input, 
   consistencyManagement, 
options?): CancelablePromise<string>;
```

Defined in: [gen/CamundaClient.ts:5631](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5631)

Get decision definition XML

Returns decision definition as XML.
 *

#### Parameters

##### input

[`getDecisionDefinitionXmlInput`](../type-aliases/getDecisionDefinitionXmlInput.md)

##### consistencyManagement

[`getDecisionDefinitionXmlConsistency`](../type-aliases/getDecisionDefinitionXmlConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`string`\>

#### Operation Id

getDecisionDefinitionXML

#### Tags

Decision definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getDecisionInstance()

```ts
getDecisionInstance(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionInstanceGetQueryResult>;
```

Defined in: [gen/CamundaClient.ts:5698](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5698)

Get decision instance

Returns a decision instance.
 *

#### Parameters

##### input

[`getDecisionInstanceInput`](../type-aliases/getDecisionInstanceInput.md)

##### consistencyManagement

[`getDecisionInstanceConsistency`](../type-aliases/getDecisionInstanceConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionInstanceGetQueryResult`](../type-aliases/DecisionInstanceGetQueryResult.md)\>

#### Example

```ts
async function getDecisionInstanceExample() {
  const camunda = createCamundaClient();

  const decisionEvaluationInstanceKey =
    DecisionEvaluationInstanceKey.assumeExists('2251799813685249');

  const instance = await camunda.getDecisionInstance(
    { decisionEvaluationInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Decision: ${instance.decisionDefinitionId}`);
}
```

#### Operation Id

getDecisionInstance

#### Tags

Decision instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getDecisionRequirements()

```ts
getDecisionRequirements(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionRequirementsResult>;
```

Defined in: [gen/CamundaClient.ts:5765](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5765)

Get decision requirements

Returns Decision Requirements as JSON.
 *

#### Parameters

##### input

[`getDecisionRequirementsInput`](../type-aliases/getDecisionRequirementsInput.md)

##### consistencyManagement

[`getDecisionRequirementsConsistency`](../type-aliases/getDecisionRequirementsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionRequirementsResult`](../type-aliases/DecisionRequirementsResult.md)\>

#### Example

```ts
async function getDecisionRequirementsExample() {
  const camunda = createCamundaClient();

  const decisionRequirementsKey = DecisionRequirementsKey.assumeExists('2251799813685249');

  const requirements = await camunda.getDecisionRequirements(
    { decisionRequirementsKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Requirements: ${requirements.decisionRequirementsId}`);
}
```

#### Operation Id

getDecisionRequirements

#### Tags

Decision requirements

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getDecisionRequirementsXml()

```ts
getDecisionRequirementsXml(
   input, 
   consistencyManagement, 
options?): CancelablePromise<string>;
```

Defined in: [gen/CamundaClient.ts:5830](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5830)

Get decision requirements XML

Returns decision requirements as XML.
 *

#### Parameters

##### input

[`getDecisionRequirementsXmlInput`](../type-aliases/getDecisionRequirementsXmlInput.md)

##### consistencyManagement

[`getDecisionRequirementsXmlConsistency`](../type-aliases/getDecisionRequirementsXmlConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`string`\>

#### Operation Id

getDecisionRequirementsXML

#### Tags

Decision requirements

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getDocument()

```ts
getDocument(input, options?): CancelablePromise<Blob>;
```

Defined in: [gen/CamundaClient.ts:5897](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5897)

Download document

Download a document from the Camunda 8 cluster.

Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)

 *

#### Parameters

##### input

[`getDocumentInput`](../type-aliases/getDocumentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`Blob`\>

#### Operation Id

getDocument

#### Tags

Document

***

### getElementInstance()

```ts
getElementInstance(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ElementInstanceResult>;
```

Defined in: [gen/CamundaClient.ts:5962](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L5962)

Get element instance

Returns element instance as JSON.
 *

#### Parameters

##### input

[`getElementInstanceInput`](../type-aliases/getElementInstanceInput.md)

##### consistencyManagement

[`getElementInstanceConsistency`](../type-aliases/getElementInstanceConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ElementInstanceResult`](../type-aliases/ElementInstanceResult.md)\>

#### Example

```ts
async function getElementInstanceExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  const element = await camunda.getElementInstance(
    { elementInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Element: ${element.elementId} (${element.type})`);
}
```

#### Operation Id

getElementInstance

#### Tags

Element instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getErrorMode()

```ts
getErrorMode(): "throw" | "result";
```

Defined in: [gen/CamundaClient.ts:1458](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1458)

Internal accessor (read-only) for eventual consistency error mode.

#### Returns

`"throw"` \| `"result"`

***

### getGlobalClusterVariable()

```ts
getGlobalClusterVariable(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:6029](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6029)

Get a global-scoped cluster variable

Get a global-scoped cluster variable.
 *

#### Parameters

##### input

[`getGlobalClusterVariableInput`](../type-aliases/getGlobalClusterVariableInput.md)

##### consistencyManagement

[`getGlobalClusterVariableConsistency`](../type-aliases/getGlobalClusterVariableConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function getGlobalClusterVariableExample() {
  const camunda = createCamundaClient();

  const variable = await camunda.getGlobalClusterVariable(
    { name: 'feature-flags' },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`${variable.name} = ${variable.value}`);
}
```

#### Operation Id

getGlobalClusterVariable

#### Tags

Cluster Variable

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getGlobalJobStatistics()

```ts
getGlobalJobStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<GlobalJobStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6097](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6097)

Global job statistics

Returns global aggregated counts for jobs. Optionally filter by the creation time window and/or jobType.

 *

#### Parameters

##### input

[`getGlobalJobStatisticsInput`](../type-aliases/getGlobalJobStatisticsInput.md)

##### consistencyManagement

[`getGlobalJobStatisticsConsistency`](../type-aliases/getGlobalJobStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GlobalJobStatisticsQueryResult`](../type-aliases/GlobalJobStatisticsQueryResult.md)\>

#### Example

```ts
async function getGlobalJobStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getGlobalJobStatistics(
    {
      from: '2025-01-01T00:00:00Z',
      to: '2025-12-31T23:59:59Z',
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Statistics retrieved: ${JSON.stringify(result)}`);
}
```

#### Operation Id

getGlobalJobStatistics

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getGlobalTaskListener()

```ts
getGlobalTaskListener(
   input, 
   consistencyManagement, 
options?): CancelablePromise<GlobalTaskListenerResult>;
```

Defined in: [gen/CamundaClient.ts:6164](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6164)

Get global user task listener

Get a global user task listener by its id.
 *

#### Parameters

##### input

[`getGlobalTaskListenerInput`](../type-aliases/getGlobalTaskListenerInput.md)

##### consistencyManagement

[`getGlobalTaskListenerConsistency`](../type-aliases/getGlobalTaskListenerConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GlobalTaskListenerResult`](../type-aliases/GlobalTaskListenerResult.md)\>

#### Example

```ts
async function getGlobalTaskListenerExample() {
  const camunda = createCamundaClient();

  const listener = await camunda.getGlobalTaskListener(
    { id: GlobalListenerId.assumeExists('listener-123') },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Listener: ${listener.type} (${listener.eventTypes})`);
}
```

#### Operation Id

getGlobalTaskListener

#### Tags

Global listener

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getGroup()

```ts
getGroup(
   input, 
   consistencyManagement, 
options?): CancelablePromise<GroupResult>;
```

Defined in: [gen/CamundaClient.ts:6231](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6231)

Get group

Get a group by its ID.
 *

#### Parameters

##### input

[`getGroupInput`](../type-aliases/getGroupInput.md)

##### consistencyManagement

[`getGroupConsistency`](../type-aliases/getGroupConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GroupResult`](../type-aliases/GroupResult.md)\>

#### Example

```ts
async function getGroupExample() {
  const camunda = createCamundaClient();

  const group = await camunda.getGroup(
    { groupId: 'engineering-team' },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Group: ${group.name}`);
}
```

#### Operation Id

getGroup

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getIncident()

```ts
getIncident(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentResult>;
```

Defined in: [gen/CamundaClient.ts:6299](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6299)

Get incident

Returns incident as JSON.

 *

#### Parameters

##### input

[`getIncidentInput`](../type-aliases/getIncidentInput.md)

##### consistencyManagement

[`getIncidentConsistency`](../type-aliases/getIncidentConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentResult`](../type-aliases/IncidentResult.md)\>

#### Example

```ts
async function getIncidentExample() {
  const camunda = createCamundaClient();

  const incidentKey = IncidentKey.assumeExists('2251799813685249');

  const incident = await camunda.getIncident(
    { incidentKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Type: ${incident.errorType}`);
  console.log(`State: ${incident.state}`);
  console.log(`Message: ${incident.errorMessage}`);
}
```

#### Operation Id

getIncident

#### Tags

Incident

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getJobErrorStatistics()

```ts
getJobErrorStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<JobErrorStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6367](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6367)

Get error metrics for a job type

Returns aggregated metrics per error for the given jobType.

 *

#### Parameters

##### input

[`JobErrorStatisticsQuery`](../type-aliases/JobErrorStatisticsQuery.md)

##### consistencyManagement

[`getJobErrorStatisticsConsistency`](../type-aliases/getJobErrorStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`JobErrorStatisticsQueryResult`](../type-aliases/JobErrorStatisticsQueryResult.md)\>

#### Example

```ts
async function getJobErrorStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getJobErrorStatistics(
    {
      filter: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-12-31T23:59:59Z',
        jobType: 'payment-processing',
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Error: ${stat.errorMessage}, workers: ${stat.workers}`);
  }
}
```

#### Operation Id

getJobErrorStatistics

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getJobTimeSeriesStatistics()

```ts
getJobTimeSeriesStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<JobTimeSeriesStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6437](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6437)

Get time-series metrics for a job type

Returns a list of time-bucketed metrics ordered ascending by time.
The `from` and `to` fields select the time window of interest.
Each item in the response corresponds to one time bucket of the requested resolution.

 *

#### Parameters

##### input

[`JobTimeSeriesStatisticsQuery`](../type-aliases/JobTimeSeriesStatisticsQuery.md)

##### consistencyManagement

[`getJobTimeSeriesStatisticsConsistency`](../type-aliases/getJobTimeSeriesStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`JobTimeSeriesStatisticsQueryResult`](../type-aliases/JobTimeSeriesStatisticsQueryResult.md)\>

#### Example

```ts
async function getJobTimeSeriesStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getJobTimeSeriesStatistics(
    {
      filter: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-12-31T23:59:59Z',
        jobType: 'payment-processing',
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const point of result.items ?? []) {
    console.log(`Time: ${point.time}, created: ${point.created.count}`);
  }
}
```

#### Operation Id

getJobTimeSeriesStatistics

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getJobTypeStatistics()

```ts
getJobTypeStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<JobTypeStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6505](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6505)

Get job statistics by type

Get statistics about jobs, grouped by job type.

 *

#### Parameters

##### input

[`JobTypeStatisticsQuery`](../type-aliases/JobTypeStatisticsQuery.md)

##### consistencyManagement

[`getJobTypeStatisticsConsistency`](../type-aliases/getJobTypeStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`JobTypeStatisticsQueryResult`](../type-aliases/JobTypeStatisticsQueryResult.md)\>

#### Example

```ts
async function getJobTypeStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getJobTypeStatistics({}, { consistency: { waitUpToMs: 5000 } });

  for (const stat of result.items ?? []) {
    console.log(`Type: ${stat.jobType}, workers: ${stat.workers}`);
  }
}
```

#### Operation Id

getJobTypeStatistics

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getJobWorkerStatistics()

```ts
getJobWorkerStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<JobWorkerStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6573](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6573)

Get job statistics by worker

Get statistics about jobs, grouped by worker, for a given job type.

 *

#### Parameters

##### input

[`JobWorkerStatisticsQuery`](../type-aliases/JobWorkerStatisticsQuery.md)

##### consistencyManagement

[`getJobWorkerStatisticsConsistency`](../type-aliases/getJobWorkerStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`JobWorkerStatisticsQueryResult`](../type-aliases/JobWorkerStatisticsQueryResult.md)\>

#### Example

```ts
async function getJobWorkerStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getJobWorkerStatistics(
    {
      filter: {
        from: '2025-01-01T00:00:00Z',
        to: '2025-12-31T23:59:59Z',
        jobType: 'payment-processing',
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Worker: ${stat.worker}, completed: ${stat.completed.count}`);
  }
}
```

#### Operation Id

getJobWorkerStatistics

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getLicense()

```ts
getLicense(options?): CancelablePromise<LicenseResponse>;
```

Defined in: [gen/CamundaClient.ts:6639](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6639)

Get license status

Obtains the status of the current Camunda license.
 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`LicenseResponse`](../type-aliases/LicenseResponse.md)\>

#### Example

```ts
async function getLicenseExample() {
  const camunda = createCamundaClient();

  const license = await camunda.getLicense();

  console.log(`License type: ${license.validLicense}`);
}
```

#### Operation Id

getLicense

#### Tags

License

***

### getMappingRule()

```ts
getMappingRule(
   input, 
   consistencyManagement, 
options?): CancelablePromise<MappingRuleResult>;
```

Defined in: [gen/CamundaClient.ts:6693](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6693)

Get a mapping rule

Gets the mapping rule with the given ID.

 *

#### Parameters

##### input

[`getMappingRuleInput`](../type-aliases/getMappingRuleInput.md)

##### consistencyManagement

[`getMappingRuleConsistency`](../type-aliases/getMappingRuleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MappingRuleResult`](../type-aliases/MappingRuleResult.md)\>

#### Example

```ts
async function getMappingRuleExample() {
  const camunda = createCamundaClient();

  const rule = await camunda.getMappingRule(
    { mappingRuleId: 'ldap-group-mapping' },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Rule: ${rule.name} (${rule.claimName}=${rule.claimValue})`);
}
```

#### Operation Id

getMappingRule

#### Tags

Mapping rule

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinition()

```ts
getProcessDefinition(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionResult>;
```

Defined in: [gen/CamundaClient.ts:6760](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6760)

Get process definition

Returns process definition as JSON.
 *

#### Parameters

##### input

[`getProcessDefinitionInput`](../type-aliases/getProcessDefinitionInput.md)

##### consistencyManagement

[`getProcessDefinitionConsistency`](../type-aliases/getProcessDefinitionConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionResult`](../type-aliases/ProcessDefinitionResult.md)\>

#### Example

```ts
async function getProcessDefinitionExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const definition = await camunda.getProcessDefinition(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Process: ${definition.processDefinitionId} v${definition.version}`);
}
```

#### Operation Id

getProcessDefinition

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinitionInstanceStatistics()

```ts
getProcessDefinitionInstanceStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionInstanceStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6828](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6828)

Get process instance statistics

Get statistics about process instances, grouped by process definition and tenant.

 *

#### Parameters

##### input

[`ProcessDefinitionInstanceStatisticsQuery`](../type-aliases/ProcessDefinitionInstanceStatisticsQuery.md)

##### consistencyManagement

[`getProcessDefinitionInstanceStatisticsConsistency`](../type-aliases/getProcessDefinitionInstanceStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionInstanceStatisticsQueryResult`](../type-aliases/ProcessDefinitionInstanceStatisticsQueryResult.md)\>

#### Example

```ts
async function getProcessDefinitionInstanceStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionInstanceStatistics(
    {},
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Definition ${stat.processDefinitionId}: ${stat.activeInstancesWithoutIncidentCount} active`
    );
  }
}
```

#### Operation Id

getProcessDefinitionInstanceStatistics

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinitionInstanceVersionStatistics()

```ts
getProcessDefinitionInstanceVersionStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionInstanceVersionStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6897](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6897)

Get process instance statistics by version

Get statistics about process instances, grouped by version for a given process definition.
The process definition ID must be provided as a required field in the request body filter.

 *

#### Parameters

##### input

[`ProcessDefinitionInstanceVersionStatisticsQuery`](../type-aliases/ProcessDefinitionInstanceVersionStatisticsQuery.md)

##### consistencyManagement

[`getProcessDefinitionInstanceVersionStatisticsConsistency`](../type-aliases/getProcessDefinitionInstanceVersionStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionInstanceVersionStatisticsQueryResult`](../type-aliases/ProcessDefinitionInstanceVersionStatisticsQueryResult.md)\>

#### Example

```ts
async function getProcessDefinitionInstanceVersionStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionInstanceVersionStatistics(
    {
      filter: {
        processDefinitionId: ProcessDefinitionId.assumeExists('order-process'),
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Version ${stat.processDefinitionVersion}: ${stat.activeInstancesWithoutIncidentCount} active`
    );
  }
}
```

#### Operation Id

getProcessDefinitionInstanceVersionStatistics

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinitionMessageSubscriptionStatistics()

```ts
getProcessDefinitionMessageSubscriptionStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionMessageSubscriptionStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:6965](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L6965)

Get message subscription statistics

Get message subscription statistics, grouped by process definition.

 *

#### Parameters

##### input

[`ProcessDefinitionMessageSubscriptionStatisticsQuery`](../type-aliases/ProcessDefinitionMessageSubscriptionStatisticsQuery.md)

##### consistencyManagement

[`getProcessDefinitionMessageSubscriptionStatisticsConsistency`](../type-aliases/getProcessDefinitionMessageSubscriptionStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionMessageSubscriptionStatisticsQueryResult`](../type-aliases/ProcessDefinitionMessageSubscriptionStatisticsQueryResult.md)\>

#### Example

```ts
async function getProcessDefinitionMessageSubscriptionStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionMessageSubscriptionStatistics(
    {},
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Definition ${stat.processDefinitionId}: ${stat.activeSubscriptions} subscriptions`
    );
  }
}
```

#### Operation Id

getProcessDefinitionMessageSubscriptionStatistics

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinitionStatistics()

```ts
getProcessDefinitionStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionElementStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:7032](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7032)

Get process definition statistics

Get statistics about elements in currently running process instances by process definition key and search filter.
 *

#### Parameters

##### input

[`getProcessDefinitionStatisticsInput`](../type-aliases/getProcessDefinitionStatisticsInput.md)

##### consistencyManagement

[`getProcessDefinitionStatisticsConsistency`](../type-aliases/getProcessDefinitionStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionElementStatisticsQueryResult`](../type-aliases/ProcessDefinitionElementStatisticsQueryResult.md)\>

#### Example

```ts
async function getProcessDefinitionStatisticsExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessDefinitionStatistics(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Element ${stat.elementId}: active=${stat.active}`);
  }
}
```

#### Operation Id

getProcessDefinitionStatistics

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessDefinitionXml()

```ts
getProcessDefinitionXml(
   input, 
   consistencyManagement, 
options?): CancelablePromise<string>;
```

Defined in: [gen/CamundaClient.ts:7099](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7099)

Get process definition XML

Returns process definition as XML.
 *

#### Parameters

##### input

[`getProcessDefinitionXmlInput`](../type-aliases/getProcessDefinitionXmlInput.md)

##### consistencyManagement

[`getProcessDefinitionXmlConsistency`](../type-aliases/getProcessDefinitionXmlConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`string`\>

#### Operation Id

getProcessDefinitionXML

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstance()

```ts
getProcessInstance(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessInstanceResult>;
```

Defined in: [gen/CamundaClient.ts:7166](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7166)

Get process instance

Get the process instance by the process instance key.
 *

#### Parameters

##### input

[`getProcessInstanceInput`](../type-aliases/getProcessInstanceInput.md)

##### consistencyManagement

[`getProcessInstanceConsistency`](../type-aliases/getProcessInstanceConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessInstanceResult`](../type-aliases/ProcessInstanceResult.md)\>

#### Example

```ts
async function getProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const instance = await camunda.getProcessInstance(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`State: ${instance.state}`);
  console.log(`Process: ${instance.processDefinitionId}`);
}
```

#### Operation Id

getProcessInstance

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstanceCallHierarchy()

```ts
getProcessInstanceCallHierarchy(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessInstanceCallHierarchyEntry[]>;
```

Defined in: [gen/CamundaClient.ts:7233](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7233)

Get call hierarchy

Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
 *

#### Parameters

##### input

[`getProcessInstanceCallHierarchyInput`](../type-aliases/getProcessInstanceCallHierarchyInput.md)

##### consistencyManagement

[`getProcessInstanceCallHierarchyConsistency`](../type-aliases/getProcessInstanceCallHierarchyConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessInstanceCallHierarchyEntry`](../type-aliases/ProcessInstanceCallHierarchyEntry.md)[]\>

#### Example

```ts
async function getProcessInstanceCallHierarchyExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceCallHierarchy(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Call hierarchy entries: ${result.length}`);
}
```

#### Operation Id

getProcessInstanceCallHierarchy

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstanceSequenceFlows()

```ts
getProcessInstanceSequenceFlows(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessInstanceSequenceFlowsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:7300](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7300)

Get sequence flows

Get sequence flows taken by the process instance.
 *

#### Parameters

##### input

[`getProcessInstanceSequenceFlowsInput`](../type-aliases/getProcessInstanceSequenceFlowsInput.md)

##### consistencyManagement

[`getProcessInstanceSequenceFlowsConsistency`](../type-aliases/getProcessInstanceSequenceFlowsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessInstanceSequenceFlowsQueryResult`](../type-aliases/ProcessInstanceSequenceFlowsQueryResult.md)\>

#### Example

```ts
async function getProcessInstanceSequenceFlowsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceSequenceFlows(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const flow of result.items ?? []) {
    console.log(`Sequence flow: ${flow.sequenceFlowId}`);
  }
}
```

#### Operation Id

getProcessInstanceSequenceFlows

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstanceStatistics()

```ts
getProcessInstanceStatistics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessInstanceElementStatisticsQueryResult>;
```

Defined in: [gen/CamundaClient.ts:7367](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7367)

Get element instance statistics

Get statistics about elements by the process instance key.
 *

#### Parameters

##### input

[`getProcessInstanceStatisticsInput`](../type-aliases/getProcessInstanceStatisticsInput.md)

##### consistencyManagement

[`getProcessInstanceStatisticsConsistency`](../type-aliases/getProcessInstanceStatisticsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessInstanceElementStatisticsQueryResult`](../type-aliases/ProcessInstanceElementStatisticsQueryResult.md)\>

#### Example

```ts
async function getProcessInstanceStatisticsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceStatistics(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Element ${stat.elementId}: active=${stat.active}`);
  }
}
```

#### Operation Id

getProcessInstanceStatistics

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstanceStatisticsByDefinition()

```ts
getProcessInstanceStatisticsByDefinition(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentProcessInstanceStatisticsByDefinitionQueryResult>;
```

Defined in: [gen/CamundaClient.ts:7437](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7437)

Get process instance statistics by definition

Returns statistics for active process instances with incidents, grouped by process
definition. The result set is scoped to a specific incident error hash code, which must be
provided as a filter in the request body.

 *

#### Parameters

##### input

[`IncidentProcessInstanceStatisticsByDefinitionQuery`](../type-aliases/IncidentProcessInstanceStatisticsByDefinitionQuery.md)

##### consistencyManagement

[`getProcessInstanceStatisticsByDefinitionConsistency`](../type-aliases/getProcessInstanceStatisticsByDefinitionConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentProcessInstanceStatisticsByDefinitionQueryResult`](../type-aliases/IncidentProcessInstanceStatisticsByDefinitionQueryResult.md)\>

#### Example

```ts
async function getProcessInstanceStatisticsByDefinitionExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessInstanceStatisticsByDefinition(
    {
      filter: {
        errorHashCode: 12345,
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Definition ${stat.processDefinitionId}: ${stat.activeInstancesWithErrorCount} incidents`
    );
  }
}
```

#### Operation Id

getProcessInstanceStatisticsByDefinition

#### Tags

Incident

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getProcessInstanceStatisticsByError()

```ts
getProcessInstanceStatisticsByError(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentProcessInstanceStatisticsByErrorQueryResult>;
```

Defined in: [gen/CamundaClient.ts:7506](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7506)

Get process instance statistics by error

Returns statistics for active process instances that currently have active incidents,
grouped by incident error hash code.

 *

#### Parameters

##### input

[`IncidentProcessInstanceStatisticsByErrorQuery`](../type-aliases/IncidentProcessInstanceStatisticsByErrorQuery.md)

##### consistencyManagement

[`getProcessInstanceStatisticsByErrorConsistency`](../type-aliases/getProcessInstanceStatisticsByErrorConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentProcessInstanceStatisticsByErrorQueryResult`](../type-aliases/IncidentProcessInstanceStatisticsByErrorQueryResult.md)\>

#### Example

```ts
async function getProcessInstanceStatisticsByErrorExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessInstanceStatisticsByError(
    {},
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Error: ${stat.errorMessage}, count: ${stat.activeInstancesWithErrorCount}`);
  }
}
```

#### Operation Id

getProcessInstanceStatisticsByError

#### Tags

Incident

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getResource()

```ts
getResource(input, options?): CancelablePromise<ResourceResult>;
```

Defined in: [gen/CamundaClient.ts:7576](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7576)

Get resource

Returns a deployed resource.
:::info
Currently, this endpoint only supports RPA resources.
:::

 *

#### Parameters

##### input

[`getResourceInput`](../type-aliases/getResourceInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ResourceResult`](../type-aliases/ResourceResult.md)\>

#### Example

```ts
async function getResourceExample() {
  const camunda = createCamundaClient();

  const resource = await camunda.getResource({
    resourceKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
  });

  console.log(`Resource: ${resource.resourceName} (${resource.resourceId})`);
}
```

#### Operation Id

getResource

#### Tags

Resource

***

### getResourceContent()

```ts
getResourceContent(input, options?): CancelablePromise<string>;
```

Defined in: [gen/CamundaClient.ts:7642](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7642)

Get resource content

Returns the content of a deployed resource.
:::info
Currently, this endpoint only supports RPA resources.
:::

 *

#### Parameters

##### input

[`getResourceContentInput`](../type-aliases/getResourceContentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`string`\>

#### Example

```ts
async function getResourceContentExample() {
  const camunda = createCamundaClient();

  const content = await camunda.getResourceContent({
    resourceKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
  });

  console.log(`Content retrieved (type: ${typeof content})`);
}
```

#### Operation Id

getResourceContent

#### Tags

Resource

***

### getRole()

```ts
getRole(
   input, 
   consistencyManagement, 
options?): CancelablePromise<RoleResult>;
```

Defined in: [gen/CamundaClient.ts:7705](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7705)

Get role

Get a role by its ID.
 *

#### Parameters

##### input

[`getRoleInput`](../type-aliases/getRoleInput.md)

##### consistencyManagement

[`getRoleConsistency`](../type-aliases/getRoleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`RoleResult`](../type-aliases/RoleResult.md)\>

#### Example

```ts
async function getRoleExample() {
  const camunda = createCamundaClient();

  const role = await camunda.getRole(
    { roleId: 'process-admin' },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Role: ${role.name}`);
}
```

#### Operation Id

getRole

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getStartProcessForm()

```ts
getStartProcessForm(
   input, 
   consistencyManagement, 
options?): CancelablePromise<void | FormResult>;
```

Defined in: [gen/CamundaClient.ts:7774](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7774)

Get process start form

Get the start form of a process.
Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.

 *

#### Parameters

##### input

[`getStartProcessFormInput`](../type-aliases/getStartProcessFormInput.md)

##### consistencyManagement

[`getStartProcessFormConsistency`](../type-aliases/getStartProcessFormConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void` \| [`FormResult`](../type-aliases/FormResult.md)\>

#### Example

```ts
async function getStartProcessFormExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const form = await camunda.getStartProcessForm(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  if (form) {
    console.log(`Form key: ${form.formKey}`);
  }
}
```

#### Operation Id

getStartProcessForm

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getStatus()

```ts
getStatus(options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:7840](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7840)

Get cluster status

Checks the health status of the cluster by verifying if there's at least one partition with a healthy leader.
 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function getStatusExample() {
  const camunda = createCamundaClient();

  await camunda.getStatus();

  console.log('Cluster is healthy');
}
```

#### Operation Id

getStatus

#### Tags

Cluster

***

### getSystemConfiguration()

```ts
getSystemConfiguration(options?): CancelablePromise<SystemConfigurationResponse>;
```

Defined in: [gen/CamundaClient.ts:7897](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7897)

System configuration (alpha)

Returns the current system configuration. The response is an envelope
that groups settings by feature area.

This endpoint is an alpha feature and may be subject to change
in future releases.

 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SystemConfigurationResponse`](../type-aliases/SystemConfigurationResponse.md)\>

#### Example

```ts
async function getSystemConfigurationExample() {
  const camunda = createCamundaClient();

  const config = await camunda.getSystemConfiguration();

  console.log(`Configuration loaded: ${JSON.stringify(config)}`);
}
```

#### Operation Id

getSystemConfiguration

#### Tags

System

***

### getTenant()

```ts
getTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<TenantResult>;
```

Defined in: [gen/CamundaClient.ts:7950](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L7950)

Get tenant

Retrieves a single tenant by tenant ID.
 *

#### Parameters

##### input

[`getTenantInput`](../type-aliases/getTenantInput.md)

##### consistencyManagement

[`getTenantConsistency`](../type-aliases/getTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TenantResult`](../type-aliases/TenantResult.md)\>

#### Example

```ts
async function getTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  const tenant = await camunda.getTenant({ tenantId }, { consistency: { waitUpToMs: 5000 } });

  console.log(`Tenant: ${tenant.name}`);
}
```

#### Operation Id

getTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getTenantClusterVariable()

```ts
getTenantClusterVariable(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:8017](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8017)

Get a tenant-scoped cluster variable

Get a tenant-scoped cluster variable.
 *

#### Parameters

##### input

[`getTenantClusterVariableInput`](../type-aliases/getTenantClusterVariableInput.md)

##### consistencyManagement

[`getTenantClusterVariableConsistency`](../type-aliases/getTenantClusterVariableConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function getTenantClusterVariableExample() {
  const camunda = createCamundaClient();

  const variable = await camunda.getTenantClusterVariable(
    {
      tenantId: TenantId.assumeExists('customer-service'),
      name: 'config',
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`${variable.name} = ${variable.value}`);
}
```

#### Operation Id

getTenantClusterVariable

#### Tags

Cluster Variable

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getTopology()

```ts
getTopology(options?): CancelablePromise<TopologyResponse>;
```

Defined in: [gen/CamundaClient.ts:8083](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8083)

Get cluster topology

Obtains the current topology of the cluster the gateway is part of.
 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TopologyResponse`](../type-aliases/TopologyResponse.md)\>

#### Example

```ts
async function getTopologyExample() {
  const camunda = createCamundaClient();

  const topology = await camunda.getTopology();

  console.log(`Cluster size: ${topology.clusterSize}`);
  console.log(`Partitions: ${topology.partitionsCount}`);
  for (const broker of topology.brokers ?? []) {
    console.log(`  Broker ${broker.nodeId}: ${broker.host}:${broker.port}`);
  }
}
```

#### Operation Id

getTopology

#### Tags

Cluster

***

### getUsageMetrics()

```ts
getUsageMetrics(
   input, 
   consistencyManagement, 
options?): CancelablePromise<UsageMetricsResponse>;
```

Defined in: [gen/CamundaClient.ts:8136](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8136)

Get usage metrics

Retrieve the usage metrics based on given criteria.
 *

#### Parameters

##### input

[`getUsageMetricsInput`](../type-aliases/getUsageMetricsInput.md)

##### consistencyManagement

[`getUsageMetricsConsistency`](../type-aliases/getUsageMetricsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`UsageMetricsResponse`](../type-aliases/UsageMetricsResponse.md)\>

#### Example

```ts
async function getUsageMetricsExample() {
  const camunda = createCamundaClient();

  const metrics = await camunda.getUsageMetrics(
    {
      startTime: '2025-01-01T00:00:00Z',
      endTime: '2025-12-31T23:59:59Z',
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Usage metrics retrieved: ${JSON.stringify(metrics)}`);
}
```

#### Operation Id

getUsageMetrics

#### Tags

System

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getUser()

```ts
getUser(
   input, 
   consistencyManagement, 
   options?): CancelablePromise<{
  email: string | null;
  name: string | null;
  username: Username;
}>;
```

Defined in: [gen/CamundaClient.ts:8203](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8203)

Get user

Get a user by its username.
 *

#### Parameters

##### input

[`getUserInput`](../type-aliases/getUserInput.md)

##### consistencyManagement

[`getUserConsistency`](../type-aliases/getUserConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<\{
  `email`: `string` \| `null`;
  `name`: `string` \| `null`;
  `username`: [`Username`](../type-aliases/Username.md);
\}\>

#### Example

```ts
async function getUserExample() {
  const camunda = createCamundaClient();

  const username = Username.assumeExists('alice');

  const user = await camunda.getUser({ username }, { consistency: { waitUpToMs: 5000 } });

  console.log(`User: ${user.name} (${user.email})`);
}
```

#### Operation Id

getUser

#### Tags

User

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getUserTask()

```ts
getUserTask(
   input, 
   consistencyManagement, 
options?): CancelablePromise<UserTaskResult>;
```

Defined in: [gen/CamundaClient.ts:8270](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8270)

Get user task

Get the user task by the user task key.
 *

#### Parameters

##### input

[`getUserTaskInput`](../type-aliases/getUserTaskInput.md)

##### consistencyManagement

[`getUserTaskConsistency`](../type-aliases/getUserTaskConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`UserTaskResult`](../type-aliases/UserTaskResult.md)\>

#### Example

```ts
async function getUserTaskExample() {
  const camunda = createCamundaClient();

  const { UserTaskKey } = await import('@camunda8/orchestration-cluster-api');
  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  const task = await camunda.getUserTask({ userTaskKey }, { consistency: { waitUpToMs: 5000 } });

  console.log(`Task: ${task.name} (${task.state})`);
}
```

#### Operation Id

getUserTask

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getUserTaskForm()

```ts
getUserTaskForm(
   input, 
   consistencyManagement, 
options?): CancelablePromise<void | FormResult>;
```

Defined in: [gen/CamundaClient.ts:8339](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8339)

Get user task form

Get the form of a user task.
Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.

 *

#### Parameters

##### input

[`getUserTaskFormInput`](../type-aliases/getUserTaskFormInput.md)

##### consistencyManagement

[`getUserTaskFormConsistency`](../type-aliases/getUserTaskFormConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void` \| [`FormResult`](../type-aliases/FormResult.md)\>

#### Example

```ts
async function getUserTaskFormExample() {
  const camunda = createCamundaClient();

  const { UserTaskKey } = await import('@camunda8/orchestration-cluster-api');
  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  const form = await camunda.getUserTaskForm(
    { userTaskKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  if (form) {
    console.log(`Form key: ${form.formKey}`);
  }
}
```

#### Operation Id

getUserTaskForm

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getVariable()

```ts
getVariable(
   input, 
   consistencyManagement, 
options?): CancelablePromise<VariableResult>;
```

Defined in: [gen/CamundaClient.ts:8410](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8410)

Get variable

Get a variable by its key.

This endpoint returns both process-level and local (element-scoped) variables.
The variable's scopeKey indicates whether it's a process-level variable or scoped to a
specific element instance.
 *

#### Parameters

##### input

[`getVariableInput`](../type-aliases/getVariableInput.md)

##### consistencyManagement

[`getVariableConsistency`](../type-aliases/getVariableConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`VariableResult`](../type-aliases/VariableResult.md)\>

#### Example

```ts
async function getVariableExample() {
  const camunda = createCamundaClient();

  const variableKey = VariableKey.assumeExists('2251799813685249');

  const variable = await camunda.getVariable(
    { variableKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`${variable.name} = ${variable.value}`);
}
```

#### Operation Id

getVariable

#### Tags

Variable

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### getWorkers()

```ts
getWorkers(): any[];
```

Defined in: [gen/CamundaClient.ts:1569](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1569)

Return a read-only snapshot of currently registered job workers.

#### Returns

`any`[]

***

### logger()

```ts
logger(scope?): Logger;
```

Defined in: [gen/CamundaClient.ts:1453](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1453)

Access a scoped logger (internal & future user emission).

#### Parameters

##### scope?

`string`

#### Returns

[`Logger`](../../logger/interfaces/Logger.md)

***

### migrateProcessInstance()

```ts
migrateProcessInstance(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:8483](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8483)

Migrate process instance

Migrates a process instance to a new process definition.
This request can contain multiple mapping instructions to define mapping between the active
process instance's elements and target process definition elements.

Use this to upgrade a process instance to a new version of a process or to
a different process definition, e.g. to keep your running instances up-to-date with the
latest process improvements.

 *

#### Parameters

##### input

[`migrateProcessInstanceInput`](../type-aliases/migrateProcessInstanceInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function migrateProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.migrateProcessInstance({
    processInstanceKey,
    targetProcessDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685250'),
    mappingInstructions: [
      {
        sourceElementId: ElementId.assumeExists('task-a'),
        targetElementId: ElementId.assumeExists('task-b'),
      },
    ],
  });
}
```

#### Operation Id

migrateProcessInstance

#### Tags

Process instance

***

### migrateProcessInstancesBatchOperation()

```ts
migrateProcessInstancesBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:8551](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8551)

Migrate process instances (batch)

Migrate multiple process instances.
Since only process instances with ACTIVE state can be migrated, any given
filters for state are ignored and overridden during this batch operation.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`ProcessInstanceMigrationBatchOperationRequest`](../type-aliases/ProcessInstanceMigrationBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function migrateProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.migrateProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
    migrationPlan: {
      targetProcessDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685250'),
      mappingInstructions: [
        {
          sourceElementId: ElementId.assumeExists('task-a'),
          targetElementId: ElementId.assumeExists('task-b'),
        },
      ],
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

migrateProcessInstancesBatchOperation

#### Tags

Process instance

***

### modifyProcessInstance()

```ts
modifyProcessInstance(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:8619](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8619)

Modify process instance

Modifies a running process instance.
This request can contain multiple instructions to activate an element of the process or
to terminate an active instance of an element.

Use this to repair a process instance that is stuck on an element or took an unintended path.
For example, because an external system is not available or doesn't respond as expected.

 *

#### Parameters

##### input

[`modifyProcessInstanceInput`](../type-aliases/modifyProcessInstanceInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function modifyProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.modifyProcessInstance({
    processInstanceKey,
    activateInstructions: [{ elementId: ElementId.assumeExists('task-a') }],
    terminateInstructions: [
      { elementInstanceKey: ElementInstanceKey.assumeExists('2251799813685260') },
    ],
  });
}
```

#### Operation Id

modifyProcessInstance

#### Tags

Process instance

***

### modifyProcessInstancesBatchOperation()

```ts
modifyProcessInstancesBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:8689](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8689)

Modify process instances (batch)

Modify multiple process instances.
Since only process instances with ACTIVE state can be modified, any given
filters for state are ignored and overridden during this batch operation.
In contrast to single modification operation, it is not possible to add variable instructions or modify by element key.
It is only possible to use the element id of the source and target.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`ProcessInstanceModificationBatchOperationRequest`](../type-aliases/ProcessInstanceModificationBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function modifyProcessInstancesBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.modifyProcessInstancesBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
    moveInstructions: [
      {
        sourceElementId: ElementId.assumeExists('task-a'),
        targetElementId: ElementId.assumeExists('task-b'),
      },
    ],
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

modifyProcessInstancesBatchOperation

#### Tags

Process instance

***

### onAuthHeaders()

```ts
onAuthHeaders(h): void;
```

Defined in: [gen/CamundaClient.ts:1445](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1445)

#### Parameters

##### h

(`headers`) => 
  \| `Record`\<`string`, `string`\>
  \| `Promise`\<`Record`\<`string`, `string`\>\>

#### Returns

`void`

***

### pinClock()

```ts
pinClock(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:8757](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8757)

Pin internal clock (alpha)

Set a precise, static time for the Zeebe engine's internal clock.
When the clock is pinned, it remains at the specified time and does not advance.
To change the time, the clock must be pinned again with a new timestamp.

This endpoint is an alpha feature and may be subject to change
in future releases.

 *

#### Parameters

##### input

[`ClockPinRequest`](../type-aliases/ClockPinRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function pinClockExample() {
  const camunda = createCamundaClient();

  await camunda.pinClock({
    timestamp: 1735689599000,
  });

  console.log('Clock pinned');
}
```

#### Operation Id

pinClock

#### Tags

Clock

***

### publishMessage()

```ts
publishMessage(input, options?): CancelablePromise<MessagePublicationResult>;
```

Defined in: [gen/CamundaClient.ts:8824](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8824)

Publish message

Publishes a single message.
Messages are published to specific partitions computed from their correlation keys.
Messages can be buffered.
The endpoint does not wait for a correlation result.
Use the message correlation endpoint for such use cases.

 *

#### Parameters

##### input

[`MessagePublicationRequest`](../type-aliases/MessagePublicationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MessagePublicationResult`](../type-aliases/MessagePublicationResult.md)\>

#### Example

```ts
async function publishMessageExample() {
  const camunda = createCamundaClient();

  await camunda.publishMessage({
    name: 'order-payment-received',
    correlationKey: 'ORD-12345',
    timeToLive: 60000,
    variables: {
      paymentId: 'PAY-123',
    },
  });
}
```

#### Operation Id

publishMessage

#### Tags

Message

***

### resetClock()

```ts
resetClock(options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:8896](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8896)

Reset internal clock (alpha)

Resets the Zeebe engine's internal clock to the current system time, enabling it to tick in real-time.
This operation is useful for returning the clock to
normal behavior after it has been pinned to a specific time.

This endpoint is an alpha feature and may be subject to change
in future releases.

 *

#### Parameters

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function resetClockExample() {
  const camunda = createCamundaClient();

  await camunda.resetClock();

  console.log('Clock reset');
}
```

#### Operation Id

resetClock

#### Tags

Clock

***

### resolveIncident()

```ts
resolveIncident(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:8950](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L8950)

Resolve incident

Marks the incident as resolved; most likely a call to Update job will be necessary
to reset the job's retries, followed by this call.

 *

#### Parameters

##### input

[`resolveIncidentInput`](../type-aliases/resolveIncidentInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function resolveIncidentExample() {
  const camunda = createCamundaClient();

  const incidentKey = IncidentKey.assumeExists('2251799813685249');

  await camunda.resolveIncident({ incidentKey });
}
```

#### Operation Id

resolveIncident

#### Tags

Incident

***

### resolveIncidentsBatchOperation()

```ts
resolveIncidentsBatchOperation(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:9018](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9018)

Resolve related incidents (batch)

Resolves multiple instances of process instances.
Since only process instances with ACTIVE state can have unresolved incidents, any given
filters for state are ignored and overridden during this batch operation.
This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

[`ProcessInstanceIncidentResolutionBatchOperationRequest`](../type-aliases/ProcessInstanceIncidentResolutionBatchOperationRequest.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function resolveIncidentsBatchOperationExample() {
  const camunda = createCamundaClient();

  const result = await camunda.resolveIncidentsBatchOperation({
    filter: {
      processDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685249'),
    },
  });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

resolveIncidentsBatchOperation

#### Tags

Process instance

***

### resolveProcessInstanceIncidents()

```ts
resolveProcessInstanceIncidents(input, options?): CancelablePromise<BatchOperationCreatedResult>;
```

Defined in: [gen/CamundaClient.ts:9080](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9080)

Resolve related incidents

Creates a batch operation to resolve multiple incidents of a process instance.
 *

#### Parameters

##### input

[`resolveProcessInstanceIncidentsInput`](../type-aliases/resolveProcessInstanceIncidentsInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationCreatedResult`](../type-aliases/BatchOperationCreatedResult.md)\>

#### Example

```ts
async function resolveProcessInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.resolveProcessInstanceIncidents({ processInstanceKey });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
```

#### Operation Id

resolveProcessInstanceIncidents

#### Tags

Process instance

***

### resumeBatchOperation()

```ts
resumeBatchOperation(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:9144](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9144)

Resume Batch operation

Resumes a suspended batch operation.
This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

###### batchOperationKey

[`BatchOperationKey`](../type-aliases/BatchOperationKey.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function resumeBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.resumeBatchOperation({ batchOperationKey });
}
```

#### Operation Id

resumeBatchOperation

#### Tags

Batch operation

***

### searchAuditLogs()

```ts
searchAuditLogs(
   input, 
   consistencyManagement, 
options?): CancelablePromise<AuditLogSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9209](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9209)

Search audit logs

Search for audit logs based on given criteria.
 *

#### Parameters

##### input

[`AuditLogSearchQueryRequest`](../type-aliases/AuditLogSearchQueryRequest.md)

##### consistencyManagement

[`searchAuditLogsConsistency`](../type-aliases/searchAuditLogsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuditLogSearchQueryResult`](../type-aliases/AuditLogSearchQueryResult.md)\>

#### Example

```ts
async function searchAuditLogsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchAuditLogs(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const log of result.items ?? []) {
    console.log(`${log.auditLogKey}: ${log.operationType}`);
  }
}
```

#### Operation Id

searchAuditLogs

#### Tags

Audit Log

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchAuthorizations()

```ts
searchAuthorizations(
   input, 
   consistencyManagement, 
options?): CancelablePromise<AuthorizationSearchResult>;
```

Defined in: [gen/CamundaClient.ts:9276](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9276)

Search authorizations

Search for authorizations based on given criteria.
 *

#### Parameters

##### input

[`AuthorizationSearchQuery`](../type-aliases/AuthorizationSearchQuery.md)

##### consistencyManagement

[`searchAuthorizationsConsistency`](../type-aliases/searchAuthorizationsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuthorizationSearchResult`](../type-aliases/AuthorizationSearchResult.md)\>

#### Example

```ts
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
```

#### Operation Id

searchAuthorizations

#### Tags

Authorization

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchBatchOperationItems()

```ts
searchBatchOperationItems(
   input, 
   consistencyManagement, 
options?): CancelablePromise<BatchOperationItemSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9343](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9343)

Search batch operation items

Search for batch operation items based on given criteria.
 *

#### Parameters

##### input

[`BatchOperationItemSearchQuery`](../type-aliases/BatchOperationItemSearchQuery.md)

##### consistencyManagement

[`searchBatchOperationItemsConsistency`](../type-aliases/searchBatchOperationItemsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationItemSearchQueryResult`](../type-aliases/BatchOperationItemSearchQueryResult.md)\>

#### Example

```ts
async function searchBatchOperationItemsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchBatchOperationItems(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const item of result.items ?? []) {
    console.log(`Item: ${item.itemKey} (${item.state})`);
  }
}
```

#### Operation Id

searchBatchOperationItems

#### Tags

Batch operation

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchBatchOperations()

```ts
searchBatchOperations(
   input, 
   consistencyManagement, 
options?): CancelablePromise<BatchOperationSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9410](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9410)

Search batch operations

Search for batch operations based on given criteria.
 *

#### Parameters

##### input

[`BatchOperationSearchQuery`](../type-aliases/BatchOperationSearchQuery.md)

##### consistencyManagement

[`searchBatchOperationsConsistency`](../type-aliases/searchBatchOperationsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`BatchOperationSearchQueryResult`](../type-aliases/BatchOperationSearchQueryResult.md)\>

#### Example

```ts
async function searchBatchOperationsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchBatchOperations(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const batch of result.items ?? []) {
    console.log(`${batch.batchOperationKey}: ${batch.batchOperationType} (${batch.state})`);
  }
}
```

#### Operation Id

searchBatchOperations

#### Tags

Batch operation

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchClientsForGroup()

```ts
searchClientsForGroup(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:9477](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9477)

Search group clients

Search clients assigned to a group.
 *

#### Parameters

##### input

[`searchClientsForGroupInput`](../type-aliases/searchClientsForGroupInput.md)

##### consistencyManagement

[`searchClientsForGroupConsistency`](../type-aliases/searchClientsForGroupConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchClientsForGroupExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchClientsForGroup(
    { groupId: 'engineering-team' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const client of result.items ?? []) {
    console.log(`Client: ${client.clientId}`);
  }
}
```

#### Operation Id

searchClientsForGroup

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchClientsForRole()

```ts
searchClientsForRole(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:9546](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9546)

Search role clients

Search clients with assigned role.
 *

#### Parameters

##### input

[`searchClientsForRoleInput`](../type-aliases/searchClientsForRoleInput.md)

##### consistencyManagement

[`searchClientsForRoleConsistency`](../type-aliases/searchClientsForRoleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchClientsForRoleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchClientsForRole(
    { roleId: 'process-admin' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const client of result.items ?? []) {
    console.log(`Client: ${client.clientId}`);
  }
}
```

#### Operation Id

searchClientsForRole

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchClientsForTenant()

```ts
searchClientsForTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:9615](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9615)

Search clients for tenant

Retrieves a filtered and sorted list of clients for a specified tenant.
 *

#### Parameters

##### input

[`searchClientsForTenantInput`](../type-aliases/searchClientsForTenantInput.md)

##### consistencyManagement

[`searchClientsForTenantConsistency`](../type-aliases/searchClientsForTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
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
```

#### Operation Id

searchClientsForTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchClusterVariables()

```ts
searchClusterVariables(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ClusterVariableSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9682](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9682)

Search for cluster variables based on given criteria. By default, long variable values in the response are truncated.
 *

#### Parameters

##### input

[`searchClusterVariablesInput`](../type-aliases/searchClusterVariablesInput.md)

##### consistencyManagement

[`searchClusterVariablesConsistency`](../type-aliases/searchClusterVariablesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableSearchQueryResult`](../type-aliases/ClusterVariableSearchQueryResult.md)\>

#### Example

```ts
async function searchClusterVariablesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchClusterVariables(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const variable of result.items ?? []) {
    console.log(`${variable.name} = ${variable.value}`);
  }
}
```

#### Operation Id

searchClusterVariables

#### Tags

Cluster Variable

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchCorrelatedMessageSubscriptions()

```ts
searchCorrelatedMessageSubscriptions(
   input, 
   consistencyManagement, 
options?): CancelablePromise<CorrelatedMessageSubscriptionSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9751](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9751)

Search correlated message subscriptions

Search correlated message subscriptions based on given criteria.
 *

#### Parameters

##### input

[`CorrelatedMessageSubscriptionSearchQuery`](../type-aliases/CorrelatedMessageSubscriptionSearchQuery.md)

##### consistencyManagement

[`searchCorrelatedMessageSubscriptionsConsistency`](../type-aliases/searchCorrelatedMessageSubscriptionsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`CorrelatedMessageSubscriptionSearchQueryResult`](../type-aliases/CorrelatedMessageSubscriptionSearchQueryResult.md)\>

#### Example

```ts
async function searchCorrelatedMessageSubscriptionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchCorrelatedMessageSubscriptions(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const sub of result.items ?? []) {
    console.log(`Correlated subscription: ${sub.messageName}`);
  }
}
```

#### Operation Id

searchCorrelatedMessageSubscriptions

#### Tags

Message subscription

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchDecisionDefinitions()

```ts
searchDecisionDefinitions(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionDefinitionSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9818](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9818)

Search decision definitions

Search for decision definitions based on given criteria.
 *

#### Parameters

##### input

[`DecisionDefinitionSearchQuery`](../type-aliases/DecisionDefinitionSearchQuery.md)

##### consistencyManagement

[`searchDecisionDefinitionsConsistency`](../type-aliases/searchDecisionDefinitionsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionDefinitionSearchQueryResult`](../type-aliases/DecisionDefinitionSearchQueryResult.md)\>

#### Example

```ts
async function searchDecisionDefinitionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchDecisionDefinitions(
    {
      filter: { decisionDefinitionId: DecisionDefinitionId.assumeExists('invoice-classification') },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const definition of result.items ?? []) {
    console.log(`${definition.decisionDefinitionId} v${definition.version}`);
  }
}
```

#### Operation Id

searchDecisionDefinitions

#### Tags

Decision definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchDecisionInstances()

```ts
searchDecisionInstances(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionInstanceSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9885](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9885)

Search decision instances

Search for decision instances based on given criteria.
 *

#### Parameters

##### input

[`DecisionInstanceSearchQuery`](../type-aliases/DecisionInstanceSearchQuery.md)

##### consistencyManagement

[`searchDecisionInstancesConsistency`](../type-aliases/searchDecisionInstancesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionInstanceSearchQueryResult`](../type-aliases/DecisionInstanceSearchQueryResult.md)\>

#### Example

```ts
async function searchDecisionInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchDecisionInstances(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const instance of result.items ?? []) {
    console.log(`${instance.decisionEvaluationKey}: ${instance.decisionDefinitionId}`);
  }
}
```

#### Operation Id

searchDecisionInstances

#### Tags

Decision instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchDecisionRequirements()

```ts
searchDecisionRequirements(
   input, 
   consistencyManagement, 
options?): CancelablePromise<DecisionRequirementsSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:9952](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L9952)

Search decision requirements

Search for decision requirements based on given criteria.
 *

#### Parameters

##### input

[`DecisionRequirementsSearchQuery`](../type-aliases/DecisionRequirementsSearchQuery.md)

##### consistencyManagement

[`searchDecisionRequirementsConsistency`](../type-aliases/searchDecisionRequirementsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`DecisionRequirementsSearchQueryResult`](../type-aliases/DecisionRequirementsSearchQueryResult.md)\>

#### Example

```ts
async function searchDecisionRequirementsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchDecisionRequirements(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const req of result.items ?? []) {
    console.log(`${req.decisionRequirementsKey}: ${req.decisionRequirementsId}`);
  }
}
```

#### Operation Id

searchDecisionRequirements

#### Tags

Decision requirements

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchElementInstanceIncidents()

```ts
searchElementInstanceIncidents(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10026](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10026)

Search for incidents of a specific element instance

Search for incidents caused by the specified element instance, including incidents of any child instances created from this element instance.

Although the `elementInstanceKey` is provided as a path parameter to indicate the root element instance,
you may also include an `elementInstanceKey` within the filter object to narrow results to specific
child element instances. This is useful, for example, if you want to isolate incidents associated with
nested or subordinate elements within the given element instance while excluding incidents directly tied
to the root element itself.

 *

#### Parameters

##### input

[`searchElementInstanceIncidentsInput`](../type-aliases/searchElementInstanceIncidentsInput.md)

##### consistencyManagement

[`searchElementInstanceIncidentsConsistency`](../type-aliases/searchElementInstanceIncidentsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentSearchQueryResult`](../type-aliases/IncidentSearchQueryResult.md)\>

#### Example

```ts
async function searchElementInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.searchElementInstanceIncidents(
    { elementInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const incident of result.items ?? []) {
    console.log(`Incident: ${incident.errorType}`);
  }
}
```

#### Operation Id

searchElementInstanceIncidents

#### Tags

Element instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchElementInstances()

```ts
searchElementInstances(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ElementInstanceSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10095](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10095)

Search element instances

Search for element instances based on given criteria.
 *

#### Parameters

##### input

[`ElementInstanceSearchQuery`](../type-aliases/ElementInstanceSearchQuery.md)

##### consistencyManagement

[`searchElementInstancesConsistency`](../type-aliases/searchElementInstancesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ElementInstanceSearchQueryResult`](../type-aliases/ElementInstanceSearchQueryResult.md)\>

#### Example

```ts
async function searchElementInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchElementInstances(
    {
      filter: {
        processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685249'),
      },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const element of result.items ?? []) {
    console.log(`${element.elementId}: ${element.type} (${element.state})`);
  }
}
```

#### Operation Id

searchElementInstances

#### Tags

Element instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchGlobalTaskListeners()

```ts
searchGlobalTaskListeners(
   input, 
   consistencyManagement, 
options?): CancelablePromise<GlobalTaskListenerSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10162](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10162)

Search global user task listeners

Search for global user task listeners based on given criteria.
 *

#### Parameters

##### input

[`GlobalTaskListenerSearchQueryRequest`](../type-aliases/GlobalTaskListenerSearchQueryRequest.md)

##### consistencyManagement

[`searchGlobalTaskListenersConsistency`](../type-aliases/searchGlobalTaskListenersConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GlobalTaskListenerSearchQueryResult`](../type-aliases/GlobalTaskListenerSearchQueryResult.md)\>

#### Example

```ts
async function searchGlobalTaskListenersExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchGlobalTaskListeners(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const listener of result.items ?? []) {
    console.log(`${listener.id}: ${listener.type} (${listener.eventTypes})`);
  }
}
```

#### Operation Id

searchGlobalTaskListeners

#### Tags

Global listener

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchGroupIdsForTenant()

```ts
searchGroupIdsForTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<TenantGroupSearchResult>;
```

Defined in: [gen/CamundaClient.ts:10229](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10229)

Search groups for tenant

Retrieves a filtered and sorted list of groups for a specified tenant.
 *

#### Parameters

##### input

[`searchGroupIdsForTenantInput`](../type-aliases/searchGroupIdsForTenantInput.md)

##### consistencyManagement

[`searchGroupIdsForTenantConsistency`](../type-aliases/searchGroupIdsForTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TenantGroupSearchResult`](../type-aliases/TenantGroupSearchResult.md)\>

#### Example

```ts
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
```

#### Operation Id

searchGroupIdsForTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchGroups()

```ts
searchGroups(
   input, 
   consistencyManagement, 
options?): CancelablePromise<GroupSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10298](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10298)

Search groups

Search for groups based on given criteria.
 *

#### Parameters

##### input

[`GroupSearchQueryRequest`](../type-aliases/GroupSearchQueryRequest.md)

##### consistencyManagement

[`searchGroupsConsistency`](../type-aliases/searchGroupsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GroupSearchQueryResult`](../type-aliases/GroupSearchQueryResult.md)\>

#### Example

```ts
async function searchGroupsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchGroups(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const group of result.items ?? []) {
    console.log(`${group.groupId}: ${group.name}`);
  }
}
```

#### Operation Id

searchGroups

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchGroupsForRole()

```ts
searchGroupsForRole(
   input, 
   consistencyManagement, 
options?): CancelablePromise<RoleGroupSearchResult>;
```

Defined in: [gen/CamundaClient.ts:10365](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10365)

Search role groups

Search groups with assigned role.
 *

#### Parameters

##### input

[`searchGroupsForRoleInput`](../type-aliases/searchGroupsForRoleInput.md)

##### consistencyManagement

[`searchGroupsForRoleConsistency`](../type-aliases/searchGroupsForRoleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`RoleGroupSearchResult`](../type-aliases/RoleGroupSearchResult.md)\>

#### Example

```ts
async function searchGroupsForRoleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchGroupsForRole(
    { roleId: 'process-admin' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const group of result.items ?? []) {
    console.log(`Group: ${group.groupId}`);
  }
}
```

#### Operation Id

searchGroupsForRole

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchIncidents()

```ts
searchIncidents(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10435](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10435)

Search incidents

Search for incidents based on given criteria.

 *

#### Parameters

##### input

[`IncidentSearchQuery`](../type-aliases/IncidentSearchQuery.md)

##### consistencyManagement

[`searchIncidentsConsistency`](../type-aliases/searchIncidentsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentSearchQueryResult`](../type-aliases/IncidentSearchQueryResult.md)\>

#### Example

```ts
async function searchIncidentsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchIncidents(
    {
      filter: { state: 'ACTIVE' },
      sort: [{ field: 'creationTime', order: 'DESC' }],
      page: { limit: 20 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const incident of result.items ?? []) {
    console.log(`${incident.incidentKey}: ${incident.errorType} — ${incident.errorMessage}`);
  }
  console.log(`Total active incidents: ${result.page.totalItems}`);
}
```

#### Operation Id

searchIncidents

#### Tags

Incident

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchJobs()

```ts
searchJobs(
   input, 
   consistencyManagement, 
options?): CancelablePromise<JobSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10502](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10502)

Search jobs

Search for jobs based on given criteria.
 *

#### Parameters

##### input

[`JobSearchQuery`](../type-aliases/JobSearchQuery.md)

##### consistencyManagement

[`searchJobsConsistency`](../type-aliases/searchJobsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`JobSearchQueryResult`](../type-aliases/JobSearchQueryResult.md)\>

#### Example

```ts
async function searchJobsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchJobs(
    {
      filter: { type: 'payment-processing', state: 'CREATED' },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const job of result.items ?? []) {
    console.log(`Job ${job.jobKey}: ${job.type} (${job.state})`);
  }
}
```

#### Operation Id

searchJobs

#### Tags

Job

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchMappingRule()

```ts
searchMappingRule(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:10570](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10570)

Search mapping rules

Search for mapping rules based on given criteria.

 *

#### Parameters

##### input

[`MappingRuleSearchQueryRequest`](../type-aliases/MappingRuleSearchQueryRequest.md)

##### consistencyManagement

[`searchMappingRuleConsistency`](../type-aliases/searchMappingRuleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchMappingRulesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchMappingRule(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const rule of result.items ?? []) {
    console.log(`${rule.mappingRuleId}: ${rule.name}`);
  }
}
```

#### Operation Id

searchMappingRule

#### Tags

Mapping rule

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchMappingRulesForGroup()

```ts
searchMappingRulesForGroup(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:10637](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10637)

Search group mapping rules

Search mapping rules assigned to a group.
 *

#### Parameters

##### input

[`searchMappingRulesForGroupInput`](../type-aliases/searchMappingRulesForGroupInput.md)

##### consistencyManagement

[`searchMappingRulesForGroupConsistency`](../type-aliases/searchMappingRulesForGroupConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchMappingRulesForGroupExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchMappingRulesForGroup(
    { groupId: 'engineering-team' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const rule of result.items ?? []) {
    console.log(`Mapping rule: ${rule.name}`);
  }
}
```

#### Operation Id

searchMappingRulesForGroup

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchMappingRulesForRole()

```ts
searchMappingRulesForRole(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:10706](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10706)

Search role mapping rules

Search mapping rules with assigned role.
 *

#### Parameters

##### input

[`searchMappingRulesForRoleInput`](../type-aliases/searchMappingRulesForRoleInput.md)

##### consistencyManagement

[`searchMappingRulesForRoleConsistency`](../type-aliases/searchMappingRulesForRoleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchMappingRulesForRoleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchMappingRulesForRole(
    { roleId: 'process-admin' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const rule of result.items ?? []) {
    console.log(`Mapping rule: ${rule.name}`);
  }
}
```

#### Operation Id

searchMappingRulesForRole

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchMappingRulesForTenant()

```ts
searchMappingRulesForTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:10775](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10775)

Search mapping rules for tenant

Retrieves a filtered and sorted list of MappingRules for a specified tenant.
 *

#### Parameters

##### input

[`searchMappingRulesForTenantInput`](../type-aliases/searchMappingRulesForTenantInput.md)

##### consistencyManagement

[`searchMappingRulesForTenantConsistency`](../type-aliases/searchMappingRulesForTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
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
```

#### Operation Id

searchMappingRulesForTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchMessageSubscriptions()

```ts
searchMessageSubscriptions(
   input, 
   consistencyManagement, 
options?): CancelablePromise<MessageSubscriptionSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10844](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10844)

Search message subscriptions

Search for message subscriptions based on given criteria.
 *

#### Parameters

##### input

[`MessageSubscriptionSearchQuery`](../type-aliases/MessageSubscriptionSearchQuery.md)

##### consistencyManagement

[`searchMessageSubscriptionsConsistency`](../type-aliases/searchMessageSubscriptionsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MessageSubscriptionSearchQueryResult`](../type-aliases/MessageSubscriptionSearchQueryResult.md)\>

#### Example

```ts
async function searchMessageSubscriptionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchMessageSubscriptions(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const sub of result.items ?? []) {
    console.log(`Subscription: ${sub.messageName}`);
  }
}
```

#### Operation Id

searchMessageSubscriptions

#### Tags

Message subscription

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchProcessDefinitions()

```ts
searchProcessDefinitions(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessDefinitionSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10911](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10911)

Search process definitions

Search for process definitions based on given criteria.
 *

#### Parameters

##### input

[`ProcessDefinitionSearchQuery`](../type-aliases/ProcessDefinitionSearchQuery.md)

##### consistencyManagement

[`searchProcessDefinitionsConsistency`](../type-aliases/searchProcessDefinitionsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessDefinitionSearchQueryResult`](../type-aliases/ProcessDefinitionSearchQueryResult.md)\>

#### Example

```ts
async function searchProcessDefinitionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchProcessDefinitions(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const def of result.items ?? []) {
    console.log(`${def.processDefinitionKey}: ${def.processDefinitionId} v${def.version}`);
  }
}
```

#### Operation Id

searchProcessDefinitions

#### Tags

Process definition

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchProcessInstanceIncidents()

```ts
searchProcessInstanceIncidents(
   input, 
   consistencyManagement, 
options?): CancelablePromise<IncidentSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:10984](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L10984)

Search related incidents

Search for incidents caused by the process instance or any of its called process or decision instances.

Although the `processInstanceKey` is provided as a path parameter to indicate the root process instance,
you may also include a `processInstanceKey` within the filter object to narrow results to specific
child process instances. This is useful, for example, if you want to isolate incidents associated with
subprocesses or called processes under the root instance while excluding incidents directly tied to the root.

 *

#### Parameters

##### input

[`searchProcessInstanceIncidentsInput`](../type-aliases/searchProcessInstanceIncidentsInput.md)

##### consistencyManagement

[`searchProcessInstanceIncidentsConsistency`](../type-aliases/searchProcessInstanceIncidentsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`IncidentSearchQueryResult`](../type-aliases/IncidentSearchQueryResult.md)\>

#### Example

```ts
async function searchProcessInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.searchProcessInstanceIncidents(
    {
      processInstanceKey,
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const incident of result.items ?? []) {
    console.log(`Incident: ${incident.errorType} - ${incident.errorMessage}`);
  }
}
```

#### Operation Id

searchProcessInstanceIncidents

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchProcessInstances()

```ts
searchProcessInstances(
   input, 
   consistencyManagement, 
options?): CancelablePromise<ProcessInstanceSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11053](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11053)

Search process instances

Search for process instances based on given criteria.
 *

#### Parameters

##### input

[`ProcessInstanceSearchQuery`](../type-aliases/ProcessInstanceSearchQuery.md)

##### consistencyManagement

[`searchProcessInstancesConsistency`](../type-aliases/searchProcessInstancesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ProcessInstanceSearchQueryResult`](../type-aliases/ProcessInstanceSearchQueryResult.md)\>

#### Example

```ts
async function searchProcessInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchProcessInstances(
    {
      filter: { processDefinitionId: ProcessDefinitionId.assumeExists('order-process') },
      sort: [{ field: 'startDate', order: 'DESC' }],
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const instance of result.items ?? []) {
    console.log(`${instance.processInstanceKey}: ${instance.state}`);
  }
  console.log(`Total: ${result.page.totalItems}`);
}
```

#### Operation Id

searchProcessInstances

#### Tags

Process instance

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchRoles()

```ts
searchRoles(
   input, 
   consistencyManagement, 
options?): CancelablePromise<RoleSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11120](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11120)

Search roles

Search for roles based on given criteria.
 *

#### Parameters

##### input

[`RoleSearchQueryRequest`](../type-aliases/RoleSearchQueryRequest.md)

##### consistencyManagement

[`searchRolesConsistency`](../type-aliases/searchRolesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`RoleSearchQueryResult`](../type-aliases/RoleSearchQueryResult.md)\>

#### Example

```ts
async function searchRolesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchRoles(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const role of result.items ?? []) {
    console.log(`${role.roleId}: ${role.name}`);
  }
}
```

#### Operation Id

searchRoles

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchRolesForGroup()

```ts
searchRolesForGroup(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11187](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11187)

Search group roles

Search roles assigned to a group.
 *

#### Parameters

##### input

[`searchRolesForGroupInput`](../type-aliases/searchRolesForGroupInput.md)

##### consistencyManagement

[`searchRolesForGroupConsistency`](../type-aliases/searchRolesForGroupConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchRolesForGroupExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchRolesForGroup(
    { groupId: 'engineering-team' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const role of result.items ?? []) {
    console.log(`Role: ${role.name}`);
  }
}
```

#### Operation Id

searchRolesForGroup

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchRolesForTenant()

```ts
searchRolesForTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11256](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11256)

Search roles for tenant

Retrieves a filtered and sorted list of roles for a specified tenant.
 *

#### Parameters

##### input

[`searchRolesForTenantInput`](../type-aliases/searchRolesForTenantInput.md)

##### consistencyManagement

[`searchRolesForTenantConsistency`](../type-aliases/searchRolesForTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
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
```

#### Operation Id

searchRolesForTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchTenants()

```ts
searchTenants(
   input, 
   consistencyManagement, 
options?): CancelablePromise<TenantSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11325](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11325)

Search tenants

Retrieves a filtered and sorted list of tenants.
 *

#### Parameters

##### input

[`TenantSearchQueryRequest`](../type-aliases/TenantSearchQueryRequest.md)

##### consistencyManagement

[`searchTenantsConsistency`](../type-aliases/searchTenantsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TenantSearchQueryResult`](../type-aliases/TenantSearchQueryResult.md)\>

#### Example

```ts
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
```

#### Operation Id

searchTenants

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUsers()

```ts
searchUsers(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11392](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11392)

Search users

Search for users based on given criteria.
 *

#### Parameters

##### input

[`UserSearchQueryRequest`](../type-aliases/UserSearchQueryRequest.md)

##### consistencyManagement

[`searchUsersConsistency`](../type-aliases/searchUsersConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchUsersExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUsers(
    {
      filter: {},
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const user of result.items ?? []) {
    console.log(`${user.username}: ${user.name}`);
  }
}
```

#### Operation Id

searchUsers

#### Tags

User

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUsersForGroup()

```ts
searchUsersForGroup(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11459](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11459)

Search group users

Search users assigned to a group.
 *

#### Parameters

##### input

[`searchUsersForGroupInput`](../type-aliases/searchUsersForGroupInput.md)

##### consistencyManagement

[`searchUsersForGroupConsistency`](../type-aliases/searchUsersForGroupConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchUsersForGroupExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUsersForGroup(
    { groupId: 'engineering-team' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const user of result.items ?? []) {
    console.log(`Member: ${user.username}`);
  }
}
```

#### Operation Id

searchUsersForGroup

#### Tags

Group

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUsersForRole()

```ts
searchUsersForRole(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11528](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11528)

Search role users

Search users with assigned role.
 *

#### Parameters

##### input

[`searchUsersForRoleInput`](../type-aliases/searchUsersForRoleInput.md)

##### consistencyManagement

[`searchUsersForRoleConsistency`](../type-aliases/searchUsersForRoleConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
async function searchUsersForRoleExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUsersForRole(
    { roleId: 'process-admin' },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const user of result.items ?? []) {
    console.log(`User: ${user.username}`);
  }
}
```

#### Operation Id

searchUsersForRole

#### Tags

Role

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUsersForTenant()

```ts
searchUsersForTenant(
   input, 
   consistencyManagement, 
options?): CancelablePromise<SearchQueryResponse & object>;
```

Defined in: [gen/CamundaClient.ts:11597](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11597)

Search users for tenant

Retrieves a filtered and sorted list of users for a specified tenant.
 *

#### Parameters

##### input

[`searchUsersForTenantInput`](../type-aliases/searchUsersForTenantInput.md)

##### consistencyManagement

[`searchUsersForTenantConsistency`](../type-aliases/searchUsersForTenantConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`SearchQueryResponse`](../type-aliases/SearchQueryResponse.md) & `object`\>

#### Example

```ts
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
```

#### Operation Id

searchUsersForTenant

#### Tags

Tenant

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUserTaskAuditLogs()

```ts
searchUserTaskAuditLogs(
   input, 
   consistencyManagement, 
options?): CancelablePromise<AuditLogSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11666](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11666)

Search user task audit logs

Search for user task audit logs based on given criteria.
 *

#### Parameters

##### input

[`searchUserTaskAuditLogsInput`](../type-aliases/searchUserTaskAuditLogsInput.md)

##### consistencyManagement

[`searchUserTaskAuditLogsConsistency`](../type-aliases/searchUserTaskAuditLogsConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`AuditLogSearchQueryResult`](../type-aliases/AuditLogSearchQueryResult.md)\>

#### Example

```ts
async function searchUserTaskAuditLogsExample() {
  const camunda = createCamundaClient();

  const { UserTaskKey } = await import('@camunda8/orchestration-cluster-api');
  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  const result = await camunda.searchUserTaskAuditLogs(
    { userTaskKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const log of result.items ?? []) {
    console.log(`Audit: ${log.operationType} at ${log.timestamp}`);
  }
}
```

#### Operation Id

searchUserTaskAuditLogs

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUserTaskEffectiveVariables()

```ts
searchUserTaskEffectiveVariables(
   input, 
   consistencyManagement, 
options?): CancelablePromise<VariableSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11739](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11739)

Search user task effective variables

Search for the effective variables of a user task. This endpoint returns deduplicated
variables where each variable name appears at most once. When the same variable name exists
at multiple scope levels in the scope hierarchy, the value from the innermost scope (closest
to the user task) takes precedence. This is useful for retrieving the actual runtime state
of variables as seen by the user task. By default, long variable values in the response are
truncated.

 *

#### Parameters

##### input

[`searchUserTaskEffectiveVariablesInput`](../type-aliases/searchUserTaskEffectiveVariablesInput.md)

##### consistencyManagement

[`searchUserTaskEffectiveVariablesConsistency`](../type-aliases/searchUserTaskEffectiveVariablesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`VariableSearchQueryResult`](../type-aliases/VariableSearchQueryResult.md)\>

#### Operation Id

searchUserTaskEffectiveVariables

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUserTasks()

```ts
searchUserTasks(
   input, 
   consistencyManagement, 
options?): CancelablePromise<UserTaskSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11810](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11810)

Search user tasks

Search for user tasks based on given criteria.
 *

#### Parameters

##### input

[`UserTaskSearchQuery`](../type-aliases/UserTaskSearchQuery.md)

##### consistencyManagement

[`searchUserTasksConsistency`](../type-aliases/searchUserTasksConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`UserTaskSearchQueryResult`](../type-aliases/UserTaskSearchQueryResult.md)\>

#### Example

```ts
async function searchUserTasksExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchUserTasks(
    {
      filter: { assignee: 'alice', state: 'CREATED' },
      sort: [{ field: 'creationDate', order: 'DESC' }],
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const task of result.items ?? []) {
    console.log(`${task.userTaskKey}: ${task.name} (${task.state})`);
  }
}
```

#### Operation Id

searchUserTasks

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchUserTaskVariables()

```ts
searchUserTaskVariables(
   input, 
   consistencyManagement, 
options?): CancelablePromise<VariableSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11884](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11884)

Search user task variables

Search for user task variables based on given criteria. This endpoint returns all variable
documents visible from the user task's scope, including variables from parent scopes in the
scope hierarchy. If the same variable name exists at multiple scope levels, each scope's
variable is returned as a separate result. Use the
`/user-tasks/{userTaskKey}/effective-variables/search` endpoint to get deduplicated variables
where the innermost scope takes precedence. By default, long variable values in the response
are truncated.

 *

#### Parameters

##### input

[`searchUserTaskVariablesInput`](../type-aliases/searchUserTaskVariablesInput.md)

##### consistencyManagement

[`searchUserTaskVariablesConsistency`](../type-aliases/searchUserTaskVariablesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`VariableSearchQueryResult`](../type-aliases/VariableSearchQueryResult.md)\>

#### Example

```ts
async function searchUserTaskVariablesExample() {
  const camunda = createCamundaClient();

  const { UserTaskKey } = await import('@camunda8/orchestration-cluster-api');
  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  const result = await camunda.searchUserTaskVariables(
    { userTaskKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const variable of result.items ?? []) {
    console.log(`${variable.name} = ${variable.value}`);
  }
}
```

#### Operation Id

searchUserTaskVariables

#### Tags

User task

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### searchVariables()

```ts
searchVariables(
   input, 
   consistencyManagement, 
options?): CancelablePromise<VariableSearchQueryResult>;
```

Defined in: [gen/CamundaClient.ts:11963](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L11963)

Search variables

Search for variables based on given criteria.

This endpoint returns variables that exist directly at the specified scopes - it does not
include variables from parent scopes that would be visible through the scope hierarchy.

Variables can be process-level (scoped to the process instance) or local (scoped to specific
BPMN elements like tasks, subprocesses, etc.).

By default, long variable values in the response are truncated.
 *

#### Parameters

##### input

[`searchVariablesInput`](../type-aliases/searchVariablesInput.md)

##### consistencyManagement

[`searchVariablesConsistency`](../type-aliases/searchVariablesConsistency.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`VariableSearchQueryResult`](../type-aliases/VariableSearchQueryResult.md)\>

#### Example

```ts
async function searchVariablesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchVariables(
    {
      filter: {
        processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685249'),
      },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const variable of result.items ?? []) {
    console.log(`${variable.name} = ${variable.value}`);
  }
}
```

#### Operation Id

searchVariables

#### Tags

Variable

#### Consistency

eventual - this endpoint is backed by data that is eventually consistent with the system state.

***

### stopAllWorkers()

```ts
stopAllWorkers(): void;
```

Defined in: [gen/CamundaClient.ts:1573](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1573)

Stop all registered job workers (best-effort) and terminate the shared thread pool.

#### Returns

`void`

***

### suspendBatchOperation()

```ts
suspendBatchOperation(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12033](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12033)

Suspend Batch operation

Suspends a running batch operation.
This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).

 *

#### Parameters

##### input

###### batchOperationKey

[`BatchOperationKey`](../type-aliases/BatchOperationKey.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function suspendBatchOperationExample() {
  const camunda = createCamundaClient();

  const batchOperationKey = BatchOperationKey.assumeExists('2251799813685249');

  await camunda.suspendBatchOperation({ batchOperationKey });
}
```

#### Operation Id

suspendBatchOperation

#### Tags

Batch operation

***

### throwJobError()

```ts
throwJobError(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12098](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12098)

Throw error for job

Reports a business error (i.e. non-technical) that occurs while processing a job.

 *

#### Parameters

##### input

[`throwJobErrorInput`](../type-aliases/throwJobErrorInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function throwJobErrorExample() {
  const camunda = createCamundaClient();

  const jobKey = JobKey.assumeExists('2251799813685249');

  await camunda.throwJobError({
    jobKey,
    errorCode: 'PAYMENT_FAILED',
    errorMessage: 'Payment provider returned error',
  });
}
```

#### Operation Id

throwJobError

#### Tags

Job

***

### unassignClientFromGroup()

```ts
unassignClientFromGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12164](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12164)

Unassign a client from a group

Unassigns a client from a group.
The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.

 *

#### Parameters

##### input

[`unassignClientFromGroupInput`](../type-aliases/unassignClientFromGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignClientFromGroupExample() {
  const camunda = createCamundaClient();

  await camunda.unassignClientFromGroup({
    groupId: 'engineering-team',
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

unassignClientFromGroup

#### Tags

Group

***

### unassignClientFromTenant()

```ts
unassignClientFromTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12228](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12228)

Unassign a client from a tenant

Unassigns the client from the specified tenant.
The client can no longer access tenant data.

 *

#### Parameters

##### input

[`unassignClientFromTenantInput`](../type-aliases/unassignClientFromTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignClientFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignClientFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

unassignClientFromTenant

#### Tags

Tenant

***

### unassignGroupFromTenant()

```ts
unassignGroupFromTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12292](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12292)

Unassign a group from a tenant

Unassigns a group from a specified tenant.
Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.

 *

#### Parameters

##### input

[`unassignGroupFromTenantInput`](../type-aliases/unassignGroupFromTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignGroupFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignGroupFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    groupId: 'engineering-team',
  });
}
```

#### Operation Id

unassignGroupFromTenant

#### Tags

Tenant

***

### unassignMappingRuleFromGroup()

```ts
unassignMappingRuleFromGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12354](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12354)

Unassign a mapping rule from a group

Unassigns a mapping rule from a group.
 *

#### Parameters

##### input

[`unassignMappingRuleFromGroupInput`](../type-aliases/unassignMappingRuleFromGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignMappingRuleFromGroupExample() {
  const camunda = createCamundaClient();

  await camunda.unassignMappingRuleFromGroup({
    groupId: 'engineering-team',
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

unassignMappingRuleFromGroup

#### Tags

Group

***

### unassignMappingRuleFromTenant()

```ts
unassignMappingRuleFromTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12416](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12416)

Unassign a mapping rule from a tenant

Unassigns a single mapping rule from a specified tenant without deleting the rule.
 *

#### Parameters

##### input

[`unassignMappingRuleFromTenantInput`](../type-aliases/unassignMappingRuleFromTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignMappingRuleFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignMappingRuleFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

unassignMappingRuleFromTenant

#### Tags

Tenant

***

### unassignRoleFromClient()

```ts
unassignRoleFromClient(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12478](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12478)

Unassign a role from a client

Unassigns the specified role from the client. The client will no longer inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`unassignRoleFromClientInput`](../type-aliases/unassignRoleFromClientInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignRoleFromClientExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromClient({
    roleId: 'process-admin',
    clientId: 'my-service-account',
  });
}
```

#### Operation Id

unassignRoleFromClient

#### Tags

Role

***

### unassignRoleFromGroup()

```ts
unassignRoleFromGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12540](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12540)

Unassign a role from a group

Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`unassignRoleFromGroupInput`](../type-aliases/unassignRoleFromGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignRoleFromGroupExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromGroup({
    roleId: 'process-admin',
    groupId: 'engineering-team',
  });
}
```

#### Operation Id

unassignRoleFromGroup

#### Tags

Role

***

### unassignRoleFromMappingRule()

```ts
unassignRoleFromMappingRule(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12602](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12602)

Unassign a role from a mapping rule

Unassigns a role from a mapping rule.
 *

#### Parameters

##### input

[`unassignRoleFromMappingRuleInput`](../type-aliases/unassignRoleFromMappingRuleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignRoleFromMappingRuleExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromMappingRule({
    roleId: 'process-admin',
    mappingRuleId: 'rule-123',
  });
}
```

#### Operation Id

unassignRoleFromMappingRule

#### Tags

Role

***

### unassignRoleFromTenant()

```ts
unassignRoleFromTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12667](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12667)

Unassign a role from a tenant

Unassigns a role from a specified tenant.
Users, Clients or Groups, that have the role assigned, will no longer have access to the
tenant's data - unless they are assigned directly to the tenant.

 *

#### Parameters

##### input

[`unassignRoleFromTenantInput`](../type-aliases/unassignRoleFromTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignRoleFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    roleId: 'process-admin',
  });
}
```

#### Operation Id

unassignRoleFromTenant

#### Tags

Tenant

***

### unassignRoleFromUser()

```ts
unassignRoleFromUser(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12729](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12729)

Unassign a role from a user

Unassigns a role from a user. The user will no longer inherit the authorizations associated with this role.
 *

#### Parameters

##### input

[`unassignRoleFromUserInput`](../type-aliases/unassignRoleFromUserInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignRoleFromUserExample() {
  const camunda = createCamundaClient();

  await camunda.unassignRoleFromUser({
    roleId: 'process-admin',
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

unassignRoleFromUser

#### Tags

Role

***

### unassignUserFromGroup()

```ts
unassignUserFromGroup(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12793](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12793)

Unassign a user from a group

Unassigns a user from a group.
The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.

 *

#### Parameters

##### input

[`unassignUserFromGroupInput`](../type-aliases/unassignUserFromGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignUserFromGroupExample() {
  const camunda = createCamundaClient();

  await camunda.unassignUserFromGroup({
    groupId: 'engineering-team',
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

unassignUserFromGroup

#### Tags

Group

***

### unassignUserFromTenant()

```ts
unassignUserFromTenant(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12857](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12857)

Unassign a user from a tenant

Unassigns the user from the specified tenant.
The user can no longer access tenant data.

 *

#### Parameters

##### input

[`unassignUserFromTenantInput`](../type-aliases/unassignUserFromTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignUserFromTenantExample() {
  const camunda = createCamundaClient();

  await camunda.unassignUserFromTenant({
    tenantId: TenantId.assumeExists('customer-service'),
    username: Username.assumeExists('alice'),
  });
}
```

#### Operation Id

unassignUserFromTenant

#### Tags

Tenant

***

### unassignUserTask()

```ts
unassignUserTask(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12920](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12920)

Unassign user task

Removes the assignee of a task with the given key. Unassignment waits for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.

 *

#### Parameters

##### input

[`unassignUserTaskInput`](../type-aliases/unassignUserTaskInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function unassignUserTaskExample() {
  const camunda = createCamundaClient();

  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.unassignUserTask({ userTaskKey });
}
```

#### Operation Id

unassignUserTask

#### Tags

User task

***

### updateAuthorization()

```ts
updateAuthorization(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:12982](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L12982)

Update authorization

Update the authorization with the given key.
 *

#### Parameters

##### input

[`updateAuthorizationInput`](../type-aliases/updateAuthorizationInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
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
```

#### Operation Id

updateAuthorization

#### Tags

Authorization

***

### updateGlobalClusterVariable()

```ts
updateGlobalClusterVariable(input, options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:13048](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13048)

Update a global-scoped cluster variable

Updates the value of an existing global cluster variable.
The variable must exist, otherwise a 404 error is returned.

 *

#### Parameters

##### input

[`updateGlobalClusterVariableInput`](../type-aliases/updateGlobalClusterVariableInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function updateGlobalClusterVariableExample() {
  const camunda = createCamundaClient();

  await camunda.updateGlobalClusterVariable({
    name: 'feature-flags',
    value: { darkMode: false },
  });
}
```

#### Operation Id

updateGlobalClusterVariable

#### Tags

Cluster Variable

***

### updateGlobalTaskListener()

```ts
updateGlobalTaskListener(input, options?): CancelablePromise<GlobalTaskListenerResult>;
```

Defined in: [gen/CamundaClient.ts:13112](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13112)

Update global user task listener

Updates a global user task listener.
 *

#### Parameters

##### input

[`updateGlobalTaskListenerInput`](../type-aliases/updateGlobalTaskListenerInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GlobalTaskListenerResult`](../type-aliases/GlobalTaskListenerResult.md)\>

#### Example

```ts
async function updateGlobalTaskListenerExample() {
  const camunda = createCamundaClient();

  await camunda.updateGlobalTaskListener({
    id: GlobalListenerId.assumeExists('listener-123'),
    eventTypes: ['completing'],
    type: 'updated-audit-listener',
  });
}
```

#### Operation Id

updateGlobalTaskListener

#### Tags

Global listener

***

### updateGroup()

```ts
updateGroup(input, options?): CancelablePromise<GroupUpdateResult>;
```

Defined in: [gen/CamundaClient.ts:13176](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13176)

Update group

Update a group with the given ID.
 *

#### Parameters

##### input

[`updateGroupInput`](../type-aliases/updateGroupInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`GroupUpdateResult`](../type-aliases/GroupUpdateResult.md)\>

#### Example

```ts
async function updateGroupExample() {
  const camunda = createCamundaClient();

  await camunda.updateGroup({
    groupId: 'engineering-team',
    name: 'Engineering Team',
  });
}
```

#### Operation Id

updateGroup

#### Tags

Group

***

### updateJob()

```ts
updateJob(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:13240](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13240)

Update job

Update a job with the given key.
 *

#### Parameters

##### input

[`updateJobInput`](../type-aliases/updateJobInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function updateJobExample() {
  const camunda = createCamundaClient();

  const jobKey = JobKey.assumeExists('2251799813685249');

  await camunda.updateJob({
    jobKey,
    changeset: { retries: 5, timeout: 60000 },
  });
}
```

#### Operation Id

updateJob

#### Tags

Job

***

### updateMappingRule()

```ts
updateMappingRule(input, options?): CancelablePromise<MappingRuleCreateUpdateResult>;
```

Defined in: [gen/CamundaClient.ts:13305](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13305)

Update mapping rule

Update a mapping rule.

 *

#### Parameters

##### input

[`updateMappingRuleInput`](../type-aliases/updateMappingRuleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`MappingRuleCreateUpdateResult`](../type-aliases/MappingRuleCreateUpdateResult.md)\>

#### Example

```ts
async function updateMappingRuleExample() {
  const camunda = createCamundaClient();

  await camunda.updateMappingRule({
    mappingRuleId: 'ldap-group-mapping',
    name: 'LDAP Group Mapping',
    claimName: 'groups',
    claimValue: 'engineering-team',
  });
}
```

#### Operation Id

updateMappingRule

#### Tags

Mapping rule

***

### updateRole()

```ts
updateRole(input, options?): CancelablePromise<RoleUpdateResult>;
```

Defined in: [gen/CamundaClient.ts:13369](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13369)

Update role

Update a role with the given ID.
 *

#### Parameters

##### input

[`updateRoleInput`](../type-aliases/updateRoleInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`RoleUpdateResult`](../type-aliases/RoleUpdateResult.md)\>

#### Example

```ts
async function updateRoleExample() {
  const camunda = createCamundaClient();

  await camunda.updateRole({
    roleId: 'process-admin',
    name: 'Process Administrator',
  });
}
```

#### Operation Id

updateRole

#### Tags

Role

***

### updateTenant()

```ts
updateTenant(input, options?): CancelablePromise<TenantUpdateResult>;
```

Defined in: [gen/CamundaClient.ts:13433](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13433)

Update tenant

Updates an existing tenant.
 *

#### Parameters

##### input

[`updateTenantInput`](../type-aliases/updateTenantInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`TenantUpdateResult`](../type-aliases/TenantUpdateResult.md)\>

#### Example

```ts
async function updateTenantExample() {
  const camunda = createCamundaClient();

  const tenantId = TenantId.assumeExists('customer-service');

  await camunda.updateTenant({
    tenantId,
    name: 'Customer Service Team',
  });
}
```

#### Operation Id

updateTenant

#### Tags

Tenant

***

### updateTenantClusterVariable()

```ts
updateTenantClusterVariable(input, options?): CancelablePromise<ClusterVariableResult>;
```

Defined in: [gen/CamundaClient.ts:13499](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13499)

Update a tenant-scoped cluster variable

Updates the value of an existing tenant-scoped cluster variable.
The variable must exist, otherwise a 404 error is returned.

 *

#### Parameters

##### input

[`updateTenantClusterVariableInput`](../type-aliases/updateTenantClusterVariableInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<[`ClusterVariableResult`](../type-aliases/ClusterVariableResult.md)\>

#### Example

```ts
async function updateTenantClusterVariableExample() {
  const camunda = createCamundaClient();

  await camunda.updateTenantClusterVariable({
    tenantId: TenantId.assumeExists('customer-service'),
    name: 'config',
    value: { region: 'eu-west-1' },
  });
}
```

#### Operation Id

updateTenantClusterVariable

#### Tags

Cluster Variable

***

### updateUser()

```ts
updateUser(input, options?): CancelablePromise<{
  email: string | null;
  name: string | null;
  username: Username;
}>;
```

Defined in: [gen/CamundaClient.ts:13563](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13563)

Update user

Updates a user.
 *

#### Parameters

##### input

[`updateUserInput`](../type-aliases/updateUserInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<\{
  `email`: `string` \| `null`;
  `name`: `string` \| `null`;
  `username`: [`Username`](../type-aliases/Username.md);
\}\>

#### Example

```ts
async function updateUserExample() {
  const camunda = createCamundaClient();

  const username = Username.assumeExists('alice');

  await camunda.updateUser({
    username,
    name: 'Alice Jones',
    email: 'alice.jones@example.com',
  });
}
```

#### Operation Id

updateUser

#### Tags

User

***

### updateUserTask()

```ts
updateUserTask(input, options?): CancelablePromise<void>;
```

Defined in: [gen/CamundaClient.ts:13628](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L13628)

Update user task

Update a user task with the given key. Updates wait for blocking task listeners on this lifecycle transition. If listener processing is delayed beyond the request timeout, this endpoint can return 504. Other gateway timeout causes are also possible. Retry with backoff and inspect listener worker availability and logs when this repeats.

 *

#### Parameters

##### input

[`updateUserTaskInput`](../type-aliases/updateUserTaskInput.md)

##### options?

[`OperationOptions`](../interfaces/OperationOptions.md)

#### Returns

[`CancelablePromise`](../interfaces/CancelablePromise.md)\<`void`\>

#### Example

```ts
async function updateUserTaskExample() {
  const camunda = createCamundaClient();

  const { UserTaskKey } = await import('@camunda8/orchestration-cluster-api');
  const userTaskKey = UserTaskKey.assumeExists('2251799813685249');

  await camunda.updateUserTask({
    userTaskKey,
    changeset: {
      candidateUsers: ['alice', 'bob'],
      dueDate: '2025-12-31T23:59:59Z',
      priority: 80,
    },
  });
}
```

#### Operation Id

updateUserTask

#### Tags

User task

***

### withCorrelation()

```ts
withCorrelation<T>(id, fn): Promise<T>;
```

Defined in: [gen/CamundaClient.ts:1481](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1481)

#### Type Parameters

##### T

`T`

#### Parameters

##### id

`string`

##### fn

() => `T` \| `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
