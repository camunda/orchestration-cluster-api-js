---
title: "Type Alias: UserTaskSearchQuerySortRequest"
sidebar_label: "UserTaskSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: UserTaskSearchQuerySortRequest

```ts
type UserTaskSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:7516](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7516)

## Properties

### field

```ts
field: 
  | "creationDate"
  | "completionDate"
  | "followUpDate"
  | "dueDate"
  | "priority"
  | "name";
```

Defined in: [gen/types.gen.ts:7520](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7520)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:7521](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7521)
