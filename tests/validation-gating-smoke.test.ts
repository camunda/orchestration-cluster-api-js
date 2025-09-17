import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { createCamundaClient } from '../src';

const schema = z.object({ foo: z.string() });

describe('validation gating (smoke)', () => {
  it('none mode skips validation (returns original invalid data)', async () => {
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'none' } });
    const v = await (client as any)._validation.gateRequest('dummyOp', schema, { foo: 123 } as any);
    expect(v).toEqual({ foo: 123 });
  });
  it('warn mode returns original invalid data', async () => {
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:warn' } });
    const v = await (client as any)._validation.gateRequest('dummyOp', schema, { foo: 123 } as any);
    expect(v).toEqual({ foo: 123 });
  });
  it('strict mode throws', async () => {
    const client = createCamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:strict' } });
    await expect(
      (client as any)._validation.gateRequest('dummyOp', schema, { foo: 123 } as any)
    ).rejects.toThrow();
  });
});
