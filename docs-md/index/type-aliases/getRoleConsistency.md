---
title: "Type Alias: getRoleConsistency"
sidebar_label: "getRoleConsistency"
mdx:
  format: md
---

# Type Alias: getRoleConsistency

```ts
type getRoleConsistency = object;
```

Defined in: [gen/CamundaClient.ts:526](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L526)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getRole>>;
```

Defined in: [gen/CamundaClient.ts:528](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L528)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
