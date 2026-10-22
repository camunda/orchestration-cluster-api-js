/**
 * mTLS transport (issue #540).
 *
 * Node's built-in `fetch` (undici) ignores the legacy `agent` option, so an
 * `https.Agent` never reaches the wire. TLS material must be passed as an undici
 * `dispatcher`. We use undici's own `fetch` + `Agent` from the same package so the
 * two are always version-compatible; when the caller injected a custom `fetch`, the
 * dispatcher is passed through `init` and it's up to that fetch to honour it.
 *
 * undici is loaded lazily through the `#platform` seam, so browser bundles never see it.
 */

import type { CamundaConfig } from './unifiedConfiguration';
import { node } from '#platform';

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/** Marks a fetch that already applies mTLS, so layers don't wrap it twice. */
const MTLS_FETCH = Symbol.for('camunda.sdk.mtlsFetch');

export function isMtlsFetch(f: unknown): boolean {
  return typeof f === 'function' && (f as any)[MTLS_FETCH] === true;
}

export interface MtlsMaterial {
  cert?: string;
  key?: string;
  ca?: string;
  passphrase?: string;
}

/** Resolve PEM material from config (inline PEM wins over path). Node only. */
export function resolveMtlsMaterial(cfg: Pick<CamundaConfig, 'mtls'>): MtlsMaterial | undefined {
  const m = cfg.mtls;
  if (!m || !node) return undefined;
  const pem = (inline?: string, p?: string) =>
    inline || (p ? node!.fs.readFileSync(p, 'utf8') : undefined);
  const material: MtlsMaterial = {};
  const cert = pem(m.cert, m.certPath);
  const key = pem(m.key, m.keyPath);
  const ca = pem(m.ca, m.caPath);
  if (cert) material.cert = cert;
  if (key) material.key = key;
  if (ca) material.ca = ca;
  if (m.keyPassphrase) material.passphrase = m.keyPassphrase;
  return Object.keys(material).length ? material : undefined;
}

/**
 * Wrap `base` (or undici's fetch when `base` is undefined) so every request
 * carries an undici dispatcher configured with the mTLS material.
 * Returns `base` unchanged when there is no mTLS config or we're not on Node.
 */
export function withMtls(
  cfg: Pick<CamundaConfig, 'mtls'>,
  base: FetchLike | undefined
): FetchLike | undefined {
  if (isMtlsFetch(base)) return base;
  const material = resolveMtlsMaterial(cfg);
  if (!material || !node) return base;
  const loading = node.loadUndici().then((undici) => ({
    fetch: undici.fetch as unknown as FetchLike,
    dispatcher: new undici.Agent({ connect: material }),
  }));
  const wrapped: FetchLike = async (input, init) => {
    const u = await loading;
    if (base) return base(input, { ...(init || {}), dispatcher: u.dispatcher } as RequestInit);
    // undici's fetch only recognises its own Request class; the generated client
    // passes a global Request, so unpack it into url + init.
    if (typeof Request !== 'undefined' && input instanceof Request) {
      const hasBody = input.body !== null && !/^(GET|HEAD)$/i.test(input.method);
      const unpacked: Record<string, unknown> = {
        method: input.method,
        headers: input.headers,
        redirect: input.redirect,
        signal: input.signal,
        ...(hasBody ? { body: input.body, duplex: 'half' } : {}),
        ...(init || {}),
        dispatcher: u.dispatcher,
      };
      return u.fetch(input.url, unpacked as RequestInit);
    }
    return u.fetch(input, { ...(init || {}), dispatcher: u.dispatcher } as RequestInit);
  };
  (wrapped as any)[MTLS_FETCH] = true;
  return wrapped;
}
