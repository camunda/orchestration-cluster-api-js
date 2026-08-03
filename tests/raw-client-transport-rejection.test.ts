import { describe, expect, it, vi } from 'vitest';
import { createClient, createConfig } from '../src/gen/client';

// Regression guard for the client-layer half of #405.
//
// `tests/transport-error-rejection.test.ts` locks down the CamundaClient / fp
// surfaces via `evaluateSdkResponse`. This file locks down the layer *below*
// that: the generated fetch client itself, which is also public surface (it is
// what `createClient` hands back, and what every generated `Sdk.*` function
// calls).
//
// Contract, matching pre-0.96 generator behaviour:
//   * `throwOnError` gates ONE thing — an HTTP error *response* (`!response.ok`).
//   * Every other failure rejects unconditionally: a failed `fetch` (DNS,
//     ECONNREFUSED, TLS), an abort, a throwing request interceptor, a
//     body-serialization failure.
//
// hey-api 0.96+ wraps the whole request body in a single try/catch that honours
// `throwOnError`, which collapsed that distinction and made connection failures
// resolve `{ error, response: undefined }`. Restored by
// hooks/post/640-fix-transport-error-rejection.ts.

const BASE = { baseUrl: 'https://example.invalid' };

function client(overrides: Record<string, unknown> = {}) {
  return createClient(createConfig({ ...BASE, ...overrides } as any));
}

/** A fetch that rejects the way a real connection error does. */
function failingFetch() {
  return vi.fn(async () => {
    throw new TypeError('fetch failed');
  });
}

/** A fetch that answers with a real HTTP error response. */
function errorResponseFetch(status = 404, body = '{"title":"Not Found"}') {
  return vi.fn(
    async () => new Response(body, { status, headers: { 'Content-Type': 'application/json' } })
  );
}

describe('generated fetch client: throwOnError gates HTTP error responses only (#405)', () => {
  describe('transport failures reject regardless of throwOnError', () => {
    it.each([{ throwOnError: true }, { throwOnError: false }, {}])(
      'rejects with the underlying error (%o)',
      async (opts) => {
        const fetchMock = failingFetch();
        const c = client({ fetch: fetchMock, throwOnError: false });
        await expect((c as any).post({ url: '/x', ...opts })).rejects.toThrow(/fetch failed/);
        expect(fetchMock).toHaveBeenCalled();
      }
    );

    it('rejects for responseStyle:"data" too (no silent undefined)', async () => {
      const c = client({ fetch: failingFetch(), throwOnError: false, responseStyle: 'data' });
      await expect((c as any).post({ url: '/x', throwOnError: false })).rejects.toThrow(
        /fetch failed/
      );
    });
  });

  describe('other pre-response failures also reject with throwOnError:false', () => {
    it('an aborted request rejects', async () => {
      // Node's fetch rejects with an AbortError when the signal fires (or is
      // already aborted by the time fetch is reached — `beforeRequest` awaits,
      // so either ordering is possible). Assert we surface it rather than
      // resolving an `{ error }` object.
      const abortError = () =>
        Object.assign(new Error('This operation was aborted'), { name: 'AbortError' });
      const c = client({
        fetch: vi.fn(
          (req: Request) =>
            new Promise<Response>((_resolve, reject) => {
              if (req.signal.aborted) return reject(abortError());
              req.signal.addEventListener('abort', () => reject(abortError()), { once: true });
            })
        ),
        throwOnError: false,
      });
      const ac = new AbortController();
      const p = (c as any).post({ url: '/x', throwOnError: false, signal: ac.signal });
      ac.abort();
      await expect(p).rejects.toThrow(/aborted/i);
    });

    it('a throwing request interceptor rejects', async () => {
      const fetchMock = failingFetch();
      const c = client({ fetch: fetchMock, throwOnError: false });
      c.interceptors.request.use(async () => {
        throw new Error('interceptor exploded');
      });
      await expect((c as any).post({ url: '/x', throwOnError: false })).rejects.toThrow(
        /interceptor exploded/
      );
      // Never reached the network.
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('a throwing bodySerializer rejects', async () => {
      const fetchMock = failingFetch();
      const c = client({ fetch: fetchMock, throwOnError: false });
      await expect(
        (c as any).post({
          url: '/x',
          throwOnError: false,
          body: { a: 1 },
          bodySerializer: () => {
            throw new Error('serializer exploded');
          },
        })
      ).rejects.toThrow(/serializer exploded/);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('HTTP error responses stay gated by throwOnError', () => {
    it('throwOnError:false returns { error, response } with the status intact', async () => {
      const c = client({ fetch: errorResponseFetch(404), throwOnError: false });
      const r: any = await (c as any).get({ url: '/x', throwOnError: false });
      expect(r.response?.status).toBe(404);
      expect(r.error).toEqual({ title: 'Not Found' });
      expect(r.data).toBeUndefined();
    });

    it('throwOnError:true rejects with the parsed problem body', async () => {
      const c = client({ fetch: errorResponseFetch(404), throwOnError: true });
      await expect((c as any).get({ url: '/x' })).rejects.toEqual({ title: 'Not Found' });
    });

    it('a successful response is unaffected', async () => {
      const c = client({
        fetch: vi.fn(
          async () =>
            new Response('{"ok":true}', {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
        ),
        throwOnError: false,
      });
      const r: any = await (c as any).get({ url: '/x', throwOnError: false });
      expect(r.data).toEqual({ ok: true });
      expect(r.error).toBeUndefined();
    });
  });
});
