// Compilable usage examples for agent instance operations.
// These examples are type-checked during build to guard against API regressions.

import { type AgentInstanceKey, createCamundaClient } from '@camunda8/orchestration-cluster-api';

//#region GetAgentInstance
async function getAgentInstanceExample(agentInstanceKey: AgentInstanceKey) {
  const camunda = createCamundaClient();

  const result = await camunda.getAgentInstance(
    { agentInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Agent instance: ${result.agentInstanceKey}, status: ${result.status}`);
}
//#endregion GetAgentInstance

//#region SearchAgentInstances
async function searchAgentInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchAgentInstances(
    {
      sort: [{ field: 'creationDate', order: 'DESC' }],
      page: { limit: 20 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const instance of result.items) {
    console.log(`Agent instance: ${instance.agentInstanceKey}, status: ${instance.status}`);
  }
}
//#endregion SearchAgentInstances
