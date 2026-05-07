// Compilable usage examples for agent instance operations.
// These examples are type-checked during build to guard against API regressions.

import {
  createCamundaClient,
  type AgentInstanceKey,
} from '@camunda8/orchestration-cluster-api';

//#region GetAgentInstance
async function getAgentInstanceExample(agentInstanceKey: AgentInstanceKey) {
  const camunda = createCamundaClient();

  const instance = await camunda.getAgentInstance(
    { agentInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Status: ${instance.status}`);
  console.log(`Element: ${instance.elementId}`);
}
//#endregion GetAgentInstance

//#region SearchAgentInstances
async function searchAgentInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchAgentInstances(
    {
      filter: { status: { $eq: 'IDLE' } },
      sort: [{ field: 'creationDate', order: 'DESC' }],
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const instance of result.items ?? []) {
    console.log(`${instance.agentInstanceKey}: ${instance.status}`);
  }
  console.log(`Total: ${result.page.totalItems}`);
}
//#endregion SearchAgentInstances

// Suppress "declared but never read"
void getAgentInstanceExample;
void searchAgentInstancesExample;
