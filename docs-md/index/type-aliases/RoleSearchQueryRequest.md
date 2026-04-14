---
title: "Type Alias: RoleSearchQueryRequest"
sidebar_label: "RoleSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: RoleSearchQueryRequest

```ts
type RoleSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:6988](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6988)

Role search request.

## Type Declaration

### filter?

```ts
optional filter: RoleFilter;
```

The role search filters.

### sort?

```ts
optional sort: RoleSearchQuerySortRequest[];
```

Sort field criteria.
