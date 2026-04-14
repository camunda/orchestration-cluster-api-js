---
title: "Type Alias: UnassignMappingRuleFromTenantData"
sidebar_label: "UnassignMappingRuleFromTenantData"
mdx:
  format: md
---

# Type Alias: UnassignMappingRuleFromTenantData

```ts
type UnassignMappingRuleFromTenantData = object;
```

Defined in: [gen/types.gen.ts:15368](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L15368)

## Properties

### body?

```ts
optional body: never;
```

Defined in: [gen/types.gen.ts:15369](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L15369)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:15370](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L15370)

#### mappingRuleId

```ts
mappingRuleId: string;
```

The unique identifier of the mapping rule.

#### tenantId

```ts
tenantId: TenantId;
```

The unique identifier of the tenant.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:15380](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L15380)

***

### url

```ts
url: "/tenants/{tenantId}/mapping-rules/{mappingRuleId}";
```

Defined in: [gen/types.gen.ts:15381](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L15381)
