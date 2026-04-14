---
title: "Type Alias: BatchOperationItemSearchQuerySortRequest"
sidebar_label: "BatchOperationItemSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: BatchOperationItemSearchQuerySortRequest

```ts
type BatchOperationItemSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:829](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L829)

## Properties

### field

```ts
field: 
  | "batchOperationKey"
  | "itemKey"
  | "processInstanceKey"
  | "processedDate"
  | "state";
```

Defined in: [gen/types.gen.ts:833](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L833)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:834](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L834)
