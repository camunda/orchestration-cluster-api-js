# Eventual Polling Overload Design (Option A)

Status: Implemented
Date: 2025-09-04
Owner: SDK Codegen Runtime

## Problem

`eventualPoll` previously exposed a `CancelablePromise<T | Result<T>>` return. The canonical (throwing) client always throws on HTTP / validation errors; the functional (result) client wraps outcomes in `Result<T>`. A union leaked both shapes to all callers, degrading DX: consumers in the throwing path had to refine `T | Result<T>`.

## Goals

- Preserve zero-cost error handling for canonical (throw) client (`await` yields `T` or throws).
- Keep opt-in functional style (`Result<T>`) without a separate code path explosion.
- Avoid downstream conditional typing or narrowing for the common case.
- Maintain backwards source compatibility for existing functional result callers (they already pass `errorMode: 'result'`).

## Option Chosen: Overload Specialization (Option A)

Implemented TypeScript overloads:

```ts
// Throwing (default) path
eventualPoll<T>(..., options & { errorMode?: 'throw' | undefined }): CancelablePromise<T>;
// Functional (result) path
eventualPoll<T>(..., options & { errorMode: 'result' }): CancelablePromise<Result<T>>;
```

Single implementation returns `CancelablePromise<any>` internally; overload signatures erase the union from normal call sites.

## Rationale

- Minimal change footprint; no generator regeneration required beyond type surface.
- Keeps runtime branching (wrap value vs. wrap error) localized.
- Avoids generic conditional types which would reintroduce unions at the call site.
- Aligns with existing `_errorMode` invariant in `CamundaClient` (immutable and default `'throw'`).

## Non-Goals

- Introducing a distinct `eventualResultPoll` API (rejected: additional surface area).
- Migrating to a wrapper object `{ value, attempts, ... }` return (future Option B/D candidate).

## Edge Cases & Behavior

- `waitUpToMs = 0`: immediate invoke; result path still wraps `Result<T>`; throw path returns base promise directly (still cancelable if underlying invoke is).
- Abort / cancel: both paths propagate as rejection (`throw`) or `{ ok:false, error }` (`result`).
- Timeout: throws `EventualConsistencyTimeoutError` (throw path) vs. returns `{ ok:false, error: TimeoutError }` (result path).

## Migration & Compatibility

Existing callers that previously received `T | Result<T>` in throw mode will now see just `T`. This is a narrowing (safe) improvement. Functional callers must ensure they explicitly pass `errorMode: 'result'` (unchanged requirement).

## Future Enhancements (Not Implemented)

- Option B: Distinct higher-order helper returning metadata (attempts, elapsed) alongside value.
- Option C: Configurable default poll interval backoff strategies via injected strategy fn.
- Option D: Extract separate `eventual` namespace for functional style to decouple types fully.

## Tests

Add a targeted type-level assertion ensuring that a standard facade eventual op (e.g., `searchJobs`) returns `CancelablePromise<JobsSearchResponse>` with no union in throw mode. Functional path test (optional) can assert `CancelablePromise<Result<...>>` when forcing `errorMode:'result'` via internal call (not publicly exposed directly through facade yet).

## Summary

Overloads remove union leakage, preserve existing semantics, and set a clear path for future refactors without breaking canonical ergonomics.
