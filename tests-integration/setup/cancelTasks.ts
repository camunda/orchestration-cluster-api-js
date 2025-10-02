import { createCamundaClient } from '../../src';

function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[integration-cleanup]', ...args);
}

export async function cancelActiveInstancesForDefinitions(processIds: string[]) {
  const client = createCamundaClient();
  if (!processIds.length) return;
  for (const procId of processIds) {
    try {
      // Use search endpoint if available: searchProcessInstances or list variant.
      const res = await client
        .searchProcessInstances(
          {
            filter: { processDefinitionId: procId, state: 'ACTIVE' },
            page: { limit: 200 },
          },
          { consistency: { waitUpToMs: 0 } }
        )
        .catch((e: any) => {
          log('search error', procId, e?.message);
          return { items: [] };
        });
      const active = res.items;
      if (!active.length) {
        // log('no active instances', procId);
        continue;
      }
      for (const inst of active) {
        try {
          await client.cancelProcessInstance({ processInstanceKey: inst.processInstanceKey });
          log('cancelled processInstance', inst.processInstanceKey, 'for', procId);
        } catch (e: any) {
          if (!e?.message?.includes('NOT_FOUND')) {
            log('cancel failure', inst.processInstanceKey, e?.message || e);
            log(JSON.stringify(e, null, 2));
          }
        }
      }
    } catch (e: any) {
      log('definition cleanup error', procId, e?.message || e);
    }
  }
}
