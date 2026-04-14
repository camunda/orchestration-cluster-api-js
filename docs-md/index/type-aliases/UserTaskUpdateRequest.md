---
title: "Type Alias: UserTaskUpdateRequest"
sidebar_label: "UserTaskUpdateRequest"
mdx:
  format: md
---

# Type Alias: UserTaskUpdateRequest

```ts
type UserTaskUpdateRequest = object;
```

Defined in: [gen/types.gen.ts:7760](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7760)

## Properties

### action?

```ts
optional action: string | null;
```

Defined in: [gen/types.gen.ts:7766](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7766)

A custom action value that will be accessible from user task events resulting from this endpoint invocation. If not provided, it will default to "update".

***

### changeset?

```ts
optional changeset: Changeset;
```

Defined in: [gen/types.gen.ts:7761](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7761)
