// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';

describe('createAuthorization', () => {
  it('scaffold', async () => {
    const _camunda = createCamundaClient();
    // TODO: implement createAuthorization test logic
    const res = await _camunda.createAuthorization({
      ownerId: 'steve',
      permissionTypes: ['READ'],
      resourceType: 'DECISION_REQUIREMENTS_DEFINITION',
      resourceId: '*',
      ownerType: 'USER',
    });
    console.log('res', res)
  });
});
