---
title: "Type Alias: DecisionRequirementsSearchQuery"
sidebar_label: "DecisionRequirementsSearchQuery"
mdx:
  format: md
---

# Type Alias: DecisionRequirementsSearchQuery

```ts
type DecisionRequirementsSearchQuery = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:1982](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1982)

## Type Declaration

### filter?

```ts
optional filter: DecisionRequirementsFilter;
```

The decision definition search filters.

### sort?

```ts
optional sort: DecisionRequirementsSearchQuerySortRequest[];
```

Sort field criteria.
