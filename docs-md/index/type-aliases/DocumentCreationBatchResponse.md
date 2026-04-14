---
title: "Type Alias: DocumentCreationBatchResponse"
sidebar_label: "DocumentCreationBatchResponse"
mdx:
  format: md
---

# Type Alias: DocumentCreationBatchResponse

```ts
type DocumentCreationBatchResponse = object;
```

Defined in: [gen/types.gen.ts:2411](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2411)

## Properties

### createdDocuments

```ts
createdDocuments: DocumentReference[];
```

Defined in: [gen/types.gen.ts:2419](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2419)

Documents that failed creation.

***

### failedDocuments

```ts
failedDocuments: DocumentCreationFailureDetail[];
```

Defined in: [gen/types.gen.ts:2415](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L2415)

Documents that were successfully created.
