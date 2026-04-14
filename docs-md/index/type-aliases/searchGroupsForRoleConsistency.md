---
title: "Type Alias: searchGroupsForRoleConsistency"
sidebar_label: "searchGroupsForRoleConsistency"
mdx:
  format: md
---

# Type Alias: searchGroupsForRoleConsistency

```ts
type searchGroupsForRoleConsistency = object;
```

Defined in: [gen/CamundaClient.ts:787](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L787)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupsForRole>>;
```

Defined in: [gen/CamundaClient.ts:789](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L789)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
