import fs from 'fs';

import { describe, it, expect } from 'vitest';

import { createCamundaClient, createCamundaResultClient, Tag } from '../dist';
import { extractJobTypesFromBpmnFile } from '../test-support/bpmn';

describe('integration acceptance', () => {
  it('can get the Topology', async () => {
    const camunda = createCamundaClient();
    const topology = await camunda.getTopology();
    console.log(JSON.stringify(topology, null, 2));
  });
  it('can get the License', async () => {
    const camunda = createCamundaClient();
    const license = await camunda.getLicense();
    console.log(JSON.stringify(license, null, 2));
  });
  it('can get the the current CamundaUser', async () => {
    const camunda = createCamundaClient();
    const res = await camunda.getAuthentication();
    console.log(JSON.stringify(res, null, 2));
    expect(res).toBeDefined();
  });
  it('throws when using a Blob instead of File (invalid resources array)', async () => {
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const blob = new Blob([copied], { type: 'application/xml' });
    const camunda = createCamundaClient({ throwOnError: true });
    await expect(
      camunda.createDeployment({ resources: [blob as any] } as any)
    ).rejects.toBeDefined();
  });

  it('throws on 401/403 (invalid auth) when throwOnError true', async () => {
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const file = new File([copied], 'test-process.bpmn', { type: 'application/xml' });
    const camunda = createCamundaClient({
      throwOnError: true,
      // Force bad credentials to guarantee a non-2xx response
      config: {
        CAMUNDA_AUTH_STRATEGY: 'BASIC',
        CAMUNDA_BASIC_AUTH_USERNAME: '___invalid___',
        CAMUNDA_BASIC_AUTH_PASSWORD: '___invalid___',
      },
    } as any);
    await expect(camunda.createDeployment({ resources: [file] } as any)).rejects.toBeDefined();
  });

  it('returns Result (ok:false) with CamundaResultClient instead of throwing', async () => {
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const blob = new Blob([copied], { type: 'application/xml' });
    const client = createCamundaResultClient({});
    const res = await (client as any).createDeployment({ resources: [blob as any] });
    expect(res.ok).toBe(false);
    expect(res.error).toBeDefined();
  });

  it.only('can do all the things', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient({});
    const res = await camunda.deployResourcesFromFiles([
      './tests-integration/fixtures/test-process.bpmn',
    ]);

    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      // runtimeInstructions: [{type: 'TERMINATE_PROCESS_INSTANCE', afterElementId: ElementId.assumeExists('Activity_106kosb')}],
    });

    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const _blob = new Blob([copied], { type: 'application/xml' });

    console.log('ProcessInstance', JSON.stringify(process, null, 2));
    const search = await camunda.searchProcessInstances(
      {
        filter: {
          processInstanceKey: process.processInstanceKey,
        },
      },
      { consistency: { waitUpToMs: 15000, pollIntervalMs: 2000, trace: true } }
    );
    expect(search.items.length).toBe(1);
    await camunda.cancelProcessInstance({ processInstanceKey: process.processInstanceKey });
  });

  it('can do activate jobs', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient({});
    const _tag = Tag.fromString('example');
    const filepath = './tests-integration/fixtures/test-process.bpmn';
    const res = await camunda.deployResourcesFromFiles([filepath]);
    const jobTypes = extractJobTypesFromBpmnFile(filepath);
    const process = await camunda.createProcessInstance({
      processDefinitionKey: res.processes[0].processDefinitionKey,
      tags: [_tag],
    });
    console.log('ProcessInstance', JSON.stringify(process, null, 2));
    const jobsResponse = await camunda.activateJobs({
      maxJobsToActivate: 1,
      type: jobTypes[0],
      timeout: 30000,
    });
    console.log(JSON.stringify(jobsResponse, null, 2));
    expect(jobsResponse.jobs.length).toBe(1);

    const tag = jobsResponse.jobs[0].tags![0];

    console.log('Tag', tag);
    const processes = await camunda.searchProcessInstances(
      {
        filter: {
          processDefinitionKey: process.processDefinitionKey,
          state: 'ACTIVE',
        },
      },
      {
        consistency: {
          waitUpToMs: 20000,
          predicate: (res) =>
            res.items.some((item) => item.processInstanceKey === process.processInstanceKey),
          trace: true,
        },
      }
    );
    await Promise.all(
      processes.items.map((item) =>
        camunda.cancelProcessInstance({ processInstanceKey: item.processInstanceKey })
      )
    );
  });
});
