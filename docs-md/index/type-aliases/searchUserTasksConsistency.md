---
title: "Type Alias: searchUserTasksConsistency"
sidebar_label: "searchUserTasksConsistency"
mdx:
  format: md
---

# Type Alias: searchUserTasksConsistency

```ts
type searchUserTasksConsistency = object;
```

Defined in: [gen/CamundaClient.ts:967](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L967)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTasks>>;
```

Defined in: [gen/CamundaClient.ts:969](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L969)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
