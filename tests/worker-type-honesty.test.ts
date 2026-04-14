import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient, CamundaClient } from '../src';
import { JobWorker } from '../src/runtime/jobWorker';
import { ThreadedJobWorker } from '../src/runtime/threadedJobWorker';

/**
 * Type-honesty invariant
 * ═════════════════════
 * Every field marked `?` (optional) in a public config/options type must be
 * genuinely optional at runtime — either because a built-in default exists or
 * because the code tolerates `undefined`.
 *
 * These tests call every public config-accepting entry point with ONLY the
 * fields the compiler requires, and no environment variable overrides.
 * If the runtime throws for a missing field, the type is lying.
 *
 * When adding a new public API that accepts a config object:
 *   1. Add a test below that calls it with the minimum compile-required fields.
 *   2. If it throws, fix the production code (add a default), not the test.
 *
 * Fix by adding a built-in default — NOT by making the field required in the
 * type (that would break the env-var-only configuration path).
 */

const noopHandler = async () => 'JOB_ACTION_RECEIPT' as const;
const noopFetch = vi.fn(
  async () =>
    new Response(JSON.stringify({ jobs: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
);

describe('type honesty: optional fields must not throw when omitted', () => {
  it('createCamundaClient succeeds with no arguments', () => {
    // CamundaOptions is entirely optional — zero required fields.
    const client = createCamundaClient();
    expect(client).toBeInstanceOf(CamundaClient);
  });

  it('createJobWorker succeeds with only compile-required fields', () => {
    const client = createCamundaClient({ fetch: noopFetch as any });
    const worker = client.createJobWorker({
      jobType: 'test-type',
      jobHandler: noopHandler,
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(JobWorker);
    worker.stop();
  });

  it('createThreadedJobWorker succeeds with only compile-required fields', () => {
    const client = createCamundaClient({ fetch: noopFetch as any });
    const worker = client.createThreadedJobWorker({
      jobType: 'test-type',
      handlerModule: './fake-handler.js',
      autoStart: false,
    });
    expect(worker).toBeInstanceOf(ThreadedJobWorker);
    worker.stop();
  });
});
