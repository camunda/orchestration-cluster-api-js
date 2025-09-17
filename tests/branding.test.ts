import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey, ProcessDefinitionKey } from '../src';

// compile-time only test helpers (no runtime execution for type errors)
describe('branding nominal incompatibility', () => {
  it('namespace create produces nominal objects not inter-assignable (compile-time)', () => {
    const raw = '123456';
    const pik: ProcessInstanceKey = ProcessInstanceKey.assumeExists(raw);
    const pdk: ProcessDefinitionKey = ProcessDefinitionKey.assumeExists(raw);
    expect(ProcessInstanceKey.getValue(pik)).toBe(raw);
    expect(ProcessDefinitionKey.getValue(pdk)).toBe(raw);
    // @ts-expect-error deliberate mismatch: assigning ProcessDefinitionKey to ProcessInstanceKey variable
    const shouldError: ProcessInstanceKey = pdk;
    void shouldError;
  });
});
