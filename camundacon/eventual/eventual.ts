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

  log(`\nCreated process instance with key ${process.processInstanceKey}\n`);

  // Get the process instance by key

  const getProcess = await camunda.getProcessInstance(
    { processInstanceKey: process.processInstanceKey },
    { consistency: { waitUpToMs: 10_000, trace: true } }
  );

  log(JSON.stringify(getProcess, null, 2));
}

main();

function log(msg: string) {
  console.log(chalk.greenBright(msg));
}
