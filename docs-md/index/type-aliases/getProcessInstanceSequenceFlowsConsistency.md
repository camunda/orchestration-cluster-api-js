---
title: "Type Alias: getProcessInstanceSequenceFlowsConsistency"
sidebar_label: "getProcessInstanceSequenceFlowsConsistency"
mdx:
  format: md
---

# Type Alias: getProcessInstanceSequenceFlowsConsistency

```ts
type getProcessInstanceSequenceFlowsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:488](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L488)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
```

Defined in: [gen/CamundaClient.ts:490](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L490)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
