/**
 * Integration globalSetup cleanup.
 *
 * Strategy (idempotent & best-effort):
 * 1. Determine process definition IDs (BPMN process ids) from fixture BPMN files.
 * 2. For each definition, attempt to find active process instances via search.
 * 3. Cancel active instances to leave a clean slate for integration tests.
 *
 * We intentionally DO NOT delete deployments here to avoid flakiness if other
 * integration runs rely on shared deployments (e.g., parallel CI shards). If
 * deletion is required later, we can extend this with deployment enumeration.
 */
import { afterEach, inject } from 'vitest';

import { cancelActiveInstancesForDefinitions } from './cancelTasks';

afterEach(async () => {
  const models = inject('models');
  await cancelActiveInstancesForDefinitions(models);
});
