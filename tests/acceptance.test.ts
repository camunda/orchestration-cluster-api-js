import { describe, it } from 'vitest';

import {createCamundaClient} from '../src';

// Intentionally skipped. This is a type-assertion only. We don't want to make any network calls.
describe('acceptance', () => {
  it.skip('createProcessInstance', () => {
    createCamundaClient().createProcessInstance({
      // @ts-expect-error intentional wrong type for compile-time demonstration
      processDefinitionId: 'sohe',
    });
  });
});
