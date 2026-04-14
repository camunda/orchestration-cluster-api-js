---
title: "Type Alias: UsageMetricsResponse"
sidebar_label: "UsageMetricsResponse"
mdx:
  format: md
---

# Type Alias: UsageMetricsResponse

```ts
type UsageMetricsResponse = UsageMetricsResponseItem & object;
```

Defined in: [gen/types.gen.ts:7243](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7243)

## Type Declaration

### activeTenants

```ts
activeTenants: number;
```

The amount of active tenants.

### tenants

```ts
tenants: object;
```

The usage metrics by tenants. Only available if request `withTenants` query parameter was `true`.

#### Index Signature

```ts
[key: string]: UsageMetricsResponseItem
```
