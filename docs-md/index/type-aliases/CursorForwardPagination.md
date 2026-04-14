---
title: "Type Alias: CursorForwardPagination"
sidebar_label: "CursorForwardPagination"
mdx:
  format: md
---

# Type Alias: CursorForwardPagination

```ts
type CursorForwardPagination = object;
```

Defined in: [gen/types.gen.ts:7153](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7153)

Cursor-based forward pagination

## Properties

### after

```ts
after: EndCursor;
```

Defined in: [gen/types.gen.ts:7157](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7157)

Use the `endCursor` value from the previous response to fetch the next page of results.

***

### limit?

```ts
optional limit: number;
```

Defined in: [gen/types.gen.ts:7161](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L7161)

The maximum number of items to return in one request.
