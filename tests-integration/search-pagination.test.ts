// End-to-end proof of the search-pagination ergonomic (issue #3) against a live
// cluster: start several pages' worth of process instances and iterate over all
// of them through `camunda.searchProcessInstances.paginate(...)`.
//
// Isolation strategy: each run deploys a *uniquely-named* process definition
// (cloned from the shared `test-job-process.bpmn` fixture with a fresh process
// id) and filters by its `processDefinitionKey`. That key is unique to this run,
// so the search sees exactly the instances this test started — independent of
// anything else on the cluster. We deliberately do NOT isolate via a `variables`
// filter: the local Nano runtime silently ignores variable filters on
// `searchProcessInstances` (parity gap, Magikcraft/nano-bpm#954), so a variable
// filter would match every instance on the cluster.
//
// The `test-job` service task is never acknowledged here, so every started
// instance stays ACTIVE and remains searchable for the duration of the test.
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createCamundaClient, type ProcessDefinitionKey } from '../dist';

const camunda = createCamundaClient();

const COUNT = 12;
const PAGE_LIMIT = 5;
const EXPECTED_PAGES = Math.ceil(COUNT / PAGE_LIMIT); // 3 pages: 5 + 5 + 2

describe('search pagination ergonomic (issue #3)', () => {
  let processDefinitionKey: ProcessDefinitionKey;
  let createdKeys: string[] = [];

  beforeAll(async () => {
    // Clone the fixture with a unique process id so this run gets its own,
    // never-before-seen processDefinitionKey to isolate on.
    const uniqueProcessId = `paginate-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const template = await readFile('./tests-integration/fixtures/test-job-process.bpmn', 'utf8');
    const bpmn = template.replaceAll('Process_0f7cr6y', uniqueProcessId);

    const deployment = await camunda.createDeployment({
      resources: [new File([bpmn], `${uniqueProcessId}.bpmn`, { type: 'application/xml' })],
    });
    processDefinitionKey = deployment.processes[0].processDefinitionKey;

    const created = await Promise.all(
      Array.from({ length: COUNT }, () => camunda.createProcessInstance({ processDefinitionKey }))
    );
    createdKeys = created.map((p) => p.processInstanceKey);
    // Sanity: the cluster minted COUNT distinct instances.
    expect(new Set(createdKeys).size).toBe(COUNT);
  }, 60_000);

  afterAll(async () => {
    await Promise.all(
      createdKeys.map((processInstanceKey) =>
        camunda.cancelProcessInstance({ processInstanceKey }).catch(() => {})
      )
    );
  });

  /**
   * A fresh paginator over exactly this test's instances, paged small enough to
   * force multiple round-trips. The eventual-consistency window (first page
   * only) waits until every created instance is indexed, so the traversal sees
   * the whole set rather than a partially-consistent read.
   */
  const paginator = () =>
    camunda.searchProcessInstances.paginate(
      {
        filter: { processDefinitionKey },
        page: { limit: PAGE_LIMIT },
      },
      {
        consistency: {
          waitUpToMs: 30_000,
          predicate: (r) => r.page.totalItems >= COUNT,
        },
      }
    );

  it('streams every instance exactly once across pages via .items()', async () => {
    const seen: string[] = [];
    for await (const instance of paginator().items()) {
      seen.push(instance.processInstanceKey);
    }

    expect(seen.length).toBe(COUNT);
    expect(new Set(seen).size).toBe(COUNT);
    expect(new Set(seen)).toEqual(new Set(createdKeys));
  }, 60_000);

  it('traverses more than one page via .pages()', async () => {
    let pageCount = 0;
    let itemCount = 0;
    for await (const page of paginator().pages()) {
      pageCount += 1;
      itemCount += page.items.length;
      expect(page.items.length).toBeLessThanOrEqual(PAGE_LIMIT);
    }

    expect(itemCount).toBe(COUNT);
    expect(pageCount).toBe(EXPECTED_PAGES);
    expect(pageCount).toBeGreaterThan(1);
  }, 60_000);

  it('drains the whole result set via .toArray()', async () => {
    const all = await paginator().toArray();

    expect(all.length).toBe(COUNT);
    expect(new Set(all.map((pi) => pi.processInstanceKey))).toEqual(new Set(createdKeys));
  }, 60_000);
});
