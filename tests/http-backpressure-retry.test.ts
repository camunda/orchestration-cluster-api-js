import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';
import { isSdkError } from '../src/runtime/errors';

// Helper to build a fetch returning specified sequence of responses then success
function buildFetchSequence(responses: Array<Response | (() => Promise<Response>)>) {
  let i = 0;
  return vi.fn(async () => {
    const r = responses[Math.min(i, responses.length - 1)];
    i++;
    return typeof r === 'function' ? await (r as any)() : r;
  });
}

describe('HTTP backpressure retry classification', () => {
  it('retries on 429 regardless of body', async () => {
    const fetch = buildFetchSequence([
      new Response(JSON.stringify({ title: 'SomethingElse' }), {
        status: 429,
        headers: { 'content-type': 'application/problem+json' },
      }),
      new Response(JSON.stringify({ brokers: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ]);
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetch as any,
    });
    const topology = await (client as any).getTopology();
    expect(topology).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('retries on 503 with RESOURCE_EXHAUSTED title', async () => {
    const fetch = buildFetchSequence([
      new Response(JSON.stringify({ title: 'RESOURCE_EXHAUSTED' }), {
        status: 503,
        headers: { 'content-type': 'application/problem+json' },
      }),
      new Response(JSON.stringify({ brokers: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ]);
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetch as any,
    });
    await (client as any).getTopology();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry on 503 without RESOURCE_EXHAUSTED title', async () => {
    const fetch = buildFetchSequence([
      new Response(JSON.stringify({ title: 'OTHER' }), {
        status: 503,
        headers: { 'content-type': 'application/problem+json' },
      }),
    ]);
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetch as any,
    });
    let threw = false;
    try {
      await (client as any).getTopology();
    } catch (e) {
      threw = true;
      expect(isSdkError(e)).toBe(true);
    }
    expect(threw).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on 500 with RESOURCE_EXHAUSTED in detail', async () => {
    const fetch = buildFetchSequence([
      new Response(JSON.stringify({ detail: 'Some RESOURCE_EXHAUSTED condition' }), {
        status: 500,
        headers: { 'content-type': 'application/problem+json' },
      }),
      new Response(JSON.stringify({ brokers: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ]);
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetch as any,
    });
    await (client as any).getTopology();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry on plain 500 without RESOURCE_EXHAUSTED detail', async () => {
    const fetch = buildFetchSequence([new Response('oops', { status: 500 })]);
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://example.com', CAMUNDA_AUTH_STRATEGY: 'NONE' } as any,
      fetch: fetch as any,
    });
    await expect((client as any).getTopology()).rejects.toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
