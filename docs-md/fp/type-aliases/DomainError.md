---
title: "Type Alias: DomainError"
sidebar_label: "DomainError"
mdx:
  format: md
---

# Type Alias: DomainError

:::caution Technical Preview
The Functional Programming API is a **technical preview**. Its surface may change in future releases without following semver.
:::


```ts
type DomainError = 
  | CamundaValidationError
  | EventualConsistencyTimeoutError
  | HttpError
  | Error;
```

Defined in: [fp-ts.ts:24](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/fp-ts.ts#L24)
