---
title: "Type Alias: BatchOperationSearchQueryResult"
sidebar_label: "BatchOperationSearchQueryResult"
mdx:
  format: md
---

# Type Alias: BatchOperationSearchQueryResult

```ts
type BatchOperationSearchQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:759](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L759)

The batch operation search query result.

## Type Declaration

### items

```ts
items: BatchOperationResponse[];
```

The matching batch operations.
