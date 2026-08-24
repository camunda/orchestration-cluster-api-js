# ADR 0001 — In-process WASM test kit for SDK-authored applications

- **Status:** Proposed
- **Date:** 2026-08-24
- **Deciders:** SDK maintainers (JS slice owns this ADR; cross-SDK contract tracked in [#450])
- **Related:** [#450] (cross-SDK injected-clock contract), [#451] (JS injected-clock slice), `jwulf/nano-sdk-js#10`

## Context

Consumers write applications against the Camunda Orchestration Cluster API SDKs
(`@camunda8/orchestration-cluster-api` and its Go/Python/C#/Rust siblings). Today
the only way to test those applications — their process models **and** their job
workers — is against a **live broker** (a real Orchestration Cluster). That is
slow, non-deterministic, requires infrastructure in CI, and cannot be run purely
in-process.

`@nanobpm/engine-wasm` is an **SDK-agnostic** BPMN engine compiled to WebAssembly.
It executes process models in-process, deterministically, on a **virtual clock**,
with no gateway and no socket. Its `/readmodel` variant already returns
**Camunda v2 REST-shaped JSON** for the read channel (`searchProcessInstances`,
`searchUserTasks`, `getFormByKey`, …). A companion package, `@nanobpm/engine-testkit`,
provides a zero-dependency `assertThat*` assertion DSL over the engine read model.

We want: **users write an application in their native language, then write tests
for their processes and workers that run against the WASM engine in-process.** They
pull in a test kit through their language's normal dependency mechanism and use it
as a library in their tests — no broker, no Docker, no ports.

The SDKs already speak the C8 v2 REST wire contract, and each SDK's HTTP client
already has a first-class transport-injection seam:

| SDK | Transport seam |
| --- | --- |
| **JS** | `createCamundaClient({ fetch })` — **already public** (`src/template/CamundaClient.template.ts`, `opts.fetch`) |
| Go | `http.Client.Transport` (custom `RoundTripper`) |
| Python | httpx custom / `MockTransport` on the generated client |
| C# | custom `HttpMessageHandler` |
| Rust | custom `reqwest` client / tower service |

There is also a working proof of this pattern outside the C8 SDKs:
`@nanobpm/urban-testkit` composes `engine-wasm` + `engine-testkit` + Urban-specific
glue to test **Urban** apps in-process. This ADR generalizes that shape to each C8
SDK — "urban" becomes "each C8 SDK".

## Decision

### 1. The seam is the REST wire contract, injected at the HTTP boundary

The application under test runs the **real SDK client and runtime** (retry,
backpressure, pagination, worker poll loop). Only the **network** is virtual: the
SDK's outbound HTTP is redirected — via the SDK's transport seam — into an
**in-process REST-speaking driver** over the WASM engine.

```
  app (unchanged) → createCamundaClient({ fetch: wasmGatewayFetch })
                         │  real SDK runtime: retry / backpressure /
                         │  pagination / worker poll loop — all exercised
                         ▼
     wasmGatewayFetch(Request) ──► REST driver ──► TestEngine.*()
                                     ▲
              @nanobpm/engine-wasm/readmodel (already emits C8-v2 JSON shapes)
```

We reject a per-method adapter (mapping each SDK call → engine method, à la
nano-sdk-js's `EmbeddedTransport` generalized to the full surface): it would
duplicate the whole route→engine mapping in every language **and** bypass each
SDK's own HTTP runtime, so it would not test the behaviour we ship.

### 2. The REST driver is authored ONCE, at the WASM boundary

The route→engine mapping (`handle(request) → response`) is generated from the
**shared OpenAPI spec** — the same single source of truth the SDKs are generated
from and from which `engine-wasm` already derives its read-model DTOs. It is
exposed as a **single ABI**:

```
handle(method, path, headers, body) -> { status, headers, body }
```

Because the mapping lives once, at the wasm boundary, each SDK needs only a thin
native transport shim that marshals its Request into this ABI and back — **no
per-language route mapping**.

### 3. Package topology: a second, thin package in the JS SDK repo, over shared cores

Layer the pieces by ownership. Do **not** vendor the wasm/driver/DSL into the SDK
repo.

```
  engine repo (nano-bpm) publishes (SDK-agnostic, per language registry):
    ├─ @nanobpm/engine-wasm     wasm binary + REST-driver ABI + runtime binding
    └─ @nanobpm/engine-testkit  agnostic assertThat* DSL over the read-model port
                          │  (depended on by ▼)
  THIS repo (orchestration-cluster-api-js) publishes a SECOND package:
    └─ @camunda8/orchestration-cluster-api-testkit   (dev-dependency)
         transport shim (fetch) + in-process client factory +
         clock binding + OAuth bypass + SDK-typed assertions
                          │  (depends on ▲ the SDK itself, for the seam + types)
```

The user adds **one dev-dependency** — the testkit — which transitively pulls the
two agnostic cores.

### 4. What lives where — seam vs. shim

- The transport **seam** (the *hole*: `opts.fetch`) stays in the **SDK core** as a
  documented, guaranteed feature (JS already has it).
- The transport **shim** (the *fill*: routes into the wasm driver) lives in the
  **testkit**.
- `ctx.clock` injection ([#451]) lands in the **SDK core**; *binding* that clock to
  the engine's virtual clock lands in the **testkit**.

The SDK exposes the holes; the testkit fills them with the engine.

### 5. Determinism depends on the injected clock ([#450]/[#451])

In-process testing is only deterministic once the SDK's **client-runtime cadence**
(job-worker poll loop, eventual poller, retry/backoff, auth refresh) resolves
through an **injected clock bound to the engine's virtual clock**, per [#450]/[#451].
Otherwise the worker busy-polls the engine on the wall clock (the 60s / ~12k-spawn
incident cited in [#450]).

- The harness owns one virtual clock.
- It drives the wasm engine's virtual clock from it (and/or pins engine time via
  the driver's `PUT /clock`, which flows through the same ABI).
- It injects the *same* clock as the SDK runtime `Clock`, so cadence advances in
  lockstep. (This mirrors `urban-testkit`'s `test-host.ts`, where `now` reads one
  harness clock.)

`activateJobs` long-poll degrades gracefully: the synchronous driver answers
immediately with available jobs; when none are ready, the SDK's poll loop — now on
the virtual clock — simply re-polls at zero real cost. No streaming machinery is
needed.

### 6. Distribution guarantee: dev-dependency only, wasm never in production

`@camunda8/orchestration-cluster-api-testkit` is a **dev-dependency**. The WASM
engine must never land in a consumer's production install/bundle — matching the
guarantee `@nanobpm/urban-testkit` already advertises.

## Consequences

### Positive

- **Coverage by construction.** One `Request → Response` function covers the entire
  generated API surface; no per-method mirroring.
- **No drift.** SDKs, the REST driver, and `engine-wasm`'s read DTOs are all derived
  from one OpenAPI spec. A single cross-language conformance suite (request/response
  fixtures) can verify every SDK sees identical engine behaviour (mirrors
  `urban-testkit`'s `contract.ts` / `engine-client-conformance.test.ts`).
- **Full fidelity.** Apps run the real SDK runtime; only the network is virtual —
  retry/backpressure/pagination/worker semantics are still exercised.
- **One dev-dependency** for the user; the wasm + driver + DSL are shared cores.
- **Ownership follows expertise.** The WASM env + REST driver stay in the engine
  org beside the spec; the SDK repo owns only the thin, SDK-coupled glue.

### Negative / costs

- **JS SDK core changes required** (small, legitimate): guarantee `opts.fetch` as a
  public transport seam; provide an **OAuth bypass** in embedded mode so the auth
  interceptor doesn't try to fetch a token through the gateway; land the
  injected-clock work ([#451]).
- **New second package** in this repo, with its own build/release wiring.
- **Engine-side gaps to close upstream** (not worked around in the shim, per
  AGENTS.md "fix at source"): filtered `searchProcessInstances`/`searchVariables`,
  incidents, and any user-task ops not yet in the read model; and the
  `handle(req)→res` ABI itself (today `engine-wasm` exposes engine methods + the
  read channel, not a full request/response router).
- **Cross-SDK scope.** The agnostic cores currently exist **only for JS** (npm). The
  other four languages need the engine org to produce a wasm-env + REST-driver + DSL
  core (built once per language). This ADR covers the **JS slice**; the cross-SDK
  contract is [#450].

## Alternatives considered

1. **Per-method in-process adapter** (generalize nano-sdk-js `EmbeddedTransport` to
   the whole surface). Rejected: duplicates the route→engine mapping per language
   and bypasses the SDK's own HTTP runtime, so it doesn't test shipped behaviour.
2. **Loopback subprocess / tiny local HTTP server** over the same driver. Not
   chosen as the default (we want pure in-process, socket-free, deterministic), but
   the `handle(req)→res` ABI keeps this open with **zero** change to the SDK shim —
   useful for any language where embedding a wasm runtime proves heavy.
3. **Monolithic testkit that vendors wasm + driver + DSL per SDK repo.** Rejected:
   forks shared cores, forces 5-way lockstep releases, and puts engine-domain work
   (spec-generated driver) in the wrong repos.
4. **Central monorepo publishes all five testkits.** Rejected: the SDK-coupled glue
   (transport shim, clock binding, typed assertions) is tightly bound to each SDK's
   internals and release cadence; housing it away from the SDK causes cross-repo
   version-coordination pain and worse discoverability.

## Implementation sketch (JS slice)

1. **SDK core:** document/guarantee `opts.fetch`; add embedded-mode OAuth bypass;
   land [#451] injected clock.
2. **Engine (upstream):** expose the `handle(req)→res` REST-driver ABI from
   `engine-wasm`, generated from the spec; close read-surface gaps.
3. **New package `@camunda8/orchestration-cluster-api-testkit`:**
   - `createInProcessCamundaClient()` → boots `engine-wasm/readmodel`, builds the
     `fetch` shim over `handle()`, injects the shared virtual clock, returns a real
     SDK client wired to the in-process engine.
   - Re-export / bind `@nanobpm/engine-testkit` `assertThat*` to SDK types.
   - Helpers: `deploy(...)`, `advanceClock(...)`, run-to-quiescence.
   - Dev-dependency; wasm excluded from production installs.
4. **Conformance:** wire a REST request/response fixture suite runnable against the
   driver (shared across SDKs).

[#450]: https://github.com/camunda/orchestration-cluster-api-js/issues/450
[#451]: https://github.com/camunda/orchestration-cluster-api-js/issues/451
