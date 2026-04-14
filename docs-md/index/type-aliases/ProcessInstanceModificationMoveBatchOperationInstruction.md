---
title: "Type Alias: ProcessInstanceModificationMoveBatchOperationInstruction"
sidebar_label: "ProcessInstanceModificationMoveBatchOperationInstruction"
mdx:
  format: md
---

# Type Alias: ProcessInstanceModificationMoveBatchOperationInstruction

```ts
type ProcessInstanceModificationMoveBatchOperationInstruction = object;
```

Defined in: [gen/types.gen.ts:1016](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1016)

Instructions describing a move operation. This instruction will terminate all active
element instances at `sourceElementId` and activate a new element instance for each
terminated one at `targetElementId`. The new element instances are created in the parent
scope of the source element instances.

## Properties

### sourceElementId

```ts
sourceElementId: ElementId;
```

Defined in: [gen/types.gen.ts:1020](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1020)

The source element ID.

***

### targetElementId

```ts
targetElementId: ElementId;
```

Defined in: [gen/types.gen.ts:1024](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1024)

The target element ID.
