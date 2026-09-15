import { describe, expect, it } from 'vitest';
import { createJobProxy } from '../src/runtime/threadJobProxy';

/**
 * Class-scoped regression for lease-token forwarding through the threaded job
 * proxy (PR #514 review — the inline thread on threadWorkerEntry.ts).
 *
 * A leased job (activated with `withLease: true`) receives a `leaseToken` that
 * MUST be echoed back on every subsequent job action so the broker accepts it.
 * Before this test only `complete` was covered; `fail`, `error`,
 * `modifyJobTimeout` and `modifyRetries` could silently drop the token without
 * any test noticing. This exercises EVERY action, so the defect class — an
 * action that forgets to forward the lease token — cannot recur on a different
 * method.
 */

function makeClient() {
  const calls: Array<{ method: string; arg: any }> = [];
  const client: any = {
    updateJob: (arg: any) => {
      calls.push({ method: 'updateJob', arg });
      return Promise.resolve({});
    },
  };
  return { client, calls };
}

const LEASE = 'lease-abc';

describe('threaded job proxy — lease-token forwarding (class-scoped)', () => {
  describe('a leased job forwards its leaseToken on every action', () => {
    it('complete', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: LEASE }, client);
      await job.complete({ ok: true });
      expect(job._completionAction.method).toBe('completeJob');
      expect(job._completionAction.args[0]).toMatchObject({ jobKey: 'j1', leaseToken: LEASE });
    });

    it('fail', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: LEASE }, client);
      await job.fail({ errorMessage: 'boom', retries: 1 });
      expect(job._completionAction.method).toBe('failJob');
      expect(job._completionAction.args[0]).toMatchObject({ jobKey: 'j1', leaseToken: LEASE });
    });

    it('error', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: LEASE }, client);
      await job.error({ errorCode: 'E', errorMessage: 'bad' });
      expect(job._completionAction.method).toBe('throwJobError');
      expect(job._completionAction.args[0]).toMatchObject({ jobKey: 'j1', leaseToken: LEASE });
    });

    it('modifyJobTimeout', async () => {
      const { client, calls } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: LEASE }, client);
      await job.modifyJobTimeout({ newTimeoutMs: 5000 });
      expect(calls).toHaveLength(1);
      expect(calls[0].arg).toMatchObject({
        jobKey: 'j1',
        leaseToken: LEASE,
        changeset: { timeout: 5000 },
      });
    });

    it('modifyRetries', async () => {
      const { client, calls } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: LEASE }, client);
      await job.modifyRetries({ retries: 2 });
      expect(calls).toHaveLength(1);
      expect(calls[0].arg).toMatchObject({
        jobKey: 'j1',
        leaseToken: LEASE,
        changeset: { retries: 2 },
      });
    });
  });

  describe('an unleased job never invents a leaseToken', () => {
    it('complete', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: null }, client);
      await job.complete();
      expect(job._completionAction.args[0]).not.toHaveProperty('leaseToken');
    });

    it('fail', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1' }, client);
      await job.fail({ errorMessage: 'boom' });
      expect(job._completionAction.args[0]).not.toHaveProperty('leaseToken');
    });

    it('error', async () => {
      const { client } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: null }, client);
      await job.error({ errorCode: 'E', errorMessage: 'bad' });
      expect(job._completionAction.args[0]).not.toHaveProperty('leaseToken');
    });

    it('modifyJobTimeout', async () => {
      const { client, calls } = makeClient();
      const job = createJobProxy({ jobKey: 'j1', leaseToken: null }, client);
      await job.modifyJobTimeout({ newTimeoutMs: 5000 });
      expect(calls[0].arg).not.toHaveProperty('leaseToken');
    });

    it('modifyRetries', async () => {
      const { client, calls } = makeClient();
      const job = createJobProxy({ jobKey: 'j1' }, client);
      await job.modifyRetries({ retries: 2 });
      expect(calls[0].arg).not.toHaveProperty('leaseToken');
    });
  });
});
