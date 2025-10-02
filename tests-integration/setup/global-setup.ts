import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { cancelActiveInstancesForDefinitions } from './cancelTasks';

import type { GlobalSetupContext } from 'vitest/node';

// Basic logger (avoid bringing full logger plumbing)
function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[integration-cleanup]', ...args);
}

// Extract BPMN process id using a lightweight regex (avoids XML parser dependency).
function extractProcessIds(xml: string): string[] {
  const ids: string[] = [];
  const re = /<bpmn:process[^>]*\bid="([^"]+)"[^>]*>/g;
  let m;
  while ((m = re.exec(xml))) ids.push(m[1]);
  return ids;
}
export async function setup({ provide }: GlobalSetupContext) {
  log('global setup started');
  const models = await new Promise<Array<string>>((resolve) => {
    const fixturesDir = join(process.cwd(), 'tests-integration', 'fixtures');
    const files = readdirSync(fixturesDir).filter((f) => f.endsWith('.bpmn'));
    const processIds = new Set<string>();
    for (const f of files) {
      try {
        const xml = readFileSync(join(fixturesDir, f), 'utf8');
        for (const id of extractProcessIds(xml)) processIds.add(id);
      } catch (e) {
        log('read fixture error', f, (e as any)?.message || e);
      }
    }
    if (!processIds.size) {
      log('no process definitions found in fixtures');
      resolve([]);
    } else {
      log('fixture process ids', Array.from(processIds));
      resolve(Array.from(processIds));
    }
  });
  cancelActiveInstancesForDefinitions(models);
  provide('models', models);
  log('global setup done');
}

declare module 'vitest' {
  export interface ProvidedContext {
    models: string[];
  }
}
