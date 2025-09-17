import { describe, it, expectTypeOf } from 'vitest';
import { createCamundaClientLoose } from '../src';

// This is a compile-time only test validating that a plain string is accepted
// where a branded CamundaKey<...> would normally be required in the strict client.
// We don't execute network calls; we only assert type relationships.

describe('createCamundaClientLoose type widening', () => {
  // Use only required config values; baseUrl is set via environment or defaults inside underlying client.
  const client = createCamundaClientLoose({});

  // Test skipped deliberately. This is a type test only, no execution.
  it.skip('accepts plain string for a method that expects a key parameter', () => {
    const processInstanceKey: string = '123';
    // If widening failed this would require a branded ProcessInstanceKey and fail type-check.
    // @ts-expect-no-error
    client.getProcessInstance({ processInstanceKey }, { consistency: { waitUpToMs: 0 }});

    // Return type still a promise; ensure it is Promise-like.
    type PIResultPromise = ReturnType<typeof client.getProcessInstance>;
    expectTypeOf<PIResultPromise>().toMatchTypeOf<Promise<any>>();
  });
});
