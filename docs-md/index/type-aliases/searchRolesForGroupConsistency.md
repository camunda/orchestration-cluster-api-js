---
title: "Type Alias: searchRolesForGroupConsistency"
sidebar_label: "searchRolesForGroupConsistency"
mdx:
  format: md
---

# Type Alias: searchRolesForGroupConsistency

```ts
type searchRolesForGroupConsistency = object;
```

Defined in: [gen/CamundaClient.ts:888](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L888)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForGroup>>;
```

Defined in: [gen/CamundaClient.ts:890](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L890)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
