---
title: "Type Alias: EvaluateConditionalResult"
sidebar_label: "EvaluateConditionalResult"
mdx:
  format: md
---

# Type Alias: EvaluateConditionalResult

```ts
type EvaluateConditionalResult = object;
```

Defined in: [gen/types.gen.ts:1390](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1390)

## Properties

### conditionalEvaluationKey

```ts
conditionalEvaluationKey: ConditionalEvaluationKey;
```

Defined in: [gen/types.gen.ts:1394](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1394)

The unique key of the conditional evaluation operation.

***

### processInstances

```ts
processInstances: ProcessInstanceReference[];
```

Defined in: [gen/types.gen.ts:1402](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1402)

List of process instances created. If no root-level conditional start events evaluated to true, the list will be empty.

***

### tenantId

```ts
tenantId: TenantId;
```

Defined in: [gen/types.gen.ts:1398](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L1398)

The tenant ID of the conditional evaluation operation.
