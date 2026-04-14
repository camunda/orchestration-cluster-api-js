---
title: "Type Alias: ScopeKey"
sidebar_label: "ScopeKey"
mdx:
  format: md
---

# Type Alias: ScopeKey

```ts
type ScopeKey = 
  | ProcessInstanceKey
  | ElementInstanceKey;
```

Defined in: [gen/types.gen.ts:4688](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4688)

System-generated key for a scope. A scope can hold variables and represents either an
element instance in a BPMN process or the process instance itself.
