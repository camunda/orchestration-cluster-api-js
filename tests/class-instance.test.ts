import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

describe('Camunda class instances', () => {
  it('isolates baseUrl and fetch per instance', async () => {
    const f1 = vi.fn(
      async (req: Request) =>
        new Response(JSON.stringify({ id: 'c1', url: req.url }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );
    const f2 = vi.fn(
      async (req: Request) =>
        new Response(JSON.stringify({ id: 'c2', url: req.url }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    );

    const c1 = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://cluster-one:8080' },
      fetch: f1 as any,
    });
    const c2 = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'http://cluster-two:8080' },
      fetch: f2 as any,
    });

    const r1 = await (c1 as any).getLicense();
    const r2 = await (c2 as any).getLicense();

    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(1);
    expect(r1).toMatchObject({ id: 'c1', url: 'http://cluster-one:8080/license' });
    expect(r2).toMatchObject({ id: 'c2', url: 'http://cluster-two:8080/license' });
  });
});
