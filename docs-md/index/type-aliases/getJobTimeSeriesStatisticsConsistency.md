---
title: "Type Alias: getJobTimeSeriesStatisticsConsistency"
sidebar_label: "getJobTimeSeriesStatisticsConsistency"
mdx:
  format: md
---

# Type Alias: getJobTimeSeriesStatisticsConsistency

```ts
type getJobTimeSeriesStatisticsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:389](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L389)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getJobTimeSeriesStatistics>>;
```

Defined in: [gen/CamundaClient.ts:391](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L391)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
