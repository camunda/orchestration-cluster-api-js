// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('searchCorrelatedMessageSubscriptions', () => {
  it('scaffold', async () => {
    const _camunda = createCamundaClient();
    const res = await _camunda.searchCorrelatedMessageSubscriptions(
      {
        filter: {},
      },
      { consistency: { waitUpToMs: 0 } }
    );
  });
});
