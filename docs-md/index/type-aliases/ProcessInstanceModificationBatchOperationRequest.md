---
title: "Type Alias: ProcessInstanceModificationBatchOperationRequest"
sidebar_label: "ProcessInstanceModificationBatchOperationRequest"
mdx:
  format: md
---

# Type Alias: ProcessInstanceModificationBatchOperationRequest

```ts
type ProcessInstanceModificationBatchOperationRequest = object;
```

Defined in: [gen/types.gen.ts:997](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L997)

The process instance filter to define on which process instances tokens should be moved,
and new element instances should be activated or terminated.

## Properties

### filter

```ts
filter: ProcessInstanceFilter;
```

Defined in: [gen/types.gen.ts:1001](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1001)

The process instance filter.

***

### moveInstructions

```ts
moveInstructions: ProcessInstanceModificationMoveBatchOperationInstruction[];
```

Defined in: [gen/types.gen.ts:1005](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1005)

Instructions for moving tokens between elements.

***

### operationReference?

```ts
optional operationReference: OperationReference;
```

Defined in: [gen/types.gen.ts:1006](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1006)
