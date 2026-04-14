---
title: "Type Alias: MessageCorrelationResult"
sidebar_label: "MessageCorrelationResult"
mdx:
  format: md
---

# Type Alias: MessageCorrelationResult

```ts
type MessageCorrelationResult = object;
```

Defined in: [gen/types.gen.ts:5303](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5303)

The message key of the correlated message, as well as the first process instance key it
correlated with.

## Properties

### messageKey

```ts
messageKey: MessageKey;
```

Defined in: [gen/types.gen.ts:5311](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5311)

The key of the correlated message.

***

### processInstanceKey

```ts
processInstanceKey: ProcessInstanceKey;
```

Defined in: [gen/types.gen.ts:5315](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5315)

The key of the first process instance the message correlated with

***

### tenantId

```ts
tenantId: TenantId;
```

Defined in: [gen/types.gen.ts:5307](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5307)

The tenant ID of the correlated message
