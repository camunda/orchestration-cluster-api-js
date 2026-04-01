import { describe, expect, it } from 'vitest';
import { SPEC_HASH } from '../src/index';

describe('SPEC_HASH', () => {
  it('is a non-empty string', () => {
    expect(SPEC_HASH).toBeTruthy();
    expect(typeof SPEC_HASH).toBe('string');
  });

  it('starts with sha256:', () => {
    expect(SPEC_HASH).toMatch(/^sha256:[0-9a-f]{64}$/);
  });
});
