---
title: "Type Alias: ProcessInstanceSearchQueryResult"
sidebar_label: "ProcessInstanceSearchQueryResult"
mdx:
  format: md
---

# Type Alias: ProcessInstanceSearchQueryResult

```ts
type ProcessInstanceSearchQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:6489](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6489)

Process instance search response.

## Type Declaration

### items

```ts
items: ProcessInstanceResult[];
```

The matching process instances.
