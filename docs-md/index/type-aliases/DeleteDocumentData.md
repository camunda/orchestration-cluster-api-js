---
title: "Type Alias: DeleteDocumentData"
sidebar_label: "DeleteDocumentData"
mdx:
  format: md
---

# Type Alias: DeleteDocumentData

```ts
type DeleteDocumentData = object;
```

Defined in: [gen/types.gen.ts:10200](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10200)

## Properties

### body?

```ts
optional body: never;
```

Defined in: [gen/types.gen.ts:10201](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10201)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:10202](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10202)

#### documentId

```ts
documentId: DocumentId;
```

The ID of the document to delete.

***

### query?

```ts
optional query: object;
```

Defined in: [gen/types.gen.ts:10208](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10208)

#### storeId?

```ts
optional storeId: string;
```

The ID of the document store to delete the document from.

***

### url

```ts
url: "/documents/{documentId}";
```

Defined in: [gen/types.gen.ts:10214](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10214)
