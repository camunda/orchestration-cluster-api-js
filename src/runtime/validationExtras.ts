import { ZodTypeAny, ZodObject } from 'zod';

import { CamundaValidationError } from './errors';

import type { Logger } from './logger';

export type ExtrasPolicy = 'ignore' | 'warn' | 'error';

interface DetectOptions {
  operationId: string;
  value: any;
  schema?: ZodTypeAny;
  settings: { policy: ExtrasPolicy; deep: boolean; captureDir?: string };
  logger?: Logger;
  fanatical: boolean; // original mode was fanatical
}

const seenCaptures = new Set<string>();

function hash(str: string) {
  let h = 0,
    i = 0;
  const len = str.length;
  while (i < len) h = (Math.imul(31, h) + str.charCodeAt(i++)) | 0;
  return (h >>> 0).toString(16);
}

export function detectExtrasAndMaybeThrow(opts: DetectOptions) {
  const { value, schema, settings, fanatical, operationId, logger } = opts;
  if (!value || typeof value !== 'object') return; // only objects
  if (!schema || !(schema instanceof ZodObject)) return; // root must be object for meaningful diff
  const extras: Record<string, string[]> = {};

  const visit = (val: any, sch: ZodTypeAny | undefined, path: string) => {
    if (!val || typeof val !== 'object') return;
    if (sch instanceof ZodObject) {
      const shape = (sch as ZodObject<any>).shape;
      const expected = new Set(Object.keys(shape));
      const keys = Object.keys(val);
      const unknown = keys.filter((k) => !expected.has(k));
      if (unknown.length) {
        extras[path || '/'] = unknown;
      }
      if (settings.deep) {
        for (const k of keys) {
          if (expected.has(k)) {
            visit(val[k], shape[k], path ? `${path}.${k}` : k);
          }
        }
      }
    }
  };

  visit(value, schema, '');

  const entries = Object.entries(extras);
  if (!entries.length) return;

  const flatIssues: string[] = [];
  for (const [p, keys] of entries) {
    flatIssues.push(`${p || '/'}: ${keys.join(', ')}`);
  }
  const summary = `Unknown properties in response: ${flatIssues.join('; ')}`;

  if (settings.policy === 'warn' || (fanatical && settings.policy !== 'error')) {
    logger?.warn('validation.extra', summary);
  }

  // Capture sample (root only) if capture dir configured (always for fanatical by design)
  if (settings.captureDir) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pathMod = require('path');
      if (!fs.existsSync(settings.captureDir))
        fs.mkdirSync(settings.captureDir, { recursive: true, mode: 0o700 });
      const sig = operationId + '|' + flatIssues.sort().join('|');
      const h = hash(sig);
      if (!seenCaptures.has(h)) {
        seenCaptures.add(h);
        const file = pathMod.join(settings.captureDir, `${operationId}-${Date.now()}-${h}.json`);
        const payload = {
          operationId,
          extras: extras,
          timestamp: new Date().toISOString(),
          sample: value,
        };
        fs.writeFileSync(file, JSON.stringify(payload, null, 2), { mode: 0o600 });
        logger?.debug?.('validation.capture', file);
      }
    } catch {
      /* ignore capture errors */
    }
  }

  if (fanatical || settings.policy === 'error') {
    throw new CamundaValidationError({
      side: 'response',
      operationId,
      message: summary,
      summary,
      issues: flatIssues,
    });
  }
}
