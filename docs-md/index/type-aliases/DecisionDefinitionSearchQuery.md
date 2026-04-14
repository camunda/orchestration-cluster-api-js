---
title: "Type Alias: DecisionDefinitionSearchQuery"
sidebar_label: "DecisionDefinitionSearchQuery"
mdx:
  format: md
---

# Type Alias: DecisionDefinitionSearchQuery

```ts
type DecisionDefinitionSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:1439](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1439)

## Type Declaration

### filter?

```ts
optional filter: DecisionDefinitionFilter;
```

The decision definition search filters.

### sort?

```ts
optional sort: DecisionDefinitionSearchQuerySortRequest[];
```

Sort field criteria.
