---
title: "Type Alias: GetDecisionDefinitionData"
sidebar_label: "GetDecisionDefinitionData"
mdx:
  format: md
---

# Type Alias: GetDecisionDefinitionData

```ts
type GetDecisionDefinitionData = object;
```

Defined in: [gen/types.gen.ts:9673](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9673)

## Properties

### body?

```ts
optional body: never;
```

Defined in: [gen/types.gen.ts:9674](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9674)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:9675](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9675)

#### decisionDefinitionKey

```ts
decisionDefinitionKey: DecisionDefinitionKey;
```

The assigned key of the decision definition, which acts as a unique identifier for this decision.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:9681](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9681)

***

### url

```ts
url: "/decision-definitions/{decisionDefinitionKey}";
```

Defined in: [gen/types.gen.ts:9682](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9682)
