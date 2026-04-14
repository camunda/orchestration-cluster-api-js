---
title: "Type Alias: GetDecisionInstanceData"
sidebar_label: "GetDecisionInstanceData"
mdx:
  format: md
---

# Type Alias: GetDecisionInstanceData

```ts
type GetDecisionInstanceData = object;
```

Defined in: [gen/types.gen.ts:9804](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9804)

## Properties

### body?

```ts
optional body: never;
```

Defined in: [gen/types.gen.ts:9805](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9805)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:9806](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9806)

#### decisionEvaluationInstanceKey

```ts
decisionEvaluationInstanceKey: DecisionEvaluationInstanceKey;
```

The assigned key of the decision instance, which acts as a unique identifier for this decision instance.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:9812](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9812)

***

### url

```ts
url: "/decision-instances/{decisionEvaluationInstanceKey}";
```

Defined in: [gen/types.gen.ts:9813](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9813)
