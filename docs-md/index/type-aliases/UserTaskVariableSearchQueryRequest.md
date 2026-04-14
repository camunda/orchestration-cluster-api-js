---
title: "Type Alias: UserTaskVariableSearchQueryRequest"
sidebar_label: "UserTaskVariableSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: UserTaskVariableSearchQueryRequest

```ts
type UserTaskVariableSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:7823](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7823)

User task search query request.

## Type Declaration

### filter?

```ts
optional filter: UserTaskVariableFilter;
```

The user task variable search filters.

### sort?

```ts
optional sort: UserTaskVariableSearchQuerySortRequest[];
```

Sort field criteria.
