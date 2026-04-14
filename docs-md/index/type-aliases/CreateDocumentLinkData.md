---
title: "Type Alias: CreateDocumentLinkData"
sidebar_label: "CreateDocumentLinkData"
mdx:
  format: md
---

# Type Alias: CreateDocumentLinkData

```ts
type CreateDocumentLinkData = object;
```

Defined in: [gen/types.gen.ts:10283](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10283)

## Properties

### body?

```ts
optional body: DocumentLinkRequest;
```

Defined in: [gen/types.gen.ts:10284](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10284)

***

### path

```ts
path: object;
```

Defined in: [gen/types.gen.ts:10285](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10285)

#### documentId

```ts
documentId: DocumentId;
```

The ID of the document to link.

***

### query?

```ts
optional query: object;
```

Defined in: [gen/types.gen.ts:10291](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10291)

#### contentHash?

```ts
optional contentHash: string;
```

The hash of the document content that was computed by the document store during upload. The hash is part of the document reference that is returned when uploading a document. If the client fails to provide the correct hash, the request will be rejected.

#### storeId?

```ts
optional storeId: string;
```

The ID of the document store where the document is located.

***

### url

```ts
url: "/documents/{documentId}/links";
```

Defined in: [gen/types.gen.ts:10302](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L10302)
