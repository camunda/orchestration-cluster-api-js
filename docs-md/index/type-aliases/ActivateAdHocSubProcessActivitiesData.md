---
title: "Type Alias: ActivateAdHocSubProcessActivitiesData"
sidebar_label: "ActivateAdHocSubProcessActivitiesData"
mdx:
  format: md
---

# Type Alias: ActivateAdHocSubProcessActivitiesData

```ts
type ActivateAdHocSubProcessActivitiesData = object;
```

Defined in: [gen/types.gen.ts:10323](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10323)

## Properties

### body

```ts
body: AdHocSubProcessActivateActivitiesInstruction;
```

Defined in: [gen/types.gen.ts:10324](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10324)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:10325](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10325)

#### adHocSubProcessInstanceKey

```ts
adHocSubProcessInstanceKey: ElementInstanceKey;
```

The key of the ad-hoc sub-process instance that contains the activities.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:10331](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10331)

***

### url

```ts
url: "/element-instances/ad-hoc-activities/{adHocSubProcessInstanceKey}/activation";
```

Defined in: [gen/types.gen.ts:10332](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10332)
