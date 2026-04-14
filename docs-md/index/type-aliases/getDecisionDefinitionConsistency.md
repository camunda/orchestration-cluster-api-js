---
title: "Type Alias: getDecisionDefinitionConsistency"
sidebar_label: "getDecisionDefinitionConsistency"
mdx:
  format: md
---

# Type Alias: getDecisionDefinitionConsistency

```ts
type getDecisionDefinitionConsistency = object;
```

Defined in: [gen/CamundaClient.ts:286](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L286)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinition>>;
```

Defined in: [gen/CamundaClient.ts:288](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L288)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
