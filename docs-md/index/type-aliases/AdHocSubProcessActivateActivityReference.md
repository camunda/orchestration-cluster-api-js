---
title: "Type Alias: AdHocSubProcessActivateActivityReference"
sidebar_label: "AdHocSubProcessActivateActivityReference"
mdx:
  format: md
---

# Type Alias: AdHocSubProcessActivateActivityReference

```ts
type AdHocSubProcessActivateActivityReference = object;
```

Defined in: [gen/types.gen.ts:2715](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2715)

## Properties

### elementId

```ts
elementId: ElementId;
```

Defined in: [gen/types.gen.ts:2719](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2719)

The ID of the element that should be activated.

***

### variables?

```ts
optional variables: object;
```

Defined in: [gen/types.gen.ts:2723](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2723)

Variables to be set when activating the element.

#### Index Signature

```ts
[key: string]: unknown
```
