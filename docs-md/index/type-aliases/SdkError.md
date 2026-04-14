---
title: "Type Alias: SdkError"
sidebar_label: "SdkError"
mdx:
  format: md
---

# Type Alias: SdkError

```ts
type SdkError = 
  | HttpSdkError
  | ValidationSdkError
  | AuthSdkError
  | NetworkSdkError
  | CancelSdkError;
```

Defined in: [runtime/errors.ts:41](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/errors.ts#L41)
