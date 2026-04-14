---
title: "Type Alias: UserSearchQueryRequest"
sidebar_label: "UserSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: UserSearchQueryRequest

```ts
type UserSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:8015](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L8015)

## Type Declaration

### filter?

```ts
optional filter: UserFilter;
```

The user search filters.

### sort?

```ts
optional sort: UserSearchQuerySortRequest[];
```

Sort field criteria.
