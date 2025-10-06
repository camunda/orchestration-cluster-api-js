import chalk from 'chalk';

import { createCamundaClient } from '../../src';

async function main() {
  const camunda = createCamundaClient();

  // Deploy a model

  const res = await camunda.deployResourcesFromFiles([
    './tests-integration/fixtures/test-process.bpmn',
  ]);
  const { processDefinitionKey } = res.processes[0];

  // Create a process instance

  const process = await camunda.createProcessInstance({
    processDefinitionKey,
  });

  console.log(
    chalk.greenBright(
      `\nCreated process instance with key ${process.processInstanceKey} for definition ${processDefinitionKey}\n`
    )
  );

  // Get the process instance by key

  const getProcess = await camunda.getProcessInstance(
    { processInstanceKey: process.processInstanceKey },
    { consistency: { waitUpToMs: 0, trace: true } }
  );

  console.log(JSON.stringify(getProcess, null, 2));
}

main();
