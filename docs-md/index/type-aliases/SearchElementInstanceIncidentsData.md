---
title: "Type Alias: SearchElementInstanceIncidentsData"
sidebar_label: "SearchElementInstanceIncidentsData"
mdx:
  format: md
---

# Type Alias: SearchElementInstanceIncidentsData

```ts
type SearchElementInstanceIncidentsData = object;
```

Defined in: [gen/types.gen.ts:10459](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10459)

## Properties

### body

```ts
body: IncidentSearchQuery;
```

Defined in: [gen/types.gen.ts:10460](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10460)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:10461](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10461)

#### elementInstanceKey

```ts
elementInstanceKey: ElementInstanceKey;
```

The unique key of the element instance to search incidents for.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:10467](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10467)

***

### url

```ts
url: "/element-instances/{elementInstanceKey}/incidents/search";
```

Defined in: [gen/types.gen.ts:10468](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10468)
