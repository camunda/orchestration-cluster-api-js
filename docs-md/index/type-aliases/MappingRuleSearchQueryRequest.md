---
title: "Type Alias: MappingRuleSearchQueryRequest"
sidebar_label: "MappingRuleSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: MappingRuleSearchQueryRequest

```ts
type MappingRuleSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:5243](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5243)

## Type Declaration

### filter?

```ts
optional filter: MappingRuleFilter;
```

The mapping rule search filters.

### sort?

```ts
optional sort: MappingRuleSearchQuerySortRequest[];
```

Sort field criteria.
