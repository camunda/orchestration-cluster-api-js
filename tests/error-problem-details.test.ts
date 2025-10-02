import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';
import { isSdkError } from '../src/runtime/errors';

/**
 * Verifies that RFC 9457 / 7807 problem details fields are surfaced on HttpSdkError.
 */

describe('Problem Details passthrough', () => {
  it('surfaces type/title/status/detail/instance fields', async () => {
    const problem = {
      type: 'https://camunda.example/errors/some-problem',
      title: 'Some problem occurred',
      status: 503,
      detail: 'The broker cluster is temporarily unavailable.',
      instance: '/operations/abc-123',
      extra: 'should be ignored by type narrowing but preserved in cause (not relied upon)',
    };
    const body = JSON.stringify(problem);
    const headers = new Headers({ 'content-type': 'application/problem+json' });
    const fetchMock = vi.fn(async () => new Response(body, { status: 503, headers }));
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetchMock as any,
    });
    try {
      await (client as any).getTopology();
      throw new Error('Expected error');
    } catch (e) {
      expect(isSdkError(e)).toBe(true);
      if (isSdkError(e) && e.name === 'HttpSdkError') {
        expect(e.status).toBe(problem.status);
        expect((e as any).type).toBe(problem.type);
        expect((e as any).title).toBe(problem.title);
        expect((e as any).detail).toBe(problem.detail);
        expect((e as any).instance).toBe(problem.instance);
        // message should prefer title/detail
        expect(e.message).toContain('Some problem');
      }
    }
  });
});
