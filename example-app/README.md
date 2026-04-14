# Example App

A minimal example application using the Camunda 8 Orchestration SDK.

It deploys a two-step order process, starts an instance, and runs job workers to complete it.

## Prerequisites

Install the Camunda CLI:

```sh
npm i -g @camunda8/cli
```

Start a local Camunda instance:

```sh
c8 cluster start
```

## Run

Install dependencies and start the example:

```sh
npm install
npm start
```

## What it does

1. Connects to the local Camunda cluster (zero-config — no env vars needed)
2. Deploys [`order-process.bpmn`](order-process.bpmn) — a simple process with two service tasks
3. Creates a process instance with order variables
4. Runs two job workers (`validate-order` and `process-payment`) that complete the tasks
5. Shuts down gracefully after processing

## Expected output

```
Connected to cluster (1 broker(s))

Deployed "order-process" (key: 2251799813685249)

Started process instance 2251799813685262

Waiting for workers to process jobs...

[validate-order] Validating ORD-42 ($99.95)
[process-payment] Processing payment for ORD-42 → PAY-1713168000000

Done!
```
