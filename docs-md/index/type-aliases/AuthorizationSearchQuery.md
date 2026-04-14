---
title: "Type Alias: AuthorizationSearchQuery"
sidebar_label: "AuthorizationSearchQuery"
mdx:
  format: md
---

# Type Alias: AuthorizationSearchQuery

```ts
type AuthorizationSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:601](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L601)

## Type Declaration

### filter?

```ts
optional filter: AuthorizationFilter;
```

The authorization search filters.

### sort?

```ts
optional sort: AuthorizationSearchQuerySortRequest[];
```

Sort field criteria.
