import { describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';
import { createTestClock, liveClock } from '../src/runtime/clock';

const baseConfig = {
  CAMUNDA_REST_ADDRESS: 'https://example.com',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
} as const;

const okFetch = (async () =>
  new Response('{}', {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })) as any;

describe('clock injection point', () => {
  /**
   * Each client gets its own live clock rather than the shared `liveClock`. Slew state is
   * mutable and per-clock, so one client absorbing a backward correction would otherwise
   * shift every other client's deadlines.
   */
  it('defaults to a live clock that is not shared between clients', () => {
    const a = createCamundaClient({ config: { ...baseConfig } as any });
    const b = createCamundaClient({ config: { ...baseConfig } as any });

    expect(a.clock).not.toBe(b.clock);
    expect(a.clock).not.toBe(liveClock);
    expect(a.clock.now()).toBeGreaterThan(0);
  });

  it('exposes the injected clock', () => {
    const clock = createTestClock({ start: 1_000 });
    const camunda = createCamundaClient({ config: { ...baseConfig } as any, clock });

    expect(camunda.clock).toBe(clock);
  });

  /**
   * Asserting only that the client stores the clock would pass even with nothing wired to
   * it, so this drives a real request: backpressure reads `now()` when it records the
   * outcome. Deleting the `now`/`sleep` wiring on BackpressureManager makes this fail.
   */
  it('is the time source the request path reads, not the ambient clock', async () => {
    const clock = createTestClock({ start: 1_000 });
    const camunda = createCamundaClient({
      config: { ...baseConfig } as any,
      clock,
      fetch: okFetch,
    });

    expect(clock.nowCalls).toBe(0);

    await camunda.getTopology();

    expect(clock.nowCalls).toBeGreaterThan(0);
  });
});
