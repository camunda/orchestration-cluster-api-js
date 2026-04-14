---
title: "Type Alias: searchGlobalTaskListenersConsistency"
sidebar_label: "searchGlobalTaskListenersConsistency"
mdx:
  format: md
---

# Type Alias: searchGlobalTaskListenersConsistency

```ts
type searchGlobalTaskListenersConsistency = object;
```

Defined in: [gen/CamundaClient.ts:761](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L761)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGlobalTaskListeners>>;
```

Defined in: [gen/CamundaClient.ts:763](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L763)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
