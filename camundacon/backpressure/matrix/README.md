# Backpressure Matrix Benchmark

Automated framework for benchmarking the JS SDK's backpressure handling across a
matrix of configurations. Each run exercises N concurrent clients against a
Camunda cluster, measures throughput and error rates, then produces a Markdown
report with head-to-head comparisons and recommendations.

## Matrix Dimensions

| Dimension     | Values                                                       | Description                                                     |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| **Cluster**   | `1broker`, `3broker`                                         | Single broker (high pressure) or 3-broker cluster (distributed) |
| **SDK Mode**  | `rest-disabled`, `rest-balanced`, `grpc-stream`, `grpc-poll` | Transport + backpressure strategy                               |
| **Handler**   | `cpu`, `http`                                                | No-op CPU work vs 200 ms simulated HTTP call                    |
| **Clients**   | `50`, `100`                                                  | Number of concurrent worker clients                             |
| **Isolation** | `independent`, `shared`                                      | Child process per client vs one client with N async loops       |

Default full matrix: **2 × 4 × 2 × 2 × 2 = 64 configurations**.

### SDK Modes

- **rest-disabled** — REST transport, `LEGACY` backpressure (observe only, never gates).
  Producer also uses LEGACY so it blasts the server without self-throttling.
- **rest-balanced** — REST transport, `BALANCED` backpressure (adaptive semaphore with
  floor/recovery). Producer also uses BALANCED.
- **grpc-stream** — gRPC `streamJobs` (server-initiated streaming). Producer uses
  BALANCED REST for instance creation.
- **grpc-poll** — gRPC `createWorker` (long-polling `ActivateJobs`). Producer uses
  BALANCED REST for instance creation.

## Prerequisites

- Docker (for the Camunda cluster)
- Node.js 20+
- `tsx` (`npx tsx` or install globally)
- The SDK built locally (`npm run build:local` from repo root)

## Quick Start

```bash
# From the repo root

# 1. Run the full 64-config matrix (≈10 hours)
tsx camundacon/backpressure/matrix/run-matrix.ts --pre-create 50000

# 2. Quick smoke test (1 config, ~5 min)
tsx camundacon/backpressure/matrix/run-matrix.ts \
  --clusters 1broker \
  --modes rest-balanced \
  --handlers cpu \
  --clients 50 \
  --isolations independent \
  --pre-create 50000

# 3. Preview the matrix without running
tsx camundacon/backpressure/matrix/run-matrix.ts --dry-run
```

## CLI Options

| Flag            | Default                                             | Description                                          |
| --------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `--clusters`    | `1broker 3broker`                                   | Cluster topologies to test                           |
| `--modes`       | `rest-disabled rest-balanced grpc-stream grpc-poll` | SDK modes                                            |
| `--handlers`    | `cpu http`                                          | Handler types                                        |
| `--clients`     | `50 100`                                            | Client counts                                        |
| `--isolations`  | `independent shared`                                | Isolation strategies                                 |
| `--target`      | `10000`                                             | Completions target per client                        |
| `--concurrency` | `32`                                                | Max inflight per client                              |
| `--timeout`     | `300`                                               | Per-scenario timeout (seconds)                       |
| `--pre-create`  | `50000`                                             | Process instances to pre-create before workers start |
| `--no-restart`  | `false`                                             | Skip container restart between runs                  |
| `--dry-run`     | `false`                                             | Print the matrix and exit                            |

Multi-value flags accept space-separated values:

```bash
--modes rest-balanced grpc-stream --clients 50 100
```

## File Structure

```
camundacon/backpressure/matrix/
├── README.md              # This file
├── run-matrix.ts          # Matrix runner — iterates configs, restarts containers, generates report
├── multi-client.ts        # Orchestrator — spawns workers, manages producer, collects metrics
├── client-worker.ts       # Worker subprocess — one per client in independent isolation mode
├── analyze.ts             # Post-hoc analysis tool for results.json
└── results/               # Output directory (per-run logs + results.json + report.md)
```

Supporting infrastructure (in `docker/` at repo root):

```
docker/
├── docker-compose.cluster.yaml   # 1 broker, 1 partition (constrained)
├── docker-compose.3broker.yaml   # 3 brokers, 3 partitions, RF 3 (distributed)
├── prometheus/                   # Prometheus scrape config
└── grafana/                      # Grafana dashboards
```

## How It Works

1. **Container restart** — Between each configuration the Camunda container is
   stopped and restarted (clean H2 in-memory database) to give every scenario
   an identical baseline.

2. **Pre-creation** — Before workers start, `--pre-create` process instances are
   deployed using a BALANCED backpressure profile so jobs are ready to activate.

3. **Worker execution** — In `independent` mode, each client runs as a separate
   child process (`client-worker.ts`) with its own SDK client and
   BackpressureManager. In `shared` mode, all clients run as concurrent async
   loops in a single process with one shared SDK client.

4. **Metrics collection** — Each run captures: total completed, total errors,
   queue-full (429/503) count, wall-clock time, throughput, Jain fairness
   index, and server-side execution metrics from the Prometheus endpoint.

5. **Report generation** — A Markdown report with summary tables, per-mode and
   per-isolation comparisons, head-to-head mode comparison, and recommendations.

## Output

After a run, `results/` contains:

- **results.json** — Raw structured results for every configuration
- **report.md** — Human-readable Markdown report with tables and analysis
- **\<label\>.txt** — Per-configuration stdout/stderr capture

## Post-hoc Analysis

Re-analyze existing results without re-running:

```bash
tsx camundacon/backpressure/matrix/analyze.ts ./camundacon/backpressure/matrix/results
```

## Environment Variables

The orchestrator passes configuration to workers via environment variables.
These are set automatically by `run-matrix.ts` — you do not need to set them
manually unless running `multi-client.ts` or `client-worker.ts` directly.

| Variable             | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `SDK_MODE`           | `rest-disabled` / `rest-balanced` / `grpc-stream` / `grpc-poll` |
| `HANDLER_TYPE`       | `cpu` / `http`                                                  |
| `HANDLER_LATENCY_MS` | Simulated handler latency (0 for cpu, 200 for http)             |
| `NUM_CLIENTS`        | Number of concurrent clients                                    |
| `ISOLATION`          | `independent` / `shared`                                        |
| `TARGET_PER_CLIENT`  | Completions target per client                                   |
| `CLIENT_CONCURRENCY` | Max inflight per client                                         |
| `ACTIVATE_BATCH`     | `maxJobsToActivate` per poll                                    |
| `PAYLOAD_SIZE_KB`    | Variable payload size                                           |
| `SCENARIO_TIMEOUT_S` | Hard timeout in seconds                                         |
