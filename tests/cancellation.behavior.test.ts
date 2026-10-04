import { describe, expect, it, vi } from 'vitest';
import { createCamundaClient } from '../src';

// Ensures that calling cancel() on an in-flight SDK operation aborts the underlying fetch
// and rejects the original promise with a CancelSdkError (not a generic AbortError).
describe('cancellation behavior', () => {
  it('cancel() aborts fetch and yields CancelSdkError', async () => {
    const BASE = 'https://mock.local';
    const fetchMock = vi.fn();

    // Resolves once the transport is actually in-flight, so the test cancels an
    // in-flight fetch (its stated intent) rather than racing the pre-transport
    // cancellation short-circuit in _invokeWithRetry (which, by design, never
    // reaches fetch — covered by tests/cancellation-backpressure.test.ts).
    let markFetchEntered!: () => void;
    const fetchEntered = new Promise<void>((resolve) => {
      markFetchEntered = resolve;
    });

    fetchMock.mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const signal = init?.signal as AbortSignal | undefined;
      return new Promise<Response>((resolve, reject) => {
        markFetchEntered();
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
    // Cancel only once the fetch is genuinely in-flight, so we exercise abort
    // propagation into the transport rather than the pre-transport short-circuit.
    await fetchEntered;
    p.cancel();

    await expect(p).rejects.toMatchObject({ name: 'CancelSdkError' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
