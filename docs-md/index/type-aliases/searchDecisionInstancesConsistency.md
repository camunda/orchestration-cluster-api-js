---
title: "Type Alias: searchDecisionInstancesConsistency"
sidebar_label: "searchDecisionInstancesConsistency"
mdx:
  format: md
---

# Type Alias: searchDecisionInstancesConsistency

```ts
type searchDecisionInstancesConsistency = object;
```

Defined in: [gen/CamundaClient.ts:728](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L728)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionInstances>>;
```

Defined in: [gen/CamundaClient.ts:730](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L730)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
