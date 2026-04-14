---
title: "Type Alias: ProcessInstanceSearchQuery"
sidebar_label: "ProcessInstanceSearchQuery"
mdx:
  format: md
---

# Type Alias: ProcessInstanceSearchQuery

```ts
type ProcessInstanceSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:6286](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6286)

Process instance search request.

## Type Declaration

### filter?

```ts
optional filter: ProcessInstanceFilter;
```

The process instance search filters.

### sort?

```ts
optional sort: ProcessInstanceSearchQuerySortRequest[];
```

Sort field criteria.
