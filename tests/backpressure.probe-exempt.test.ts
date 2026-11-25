import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient, ProbeId } from '../src';

/**
 * `createProbe` holds its permit until a worker answers it. With a single backpressure permit,
 * the operations that deliver the answer must not queue behind it, or the probe can never
 * complete; and an in-flight activation must not hold the permit `createProbe` needs.
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

const urlOf = (input: unknown): string =>
  typeof input === 'string' ? input : ((input as Request).url ?? String(input));

function setup(held: 'create' | 'activation') {
  const gate = deferred<Response>();
  const fetch = vi.fn(async (input: unknown) => {
    const url = urlOf(input);
    if (url.endsWith('/probes'))
      return held === 'create' ? gate.promise : json({ outcome: 'UNSUPPORTED', worker: 'w' });
    if (url.endsWith('/probes/activation'))
      return held === 'activation' ? gate.promise : json({ probes: [] });
    return new Response(null, { status: 204 });
  });
  const client: any = createCamundaClient({
    config: {
      CAMUNDA_REST_ADDRESS: 'https://example.com',
      CAMUNDA_AUTH_STRATEGY: 'NONE',
      CAMUNDA_SDK_BACKPRESSURE_INITIAL_MAX: 1,
    } as any,
    fetch: fetch as any,
  });
  return { client, fetch, gate };
}

const probeId = ProbeId.assumeExists('validate-configuration/io.camunda:aws-credential:1');
const activation = { probeIds: [probeId], worker: 'w', requestTimeout: -1 };

describe('probe operations under a single backpressure permit', () => {
  it('lets activation and answering run while createProbe waits for its answer', async () => {
    const { client, fetch, gate } = setup('create');

    const created = client.createProbe({ probeId, input: '={}', requestTimeout: 1000 });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await client.activateProbes(activation);
    await client.answerProbe({ probeKey: '2251799813685249', outcome: 'OK', data: {} });

    gate.resolve(json({ outcome: 'UNSUPPORTED', worker: 'w' }));
    await created;
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('lets createProbe run while an activation long poll is in flight', async () => {
    const { client, fetch, gate } = setup('activation');

    const activating = client.activateProbes(activation);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await client.createProbe({ probeId, input: '={}', requestTimeout: 1000 });

    gate.resolve(json({ probes: [] }));
    await activating;
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
