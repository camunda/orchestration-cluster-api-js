---
title: "Type Alias: ProcessInstanceModificationInstruction"
sidebar_label: "ProcessInstanceModificationInstruction"
mdx:
  format: md
---

# Type Alias: ProcessInstanceModificationInstruction

```ts
type ProcessInstanceModificationInstruction = object;
```

Defined in: [gen/types.gen.ts:6665](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6665)

## Properties

### activateInstructions?

```ts
optional activateInstructions: ProcessInstanceModificationActivateInstruction[];
```

Defined in: [gen/types.gen.ts:6670](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6670)

Instructions describing which elements to activate in which scopes and which variables to create or update.

***

### moveInstructions?

```ts
optional moveInstructions: ProcessInstanceModificationMoveInstruction[];
```

Defined in: [gen/types.gen.ts:6674](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6674)

Instructions describing which elements to move from one scope to another.

***

### operationReference?

```ts
optional operationReference: OperationReference;
```

Defined in: [gen/types.gen.ts:6666](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6666)

***

### terminateInstructions?

```ts
optional terminateInstructions: ProcessInstanceModificationTerminateInstruction[];
```

Defined in: [gen/types.gen.ts:6678](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6678)

Instructions describing which elements to terminate.
