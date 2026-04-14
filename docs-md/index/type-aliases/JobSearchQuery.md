---
title: "Type Alias: JobSearchQuery"
sidebar_label: "JobSearchQuery"
mdx:
  format: md
---

# Type Alias: JobSearchQuery

```ts
type JobSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:4136](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4136)

Job search request.

## Type Declaration

### filter?

```ts
optional filter: JobFilter;
```

The job search filters.

### sort?

```ts
optional sort: JobSearchQuerySortRequest[];
```

Sort field criteria.
