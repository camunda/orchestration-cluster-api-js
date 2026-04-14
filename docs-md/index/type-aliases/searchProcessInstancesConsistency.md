---
title: "Type Alias: searchProcessInstancesConsistency"
sidebar_label: "searchProcessInstancesConsistency"
mdx:
  format: md
---

# Type Alias: searchProcessInstancesConsistency

```ts
type searchProcessInstancesConsistency = object;
```

Defined in: [gen/CamundaClient.ts:871](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L871)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstances>>;
```

Defined in: [gen/CamundaClient.ts:873](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L873)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
