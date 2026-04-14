---
title: "Type Alias: CursorBackwardPagination"
sidebar_label: "CursorBackwardPagination"
mdx:
  format: md
---

# Type Alias: CursorBackwardPagination

```ts
type CursorBackwardPagination = object;
```

Defined in: [gen/types.gen.ts:7167](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7167)

Cursor-based backward pagination

## Properties

### before

```ts
before: StartCursor;
```

Defined in: [gen/types.gen.ts:7171](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7171)

Use the `startCursor` value from the previous response to fetch the previous page of results.

***

### limit?

```ts
optional limit: number;
```

Defined in: [gen/types.gen.ts:7175](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7175)

The maximum number of items to return in one request.
