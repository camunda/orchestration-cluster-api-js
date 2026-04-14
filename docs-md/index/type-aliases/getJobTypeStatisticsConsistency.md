---
title: "Type Alias: getJobTypeStatisticsConsistency"
sidebar_label: "getJobTypeStatisticsConsistency"
mdx:
  format: md
---

# Type Alias: getJobTypeStatisticsConsistency

```ts
type getJobTypeStatisticsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:397](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L397)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobTypeStatistics>>;
```

Defined in: [gen/CamundaClient.ts:399](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L399)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
