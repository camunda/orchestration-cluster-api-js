---
title: "Type Alias: AncestorScopeInstruction"
sidebar_label: "AncestorScopeInstruction"
mdx:
  format: md
---

# Type Alias: AncestorScopeInstruction

```ts
type AncestorScopeInstruction = 
  | object & DirectAncestorKeyInstruction
  | object & InferredAncestorKeyInstruction
  | object & UseSourceParentKeyInstruction;
```

Defined in: [gen/types.gen.ts:6793](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L6793)

Defines the ancestor scope for the created element instances. The default behavior resembles
a "direct" scope instruction with an `ancestorElementInstanceKey` of `"-1"`.
