import { describe, it, expect } from 'vitest';

import { createCamundaClient } from '../src';

describe('logging lazy args', () => {
  it('does not evaluate lazy arg when below level', () => {
    let evaluated = false;
    const events: any[] = [];
    const client = createCamundaClient({
      log: { level: 'error', transport: (e) => events.push(e) },
    });
    client.logger('test').debug(() => {
      evaluated = true;
      return ['should not run'];
    });
    expect(evaluated).toBe(false);
    expect(events.length).toBe(0);
  });
  it('evaluates lazy arg when enabled', () => {
    let evaluated = false;
    const events: any[] = [];
    const client = createCamundaClient({
      log: { level: 'debug', transport: (e) => events.push(e) },
    });
    client.logger('test').debug(() => {
      evaluated = true;
      return ['runs'];
    });
    expect(evaluated).toBe(true);
    expect(events[0].level).toBe('debug');
  });
});
