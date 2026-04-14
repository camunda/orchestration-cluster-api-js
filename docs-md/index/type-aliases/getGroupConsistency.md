---
title: "Type Alias: getGroupConsistency"
sidebar_label: "getGroupConsistency"
mdx:
  format: md
---

# Type Alias: getGroupConsistency

```ts
type getGroupConsistency = object;
```

Defined in: [gen/CamundaClient.ts:365](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L365)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGroup>>;
```

Defined in: [gen/CamundaClient.ts:367](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L367)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
