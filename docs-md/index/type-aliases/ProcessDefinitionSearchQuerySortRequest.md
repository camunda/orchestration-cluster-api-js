---
title: "Type Alias: ProcessDefinitionSearchQuerySortRequest"
sidebar_label: "ProcessDefinitionSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: ProcessDefinitionSearchQuerySortRequest

```ts
type ProcessDefinitionSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:5732](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5732)

## Properties

### field

```ts
field: 
  | "processDefinitionKey"
  | "name"
  | "resourceName"
  | "version"
  | "versionTag"
  | "processDefinitionId"
  | "tenantId";
```

Defined in: [gen/types.gen.ts:5736](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5736)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:5737](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5737)
