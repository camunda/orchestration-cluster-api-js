---
title: "Type Alias: ProcessInstanceModificationMoveInstruction"
sidebar_label: "ProcessInstanceModificationMoveInstruction"
mdx:
  format: md
---

# Type Alias: ProcessInstanceModificationMoveInstruction

```ts
type ProcessInstanceModificationMoveInstruction = object;
```

Defined in: [gen/types.gen.ts:6730](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6730)

Instruction describing a move operation. This instruction will terminate active element
instances based on the sourceElementInstruction and activate a new element instance for each terminated
one at targetElementId. Note that, for multi-instance activities, only the multi-instance
body instances will activate new element instances at the target id.

## Properties

### ancestorScopeInstruction?

```ts
optional ancestorScopeInstruction: AncestorScopeInstruction;
```

Defined in: [gen/types.gen.ts:6736](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6736)

***

### sourceElementInstruction

```ts
sourceElementInstruction: SourceElementInstruction;
```

Defined in: [gen/types.gen.ts:6731](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6731)

***

### targetElementId

```ts
targetElementId: ElementId;
```

Defined in: [gen/types.gen.ts:6735](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6735)

The target element id.

***

### variableInstructions?

```ts
optional variableInstructions: ModifyProcessInstanceVariableInstruction[];
```

Defined in: [gen/types.gen.ts:6740](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6740)

Instructions describing which variables to create or update.
