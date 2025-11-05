import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';

describe('getTopology', () => {
  it('can get the cluster topology', async () => {
    const _camunda = createCamundaClient();
    const topology = await _camunda.getTopology();
    validateResponseShape({ path: '/topology', method: 'GET', status: '200' }, topology);
  });
});
