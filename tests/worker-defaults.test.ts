import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { JobWorker } from '../src/runtime/jobWorker';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';

/**
 * Unit tests for heritable worker defaults (CAMUNDA_WORKER_* env vars).
 *
 * These tests validate:
 * 1. Environment variables are hydrated into workerDefaults
 * 2. Constructor overrides merge into workerDefaults
 * 3. Explicit per-worker config overrides defaults
 * 4. Validation: missing required fields throw helpful errors
 */

const noopHandler = async () => 'JOB_ACTION_RECEIPT' as const;
const noopFetch = vi.fn(
  async () =>
    new Response(JSON.stringify({ jobs: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
);

describe('worker defaults: config hydration', () => {
  it('hydrates CAMUNDA_WORKER_TIMEOUT into workerDefaults.jobTimeoutMs', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_WORKER_TIMEOUT: '30000' } });
    expect(config.workerDefaults?.jobTimeoutMs).toBe(30000);
  });

  it('hydrates CAMUNDA_WORKER_MAX_CONCURRENT_JOBS into workerDefaults.maxParallelJobs', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '8' } });
    expect(config.workerDefaults?.maxParallelJobs).toBe(8);
  });

  it('hydrates CAMUNDA_WORKER_REQUEST_TIMEOUT into workerDefaults.pollTimeoutMs', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_WORKER_REQUEST_TIMEOUT: '15000' } });
    expect(config.workerDefaults?.pollTimeoutMs).toBe(15000);
  });

  it('hydrates negative CAMUNDA_WORKER_REQUEST_TIMEOUT (immediate completion)', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_WORKER_REQUEST_TIMEOUT: '-1' } });
    expect(config.workerDefaults?.pollTimeoutMs).toBe(-1);
  });

  it('hydrates CAMUNDA_WORKER_NAME into workerDefaults.workerName', () => {
    const { config } = hydrateConfig({ env: { CAMUNDA_WORKER_NAME: 'my-worker' } });
    expect(config.workerDefaults?.workerName).toBe('my-worker');
  });

  it('hydrates CAMUNDA_WORKER_STARTUP_JITTER_MAX_SECONDS into workerDefaults.startupJitterMaxSeconds', () => {
    const { config } = hydrateConfig({
      env: { CAMUNDA_WORKER_STARTUP_JITTER_MAX_SECONDS: '5' },
    });
    expect(config.workerDefaults?.startupJitterMaxSeconds).toBe(5);
  });

  it('returns undefined workerDefaults when no CAMUNDA_WORKER_* vars set', () => {
    const { config } = hydrateConfig({ env: {} });
    expect(config.workerDefaults).toBeUndefined();
  });

  it('hydrates multiple CAMUNDA_WORKER_* vars together', () => {
    const { config } = hydrateConfig({
      env: {
        CAMUNDA_WORKER_TIMEOUT: '60000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '16',
        CAMUNDA_WORKER_NAME: 'batch-worker',
      },
    });
    expect(config.workerDefaults).toEqual({
      jobTimeoutMs: 60000,
      maxParallelJobs: 16,
      pollTimeoutMs: undefined,
      workerName: 'batch-worker',
      startupJitterMaxSeconds: undefined,
    });
  });
});

describe('worker defaults: createJobWorker merge', () => {
  it('applies workerDefaults when per-worker config omits fields', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
      },
      fetch: noopFetch as any,
    });
    // Worker only specifies jobType and handler — defaults should fill in
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(JobWorker);
    // Verify worker was created (it would throw if maxParallelJobs/jobTimeoutMs were missing)
    worker.stop();
  });

  it('explicit per-worker config overrides workerDefaults', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
        CAMUNDA_WORKER_NAME: 'global-name',
      },
      fetch: noopFetch as any,
    });
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      maxParallelJobs: 16,
      jobTimeoutMs: 60000,
      workerName: 'explicit-name',
      autoStart: false,
    });
    // Explicit name overrides global
    expect(worker.name).toBe('explicit-name');
    worker.stop();
  });

  it('uses explicit config values in preference to environment defaults', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_NAME: 'env-name',
      },
      fetch: noopFetch as any,
    });
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      maxParallelJobs: 2,
      jobTimeoutMs: 5000,
      workerName: 'cfg-name',
      autoStart: false,
    });
    expect(worker.name).toBe('cfg-name');
    worker.stop();
  });
});

describe('worker defaults: validation', () => {
  it('throws when maxParallelJobs is not set anywhere', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
      },
      fetch: noopFetch as any,
    });
    expect(() =>
      client.createJobWorker({
        jobType: 'test-type',
        jobHandler: noopHandler,
        autoStart: false,
      })
    ).toThrow(/maxParallelJobs is required/);
  });

  it('throws when jobTimeoutMs is not set anywhere', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
      },
      fetch: noopFetch as any,
    });
    expect(() =>
      client.createJobWorker({
        jobType: 'test-type',
        jobHandler: noopHandler,
        autoStart: false,
      })
    ).toThrow(/jobTimeoutMs is required/);
  });

  it('succeeds when both required fields come from env defaults', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
      },
      fetch: noopFetch as any,
    });
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(JobWorker);
    worker.stop();
  });

  it('succeeds when both required fields set per-worker (no env defaults)', () => {
    const client = createCamundaClient({
      fetch: noopFetch as any,
    });
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      maxParallelJobs: 2,
      jobTimeoutMs: 10000,
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(JobWorker);
    worker.stop();
  });
});

describe('worker defaults: createThreadedJobWorker merge', () => {
  it('applies workerDefaults when threaded worker config omits maxParallelJobs and jobTimeoutMs', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
      },
      fetch: noopFetch as any,
    });
    const worker = client.createThreadedJobWorker({
      jobType: 'test-type',
      handlerModule: './fake-handler.js',
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(ThreadedJobWorker);
    worker.stop();
  });

  it('throws when maxParallelJobs is missing for threaded worker', () => {
    const client = createCamundaClient({
      config: { CAMUNDA_WORKER_TIMEOUT: '30000' },
      fetch: noopFetch as any,
    });
    expect(() =>
      client.createThreadedJobWorker({
        jobType: 'test-type',
        handlerModule: './fake-handler.js',
        autoStart: false,
      })
    ).toThrow(/maxParallelJobs is required/);
  });

  it('throws when jobTimeoutMs is missing for threaded worker', () => {
    const client = createCamundaClient({
      config: { CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4' },
      fetch: noopFetch as any,
    });
    expect(() =>
      client.createThreadedJobWorker({
        jobType: 'test-type',
        handlerModule: './fake-handler.js',
        autoStart: false,
      })
    ).toThrow(/jobTimeoutMs is required/);
  });

  it('explicit threaded worker config overrides workerDefaults', () => {
    const client = createCamundaClient({
      config: {
        CAMUNDA_WORKER_TIMEOUT: '30000',
        CAMUNDA_WORKER_MAX_CONCURRENT_JOBS: '4',
        CAMUNDA_WORKER_NAME: 'global-name',
      },
      fetch: noopFetch as any,
    });
    const worker = client.createThreadedJobWorker({
      jobType: 'test-type',
      handlerModule: './fake-handler.js',
      maxParallelJobs: 16,
      jobTimeoutMs: 60000,
      workerName: 'explicit-threaded-name',
      autoStart: false,
    });
    expect(worker.name).toBe('explicit-threaded-name');
    worker.stop();
  });
});
