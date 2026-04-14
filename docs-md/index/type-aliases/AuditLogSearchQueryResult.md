---
title: "Type Alias: AuditLogSearchQueryResult"
sidebar_label: "AuditLogSearchQueryResult"
mdx:
  format: md
---

# Type Alias: AuditLogSearchQueryResult

```ts
type AuditLogSearchQueryResult = SearchQueryResponse & object;
```

Defined in: [gen/types.gen.ts:281](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L281)

Audit log search response.

## Type Declaration

### items

```ts
items: AuditLogResult[];
```

The matching audit logs.
