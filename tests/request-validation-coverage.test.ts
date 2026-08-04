import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

// Regression guard for the request-validation coverage half of #405.
//
// hey-api 0.86 emitted one `z<OpId>Data` envelope schema, and every generated
// CamundaClient method validated the whole envelope — path, query and body
// together. 0.96+ split that into `z<OpId>Body` / `z<OpId>Path` /
// `z<OpId>Query`, and the class generator initially validated the body only:
// path and query params stopped being validated for every operation, and
// operations with no body (74 of them) validated nothing at all.
//
// hooks/post/300-generate-class-methods.ts now validates each present envelope
// slot against its own schema. These tests assert the observable contract:
// under `req:strict` an invalid path or query param must be rejected *before*
// the request reaches the transport, and the parsed value must be written back
// so coercion and schema defaults still apply outside the body.

/** A fetch that would succeed — so any rejection is validation, not transport. */
function okFetch() {
  return vi.fn(
    async () => new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
  );
}

function strictClient(fetchMock: ReturnType<typeof okFetch>) {
  return createCamundaClient({
    config: { CAMUNDA_SDK_VALIDATION: 'req:strict', CAMUNDA_REST_ADDRESS: 'http://local' },
    fetch: fetchMock as any,
  });
}

/** Eventually-consistent endpoints take a mandatory consistency argument. */
const NO_WAIT = { consistency: { waitUpToMs: 0 } } as any;

describe('request validation covers path and query params, not just the body (#405)', () => {
  describe('path params', () => {
    // getProcessInstance: path-only op. zGetProcessInstancePath requires
    // processInstanceKey to match the Zeebe long-key shape (/^-?[0-9]+$/).
    it('rejects a malformed path param before reaching the transport', async () => {
      const fetchMock = okFetch();
      const client = strictClient(fetchMock);
      await expect(
        client.getProcessInstance({ processInstanceKey: 'not-a-key' as any }, NO_WAIT)
      ).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('accepts a well-formed path param', async () => {
      const fetchMock = okFetch();
      const client = strictClient(fetchMock);
      await client.getProcessInstance({ processInstanceKey: '2251799813685249' as any }, NO_WAIT);
      expect(fetchMock).toHaveBeenCalled();
    });

    // assignClientToGroup is one of the no-body ops that previously received an
    // `undefined` schema — i.e. no request validation whatsoever.
    it('validates a no-body operation whose only inputs are path params', async () => {
      const fetchMock = okFetch();
      const client = strictClient(fetchMock);
      // zClientId is /^[a-zA-Z0-9_~@.+-]+$/ — a space is invalid.
      await expect(
        client.assignClientToGroup({ groupId: 'g1', clientId: 'bad client!' as any })
      ).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('query params', () => {
    // getUsageMetrics: startTime / endTime are required ISO datetimes in
    // zGetUsageMetricsQuery.
    it('rejects a malformed query param before reaching the transport', async () => {
      const fetchMock = okFetch();
      const client = strictClient(fetchMock);
      await expect(
        client.getUsageMetrics({ startTime: 'yesterday' as any, endTime: 'today' as any }, NO_WAIT)
      ).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('accepts well-formed query params and applies schema defaults to the sent request', async () => {
      const fetchMock = okFetch();
      const client = strictClient(fetchMock);
      await client.getUsageMetrics(
        { startTime: '2026-01-01T00:00:00Z', endTime: '2026-02-01T00:00:00Z' } as any,
        NO_WAIT
      );
      expect(fetchMock).toHaveBeenCalled();
      // `withTenants` carries `.default(false)`. Its presence in the URL proves
      // the strict-mode parse result was written back to `envelope.query` — the
      // write-back that the body-only fallback dropped.
      const sent = fetchMock.mock.calls[0][0] as Request;
      expect(sent.url).toContain('withTenants=false');
    });
  });

  describe('validation stays opt-in', () => {
    it('req:none sends a malformed path param untouched', async () => {
      const fetchMock = okFetch();
      const client = createCamundaClient({
        config: { CAMUNDA_REST_ADDRESS: 'http://local' },
        fetch: fetchMock as any,
      });
      await client.getProcessInstance({ processInstanceKey: 'not-a-key' as any }, NO_WAIT);
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
