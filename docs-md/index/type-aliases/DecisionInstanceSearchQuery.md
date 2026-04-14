---
title: "Type Alias: DecisionInstanceSearchQuery"
sidebar_label: "DecisionInstanceSearchQuery"
mdx:
  format: md
---

# Type Alias: DecisionInstanceSearchQuery

```ts
type DecisionInstanceSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:1700](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1700)

## Type Declaration

### filter?

```ts
optional filter: DecisionInstanceFilter;
```

The decision instance search filters.

### sort?

```ts
optional sort: DecisionInstanceSearchQuerySortRequest[];
```

Sort field criteria.
