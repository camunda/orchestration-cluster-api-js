// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

describe('searchCorrelatedMessageSubscriptions', () => {
  it('can search for correlated message subscriptions', async () => {
    const _camunda = createCamundaClient();
    const res = await _camunda.searchCorrelatedMessageSubscriptions(
      {
        filter: {},
      },
      { consistency: { waitUpToMs: 0 } }
    );
    validateResponseShape(
      { path: '/correlated-message-subscriptions/search', status: '200', method: 'POST' },
      res
    );
  });
});
