import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient, ProcessDefinitionKey } from '../src';

describe('silly level HTTP body logging', () => {
  it('emits warning and body preview at silly level', async () => {
    const events: any[] = [];
    const fetchMock = vi.fn(async (req: Request) => {
      // Respond to createProcessInstance POST
      expect(req.url).toContain('/process-instances');
      return new Response(
        JSON.stringify({
          processInstanceKey: '999',
          processDefinitionKey: '123',
          bpmnProcessId: 'demo',
          version: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://mock.local', CAMUNDA_SDK_LOG_LEVEL: 'silly' } as any,
      fetch: fetchMock as any,
      log: { level: 'silly', transport: (e: any) => events.push(e) },
    });
    await client.createProcessInstance({ processDefinitionKey: ProcessDefinitionKey.assumeExists('123') });

    const warning = events.find(
      (e) => e.level === 'warn' && e.args[0] === 'log.level.silly.enabled'
    );
    expect(warning).toBeTruthy();
    const bodyEvt = events.find(
      (e) =>
        e.level === 'silly' &&
        e.scope === 'telemetry' &&
        typeof e.args[0] === 'string' &&
        /http.body/.test(e.args[0])
    );
    expect(bodyEvt).toBeTruthy();
    expect(bodyEvt.args[0]).toContain('preview={"processDefinitionKey":"123"');
  });

  it('does not emit body preview at trace level', async () => {
    const events: any[] = [];
    const fetchMock = vi.fn(async (req: Request) => {
      expect(req.url).toContain('/process-instances');
      return new Response(
        JSON.stringify({
          processInstanceKey: '1000',
          processDefinitionKey: '123',
          bpmnProcessId: 'demo',
          version: 1,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });
    const client = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: 'https://mock.local', CAMUNDA_SDK_LOG_LEVEL: 'trace' } as any,
      fetch: fetchMock as any,
      log: { level: 'trace', transport: (e: any) => events.push(e) },
    });
    await client.createProcessInstance({ processDefinitionKey: ProcessDefinitionKey.assumeExists('123') });

    const bodyEvt = events.find(
      (e) =>
        e.level === 'silly' &&
        e.scope === 'telemetry' &&
        typeof e.args[0] === 'string' &&
        /http.body/.test(e.args[0])
    );
    expect(bodyEvt).toBeFalsy();
    // Ensure we still got trace start/end entries
    const startEvt = events.find(
      (e) => e.level === 'trace' && e.scope === 'telemetry' && /http.start/.test(e.args[0])
    );
    const endEvt = events.find(
      (e) => e.level === 'trace' && e.scope === 'telemetry' && /http.end/.test(e.args[0])
    );
    expect(startEvt).toBeTruthy();
    expect(endEvt).toBeTruthy();
  });
});
