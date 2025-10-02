import fs from 'fs';

import { describe, it, expect } from 'vitest';

import { createCamundaClient, createCamundaResultClient, ProcessDefinitionKey, Tag } from '../dist';
import { extractJobTypesFromBpmnFile } from '../test-support/bpmn';

describe('integration acceptance', () => {
  it('can get the Topology', async () => {
    const camunda = createCamundaClient();
    const topology = await camunda.getTopology();
    expect(topology.brokers).toBeDefined();
  });
  it('can get the License', async () => {
    const camunda = createCamundaClient();
    const license = await camunda.getLicense();
    expect(typeof license.isCommercial).toBe('boolean');
  });
  // This is only valid against a setup using OIDC. Otherwise, the response is undefined
  it.skip('can get the the current CamundaUser', async () => {
    const camunda = createCamundaClient();
    const res = await camunda.getAuthentication();
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

  // This won't throw if the broker is not using Basic Auth
  it.skip('throws on 401/403 (invalid auth) when throwOnError true', async () => {
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

  it('can activate jobs, and the job has a tag', { timeout: 20000 }, async () => {
    const camunda = createCamundaClient({});

    async function cancelActiveProcesses(processDefinitionKey: ProcessDefinitionKey) {
      // Cancel existing instances
      const existingProcesses = await camunda.searchProcessInstances(
        {
          filter: {
            processDefinitionKey,
            state: 'ACTIVE',
          },
        },
        { consistency: { waitUpToMs: 0 } }
      );
      for (const process of existingProcesses.items) {
        await camunda
          .cancelProcessInstance({
            processInstanceKey: process.processInstanceKey,
          })
          .catch((e) => {
            if (e.status !== 404) {
              throw e;
            }
          });
      }
    }

    const _tag = Tag.fromString('example');
    const filepath = './tests-integration/fixtures/test-process.bpmn';
    const res = await camunda.deployResourcesFromFiles([filepath]);

    const { processDefinitionKey } = res.processes[0];
    // Cancel existing instances
    await cancelActiveProcesses(processDefinitionKey);

    const jobTypes = extractJobTypesFromBpmnFile(filepath);
    const process = await camunda.createProcessInstance({
      processDefinitionKey,
      tags: [_tag],
    });
    const jobsResponse = await camunda.activateJobs({
      maxJobsToActivate: 1,
      type: jobTypes[0],
      timeout: 30000,
    });
    expect(jobsResponse.jobs.length).toBe(1);

    const job = jobsResponse.jobs[0];
    camunda.completeJob({ jobKey: job.jobKey });

    const tag = (job.tags ?? [])[0];
    expect(job.processInstanceKey).toBe(process.processInstanceKey);
    expect(tag).toBe(_tag);
  });
});
