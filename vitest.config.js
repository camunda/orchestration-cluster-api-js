import { defineConfig } from 'vitest/config';

const isIntegrationRun = process.env.CAMUNDA_SDK_INTEGRATION === '1';

export default defineConfig(() => {
  return {
    test: {
      globals: true,
      // Integration tests share a live Camunda instance, so they must run
      // sequentially. Unit runs have no shared external state — let vitest
      // parallelize across files (default) for a large wall-time win.
      //
      // Only set `fileParallelism` for integration runs. Setting it to
      // `undefined` for unit runs would still add the key to the config, which
      // vitest may treat as an explicit override and suppress the default
      // parallel behavior — so omit the key entirely instead.
      ...(isIntegrationRun ? { fileParallelism: false } : {}),
      // Only run cleanup (or environment provisioning) for integration runs.
      setupFiles: isIntegrationRun ? './tests-integration/setup/cleanup.ts' : undefined,
      globalSetup: isIntegrationRun ? './tests-integration/setup/global-setup.ts' : undefined,
      // For integration tests, run tests in the same thread (no isolate) and sequentially (no concurrency).
      // This ensures that shared resources (e.g., the Camunda Platform instance) are not hit with parallel requests.
    },
  };
});
