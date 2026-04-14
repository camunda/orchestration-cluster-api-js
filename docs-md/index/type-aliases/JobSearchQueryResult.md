---
title: "Type Alias: JobSearchQueryResult"
sidebar_label: "JobSearchQueryResult"
mdx:
  format: md
---

# Type Alias: JobSearchQueryResult

```ts
type JobSearchQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:4252](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4252)

Job search response.

## Type Declaration

### items

```ts
items: JobSearchResult[];
```

The matching jobs.
