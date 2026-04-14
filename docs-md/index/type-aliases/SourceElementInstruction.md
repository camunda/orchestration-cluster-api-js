---
title: "Type Alias: SourceElementInstruction"
sidebar_label: "SourceElementInstruction"
mdx:
  format: md
---

# Type Alias: SourceElementInstruction

```ts
type SourceElementInstruction = 
  | object & SourceElementIdInstruction
  | object & SourceElementInstanceKeyInstruction;
```

Defined in: [gen/types.gen.ts:6747](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6747)

Defines the source element identifier for the move instruction. It can either be a sourceElementId, or sourceElementInstanceKey.
