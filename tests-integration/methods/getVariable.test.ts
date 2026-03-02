// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient, VariableKey } from '../../dist';

describe('getVariable', () => {
  // Created as example to examine ScopeKey
  it.skip('scaffold', async () => {
    const _camunda = createCamundaClient();
    const res = await _camunda.getVariable(
      {
        variableKey: VariableKey.assumeExists('123121234'),
      },
      { consistency: { waitUpToMs: 0 } }
    );

    const scopeKey = res.scopeKey; // This could be an ElementInstanceKey or a ProcessInstanceKey
    if (scopeKey === res.processInstanceKey) {
      // scopeKey is ProcessInstanceKey
    } else {
      // scopeKey is ElementInstanceKey
    }
  });
});
