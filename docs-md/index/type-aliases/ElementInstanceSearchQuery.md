---
title: "Type Alias: ElementInstanceSearchQuery"
sidebar_label: "ElementInstanceSearchQuery"
mdx:
  format: md
---

# Type Alias: ElementInstanceSearchQuery

```ts
type ElementInstanceSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:2528](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2528)

Element instance search request.

## Type Declaration

### filter?

```ts
optional filter: ElementInstanceFilter;
```

The element instance search filters.

### sort?

```ts
optional sort: ElementInstanceSearchQuerySortRequest[];
```

Sort field criteria.
