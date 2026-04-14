---
title: "Type Alias: SearchClusterVariablesData"
sidebar_label: "SearchClusterVariablesData"
mdx:
  format: md
---

# Type Alias: SearchClusterVariablesData

```ts
type SearchClusterVariablesData = object;
```

Defined in: [gen/types.gen.ts:9282](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9282)

## Properties

### body?

```ts
optional body: ClusterVariableSearchQueryRequest;
```

Defined in: [gen/types.gen.ts:9283](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9283)

***

### path?

```ts
optional path: never;
```

Defined in: [gen/types.gen.ts:9284](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9284)

***

### query?

```ts
optional query: object;
```

Defined in: [gen/types.gen.ts:9285](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9285)

#### truncateValues?

```ts
optional truncateValues: boolean;
```

When true (default), long variable values in the response are truncated. When false, full variable values are returned.

***

### url

```ts
url: "/cluster-variables/search";
```

Defined in: [gen/types.gen.ts:9291](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L9291)
