---
title: "Type Alias: getTenantConsistency"
sidebar_label: "getTenantConsistency"
mdx:
  format: md
---

# Type Alias: getTenantConsistency

```ts
type getTenantConsistency = object;
```

Defined in: [gen/CamundaClient.ts:546](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L546)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenant>>;
```

Defined in: [gen/CamundaClient.ts:548](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L548)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
