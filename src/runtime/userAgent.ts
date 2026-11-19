import { packageVersion } from './version';

/**
 * SDK product token sent as the first name in the `User-Agent` header (issue #693), so
 * gateway usage reports can attribute traffic to this SDK.
 */
export const SDK_USER_AGENT = `camunda-orchestration-sdk-js/${packageVersion}`;

/**
 * Browsers forbid (or silently drop) a script-set `User-Agent`; there we send the same
 * value in `X-Camunda-Client` instead.
 */
export const BROWSER_CLIENT_HEADER = 'X-Camunda-Client';

/** Builds the header value: SDK identifier first, then any application-supplied agent. */
export function buildUserAgent(appUserAgent?: string): string {
  const extra = appUserAgent?.trim();
  return extra ? `${SDK_USER_AGENT} ${extra}` : SDK_USER_AGENT;
}

function isBrowser(): boolean {
  return (
    typeof (globalThis as any).window !== 'undefined' &&
    typeof (globalThis as any).document !== 'undefined'
  );
}

/** Name of the header carrying the SDK identifier in the current runtime. */
export function userAgentHeaderName(): string {
  return isBrowser() ? BROWSER_CLIENT_HEADER : 'User-Agent';
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Wraps a fetch so every request carries the SDK user agent. The value is read lazily so
 * reconfiguration (`configure()`) takes effect without re-wrapping.
 */
export function withUserAgent(
  base: FetchLike | undefined,
  getAppUserAgent: () => string | undefined
): FetchLike {
  return (input, init) => {
    const fetchImpl: FetchLike = base ?? ((i, n) => fetch(i, n));
    const name = userAgentHeaderName();
    const value = buildUserAgent(getAppUserAgent());
    if (!init?.headers && typeof Request !== 'undefined' && input instanceof Request) {
      const headers = new Headers(input.headers);
      headers.set(name, value);
      return fetchImpl(new Request(input, { headers }), init);
    }
    const headers = new Headers(init?.headers);
    headers.set(name, value);
    return fetchImpl(input, { ...(init || {}), headers });
  };
}
