---
title: "Type Alias: IncidentSearchQuerySortRequest"
sidebar_label: "IncidentSearchQuerySortRequest"
mdx:
  format: md
---

# Type Alias: IncidentSearchQuerySortRequest

```ts
type IncidentSearchQuerySortRequest = object;
```

Defined in: [gen/types.gen.ts:3504](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3504)

## Properties

### field

```ts
field: 
  | "incidentKey"
  | "processDefinitionKey"
  | "processDefinitionId"
  | "processInstanceKey"
  | "errorType"
  | "elementId"
  | "elementInstanceKey"
  | "creationTime"
  | "state"
  | "jobKey"
  | "tenantId";
```

Defined in: [gen/types.gen.ts:3508](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3508)

The field to sort by.

***

### order?

```ts
optional order: SortOrderEnum;
```

Defined in: [gen/types.gen.ts:3509](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3509)
