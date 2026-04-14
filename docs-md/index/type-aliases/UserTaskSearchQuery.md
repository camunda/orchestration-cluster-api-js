---
title: "Type Alias: UserTaskSearchQuery"
sidebar_label: "UserTaskSearchQuery"
mdx:
  format: md
---

# Type Alias: UserTaskSearchQuery

```ts
type UserTaskSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:7527](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7527)

User task search query request.

## Type Declaration

### filter?

```ts
optional filter: UserTaskFilter;
```

The user task search filters.

### sort?

```ts
optional sort: UserTaskSearchQuerySortRequest[];
```

Sort field criteria.
