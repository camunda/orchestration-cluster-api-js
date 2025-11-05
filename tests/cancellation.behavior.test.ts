import { describe, it, expect, vi } from 'vitest';

import { createCamundaClient } from '../src';

// Ensures that calling cancel() on an in-flight SDK operation aborts the underlying fetch
// and rejects the original promise with a CancelSdkError (not a generic AbortError).
describe('cancellation behavior', () => {
  it('cancel() aborts fetch and yields CancelSdkError', async () => {
    const BASE = 'https://mock.local';
    const fetchMock = vi.fn();

    fetchMock.mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const signal = init?.signal as AbortSignal | undefined;
      return new Promise<Response>((resolve, reject) => {
        const finalize = () => {
          resolve(
            new Response(JSON.stringify({ status: 'ok' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          );
        };
        const onAbort = () => {
          const err =
            typeof DOMException !== 'undefined'
              ? new DOMException('Aborted', 'AbortError')
              : Object.assign(new Error('Aborted'), { name: 'AbortError' });
          reject(err);
        };
        if (signal?.aborted) return onAbort();
        signal?.addEventListener('abort', onAbort, { once: true });
        setTimeout(finalize, 50); // Delay to allow cancellation to occur first
      });
    });

    const camunda = createCamundaClient({
      config: { CAMUNDA_REST_ADDRESS: BASE },
      fetch: fetchMock as any,
    });

    const p: any = camunda.getStatus();
    // Immediately cancel before mock resolves
    p.cancel();

    await expect(p).rejects.toMatchObject({ name: 'CancelSdkError' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
