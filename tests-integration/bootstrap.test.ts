import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  createCamundaClient,
  createCamundaResultClient,
  type ProcessDefinitionKey,
  Tag,
} from '../dist';
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
  it('accepts a Blob without a filename and falls back to resourceName "blob"', async () => {
    // Behavioural change in Camunda 8.x server (arrived alongside the 8.7 spec bump in PR #174):
    // multipart parts without a filename are no longer rejected; the server defaults
    // resourceName to "blob" and proceeds with the deployment. This is server behaviour, not
    // spec-defined — the spec only requires `resources` to be an array of binary parts.
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const blob = new Blob([copied], { type: 'application/xml' });
    const camunda = createCamundaClient({ throwOnError: true });
    const result = await camunda.createDeployment({ resources: [blob as any] } as any);
    expect(result.deploymentKey).toBeDefined();
    expect(result.deployments?.[0]?.resource?.resourceName).toBe('blob');
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

  it('returns Result (ok:true) with CamundaResultClient for a Blob deployment', async () => {
    // See note on the Blob-without-filename test above: the server now accepts this and
    // resolves to a successful deployment, so the Result wrapper reports ok:true.
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');
    const copied = Uint8Array.from(buffer);
    const blob = new Blob([copied], { type: 'application/xml' });
    const client = createCamundaResultClient({});
    const res = await (client as any).createDeployment({ resources: [blob as any] });
    expect(res.ok).toBe(true);
    expect(res.value?.deploymentKey).toBeDefined();
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
