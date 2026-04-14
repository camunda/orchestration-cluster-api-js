---
title: "Type Alias: ThreadedJob"
sidebar_label: "ThreadedJob"
mdx:
  format: md
---

# Type Alias: ThreadedJob

```ts
type ThreadedJob = Omit<EnrichedActivatedJob, "log">;
```

Defined in: [runtime/threadedJobWorker.ts:14](https://github.com/camunda/orchestration-cluster-api-js/blob/686113e38ceaeea2abb1cc7d02a0ac8a78313121/src/runtime/threadedJobWorker.ts#L14)

The job object received by a threaded handler.
Same shape as EnrichedActivatedJob but without the logger (not available across threads).
