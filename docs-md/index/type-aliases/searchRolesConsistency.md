---
title: "Type Alias: searchRolesConsistency"
sidebar_label: "searchRolesConsistency"
mdx:
  format: md
---

# Type Alias: searchRolesConsistency

```ts
type searchRolesConsistency = object;
```

Defined in: [gen/CamundaClient.ts:879](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L879)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRoles>>;
```

Defined in: [gen/CamundaClient.ts:881](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L881)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
