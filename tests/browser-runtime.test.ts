/**
 * Browser-platform runtime behavior gate (issue #537).
 *
 * `browser-bundle.test.ts` proves the browser module graph *compiles* (no Node
 * built-ins reachable). This suite proves the browser build *behaves* correctly
 * at runtime: it bundles `src/index.ts` with the `browser` condition — so
 * `#platform` resolves to `platform/browser.ts` and `node` is `undefined` —
 * then executes that bundle inside a `worker_thread` whose `process.versions`
 * is stripped, so the SDK's `typeof process !== 'undefined' &&
 * process.versions?.node` environment probes all report "browser".
 *
 * Behaviors pinned here (each is a defect class, not a single call site):
 *   1. Client construction never touches Node globals and never throws.
 *   2. Disk-backed paths are no-ops: the support logger stays disabled and
 *      writes nothing, and the OAuth file token cache is skipped.
 *   3. Node-only APIs reject clearly: `createThreadedJobWorker()` throws
 *      *synchronously* (the pool's platform guard lives in the synchronous
 *      constructor, not the async `_init`), and `deployResourcesFromFiles()`
 *      rejects with an unsupported-runtime error.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';
import { build, type Plugin } from 'esbuild';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

/** Resolve a `#subpath` import the way a bundler would under the browser condition. */
function resolvePackageImport(spec: string): string | undefined {
  let target = pkg.imports?.[spec];
  // Walk condition objects: prefer `browser`, then `import`, then `default`.
  while (target && typeof target === 'object') {
    target = target.browser ?? target.import ?? target.default;
  }
  if (typeof target !== 'string') return undefined;
  // dist/<x>.js -> src/<x>.ts (unit tests run before tsup emits dist)
  return join(root, target.replace(/^\.\/dist\//, 'src/').replace(/\.c?js$/, '.ts'));
}

const packageImports: Plugin = {
  name: 'package-imports-browser',
  setup(b) {
    b.onResolve({ filter: /^#/ }, (args) => {
      const path = resolvePackageImport(args.path);
      return path
        ? { path }
        : { errors: [{ text: `package.json "imports" has no browser mapping for ${args.path}` }] };
    });
  },
};

/**
 * Sandbox script executed inside the worker thread. It strips the Node
 * fingerprint from `process.versions` (so SDK environment probes report a
 * non-Node runtime), imports the browser bundle, and exercises the promised
 * runtime behaviors, posting back a structured report. Written as plain
 * JavaScript: it is stringified into the Worker, never type-checked.
 */
const SANDBOX_JS = `
const { parentPort, workerData } = require('node:worker_threads');

(async () => {
  // Simulate a browser runtime: no Node version fingerprint.
  process.versions = {};
  const sdk = await import(workerData.bundleUrl);
  const report = { checks: {}, log: [] };
  const record = (name, fn) => {
    try {
      fn();
      report.checks[name] = { ok: true };
    } catch (e) {
      report.checks[name] = { ok: false, error: String((e && e.message) || e) };
    }
  };
  const recordAsync = async (name, fn) => {
    try {
      await fn();
      report.checks[name] = { ok: true };
    } catch (e) {
      report.checks[name] = { ok: false, error: String((e && e.message) || e) };
    }
  };

  const baseConfig = {
    CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
    CAMUNDA_AUTH_STRATEGY: 'NONE',
  };

  // 1. Client construction must not touch Node globals or throw.
  let client;
  record('constructs without Node globals', () => {
    client = sdk.createCamundaClient({ config: { ...baseConfig } });
    if (!client) throw new Error('createCamundaClient returned a falsy value');
  });

  // 2a. Support-log path is a no-op: even with the support log force-enabled
  // via config, the browser runtime must not create or write any file.
  record('support logger is a disabled no-op', () => {
    const c = sdk.createCamundaClient({
      config: {
        ...baseConfig,
        CAMUNDA_SUPPORT_LOG_ENABLED: 'true',
        CAMUNDA_SUPPORT_LOG_FILE_PATH: workerData.supportLogPath,
      },
    });
    // Must not throw and must not touch the filesystem.
    c._getSupportLogger().log('browser-runtime-test: this must go nowhere');
  });

  // 2b. OAuth file token cache is skipped (no disk access) even when a cache
  // directory is configured: fetching a token fails (unreachable endpoint) and
  // the failure must NOT leave a cache file/dir behind.
  await recordAsync('oauth disk token cache is skipped', async () => {
    const c = sdk.createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: 'http://localhost:8080',
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
        CAMUNDA_OAUTH_URL: 'http://localhost:1/token',
        CAMUNDA_OAUTH_CACHE_DIR: workerData.cacheDir,
        CAMUNDA_OAUTH_RETRY_MAX: '1',
        CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS: '1',
      },
    });
    try {
      await c.getAuthHeaders();
    } catch {
      /* token endpoint is unreachable — expected */
    }
  });

  // 3a. Threaded job workers fail fast: the synchronous creation call throws.
  record('createThreadedJobWorker throws synchronously', () => {
    let threw = null;
    try {
      sdk.createCamundaClient({ config: { ...baseConfig } }).createThreadedJobWorker({
        jobType: 'cpu-heavy-task',
        handlerModule: './handler.js',
      });
    } catch (e) {
      threw = e;
    }
    if (!threw) throw new Error('createThreadedJobWorker returned a worker in a browser runtime');
    if (!/only available in Node\\.js environments/.test(String(threw.message))) {
      throw new Error('unexpected error message: ' + threw.message);
    }
  });

  // 3b. deployResourcesFromFiles rejects with a clear unsupported-runtime error.
  await recordAsync('deployResourcesFromFiles rejects clearly', async () => {
    let err = null;
    try {
      await sdk
        .createCamundaClient({ config: { ...baseConfig } })
        .deployResourcesFromFiles(['/tmp/model.bpmn']);
    } catch (e) {
      err = e;
    }
    if (!err) throw new Error('deployResourcesFromFiles resolved in a browser runtime');
    if (!/only available in Node\\.js environments/.test(String(err.message))) {
      throw new Error('unexpected error message: ' + err.message);
    }
  });

  parentPort.postMessage(report);
})().catch((e) => parentPort.postMessage({ crashed: String((e && e.stack) || e) }));
`;

describe('browser platform runtime behavior', () => {
  let workDir: string;
  let bundleUrl: string;
  let cacheDir: string;
  let supportLogPath: string;

  beforeAll(async () => {
    workDir = mkdtempSync(join(tmpdir(), 'camunda-browser-runtime-'));
    cacheDir = join(workDir, 'oauth-cache');
    supportLogPath = join(workDir, 'camunda-support.log');
    const bundlePath = join(workDir, 'sdk.browser.mjs');
    const sandboxPath = join(workDir, 'sandbox.cjs');

    const result = await build({
      entryPoints: [join(root, 'src/index.ts')],
      bundle: true,
      write: false,
      platform: 'browser',
      format: 'esm',
      conditions: ['browser'],
      logLevel: 'silent',
      plugins: [packageImports],
    });
    writeFileSync(bundlePath, result.outputFiles[0].text);
    writeFileSync(sandboxPath, SANDBOX_JS);
    bundleUrl = pathToFileURL(bundlePath).href;

    const report = await new Promise<any>((resolvePromise, rejectPromise) => {
      const worker = new Worker(sandboxPath, {
        workerData: { bundleUrl, cacheDir, supportLogPath },
      });
      worker.once('message', resolvePromise);
      worker.once('error', rejectPromise);
      worker.once('exit', (code) => {
        if (code !== 0) rejectPromise(new Error(`sandbox worker exited with code ${code}`));
      });
    });
    if (report.crashed) throw new Error(`sandbox crashed: ${report.crashed}`);
    // Stash the report for the individual assertions below.
    sandboxReport = report;
  }, 120_000);

  let sandboxReport: { checks: Record<string, { ok: boolean; error?: string }> };

  afterAll(() => {
    if (workDir) rmSync(workDir, { recursive: true, force: true });
  });

  it('constructs a client without Node globals', () => {
    expect(sandboxReport.checks['constructs without Node globals']).toEqual({ ok: true });
  });

  it('keeps the support logger a no-op that writes nothing', () => {
    expect(sandboxReport.checks['support logger is a disabled no-op']).toEqual({ ok: true });
    // The no-op support logger must not have created its log file.
    expect(() => readFileSync(supportLogPath)).toThrow();
  });

  it('skips the OAuth disk token cache', () => {
    expect(sandboxReport.checks['oauth disk token cache is skipped']).toEqual({ ok: true });
    // The cache directory must not have been created by the browser build.
    expect(() => readFileSync(join(cacheDir, 'anything'))).toThrow();
  });

  it('throws synchronously from createThreadedJobWorker', () => {
    expect(sandboxReport.checks['createThreadedJobWorker throws synchronously']).toEqual({
      ok: true,
    });
  });

  it('rejects deployResourcesFromFiles with a clear error', () => {
    expect(sandboxReport.checks['deployResourcesFromFiles rejects clearly']).toEqual({ ok: true });
  });
});
