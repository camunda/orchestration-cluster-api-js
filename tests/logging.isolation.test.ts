import { describe, it, expect } from 'vitest';
import createCamundaClient from '../src';

describe('per-client logger isolation', () => {
  it('separates transports and levels', () => {
    const eventsA: any[] = []; const eventsB: any[] = [];
    const a = createCamundaClient({ log: { level: 'debug', transport: e => eventsA.push(e) } });
    const b = createCamundaClient({ log: { level: 'error', transport: e => eventsB.push(e) } });
    a.logger('iso').debug('debug-a');
    b.logger('iso').debug('debug-b');
    expect(eventsA.find(e => e.args.includes('debug-a'))).toBeTruthy();
    expect(eventsB.find(e => e.args.includes('debug-b'))).toBeFalsy();
  });
  it('reconfigure changes level only for that client', () => {
    const eventsA: any[] = []; const eventsB: any[] = [];
    const a = createCamundaClient({ log: { level: 'error', transport: e => eventsA.push(e) } });
    const b = createCamundaClient({ log: { level: 'error', transport: e => eventsB.push(e) } });
    a.logger('iso').debug('skip');
    a.configure({ log: { level: 'debug' } });
    a.logger('iso').debug('now');
    b.logger('iso').debug('still-silent');
    expect(eventsA.some(e => e.args.includes('now'))).toBe(true);
    expect(eventsA.some(e => e.args.includes('skip'))).toBe(false);
    expect(eventsB.length).toBe(0);
  });
});
