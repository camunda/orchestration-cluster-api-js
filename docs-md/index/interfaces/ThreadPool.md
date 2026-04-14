---
title: "Interface: ThreadPool"
sidebar_label: "ThreadPool"
mdx:
  format: md
---

# Interface: ThreadPool

Defined in: [runtime/threadPool.ts:33](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L33)

## Accessors

### busyCount

#### Get Signature

```ts
get busyCount(): number;
```

Defined in: [runtime/threadPool.ts:63](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L63)

Number of threads currently processing a job.

##### Returns

`number`

***

### idleCount

#### Get Signature

```ts
get idleCount(): number;
```

Defined in: [runtime/threadPool.ts:68](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L68)

Number of threads that are ready and idle.

##### Returns

`number`

***

### onThreadReady

#### Set Signature

```ts
set onThreadReady(cb): void;
```

Defined in: [runtime/threadPool.ts:73](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L73)

Register a callback invoked whenever a thread becomes ready or idle.

##### Parameters

###### cb

() => `void` | `undefined`

##### Returns

`void`

***

### ready

#### Get Signature

```ts
get ready(): Promise<void>;
```

Defined in: [runtime/threadPool.ts:53](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L53)

Resolves when all threads have been spawned and signalled ready.

##### Returns

`Promise`\<`void`\>

***

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [runtime/threadPool.ts:58](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L58)

Total number of threads in the pool.

##### Returns

`number`

## Methods

### dispatch()

```ts
dispatch(
   pw, 
   jobData, 
   handlerModule, 
callbacks): Promise<void>;
```

Defined in: [runtime/threadPool.ts:86](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L86)

Dispatch a serialized job to a specific idle worker.
The caller is responsible for checking idleness first.

#### Parameters

##### pw

`PoolWorker`

##### jobData

`Record`\<`string`, `unknown`\>

##### handlerModule

`string`

##### callbacks

###### onComplete

(`completionAction?`) => `void`

###### onError

(`err`) => `void`

#### Returns

`Promise`\<`void`\>

***

### getIdleWorker()

```ts
getIdleWorker(): PoolWorker | undefined;
```

Defined in: [runtime/threadPool.ts:78](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L78)

Find the first ready & idle thread.

#### Returns

`PoolWorker` \| `undefined`

***

### terminate()

```ts
terminate(): void;
```

Defined in: [runtime/threadPool.ts:128](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadPool.ts#L128)

Terminate all threads and reject any in-flight tasks.

#### Returns

`void`
