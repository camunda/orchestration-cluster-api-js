---
title: "Type Alias: AdvancedVariableKeyFilter"
sidebar_label: "AdvancedVariableKeyFilter"
mdx:
  format: md
---

# Type Alias: AdvancedVariableKeyFilter

```ts
type AdvancedVariableKeyFilter = object;
```

Defined in: [gen/types.gen.ts:4952](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4952)

Advanced filter

Advanced VariableKey filter.

## Properties

### $eq?

```ts
optional $eq: VariableKey;
```

Defined in: [gen/types.gen.ts:4956](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4956)

Checks for equality with the provided value.

***

### $exists?

```ts
optional $exists: boolean;
```

Defined in: [gen/types.gen.ts:4964](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4964)

Checks if the current property exists.

***

### $in?

```ts
optional $in: VariableKey[];
```

Defined in: [gen/types.gen.ts:4968](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4968)

Checks if the property matches any of the provided values.

***

### $neq?

```ts
optional $neq: VariableKey;
```

Defined in: [gen/types.gen.ts:4960](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4960)

Checks for inequality with the provided value.

***

### $notIn?

```ts
optional $notIn: VariableKey[];
```

Defined in: [gen/types.gen.ts:4972](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4972)

Checks if the property matches none of the provided values.
