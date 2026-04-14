---
title: "Type Alias: GlobalTaskListenerSearchQueryFilterRequest"
sidebar_label: "GlobalTaskListenerSearchQueryFilterRequest"
mdx:
  format: md
---

# Type Alias: GlobalTaskListenerSearchQueryFilterRequest

```ts
type GlobalTaskListenerSearchQueryFilterRequest = object;
```

Defined in: [gen/types.gen.ts:3016](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3016)

Global listener filter request.

## Properties

### afterNonGlobal?

```ts
optional afterNonGlobal: boolean;
```

Defined in: [gen/types.gen.ts:3036](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3036)

Whether the listener runs after model-level listeners.

***

### eventTypes?

```ts
optional eventTypes: GlobalTaskListenerEventTypeFilterProperty[];
```

Defined in: [gen/types.gen.ts:3032](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3032)

Event types of the global listener.

***

### id?

```ts
optional id: StringFilterProperty;
```

Defined in: [gen/types.gen.ts:3020](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3020)

Id of the global listener.

***

### priority?

```ts
optional priority: IntegerFilterProperty;
```

Defined in: [gen/types.gen.ts:3040](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3040)

Priority of the global listener.

***

### retries?

```ts
optional retries: IntegerFilterProperty;
```

Defined in: [gen/types.gen.ts:3028](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3028)

Number of retries of the global listener.

***

### source?

```ts
optional source: GlobalListenerSourceFilterProperty;
```

Defined in: [gen/types.gen.ts:3044](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3044)

How the global listener was defined.

***

### type?

```ts
optional type: StringFilterProperty;
```

Defined in: [gen/types.gen.ts:3024](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3024)

Job type of the global listener.
