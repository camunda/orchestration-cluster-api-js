---
title: "Type Alias: searchUsersForTenantConsistency"
sidebar_label: "searchUsersForTenantConsistency"
mdx:
  format: md
---

# Type Alias: searchUsersForTenantConsistency

```ts
type searchUsersForTenantConsistency = object;
```

Defined in: [gen/CamundaClient.ts:940](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L940)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForTenant>>;
```

Defined in: [gen/CamundaClient.ts:942](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L942)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
