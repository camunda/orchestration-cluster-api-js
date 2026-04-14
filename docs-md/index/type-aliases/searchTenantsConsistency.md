---
title: "Type Alias: searchTenantsConsistency"
sidebar_label: "searchTenantsConsistency"
mdx:
  format: md
---

# Type Alias: searchTenantsConsistency

```ts
type searchTenantsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:905](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L905)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchTenants>>;
```

Defined in: [gen/CamundaClient.ts:907](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L907)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
