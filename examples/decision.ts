// Compilable usage examples for decision operations.
// These examples are type-checked during build to guard against API regressions.

import {
  createCamundaClient,
  DecisionDefinitionKey,
  DecisionDefinitionId,
} from '@camunda8/orchestration-cluster-api';

//#region EvaluateDecisionById
async function evaluateDecisionByIdExample() {
  const camunda = createCamundaClient();

  const result = await camunda.evaluateDecision({
    decisionDefinitionId: DecisionDefinitionId.assumeExists('invoice-classification'),
    variables: {
      amount: 1000,
      invoiceCategory: 'Misc',
    },
  });

  console.log(`Decision: ${result.decisionDefinitionId}`);
  console.log(`Output: ${result.output}`);
}
//#endregion EvaluateDecisionById

//#region EvaluateDecisionByKey
async function evaluateDecisionByKeyExample() {
  const camunda = createCamundaClient();

  const decisionDefinitionKey = DecisionDefinitionKey.assumeExists('2251799813685249');

  const result = await camunda.evaluateDecision({
    decisionDefinitionKey,
    variables: {
      amount: 1000,
      invoiceCategory: 'Misc',
    },
  });

  console.log(`Decision output: ${result.output}`);
}
//#endregion EvaluateDecisionByKey

//#region GetDecisionDefinition
async function getDecisionDefinitionExample() {
  const camunda = createCamundaClient();

  const decisionDefinitionKey = DecisionDefinitionKey.assumeExists('2251799813685249');

  const definition = await camunda.getDecisionDefinition(
    { decisionDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Decision: ${definition.decisionDefinitionId}`);
  console.log(`Version: ${definition.version}`);
}
//#endregion GetDecisionDefinition

//#region SearchDecisionDefinitions
async function searchDecisionDefinitionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchDecisionDefinitions(
    {
      filter: { decisionDefinitionId: DecisionDefinitionId.assumeExists('invoice-classification') },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const definition of result.items ?? []) {
    console.log(`${definition.decisionDefinitionId} v${definition.version}`);
  }
}
//#endregion SearchDecisionDefinitions

// Suppress "declared but never read"
void evaluateDecisionByIdExample;
void evaluateDecisionByKeyExample;
void getDecisionDefinitionExample;
void searchDecisionDefinitionsExample;
