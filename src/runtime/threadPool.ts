/**
 * Shared thread pool for ThreadedJobWorkers.
 *
 * Owned by CamundaClient and shared across all threaded workers in the process.
 * Each thread is generic — the handler module path is sent with each job message,
 * and threads cache loaded handlers by module path.
 *
 * All node: imports are dynamic to keep the module tree browser-safe.
 */

import type { CamundaClient } from '../gen/CamundaClient';
import { installClientCallHandler } from './clientProxy';

export interface PoolWorker {
  worker: import('node:worker_threads').Worker;
  busy: boolean;
  ready: boolean;
  /** The taskId currently being processed by this worker (if busy). */
  currentTaskId?: string;
}

export interface PendingJob {
  resolve: (ok: boolean, completionAction?: { method: string; args: unknown[] }) => void;
  reject: (err: Error) => void;
}

/** Lazily resolved Node.js modules (avoids top-level node: imports for browser bundlers). */
interface NodeModules {
  MessageChannel: typeof import('node:worker_threads').MessageChannel;
  randomUUID: typeof import('node:crypto').randomUUID;
}

export class ThreadPool {
  private _pool: PoolWorker[] = [];
  private _pending: Map<string, PendingJob> = new Map();
  private _node!: NodeModules;
  private _log: ReturnType<CamundaClient['logger']>;
  private _client: CamundaClient;
  private _ready: Promise<void>;
  private _terminated = false;
  private _entryPath = '';
  private _execArgv: string[] = [];
  private _Worker!: typeof import('node:worker_threads').Worker;
  private _onThreadReady?: () => void;

  constructor(client: CamundaClient, size?: number) {
    this._client = client;
    this._log = client.logger().scope('thread-pool');
    this._ready = this._init(size);
  }

  /** Resolves when all threads have been spawned and signalled ready. */
  get ready(): Promise<void> {
    return this._ready;
  }

  /** Total number of threads in the pool. */
  get size(): number {
    return this._pool.length;
  }

  /** Number of threads currently processing a job. */
  get busyCount(): number {
    return this._pool.filter((pw) => pw.busy).length;
  }

  /** Number of threads that are ready and idle. */
  get idleCount(): number {
    return this._pool.filter((pw) => pw.ready && !pw.busy).length;
  }

  /** Register a callback invoked whenever a thread becomes ready or idle. */
  set onThreadReady(cb: (() => void) | undefined) {
    this._onThreadReady = cb;
  }

  /** Find the first ready & idle thread. */
  getIdleWorker(): PoolWorker | undefined {
    return this._pool.find((pw) => pw.ready && !pw.busy);
  }

  /**
   * Dispatch a serialized job to a specific idle worker.
   * The caller is responsible for checking idleness first.
   */
  async dispatch(
    pw: PoolWorker,
    jobData: Record<string, unknown>,
    handlerModule: string,
    callbacks: {
      onComplete: (completionAction?: { method: string; args: unknown[] }) => void;
      onError: (err: Error) => void;
    }
  ): Promise<void> {
    const { randomUUID, MessageChannel } = this._node;
    const taskId = randomUUID();
    pw.busy = true;
    pw.currentTaskId = taskId;

    this._log.trace(() => ['pool.dispatch', { taskId, jobKey: jobData.jobKey, handlerModule }]);

    const { port1: mainPort, port2: workerPort } = new MessageChannel();
    installClientCallHandler(mainPort, this._client);

    this._pending.set(taskId, {
      resolve: (_ok: boolean, completionAction?: { method: string; args: unknown[] }) => {
        this._log.trace(() => [
          'pool.resolve',
          { taskId, hasAction: !!completionAction, method: completionAction?.method },
        ]);
        this._pending.delete(taskId);
        mainPort.close();
        callbacks.onComplete(completionAction);
      },
      reject: (err: Error) => {
        this._pending.delete(taskId);
        mainPort.close();
        callbacks.onError(err);
      },
    });

    pw.worker.postMessage({ type: 'job', taskId, jobData, handlerModule, clientPort: workerPort }, [
      workerPort,
    ]);
  }

  /** Terminate all threads and reject any in-flight tasks. */
  terminate(): void {
    this._terminated = true;
    for (const pw of this._pool) {
      pw.worker.terminate().catch(() => {});
    }
    this._pool = [];
    // Reject all pending tasks so callers don't hang.
    for (const [, pending] of this._pending) {
      pending.reject(new Error('Thread pool terminated'));
    }
    this._pending.clear();
  }

  /** Reject the pending task for a worker that errored/exited and reset its state. */
  private _rejectWorkerTask(pw: PoolWorker, message: string): void {
    pw.busy = false;
    if (pw.currentTaskId) {
      const pending = this._pending.get(pw.currentTaskId);
      if (pending) {
        this._pending.delete(pw.currentTaskId);
        pending.reject(new Error(message));
      }
      pw.currentTaskId = undefined;
    }
  }

  /** Replace a dead worker in the pool with a freshly spawned one. */
  private _respawn(deadPw: PoolWorker): void {
    const idx = this._pool.indexOf(deadPw);
    if (idx === -1) return;
    const newPw = this._spawnWorker();
    this._pool[idx] = newPw;
    this._log.info(() => ['thread.respawn', { index: idx }]);
  }

  /** Create a single worker thread and wire up its event handlers. */
  private _spawnWorker(): PoolWorker {
    const worker = new this._Worker(this._entryPath, { execArgv: this._execArgv });
    const pw: PoolWorker = { worker, busy: false, ready: false };

    worker.on('message', (msg: any) => {
      if (msg.type === 'ready') {
        pw.ready = true;
        this._log.debug(() => ['thread.ready']);
        this._onThreadReady?.();
        return;
      }
      if (msg.type === 'job-result') {
        this._log.debug(() => [
          'thread.job-result',
          { taskId: msg.taskId, ok: msg.ok, error: msg.error },
        ]);
        this._log.trace(() => [
          'thread.job-result.detail',
          {
            taskId: msg.taskId,
            hasCompletionAction: !!msg.completionAction,
            method: msg.completionAction?.method,
            pending: this._pending.has(msg.taskId),
          },
        ]);
        pw.busy = false;
        pw.currentTaskId = undefined;
        const pending = this._pending.get(msg.taskId);
        if (pending) {
          if (msg.ok) {
            pending.resolve(true, msg.completionAction);
          } else {
            pending.reject(new Error(msg.error || 'Handler failed'));
          }
        } else {
          this._log.warn('thread.job-result.noPending', { taskId: msg.taskId });
        }
        return;
      }
    });

    worker.on('error', (err) => {
      this._log.error('thread.error', err);
      this._rejectWorkerTask(pw, `Worker thread error: ${err.message}`);
      pw.ready = false;
      // Note: 'exit' fires after 'error', so respawn is handled there.
    });

    worker.on('exit', (code) => {
      if (!this._terminated) {
        this._log.warn('thread.exit', { code });
        this._rejectWorkerTask(pw, `Worker thread exited unexpectedly (code ${code})`);
        this._respawn(pw);
      }
    });

    return pw;
  }

  private async _init(requestedSize?: number): Promise<void> {
    const [workerThreads, pathMod, crypto] = await Promise.all([
      import('node:worker_threads'),
      import('node:path'),
      import('node:crypto'),
    ]);
    this._Worker = workerThreads.Worker;
    const { join } = pathMod;

    this._node = {
      MessageChannel: workerThreads.MessageChannel,
      randomUUID: crypto.randomUUID,
    };

    const cpus = await (async () => {
      try {
        const os = await import('node:os');
        return os.availableParallelism?.() || os.cpus().length;
      } catch {
        return 4;
      }
    })();
    const size = requestedSize ?? cpus;

    const fs = await import('node:fs');
    const url = await import('node:url');
    // __dirname works in CJS and vitest/tsx, but not in native ESM dist output.
    // Derive directory from import.meta.url when available, falling back to __dirname.
    const dir =
      typeof __dirname !== 'undefined'
        ? __dirname
        : pathMod.dirname(url.fileURLToPath(import.meta.url));
    const jsPath = join(dir, 'threadWorkerEntry.js');
    const tsPath = join(dir, 'threadWorkerEntry.ts');
    const entryPath = fs.existsSync(jsPath) ? jsPath : tsPath;

    // Enable TypeScript handler loading in worker threads.
    // Node 22-23: these flags are needed for .ts imports via --experimental-strip-types.
    // Node 24+: TypeScript stripping is unflagged, but the flags are still accepted (harmless).
    // Node < 22: flags don't exist and must not be passed; .ts handlers won't work (users must compile to .js).
    const nodeMajor = parseInt(process.versions.node, 10);
    this._execArgv =
      nodeMajor >= 22
        ? [
            '--experimental-strip-types',
            '--experimental-transform-types',
            '--disable-warning=ExperimentalWarning',
          ]
        : [];
    this._entryPath = entryPath;

    for (let i = 0; i < size; i++) {
      this._pool.push(this._spawnWorker());
    }

    this._log.info(() => ['thread-pool.init', { size, entryPath }]);
  }
}
