import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import { type Clock, liveClock } from '../src/runtime/clock';
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
    // Yields a macrotask: a sleep that settles in the same tick spins any caller that
    // reschedules itself on resolution, which is the hazard Clock.sleep documents.
    sleep(ms: number) {
      current += ms;
      return new Promise<void>((resolve) => setTimeout(resolve, 0));
    },
    // A deadline is a liveness bound: it must still fire even when now/sleep are pinned,
    // or code guarded by one hangs instead of timing out.
    deadline: (ms) => liveClock.deadline(ms),
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
  it('is backed by the client clock, and narrowed to now/sleep', async () => {
    const clock = pinnedClock(1_000);
    const camunda = clientWith(clock);

    const job = enrichActivatedJob(raw, camunda as any, camunda.logger('test') as any);

    // Not the same object — it is narrowed — but the same underlying time.
    expect(job.clock.now()).toBe(camunda.clock.now());
    await camunda.clock.sleep(5_000);
    expect(job.clock.now()).toBe(6_000);
    expect(job.clock.now()).toBe(camunda.clock.now());

    // `deadline` is a liveness primitive and must not reach a handler, in JS or TS.
    expect(Object.keys(job.clock).sort()).toEqual(['now', 'sleep']);
    expect('deadline' in job.clock).toBe(false);
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

    expect(job.clock.now()).toBeGreaterThan(0);
    // Same source as the client's own clock, so both report the same instant.
    expect(Math.abs(job.clock.now() - camunda.clock.now())).toBeLessThan(100);
  });
});
