---
title: "Type Alias: LikeFilter"
sidebar_label: "LikeFilter"
mdx:
  format: md
---

# Type Alias: LikeFilter

```ts
type LikeFilter = string;
```

Defined in: [gen/types.gen.ts:2778](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2778)

Checks if the property matches the provided like value.

Supported wildcard characters are:

* `*`: matches zero, one, or multiple characters.
* `?`: matches one, single character.

Wildcard characters can be escaped with backslash, for instance: `\*`.
