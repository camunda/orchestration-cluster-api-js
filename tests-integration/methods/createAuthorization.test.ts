import { describe, it } from 'vitest';

import { createCamundaClient } from '../../dist';
import { validateResponseShape } from '../../json-body-assertions';
import { isSdkError } from '../../src/runtime/errors';

describe('createAuthorization', () => {
  it('throws 409 if the authorisation exists', async () => {
    const _camunda = createCamundaClient();

    try {
      await _camunda.createUser(
        {
          username: 'steve',
          password: 'password123',
        },
        { consistency: { waitUpToMs: 0 } }
      );
      const res = await _camunda.createAuthorization({
        ownerId: 'steve',
        permissionTypes: ['READ'],
        resourceType: 'DECISION_REQUIREMENTS_DEFINITION',
        resourceId: '*',
        ownerType: 'USER',
      });
      // If we are running the test in a stateless environment, the first call will succeed and we can test
      // the response shape.
      validateResponseShape(
        {
          path: '/authorizations',
          method: 'POST',
          status: '201',
        },
        res
      );
      // A second call will definitely throw with a duplicate.
      await _camunda.createAuthorization({
        ownerId: 'steve',
        permissionTypes: ['READ'],
        resourceType: 'DECISION_REQUIREMENTS_DEFINITION',
        resourceId: '*',
        ownerType: 'USER',
      });
      throw new Error('Did not receive an exception');
    } catch (e) {
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
      console.error(e);
      // Non-SDK (programmer) error; rethrow or wrap
      throw e;
    }
  });
});
