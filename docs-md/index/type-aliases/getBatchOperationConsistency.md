---
title: "Type Alias: getBatchOperationConsistency"
sidebar_label: "getBatchOperationConsistency"
mdx:
  format: md
---

# Type Alias: getBatchOperationConsistency

```ts
type getBatchOperationConsistency = object;
```

Defined in: [gen/CamundaClient.ts:278](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L278)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getBatchOperation>>;
```

Defined in: [gen/CamundaClient.ts:280](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L280)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
