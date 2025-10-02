import { defineConfig } from 'vitest/config';

// Heuristic: run integration global setup only when the invocation explicitly targets
// the integration suite (argument contains 'tests-integration') or an opt-in env flag is set.
const isIntegrationRun =
  process.argv.some((a) => /tests-integration/.test(a)) ||
  process.env.CAMUNDA_SDK_INTEGRATION === '1';

export default defineConfig(() => {
  return {
    test: {
      globals: true,
      // Run tests sequentially
      fileParallelism: false,
      // Only run cleanup (or environment provisioning) for integration runs.
      setupFiles: isIntegrationRun ? './tests-integration/setup/cleanup.ts' : undefined,
      globalSetup: isIntegrationRun ? './tests-integration/setup/global-setup.ts' : undefined,
      // For integration tests, run tests in the same thread (no isolate) and sequentially (no concurrency).
      // This ensures that shared resources (e.g., the Camunda Platform instance) are not hit with parallel requests.
    },
  };
});
