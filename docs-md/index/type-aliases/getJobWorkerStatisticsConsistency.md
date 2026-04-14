---
title: "Type Alias: getJobWorkerStatisticsConsistency"
sidebar_label: "getJobWorkerStatisticsConsistency"
mdx:
  format: md
---

# Type Alias: getJobWorkerStatisticsConsistency

```ts
type getJobWorkerStatisticsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:405](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L405)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobWorkerStatistics>>;
```

Defined in: [gen/CamundaClient.ts:407](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L407)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
