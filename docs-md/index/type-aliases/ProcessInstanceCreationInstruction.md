---
title: "Type Alias: ProcessInstanceCreationInstruction"
sidebar_label: "ProcessInstanceCreationInstruction"
mdx:
  format: md
---

# Type Alias: ProcessInstanceCreationInstruction

```ts
type ProcessInstanceCreationInstruction = 
  | ProcessInstanceCreationInstructionByKey
  | ProcessInstanceCreationInstructionById;
```

Defined in: [gen/types.gen.ts:6059](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6059)

Instructions for creating a process instance. The process definition can be specified
either by id or by key.
