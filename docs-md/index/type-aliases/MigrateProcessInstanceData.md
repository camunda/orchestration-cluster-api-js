---
title: "Type Alias: MigrateProcessInstanceData"
sidebar_label: "MigrateProcessInstanceData"
mdx:
  format: md
---

# Type Alias: MigrateProcessInstanceData

```ts
type MigrateProcessInstanceData = object;
```

Defined in: [gen/types.gen.ts:13514](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13514)

## Properties

### body

```ts
body: ProcessInstanceMigrationInstruction;
```

Defined in: [gen/types.gen.ts:13515](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13515)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:13516](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13516)

#### processInstanceKey

```ts
processInstanceKey: ProcessInstanceKey;
```

The key of the process instance that should be migrated.

***

### query?

```ts
optional query: never;
```

Defined in: [gen/types.gen.ts:13522](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13522)

***

### url

```ts
url: "/process-instances/{processInstanceKey}/migration";
```

Defined in: [gen/types.gen.ts:13523](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L13523)
