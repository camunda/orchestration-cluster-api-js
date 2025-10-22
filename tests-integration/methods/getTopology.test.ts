// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('getTopology', () => {
  it('scaffold', async () => {
    const _camunda = createCamundaClient();
    const topology = await _camunda.getTopology();
    console.log(JSON.stringify(topology, null, 2));
  });
});
