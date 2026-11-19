import { packageVersion } from './version';

/**
 * SDK product token sent as the first name in the `User-Agent` header (issue #693), so
 * gateway usage reports can attribute traffic to this SDK.
 */
export const SDK_USER_AGENT = `camunda-orchestration-sdk-js/${packageVersion}`;

/**
 * Name of the header carrying the SDK identifier on this platform, or `null` when none
 * is sent. Selection checks for a Node runtime (not browser globals), so Node processes
 * with DOM shims still send `User-Agent`, and browsers (including Web Workers) send
 * nothing: browsers forbid a script-set `User-Agent`, and any custom header would turn
 * simple cross-origin requests (e.g. the form-encoded OAuth POST) into CORS preflights the
 * server may reject.
 */
export function userAgentHeaderName(): string | null {
  return isNodeRuntime() ? 'User-Agent' : null;
}

function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}

/** Builds the header value: SDK identifier first, then any application-supplied agent. */
export function buildUserAgent(appUserAgent?: string): string {
  const extra = appUserAgent?.trim();
  return extra ? `${SDK_USER_AGENT} ${extra}` : SDK_USER_AGENT;
}

/** Header record to spread into a request (empty where no identifier header is sent). */
export function userAgentHeaders(
  appUserAgent?: string,
  name: string | null = userAgentHeaderName()
): Record<string, string> {
  return name ? { [name]: buildUserAgent(appUserAgent) } : {};
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Wraps a fetch so every request carries the SDK user agent. The value is read lazily so
 * reconfiguration (`configure()`) takes effect without re-wrapping.
 */
export function withUserAgent(
  base: FetchLike | undefined,
  getAppUserAgent: () => string | undefined,
  name: string | null = userAgentHeaderName()
): FetchLike {
  return (input, init) => {
    const fetchImpl: FetchLike = base ?? ((i, n) => fetch(i, n));
    if (!name) return fetchImpl(input, init);
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
