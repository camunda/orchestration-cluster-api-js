---
title: "Type Alias: BatchOperationError"
sidebar_label: "BatchOperationError"
mdx:
  format: md
---

# Type Alias: BatchOperationError

```ts
type BatchOperationError = object;
```

Defined in: [gen/types.gen.ts:814](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L814)

## Properties

### message

```ts
message: string;
```

Defined in: [gen/types.gen.ts:826](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L826)

The error message that occurred during the batch operation.

***

### partitionId

```ts
partitionId: number;
```

Defined in: [gen/types.gen.ts:818](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L818)

The partition ID where the error occurred.

***

### type

```ts
type: "QUERY_FAILED" | "RESULT_BUFFER_SIZE_EXCEEDED";
```

Defined in: [gen/types.gen.ts:822](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L822)

The type of the error that occurred during the batch operation.
