/**
 * Platform seam (issue #537).
 *
 * Runtime code never imports `node:*` modules directly. It imports `node` from
 * the `#platform` subpath import instead, which package.json resolves per
 * runtime:
 *   - `browser` condition → `platform/browser` (`node` is `undefined`)
 *   - everything else    → `platform/node`    (real Node built-ins)
 *
 * Node consumers therefore get exactly the built-ins they always had; browser
 * bundlers never see a `node:*` specifier. Callers must treat `node` as
 * optional and degrade (or throw a clear error) when it is `undefined`.
 */
export interface NodeBuiltins {
  fs: typeof import('node:fs');
  fsPromises: typeof import('node:fs/promises');
  path: typeof import('node:path');
  os: typeof import('node:os');
  https: typeof import('node:https');
  url: typeof import('node:url');
  crypto: typeof import('node:crypto');
  /** Loaded lazily: only the threaded job worker pool needs it. */
  loadWorkerThreads(): Promise<typeof import('node:worker_threads')>;
}
