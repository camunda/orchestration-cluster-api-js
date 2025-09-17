import { describe, it, expect } from 'vitest';

import { createCamundaClient, ProcessInstanceKey } from '../src';

function makeClient(capture: { url?: string; request?: Request; bodyText?: string }) {
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let req: Request;
    if (input instanceof Request) {
      req = input;
    } else {
      req = new Request(input, init);
    }
    capture.url = req.url;
    capture.request = req;
    try {
      capture.bodyText = await req.clone().text();
    } catch {
      /* ignore */
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return createCamundaClient({
    config: { CAMUNDA_SDK_VALIDATION: 'none', CAMUNDA_REST_ADDRESS: 'http://localhost:8080' },
    fetch,
  });
}

describe('semantic key request unwrapping', () => {
  it('unwrapped in path params (getProcessInstance)', async () => {
    const capture: any = {};
    const client = makeClient(capture);
    const key = ProcessInstanceKey.assumeExists('12345');
    await client.getProcessInstance(
      { processInstanceKey: key },
      { consistency: { waitUpToMs: 0 } }
    );
    expect(capture.url).toContain('/process-instances/12345');
  });

  it('unwrapped in request body (searchProcessInstances)', async () => {
    const capture: any = {};
    const client = makeClient(capture);
    const key = ProcessInstanceKey.assumeExists('67890');
    await client.searchProcessInstances(
      { filter: { processInstanceKey: key } } as any,
      { consistency: { waitUpToMs: 0 } } as any
    );
    expect(capture.bodyText).toMatch(/"processInstanceKey":"67890"/);
  });

  it('unwrapped in JSON body (cancelProcessInstance)', async () => {
    const capture: any = {};
    const client = makeClient(capture);
    const key = ProcessInstanceKey.assumeExists('24680');
    await client.cancelProcessInstance({ body: { processInstanceKey: key } } as any);
    expect(capture.bodyText).toContain('"processInstanceKey":"24680"');
  });
});
