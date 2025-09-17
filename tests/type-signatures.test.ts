import { describe, it, expect } from 'vitest';
import createCamundaClient from '../src';
import type { CancelablePromise } from '../src/facade/operations.gen';

const camunda = createCamundaClient({ config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' } });

type NotAny<T> = 0 extends (1 & T) ? false : true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ReturnNotAny = NotAny<ReturnType<typeof camunda.createProcessInstance>> extends true ? true : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ReturnCancelable = ReturnType<typeof camunda.createProcessInstance> extends CancelablePromise<any> ? true : never;

// Eventual op (e.g., searchProcessInstances) should NOT expose a union with Result<...> in throw mode
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _EventualNoUnion = ReturnType<typeof camunda.searchProcessInstances> extends CancelablePromise<infer X>
  ? (X extends { ok: any; value: any } ? never : true)
  : never;

describe('type-signatures', () => {
  it('runtime smoke', () => {
    expect(typeof camunda.createProcessInstance).toBe('function');
    expect(typeof camunda.createDeployment).toBe('function');
  });
});
