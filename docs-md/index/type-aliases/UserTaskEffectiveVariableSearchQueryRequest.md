---
title: "Type Alias: UserTaskEffectiveVariableSearchQueryRequest"
sidebar_label: "UserTaskEffectiveVariableSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: UserTaskEffectiveVariableSearchQueryRequest

```ts
type UserTaskEffectiveVariableSearchQueryRequest = object;
```

Defined in: [gen/types.gen.ts:7838](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7838)

User task effective variable search query request. Uses offset-based pagination only.

## Properties

### filter?

```ts
optional filter: UserTaskVariableFilter;
```

Defined in: [gen/types.gen.ts:7850](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7850)

The user task variable search filters.

***

### page?

```ts
optional page: OffsetPagination;
```

Defined in: [gen/types.gen.ts:7842](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7842)

Pagination parameters.

***

### sort?

```ts
optional sort: UserTaskVariableSearchQuerySortRequest[];
```

Defined in: [gen/types.gen.ts:7846](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7846)

Sort field criteria.
