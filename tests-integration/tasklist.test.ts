import { describe, it, expect } from 'vitest';
import createCamundaClient, { Tag, UserTaskKey } from '../src';

describe('tasklist', () => {

    it.skip('x', () => {
        const camunda = createCamundaClient()
        camunda.completeUserTask({
            userTaskKey: UserTaskKey.assumeExists('1234789997'),
            variables: {
                a: 1
            }
        })
    })
})