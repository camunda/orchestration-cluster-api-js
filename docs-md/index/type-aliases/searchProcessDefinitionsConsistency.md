---
title: "Type Alias: searchProcessDefinitionsConsistency"
sidebar_label: "searchProcessDefinitionsConsistency"
mdx:
  format: md
---

# Type Alias: searchProcessDefinitionsConsistency

```ts
type searchProcessDefinitionsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:854](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L854)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessDefinitions>>;
```

Defined in: [gen/CamundaClient.ts:856](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L856)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
