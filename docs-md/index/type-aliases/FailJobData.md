---
title: "Type Alias: FailJobData"
sidebar_label: "FailJobData"
mdx:
  format: md
---

# Type Alias: FailJobData

```ts
type FailJobData = object;
```

Defined in: [gen/types.gen.ts:12009](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L12009)

## Properties

### body?

```ts
optional body: JobFailRequest;
```

Defined in: [gen/types.gen.ts:12010](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L12010)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:12011](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L12011)

#### jobKey

```ts
jobKey: JobKey;
```

The key of the job to fail.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:12017](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L12017)

***

### url

```ts
url: "/jobs/{jobKey}/failure";
```

Defined in: [gen/types.gen.ts:12018](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L12018)
