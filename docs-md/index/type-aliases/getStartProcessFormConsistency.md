---
title: "Type Alias: getStartProcessFormConsistency"
sidebar_label: "getStartProcessFormConsistency"
mdx:
  format: md
---

# Type Alias: getStartProcessFormConsistency

```ts
type getStartProcessFormConsistency = object;
```

Defined in: [gen/CamundaClient.ts:534](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L534)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getStartProcessForm>>;
```

Defined in: [gen/CamundaClient.ts:536](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L536)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
