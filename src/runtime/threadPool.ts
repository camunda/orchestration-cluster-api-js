/**
 * Shared thread pool for ThreadedJobWorkers.
 *
 * Owned by CamundaClient and shared across all threaded workers in the process.
 * Each thread is generic — the handler module path is sent with each job message,
 * and threads cache loaded handlers by module path.
 *
 * All node: imports are dynamic to keep the module tree browser-safe.
 */
import { installClientCallHandler } from './clientProxy';

import type { CamundaClient } from '../gen/CamundaClient';

export interface PoolWorker {
  worker: import('node:worker_threads').Worker;
  busy: boolean;
  ready: boolean;
}

export interface PendingJob {
  resolve: (ok: boolean) => void;
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
      onComplete: () => void;
      onError: (err: Error) => void;
    }
  ): Promise<void> {
    const { randomUUID, MessageChannel } = this._node;
    const taskId = randomUUID();
    pw.busy = true;

    const { port1: mainPort, port2: workerPort } = new MessageChannel();
    installClientCallHandler(mainPort, this._client);

    this._pending.set(taskId, {
      resolve: () => {
        this._pending.delete(taskId);
        mainPort.close();
        callbacks.onComplete();
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

  /** Terminate all threads. */
  terminate(): void {
    this._terminated = true;
    for (const pw of this._pool) {
      pw.worker.terminate().catch(() => {});
    }
    this._pool = [];
  }

  private async _init(requestedSize?: number): Promise<void> {
    const [workerThreads, pathMod, crypto] = await Promise.all([
      import('node:worker_threads'),
      import('node:path'),
      import('node:crypto'),
    ]);
    const { Worker } = workerThreads;
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
    const jsPath = join(__dirname, 'threadWorkerEntry.js');
    const tsPath = join(__dirname, 'threadWorkerEntry.ts');
    const entryPath = fs.existsSync(jsPath) ? jsPath : tsPath;

    const execArgv = entryPath.endsWith('.ts')
      ? ['--experimental-strip-types', '--experimental-transform-types']
      : [];

    for (let i = 0; i < size; i++) {
      const worker = new Worker(entryPath, { execArgv });

      const pw: PoolWorker = { worker, busy: false, ready: false };

      worker.on('message', (msg: any) => {
        if (msg.type === 'ready') {
          pw.ready = true;
          this._log.debug(() => ['thread.ready', { index: i }]);
          return;
        }
        if (msg.type === 'job-result') {
          this._log.debug(() => [
            'thread.job-result',
            { taskId: msg.taskId, ok: msg.ok, error: msg.error },
          ]);
          pw.busy = false;
          const pending = this._pending.get(msg.taskId);
          if (pending) {
            if (msg.ok) {
              pending.resolve(true);
            } else {
              pending.reject(new Error(msg.error || 'Handler failed'));
            }
          }
          return;
        }
      });

      worker.on('error', (err) => {
        this._log.error('thread.error', err);
        pw.busy = false;
        pw.ready = false;
      });

      worker.on('exit', (code) => {
        if (!this._terminated) {
          this._log.warn('thread.exit', { code });
        }
      });

      this._pool.push(pw);
    }

    this._log.info(() => ['thread-pool.init', { size, entryPath }]);
  }
}
