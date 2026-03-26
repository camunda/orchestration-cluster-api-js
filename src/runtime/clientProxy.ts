/**
 * Client proxy for worker_threads: allows threaded job handlers to call
 * CamundaClient methods transparently via MessagePort.
 *
 * Main thread side: installClientCallHandler(port, client)
 * Worker thread side: createClientProxy(port) → CamundaClient-shaped proxy
 */

import type { MessagePort } from 'node:worker_threads';
import type { CamundaClient } from '../gen/CamundaClient';

// Wire protocol
export interface ClientCallMessage {
  type: 'client-call';
  callId: string;
  method: string;
  args: unknown[];
}

export interface ClientCallResult {
  type: 'client-call-result';
  callId: string;
  result?: unknown;
  error?: string;
}

/** Fallback UUID generator for runtimes where globalThis.crypto.randomUUID is unavailable. */
let _counter = 0;
function fallbackUUID(): string {
  return `${Date.now().toString(36)}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Create a Proxy that looks like CamundaClient but forwards every method call
 * over a MessagePort to the main thread. Runs inside a worker thread.
 */
export function createClientProxy(port: MessagePort): CamundaClient {
  return new Proxy({} as CamundaClient, {
    get(_, method: string) {
      // Ignore symbol properties and common non-method accesses
      if (typeof method === 'symbol') return undefined;
      if (method === 'then') return undefined; // Prevent Proxy from being treated as thenable
      if (method === 'toJSON') return undefined;

      return (...args: unknown[]) => {
        const callId = globalThis.crypto?.randomUUID
          ? globalThis.crypto.randomUUID()
          : fallbackUUID();
        const msg: ClientCallMessage = { type: 'client-call', callId, method, args };
        port.postMessage(msg);
        return new Promise<unknown>((resolve, reject) => {
          const handler = (reply: ClientCallResult) => {
            if (reply.type !== 'client-call-result' || reply.callId !== callId) return;
            port.off('message', handler);
            if (reply.error !== undefined) {
              reject(new Error(reply.error));
            } else {
              resolve(reply.result);
            }
          };
          port.on('message', handler);
        });
      };
    },
  });
}

/**
 * Install a message handler on a MessagePort (main thread side) that
 * receives client-call messages from a worker thread and executes them
 * on the real CamundaClient instance.
 */
export function installClientCallHandler(port: MessagePort, client: CamundaClient): void {
  port.on('message', async (msg: ClientCallMessage) => {
    if (msg.type !== 'client-call') return;
    try {
      const fn = (client as any)[msg.method];
      if (typeof fn !== 'function') {
        throw new Error(`CamundaClient has no method '${msg.method}'`);
      }
      const result = await fn.apply(client, msg.args);
      const reply: ClientCallResult = { type: 'client-call-result', callId: msg.callId, result };
      port.postMessage(reply);
    } catch (err: any) {
      const reply: ClientCallResult = {
        type: 'client-call-result',
        callId: msg.callId,
        error: err?.message || String(err),
      };
      port.postMessage(reply);
    }
  });
}
