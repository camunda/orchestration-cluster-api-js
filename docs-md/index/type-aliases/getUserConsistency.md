---
title: "Type Alias: getUserConsistency"
sidebar_label: "getUserConsistency"
mdx:
  format: md
---

# Type Alias: getUserConsistency

```ts
type getUserConsistency = object;
```

Defined in: [gen/CamundaClient.ts:576](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L576)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUser>>;
```

Defined in: [gen/CamundaClient.ts:578](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L578)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
