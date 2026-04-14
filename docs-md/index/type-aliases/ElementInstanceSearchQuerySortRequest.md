---
title: "Type Alias: ElementInstanceSearchQuerySortRequest"
sidebar_label: "ElementInstanceSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: ElementInstanceSearchQuerySortRequest

```ts
type ElementInstanceSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:2517](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2517)

## Properties

### field

```ts
field: 
  | "elementInstanceKey"
  | "processInstanceKey"
  | "processDefinitionKey"
  | "processDefinitionId"
  | "startDate"
  | "endDate"
  | "elementId"
  | "elementName"
  | "type"
  | "state"
  | "incidentKey"
  | "tenantId";
```

Defined in: [gen/types.gen.ts:2521](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2521)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:2522](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2522)
