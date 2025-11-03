// CamundaSupportLogger implementation (Node) + Noop fallback for browser builds.
// Mirrors logic from related SDK example while adapting to existing unified configuration & redaction.
// Tree-shakable: Node-only modules imported dynamically and guarded by process/version detection.

/* eslint-disable @typescript-eslint/no-var-requires */
import { packageVersion } from '../runtime/version';

import type { CamundaConfig } from './unifiedConfiguration';

export interface SupportLogger {
  log(message: string | number | boolean | object, addTimestamp?: boolean): void;
}

export class NoopSupportLogger implements SupportLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(_message: any, _addTimestamp = true): void {
    /* no-op */
  }
}

// Circular-safe JSON stringify borrowed pattern (simplified)
function safeStringifyReplacer(seen: WeakSet<object>) {
  return function (_: string, value: any) {
    if (value && typeof value?.toJSON === 'function') {
      try {
        value = value.toJSON();
      } catch {
        /* ignore */
      }
    }
    if (!(value !== null && typeof value === 'object')) return value;
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const out: any = Array.isArray(value) ? [] : {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = safeStringifyReplacer(seen)(k, v as any);
    }
    seen.delete(value);
    return out;
  };
}
function safeStringify(obj: any, indentation = 2) {
  try {
    return JSON.stringify(obj, safeStringifyReplacer(new WeakSet()), indentation);
  } catch (e) {
    return `"[StringifyFailed ${(e as any)?.message || 'error'}]"`;
  }
}

// Sensitive key elision – we rely on raw env config values.
const SENSITIVE_KEYS = [
  'CAMUNDA_BASIC_AUTH_PASSWORD',
  'CAMUNDA_CLIENT_SECRET',
  'CAMUNDA_MTLS_KEY_PASSPHRASE',
];
function obscureSensitiveInfo(raw: Record<string, string | undefined>) {
  const redacted: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v && SENSITIVE_KEYS.includes(k)) {
      const prefix = v.slice(0, 4);
      const omitted = Math.max(0, v.length - 4);
      redacted[k] = `${prefix}...[${omitted} chars omitted]`;
    } else redacted[k] = v;
  }
  return redacted;
}

export class CamundaSupportLogger implements SupportLogger {
  private enabled: boolean;
  private filepath: string;

  constructor(config: CamundaConfig) {
    const enabled = !!config.supportLog?.enabled;
    this.enabled = enabled;
    this.filepath =
      config.supportLog?.filePath ||
      (typeof process !== 'undefined'
        ? require('node:path').join(process.cwd(), 'camunda-support.log')
        : 'camunda-support.log');
    if (!this.enabled || !isNode()) return;
    const fs = require('node:fs') as typeof import('node:fs');
    // Ensure uniqueness
    if (fs.existsSync(this.filepath)) {
      let n = 1;
      const base = this.filepath;
      while (fs.existsSync(this.filepath)) {
        this.filepath = `${base}-${n++}`;
      }
    }
    // Preamble
    this.log('********************************************************', false);
    this.log(
      'Camunda Support Debugging log. Supply this to Camunda Technical Support to assist in troubleshooting issues',
      false
    );
    this.log('* https://camunda.com/services/camunda-success/', false);
    this.log('* https://github.com/camunda/orchestration-cluster-api-js/issues', false);
    this.log(
      '**WARNING**: This log may contain sensitive secrets. Review before sharing publicly.',
      false
    );
    this.log('********************************************************', false);
    this.log(`CamundaSupportLogger initialized. Logging to ${this.filepath}`);
    this.log(`Camunda SDK version: ${packageVersion}`, false);
    try {
      const os = require('node:os') as typeof import('node:os');
      const osInfo = {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
        version: os.version?.(),
        hostname: os.hostname(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus().length,
        uptime: os.uptime(),
      };
      this.log('/** OS Information */\n' + safeStringify(osInfo) + '\n', false);
    } catch {
      /* ignore */
    }
    // Redacted configuration (raw env plus secrets truncated)
    const raw = (config as any).__raw || {};
    const obscured = obscureSensitiveInfo(raw);
    this.log('/** Configuration */\n' + safeStringify(obscured) + '\n', false);
  }

  log(message: string | number | boolean | object, addTimestamp = true): void {
    if (!this.enabled || !isNode()) return;
    const fs = require('node:fs') as typeof import('node:fs');
    const msg = typeof message === 'object' ? safeStringify(message) : String(message);
    const line = addTimestamp ? `[${new Date().toISOString()}]: ${msg}\n` : `${msg}\n`;
    try {
      fs.appendFileSync(this.filepath, line);
    } catch (err) {
      // Last resort: console.error to surface inability to write
      // eslint-disable-next-line no-console
      console.error(`Failed to write support log to ${this.filepath}:`, err);
    }
  }
}

function isNode(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}

export function createSupportLogger(
  config: CamundaConfig,
  injected?: SupportLogger
): SupportLogger {
  if (injected) return injected;
  if (!isNode()) return new NoopSupportLogger();
  if (!config.supportLog?.enabled) return new NoopSupportLogger();
  return new CamundaSupportLogger(config);
}
