---
title: "Type Alias: UserTaskVariableSearchQuerySortRequest"
sidebar_label: "UserTaskVariableSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: UserTaskVariableSearchQuerySortRequest

```ts
type UserTaskVariableSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:7812](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7812)

## Properties

### field

```ts
field: 
  | "value"
  | "name"
  | "tenantId"
  | "variableKey"
  | "scopeKey"
  | "processInstanceKey";
```

Defined in: [gen/types.gen.ts:7816](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7816)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:7817](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7817)
