---
title: "Type Alias: getTenantClusterVariableConsistency"
sidebar_label: "getTenantClusterVariableConsistency"
mdx:
  format: md
---

# Type Alias: getTenantClusterVariableConsistency

```ts
type getTenantClusterVariableConsistency = object;
```

Defined in: [gen/CamundaClient.ts:555](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L555)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenantClusterVariable>>;
```

Defined in: [gen/CamundaClient.ts:557](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L557)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
