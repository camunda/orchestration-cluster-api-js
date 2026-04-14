---
title: "Type Alias: getProcessDefinitionXmlConsistency"
sidebar_label: "getProcessDefinitionXmlConsistency"
mdx:
  format: md
---

# Type Alias: getProcessDefinitionXmlConsistency

```ts
type getProcessDefinitionXmlConsistency = object;
```

Defined in: [gen/CamundaClient.ts:464](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L464)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
```

Defined in: [gen/CamundaClient.ts:466](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L466)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
