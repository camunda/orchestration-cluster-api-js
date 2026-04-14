---
title: "Type Alias: AdvancedMessageSubscriptionStateFilter"
sidebar_label: "AdvancedMessageSubscriptionStateFilter"
mdx:
  format: md
---

# Type Alias: AdvancedMessageSubscriptionStateFilter

```ts
type AdvancedMessageSubscriptionStateFilter = object;
```

Defined in: [gen/types.gen.ts:5642](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5642)

Advanced filter

Advanced MessageSubscriptionStateEnum filter

## Properties

### $eq?

```ts
optional $eq: MessageSubscriptionStateEnum;
```

Defined in: [gen/types.gen.ts:5646](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5646)

Checks for equality with the provided value.

***

### $exists?

```ts
optional $exists: boolean;
```

Defined in: [gen/types.gen.ts:5654](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5654)

Checks if the current property exists.

***

### $in?

```ts
optional $in: MessageSubscriptionStateEnum[];
```

Defined in: [gen/types.gen.ts:5658](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5658)

Checks if the property matches any of the provided values.

***

### $like?

```ts
optional $like: LikeFilter;
```

Defined in: [gen/types.gen.ts:5659](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5659)

***

### $neq?

```ts
optional $neq: MessageSubscriptionStateEnum;
```

Defined in: [gen/types.gen.ts:5650](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L5650)

Checks for inequality with the provided value.
