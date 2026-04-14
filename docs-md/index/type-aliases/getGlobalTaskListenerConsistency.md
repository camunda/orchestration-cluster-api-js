---
title: "Type Alias: getGlobalTaskListenerConsistency"
sidebar_label: "getGlobalTaskListenerConsistency"
mdx:
  format: md
---

# Type Alias: getGlobalTaskListenerConsistency

```ts
type getGlobalTaskListenerConsistency = object;
```

Defined in: [gen/CamundaClient.ts:357](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L357)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGlobalTaskListener>>;
```

Defined in: [gen/CamundaClient.ts:359](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L359)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
