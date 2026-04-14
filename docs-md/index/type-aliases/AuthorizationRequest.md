---
title: "Type Alias: AuthorizationRequest"
sidebar_label: "AuthorizationRequest"
mdx:
  format: md
---

# Type Alias: AuthorizationRequest

```ts
type AuthorizationRequest = 
  | AuthorizationIdBasedRequest
  | AuthorizationPropertyBasedRequest;
```

Defined in: [gen/types.gen.ts:591](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L591)

Defines an authorization request.
Either an id-based or a property-based authorization can be provided.
