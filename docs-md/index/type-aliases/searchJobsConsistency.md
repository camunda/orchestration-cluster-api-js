---
title: "Type Alias: searchJobsConsistency"
sidebar_label: "searchJobsConsistency"
mdx:
  format: md
---

# Type Alias: searchJobsConsistency

```ts
type searchJobsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:803](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L803)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchJobs>>;
```

Defined in: [gen/CamundaClient.ts:805](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L805)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
