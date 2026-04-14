import createCamundaClient, { type ProcessDefinitionId } from '@camunda8/orchestration-cluster-api';

// Zero-config: connects to localhost with no auth (Camunda 8 Run defaults)
const camunda = createCamundaClient();

// 1. Check the cluster is reachable
const topology = await camunda.getTopology();
console.log(`Connected to cluster (${topology.brokers?.length ?? 0} broker(s))\n`);

// 2. Deploy the process
const deployment = await camunda.deployResourcesFromFiles(['./order-process.bpmn']);
const process = deployment.processes?.[0];
console.log(`Deployed "${process?.processDefinitionId}" (key: ${process?.processDefinitionKey})\n`);

// 3. Start a process instance
const instance = await camunda.createProcessInstance({
  processDefinitionId: 'order-process' as ProcessDefinitionId,
  variables: {
    orderId: 'ORD-42',
    amount: 99.95,
    customer: 'Jane Doe',
  },
});
console.log(`Started process instance ${instance.processInstanceKey}\n`);

// 4. Create workers for each service task
const validateWorker = camunda.createJobWorker({
  jobType: 'validate-order',
  jobTimeoutMs: 30_000,
  jobHandler: async (job) => {
    const { orderId, amount } = job.variables as {
      orderId: string;
      amount: number;
    };
    console.log(`[validate-order] Validating ${orderId} ($${amount})`);
    return job.complete({ validated: true });
  },
});

const paymentWorker = camunda.createJobWorker({
  jobType: 'process-payment',
  jobTimeoutMs: 30_000,
  jobHandler: async (job) => {
    const { orderId } = job.variables as { orderId: string };
    const paymentId = `PAY-${Date.now()}`;
    console.log(`[process-payment] Processing payment for ${orderId} → ${paymentId}`);
    return job.complete({ paymentId, paid: true });
  },
});

// 5. Wait a few seconds for the workers to process the jobs, then shut down
console.log('\nWaiting for workers to process jobs...\n');
await new Promise((resolve) => setTimeout(resolve, 5000));

await validateWorker.stopGracefully({ waitUpToMs: 5000 });
await paymentWorker.stopGracefully({ waitUpToMs: 5000 });

console.log('\nDone!');
