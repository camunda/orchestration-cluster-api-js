import type { Client } from '../gen/client/types.gen';

/**
 * Installs a request interceptor on the provided client that injects the Authorization
 * header using the supplied getAuthHeaders callback while auth strategy is not NONE.
 * Safe to call multiple times on fresh client instances (e.g., after reconfigure).
 */
export function installAuthInterceptor(
  client: Client,
  getStrategy: () => string,
  getAuthHeaders: () => Promise<Record<string,string>>
) {
  client.interceptors.request.use(async (request) => {
    try {
      if (getStrategy() === 'NONE') return request;
      const hdrs = await getAuthHeaders();
      const auth = hdrs?.['Authorization'];
      if (auth && !request.headers.get('Authorization')) {
        const h = new Headers(request.headers);
        h.set('Authorization', auth);
        return new Request(request, { headers: h });
      }
    } catch { /* swallow to avoid breaking request flow */ }
    return request;
  });
}
