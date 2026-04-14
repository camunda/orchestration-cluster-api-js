---
title: "Type Alias: JobResult"
sidebar_label: "JobResult"
mdx:
  format: md
---

# Type Alias: JobResult

```ts
type JobResult = 
  | object & JobResultUserTask
  | object & JobResultAdHocSubProcess;
```

Defined in: [gen/types.gen.ts:4409](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/gen/types.gen.ts#L4409)

The result of the completed job as determined by the worker.
