---
title: "Type Alias: BatchOperationItemSearchQuery"
sidebar_label: "BatchOperationItemSearchQuery"
mdx:
  format: md
---

# Type Alias: BatchOperationItemSearchQuery

```ts
type BatchOperationItemSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:840](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L840)

Batch operation item search request.

## Type Declaration

### filter?

```ts
optional filter: BatchOperationItemFilter;
```

The batch operation item search filters.

### sort?

```ts
optional sort: BatchOperationItemSearchQuerySortRequest[];
```

Sort field criteria.
