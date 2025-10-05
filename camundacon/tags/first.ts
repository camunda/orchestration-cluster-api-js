import readline from 'readline';

import { createCamundaClient } from '../../src';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const camunda = createCamundaClient();

  const res = await camunda.deployResourcesFromFiles([
    './tests-integration/fixtures/test-process.bpmn',
  ]);
  const processDefinitionKey = res.processes[0].processDefinitionId as any;

  const processInstance1 = await camunda.createProcessInstance({
    processDefinitionKey,
    // tags: ['some-tag' as any]
  });

  // console.log(processInstance1, typeof processInstance1)

  console.log(`Created first process instance: ${processInstance1.processInstanceKey}`);

  console.log(`Press a key to continue....`);
  // Wait for a keypress and ignore it
  process.stdin.setRawMode(true);
  await new Promise<void>((resolve) =>
    process.stdin.on('data', () => {
      rl.close();
      resolve();
    })
  );
  // Resume reading from stdin after waiting for a keypress

  const processInstance2 = await camunda.createProcessInstance({
    processDefinitionKey,
    tags: ['#some-other-tag' as any],
  });

  console.log(`Process instance 2 created: ${processInstance2.processInstanceKey}`);
}

main();
