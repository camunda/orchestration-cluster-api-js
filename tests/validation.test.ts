import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ValidationManager } from '../src/runtime/validationManager';

// Pure validation behavior test without relying on process.env side channel.

describe('validation modes (instance-scoped)', () => {
  const schema = z.object({ n: z.number() });
  const invalid = { n: 'x' } as any;

  it('strict throws and does not coerce', async () => {
    const vm = new ValidationManager({ req: 'strict', res: 'strict', });
    await expect(vm.gateRequest('op', schema, invalid)).rejects.toThrow();
  });

  it('warn returns original value', async () => {
    const vm = new ValidationManager({ req: 'warn', res: 'warn',  });
    const out = await vm.gateRequest('op', schema, invalid);
    expect(out).toBe(invalid); // not parsed
  });

  it('none bypasses validation', async () => {
    const vm = new ValidationManager({ req: 'none', res: 'none', });
    const out = await vm.gateRequest('op', schema, invalid);
    expect(out).toBe(invalid);
  });
});
