import { defineConfig } from 'vitest/config';

const isIntegrationRun = process.env.CAMUNDA_SDK_INTEGRATION === '1';

export default defineConfig(() => {
  return {
    test: {
      globals: true,
      // Integration tests share a live Camunda instance, so they must run
      // sequentially. Unit runs have no shared external state — let vitest
      // parallelize across files (default) for a large wall-time win.
      fileParallelism: isIntegrationRun ? false : undefined,
      // Only run cleanup (or environment provisioning) for integration runs.
      setupFiles: isIntegrationRun ? './tests-integration/setup/cleanup.ts' : undefined,
      globalSetup: isIntegrationRun ? './tests-integration/setup/global-setup.ts' : undefined,
      // For integration tests, run tests in the same thread (no isolate) and sequentially (no concurrency).
      // This ensures that shared resources (e.g., the Camunda Platform instance) are not hit with parallel requests.
    },
  };
});
