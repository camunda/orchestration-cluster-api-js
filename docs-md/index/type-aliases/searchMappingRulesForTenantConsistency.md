---
title: "Type Alias: searchMappingRulesForTenantConsistency"
sidebar_label: "searchMappingRulesForTenantConsistency"
mdx:
  format: md
---

# Type Alias: searchMappingRulesForTenantConsistency

```ts
type searchMappingRulesForTenantConsistency = object;
```

Defined in: [gen/CamundaClient.ts:838](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L838)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForTenant>>;
```

Defined in: [gen/CamundaClient.ts:840](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L840)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
