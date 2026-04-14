---
title: "Type Alias: JobErrorStatisticsQueryResult"
sidebar_label: "JobErrorStatisticsQueryResult"
mdx:
  format: md
---

# Type Alias: JobErrorStatisticsQueryResult

```ts
type JobErrorStatisticsQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:3934](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3934)

Job error statistics query result.

## Type Declaration

### items

```ts
items: JobErrorStatisticsItem[];
```

The list of per-error statistics items.

### page

```ts
page: SearchQueryPageResponse;
```
