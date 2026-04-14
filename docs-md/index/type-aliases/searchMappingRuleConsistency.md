---
title: "Type Alias: searchMappingRuleConsistency"
sidebar_label: "searchMappingRuleConsistency"
mdx:
  format: md
---

# Type Alias: searchMappingRuleConsistency

```ts
type searchMappingRuleConsistency = object;
```

Defined in: [gen/CamundaClient.ts:811](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L811)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRule>>;
```

Defined in: [gen/CamundaClient.ts:813](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L813)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
