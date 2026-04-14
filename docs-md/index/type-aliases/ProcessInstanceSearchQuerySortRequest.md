---
title: "Type Alias: ProcessInstanceSearchQuerySortRequest"
sidebar_label: "ProcessInstanceSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: ProcessInstanceSearchQuerySortRequest

```ts
type ProcessInstanceSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:6275](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6275)

## Properties

### field

```ts
field: 
  | "processInstanceKey"
  | "processDefinitionId"
  | "processDefinitionName"
  | "processDefinitionVersion"
  | "processDefinitionVersionTag"
  | "processDefinitionKey"
  | "parentProcessInstanceKey"
  | "parentElementInstanceKey"
  | "startDate"
  | "endDate"
  | "state"
  | "hasIncident"
  | "tenantId"
  | "businessId";
```

Defined in: [gen/types.gen.ts:6279](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6279)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:6280](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6280)
