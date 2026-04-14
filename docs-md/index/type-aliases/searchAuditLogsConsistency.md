---
title: "Type Alias: searchAuditLogsConsistency"
sidebar_label: "searchAuditLogsConsistency"
mdx:
  format: md
---

# Type Alias: searchAuditLogsConsistency

```ts
type searchAuditLogsConsistency = object;
```

Defined in: [gen/CamundaClient.ts:644](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L644)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuditLogs>>;
```

Defined in: [gen/CamundaClient.ts:646](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L646)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
