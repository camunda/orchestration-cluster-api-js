---
title: "Type Alias: GlobalTaskListenerSearchQueryRequest"
sidebar_label: "GlobalTaskListenerSearchQueryRequest"
mdx:
  format: md
---

# Type Alias: GlobalTaskListenerSearchQueryRequest

```ts
type GlobalTaskListenerSearchQueryRequest = SearchQueryRequest & object;
```

Defined in: [gen/types.gen.ts:2994](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2994)

Global listener search query request.

## Type Declaration

### filter?

```ts
optional filter: GlobalTaskListenerSearchQueryFilterRequest;
```

The global listener search filters.

### sort?

```ts
optional sort: GlobalTaskListenerSearchQuerySortRequest[];
```

Sort field criteria.
