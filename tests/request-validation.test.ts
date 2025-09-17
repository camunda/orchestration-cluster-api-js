import { describe, it, expect, vi } from 'vitest';
import createCamundaClient from '../src';
import { z } from 'zod';

// We rely on generated schema for ProcessInstanceCreationInstruction.

describe('request-side validation', () => {
  it('throws in req:strict mode on invalid body', async () => {
    process.env.CAMUNDA_REST_ADDRESS = 'http://local';
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:strict', CAMUNDA_REST_ADDRESS: 'http://local' } });
    const schema = z.object({ expected: z.string() });
  await expect((client as any)._validation.gateRequest('createProcessInstance', schema, { expected: 123 } as any)).rejects.toBeTruthy();
  });
  it('warns and proceeds in req:warn mode', async () => {
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:warn', CAMUNDA_REST_ADDRESS: 'http://local' } });
    const schema = z.object({ expected: z.string() });
  const res = await (client as any)._validation.gateRequest('createProcessInstance', schema, { expected: 123 } as any);
    expect(res).toEqual({ expected: 123 });
  });
  it('skips in req:none mode', async () => {
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:none', CAMUNDA_REST_ADDRESS: 'http://local' } });
    const schema = z.object({ expected: z.string() });
  const res = await (client as any)._validation.gateRequest('createProcessInstance', schema, { expected: 123 } as any);
    expect(res).toEqual({ expected: 123 });
  });
});
