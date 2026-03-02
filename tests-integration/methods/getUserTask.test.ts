// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists.
import { describe, it } from 'vitest';

import { createCamundaClient, UserTaskKey } from '../../dist';

describe('getUserTask', () => {
  // Type testing only atm
  it.skip('scaffold', async () => {
    const camunda = createCamundaClient();
    const userTask = await camunda.getUserTask(
      { userTaskKey: UserTaskKey.assumeExists('12343214324') },
      {
        consistency: { waitUpToMs: 0 },
      }
    );
    userTask.completionDate; // optional
  });
});
