---
title: "Type Alias: ProcessDefinitionInstanceVersionStatisticsQuerySortRequest"
sidebar_label: "ProcessDefinitionInstanceVersionStatisticsQuerySortRequest"
mdx:
  format: md
---

# Type Alias: ProcessDefinitionInstanceVersionStatisticsQuerySortRequest

```ts
type ProcessDefinitionInstanceVersionStatisticsQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:6046](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6046)

## Properties

### field

```ts
field: 
  | "processDefinitionId"
  | "processDefinitionKey"
  | "processDefinitionName"
  | "processDefinitionVersion"
  | "activeInstancesWithIncidentCount"
  | "activeInstancesWithoutIncidentCount";
```

Defined in: [gen/types.gen.ts:6050](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6050)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:6051](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6051)
