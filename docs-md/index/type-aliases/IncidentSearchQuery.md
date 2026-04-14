---
title: "Type Alias: IncidentSearchQuery"
sidebar_label: "IncidentSearchQuery"
mdx:
  format: md
---

# Type Alias: IncidentSearchQuery

```ts
type IncidentSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:3361](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3361)

## Type Declaration

### filter?

```ts
optional filter: IncidentFilter;
```

The incident search filters.

### sort?

```ts
optional sort: IncidentSearchQuerySortRequest[];
```

Sort field criteria.
