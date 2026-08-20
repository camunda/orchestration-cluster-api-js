import { Effect, Exit } from 'effect';
import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';
import { createCamundaEffectClient } from '../src/effect';
import { evaluateSdkResponse } from '../src/runtime/responseEvaluation';

// Regression guard for camunda/orchestration-cluster-api-js#405.
//
// The class of behavioural change this locks down: an operation that used to
// REJECT on a transport/connection failure (DNS, ECONNREFUSED, unreachable
// host, TLS) starts RESOLVING (undefined / a Left of nothing) instead — i.e.
// the SDK silently swallows a failed request. This slipped in with the
// generated-client upgrade (>= v10.0.0-alpha.18) that moved `await fetch(...)`
// inside a try/catch and, with throwOnError:false, RETURNS `{ error }` on a
// transport error rather than throwing.
//
// These tests assert the *public contract* at the surface a user actually
// touches, independent of the internal path (client -> evaluateSdkResponse ->
// class method / fp wrapper). Any future refactor that reintroduces swallowing
// on any of these operations fails here.

// A failing transport: fetch itself rejects, exactly as a real connection error
// would. Assigned per-test so we can count invocations.
function failingFetch() {
  return vi.fn(async () => {
    throw new TypeError('fetch failed');
  });
}

const CONFIG = {
  CAMUNDA_REST_ADDRESS: 'https://example.invalid',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
  // Keep the (possible) retry loop tiny and fast so the test stays deterministic.
  CAMUNDA_SDK_HTTP_RETRY_MAX_ATTEMPTS: 1,
  CAMUNDA_SDK_HTTP_RETRY_BASE_DELAY_MS: 1,
  CAMUNDA_SDK_HTTP_RETRY_MAX_DELAY_MS: 5,
} as const;

// A representative spread of generated method shapes: a no-body GET, a
// POST-with-body, an enriched job op, and a search op. They all share the same
// transport, so if any one starts swallowing, the generator/runtime changed the
// contract for its whole class.
const OPERATIONS: Array<{ name: string; call: (c: any) => Promise<unknown> }> = [
  { name: 'getTopology (GET, no body)', call: (c) => c.getTopology() },
  {
    name: 'correlateMessage (POST body)',
    call: (c) => c.correlateMessage({ name: 'x', correlationKey: 'k' }),
  },
  {
    name: 'activateJobs (POST body, enriched)',
    call: (c) => c.activateJobs({ type: 'x', timeout: 1000, maxJobsToActivate: 1 }),
  },
  {
    name: 'searchProcessInstances (POST search)',
    call: (c) => c.searchProcessInstances({}, { consistency: { waitUpToMs: 0 } }),
  },
];

describe('transport-error rejection contract (#405)', () => {
  describe('unit: evaluateSdkResponse', () => {
    it('throws when there is an error but no HTTP status (transport failure)', () => {
      const raw = { error: new TypeError('fetch failed'), request: {}, response: undefined };
      expect(() => evaluateSdkResponse(raw, { opId: 'correlateMessage' })).toThrow(/fetch failed/);
    });

    it('wraps a non-Error transport error with a TransportSdkError carrying the operationId', () => {
      try {
        evaluateSdkResponse({ error: 'boom', response: undefined }, { opId: 'correlateMessage' });
        throw new Error('expected throw');
      } catch (e: any) {
        expect(e.name).toBe('TransportSdkError');
        expect(e.operationId).toBe('correlateMessage');
        expect(String(e.message)).toContain('boom');
      }
    });

    it('still unwraps a status-less success (no error, data present)', () => {
      expect(evaluateSdkResponse({ data: { ok: 1 } }, { opId: 'x' })).toEqual({ ok: 1 });
    });

    it('still returns raw for a status-less object with neither error nor data', () => {
      const raw = { processInstanceKey: '1' };
      expect(evaluateSdkResponse(raw, { opId: 'x' })).toBe(raw);
    });
  });

  describe('public surface: the class client rejects (never resolves) on a transport failure', () => {
    it.each(OPERATIONS)('$name', async ({ call }) => {
      const fetchMock = failingFetch();
      const client = createCamundaClient({ config: CONFIG as any, fetch: fetchMock as any });
      await expect(call(client)).rejects.toThrow(/fetch failed/);
      // Prove we actually reached the transport (i.e. the rejection is the
      // network error, not an early validation/config throw).
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  describe('public surface: the effect client yields a failure (never a success of nothing) on a transport failure', () => {
    it.each(OPERATIONS)('$name', async ({ call }) => {
      const fetchMock = failingFetch();
      const eff = createCamundaEffectClient({
        config: CONFIG as any,
        fetch: fetchMock as any,
      } as any);
      const exit = await Effect.runPromiseExit(call(eff) as any);
      expect(Exit.isFailure(exit)).toBe(true);
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
