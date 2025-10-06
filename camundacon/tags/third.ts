import readline from 'readline';

import { createCamundaClient as createCamundaClient, Tag } from '../../dist';

setup().then(main);

/**
 * Lift Tags into type system from configuration
 */
async function setup() {
  const tags: Record<string, string> = {
    tag1: 'some-tag',
    tag2: '#some-other-tag',
  };
  return Object.keys(tags).reduce(
    (prev, key) => ({ ...prev, [key]: Tag.fromString(tags[key]) }),
    {}
  ) as Tags;
}

async function main(tags: Tags) {
  const camunda = createCamundaClient();

  const res = await camunda.deployResourcesFromFiles([
    './tests-integration/fixtures/test-process.bpmn',
  ]);
  const processDefinitionKey = res.processes[0].processDefinitionKey;

  const processInstance1 = await camunda.createProcessInstance({
    processDefinitionKey,
    tags: [tags.tag1],
  });

  console.log(`Created first process instance: ${processInstance1.processInstanceKey}`);

  await waitForKeyPress();

  const processInstance2 = await camunda.createProcessInstance({
    processDefinitionKey,
    tags: [tags.tag2],
  });

  console.log(`Process instance 2 created: ${processInstance2.processInstanceKey}`);
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

interface Tags {
  tag1: Tag;
  tag2: Tag;
}
