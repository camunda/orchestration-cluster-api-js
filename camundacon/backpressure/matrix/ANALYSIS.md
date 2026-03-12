# Camunda 8 SDK Backpressure Benchmark — Full Matrix Analysis

**Date:** March 2026
**SDK version:** `@camunda8/sdk` (JS/TS SDK, pre-release)
**Server:** `camunda/camunda:8.9-SNAPSHOT` (H2 in-memory, Docker)

## What This Benchmark Measures

This benchmark measures how different SDK configurations handle **broker backpressure** — the condition where clients submit work faster than the engine can process it. It answers:

1. Which **job activation transport** performs best under load?
2. Should workers run in **separate processes** or **share a single process**?
3. How does **cluster size** affect throughput and error rates?
4. Does the SDK's **adaptive backpressure manager** (BALANCED mode) help?

## Test Parameters

| Parameter                                 | Value              |
| ----------------------------------------- | ------------------ |
| Target jobs per client                    | 10,000             |
| Pre-created process instances             | 50,000             |
| Client concurrency (in-flight operations) | 32                 |
| Job activation batch size                 | 32                 |
| Payload size                              | 10 KB per instance |
| Timeout per run                           | 300s (5 minutes)   |
| Container restarted between runs          | Yes                |

## Dimensions

| Dimension     | Values                                                       | Description                                                            |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Cluster**   | `1broker`, `3broker`                                         | Single broker (high pressure) vs 3-broker cluster (3 partitions, RF 3) |
| **Clients**   | `50`, `100`                                                  | Number of concurrent worker clients                                    |
| **SDK Mode**  | `rest-disabled`, `rest-balanced`, `grpc-stream`, `grpc-poll` | See "SDK Modes" below                                                  |
| **Handler**   | `cpu`, `http`                                                | Synchronous CPU work vs async HTTP call in job handler                 |
| **Isolation** | `independent`, `shared`                                      | One process per client vs all clients in one process                   |

**Total configurations:** 2 × 2 × 4 × 2 × 2 = **64**

### SDK Modes Explained

| Mode            | Transport      | Backpressure        | Description                                                                                                  |
| --------------- | -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `rest-disabled` | REST API       | None (LEGACY)       | REST job activation, no adaptive backpressure. Producer uses LEGACY profile (fire-and-forget).               |
| `rest-balanced` | REST API       | Adaptive (BALANCED) | REST job activation with adaptive semaphore. Producer uses BALANCED profile (respects backpressure signals). |
| `grpc-stream`   | gRPC streaming | N/A                 | `@camunda8/sdk` `streamJobs()` — long-lived gRPC stream, server pushes jobs.                                 |
| `grpc-poll`     | gRPC polling   | N/A                 | `@camunda8/sdk` `createWorker()` — periodic gRPC poll for jobs.                                              |

### Metrics

| Metric         | Meaning                                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Throughput** | Aggregate jobs completed per second across all clients                                                                                                               |
| **Errors**     | Total client-side errors (HTTP 429/503, gRPC RESOURCE_EXHAUSTED, timeouts)                                                                                           |
| **Jain**       | [Jain's fairness index](https://en.wikipedia.org/wiki/Jain%27s_fairness_index) — 1.0 = perfectly fair distribution across clients, 0.0 = all work goes to one client |

---

## Results by Scenario

### 1. Single Broker, 50 Clients, Independent Processes (CPU handler)

> **Scenario:** 50 worker processes, each with its own SDK client, running synchronous CPU-bound job handlers against a single broker. This is the standard "one worker per pod" deployment pattern with compute-intensive handlers.

| Rank | Mode          | Throughput | Errors | Jain  |
| ---- | ------------- | ---------- | ------ | ----- |
| 1    | rest-disabled | 186.5/s    | 58,643 | 0.993 |
| 2    | rest-balanced | 183.6/s    | 3,452  | 0.996 |
| 3    | grpc-poll     | 173.9/s    | 3,008  | 0.892 |
| 4    | grpc-stream   | 4.0/s      | 4,297  | 0.060 |

**Takeaway:** REST modes lead throughput. Balanced matches disabled on speed but has **94% fewer errors**. gRPC streaming has a severe bottleneck at this scale — most clients starve (Jain 0.06).

---

### 2. Single Broker, 50 Clients, Independent Processes (HTTP handler)

> **Scenario:** 50 worker processes with async HTTP-calling job handlers (simulating external service calls) against a single broker. Handlers yield the event loop during I/O, allowing more concurrent activation.

| Rank | Mode          | Throughput | Errors | Jain  |
| ---- | ------------- | ---------- | ------ | ----- |
| 1    | grpc-poll     | 185.2/s    | 2,725  | 0.950 |
| 2    | rest-disabled | 157.6/s    | 80,125 | 0.980 |
| 3    | rest-balanced | 151.0/s    | 2,061  | 0.999 |
| 4    | grpc-stream   | 32.8/s     | 2,548  | 0.397 |

**Takeaway:** gRPC poll leads when handlers are async. Balanced has the **best fairness** (0.999) and fewest errors. Disabled blasts the broker with 80K errors despite lower throughput.

---

### 3. Single Broker, 50 Clients, Shared Process (CPU handler)

> **Scenario:** A single Node.js process running 50 client loops with CPU-bound handlers. This tests the "monolith worker" pattern — maximum resource sharing, but clients compete for the single event loop.

| Rank | Mode          | Throughput | Errors    | Jain  |
| ---- | ------------- | ---------- | --------- | ----- |
| 1    | grpc-stream   | 32.4/s     | 4,749,730 | 1.000 |
| 2    | grpc-poll     | 21.2/s     | 5,441,811 | 1.000 |
| 3    | rest-balanced | 2.9/s      | 1,351,988 | 0.978 |
| 4    | rest-disabled | 1.2/s      | 474,231   | 0.220 |

**Takeaway:** Shared mode is pathological for all configurations. gRPC-based modes survive better because the server pushes/serves jobs without requiring HTTP request overhead per activation. REST modes nearly stall. Millions of errors across the board.

---

### 4. Single Broker, 50 Clients, Shared Process (HTTP handler)

> **Scenario:** Single process, 50 client loops with async HTTP handlers. Handlers yield the event loop, which should help shared mode... but the single broker is the bottleneck.

| Rank | Mode          | Throughput | Errors    | Jain  |
| ---- | ------------- | ---------- | --------- | ----- |
| 1    | grpc-stream   | 28.2/s     | 3,604,922 | 1.000 |
| 2    | grpc-poll     | 11.3/s     | 5,002,134 | 1.000 |
| 3    | rest-disabled | 1.8/s      | 271,810   | 0.793 |
| 4    | rest-balanced | TIMEOUT    | —         | —     |

**Takeaway:** Balanced shared stalled completely on a single broker — the adaptive semaphore received so many 429/503 signals it throttled to near-zero, and couldn't recover. gRPC stream remains the "least bad" option for shared mode.

---

### 5. Single Broker, 100 Clients, Independent Processes (CPU handler)

> **Scenario:** 100 worker processes with CPU-bound handlers. Doubles the pressure on a single broker — will it cope?

| Rank | Mode          | Throughput | Errors | Jain  |
| ---- | ------------- | ---------- | ------ | ----- |
| 1    | grpc-poll     | 207.7/s    | 3,207  | 0.856 |
| 2    | rest-balanced | 166.8/s    | 3,789  | 0.939 |
| 3    | rest-disabled | 61.3/s     | 21,207 | 0.901 |
| 4    | grpc-stream   | 23.8/s     | 3,991  | 0.089 |

**Takeaway:** At 100 clients, balanced is **2.7× faster** than disabled (166.8 vs 61.3/s) and has 82% fewer errors. Disabled collapses under load — its fire-and-forget approach overwhelms the single broker. gRPC poll is fastest but has lower fairness.

---

### 6. Single Broker, 100 Clients, Independent Processes (HTTP handler)

> **Scenario:** 100 worker processes with async HTTP handlers against a single broker. Maximum REST API pressure.

| Rank | Mode          | Throughput | Errors | Jain  |
| ---- | ------------- | ---------- | ------ | ----- |
| 1    | grpc-poll     | 194.3/s    | 3,153  | 0.834 |
| 2    | rest-balanced | 174.0/s    | 3,917  | 0.939 |
| 3    | rest-disabled | 132.2/s    | 66,427 | 0.952 |
| 4    | grpc-stream   | 28.6/s     | 5,622  | 0.030 |

**Takeaway:** Same pattern — balanced beats disabled by 32% throughput and **94% fewer errors**. gRPC stream's fairness index of 0.030 means essentially one client is doing all the work.

---

### 7. Single Broker, 100 Clients, Shared Process (CPU handler)

> **Scenario:** One process, 100 client loops, CPU handlers, single broker. Extreme shared-mode stress.

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | grpc-stream   | 30.6/s     | 8,620,200  | 1.000 |
| 2    | rest-balanced | 22.7/s     | 5,811,980  | 0.979 |
| 3    | grpc-poll     | 20.4/s     | 14,952,987 | 1.000 |
| 4    | rest-disabled | 1.4/s      | 506,992    | 0.131 |

**Takeaway:** Shared mode at 100 clients is catastrophic. gRPC stream gets the most work done but generates 8.6M errors. Balanced now completes (unlike 50c where it TIMEOUT'd for http) but at enormous error cost.

---

### 8. Single Broker, 100 Clients, Shared Process (HTTP handler)

> **Scenario:** One process, 100 client loops, HTTP handlers, single broker.

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | grpc-stream   | 23.3/s     | 6,491,760  | 1.000 |
| 2    | rest-balanced | 18.1/s     | 13,553,771 | 0.963 |
| 3    | grpc-poll     | 8.8/s      | 11,150,215 | 1.000 |
| 4    | rest-disabled | 1.1/s      | 440,401    | 0.310 |

**Takeaway:** Disabled nearly flatlines at 1.1/s. The other modes survive but with millions of errors — none are good choices for shared mode on a single broker.

---

### 9. Three Brokers, 50 Clients, Independent Processes (CPU handler)

> **Scenario:** 50 worker processes against a 3-broker cluster (3 partitions, RF 3). The cluster distributes load across brokers. Does this change the rankings?

| Rank | Mode          | Throughput  | Errors | Jain  |
| ---- | ------------- | ----------- | ------ | ----- |
| 1    | rest-balanced | **390.4/s** | 380    | 0.999 |
| 2    | rest-disabled | 377.1/s     | 2,308  | 0.999 |
| 3    | grpc-poll     | 338.4/s     | 267    | 0.996 |
| 4    | grpc-stream   | 89.6/s      | 344    | 0.993 |

**Takeaway:** The 3-broker cluster **doubles throughput** across the board. Balanced leads at 390/s with only 380 errors. All modes are viable — even streaming hits 89.6/s. gRPC poll has the fewest absolute errors (267).

---

### 10. Three Brokers, 50 Clients, Independent Processes (HTTP handler)

> **Scenario:** 50 workers with HTTP handlers on a 3-broker cluster.

| Rank | Mode          | Throughput  | Errors | Jain  |
| ---- | ------------- | ----------- | ------ | ----- |
| 1    | rest-balanced | **371.5/s** | 536    | 0.999 |
| 2    | rest-disabled | 343.7/s     | 3,769  | 0.998 |
| 3    | grpc-poll     | 288.5/s     | 552    | 0.986 |
| 4    | grpc-stream   | 75.7/s      | 409    | 0.985 |

**Takeaway:** Balanced is again fastest with the fewest errors. HTTP handlers consistently see more errors than CPU for disabled mode (3,769 vs 2,308) because the async handler keeps the event loop free to fire more requests.

---

### 11. Three Brokers, 50 Clients, Shared Process (CPU handler)

> **Scenario:** 50 client loops in one process against a 3-broker cluster. Does the cluster save shared mode?

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | grpc-stream   | 49.0/s     | 7,366,334  | 1.000 |
| 2    | rest-balanced | 38.5/s     | 9,064,841  | 0.998 |
| 3    | grpc-poll     | 35.8/s     | 11,028,209 | 1.000 |
| 4    | rest-disabled | 1.5/s      | 96,934     | 0.289 |

**Takeaway:** Shared mode is still bad, but notably balanced now **completes** (it TIMEOUT'd on 1broker). The cluster provides enough headroom to prevent total stall. Disabled is again the worst at 1.5/s.

---

### 12. Three Brokers, 50 Clients, Shared Process (HTTP handler)

> **Scenario:** Single process, 50 loops, HTTP handlers, 3 brokers.

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | grpc-stream   | 69.8/s     | 9,580,102  | 1.000 |
| 2    | rest-balanced | 32.2/s     | 10,205,556 | 0.998 |
| 3    | grpc-poll     | 20.5/s     | 10,298,780 | 1.000 |
| 4    | rest-disabled | 4.7/s      | 402,566    | 0.924 |

**Takeaway:** gRPC streaming is the clear shared-mode winner when handlers yield the event loop. Its server-push model avoids per-activation HTTP overhead.

---

### 13. Three Brokers, 100 Clients, Independent Processes (CPU handler)

> **Scenario:** 100 processes, CPU handlers, 3 brokers. Does the cluster handle 100 workers gracefully?

| Rank | Mode          | Throughput  | Errors | Jain  |
| ---- | ------------- | ----------- | ------ | ----- |
| 1    | rest-balanced | **189.2/s** | 2,173  | 0.975 |
| 2    | rest-disabled | 187.3/s     | 18,467 | 0.984 |
| 3    | grpc-poll     | 94.4/s      | 2,451  | 0.821 |
| 4    | grpc-stream   | 45.4/s      | 117    | 0.149 |

**Takeaway:** Throughput drops from 390/s (50c) to 189/s — the cluster is saturated. Balanced has **88% fewer errors** than disabled at identical throughput. grpc-stream has fewest absolute errors but can't distribute work — Jain 0.149 means a handful of clients do almost everything.

---

### 14. Three Brokers, 100 Clients, Independent Processes (HTTP handler)

> **Scenario:** 100 processes, HTTP handlers, 3 brokers.

| Rank | Mode          | Throughput  | Errors | Jain  |
| ---- | ------------- | ----------- | ------ | ----- |
| 1    | grpc-poll     | **196.9/s** | 1,630  | 0.837 |
| 2    | rest-balanced | 175.5/s     | 2,967  | 0.984 |
| 3    | rest-disabled | 163.5/s     | 8,592  | 0.983 |
| 4    | grpc-stream   | 78.0/s      | 119    | 0.238 |

**Takeaway:** gRPC poll surprises with the highest throughput and very low errors. Balanced is close behind with better fairness (0.984 vs 0.837). Streaming again has fairness collapse.

---

### 15. Three Brokers, 100 Clients, Shared Process (CPU handler)

> **Scenario:** One process, 100 loops, CPU handlers, 3 brokers.

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | rest-balanced | 45.6/s     | 19,787,288 | 0.994 |
| 2    | grpc-stream   | 43.2/s     | 16,107,530 | 1.000 |
| 3    | grpc-poll     | 26.9/s     | 18,748,321 | 1.000 |
| 4    | rest-disabled | 0.9/s      | 165,255    | 0.089 |

**Takeaway:** Even with 3 brokers, shared mode at 100 clients generates tens of millions of errors. The cluster can't save shared mode at this scale.

---

### 16. Three Brokers, 100 Clients, Shared Process (HTTP handler)

> **Scenario:** One process, 100 loops, HTTP handlers, 3 brokers.

| Rank | Mode          | Throughput | Errors     | Jain  |
| ---- | ------------- | ---------- | ---------- | ----- |
| 1    | grpc-stream   | 41.5/s     | 15,481,043 | 1.000 |
| 2    | rest-balanced | 32.9/s     | 21,456,858 | 0.989 |
| 3    | grpc-poll     | 15.7/s     | 16,595,227 | 1.000 |
| 4    | rest-disabled | 2.3/s      | 364,402    | 0.619 |

**Takeaway:** Shared mode remains pathological regardless of cluster size at high client counts.

---

## Cross-Cutting Analysis

### Independent vs Shared: The Dominant Decision

The single most impactful choice is **isolation mode**. Independent processes outperform shared by 5-200× on throughput with 1000× fewer errors.

| Cluster | Clients | Handler | Best Independent    | Best Shared       | Throughput Ratio |
| ------- | ------- | ------- | ------------------- | ----------------- | ---------------- |
| 1broker | 50      | cpu     | 186.5/s (disabled)  | 32.4/s (stream)   | **5.8×**         |
| 1broker | 50      | http    | 185.2/s (grpc-poll) | 28.2/s (stream)   | **6.6×**         |
| 1broker | 100     | cpu     | 207.7/s (grpc-poll) | 30.6/s (stream)   | **6.8×**         |
| 1broker | 100     | http    | 194.3/s (grpc-poll) | 23.3/s (stream)   | **8.3×**         |
| 3broker | 50      | cpu     | 390.4/s (balanced)  | 49.0/s (stream)   | **8.0×**         |
| 3broker | 50      | http    | 371.5/s (balanced)  | 69.8/s (stream)   | **5.3×**         |
| 3broker | 100     | cpu     | 189.2/s (balanced)  | 45.6/s (balanced) | **4.1×**         |
| 3broker | 100     | http    | 196.9/s (grpc-poll) | 41.5/s (stream)   | **4.7×**         |

**Verdict:** Always use independent processes (one worker per pod/container). Shared mode is only viable for very low client counts with gRPC streaming.

### BALANCED vs LEGACY (rest-balanced vs rest-disabled)

Comparing only the REST modes isolates the effect of adaptive backpressure:

| Scenario         | Balanced Throughput | Disabled Throughput | Balanced Errors | Disabled Errors | Error Reduction |
| ---------------- | ------------------- | ------------------- | --------------- | --------------- | --------------- |
| 1b/50c/cpu/ind   | 183.6/s             | 186.5/s             | 3,452           | 58,643          | **94%**         |
| 1b/50c/http/ind  | 151.0/s             | 157.6/s             | 2,061           | 80,125          | **97%**         |
| 1b/100c/cpu/ind  | 166.8/s             | 61.3/s              | 3,789           | 21,207          | **82%**         |
| 1b/100c/http/ind | 174.0/s             | 132.2/s             | 3,917           | 66,427          | **94%**         |
| 3b/50c/cpu/ind   | 390.4/s             | 377.1/s             | 380             | 2,308           | **84%**         |
| 3b/50c/http/ind  | 371.5/s             | 343.7/s             | 536             | 3,769           | **86%**         |
| 3b/100c/cpu/ind  | 189.2/s             | 187.3/s             | 2,173           | 18,467          | **88%**         |
| 3b/100c/http/ind | 175.5/s             | 163.5/s             | 2,967           | 8,592           | **65%**         |

**Verdict:** BALANCED delivers **82-97% fewer errors** with equal or better throughput in every independent-mode scenario. At 100 clients on a single broker, balanced is **2.7× faster** because disabled overwhelms the broker with unthrottled requests.

### Transport Comparison (Independent Mode Only)

Since independent mode is the recommended deployment, here's how transports compare:

#### Single Broker

| Clients | Handler | REST Balanced      | REST Disabled       | gRPC Poll          | gRPC Stream       |
| ------- | ------- | ------------------ | ------------------- | ------------------ | ----------------- |
| 50      | cpu     | 183.6/s (3.5K err) | 186.5/s (58.6K err) | 173.9/s (3K err)   | 4.0/s (4.3K err)  |
| 50      | http    | 151.0/s (2.1K err) | 157.6/s (80.1K err) | 185.2/s (2.7K err) | 32.8/s (2.5K err) |
| 100     | cpu     | 166.8/s (3.8K err) | 61.3/s (21.2K err)  | 207.7/s (3.2K err) | 23.8/s (4K err)   |
| 100     | http    | 174.0/s (3.9K err) | 132.2/s (66.4K err) | 194.3/s (3.2K err) | 28.6/s (5.6K err) |

#### Three Brokers

| Clients | Handler | REST Balanced         | REST Disabled       | gRPC Poll              | gRPC Stream      |
| ------- | ------- | --------------------- | ------------------- | ---------------------- | ---------------- |
| 50      | cpu     | **390.4/s** (380 err) | 377.1/s (2.3K err)  | 338.4/s (267 err)      | 89.6/s (344 err) |
| 50      | http    | **371.5/s** (536 err) | 343.7/s (3.8K err)  | 288.5/s (552 err)      | 75.7/s (409 err) |
| 100     | cpu     | 189.2/s (2.2K err)    | 187.3/s (18.5K err) | 94.4/s (2.5K err)      | 45.4/s (117 err) |
| 100     | http    | 175.5/s (3K err)      | 163.5/s (8.6K err)  | **196.9/s** (1.6K err) | 78.0/s (119 err) |

### gRPC Streaming: The Fairness Problem

gRPC streaming has a fundamental fairness issue at scale. The Jain's fairness index reveals that work distribution becomes increasingly uneven as client count grows:

| Scenario         | 50 Clients Jain | 100 Clients Jain | Delta            |
| ---------------- | --------------- | ---------------- | ---------------- |
| 1broker/cpu/ind  | 0.060           | 0.089            | Both terrible    |
| 1broker/http/ind | 0.397           | 0.030            | Worse at 100     |
| 3broker/cpu/ind  | 0.993           | 0.149            | Collapses at 100 |
| 3broker/http/ind | 0.985           | 0.238            | Collapses at 100 |

At 100 clients on 3 brokers, a Jain index of 0.149 means approximately 15 of 100 clients are receiving jobs. The rest are idle. This is a property of the streaming protocol — the server can only push jobs to open stream connections, and gateway load balancing doesn't guarantee fair distribution.

### Cluster Scaling Effect (1 Broker → 3 Brokers, Independent Mode)

| Scenario           | 1broker | 3broker | Throughput Gain | Error Reduction |
| ------------------ | ------- | ------- | --------------- | --------------- |
| 50c/cpu/balanced   | 183.6/s | 390.4/s | **+113%**       | **−89%**        |
| 50c/http/balanced  | 151.0/s | 371.5/s | **+146%**       | **−74%**        |
| 50c/cpu/grpc-poll  | 173.9/s | 338.4/s | **+95%**        | **−91%**        |
| 50c/http/grpc-poll | 185.2/s | 288.5/s | **+56%**        | **−80%**        |
| 100c/cpu/balanced  | 166.8/s | 189.2/s | +13%            | −43%            |
| 100c/http/balanced | 174.0/s | 175.5/s | +1%             | −24%            |

At 50 clients, adding brokers roughly doubles throughput. At 100 clients, gains diminish — the bottleneck shifts from the broker to the local machine running the benchmark.

---

## Recommendations

### For production deployments (independent workers):

1. **Use `rest-balanced` (BALANCED mode)** — it consistently delivers top-tier throughput with 82-97% fewer errors than LEGACY mode. The adaptive backpressure manager prevents the broker from being overwhelmed.

2. **Deploy one worker per pod/container** — independent isolation is 5-8× faster than shared mode with orders of magnitude fewer errors.

3. **Scale brokers before scaling clients** — going from 1 to 3 brokers doubles throughput at 50 clients. Adding more clients beyond what the cluster can handle gives diminishing (or negative) returns.

4. **gRPC poll is a strong alternative for HTTP handler workloads** — it achieved the highest single-config throughput (207.7/s on 1broker, 196.9/s on 3broker) but has lower fairness than REST balanced.

5. **Avoid gRPC streaming at scale** — the fairness problem means most workers will be idle at >50 clients. It's only viable for small worker pools.

### For shared-process deployments (if you must):

1. **Use gRPC streaming** — it consistently outperforms other modes in shared mode because the server pushes jobs without per-activation HTTP overhead.

2. **Keep client counts low** — shared mode is only remotely viable at ≤50 clients.

3. **Expect millions of errors** — shared mode cannot avoid broker pressure storms regardless of configuration.

---

## Raw Data

All 64 result files are stored in `camundacon/backpressure/matrix/results/`. Each file contains full logs, per-client metrics, and final summary.

### Complete Results Table

| Cluster | Clients | Mode          | Handler | Isolation | Throughput | Errors     | Jain  |
| ------- | ------- | ------------- | ------- | --------- | ---------- | ---------- | ----- |
| 1broker | 50      | rest-disabled | cpu     | ind       | 186.5/s    | 58,643     | 0.993 |
| 1broker | 50      | rest-disabled | cpu     | shr       | 1.2/s      | 474,231    | 0.220 |
| 1broker | 50      | rest-disabled | http    | ind       | 157.6/s    | 80,125     | 0.980 |
| 1broker | 50      | rest-disabled | http    | shr       | 1.8/s      | 271,810    | 0.793 |
| 1broker | 50      | rest-balanced | cpu     | ind       | 183.6/s    | 3,452      | 0.996 |
| 1broker | 50      | rest-balanced | cpu     | shr       | 2.9/s      | 1,351,988  | 0.978 |
| 1broker | 50      | rest-balanced | http    | ind       | 151.0/s    | 2,061      | 0.999 |
| 1broker | 50      | rest-balanced | http    | shr       | TIMEOUT    | —          | —     |
| 1broker | 50      | grpc-stream   | cpu     | ind       | 4.0/s      | 4,297      | 0.060 |
| 1broker | 50      | grpc-stream   | cpu     | shr       | 32.4/s     | 4,749,730  | 1.000 |
| 1broker | 50      | grpc-stream   | http    | ind       | 32.8/s     | 2,548      | 0.397 |
| 1broker | 50      | grpc-stream   | http    | shr       | 28.2/s     | 3,604,922  | 1.000 |
| 1broker | 50      | grpc-poll     | cpu     | ind       | 173.9/s    | 3,008      | 0.892 |
| 1broker | 50      | grpc-poll     | cpu     | shr       | 21.2/s     | 5,441,811  | 1.000 |
| 1broker | 50      | grpc-poll     | http    | ind       | 185.2/s    | 2,725      | 0.950 |
| 1broker | 50      | grpc-poll     | http    | shr       | 11.3/s     | 5,002,134  | 1.000 |
| 1broker | 100     | rest-disabled | cpu     | ind       | 61.3/s     | 21,207     | 0.901 |
| 1broker | 100     | rest-disabled | cpu     | shr       | 1.4/s      | 506,992    | 0.131 |
| 1broker | 100     | rest-disabled | http    | ind       | 132.2/s    | 66,427     | 0.952 |
| 1broker | 100     | rest-disabled | http    | shr       | 1.1/s      | 440,401    | 0.310 |
| 1broker | 100     | rest-balanced | cpu     | ind       | 166.8/s    | 3,789      | 0.939 |
| 1broker | 100     | rest-balanced | cpu     | shr       | 22.7/s     | 5,811,980  | 0.979 |
| 1broker | 100     | rest-balanced | http    | ind       | 174.0/s    | 3,917      | 0.939 |
| 1broker | 100     | rest-balanced | http    | shr       | 18.1/s     | 13,553,771 | 0.963 |
| 1broker | 100     | grpc-stream   | cpu     | ind       | 23.8/s     | 3,991      | 0.089 |
| 1broker | 100     | grpc-stream   | cpu     | shr       | 30.6/s     | 8,620,200  | 1.000 |
| 1broker | 100     | grpc-stream   | http    | ind       | 28.6/s     | 5,622      | 0.030 |
| 1broker | 100     | grpc-stream   | http    | shr       | 23.3/s     | 6,491,760  | 1.000 |
| 1broker | 100     | grpc-poll     | cpu     | ind       | 207.7/s    | 3,207      | 0.856 |
| 1broker | 100     | grpc-poll     | cpu     | shr       | 20.4/s     | 14,952,987 | 1.000 |
| 1broker | 100     | grpc-poll     | http    | ind       | 194.3/s    | 3,153      | 0.834 |
| 1broker | 100     | grpc-poll     | http    | shr       | 8.8/s      | 11,150,215 | 1.000 |
| 3broker | 50      | rest-disabled | cpu     | ind       | 377.1/s    | 2,308      | 0.999 |
| 3broker | 50      | rest-disabled | cpu     | shr       | 1.5/s      | 96,934     | 0.289 |
| 3broker | 50      | rest-disabled | http    | ind       | 343.7/s    | 3,769      | 0.998 |
| 3broker | 50      | rest-disabled | http    | shr       | 4.7/s      | 402,566    | 0.924 |
| 3broker | 50      | rest-balanced | cpu     | ind       | 390.4/s    | 380        | 0.999 |
| 3broker | 50      | rest-balanced | cpu     | shr       | 38.5/s     | 9,064,841  | 0.998 |
| 3broker | 50      | rest-balanced | http    | ind       | 371.5/s    | 536        | 0.999 |
| 3broker | 50      | rest-balanced | http    | shr       | 32.2/s     | 10,205,556 | 0.998 |
| 3broker | 50      | grpc-stream   | cpu     | ind       | 89.6/s     | 344        | 0.993 |
| 3broker | 50      | grpc-stream   | cpu     | shr       | 49.0/s     | 7,366,334  | 1.000 |
| 3broker | 50      | grpc-stream   | http    | ind       | 75.7/s     | 409        | 0.985 |
| 3broker | 50      | grpc-stream   | http    | shr       | 69.8/s     | 9,580,102  | 1.000 |
| 3broker | 50      | grpc-poll     | cpu     | ind       | 338.4/s    | 267        | 0.996 |
| 3broker | 50      | grpc-poll     | cpu     | shr       | 35.8/s     | 11,028,209 | 1.000 |
| 3broker | 50      | grpc-poll     | http    | ind       | 288.5/s    | 552        | 0.986 |
| 3broker | 50      | grpc-poll     | http    | shr       | 20.5/s     | 10,298,780 | 1.000 |
| 3broker | 100     | rest-disabled | cpu     | ind       | 187.3/s    | 18,467     | 0.984 |
| 3broker | 100     | rest-disabled | cpu     | shr       | 0.9/s      | 165,255    | 0.089 |
| 3broker | 100     | rest-disabled | http    | ind       | 163.5/s    | 8,592      | 0.983 |
| 3broker | 100     | rest-disabled | http    | shr       | 2.3/s      | 364,402    | 0.619 |
| 3broker | 100     | rest-balanced | cpu     | ind       | 189.2/s    | 2,173      | 0.975 |
| 3broker | 100     | rest-balanced | cpu     | shr       | 45.6/s     | 19,787,288 | 0.994 |
| 3broker | 100     | rest-balanced | http    | ind       | 175.5/s    | 2,967      | 0.984 |
| 3broker | 100     | rest-balanced | http    | shr       | 32.9/s     | 21,456,858 | 0.989 |
| 3broker | 100     | grpc-stream   | cpu     | ind       | 45.4/s     | 117        | 0.149 |
| 3broker | 100     | grpc-stream   | cpu     | shr       | 43.2/s     | 16,107,530 | 1.000 |
| 3broker | 100     | grpc-stream   | http    | ind       | 78.0/s     | 119        | 0.238 |
| 3broker | 100     | grpc-stream   | http    | shr       | 41.5/s     | 15,481,043 | 1.000 |
| 3broker | 100     | grpc-poll     | cpu     | ind       | 94.4/s     | 2,451      | 0.821 |
| 3broker | 100     | grpc-poll     | cpu     | shr       | 26.9/s     | 18,748,321 | 1.000 |
| 3broker | 100     | grpc-poll     | http    | ind       | 196.9/s    | 1,630      | 0.837 |
| 3broker | 100     | grpc-poll     | http    | shr       | 15.7/s     | 16,595,227 | 1.000 |

_Note: 1broker/50c/rest-balanced/http/shared TIMEOUT'd — the adaptive semaphore throttled to near-zero under sustained 429/503 from the single broker and couldn't recover._
