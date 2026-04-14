---
title: "Type Alias: searchAuthorizationsConsistency"
sidebar_label: "searchAuthorizationsConsistency"
mdx:
  format: md
---

# Type Alias: searchAuthorizationsConsistency

```ts
type searchAuthorizationsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:652](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L652)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuthorizations>>;
```

Defined in: [gen/CamundaClient.ts:654](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L654)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
