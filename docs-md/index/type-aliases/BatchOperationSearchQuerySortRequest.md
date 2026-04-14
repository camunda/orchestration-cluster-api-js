---
title: "Type Alias: BatchOperationSearchQuerySortRequest"
sidebar_label: "BatchOperationSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: BatchOperationSearchQuerySortRequest

```ts
type BatchOperationSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:708](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L708)

## Properties

### field

```ts
field: 
  | "batchOperationKey"
  | "operationType"
  | "state"
  | "startDate"
  | "endDate"
  | "actorType"
  | "actorId";
```

Defined in: [gen/types.gen.ts:712](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L712)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:713](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L713)
