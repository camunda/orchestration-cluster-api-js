import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey, DecisionInstanceKey } from '../src';

describe('Key branding (structural)', () => {
  it('allows cross-assignment today (documenting gap)', () => {
    const pi = ProcessInstanceKey.assumeExists('123');
    const di = DecisionInstanceKey.assumeExists('456');
    // @ts-expect-error cross-assignment should be rejected
    const leak: ProcessInstanceKey = di;
    expect(leak).toBe('456');
    expect(pi).toBe('123');
  });
});
