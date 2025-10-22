import readline from 'readline';

import { createCamundaClient, Tag } from '../../dist';

main();

async function main() {
  const camunda = createCamundaClient();

  const res = await camunda.deployResourcesFromFiles([
    './tests-integration/fixtures/test-process.bpmn',
  ]);
  const processDefinitionKey = res.processes[0].processDefinitionKey;

  const processInstance1 = await camunda.createProcessInstance({
    processDefinitionKey,
    tags: [Tag.fromString('some-tag')],
  });

  log(`Created first process instance: ${processInstance1.processInstanceKey}`);

  await waitForKeyPress();

  const processInstance2 = await camunda.createProcessInstance({
    processDefinitionKey,
    tags: [Tag.fromString('#some-other-tag')],
  });

  log(`Process instance 2 created: ${processInstance2.processInstanceKey}`);
}

async function waitForKeyPress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log(`Press a key to continue....`);
  process.stdin.setRawMode(true);
  await new Promise<void>((resolve) =>
    process.stdin.on('data', () => {
      rl.close();
      resolve();
    })
  );
}

const { log } = console;
