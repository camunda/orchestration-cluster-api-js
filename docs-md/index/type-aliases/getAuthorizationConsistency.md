---
title: "Type Alias: getAuthorizationConsistency"
sidebar_label: "getAuthorizationConsistency"
mdx:
  format: md
---

# Type Alias: getAuthorizationConsistency

```ts
type getAuthorizationConsistency = object;
```

Defined in: [gen/CamundaClient.ts:270](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L270)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getAuthorization>>;
```

Defined in: [gen/CamundaClient.ts:272](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L272)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
