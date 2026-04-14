---
title: "Type Alias: getJobErrorStatisticsConsistency"
sidebar_label: "getJobErrorStatisticsConsistency"
mdx:
  format: md
---

# Type Alias: getJobErrorStatisticsConsistency

```ts
type getJobErrorStatisticsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:381](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L381)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobErrorStatistics>>;
```

Defined in: [gen/CamundaClient.ts:383](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L383)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
