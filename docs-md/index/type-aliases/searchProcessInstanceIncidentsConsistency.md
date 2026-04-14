---
title: "Type Alias: searchProcessInstanceIncidentsConsistency"
sidebar_label: "searchProcessInstanceIncidentsConsistency"
mdx:
  format: md
---

# Type Alias: searchProcessInstanceIncidentsConsistency

```ts
type searchProcessInstanceIncidentsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:863](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L863)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
```

Defined in: [gen/CamundaClient.ts:865](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L865)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
