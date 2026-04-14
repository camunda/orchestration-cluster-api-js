---
title: "Interface: JobWorker"
sidebar_label: "JobWorker"
mdx:
  format: md
---

# Interface: JobWorker

Defined in: [runtime/jobWorker.ts:78](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L78)

## Accessors

### activeJobs

#### Get Signature

```ts
get activeJobs(): number;
```

Defined in: [runtime/jobWorker.ts:105](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L105)

##### Returns

`number`

***

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [runtime/jobWorker.ts:102](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L102)

##### Returns

`string`

***

### stopped

#### Get Signature

```ts
get stopped(): boolean;
```

Defined in: [runtime/jobWorker.ts:108](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L108)

##### Returns

`boolean`

## Methods

### start()

```ts
start(): void;
```

Defined in: [runtime/jobWorker.ts:112](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L112)

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [runtime/jobWorker.ts:126](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L126)

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

Defined in: [runtime/jobWorker.ts:145](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/jobWorker.ts#L145)

Gracefully stop the worker: prevent new polls, allow any in-flight activation to finish
without cancellation, and wait for currently active jobs to drain (be acknowledged) up to waitUpToMs.
If timeout is reached, falls back to hard stop logic (cancels activation if still pending).

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
