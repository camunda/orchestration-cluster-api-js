---
title: "Function: isOk()"
sidebar_label: "isOk()"
mdx:
  format: md
---

# Function: isOk()

```ts
function isOk<T, E>(r): r is { ok: true; value: T };
```

Defined in: [resultClient.ts:5](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/resultClient.ts#L5)

## Type Parameters

### T

`T`

### E

`E`

## Parameters

### r

[`Result`](../type-aliases/Result.md)\<`T`, `E`\>

## Returns

`r is { ok: true; value: T }`
