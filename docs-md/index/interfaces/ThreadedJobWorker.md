---
title: "Interface: ThreadedJobWorker"
sidebar_label: "ThreadedJobWorker"
mdx:
  format: md
---

# Interface: ThreadedJobWorker

Defined in: [runtime/threadedJobWorker.ts:106](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L106)

A job worker that runs handler logic in a shared pool of worker_threads,
keeping the main Node.js event loop free for polling and I/O.

The thread pool is owned by CamundaClient and shared across all threaded workers.
Each thread is generic — the handler module path is sent with each job,
and threads cache loaded handlers by module path.

## Accessors

### activeJobs

#### Get Signature

```ts
get activeJobs(): number;
```

Defined in: [runtime/threadedJobWorker.ts:134](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L134)

##### Returns

`number`

***

### busyThreads

#### Get Signature

```ts
get busyThreads(): number;
```

Defined in: [runtime/threadedJobWorker.ts:145](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L145)

Number of threads currently processing a job (across all workers).

##### Returns

`number`

***

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [runtime/threadedJobWorker.ts:131](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L131)

##### Returns

`string`

***

### poolSize

#### Get Signature

```ts
get poolSize(): number;
```

Defined in: [runtime/threadedJobWorker.ts:141](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L141)

Number of threads in the shared pool.

##### Returns

`number`

***

### ready

#### Get Signature

```ts
get ready(): Promise<void>;
```

Defined in: [runtime/threadedJobWorker.ts:149](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L149)

Resolves when the shared thread pool has finished initialising.

##### Returns

`Promise`\<`void`\>

***

### stopped

#### Get Signature

```ts
get stopped(): boolean;
```

Defined in: [runtime/threadedJobWorker.ts:137](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L137)

##### Returns

`boolean`

## Methods

### start()

```ts
start(): void;
```

Defined in: [runtime/threadedJobWorker.ts:153](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L153)

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [runtime/threadedJobWorker.ts:167](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L167)

#### Returns

`void`

***

### stopGracefully()

```ts
stopGracefully(opts?): Promise<{
  remainingJobs: number;
  timedOut: boolean;
}>;
```

Defined in: [runtime/threadedJobWorker.ts:181](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L181)

#### Parameters

##### opts?

###### checkIntervalMs?

`number`

###### waitUpToMs?

`number`

#### Returns

`Promise`\<\{
  `remainingJobs`: `number`;
  `timedOut`: `boolean`;
\}\>
