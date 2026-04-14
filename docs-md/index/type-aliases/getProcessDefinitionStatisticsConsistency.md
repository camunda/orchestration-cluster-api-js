---
title: "Type Alias: getProcessDefinitionStatisticsConsistency"
sidebar_label: "getProcessDefinitionStatisticsConsistency"
mdx:
  format: md
---

# Type Alias: getProcessDefinitionStatisticsConsistency

```ts
type getProcessDefinitionStatisticsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:456](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L456)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
```

Defined in: [gen/CamundaClient.ts:458](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L458)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
