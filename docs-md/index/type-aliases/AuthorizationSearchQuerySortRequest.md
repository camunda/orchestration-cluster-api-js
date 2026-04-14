---
title: "Type Alias: AuthorizationSearchQuerySortRequest"
sidebar_label: "AuthorizationSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: AuthorizationSearchQuerySortRequest

```ts
type AuthorizationSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:593](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L593)

## Properties

### field

```ts
field: 
  | "ownerId"
  | "ownerType"
  | "resourceId"
  | "resourcePropertyName"
  | "resourceType";
```

Defined in: [gen/types.gen.ts:597](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L597)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:598](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L598)
