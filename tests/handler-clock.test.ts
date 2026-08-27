import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import type { Clock } from '../src/runtime/clock';
import { enrichActivatedJob } from '../src/runtime/jobActions';

/**
 * `job.clock` must be the same clock the client resolves time through, so pinning the
 * client's clock in a test also drives whatever the handler does with time.
 *
 * Asserted against `enrichActivatedJob` rather than by running a worker. A worker driven by
 * a clock whose `sleep` resolves immediately spins its poll loop as fast as the microtask
 * queue allows and exhausts the heap — that is a property of the test clock, not of this
 * surface, and it would make the assertion here impossible to reach.
 */

const raw = {
  jobKey: '1',
  type: 'test-type',
  processInstanceKey: '1',
  processDefinitionId: 'p',
  processDefinitionVersion: 1,
  processDefinitionKey: '1',
  elementId: 'e',
  elementInstanceKey: '1',
  customHeaders: {},
  worker: 'w',
  retries: 3,
  deadline: new Date().toISOString(),
  variables: {},
  tenantId: '<default>',
} as any;

function pinnedClock(startMs: number) {
  let current = startMs;
  const clock: Clock = {
    now: () => current,
    async sleep(ms: number) {
      current += ms;
    },
    deadline: () => ({ signal: new AbortController().signal, dispose: () => {} }),
  };
  return clock;
}

const clientWith = (clock?: Clock) =>
  createCamundaClient({
    config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
    env: {},
    ...(clock ? { clock } : {}),
  });

describe('job.clock', () => {
  it('is the client clock instance, not a separate one', () => {
    const clock = pinnedClock(1_000);
    const camunda = clientWith(clock);

    const job = enrichActivatedJob(raw, camunda as any, camunda.logger('test') as any);

    expect(job.clock).toBe(camunda.clock);
  });

  it('lets a handler read and wait on pinned time', async () => {
    const clock = pinnedClock(1_000);
    const camunda = clientWith(clock);
    const job = enrichActivatedJob(raw, camunda as any, camunda.logger('test') as any);

    expect(job.clock.now()).toBe(1_000);
    await job.clock.sleep(60_000);

    // Virtual: the wait consumed no real time, so this assertion is reached immediately.
    expect(job.clock.now()).toBe(61_000);
  });

  it('defaults to the client live clock when none is injected', () => {
    const camunda = clientWith();
    const job = enrichActivatedJob(raw, camunda as any, camunda.logger('test') as any);

    expect(job.clock).toBe(camunda.clock);
    expect(job.clock.now()).toBeGreaterThan(0);
  });
});
