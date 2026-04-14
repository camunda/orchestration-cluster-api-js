---
title: "Type Alias: GetProcessInstanceSequenceFlowsData"
sidebar_label: "GetProcessInstanceSequenceFlowsData"
mdx:
  format: md
---

# Type Alias: GetProcessInstanceSequenceFlowsData

```ts
type GetProcessInstanceSequenceFlowsData = object;
```

Defined in: [gen/types.gen.ts:13605](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13605)

## Properties

### body?

```ts
optional body: never;
```

Defined in: [gen/types.gen.ts:13606](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13606)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:13607](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13607)

#### processInstanceKey

```ts
processInstanceKey: ProcessInstanceKey;
```

The assigned key of the process instance, which acts as a unique identifier for this process instance.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:13613](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13613)

***

### url

```ts
url: "/process-instances/{processInstanceKey}/sequence-flows";
```

Defined in: [gen/types.gen.ts:13614](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13614)
