# Backpressure Tuning Guide

The SDK's adaptive backpressure system throttles outgoing requests when the Camunda cluster signals resource exhaustion. This document explains how the system works, what the knobs do, and how to choose settings for your workload.

## TL;DR — I Just Want It to Work

Use a **profile** and don't touch the individual knobs:

| Your situation                                            | Profile              | Command                                         |
| --------------------------------------------------------- | -------------------- | ----------------------------------------------- |
| General workloads, don't know what to pick                | `BALANCED` (default) | _(nothing to set)_                              |
| Shared cluster, cost-sensitive, or hitting limits often   | `CONSERVATIVE`       | `CAMUNDA_SDK_BACKPRESSURE_PROFILE=CONSERVATIVE` |
| Dedicated cluster, high throughput, you want to push hard | `AGGRESSIVE`         | `CAMUNDA_SDK_BACKPRESSURE_PROFILE=AGGRESSIVE`   |
| You want per-call retry only (pre-backpressure behavior)  | `LEGACY`             | `CAMUNDA_SDK_BACKPRESSURE_PROFILE=LEGACY`       |

**That's it.** The profiles are coordinated sets of defaults designed to work well together. Most users should never need to go deeper.

## Mental Model

Think of the system as a **bouncer at a door**. Normally the door is wide open (unlimited concurrency). When the cluster pushes back (429 / RESOURCE_EXHAUSTED), the bouncer starts limiting how many requests can enter simultaneously.

```
Your code                  Backpressure gate              Cluster
   │                            │                            │
   ├─ createProcessInstance ──► │ ◄── permit available? ───► │
   ├─ createProcessInstance ──► │     yes → pass through     │
   ├─ createProcessInstance ──► │     no  → wait in queue    │
   │                            │                            │
   │  ◄── 429 RESOURCE_EXHAUSTED ──────────────────────────  │
   │                            │                            │
   │     (bouncer tightens)     │     reduce permits         │
   │                            │                            │
   │  ◄── 200 OK ─────────────────────────────────────────   │
   │                            │                            │
   │     (bouncer relaxes)      │     gradual recovery       │
```

### What's exempt?

Operations that **drain work** are never gated:

- `completeJob`, `failJob`, `throwJobError`, `completeUserTask`

Operations that are **eventually consistent** (search, polling GETs) take a separate code path that bypasses the gate entirely.

Only **initiating** operations (create, update, delete, deploy, publish, etc.) go through the gate.

## The Lifecycle

```
         ┌─────────────────────────────────────────────────────────┐
         │                    UNLIMITED                            │
         │  (no cap, no gate — default starting state)             │
         └─────────────────┬───────────────────────────────────────┘
                           │ first backpressure signal
                           ▼
         ┌─────────────────────────────────────────────────────────┐
         │                 SOFT (permits capped)                   │
         │  permits = initialMax × softFactor (e.g. 16 × 0.7 = 11)│
         └──────┬──────────────────────────────────┬───────────────┘
                │ N consecutive signals             │ quiet period
                │ (N = severeThreshold)             │ (decayQuietMs)
                ▼                                   │
         ┌──────────────────────────────┐           │
         │         SEVERE               │           │
         │  permits × severeFactor      │ ──────────┤ quiet → soft
         │  (aggressive reduction)      │           │
         └──────────────────────────────┘           │
                                                    ▼
         ┌─────────────────────────────────────────────────────────┐
         │                 HEALTHY                                 │
         │  Phase 1: additive recovery (+step) up to bootstrap cap │
         │  Phase 2: multiplicative growth (×multiplier) beyond    │
         │  Phase 3: sustained healthy → back to UNLIMITED         │
         └─────────────────────────────────────────────────────────┘
```

## What Each Knob Does

### The "How Fast Do We Slam The Brakes" Knobs

| Knob               | What it controls                                | Analogy                                    |
| ------------------ | ----------------------------------------------- | ------------------------------------------ |
| `INITIAL_MAX`      | Starting cap when first signal arrives          | Speed limit sign posted at the on-ramp     |
| `SOFT_FACTOR`      | % reduction on each soft signal (70 = keep 70%) | Easing off the gas                         |
| `SEVERE_FACTOR`    | % reduction on severe state (50 = keep 50%)     | Hard braking                               |
| `FLOOR`            | Absolute minimum permits (never go below this)  | Minimum speed — we never fully stop        |
| `SEVERE_THRESHOLD` | Consecutive signals before escalating to severe | How many warnings before emergency braking |

### The "How Fast Do We Speed Back Up" Knobs

| Knob                          | What it controls                                         | Analogy                                |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------- |
| `RECOVERY_INTERVAL_MS`        | Time between recovery checks                             | How often we check if we can go faster |
| `RECOVERY_STEP`               | Permits added per interval during additive recovery      | Accelerating in 1st gear               |
| `HEALTHY_RECOVERY_MULTIPLIER` | Growth factor during healthy multiplication (150 = 1.5×) | Accelerating in 3rd gear               |
| `DECAY_QUIET_MS`              | Quiet period to downgrade severity (severe→soft→healthy) | Time without warnings before relaxing  |
| `UNLIMITED_AFTER_HEALTHY_MS`  | Sustained healthy before removing cap entirely           | Highway merge — full speed ahead       |

### The "Safety Net" Knobs

| Knob          | What it controls                                   | Analogy                                               |
| ------------- | -------------------------------------------------- | ----------------------------------------------------- |
| `MAX_WAITERS` | Maximum queued requests before fail-fast rejection | Maximum queue length — reject if the line is too long |
| `PROFILE`     | Coordinated preset for all of the above            | "Sport mode" vs "Eco mode"                            |

## Profile Details

| Setting               | BALANCED | CONSERVATIVE | AGGRESSIVE | LEGACY            |
| --------------------- | -------- | ------------ | ---------- | ----------------- |
| **initialMax**        | 16       | 12           | 24         | _(observe only)_  |
| **softFactor**        | 70%      | 60%          | 80%        | 70%               |
| **severeFactor**      | 50%      | 40%          | 60%        | 50%               |
| **recoveryInterval**  | 1000ms   | 1200ms       | 800ms      | 1000ms            |
| **recoveryStep**      | 1        | 1            | 2          | 1                 |
| **decayQuiet**        | 2000ms   | 2500ms       | 1500ms     | 2000ms            |
| **floor**             | 1        | 1            | 2          | 1                 |
| **severeThreshold**   | 3        | 2            | 4          | 3                 |
| **maxWaiters**        | 1000     | 500          | 2000       | 1000              |
| **healthyMultiplier** | 150%     | 130%         | 200%       | 150%              |
| **unlimitedAfter**    | 30s      | 60s          | 15s        | 30s               |
| **Gating active?**    | Yes      | Yes          | Yes        | No (observe-only) |

### When to use each profile

**BALANCED** — You don't know your workload characteristics yet. This is a safe starting point that protects the cluster without being overly restrictive. Start here and only change if you have evidence you need something different.

**CONSERVATIVE** — Your cluster is shared with other teams, or you're hitting backpressure frequently and want to back off harder and recover more slowly. Good for cost-sensitive environments where you'd rather sacrifice throughput than risk impacting neighbors.

**AGGRESSIVE** — You have a dedicated cluster with known capacity headroom. You want to push harder during normal operation and recover quickly after brief pressure spikes. Good for batch processing or high-throughput ETL where you're willing to trade cluster courtesy for speed.

**LEGACY** — You want to opt out of admission control entirely. The SDK still records backpressure severity internally (visible via `getBackpressureState()`), but never queues or rejects requests. Per-call HTTP retry still operates. Use this if you have your own external rate limiter or want to characterize raw cluster behavior without SDK intervention.

## Tuning Recipes

### "I get occasional 429s but throughput is fine"

The defaults are working. The system is doing its job — brief soft state, quick recovery. No changes needed.

### "I'm seeing `BACKPRESSURE_QUEUE_FULL` errors"

The waiter queue is overflowing. Your application is generating requests faster than the cluster can absorb them. Options:

1. **Reduce your request rate** at the source (fewer concurrent operations).
2. **Increase `MAX_WAITERS`** to absorb longer bursts (trades memory for burst tolerance).
3. **Switch to `AGGRESSIVE`** profile to recover faster after pressure spikes.
4. **Check your cluster sizing** — persistent queue-full errors suggest the cluster is genuinely undersized for the load.

### "Recovery is too slow — I'm stuck at low permits for ages"

```bash
# Speed up recovery
CAMUNDA_SDK_BACKPRESSURE_RECOVERY_INTERVAL_MS=500
CAMUNDA_SDK_BACKPRESSURE_RECOVERY_STEP=2
CAMUNDA_SDK_BACKPRESSURE_HEALTHY_RECOVERY_MULTIPLIER=200
CAMUNDA_SDK_BACKPRESSURE_UNLIMITED_AFTER_HEALTHY_MS=15000
```

Or just use `AGGRESSIVE` profile which sets all of these.

### "I want to be more aggressive but keep the safety nets tight"

```bash
CAMUNDA_SDK_BACKPRESSURE_PROFILE=AGGRESSIVE
CAMUNDA_SDK_BACKPRESSURE_MAX_WAITERS=500
CAMUNDA_SDK_BACKPRESSURE_FLOOR=1
```

### "I'm in a multi-tenant cluster and want to be a good neighbor"

```bash
CAMUNDA_SDK_BACKPRESSURE_PROFILE=CONSERVATIVE
```

This backs off harder on pressure signals (60% soft, 40% severe), escalates to severe quicker (2 consecutive signals), and recovers more slowly (1200ms intervals, 130% multiplier, 60s before returning to unlimited).

### "I want to see what's happening without changing behavior"

```bash
CAMUNDA_SDK_BACKPRESSURE_PROFILE=LEGACY
CAMUNDA_SDK_LOG_LEVEL=debug
```

Then inspect logs for `bp.state.change` events. Also call `client.getBackpressureState()` programmatically to read severity, permits, and waiter count.

## Observability

### Log events

Set `CAMUNDA_SDK_LOG_LEVEL=debug` (or `trace` for maximum detail):

| Event                        | Level   | When                                     |
| ---------------------------- | ------- | ---------------------------------------- |
| `bp.state.change` (severity) | `info`  | Crossing healthy↔unhealthy boundary     |
| `bp.state.change` (severity) | `debug` | All other severity transitions           |
| `bp.state.change` (permits)  | `debug` | Any permit scale/recover/unlimited event |
| `backpressure.*`             | `trace` | All internal events (verbose)            |

### Programmatic introspection

```ts
const state = client.getBackpressureState();
// {
//   severity: 'healthy' | 'soft' | 'severe',
//   consecutive: number,
//   permitsMax: number | null,    // null = unlimited
//   permitsCurrent: number,
//   waiters: number,
// }
```

## Distributed Clients

Each SDK client instance has its **own independent** backpressure state. There is no coordination between clients. This is intentional — it means:

- Each client adapts to the signals _it_ observes.
- A client that sends more traffic will hit backpressure sooner and throttle itself more.
- A client with lighter load may never trigger the gate at all.
- The cluster's own 429/503 responses are the shared coordination signal.

In a multi-client deployment, the cluster is the single source of truth for capacity. Each client's adaptive throttle converges independently based on the pressure it experiences. This is similar to how TCP congestion control works — each connection adapts independently using packet loss as the shared signal, and the system reaches a stable equilibrium.

**Key insight**: You do NOT need clients to coordinate with each other. The cluster's backpressure responses naturally distribute the pain — clients that push harder get pushed back harder.

## FAQ

**Q: Can backpressure throttle my job completions?**
No. `completeJob`, `failJob`, `throwJobError`, and `completeUserTask` are exempt. They always execute immediately.

**Q: Can backpressure throttle my search queries?**
No. All eventually-consistent operations (search, polling GETs) take a separate code path that bypasses the backpressure gate entirely.

**Q: What happens if backpressure is active and I create a process instance?**
The call waits in the queue until a permit is available, then proceeds. If the queue is full (`maxWaiters` exceeded), the call is rejected immediately with error code `BACKPRESSURE_QUEUE_FULL`.

**Q: Will the system ever get permanently stuck at low permits?**
No. The three-phase recovery ensures permits grow beyond the initial bootstrap cap (multiplicative growth) and eventually return to unlimited after sustained healthy operation. Any new backpressure signal resets the recovery timer.

**Q: Should I tune individual knobs or use a profile?**
Use a profile. Only tune individual knobs if you've run the multi-client performance scenario (below) and have specific evidence that a setting needs adjustment.
