---
title: "Type Alias: AuditLogEntityTypeEnum"
sidebar_label: "AuditLogEntityTypeEnum"
mdx:
  format: md
---

# Type Alias: AuditLogEntityTypeEnum

```ts
type AuditLogEntityTypeEnum = 
  | "AUTHORIZATION"
  | "BATCH"
  | "DECISION"
  | "GROUP"
  | "INCIDENT"
  | "JOB"
  | "MAPPING_RULE"
  | "PROCESS_INSTANCE"
  | "RESOURCE"
  | "ROLE"
  | "TENANT"
  | "USER"
  | "USER_TASK"
  | "VARIABLE"
  | "CLIENT";
```

Defined in: [gen/types.gen.ts:296](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L296)

The type of entity affected by the operation.
