---
title: "Type Alias: SearchRolesForGroupResponses"
sidebar_label: "SearchRolesForGroupResponses"
mdx:
  format: md
---

# Type Alias: SearchRolesForGroupResponses

```ts
type SearchRolesForGroupResponses = object;
```

Defined in: [gen/types.gen.ts:11395](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L11395)

## Properties

### 200

```ts
200: SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:11399](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L11399)

The roles assigned to the group.

#### Type Declaration

##### items

```ts
items: RoleResult[];
```

The matching roles.
