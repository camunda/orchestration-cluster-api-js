---
title: "Type Alias: TagSet"
sidebar_label: "TagSet"
mdx:
  format: md
---

# Type Alias: TagSet

```ts
type TagSet = Tag[] & object;
```

Defined in: [gen/types.gen.ts:3349](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L3349)

List of tags. Tags need to start with a letter; then alphanumerics, `_`, `-`, `:`, or `.`; length ≤ 100.

## Type Declaration

### length

```ts
readonly length: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
```
