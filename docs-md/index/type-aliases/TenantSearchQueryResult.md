---
title: "Type Alias: TenantSearchQueryResult"
sidebar_label: "TenantSearchQueryResult"
mdx:
  format: md
---

# Type Alias: TenantSearchQueryResult

```ts
type TenantSearchQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:7411](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7411)

Tenant search response.

## Type Declaration

### items

```ts
items: TenantResult[];
```

The matching tenants.
