---
title: "Type Alias: getProcessInstanceStatisticsByErrorConsistency"
sidebar_label: "getProcessInstanceStatisticsByErrorConsistency"
mdx:
  format: md
---

# Type Alias: getProcessInstanceStatisticsByErrorConsistency

```ts
type getProcessInstanceStatisticsByErrorConsistency = object;
```

Defined in: [gen/CamundaClient.ts:512](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L512)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatisticsByError>>;
```

Defined in: [gen/CamundaClient.ts:514](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L514)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
