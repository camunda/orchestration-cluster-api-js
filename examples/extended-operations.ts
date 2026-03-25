// Compilable usage examples for extended process instance, process definition, and variable operations.
// These examples are type-checked during build to guard against API regressions.

import {
  createCamundaClient,
  ProcessInstanceKey,
  ProcessDefinitionKey,
  ProcessDefinitionId,
  VariableKey,
  ElementInstanceKey,
  ElementId,
} from '@camunda8/orchestration-cluster-api';

//#region DeleteProcessInstance
async function deleteProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.deleteProcessInstance({ processInstanceKey });
}
//#endregion DeleteProcessInstance

//#region MigrateProcessInstance
async function migrateProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.migrateProcessInstance({
    processInstanceKey,
    targetProcessDefinitionKey: ProcessDefinitionKey.assumeExists('2251799813685250'),
    mappingInstructions: [
      {
        sourceElementId: ElementId.assumeExists('task-a'),
        targetElementId: ElementId.assumeExists('task-b'),
      },
    ],
  });
}
//#endregion MigrateProcessInstance

//#region ModifyProcessInstance
async function modifyProcessInstanceExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  await camunda.modifyProcessInstance({
    processInstanceKey,
    activateInstructions: [{ elementId: ElementId.assumeExists('task-a') }],
    terminateInstructions: [
      { elementInstanceKey: ElementInstanceKey.assumeExists('2251799813685260') },
    ],
  });
}
//#endregion ModifyProcessInstance

//#region GetProcessInstanceStatistics
async function getProcessInstanceStatisticsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceStatistics(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Element ${stat.elementId}: active=${stat.active}`);
  }
}
//#endregion GetProcessInstanceStatistics

//#region GetProcessInstanceSequenceFlows
async function getProcessInstanceSequenceFlowsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceSequenceFlows(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const flow of result.items ?? []) {
    console.log(`Sequence flow: ${flow.sequenceFlowId}`);
  }
}
//#endregion GetProcessInstanceSequenceFlows

//#region GetProcessInstanceCallHierarchy
async function getProcessInstanceCallHierarchyExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessInstanceCallHierarchy(
    { processInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Call hierarchy entries: ${result.length}`);
}
//#endregion GetProcessInstanceCallHierarchy

//#region SearchProcessInstanceIncidents
async function searchProcessInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.searchProcessInstanceIncidents(
    {
      processInstanceKey,
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const incident of result.items ?? []) {
    console.log(`Incident: ${incident.errorType} - ${incident.errorMessage}`);
  }
}
//#endregion SearchProcessInstanceIncidents

//#region ResolveProcessInstanceIncidents
async function resolveProcessInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const processInstanceKey = ProcessInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.resolveProcessInstanceIncidents({ processInstanceKey });

  console.log(`Batch operation key: ${result.batchOperationKey}`);
}
//#endregion ResolveProcessInstanceIncidents

//#region GetProcessDefinition
async function getProcessDefinitionExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const definition = await camunda.getProcessDefinition(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Process: ${definition.processDefinitionId} v${definition.version}`);
}
//#endregion GetProcessDefinition

//#region GetProcessDefinitionXml
async function getProcessDefinitionXmlExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const xml = await camunda.getProcessDefinitionXml(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`XML length: ${JSON.stringify(xml).length}`);
}
//#endregion GetProcessDefinitionXml

//#region SearchProcessDefinitions
async function searchProcessDefinitionsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchProcessDefinitions(
    {
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const def of result.items ?? []) {
    console.log(`${def.processDefinitionKey}: ${def.processDefinitionId} v${def.version}`);
  }
}
//#endregion SearchProcessDefinitions

//#region GetProcessDefinitionStatistics
async function getProcessDefinitionStatisticsExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const result = await camunda.getProcessDefinitionStatistics(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(`Element ${stat.elementId}: active=${stat.active}`);
  }
}
//#endregion GetProcessDefinitionStatistics

//#region GetProcessDefinitionInstanceStatistics
async function getProcessDefinitionInstanceStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionInstanceStatistics(
    {},
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Definition ${stat.processDefinitionId}: ${stat.activeInstancesWithoutIncidentCount} active`
    );
  }
}
//#endregion GetProcessDefinitionInstanceStatistics

//#region GetProcessDefinitionInstanceVersionStatistics
async function getProcessDefinitionInstanceVersionStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionInstanceVersionStatistics(
    {
      filter: {
        processDefinitionId: ProcessDefinitionId.assumeExists('order-process'),
      },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Version ${stat.processDefinitionVersion}: ${stat.activeInstancesWithoutIncidentCount} active`
    );
  }
}
//#endregion GetProcessDefinitionInstanceVersionStatistics

//#region GetProcessDefinitionMessageSubscriptionStatistics
async function getProcessDefinitionMessageSubscriptionStatisticsExample() {
  const camunda = createCamundaClient();

  const result = await camunda.getProcessDefinitionMessageSubscriptionStatistics(
    {},
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const stat of result.items ?? []) {
    console.log(
      `Definition ${stat.processDefinitionId}: ${stat.activeSubscriptions} subscriptions`
    );
  }
}
//#endregion GetProcessDefinitionMessageSubscriptionStatistics

//#region GetStartProcessForm
async function getStartProcessFormExample() {
  const camunda = createCamundaClient();

  const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813685249');

  const form = await camunda.getStartProcessForm(
    { processDefinitionKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  if (form) {
    console.log(`Form key: ${form.formKey}`);
  }
}
//#endregion GetStartProcessForm

//#region GetVariable
async function getVariableExample() {
  const camunda = createCamundaClient();

  const variableKey = VariableKey.assumeExists('2251799813685249');

  const variable = await camunda.getVariable(
    { variableKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`${variable.name} = ${variable.value}`);
}
//#endregion GetVariable

//#region SearchVariables
async function searchVariablesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchVariables(
    {
      filter: {
        processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685249'),
      },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const variable of result.items ?? []) {
    console.log(`${variable.name} = ${variable.value}`);
  }
}
//#endregion SearchVariables

//#region GetElementInstance
async function getElementInstanceExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  const element = await camunda.getElementInstance(
    { elementInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  console.log(`Element: ${element.elementId} (${element.type})`);
}
//#endregion GetElementInstance

//#region SearchElementInstances
async function searchElementInstancesExample() {
  const camunda = createCamundaClient();

  const result = await camunda.searchElementInstances(
    {
      filter: {
        processInstanceKey: ProcessInstanceKey.assumeExists('2251799813685249'),
      },
      page: { limit: 10 },
    },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const element of result.items ?? []) {
    console.log(`${element.elementId}: ${element.type} (${element.state})`);
  }
}
//#endregion SearchElementInstances

//#region SearchElementInstanceIncidents
async function searchElementInstanceIncidentsExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  const result = await camunda.searchElementInstanceIncidents(
    { elementInstanceKey },
    { consistency: { waitUpToMs: 5000 } }
  );

  for (const incident of result.items ?? []) {
    console.log(`Incident: ${incident.errorType}`);
  }
}
//#endregion SearchElementInstanceIncidents

//#region CreateElementInstanceVariables
async function createElementInstanceVariablesExample() {
  const camunda = createCamundaClient();

  const elementInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  await camunda.createElementInstanceVariables({
    elementInstanceKey,
    variables: { orderId: 'ORD-12345', status: 'processing' },
  });
}
//#endregion CreateElementInstanceVariables

//#region ActivateAdHocSubProcessActivities
async function activateAdHocSubProcessActivitiesExample() {
  const camunda = createCamundaClient();

  const adHocSubProcessInstanceKey = ElementInstanceKey.assumeExists('2251799813685249');

  await camunda.activateAdHocSubProcessActivities({
    adHocSubProcessInstanceKey,
    elements: [{ elementId: ElementId.assumeExists('task-a') }],
  });
}
//#endregion ActivateAdHocSubProcessActivities
