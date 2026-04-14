---
title: "Type Alias: AuthorizationPropertyBasedRequest"
sidebar_label: "AuthorizationPropertyBasedRequest"
mdx:
  format: md
---

# Type Alias: AuthorizationPropertyBasedRequest

```ts
type AuthorizationPropertyBasedRequest = object;
```

Defined in: [gen/types.gen.ts:566](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L566)

## Properties

### ownerId

```ts
ownerId: string;
```

Defined in: [gen/types.gen.ts:570](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L570)

The ID of the owner of the permissions.

***

### ownerType

```ts
ownerType: OwnerTypeEnum;
```

Defined in: [gen/types.gen.ts:571](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L571)

***

### permissionTypes

```ts
permissionTypes: PermissionTypeEnum[];
```

Defined in: [gen/types.gen.ts:583](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L583)

The permission types to add.

***

### resourcePropertyName

```ts
resourcePropertyName: string;
```

Defined in: [gen/types.gen.ts:575](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L575)

The name of the resource property on which this authorization is based.

***

### resourceType

```ts
resourceType: ResourceTypeEnum;
```

Defined in: [gen/types.gen.ts:579](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L579)

The type of resource to add permissions to.
