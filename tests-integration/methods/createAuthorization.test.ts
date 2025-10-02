// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { isSdkError } from '../../src/runtime/errors';

describe('createAuthorization', () => {
  it('scaffold', async () => {
    const _camunda = createCamundaClient();
    const res = await _camunda
      .createAuthorization({
        ownerId: 'steve',
        permissionTypes: ['READ'],
        resourceType: 'DECISION_REQUIREMENTS_DEFINITION',
        resourceId: '*',
        ownerType: 'USER',
      })
      .catch((e) => {
        if (isSdkError(e)) {
          switch (e.name) {
            case 'HttpSdkError':
              // console.error('HTTP failure', e.status, e.operationId);
              if (e.status === 409) {
                // test is not idempotent, so we don't fail on duplicate conflict
                return;
              }
              break;
            case 'ValidationSdkError':
              console.error('Validation issue on', e.operationId, e.side, e.issues);
              break;
            case 'AuthSdkError':
              console.error('Auth problem', e.message, e.status);
              break;
            case 'NetworkSdkError':
              console.error('Network layer error', e.message);
              break;
          }
        }
        // Non-SDK (programmer) error; rethrow or wrap
        throw e;
      });
  });
});
