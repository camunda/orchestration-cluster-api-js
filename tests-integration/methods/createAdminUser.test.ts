// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('createAdminUser', () => {
  it('scaffold', async () => {
    const _camunda = createCamundaClient();
    // TODO: implement createAdminUser test logic
    const res = await _camunda.createAdminUser(
      { password: 'h', username: 'n' },
      {
        consistency: { waitUpToMs: 0 },
      }
    );

    console.log(res);
  });
});
