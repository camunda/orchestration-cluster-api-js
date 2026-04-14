---
title: "Type Alias: CamundaResultClient"
sidebar_label: "CamundaResultClient"
mdx:
  format: md
---

# Type Alias: CamundaResultClient

```ts
type CamundaResultClient = object & { [K in keyof CamundaClient]: CamundaClient[K] extends (a: infer A) => Promise<infer R> ? (a: A) => Promise<Result<R>> : CamundaClient[K] extends (a: infer A) => any ? (a: A) => Promise<Result<ReturnType<CamundaClient[K]>>> | ReturnType<CamundaClient[K]> : CamundaClient[K] };
```

Defined in: [resultClient.ts:48](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/resultClient.ts#L48)

## Type Declaration

### inner

```ts
inner: CamundaClient;
```
