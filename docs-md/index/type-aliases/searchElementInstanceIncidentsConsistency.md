---
title: "Type Alias: searchElementInstanceIncidentsConsistency"
sidebar_label: "searchElementInstanceIncidentsConsistency"
mdx:
  format: md
---

# Type Alias: searchElementInstanceIncidentsConsistency

```ts
type searchElementInstanceIncidentsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:745](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L745)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchElementInstanceIncidents>>;
```

Defined in: [gen/CamundaClient.ts:747](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L747)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
