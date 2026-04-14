---
title: "Type Alias: ProcessDefinitionSearchQuery"
sidebar_label: "ProcessDefinitionSearchQuery"
mdx:
  format: md
---

# Type Alias: ProcessDefinitionSearchQuery

```ts
type ProcessDefinitionSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:5740](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5740)

## Type Declaration

### filter?

```ts
optional filter: ProcessDefinitionFilter;
```

The process definition search filters.

### sort?

```ts
optional sort: ProcessDefinitionSearchQuerySortRequest[];
```

Sort field criteria.
