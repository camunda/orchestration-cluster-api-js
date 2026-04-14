---
title: "Type Alias: SourceElementIdInstruction"
sidebar_label: "SourceElementIdInstruction"
mdx:
  format: md
---

# Type Alias: SourceElementIdInstruction

```ts
type SourceElementIdInstruction = object;
```

Defined in: [gen/types.gen.ts:6759](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6759)

Defines an instruction with a sourceElementId. The move instruction with this sourceType will terminate all active element
instances with the sourceElementId and activate a new element instance for each terminated
one at targetElementId.

## Properties

### sourceElementId

```ts
sourceElementId: ElementId;
```

Defined in: [gen/types.gen.ts:6768](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6768)

The id of the source element for the move instruction.

***

### sourceType

```ts
sourceType: string;
```

Defined in: [gen/types.gen.ts:6763](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6763)

The type of source element instruction.
