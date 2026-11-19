// Issue #693: browser builds must send no SDK identifier header at all — browsers
// forbid a script-set `User-Agent`, and any custom header would turn simple
// cross-origin requests (e.g. the form-encoded OAuth POST) into CORS preflights.
//
// This file is separate from user-agent.test.ts because the `#platform` seam is
// mocked per-file in vitest: here it resolves to the browser platform module, so
// the helpers under test exercise their DEFAULT platform selection (no explicit
// header-name argument) exactly as a browser bundle would.
import { describe, expect, it, vi } from 'vitest';

vi.mock('#platform', () => import('../src/runtime/platform/browser'));

describe('User-Agent defaults under the browser platform (#693)', () => {
  it('selects no identifier header by default', async () => {
    const { userAgentHeaderName, userAgentHeaders } = await import('../src/runtime/userAgent');
    expect(userAgentHeaderName()).toBeNull();
    expect(userAgentHeaders('my-app/1')).toEqual({});
  });

  it('withUserAgent passes requests through untouched by default', async () => {
    const { withUserAgent } = await import('../src/runtime/userAgent');
    const seen: { input: any; init: RequestInit | undefined }[] = [];
    const f = withUserAgent(
      async (input, init) => {
        seen.push({ input, init });
        return new Response('{}');
      },
      () => 'my-app/1'
    );
    await f('https://example.com/x', { headers: { 'content-type': 'x' } });
    expect(seen.length).toBe(1);
    // Neither the input nor the init is rewritten: no header is added, and no
    // Request wrapper is manufactured.
    expect(typeof seen[0].input).toBe('string');
    expect([...new Headers(seen[0].init?.headers).keys()]).toEqual(['content-type']);
  });
});
