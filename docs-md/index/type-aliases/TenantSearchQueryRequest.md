---
title: "Type Alias: TenantSearchQueryRequest"
sidebar_label: "TenantSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: TenantSearchQueryRequest

```ts
type TenantSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:7386](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7386)

Tenant search request

## Type Declaration

### filter?

```ts
optional filter: TenantFilter;
```

The tenant search filters.

### sort?

```ts
optional sort: TenantSearchQuerySortRequest[];
```

Sort field criteria.
