---
title: "Type Alias: ScopeKeyFilterProperty"
sidebar_label: "ScopeKeyFilterProperty"
mdx:
  format: md
---

# Type Alias: ScopeKeyFilterProperty

```ts
type ScopeKeyFilterProperty = 
  | ScopeKeyExactMatch
  | AdvancedScopeKeyFilter;
```

Defined in: [gen/types.gen.ts:4912](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4912)

ScopeKey property with full advanced search capabilities. Filter by the key of the
element instance or process instance that defines the scope of a variable.
