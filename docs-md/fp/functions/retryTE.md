---
title: "Function: retryTE()"
sidebar_label: "retryTE()"
mdx:
  format: md
---

# Function: retryTE()

:::caution Technical Preview
The Functional Programming API is a **technical preview**. Its surface may change in future releases without following semver.
:::


```ts
function retryTE<E, A>(task, opts): TaskEither<E, A>;
```

Defined in: [fp-ts.ts:128](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/fp-ts.ts#L128)

## Type Parameters

### E

`E`

### A

`A`

## Parameters

### task

[`TaskEither`](../type-aliases/TaskEither.md)\<`E`, `A`\>

### opts

#### baseDelayMs?

`number`

#### max

`number`

#### shouldRetry?

(`e`, `attempt`) => `boolean` \| `Promise`\<`boolean`\>

## Returns

[`TaskEither`](../type-aliases/TaskEither.md)\<`E`, `A`\>
