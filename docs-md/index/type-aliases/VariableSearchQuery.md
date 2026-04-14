---
title: "Type Alias: VariableSearchQuery"
sidebar_label: "VariableSearchQuery"
mdx:
  format: md
---

# Type Alias: VariableSearchQuery

```ts
type VariableSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:8062](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L8062)

Variable search query request.

## Type Declaration

### filter?

```ts
optional filter: VariableFilter;
```

The variable search filters.

### sort?

```ts
optional sort: VariableSearchQuerySortRequest[];
```

Sort field criteria.
