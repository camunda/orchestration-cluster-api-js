---
title: "Type Alias: JobWorkerStatisticsQueryResult"
sidebar_label: "JobWorkerStatisticsQueryResult"
mdx:
  format: md
---

# Type Alias: JobWorkerStatisticsQueryResult

```ts
type JobWorkerStatisticsQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:3810](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3810)

Job worker statistics query result.

## Type Declaration

### items

```ts
items: JobWorkerStatisticsItem[];
```

The list of per-worker statistics items.

### page

```ts
page: SearchQueryPageResponse;
```
