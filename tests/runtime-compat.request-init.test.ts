import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClient } from '../src/gen/client/client.gen';

// Regression guard for Deno/Bun (spec-strict runtime) compatibility.
//
// The @hey-api/client-fetch runtime spreads its internal options into the Web
// `Request` init. Browsers and Node/undici ignore unknown RequestInit keys, but
// Deno and Bun validate them strictly — Deno throws when `client` is present and
// is not a `Deno.HttpClient`, so every SDK request fails on those runtimes:
//
//   TypeError: Failed to construct 'Request': Argument 2 `client` must be a
//   Deno.HttpClient
//
// hooks/post/630-fix-request-init-runtime-compat.ts injects a
// `sanitizeRequestInit()` helper and wraps every `new Request(url, init)` site
// so only standard fields reach the constructor. These tests fail fast if that
// patch is dropped (e.g. a regeneration without the hook, or a template change),
// without needing a real Deno/Bun runtime or a live server — so they stay cheap
// enough to run on every CI build.

describe('runtime compat: Request init is spec-strict (Deno/Bun)', () => {
  const realRequest = globalThis.Request;
  afterEach(() => {
    globalThis.Request = realRequest;
    vi.restoreAllMocks();
  });

  it('does not leak non-standard keys (e.g. `client`) into new Request()', async () => {
    // Emulate Deno/Bun strictness: reject the non-standard `client` init key,
    // exactly as Deno's Request constructor does. (Node/undici ignore it.)
    const seenInits: Array<Record<string, unknown>> = [];
    class StrictRequest extends realRequest {
      constructor(input: RequestInfo | URL, init?: RequestInit) {
        if (init && typeof init === 'object' && 'client' in init) {
          throw new TypeError(
            "Failed to construct 'Request': Argument 2 `client` must be a Deno.HttpClient"
          );
        }
        if (init) seenInits.push(init as Record<string, unknown>);
        super(input, init);
      }
    }
    globalThis.Request = StrictRequest as unknown as typeof Request;

    const fetchMock = vi.fn(
      async () =>
        new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
    );

    // Drive the exact generated request path (client.gen.ts) that broke.
    const client = createClient({
      baseUrl: 'http://localhost:8080',
      fetch: fetchMock as typeof fetch,
    });
    await expect(client.get({ url: '/topology' })).resolves.toBeDefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Defensive: confirm none of the known internal keys reached the init.
    const leaked = [
      'client',
      'fetch',
      'baseUrl',
      'serializedBody',
      'bodySerializer',
      'querySerializer',
      'throwOnError',
      'parseAs',
    ];
    for (const init of seenInits) {
      for (const key of leaked) expect(init).not.toHaveProperty(key);
    }
  });

  it('wraps every generated `new Request(...)` site with sanitizeRequestInit()', () => {
    // Static guard so SSE and any future Request sites are covered even though
    // they are not exercised behaviourally above.
    const files = ['src/gen/client/client.gen.ts', 'src/gen/core/serverSentEvents.gen.ts'];
    for (const rel of files) {
      const source = readFileSync(path.join(process.cwd(), rel), 'utf8');
      expect(source, `${rel}: missing sanitizeRequestInit helper`).toContain(
        'const sanitizeRequestInit ='
      );
      const allSites = [...source.matchAll(/new Request\(/g)];
      expect(allSites.length, `${rel}: expected at least one new Request() site`).toBeGreaterThan(
        0
      );
      // Every `new Request(url, <init>)` must pass `sanitizeRequestInit(<init>)`
      // as its second argument — regardless of whether the init is a bare
      // identifier, an object literal, or any other expression.
      const sanitizedSites = [...source.matchAll(/new Request\([^,]+,\s*sanitizeRequestInit\(/g)];
      expect(
        sanitizedSites.length,
        `${rel}: every new Request() init must be wrapped in sanitizeRequestInit()`
      ).toBe(allSites.length);
    }
  });

  it('passes a sanitized init to the public onRequest hook in the SSE client', () => {
    // The SSE client also hands the init to a user-supplied onRequest(url, init)
    // hook; a strict-runtime onRequest implementation that calls
    // `new Request(url, init)` would still throw if that init were unsanitized.
    const rel = 'src/gen/core/serverSentEvents.gen.ts';
    const source = readFileSync(path.join(process.cwd(), rel), 'utf8');
    const onRequestCalls = [...source.matchAll(/\bonRequest\([^,)]+,\s*([^)]+)\)/g)];
    expect(onRequestCalls.length, `${rel}: expected an onRequest(url, init) call`).toBeGreaterThan(
      0
    );
    for (const match of onRequestCalls) {
      expect(match[1].trim(), `${rel}: onRequest() must receive a sanitized init`).toMatch(
        /^sanitizeRequestInit\(/
      );
    }
  });
});
