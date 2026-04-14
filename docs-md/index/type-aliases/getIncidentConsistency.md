---
title: "Type Alias: getIncidentConsistency"
sidebar_label: "getIncidentConsistency"
mdx:
  format: md
---

# Type Alias: getIncidentConsistency

```ts
type getIncidentConsistency = object;
```

Defined in: [gen/CamundaClient.ts:373](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L373)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getIncident>>;
```

Defined in: [gen/CamundaClient.ts:375](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L375)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
