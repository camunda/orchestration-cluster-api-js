---
title: "Interface: ExtendedDeploymentResult"
sidebar_label: "ExtendedDeploymentResult"
mdx:
  format: md
---

# Interface: ExtendedDeploymentResult

Defined in: [gen/CamundaClient.ts:1096](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1096)

Extended deployment result with typed buckets for direct access to deployed artifacts.

## Extends

- `_DataOf`\<*typeof* `Sdk.createDeployment`\>

## Properties

### decisionRequirements

```ts
decisionRequirements: DeploymentDecisionRequirementsResult[];
```

Defined in: [gen/CamundaClient.ts:1099](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1099)

***

### decisions

```ts
decisions: DeploymentDecisionResult[];
```

Defined in: [gen/CamundaClient.ts:1098](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1098)

***

### deploymentKey

```ts
deploymentKey: DeploymentKey;
```

Defined in: [gen/types.gen.ts:2058](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2058)

The unique key identifying the deployment.

#### Inherited from

```ts
_DataOf.deploymentKey
```

***

### deployments

```ts
deployments: DeploymentMetadataResult[];
```

Defined in: [gen/types.gen.ts:2066](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2066)

Items deployed by the request.

#### Inherited from

```ts
_DataOf.deployments
```

***

### forms

```ts
forms: DeploymentFormResult[];
```

Defined in: [gen/CamundaClient.ts:1100](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1100)

***

### processes

```ts
processes: DeploymentProcessResult[];
```

Defined in: [gen/CamundaClient.ts:1097](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1097)

***

### resources

```ts
resources: DeploymentResourceResult[];
```

Defined in: [gen/CamundaClient.ts:1101](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L1101)

***

### tenantId

```ts
tenantId: TenantId;
```

Defined in: [gen/types.gen.ts:2062](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2062)

The tenant ID associated with the deployment.

#### Inherited from

```ts
_DataOf.tenantId
```
