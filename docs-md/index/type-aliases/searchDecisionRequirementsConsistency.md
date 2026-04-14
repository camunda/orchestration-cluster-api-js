---
title: "Type Alias: searchDecisionRequirementsConsistency"
sidebar_label: "searchDecisionRequirementsConsistency"
mdx:
  format: md
---

# Type Alias: searchDecisionRequirementsConsistency

```ts
type searchDecisionRequirementsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:736](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L736)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionRequirements>>;
```

Defined in: [gen/CamundaClient.ts:738](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L738)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
