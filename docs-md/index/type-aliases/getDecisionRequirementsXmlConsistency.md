---
title: "Type Alias: getDecisionRequirementsXmlConsistency"
sidebar_label: "getDecisionRequirementsXmlConsistency"
mdx:
  format: md
---

# Type Alias: getDecisionRequirementsXmlConsistency

```ts
type getDecisionRequirementsXmlConsistency = object;
```

Defined in: [gen/CamundaClient.ts:318](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L318)

Management of eventual consistency *

## Properties

### consistency

```ts
consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
```

Defined in: [gen/CamundaClient.ts:320](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/CamundaClient.ts#L320)

Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default.
