import { describe, it, expect } from 'vitest';
import createCamundaClient from '../src';

function set(val?: string) {
  if (val === undefined) delete process.env.CAMUNDA_SDK_VALIDATION; else process.env.CAMUNDA_SDK_VALIDATION = val;
  // Bust module cache side effects not needed because config caches by env string; direct calls reflect change.
}

describe('CAMUNDA_SDK_VALIDATION parsing', () => {
  it('defaults to none/none when unset', () => {
    set(undefined);
  const client = createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: undefined}});
  expect(client.getConfig().validation.req).toBe('none');
  expect(client.getConfig().validation.res).toBe('none');
  });
  it('strict', () => {
  const client = createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: 'strict'}});
  expect(client.getConfig().validation).toMatchObject({ req: 'strict', res: 'strict' });
  });
  it('req only', () => {
  const client = createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: 'req:warn'}});
  expect(client.getConfig().validation).toMatchObject({ req: 'warn', res: 'none' });
  });
  it('res only', () => {
  const client = createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: 'res:strict'}});
  expect(client.getConfig().validation).toMatchObject({ req: 'none', res: 'strict' });
  });
  it('both sides pair list', () => {
  const client = createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: 'req:warn,res:strict'}});
  expect(client.getConfig().validation).toMatchObject({ req: 'warn', res: 'strict' });
  });
  it('invalid tokens cause error', () => {
  // Construction should throw because hydration would error
  expect(() => createCamundaClient({config: {CAMUNDA_SDK_VALIDATION: 'foo:bar,res:warn'}})).toThrow();
  });
});
