import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';

/**
 * Unit tests for ThreadedJobWorker.
 *
 * These tests use a mock fetch to intercept activateJobs and other API calls,
 * avoiding any real server dependency. The thread pool is kept small (1 thread)
 * for determinism.
 *
 * Note: Tests spawn worker threads that load the compiled dist/threadWorkerEntry.js,
 * so a build must have been run at least once before these tests can pass.
 */

const describeIf = describe;

function mockFetch(handlers: Record<string, (req: Request) => Promise<Response>>) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method || 'GET';
    for (const [pattern, handler] of Object.entries(handlers)) {
      if (url.includes(pattern)) return handler(new Request(url, init));
    }
    return new Response(JSON.stringify({ error: `No mock for ${method} ${url}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}

function createMockJob(overrides: Record<string, unknown> = {}) {
  return {
    jobKey: 'test-job-1',
    type: 'test-task',
    processInstanceKey: 'pi-1',
    processDefinitionKey: 'pd-1',
    bpmnProcessId: 'test-process',
    processDefinitionVersion: 1,
    elementId: 'task-1',
    elementInstanceKey: 'ei-1',
    retries: 3,
    deadline: new Date(Date.now() + 30000).toISOString(),
    variables: { orderId: '123', amount: 42 },
    customHeaders: {},
    worker: 'test-worker',
    tenantId: '<default>',
    ...overrides,
  };
}

describeIf('ThreadedJobWorker', () => {
  let worker: ThreadedJobWorker | null = null;

  afterEach(async () => {
    if (worker && !worker.stopped) {
      await worker.stopGracefully({ waitUpToMs: 2000 });
    }
    worker = null;
  });

  it('creates a threaded worker via createThreadedJobWorker', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({}) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: false,
      threadPoolSize: 1,
    });

    expect(worker).toBeInstanceOf(ThreadedJobWorker);
    expect(worker.name).toMatch(/^threaded-worker-test-task-/);
    await worker.ready;
    expect(worker.poolSize).toBe(1);
    expect(worker.stopped).toBe(false);
    expect(worker.activeJobs).toBe(0);
  });

  it('is returned by getWorkers()', () => {
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({}) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: false,
      threadPoolSize: 1,
    });

    const workers = client.getWorkers();
    expect(workers).toHaveLength(1);
    expect(workers[0]).toBe(worker);
  });

  it('stopAllWorkers() stops threaded workers', () => {
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({}) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: false,
      threadPoolSize: 1,
    });

    client.stopAllWorkers();
    expect(worker.stopped).toBe(true);
  });

  it('activates jobs, dispatches to thread, and completes via proxy', async () => {
    let activateCallCount = 0;
    let completeCallCount = 0;
    const completedJobKeys: string[] = [];

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: (async (input: RequestInfo | URL, _init?: RequestInit) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes('/v2/jobs/activation')) {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url.includes('/v2/jobs/test-job-1/completion')) {
          completeCallCount++;
          completedJobKeys.push('test-job-1');
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ error: `No mock for ${url}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    // Wait for the job to be processed
    await waitFor(() => completeCallCount >= 1, 10000);

    expect(activateCallCount).toBeGreaterThanOrEqual(1);
    expect(completeCallCount).toBe(1);
    expect(completedJobKeys).toContain('test-job-1');
  });

  it('handler can call client methods (publishMessage) via proxy', async () => {
    let activateCallCount = 0;
    let publishMessageCalled = false;
    let completeCount = 0;

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({
        '/v2/jobs/activation': async () => {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
        '/v2/messages/publication': async () => {
          publishMessageCalled = true;
          return new Response(JSON.stringify({ messageKey: 'msg-1' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
        '/v2/jobs/test-job-1/completion': async () => {
          completeCount++;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-with-client.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    await waitFor(() => completeCount >= 1, 10000);

    expect(publishMessageCalled).toBe(true);
    expect(completeCount).toBe(1);
  });

  it('handler that fails a job sends failure via proxy', async () => {
    let activateCallCount = 0;
    let failCount = 0;

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({
        '/v2/jobs/activation': async () => {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
        '/v2/jobs/test-job-1/failure': async () => {
          failCount++;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-fail.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    await waitFor(() => failCount >= 1, 10000);

    expect(failCount).toBe(1);
  });

  it('graceful stop waits for active jobs', async () => {
    let activateCallCount = 0;
    let completeCount = 0;

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({
        '/v2/jobs/activation': async () => {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
        '/v2/jobs/test-job-1/completion': async () => {
          completeCount++;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    // Wait for job to be dispatched
    await waitFor(() => completeCount >= 1, 10000);

    const result = await worker.stopGracefully({ waitUpToMs: 3000 });
    expect(result.timedOut).toBe(false);
    expect(result.remainingJobs).toBe(0);
    expect(worker.stopped).toBe(true);
  });

  it('forwards result payload to completion request body', async () => {
    let activateCallCount = 0;
    let completionBody: unknown;
    let completeCount = 0;

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes('/v2/jobs/activation')) {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url.includes('/v2/jobs/test-job-1/completion')) {
          const rawBody = init?.body
            ? (init.body as string)
            : input instanceof Request
              ? await input.text()
              : '{}';
          completionBody = JSON.parse(rawBody || '{}');
          completeCount++;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ error: `No mock for ${url}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete-with-result.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    await waitFor(() => completeCount >= 1, 10000);

    expect(completeCount).toBe(1);
    expect(completionBody).toMatchObject({
      variables: { processed: true },
      result: {
        type: 'userTask',
        corrections: { assignee: 'corrected-user', priority: 80 },
      },
    });
  });

  it('omits result from completion request when handler does not pass one', async () => {
    let activateCallCount = 0;
    let completionBody: unknown;
    let completeCount = 0;

    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes('/v2/jobs/activation')) {
          activateCallCount++;
          if (activateCallCount === 1) {
            return new Response(JSON.stringify({ jobs: [createMockJob()] }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url.includes('/v2/jobs/test-job-1/completion')) {
          const rawBody = init?.body
            ? (init.body as string)
            : input instanceof Request
              ? await input.text()
              : '{}';
          completionBody = JSON.parse(rawBody || '{}');
          completeCount++;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ error: `No mock for ${url}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 1,
      jobTimeoutMs: 30000,
      autoStart: true,
      threadPoolSize: 1,
    });

    await waitFor(() => completeCount >= 1, 10000);

    expect(completeCount).toBe(1);
    expect(completionBody).not.toHaveProperty('result');
  });

  it('exposes pool stats', async () => {
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
      fetch: mockFetch({}) as any,
    });

    worker = client.createThreadedJobWorker({
      jobType: 'test-task',
      handlerModule: path.join(__dirname, 'fixtures/threaded-handler-complete.ts'),
      maxParallelJobs: 4,
      jobTimeoutMs: 30000,
      autoStart: false,
      threadPoolSize: 2,
    });

    await worker.ready;
    expect(worker.poolSize).toBe(2);
    expect(worker.busyThreads).toBe(0);
    expect(worker.activeJobs).toBe(0);
  });
});

// Utility: wait for a condition or timeout
async function waitFor(condition: () => boolean, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (!condition() && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 50));
  }
  if (!condition()) {
    throw new Error(`waitFor timed out after ${timeoutMs}ms`);
  }
}
