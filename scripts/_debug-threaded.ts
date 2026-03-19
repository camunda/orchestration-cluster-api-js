import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createCamundaClient } from '../src/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let activateCallCount = 0;
let completeCount = 0;

const mockFetch = async function fakeFetch(input: any, init?: any) {
  const url = typeof input === 'string' ? input : input.url;
  if (url.includes('/v2/jobs/activation')) {
    activateCallCount++;
    if (activateCallCount === 1) {
      console.log('  mock: returning 1 job');
      return new Response(
        JSON.stringify({
          jobs: [
            {
              jobKey: 'test-job-1',
              type: 'test-task',
              processInstanceKey: 'pi-1',
              processDefinitionKey: 'pd-1',
              bpmnProcessId: 'test',
              processDefinitionVersion: 1,
              elementId: 'task-1',
              elementInstanceKey: 'ei-1',
              retries: 3,
              deadline: new Date(Date.now() + 30000).toISOString(),
              variables: {},
              customHeaders: {},
              worker: 'w',
              tenantId: '<default>',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify({ jobs: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (url.includes('/v2/jobs/test-job-1/completion')) {
    completeCount++;
    console.log('  mock: completeJob called! count =', completeCount);
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.log('  mock: UNHANDLED', url);
  return new Response(JSON.stringify({}), { status: 500 });
};

const client = createCamundaClient({
  config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080', CAMUNDA_SDK_LOG_LEVEL: 'debug' } as any,
  fetch: mockFetch as any,
});

const w = client.createThreadedJobWorker({
  jobType: 'test-task',
  handlerModule: path.join(__dirname, '../tests/fixtures/threaded-handler-complete.ts'),
  maxParallelJobs: 1,
  jobTimeoutMs: 30000,
  autoStart: true,
  threadPoolSize: 1,
});

setTimeout(function checkResult() {
  console.log('completeCount:', completeCount, 'activateCallCount:', activateCallCount);
  w.stop();
  process.exit(completeCount >= 1 ? 0 : 1);
}, 5000);
